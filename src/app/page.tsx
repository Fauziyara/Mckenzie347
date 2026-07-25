"use client";

import { Reveal } from "@/components/reveal";
import { mockPairs } from "@/lib/mock-data";
import { formatUsd } from "@/lib/format";

const p0 = mockPairs[0];

/* ── Shared style constants ───────────────────────────────────────── */
const FONT_DISPLAY = "'Space Grotesk', 'Inter', sans-serif";
const FONT_BODY = "'Inter', system-ui, sans-serif";
const FONT_MONO = "'JetBrains Mono', ui-monospace, monospace";

const C = {
  ink: "#1e1d29",
  paper: "#f7f7f7",
  arcBlue: "#2f578c",
  cream: "#f7f7f7",
  orange: "#ff8c00",
  green: "#10b981",
  text2Dark: "rgba(247,247,247,0.76)",
  text3Dark: "rgba(247,247,247,0.5)",
  text2Light: "#6b7280",
  borderDark: "rgba(255,255,255,0.08)",
  borderLight: "#e5e7eb",
  cardDarkBg: "rgba(255,255,255,0.04)",
  cardLightBg: "#ffffff",
};

/* ── Eyebrow (orange dot + uppercase label) ──────────────────────── */
function Eyebrow({
  label,
  textColor,
}: {
  label: string;
  textColor: string;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <span
        style={{
          display: "inline-block",
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: C.orange,
        }}
      />
      <span
        style={{
          fontFamily: FONT_BODY,
          fontSize: 12,
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          fontWeight: 500,
          color: textColor,
        }}
      >
        {label}
      </span>
    </div>
  );
}

/* ── Tag pill (small, 6px radius) ─────────────────────────────────── */
function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        background: "rgba(255,255,255,0.06)",
        border: `1px solid ${C.borderDark}`,
        borderRadius: 6,
        padding: "4px 10px",
        fontSize: 11,
        textTransform: "uppercase",
        fontWeight: 500,
        color: C.text2Dark,
        fontFamily: FONT_BODY,
      }}
    >
      {children}
    </span>
  );
}

/* ── Aperture logo (SVG aperture/lens) ────────────────────────────── */
function ApertureLogo({ size = 28 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      aria-label="Aperture logo"
    >
      <rect
        x="1"
        y="1"
        width="30"
        height="30"
        rx="6"
        stroke="rgba(255,255,255,0.15)"
        strokeWidth="1"
      />
      <circle
        cx="16"
        cy="16"
        r="9"
        stroke={C.cream}
        strokeWidth="1.5"
      />
      <circle cx="16" cy="16" r="3" fill={C.orange} />
      {/* Aperture blades */}
      <path
        d="M16 7 L16 16 L23 12"
        stroke={C.cream}
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.6"
      />
      <path
        d="M23 12 L16 16 L21 23"
        stroke={C.cream}
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.6"
      />
      <path
        d="M21 23 L16 16 L9 20"
        stroke={C.cream}
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.6"
      />
      <path
        d="M9 20 L16 16 L16 7"
        stroke={C.cream}
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.6"
      />
    </svg>
  );
}

/* ── Feature card data ────────────────────────────────────────────── */
const features = [
  {
    num: "01",
    tag: "DEX NATIVE",
    title: "Pair Discovery",
    desc: "Every liquidity pool on Arc, indexed the instant it's created.",
  },
  {
    num: "02",
    tag: "ON-CHAIN",
    title: "Swap History",
    desc: "Complete swap logs with price impact, gas, and sender analysis.",
  },
  {
    num: "03",
    tag: "REAL-TIME",
    title: "Liquidity Tracking",
    desc: "Live liquidity curves and TVL across all verified pairs.",
  },
  {
    num: "04",
    tag: "VERIFIED",
    title: "Price Feeds",
    desc: "Math-verified price data — no oracles, no estimates.",
  },
  {
    num: "05",
    tag: "SDK",
    title: "Analytics API",
    desc: "24h volume, tx count, and price change via REST + WebSocket.",
  },
  {
    num: "06",
    tag: "LIVE",
    title: "Block Scanner",
    desc: "Real-time block heights, transactions, and contract events.",
  },
];

