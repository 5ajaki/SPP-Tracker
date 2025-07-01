const https = require("https");
const fs = require("fs");
const path = require("path");

const SUPABASE_URL = "https://fcpdfuklquipwxajechs.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZjcGRmdWtscXVpcHd4YWplY2hzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY4OTc0MjQsImV4cCI6MjA2MjQ3MzQyNH0.MxsnJAuilV1RoCSGY5k4VvmPufL-wI872DUWNVa6kvI";

async function fetchFromSupabase(endpoint) {
  return new Promise((resolve, reject) => {
    const url = new URL(`${SUPABASE_URL}/rest/v1/${endpoint}`);

    const options = {
      hostname: url.hostname,
      path: url.pathname + url.search,
      method: "GET",
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };

    https
      .get(options, (res) => {
        let data = "";

        res.on("data", (chunk) => {
          data += chunk;
        });

        res.on("end", () => {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(e);
          }
        });
      })
      .on("error", reject);
  });
}

async function exportVoteEvents() {
  try {
    console.log("Fetching all vote events from Supabase...");

    // Fetch all vote events in batches
    let allEvents = [];
    let offset = 0;
    const limit = 1000;
    let hasMore = true;

    while (hasMore) {
      console.log(`Fetching events from offset ${offset}...`);
      const data = await fetchFromSupabase(
        `voter_events?select=*&order=discovered_at.desc&limit=${limit}&offset=${offset}`
      );

      if (data && data.length > 0) {
        allEvents = allEvents.concat(data);
        console.log(
          `Fetched ${data.length} events (total: ${allEvents.length})`
        );
        hasMore = data.length === limit;
        offset += limit;
      } else {
        hasMore = false;
      }
    }

    console.log(`Total events fetched: ${allEvents.length}`);

    // Count unique voters
    const uniqueVoters = new Set(allEvents.map((e) => e.voter_address)).size;

    // Count by event type
    const eventCounts = allEvents.reduce((acc, event) => {
      acc[event.event_type] = (acc[event.event_type] || 0) + 1;
      return acc;
    }, {});

    // Create the export data
    const exportData = {
      exportedAt: new Date().toISOString(),
      summary: {
        totalEvents: allEvents.length,
        uniqueVoters,
        newVotes: eventCounts.new || 0,
        changedVotes: eventCounts.change || 0,
        seedData: allEvents.filter((e) => e.is_seed).length,
      },
      events: allEvents,
    };

    // Save to public directory
    const outputPath = path.join(
      process.cwd(),
      "public",
      "static-vote-events.json"
    );
    fs.writeFileSync(outputPath, JSON.stringify(exportData, null, 2));

    console.log(`\nExport complete!`);
    console.log(`File saved to: ${outputPath}`);
    console.log("\nSummary:", exportData.summary);
  } catch (error) {
    console.error("Error exporting data:", error);
    process.exit(1);
  }
}

exportVoteEvents();
