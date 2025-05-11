import supabase from "../../lib/supabaseClient";

// Cache expiration time in milliseconds (10 minutes)
const CACHE_EXPIRATION = 10 * 60 * 1000;

/**
 * API endpoint to get cached vote events or fetch and cache them if not available
 */
export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // Extract query parameters
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

    // Create a cache key based on the query parameters
    const cacheKey = `${filter}_${parsedShowHighPower}_${parsedPage}_${parsedPageSize}`;

    // Check if we have a valid cache entry
    const { data: cacheEntry, error: cacheError } = await supabase
      .from("cached_votes")
      .select("*")
      .eq("cache_key", cacheKey)
      .single();

    if (!cacheError && cacheEntry) {
      const cacheAge = Date.now() - new Date(cacheEntry.cached_at).getTime();

      // Return cached data if it's still fresh
      if (cacheAge < CACHE_EXPIRATION) {
        console.log(`Cache hit for key: ${cacheKey}`);
        return res.status(200).json({
          data: JSON.parse(cacheEntry.cached_data),
          count: cacheEntry.total_count,
          fromCache: true,
          cacheAge: Math.round(cacheAge / 1000), // in seconds
        });
      }

      console.log(`Cache expired for key: ${cacheKey}, fetching fresh data`);
    } else {
      console.log(`Cache miss for key: ${cacheKey}, fetching fresh data`);
    }

    // Calculate pagination range
    const start = parsedPage * parsedPageSize;
    const end = start + parsedPageSize - 1;

    // Build the query
    let query = supabase
      .from("voter_events")
      .select("*", { count: "exact" })
      .order("discovered_at", { ascending: false });

    // Apply filter
    if (filter === "new") {
      query = query.eq("event_type", "new");
    } else if (filter === "change") {
      query = query.eq("event_type", "change");
    }

    // Apply voting power filter
    if (parsedShowHighPower) {
      query = query.gte("voting_power", 100);
    }

    // Make sure we're getting distinct records by vote_event_id to avoid duplicates
    // in case there's an issue with the data
    query = query.select("*, vote_event_id").range(start, end);

    // Execute the query
    const { data, error, count } = await query;

    if (error) {
      throw error;
    }

    // Ensure unique vote_event_ids if there are any duplicates
    const uniqueEventMap = new Map();
    data.forEach((event) => {
      if (!uniqueEventMap.has(event.vote_event_id)) {
        uniqueEventMap.set(event.vote_event_id, event);
      }
    });

    // Convert back to array
    const uniqueData = Array.from(uniqueEventMap.values());

    // Store the results in cache
    const { error: insertError } = await supabase.from("cached_votes").upsert(
      {
        cache_key: cacheKey,
        cached_data: JSON.stringify(uniqueData),
        total_count: count,
        cached_at: new Date().toISOString(),
      },
      { onConflict: "cache_key" }
    );

    if (insertError) {
      console.error("Error caching vote data:", insertError);
    } else {
      console.log(`Cached vote data for key: ${cacheKey}`);
    }

    // Return the fresh data
    return res.status(200).json({
      data: uniqueData,
      count,
      fromCache: false,
    });
  } catch (error) {
    console.error("Error in cached-votes API:", error);
    return res.status(500).json({
      message: "Error fetching vote events",
      error: error.message,
    });
  }
}
