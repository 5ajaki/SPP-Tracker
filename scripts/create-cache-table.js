const { createClient } = require("@supabase/supabase-js");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config({ path: ".env.local" });

// Create Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function createCacheTable() {
  console.log("Creating cached_votes table if it doesn't exist...");

  try {
    // Check if the table already exists
    const { error: checkError } = await supabase
      .from("cached_votes")
      .select("cache_key")
      .limit(1);

    // If we get a specific error about the relation not existing, create it
    if (checkError && checkError.code === "42P01") {
      console.log("Table does not exist, creating it now...");

      // Create the table using raw SQL
      const { error } = await supabase.rpc("create_cache_table", {});

      if (error) {
        throw error;
      }

      console.log("✅ Created cached_votes table successfully!");
    } else if (checkError) {
      throw checkError;
    } else {
      console.log("✅ cached_votes table already exists!");
    }

    // Test the cache functionality
    console.log("Testing cache functionality...");
    const testCacheKey = "test_" + Date.now();
    const testData = { test: true, timestamp: new Date().toISOString() };

    // Insert test data
    const { error: insertError } = await supabase.from("cached_votes").upsert({
      cache_key: testCacheKey,
      cached_data: testData,
      total_count: 1,
      cached_at: new Date().toISOString(),
    });

    if (insertError) {
      console.error("Error inserting test cache entry:", insertError);
    } else {
      console.log("✅ Successfully inserted test cache entry");

      // Retrieve the test data
      const { data, error: fetchError } = await supabase
        .from("cached_votes")
        .select("*")
        .eq("cache_key", testCacheKey)
        .single();

      if (fetchError) {
        console.error("Error retrieving test cache entry:", fetchError);
      } else {
        console.log(
          "✅ Successfully retrieved test cache entry:",
          data.cache_key
        );

        // Clean up test data
        const { error: deleteError } = await supabase
          .from("cached_votes")
          .delete()
          .eq("cache_key", testCacheKey);

        if (deleteError) {
          console.error("Error cleaning up test cache entry:", deleteError);
        } else {
          console.log("✅ Successfully cleaned up test cache entry");
        }
      }
    }

    console.log("✅ Cache setup complete!");
  } catch (error) {
    console.error("Error creating cache table:", error);
    process.exit(1);
  }
}

// Execute the function
createCacheTable().catch(console.error);
