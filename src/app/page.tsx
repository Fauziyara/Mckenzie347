"use client";

import React, { useState, useEffect } from "react";
import { Reveal } from "@/components/reveal";
import { mockPairs } from "@/lib/mock-data";
import { formatUsd } from "@/lib/format";

/* ------------------------------------------------------------------ */
/*  Small helpers                                                      */
/* ------------------------------------------------------------------ */

function ApertureLogo({ color = "#0A2540" }: { color?: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.6" />
      <path
        d="M12 2 L12 9 M22 12 L15 12 M12 22 L12 15 M2 12 L9 12"
        stroke={color}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <circle cx="12" cy="12" r="2.4" fill={color} />
    </svg>
  );
}

/* Card hover hook --------------------------------------------------- */
function useCardHover() {
  const [hovered, setHovered] = useState(false);
  return {
    hovered,
    bind: {
      onMouseEnter: () => setHovered(true),
      onMouseLeave: () => setHovered(false),
    },
  };
}

/* Feature card ------------------------------------------------------ */
type Feature = {
  icon: React.ReactNode;
  title: string;
  desc: string;
};

const FEATURES: Feature[] = [
  {
    title: "Pair Discovery",
    desc: "Every liquidity pool on Arc, indexed the instant it's created.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="#635BFF" strokeWidth="1.6" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" stroke="#635BFF" strokeWidth="1.6" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" stroke="#635BFF" strokeWidth="1.6" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" stroke="#635BFF" strokeWidth="1.6" />
      </svg>
    ),
  },
  {
    title: "Swap History",
    desc: "Complete on-chain swap logs with price impact, gas, and sender analysis.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <line x1="4" y1="6" x2="20" y2="6" stroke="#635BFF" strokeWidth="1.6" strokeLinecap="round" />
        <line x1="4" y1="12" x2="20" y2="12" stroke="#635BFF" strokeWidth="1.6" strokeLinecap="round" />
        <line x1="4" y1="18" x2="14" y2="18" stroke="#635BFF" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Liquidity Tracking",
    desc: "Live liquidity curves and TVL monitoring across all verified pairs.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path
          d="M3 17 C7 17 7 9 11 9 C15 9 15 13 21 7"
          stroke="#635BFF"
          strokeWidth="1.6"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M3 21 C7 21 7 17 11 17 C15 17 15 19 21 15"
          stroke="#635BFF"
          strokeWidth="1.6"
          strokeLinecap="round"
          fill="none"
          opacity="0.5"
        />
      </svg>
    ),
  },
  {
    title: "Price Feeds",
    desc: "Math-verified price data — no oracles, no estimates, no approximations.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 3 L20 6 V11 C20 16 16 20 12 21 C8 20 4 16 4 11 V6 Z"
          stroke="#635BFF"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path
          d="M9 12 L11.5 14.5 L15.5 9.5"
          stroke="#635BFF"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: "Analytics API",
    desc: "Full programmatic access via REST and WebSocket. npm install @aperture/sdk",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path
          d="M8 6 L3 12 L8 18"
          stroke="#635BFF"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M16 6 L21 12 L16 18"
          stroke="#635BFF"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <line x1="13.5" y1="4" x2="10.5" y2="20" stroke="#635BFF" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Block Scanner",
    desc: "Real-time block heights, transaction indexing, and contract event monitoring.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 2 L21 7 V17 L12 22 L3 17 V7 Z"
          stroke="#635BFF"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path d="M3 7 L12 12 L21 7" stroke="#635BFF" strokeWidth="1.6" strokeLinejoin="round" />
        <line x1="12" y1="12" x2="12" y2="22" stroke="#635BFF" strokeWidth="1.6" />
      </svg>
    ),
  },
];

/* Terminal code lines ------------------------------------------------ */
type CodeLine = { text: string; color?: string };

