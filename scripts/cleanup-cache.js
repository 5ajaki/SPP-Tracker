const axios = require("axios");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config({ path: ".env.local" });

async function cleanupCache() {
  console.log("Cleaning up old cache entries...");

  try {
    // Call the API to clean up old entries
    const response = await axios.post(
      "http://localhost:3000/api/refresh-cache",
      {
        cleanupOnly: true,
      }
    );

    console.log("Cache cleanup complete!");
    console.log(`Removed ${response.data.removedEntries} old cache entries`);
  } catch (error) {
    console.error(
      "Error cleaning up cache:",
      error.response?.data || error.message
    );
    process.exit(1);
  }
}

// Execute the function
cleanupCache().catch(console.error);
