import { ethers } from "ethers";
import supabase from "./supabaseClient";

// Create a provider using a public RPC URL
const ETHEREUM_RPC_URL =
  process.env.NEXT_PUBLIC_ETH_RPC_URL || "https://eth.drpc.org";
let provider;

// Initialize the provider lazily
function getProvider() {
  if (!provider) {
    provider = new ethers.providers.JsonRpcProvider(ETHEREUM_RPC_URL);
  }
  return provider;
}

// In-memory cache to avoid repeated lookups
const ensCache = new Map();

/**
 * Resolves an Ethereum address to an ENS name using ethers.js
 * @param {string} address - The Ethereum address to resolve
 * @returns {Promise<string|null>} - The ENS name if found, null otherwise
 */
export async function resolveENSName(address) {
  try {
    // Normalize and checksum the address
    const normalizedAddress = ethers.utils.getAddress(address.toLowerCase());

    // Check memory cache first
    if (ensCache.has(normalizedAddress)) {
      return ensCache.get(normalizedAddress);
    }

    // Then check database cache
    try {
      const { data: existingRecords } = await supabase
        .from("voter_events")
        .select("ens_name")
        .eq("voter_address", normalizedAddress.toLowerCase())
        .not("ens_name", "is", null)
        .limit(1);

      if (
        existingRecords &&
        existingRecords.length > 0 &&
        existingRecords[0].ens_name
      ) {
        const cachedName = existingRecords[0].ens_name;
        console.log(
          `Found cached ENS name in database for ${normalizedAddress}: ${cachedName}`
        );
        ensCache.set(normalizedAddress, cachedName);
        return cachedName;
      }
    } catch (dbError) {
      console.error(`Error checking database for ENS name: ${dbError.message}`);
    }

    // Not in cache, perform lookup with ethers.js
    console.log(`Looking up ENS name for ${normalizedAddress}...`);
    const provider = getProvider();
    const ensName = await provider.lookupAddress(normalizedAddress);

    // Store result in memory cache (even if null)
    ensCache.set(normalizedAddress, ensName);

    // If we found a name, update the database
    if (ensName) {
      console.log(`Resolved ENS name for ${normalizedAddress}: ${ensName}`);
      try {
        const { error } = await supabase
          .from("voter_events")
          .update({ ens_name: ensName })
          .eq("voter_address", normalizedAddress.toLowerCase());

        if (error) {
          console.error(
            `Error updating ENS name in database: ${error.message}`
          );
        } else {
          console.log(
            `Updated ENS name in database: ${normalizedAddress} -> ${ensName}`
          );
        }
      } catch (dbError) {
        console.error(
          `Database error when updating ENS name: ${dbError.message}`
        );
      }
    } else {
      console.log(`No ENS name found for ${normalizedAddress}`);
    }

    return ensName;
  } catch (error) {
    console.error(`Error resolving ENS name for ${address}: ${error.message}`);
    return null;
  }
}

/**
 * Formats an address for display, showing ENS name if available
 * @param {string} address - The Ethereum address
 * @param {string|null} ensName - The ENS name if known, or null to perform lookup
 * @returns {Promise<{address: string, displayName: string, ensName: string|null}>} - Formatted address info
 */
export async function formatAddress(address, ensName = null) {
  if (!address) return { address: "", displayName: "", ensName: null };

  try {
    // Normalize the address
    const normalizedAddress = address.toLowerCase();

    // If ENS name wasn't provided, try to resolve it
    if (ensName === null) {
      ensName = await resolveENSName(normalizedAddress);
    }

    // Format address for display (truncated)
    const shortAddress = `${normalizedAddress.substring(
      0,
      6
    )}...${normalizedAddress.substring(normalizedAddress.length - 4)}`;

    // Return formatted info
    return {
      address: normalizedAddress,
      displayName: ensName || shortAddress,
      ensName: ensName,
    };
  } catch (error) {
    console.error(`Error formatting address: ${error.message}`);
    return {
      address: address.toLowerCase(),
      displayName: `${address.substring(0, 6)}...${address.substring(
        address.length - 4
      )}`,
      ensName: null,
    };
  }
}

