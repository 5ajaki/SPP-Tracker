import { useEffect, useState } from "react";
import axios from "axios";
import { supabase } from "../lib/supabaseClient";

export default function VoteTracker() {
  const [previousVotesData, setPreviousVotesData] = useState({});
  const [mostRecentVotesData, setMostRecentVotesData] = useState({});
  const [changeLog, setChangeLog] = useState([]);
  const [lastUpdated, setLastUpdated] = useState("Never");
  const [loading, setLoading] = useState(true);
  const [ensNames, setEnsNames] = useState({});
  const [filterType, setFilterType] = useState("all"); // all, new, changed, unchanged

  // Function to parse CSV line correctly (handling quoted values with commas)
  function parseCSVLine(line) {
    const result = [];
    let inQuotes = false;
    let currentValue = "";

    for (let i = 0; i < line.length; i++) {
      const char = line[i];

      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === "," && !inQuotes) {
        result.push(currentValue);
        currentValue = "";
      } else {
        currentValue += char;
      }
    }

    // Add the last value
    result.push(currentValue);

    return result;
  }

  // Function to fetch the votes data
  async function fetchVotesData() {
    try {
      const response = await axios.get("/api/votes");
      const csvText = response.data;

      // Parse CSV
      const lines = csvText.split("\n");
      const headers = lines[0].split(",");

      const voterAddressIndex = headers.indexOf("Voter Address");
      const votingPowerIndex = headers.indexOf("Voting Power");
      const choiceRankingIndex = headers.indexOf("Choice Ranking");

      // Skip header row
      const votesData = {};
      for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;

        const columns = parseCSVLine(lines[i]);

        if (columns.length >= 3) {
          const voterAddress = columns[voterAddressIndex]?.trim() || "";
          if (!voterAddress) continue; // Skip rows without a valid address

          // Parse voting power, ensuring we have a number
          let votingPower = 0;
          try {
            votingPower = parseFloat(columns[votingPowerIndex] || "0");
            if (isNaN(votingPower)) votingPower = 0;
          } catch (e) {
            votingPower = 0;
          }

          // Parse choice ranking, ensuring we have an array
          let choiceRanking = [];
          try {
            const rankingString = columns[choiceRankingIndex] || "";
            choiceRanking = rankingString
              .replace(/^"|"$/g, "")
              .split(",")
              .map((item) => item.trim())
              .filter((item) => item); // Filter out empty strings
          } catch (e) {
            choiceRanking = [];
          }

          votesData[voterAddress] = {
            address: voterAddress,
            votingPower: votingPower,
            choiceRanking: choiceRanking,
            timestamp: new Date(),
          };
        }
      }

      return votesData;
    } catch (error) {
      console.error("Error fetching votes data:", error);
      return null;
    }
  }

  // Function to detect changes between old and new votes data
  function detectChanges(oldData, newData) {
    const changes = [];

    // Check for changes in existing votes
    for (const voterAddress in newData) {
      if (!voterAddress) continue;

      if (oldData && oldData[voterAddress]) {
        const oldRanking = oldData[voterAddress].choiceRanking || [];
        const newRanking = newData[voterAddress].choiceRanking || [];

        // Find the "NONE BELOW" index in both rankings
        const oldNoneBelowIndex = Array.isArray(oldRanking)
          ? oldRanking.findIndex(
              (r) => r && r.trim && r.trim() === "NONE BELOW"
            )
          : -1;
        const newNoneBelowIndex = Array.isArray(newRanking)
          ? newRanking.findIndex(
              (r) => r && r.trim && r.trim() === "NONE BELOW"
            )
          : -1;

        // Trim the rankings to only include choices up to "NONE BELOW"
        const trimmedOldRanking =
          Array.isArray(oldRanking) && oldNoneBelowIndex !== -1
            ? oldRanking.slice(0, oldNoneBelowIndex + 1)
            : Array.isArray(oldRanking)
            ? oldRanking
            : [];

        const trimmedNewRanking =
          Array.isArray(newRanking) && newNoneBelowIndex !== -1
            ? newRanking.slice(0, newNoneBelowIndex + 1)
            : Array.isArray(newRanking)
            ? newRanking
            : [];

        // Compare rankings
        let isDifferent = false;
        if (trimmedOldRanking.length !== trimmedNewRanking.length) {
          isDifferent = true;
        } else {
          for (let i = 0; i < trimmedOldRanking.length; i++) {
            const oldItem = trimmedOldRanking[i]
              ? trimmedOldRanking[i].trim()
              : "";
            const newItem = trimmedNewRanking[i]
              ? trimmedNewRanking[i].trim()
              : "";
            if (oldItem !== newItem) {
              isDifferent = true;
              break;
            }
          }
        }

        // Add to changes list regardless of whether there was a change
        changes.push({
          type: "change",
          voterAddress: voterAddress,
          oldRanking: trimmedOldRanking,
          newRanking: trimmedNewRanking,
          votingPower: newData[voterAddress].votingPower || 0,
          timestamp: newData[voterAddress].timestamp || new Date(),
          hasChanges: isDifferent,
        });
      } else {
        // New vote
        const ranking = newData[voterAddress]?.choiceRanking || [];
        const noneBelowIndex = Array.isArray(ranking)
          ? ranking.findIndex((r) => r && r.trim && r.trim() === "NONE BELOW")
          : -1;
        const trimmedRanking =
          Array.isArray(ranking) && noneBelowIndex !== -1
            ? ranking.slice(0, noneBelowIndex + 1)
            : Array.isArray(ranking)
            ? ranking
            : [];

        changes.push({
          type: "new",
          voterAddress: voterAddress,
          oldRanking: [],
          newRanking: trimmedRanking,
          votingPower: newData[voterAddress]?.votingPower || 0,
          timestamp: newData[voterAddress]?.timestamp || new Date(),
          hasChanges: true,
        });
      }
    }

    return changes;
  }

  // Helper function to batch resolve ENS names
  async function resolveEnsNames(addresses) {
    try {
      const unresolvedAddresses = addresses.filter((addr) => !ensNames[addr]);

      if (unresolvedAddresses.length === 0) return;

      const response = await axios.post("/api/resolve-ens", {
        addresses: unresolvedAddresses,
      });

      if (response.data && response.data.ens) {
        setEnsNames((prev) => ({
          ...prev,
          ...response.data.ens,
        }));
      }
    } catch (error) {
      console.error("Error resolving ENS names:", error);
    }
  }

  // Helper functions
  function formatAddress(address) {
    if (!address) return "Unknown Address";

    if (ensNames[address]) {
      return <span className="ens-name">{ensNames[address]}</span>;
    }
    if (address.length <= 12) return address;
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }

  function formatNumber(num) {
    if (num === undefined || num === null) return "0";
    return num.toLocaleString(undefined, { maximumFractionDigits: 2 });
  }

  function formatTimestamp(timestamp) {
    if (!timestamp) return "Unknown";

    const date = new Date(timestamp);
    const now = new Date();

    // Calculate time difference in milliseconds
    const timeDiff = now - date;

    // Convert to minutes, hours, days
    const minutesDiff = Math.floor(timeDiff / (1000 * 60));
    const hoursDiff = Math.floor(timeDiff / (1000 * 60 * 60));
    const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

    // Format options for different cases
    if (minutesDiff < 1) {
      return "Just now";
    } else if (minutesDiff < 60) {
      return `${minutesDiff} minute${minutesDiff !== 1 ? "s" : ""} ago`;
    } else if (hoursDiff < 24) {
      return `${hoursDiff} hour${hoursDiff !== 1 ? "s" : ""} ago`;
    } else if (daysDiff < 7) {
      return `${daysDiff} day${daysDiff !== 1 ? "s" : ""} ago`;
    } else {
      // For older timestamps, use a full date format
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  }

  // Function to load historical changes
  async function loadHistoricalChanges() {
    try {
      const { data, error } = await supabase
        .from("vote_changes")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100); // Adjust limit as needed

      if (error) throw error;

      if (data && Array.isArray(data)) {
        // Sanitize the data to ensure all properties exist
        const sanitizedData = data.map((change) => ({
          type: change.type || "change",
          voterAddress: change.voter_address || change.voterAddress || "",
          oldRanking: Array.isArray(change.old_ranking || change.oldRanking)
            ? change.old_ranking || change.oldRanking
            : [],
          newRanking: Array.isArray(change.new_ranking || change.newRanking)
            ? change.new_ranking || change.newRanking
            : [],
          votingPower: change.voting_power || change.votingPower || 0,
          timestamp: change.timestamp || new Date(),
          hasChanges:
            change.type === "new" ? true : change.hasChanges !== false,
          created_at: change.created_at || new Date(),
        }));

        // Sort by timestamp (newest first)
        sanitizedData.sort((a, b) => {
          const dateA = new Date(a.timestamp);
          const dateB = new Date(b.timestamp);
          return dateB - dateA;
        });

        setChangeLog(sanitizedData);

        // Extract voter addresses to resolve ENS names
        const addresses = sanitizedData
          .map((change) => change.voterAddress)
          .filter((addr) => addr); // Filter out empty addresses

        if (addresses.length > 0) {
          resolveEnsNames(addresses);
        }

        // Return whether we have any historical data
        return sanitizedData.length > 0;
      }
      return false;
    } catch (error) {
      console.error("Error loading historical changes:", error);
      return false;
    }
  }

  // Modified updateChanges function to store changes
  async function updateChanges(hasExistingData = false) {
    const newVotesData = await fetchVotesData();

    if (!newVotesData) {
      alert("Error fetching votes data. Please try again later.");
      return;
    }

    // If this is the first fetch and we don't have historical data
    if (Object.keys(previousVotesData).length === 0 && !hasExistingData) {
      // Create "new votes" entries for every vote in the first fetch
      const initialChanges = Object.values(newVotesData).map((voteData) => {
        const ranking = voteData.choiceRanking || [];
        const noneBelowIndex = Array.isArray(ranking)
          ? ranking.findIndex((r) => r && r.trim && r.trim() === "NONE BELOW")
          : -1;
        const trimmedRanking =
          Array.isArray(ranking) && noneBelowIndex !== -1
            ? ranking.slice(0, noneBelowIndex + 1)
            : Array.isArray(ranking)
            ? ranking
            : [];

        return {
          type: "new",
          voterAddress: voteData.address,
          oldRanking: [],
          newRanking: trimmedRanking,
          votingPower: voteData.votingPower || 0,
          timestamp: voteData.timestamp || new Date(),
          hasChanges: true,
        };
      });

      // Store these initial votes as "new" votes
      try {
        await axios.post("/api/votes", { changes: initialChanges });
        setChangeLog(initialChanges);

        // Extract voter addresses to resolve ENS names
        const addresses = initialChanges.map((change) => change.voterAddress);
        resolveEnsNames(addresses);
      } catch (error) {
        console.error("Error storing initial changes:", error);
      }

      setPreviousVotesData(JSON.parse(JSON.stringify(newVotesData)));
      setMostRecentVotesData(JSON.parse(JSON.stringify(newVotesData)));
      setLoading(false);
    } else {
      // Detect changes
      const changes = detectChanges(mostRecentVotesData, newVotesData);

      // If there are changes, send them to the API
      if (changes.length > 0 && changes.some((c) => c.hasChanges)) {
        try {
          await axios.post("/api/votes", { changes });
          setChangeLog((prevLog) => [...changes, ...prevLog]);

          // Extract voter addresses to resolve ENS names
          const addresses = changes.map((change) => change.voterAddress);
          resolveEnsNames(addresses);
        } catch (error) {
          console.error("Error storing changes:", error);
        }
      }

      // Update the most recent data
      setMostRecentVotesData(JSON.parse(JSON.stringify(newVotesData)));
      setLoading(false);
    }

    // Update the last updated timestamp
    setLastUpdated(new Date().toLocaleString());
  }

  // Set up initial fetching and periodic updates
  useEffect(() => {
    // Flag to track if we've loaded historical data
    let hasHistoricalData = false;

    // Load historical changes first
    loadHistoricalChanges().then((historyResult) => {
      hasHistoricalData = historyResult;
      updateChanges(hasHistoricalData);
    });

    // Set up automatic refresh every 60 seconds
    const interval = setInterval(() => updateChanges(true), 60000);

    return () => clearInterval(interval);
  }, []);

  // Function to get filtered changes
  const getFilteredChanges = () => {
    if (filterType === "all") {
      return changeLog;
    } else if (filterType === "new") {
      return changeLog.filter((change) => change.type === "new");
    } else if (filterType === "changed") {
      return changeLog.filter(
        (change) => change.type === "change" && change.hasChanges === true
      );
    } else if (filterType === "unchanged") {
      return changeLog.filter(
        (change) => change.type === "change" && change.hasChanges === false
      );
    }
    return changeLog;
  };

  return (
    <div>
      <h1>ENS DAO Service Provider Vote Change Tracker</h1>

      <div className="refresh-section">
        <button onClick={updateChanges}>Refresh Data</button>
        <div className="last-updated">Last updated: {lastUpdated}</div>
      </div>

      <div className="filter-controls">
        <span>Filter:</span>
        <button
          className={filterType === "all" ? "filter-active" : ""}
          onClick={() => setFilterType("all")}
        >
          All
        </button>
        <button
          className={filterType === "new" ? "filter-active" : ""}
          onClick={() => setFilterType("new")}
        >
          Initial Votes
        </button>
        <button
          className={filterType === "changed" ? "filter-active" : ""}
          onClick={() => setFilterType("changed")}
        >
          Changed Votes
        </button>
        <button
          className={filterType === "unchanged" ? "filter-active" : ""}
          onClick={() => setFilterType("unchanged")}
        >
          Unchanged Votes
        </button>
      </div>

      <div id="changes-container">
        {loading ? (
          <div className="loading">Loading data...</div>
        ) : getFilteredChanges().length === 0 ? (
          <div>
            {changeLog.length === 0
              ? "Monitoring for changes. No changes detected yet."
              : "No votes match the current filter."}
          </div>
        ) : (
          getFilteredChanges().map((change, index) => (
            <div key={index} className="change-card">
              <div className="card-header">
                <div
                  className={`vote-status ${
                    change.type === "new"
                      ? "vote-status-new"
                      : change.hasChanges === false
                      ? "vote-status-unchanged"
                      : "vote-status-changed"
                  }`}
                >
                  {change.type === "new"
                    ? "Initial Vote"
                    : change.hasChanges === false
                    ? "No Change"
                    : "Vote Changed"}
                </div>

                <div className="voter-info">
                  <div className="voter-details">
                    <div className="voter-address">
                      {formatAddress(change.voterAddress)}
                    </div>
                    <div className="vote-power">
                      {formatNumber(change.votingPower)} votes
                    </div>
                  </div>
                  <div className="timestamp">
                    {formatTimestamp(change.timestamp)}
                  </div>
                </div>
              </div>

              <div className="rankings-container">
                <div className="previous-rankings">
                  <div className="column-header">
                    {change.type === "new"
                      ? "No Previous Vote"
                      : "Previous Rankings"}
                  </div>

                  <ul>
                    {change.type === "new" ? (
                      <li className="no-previous-vote">First time voter</li>
                    ) : (
                      Array.isArray(change.oldRanking) &&
                      change.oldRanking.map((rank, idx) => (
                        <li
                          key={idx}
                          className={
                            change.hasChanges === false
                              ? ""
                              : !Array.isArray(change.newRanking) ||
                                !change.newRanking.includes(rank) ||
                                change.newRanking.indexOf(rank) !== idx
                              ? "highlight-remove"
                              : ""
                          }
                        >
                          {idx + 1}.{" "}
                          {rank && rank.trim() === "NONE BELOW" ? (
                            <span className="none-below-marker">
                              NONE BELOW
                            </span>
                          ) : rank ? (
                            rank.trim()
                          ) : (
                            ""
                          )}
                        </li>
                      ))
                    )}
                  </ul>
                </div>

                <div className="new-rankings">
                  <div
                    className={`column-header ${
                      change.type !== "new" && change.hasChanges === false
                        ? "no-change"
                        : ""
                    }`}
                  >
                    {change.type === "new"
                      ? "Initial Vote"
                      : change.hasChanges === false
                      ? "Unchanged Vote"
                      : "New Rankings"}
                  </div>

                  <ul>
                    {Array.isArray(change.newRanking) &&
                      change.newRanking.map((rank, idx) => (
                        <li
                          key={idx}
                          className={
                            change.hasChanges === false
                              ? ""
                              : change.type === "new" ||
                                !Array.isArray(change.oldRanking) ||
                                !change.oldRanking.includes(rank) ||
                                change.oldRanking.indexOf(rank) !== idx
                              ? "highlight-add"
                              : ""
                          }
                        >
                          {idx + 1}.{" "}
                          {rank && rank.trim() === "NONE BELOW" ? (
                            <span className="none-below-marker">
                              NONE BELOW
                            </span>
                          ) : rank ? (
                            rank.trim()
                          ) : (
                            ""
                          )}
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
