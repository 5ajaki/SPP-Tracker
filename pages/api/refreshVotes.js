import { pollForNewVotes } from "../../lib/voteFetcher";

export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // Poll for new votes
    const result = await pollForNewVotes();

    if (result.success) {
      return res.status(200).json({
        message:
          result.newEvents > 0
            ? `Detected ${result.newEvents} new vote events (${result.newVotes} new votes, ${result.changedVotes} changed votes)`
            : "No new vote events detected",
        ...result,
      });
    } else {
      return res.status(500).json({
        message: result.message || "Failed to poll for new votes",
        ...result,
      });
    }
  } catch (error) {
    console.error("Error in refreshVotes:", error);
    return res.status(500).json({
      message: "Error refreshing votes",
      error: error.message,
    });
  }
}
