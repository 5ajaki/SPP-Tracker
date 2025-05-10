// API endpoint to fetch votes data from ENS DAO
import axios from "axios";
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

// Store CSV data in Supabase
async function storeCSVData(csvData, changes) {
  try {
    // Store the CSV backup
    const timestamp = new Date().toISOString();
    const { data: csvBackup, error: csvError } = await supabase.storage
      .from("vote-data")
      .upload(`backups/${timestamp}.csv`, csvData);

    if (csvError) throw csvError;

    // Store the changes if any are provided
    if (changes && changes.length > 0) {
      const { data: changeData, error: changeError } = await supabase
        .from("vote_changes")
        .insert(
          changes.map((change) => ({
            ...change,
            created_at: new Date().toISOString(),
          }))
        );

      if (changeError) throw changeError;
    }

    return true;
  } catch (error) {
    console.error("Error storing data in Supabase:", error);
    return false;
  }
}

export default async function handler(req, res) {
  try {
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

    // If changes are provided in the request body, store them along with the CSV
    const changes = req.body?.changes;
    await storeCSVData(response.data, changes);

    res.status(200).send(response.data);
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
