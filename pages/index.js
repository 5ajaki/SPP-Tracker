import { useState, useEffect } from "react";
import axios from "axios";
import { format } from "date-fns";
import supabase from "../lib/supabaseClient";
import { resolveENSName } from "../lib/ensUtils";

// Main index page
export default function Home() {
  const [voteEvents, setVoteEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(null);
  const [filter, setFilter] = useState("all"); // 'all', 'new', 'change'
  const [isSeedingData, setIsSeedingData] = useState(false);
  const [isResolvingENS, setIsResolvingENS] = useState(false);

  // Load vote events on page load
  useEffect(() => {
    fetchVoteEvents();
    // Set up polling every 120 seconds (2 minutes)
    const interval = setInterval(refreshVotes, 120000);
    return () => clearInterval(interval);
  }, []);

  // Refresh votes on filter change
  useEffect(() => {
    fetchVoteEvents();
  }, [filter]);

  // Fetch vote events from the database
  const fetchVoteEvents = async () => {
    try {
      setLoading(true);

      let query = supabase
        .from("voter_events")
        .select("*")
        .order("discovered_at", { ascending: false })
        .limit(50);

      // Apply filter
      if (filter === "new") {
        query = query.eq("event_type", "new");
      } else if (filter === "change") {
        query = query.eq("event_type", "change");
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching vote events:", error);
        return;
      }

      setVoteEvents(data || []);
    } catch (error) {
      console.error("Error fetching vote events:", error);
    } finally {
      setLoading(false);
    }
  };

  // Call the API to refresh votes
  const refreshVotes = async () => {
    try {
      const response = await axios.get("/api/refreshVotes");
      setLastRefresh(new Date());

      if (response.status === 200) {
        // Only fetch new events if changes were detected
        if (response.data.newEvents > 0) {
          fetchVoteEvents();
        }
      }
    } catch (error) {
      console.error("Error refreshing votes:", error);
    }
  };

  // Import seed data
  const importSeedData = async () => {
    try {
      setIsSeedingData(true);
      const response = await axios.post("/api/seedVotes");

      if (response.status === 200) {
        alert(
          `Successfully seeded ${response.data.votes_imported} votes from May 10, 2025!`
        );
        fetchVoteEvents();
      }
    } catch (error) {
      console.error("Error seeding data:", error);
      alert(
        "Error seeding data: " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setIsSeedingData(false);
    }
  };

  // Resolve missing ENS names
  const resolveENSNames = async () => {
    try {
      setIsResolvingENS(true);
      const response = await axios.get("/api/resolve-missing-ens");

      if (response.status === 200) {
        const { resolved, remaining } = response.data;
        if (resolved > 0) {
          // Refresh the display if any names were resolved
          fetchVoteEvents();
          alert(
            `Resolved ${resolved} ENS names. ${remaining} addresses remaining.`
          );
        } else {
          alert("No new ENS names were resolved.");
        }
      }
    } catch (error) {
      console.error("Error resolving ENS names:", error);
      alert(
        "Error resolving ENS names: " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setIsResolvingENS(false);
    }
  };

  return (
    <div className="container">
      <header>
        <h1>ENS DAO Service Provider Vote Tracker</h1>

        <div className="refresh-section">
          <button
            className="refresh-button"
            onClick={refreshVotes}
            disabled={loading || isSeedingData || isResolvingENS}
          >
            Refresh Votes
          </button>
          <button
            className="ens-button"
            onClick={resolveENSNames}
            disabled={loading || isSeedingData || isResolvingENS}
            title="Attempt to resolve ENS names for addresses"
          >
            {isResolvingENS ? "Resolving Names..." : "Resolve ENS Names"}
          </button>
          {lastRefresh && (
            <p className="last-updated">
              Last updated:{" "}
              {format(new Date(lastRefresh), "MM/dd/yyyy, h:mm:ss a")}
            </p>
          )}
        </div>

        <div className="filter-section">
          <span>Filter: </span>
          <div className="filter-buttons">
            <button
              className={filter === "all" ? "active" : ""}
              onClick={() => setFilter("all")}
            >
              All Events
            </button>
            <button
              className={filter === "new" ? "active" : ""}
              onClick={() => setFilter("new")}
            >
              New Votes
            </button>
            <button
              className={filter === "change" ? "active" : ""}
              onClick={() => setFilter("change")}
            >
              Changed Votes
            </button>
          </div>
        </div>
      </header>

      <main>
        {loading ? (
          <div className="loading">Loading vote events...</div>
        ) : voteEvents.length === 0 ? (
          <div className="no-data">
            <p>No vote events to display</p>
            <button
              className="seed-button"
              onClick={importSeedData}
              disabled={isSeedingData}
            >
              {isSeedingData ? "Importing Seed Data..." : "Import Seed Data"}
            </button>
          </div>
        ) : (
          <div className="vote-events">
            {voteEvents.map((event) => (
              <VoteEventCard key={event.vote_event_id} event={event} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

// Vote Event Card Component
function VoteEventCard({ event }) {
  const [ensName, setEnsName] = useState(event.ens_name || null);
  const [loadingEns, setLoadingEns] = useState(false);

  // Try to resolve ENS name on mount if not already available
  useEffect(() => {
    const resolveEns = async () => {
      if (!event.ens_name && event.voter_address && !loadingEns) {
        try {
          setLoadingEns(true);
          // Use our new direct ENS lookup utility
          const name = await resolveENSName(event.voter_address);
          if (name) {
            setEnsName(name);
            console.log(`Resolved ENS for ${event.voter_address}: ${name}`);
          }
        } catch (error) {
          console.error(
            `Error resolving ENS for ${event.voter_address}:`,
            error
          );
        } finally {
          setLoadingEns(false);
        }
      }
    };

    // Only try to resolve if the component mounts without an ENS name
    if (!event.ens_name && event.voter_address) {
      resolveEns();
    }
  }, [event.voter_address, event.ens_name]);

  // Format voting power to display with appropriate precision
  const formatVotingPower = (power) => {
    if (!power) return "0";
    const num = parseFloat(power);
    if (num >= 1000)
      return num.toLocaleString(undefined, { maximumFractionDigits: 2 });
    if (num >= 1)
      return num.toLocaleString(undefined, { maximumFractionDigits: 4 });
    return num.toLocaleString(undefined, { maximumSignificantDigits: 4 });
  };

  // Format timestamp
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "Unknown";
    // If this is seed data, show "Seeded" instead of the timestamp
    if (event.is_seed) return "Seeded";

    // Make sure we're handling a valid date
    try {
      // Parse the ISO timestamp
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) {
        console.error("Invalid date:", timestamp);

        // If it's a Postgres timestamp string, try to format it directly
        if (typeof timestamp === "string") {
          // Try to extract the date and time part
          const pgMatch = timestamp.match(
            /(\d{4}-\d{2}-\d{2})[T\s](\d{2}:\d{2}:\d{2})/
          );
          if (pgMatch) {
            const [_, datePart, timePart] = pgMatch;
            return `${datePart} at ${timePart}`;
          }
        }

        return "Invalid date";
      }

      // Format using date-fns
      return format(date, "MM/dd/yyyy 'at' h:mm a");
    } catch (error) {
      console.error("Error formatting date:", error, timestamp);
      return String(timestamp).substring(0, 19).replace("T", " at ");
    }
  };

  // Truncate addresses for display
  const truncateAddress = (address) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Display ENS name or truncated address
  const displayAddress = () => {
    if (ensName) {
      return (
        <span title={event.voter_address} className="ens-name">
          {ensName}
        </span>
      );
    }

    // Fallback to truncated address
    return (
      <span title={`${event.voter_address}`} className="eth-address">
        {truncateAddress(event.voter_address)}
      </span>
    );
  };

  // Helper to parse and normalize rankings
  const parseRanking = (ranking) => {
    if (!ranking) return [];

    let choices = [];

    if (Array.isArray(ranking)) {
      choices = ranking;
    } else if (typeof ranking === "string") {
      // Try to parse as JSON if it looks like an array
      if (ranking.trim().startsWith("[") && ranking.trim().endsWith("]")) {
        try {
          choices = JSON.parse(ranking);
        } catch (e) {
          choices = ranking.split(",").map((item) => item.trim());
        }
      } else {
        // Otherwise split by commas
        choices = ranking.split(",").map((item) => item.trim());
      }
    }

    // Find the index of "NONE BELOW" and only keep choices above it
    const noneIndex = choices.findIndex((choice) => choice === "NONE BELOW");
    if (noneIndex !== -1) {
      choices = choices.slice(0, noneIndex);
    }

    return choices;
  };

  return (
    <div
      className={`vote-card ${
        event.event_type === "new" ? "initial-vote" : "changed-vote"
      } ${event.is_seed ? "seed-data" : ""}`}
    >
      <div className="card-header">
        <div className="voter-info">
          <span className="voter-address">{displayAddress()}</span>
          <span className="voting-power">
            {formatVotingPower(event.voting_power)} votes
          </span>
        </div>
        <div className="timestamp">{formatTimestamp(event.discovered_at)}</div>
      </div>

      <div className="card-content">
        {event.event_type === "new" ? (
          <>
            <div className="vote-section no-previous-vote">
              <h3>No Previous Vote</h3>
              <div className="vote-description">First time voter</div>
            </div>

            <div className="vote-section initial-vote">
              <h3>Initial Vote</h3>
              <ol className="ranking-list">
                {parseRanking(event.choice_ranking).map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ol>
            </div>
          </>
        ) : (
          <>
            <div className="vote-section previous-vote">
              <h3>Previous Vote</h3>
              <ol className="ranking-list">
                {parseRanking(event.previous_ranking).map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ol>
            </div>

            <div className="vote-section new-vote">
              <h3>New Vote</h3>
              <ol className="ranking-list">
                {parseRanking(event.choice_ranking).map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ol>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
