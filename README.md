<!-- Last updated: May 11, 2025 -->

# 🗳️ ENS DAO Service Provider Vote Tracker

A web application that tracks changes to votes for the ENS DAO Service Provider Program Season II proposal in real-time, displaying a chronological feed of voting events. Watch the governance magic happen! ✨

## 🔑 Key Features

- ⏱️ Real-time vote monitoring (polls every 2 minutes)
- 📊 Vote change visualization with directional indicators
- 🔍 Filter options for different vote types
- 🌓 Dark/light mode support
- 💰 High-vote filtering (show the whales!)
- 📛 ENS name resolution

## 🎨 Visual Indicators

- **Border Colors**: 🟢 Green for new votes, 🔴 red for changed votes, 🔵 blue for seeded data
- **Vote Changes**: ↑↓ Direction arrows show how items moved in rankings
- **Expandable Cards**: 👆 Click to view detailed vote information

## 🛠️ Technology

This application uses Next.js with React for the frontend, Supabase (PostgreSQL) for data storage, and ethers.js for ENS name resolution. It's designed to be deployed on Vercel. Built with ❤️ for the ENS community!

## ⚙️ How It Works

The application monitors ENS DAO voting and tracks both new votes and vote changes. Each change is stored with a complete history, allowing users to see how votes evolve over time. The UI provides filtering options and visual indicators to help users understand voting patterns. No vote change is too small to escape our tracking! 👀

## 💻 Development

For contributors interested in the codebase:

1. 🗄️ Database uses `voter_events` for the vote history and `cached_votes` for performance
2. 📱 Frontend implements responsive design with dark mode support
3. 🧠 Vote comparison logic detects actual rank changes vs. incidental shifts

## 📜 License

[MIT](LICENSE) - Feel free to fork and enhance!
