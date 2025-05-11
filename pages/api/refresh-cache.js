import supabase from "../../lib/supabaseClient";

// Max age for cache entries in hours
const MAX_CACHE_AGE_HOURS = 24;

/**
 * API endpoint to clean up old cache entries and force refresh of specified cache entries
 */
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // Extract parameters
    const { refreshKeys = [], cleanupOnly = false } = req.body;
    let removedEntries = 0;
    let refreshedEntries = 0;

    // Clean up old cache entries (older than MAX_CACHE_AGE_HOURS)
    const oldDate = new Date();
    oldDate.setHours(oldDate.getHours() - MAX_CACHE_AGE_HOURS);

    const { data: oldEntries, error: cleanupError } = await supabase
      .from("cached_votes")
      .delete()
      .lt("cached_at", oldDate.toISOString())
      .select();

    if (cleanupError) {
      console.error("Error cleaning up old cache entries:", cleanupError);
    } else {
      removedEntries = oldEntries?.length || 0;
      console.log(`Removed ${removedEntries} old cache entries`);
    }

    // Force refresh specific cache entries if requested
    if (!cleanupOnly && refreshKeys.length > 0) {
      const { data: refreshedData, error: refreshError } = await supabase
        .from("cached_votes")
        .delete()
        .in("cache_key", refreshKeys)
        .select();

      if (refreshError) {
        console.error("Error refreshing cache entries:", refreshError);
      } else {
        refreshedEntries = refreshedData?.length || 0;
        console.log(`Refreshed ${refreshedEntries} cache entries`);
      }
    }

    return res.status(200).json({
      message: "Cache maintenance completed",
      removedEntries,
      refreshedEntries,
    });
  } catch (error) {
    console.error("Error in refresh-cache API:", error);
    return res.status(500).json({
      message: "Error refreshing cache",
      error: error.message,
    });
  }
}
