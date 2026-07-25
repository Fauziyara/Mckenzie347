"use client";

import { Reveal } from "@/components/reveal";
import { mockPairs } from "@/lib/mock-data";
import { formatUsd } from "@/lib/format";

const COLORS = {
  cream: "#F4F1EA",
  darkBg: "#0A0A0A",
  darkCard: "#1A1A1A",
  textPrimary: "#1A1A1A",
  textSecondary: "#8A8A85",
  amber: "#D4A04A",
  borderLight: "#D8D4CA",
  borderDark: "#2A2A2A",
  textOnDark: "#F4F1EA",
  textOnDarkMuted: "#888880",
  green: "#4ADE80",
};

const FONT = "'Inter', sans-serif";

const featureCards = [
  {
    eyebrow: "PAIR DATA",
    title: "Real-time pairs",
    description: "Every liquidity pool on Arc, indexed the instant it's created.",
  },
  {
    eyebrow: "SWAP HISTORY",
    title: "On-chain swaps",
    description: "Complete swap logs with price impact, gas, and sender analysis.",
  },
  {
    eyebrow: "LIQUIDITY",
    title: "Depth tracking",
    description: "Live liquidity curves and TVL across all verified pairs.",
  },
  {
    eyebrow: "PRICE FEEDS",
    title: "Deterministic prices",
    description: "Math-verified price data — no oracles, no estimates.",
  },
  {
    eyebrow: "ANALYTICS",
    title: "Volume & trends",
    description: "24h volume, tx count, and price change for every pair.",
  },
  {
    eyebrow: "API ACCESS",
    title: "REST & WebSocket",
    description: "Full programmatic access via SDK. npm install @aperture/sdk",
  },
];

const whereItFits = [
  {
    num: "01",
    statement: "Real-time pair discovery for active traders.",
    tags: "— DEX TRADERS, LPs, ANALYSTS",
  },
  {
    num: "02",
    statement: "Liquidity monitoring for position management.",
    tags: "— MARKET MAKERS, LIQUIDITY PROVIDERS",
  },
  {
    num: "03",
    statement: "On-chain data for dashboards and integrations.",
    tags: "— DEVELOPERS, DAPPS, AGGREGATORS",
  },
];