/**
 * Batch resolves ENS names for multiple addresses
 * @param {string[]} addresses - Array of Ethereum addresses
 * @returns {Promise<Map<string, string|null>>} - Map of addresses to ENS names
 */
export async function batchResolveENS(addresses) {
  const results = new Map();
  const batchSize = 5;
  const uniqueAddresses = [
    ...new Set(addresses.map((addr) => addr.toLowerCase())),
  ];
  const pendingLookups = [];

  console.log(`Batch resolving ${uniqueAddresses.length} ENS names...`);

  // First, check memory cache and collect addresses missing from cache
  for (const address of uniqueAddresses) {
    try {
      const normalizedAddress = ethers.utils.getAddress(address);

      // Check memory cache first
      if (ensCache.has(normalizedAddress)) {
        results.set(address, ensCache.get(normalizedAddress));
      } else {
        pendingLookups.push(address);
      }
    } catch (error) {
      console.error(`Error normalizing address ${address}:`, error);
      results.set(address, null);
    }
  }

  // Next, check database cache for remaining addresses
  if (pendingLookups.length > 0) {
    try {
      const { data: cachedEntries } = await supabase
        .from("voter_events")
        .select("voter_address, ens_name")
        .in("voter_address", pendingLookups)
        .not("ens_name", "is", null);

      // Process cached entries
      if (cachedEntries && cachedEntries.length > 0) {
        for (const entry of cachedEntries) {
          try {
            const normalizedAddress = ethers.utils.getAddress(
              entry.voter_address
            );
            ensCache.set(normalizedAddress, entry.ens_name);
            results.set(entry.voter_address, entry.ens_name);

            // Remove from pending lookups
            const index = pendingLookups.indexOf(entry.voter_address);
            if (index !== -1) {
              pendingLookups.splice(index, 1);
            }
          } catch (error) {
            console.error(
              `Error processing cached entry for ${entry.voter_address}:`,
              error
            );
          }
        }
      }
    } catch (error) {
      console.error("Error fetching cached ENS names from database:", error);
    }
  }

  // Finally, perform lookups for remaining addresses in batches
  for (let i = 0; i < pendingLookups.length; i += batchSize) {
    const batch = pendingLookups.slice(i, i + batchSize);

    console.log(
      `Processing batch ${i / batchSize + 1} of ${Math.ceil(
        pendingLookups.length / batchSize
      )}`
    );

    await Promise.all(
      batch.map(async (address) => {
        try {
          const ensName = await resolveENSName(address);
          results.set(address, ensName);
        } catch (error) {
          console.error(`Error resolving ENS for ${address}:`, error);
          results.set(address, null);
        }
      })
    );

    // Add a small delay between batches to avoid rate limiting
    if (i + batchSize < pendingLookups.length) {
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }

  return results;
}

/**
 * Pre-fetches ENS names for vote events to avoid individual lookups
 * @param {Array} voteEvents - Array of vote events with voter_address property
 * @returns {Promise<Map<string, string|null>>} - Map of addresses to ENS names
 */
export async function prefetchENSNames(voteEvents) {
  if (!voteEvents || voteEvents.length === 0) {
    return new Map();
  }

  // Extract unique addresses without ENS names already resolved
  const addressesToResolve = voteEvents
    .filter((event) => !event.ens_name && event.voter_address)
    .map((event) => event.voter_address);

  // If no addresses need resolution, return empty map
  if (addressesToResolve.length === 0) {
    return new Map();
  }

  console.log(
    `Pre-fetching ${addressesToResolve.length} ENS names for vote events`
  );
  return batchResolveENS(addressesToResolve);
}

export default {
  resolveENSName,
  formatAddress,
  batchResolveENS,
  prefetchENSNames,
};