const steps = [
  {
    num: "01",
    title: "Open Explorer",
    desc: "Visit the dashboard to see all pairs on Arc Network in real time.",
  },
  {
    num: "02",
    title: "Track Data",
    desc: "Monitor swaps, liquidity, and price feeds for any pair.",
  },
  {
    num: "03",
    title: "Build with API",
    desc: "Install the SDK and access everything programmatically.",
  },
];

const stats = [
  { label: "LATEST BLOCK", value: "845,231" },
  { label: "24H VOLUME", value: formatUsd(p0.volume24h) },
  { label: "ACTIVE PAIRS", value: "12" },
  { label: "GAS PRICE", value: "22.018 GWEI" },
];

/* ── Mock swap list for showcase card ──────────────────────────────── */
const mockSwaps = [
  { side: "BUY", amount: "1.42", token: p0.token0.symbol, usd: "$2,840" },
  { side: "SELL", amount: "0.86", token: p0.token1.symbol, usd: "$1,720" },
  { side: "BUY", amount: "3.11", token: p0.token0.symbol, usd: "$6,220" },
  { side: "SELL", amount: "0.50", token: p0.token1.symbol, usd: "$1,000" },
];

/* ── Page ─────────────────────────────────────────────────────────── */
export default function Page() {
  return (
    <div
      style={{
        background: C.ink,
        color: C.cream,
        fontFamily: FONT_BODY,
        fontSize: 15,
        lineHeight: 1.625,
        margin: 0,
        padding: 0,
      }}
    >
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes scrollLine {
          0% { transform: scaleY(0); transform-origin: top; }
          50% { transform: scaleY(1); transform-origin: top; }
          51% { transform: scaleY(1); transform-origin: bottom; }
          100% { transform: scaleY(0); transform-origin: bottom; }
        }
        @keyframes orbPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        html { scroll-behavior: smooth; }
        body { margin: 0; }
        a { text-decoration: none; color: inherit; }
      `}</style>

      {/* ═══ 1. STICKY HEADER ═══ */}
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: 64,
          background: "rgba(30,29,41,0.78)",
          backdropFilter: "blur(40px)",
          WebkitBackdropFilter: "blur(40px)",
          borderBottom: `1px solid ${C.borderDark}`,
          zIndex: 100,
        }}
      >
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            height: "100%",
            padding: "0 32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Left: logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <ApertureLogo size={28} />
            <span
              style={{
                fontFamily: FONT_DISPLAY,
                fontSize: 16,
                fontWeight: 600,
                color: C.cream,
                letterSpacing: "-0.01em",
              }}
            >
              APERTURE
            </span>
          </div>

          {/* Center: nav */}
          <nav
            style={{
              display: "flex",
              alignItems: "center",
              gap: 32,
            }}
          >
            <a
              href="#explore"
              style={{
                fontSize: 14,
                color: C.text2Dark,
                position: "relative",
                paddingBottom: 4,
                borderBottom: `2px solid ${C.orange}`,
              }}
            >
              Explore
            </a>
            <a href="#security" style={{ fontSize: 14, color: C.text2Dark }}>
              Security
            </a>
            <a href="#api" style={{ fontSize: 14, color: C.text2Dark }}>
              API
            </a>
            <a href="#docs" style={{ fontSize: 14, color: C.text2Dark }}>
              Docs
            </a>
          </nav>

          {/* Right: status + connect */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                background: "rgba(255,255,255,0.06)",
                border: `1px solid rgba(255,255,255,0.1)`,
                borderRadius: 999,
                padding: "6px 12px",
                fontSize: 12,
                color: C.text2Dark,
                fontFamily: FONT_BODY,
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: C.green,
                }}
              />
              ARC TESTNET
            </span>
            <button
              style={{
                background: C.cream,
                color: C.ink,
                borderRadius: 8,
                padding: "8px 16px",
                fontSize: 14,
                fontWeight: 500,
                border: "none",
                cursor: "pointer",
                fontFamily: FONT_BODY,
              }}
            >
              Connect
            </button>
          </div>
        </div>
      </header>

      {/* ═══ 2. HERO ═══ */}
      <section
        style={{
          position: "relative",
          minHeight: "auto",
          background: C.arcBlue,
          backgroundImage:
            "radial-gradient(ellipse at center, rgba(172,198,233,0.15) 0%, rgba(47,87,140,0) 70%)",
          overflow: "hidden",
          paddingTop: 100,
          paddingBottom: 60,
          paddingLeft: 32,
          paddingRight: 32,
        }}
      >
        {/* Orb 1: top-right, orange */}
        <div
          style={{
            position: "absolute",
            top: -100,
            right: -100,
            width: 400,
            height: 400,
            background:
              "radial-gradient(circle, rgba(255,140,0,0.08) 0%, transparent 70%)",
            filter: "blur(40px)",
            pointerEvents: "none",
            animation: "orbPulse 6s ease-in-out infinite",
          }}
        />
        {/* Orb 2: bottom-left, blue */}
        <div
          style={{
            position: "absolute",
            bottom: -80,
            left: -80,
            width: 350,
            height: 350,
            background:
              "radial-gradient(circle, rgba(172,198,233,0.12) 0%, transparent 70%)",
            filter: "blur(40px)",
            pointerEvents: "none",
            animation: "orbPulse 8s ease-in-out infinite",
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 2,
            maxWidth: 1200,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "1fr auto",
            gap: 64,
            alignItems: "center",
          }}
        >
          {/* Left content */}
          <div>
            <Eyebrow
              label="DEX INTELLIGENCE • ARC NETWORK"
              textColor={C.text2Dark}
            />

            <h1
              style={{
                fontFamily: FONT_DISPLAY,
                fontSize: 120,
                fontWeight: 600,
                color: C.cream,
                letterSpacing: "-0.025em",
                lineHeight: 1.0,
                margin: "24px 0 0 0",
              }}
            >
              Scan every
              <br />
              <span style={{ fontStyle: "italic" }}>pair</span> on Arc.
            </h1>

            <p
              style={{
                fontSize: 18,
                fontWeight: 400,
                color: C.text2Dark,
                maxWidth: 520,
                lineHeight: 1.625,
                margin: "32px 0 0 0",
              }}
            >
              A transparent DEX scanner for Arc Network. Real-time pair data,
              on-chain swap history, and verified liquidity analytics — no
              estimates, just deterministic data.
            </p>

            {/* Tag row */}
            <div
              style={{
                display: "flex",
                gap: 8,
                flexWrap: "wrap",
                marginTop: 28,
              }}
            >
              <Tag>PAIRS</Tag>
              <Tag>SWAPS</Tag>
              <Tag>LIQUIDITY</Tag>
              <Tag>VOLUME</Tag>
              <Tag>API</Tag>
            </div>

            {/* Buttons */}
            <div
              style={{
                display: "flex",
                gap: 12,
                marginTop: 32,
              }}
            >
              <a
                href="#explore"
                style={{
                  background: C.cream,
                  color: C.ink,
                  borderRadius: 8,
                  padding: "12px 24px",
                  fontSize: 15,
                  fontWeight: 500,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  fontFamily: FONT_BODY,
                }}
              >
                Explore pairs →
              </a>
              <a
                href="#docs"
                style={{
                  background: "transparent",
                  border: `1px solid rgba(255,255,255,0.15)`,
                  color: C.cream,
                  borderRadius: 8,
                  padding: "12px 24px",
                  fontSize: 15,
                  fontWeight: 500,
                  display: "inline-flex",
                  alignItems: "center",
                  fontFamily: FONT_BODY,
                }}
              >
                Read docs
              </a>
            </div>
          </div>

          {/* Right: Terminal card */}
          <div
            style={{
              background: "rgba(255,255,255,0.05)",
              border: `1px solid ${C.borderDark}`,
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              borderRadius: 16,
              padding: 24,
              width: 360,
            }}
          >
            {/* Terminal header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                paddingBottom: 16,
              }}
            >
              <span
                style={{
                  fontSize: 12,
                  textTransform: "uppercase",
                  color: C.text3Dark,
                  fontFamily: FONT_BODY,
                  fontWeight: 500,
                  letterSpacing: "0.05em",
                }}
              >
                APERTURE TERMINAL
              </span>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 12,
                  textTransform: "uppercase",
                  color: C.green,
                  fontFamily: FONT_BODY,
                  fontWeight: 500,
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: C.green,
                  }}
                />
                ONLINE
              </span>
            </div>

            {/* Divider */}
            <div
              style={{
                height: 1,
                background: C.borderDark,
                marginBottom: 4,
              }}
            />

            {/* Data rows */}
            <DataRow label="PAIRS" value="12" />
            <DataRow label="24H VOLUME" value={formatUsd(p0.volume24h)} />
            <DataRow label="LIQUIDITY" value={formatUsd(p0.liquidityUsd)} />
            <DataRow
              label="BLOCK"
              value="845,231"
              isLast={true}
            />

            {/* Bottom */}
            <div
              style={{
                marginTop: 16,
                fontSize: 13,
                fontFamily: FONT_MONO,
                color: C.orange,
              }}
            >
              npm install @aperture/sdk
            </div>
          </div>
        </div>

        {/* SCROLL indicator */}
        <div
          style={{
            position: "absolute",
            bottom: 32,
            left: 32,
            zIndex: 3,
          }}
        >
          <div
            style={{
              fontSize: 11,
              textTransform: "uppercase",
              color: C.text3Dark,
              fontFamily: FONT_BODY,
              letterSpacing: "0.05em",
              marginBottom: 8,
            }}
          >
            SCROLL
          </div>
          <div
            style={{
              width: 1,
              height: 40,
              background: C.text3Dark,
              transformOrigin: "top",
              animation: "scrollLine 2s ease-in-out infinite",
            }}
          />
        </div>
      </section>

      {/* ═══ 3. MARQUEE ═══ */}
      <section
        style={{
          background: C.paper,
          padding: "80px 0",
          overflow: "hidden",
          whiteSpace: "nowrap",
        }}
      >
        <div
          style={{
            display: "inline-block",
            whiteSpace: "nowrap",
            animation: "marquee 20s linear infinite",
          }}
        >
          {Array.from({ length: 2 }).map((_, i) => (
            <span key={i} aria-hidden={i > 0}>
              {Array.from({ length: 4 }).map((_, j) => {
                const filled = j % 2 === 0;
                return (
                  <span
                    key={j}
                    style={{
                      fontFamily: FONT_DISPLAY,
                      fontSize: 140,
                      fontWeight: 600,
                      letterSpacing: "-0.02em",
                      WebkitTextStroke: filled
                        ? "unset"
                        : "2px #1e1d29",
                      color: filled ? C.ink : "transparent",
                      marginRight: 24,
                    }}
                  >
                    APERTURE
                    <span style={{ color: C.orange, margin: "0 16px" }}>
                      —
                    </span>
                  </span>
                );
              })}
            </span>
          ))}
        </div>
      </section>

      {/* ═══ 4. PRODUCT SYSTEM ═══ */}
      <section
        style={{
          background: C.paper,
          padding: "120px 32px",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          {/* Eyebrow row */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 40,
            }}
          >
            <Eyebrow label="PRODUCT SYSTEM" textColor={C.ink} />
            <span
              style={{
                fontSize: 12,
                textTransform: "uppercase",
                color: C.text2Light,
                fontFamily: FONT_BODY,
                fontWeight: 500,
                letterSpacing: "0.05em",
              }}
            >
              06 CORE FEATURES
            </span>
          </div>

          {/* Headline */}
          <Reveal delay={100}>
            <h2
              style={{
                fontFamily: FONT_DISPLAY,
                fontSize: 56,
                fontWeight: 600,
                color: C.ink,
                letterSpacing: "-0.025em",
                lineHeight: 1.05,
                margin: "0 0 64px 0",
              }}
            >
              Why Aperture feels
              <br />
              native to Arc.
            </h2>
          </Reveal>

          {/* 3×2 grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 24,
            }}
          >
            {features.map((f, i) => (
              <Reveal key={f.num} delay={100 + i * 80}>
                <div
                  style={{
                    background: C.cardLightBg,
                    border: `1px solid ${C.borderLight}`,
                    borderRadius: 16,
                    padding: 32,
                    display: "flex",
                    flexDirection: "column",
                    minHeight: 240,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 32,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 12,
                        textTransform: "uppercase",
                        color: C.orange,
                        fontFamily: FONT_BODY,
                        fontWeight: 500,
                        letterSpacing: "0.05em",
                      }}
                    >
                      {f.num}
                    </span>
                    <span
                      style={{
                        background: "#f3f4f6",
                        border: `1px solid ${C.borderLight}`,
                        borderRadius: 6,
                        padding: "4px 10px",
                        fontSize: 11,
                        textTransform: "uppercase",
                        fontWeight: 500,
                        color: C.text2Light,
                        fontFamily: FONT_BODY,
                      }}
                    >
                      {f.tag}
                    </span>
                  </div>
                  <h3
                    style={{
                      fontFamily: FONT_DISPLAY,
                      fontSize: 24,
                      fontWeight: 600,
                      color: C.ink,
                      margin: "0 0 12px 0",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {f.title}
                  </h3>
                  <p
                    style={{
                      fontSize: 15,
                      color: C.text2Light,
                      lineHeight: 1.625,
                      margin: 0,
                    }}
                  >
                    {f.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 5. APP SHOWCASE ═══ */}
      <section
        style={{
          background: C.ink,
          padding: "120px 32px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 64,
            alignItems: "center",
          }}
        >
          {/* Left */}
          <div>
            <Eyebrow label="LIVE DATA" textColor={C.cream} />
            <Reveal delay={100}>
              <h2
                style={{
                  fontFamily: FONT_DISPLAY,
                  fontSize: 56,
                  fontWeight: 600,
                  color: C.cream,
                  letterSpacing: "-0.025em",
                  lineHeight: 1.05,
                  margin: "24px 0 24px 0",
                }}
              >
                Verified on-chain,
                <br />
                in real time.
              </h2>
            </Reveal>
            <p
              style={{
                fontSize: 16,
                color: C.text2Dark,
                maxWidth: 480,
                lineHeight: 1.625,
                margin: 0,
              }}
            >
              Every data point is sourced directly from Arc Network's public
              ledger. No estimates, no approximations.
            </p>
          </div>

          {/* Right: scattered cards */}
          <div
            style={{
              position: "relative",
              minHeight: 440,
            }}
          >
            {/* Card 1: Live Pair (top) */}
            <div
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                width: 280,
                background: C.cardDarkBg,
                border: `1px solid ${C.borderDark}`,
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                borderRadius: 16,
                padding: 24,
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  textTransform: "uppercase",
                  color: C.text3Dark,
                  fontFamily: FONT_BODY,
                  fontWeight: 500,
                  letterSpacing: "0.05em",
                  marginBottom: 16,
                }}
              >
                LIVE PAIR
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 16,
                }}
              >
                <span
                  style={{
                    fontFamily: FONT_DISPLAY,
                    fontSize: 18,
                    fontWeight: 600,
                    color: C.cream,
                  }}
                >
                  {p0.token0.symbol}/{p0.token1.symbol}
                </span>
                <span
                  style={{
                    fontSize: 12,
                    color: C.green,
                    fontFamily: FONT_MONO,
                  }}
                >
                  +{(p0.priceChange24h ?? 0).toFixed(2)}%
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "8px 0",
                  borderBottom: `1px solid rgba(255,255,255,0.06)`,
                }}
              >
                <span
                  style={{
                    fontSize: 12,
                    color: C.text3Dark,
                    textTransform: "uppercase",
                    fontFamily: FONT_BODY,
                  }}
                >
                  PRICE
                </span>
                <span
                  style={{
                    fontSize: 13,
                    fontFamily: FONT_MONO,
                    color: C.cream,
                  }}
                >
                  ${((p0.liquidityUsd ?? 0) / (p0.volume24h ?? 1)).toFixed(4)}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "8px 0",
                }}
              >
                <span
                  style={{
                    fontSize: 12,
                    color: C.text3Dark,
                    textTransform: "uppercase",
                    fontFamily: FONT_BODY,
                  }}
                >
                  VOLUME
                </span>
                <span
                  style={{
                    fontSize: 13,
                    fontFamily: FONT_MONO,
                    color: C.cream,
                  }}
                >
                  {formatUsd(p0.volume24h)}
                </span>
              </div>
            </div>

            {/* Card 2: Swap History (bottom-left) */}
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                width: 260,
                background: C.cardDarkBg,
                border: `1px solid ${C.borderDark}`,
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                borderRadius: 16,
                padding: 24,
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  textTransform: "uppercase",
                  color: C.text3Dark,
                  fontFamily: FONT_BODY,
                  fontWeight: 500,
                  letterSpacing: "0.05em",
                  marginBottom: 16,
                }}
              >
                SWAP HISTORY
              </div>
              {mockSwaps.map((s, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "6px 0",
                    borderBottom:
                      i < mockSwaps.length - 1
                        ? "1px solid rgba(255,255,255,0.06)"
                        : "none",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span
                      style={{
                        fontSize: 10,
                        fontFamily: FONT_MONO,
                        color:
                          s.side === "BUY" ? C.green : C.orange,
                        fontWeight: 600,
                      }}
                    >
                      {s.side}
                    </span>
                    <span
                      style={{
                        fontSize: 12,
                        fontFamily: FONT_MONO,
                        color: C.cream,
                      }}
                    >
                      {s.amount} {s.token}
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: 11,
                      color: C.text3Dark,
                      fontFamily: FONT_MONO,
                    }}
                  >
                    {s.usd}
                  </span>
                </div>
              ))}
            </div>

            {/* Card 3: Liquidity curve (bottom-right) */}
            <div
              style={{
                position: "absolute",
                bottom: 60,
                right: 20,
                width: 240,
                background: C.cardDarkBg,
                border: `1px solid ${C.borderDark}`,
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                borderRadius: 16,
                padding: 24,
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  textTransform: "uppercase",
                  color: C.text3Dark,
                  fontFamily: FONT_BODY,
                  fontWeight: 500,
                  letterSpacing: "0.05em",
                  marginBottom: 16,
                }}
              >
                LIQUIDITY
              </div>
              <svg width="100%" height="80" viewBox="0 0 200 80" fill="none">
                <path
                  d="M0 70 C 30 65, 50 40, 80 30 S 140 20, 200 10"
                  stroke={C.orange}
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                />
                <path
                  d="M0 70 C 30 65, 50 40, 80 30 S 140 20, 200 10 L 200 80 L 0 80 Z"
                  fill="rgba(255,140,0,0.08)"
                />
                <circle cx="80" cy="30" r="3" fill={C.orange} />
              </svg>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: 12,
                }}
              >
                <span
                  style={{
                    fontSize: 11,
                    color: C.text3Dark,
                    textTransform: "uppercase",
                    fontFamily: FONT_BODY,
                  }}
                >
                  TVL
                </span>
                <span
                  style={{
                    fontSize: 12,
                    fontFamily: FONT_MONO,
                    color: C.cream,
                  }}
                >
                  {formatUsd(p0.liquidityUsd)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 6. STATS ═══ */}
      <section
        style={{
          background: C.paper,
          padding: "80px 32px",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
            }}
          >
            {stats.map((s, i) => (
              <div
                key={s.label}
                style={{
                  padding: "0 32px",
                  borderLeft:
                    i > 0 ? `1px solid ${C.borderLight}` : "none",
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                }}
              >
                {/* Icon */}
                <span
                  style={{
                    display: "inline-block",
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: C.orange,
                  }}
                />
                <span
                  style={{
                    fontSize: 12,
                    textTransform: "uppercase",
                    color: C.text2Light,
                    fontFamily: FONT_BODY,
                    fontWeight: 500,
                    letterSpacing: "0.05em",
                  }}
                >
                  {s.label}
                </span>
                <span
                  style={{
                    fontSize: 24,
                    fontFamily: FONT_MONO,
                    color: C.ink,
                    fontWeight: 600,
                  }}
                >
                  {s.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 7. HOW IT WORKS ═══ */}
      <section
        style={{
          background: C.ink,
          padding: "120px 32px",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <Eyebrow label="GUIDE" textColor={C.cream} />
          <Reveal delay={100}>
            <h2
              style={{
                fontFamily: FONT_DISPLAY,
                fontSize: 56,
                fontWeight: 600,
                color: C.cream,
                letterSpacing: "-0.025em",
                lineHeight: 1.05,
                margin: "24px 0 64px 0",
              }}
            >
              Three steps to
              <br />
              start scanning.
            </h2>
          </Reveal>

          <div
            style={{
              display: "flex",
              gap: 32,
              flexWrap: "wrap",
            }}
          >
            {steps.map((s, i) => (
              <Reveal key={s.num} delay={100 + i * 100}>
                <div
                  style={{
                    flex: "1 1 0",
                    minWidth: 280,
                    background: C.cardDarkBg,
                    border: `1px solid ${C.borderDark}`,
                    borderRadius: 16,
                    padding: 32,
                  }}
                >
                  <span
                    style={{
                      fontSize: 14,
                      color: C.orange,
                      fontFamily: FONT_BODY,
                      fontWeight: 500,
                      letterSpacing: "0.05em",
                      display: "block",
                      marginBottom: 16,
                    }}
                  >
                    {s.num}
                  </span>
                  <h3
                    style={{
                      fontFamily: FONT_DISPLAY,
                      fontSize: 22,
                      fontWeight: 600,
                      color: C.cream,
                      margin: "0 0 12px 0",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {s.title}
                  </h3>
                  <p
                    style={{
                      fontSize: 15,
                      color: C.text2Dark,
                      lineHeight: 1.625,
                      margin: 0,
                    }}
                  >
                    {s.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 8. CTA + FOOTER ═══ */}
      <section
        style={{
          background: C.ink,
          padding: "120px 32px 80px 32px",
        }}
      >
        {/* CTA card */}
        <div
          style={{
            maxWidth: 720,
            margin: "0 auto",
            background: "rgba(255,255,255,0.03)",
            border: `1px solid ${C.borderDark}`,
            borderRadius: 24,
            padding: 48,
            textAlign: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: 24,
            }}
          >
            <Eyebrow label="GET STARTED" textColor={C.cream} />
          </div>
          <h2
            style={{
              fontFamily: FONT_DISPLAY,
              fontSize: 48,
              fontWeight: 600,
              color: C.cream,
              letterSpacing: "-0.025em",
              lineHeight: 1.1,
              margin: "0 0 24px 0",
            }}
          >
            Start scanning
            <br />
            Arc Network.
          </h2>
          <p
            style={{
              fontSize: 17,
              color: C.text2Dark,
              maxWidth: 420,
              margin: "0 auto 32px auto",
              lineHeight: 1.625,
            }}
          >
            Index every pair, track every swap, and build with verified on-chain
            data.
          </p>
          <div
            style={{
              display: "flex",
              gap: 12,
              justifyContent: "center",
            }}
          >
            <a
              href="#explore"
              style={{
                background: C.cream,
                color: C.ink,
                borderRadius: 8,
                padding: "12px 24px",
                fontSize: 15,
                fontWeight: 500,
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                fontFamily: FONT_BODY,
              }}
            >
              Explore pairs →
            </a>
            <a
              href="#docs"
              style={{
                background: "transparent",
                border: `1px solid rgba(255,255,255,0.15)`,
                color: C.cream,
                borderRadius: 8,
                padding: "12px 24px",
                fontSize: 15,
                fontWeight: 500,
                display: "inline-flex",
                alignItems: "center",
                fontFamily: FONT_BODY,
              }}
            >
              Read docs
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          background: C.ink,
          borderTop: "1px solid rgba(255,255,255,0.05)",
          padding: "64px 32px 32px 32px",
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr",
            gap: 64,
            marginBottom: 48,
          }}
        >
          {/* Left */}
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 16,
              }}
            >
              <ApertureLogo size={28} />
              <span
                style={{
                  fontFamily: FONT_DISPLAY,
                  fontSize: 16,
                  fontWeight: 600,
                  color: C.cream,
                }}
              >
                APERTURE
              </span>
            </div>
            <p
              style={{
                fontSize: 14,
                color: C.text3Dark,
                margin: 0,
                lineHeight: 1.625,
              }}
            >
              DEX scanner on Arc Network
            </p>
          </div>

          {/* Center */}
          <div>
            <div
              style={{
                fontSize: 12,
                textTransform: "uppercase",
                color: C.text3Dark,
                fontFamily: FONT_BODY,
                fontWeight: 500,
                letterSpacing: "0.05em",
                marginBottom: 16,
              }}
            >
              PRODUCT
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              {["Explore", "Pairs", "Swap", "Portfolio"].map((l) => (
                <a
                  key={l}
                  href="#"
                  style={{
                    fontSize: 14,
                    color: C.text2Dark,
                    fontFamily: FONT_BODY,
                  }}
                >
                  {l}
                </a>
              ))}
            </div>
          </div>

          {/* Right */}
          <div>
            <div
              style={{
                fontSize: 12,
                textTransform: "uppercase",
                color: C.text3Dark,
                fontFamily: FONT_BODY,
                fontWeight: 500,
                letterSpacing: "0.05em",
                marginBottom: 16,
              }}
            >
              RESOURCES
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              {["Docs", "API", "GitHub", "Status"].map((l) => (
                <a
                  key={l}
                  href="#"
                  style={{
                    fontSize: 14,
                    color: C.text2Dark,
                    fontFamily: FONT_BODY,
                  }}
                >
                  {l}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            borderTop: "1px solid rgba(255,255,255,0.05)",
            paddingTop: 24,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span
            style={{
              fontSize: 11,
              textTransform: "uppercase",
              color: C.text3Dark,
              fontFamily: FONT_BODY,
              letterSpacing: "0.05em",
            }}
          >
            © 2026 APERTURE
          </span>
          <span
            style={{
              fontSize: 11,
              color: C.text3Dark,
              fontFamily: FONT_BODY,
            }}
          >
            Built on Arc™ — Arc is a trademark of Circle Internet Group, Inc.
          </span>
        </div>
      </footer>
    </div>
  );
}

/* ── Sub-components ───────────────────────────────────────────────── */

function DataRow({
  label,
  value,
  isLast = false,
}: {
  label: string;
  value: string;
  isLast?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "12px 0",
        borderBottom: isLast ? "none" : "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <span
        style={{
          fontSize: 12,
          textTransform: "uppercase",
          color: "rgba(247,247,247,0.5)",
          fontFamily: "'Inter', system-ui, sans-serif",
          fontWeight: 500,
          letterSpacing: "0.05em",
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontSize: 16,
          fontFamily: "'JetBrains Mono', ui-monospace, monospace",
          color: "#f7f7f7",
          fontWeight: 500,
        }}
      >
        {value}
      </span>
    </div>
  );
}
