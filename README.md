<!-- Last updated: May 10, 2024 -->

# ENS DAO Service Provider Vote Tracker

A web application to track changes to votes for the ENS DAO Service Provider Program Season II proposal. This application monitors vote changes in real-time and displays a chronological feed of voting events.

## Features

- Polls the ENS DAO voting API every 120 seconds
- Displays a feed of vote events in a card-based UI
- Shows both new votes and changed votes
- Filters for viewing different types of vote events
- Stores complete vote history in a Supabase database
- All historical vote data is retained (nothing is ever deleted or overwritten)
- ENS name resolution using ethers.js (with caching)
- Visual indicators for different vote types with colored borders
- Vote change highlighting for added, moved, and removed items
- Collapsible vote cards with "Expand All" functionality
- Filter option to show only votes over 100 $ENS (enabled by default)
- Database-backed query caching for improved performance

## Visual Indicators

- **Border Colors**:
  - Green: New votes
  - Red: Changed votes
  - Blue: Seed data
- **Vote Change Highlighting**:
  - Green background: Newly added items
  - Orange background: Items that moved positions
  - Red strikethrough: Removed items

## Tech Stack

- **Frontend**: Next.js, React
- **Backend**: Next.js API routes, Supabase
- **Database**: PostgreSQL (via Supabase)
- **Blockchain**: ethers.js for ENS resolution
- **Deployment**: Vercel

## Database Structure

The application uses two main tables:

### `voter_events`

Stores the chronological stream of vote events (both new votes and vote changes):

- `vote_event_id`: Primary key (serial)
- `voter_address`: Ethereum address of the voter
- `voting_power`: Voting power of the voter
- `choice_ranking`: The current vote selections
- `event_type`: Either 'new' (first vote) or 'change' (vote modification)
- `previous_ranking`: Previous vote selections (only for change events)
- `ens_name`: ENS name of the voter (if resolved)
- `discovered_at`: When the vote or change was discovered
- `is_seed`: Whether this is from seed data (true) or live updates (false)

### `cached_votes`

Caches filtered query results for improved performance:

- `id`: Primary key (serial)
- `cache_key`: Unique key based on filter parameters
- `cached_data`: JSON data of the query results
- `total_count`: Total number of matching records
- `cached_at`: When the cache entry was created

## Setup

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env.local` file with your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   NEXT_PUBLIC_ETH_RPC_URL=your-ethereum-rpc-url
   ```
4. Set up the caching table:
   ```
   npm run setup-cache
   ```
5. Run the development server:
   ```
   npm run dev
   ```

## Seeding Initial Data

When the application starts with an empty database, you'll see a "Import Seed Data" button that will import the initial seed data from the votes CSV file. The seed data will be marked with a timestamp of May 10, 2025 at 2:00 PM Eastern time.

## How the Vote Monitoring Works

1. The application polls the ENS DAO API every 120 seconds automatically
2. New votes are compared against the existing data
3. If a new vote or a vote change is detected, it's added to the database
4. The UI updates to show the latest vote events
5. ENS names are resolved and cached for Ethereum addresses

## Filtering and UI Controls

You can filter the vote events by:

- All Events (default)
- New Votes (first-time voters)
- Changed Votes (voters who modified their ballot)

Additional UI options:

- "Only show votes over 100 $ENS" checkbox (enabled by default)
- "Expand All" / "Collapse All" button to manage vote card visibility

## Performance Optimization

The application uses a database-backed caching system to improve performance:

- Query results are cached for 10 minutes
- New votes automatically invalidate relevant cache entries
- Cache entries older than 24 hours are automatically removed
- The UI shows an indicator when viewing cached data
- The cache can be manually reset with:
  ```
  npm run cleanup-cache
  ```

## Deploying

The application is set up to be deployed on Vercel, with its database hosted on Supabase.

## License

[MIT](LICENSE)
