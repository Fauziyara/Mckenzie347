"use client";

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
          height: 100%;
          overflow: hidden;
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
      `}</style>

      <div
        style={{
          height: "100vh",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* ═══ SECTION 1: NAV (thin, ~60px) ═══ */}
        <nav
          style={{
            height: 60,
            flexShrink: 0,
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
            <a
              href="/explore"
              style={{
                fontSize: 14,
                fontWeight: 400,
                color: "#425466",
                textDecoration: "none",
              }}
            >
              Explore
            </a>
            <a
              href="/explore"
              style={{
                fontSize: 14,
                fontWeight: 400,
                color: "#425466",
                textDecoration: "none",
              }}
            >
              Pairs
            </a>
            <a
              href="/explore"
              style={{
                fontSize: 14,
                fontWeight: 400,
                color: "#425466",
                textDecoration: "none",
              }}
            >
              API
            </a>
            <a
              href="https://docs.aperture.xyz"
              style={{
                fontSize: 14,
                fontWeight: 400,
                color: "#425466",
                textDecoration: "none",
              }}
            >
              Docs
            </a>
          </div>

          {/* Right: Sign in + Go to app */}
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <a
              href="/explore"
              style={{
                fontSize: 14,
                color: "#425466",
                textDecoration: "none",
              }}
            >
              Sign in
            </a>
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

        {/* ═══ SECTION 2: HERO (2-column, fills viewport) ═══ */}
        <section
          style={{
            flex: 1,
            position: "relative",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#FFFFFF",
          }}
        >
          {/* Gradient mesh — right side */}
          <div
            className="gradient-orb"
            style={{
              width: 480,
              height: 480,
              background: "#FF6BCB",
              opacity: 0.35,
              top: "5%",
              right: "-5%",
              animationDelay: "0s",
            }}
          />
          <div
            className="gradient-orb"
            style={{
              width: 420,
              height: 420,
              background: "#FF8A4C",
              opacity: 0.3,
              top: "30%",
              right: "8%",
              animationDelay: "2s",
            }}
          />
          <div
            className="gradient-orb"
            style={{
              width: 460,
              height: 460,
              background: "#8B5CF6",
              opacity: 0.32,
              bottom: "0%",
              right: "-2%",
              animationDelay: "4s",
            }}
          />

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
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 20,
                maxWidth: 560,
              }}
            >
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
                <span
                  style={{
                    fontStyle: "italic",
                    fontFamily: "Georgia, 'Times New Roman', serif",
                  }}
                >
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
              <div
                style={{
                  display: "flex",
                  gap: 24,
                  marginTop: 8,
                }}
              >
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span
                    style={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: "#0A2540",
                    }}
                  >
                    &lt;1s
                  </span>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 400,
                      color: "#6B7C93",
                    }}
                  >
                    FINALITY
                  </span>
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span
                    style={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: "#0A2540",
                    }}
                  >
                    ~$0.001
                  </span>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 400,
                      color: "#6B7C93",
                    }}
                  >
                    GAS COST
                  </span>
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span
                    style={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: "#0A2540",
                    }}
                  >
                    100%
                  </span>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 400,
                      color: "#6B7C93",
                    }}
                  >
                    ON-CHAIN
                  </span>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN (45%) */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                className="floating-card"
                style={{
                  background: "#FFFFFF",
                  borderRadius: 12,
                  boxShadow:
                    "0 1px 2px rgba(0,0,0,0.04), 0 24px 48px rgba(0,0,0,0.08)",
                  padding: 24,
                  maxWidth: 380,
                  width: "100%",
                }}
              >
                {/* Header row */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <span
                    style={{
                      fontSize: 12,
                      color: "#0A2540",
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <span className="live-dot" />
                    LIVE
                  </span>
                  <span
                    style={{
                      fontSize: 12,
                      textTransform: "uppercase",
                      color: "#6B7C93",
                      fontWeight: 600,
                    }}
                  >
                    Aperture Terminal
                  </span>
                </div>

                {/* Divider */}
                <div
                  style={{
                    height: 1,
                    background: "#F1F5F9",
                    margin: "12px 0",
                  }}
                />

                {/* Pair label */}
                <span
                  style={{
                    fontSize: 11,
                    textTransform: "uppercase",
                    color: "#6B7C93",
                    fontWeight: 600,
                  }}
                >
                  Top Pair
                </span>

                {/* Pair name */}
                <div
                  style={{
                    fontSize: 24,
                    fontWeight: 700,
                    color: "#0A2540",
                    margin: "4px 0 12px",
                  }}
                >
                  {pair.token0.symbol} / {pair.token1.symbol}
                </div>

                {/* Data rows */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "10px 0",
                    borderBottom: "1px solid #F1F5F9",
                  }}
                >
                  <span style={{ fontSize: 13, color: "#6B7C93" }}>
                    24h Volume
                  </span>
                  <span
                    style={{
                      fontSize: 14,
                      fontFamily:
                        "'SF Mono', 'Monaco', 'Menlo', 'Consolas', monospace",
                      color: "#0A2540",
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
                    padding: "10px 0",
                    borderBottom: "1px solid #F1F5F9",
                  }}
                >
                  <span style={{ fontSize: 13, color: "#6B7C93" }}>
                    Liquidity
                  </span>
                  <span
                    style={{
                      fontSize: 14,
                      fontFamily:
                        "'SF Mono', 'Monaco', 'Menlo', 'Consolas', monospace",
                      color: "#0A2540",
                    }}
                  >
                    {formatUsd(pair.liquidityUsd)}
                  </span>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "10px 0",
                    borderBottom: "1px solid #F1F5F9",
                  }}
                >
                  <span style={{ fontSize: 13, color: "#6B7C93" }}>
                    24h Txns
                  </span>
                  <span
                    style={{
                      fontSize: 14,
                      fontFamily:
                        "'SF Mono', 'Monaco', 'Menlo', 'Consolas', monospace",
                      color: "#0A2540",
                    }}
                  >
                    {pair.txCount24h}
                  </span>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "10px 0",
                    borderBottom: "1px solid #F1F5F9",
                  }}
                >
                  <span style={{ fontSize: 13, color: "#6B7C93" }}>
                    Price Change
                  </span>
                  <span
                    style={{
                      fontSize: 14,
                      fontFamily:
                        "'SF Mono', 'Monaco', 'Menlo', 'Consolas', monospace",
                      color: isPositive ? "#00D66F" : "#FF4D4F",
                    }}
                  >
                    {isPositive ? "+" : ""}
                    {priceChange.toFixed(2)}%
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
              <p
                style={{
                  fontSize: 12,
                  fontStyle: "italic",
                  color: "#6B7C93",
                  textAlign: "center",
                  marginTop: 12,
                }}
              >
                Live preview of the top pair on Arc Network.
              </p>
            </div>
          </div>
        </section>

        {/* ═══ SECTION 3: TICKER (thin, bottom, ~40px) ═══ */}
        <div
          style={{
            height: 40,
            flexShrink: 0,
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
      </div>
    </>
  );
}
