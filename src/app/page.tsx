"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ParticleField } from "@/components/particle-field";
import { mockPairs } from "@/lib/mock-data";
import { formatUsd } from "@/lib/format";
import { Reveal } from "@/components/reveal";

/* ──────────────────────────────────────────────────────────────────────────
   MintWeb3 Framer template clone — adapted for "Aperture" DEX Scanner.
   Colors are inlined to guarantee an exact palette match.
   ────────────────────────────────────────────────────────────────────────── */

const COLORS = {
  baseBg: "#0f0807",
  secondaryBg: "#363030",
  accent: "#ec5c33",
  textPrimary: "#ffffff",
  textSecondary: "#fffcf7",
  textMuted: "#5d5958",
  cream: "#f8ebe5",
  creamInk: "#0f0807",
};

const HEADING_FONT = "'Space Grotesk', 'Open Runde', Inter, sans-serif";
const BODY_FONT = "Inter, sans-serif";

/* ── small decorative helpers ─────────────────────────────────────────── */

const CRYPTO_LOGOS = ["ETH", "USDC", "SOL", "WBTC", "ARB"] as const;

function PixelColumn() {
  // cascading pixelated squares — 8px each
  const squares = Array.from({ length: 18 });
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 14,
      }}
      aria-hidden
    >
      {squares.map((_, i) => {
        const stagger = Math.abs(i - 8);
        return (
          <div
            key={i}
            style={{
              width: 8,
              height: 8,
              background:
                i % 3 === 0
                  ? COLORS.accent
                  : i % 3 === 1
                  ? COLORS.creamInk
                  : "rgba(15,8,7,0.35)",
              opacity: Math.max(0.15, 1 - stagger * 0.08),
            }}
          />
        );
      })}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
          marginTop: 6,
        }}
      >
        {CRYPTO_LOGOS.map((sym) => (
          <div
            key={sym}
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              border: `1px solid rgba(15,8,7,0.25)`,
              background: "rgba(255,255,255,0.55)",
              color: COLORS.creamInk,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: BODY_FONT,
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: 0.4,
            }}
          >
            {sym}
          </div>
        ))}
      </div>
    </div>
  );
}

function CrosshatchBg({ color = COLORS.cream }: { color?: string }) {
  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: color,
        backgroundImage:
          "linear-gradient(rgba(15,8,7,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(15,8,7,0.05) 1px, transparent 1px)",
        backgroundSize: "24px 24px",
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  );
}

function SectionDivider() {
  return (
    <div
      style={{
        height: 1,
        width: "100%",
        background:
          "linear-gradient(90deg, transparent, rgba(255,252,247,0.18), transparent)",
      }}
    />
  );
}

/* ── header ──────────────────────────────────────────────────────────── */

function MintHeader() {
  const navLeft = ["Home", "About", "Security", "Contact"];
  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "rgba(15,8,7,0.85)",
        backdropFilter: "blur(12px)",
        borderBottom: `1px solid rgba(255,252,247,0.08)`,
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "16px 32px",
          display: "grid",
          gridTemplateColumns: "1fr auto 1fr",
          alignItems: "center",
          gap: 24,
        }}
      >
        {/* left nav */}
        <nav
          style={{
            display: "flex",
            gap: 28,
            fontFamily: BODY_FONT,
            fontSize: 14,
            color: COLORS.textSecondary,
          }}
        >
          {navLeft.map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              style={{
                color: COLORS.textSecondary,
                textDecoration: "none",
                opacity: 0.8,
                transition: "opacity 0.2s, color 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = "1";
                e.currentTarget.style.color = COLORS.accent;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = "0.8";
                e.currentTarget.style.color = COLORS.textSecondary;
              }}
            >
              {item}
            </a>
          ))}
        </nav>

        {/* center logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontFamily: HEADING_FONT,
            fontWeight: 700,
            fontSize: 20,
            letterSpacing: "-0.02em",
          }}
        >
          <span
            style={{
              display: "inline-block",
              width: 10,
              height: 10,
              background: COLORS.accent,
              borderRadius: 2,
              transform: "rotate(45deg)",
            }}
          />
          <span style={{ color: COLORS.accent }}>Aperture</span>
        </div>

        {/* right */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            justifyContent: "flex-end",
          }}
        >
          <button
            aria-label="Search"
            style={{
              background: "transparent",
              border: "none",
              color: COLORS.textSecondary,
              cursor: "pointer",
              padding: 4,
              display: "flex",
              alignItems: "center",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <circle
                cx="11"
                cy="11"
                r="7"
                stroke="currentColor"
                strokeWidth="2"
              />
              <line
                x1="16.5"
                y1="16.5"
                x2="21"
                y2="21"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
          <button
            style={{
              fontFamily: BODY_FONT,
              fontSize: 14,
              color: COLORS.textSecondary,
              background: "transparent",
              border: `1px solid ${COLORS.textSecondary}`,
              borderRadius: 999,
              padding: "9px 20px",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = COLORS.textSecondary;
              e.currentTarget.style.color = COLORS.baseBg;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = COLORS.textSecondary;
            }}
          >
            Explore Pairs
          </button>
        </div>
      </div>
    </header>
  );
}

