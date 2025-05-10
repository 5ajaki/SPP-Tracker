import { resolveENSName } from "../../lib/ensUtils";

/**
 * API endpoint to resolve ENS names for Ethereum addresses
 */
export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { address } = req.query;

  if (!address) {
    return res.status(400).json({ message: "Address is required" });
  }

  try {
    console.log(`API request to resolve ENS for address: ${address}`);
    const ensName = await resolveENSName(address);

    return res.status(200).json({
      address: address.toLowerCase(),
      ens_name: ensName,
    });
  } catch (error) {
    console.error(`Error in resolve-ens handler: ${error.message}`);
    return res.status(500).json({
      message: "Error resolving ENS name",
      error: error.message,
    });
  }
}