export default function LandingPage() {
  const pair = mockPairs[0];

  return (
    <div
      style={{
        background: COLORS.cream,
        color: COLORS.textPrimary,
        fontFamily: FONT,
        margin: 0,
        padding: 0,
        minHeight: "100vh",
      }}
    >
      {/* ═══ 1. STICKY HEADER ═══ */}
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: 60,
          background: COLORS.cream,
          borderBottom: `1px solid ${COLORS.borderLight}`,
          zIndex: 100,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 6%",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {/* aperture-like SVG icon */}
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            style={{ display: "block" }}
          >
            <rect
              x="1"
              y="1"
              width="22"
              height="22"
              stroke={COLORS.textPrimary}
              strokeWidth="2"
            />
            <circle
              cx="12"
              cy="12"
              r="6"
              stroke={COLORS.amber}
              strokeWidth="2"
            />
            <circle cx="12" cy="12" r="2" fill={COLORS.textPrimary} />
          </svg>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span
              style={{
                fontWeight: 700,
                fontSize: 15,
                letterSpacing: "0.02em",
                color: COLORS.textPrimary,
                lineHeight: 1.1,
              }}
            >
              APERTURE
            </span>
            <span
              style={{
                fontSize: 9,
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                color: COLORS.textSecondary,
                fontWeight: 700,
                lineHeight: 1.2,
              }}
            >
              DEX Scanner on Arc
            </span>
          </div>
        </div>

        <nav style={{ display: "flex", alignItems: "center", gap: 28 }}>
          <a
            href="#"
            style={{
              fontSize: 14,
              color: COLORS.textPrimary,
              textDecoration: "none",
              fontWeight: 400,
              fontFamily: FONT,
            }}
          >
            Explore
          </a>
          <a
            href="#"
            style={{
              fontSize: 14,
              color: COLORS.textPrimary,
              textDecoration: "none",
              fontWeight: 400,
              fontFamily: FONT,
            }}
          >
            Security
          </a>
          <a
            href="#"
            style={{
              fontSize: 14,
              color: COLORS.textPrimary,
              textDecoration: "none",
              fontWeight: 400,
              fontFamily: FONT,
            }}
          >
            Docs
          </a>
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              color: COLORS.textSecondary,
              fontWeight: 700,
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                background: COLORS.amber,
                borderRadius: 0,
                display: "inline-block",
              }}
            />
            ARC Testnet
          </span>
          <a
            href="#"
            style={{
              background: COLORS.darkBg,
              color: COLORS.cream,
              padding: "10px 16px",
              fontSize: 11,
              textTransform: "uppercase",
              fontWeight: 700,
              letterSpacing: "0.08em",
              borderRadius: 0,
              textDecoration: "none",
              fontFamily: FONT,
              border: "none",
              cursor: "pointer",
              display: "inline-block",
            }}
          >
            Go to app
          </a>
        </nav>
      </header>

      {/* spacer for fixed header */}
      <div style={{ height: 60 }} />

      {/* ═══ 2. HERO ═══ */}
      <section
        style={{
          background: COLORS.cream,
          padding: "80px 6% 120px",
          minHeight: "80vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <div style={{ maxWidth: "60%" }}>
          <Reveal delay={0}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 32,
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  background: COLORS.amber,
                  borderRadius: 0,
                  display: "inline-block",
                }}
              />
              <span
                style={{
                  fontSize: 11,
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                  color: COLORS.textSecondary,
                  fontWeight: 700,
                  fontFamily: FONT,
                }}
              >
                DEX Intelligence • Arc Network
              </span>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <h1
              style={{
                fontSize: 200,
                fontWeight: 700,
                color: COLORS.textPrimary,
                letterSpacing: "-0.04em",
                lineHeight: 0.9,
                margin: 0,
                padding: 0,
                fontFamily: FONT,
              }}
            >
              APERTURE
            </h1>
          </Reveal>

          <Reveal delay={200}>
            <p
              style={{
                fontSize: 20,
                fontWeight: 400,
                color: COLORS.textSecondary,
                maxWidth: 480,
                lineHeight: 1.5,
                margin: "32px 0",
                fontFamily: FONT,
              }}
            >
              A transparent DEX scanner for Arc Network. Real-time pair data,
              on-chain swaps, and liquidity analytics — no estimates, just
              verified data.
            </p>
          </Reveal>

          <Reveal delay={300}>
            <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
              <a
                href="#"
                style={{
                  background: COLORS.darkBg,
                  color: COLORS.cream,
                  padding: "12px 20px",
                  fontSize: 12,
                  textTransform: "uppercase",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  borderRadius: 0,
                  textDecoration: "none",
                  fontFamily: FONT,
                  border: "none",
                  cursor: "pointer",
                  display: "inline-block",
                }}
              >
                Go to app
              </a>
              <a
                href="#"
                style={{
                  background: "transparent",
                  color: COLORS.textPrimary,
                  padding: "12px 20px",
                  fontSize: 12,
                  textTransform: "uppercase",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  borderRadius: 0,
                  textDecoration: "none",
                  fontFamily: FONT,
                  border: `1px solid ${COLORS.textPrimary}`,
                  cursor: "pointer",
                  display: "inline-block",
                }}
              >
                Read docs
              </a>
            </div>
          </Reveal>
        </div>

        <div
          style={{
            borderTop: `1px solid ${COLORS.borderLight}`,
            marginTop: 80,
            width: "100%",
          }}
        />
      </section>

      {/* ═══ 3. "THE SCANNER" SECTION ═══ */}
      <section
        style={{
          background: COLORS.cream,
          padding: "120px 6%",
          maxWidth: 1200,
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "40% 60%",
            gap: 40,
            alignItems: "start",
          }}
        >
          {/* LEFT */}
          <div>
            <Reveal delay={0}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 24,
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    background: COLORS.amber,
                    borderRadius: 0,
                    display: "inline-block",
                  }}
                />
                <span
                  style={{
                    fontSize: 11,
                    textTransform: "uppercase",
                    letterSpacing: "0.12em",
                    color: COLORS.textSecondary,
                    fontWeight: 700,
                    fontFamily: FONT,
                  }}
                >
                  The Scanner
                </span>
              </div>
            </Reveal>

            <Reveal delay={100}>
              <h2
                style={{
                  fontSize: 64,
                  fontWeight: 700,
                  color: COLORS.textPrimary,
                  letterSpacing: "-0.03em",
                  lineHeight: 1.05,
                  margin: 0,
                  padding: 0,
                  fontFamily: FONT,
                }}
              >
                Index everything,
                <br />
                trust nothing.
              </h2>
            </Reveal>

            <Reveal delay={200}>
              <p
                style={{
                  fontSize: 16,
                  fontWeight: 400,
                  color: COLORS.textSecondary,
                  lineHeight: 1.6,
                  maxWidth: 360,
                  margin: "32px 0 0",
                  fontFamily: FONT,
                }}
              >
                Aperture indexes every liquidity pool, swap, and price movement
                on Arc Network. Mathematically verified, deterministically final.
              </p>
            </Reveal>
          </div>

          {/* RIGHT - 2x3 grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 16,
            }}
          >
            {featureCards.map((card, i) => (
              <Reveal key={card.eyebrow} delay={i * 80}>
                <div
                  style={{
                    background: COLORS.cream,
                    border: `1px solid ${COLORS.borderLight}`,
                    borderRadius: 0,
                    padding: 32,
                    position: "relative",
                    minHeight: 220,
                  }}
                >
                  <span
                    style={{
                      position: "absolute",
                      top: 24,
                      right: 24,
                      width: 8,
                      height: 8,
                      background: COLORS.amber,
                      borderRadius: 0,
                      display: "inline-block",
                    }}
                  />
                  <span
                    style={{
                      fontSize: 11,
                      textTransform: "uppercase",
                      letterSpacing: "0.12em",
                      color: COLORS.textSecondary,
                      fontWeight: 700,
                      fontFamily: FONT,
                      display: "block",
                      marginBottom: 16,
                    }}
                  >
                    {card.eyebrow}
                  </span>
                  <h3
                    style={{
                      fontSize: 28,
                      fontWeight: 700,
                      color: COLORS.textPrimary,
                      letterSpacing: "-0.02em",
                      lineHeight: 1.1,
                      margin: 0,
                      marginBottom: 12,
                      fontFamily: FONT,
                    }}
                  >
                    {card.title}
                  </h3>
                  <p
                    style={{
                      fontSize: 15,
                      fontWeight: 400,
                      color: COLORS.textSecondary,
                      lineHeight: 1.6,
                      margin: 0,
                      fontFamily: FONT,
                    }}
                  >
                    {card.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 4. "WHERE IT FITS" SECTION ═══ */}
      <section
        style={{
          background: COLORS.cream,
          padding: "120px 6%",
          maxWidth: 1200,
          margin: "0 auto",
        }}
      >
        <Reveal delay={0}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 24,
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                background: COLORS.amber,
                borderRadius: 0,
                display: "inline-block",
              }}
            />
            <span
              style={{
                fontSize: 11,
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                color: COLORS.textSecondary,
                fontWeight: 700,
                fontFamily: FONT,
              }}
            >
              Where It Fits
            </span>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <h2
            style={{
              fontSize: 64,
              fontWeight: 700,
              color: COLORS.textPrimary,
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
              margin: 0,
              marginBottom: 64,
              fontFamily: FONT,
            }}
          >
            Not every trader needs Aperture.
          </h2>
        </Reveal>

        <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
          {whereItFits.map((item, i) => (
            <Reveal key={item.num} delay={i * 100}>
              <div
                style={{
                  borderTop: `1px solid ${COLORS.borderLight}`,
                  paddingTop: 24,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 24,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: 24,
                    flex: 1,
                  }}
                >
                  <span
                    style={{
                      fontSize: 12,
                      textTransform: "uppercase",
                      letterSpacing: "0.12em",
                      color: COLORS.amber,
                      fontWeight: 700,
                      fontFamily: FONT,
                      flexShrink: 0,
                    }}
                  >
                    {item.num}
                  </span>
                  <span
                    style={{
                      fontSize: 22,
                      fontWeight: 700,
                      color: COLORS.textPrimary,
                      letterSpacing: "-0.02em",
                      lineHeight: 1.3,
                      fontFamily: FONT,
                    }}
                  >
                    {item.statement}
                  </span>
                </div>
                <span
                  style={{
                    fontSize: 12,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    color: COLORS.textSecondary,
                    fontWeight: 700,
                    fontFamily: FONT,
                    flexShrink: 0,
                    textAlign: "right",
                  }}
                >
                  {item.tags}
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ═══ 5. "LIVE DATA" SECTION (DARK) ═══ */}
      <section
        style={{
          background: COLORS.darkBg,
          padding: "120px 6%",
          maxWidth: 1200,
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 60,
            alignItems: "start",
          }}
        >
          {/* LEFT */}
          <div>
            <Reveal delay={0}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 24,
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    background: COLORS.amber,
                    borderRadius: 0,
                    display: "inline-block",
                  }}
                />
                <span
                  style={{
                    fontSize: 11,
                    textTransform: "uppercase",
                    letterSpacing: "0.12em",
                    color: COLORS.textOnDark,
                    fontWeight: 700,
                    fontFamily: FONT,
                  }}
                >
                  Live Data
                </span>
              </div>
            </Reveal>

            <Reveal delay={100}>
              <h2
                style={{
                  fontSize: 64,
                  fontWeight: 700,
                  color: COLORS.textOnDark,
                  letterSpacing: "-0.03em",
                  lineHeight: 1.05,
                  margin: 0,
                  padding: 0,
                  fontFamily: FONT,
                }}
              >
                Verified on-chain,
                <br />
                in real time.
              </h2>
            </Reveal>

            <Reveal delay={200}>
              <p
                style={{
                  fontSize: 16,
                  fontWeight: 400,
                  color: COLORS.textOnDarkMuted,
                  lineHeight: 1.6,
                  maxWidth: 360,
                  margin: "32px 0 0",
                  fontFamily: FONT,
                }}
              >
                Every data point is sourced directly from Arc Network's public
                ledger. No estimates, no approximations.
              </p>
            </Reveal>
          </div>

          {/* RIGHT - dark card */}
          <Reveal delay={150}>
            <div
              style={{
                background: COLORS.darkCard,
                border: `1px solid ${COLORS.borderDark}`,
                borderRadius: 0,
                padding: 32,
              }}
            >
              {/* top status row */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingBottom: 20,
                  borderBottom: `1px solid ${COLORS.borderDark}`,
                }}
              >
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    fontSize: 12,
                    textTransform: "uppercase",
                    letterSpacing: "0.12em",
                    color: COLORS.textOnDark,
                    fontWeight: 700,
                    fontFamily: FONT,
                  }}
                >
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      background: COLORS.amber,
                      borderRadius: 0,
                      display: "inline-block",
                    }}
                  />
                  Arc Testnet
                </span>
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    fontSize: 12,
                    textTransform: "uppercase",
                    letterSpacing: "0.12em",
                    color: COLORS.textOnDark,
                    fontWeight: 700,
                    fontFamily: FONT,
                  }}
                >
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      background: COLORS.green,
                      borderRadius: 0,
                      display: "inline-block",
                    }}
                  />
                  Live
                </span>
              </div>

              {/* data rows */}
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "16px 0",
                    borderBottom: `1px solid ${COLORS.borderDark}`,
                  }}
                >
                  <span
                    style={{
                      fontSize: 12,
                      textTransform: "uppercase",
                      letterSpacing: "0.12em",
                      color: COLORS.textOnDarkMuted,
                      fontWeight: 700,
                      fontFamily: FONT,
                    }}
                  >
                    Block Height
                  </span>
                  <span
                    style={{
                      fontSize: 16,
                      color: COLORS.textOnDark,
                      fontFamily: "'JetBrains Mono', monospace",
                      fontWeight: 400,
                    }}
                  >
                    845,231
                  </span>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "16px 0",
                    borderBottom: `1px solid ${COLORS.borderDark}`,
                  }}
                >
                  <span
                    style={{
                      fontSize: 12,
                      textTransform: "uppercase",
                      letterSpacing: "0.12em",
                      color: COLORS.textOnDarkMuted,
                      fontWeight: 700,
                      fontFamily: FONT,
                    }}
                  >
                    24h Volume
                  </span>
                  <span
                    style={{
                      fontSize: 16,
                      color: COLORS.textOnDark,
                      fontFamily: "'JetBrains Mono', monospace",
                      fontWeight: 400,
                    }}
                  >
                    {formatUsd(pair.volume24h)}
                  </span>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "16px 0",
                  }}
                >
                  <span
                    style={{
                      fontSize: 12,
                      textTransform: "uppercase",
                      letterSpacing: "0.12em",
                      color: COLORS.textOnDarkMuted,
                      fontWeight: 700,
                      fontFamily: FONT,
                    }}
                  >
                    Active Pairs
                  </span>
                  <span
                    style={{
                      fontSize: 16,
                      color: COLORS.textOnDark,
                      fontFamily: "'JetBrains Mono', monospace",
                      fontWeight: 400,
                    }}
                  >
                    12
                  </span>
                </div>
              </div>

              {/* bottom code line */}
              <div
                style={{
                  marginTop: 24,
                  paddingTop: 20,
                  borderTop: `1px solid ${COLORS.borderDark}`,
                }}
              >
                <code
                  style={{
                    fontSize: 14,
                    color: COLORS.amber,
                    fontFamily: "'JetBrains Mono', monospace",
                    fontWeight: 400,
                  }}
                >
                  npm install @aperture/sdk
                </code>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ 6. CTA SECTION ═══ */}
      <section
        style={{
          background: COLORS.cream,
          padding: "160px 6%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div style={{ maxWidth: 800, width: "100%" }}>
          <Reveal delay={0}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 24,
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  background: COLORS.amber,
                  borderRadius: 0,
                  display: "inline-block",
                }}
              />
              <span
                style={{
                  fontSize: 11,
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                  color: COLORS.textSecondary,
                  fontWeight: 700,
                  fontFamily: FONT,
                }}
              >
                Get Started
              </span>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <h2
              style={{
                fontSize: 80,
                fontWeight: 700,
                color: COLORS.textPrimary,
                letterSpacing: "-0.03em",
                lineHeight: 1.0,
                margin: 0,
                padding: 0,
                fontFamily: FONT,
              }}
            >
              Start scanning
              <br />
              Arc Network.
            </h2>
          </Reveal>

          <Reveal delay={200}>
            <p
              style={{
                fontSize: 18,
                fontWeight: 400,
                color: COLORS.textSecondary,
                maxWidth: 480,
                lineHeight: 1.6,
                margin: "32px 0 40px",
                fontFamily: FONT,
              }}
            >
              Index every pair, track every swap, and build with verified
              on-chain data.
            </p>
          </Reveal>

          <Reveal delay={300}>
            <div style={{ display: "flex", gap: 12 }}>
              <a
                href="#"
                style={{
                  background: COLORS.darkBg,
                  color: COLORS.cream,
                  padding: "12px 20px",
                  fontSize: 12,
                  textTransform: "uppercase",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  borderRadius: 0,
                  textDecoration: "none",
                  fontFamily: FONT,
                  border: "none",
                  cursor: "pointer",
                  display: "inline-block",
                }}
              >
                Go to app
              </a>
              <a
                href="#"
                style={{
                  background: "transparent",
                  color: COLORS.textPrimary,
                  padding: "12px 20px",
                  fontSize: 12,
                  textTransform: "uppercase",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  borderRadius: 0,
                  textDecoration: "none",
                  fontFamily: FONT,
                  border: `1px solid ${COLORS.textPrimary}`,
                  cursor: "pointer",
                  display: "inline-block",
                }}
              >
                Read docs
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ 7. FOOTER ═══ */}
      <footer
        style={{
          background: COLORS.cream,
          borderTop: `1px solid ${COLORS.borderLight}`,
          padding: "64px 6% 32px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 40,
            maxWidth: 1200,
            margin: "0 auto",
          }}
        >
          {/* LEFT */}
          <div>
            <div
              style={{
                fontSize: 20,
                fontWeight: 700,
                color: COLORS.textPrimary,
                letterSpacing: "0.02em",
                fontFamily: FONT,
                marginBottom: 8,
              }}
            >
              APERTURE
            </div>
            <div
              style={{
                fontSize: 12,
                color: COLORS.textSecondary,
                fontWeight: 400,
                fontFamily: FONT,
                marginBottom: 20,
              }}
            >
              DEX scanner on Arc Network
            </div>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                border: `1px solid ${COLORS.borderLight}`,
                padding: "8px 12px",
                borderRadius: 0,
                fontSize: 11,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: COLORS.textSecondary,
                fontWeight: 700,
                fontFamily: FONT,
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  background: COLORS.amber,
                  borderRadius: 0,
                  display: "inline-block",
                }}
              />
              Arc Testnet — Testing Environment
            </span>
          </div>

          {/* CENTER */}
          <div>
            <div
              style={{
                fontSize: 12,
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                color: COLORS.textSecondary,
                fontWeight: 700,
                fontFamily: FONT,
                marginBottom: 20,
              }}
            >
              Product
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              {["Explore", "Pairs", "Swap", "Portfolio"].map((link) => (
                <a
                  key={link}
                  href="#"
                  style={{
                    fontSize: 14,
                    color: COLORS.textPrimary,
                    textDecoration: "none",
                    fontWeight: 400,
                    fontFamily: FONT,
                  }}
                >
                  {link}
                </a>
              ))}
            </div>
          </div>

          {/* RIGHT */}
          <div>
            <div
              style={{
                fontSize: 12,
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                color: COLORS.textSecondary,
                fontWeight: 700,
                fontFamily: FONT,
                marginBottom: 20,
              }}
            >
              Resources
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              {["Docs", "API", "GitHub", "Status"].map((link) => (
                <a
                  key={link}
                  href="#"
                  style={{
                    fontSize: 14,
                    color: COLORS.textPrimary,
                    textDecoration: "none",
                    fontWeight: 400,
                    fontFamily: FONT,
                  }}
                >
                  {link}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* bottom bar */}
        <div
          style={{
            borderTop: `1px solid ${COLORS.borderLight}`,
            paddingTop: 24,
            marginTop: 64,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            maxWidth: 1200,
            margin: "64px auto 0",
          }}
        >
          <span
            style={{
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: COLORS.textSecondary,
              fontWeight: 700,
              fontFamily: FONT,
            }}
          >
            © 2026 Aperture
          </span>
          <span
            style={{
              fontSize: 11,
              color: COLORS.textSecondary,
              fontWeight: 400,
              fontFamily: FONT,
            }}
          >
            Built on Arc™ — Arc is a trademark of Circle Internet Group, Inc.
          </span>
        </div>
      </footer>
    </div>
  );
}
