// API endpoint to fetch votes data from ENS DAO
import axios from "axios";
import { parse } from "csv-parse/sync";
import { supabase } from "../../lib/supabaseClient";

// Configure axios with retry logic
const axiosWithRetry = axios.create();

// Retry function with exponential backoff
const retryRequest = async (fn, retries = 3, delay = 1000) => {
  try {
    return await fn();
  } catch (error) {
    if (retries <= 0) {
      throw error;
    }

    console.log(`Retrying request, ${retries} attempts left...`);
    await new Promise((resolve) => setTimeout(resolve, delay));

    return retryRequest(fn, retries - 1, delay * 2);
  }
};

// Process CSV data and update Supabase
async function processVotesData(csvData) {
  try {
    // Parse CSV
    const records = parse(csvData, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });

    console.log(`Parsed ${records.length} records from the CSV data`);

    // Get existing votes from the database
    const { data: existingVotes, error: fetchError } = await supabase
      .from("votes")
      .select("voter_address, top_picks, vote_date")
      .order("vote_date", { ascending: false });

    if (fetchError) throw fetchError;

    console.log(
      `Found ${existingVotes?.length || 0} existing votes in the database`
    );

    // Create a map of existing votes for easier lookup
    // Use only the most recent vote for each address to check for changes
    const latestVotesMap = {};
    if (existingVotes) {
      // Group by voter_address and only keep the most recent vote
      existingVotes.forEach((vote) => {
        const address = vote.voter_address.toLowerCase();
        if (
          !latestVotesMap[address] ||
          new Date(vote.vote_date) > new Date(latestVotesMap[address].vote_date)
        ) {
          latestVotesMap[address] = vote;
        }
      });
    }

    // Process records for database updates
    const voteEvents = [];
    let newVotes = 0;
    let changedVotes = 0;

    for (const record of records) {
      const voterAddress = record["Voter Address"]?.toLowerCase();
      if (!voterAddress) continue;

      // Parse choice ranking
      const choiceRanking = record["Choice Ranking"]
        ? record["Choice Ranking"].split(",").map((item) => item.trim())
        : [];

      // Calculate the timestamp (use current time as we detect new/changed votes)
      const timestamp = new Date().toISOString();

      // Check if this is a new voter or an update to an existing one
      if (latestVotesMap[voterAddress]) {
        // This is an existing voter, check if the vote has changed
        const oldVote = latestVotesMap[voterAddress];
        const oldRanking =
          typeof oldVote.top_picks === "string"
            ? JSON.parse(oldVote.top_picks)
            : oldVote.top_picks;

        // Only create change events if the ranking has changed
        let hasChanged = false;

        if (choiceRanking.length !== oldRanking.length) {
          hasChanged = true;
        } else {
          for (let i = 0; i < choiceRanking.length; i++) {
            if (choiceRanking[i] !== oldRanking[i]) {
              hasChanged = true;
              break;
            }
          }
        }

        if (hasChanged) {
          console.log(`Detected changed vote from address: ${voterAddress}`);
          changedVotes++;

          // Store the change event
          voteEvents.push({
            type: "change",
            voter_address: voterAddress,
            old_ranking: oldRanking,
            new_ranking: choiceRanking,
            voting_power: parseFloat(record["Voting Power"] || "0"),
            timestamp,
            created_at: new Date().toISOString(),
          });

          // Insert a new vote record - DO NOT update the old vote
          await supabase.from("votes").insert({
            voter_address: voterAddress,
            voting_power: parseFloat(record["Voting Power"] || "0"),
            top_picks: JSON.stringify(choiceRanking),
            vote_date: timestamp, // Use the current timestamp for the new vote
          });
        }
      } else {
        // This is a new voter
        console.log(`Detected new vote from address: ${voterAddress}`);
        newVotes++;

        // Store the change event
        voteEvents.push({
          type: "new",
          voter_address: voterAddress,
          old_ranking: [],
          new_ranking: choiceRanking,
          voting_power: parseFloat(record["Voting Power"] || "0"),
          timestamp,
          created_at: new Date().toISOString(),
        });

        // Insert the new vote in the votes table
        await supabase.from("votes").insert({
          voter_address: voterAddress,
          voting_power: parseFloat(record["Voting Power"] || "0"),
          top_picks: JSON.stringify(choiceRanking),
          vote_date: timestamp, // Use the current timestamp for the new vote
        });
      }
    }

    console.log(
      `Processing complete. Found ${newVotes} new votes and ${changedVotes} changed votes.`
    );

    // If we have change events, insert them into the vote_changes table
    if (voteEvents.length > 0) {
      console.log(
        `Inserting ${voteEvents.length} vote events into the vote_changes table`
      );
      const { error: insertError } = await supabase
        .from("vote_changes")
        .insert(voteEvents);

      if (insertError) throw insertError;
    }

    return {
      success: true,
      changes: voteEvents.length,
      new_votes: newVotes,
      changed_votes: changedVotes,
    };
  } catch (error) {
    console.error("Error processing vote data:", error);
    return { success: false, error: error.message };
  }
}

export default async function handler(req, res) {
  try {
    console.log("Fetching latest votes from ENS DAO...");

    // Fetch data with retry logic
    const response = await retryRequest(() =>
      axiosWithRetry.get(
        "https://agora.ensdao.org/api/proposals/0x98c65ac02f738ddb430fcd723ea5852a45168550b3daf20f75d5d508ecf28aa1/votes-csv",
        {
          timeout: 10000, // 10 second timeout
          headers: {
            Accept: "*/*",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "en-US,en;q=0.9",
            Referer:
              "https://agora.ensdao.org/proposals/0x98c65ac02f738ddb430fcd723ea5852a45168550b3daf20f75d5d508ecf28aa1",
            "User-Agent":
              "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.4 Safari/605.1.15",
          },
        }
      )
    );

    console.log("Successfully retrieved CSV data. Processing votes...");

    // Process the CSV data and update the database
    const result = await processVotesData(response.data);

    // Store the CSV backup
    const timestamp = new Date().toISOString();
    await supabase.storage
      .from("vote-data")
      .upload(`backups/${timestamp}.csv`, response.data);

    res.status(200).json({
      success: true,
      message: `Processed vote data with ${
        result.new_votes || 0
      } new votes and ${result.changed_votes || 0} changed votes`,
      data: response.data,
    });
  } catch (error) {
    console.error("Error fetching votes:", error);

    // Provide more detailed error information
    const errorMessage = {
      error: "Failed to fetch votes data",
      message: error.message,
      code: error.code || "UNKNOWN",
      status: error.response?.status,
      details:
        process.env.NODE_ENV === "development" ? error.toString() : undefined,
    };

    res.status(500).json(errorMessage);
  }
}
