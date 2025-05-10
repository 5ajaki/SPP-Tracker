# ENS DAO Vote Change Tracker

A simple web application that tracks changes in votes for the ENS DAO Service Provider Program Season II selection.

## Features

- Real-time tracking of vote changes
- Visual comparison between previous and new rankings
- Highlights for added, removed, or moved items
- Automatic refresh every 60 seconds
- Manual refresh button
- Mobile-friendly design

## How It Works

The application fetches data from the ENS DAO API endpoint and compares the latest vote data with the previously stored data to detect changes. When a voter changes their vote, the application displays a card showing the previous and new rankings side by side.

## Development

### Prerequisites

- Node.js (14.x or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Run the development server:

```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment

This application is designed to be deployed on Vercel.

### Deploying to Vercel

1. Push your code to GitHub
2. Import your repository in Vercel Dashboard
3. Deploy

Alternatively, you can use the Vercel CLI:

```bash
npm install -g vercel
vercel
```

## API Endpoints

The application includes a serverless API endpoint to fetch vote data from the ENS DAO API:

- `/api/votes` - Fetches the current vote data for the ENS DAO Service Provider Program Season II selection

## Technology Stack

- Next.js
- React
- Axios
- CSS (without any external libraries)

## License

MIT
