"use client";

import { useState, type ReactNode } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

const sections = [
  {
    title: "Getting Started",
    items: [
      { id: "intro", label: "Introduction" },
      { id: "quickstart", label: "Quick Start" },
      { id: "connect", label: "Connect Wallet" },
    ],
  },
  {
    title: "Features",
    items: [
      { id: "explore", label: "Explore Pairs" },
      { id: "swap", label: "Swap" },
      { id: "earn", label: "Earn" },
      { id: "pulse", label: "Pulse" },
    ],
  },
  {
    title: "API Reference",
    items: [
      { id: "rest", label: "REST Endpoints" },
      { id: "graphql", label: "GraphQL" },
      { id: "websocket", label: "WebSocket Stream" },
    ],
  },
  {
    title: "Resources",
    items: [
      { id: "faq", label: "FAQ" },
      { id: "contracts", label: "Contract Addresses" },
      { id: "security", label: "Security" },
    ],
  },
];

const content: Record<string, { title: string; body: ReactNode }> = {
  intro: {
    title: "Introduction",
    body: (
      <>
        <p>
          <strong>Aperture</strong> is a real-time DEX scanner and aggregator built on{" "}
          <strong>Arc Network</strong>. Discover pools, swap tokens, earn yield, and track
          on-chain data — all in real time.
        </p>
        <p>
          Think DexScreener, but native to Arc. Sub-second data, zero estimates, 100% on-chain.
        </p>
        <h3>Key Features</h3>
        <ul>
          <li>Real-time pair scanning with sub-second latency</li>
          <li>Instant token swaps with near-zero fees (~$0.001)</li>
          <li>Liquidity pool discovery and yield tracking</li>
          <li>Live transaction feed via WebSocket</li>
          <li>REST and GraphQL API for developers</li>
          <li>Native USDC — no ETH needed for gas</li>
        </ul>
      </>
    ),
  },
  quickstart: {
    title: "Quick Start",
    body: (
      <>
        <p>Get up and running in three steps:</p>
        <ol>
          <li>
            <strong>Explore pairs</strong> — Visit <a href="/explore">/explore</a> to browse all
            live pairs on Arc. Filter by volume, TVL, or age.
          </li>
          <li>
            <strong>Swap or LP</strong> — Head to <a href="/swap">/swap</a> for instant swaps, or
            visit the Earn tab to add liquidity and earn fees.
          </li>
          <li>
            <strong>Track & Earn</strong> — Watchlist pairs, get alerts, and compound gains.
          </li>
        </ol>
        <div className="docs-note">
          No signup or API key required to start browsing. Connect a wallet only when you're ready
          to swap or add liquidity.
        </div>
      </>
    ),
  },
  connect: {
    title: "Connect Wallet",
    body: (
      <>
        <p>To swap or add liquidity, connect your wallet:</p>
        <ol>
          <li>Click <strong>"Go to app"</strong> in the top right.</li>
          <li>Navigate to <strong>Swap</strong> or <strong>Earn</strong>.</li>
          <li>Click <strong>"Connect Wallet"</strong> and approve the connection.</li>
          <li>Select Arc Network (Testnet) in your wallet if prompted.</li>
        </ol>
        <h3>Supported Wallets</h3>
        <ul>
          <li>MetaMask</li>
          <li>Rabby Wallet</li>
          <li>WalletConnect compatible wallets</li>
        </ul>
      </>
    ),
  },
  explore: {
    title: "Explore Pairs",
    body: (
      <>
        <p>
          The <a href="/explore">Explore</a> page shows all live trading pairs on Arc Network.
        </p>
        <h3>Available Filters</h3>
        <ul>
          <li><strong>Volume</strong> — 24h trading volume</li>
          <li><strong>TVL</strong> — Total value locked in the pool</li>
          <li><strong>Age</strong> — How long the pool has been active</li>
          <li><strong>Price Change</strong> — 24h price movement</li>
        </ul>
        <p>Click any pair to view detailed information — price chart, transactions, and liquidity depth.</p>
      </>
    ),
  },
  swap: {
    title: "Swap",
    body: (
      <>
        <p>
          The <a href="/swap">Swap</a> page lets you exchange tokens instantly on Arc Network.
        </p>
        <h3>How to Swap</h3>
        <ol>
          <li>Select the input and output tokens.</li>
          <li>Enter the amount you want to swap.</li>
          <li>Review the rate and estimated gas cost (~$0.001).</li>
          <li>Click <strong>"Swap"</strong> and confirm in your wallet.</li>
        </ol>
        <div className="docs-note">
          Swaps settle in 1-3 seconds. Gas is paid in USDC — no ETH required.
        </div>
      </>
    ),
  },
  earn: {
    title: "Earn",
    body: (
      <>
        <p>
          Earn yield by providing liquidity to Arc Network pools. You earn a portion of the
          trading fees proportional to your share of the pool.
        </p>
        <h3>Steps</h3>
        <ol>
          <li>Go to the <strong>Earn</strong> tab.</li>
          <li>Select a pool with a competitive APR.</li>
          <li>Deposit the required token pair.</li>
          <li>Track your earnings in real time.</li>
        </ol>
        <p>
          Current top APRs: <strong>DAI/USDC 24.7%</strong>, <strong>SOL/USDC 18.2%</strong>,
          <strong> ETH/USDC 12.4%</strong>.
        </p>
      </>
    ),
  },
  pulse: {
    title: "Pulse",
    body: (
      <>
        <p>
          <a href="/pulse">Pulse</a> is a real-time activity feed showing every swap, liquidity
          addition, and removal on Arc Network.
        </p>
        <ul>
          <li>Live transaction stream with sub-second latency</li>
          <li>Filter by type (swap, add, remove)</li>
          <li>Filter by token or pair</li>
          <li>Track whale movements and smart money</li>
        </ul>
      </>
    ),
  },
  rest: {
    title: "REST Endpoints",
    body: (
      <>
        <p>Aperture provides REST endpoints for developers:</p>
        <div className="docs-code">
{`GET /api/pairs
GET /api/pairs/:id
GET /api/pairs/:id/transactions
GET /api/stats`}
        </div>
        <h3>Example</h3>
        <div className="docs-code">
{`curl https://aperture.arcscan.io/api/pairs \
  -H "Accept: application/json"`}
        </div>
        <p>All responses are JSON with sub-second data freshness.</p>
      </>
    ),
  },
  graphql: {
    title: "GraphQL",
    body: (
      <>
        <p>Query exactly the data you need with our GraphQL endpoint:</p>
        <div className="docs-code">
{`POST /graphql

query {
  pairs(limit: 10, orderBy: volume24h) {
    id
    tokenA { symbol }
    tokenB { symbol }
    volume24h
    liquidityUsd
    priceChange24h
  }
}`}
        </div>
      </>
    ),
  },
  websocket: {
    title: "WebSocket Stream",
    body: (
      <>
        <p>Subscribe to real-time updates via WebSocket:</p>
        <div className="docs-code">
{`const ws = new WebSocket("wss://aperture.arcscan.io/ws");

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log("New transaction:", data);
};`}
        </div>
        <p>Events include: <code>swap</code>, <code>addLiquidity</code>, <code>removeLiquidity</code>, <code>priceUpdate</code>.</p>
      </>
    ),
  },
  faq: {
    title: "FAQ",
    body: (
      <>
        <h3>What is Aperture?</h3>
        <p>A decentralized exchange (DEX) scanner and aggregator built on Arc Network.</p>
        <h3>How do I swap or earn?</h3>
        <p>Go to the Swap tab to exchange tokens instantly, or visit the Earn tab to deposit liquidity into pools and start earning yield.</p>
        <h3>Is Aperture safe and audited?</h3>
        <p>Yes. Aperture smart contracts are audited by independent security firms. All swaps are executed on-chain via Arc Network's verified contracts.</p>
        <h3>What are the fees?</h3>
        <p>Swap fees are near-zero (~$0.001 per transaction). There are no hidden charges — every fee is visible on-chain.</p>
        <h3>What is Arc Network?</h3>
        <p>Arc Network is a high-performance Layer 1 blockchain designed for DeFi. It features sub-second finality, near-zero gas costs, and native USDC support.</p>
      </>
    ),
  },
  contracts: {
    title: "Contract Addresses",
    body: (
      <>
        <p>All Aperture contracts on Arc Network (Testnet):</p>
        <table className="docs-table">
          <thead>
            <tr>
              <th>Contract</th>
              <th>Address</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Router</td>
              <td><code>0x...TBA</code></td>
            </tr>
            <tr>
              <td>Factory</td>
              <td><code>0x...TBA</code></td>
            </tr>
            <tr>
              <td>USDC (Gas Token)</td>
              <td><code>0x...TBA</code></td>
            </tr>
          </tbody>
        </table>
        <div className="docs-note">
          Contract addresses will be published after mainnet launch. Current addresses available on request.
        </div>
      </>
    ),
  },
  security: {
    title: "Security",
    body: (
      <>
        <h3>Audits</h3>
        <p>Aperture smart contracts are audited by independent security firms. Audit reports will be published here once available.</p>
        <h3>Bug Bounty</h3>
        <p>We run a bug bounty program for ongoing security. Report vulnerabilities to our team.</p>
        <h3>Best Practices</h3>
        <ul>
          <li>Always verify contract addresses before interacting</li>
          <li>Use small amounts for first-time swaps</li>
          <li>Check transaction details in your wallet before confirming</li>
        </ul>
      </>
    ),
  },
};