const CODE_LINES: CodeLine[] = [
  { text: "$ npm install @aperture/sdk", color: "#FFFFFF" },
  { text: "" },
  { text: "// Initialize the client", color: "rgba(255,255,255,0.4)" },
  { text: "import { Aperture } from '@aperture/sdk'", color: "#635BFF" },
  { text: "" },
  { text: "const client = new Aperture({", color: "#FFFFFF" },
  { text: "  network: 'arc-testnet',", color: "#00D66F" },
  { text: "  wsUrl: 'wss://api.aperture.xyz'", color: "#00D66F" },
  { text: "})", color: "#FFFFFF" },
  { text: "" },
  { text: "// Fetch all pairs", color: "rgba(255,255,255,0.4)" },
  { text: "const pairs = await client.getPairs()", color: "#FFFFFF" },
];

/* Checkmark row ------------------------------------------------------ */
function CheckRow({ items }: { items: string[] }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "24px" }}>
      {items.map((t) => (
        <div key={t} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="11" fill="#635BFF" opacity="0.12" />
            <path
              d="M7 12.5 L10.5 16 L17.5 8.5"
              stroke="#635BFF"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span style={{ fontSize: "16px", color: "#0A2540", fontWeight: 400 }}>{t}</span>
        </div>
      ))}
    </div>
  );
}

