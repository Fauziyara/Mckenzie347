"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Footer } from "@/components/footer";

const nav = [
  { id: "overview", label: "Overview" },
  { id: "explore", label: "Explore Pairs" },
  { id: "swap", label: "Swap" },
  { id: "earn", label: "Earn" },
  { id: "pulse", label: "Pulse" },
  { id: "getting-started", label: "Getting Started" },
  { id: "api", label: "API Reference" },
  { id: "contracts", label: "Contracts" },
  { id: "safety", label: "Safety Notes" },
];

export default function DocsPage() {
  const [active, setActive] = useState("overview");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      },
      { rootMargin: "-88px 0px -70% 0px", threshold: 0 }
    );

    nav.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <>
      <style jsx global>{`
        html, body {
          overflow-x: visible !important;
        }
        .docs-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 40px;
          max-width: 1080px;
          margin: 0 auto;
          padding: 48px 24px 80px;
        }
        @media (min-width: 1024px) {
          .docs-grid {
            grid-template-columns: 220px 1fr;
            gap: 64px;
            padding: 72px 32px 120px;
          }
        }
        .docs-aside {
          position: static;
          padding-bottom: 24px;
        }
        @media (min-width: 1024px) {
          .docs-aside {
            position: sticky;
            top: 80px;
            align-self: start;
            max-height: calc(100vh - 100px);
            overflow-y: auto;
          }
        }
        .docs-aside-label {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.18em;
          color: #1A1A1A !important;
        }
        .docs-nav {
          margin-top: 16px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .docs-nav a {
          font-size: 14px;
          color: #555555;
          transition: color 0.15s ease;
          cursor: pointer;
          padding: 2px 0;
        }
        .docs-nav a:hover {
          color: #059669;
        }
        .docs-nav a.active {
          color: #059669;
          font-weight: 500;
        }
        .docs-article-label {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.18em;
          color: #888888;
        }
        .docs-article h1 {
          margin-top: 8px;
          font-size: 2rem;
          font-weight: 500;
          letter-spacing: -0.02em;
          color: #1A1A1A !important;
        }
        @media (min-width: 768px) {
          .docs-article h1 {
            font-size: 2.5rem;
          }
        }
        .docs-article-desc {
          margin-top: 16px;
          max-width: 38rem;
          font-size: 15px;
          line-height: 1.7;
          color: #555555;
        }
        .docs-sections {
          margin-top: 48px;
          display: flex;
          flex-direction: column;
          gap: 48px;
        }
        .docs-section {
          border-top: 1px solid rgba(0,0,0,0.08);
          padding-top: 32px;
          scroll-margin-top: 88px;
        }
        .docs-section h2 {
          font-size: 1.5rem;
          font-weight: 500;
          letter-spacing: -0.01em;
          color: #1A1A1A !important;
        }
        .docs-section h3 {
          font-size: 1.1rem;
          font-weight: 600;
          color: #2D2D2D;
          margin: 24px 0 8px;
        }
        .docs-section p {
          max-width: 38rem;
          font-size: 15px;
          line-height: 1.7;
          color: #555555;
          margin-bottom: 16px;
        }
        .docs-section ul, .docs-section ol {
          max-width: 38rem;
          list-style: disc;
          padding-left: 20px;
          margin-bottom: 16px;
        }
        .docs-section ol {
          list-style: decimal;
        }
        .docs-section li {
          font-size: 15px;
          line-height: 1.8;
          color: #555555;
        }
        .docs-section a {
          color: #059669;
          text-decoration: none;
        }
        .docs-section a:hover {
          text-decoration: underline;
        }
        .docs-section code {
          background: rgba(5,150,105,0.08);
          color: #047857;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 13px;
          font-family: 'IBM Plex Mono', monospace;
        }
        .docs-callout {
          max-width: 38rem;
          border: 1px solid rgba(0,0,0,0.08);
          background: rgba(0,0,0,0.02);
          padding: 12px 16px;
          font-size: 13px;
          line-height: 1.6;
          color: #555555;
          border-radius: 4px;
          margin: 16px 0;
        }
        .docs-code {
          max-width: 38rem;
          overflow-x: auto;
          border: 1px solid rgba(0,0,0,0.08);
          background: rgba(0,0,0,0.04);
          padding: 12px 16px;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 12px;
          line-height: 1.6;
          color: #2D2D2D;
          border-radius: 4px;
          margin: 16px 0;
          white-space: pre;
        }
      `}</style>
      <header className="sticky top-0 z-50" style={{
          background: "#F4F1EA",
          borderBottom: "1px solid rgba(0,0,0,0.08)",
        }}>
          <div className="w-full flex h-14 sm:h-16 items-center justify-between px-6 sm:px-8 lg:px-12 max-w-[1080px] mx-auto">
            <div className="flex items-center gap-3">
              <a href="/" style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                textDecoration: "none"
              }}>
                <Image
                  src="/logo-arc.png"
                  alt="Aperture"
                  width={28}
                  height={28}
                  priority
                />
                <span style={{
                  fontSize: "1.05rem",
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                  color: "#1A1A1A",
                  fontFamily: "var(--font-heading, 'Space Grotesk'), sans-serif"
                }}>
                  Aperture
                </span>
              </a>
              <span style={{
                fontSize: "0.7rem",
                fontWeight: 500,
                letterSpacing: "0.15em",
                color: "#8A8A8A",
                fontFamily: "var(--font-heading, 'Space Grotesk'), sans-serif"
              }}>
                DOCS
              </span>
            </div>
            <a href="/explore" style={{
              fontSize: "0.8rem",
              fontWeight: 600,
              padding: "8px 18px",
              borderRadius: "8px",
              background: "#1A1A1A",
              color: "#F4F1EA",
              textDecoration: "none"
            }}>
              Launch app
            </a>
          </div>
        </header>
      <main className="w-full flex-1" style={{ background: "#F4F1EA" }}>
        <div className="docs-grid">
          <aside className="docs-aside">
            <div className="docs-aside-label" style={{ color: "#1A1A1A" }}>Contents</div>
            <nav className="docs-nav">
              {nav.map((item) => (
                <a
                  key={item.id}
                  className={active === item.id ? "active" : ""}
                  onClick={() => scrollTo(item.id)}
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </aside>
          <article className="docs-article">
            <div className="docs-article-label">Documentation</div>
            <h1>How Aperture works on Arc</h1>
            <p className="docs-article-desc">
              Explore, swap, earn, and track on-chain data — the short version that matches the live product.
            </p>

            <div className="docs-sections">
              <section id="overview" className="docs-section">
                <h2>Overview</h2>
                <p>
                  <strong>Aperture</strong> is a real-time DEX scanner and aggregator built on{" "}
                  <strong>Arc Network</strong>. Discover pools, swap tokens, earn yield, and track
                  on-chain data — all in real time.
                </p>
                <p>
                  A DEX scanner, native to Arc. Sub-second data, zero estimates, 100% on-chain.
                </p>
                <ul>
                  <li>Chain: Arc Testnet (chain id 5042002)</li>
                  <li>Gas: USDC-native — typically around $0.001 per tx</li>
                  <li>Swap: spot AMM only (USDC ↔ cirBTC, USDC ↔ EURC)</li>
                  <li>Data: live indexer with sub-second latency</li>
                  <li>No signup or API key required to browse</li>
                </ul>
              </section>

              <section id="explore" className="docs-section">
                <h2>Explore Pairs</h2>
                <p>
                  The Explore page shows all live trading pairs on Arc Network. Filter by volume,
                  TVL, price change, or pool age. Click any pair to view price chart, transactions,
                  and liquidity depth.
                </p>
                <ul>
                  <li><strong>Volume</strong> — 24h trading volume</li>
                  <li><strong>TVL</strong> — Total value locked in the pool</li>
                  <li><strong>Age</strong> — How long the pool has been active</li>
                  <li><strong>Price Change</strong> — 24h price movement</li>
                </ul>
              </section>

              <section id="swap" className="docs-section">
                <h2>Swap</h2>
                <p>
                  The Swap page lets you exchange tokens instantly on Arc Network. Swaps settle
                  in 1–3 seconds. Gas is paid in USDC — no ETH required.
                </p>
                <ol>
                  <li>Select input and output tokens.</li>
                  <li>Enter the amount you want to swap.</li>
                  <li>Review the rate and estimated gas cost (~$0.001).</li>
                  <li>Click Swap and confirm in your wallet.</li>
                </ol>
                <div className="docs-callout">
                  Supported swap pairs: USDC ↔ cirBTC, USDC ↔ EURC. More pairs added as liquidity grows.
                </div>
              </section>

              <section id="earn" className="docs-section">
                <h2>Earn</h2>
                <p>
                  Earn yield by providing liquidity to Arc Network pools. You earn a portion of
                  trading fees proportional to your share of the pool.
                </p>
                <ol>
                  <li>Go to the Earn tab.</li>
                  <li>Select a pool with a competitive APR.</li>
                  <li>Deposit the required token pair.</li>
                  <li>Track your earnings in real time.</li>
                </ol>
                <p>
                  Active pools: cirBTC/USDC, BTC/USDC, ETH/USDC, SOL/USDC, BNB/USDC, EURC/USDC,
                  XRP/USDC, LINK/USDC. All paired with USDC.
                </p>
              </section>

              <section id="pulse" className="docs-section">
                <h2>Pulse</h2>
                <p>
                  Pulse is a real-time activity feed showing every swap, liquidity addition, and
                  removal on Arc Network.
                </p>
                <ul>
                  <li>Live transaction stream with sub-second latency</li>
                  <li>Filter by type (swap, add, remove)</li>
                  <li>Filter by token or pair</li>
                  <li>Track whale movements and smart money</li>
                </ul>
              </section>

              <section id="getting-started" className="docs-section">
                <h2>Getting Started</h2>
                <ol>
                  <li>Open the app and click <strong>Go to app</strong>.</li>
                  <li>Browse pairs on the Explore page — no wallet needed.</li>
                  <li>Connect a wallet when ready to swap or add liquidity.</li>
                  <li>Select Arc Network (Testnet) in your wallet if prompted.</li>
                  <li>Fund test USDC from the Circle faucet.</li>
                </ol>
                <p>
                  Supported wallets: MetaMask, Rabby, WalletConnect compatible wallets.
                </p>
              </section>

              <section id="api" className="docs-section">
                <h2>API Reference</h2>
                <p>Aperture provides REST endpoints for developers:</p>
                <pre className="docs-code">{`GET /api/markets
GET /api/reserves
GET /api/indexer/pairs?limit=20&liquidity=true
GET /api/indexer/pairs/:address`}</pre>
                <p>Example:</p>
                <pre className="docs-code">{`curl https://aperture.arcscan.io/api/markets \\
  -H "Accept: application/json"`}</pre>
                <p>All responses are JSON with sub-second data freshness.</p>
              </section>

              <section id="contracts" className="docs-section">
                <h2>Contracts</h2>
                <p>Always verify addresses on ArcScan before large mainnet usage. Testnet values:</p>
                <pre className="docs-code">{`USDC:      0x3600000000000000000000000000000000000000
Explorer:  https://testnet.arcscan.app
Faucet:    https://faucet.circle.com`}</pre>
                <p>
                  Router and Factory contract addresses will be published after mainnet launch.
                </p>
              </section>

              <section id="safety" className="docs-section">
                <h2>Safety Notes</h2>
                <ul>
                  <li>Testnet funds only until mainnet is announced</li>
                  <li>Always verify contract addresses before interacting</li>
                  <li>Use small amounts for first-time swaps</li>
                  <li>Check transaction details in your wallet before confirming</li>
                  <li>Never share seed phrases — Aperture never asks for them</li>
                </ul>
              </section>
            </div>
          </article>
        </div>
      </main>
      <Footer />
    </>
  );
}
