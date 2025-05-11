// Script to seed data from a CSV file
import fs from "fs";
import path from "path";
import { importSeedData } from "../lib/voteFetcher";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config();

async function seedData() {
  try {
    console.log("Starting to seed data...");

    // Path to the seed data file
    const seedFilePath = path.join(
      process.cwd(),
      "notes",
      "votes-0x98c65ac02f738ddb430fcd723ea5852a45168550b3daf20f75d5d508ecf28aa1.csv"
    );

    // Check if file exists
    if (!fs.existsSync(seedFilePath)) {
      console.error("Seed data file not found");
      process.exit(1);
    }

    // Read the file
    const csvData = fs.readFileSync(seedFilePath, "utf8");

    // Import the seed data
    console.log("Importing seed data...");
    const result = await importSeedData(csvData);

    if (result.success) {
      console.log(
        `✅ Successfully imported ${result.votes_imported} votes as seed data`
      );
    } else {
      console.error("❌ Failed to import seed data:", result.error);
    }
  } catch (error) {
    console.error("Error seeding votes:", error);
  } finally {
    process.exit(0);
  }
}

// Run the function
seedData();