/* Single feature card ------------------------------------------------ */
function FeatureCard({ feature }: { feature: Feature }) {
  const { hovered, bind } = useCardHover();
  return (
    <div
      {...bind}
      style={{
        background: "#FFFFFF",
        borderRadius: "8px",
        boxShadow: hovered
          ? "0 8px 24px rgba(0,0,0,0.08)"
          : "0 1px 2px rgba(0,0,0,0.04)",
        padding: "32px",
        transition: "box-shadow 0.2s ease",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div>{feature.icon}</div>
      <h3
        style={{
          fontSize: "24px",
          fontWeight: 500,
          color: "#0A2540",
          letterSpacing: "-0.01em",
          margin: "16px 0 0 0",
        }}
      >
        {feature.title}
      </h3>
      <p
        style={{
          fontSize: "16px",
          fontWeight: 400,
          color: "#425466",
          lineHeight: 1.5,
          margin: "8px 0 0 0",
        }}
      >
        {feature.desc}
      </p>
      <a
        href="/explore"
        style={{
          marginTop: "16px",
          fontSize: "14px",
          fontWeight: 400,
          color: "#635BFF",
          textDecoration: "none",
          alignSelf: "flex-start",
        }}
      >
        Learn more →
      </a>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main page component                                                */
/* ------------------------------------------------------------------ */

export default function LandingPage() {
  /* 1. Scroll-aware nav */
  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* 2. Animated block counter */
  const [blockNum, setBlockNum] = useState(845231);
  useEffect(() => {
    const interval = setInterval(() => {
      setBlockNum((prev) => prev + Math.floor(Math.random() * 3) + 1);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const pair = mockPairs[0];

  /* Footer link groups */
  const footerCols = [
    {
      title: "PRODUCT",
      links: [
        { label: "Explore", href: "/explore" },
        { label: "Pairs", href: "/explore" },
        { label: "Swap", href: "/explore" },
        { label: "Portfolio", href: "/explore" },
      ],
    },
    {
      title: "RESOURCES",
      links: [
        { label: "Docs", href: "https://docs.aperture.xyz" },
        { label: "API", href: "/explore" },
        { label: "GitHub", href: "/explore" },
        { label: "Status", href: "/explore" },
      ],
    },
    {
      title: "COMPANY",
      links: [
        { label: "About", href: "/explore" },
        { label: "Blog", href: "/explore" },
        { label: "Contact", href: "/explore" },
        { label: "Privacy", href: "/explore" },
      ],
    },
  ];

  return (
    <div
      style={{
        fontFamily: "'Inter', -apple-system, system-ui, sans-serif",
        background: "#FFFFFF",
        color: "#0A2540",
        margin: 0,
      }}
    >
      {/* Embedded hover styles for nav links + footer links */}
      <style>{`
        .nav-link { transition: color 0.2s ease; }
        .nav-link:hover { color: #635BFF !important; }
        .footer-link { transition: color 0.2s ease; }
        .footer-link:hover { color: #FFFFFF !important; }
        .text-link:hover { text-decoration: underline; }
        @import url('https://rsms.me/inter/inter.css');
      `}</style>

      {/* ============================================================ */}
      {/* 1. NAV                                                       */}
      {/* ============================================================ */}
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          height: "68px",
          display: "flex",
          alignItems: "center",
          background: isScrolled ? "#FFFFFF" : "transparent",
          boxShadow: isScrolled ? "0 1px 0 rgba(0,0,0,0.06)" : "none",
          transition: "background-color 0.2s ease, box-shadow 0.2s ease",
        }}
      >
        <div
          style={{
            maxWidth: "1080px",
            width: "100%",
            margin: "0 auto",
            padding: "0 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Left: logo */}
          <a href="/explore" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none" }}>
            <ApertureLogo color="#0A2540" />
            <span style={{ fontSize: "16px", fontWeight: 500, color: "#0A2540" }}>Aperture</span>
          </a>

          {/* Center: nav links */}
          <div style={{ display: "flex", gap: "28px" }}>
            {[
              { label: "Explore", href: "/explore" },
              { label: "Pairs", href: "/explore" },
              { label: "API", href: "/explore" },
              { label: "Docs", href: "https://docs.aperture.xyz" },
            ].map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="nav-link"
                style={{
                  fontSize: "14px",
                  fontWeight: 400,
                  color: "#0A2540",
                  textDecoration: "none",
                }}
              >
                {l.label}
              </a>
            ))}
          </div>

          {/* Right: auth */}
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <a
              href="/explore"
              className="nav-link"
              style={{
                fontSize: "14px",
                fontWeight: 400,
                color: "#425466",
                textDecoration: "none",
              }}
            >
              Sign in
            </a>
            <a
              href="/explore"
              style={{
                background: "#635BFF",
                color: "#FFFFFF",
                borderRadius: "4px",
                padding: "8px 16px",
                fontSize: "14px",
                fontWeight: 400,
                textDecoration: "none",
                transition: "background-color 0.2s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#5247DB")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#635BFF")}
            >
              Go to app
            </a>
          </div>
        </div>
      </nav>

      {/* ============================================================ */}
      {/* 2. HERO                                                      */}
      {/* ============================================================ */}
      <section
        style={{
          position: "relative",
          background: "#FFFFFF",
          minHeight: "80vh",
          padding: "120px 0 80px",
          overflow: "hidden",
        }}
      >
        {/* Gradient mesh — 4 overlapping blurred blobs in top-right */}
        <div
          style={{
            position: "absolute",
            top: "-200px",
            right: "-150px",
            width: "500px",
            height: "500px",
            background: "radial-gradient(circle, #FF6BCB 0%, transparent 70%)",
            filter: "blur(150px)",
            opacity: 0.6,
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "100px",
            right: "-100px",
            width: "400px",
            height: "400px",
            background: "radial-gradient(circle, #FF8A4C 0%, transparent 70%)",
            filter: "blur(120px)",
            opacity: 0.5,
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "0px",
            right: "50px",
            width: "350px",
            height: "350px",
            background: "radial-gradient(circle, #8B5CF6 0%, transparent 70%)",
            filter: "blur(100px)",
            opacity: 0.4,
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "-100px",
            left: "40%",
            width: "300px",
            height: "300px",
            background: "radial-gradient(circle, #635BFF 0%, transparent 70%)",
            filter: "blur(100px)",
            opacity: 0.3,
            pointerEvents: "none",
          }}
        />

        {/* Content */}
        <div
          style={{
            position: "relative",
            maxWidth: "1080px",
            margin: "0 auto",
            padding: "0 24px",
          }}
        >
          <div style={{ maxWidth: "60%", display: "flex", flexDirection: "column", gap: "24px" }}>
            {/* Animated counter */}
            <Reveal delay={0}>
              <div style={{ fontSize: "14px", fontWeight: 400, color: "#6B7C93" }}>
                Block {blockNum.toLocaleString()} • 12 active pairs
              </div>
            </Reveal>

            {/* H1 */}
            <Reveal delay={80}>
              <h1
                style={{
                  fontSize: "56px",
                  fontWeight: 300,
                  color: "#0A2540",
                  letterSpacing: "-0.02em",
                  lineHeight: 1.1,
                  margin: 0,
                }}
              >
                Scan every <span style={{ color: "#00D66F" }}>pair</span> on Arc Network.
              </h1>
            </Reveal>

            {/* Subheadline */}
            <Reveal delay={160}>
              <p
                style={{
                  fontSize: "20px",
                  fontWeight: 400,
                  color: "#425466",
                  maxWidth: "520px",
                  lineHeight: 1.5,
                  margin: 0,
                }}
              >
                Real-time pair data, on-chain swap history, and verified liquidity analytics. No
                estimates — just deterministic data from Arc's public ledger.
              </p>
            </Reveal>

            {/* Buttons */}
            <Reveal delay={240}>
              <div style={{ display: "flex", gap: "12px", marginTop: "32px" }}>
                <a
                  href="/explore"
                  style={{
                    background: "#635BFF",
                    color: "#FFFFFF",
                    borderRadius: "4px",
                    padding: "12px 18px",
                    fontSize: "16px",
                    fontWeight: 400,
                    textDecoration: "none",
                    boxShadow: "0 1px 2px rgba(0,0,0,0.08)",
                    transition: "background-color 0.2s ease, box-shadow 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#5247DB";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#635BFF";
                  }}
                >
                  Explore pairs
                </a>
                <a
                  href="https://docs.aperture.xyz"
                  style={{
                    background: "transparent",
                    border: "1px solid #E3E8EE",
                    color: "#0A2540",
                    borderRadius: "4px",
                    padding: "12px 18px",
                    fontSize: "16px",
                    fontWeight: 400,
                    textDecoration: "none",
                    transition: "background-color 0.2s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#F6F9FC")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  Read docs
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 3. TRUSTED BY                                                */}
      {/* ============================================================ */}
      <section style={{ background: "#FFFFFF", padding: "60px 0 40px" }}>
        <div style={{ maxWidth: "1080px", margin: "0 auto", padding: "0 24px" }}>
          <p
            style={{
              textAlign: "center",
              fontSize: "14px",
              fontWeight: 400,
              color: "#6B7C93",
              margin: "0 0 32px 0",
            }}
          >
            Trusted by teams building on Arc
          </p>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              alignItems: "center",
              gap: "48px",
            }}
          >
            {["PROJECTA", "DEXLAB", "ARCSCAN", "LIQUIDITY", "SWAPNET", "CHAINFLOW"].map((n) => (
              <span
                key={n}
                style={{
                  fontSize: "16px",
                  fontWeight: 500,
                  color: "#6B7C93",
                  opacity: 0.5,
                  letterSpacing: "0.02em",
                }}
              >
                {n}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 4. FEATURES                                                  */}
      {/* ============================================================ */}
      <section style={{ background: "#FFFFFF", padding: "96px 0" }}>
        <div style={{ maxWidth: "1080px", margin: "0 auto", padding: "0 24px" }}>
          <Reveal>
            <div style={{ fontSize: "14px", fontWeight: 400, color: "#6B7C93", textTransform: "uppercase" }}>
              FEATURES
            </div>
            <h2
              style={{
                fontSize: "40px",
                fontWeight: 300,
                color: "#0A2540",
                letterSpacing: "-0.02em",
                lineHeight: 1.1,
                margin: "16px 0 0 0",
              }}
            >
              Everything you need to scan Arc Network.
            </h2>
          </Reveal>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "20px",
              marginTop: "48px",
            }}
          >
            {FEATURES.map((f, i) => (
              <Reveal key={f.title} delay={i * 80}>
                <FeatureCard feature={f} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 5. SHOWCASE                                                  */}
      {/* ============================================================ */}
      <section style={{ background: "#F6F9FC", padding: "120px 0" }}>
        <div
          style={{
            maxWidth: "1080px",
            margin: "0 auto",
            padding: "0 24px",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "64px",
            alignItems: "center",
          }}
        >
          {/* LEFT */}
          <Reveal>
            <div>
              <div style={{ fontSize: "14px", fontWeight: 400, color: "#6B7C93", textTransform: "uppercase" }}>
                LIVE DATA
              </div>
              <h2
                style={{
                  fontSize: "40px",
                  fontWeight: 300,
                  color: "#0A2540",
                  letterSpacing: "-0.02em",
                  lineHeight: 1.1,
                  margin: "16px 0 0 0",
                }}
              >
                Verified on-chain, in real time.
              </h2>
              <p
                style={{
                  fontSize: "17px",
                  fontWeight: 400,
                  color: "#425466",
                  maxWidth: "440px",
                  lineHeight: 1.5,
                  margin: "16px 0 0 0",
                }}
              >
                Every data point is sourced directly from Arc Network's public ledger. No
                estimates — just mathematically verified data.
              </p>
              <CheckRow
                items={["Deterministic price feeds", "Sub-second finality", "Full swap history"]}
              />
            </div>
          </Reveal>

          {/* RIGHT — floating data card */}
          <Reveal delay={120}>
            <div
              style={{
                background: "#FFFFFF",
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                padding: "28px",
              }}
            >
              {/* Header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "20px",
                }}
              >
                <span style={{ fontSize: "14px", fontWeight: 400, color: "#00D66F" }}>● LIVE</span>
                <span
                  style={{
                    fontSize: "14px",
                    fontWeight: 400,
                    color: "#6B7C93",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  APERTURE TERMINAL
                </span>
              </div>

              {/* Pair name */}
              <div style={{ fontSize: "20px", fontWeight: 500, color: "#0A2540", marginBottom: "8px" }}>
                {pair.token0.symbol}/{pair.token1.symbol}
              </div>

              {/* Data rows */}
              <div style={{ display: "flex", flexDirection: "column" }}>
                {[
                  { label: "PRICE", value: "$1.0045" },
                  { label: "24H VOLUME", value: formatUsd(pair.volume24h) },
                  { label: "LIQUIDITY", value: formatUsd(pair.liquidityUsd) },
                  { label: "TX COUNT", value: String(pair.txCount24h) },
                ].map((row) => (
                  <div
                    key={row.label}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "12px 0",
                      borderBottom: "1px solid #F1F5F9",
                    }}
                  >
                    <span style={{ fontSize: "14px", fontWeight: 400, color: "#6B7C93" }}>
                      {row.label}
                    </span>
                    <span
                      style={{
                        fontSize: "16px",
                        fontFamily: "'SF Mono', 'Monaco', 'Menlo', monospace",
                        color: "#0A2540",
                      }}
                    >
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>

              {/* Bottom */}
              <div
                style={{
                  marginTop: "20px",
                  fontSize: "13px",
                  fontFamily: "'SF Mono', 'Monaco', 'Menlo', monospace",
                  color: "#635BFF",
                }}
              >
                npm install @aperture/sdk
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 6. STATS                                                     */}
      {/* ============================================================ */}
      <section
        style={{
          background: "#0A2540",
          padding: "96px 0",
          borderTop: "1px solid rgba(99,91,255,0.3)",
        }}
      >
        <div style={{ maxWidth: "1080px", margin: "0 auto", padding: "0 24px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "32px" }}>
            {[
              { value: "845,231", label: "LATEST BLOCK" },
              { value: formatUsd(pair.volume24h), label: "24H VOLUME" },
              { value: "12", label: "ACTIVE PAIRS" },
              { value: "99.9%", label: "UPTIME" },
            ].map((s) => (
              <Reveal key={s.label}>
                <div>
                  <div
                    style={{
                      fontSize: "36px",
                      fontWeight: 300,
                      fontFamily: "'SF Mono', 'Monaco', 'Menlo', monospace",
                      color: "#FFFFFF",
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {s.value}
                  </div>
                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: 400,
                      color: "rgba(255,255,255,0.7)",
                      textTransform: "uppercase",
                      marginTop: "8px",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {s.label}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 7. HOW IT WORKS                                              */}
      {/* ============================================================ */}
      <section style={{ background: "#FFFFFF", padding: "96px 0" }}>
        <div style={{ maxWidth: "1080px", margin: "0 auto", padding: "0 24px" }}>
          <Reveal>
            <div style={{ fontSize: "14px", fontWeight: 400, color: "#6B7C93", textTransform: "uppercase" }}>
              GET STARTED
            </div>
            <h2
              style={{
                fontSize: "40px",
                fontWeight: 300,
                color: "#0A2540",
                letterSpacing: "-0.02em",
                lineHeight: 1.1,
                margin: "16px 0 0 0",
              }}
            >
              Three steps to start scanning.
            </h2>
          </Reveal>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "24px",
              marginTop: "48px",
            }}
          >
            {[
              {
                num: "01",
                title: "Open Explorer",
                desc: "Visit the dashboard to see all pairs on Arc in real time.",
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
            ].map((step, i) => (
              <Reveal key={step.num} delay={i * 80}>
                <div>
                  <div
                    style={{
                      fontSize: "40px",
                      fontWeight: 300,
                      color: "#635BFF",
                      opacity: 0.3,
                      lineHeight: 1,
                    }}
                  >
                    {step.num}
                  </div>
                  <h3
                    style={{
                      fontSize: "20px",
                      fontWeight: 500,
                      color: "#0A2540",
                      margin: "8px 0 0 0",
                    }}
                  >
                    {step.title}
                  </h3>
                  <p
                    style={{
                      fontSize: "16px",
                      fontWeight: 400,
                      color: "#425466",
                      lineHeight: 1.5,
                      margin: "8px 0 0 0",
                    }}
                  >
                    {step.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 8. DEVELOPER                                                 */}
      {/* ============================================================ */}
      <section style={{ background: "#F6F9FC", padding: "120px 0" }}>
        <div
          style={{
            maxWidth: "1080px",
            margin: "0 auto",
            padding: "0 24px",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "64px",
            alignItems: "center",
          }}
        >
          {/* LEFT — terminal */}
          <Reveal>
            <div
              style={{
                background: "#0A2540",
                borderRadius: "8px",
                padding: "28px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
            >
              {/* Top bar */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "20px",
                }}
              >
                <span
                  style={{
                    width: "12px",
                    height: "12px",
                    borderRadius: "50%",
                    background: "#FF5F57",
                    display: "inline-block",
                  }}
                />
                <span
                  style={{
                    width: "12px",
                    height: "12px",
                    borderRadius: "50%",
                    background: "#FFBD2E",
                    display: "inline-block",
                  }}
                />
                <span
                  style={{
                    width: "12px",
                    height: "12px",
                    borderRadius: "50%",
                    background: "#28CA42",
                    display: "inline-block",
                  }}
                />
                <span
                  style={{
                    fontSize: "13px",
                    color: "rgba(255,255,255,0.5)",
                    marginLeft: "12px",
                  }}
                >
                  terminal
                </span>
              </div>

              {/* Code */}
              <div
                style={{
                  fontFamily: "'SF Mono', 'Monaco', 'Menlo', monospace",
                  fontSize: "14px",
                  lineHeight: 1.6,
                }}
              >
                {CODE_LINES.map((line, i) => (
                  <div key={i} style={{ color: line.color || "#FFFFFF" }}>
                    {line.text || "\u00A0"}
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* RIGHT — copy */}
          <Reveal delay={120}>
            <div>
              <div style={{ fontSize: "14px", fontWeight: 400, color: "#6B7C93", textTransform: "uppercase" }}>
                DEVELOPER API
              </div>
              <h2
                style={{
                  fontSize: "40px",
                  fontWeight: 300,
                  color: "#0A2540",
                  letterSpacing: "-0.02em",
                  lineHeight: 1.1,
                  margin: "16px 0 0 0",
                }}
              >
                Build with verified data.
              </h2>
              <p
                style={{
                  fontSize: "17px",
                  fontWeight: 400,
                  color: "#425466",
                  lineHeight: 1.5,
                  margin: "16px 0 0 0",
                }}
              >
                Full programmatic access to every pair, swap, and liquidity pool on Arc Network.
                REST + WebSocket. TypeScript SDK.
              </p>
              <CheckRow
                items={[
                  "REST API for pair/swap data",
                  "WebSocket for real-time updates",
                  "TypeScript SDK with full types",
                  "Rate limit: 1000 req/min",
                ]}
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 9. CTA                                                       */}
      {/* ============================================================ */}
      <section style={{ position: "relative", background: "#0A2540", padding: "120px 0", overflow: "hidden" }}>
        {/* Subtle gradient mesh */}
        <div
          style={{
            position: "absolute",
            top: "-100px",
            right: "-50px",
            width: "400px",
            height: "400px",
            background: "radial-gradient(circle, #FF6BCB 0%, transparent 70%)",
            filter: "blur(120px)",
            opacity: 0.1,
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-100px",
            left: "-50px",
            width: "400px",
            height: "400px",
            background: "radial-gradient(circle, #8B5CF6 0%, transparent 70%)",
            filter: "blur(120px)",
            opacity: 0.1,
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            position: "relative",
            maxWidth: "640px",
            margin: "0 auto",
            padding: "0 24px",
            textAlign: "center",
          }}
        >
          <Reveal>
            <div
              style={{
                fontSize: "14px",
                fontWeight: 400,
                color: "rgba(255,255,255,0.7)",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              GET STARTED
            </div>
            <h2
              style={{
                fontSize: "44px",
                fontWeight: 300,
                color: "#FFFFFF",
                letterSpacing: "-0.02em",
                lineHeight: 1.1,
                margin: "16px 0 0 0",
              }}
            >
              Start scanning Arc Network today.
            </h2>
            <p
              style={{
                fontSize: "18px",
                fontWeight: 400,
                color: "rgba(255,255,255,0.7)",
                lineHeight: 1.5,
                margin: "16px 0 0 0",
              }}
            >
              Index every pair, track every swap, and build with verified on-chain data.
            </p>

            <div
              style={{
                display: "flex",
                gap: "12px",
                justifyContent: "center",
                marginTop: "32px",
              }}
            >
              <a
                href="/explore"
                style={{
                  background: "#635BFF",
                  color: "#FFFFFF",
                  borderRadius: "4px",
                  padding: "14px 24px",
                  fontSize: "16px",
                  fontWeight: 400,
                  textDecoration: "none",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.08)",
                  transition: "background-color 0.2s ease, box-shadow 0.2s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#5247DB")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#635BFF")}
              >
                Explore pairs
              </a>
              <a
                href="https://docs.aperture.xyz"
                style={{
                  background: "transparent",
                  border: "1px solid rgba(255,255,255,0.3)",
                  color: "#FFFFFF",
                  borderRadius: "4px",
                  padding: "14px 24px",
                  fontSize: "16px",
                  fontWeight: 400,
                  textDecoration: "none",
                  transition: "background-color 0.2s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.05)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                Read docs
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 10. FOOTER                                                   */}
      {/* ============================================================ */}
      <footer style={{ background: "#0A2540", padding: "64px 0 32px" }}>
        <div style={{ maxWidth: "1080px", margin: "0 auto", padding: "0 24px" }}>
          {/* 4 columns */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr 1fr 1fr",
              gap: "48px",
            }}
          >
            {/* Col 1 — brand */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                <ApertureLogo color="#FFFFFF" />
                <span style={{ fontSize: "16px", fontWeight: 500, color: "#FFFFFF" }}>Aperture</span>
              </div>
              <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.7)", margin: "0 0 16px 0" }}>
                DEX scanner on Arc Network
              </p>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "4px",
                  padding: "4px 10px",
                  fontSize: "12px",
                  color: "rgba(255,255,255,0.7)",
                }}
              >
                <span
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    background: "#00D66F",
                    display: "inline-block",
                  }}
                />
                ARC TESTNET
              </span>
            </div>

            {/* Cols 2-4 — link groups */}
            {footerCols.map((col) => (
              <div key={col.title}>
                <div
                  style={{
                    fontSize: "12px",
                    fontWeight: 400,
                    color: "rgba(255,255,255,0.5)",
                    textTransform: "uppercase",
                    marginBottom: "16px",
                    letterSpacing: "0.05em",
                  }}
                >
                  {col.title}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {col.links.map((l) => (
                    <a
                      key={l.label}
                      href={l.href}
                      className="footer-link"
                      style={{
                        fontSize: "14px",
                        fontWeight: 400,
                        color: "rgba(255,255,255,0.7)",
                        textDecoration: "none",
                      }}
                    >
                      {l.label}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Bottom bar */}
          <div
            style={{
              borderTop: "1px solid rgba(255,255,255,0.1)",
              marginTop: "48px",
              paddingTop: "24px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "12px",
            }}
          >
            <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)" }}>© 2026 Aperture</span>
            <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)" }}>
              Built on Arc™ — Arc is a trademark of Circle Internet Group, Inc.
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
