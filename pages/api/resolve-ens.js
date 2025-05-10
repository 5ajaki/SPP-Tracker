import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  const { addresses } = req.body;

  if (!addresses || !Array.isArray(addresses) || addresses.length === 0) {
    return res.status(400).json({ error: "Addresses array is required" });
  }

  try {
    // Limit the number of addresses to process at once (to avoid rate limiting)
    const uniqueAddresses = [...new Set(addresses)];
    const addressBatch = uniqueAddresses.slice(0, 50);

    // Process ENS resolutions in parallel
    const resolutionPromises = addressBatch.map(async (address) => {
      try {
        const response = await axios.get(
          `https://api.ensideas.com/ens/resolve/${address}`
        );
        return {
          address,
          name: response.data.name || null,
        };
      } catch (error) {
        console.error(`Error resolving ENS for ${address}:`, error.message);
        return { address, name: null };
      }
    });

    const resolutions = await Promise.all(resolutionPromises);

    // Convert to a map of address -> name
    const ensMap = {};
    resolutions.forEach((resolution) => {
      if (resolution.name) {
        ensMap[resolution.address] = resolution.name;
      }
    });

    res.status(200).json({ ens: ensMap });
  } catch (error) {
    console.error("Error resolving ENS names:", error);
    res.status(500).json({
      error: "Failed to resolve ENS names",
      message: error.message,
    });
  }
}