export default function DocsPage() {
  const [active, setActive] = useState("intro");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const activeContent = content[active];

  return (
    <>
      <style jsx global>{`
        .docs-layout {
          display: grid;
          grid-template-columns: 260px 1fr;
          gap: 0;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
        }
        .docs-sidebar {
          position: sticky;
          top: 70px;
          height: calc(100vh - 70px);
          overflow-y: auto;
          padding: 32px 24px 32px 0;
          border-right: 1px solid rgba(255,255,255,0.06);
        }
        .docs-sidebar-section {
          margin-bottom: 28px;
        }
        .docs-sidebar-title {
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #6B7280;
          margin-bottom: 10px;
          padding-left: 12px;
        }
        .docs-sidebar-link {
          display: block;
          padding: 7px 12px;
          font-size: 0.875rem;
          color: #9CA3AF;
          border-radius: 8px;
          cursor: pointer;
          text-decoration: none;
          transition: all 0.15s ease;
          margin-bottom: 2px;
        }
        .docs-sidebar-link:hover {
          background: rgba(167,139,250,0.06);
          color: #E5E7EB;
        }
        .docs-sidebar-link.active {
          background: rgba(167,139,250,0.12);
          color: #A78BFA;
          font-weight: 600;
        }
                .docs-mobile-toggle {
          display: none;
          position: fixed;
          top: 16px;
          left: 16px;
          z-index: 1001;
          background: rgba(167,139,250,0.12);
          border: 1px solid rgba(167,139,250,0.2);
          border-radius: 10px;
          padding: 8px 12px;
          cursor: pointer;
          color: #A78BFA;
          font-size: 14px;
          font-weight: 600;
        }
        .docs-overlay {
          display: none;
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.5);
          z-index: 999;
        }
        .docs-content {
          padding: 40px 0 80px 48px;
          min-height: calc(100vh - 70px);
        }
        .docs-content h1 {
          font-size: 2rem;
          font-weight: 800;
          color: #F0F2F5;
          letter-spacing: -0.02em;
          margin-bottom: 24px;
        }
        .docs-content h3 {
          font-size: 1.15rem;
          font-weight: 700;
          color: #E5E7EB;
          margin: 28px 0 12px;
        }
        .docs-content p {
          font-size: 0.95rem;
          color: #9CA3AF;
          line-height: 1.7;
          margin-bottom: 16px;
        }
        .docs-content ul, .docs-content ol {
          margin: 0 0 20px 24px;
        }
        .docs-content li {
          font-size: 0.95rem;
          color: #9CA3AF;
          line-height: 1.8;
        }
        .docs-content a {
          color: #A78BFA;
          text-decoration: none;
        }
        .docs-content a:hover {
          text-decoration: underline;
        }
        .docs-content code {
          background: rgba(167,139,250,0.08);
          color: #C4B5FD;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 0.85rem;
          font-family: 'IBM Plex Mono', monospace;
        }
        .docs-note {
          background: rgba(0,214,111,0.06);
          border: 1px solid rgba(0,214,111,0.15);
          border-radius: 12px;
          padding: 16px 20px;
          margin: 20px 0;
          font-size: 0.9rem;
          color: #6EE7B7;
          line-height: 1.6;
        }
        .docs-code {
          background: #0F1117;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          padding: 18px 20px;
          margin: 16px 0;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.85rem;
          color: #A5B4FC;
          white-space: pre-wrap;
          overflow-x: auto;
        }
        .docs-table {
          width: 100%;
          border-collapse: collapse;
          margin: 16px 0;
        }
        .docs-table th {
          text-align: left;
          font-size: 0.8rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: #6B7280;
          padding: 10px 16px;
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }
        .docs-table td {
          padding: 12px 16px;
          border-bottom: 1px solid rgba(255,255,255,0.04);
          font-size: 0.9rem;
          color: #9CA3AF;
        }
        .docs-table td code {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.8rem;
        }
        @media (max-width: 768px) {
          .docs-layout {
            grid-template-columns: 1fr;
            padding: 0 16px;
          }
          .docs-sidebar {
            position: fixed;
            top: 0;
            left: 0;
            width: 280px;
            height: 100vh;
            background: #0F1117;
            z-index: 1000;
            padding: 80px 24px 32px;
            transform: translateX(-100%);
            transition: transform 0.3s ease;
            border-right: 1px solid rgba(255,255,255,0.1);
            overflow-y: auto;
          }
          .docs-sidebar.open {
            transform: translateX(0);
          }
          .docs-mobile-toggle {
            display: flex !important;
          }
          .docs-overlay {
            display: block !important;
          }
          .docs-content {
            padding: 24px 0 60px 0;
          }
          .docs-content h1 {
            font-size: 1.5rem;
          }
        }
      `}</style>
      <Header active="Docs" />
      <button className="docs-mobile-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
        Menu
      </button>
      {sidebarOpen && <div className="docs-overlay" onClick={() => setSidebarOpen(false)} />}
      <main className="w-full flex-1" style={{ background: "#0A0E1A" }}>
        <div className="docs-layout">
          <aside className={`docs-sidebar ${sidebarOpen ? "open" : ""}`}>
            {sections.map((section) => (
              <div key={section.title} className="docs-sidebar-section">
                <div className="docs-sidebar-title">{section.title}</div>
                {section.items.map((item) => (
                  <a
                    key={item.id}
                    className={`docs-sidebar-link ${active === item.id ? "active" : ""}`}
                    onClick={() => {
                      setActive(item.id);
                      setSidebarOpen(false);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            ))}
          </aside>
          <div className="docs-content">
            <h1>{activeContent.title}</h1>
            {activeContent.body}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
