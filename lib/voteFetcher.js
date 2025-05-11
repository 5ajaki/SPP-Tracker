import axios from "axios";
import { parse } from "csv-parse/sync";
import supabase from "./supabaseClient";
import supabaseAdmin from "./supabaseAdmin";
import { getBaseUrl } from "./utils";
import { resolveENSName, batchResolveENS } from "./ensUtils";

// Debug whether the service role key is available
console.log(
  "SUPABASE_SERVICE_ROLE_KEY available:",
  process.env.SUPABASE_SERVICE_ROLE_KEY ? "YES" : "NO"
);
console.log("supabaseAdmin available:", supabaseAdmin ? "YES" : "NO");

// Get the appropriate client for database operations (admin for writes, regular for reads)
const getDbClient = () => {
  // More debugging
  const client = supabaseAdmin || supabase;
  console.log("Using client:", client === supabaseAdmin ? "ADMIN" : "REGULAR");
  return client;
};

// URL to fetch votes from
const VOTES_URL = `https://agora.ensdao.org/api/proposals/${
  process.env.PROPOSAL_ID ||
  "0x98c65ac02f738ddb430fcd723ea5852a45168550b3daf20f75d5d508ecf28aa1"
}/votes-csv`;

/**
 * Parse CSV data into structured vote objects
 */
export const parseVotesCSV = (csvData) => {
  const records = parse(csvData, {
    columns: true,
    skip_empty_lines: true,
  });

  return records.map((record) => ({
    voter_address: record["Voter Address"]?.toLowerCase() || "",
    voting_power: parseFloat(record["Voting Power"] || 0),
    choice_ranking: record["Choice Ranking"] || "",
  }));
};

/**
 * Fetch latest votes from the API
 */
export const fetchLatestVotes = async () => {
  try {
    const response = await axios.get(VOTES_URL);
    return parseVotesCSV(response.data);
  } catch (error) {
    console.error("Error fetching votes:", error);
    return [];
  }
};

/**
 * Get all vote events from the database
 */
export const getVoteEvents = async (limit = 100, offset = 0) => {
  const { data, error } = await supabase
    .from("voter_events")
    .select("*")
    .order("discovered_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error("Error fetching vote events:", error);
    return [];
  }

  return data;
};

/**
 * Get the latest vote for each voter
 */
export const getLatestVoterStates = async () => {
  // This subquery gets the latest event ID for each voter address
  const { data, error } = await supabase.rpc("get_latest_voter_events");

  if (error) {
    console.error("Error fetching latest voter states:", error);
    return [];
  }

  return data || [];
};

/**
 * Helper function to normalize choice rankings for comparison
 * Only includes choices up to "NONE BELOW"
 */
const normalizeRanking = (ranking) => {
  if (!ranking) return [];

  let choices = [];

  if (Array.isArray(ranking)) {
    choices = ranking;
  } else if (typeof ranking === "string") {
    choices = ranking.split(",").map((item) => item.trim());
  } else {
    return [];
  }

  // Find the index of "NONE BELOW" and only keep choices above it
  const noneIndex = choices.findIndex((choice) => choice === "NONE BELOW");
  if (noneIndex !== -1) {
    choices = choices.slice(0, noneIndex);
  }

  return choices;
};

/**
 * Compare new votes with existing ones to detect changes
 * Returns an array of events to add
 */
export const detectVoteChanges = async (newVotes) => {
  const events = [];

  // Get the latest state for each voter
  const latestVoterStates = await getLatestVoterStates();

  // Create a map for faster lookups
  const voterMap = new Map();
  latestVoterStates.forEach((voter) => {
    voterMap.set(voter.voter_address, voter);
  });

  // Format the current timestamp properly for Supabase
  const currentTimestamp = new Date().toISOString();

  // Process new votes from the CSV
  for (const newVote of newVotes) {
    const existingVote = voterMap.get(newVote.voter_address);

    // Normalize the new vote choices (only up to NONE BELOW)
    const normalizedNewChoices = normalizeRanking(newVote.choice_ranking);

    if (!existingVote) {
      // This is a new voter - try to resolve ENS name directly
      let ensName = null;
      try {
        ensName = await resolveENSName(newVote.voter_address);
        console.log(
          `Resolved ENS name for ${newVote.voter_address}: ${
            ensName || "Not found"
          }`
        );
      } catch (error) {
        console.error(
          `Error resolving ENS for new voter ${newVote.voter_address}:`,
          error
        );
      }

      // This is a new voter
      events.push({
        voter_address: newVote.voter_address,
        voting_power: newVote.voting_power,
        choice_ranking: newVote.choice_ranking, // Store full ranking
        event_type: "new",
        previous_ranking: null,
        ens_name: ensName,
        discovered_at: currentTimestamp,
        is_seed: false,
      });
    } else {
      // Normalize the existing vote choices (only up to NONE BELOW)
      const normalizedExistingChoices = normalizeRanking(
        existingVote.choice_ranking
      );

      // Compare normalized choices
      let isDifferent =
        normalizedNewChoices.length !== normalizedExistingChoices.length;

      if (!isDifferent) {
        // Compare each choice in order
        for (let i = 0; i < normalizedNewChoices.length; i++) {
          if (normalizedNewChoices[i] !== normalizedExistingChoices[i]) {
            isDifferent = true;
            break;
          }
        }
      }

      if (isDifferent) {
        // This voter changed their vote - preserve existing ENS name if available
        events.push({
          voter_address: newVote.voter_address,
          voting_power: newVote.voting_power,
          choice_ranking: newVote.choice_ranking, // Store full ranking
          event_type: "change",
          previous_ranking: existingVote.choice_ranking, // Store full previous ranking
          ens_name: existingVote.ens_name, // Preserve existing ENS name
          discovered_at: currentTimestamp,
          is_seed: false,
        });
      }
    }
  }

  return events;
};

