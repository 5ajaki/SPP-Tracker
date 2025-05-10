// Script to update vote timestamps in Supabase database based on CSV data
const fs = require("fs");
const path = require("path");
const { parse } = require("csv-parse/sync");
const { createClient } = require("@supabase/supabase-js");
require("dotenv").config({ path: ".env.local" });

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function updateTimestamps() {
  try {
    console.log("Starting timestamp update process...");

    // Read the CSV file
    const csvPath = path.join(__dirname, "notes", "ens-votes.csv");
    const csvData = fs.readFileSync(csvPath, "utf8");

    // Parse the CSV data
    const records = parse(csvData, {
      columns: true,
      skip_empty_lines: true,
    });

    console.log(`Loaded ${records.length} records from CSV`);

    // Create a mapping of voter addresses to timestamps
    const addressToTimestamp = {};

    records.forEach((record) => {
      // Extract the truncated address (e.g., "0xe52C...d726")
      const truncatedAddress = record.Address;

      // Parse the date (e.g., "May 10 2025")
      // We need to provide a default time (using 14:00 for 2pm Eastern)
      const dateParts = record.Vote_Date.split(" ");
      const month = dateParts[0];
      const day = parseInt(dateParts[1]);
      const year = parseInt(dateParts[2]);

      // Create a timestamp (2pm Eastern on the specified date)
      const timestamp = new Date(
        `${month} ${day}, ${year} 14:00:00 EDT`
      ).toISOString();

      // Store in the mapping
      addressToTimestamp[truncatedAddress] = timestamp;
    });

    console.log(
      `Created timestamp mapping for ${
        Object.keys(addressToTimestamp).length
      } addresses`
    );

    // Get all vote changes from Supabase
    console.log("Fetching vote records from Supabase...");
    const { data: voteChanges, error: fetchError } = await supabase
      .from("vote_changes")
      .select("*");

    if (fetchError) {
      throw fetchError;
    }

    console.log(`Retrieved ${voteChanges.length} records from Supabase`);

    // Prepare updates
    const updates = [];
    const addressMappings = []; // For debugging

    for (const change of voteChanges) {
      // Get the voter address from the change
      const voterAddress = change.voter_address || change.voterAddress;

      if (!voterAddress) {
        console.log(`Skipping record ${change.id}: No voter address found`);
        continue;
      }

      // Log the current record we're trying to match
      console.log(`Trying to match: ${voterAddress}`);

      // Try different matching strategies
      let matched = false;

      // First try: Direct full address match (unlikely with truncated CSV addresses)
      if (addressToTimestamp[voterAddress]) {
        updates.push({
          id: change.id,
          timestamp: addressToTimestamp[voterAddress],
        });
        addressMappings.push(
          `${voterAddress} -> ${addressToTimestamp[voterAddress]} (direct match)`
        );
        matched = true;
        continue;
      }

      // Second try: Match beginning and end of truncated addresses
      for (const csvAddr of Object.keys(addressToTimestamp)) {
        // Extract the parts before and after the ellipsis
        const [prefix, suffix] = csvAddr.split("...");

        // If we have both parts and they're in the full address
        if (
          prefix &&
          suffix &&
          voterAddress.startsWith(prefix) &&
          voterAddress.endsWith(suffix)
        ) {
          updates.push({
            id: change.id,
            timestamp: addressToTimestamp[csvAddr],
          });
          addressMappings.push(
            `${voterAddress} -> ${addressToTimestamp[csvAddr]} (prefix/suffix match: ${csvAddr})`
          );
          matched = true;
          break;
        }
      }

      if (!matched) {
        console.log(`No match found for address: ${voterAddress}`);
      }
    }

    console.log(
      `Preparing to update ${updates.length} records with correct timestamps`
    );
    console.log("Address mappings:");
    addressMappings.forEach((mapping) => console.log(mapping));

    if (updates.length === 0) {
      console.log("No matching records found to update.");
      return;
    }

    // Apply the updates in batches to avoid rate limits
    const batchSize = 50;
    const batches = [];

    for (let i = 0; i < updates.length; i += batchSize) {
      batches.push(updates.slice(i, i + batchSize));
    }

    console.log(
      `Split updates into ${batches.length} batches of up to ${batchSize} records each`
    );

    // Execute each batch
    let successfulUpdates = 0;

    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      console.log(
        `Processing batch ${i + 1}/${batches.length} (${
          batch.length
        } records)...`
      );

      const { error: updateError } = await supabase
        .from("vote_changes")
        .upsert(batch, { onConflict: "id" });

      if (updateError) {
        console.error(`Error updating batch ${i + 1}:`, updateError);
      } else {
        successfulUpdates += batch.length;
        console.log(`Successfully updated batch ${i + 1}`);
      }
    }

    console.log(
      `Timestamp update complete. Updated ${successfulUpdates} out of ${updates.length} records.`
    );
  } catch (error) {
    console.error("Error updating timestamps:", error);
  }
}

// Run the update function
updateTimestamps()
  .then(() => {
    console.log("Script execution complete.");
  })
  .catch((err) => {
    console.error("Unhandled error during script execution:", err);
  });
