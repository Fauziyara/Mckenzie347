"use client";

import { Reveal } from "@/components/reveal";
import { mockPairs } from "@/lib/mock-data";
import { formatUsd } from "@/lib/format";

// ─── Style constants ───────────────────────────────────────────────
const FONT_SANS = "'Inter', -apple-system, system-ui, sans-serif";
const FONT_MONO = "'JetBrains Mono', ui-monospace, monospace";

const COLOR = {
  white: "#FFFFFF",
  dark: "#0A2540",
  grayBg: "#F6F9FC",
  textPrimary: "#1A1F36",
  textSecondary: "#425466",
  textCaption: "#6B7C93",
  arcBlue: "#2f578c",
  orange: "#ff8c00",
  coolBlue: "#5B8DEF",
  borderLight: "#E3E8EE",
  rowBorder: "#F1F5F9",
  green: "#00D4A0",
  greenBg: "#E8F8F0",
  redBg: "#FEE2E2",
  redText: "#DC2626",
} as const;

const CARD_SHADOW = "0 1px 2px rgba(10,37,64,0.04), 0 12px 32px rgba(10,37,64,0.06)";
const CARD_SHADOW_HERO = "0 1px 2px rgba(10,37,64,0.04), 0 24px 48px rgba(10,37,64,0.08)";

// ─── Small inline icon components (24x24, Arc blue) ────────────────
function IconGrid() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={COLOR.arcBlue} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

function IconList() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={COLOR.arcBlue} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="8" y1="6" x2="21" y2="6" />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" />
      <line x1="3" y1="6" x2="3.01" y2="6" />
      <line x1="3" y1="12" x2="3.01" y2="12" />
      <line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
  );
}

function IconChart() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={COLOR.arcBlue} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3v18h18" />
      <path d="M7 14l4-4 4 3 5-6" />
    </svg>
  );
}

function IconShield() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={COLOR.arcBlue} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l8 4v6c0 5-3.5 9-8 10-4.5-1-8-5-8-10V6l8-4z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

function IconCode() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={COLOR.arcBlue} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}

function IconCube() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={COLOR.arcBlue} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  );
}

