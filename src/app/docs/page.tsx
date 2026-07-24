import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export const metadata = {
  title: "Aperture — Documentation",
  description: "Aperture DEX Scanner documentation — features, architecture, API, and deployment guide.",
};

export default function DocsPage() {
  return (
    <>
      <Header active="Docs" />
      <main className="flex-1 w-full px-4 py-8 mx-auto max-w-4xl">
        {/* Hero */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
            Aperture <span className="text-emerald-400">Docs</span>
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Documentation for Aperture — a real-time DEX pair scanner built on Arc Network
          </p>
        </div>

        {/* Quick Nav */}
        <div className="mb-10 grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { href: "#overview", label: "Overview" },
            { href: "#features", label: "Features" },
            { href: "#tech", label: "Tech Stack" },
            { href: "#structure", label: "Structure" },
            { href: "#api", label: "API" },
            { href: "#indexer", label: "Indexer" },
            { href: "#wallet", label: "Wallet" },
            { href: "#deploy", label: "Deploy" },
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-lg border border-border bg-muted/30 px-3 py-2 text-center text-xs font-medium text-muted-foreground transition-colors hover:bg-emerald-500/10 hover:text-emerald-400"
            >
              {item.label}
            </a>
          ))}
        </div>

        {/* Overview */}
        <section id="overview" className="mb-10 scroll-mt-20">
          <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
            <span className="text-emerald-400">01</span> Overview
          </h2>
          <div className="space-y-2 text-sm text-muted-foreground leading-relaxed">
            <p>
              <span className="text-foreground font-medium">Aperture</span> is a DEX (Decentralized Exchange) scanner and analytics dashboard built for the Arc Network testnet. It provides real-time visibility into liquidity pools, swap activity, token holdings, and portfolio tracking.
            </p>
            <p>
              Aperture is an independent project. Arc is used as infrastructure, not as product identity.
            </p>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="mb-10 scroll-mt-20">
          <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
            <span className="text-emerald-400">02</span> Features
          </h2>
          <div className="space-y-3">
            {[
              { icon: "📊", name: "Explore", desc: "Browse all DEX pairs on Arc testnet — 24H volume, liquidity, market cap, gainers/losers, sparkline charts, search, sort, filter, watchlist" },
              { icon: "⚡", name: "Pulse", desc: "Real-time swap feed with animated entries, market activity overview, top gainers and losers" },
              { icon: "🔍", name: "Tracker", desc: "Search any token or pair by contract address or symbol — quick lookup with direct links" },
              { icon: "💼", name: "Portfolio", desc: "Wallet balance overview, deposit via QR code, token holdings with USD values, send/withdraw" },
              { icon: "🌾", name: "Earn", desc: "Staking pools dashboard — APY, TVL, reward tokens, stake LP tokens and farm rewards" },
              { icon: "🔄", name: "Swap", desc: "On-chain token swaps via Presto DEX — percentage presets (25/50/75/100%), slippage control, gas estimation" },
              { icon: "⭐", name: "Tools", desc: "Watchlist manager — monitor favorite pairs with quick access" },
              { icon: "📈", name: "Pair Detail", desc: "Full pair info — candle chart, line chart, trade history, holders, transfers, liquidity stats" },
            ].map((f) => (
              <div key={f.name} className="rounded-lg border border-border bg-muted/20 p-4">
                <div className="flex items-start gap-3">
                  <span className="text-xl">{f.icon}</span>
                  <div>
                    <h3 className="font-semibold text-sm text-foreground">{f.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{f.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Tech Stack */}
        <section id="tech" className="mb-10 scroll-mt-20">
          <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
            <span className="text-emerald-400">03</span> Tech Stack
          </h2>
          <div className="overflow-hidden rounded-lg border border-border">
            <table className="w-full text-sm">
              <tbody>
                {[
                  ["Framework", "Next.js 16 (App Router, Turbopack)"],
                  ["Language", "TypeScript 5"],
                  ["UI Library", "React 19"],
                  ["Styling", "Tailwind CSS v4"],
                  ["Wallet", "Reown AppKit + wagmi v3"],
                  ["Blockchain", "viem (EVM interactions)"],
                  ["Database", "SQLite (better-sqlite3)"],
                  ["Icons", "lucide-react"],
                  ["State", "TanStack React Query v5"],
                  ["Fonts", "Inter + Space Grotesk"],
                ].map(([k, v], i) => (
                  <tr key={k} className={i % 2 === 0 ? "bg-muted/20" : ""}>
                    <td className="px-4 py-2.5 font-medium text-foreground text-xs whitespace-nowrap">{k}</td>
                    <td className="px-4 py-2.5 text-muted-foreground text-xs">{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Project Structure */}
        <section id="structure" className="mb-10 scroll-mt-20">
          <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
            <span className="text-emerald-400">04</span> Project Structure
          </h2>
          <div className="rounded-lg border border-border bg-[#0d0d0d] p-4 overflow-x-auto">
            <pre className="text-xs text-muted-foreground leading-relaxed font-mono">{`aperture/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx         # Root layout (metadata, theme)
│   │   ├── page.tsx           # Explore (main dashboard)
│   │   ├── pulse/             # Real-time swap feed
│   │   ├── pelacak/           # Token/pair search (Tracker)
│   │   ├── portofolio/        # Portfolio & wallet
│   │   ├── earn/              # Staking & farming
│   │   ├── swap/              # On-chain swap interface
│   │   ├── alat/              # Watchlist (Tools)
│   │   ├── pair/[address]/    # Pair detail page
│   │   └── api/               # API routes
│   │       ├── arc/            # Arc RPC proxy
│   │       └── indexer/        # Indexer data endpoints
│   ├── components/            # React components
│   └── lib/                   # Utilities & configs
│       ├── arc-rpc.ts         # Arc testnet RPC client
│       ├── wagmi-config.ts    # Wallet config (Reown)
│       ├── mock-data.ts       # Mock pairs & tokens
│       └── indexer/           # SQLite indexer system
├── public/                    # Static assets
│   ├── aperture-logo.svg      # Aperture brand logo
│   └── arc-logo-official.svg  # Arc logo (Circle Brand Kit)
├── data/                      # SQLite database
└── package.json`}</pre>
          </div>
        </section>

        {/* API */}
        <section id="api" className="mb-10 scroll-mt-20">
          <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
            <span className="text-emerald-400">05</span> API Endpoints
          </h2>
          <h3 className="text-sm font-semibold text-foreground mb-2">Arc RPC Proxy</h3>
          <div className="overflow-hidden rounded-lg border border-border mb-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/30 border-b border-border">
                  <th className="px-4 py-2 text-left text-xs font-semibold text-foreground">Endpoint</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-foreground">Method</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-foreground">Description</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["/api/arc/stats", "GET", "Arc network stats (block, gas)"],
                  ["/api/arc/tokens", "GET", "Token list from Arc testnet"],
                  ["/api/arc/holders", "GET", "Token holders (?token=0x...&limit=20)"],
                  ["/api/arc/transfers", "GET", "Recent transfers (?token=0x...)"],
                ].map(([ep, m, d], i) => (
                  <tr key={ep} className={i % 2 === 0 ? "bg-muted/20" : ""}>
                    <td className="px-4 py-2 text-xs font-mono text-emerald-400">{ep}</td>
                    <td className="px-4 py-2 text-xs"><span className="rounded bg-blue-500/20 px-1.5 py-0.5 text-blue-400">{m}</span></td>
                    <td className="px-4 py-2 text-xs text-muted-foreground">{d}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <h3 className="text-sm font-semibold text-foreground mb-2">Indexer</h3>
          <div className="overflow-hidden rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/30 border-b border-border">
                  <th className="px-4 py-2 text-left text-xs font-semibold text-foreground">Endpoint</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-foreground">Method</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-foreground">Description</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["/api/indexer/pairs", "GET", "All indexed pairs"],
                  ["/api/indexer/pairs/[address]", "GET", "Single pair details"],
                  ["/api/indexer/pairs/[address]/swaps", "GET", "Pair swap history"],
                  ["/api/indexer/swaps", "GET", "All recent swaps"],
                  ["/api/indexer/pulse", "GET", "Pulse feed data"],
                  ["/api/indexer/stats", "GET", "Indexer statistics"],
                  ["/api/indexer/sync", "POST", "Trigger manual sync"],
                ].map(([ep, m, d], i) => (
                  <tr key={ep} className={i % 2 === 0 ? "bg-muted/20" : ""}>
                    <td className="px-4 py-2 text-xs font-mono text-emerald-400">{ep}</td>
                    <td className="px-4 py-2 text-xs"><span className={`rounded px-1.5 py-0.5 ${m === "GET" ? "bg-blue-500/20 text-blue-400" : "bg-emerald-500/20 text-emerald-400"}`}>{m}</span></td>
                    <td className="px-4 py-2 text-xs text-muted-foreground">{d}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Indexer */}
        <section id="indexer" className="mb-10 scroll-mt-20">
          <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
            <span className="text-emerald-400">06</span> Indexer System
          </h2>
          <div className="space-y-3">
            <div className="rounded-lg border border-border bg-muted/20 p-4">
              <p className="text-sm text-muted-foreground mb-3">
                Aperture includes a custom indexer that syncs DEX pairs and swaps from Arc testnet to a local SQLite database.
              </p>
              <div className="rounded-lg bg-[#0d0d0d] p-3">
                <pre className="text-xs font-mono text-muted-foreground">{`Arc Testnet RPC → arc-rpc.ts → sync.ts → SQLite (arc-indexer.db)
                              ↑
                    scheduler.ts (PM2: arc-indexer)`}</pre>
              </div>
            </div>
            <div className="overflow-hidden rounded-lg border border-border">
              <table className="w-full text-sm">
                <tbody>
                  {[
                    ["lib/indexer/arc-rpc.ts", "Arc JSON-RPC client — reads blocks, logs, factory contracts"],
                    ["lib/indexer/sync.ts", "Sync logic — fetches pairs, swaps, reserves"],
                    ["lib/indexer/db.ts", "SQLite database schema & queries"],
                    ["lib/indexer/scheduler.ts", "Continuous sync scheduler (PM2 process)"],
                  ].map(([f, d], i) => (
                    <tr key={f} className={i % 2 === 0 ? "bg-muted/20" : ""}>
                      <td className="px-4 py-2 text-xs font-mono text-emerald-400">{f}</td>
                      <td className="px-4 py-2 text-xs text-muted-foreground">{d}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Wallet */}
        <section id="wallet" className="mb-10 scroll-mt-20">
          <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
            <span className="text-emerald-400">07</span> Wallet Integration
          </h2>
          <p className="text-sm text-muted-foreground mb-3">
            Aperture uses <span className="text-foreground font-medium">Reown AppKit</span> (formerly WalletConnect) with <span className="text-foreground font-medium">wagmi</span> for blockchain interactions.
          </p>
          <div className="overflow-hidden rounded-lg border border-border">
            <table className="w-full text-sm">
              <tbody>
                {[
                  ["Network", "Arc Testnet (Chain ID: 5042002)"],
                  ["Native Currency", "USDC (18 decimals)"],
                  ["RPC", "https://rpc.testnet.arc.network"],
                  ["Explorer", "Arcscan (https://testnet.arcscan.app)"],
                  ["Project ID", "aperture-dex-scanner"],
                  ["Theme", "Emerald accent (#10b981), dark default"],
                ].map(([k, v], i) => (
                  <tr key={k} className={i % 2 === 0 ? "bg-muted/20" : ""}>
                    <td className="px-4 py-2.5 font-medium text-foreground text-xs whitespace-nowrap">{k}</td>
                    <td className="px-4 py-2.5 text-muted-foreground text-xs font-mono">{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Deployment */}
        <section id="deploy" className="mb-10 scroll-mt-20">
          <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
            <span className="text-emerald-400">08</span> Deployment
          </h2>
          <div className="rounded-lg border border-border bg-[#0d0d0d] p-4 overflow-x-auto">
            <pre className="text-xs font-mono text-muted-foreground leading-relaxed">{`# Build
npm run build

# Start Next.js server
pm2 start npm --name arc-dev -- start

# Start indexer
pm2 start "npx tsx src/lib/indexer/scheduler.ts" \\
  --name arc-indexer

# Save PM2 config
pm2 save

# Commands
pm2 restart arc-dev       # Restart web server
pm2 restart arc-indexer   # Restart indexer
pm2 logs arc-dev           # View server logs
pm2 status                # Check all processes`}</pre>
          </div>
          <div className="mt-3 rounded-lg border border-border bg-muted/20 p-4">
            <h3 className="text-sm font-semibold text-foreground mb-2">Current Deployment</h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="text-muted-foreground">VPS</div>
              <div className="text-foreground font-mono">43.153.223.215</div>
              <div className="text-muted-foreground">Port</div>
              <div className="text-foreground font-mono">3000</div>
              <div className="text-muted-foreground">PM2</div>
              <div className="text-foreground font-mono">arc-dev, arc-indexer</div>
              <div className="text-muted-foreground">URL</div>
              <div className="text-emerald-400 font-mono">http://43.153.223.215:3000</div>
            </div>
          </div>
        </section>

        {/* Arc Network */}
        <section id="arc-network" className="mb-10 scroll-mt-20">
          <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
            <span className="text-emerald-400">09</span> Arc Network Details
          </h2>
          <div className="overflow-hidden rounded-lg border border-border">
            <table className="w-full text-sm">
              <tbody>
                {[
                  ["Network Name", "Arc Testnet"],
                  ["Chain ID", "5042002"],
                  ["RPC URL", "https://rpc.testnet.arc.network"],
                  ["Explorer", "https://testnet.arcscan.app"],
                  ["Native Currency", "USDC (18 decimals)"],
                  ["DEX", "Presto DEX"],
                  ["Faucet", "https://faucet.circle.com/"],
                ].map(([k, v], i) => (
                  <tr key={k} className={i % 2 === 0 ? "bg-muted/20" : ""}>
                    <td className="px-4 py-2.5 font-medium text-foreground text-xs whitespace-nowrap">{k}</td>
                    <td className="px-4 py-2.5 text-muted-foreground text-xs font-mono">{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Branding */}
        <section id="branding" className="mb-10 scroll-mt-20">
          <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
            <span className="text-emerald-400">10</span> Branding & Compliance
          </h2>
          <div className="rounded-lg border border-border bg-muted/20 p-4 space-y-2">
            <p className="text-sm text-muted-foreground">
              Aperture follows the <a href="https://www.arc.io/brand-guidelines-and-partner-toolkit" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline">Arc Brand Guidelines and Partner Toolkit</a>:
            </p>
            <ul className="space-y-1.5 text-xs text-muted-foreground ml-4">
              {[
                "Aperture is the primary brand — logo is larger and more prominent",
                "Arc is infrastructure — referenced as \"built on Arc Network\"",
                "Arc logo from official Circle Brand Kit (NavyGradient), unmodified",
                "Arc logo smaller than Aperture logo (52×18px vs 32×32px)",
                "™ symbol on first use, attribution in footer",
                "No \"Arc\" in product or feature names",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-0.5">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Footer note */}
        <div className="border-t border-border pt-6 text-center">
          <p className="text-xs text-muted-foreground">
            Aperture is an independent project built on Arc Network.
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Arc is a trademark of Circle Internet Group, Inc. and/or its affiliates.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}