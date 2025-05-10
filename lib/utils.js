/**
 * Returns the base URL for API calls
 * Works in both client-side and server-side contexts
 */
export function getBaseUrl() {
  if (typeof window !== "undefined") {
    // Client-side: use relative path
    return "";
  }

  // Server-side: need absolute URL
  // Use environment variables for deployed environments
  const vercelUrl =
    process.env.VERCEL_URL || process.env.NEXT_PUBLIC_VERCEL_URL;
  if (vercelUrl) {
    return `https://${vercelUrl}`;
  }

  // Fall back to localhost
  return process.env.API_BASE_URL || "http://localhost:3000";
}
