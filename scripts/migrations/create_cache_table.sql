-- Function to create the cached_votes table
CREATE OR REPLACE FUNCTION create_cache_table()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Create the cached_votes table if it doesn't exist
  CREATE TABLE IF NOT EXISTS cached_votes (
    id SERIAL PRIMARY KEY,
    cache_key TEXT NOT NULL UNIQUE,
    cached_data JSONB NOT NULL,
    total_count INTEGER NOT NULL,
    cached_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );
  
  -- Create index on cache_key for faster lookups
  CREATE INDEX IF NOT EXISTS idx_cached_votes_cache_key ON cached_votes(cache_key);
  
  -- Create index on cached_at for cleanup operations
  CREATE INDEX IF NOT EXISTS idx_cached_votes_cached_at ON cached_votes(cached_at);
  
  -- Grant necessary permissions
  GRANT ALL ON cached_votes TO authenticated;
  GRANT ALL ON cached_votes TO service_role;
  GRANT USAGE ON SEQUENCE cached_votes_id_seq TO authenticated;
  GRANT USAGE ON SEQUENCE cached_votes_id_seq TO service_role;
END;
$$; 