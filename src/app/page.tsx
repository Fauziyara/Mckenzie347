"use client";

import { Reveal } from "@/components/reveal";
import { mockPairs } from "@/lib/mock-data";
import { formatUsd } from "@/lib/format";

const tickerItems = [
  "ARC TESTNET",
  "DEX SCANNER",
  "REAL-TIME PAIRS",
  "SWAP HISTORY",
  "LIQUIDITY TRACKING",
  "PRICE FEEDS",
  "BLOCK SCANNER",
  "ANALYTICS API",
  "ON-CHAIN DATA",
  "SUB-SECOND FINALITY",
  "USDC GAS",
  "NON-CUSTODIAL",
];

const features = [
  {
    title: "Pair Discovery",
    desc: "Every liquidity pool on Arc indexed at creation. No polling, no delays.",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#635BFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
  },
  {
    title: "Swap History",
    desc: "Decoded and timestamped to the millisecond. Query any swap by address or pair.",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#635BFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3v18h18" />
        <path d="M7 14l4-4 4 4 5-5" />
      </svg>
    ),
  },
  {
    title: "Liquidity Tracking",
    desc: "TVL, deposits, withdrawals — tracked across every pair in real time.",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#635BFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v20" />
        <path d="M5 8c0-2 3-4 7-4s7 2 7 4-3 4-7 4-7-2-7-4z" />
        <path d="M5 16c0-2 3-4 7-4s7 2 7 4-3 4-7 4-7-2-7-4z" />
      </svg>
    ),
  },
  {
    title: "Price Feeds",
    desc: "Sub-second spot prices streamed via WebSocket. No oracle middleware.",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#635BFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" />
      </svg>
    ),
  },
  {
    title: "Analytics API",
    desc: "REST and GraphQL endpoints for volume, OHLCV, and depth.",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#635BFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
  },
  {
    title: "Block Scanner",
    desc: "Inspect any block, transaction, or log on Arc Network.",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#635BFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <line x1="3" y1="9" x2="21" y2="9" />
        <line x1="9" y1="21" x2="9" y2="9" />
      </svg>
    ),
  },
];

const checklistItems = [
  "Filter by token, pair, or contract address",
  "Sort by volume, liquidity, or 24h change",
  "Deep-link to any pair detail page",
  "Export swap history as JSON or CSV",
];

const stats = [
  { value: "845K+", label: "BLOCKS INDEXED" },
  { value: formatUsd(mockPairs[0].volume24h), label: "24H VOLUME" },
  { value: "12", label: "ACTIVE PAIRS" },
  { value: "99.9%", label: "UPTIME" },
];

const steps = [
  { num: "01", title: "Connect your dApp", desc: "Point your app at the Aperture REST or GraphQL endpoint. No SDK install required." },
  { num: "02", title: "Query any pair", desc: "Fetch swaps, liquidity, OHLCV, and metadata for any pool on Arc with a single call." },
  { num: "03", title: "Ship with confidence", desc: "Every data point is indexed from finalized blocks and streamed with sub-second latency." },
];

const footerColumns = [
  { heading: "PRODUCT", links: [{ label: "Explore", href: "/explore" }, { label: "Pairs", href: "/explore" }, { label: "Swap", href: "/explore" }, { label: "Portfolio", href: "/explore" }] },
  { heading: "RESOURCES", links: [{ label: "Docs", href: "https://docs.aperture.xyz" }, { label: "API", href: "/explore" }, { label: "GitHub", href: "/explore" }, { label: "Status", href: "/explore" }] },
  { heading: "COMPANY", links: [{ label: "About", href: "/explore" }, { label: "Blog", href: "/explore" }, { label: "Contact", href: "/explore" }, { label: "Privacy", href: "/explore" }] },
  { heading: "LEGAL", links: [{ label: "Terms", href: "/explore" }, { label: "Privacy", href: "/explore" }, { label: "Cookies", href: "/explore" }, { label: "Licenses", href: "/explore" }] },
];