/**
 * Add vote events to the database
 */
export const addVoteEvents = async (events) => {
  if (events.length === 0) return { count: 0 };

  // Use admin client for write operations
  const dbClient = getDbClient();
  const { data, error } = await dbClient.from("voter_events").insert(events);

  if (error) {
    console.error("Error adding vote events:", error);
    return { count: 0, error };
  }

  return { count: events.length };
};

/**
 * Poll for new votes and update the database
 */
export const pollForNewVotes = async () => {
  try {
    // Fetch latest votes from API
    const newVotes = await fetchLatestVotes();
    if (!newVotes || newVotes.length === 0) {
      console.log("No votes received from API");
      return { success: false, message: "No votes received from API" };
    }

    // Detect changes
    const events = await detectVoteChanges(newVotes);

    // Add vote events
    if (events.length > 0) {
      const result = await addVoteEvents(events);

      // Invalidate cache when new votes are detected
      try {
        // Use admin client for cache operations
        const dbClient = getDbClient();

        // Clear all cache entries related to vote events
        const { error: clearError } = await dbClient
          .from("cached_votes")
          .delete()
          .neq("cache_key", "dummy"); // This will delete all entries

        if (clearError) {
          console.error("Error clearing cache after new votes:", clearError);
        } else {
          console.log(
            `Cleared cache after detecting ${events.length} new vote events`
          );
        }
      } catch (cacheError) {
        console.error("Error invalidating cache:", cacheError);
      }

      return {
        success: true,
        newEvents: events.length,
        newVotes: events.filter((e) => e.event_type === "new").length,
        changedVotes: events.filter((e) => e.event_type === "change").length,
      };
    } else {
      return { success: true, newEvents: 0 };
    }
  } catch (error) {
    console.error("Error polling for new votes:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Import seed data from CSV with a specific timestamp
 */
export const importSeedData = async (csvData) => {
  try {
    const votes = parseVotesCSV(csvData);
    const events = [];

    // Use May 10, 2025 at 2:00 PM Eastern Time
    // Note: For Postgres, we need to use ISO format with timezone offset
    const seedTimestamp = new Date("2025-05-10T14:00:00-04:00").toISOString();
    console.log("Seed timestamp:", seedTimestamp);

    // First, resolve ENS names for all addresses in batch to avoid multiple API calls
    // We'll use a local cache to avoid resolving the same address multiple times
    const ensCache = new Map();
    const addresses = votes.map((vote) => vote.voter_address);

    console.log(
      `Batch resolving ENS names for ${addresses.length} addresses in seed data...`
    );

    // Use our new batch resolve function
    const ensResults = await batchResolveENS(addresses);

    // Create a cache map from the results
    for (const [address, ensName] of ensResults.entries()) {
      if (ensName) {
        ensCache.set(address, ensName);
      }
    }

    console.log(`Resolved ${ensCache.size} ENS names for seed data`);

    // Now create the events with ENS names when available
    for (const vote of votes) {
      events.push({
        voter_address: vote.voter_address,
        voting_power: vote.voting_power,
        choice_ranking: vote.choice_ranking,
        event_type: "new",
        previous_ranking: null,
        ens_name: ensCache.get(vote.voter_address) || null,
        discovered_at: seedTimestamp,
        is_seed: true,
      });
    }

    // Add vote events
    if (events.length > 0) {
      const result = await addVoteEvents(events);

      // Invalidate cache after seed data import
      try {
        // Use admin client for cache operations
        const dbClient = getDbClient();

        // Clear all cache entries related to vote events
        const { error: clearError } = await dbClient
          .from("cached_votes")
          .delete()
          .neq("cache_key", "dummy"); // This will delete all entries

        if (clearError) {
          console.error("Error clearing cache after seed import:", clearError);
        } else {
          console.log(
            `Cleared cache after importing ${events.length} seed vote events`
          );
        }
      } catch (cacheError) {
        console.error("Error invalidating cache:", cacheError);
      }

      return {
        success: true,
        votes_imported: events.length,
      };
    } else {
      return { success: false, message: "No votes to import" };
    }
  } catch (error) {
    console.error("Error importing seed data:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};
