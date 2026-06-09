# EcoPulse AI 🌱

> AI-powered carbon footprint awareness platform. Understand, track, and reduce your environmental impact with intelligent insights, gamification, and personalized recommendations.

![EcoPulse AI](https://img.shields.io/badge/Status-Production_Ready-10b981?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)
![React](https://img.shields.io/badge/React-19-61dafb?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?style=flat-square&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-7-646cff?style=flat-square&logo=vite)
![Tailwind](https://img.shields.io/badge/Tailwind-4-38bdf8?style=flat-square&logo=tailwindcss)

## ✨ Features

- **AI Personalized Insights** — Context-aware recommendations, not generic eco-tips
- **Pulse AI Chatbot** — Real-time, intelligent sustainability guidance
- **Smart Footprint Calculator** — 12-question assessment in 60 seconds
- **Premium Analytics Dashboard** — Weekly, monthly, category-wise tracking with Recharts
- **Eco Challenges & Gamification** — XP, badges, streaks, leaderboard feel
- **Carbon Reduction Goals** — SMART goal setting with milestone celebrations
- **Dark/Light Mode** — Beautiful in both, with smooth transitions
- **Glassmorphism UI** — Premium futuristic eco-tech design
- **Mobile Responsive** — Optimized for every screen size
- **Accessibility** — ARIA labels, keyboard navigation, semantic HTML

## 🚀 Tech Stack

- **React 19** with TypeScript
- **Vite 7** for blazing-fast builds
- **Tailwind CSS 4** with custom design tokens
- **Framer Motion** for premium animations
- **Recharts** for analytics visualizations
- **Zustand** for state management (with persistence)
- **Firebase** for auth + database (optional, falls back to local)
- **Lucide React** for icons
- **React Router** for navigation

## 📁 Project Structure

```
src/
├── components/        # Reusable UI components
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   └── ui/            # Base UI primitives
│       ├── Button.tsx
│       ├── Card.tsx
│       └── Primitives.tsx
├── pages/             # Route components
│   ├── Landing.tsx
│   ├── Dashboard.tsx
│   ├── Calculator.tsx
│   ├── Insights.tsx
│   ├── Chat.tsx
│   ├── Challenges.tsx
│   ├── Goals.tsx
│   ├── Profile.tsx
│   ├── Login.tsx
│   ├── Signup.tsx
│   ├── Features.tsx
│   ├── HowItWorks.tsx
│   └── About.tsx
├── services/          # Business logic
│   ├── carbonEngine.ts
│   ├── chatbot.ts
│   └── firebase.ts
├── store/             # State management
│   └── appStore.ts
├── hooks/             # Custom hooks
│   └── useInView.ts
├── utils/             # Utilities
│   └── cn.ts
├── types/             # TypeScript definitions
│   └── index.ts
└── App.tsx            # Root component
```

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local
# (Edit .env.local with your Firebase credentials — optional, app works in demo mode)

# Run development server
npm run dev

# Build for production
npm run build
```

### Demo Mode

The app works out of the box in **demo mode** without any Firebase setup. Click "Try demo — no signup" on the auth screens to explore with sample data.

### Firebase Setup (Optional, for production)

1. Create a project at [Firebase Console](https://console.firebase.google.com)
2. Enable Email/Password and Google authentication
3. Copy your config to `.env.local`
4. The app automatically detects the configuration and switches to real auth

## 🎨 Design System

- **Color palette**: Green → Cyan eco-tech gradient
- **Typography**: Inter (body) + Space Grotesk (display)
- **Theme**: Glassmorphism + subtle mesh gradients
- **Motion**: Framer Motion with spring physics

## 🌐 Deployment

Deploy to Vercel with one click:

```bash
vercel
```

Or any static host:

```bash
npm run build
# Deploy the dist/ folder
```

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

## 🤝 Contributing

PRs welcome. For major changes, please open an issue first.

---

Built with 💚 for a habitable planet.