/* ── hero ────────────────────────────────────────────────────────────── */

function Hero() {
  return (
    <section
      style={{
        position: "relative",
        minHeight: "100vh",
        background: COLORS.cream,
        color: COLORS.creamInk,
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <CrosshatchBg />

      {/* left decorative column */}
      <div
        style={{
          position: "absolute",
          left: 64,
          top: 0,
          bottom: 0,
          display: "flex",
          alignItems: "center",
          zIndex: 2,
        }}
        aria-hidden
      >
        <PixelColumn />
      </div>

      {/* right decorative column */}
      <div
        style={{
          position: "absolute",
          right: 64,
          top: 0,
          bottom: 0,
          display: "flex",
          alignItems: "center",
          zIndex: 2,
        }}
        aria-hidden
      >
        <PixelColumn />
      </div>

      {/* center content */}
      <div
        style={{
          position: "relative",
          zIndex: 3,
          maxWidth: 760,
          textAlign: "center",
          padding: "120px 32px",
          fontFamily: BODY_FONT,
        }}
      >
        <Reveal>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "rgba(15,8,7,0.06)",
              border: "1px solid rgba(15,8,7,0.12)",
              borderRadius: 999,
              padding: "6px 14px",
              fontSize: 12,
              fontWeight: 500,
              color: COLORS.creamInk,
              marginBottom: 32,
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <path
                d="M3 10v4h4l5 5V5L7 10H3z"
                fill="currentColor"
              />
              <path
                d="M16 8a5 5 0 010 8"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
              />
            </svg>
            Block 845,231 — 12 Active Pairs
          </div>
        </Reveal>

        <Reveal delay={100}>
          <h1
            style={{
              fontFamily: HEADING_FONT,
              fontWeight: 700,
              fontSize: "clamp(40px, 6vw, 72px)",
              lineHeight: 1.04,
              letterSpacing: "-0.03em",
              color: COLORS.creamInk,
              margin: 0,
            }}
          >
            The Foundation Of
            <br />
            DEX Intelligence
          </h1>
        </Reveal>

        <Reveal delay={200}>
          <p
            style={{
              fontFamily: BODY_FONT,
              fontSize: 17,
              lineHeight: 1.6,
              color: "rgba(15,8,7,0.7)",
              maxWidth: 560,
              margin: "28px auto 0",
            }}
          >
            A transparent, decentralized DEX scanner built on Arc Network —
            designed to serve as the immutable foundation for real-time pair
            analytics and on-chain swaps.
          </p>
        </Reveal>

        <Reveal delay={300}>
          <div
            style={{
              display: "flex",
              gap: 16,
              justifyContent: "center",
              marginTop: 40,
              flexWrap: "wrap",
            }}
          >
            <button
              style={{
                fontFamily: BODY_FONT,
                fontSize: 15,
                fontWeight: 600,
                color: COLORS.textPrimary,
                background: COLORS.accent,
                border: "none",
                borderRadius: 999,
                padding: "14px 28px",
                cursor: "pointer",
                transition: "transform 0.2s, box-shadow 0.2s",
                boxShadow: "0 8px 24px rgba(236,92,51,0.3)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              Start Exploring
            </button>
            <button
              style={{
                fontFamily: BODY_FONT,
                fontSize: 15,
                fontWeight: 600,
                color: COLORS.creamInk,
                background: "transparent",
                border: `1px solid ${COLORS.creamInk}`,
                borderRadius: 999,
                padding: "14px 28px",
                cursor: "pointer",
                transition: "background 0.2s, color 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = COLORS.creamInk;
                e.currentTarget.style.color = COLORS.cream;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = COLORS.creamInk;
              }}
            >
              Read Docs
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ── trusted by ──────────────────────────────────────────────────────── */

function TrustedBy() {
  const brands = ["Arc Network", "Circle", "USDC", "WETH", "SOL"];
  return (
    <section
      style={{
        background: COLORS.baseBg,
        padding: "64px 32px",
        fontFamily: BODY_FONT,
      }}
    >
      <Reveal>
        <p
          style={{
            textAlign: "center",
            color: COLORS.textMuted,
            fontSize: 13,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            margin: 0,
          }}
        >
          Trusted by the global DEX ecosystem
        </p>
      </Reveal>
      <Reveal delay={120}>
        <div
          style={{
            display: "flex",
            gap: 64,
            justifyContent: "center",
            alignItems: "center",
            marginTop: 32,
            flexWrap: "wrap",
          }}
        >
          {brands.map((b) => (
            <span
              key={b}
              style={{
                fontFamily: HEADING_FONT,
                fontSize: 20,
                fontWeight: 600,
                color: COLORS.textMuted,
                opacity: 0.7,
                letterSpacing: "-0.01em",
                transition: "opacity 0.2s, color 0.2s",
                cursor: "default",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = "1";
                e.currentTarget.style.color = COLORS.textSecondary;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = "0.7";
                e.currentTarget.style.color = COLORS.textMuted;
              }}
            >
              {b}
            </span>
          ))}
        </div>
      </Reveal>
      <div style={{ marginTop: 64 }}>
        <SectionDivider />
      </div>
    </section>
  );
}

/* ── feature section ─────────────────────────────────────────────────── */

function FeatureSection() {
  const pair = mockPairs[0];
  const tags = ["Immutable Ledger", "Math-Based Proof", "Global Consensus"];
  return (
    <section
      id="about"
      style={{
        background: COLORS.baseBg,
        padding: "120px 32px",
        fontFamily: BODY_FONT,
      }}
    >
      <div
        style={{
          maxWidth: 1180,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 80,
          alignItems: "center",
        }}
      >
        <Reveal>
          <div>
            <h2
              style={{
                fontFamily: HEADING_FONT,
                fontSize: "clamp(32px, 4vw, 48px)",
                lineHeight: 1.08,
                letterSpacing: "-0.03em",
                color: COLORS.textPrimary,
                margin: 0,
              }}
            >
              The Foundation Of Digital Sovereignty
            </h2>
            <p
              style={{
                color: COLORS.textMuted,
                fontSize: 16,
                lineHeight: 1.7,
                marginTop: 24,
                maxWidth: 460,
              }}
            >
              Aperture runs on Arc Network's mathematically proven consensus —
              every pair, every swap, every liquidity event is recorded to an
              immutable ledger that no single party can rewrite.
            </p>
            <div
              style={{
                display: "flex",
                gap: 10,
                flexWrap: "wrap",
                marginTop: 28,
              }}
            >
              {tags.map((t) => (
                <span
                  key={t}
                  style={{
                    fontSize: 12,
                    color: COLORS.textSecondary,
                    background: "rgba(236,92,51,0.1)",
                    border: `1px solid rgba(236,92,51,0.3)`,
                    borderRadius: 999,
                    padding: "6px 14px",
                    letterSpacing: "0.02em",
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
            <a
              href="#security"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                marginTop: 32,
                color: COLORS.accent,
                textDecoration: "none",
                fontSize: 15,
                fontWeight: 600,
                borderBottom: `1px solid ${COLORS.accent}`,
                paddingBottom: 2,
              }}
            >
              Explore Security
              <span aria-hidden>→</span>
            </a>
          </div>
        </Reveal>

        <Reveal delay={150}>
          <div
            style={{
              background: COLORS.secondaryBg,
              borderRadius: 20,
              padding: 28,
              fontFamily: BODY_FONT,
              boxShadow: "0 24px 60px rgba(0,0,0,0.4)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 24,
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 12,
                    color: COLORS.textMuted,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                  }}
                >
                  Live Pair
                </div>
                <div
                  style={{
                    fontSize: 22,
                    fontWeight: 700,
                    color: COLORS.textPrimary,
                    fontFamily: HEADING_FONT,
                    marginTop: 4,
                  }}
                >
                  {pair?.token0?.symbol ?? "ETH"} /{" "}
                  {pair?.token1?.symbol ?? "USDC"}
                </div>
              </div>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 12,
                  color: COLORS.accent,
                  background: "rgba(236,92,51,0.12)",
                  borderRadius: 999,
                  padding: "4px 10px",
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: COLORS.accent,
                  }}
                />
                LIVE
              </span>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 16,
              }}
            >
              {[
                { label: "Volume 24h", value: formatUsd(pair?.volume24h ?? 0) },
                {
                  label: "Liquidity",
                  value: formatUsd(pair?.liquidityUsd ?? 0),
                },
                { label: "Tx 24h", value: `${pair?.txCount24h ?? 0}` },
                {
                  label: "Fee Tier",
                  value: `0.3%`,
                },
                {
                  label: "Price Δ 24h",
                  value: `${(pair?.priceChange24h ?? 0).toFixed(2)}%`,
                },
                {
                  label: "Market Cap",
                  value: formatUsd(pair?.marketCapUsd ?? 0),
                },
              ].map((row) => (
                <div
                  key={row.label}
                  style={{
                    background: "rgba(255,252,247,0.04)",
                    borderRadius: 12,
                    padding: "14px 16px",
                  }}
                >
                  <div
                    style={{
                      fontSize: 11,
                      color: COLORS.textMuted,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                    }}
                  >
                    {row.label}
                  </div>
                  <div
                    style={{
                      fontSize: 18,
                      fontWeight: 600,
                      color: COLORS.textPrimary,
                      marginTop: 6,
                      fontFamily: HEADING_FONT,
                    }}
                  >
                    {row.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ── stats bar ───────────────────────────────────────────────────────── */

function StatsBar() {
  const stats = [
    { value: "12K+", label: "Pairs Tracked" },
    { value: "0.3s", label: "Latency" },
    { value: "99.9%", label: "Uptime" },
    { value: "24/7", label: "Monitoring" },
  ];
  return (
    <section
      style={{
        background: COLORS.baseBg,
        padding: "96px 32px",
        borderTop: `1px solid rgba(255,252,247,0.06)`,
        borderBottom: `1px solid rgba(255,252,247,0.06)`,
        fontFamily: BODY_FONT,
      }}
    >
      <div
        style={{
          maxWidth: 1180,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 32,
        }}
      >
        {stats.map((s, i) => (
          <Reveal key={s.label} delay={i * 100}>
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  fontFamily: HEADING_FONT,
                  fontSize: "clamp(40px, 5vw, 64px)",
                  fontWeight: 700,
                  color: COLORS.accent,
                  letterSpacing: "-0.03em",
                  lineHeight: 1,
                }}
              >
                {s.value}
              </div>
              <div
                style={{
                  marginTop: 12,
                  fontSize: 13,
                  color: COLORS.textMuted,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                {s.label}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ── security grid ───────────────────────────────────────────────────── */

function SecurityGrid() {
  const cards = [
    {
      title: "Cryptographic Routing",
      desc: "Securely moving assets through validated nodes.",
      icon: (
        <path
          d="M12 2l8 4v6c0 5-3.4 8.6-8 10-4.6-1.4-8-5-8-10V6l8-4z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      ),
    },
    {
      title: "Sub-second Finality",
      desc: "Instant transaction settlement across global rails.",
      icon: (
        <>
          <circle
            cx="12"
            cy="12"
            r="9"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
          />
          <path
            d="M12 7v5l3 2"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            fill="none"
          />
        </>
      ),
    },
    {
      title: "Omni-chain Bridging",
      desc: "Syncing assets perfectly across protocols.",
      icon: (
        <>
          <path
            d="M4 12h14"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <path
            d="M13 7l5 5-5 5"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </>
      ),
    },
    {
      title: "Algorithmic Auditing",
      desc: "Real-time verification of every supply change.",
      icon: (
        <>
          <rect
            x="4"
            y="4"
            width="16"
            height="16"
            rx="2"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
          />
          <path
            d="M8 12l3 3 5-6"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </>
      ),
    },
    {
      title: "Compliance Automations",
      desc: "Built-in checks for regulatory standards.",
      icon: (
        <>
          <path
            d="M6 4h12v4a6 6 0 01-12 0V4z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path
            d="M9 20h6M12 14v6"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </>
      ),
    },
    {
      title: "Collaborative Custody",
      desc: "Multi-sig infrastructure for institutional teams.",
      icon: (
        <>
          <circle
            cx="8"
            cy="10"
            r="3"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
          />
          <circle
            cx="16"
            cy="10"
            r="3"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
          />
          <path
            d="M3 20c0-3 2.5-5 5-5s5 2 5 5M11 20c0-3 2.5-5 5-5s5 2 5 5"
            stroke="currentColor"
            strokeWidth="1.6"
            fill="none"
            strokeLinecap="round"
          />
        </>
      ),
    },
  ];

  return (
    <section
      id="security"
      style={{
        background: COLORS.baseBg,
        padding: "120px 32px",
        fontFamily: BODY_FONT,
      }}
    >
      <Reveal>
        <h2
          style={{
            fontFamily: HEADING_FONT,
            fontSize: "clamp(32px, 4vw, 48px)",
            letterSpacing: "-0.03em",
            color: COLORS.textPrimary,
            textAlign: "center",
            margin: "0 auto 16px",
            maxWidth: 720,
          }}
        >
          Institutional-Grade Security Infrastructure
        </h2>
      </Reveal>
      <Reveal delay={120}>
        <p
          style={{
            textAlign: "center",
            color: COLORS.textMuted,
            fontSize: 16,
            maxWidth: 560,
            margin: "0 auto 64px",
          }}
        >
          Every layer of the Aperture stack is engineered for deterministic
          guarantees and auditability.
        </p>
      </Reveal>

      <div
        style={{
          maxWidth: 1180,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 24,
        }}
      >
        {cards.map((c, i) => (
          <Reveal key={c.title} delay={i * 80}>
            <div
              style={{
                background: COLORS.secondaryBg,
                borderRadius: 16,
                padding: 32,
                height: "100%",
                transition: "transform 0.3s, border-color 0.3s",
                border: "1px solid rgba(255,252,247,0.04)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.borderColor =
                  "rgba(236,92,51,0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.borderColor =
                  "rgba(255,252,247,0.04)";
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 10,
                  background: "rgba(236,92,51,0.12)",
                  color: COLORS.accent,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 20,
                }}
              >
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  {c.icon}
                </svg>
              </div>
              <h3
                style={{
                  fontFamily: HEADING_FONT,
                  fontSize: 19,
                  fontWeight: 600,
                  color: COLORS.textPrimary,
                  margin: "0 0 10px",
                  letterSpacing: "-0.01em",
                }}
              >
                {c.title}
              </h3>
              <p
                style={{
                  color: COLORS.textMuted,
                  fontSize: 14,
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                {c.desc}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ── security points bar ─────────────────────────────────────────────── */

function SecurityPoints() {
  const items = [
    { value: "100%", label: "Cold Storage" },
    { value: "24", label: "HSM Nodes" },
    { value: "5/7", label: "Multi-Sig" },
    { value: "12", label: "Jurisdictions" },
  ];
  return (
    <section
      style={{
        background: COLORS.baseBg,
        padding: "48px 32px",
        borderTop: `1px solid rgba(255,252,247,0.06)`,
        borderBottom: `1px solid rgba(255,252,247,0.06)`,
        fontFamily: BODY_FONT,
      }}
    >
      <div
        style={{
          maxWidth: 1180,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 24,
        }}
      >
        {items.map((it, i) => (
          <Reveal key={it.label} delay={i * 80}>
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: 12,
                justifyContent: "center",
              }}
            >
              <span
                style={{
                  fontFamily: HEADING_FONT,
                  fontSize: 36,
                  fontWeight: 700,
                  color: COLORS.accent,
                  letterSpacing: "-0.03em",
                }}
              >
                {it.value}
              </span>
              <span
                style={{
                  fontSize: 13,
                  color: COLORS.textMuted,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                {it.label}
              </span>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ── live data ───────────────────────────────────────────────────────── */

function LiveData() {
  return (
    <section
      style={{
        background: COLORS.baseBg,
        padding: "120px 32px",
        fontFamily: BODY_FONT,
      }}
    >
      <div
        style={{
          maxWidth: 1180,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 48,
          alignItems: "center",
        }}
      >
        <Reveal>
          <div>
            <span
              style={{
                fontSize: 12,
                color: COLORS.accent,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                fontWeight: 600,
              }}
            >
              Developer API
            </span>
            <h2
              style={{
                fontFamily: HEADING_FONT,
                fontSize: "clamp(30px, 4vw, 44px)",
                letterSpacing: "-0.03em",
                color: COLORS.textPrimary,
                margin: "16px 0 20px",
              }}
            >
              REST & WebSocket APIs with comprehensive SDKs
            </h2>
            <p
              style={{
                color: COLORS.textMuted,
                fontSize: 16,
                lineHeight: 1.7,
                margin: 0,
              }}
            >
              Stream every pair update, swap, and liquidity event in real time.
              Type-safe SDKs for TypeScript, Python, and Rust — all backed by
              Arc Network's deterministic finality.
            </p>
            <div
              style={{
                marginTop: 28,
                background: "#1a0f0e",
                border: `1px solid rgba(255,252,247,0.08)`,
                borderRadius: 12,
                padding: "18px 20px",
                fontFamily: "ui-monospace, 'SF Mono', Menlo, monospace",
                fontSize: 14,
                color: COLORS.textSecondary,
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <span
                style={{
                  display: "flex",
                  gap: 6,
                }}
                aria-hidden
              >
                <span
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: "#ff5f56",
                  }}
                />
                <span
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: "#ffbd2e",
                  }}
                />
                <span
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: "#27c93f",
                  }}
                />
              </span>
              <span>
                <span style={{ color: COLORS.textMuted }}>$ </span>
                npm install @aperture/sdk
              </span>
            </div>
          </div>
        </Reveal>

        <Reveal delay={150}>
          <div
            style={{
              background: COLORS.secondaryBg,
              borderRadius: 20,
              padding: 28,
              boxShadow: "0 24px 60px rgba(0,0,0,0.4)",
            }}
          >
            <div
              style={{
                fontSize: 12,
                color: COLORS.textMuted,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginBottom: 18,
              }}
            >
              Live Network Data
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 16,
              }}
            >
              {[
                { label: "Block Height", value: "845,231" },
                { label: "BTC / USD", value: "$68,420" },
                { label: "Hash Rate", value: "612 EH/s" },
                { label: "Active Pairs", value: "12,847" },
                { label: "24h Volume", value: "$1.2B" },
                { label: "Finality", value: "0.3s" },
              ].map((row) => (
                <div
                  key={row.label}
                  style={{
                    background: "rgba(255,252,247,0.04)",
                    borderRadius: 12,
                    padding: "16px 18px",
                  }}
                >
                  <div
                    style={{
                      fontSize: 11,
                      color: COLORS.textMuted,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                    }}
                  >
                    {row.label}
                  </div>
                  <div
                    style={{
                      fontSize: 20,
                      fontWeight: 600,
                      color: COLORS.textPrimary,
                      marginTop: 6,
                      fontFamily: HEADING_FONT,
                    }}
                  >
                    {row.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ── community ───────────────────────────────────────────────────────── */

function Community() {
  const cards = [
    {
      name: "X / Twitter",
      handle: "@aperture_dex",
      desc: "Latest updates, pair alerts, and announcements",
      icon: (
        <path
          d="M18 4l-5 6 5 8h-3l-3.5-5.6L7 18H5l5.3-6.4L5 4h3l3.3 5L15 4h3z"
          fill="currentColor"
        />
      ),
    },
    {
      name: "Discord",
      handle: "discord.gg/aperture",
      desc: "Community support, discussions, and direct assistance",
      icon: (
        <path
          d="M19 6.5A14 14 0 0015.5 5l-.3.5a11 11 0 014 2.3 13 13 0 00-11 0 11 11 0 014-2.3L12 5A14 14 0 005 6.5 18 18 0 003 16a13 13 0 004 2l.7-1c-.8-.3-1.5-.7-2.2-1.2l.5-.4a12 12 0 0012 0l.5.4c-.7.5-1.4.9-2.2 1.2L17 18a13 13 0 004-2 18 18 0 00-2-9.5zM9.5 14.5c-.8 0-1.5-.8-1.5-1.8s.7-1.8 1.5-1.8 1.5.8 1.5 1.8-.7 1.8-1.5 1.8zm5 0c-.8 0-1.5-.8-1.5-1.8s.7-1.8 1.5-1.8 1.5.8 1.5 1.8-.7 1.8-1.5 1.8z"
          fill="currentColor"
        />
      ),
    },
    {
      name: "Telegram",
      handle: "t.me/aperture_dex",
      desc: "Real-time updates, support channels, and community chat",
      icon: (
        <path
          d="M21 5L3 11.5l5 1.8 2 5 2.5-3 4.5 3.5L21 5zm-4 2L9 13l-.5 3L7 14l10-7z"
          fill="currentColor"
        />
      ),
    },
    {
      name: "GitHub",
      handle: "github.com/aperture",
      desc: "Open-source tools, SDKs, and developer resources",
      icon: (
        <path
          d="M12 2a10 10 0 00-3.2 19.5c.5.1.7-.2.7-.5v-2c-2.8.6-3.4-1.2-3.4-1.2-.5-1.1-1.1-1.4-1.1-1.4-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.6 2.4 1.1 3 .9.1-.7.4-1.1.6-1.4-2.2-.300-4.6-1.1-4.6-5a4 4 0 011-2.7c-.1-.3-.5-1.3.1-2.7 0 0 .8-.3 2.7 1a9.4 9.4 0 015 0c1.9-1.3 2.7-1 2.7-1 .6 1.4.2 2.4.1 2.7a4 4 0 011 2.7c0 3.9-2.4 4.7-4.6 5 .4.3.7.9.7 1.9v2.8c0 .3.2.6.7.5A10 10 0 0012 2z"
          fill="currentColor"
        />
      ),
    },
  ];

  return (
    <section
      style={{
        background: COLORS.baseBg,
        padding: "120px 32px",
        fontFamily: BODY_FONT,
      }}
    >
      <Reveal>
        <h2
          style={{
            fontFamily: HEADING_FONT,
            fontSize: "clamp(30px, 4vw, 44px)",
            letterSpacing: "-0.03em",
            color: COLORS.textPrimary,
            textAlign: "center",
            margin: "0 auto 16px",
          }}
        >
          Join The Aperture Community
        </h2>
      </Reveal>
      <Reveal delay={120}>
        <p
          style={{
            textAlign: "center",
            color: COLORS.textMuted,
            fontSize: 16,
            maxWidth: 520,
            margin: "0 auto 64px",
          }}
        >
          Connect with traders, developers, and the team across every major
          platform.
        </p>
      </Reveal>

      <div
        style={{
          maxWidth: 1180,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 20,
        }}
      >
        {cards.map((c, i) => (
          <Reveal key={c.name} delay={i * 80}>
            <div
              style={{
                background: COLORS.secondaryBg,
                borderRadius: 16,
                padding: 28,
                height: "100%",
                transition: "transform 0.3s, border-color 0.3s",
                border: "1px solid rgba(255,252,247,0.04)",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.borderColor =
                  "rgba(236,92,51,0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.borderColor =
                  "rgba(255,252,247,0.04)";
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  color: COLORS.accent,
                  marginBottom: 18,
                }}
              >
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  {c.icon}
                </svg>
              </div>
              <h3
                style={{
                  fontFamily: HEADING_FONT,
                  fontSize: 18,
                  fontWeight: 600,
                  color: COLORS.textPrimary,
                  margin: "0 0 6px",
                }}
              >
                {c.name}
              </h3>
              <div
                style={{
                  fontSize: 13,
                  color: COLORS.accent,
                  marginBottom: 12,
                  fontWeight: 500,
                }}
              >
                {c.handle}
              </div>
              <p
                style={{
                  color: COLORS.textMuted,
                  fontSize: 13,
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                {c.desc}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ── testimonials ────────────────────────────────────────────────────── */

function Testimonials() {
  const quotes = [
    {
      quote:
        "Aperture provided the real-time analytics and deterministic finality we were searching for.",
      name: "Michael Chen",
      role: "CTO, Sentinel Capital",
    },
    {
      quote:
        "Integrating Aperture's protocol redefined our approach to decentralized trading.",
      name: "Aisha Malik",
      role: "Lead Blockchain Engineer",
    },
    {
      quote:
        "Aperture's deterministic finality empowered us to optimize asset allocation across pairs.",
      name: "Louis Ramirez",
      role: "Head of Product",
    },
  ];
  return (
    <section
      style={{
        background: COLORS.baseBg,
        padding: "120px 32px",
        fontFamily: BODY_FONT,
        borderTop: `1px solid rgba(255,252,247,0.06)`,
      }}
    >
      <Reveal>
        <h2
          style={{
            fontFamily: HEADING_FONT,
            fontSize: "clamp(30px, 4vw, 44px)",
            letterSpacing: "-0.03em",
            color: COLORS.textPrimary,
            textAlign: "center",
            margin: "0 auto 64px",
          }}
        >
          Validated By The Sovereign Network
        </h2>
      </Reveal>

      <div
        style={{
          maxWidth: 1180,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 24,
        }}
      >
        {quotes.map((q, i) => (
          <Reveal key={q.name} delay={i * 100}>
            <div
              style={{
                background: COLORS.secondaryBg,
                borderRadius: 16,
                padding: 32,
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  fontFamily: HEADING_FONT,
                  fontSize: 48,
                  color: COLORS.accent,
                  lineHeight: 0.6,
                  marginBottom: 12,
                  opacity: 0.5,
                }}
                aria-hidden
              >
                "
              </div>
              <p
                style={{
                  color: COLORS.textSecondary,
                  fontSize: 16,
                  lineHeight: 1.7,
                  margin: "0 0 28px",
                  flex: 1,
                }}
              >
                {q.quote}
              </p>
              <div>
                <div
                  style={{
                    fontFamily: HEADING_FONT,
                    fontWeight: 600,
                    color: COLORS.textPrimary,
                    fontSize: 15,
                  }}
                >
                  {q.name}
                </div>
                <div
                  style={{
                    color: COLORS.textMuted,
                    fontSize: 13,
                    marginTop: 2,
                  }}
                >
                  {q.role}
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ── FAQ accordion ───────────────────────────────────────────────────── */

function FaqItem({
  q,
  a,
  open,
  onToggle,
}: {
  q: string;
  a: string;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      style={{
        borderBottom: `1px solid rgba(255,252,247,0.08)`,
      }}
    >
      <button
        onClick={onToggle}
        style={{
          width: "100%",
          textAlign: "left",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          padding: "24px 0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 16,
          fontFamily: BODY_FONT,
          color: COLORS.textPrimary,
          fontSize: 17,
          fontWeight: 500,
        }}
      >
        <span>{q}</span>
        <span
          style={{
            color: COLORS.accent,
            fontSize: 22,
            transition: "transform 0.3s",
            transform: open ? "rotate(45deg)" : "rotate(0deg)",
            flexShrink: 0,
          }}
          aria-hidden
        >
          +
        </span>
      </button>
      <div
        style={{
          maxHeight: open ? 200 : 0,
          overflow: "hidden",
          transition: "max-height 0.35s ease",
        }}
      >
        <p
          style={{
            color: COLORS.textMuted,
            fontSize: 15,
            lineHeight: 1.7,
            margin: "0 0 24px",
            paddingRight: 32,
          }}
        >
          {a}
        </p>
      </div>
    </div>
  );
}

function Faq() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const faqs = [
    {
      q: "Is Aperture backed by real on-chain data?",
      a: "Yes. Every pair, swap, and liquidity event is read directly from Arc Network's ledger — no off-chain aggregation, no synthetic values. What you see is what the chain produced.",
    },
    {
      q: "How does Aperture verify total volume?",
      a: "Volume is summed from verified swap events emitted by Arc Network pool contracts. Each event is independently replayable, so any observer can recompute the published totals.",
    },
    {
      q: "How does Aperture handle network congestion?",
      a: "Arc Network's deterministic finality means there is no mempool backlog in the traditional sense. Aperture streams finalized state at sub-second cadence regardless of network load.",
    },
    {
      q: "What defines Aperture's security architecture?",
      a: "A combination of cryptographic routing, multi-sig custody, HSM-backed nodes, and algorithmic auditing — every layer independently verifiable and documented in the security model.",
    },
    {
      q: "Can I audit the Aperture protocol?",
      a: "Yes. The scanner is open-source and every verification routine is published. You can replay any historical pair state and confirm it matches what the UI displayed.",
    },
    {
      q: "How does Aperture bridge legacy finance?",
      a: "Through compliance automations and institutional custody integrations. Aperture exposes the same pair data to both DeFi-native and TradFi-facing systems without compromising on transparency.",
    },
  ];
  return (
    <section
      style={{
        background: COLORS.baseBg,
        padding: "120px 32px",
        fontFamily: BODY_FONT,
        borderTop: `1px solid rgba(255,252,247,0.06)`,
      }}
    >
      <div
        style={{
          maxWidth: 760,
          margin: "0 auto",
        }}
      >
        <Reveal>
          <h2
            style={{
              fontFamily: HEADING_FONT,
              fontSize: "clamp(30px, 4vw, 44px)",
              letterSpacing: "-0.03em",
              color: COLORS.textPrimary,
              textAlign: "center",
              margin: "0 auto 64px",
            }}
          >
            Decoding The Future Of DEX Trading
          </h2>
        </Reveal>
        <Reveal delay={100}>
          <div>
            {faqs.map((f, i) => (
              <FaqItem
                key={f.q}
                q={f.q}
                a={f.a}
                open={openIdx === i}
                onToggle={() => setOpenIdx(openIdx === i ? null : i)}
              />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ── final CTA ───────────────────────────────────────────────────────── */

function FinalCta() {
  return (
    <section
      style={{
        position: "relative",
        background: COLORS.baseBg,
        padding: "140px 32px",
        textAlign: "center",
        fontFamily: BODY_FONT,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          opacity: 0.4,
          pointerEvents: "none",
        }}
        aria-hidden
      >
        <ParticleField />
      </div>
      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: 720,
          margin: "0 auto",
        }}
      >
        <Reveal>
          <h2
            style={{
              fontFamily: HEADING_FONT,
              fontSize: "clamp(36px, 5vw, 60px)",
              letterSpacing: "-0.03em",
              color: COLORS.textPrimary,
              margin: 0,
              lineHeight: 1.05,
            }}
          >
            Start Your Aperture Integration
          </h2>
        </Reveal>
        <Reveal delay={120}>
          <p
            style={{
              color: COLORS.textMuted,
              fontSize: 17,
              lineHeight: 1.7,
              margin: "24px auto 40px",
              maxWidth: 560,
            }}
          >
            Our protocol provides the deterministic finality and
            institutional-grade security required to navigate DEX pairs with
            confidence.
          </p>
        </Reveal>
        <Reveal delay={220}>
          <button
            style={{
              fontFamily: BODY_FONT,
              fontSize: 16,
              fontWeight: 600,
              color: COLORS.textPrimary,
              background: COLORS.accent,
              border: "none",
              borderRadius: 999,
              padding: "16px 36px",
              cursor: "pointer",
              transition: "transform 0.2s, box-shadow 0.2s",
              boxShadow: "0 12px 32px rgba(236,92,51,0.35)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            Get Access
          </button>
        </Reveal>
      </div>
    </section>
  );
}

/* ── page ────────────────────────────────────────────────────────────── */

export default function LandingMintClone() {
  return (
    <main
      style={{
        background: COLORS.baseBg,
        color: COLORS.textSecondary,
        fontFamily: BODY_FONT,
        minHeight: "100vh",
      }}
    >
      <Header showTicker={false} showFaucet={false} />
      <MintHeader />

      <Hero />
      <TrustedBy />
      <FeatureSection />
      <StatsBar />
      <SecurityGrid />
      <SecurityPoints />
      <LiveData />
      <Community />
      <Testimonials />
      <Faq />
      <FinalCta />

      <Footer />
    </main>
  );
}
