import axios from "axios";

// Helper function to add retry logic with exponential backoff
async function fetchWithRetry(fn, retries = 3, delay = 1000) {
  try {
    return await fn();
  } catch (error) {
    if (retries <= 0) {
      throw error;
    }

    console.log(`Retrying ENS resolution, ${retries} attempts left...`);
    await new Promise((resolve) => setTimeout(resolve, delay));
    return fetchWithRetry(fn, retries - 1, delay * 2);
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { addresses } = req.body;

    if (!addresses || !Array.isArray(addresses) || addresses.length === 0) {
      return res.status(400).json({ error: "Invalid addresses provided" });
    }

    // Limit batch size to prevent too many concurrent requests
    const BATCH_SIZE = 10;
    const ensNames = {};

    // Process addresses in batches to avoid overwhelming the ENS service
    for (let i = 0; i < addresses.length; i += BATCH_SIZE) {
      const batch = addresses.slice(i, i + BATCH_SIZE);

      // Process batch in parallel with individual retries
      await Promise.allSettled(
        batch.map(async (address) => {
          try {
            // Skip invalid addresses
            if (
              !address ||
              typeof address !== "string" ||
              address.length < 10
            ) {
              return;
            }

            const ensName = await fetchWithRetry(async () => {
              // Add your ENS resolution logic here
              // This is a placeholder - implement the actual ENS resolution
              const response = await fetch(
                `https://api.ensideas.com/ens/resolve/${address}`
              );

              if (!response.ok) {
                throw new Error(
                  `ENS resolution failed with status: ${response.status}`
                );
              }

              const data = await response.json();
              return data.name || null;
            });

            if (ensName) {
              ensNames[address] = ensName;
            }
          } catch (error) {
            // Log the error but don't fail the whole batch
            console.error(
              `Error resolving ENS for ${address}: ${error.message}`
            );
          }
        })
      );

      // Add a small delay between batches to avoid rate limiting
      if (i + BATCH_SIZE < addresses.length) {
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    }

    res.status(200).json({ ens: ensNames });
  } catch (error) {
    console.error("Error resolving ENS names:", error);
    res.status(500).json({ error: "Failed to resolve ENS names" });
  }
}
