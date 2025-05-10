<!-- Last updated: May 10, 2024 -->

# ENS DAO Service Provider Vote Tracker

A web application that tracks and displays changes in the ENS DAO Service Provider votes. The application fetches vote data from the ENS DAO API and monitors changes in voting patterns.

## Features

- Real-time tracking of vote changes
- Persistent storage of vote history using Supabase
- CSV backup creation when changes are detected
- Visual highlighting of ranking changes
- Automatic refresh every 60 seconds

## Tech Stack

- Next.js - React framework
- Supabase - Database and storage
- Axios - API requests

## Setup

1. Clone the repository:

```bash
git clone <repository-url>
cd SPP-Tracker
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env.local` file with your Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

4. Set up your Supabase project:

   - Create a table called `vote_changes` with the following structure:

   ```sql
   create table vote_changes (
     id uuid default uuid_generate_v4() primary key,
     type text not null,
     voter_address text not null,
     old_ranking jsonb,
     new_ranking jsonb,
     voting_power numeric,
     timestamp timestamptz,
     created_at timestamptz default now()
   );
   ```

   - Create a storage bucket called `vote-data`
   - Set up RLS policies to allow public access to the table and bucket

5. Run the development server:

```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

This application can be easily deployed to Vercel:

1. Push your code to a GitHub repository
2. Connect the repository to Vercel
3. Add your Supabase environment variables in the Vercel dashboard
4. Deploy!

## How It Works

1. The application fetches vote data from the ENS DAO API
2. Changes in votes are detected by comparing current data with previous data
3. Changes are stored in Supabase for persistence
4. CSV backups are created and stored in Supabase Storage
5. Changes are displayed in the UI with visual highlights

## Notes

- The 60-second auto-check will work in the deployed Vercel app as long as the browser tab is open
- Historical changes are loaded when a user first visits the site
- All changes are persisted in the database, even when no users are actively viewing the site
