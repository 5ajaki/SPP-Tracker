import supabase from "../../lib/supabaseClient";
import { resolveENSName, batchResolveENS } from "../../lib/ensUtils";

/**
 * API endpoint to resolve missing ENS names
 * Can be called with ?address=0x123... to resolve a specific address
 * Or with no parameters to resolve all addresses without ENS names
 */
export default async function handler(req, res) {
  if (req.method !== "GET" && req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { address } = req.query;

    // If address is provided, resolve just that one
    if (address) {
      // Call the resolveENSName function directly
      const ensName = await resolveENSName(address);

      return res.status(200).json({
        resolved: ensName ? 1 : 0,
        results: [
          {
            address: address.toLowerCase(),
            ens_name: ensName,
          },
        ],
      });
    }

    // Otherwise, get all addresses without ENS names
    const { data: addresses, error } = await supabase
      .from("voter_events")
      .select("voter_address")
      .is("ens_name", null)
      .order("discovered_at", { ascending: false });

    if (error) {
      throw new Error(`Database error: ${error.message}`);
    }

    // Filter to unique addresses only
    const uniqueAddresses = [...new Set(addresses.map((a) => a.voter_address))];

    // Limit to first 10 to avoid overloading the API
    const addressesToProcess = uniqueAddresses.slice(0, 10);

    if (addressesToProcess.length === 0) {
      return res.status(200).json({
        message: "No addresses without ENS names found",
        resolved: 0,
      });
    }

    console.log(
      `Batch resolving ENS names for ${addressesToProcess.length} addresses`
    );

    // Resolve addresses in batch
    const ensResults = await batchResolveENS(addressesToProcess);

    // Format results for response
    const results = Array.from(ensResults.entries()).map(
      ([address, ensName]) => ({
        address,
        ens_name: ensName,
      })
    );

    const resolvedCount = results.filter((r) => r.ens_name).length;

    return res.status(200).json({
      message: `Processed ${addressesToProcess.length} addresses, resolved ${resolvedCount} ENS names`,
      resolved: resolvedCount,
      remaining: uniqueAddresses.length - addressesToProcess.length,
      results,
    });
  } catch (error) {
    console.error(`Error resolving ENS names: ${error.message}`);
    return res.status(500).json({
      message: "Error resolving ENS names",
      error: error.message,
    });
  }
}
