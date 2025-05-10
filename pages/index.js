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
  const [showHighPower, setShowHighPower] = useState(true); // Default to true
  const [expandAll, setExpandAll] = useState(false);

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
  }, [filter, showHighPower]);

  // Handle expand all toggle
  useEffect(() => {
    // Update expanded state of all cards when expandAll changes
    setVoteEvents((prev) =>
      prev.map((event) => ({
        ...event,
        isExpanded: expandAll,
      }))
    );
  }, [expandAll]);

  // Fetch vote events from the database
  const fetchVoteEvents = async () => {
    try {
      setLoading(true);

      let query = supabase
        .from("voter_events")
        .select("*")
        .order("discovered_at", { ascending: false });

      // Apply type filter
      if (filter === "new") {
        query = query.eq("event_type", "new");
      } else if (filter === "change") {
        query = query.eq("event_type", "change");
      }

      // Apply voting power filter
      if (showHighPower) {
        query = query.gte("voting_power", 100);
      }

      // Apply limit
      query = query.limit(50);

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching vote events:", error);
        return;
      }

      // Initialize each event with an isExpanded property
      setVoteEvents(
        (data || []).map((event) => ({
          ...event,
          isExpanded: expandAll,
        }))
      );
    } catch (error) {
      console.error("Error fetching vote events:", error);
    } finally {
      setLoading(false);
    }
  };

  // Toggle expansion state of a specific card
  const toggleCardExpansion = (voteEventId) => {
    setVoteEvents((prev) =>
      prev.map((event) =>
        event.vote_event_id === voteEventId
          ? { ...event, isExpanded: !event.isExpanded }
          : event
      )
    );
  };

  // Toggle expand all
  const toggleExpandAll = () => {
    setExpandAll(!expandAll);
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

  return (
    <div className="container">
      <header>
        <h1>ENS DAO Service Provider Vote Tracker</h1>

        <div className="refresh-section">
          {lastRefresh && (
            <p className="last-updated">
              Last updated:{" "}
              {format(new Date(lastRefresh), "MM/dd/yyyy, h:mm:ss a")}
            </p>
          )}
        </div>

        <div className="filter-controls">
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

          <div className="color-legend">
            <div className="legend-title">Color Key:</div>
            <div className="legend-items">
              <div className="legend-item">
                <span className="legend-color new-color"></span>
                <span className="legend-label">New Votes</span>
              </div>
              <div className="legend-item">
                <span className="legend-color change-color"></span>
                <span className="legend-label">Changed Votes</span>
              </div>
              <div className="legend-item">
                <span className="legend-color seed-color"></span>
                <span className="legend-label">Seed Data</span>
              </div>
            </div>
          </div>

          <div className="filter-options">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={showHighPower}
                onChange={() => setShowHighPower(!showHighPower)}
              />
              Only show votes over 100 $ENS
            </label>

            <button className="expand-all-button" onClick={toggleExpandAll}>
              {expandAll ? "Collapse All" : "Expand All"}
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
              <VoteEventCard
                key={event.vote_event_id}
                event={event}
                isExpanded={event.isExpanded}
                toggleExpansion={() => toggleCardExpansion(event.vote_event_id)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

// Vote Event Card Component
function VoteEventCard({ event, isExpanded, toggleExpansion }) {
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
    // Round to whole numbers, never show decimals
    return Math.round(num).toLocaleString();
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
      } ${event.is_seed ? "seed-data" : ""} ${
        isExpanded ? "expanded" : "collapsed"
      }`}
    >
      <div className="card-header" onClick={toggleExpansion}>
        <div className="voter-info">
          <div className="voter-details">
            <span className="voter-address">{displayAddress()}</span>
            <span
              className="voting-power-pill"
              title={`${formatVotingPower(event.voting_power)} voting power`}
            >
              {formatVotingPower(event.voting_power)}
            </span>
          </div>
        </div>
        <div className="card-actions">
          <div className="timestamp">
            {formatTimestamp(event.discovered_at)}
          </div>
          <button className="expand-toggle">{isExpanded ? "▲" : "▼"}</button>
        </div>
      </div>

      {isExpanded && (
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
      )}
    </div>
  );
}
