import { supabase } from "../../lib/supabaseClient";

export default async function handler(req, res) {
  try {
    // Test inserting a record
    const { data, error } = await supabase
      .from("vote_changes")
      .insert({
        type: "test",
        voter_address: "0xTestAddress",
        old_ranking: ["Item 1", "Item 2"],
        new_ranking: ["Item 2", "Item 1"],
        voting_power: 100,
        timestamp: new Date(),
      })
      .select();

    if (error) throw error;

    // Test storage bucket
    const { data: storageData, error: storageError } = await supabase.storage
      .from("vote-data")
      .upload(`test-${Date.now()}.txt`, "Test file content");

    if (storageError) throw storageError;

    res.status(200).json({
      success: true,
      message: "Supabase connection successful!",
      data,
      storageData,
    });
  } catch (error) {
    console.error("Error testing Supabase connection:", error);
    res.status(500).json({
      success: false,
      error: error.message,
      details: error,
    });
  }
}