// ─── Aperture logo SVG ─────────────────────────────────────────────
function ApertureLogo({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="14" stroke={COLOR.arcBlue} strokeWidth="2" />
      <circle cx="16" cy="16" r="6" stroke={COLOR.arcBlue} strokeWidth="2" />
      <path d="M16 2 L16 10" stroke={COLOR.arcBlue} strokeWidth="2" strokeLinecap="round" />
      <path d="M27.86 9 L21.2 12.85" stroke={COLOR.arcBlue} strokeWidth="2" strokeLinecap="round" />
      <path d="M27.86 23 L21.2 19.15" stroke={COLOR.arcBlue} strokeWidth="2" strokeLinecap="round" />
      <path d="M16 30 L16 22" stroke={COLOR.arcBlue} strokeWidth="2" strokeLinecap="round" />
      <path d="M4.14 23 L10.8 19.15" stroke={COLOR.arcBlue} strokeWidth="2" strokeLinecap="round" />
      <path d="M4.14 9 L10.8 12.85" stroke={COLOR.arcBlue} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

// ─── Gradient mesh blobs ───────────────────────────────────────────
function GradientMesh({ dark = false }: { dark?: boolean }) {
  const opacityScale = dark ? 0.7 : 1;
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>
      <div
        style={{
          position: "absolute",
          top: "-100px",
          right: "-50px",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background: COLOR.orange,
          filter: "blur(120px)",
          opacity: 0.15 * opacityScale,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "40%",
          left: "-100px",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background: COLOR.arcBlue,
          filter: "blur(100px)",
          opacity: 0.1 * opacityScale,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-80px",
          right: "20%",
          width: "350px",
          height: "350px",
          borderRadius: "50%",
          background: COLOR.coolBlue,
          filter: "blur(80px)",
          opacity: 0.08 * opacityScale,
        }}
      />
    </div>
  );
}

// ─── Checkmark icon ────────────────────────────────────────────────
function CheckIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={COLOR.arcBlue} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

// ═══════════════════════════════════════════════════════════════════
// PAGE
// ═══════════════════════════════════════════════════════════════════
export default function LandingPage() {
  const pair = mockPairs[0];
  const priceChange = pair.priceChange24h ?? 0;
  const isPositive = priceChange >= 0;

  const features = [
    { icon: <IconGrid />, title: "Pair Discovery", desc: "Every liquidity pool on Arc, indexed the instant it's created. Real-time discovery with full metadata." },
    { icon: <IconList />, title: "Swap History", desc: "Complete on-chain swap logs with price impact, gas costs, and sender analysis for every transaction." },
    { icon: <IconChart />, title: "Liquidity Tracking", desc: "Live liquidity curves and TVL monitoring across all verified pairs. Track depth changes in real time." },
    { icon: <IconShield />, title: "Price Feeds", desc: "Math-verified price data sourced directly from the ledger. No oracles, no estimates, no approximations." },
    { icon: <IconCode />, title: "Analytics API", desc: "Full programmatic access via REST and WebSocket. npm install @aperture/sdk and start building." },
    { icon: <IconCube />, title: "Block Scanner", desc: "Real-time block heights, transaction indexing, and contract event monitoring across Arc Network." },
  ];

  const trustedLogos = ["PROJECTA", "DEXLAB", "ARCSCAN", "LIQUIDITY", "SWAPNET", "CHAINFLOW"];

  const recentSwaps = [
    { type: "BUY", amount: "12,400.00", price: "$1.0044" },
    { type: "SELL", amount: "8,200.50", price: "$1.0046" },
    { type: "BUY", amount: "45,000.00", price: "$1.0045" },
    { type: "SELL", amount: "3,150.75", price: "$1.0043" },
  ];

  const stats = [
    { value: "845,231", label: "LATEST BLOCK" },
    { value: formatUsd(pair.volume24h), label: "24H VOLUME" },
    { value: "12", label: "ACTIVE PAIRS" },
    { value: "22.018", label: "GAS PRICE (GWEI)" },
  ];

  const steps = [
    { num: "01", title: "Open Explorer", desc: "Visit the dashboard to see all pairs on Arc Network in real time. No account needed." },
    { num: "02", title: "Track Data", desc: "Monitor swaps, liquidity, and price feeds for any pair. Set up alerts for price changes." },
    { num: "03", title: "Build with API", desc: "Install the SDK and access everything programmatically. npm install @aperture/sdk" },
  ];

  const devFeatures = [
    "REST API for pair/swap data",
    "WebSocket for real-time updates",
    "TypeScript SDK with full types",
    "Rate limit: 1000 req/min",
  ];

  const codeLines = [
    { text: "$ npm install @aperture/sdk", color: "#FFFFFF" },
    { text: "", color: "" },
    { text: "// Initialize the client", color: "#6B7C93" },
    { text: "import { Aperture } from '@aperture/sdk'", color: "#5B8DEF" },
    { text: "", color: "" },
    { text: "const client = new Aperture({", color: "#FFFFFF" },
    { text: "  network: 'arc-testnet',", color: "#00D4A0" },
    { text: "  wsUrl: 'wss://api.aperture.xyz'", color: "#00D4A0" },
    { text: "})", color: "#FFFFFF" },
    { text: "", color: "" },
    { text: "// Fetch all pairs", color: "#6B7C93" },
    { text: "const pairs = await client.getPairs()", color: "#FFFFFF" },
  ];

  // ─── Nav link helper ─────────────────────────────────────────
  const navLinkStyle: React.CSSProperties = {
    fontSize: "15px",
    fontWeight: 500,
    color: COLOR.textSecondary,
    textDecoration: "none",
    fontFamily: FONT_SANS,
  };

  // ─── Button styles ───────────────────────────────────────────
  const primaryBtn: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    background: COLOR.dark,
    color: COLOR.white,
    borderRadius: "999px",
    padding: "12px 24px",
    fontSize: "15px",
    fontWeight: 500,
    fontFamily: FONT_SANS,
    textDecoration: "none",
    border: "none",
    cursor: "pointer",
  };
  const secondaryBtn: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    background: COLOR.white,
    color: COLOR.dark,
    borderRadius: "999px",
    padding: "12px 24px",
    fontSize: "15px",
    fontWeight: 500,
    fontFamily: FONT_SANS,
    textDecoration: "none",
    border: `1px solid ${COLOR.borderLight}`,
    cursor: "pointer",
  };

  // ─── SVG area chart data ─────────────────────────────────────
  const chartPoints = [40, 55, 48, 62, 58, 72, 68, 80, 75, 85, 90, 88];
  const chartWidth = 320;
  const chartHeight = 120;
  const chartMax = Math.max(...chartPoints);
  const chartMin = Math.min(...chartPoints);
  const chartRange = chartMax - chartMin || 1;
  const pointStep = chartWidth / (chartPoints.length - 1);
  const areaPath =
    `M 0 ${chartHeight - ((chartPoints[0] - chartMin) / chartRange) * chartHeight}` +
    chartPoints
      .slice(1)
      .map((p, i) => ` L ${(i + 1) * pointStep} ${chartHeight - ((p - chartMin) / chartRange) * chartHeight}`)
      .join("") +
    ` L ${chartWidth} ${chartHeight} L 0 ${chartHeight} Z`;
  const linePath =
    `M 0 ${chartHeight - ((chartPoints[0] - chartMin) / chartRange) * chartHeight}` +
    chartPoints
      .slice(1)
      .map((p, i) => ` L ${(i + 1) * pointStep} ${chartHeight - ((p - chartMin) / chartRange) * chartHeight}`)
      .join("");

  return (
    <div style={{ fontFamily: FONT_SANS, background: COLOR.white, color: COLOR.textPrimary, margin: 0, padding: 0 }}>
      {/* ═══ 1. NAV ═══ */}
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          height: "68px",
          background: COLOR.white,
          display: "flex",
          alignItems: "center",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            width: "100%",
            padding: "0 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Left: Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <ApertureLogo size={28} />
            <span style={{ fontSize: "18px", fontWeight: 700, color: COLOR.textPrimary, fontFamily: FONT_SANS }}>
              Aperture
            </span>
          </div>

          {/* Center: Nav links */}
          <div style={{ display: "flex", alignItems: "center", gap: "32px" }}>
            <a href="#explore" style={navLinkStyle}>Explore</a>
            <a href="#pairs" style={navLinkStyle}>Pairs</a>
            <a href="#api" style={navLinkStyle}>API</a>
            <a href="#docs" style={navLinkStyle}>Docs</a>
          </div>

          {/* Right: Auth */}
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <a href="#signin" style={{ ...navLinkStyle, textDecoration: "none" }}>
              Sign in
            </a>
            <a
              href="#app"
              style={{
                display: "inline-flex",
                alignItems: "center",
                background: COLOR.dark,
                color: COLOR.white,
                borderRadius: "999px",
                padding: "10px 18px",
                fontSize: "15px",
                fontWeight: 500,
                fontFamily: FONT_SANS,
                textDecoration: "none",
              }}
            >
              Go to app →
            </a>
          </div>
        </div>
      </nav>

      {/* ═══ 2. HERO ═══ */}
      <section style={{ position: "relative", background: COLOR.white, overflow: "hidden" }}>
        <GradientMesh />
        <div
          style={{
            position: "relative",
            zIndex: 1,
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "80px 24px 100px",
            display: "grid",
            gridTemplateColumns: "55% 45%",
            gap: "48px",
            alignItems: "center",
          }}
        >
          {/* LEFT */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <Reveal delay={0}>
              <span
                style={{
                  fontSize: "14px",
                  fontWeight: 500,
                  color: COLOR.textCaption,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  fontFamily: FONT_SANS,
                }}
              >
                DEX INTELLIGENCE • ARC NETWORK
              </span>
            </Reveal>
            <Reveal delay={100}>
              <h1
                style={{
                  fontSize: "60px",
                  fontWeight: 700,
                  color: COLOR.textPrimary,
                  letterSpacing: "-0.02em",
                  lineHeight: 1.05,
                  margin: 0,
                  fontFamily: FONT_SANS,
                }}
              >
                Scan every pair
                <br />
                on Arc Network.
              </h1>
            </Reveal>
            <Reveal delay={200}>
              <p
                style={{
                  fontSize: "19px",
                  fontWeight: 400,
                  color: COLOR.textSecondary,
                  maxWidth: "480px",
                  lineHeight: 1.5,
                  margin: 0,
                  fontFamily: FONT_SANS,
                }}
              >
                Real-time pair data, on-chain swap history, and verified liquidity analytics. No
                estimates — just deterministic data from Arc's public ledger.
              </p>
            </Reveal>
            <Reveal delay={300}>
              <div style={{ display: "flex", gap: "12px" }}>
                <a href="#explore" style={primaryBtn}>
                  Explore pairs →
                </a>
                <a href="#docs" style={secondaryBtn}>
                  Read docs
                </a>
              </div>
            </Reveal>
          </div>

          {/* RIGHT: Scanner card */}
          <Reveal delay={200}>
            <div
              style={{
                background: COLOR.white,
                borderRadius: "14px",
                boxShadow: CARD_SHADOW_HERO,
                padding: "24px",
                fontFamily: FONT_SANS,
              }}
            >
              {/* Top bar */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <span style={{ display: "inline-block", width: "8px", height: "8px", borderRadius: "50%", background: COLOR.green }} />
                  <span style={{ fontSize: "14px", fontWeight: 500, color: COLOR.textPrimary, fontFamily: FONT_SANS }}>LIVE</span>
                </div>
                <span style={{ fontSize: "14px", fontWeight: 500, color: COLOR.textCaption, textTransform: "uppercase", fontFamily: FONT_SANS }}>
                  APERTURE TERMINAL
                </span>
              </div>

              {/* Divider */}
              <div style={{ height: "1px", background: COLOR.borderLight, marginBottom: "20px" }} />

              {/* Pair header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <span style={{ fontSize: "24px", fontWeight: 700, color: COLOR.textPrimary, fontFamily: FONT_SANS }}>
                  {pair.token0.symbol}/{pair.token1.symbol}
                </span>
                <span
                  style={{
                    fontSize: "13px",
                    fontWeight: 600,
                    padding: "4px 10px",
                    borderRadius: "6px",
                    background: isPositive ? COLOR.greenBg : COLOR.redBg,
                    color: isPositive ? "#0a7c4a" : COLOR.redText,
                    fontFamily: FONT_SANS,
                  }}
                >
                  {isPositive ? "+" : ""}
                  {priceChange.toFixed(2)}%
                </span>
              </div>

              {/* Data rows */}
              <div style={{ display: "flex", flexDirection: "column" }}>
                {[
                  { label: "PRICE", value: "$1.0045" },
                  { label: "24H VOLUME", value: formatUsd(pair.volume24h) },
                  { label: "LIQUIDITY", value: formatUsd(pair.liquidityUsd) },
                  { label: "TX COUNT 24H", value: String(pair.txCount24h) },
                ].map((row, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "12px 0",
                      borderBottom: i < 3 ? `1px solid ${COLOR.rowBorder}` : "none",
                    }}
                  >
                    <span style={{ fontSize: "14px", color: COLOR.textCaption, fontWeight: 500, fontFamily: FONT_SANS }}>
                      {row.label}
                    </span>
                    <span style={{ fontSize: "16px", color: COLOR.textPrimary, fontFamily: FONT_MONO, fontWeight: 500 }}>
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>

              {/* Bottom code */}
              <div style={{ marginTop: "20px", paddingTop: "16px", borderTop: `1px solid ${COLOR.borderLight}` }}>
                <span style={{ fontSize: "13px", fontFamily: FONT_MONO, color: COLOR.arcBlue }}>
                  npm install @aperture/sdk
                </span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ 3. TRUSTED BY ═══ */}
      <section style={{ background: COLOR.white, padding: "48px 0" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px", textAlign: "center" }}>
          <p style={{ fontSize: "14px", color: COLOR.textCaption, fontWeight: 500, marginBottom: "32px", fontFamily: FONT_SANS }}>
            Trusted by teams building on Arc
          </p>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "48px", flexWrap: "wrap" }}>
            {trustedLogos.map((logo, i) => (
              <span key={i} style={{ fontSize: "18px", fontWeight: 600, color: COLOR.textSecondary, opacity: 0.5, fontFamily: FONT_SANS }}>
                {logo}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 4. FEATURES ═══ */}
      <section style={{ background: COLOR.white, padding: "96px 0" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
          <Reveal delay={0}>
            <span style={{ fontSize: "14px", textTransform: "uppercase", color: COLOR.textCaption, fontWeight: 500, fontFamily: FONT_SANS }}>
              FEATURES
            </span>
          </Reveal>
          <Reveal delay={100}>
            <h2
              style={{
                fontSize: "44px",
                fontWeight: 700,
                color: COLOR.textPrimary,
                letterSpacing: "-0.02em",
                lineHeight: 1.1,
                margin: "16px 0 64px",
                fontFamily: FONT_SANS,
              }}
            >
              Everything you need to
              <br />
              scan Arc Network.
            </h2>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px" }}>
            {features.map((f, i) => (
              <Reveal key={i} delay={i * 80}>
                <div
                  style={{
                    background: COLOR.white,
                    borderRadius: "14px",
                    boxShadow: CARD_SHADOW,
                    padding: "36px",
                    height: "100%",
                  }}
                >
                  <div style={{ marginBottom: "20px" }}>{f.icon}</div>
                  <h3 style={{ fontSize: "22px", fontWeight: 600, color: COLOR.textPrimary, margin: "0 0 12px", fontFamily: FONT_SANS }}>
                    {f.title}
                  </h3>
                  <p style={{ fontSize: "15px", color: COLOR.textSecondary, lineHeight: 1.5, margin: "0 0 20px", fontFamily: FONT_SANS }}>
                    {f.desc}
                  </p>
                  <a href="#learn" style={{ fontSize: "14px", fontWeight: 500, color: COLOR.arcBlue, textDecoration: "none", fontFamily: FONT_SANS }}>
                    Learn more →
                  </a>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 5. SHOWCASE SECTION ═══ */}
      <section style={{ background: COLOR.grayBg, padding: "120px 0" }}>
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "0 24px",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "64px",
            alignItems: "center",
          }}
        >
          {/* LEFT */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <Reveal delay={0}>
              <span style={{ fontSize: "14px", textTransform: "uppercase", color: COLOR.textCaption, fontWeight: 500, fontFamily: FONT_SANS }}>
                LIVE DATA
              </span>
            </Reveal>
            <Reveal delay={100}>
              <h2
                style={{
                  fontSize: "44px",
                  fontWeight: 700,
                  color: COLOR.textPrimary,
                  letterSpacing: "-0.02em",
                  lineHeight: 1.1,
                  margin: 0,
                  fontFamily: FONT_SANS,
                }}
              >
                Verified on-chain,
                <br />
                in real time.
              </h2>
            </Reveal>
            <Reveal delay={200}>
              <p style={{ fontSize: "17px", color: COLOR.textSecondary, maxWidth: "440px", lineHeight: 1.5, margin: 0, fontFamily: FONT_SANS }}>
                Every data point is sourced directly from Arc Network's public ledger. No estimates, no
                approximations — just mathematically verified data.
              </p>
            </Reveal>
            <Reveal delay={300}>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "8px" }}>
                {["Deterministic price feeds", "Sub-second finality", "Full swap history"].map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <CheckIcon />
                    <span style={{ fontSize: "16px", color: COLOR.textPrimary, fontFamily: FONT_SANS }}>{item}</span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          {/* RIGHT: Stacked cards */}
          <Reveal delay={200}>
            <div style={{ position: "relative" }}>
              {/* Card 1: Recent Swaps */}
              <div
                style={{
                  background: COLOR.white,
                  borderRadius: "14px",
                  boxShadow: CARD_SHADOW,
                  padding: "24px",
                  marginBottom: "24px",
                  position: "relative",
                  zIndex: 2,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                  <span style={{ fontSize: "16px", fontWeight: 600, color: COLOR.textPrimary, fontFamily: FONT_SANS }}>
                    Recent Swaps
                  </span>
                  <span style={{ fontSize: "13px", color: COLOR.textCaption, fontFamily: FONT_SANS }}>Last 4</span>
                </div>
                {recentSwaps.map((swap, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "10px 0",
                      borderBottom: i < recentSwaps.length - 1 ? `1px solid ${COLOR.rowBorder}` : "none",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: 600,
                          padding: "3px 8px",
                          borderRadius: "6px",
                          background: swap.type === "BUY" ? COLOR.greenBg : COLOR.redBg,
                          color: swap.type === "BUY" ? "#0a7c4a" : COLOR.redText,
                          fontFamily: FONT_SANS,
                        }}
                      >
                        {swap.type}
                      </span>
                      <span style={{ fontSize: "14px", color: COLOR.textPrimary, fontFamily: FONT_MONO }}>{swap.amount}</span>
                    </div>
                    <span style={{ fontSize: "14px", color: COLOR.textSecondary, fontFamily: FONT_MONO }}>{swap.price}</span>
                  </div>
                ))}
              </div>

              {/* Card 2: Liquidity Chart */}
              <div
                style={{
                  background: COLOR.white,
                  borderRadius: "14px",
                  boxShadow: CARD_SHADOW,
                  padding: "24px",
                  position: "relative",
                  zIndex: 1,
                  marginTop: "-12px",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                  <span style={{ fontSize: "16px", fontWeight: 600, color: COLOR.textPrimary, fontFamily: FONT_SANS }}>
                    Liquidity Chart
                  </span>
                  <span style={{ fontSize: "13px", color: COLOR.textCaption, fontFamily: FONT_SANS }}>TVL — 12h</span>
                </div>
                <svg width="100%" height={chartHeight} viewBox={`0 0 ${chartWidth} ${chartHeight}`} preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={COLOR.arcBlue} stopOpacity="0.25" />
                      <stop offset="100%" stopColor={COLOR.arcBlue} stopOpacity="0.02" />
                    </linearGradient>
                  </defs>
                  <path d={areaPath} fill="url(#chartGrad)" />
                  <path d={linePath} fill="none" stroke={COLOR.arcBlue} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ 6. STATS BAR ═══ */}
      <section style={{ position: "relative", background: COLOR.dark, padding: "96px 0" }}>
        {/* Top divider */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: COLOR.arcBlue }} />
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "24px", textAlign: "center" }}>
            {stats.map((s, i) => (
              <Reveal key={i} delay={i * 80}>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <span style={{ fontSize: "36px", fontWeight: 700, color: COLOR.white, fontFamily: FONT_MONO, lineHeight: 1.1 }}>
                    {s.value}
                  </span>
                  <span style={{ fontSize: "14px", textTransform: "uppercase", color: "rgba(255,255,255,0.7)", fontWeight: 500, fontFamily: FONT_SANS }}>
                    {s.label}
                  </span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 7. HOW IT WORKS ═══ */}
      <section style={{ background: COLOR.white, padding: "96px 0" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
          <Reveal delay={0}>
            <span style={{ fontSize: "14px", textTransform: "uppercase", color: COLOR.textCaption, fontWeight: 500, fontFamily: FONT_SANS }}>
              GET STARTED
            </span>
          </Reveal>
          <Reveal delay={100}>
            <h2
              style={{
                fontSize: "44px",
                fontWeight: 700,
                color: COLOR.textPrimary,
                letterSpacing: "-0.02em",
                lineHeight: 1.1,
                margin: "16px 0 64px",
                fontFamily: FONT_SANS,
              }}
            >
              Three steps to start
              <br />
              scanning Arc Network.
            </h2>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px" }}>
            {steps.map((s, i) => (
              <Reveal key={i} delay={i * 100}>
                <div>
                  <span style={{ fontSize: "48px", fontWeight: 700, color: COLOR.arcBlue, opacity: 0.2, fontFamily: FONT_SANS, display: "block", marginBottom: "16px" }}>
                    {s.num}
                  </span>
                  <h3 style={{ fontSize: "22px", fontWeight: 600, color: COLOR.textPrimary, margin: "0 0 12px", fontFamily: FONT_SANS }}>
                    {s.title}
                  </h3>
                  <p style={{ fontSize: "15px", color: COLOR.textSecondary, lineHeight: 1.5, margin: 0, fontFamily: FONT_SANS }}>
                    {s.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 8. DEVELOPER SECTION ═══ */}
      <section style={{ background: COLOR.grayBg, padding: "120px 0" }}>
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "0 24px",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "64px",
            alignItems: "center",
          }}
        >
          {/* LEFT: Code block */}
          <Reveal delay={0}>
            <div
              style={{
                background: COLOR.dark,
                borderRadius: "14px",
                padding: "32px",
                boxShadow: CARD_SHADOW,
                fontFamily: FONT_MONO,
              }}
            >
              {/* Terminal top bar */}
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "24px" }}>
                <span style={{ display: "inline-block", width: "12px", height: "12px", borderRadius: "50%", background: "#FF5F57" }} />
                <span style={{ display: "inline-block", width: "12px", height: "12px", borderRadius: "50%", background: "#FFBD2E" }} />
                <span style={{ display: "inline-block", width: "12px", height: "12px", borderRadius: "50%", background: "#28CA42" }} />
                <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", marginLeft: "8px", fontFamily: FONT_MONO }}>terminal</span>
              </div>
              {/* Code lines */}
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                {codeLines.map((line, i) => (
                  <div key={i} style={{ fontSize: "14px", fontFamily: FONT_MONO, color: line.color || "transparent", minHeight: "20px" }}>
                    {line.text || "\u00A0"}
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* RIGHT: Text */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <Reveal delay={0}>
              <span style={{ fontSize: "14px", textTransform: "uppercase", color: COLOR.textCaption, fontWeight: 500, fontFamily: FONT_SANS }}>
                DEVELOPER API
              </span>
            </Reveal>
            <Reveal delay={100}>
              <h2
                style={{
                  fontSize: "44px",
                  fontWeight: 700,
                  color: COLOR.textPrimary,
                  letterSpacing: "-0.02em",
                  lineHeight: 1.1,
                  margin: 0,
                  fontFamily: FONT_SANS,
                }}
              >
                Build with
                <br />
                verified data.
              </h2>
            </Reveal>
            <Reveal delay={200}>
              <p style={{ fontSize: "17px", color: COLOR.textSecondary, lineHeight: 1.5, margin: 0, fontFamily: FONT_SANS }}>
                Full programmatic access to every pair, swap, and liquidity pool on Arc Network. REST +
                WebSocket. TypeScript SDK.
              </p>
            </Reveal>
            <Reveal delay={300}>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {devFeatures.map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <CheckIcon />
                    <span style={{ fontSize: "16px", color: COLOR.textPrimary, fontFamily: FONT_SANS }}>{item}</span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══ 9. CTA SECTION ═══ */}
      <section style={{ position: "relative", background: COLOR.dark, padding: "120px 0", overflow: "hidden" }}>
        <GradientMesh dark />
        <div style={{ position: "relative", zIndex: 1, maxWidth: "640px", margin: "0 auto", padding: "0 24px", textAlign: "center" }}>
          <Reveal delay={0}>
            <span style={{ fontSize: "14px", textTransform: "uppercase", color: "rgba(255,255,255,0.7)", fontWeight: 500, fontFamily: FONT_SANS }}>
              GET STARTED
            </span>
          </Reveal>
          <Reveal delay={100}>
            <h2
              style={{
                fontSize: "48px",
                fontWeight: 700,
                color: COLOR.white,
                letterSpacing: "-0.02em",
                lineHeight: 1.1,
                margin: "16px 0 24px",
                fontFamily: FONT_SANS,
              }}
            >
              Start scanning
              <br />
              Arc Network today.
            </h2>
          </Reveal>
          <Reveal delay={200}>
            <p style={{ fontSize: "18px", color: "rgba(255,255,255,0.7)", lineHeight: 1.5, margin: "0 0 32px", fontFamily: FONT_SANS }}>
              Index every pair, track every swap, and build with verified on-chain data.
            </p>
          </Reveal>
          <Reveal delay={300}>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
              <a
                href="#explore"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  background: COLOR.white,
                  color: COLOR.dark,
                  borderRadius: "999px",
                  padding: "14px 28px",
                  fontSize: "15px",
                  fontWeight: 600,
                  fontFamily: FONT_SANS,
                  textDecoration: "none",
                }}
              >
                Explore pairs →
              </a>
              <a
                href="#docs"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  background: "transparent",
                  color: COLOR.white,
                  borderRadius: "999px",
                  padding: "14px 28px",
                  fontSize: "15px",
                  fontWeight: 600,
                  fontFamily: FONT_SANS,
                  textDecoration: "none",
                  border: "1px solid rgba(255,255,255,0.3)",
                }}
              >
                Read docs
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ 10. FOOTER ═══ */}
      <footer style={{ background: COLOR.white, borderTop: `1px solid ${COLOR.borderLight}`, padding: "64px 0 32px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
          {/* 4-column grid */}
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "48px", marginBottom: "48px" }}>
            {/* COL 1 */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <ApertureLogo size={24} />
                <span style={{ fontSize: "18px", fontWeight: 700, color: COLOR.textPrimary, fontFamily: FONT_SANS }}>Aperture</span>
              </div>
              <span style={{ fontSize: "14px", color: COLOR.textCaption, fontFamily: FONT_SANS }}>
                DEX scanner on Arc Network
              </span>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  background: COLOR.grayBg,
                  border: `1px solid ${COLOR.borderLight}`,
                  borderRadius: "6px",
                  padding: "4px 10px",
                  width: "fit-content",
                }}
              >
                <span style={{ display: "inline-block", width: "6px", height: "6px", borderRadius: "50%", background: COLOR.green }} />
                <span style={{ fontSize: "12px", color: COLOR.textSecondary, fontWeight: 500, fontFamily: FONT_SANS }}>ARC TESTNET</span>
              </div>
            </div>

            {/* COL 2: PRODUCT */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <span style={{ fontSize: "12px", textTransform: "uppercase", color: COLOR.textCaption, fontWeight: 600, fontFamily: FONT_SANS }}>
                PRODUCT
              </span>
              {["Explore", "Pairs", "Swap", "Portfolio"].map((link, i) => (
                <a key={i} href={`#${link.toLowerCase()}`} style={{ fontSize: "14px", color: COLOR.textSecondary, textDecoration: "none", fontFamily: FONT_SANS }}>
                  {link}
                </a>
              ))}
            </div>

            {/* COL 3: RESOURCES */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <span style={{ fontSize: "12px", textTransform: "uppercase", color: COLOR.textCaption, fontWeight: 600, fontFamily: FONT_SANS }}>
                RESOURCES
              </span>
              {["Docs", "API", "GitHub", "Status"].map((link, i) => (
                <a key={i} href={`#${link.toLowerCase()}`} style={{ fontSize: "14px", color: COLOR.textSecondary, textDecoration: "none", fontFamily: FONT_SANS }}>
                  {link}
                </a>
              ))}
            </div>

            {/* COL 4: COMPANY */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <span style={{ fontSize: "12px", textTransform: "uppercase", color: COLOR.textCaption, fontWeight: 600, fontFamily: FONT_SANS }}>
                COMPANY
              </span>
              {["About", "Blog", "Contact", "Privacy"].map((link, i) => (
                <a key={i} href={`#${link.toLowerCase()}`} style={{ fontSize: "14px", color: COLOR.textSecondary, textDecoration: "none", fontFamily: FONT_SANS }}>
                  {link}
                </a>
              ))}
            </div>
          </div>

          {/* Bottom bar */}
          <div style={{ borderTop: `1px solid ${COLOR.borderLight}`, paddingTop: "24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "13px", color: COLOR.textCaption, fontFamily: FONT_SANS }}>© 2026 Aperture</span>
            <span style={{ fontSize: "13px", color: COLOR.textCaption, fontFamily: FONT_SANS }}>
              Built on Arc™ — Arc is a trademark of Circle Internet Group, Inc.
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
