import fs from "fs";
import path from "path";
import { importSeedData } from "../../lib/voteFetcher";

export default async function handler(req, res) {
  // Only allow in development mode
  if (process.env.NODE_ENV !== "development") {
    return res.status(404).json({ message: "Not found" });
  }

  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // Path to the seed data file
    const seedFilePath = path.join(
      process.cwd(),
      "notes",
      "votes-0x98c65ac02f738ddb430fcd723ea5852a45168550b3daf20f75d5d508ecf28aa1.csv"
    );

    // Check if file exists
    if (!fs.existsSync(seedFilePath)) {
      return res.status(404).json({ message: "Seed data file not found" });
    }

    // Read the file
    const csvData = fs.readFileSync(seedFilePath, "utf8");

    // Import the seed data
    const result = await importSeedData(csvData);

    if (result.success) {
      return res.status(200).json({
        success: true,
        message: `Successfully imported ${result.votes_imported} votes as seed data from May 10, 2025`,
        ...result,
      });
    } else {
      return res.status(500).json({
        success: false,
        message: "Failed to import seed data",
        error: result.error,
      });
    }
  } catch (error) {
    console.error("Error seeding votes:", error);
    return res.status(500).json({
      message: "Error seeding votes",
      error: error.message,
    });
  }
}
