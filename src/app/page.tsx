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
    desc: "Every liquidity pool on Arc indexed at creation. Search, filter, and sort in real time.",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#635BFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
  },
  {
    title: "Swap History",
    desc: "Every swap decoded and timestamped. Filter by token, pair, or contract address.",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#635BFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3v18h18" />
        <path d="M7 14l4-4 4 4 5-5" />
      </svg>
    ),
  },
  {
    title: "Liquidity Tracking",
    desc: "TVL, deposits, and withdrawals tracked across every pair. Live, no polling.",
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
    desc: "Spot prices streamed via WebSocket with sub-second latency. No oracle middleware.",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#635BFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" />
      </svg>
    ),
  },
  {
    title: "Analytics API",
    desc: "REST and GraphQL endpoints. Volume, OHLCV, depth, and swap history.",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#635BFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
  },
  {
    title: "Block Scanner",
    desc: "Inspect any block, transaction, or log on Arc Network. Full on-chain transparency.",
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

// ─── Hero ticker data (real pair data with prices/changes) ───
const heroTickerData = mockPairs.slice(0, 8).map((p) => ({
  pair: `${p.token0.symbol}/${p.token1.symbol}`,
  vol: formatUsd(p.volume24h),
  change: p.priceChange24h ?? 0,
}));

// ─── Mini DexScreener card: top 5 pairs by volume ───
const cardPairs = [...mockPairs].sort((a, b) => b.volume24h - a.volume24h).slice(0, 5);

// ─── Sparkline SVG generator ───
function makeSparklinePath(data: number[], width: number, height: number, positive: boolean): string {
  if (!data || data.length < 2) return "";
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const stepX = width / (data.length - 1);
  return data
    .map((v, i) => {
      const x = i * stepX;
      const y = height - ((v - min) / range) * height;
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
}

export default function LandingPage() {
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
          background: #0A0E1A;
          color: #E6EDF3;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        /* ─── HERO ANIMATIONS ─── */
        @keyframes orbDrift1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -40px) scale(1.1); }
          66% { transform: translate(-20px, 30px) scale(0.95); }
        }
        @keyframes orbDrift2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-40px, 20px) scale(0.9); }
          66% { transform: translate(25px, -35px) scale(1.08); }
        }
        @keyframes orbDrift3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(35px, 25px) scale(1.12); }
        }
        @keyframes orbDrift4 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(-30px, -20px) scale(1.05); }
          75% { transform: translate(20px, 35px) scale(0.92); }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes cardFloatDark {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }

        @keyframes livePulseDark {
          0%, 100% { opacity: 1; transform: scale(1); box-shadow: 0 0 0 0 rgba(0,214,111,0.4); }
          50% { opacity: 0.6; transform: scale(0.9); box-shadow: 0 0 0 4px rgba(0,214,111,0); }
        }

        @keyframes tickerScrollDark {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }

        @keyframes tickerScrollMini {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }

        @keyframes sparklineDraw {
          from { stroke-dashoffset: 200; }
          to { stroke-dashoffset: 0; }
        }

        @keyframes gradientTextShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        @keyframes glowPulse {
          0%, 100% { box-shadow: 0 0 20px rgba(99,91,255,0.15), 0 8px 32px rgba(0,0,0,0.3); }
          50% { box-shadow: 0 0 40px rgba(99,91,255,0.25), 0 8px 32px rgba(0,0,0,0.3); }
        }

        .hero-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(100px);
          pointer-events: none;
        }
        .hero-orb-1 { animation: orbDrift1 12s ease-in-out infinite; }
        .hero-orb-2 { animation: orbDrift2 10s ease-in-out infinite; }
        .hero-orb-3 { animation: orbDrift3 14s ease-in-out infinite; }
        .hero-orb-4 { animation: orbDrift4 9s ease-in-out infinite; }

        .fade-in-up {
          opacity: 0;
          animation: fadeInUp 0.6s ease-out forwards;
        }

        .floating-card-dark {
          animation: cardFloatDark 6s ease-in-out infinite;
        }

        .live-dot-dark {
          display: inline-block;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #00D66F;
          animation: livePulseDark 2s ease-in-out infinite;
        }

        .ticker-track-dark {
          display: flex;
          align-items: center;
          gap: 24px;
          white-space: nowrap;
          animation: tickerScrollDark 30s linear infinite;
        }

        .mini-ticker-track {
          display: flex;
          align-items: center;
          gap: 16px;
          white-space: nowrap;
          animation: tickerScrollMini 20s linear infinite;
        }

        .sparkline-path {
          stroke-dasharray: 200;
          animation: sparklineDraw 2s ease-out forwards;
        }

        .gradient-text-hero {
          background: linear-gradient(90deg, #635BFF, #FF6BCB, #635BFF);
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: gradientTextShift 4s ease-in-out infinite;
        }

        .glow-card {
          animation: glowPulse 4s ease-in-out infinite;
        }

        .pair-row {
          transition: background 0.15s ease;
        }
        .pair-row:hover {
          background: rgba(255,255,255,0.03);
        }

        .hero-btn-primary {
          transition: all 0.2s ease;
        }
        .hero-btn-primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(99,91,255,0.35);
        }

        .hero-btn-secondary {
          transition: all 0.2s ease;
        }
        .hero-btn-secondary:hover {
          border-color: #635BFF;
          color: #635BFF;
        }

        /* Scroll-snap container */
        .snap-container {
          width: 100%;
        }
        .snap-section {
          height: 100vh;
          overflow: hidden;
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
        {/* ═══ SECTION 1: HERO (Animated dark + mini DexScreener render, 100vh) ═══ */}
        <section
          className="snap-section"
          style={{
            background: "#FAFBFF",
            padding: 0,
            justifyContent: "flex-start",
          }}
        >
          {/* ─── ANIMATED GRADIENT MESH BACKGROUND ─── */}
          <div style={{ position: "absolute", inset: 0, overflow: "hidden", zIndex: 0 }}>
            <div className="hero-orb hero-orb-1" style={{ width: 500, height: 500, background: "#635BFF", opacity: 0.25, top: "-10%", left: "-5%" }} />
            <div className="hero-orb hero-orb-2" style={{ width: 450, height: 450, background: "#FF6BCB", opacity: 0.22, top: "20%", right: "-5%" }} />
            <div className="hero-orb hero-orb-3" style={{ width: 400, height: 400, background: "#00D4FF", opacity: 0.18, bottom: "5%", left: "15%" }} />
            <div className="hero-orb hero-orb-4" style={{ width: 350, height: 350, background: "#FF8A4C", opacity: 0.2, bottom: "-5%", right: "20%" }} />
          </div>

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
              background: "rgba(255,255,255,0.85)",
              backdropFilter: "blur(12px)",
              borderBottom: "1px solid #E8EAF0",
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
                <circle cx="12" cy="12" r="10" stroke="#635BFF" strokeWidth="2" />
                <circle cx="12" cy="12" r="3" fill="#635BFF" />
                <line x1="12" y1="0" x2="12" y2="6" stroke="#635BFF" strokeWidth="2" />
                <line x1="12" y1="18" x2="12" y2="24" stroke="#635BFF" strokeWidth="2" />
                <line x1="0" y1="12" x2="6" y2="12" stroke="#635BFF" strokeWidth="2" />
                <line x1="18" y1="12" x2="24" y2="12" stroke="#635BFF" strokeWidth="2" />
              </svg>
              <span
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                  color: "#E6EDF3",
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
              <a href="/explore" style={{ fontSize: 14, fontWeight: 400, color: "#425466", textDecoration: "none", transition: "color 0.15s" }}>Explore</a>
              <a href="/explore" style={{ fontSize: 14, fontWeight: 400, color: "#425466", textDecoration: "none", transition: "color 0.15s" }}>Pairs</a>
              <a href="/explore" style={{ fontSize: 14, fontWeight: 400, color: "#425466", textDecoration: "none", transition: "color 0.15s" }}>API</a>
              <a href="https://docs.aperture.xyz" style={{ fontSize: 14, fontWeight: 400, color: "#425466", textDecoration: "none", transition: "color 0.15s" }}>Docs</a>
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
                  boxShadow: "0 4px 12px rgba(99,91,255,0.3)",
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
              width: "100%",
            }}
          >
            {/* Hero content grid */}
            <div
              style={{
                width: "100%",
                maxWidth: 1200,
                padding: "0 48px",
                display: "grid",
                gridTemplateColumns: "52% 48%",
                alignItems: "center",
                gap: 32,
                position: "relative",
                zIndex: 2,
              }}
            >
              {/* ─── LEFT COLUMN (52%) ─── */}
              <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 560 }}>
                {/* a) Eyebrow */}
                <span
                  className="fade-in-up"
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: "#635BFF",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    animationDelay: "0s",
                  }}
                >
                  ◆ DEX Intelligence on Arc
                </span>

                {/* b) Headline */}
                <h1
                  className="fade-in-up"
                  style={{
                    fontSize: 52,
                    fontWeight: 700,
                    color: "#0A2540",
                    letterSpacing: "-0.03em",
                    lineHeight: 1.05,
                    animationDelay: "0.1s",
                  }}
                >
                  Scan every pair.
                  <br />
                  <span className="gradient-text-hero" style={{ fontStyle: "italic", fontFamily: "Georgia, 'Times New Roman', serif" }}>
                    Money moves.
                  </span>
                </h1>

                {/* c) Description */}
                <p
                  className="fade-in-up"
                  style={{
                    fontSize: 16,
                    fontWeight: 400,
                    color: "#425466",
                    maxWidth: 440,
                    lineHeight: 1.5,
                    animationDelay: "0.2s",
                  }}
                >
                  Track every liquidity pool, swap, and price feed on Arc Network
                  in real time. Sub-second data, zero estimates, 100% on-chain.
                </p>

                {/* d) Buttons */}
                <div className="fade-in-up" style={{ display: "flex", gap: 12, animationDelay: "0.3s" }}>
                  <a
                    href="/explore"
                    className="hero-btn-primary"
                    style={{
                      background: "#635BFF",
                      color: "#FFFFFF",
                      borderRadius: 6,
                      padding: "12px 20px",
                      fontSize: 15,
                      fontWeight: 500,
                      textDecoration: "none",
                      display: "inline-block",
                      boxShadow: "0 4px 12px rgba(99,91,255,0.25)",
                    }}
                  >
                    Explore pairs →
                  </a>
                  <a
                    href="https://docs.aperture.xyz"
                    className="hero-btn-secondary"
                    style={{
                      background: "transparent",
                      border: "1px solid #D1D5DB",
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
                <div className="fade-in-up" style={{ display: "flex", gap: 24, marginTop: 8, animationDelay: "0.4s" }}>
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

              {/* ─── RIGHT COLUMN (48%) — Mini DexScreener Render ─── */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <div
                  className="floating-card-dark glow-card"
                  style={{
                    background: "#0D1117",
                    borderRadius: 12,
                    border: "1px solid #21262D",
                    padding: 0,
                    maxWidth: 440,
                    width: "100%",
                    overflow: "hidden",
                  }}
                >
                  {/* ─── Card Header Bar ─── */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "10px 16px",
                      borderBottom: "1px solid #21262D",
                      background: "#0D1117",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      {/* Aperture logo dot */}
                      <div style={{ width: 14, height: 14, borderRadius: "50%", background: "#635BFF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#0D1117" }} />
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 600, color: "#E6EDF3" }}>Aperture</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      {/* TESTNET LIVE green dot */}
                      <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 10, fontWeight: 600, color: "#00D66F", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                        <span className="live-dot-dark" />
                        Testnet Live
                      </span>
                      <span style={{ fontSize: 11, color: "#484F58" }}>|</span>
                      <span style={{ fontSize: 11, color: "#8B949E" }}>28 pairs</span>
                    </div>
                  </div>

                  {/* ─── Mini Ticker Strip ─── */}
                  <div
                    style={{
                      overflow: "hidden",
                      padding: "6px 0",
                      borderBottom: "1px solid #21262D",
                      background: "#010409",
                    }}
                  >
                    <div className="mini-ticker-track">
                      {[...heroTickerData, ...heroTickerData].map((t, i) => (
                        <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 500 }}>
                          <span style={{ color: "#8B949E" }}>{t.pair}</span>
                          <span style={{ color: "#E6EDF3" }}>{t.vol} vol</span>
                          <span style={{ color: t.change >= 0 ? "#00D66F" : "#FF4D4F" }}>
                            {t.change >= 0 ? "+" : ""}{t.change.toFixed(1)}%
                          </span>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* ─── KPI Row (mini) ─── */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 0, borderBottom: "1px solid #21262D" }}>
                    <div style={{ padding: "8px 12px", borderRight: "1px solid #21262D" }}>
                      <div style={{ fontSize: 9, color: "#484F58", textTransform: "uppercase", letterSpacing: "0.05em" }}>24H Vol</div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#E6EDF3" }}>$12.68M</div>
                    </div>
                    <div style={{ padding: "8px 12px", borderRight: "1px solid #21262D" }}>
                      <div style={{ fontSize: 9, color: "#484F58", textTransform: "uppercase", letterSpacing: "0.05em" }}>Liquidity</div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#E6EDF3" }}>$7.65M</div>
                    </div>
                    <div style={{ padding: "8px 12px" }}>
                      <div style={{ fontSize: 9, color: "#484F58", textTransform: "uppercase", letterSpacing: "0.05em" }}>Gainers</div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#00D66F" }}>17/28</div>
                    </div>
                  </div>

                  {/* ─── Pair Table Header ─── */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 70px 56px 60px 50px",
                      gap: 4,
                      padding: "6px 12px",
                      borderBottom: "1px solid #21262D",
                      fontSize: 9,
                      fontWeight: 600,
                      color: "#484F58",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    <span>Pair</span>
                    <span style={{ textAlign: "right" }}>Price</span>
                    <span style={{ textAlign: "right" }}>5m</span>
                    <span style={{ textAlign: "right" }}>Vol</span>
                    <span style={{ textAlign: "center" }}>Buy</span>
                  </div>

                  {/* ─── Pair Table Rows ─── */}
                  <div>
                    {cardPairs.map((pair, idx) => {
                      const change5m = pair.priceChange5m ?? 0;
                      const isPositive = change5m >= 0;
                      const sparkColor = isPositive ? "#00D66F" : "#FF4D4F";
                      const sparkPath = makeSparklinePath(pair.sparkline, 60, 20, isPositive);
                      const priceStr = pair.priceToken0PerToken1 >= 1
                        ? pair.priceToken0PerToken1.toLocaleString("en-US", { maximumFractionDigits: 0 })
                        : pair.priceToken0PerToken1 >= 0.01
                        ? pair.priceToken0PerToken1.toFixed(4)
                        : pair.priceToken0PerToken1.toFixed(6);

                      return (
                        <div
                          key={idx}
                          className="pair-row"
                          style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 70px 56px 60px 50px",
                            gap: 4,
                            padding: "7px 12px",
                            borderBottom: idx < cardPairs.length - 1 ? "1px solid #161B22" : "none",
                            alignItems: "center",
                          }}
                        >
                          {/* Pair name + sparkline */}
                          <div style={{ display: "flex", alignItems: "center", gap: 6, minWidth: 0 }}>
                            {/* Token avatar */}
                            <div
                              style={{
                                width: 20,
                                height: 20,
                                borderRadius: "50%",
                                background: `hsl(${(pair.token0.symbol.charCodeAt(0) * 7) % 360}, 60%, 40%)`,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0,
                                fontSize: 8,
                                fontWeight: 700,
                                color: "#FFF",
                              }}
                            >
                              {pair.token0.symbol.slice(0, 2)}
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
                              <span style={{ fontSize: 11, fontWeight: 600, color: "#E6EDF3", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                {pair.token0.symbol}/{pair.token1.symbol}
                              </span>
                              {/* Sparkline */}
                              <svg width="60" height="16" viewBox="0 0 60 16" style={{ marginTop: 1 }}>
                                <path
                                  d={sparkPath}
                                  fill="none"
                                  stroke={sparkColor}
                                  strokeWidth="1.2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="sparkline-path"
                                />
                              </svg>
                            </div>
                          </div>

                          {/* Price */}
                          <span style={{ fontSize: 11, fontWeight: 500, color: "#E6EDF3", textAlign: "right", fontFamily: "'SF Mono', 'Monaco', 'Menlo', 'Consolas', monospace" }}>
                            ${priceStr}
                          </span>

                          {/* 5m change */}
                          <span style={{ fontSize: 11, fontWeight: 600, color: isPositive ? "#00D66F" : "#FF4D4F", textAlign: "right" }}>
                            {isPositive ? "+" : ""}{change5m.toFixed(1)}%
                          </span>

                          {/* Volume */}
                          <span style={{ fontSize: 10, color: "#8B949E", textAlign: "right" }}>
                            {formatUsd(pair.volume24h)}
                          </span>

                          {/* Buy button */}
                          <a
                            href="/explore"
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              padding: "3px 0",
                              fontSize: 10,
                              fontWeight: 600,
                              color: "#00D66F",
                              background: "rgba(0,214,111,0.1)",
                              borderRadius: 4,
                              textDecoration: "none",
                              border: "1px solid rgba(0,214,111,0.2)",
                              transition: "all 0.15s ease",
                            }}
                          >
                            Buy
                          </a>
                        </div>
                      );
                    })}
                  </div>

                  {/* ─── Card Footer ─── */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "8px 12px",
                      borderTop: "1px solid #21262D",
                      background: "#010409",
                    }}
                  >
                    <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 10, color: "#8B949E" }}>
                      <span className="live-dot-dark" />
                      Last synced 6s ago
                    </span>
                    <a
                      href="/explore"
                      style={{
                        fontSize: 10,
                        fontWeight: 600,
                        color: "#635BFF",
                        textDecoration: "none",
                      }}
                    >
                      View all pairs →
                    </a>
                  </div>
                </div>

                {/* Caption below card */}
                <p style={{ fontSize: 12, fontStyle: "italic", color: "#6B7C93", textAlign: "center", marginTop: 12 }}>
                  Live preview of the Aperture DEX Scanner on Arc Network.
                </p>
              </div>
            </div>
          </div>

          {/* ─── Ticker (40px) — bottom of section 1 only ─── */}
          <div
            style={{
              height: 40,
              flexShrink: 0,
              width: "100%",
              background: "#0A2540",
              borderBottom: "1px solid #E8EAF0",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              position: "relative",
              zIndex: 10,
            }}
          >
            <div className="ticker-track-dark">
              {[...heroTickerData, ...heroTickerData].map((t, i) => (
                <span
                  key={i}
                  style={{
                    fontSize: 12,
                    fontWeight: 500,
                    color: "#E6EDF3",
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <span style={{ color: "#8B949E" }}>{t.pair}</span>
                  <span style={{ color: "#E6EDF3" }}>{t.vol}</span>
                  <span style={{ color: t.change >= 0 ? "#00D66F" : "#FF4D4F" }}>
                    {t.change >= 0 ? "+" : ""}{t.change.toFixed(1)}%
                  </span>
                  <span style={{ color: "#30363D", marginLeft: 12 }}>•</span>
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ SECTION 2: FEATURES (dark bg, 100vh) ═══ */}
        <section className="snap-section" style={{ background: "#F6F9FC" }}>
          <div style={{ width: "100%", maxWidth: 1080, padding: "0 48px", textAlign: "center" }}>
            <Reveal>
              <span style={{ fontSize: 12, fontWeight: 600, color: "#635BFF", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                FEATURES
              </span>
              <h2 style={{ fontSize: 36, fontWeight: 700, color: "#0A2540", letterSpacing: "-0.02em", marginTop: 6, lineHeight: 1.1 }}>
                Built for Arc Network builders.
              </h2>
              <p style={{ fontSize: 16, color: "#425466", marginTop: 8, fontWeight: 400 }}>
                Index, query, and stream on-chain data. Everything Aperture does, in one place.
              </p>
            </Reveal>

            <Reveal delay={100}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginTop: 16, textAlign: "left" }}>
                {features.map((feature, i) => (
                  <div
                    key={i}
                    style={{
                      background: "#FFFFFF",
                      borderRadius: 12,
                      padding: 16,
                      border: "1px solid #E3E8EE",
                    }}
                  >
                    {feature.icon}
                    <h3 style={{ fontSize: 18, fontWeight: 600, color: "#0A2540", marginTop: 10 }}>
                      {feature.title}
                    </h3>
                    <p style={{ fontSize: 14, color: "#425466", lineHeight: 1.5, marginTop: 6, fontWeight: 400 }}>
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
              <h2 style={{ fontSize: 44, fontWeight: 700, color: "#0A2540", letterSpacing: "-0.02em", marginTop: 12, lineHeight: 1.1 }}>
                Query any pair in milliseconds.
              </h2>
              <p style={{ fontSize: 17, color: "#425466", marginTop: 16, fontWeight: 400, lineHeight: 1.5 }}>
                Aperture indexes every block on Arc Network. Query swaps, liquidity, and price feeds through a single API.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 24 }}>
                {checklistItems.map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    {checkSvg}
                    <span style={{ fontSize: 15, color: "#0A2540", fontWeight: 400 }}>{item}</span>
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
        <section className="snap-section" style={{ background: "#F6F9FC" }}>
          <div style={{ width: "100%", maxWidth: 1080, padding: "0 48px", textAlign: "center" }}>
            <Reveal>
              <span style={{ fontSize: 12, fontWeight: 600, color: "#6B7C93", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                BY THE NUMBERS
              </span>
              <h2 style={{ fontSize: 36, fontWeight: 700, color: "#0A2540", letterSpacing: "-0.02em", marginTop: 6, lineHeight: 1.1 }}>
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
              <h2 style={{ fontSize: 36, fontWeight: 700, color: "#0A2540", letterSpacing: "-0.02em", marginTop: 6, lineHeight: 1.1 }}>
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
          <div className="gradient-orb" style={{ width: 350, height: 350, background: "#FF8A4C", opacity: 0.25, bottom: "10%", right: "15%", animationDelay: "3s" }} />
          <div className="gradient-orb" style={{ width: 380, height: 380, background: "#8B5CF6", opacity: 0.15, top: "40%", right: "5%", animationDelay: "5s" }} />

          <Reveal>
            <div style={{ textAlign: "center", maxWidth: 600, padding: "0 48px", position: "relative", zIndex: 2 }}>
              <h2 style={{ fontSize: 44, fontWeight: 700, color: "#0A2540", letterSpacing: "-0.02em", lineHeight: 1.1 }}>
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
