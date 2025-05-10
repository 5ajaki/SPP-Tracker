import { useEffect, useState } from "react";
import axios from "axios";

export default function VoteTracker() {
  const [previousVotesData, setPreviousVotesData] = useState({});
  const [mostRecentVotesData, setMostRecentVotesData] = useState({});
  const [changeLog, setChangeLog] = useState([]);
  const [lastUpdated, setLastUpdated] = useState("Never");
  const [loading, setLoading] = useState(true);

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
          const voterAddress = columns[voterAddressIndex];
          const votingPower = parseFloat(columns[votingPowerIndex]);
          const choiceRanking = columns[choiceRankingIndex]
            .replace(/^"|"$/g, "")
            .split(",");

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
      if (oldData[voterAddress]) {
        const oldRanking = oldData[voterAddress].choiceRanking;
        const newRanking = newData[voterAddress].choiceRanking;

        // Compare rankings
        let isDifferent = false;
        if (oldRanking.length !== newRanking.length) {
          isDifferent = true;
        } else {
          for (let i = 0; i < oldRanking.length; i++) {
            if (oldRanking[i].trim() !== newRanking[i].trim()) {
              isDifferent = true;
              break;
            }
          }
        }

        if (isDifferent) {
          changes.push({
            type: "change",
            voterAddress: voterAddress,
            oldRanking: oldRanking,
            newRanking: newRanking,
            votingPower: newData[voterAddress].votingPower,
            timestamp: newData[voterAddress].timestamp,
          });
        }
      } else {
        // New vote
        changes.push({
          type: "new",
          voterAddress: voterAddress,
          oldRanking: [],
          newRanking: newData[voterAddress].choiceRanking,
          votingPower: newData[voterAddress].votingPower,
          timestamp: newData[voterAddress].timestamp,
        });
      }
    }

    return changes;
  }

  // Helper functions
  function formatAddress(address) {
    if (address.length <= 12) return address;
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }

  function formatNumber(num) {
    return num.toLocaleString(undefined, { maximumFractionDigits: 2 });
  }

  function formatTimestamp(timestamp) {
    return new Date(timestamp).toLocaleString();
  }

  // Function to update the changes
  async function updateChanges() {
    const newVotesData = await fetchVotesData();

    if (!newVotesData) {
      alert("Error fetching votes data. Please try again later.");
      return;
    }

    // If this is the first fetch, just store the data
    if (Object.keys(previousVotesData).length === 0) {
      setPreviousVotesData(JSON.parse(JSON.stringify(newVotesData)));
      setMostRecentVotesData(JSON.parse(JSON.stringify(newVotesData)));
      setLoading(false);
    } else {
      // Detect changes
      const changes = detectChanges(mostRecentVotesData, newVotesData);

      // Update the change log
      if (changes.length > 0) {
        setChangeLog((prevLog) => [...changes, ...prevLog]);
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
    updateChanges();

    // Set up automatic refresh every 60 seconds
    const interval = setInterval(updateChanges, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h1>ENS DAO Service Provider Vote Change Tracker</h1>

      <div className="refresh-section">
        <button onClick={updateChanges}>Refresh Data</button>
        <div className="last-updated">Last updated: {lastUpdated}</div>
      </div>

      <div id="changes-container">
        {loading ? (
          <div className="loading">Loading data...</div>
        ) : changeLog.length === 0 ? (
          <div>Monitoring for changes. No changes detected yet.</div>
        ) : (
          changeLog.map((change, index) => (
            <div key={index} className="change-card">
              <div className="card-header">
                <div className="voter-info">
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

              <div className="rankings-container">
                <div className="previous-rankings">
                  <div className="column-header">
                    {change.type === "new" ? "New Voter" : "Previous Rankings"}
                  </div>

                  <ul>
                    {change.type === "new" ? (
                      <li>First time voter</li>
                    ) : (
                      change.oldRanking.map((rank, idx) => (
                        <li
                          key={idx}
                          className={
                            !change.newRanking.includes(rank) ||
                            change.newRanking.indexOf(rank) !== idx
                              ? "highlight-remove"
                              : ""
                          }
                        >
                          {idx + 1}.{" "}
                          {rank.trim() === "NONE BELOW" ? (
                            <span className="none-below-marker">
                              NONE BELOW
                            </span>
                          ) : (
                            rank.trim()
                          )}
                        </li>
                      ))
                    )}
                  </ul>
                </div>

                <div className="new-rankings">
                  <div className="column-header">New Rankings</div>

                  <ul>
                    {change.newRanking.map((rank, idx) => (
                      <li
                        key={idx}
                        className={
                          change.type === "new" ||
                          !change.oldRanking.includes(rank) ||
                          change.oldRanking.indexOf(rank) !== idx
                            ? "highlight-add"
                            : ""
                        }
                      >
                        {idx + 1}.{" "}
                        {rank.trim() === "NONE BELOW" ? (
                          <span className="none-below-marker">NONE BELOW</span>
                        ) : (
                          rank.trim()
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
