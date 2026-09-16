# 🔭 Aperture — Real-time DEX Scanner on Arc

> Every pair. Every swap. Indexed instantly. Built on [Arc](https://arc.io) (USDC native gas, sub-second finality).

Aperture is a real-time DEX scanner and analytics dashboard for Arc Network.
Discover pools, swap tokens, earn yield, and track on-chain activity — all with
sub-second data freshness from a live indexer.

> **Aperture is built on Arc™.** Arc is a trademark of Circle Internet Group,
> Inc. and/or its affiliates. Aperture is an independent product and is not
> affiliated with or endorsed by Circle.

---

## ✨ Features

### Scanner & Explorer
- **Explore pairs** — Browse all live DEX pairs on Arc testnet with 24h volume, TVL, price change, and pool age
- **Pair detail** — Price charts, transaction history, liquidity depth, and trade panel per pair
- **Pulse** — Real-time activity feed: every swap, liquidity add/remove as it happens
- **Sparklines** — Mini price charts inline in the pair table
- **Live ticker bar** — Scrolling prices across all markets

### Trading
- **Swap** — On-chain token swaps (USDC ↔ cirBTC, USDC ↔ EURC) with real reserves
- **Earn** — Browse liquidity pools, stake LP tokens, track yield
- **Quick buy** — One-click swap modal from pair table

### Portfolio & Tools
- **Portfolio** — Wallet balance, token holdings, and transaction history
- **Tracker** — Search tokens and pairs by address or symbol
- **Watchlist** — Star favorite pairs for quick access

### Infrastructure
- **Live indexer** — SQLite-backed indexer syncing pairs, swaps, and reserves from Arc RPC
- **REST API** — Public endpoints for markets, reserves, pairs, swaps, and stats
- **Wallet integration** — Reown AppKit + wagmi (MetaMask, Rabby, WalletConnect)

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16, React 19, TypeScript, Tailwind CSS v4 |
| Web3 | wagmi 3, viem 2, Reown AppKit (WalletConnect) |
| Backend | Next.js Route Handlers (REST API) |
| Storage | SQLite (better-sqlite3) — local indexer |
| Charts | Custom canvas sparklines + candle charts |
| Chain | Arc Testnet (chainId 5042002, USDC native gas) |

---

## 🏗️ Architecture

```
┌────────────────────────────  Client (Next.js 16 app)  ───────────────────────────┐
│                                                                                    │
│  Landing  Explore  Pair Detail  Swap  Earn  Pulse  Portfolio  Tracker  Watchlist  │
│                                                                                    │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐  ┌────────────────────┐     │
│  │ wagmi/viem   │  │ Pair table   │  │ Trade panel │  │ Live trades feed   │     │
│  │ connectors   │  │ + sparklines │  │ + quick buy │  │ (real-time pulse)  │     │
│  └──────────────┘  └──────────────┘  └─────────────┘  └────────────────────┘     │
│            │                                                                       │
└────────────┼──────────────────────────────────────────────────────────────────────┘
             │ /api/* (REST, JSON)
┌────────────┼───────────────────  Next.js server  ─────────────────────────────────┐
│            │                                                                       │
│  /api/markets  ·  /api/reserves  ·  /api/indexer/* (pairs, swaps, pulse, stats)   │
│                                                                                    │
│  Indexer scheduler — polls Arc RPC, syncs to SQLite every N seconds               │
└────────────┼──────────────────────────────────────────────────────────────────────┘
             │ public RPC (rpc.testnet.arc.network)
┌────────────▼────────────────  Arc Testnet (chainId 5042002)  ─────────────────────┐
│                                                                                    │
│  USDC (native gas, 0x3600…0000)  ·  cirBTC  ·  EURC  ·  spot AMM pools             │
│                                                                                    │
└────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ (tested on Node 22)
- npm

### Install & Run

```bash
git clone https://github.com/Fauziyara/Aperture.git
cd arc-dashboard
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Production

```bash
npm run build
npm start            # or sit behind nginx / pm2
```

- Default port: 3001 (`next start -p 3001`)
- Health check: indexer syncs automatically on startup

---

## 🔌 API

| Method | Route | Description |
|---|---|---|
| `GET` | `/api/markets` | All markets with prices, 24h change, volume |
| `GET` | `/api/reserves` | Token reserves (USDC, cirBTC, EURC) |
| `GET` | `/api/indexer/pairs?limit=20` | All indexed DEX pairs |
| `GET` | `/api/indexer/pairs/:address` | Pair detail by contract address |
| `GET` | `/api/indexer/pairs/:address/swaps` | Swap history for a pair |
| `GET` | `/api/indexer/swaps?limit=50` | Recent swaps across all pairs |
| `GET` | `/api/indexer/pulse` | Real-time activity feed |
| `GET` | `/api/indexer/stats` | Aggregate stats (volume, txns, pairs) |
| `GET` | `/api/balances?address=0x…` | Wallet balances |
| `GET` | `/api/arc/tokens` | ARC token data |
| `GET` | `/api/arc/transfers` | ARC transfer history |
| `GET` | `/api/arc/holders` | ARC holder list |
| `GET` | `/api/arc/stats` | ARC network stats |

All responses are JSON with sub-second data freshness.

---

## 📁 Project Structure

```
arc-dashboard/
├── src/
│   ├── app/
│   │   ├── (marketing)/          # Landing page + marketing routes
│   │   │   ├── page.tsx          # Landing page
│   │   │   ├── explore/          # Pair explorer
│   │   │   ├── tracker/          # Token/pair search
│   │   │   └── watchlist/        # Saved pairs
│   │   ├── (app)/                # App routes (dark theme)
│   │   │   ├── swap/             # Swap interface
│   │   │   └── portfolio/        # Wallet portfolio
│   │   ├── pair/[address]/       # Pair detail page
│   │   ├── pulse/                # Real-time activity feed
│   │   ├── earn/                 # Liquidity pools
│   │   ├── docs/                 # Documentation page
│   │   ├── api/                  # REST API routes
│   │   │   ├── markets/          # Market data
│   │   │   ├── reserves/         # Token reserves
│   │   │   ├── indexer/          # Indexer API (pairs, swaps, pulse, stats)
│   │   │   ├── balances/         # Wallet balances
│   │   │   └── arc/              # ARC token data
│   │   ├── globals.css           # Global styles + responsive breakpoints
│   │   └── layout.tsx            # Root layout
│   ├── components/               # UI components
│   │   ├── pair-table.tsx        # Main pair table with sparklines
│   │   ├── pair-detail-*.tsx     # Pair detail components
│   │   ├── trade-panel.tsx       # Swap/trade interface
│   │   ├── quick-buy-modal.tsx   # Quick swap modal
│   │   ├── live-trades-feed.tsx  # Real-time trade feed
│   │   ├── header.tsx            # App header with nav
│   │   ├── footer.tsx            # Footer with links
│   │   ├── ticker-bar.tsx        # Scrolling price ticker
│   │   ├── sparkline.tsx         # Mini price charts
│   │   ├── candle-chart.tsx      # Candlestick chart
│   │   └── ui/                   # Base UI (button, input, badge, table)
│   └── lib/
│       ├── indexer/              # Indexer engine
│       │   ├── db.ts             # SQLite database layer
│       │   ├── sync.ts           # RPC sync logic
│       │   ├── scheduler.ts      # Auto-sync scheduler
│       │   └── arc-rpc.ts        # Arc RPC client
│       ├── wagmi-config.ts       # Wagmi chain config
│       ├── arc-rpc.ts            # Arc RPC helpers
│       ├── format.ts             # Formatting utilities
│       └── utils.ts              # General utilities
├── public/                       # Static assets (logos, icons)
├── package.json
└── README.md
```

---

## ⛓️ Arc Network Details

| Parameter | Value |
|---|---|
| Chain name | Arc Testnet |
| Chain ID | 5042002 |
| RPC | `https://rpc.testnet.arc.network` |
| Explorer | [testnet.arcscan.app](https://testnet.arcscan.app) |
| Gas token | USDC (native, ~$0.001/tx) |
| USDC address | `0x3600000000000000000000000000000000000000` |
| Finality | Sub-second |
| Bridge | CCTP (Circle Cross-Chain Transfer Protocol) |

---

## 🔐 Safety Notes

- Testnet funds only until mainnet is announced
- Always verify contract addresses before interacting
- Aperture does not custody funds — all swaps settle on-chain
- Never share seed phrases — Aperture never asks for them

---

## 📄 License

MIT — see [LICENSE](LICENSE)

## 🔗 Links

- **GitHub:** [github.com/Fauziyara/Aperture](https://github.com/Fauziyara/Aperture)
- **Aperture live:** [http://43.153.223.215](http://43.153.223.215)
- **Arc Network:** [arc.io](https://arc.io)
- **ArcScan:** [testnet.arcscan.app](https://testnet.arcscan.app)

---

Built with ❤️ on Arc