const checkSvg = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00D66F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export default function LandingPage() {
  const pair = mockPairs[0];
  const priceChange = pair.priceChange24h ?? 0;
  const isPositive = priceChange >= 0;

  return (
    <>
      <style jsx global>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        html,
        body {
          
          
          font-family: 'Inter', -apple-system, system-ui, sans-serif;
          background: #ffffff;
          color: #0a2540;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        @keyframes gradientFloat {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(-20px, 20px) scale(1.05);
          }
          66% {
            transform: translate(20px, -20px) scale(0.97);
          }
        }
        @keyframes tickerScroll {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
        @keyframes cardFloat {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-6px);
          }
        }
        @keyframes livePulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.4;
          }
        }

        .gradient-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
          animation: gradientFloat 8s ease-in-out infinite;
        }
        .ticker-track {
          display: flex;
          align-items: center;
          gap: 32px;
          white-space: nowrap;
          animation: tickerScroll 30s linear infinite;
        }
        .floating-card {
          animation: cardFloat 6s ease-in-out infinite;
        }
        .live-dot {
          display: inline-block;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #00d66f;
          animation: livePulse 2s ease-in-out infinite;
        }

        /* Scroll-snap container */
        .snap-container {
          height: 100vh;
          width: 100%;
          overflow-y: scroll;
          scroll-snap-type: y mandatory;
          scroll-behavior: smooth;
        }
        .snap-section {
          scroll-snap-align: start;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          position: relative;
          
        }
        .footer-link {
          transition: color 0.15s ease;
        }
        .footer-link:hover {
          color: #ffffff;
        }
      `}</style>

      <div className="snap-container">
        {/* ═══ SECTION 1: HERO (Flint-style, 100vh) ═══ */}
        <section
          className="snap-section"
          style={{
            background: "#FFFFFF",
            padding: 0,
            justifyContent: "flex-start",
          }}
        >
          {/* Nav (60px) */}
          <nav
            style={{
              height: 60,
              flexShrink: 0,
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 48px",
              background: "#FFFFFF",
              borderBottom: "1px solid #F1F5F9",
              position: "relative",
              zIndex: 10,
            }}
          >
            {/* Left: Logo */}
            <a
              href="/explore"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                textDecoration: "none",
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="#0A2540"
                  strokeWidth="2"
                />
                <circle cx="12" cy="12" r="3" fill="#0A2540" />
                <line x1="12" y1="0" x2="12" y2="6" stroke="#0A2540" strokeWidth="2" />
                <line x1="12" y1="18" x2="12" y2="24" stroke="#0A2540" strokeWidth="2" />
                <line x1="0" y1="12" x2="6" y2="12" stroke="#0A2540" strokeWidth="2" />
                <line x1="18" y1="12" x2="24" y2="12" stroke="#0A2540" strokeWidth="2" />
              </svg>
              <span
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                  color: "#0A2540",
                }}
              >
                Aperture
              </span>
            </a>

            {/* Center: Nav links */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 32,
                position: "absolute",
                left: "50%",
                transform: "translateX(-50%)",
              }}
            >
              <a href="/explore" style={{ fontSize: 14, fontWeight: 400, color: "#425466", textDecoration: "none" }}>Explore</a>
              <a href="/explore" style={{ fontSize: 14, fontWeight: 400, color: "#425466", textDecoration: "none" }}>Pairs</a>
              <a href="/explore" style={{ fontSize: 14, fontWeight: 400, color: "#425466", textDecoration: "none" }}>API</a>
              <a href="https://docs.aperture.xyz" style={{ fontSize: 14, fontWeight: 400, color: "#425466", textDecoration: "none" }}>Docs</a>
            </div>

            {/* Right: Sign in + Go to app */}
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <a href="/explore" style={{ fontSize: 14, color: "#425466", textDecoration: "none" }}>Sign in</a>
              <a
                href="/explore"
                style={{
                  fontSize: 14,
                  fontWeight: 500,
                  color: "#FFFFFF",
                  background: "#635BFF",
                  borderRadius: 6,
                  padding: "8px 16px",
                  textDecoration: "none",
                  display: "inline-block",
                }}
              >
                Go to app
              </a>
            </div>
          </nav>

          {/* Hero content (flex: 1) */}
          <div
            style={{
              flex: 1,
              position: "relative",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#FFFFFF",
              width: "100%",
            }}
          >
            {/* Gradient mesh — right side */}
            <div className="gradient-orb" style={{ width: 480, height: 480, background: "#FF6BCB", opacity: 0.35, top: "5%", right: "-5%", animationDelay: "0s" }} />
            <div className="gradient-orb" style={{ width: 420, height: 420, background: "#FF8A4C", opacity: 0.3, top: "30%", right: "8%", animationDelay: "2s" }} />
            <div className="gradient-orb" style={{ width: 460, height: 460, background: "#8B5CF6", opacity: 0.32, bottom: "0%", right: "-2%", animationDelay: "4s" }} />

            {/* Hero content grid */}
            <div
              style={{
                width: "100%",
                maxWidth: 1200,
                padding: "0 48px",
                display: "grid",
                gridTemplateColumns: "55% 45%",
                alignItems: "center",
                gap: 32,
                position: "relative",
                zIndex: 2,
              }}
            >
              {/* LEFT COLUMN (55%) */}
              <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 560 }}>
                {/* a) Eyebrow */}
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: "#6B7C93",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                  }}
                >
                  DEX Intelligence
                </span>

                {/* b) Headline */}
                <h1
                  style={{
                    fontSize: 52,
                    fontWeight: 700,
                    color: "#0A2540",
                    letterSpacing: "-0.03em",
                    lineHeight: 1.05,
                  }}
                >
                  Scan every pair.
                  <br />
                  <span style={{ fontStyle: "italic", fontFamily: "Georgia, 'Times New Roman', serif" }}>
                    Money moves.
                  </span>
                </h1>

                {/* c) Description */}
                <p
                  style={{
                    fontSize: 16,
                    fontWeight: 400,
                    color: "#425466",
                    maxWidth: 440,
                    lineHeight: 1.5,
                  }}
                >
                  Real-time pair data, on-chain swap history, and verified
                  liquidity analytics on Arc. No estimates — just deterministic
                  data from Arc&apos;s public ledger.
                </p>

                {/* d) Buttons */}
                <div style={{ display: "flex", gap: 12 }}>
                  <a
                    href="/explore"
                    style={{
                      background: "#635BFF",
                      color: "#FFFFFF",
                      borderRadius: 6,
                      padding: "12px 20px",
                      fontSize: 15,
                      fontWeight: 500,
                      textDecoration: "none",
                      display: "inline-block",
                    }}
                  >
                    Explore pairs →
                  </a>
                  <a
                    href="https://docs.aperture.xyz"
                    style={{
                      background: "#FFFFFF",
                      border: "1px solid #E3E8EE",
                      color: "#0A2540",
                      borderRadius: 6,
                      padding: "12px 20px",
                      fontSize: 15,
                      fontWeight: 500,
                      textDecoration: "none",
                      display: "inline-block",
                    }}
                  >
                    Read docs
                  </a>
                </div>

                {/* e) Stats row */}
                <div style={{ display: "flex", gap: 24, marginTop: 8 }}>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: "#0A2540" }}>&lt;1s</span>
                    <span style={{ fontSize: 11, fontWeight: 400, color: "#6B7C93" }}>FINALITY</span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: "#0A2540" }}>~$0.001</span>
                    <span style={{ fontSize: 11, fontWeight: 400, color: "#6B7C93" }}>GAS COST</span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: "#0A2540" }}>100%</span>
                    <span style={{ fontSize: 11, fontWeight: 400, color: "#6B7C93" }}>ON-CHAIN</span>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN (45%) */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <div
                  className="floating-card"
                  style={{
                    background: "#FFFFFF",
                    borderRadius: 12,
                    boxShadow: "0 1px 2px rgba(0,0,0,0.04), 0 24px 48px rgba(0,0,0,0.08)",
                    padding: 24,
                    maxWidth: 380,
                    width: "100%",
                  }}
                >
                  {/* Header row */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 12, color: "#0A2540", display: "flex", alignItems: "center", gap: 6 }}>
                      <span className="live-dot" />
                      LIVE
                    </span>
                    <span style={{ fontSize: 12, textTransform: "uppercase", color: "#6B7C93", fontWeight: 600 }}>
                      Aperture Terminal
                    </span>
                  </div>

                  {/* Divider */}
                  <div style={{ height: 1, background: "#F1F5F9", margin: "12px 0" }} />

                  {/* Pair label */}
                  <span style={{ fontSize: 11, textTransform: "uppercase", color: "#6B7C93", fontWeight: 600 }}>
                    Top Pair
                  </span>

                  {/* Pair name */}
                  <div style={{ fontSize: 24, fontWeight: 700, color: "#0A2540", margin: "4px 0 12px" }}>
                    {pair.token0.symbol} / {pair.token1.symbol}
                  </div>

                  {/* Data rows */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #F1F5F9" }}>
                    <span style={{ fontSize: 13, color: "#6B7C93" }}>24h Volume</span>
                    <span style={{ fontSize: 14, fontFamily: "'SF Mono', 'Monaco', 'Menlo', 'Consolas', monospace", color: "#0A2540" }}>
                      {formatUsd(pair.volume24h)}
                    </span>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #F1F5F9" }}>
                    <span style={{ fontSize: 13, color: "#6B7C93" }}>Liquidity</span>
                    <span style={{ fontSize: 14, fontFamily: "'SF Mono', 'Monaco', 'Menlo', 'Consolas', monospace", color: "#0A2540" }}>
                      {formatUsd(pair.liquidityUsd)}
                    </span>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #F1F5F9" }}>
                    <span style={{ fontSize: 13, color: "#6B7C93" }}>24h Txns</span>
                    <span style={{ fontSize: 14, fontFamily: "'SF Mono', 'Monaco', 'Menlo', 'Consolas', monospace", color: "#0A2540" }}>
                      {pair.txCount24h}
                    </span>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #F1F5F9" }}>
                    <span style={{ fontSize: 13, color: "#6B7C93" }}>Price Change</span>
                    <span style={{ fontSize: 14, fontFamily: "'SF Mono', 'Monaco', 'Menlo', 'Consolas', monospace", color: isPositive ? "#00D66F" : "#FF4D4F" }}>
                      {isPositive ? "+" : ""}{priceChange.toFixed(2)}%
                    </span>
                  </div>

                  {/* Bottom button */}
                  <a
                    href="/explore"
                    style={{
                      display: "block",
                      textAlign: "center",
                      background: "#635BFF",
                      color: "#FFFFFF",
                      borderRadius: 6,
                      padding: "12px 0",
                      fontSize: 14,
                      fontWeight: 500,
                      textDecoration: "none",
                      marginTop: 16,
                    }}
                  >
                    View on explorer →
                  </a>
                </div>

                {/* Caption below card */}
                <p style={{ fontSize: 12, fontStyle: "italic", color: "#6B7C93", textAlign: "center", marginTop: 12 }}>
                  Live preview of the top pair on Arc Network.
                </p>
              </div>
            </div>
          </div>

          {/* Ticker (40px) — bottom of section 1 only */}
          <div
            style={{
              height: 40,
              flexShrink: 0,
              width: "100%",
              background: "#0A2540",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              position: "relative",
              zIndex: 10,
            }}
          >
            <div className="ticker-track">
              {[...tickerItems, ...tickerItems].map((item, i) => (
                <span
                  key={i}
                  style={{
                    fontSize: 12,
                    fontWeight: 500,
                    color: "#FFFFFF",
                    opacity: 0.6,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 32,
                  }}
                >
                  {item}
                  <span style={{ opacity: 0.4 }}>•</span>
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ SECTION 2: FEATURES (white bg, 100vh) ═══ */}
        <section className="snap-section" style={{ background: "#FFFFFF" }}>
          <div style={{ width: "100%", maxWidth: 1080, padding: "0 48px", textAlign: "center" }}>
            <Reveal>
              <span style={{ fontSize: 12, fontWeight: 600, color: "#6B7C93", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                CAPABILITIES
              </span>
              <h2 style={{ fontSize: 44, fontWeight: 700, color: "#0A2540", letterSpacing: "-0.02em", marginTop: 12, lineHeight: 1.1 }}>
                Everything you need to scan Arc.
              </h2>
              <p style={{ fontSize: 18, color: "#425466", marginTop: 16, fontWeight: 400 }}>
                One indexer. Every signal. Built for builders who ship.
              </p>
            </Reveal>

            <Reveal delay={100}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, marginTop: 48, textAlign: "left" }}>
                {features.map((feature, i) => (
                  <div
                    key={i}
                    style={{
                      background: "#F6F9FC",
                      borderRadius: 12,
                      padding: 32,
                    }}
                  >
                    {feature.icon}
                    <h3 style={{ fontSize: 20, fontWeight: 600, color: "#0A2540", marginTop: 16 }}>
                      {feature.title}
                    </h3>
                    <p style={{ fontSize: 15, color: "#425466", lineHeight: 1.5, marginTop: 8, fontWeight: 400 }}>
                      {feature.desc}
                    </p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* ═══ SECTION 3: SHOWCASE — DATA TERMINAL (dark navy, 100vh) ═══ */}
        <section className="snap-section" style={{ background: "#0A2540" }}>
          <div style={{ width: "100%", maxWidth: 1080, padding: "0 48px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>
            {/* Left column */}
            <Reveal>
              <span style={{ fontSize: 12, fontWeight: 600, color: "#635BFF", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                LIVE TERMINAL
              </span>
              <h2 style={{ fontSize: 44, fontWeight: 700, color: "#FFFFFF", letterSpacing: "-0.02em", marginTop: 12, lineHeight: 1.1 }}>
                Query any pair in milliseconds.
              </h2>
              <p style={{ fontSize: 17, color: "#8FA2B8", marginTop: 16, fontWeight: 400, lineHeight: 1.5 }}>
                Aperture indexes every block on Arc Network. Query swaps, liquidity, and price feeds through a single API.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 24 }}>
                {checklistItems.map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    {checkSvg}
                    <span style={{ fontSize: 15, color: "#FFFFFF", fontWeight: 400 }}>{item}</span>
                  </div>
                ))}
              </div>
            </Reveal>

            {/* Right column — terminal card */}
            <Reveal delay={100}>
              <div
                style={{
                  background: "#0F1B2D",
                  borderRadius: 12,
                  border: "1px solid #1E3A5F",
                  padding: 24,
                  fontFamily: "'SF Mono', 'Monaco', 'Menlo', 'Consolas', monospace",
                  fontSize: 13,
                  lineHeight: 1.6,
                }}
              >
                <div style={{ color: "#425466", marginBottom: 12 }}>
                  <span style={{ color: "#635BFF" }}>GET</span>{" "}
                  <span style={{ color: "#00D66F" }}>/api/indexer/pairs?limit=3</span>
                </div>
                <div>
                  <span style={{ color: "#425466" }}>{"{"}</span>
                  {"\n"}
                  {"  "}
                  <span style={{ color: "#635BFF" }}>"pairs"</span>
                  <span style={{ color: "#425466" }}>: [</span>
                  {"\n"}
                  {"    "}
                  <span style={{ color: "#425466" }}>{"{"}</span>
                  {"\n"}
                  {"      "}
                  <span style={{ color: "#635BFF" }}>"pair"</span>
                  <span style={{ color: "#425466" }}>: </span>
                  <span style={{ color: "#00D66F" }}>"USDC/EURC"</span>
                  <span style={{ color: "#425466" }}>,</span>
                  {"\n"}
                  {"      "}
                  <span style={{ color: "#635BFF" }}>"volume24h"</span>
                  <span style={{ color: "#425466" }}>: </span>
                  <span style={{ color: "#FF8A4C" }}>8900000</span>
                  <span style={{ color: "#425466" }}>,</span>
                  {"\n"}
                  {"      "}
                  <span style={{ color: "#635BFF" }}>"liquidity"</span>
                  <span style={{ color: "#425466" }}>: </span>
                  <span style={{ color: "#FF8A4C" }}>125000</span>
                  <span style={{ color: "#425466" }}>,</span>
                  {"\n"}
                  {"      "}
                  <span style={{ color: "#635BFF" }}>"txCount24h"</span>
                  <span style={{ color: "#425466" }}>: </span>
                  <span style={{ color: "#FF8A4C" }}>342</span>
                  {"\n"}
                  {"    "}
                  <span style={{ color: "#425466" }}>{"},"}</span>
                  {"\n"}
                  {"    "}
                  <span style={{ color: "#425466" }}>{"{"}</span>
                  {"\n"}
                  {"      "}
                  <span style={{ color: "#635BFF" }}>"pair"</span>
                  <span style={{ color: "#425466" }}>: </span>
                  <span style={{ color: "#00D66F" }}>"WBTC/USDT"</span>
                  <span style={{ color: "#425466" }}>,</span>
                  {"\n"}
                  {"      "}
                  <span style={{ color: "#635BFF" }}>"volume24h"</span>
                  <span style={{ color: "#425466" }}>: </span>
                  <span style={{ color: "#FF8A4C" }}>45000000</span>
                  <span style={{ color: "#425466" }}>,</span>
                  {"\n"}
                  {"      "}
                  <span style={{ color: "#635BFF" }}>"liquidity"</span>
                  <span style={{ color: "#425466" }}>: </span>
                  <span style={{ color: "#FF8A4C" }}>890000</span>
                  <span style={{ color: "#425466" }}>,</span>
                  {"\n"}
                  {"      "}
                  <span style={{ color: "#635BFF" }}>"txCount24h"</span>
                  <span style={{ color: "#425466" }}>: </span>
                  <span style={{ color: "#FF8A4C" }}>1284</span>
                  {"\n"}
                  {"    "}
                  <span style={{ color: "#425466" }}>{"}"}</span>
                  {"\n"}
                  {"  "}
                  <span style={{ color: "#425466" }}>]</span>
                  {"\n"}
                  <span style={{ color: "#425466" }}>{"}"}</span>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ═══ SECTION 4: STATS (white bg, 100vh) ═══ */}
        <section className="snap-section" style={{ background: "#FFFFFF" }}>
          <div style={{ width: "100%", maxWidth: 1080, padding: "0 48px", textAlign: "center" }}>
            <Reveal>
              <span style={{ fontSize: 12, fontWeight: 600, color: "#6B7C93", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                BY THE NUMBERS
              </span>
              <h2 style={{ fontSize: 44, fontWeight: 700, color: "#0A2540", letterSpacing: "-0.02em", marginTop: 12, lineHeight: 1.1 }}>
                The backbone of on-chain data.
              </h2>
            </Reveal>

            <Reveal delay={100}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 48, marginTop: 64 }}>
                {stats.map((stat, i) => (
                  <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <span style={{ fontSize: 56, fontWeight: 700, color: "#0A2540", letterSpacing: "-0.02em" }}>
                      {stat.value}
                    </span>
                    <span style={{ fontSize: 14, color: "#6B7C93", textTransform: "uppercase", marginTop: 8, fontWeight: 600 }}>
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={200}>
              <div
                style={{
                  height: 4,
                  background: "linear-gradient(90deg, #FF6BCB, #FF8A4C, #8B5CF6, #635BFF)",
                  borderRadius: 2,
                  marginTop: 64,
                  width: "100%",
                  maxWidth: 600,
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
              />
            </Reveal>
          </div>
        </section>

        {/* ═══ SECTION 5: HOW IT WORKS (soft gray, 100vh) ═══ */}
        <section className="snap-section" style={{ background: "#F6F9FC" }}>
          <div style={{ width: "100%", maxWidth: 1080, padding: "0 48px", textAlign: "center" }}>
            <Reveal>
              <span style={{ fontSize: 12, fontWeight: 600, color: "#6B7C93", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                GET STARTED
              </span>
              <h2 style={{ fontSize: 44, fontWeight: 700, color: "#0A2540", letterSpacing: "-0.02em", marginTop: 12, lineHeight: 1.1 }}>
                Three steps to ship.
              </h2>
            </Reveal>

            <Reveal delay={100}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 32, marginTop: 64, textAlign: "left" }}>
                {steps.map((step, i) => (
                  <div key={i} style={{ position: "relative", paddingTop: 8 }}>
                    <span
                      style={{
                        fontSize: 72,
                        fontWeight: 700,
                        color: "#E3E8EE",
                        position: "absolute",
                        top: -32,
                        left: 0,
                        lineHeight: 1,
                        letterSpacing: "-0.02em",
                      }}
                    >
                      {step.num}
                    </span>
                    <h3 style={{ fontSize: 24, fontWeight: 600, color: "#0A2540", position: "relative", zIndex: 1, marginTop: 32 }}>
                      {step.title}
                    </h3>
                    <p style={{ fontSize: 16, color: "#425466", lineHeight: 1.5, marginTop: 12, fontWeight: 400, position: "relative", zIndex: 1 }}>
                      {step.desc}
                    </p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* ═══ SECTION 6: CTA (dark navy, 100vh) ═══ */}
        <section className="snap-section" style={{ background: "#0A2540" }}>
          {/* Gradient mesh blobs */}
          <div className="gradient-orb" style={{ width: 400, height: 400, background: "#FF6BCB", opacity: 0.15, top: "10%", left: "10%", animationDelay: "0s" }} />
          <div className="gradient-orb" style={{ width: 350, height: 350, background: "#FF8A4C", opacity: 0.15, bottom: "10%", right: "15%", animationDelay: "3s" }} />
          <div className="gradient-orb" style={{ width: 380, height: 380, background: "#8B5CF6", opacity: 0.15, top: "40%", right: "5%", animationDelay: "5s" }} />

          <Reveal>
            <div style={{ textAlign: "center", maxWidth: 600, padding: "0 48px", position: "relative", zIndex: 2 }}>
              <h2 style={{ fontSize: 44, fontWeight: 700, color: "#FFFFFF", letterSpacing: "-0.02em", lineHeight: 1.1 }}>
                Start scanning Arc Network today.
              </h2>
              <p style={{ fontSize: 18, color: "#8FA2B8", marginTop: 16, fontWeight: 400 }}>
                Free to explore. No API key required for public data.
              </p>
              <div style={{ display: "flex", justifyContent: "center", gap: 12, marginTop: 32 }}>
                <a
                  href="/explore"
                  style={{
                    background: "#635BFF",
                    color: "#FFFFFF",
                    borderRadius: 6,
                    padding: "14px 24px",
                    fontSize: 15,
                    fontWeight: 500,
                    textDecoration: "none",
                    display: "inline-block",
                  }}
                >
                  Explore pairs →
                </a>
                <a
                  href="https://docs.aperture.xyz"
                  style={{
                    border: "1px solid #2A3F5C",
                    color: "#FFFFFF",
                    borderRadius: 6,
                    padding: "14px 24px",
                    fontSize: 15,
                    fontWeight: 500,
                    textDecoration: "none",
                    display: "inline-block",
                    background: "transparent",
                  }}
                >
                  Read docs
                </a>
              </div>
            </div>
          </Reveal>
        </section>

        {/* ═══ SECTION 7: FOOTER (dark navy, 100vh) ═══ */}
        <section className="snap-section" style={{ background: "#0A2540" }}>
          <div style={{ width: "100%", maxWidth: 1080, padding: "0 48px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
            <Reveal>
              {/* Logo */}
              <a
                href="/explore"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  textDecoration: "none",
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" stroke="#FFFFFF" strokeWidth="2" />
                  <circle cx="12" cy="12" r="3" fill="#FFFFFF" />
                  <line x1="12" y1="0" x2="12" y2="6" stroke="#FFFFFF" strokeWidth="2" />
                  <line x1="12" y1="18" x2="12" y2="24" stroke="#FFFFFF" strokeWidth="2" />
                  <line x1="0" y1="12" x2="6" y2="12" stroke="#FFFFFF" strokeWidth="2" />
                  <line x1="18" y1="12" x2="24" y2="12" stroke="#FFFFFF" strokeWidth="2" />
                </svg>
                <span style={{ fontSize: 20, fontWeight: 600, color: "#FFFFFF" }}>
                  Aperture
                </span>
              </a>

              {/* Tagline */}
              <p style={{ fontSize: 15, color: "#8FA2B8", maxWidth: 400, marginTop: 12, fontWeight: 400 }}>
                The DEX intelligence layer for Arc Network.
              </p>

              {/* 4-column links */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 48, marginTop: 48, textAlign: "left", width: "100%" }}>
                {footerColumns.map((col, i) => (
                  <div key={i} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    <span style={{ fontSize: 12, textTransform: "uppercase", fontWeight: 600, color: "#6B7C93", letterSpacing: "0.08em" }}>
                      {col.heading}
                    </span>
                    {col.links.map((link, j) => (
                      <a
                        key={j}
                        href={link.href}
                        className="footer-link"
                        style={{ fontSize: 14, color: "#8FA2B8", textDecoration: "none", fontWeight: 400 }}
                      >
                        {link.label}
                      </a>
                    ))}
                  </div>
                ))}
              </div>

              {/* Bottom */}
              <div style={{ marginTop: 48, display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                <span style={{ fontSize: 12, color: "#425466" }}>
                  © 2026 Aperture. All rights reserved.
                </span>
                <span style={{ fontSize: 12, color: "#425466" }}>
                  Built on Arc™
                </span>
              </div>
            </Reveal>
          </div>
        </section>
      </div>
    </>
  );
}
