# Aperture — Documentation

> A real-time DEX pair scanner built on Arc Network.

---

## Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Tech Stack](#tech-stack)
4. [Project Structure](#project-structure)
5. [Pages & Routes](#pages--routes)
6. [API Endpoints](#api-endpoints)
7. [Components](#components)
8. [Indexer System](#indexer-system)
9. [Wallet Integration](#wallet-integration)
10. [Theming](#theming)
11. [Branding & Compliance](#branding--compliance)
12. [Installation](#installation)
13. [Configuration](#configuration)
14. [Deployment](#deployment)
15. [Arc Network Details](#arc-network-details)

---

## Overview

Aperture is a DEX (Decentralized Exchange) scanner and analytics dashboard built for the Arc Network testnet. It provides real-time visibility into liquidity pools, swap activity, token holdings, and portfolio tracking — all within a clean, dark-themed interface.

Aperture is an independent project. Arc is used as infrastructure, not as product identity.

---

## Features

### Explore (`/`)
- Browse all DEX pairs on Arc testnet
- 24H volume, total liquidity, combined market cap stats
- Gainer/loser tracking with sparkline charts
- Search, sort, and filter pairs by liquidity
- Watchlist functionality (star pairs)
- Live ticker bar with scrolling prices

### Pulse (`/pulse`)
- Real-time swap feed with animated entries
- Market activity overview (volume, txns, active pairs)
- Top gainers and losers
- Links to Arcscan for transaction details

### Tracker (`/pelacak`)
- Search any token or pair by contract address or symbol
- Quick lookup with result display
- Direct link to pair detail page

### Portfolio (`/portofolio`)
- Wallet balance overview
- Deposit via QR code or copy address
- Token holdings list with USD values
- Send/withdraw functionality
- Arc Testnet chain info (Chain ID: 5042002)

### Earn (`/earn`)
- Staking pools dashboard
- APY, TVL, and reward tokens
- Stake LP tokens and farm rewards

### Swap (`/swap`)
- On-chain token swaps via Presto DEX
- Percentage-based amount presets (25/50/75/100%)
- Slippage tolerance settings
- Real-time gas estimation
- Transaction history with Arcscan links
- Chain ID validation (warns if wrong network)

### Tools (`/alat`)
- Watchlist manager
- Monitor favorite pairs
- Quick access to tracked pairs

### Pair Detail (`/pair/[address]`)
- Full pair information (token0/token1)
- Candle chart and line chart views
- Trade history tabs (swaps, holders, transfers)
- Liquidity and volume stats
- Token info panel with contract details

---

## Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript 5 |
| UI Library | React 19 |
| Styling | Tailwind CSS v4 |
| Wallet | Reown AppKit + wagmi v3 |
| Blockchain | viem (EVM interactions) |
| Database | SQLite (better-sqlite3) |
| Icons | lucide-react |
| State | TanStack React Query v5 |
| Fonts | Inter + Space Grotesk |

---

## Project Structure

```
aperture/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx         # Root layout (metadata, theme, providers)
│   │   ├── page.tsx           # Explore page (main dashboard)
│   │   ├── pulse/             # Real-time swap feed
│   │   ├── pelacak/           # Token/pair search (Tracker)
│   │   ├── portofolio/        # Portfolio & wallet
│   │   ├── earn/              # Staking & farming
│   │   ├── swap/              # On-chain swap interface
│   │   ├── alat/              # Watchlist (Tools)
│   │   ├── pair/[address]/    # Pair detail page
│   │   └── api/               # API routes
│   │       ├── arc/            # Arc RPC proxy endpoints
│   │       └── indexer/        # Indexer data endpoints
│   ├── components/            # React components
│   ├── lib/                   # Utilities & configs
│   │   ├── arc-rpc.ts         # Arc testnet RPC client
│   │   ├── wagmi-config.ts    # Wallet config (Reown + wagmi)
│   │   ├── mock-data.ts       # Mock pairs & tokens
│   │   ├── format.ts          # Formatting utils
│   │   └── indexer/           # SQLite indexer system
│   └── globals.css            # Tailwind + theme variables
├── public/                    # Static assets
│   ├── aperture-logo.svg      # Aperture brand logo
│   └── arc-logo-official.svg  # Arc logo (from Circle Brand Kit)
├── data/                      # SQLite database
│   └── arc-indexer.db
├── package.json
├── next.config.ts
├── tsconfig.json
└── README.md
```

---

## Pages & Routes

| Route | Page | Description |
|-------|------|-------------|
| `/` | Explore | Main dashboard — all pairs, stats, search |
| `/pulse` | Aperture Pulse | Real-time swap feed & market activity |
| `/pelacak` | Tracker | Search tokens/pairs by address or symbol |
| `/portofolio` | Portfolio | Wallet balance, deposit, send |
| `/earn` | Earn | Staking pools & farming rewards |
| `/swap` | Swap | On-chain DEX swap (Presto DEX) |
| `/alat` | Tools | Watchlist manager |
| `/pair/[address]` | Pair Detail | Charts, trades, holders, transfers |

---

## API Endpoints

### Arc RPC Proxy

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/arc/stats` | GET | Arc network stats (block, gas, etc.) |
| `/api/arc/tokens` | GET | Token list from Arc testnet |
| `/api/arc/holders` | GET | Token holders (`?token=0x...&limit=20`) |
| `/api/arc/transfers` | GET | Recent transfers (`?token=0x...&symbol=...&decimals=...`) |

### Indexer

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/indexer/pairs` | GET | All indexed pairs (`?sort=&order=&limit=&offset=`) |
| `/api/indexer/pairs/[address]` | GET | Single pair details |
| `/api/indexer/pairs/[address]/swaps` | GET | Pair swap history |
| `/api/indexer/swaps` | GET | All recent swaps |
| `/api/indexer/pulse` | GET | Pulse feed data |
| `/api/indexer/stats` | GET | Indexer statistics |
| `/api/indexer/sync` | POST | Trigger manual sync |

---

## Components

### Layout
- `header.tsx` — Top navigation bar (Aperture logo, Arc logo, nav, wallet, theme toggle)
- `footer.tsx` — Footer (Built on Arc, trademark attribution)
- `bottom-nav.tsx` — Mobile bottom navigation
- `providers.tsx` — Wagmi + React Query providers

### Data Display
- `pair-table.tsx` — Main pairs table with search, sort, filter, watchlist
- `pair-chart.tsx` — Line chart for pair price history
- `candle-chart.tsx` — Candlestick chart
- `sparkline.tsx` — Mini sparkline charts for table rows
- `ticker-bar.tsx` — Scrolling price ticker

### Pair Detail
- `pair-detail-header.tsx` — Pair title, price, change
- `pair-detail-tabs.tsx` — Tabs (swaps, holders, transfers)
- `pair-stats-bar.tsx` — Liquidity, volume, fees stats
- `token-info-panel.tsx` — Token contract info
- `trade-history-tabs.tsx` — Trade history views

### Trading
- `trade-panel.tsx` — Swap panel with percentage presets (25/50/75/100%)
- `quick-buy-modal.tsx` — Quick buy modal
- `live-trades-feed.tsx` — Real-time trade feed

### Utility
- `wallet-button.tsx` — Reown AppKit wallet connect button
- `theme-toggle.tsx` — Dark/light theme switcher
- `token-logo.tsx` — Token icon with gradient fallback
- `sync-badge.tsx` — Indexer sync status indicator

---

## Indexer System

Aperture includes a custom indexer that syncs DEX pairs and swaps from Arc testnet to a local SQLite database.

### Architecture

```
Arc Testnet RPC  →  arc-rpc.ts  →  sync.ts  →  SQLite (arc-indexer.db)
                                   ↑
                              scheduler.ts (runs continuously via PM2)
```

### Files

| File | Purpose |
|------|---------|
| `lib/indexer/arc-rpc.ts` | Arc JSON-RPC client — reads blocks, logs, factory contracts |
| `lib/indexer/sync.ts` | Sync logic — fetches pairs, swaps, reserves from factories |
| `lib/indexer/db.ts` | SQLite database schema & queries |
| `lib/indexer/scheduler.ts` | Continuous sync scheduler (runs as PM2 process `arc-indexer`) |

### Factory Contracts

The indexer reads from known DEX factory contracts on Arc testnet (Presto DEX). It tracks:
- Pair creation events
- Swap events
- Reserve updates
- Token metadata (name, symbol, decimals)

### PM2 Processes

| Process | Purpose |
|---------|---------|
| `arc-dev` | Next.js production server (port 3000) |
| `arc-indexer` | Continuous indexer scheduler |

---

## Wallet Integration

### Reown AppKit + wagmi

Aperture uses **Reown AppKit** (formerly WalletConnect) for wallet connection, with **wagmi** for blockchain interactions.

### Configuration (`wagmi-config.ts`)

- **Network:** Arc Testnet (Chain ID: 5042002)
- **Native Currency:** USDC (18 decimals)
- **RPC:** `https://rpc.testnet.arc.network`
- **Explorer:** Arcscan (`https://testnet.arcscan.app`)
- **Project ID:** `aperture-dex-scanner`
- **Metadata:** Aperture branding (name, description, icon)
- **Theme:** Emerald accent (`#10b981`), dark mode default

### Features
- Connect/disconnect wallet
- View wallet address & balance
- Switch to Arc Testnet (chain ID validation)
- View on Arcscan
- Copy address
- Send/withdraw tokens

---

## Theming

### Dark/Light Toggle

- **Default:** Dark mode
- **Persistence:** `localStorage` key `aperture-theme`
- **No flash:** Inline script in `<head>` applies theme before hydration
- **Implementation:** Tailwind CSS v4 `@custom-variant dark` + CSS variables

### Color System

| Variable | Dark | Light |
|----------|------|-------|
| `--background` | Dark (#0a0a0a) | White |
| `--foreground` | White | Dark |
| `--accent` | Emerald (#10b981) | Emerald |
| `--border` | Subtle dark | Light gray |
| `--muted` | Dark gray | Light gray |

### Fonts
- **Body:** Inter
- **Heading:** Space Grotesk (via `--font-heading` CSS variable)

---

## Branding & Compliance

### Arc Brand Guidelines Compliance

Aperture follows the [Arc Brand Guidelines and Partner Toolkit](https://www.arc.io/brand-guidelines-and-partner-toolkit):

1. **Aperture is the primary brand** — logo is larger and more prominent
2. **Arc is infrastructure** — referenced as "built on Arc Network"
3. **Arc logo** — used from official Circle Brand Kit (NavyGradient variant), unmodified
4. **Arc logo size** — smaller than Aperture logo (52×18px vs 32×32px), 60% opacity
5. **Trademark** — ™ on first use, attribution in footer
6. **Product name** — no "Arc" in product or feature names
7. **Copywriting** — "built on Arc" / "available on Arc" (not "Arc app")

### Brand Assets

| Asset | File | Description |
|-------|------|-------------|
| Aperture Logo | `public/aperture-logo.svg` | Orbit + scanner core, emerald background |
| Arc Logo | `public/arc-logo-official.svg` | NavyGradient from Circle Brand Kit |
| Favicon | `public/aperture-logo.svg` | Aperture logo as favicon |

### Logo Placement

**Header:** `[Aperture logo 32px] Aperture │ [Arc logo 52px, 60% opacity]`

**Footer:** `Built on [Arc logo]` + `Arc is a trademark of Circle Internet Group, Inc. and/or its affiliates.`

---

## Installation

### Prerequisites

- Node.js 18+ (tested on Node 20)
- npm or yarn
- SQLite3 (for indexer)

### Steps

```bash
# Clone the repository
git clone https://github.com/mckenzie347/aperture.git
cd aperture

# Install dependencies
npm install

# Build
npm run build

# Start production server
npm start

# Start indexer (separate terminal)
npx tsx src/lib/indexer/scheduler.ts
```

The app will be available at `http://localhost:3000`.

---

## Configuration

### Environment

No environment variables required for basic operation. The indexer and RPC endpoints are hardcoded for Arc testnet.

### Key Files

| File | Purpose |
|------|---------|
| `src/lib/wagmi-config.ts` | Wallet & network config |
| `src/lib/arc-rpc.ts` | Arc RPC client (API-side) |
| `src/lib/indexer/arc-rpc.ts` | Arc RPC client (indexer-side) |
| `src/lib/mock-data.ts` | Mock pairs & tokens |
| `src/app/layout.tsx` | Metadata, title, description |
| `next.config.ts` | Next.js config |

---

## Deployment

### VPS Deployment (PM2)

```bash
# Build
npm run build

# Start Next.js server
pm2 start npm --name arc-dev -- start

# Start indexer
pm2 start "npx tsx src/lib/indexer/scheduler.ts" --name arc-indexer

# Save PM2 config
pm2 save
```

### PM2 Commands

```bash
pm2 restart arc-dev       # Restart web server
pm2 restart arc-indexer   # Restart indexer
pm2 logs arc-dev           # View server logs
pm2 logs arc-indexer      # View indexer logs
pm2 status                # Check all processes
```

### Current Deployment

- **VPS:** 43.153.223.215
- **Port:** 3000
- **PM2:** `arc-dev` (Next.js), `arc-indexer` (scheduler)
- **URL:** http://43.153.223.215:3000

---

## Arc Network Details

| Property | Value |
|----------|-------|
| Network Name | Arc Testnet |
| Chain ID | 5042002 |
| RPC URL | `https://rpc.testnet.arc.network` |
| Explorer | `https://testnet.arcscan.app` |
| Native Currency | USDC (18 decimals) |
| DEX | Presto DEX |
| Faucet | `https://faucet.circle.com/` |

### Token Addresses (Arc Testnet)

| Token | Symbol | Address |
|-------|--------|---------|
| Arc | ARC | `0xarc0000000000000000000000000000000000001` |
| USD Coin | USDC | `0xarc0000000000000000000000000000000000002` |
| Wrapped Ether | WETH | `0xarc0000000000000000000000000000000000003` |
| Wrapped BTC | WBTC | `0xarc0000000000000000000000000000000000004` |
| Dai | DAI | `0xarc0000000000000000000000000000000000005` |

---

## License

MIT

## Brand

Aperture is an independent project built on Arc Network.
Arc is a trademark of Circle Internet Group, Inc. and/or its affiliates.