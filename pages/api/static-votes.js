import fs from "fs";
import path from "path";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const {
      filter = "all",
      showHighPower = "true",
      page = "0",
      pageSize = "25",
    } = req.query;

    // Convert to appropriate types
    const parsedPage = parseInt(page, 10);
    const parsedPageSize = parseInt(pageSize, 10);
    const parsedShowHighPower = showHighPower === "true";

    // Read the static vote events data
    const filePath = path.join(
      process.cwd(),
      "public",
      "static-vote-events.json"
    );
    const fileData = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    let events = fileData.events;

    // Apply filter
    if (filter === "new") {
      events = events.filter((event) => event.event_type === "new");
    } else if (filter === "change") {
      events = events.filter((event) => event.event_type === "change");
    }

    // Apply voting power filter
    if (parsedShowHighPower) {
      events = events.filter((event) => parseFloat(event.voting_power) >= 100);
    }

    // Calculate pagination
    const start = parsedPage * parsedPageSize;
    const end = start + parsedPageSize;
    const paginatedEvents = events.slice(start, end);

    return res.status(200).json({
      data: paginatedEvents,
      count: events.length,
      fromCache: true,
      isStaticData: true,
      dataGeneratedAt: fileData.exportedAt,
      summary: fileData.summary,
    });
  } catch (error) {
    console.error("Error serving static votes:", error);
    return res.status(500).json({
      message: "Error serving static vote data",
      error: error.message,
    });
  }
}
