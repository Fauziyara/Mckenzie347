"use client";

import { useState } from "react";
import { Reveal } from "@/components/reveal";
import { mockPairs } from "@/lib/mock-data";
import { formatUsd } from "@/lib/format";

// ─── Icon helpers (inline SVGs to avoid extra imports) ───────────────────────

function LogoMark({ size = 24, color = "#ec5c33" }: { size?: number; color?: string }) {
  // Wavy lines "aperture" icon
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M3 7c2.5 0 2.5 10 5 10s2.5-10 5-10 2.5 10 5 10"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3 13c2.5 0 2.5 6 5 6"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.55"
      />
    </svg>
  );
}

function SearchIcon({ size = 20, color = "#0f0807" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="7" stroke={color} strokeWidth="1.8" />
      <path d="M21 21l-4.3-4.3" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function MenuIcon({ color = "#0f0807" }: { color?: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3 6h18M3 12h18M3 18h18" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function CopyIcon({ color = "#5d5958" }: { color?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="9" y="9" width="11" height="11" rx="2" stroke={color} strokeWidth="1.6" />
      <path d="M5 15V5a2 2 0 0 1 2-2h10" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function PlusIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      style={{ transition: "transform 200ms ease" }}
    >
      <path
        d="M12 5v14M5 12h14"
        stroke="#fffcf7"
        strokeWidth="1.8"
        strokeLinecap="round"
        style={{ transform: open ? "rotate(45deg)" : "none", transformOrigin: "center", transition: "transform 200ms ease" }}
      />
    </svg>
  );
}

// ─── Decorative crypto circle (placeholder logos) ────────────────────────────

function CryptoCircle({ bg, label }: { bg: string; label: string }) {
  return (
    <div
      style={{
        width: 40,
        height: 40,
        borderRadius: "999px",
        background: bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#ffffff",
        fontFamily: "'Inter', sans-serif",
        fontSize: 13,
        fontWeight: 700,
        flexShrink: 0,
      }}
    >
      {label}
    </div>
  );
}

function Pixel({ size = 8, opacity = 0.2, color = "#0f0807" }: { size?: number; opacity?: number; color?: string }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: 4,
        background: color,
        opacity,
        flexShrink: 0,
      }}
    />
  );
}

// Decorative column: cascade of pixels + crypto circles
function DecorColumn({ variant }: { variant: "left" | "right" }) {
  const leftLogos = [
    { bg: "#627EEA", label: "ETH" },
    { bg: "#2775CA", label: "USDC" },
    { bg: "#8247E5", label: "ARB" },
  ];
  const rightLogos = [
    { bg: "#F7931A", label: "BTC" },
    { bg: "#9945FF", label: "SOL" },
    { bg: "#26A17B", label: "USDT" },
  ];
  const logos = variant === "left" ? leftLogos : rightLogos;

  // deterministic pseudo-random-ish offsets for visual interest
  const cells: Array<{ kind: "px"; o: number } | { kind: "logo"; idx: number }> = [
    { kind: "px", o: 0.3 },
    { kind: "px", o: 0.12 },
    { kind: "logo", idx: 0 },
    { kind: "px", o: 0.2 },
    { kind: "px", o: 0.1 },
    { kind: "px", o: 0.25 },
    { kind: "logo", idx: 1 },
    { kind: "px", o: 0.15 },
    { kind: "px", o: 0.3 },
    { kind: "px", o: 0.18 },
    { kind: "logo", idx: 2 },
    { kind: "px", o: 0.22 },
    { kind: "px", o: 0.1 },
  ];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: variant === "left" ? "flex-start" : "flex-end",
        gap: 10,
        width: 80,
        opacity: 0.9,
      }}
    >
      {cells.map((c, i) =>
        c.kind === "px" ? (
          <Pixel key={i} opacity={c.o} />
        ) : (
          <CryptoCircle key={i} bg={logos[c.idx].bg} label={logos[c.idx].label} />
        )
      )}
    </div>
  );
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const pair = mockPairs[0];
const pairSymbol = `${pair.token0.symbol}/${pair.token1.symbol}`;

const securityCards = [
  { title: "Cryptographic Routing", desc: "Securely moving assets through validated nodes." },
  { title: "Sub-second Finality", desc: "Instant transaction settlement across global rails." },
  { title: "Omni-chain Bridging", desc: "Syncing assets perfectly across protocols." },
  { title: "Algorithmic Auditing", desc: "Real-time verification of every supply change." },
  { title: "Compliance Automations", desc: "Built-in checks for regulatory standards." },
  { title: "Collaborative Custody", desc: "Multi-sig infrastructure for institutional teams." },
];

const communityCards = [
  { name: "Twitter", handle: "@aperture_dex", desc: "Latest updates, pair alerts, and platform announcements" },
  { name: "Discord", handle: "discord.gg/aperture", desc: "Community support, discussions, and direct assistance" },
  { name: "Telegram", handle: "t.me/aperture_dex", desc: "Real-time updates, support channels, and community chat" },
  { name: "GitHub", handle: "github.com/aperture", desc: "Open-source tools, SDKs, and developer resources" },
];

const testimonials = [
  {
    quote:
      "Aperture provided the real-time analytics and deterministic finality we were searching for. Their cross-chain bridging transformed our asset efficiency.",
    name: "Michael Chen",
    role: "CTO, Sentinel Capital",
  },
  {
    quote:
      "Integrating Aperture's protocol redefined our approach to decentralized finance. The seamless cross-chain operations elevated our platform.",
    name: "Aisha Malik",
    role: "Lead Blockchain Engineer",
  },
  {
    quote:
      "Aperture's deterministic finality and liquidity solutions empowered us to optimize asset allocation across pairs, unlocking new opportunities.",
    name: "Louis Ramirez",
    role: "Head of Product Development",
  },
];

const faqs = [
  {
    q: "Is Aperture backed by real on-chain data?",
    a: "Yes. Aperture indexes real-time data directly from Arc Network's public ledger. Every pair, swap, and liquidity change is verified on-chain.",
  },
  {
    q: "How does Aperture verify total volume?",
    a: "Aperture uses cryptographic proofs embedded in Arc's protocol to ensure that volume data matches actual on-chain transactions. No estimates, no approximations.",
  },
  {
    q: "How does Aperture handle network congestion?",
    a: "Aperture dynamically adjusts indexing throughput using adaptive parameters. When demand spikes, the system prioritizes critical pair data to maintain sub-second latency.",
  },
  {
    q: "What defines Aperture's security architecture?",
    a: "Aperture's security is built on a Zero-Trust framework, combining cryptographic verification, decentralized consensus, and institutional-grade infrastructure.",
  },
  {
    q: "Can I audit the Aperture protocol?",
    a: "Yes. Aperture is fully transparent. All indexing logic, pair calculations, and data pipelines are open to independent audit.",
  },
  {
    q: "How does Aperture bridge legacy finance?",
    a: "Aperture connects traditional financial systems with decentralized protocols through secure interoperability layers on Arc Network.",
  },
];

const trustedLogos = ["Arc Network", "Circle", "USDC", "WETH", "SOL"];

const statsBar = [
  { num: "12K+", label: "Pairs Tracked" },
  { num: "0.3s", label: "Latency" },
  { num: "99.9%", label: "Uptime" },
  { num: "24/7", label: "Monitoring" },
];

const securityPoints = [
  { num: "100%", label: "Cold Storage" },
  { num: "24", label: "HSM Nodes" },
  { num: "5/7", label: "Multi-Sig" },
  { num: "12", label: "Jurisdictions" },
];

const liveDataRows = [
  { label: "Block Height", value: "845,231" },
  { label: "ETH/USD", value: "$3,247.82" },
  { label: "Hash Rate", value: "854.2 TH/s" },
];

const footerGroups = [
  { header: "Explore", links: ["Explore", "Pairs", "Swap", "Portfolio"] },
  { header: "Resources", links: ["Docs", "Whitepaper", "API", "Status"] },
  { header: "Security", links: ["Audits", "Bug Bounty", "Privacy", "Terms"] },
  { header: "Community", links: ["X (Twitter)", "Discord", "Telegram", "GitHub"] },
];

// ─── Inline CSS keyframes (injected once) ───────────────────────────────────

function GlobalStyles() {
  return (
    <style>{`
      @keyframes aperturePulse {
        0%, 100% { opacity: 1; transform: scale(1); }
        50% { opacity: 0.5; transform: scale(0.85); }
      }
      .aperture-dot { animation: aperturePulse 1.6s ease-in-out infinite; }
      @keyframes apertureFade {
        from { opacity: 0; transform: translateY(-40px); }
        to { opacity: 1; transform: translateY(0); }
      }
    `}</style>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <main
      style={{
        background: "#0f0807",
        color: "#fffcf7",
        fontFamily: "'Inter', sans-serif",
        fontSize: 16,
        lineHeight: "160%",
        margin: 0,
        padding: 0,
        minHeight: "100vh",
      }}
    >
      <GlobalStyles />

      {/* ═══ 1. HEADER ═══ */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          width: "100%",
          background: "#fffcf7",
          borderBottom: "1px solid rgba(15,8,7,0.06)",
        }}
      >
        <div
          style={{
            position: "relative",
            maxWidth: 1070,
            margin: "0 auto",
            padding: "10px 30px",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 20,
          }}
        >
          {/* LEFT nav */}
          <nav
            style={{
              display: "flex",
              gap: 20,
              alignItems: "center",
              fontFamily: "'Inter', sans-serif",
            }}
          >
            {["Home", "About", "Security", "Contact"].map((item) => (
              <a
                key={item}
                href="#"
                style={{
                  fontSize: 13,
                  color: "#0f0807",
                  textDecoration: "none",
                  position: "relative",
                  paddingBottom: item === "Home" ? 4 : 0,
                }}
              >
                {item}
                {item === "Home" && (
                  <span
                    style={{
                      position: "absolute",
                      left: 0,
                      bottom: 0,
                      width: "100%",
                      height: 2,
                      background: "#ec5c33",
                      borderRadius: 2,
                    }}
                  />
                )}
              </a>
            ))}
          </nav>

          {/* CENTER logo */}
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <LogoMark size={24} />
            <span
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 700,
                fontSize: 18,
                color: "#0f0807",
                letterSpacing: "-0.02em",
              }}
            >
              Aperture
            </span>
          </div>

          {/* RIGHT */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <a
              href="#"
              aria-label="Search"
              style={{ display: "flex", alignItems: "center", color: "#0f0807", textDecoration: "none" }}
            >
              <SearchIcon size={24} />
            </a>
            <a
              href="#"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "12px 24px",
                borderRadius: 999,
                border: "1px solid rgba(15,8,7,0.12)",
                fontSize: 13,
                color: "#0f0807",
                textDecoration: "none",
                background: "transparent",
                whiteSpace: "nowrap",
              }}
            >
              Explore Pairs
            </a>
            <button
              type="button"
              aria-label="Menu"
              onClick={() => setMobileOpen((v) => !v)}
              style={{
                display: "none",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                padding: 4,
              }}
              className="aperture-mobile-menu"
            >
              <MenuIcon />
            </button>
          </div>
        </div>

        {/* responsive menu — show on mobile via media query */}
        <style>{`
          @media (max-width: 768px) {
            .aperture-nav-links { display: none !important; }
            .aperture-mobile-menu { display: inline-flex !important; }
            .aperture-explore-btn { display: none !important; }
            .aperture-search-icon { display: none !important; }
          }
        `}</style>
      </header>

      {/* ═══ 2. HERO ═══ */}
      <section
        style={{
          padding: "32px 24px",
          background: "#0f0807",
        }}
      >
        <div
          style={{
            maxWidth: 1070,
            margin: "0 auto",
            background: "#f8ebe5",
            border: "1px dashed rgba(15,8,7,0.12)",
            borderRadius: 250,
            minHeight: "85vh",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "48px 56px",
            gap: 32,
            boxSizing: "border-box",
          }}
        >
          {/* LEFT decorative column */}
          <div className="aperture-decor-left" style={{ display: "flex" }}>
            <DecorColumn variant="left" />
          </div>

          {/* CENTER main content */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              gap: 56,
              maxWidth: 560,
              margin: "0 auto",
            }}
          >
            {/* Badge pill */}
            <div
              style={{
                background: "#fffcf7",
                border: "1px solid rgba(15,8,7,0.12)",
                borderRadius: 999,
                padding: "8px 16px",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                fontSize: 13,
                color: "#0f0807",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              <span
                className="aperture-dot"
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "999px",
                  background: "#ec5c33",
                  display: "inline-block",
                }}
              />
              Block 845,231 — 12 Active Pairs
            </div>

            {/* Headline */}
            <h1
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 700,
                fontSize: 36,
                color: "#0f0807",
                letterSpacing: "-0.02em",
                lineHeight: "120%",
                margin: 0,
                textAlign: "center",
              }}
            >
              The Foundation Of
              <br />
              DEX Intelligence
            </h1>

            {/* Subtitle */}
            <p
              style={{
                fontSize: 16,
                color: "rgba(15,8,7,0.6)",
                lineHeight: "160%",
                maxWidth: 500,
                margin: 0,
                textAlign: "center",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              A transparent, decentralized DEX scanner built on Arc Network — designed to serve as the
              immutable foundation for real-time pair analytics and on-chain swaps.
            </p>

            {/* Buttons */}
            <div style={{ display: "flex", gap: 10 }}>
              <a
                href="#"
                style={{
                  background: "#ec5c33",
                  color: "#fffcf7",
                  borderRadius: 999,
                  padding: "12px 24px",
                  fontSize: 13,
                  textDecoration: "none",
                  fontWeight: 600,
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                Start Exploring
              </a>
              <a
                href="#"
                style={{
                  background: "transparent",
                  border: "1px solid rgba(15,8,7,0.12)",
                  color: "#0f0807",
                  borderRadius: 999,
                  padding: "12px 24px",
                  fontSize: 13,
                  textDecoration: "none",
                  fontWeight: 600,
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                Read Docs
              </a>
            </div>
          </div>

          {/* RIGHT decorative column */}
          <div className="aperture-decor-right" style={{ display: "flex" }}>
            <DecorColumn variant="right" />
          </div>
        </div>

        <style>{`
          @media (max-width: 768px) {
            .aperture-decor-left, .aperture-decor-right { display: none !important; }
          }
        `}</style>
      </section>

      {/* ═══ 3. TRUSTED BY ═══ */}
      <section
        style={{
          background: "#0f0807",
          padding: "40px 24px",
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontSize: 13,
            color: "#5d5958",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            margin: "0 0 24px 0",
            fontFamily: "'Inter', sans-serif",
          }}
        >
          Trusted by the global DEX ecosystem
        </p>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 40,
            flexWrap: "wrap",
          }}
        >
          {trustedLogos.map((l) => (
            <span
              key={l}
              style={{
                color: "#5d5958",
                fontSize: 14,
                fontFamily: "'Inter', sans-serif",
                fontWeight: 500,
              }}
            >
              {l}
            </span>
          ))}
        </div>
      </section>

      {/* ═══ 4. FEATURE TABS ═══ */}
      <section style={{ background: "#0f0807" }}>
        <div
          style={{
            maxWidth: 1070,
            margin: "0 auto",
            padding: "80px 24px",
            display: "flex",
            flexDirection: "row",
            gap: 40,
            alignItems: "center",
          }}
        >
          {/* LEFT */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16 }}>
            <span
              style={{
                fontSize: 13,
                color: "#ec5c33",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              The Foundation
            </span>
            <h2
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 28,
                color: "#ffffff",
                fontWeight: 700,
                letterSpacing: "-0.02em",
                lineHeight: "120%",
                margin: 0,
              }}
            >
              Of Digital Sovereignty
            </h2>
            <p
              style={{
                fontSize: 16,
                color: "#5d5958",
                lineHeight: "160%",
                margin: 0,
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Aperture indexes every liquidity pool, swap, and price movement on Arc Network. No estimates —
              just deterministic, mathematically verified data.
            </p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {["Immutable Ledger", "Math-Based Proof", "Global Consensus"].map((t) => (
                <span
                  key={t}
                  style={{
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 999,
                    padding: "8px 16px",
                    fontSize: 13,
                    color: "#fffcf7",
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
            <a
              href="#"
              style={{
                color: "#ec5c33",
                fontSize: 13,
                textDecoration: "none",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Explore Security →
            </a>
          </div>

          {/* RIGHT — dark card */}
          <div style={{ flex: 1 }}>
            <Reveal delay={100}>
              <div
                style={{
                  background: "#363030",
                  borderRadius: 10,
                  padding: 24,
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span style={{ fontSize: 13, color: "#5d5958", fontFamily: "'Inter', sans-serif" }}>
                    Live Preview
                  </span>
                  <span style={{ fontSize: 13, color: "#fffcf7", fontFamily: "'Inter', sans-serif" }}>
                    {pairSymbol}
                  </span>
                </div>
                <div
                  style={{
                    fontSize: 28,
                    color: "#fffcf7",
                    fontWeight: 700,
                    fontFamily: "'Space Grotesk', sans-serif",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {formatUsd(pair.volume24h)}
                </div>
                <span style={{ fontSize: 13, color: "#5d5958", fontFamily: "'Inter', sans-serif" }}>
                  24H Volume
                </span>
                <div style={{ height: 1, background: "rgba(255,255,255,0.08)", margin: "4px 0" }} />
                {[
                  { label: "Liquidity", value: formatUsd(pair.liquidityUsd) },
                  { label: "Fee Tier", value: "0.3%" },
                  { label: "Transactions 24H", value: String(pair.txCount24h) },
                ].map((row) => (
                  <div
                    key={row.label}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: 13,
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    <span style={{ color: "#5d5958" }}>{row.label}</span>
                    <span style={{ color: "#fffcf7" }}>{row.value}</span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══ 5. STATS BAR ═══ */}
      <section
        style={{
          background: "#0f0807",
          borderTop: "1px solid rgba(255,255,255,0.08)",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div
          style={{
            maxWidth: 1070,
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-around",
            flexWrap: "wrap",
          }}
        >
          {statsBar.map((s) => (
            <div
              key={s.label}
              style={{
                padding: "40px 24px",
                textAlign: "center",
                flex: 1,
                minWidth: 160,
              }}
            >
              <div
                style={{
                  fontSize: 28,
                  color: "#ec5c33",
                  fontWeight: 700,
                  fontFamily: "'Space Grotesk', sans-serif",
                  letterSpacing: "-0.02em",
                }}
              >
                {s.num}
              </div>
              <div style={{ fontSize: 13, color: "#5d5958", fontFamily: "'Inter', sans-serif" }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ 6. SECURITY GRID ═══ */}
      <section style={{ background: "#0f0807" }}>
        <div
          style={{
            maxWidth: 1070,
            margin: "0 auto",
            padding: "80px 24px",
          }}
        >
          <Reveal delay={100}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 20,
              }}
              className="aperture-grid"
            >
              {securityCards.map((c) => (
                <div
                  key={c.title}
                  style={{
                    background: "#363030",
                    borderRadius: 10,
                    padding: 24,
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                  }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: "999px",
                      background: "rgba(236,92,51,0.1)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <LogoMark size={20} color="#ec5c33" />
                  </div>
                  <div
                    style={{
                      fontSize: 16,
                      color: "#fffcf7",
                      fontWeight: 700,
                      fontFamily: "'Space Grotesk', sans-serif",
                    }}
                  >
                    {c.title}
                  </div>
                  <div style={{ fontSize: 13, color: "#5d5958", lineHeight: "160%", fontFamily: "'Inter', sans-serif" }}>
                    {c.desc}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
          <style>{`
            @media (max-width: 768px) {
              .aperture-grid { grid-template-columns: 1fr !important; }
            }
          `}</style>
        </div>
      </section>

      {/* ═══ 7. SECURITY POINTS ═══ */}
      <section
        style={{
          background: "#0f0807",
          borderTop: "1px solid rgba(255,255,255,0.08)",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div
          style={{
            maxWidth: 1070,
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-around",
            flexWrap: "wrap",
            padding: "32px 24px",
          }}
        >
          {securityPoints.map((p) => (
            <div
              key={p.label}
              style={{
                textAlign: "center",
                padding: "0 12px",
                flex: 1,
                minWidth: 140,
              }}
            >
              <div
                style={{
                  fontSize: 28,
                  color: "#fffcf7",
                  fontWeight: 700,
                  fontFamily: "'Space Grotesk', sans-serif",
                  letterSpacing: "-0.02em",
                }}
              >
                {p.num}
              </div>
              <div
                style={{
                  fontSize: 10,
                  color: "#5d5958",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                {p.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ 8. LIVE DATA SECTION ═══ */}
      <section style={{ background: "#0f0807" }}>
        <div
          style={{
            maxWidth: 1070,
            margin: "0 auto",
            padding: "80px 24px",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 24,
          }}
          className="aperture-live-grid"
        >
          {/* LEFT — Developer API */}
          <Reveal delay={100}>
            <div
              style={{
                background: "#363030",
                borderRadius: 10,
                padding: 24,
                display: "flex",
                flexDirection: "column",
                gap: 12,
                height: "100%",
                boxSizing: "border-box",
              }}
            >
              <span
                style={{
                  fontSize: 13,
                  color: "#5d5958",
                  textTransform: "uppercase",
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                Developer API
              </span>
              <h3
                style={{
                  fontSize: 28,
                  color: "#fffcf7",
                  fontWeight: 700,
                  fontFamily: "'Space Grotesk', sans-serif",
                  letterSpacing: "-0.02em",
                  margin: 0,
                  lineHeight: "120%",
                }}
              >
                REST &amp; WebSocket APIs
              </h3>
              <p style={{ fontSize: 13, color: "#5d5958", lineHeight: "160%", margin: 0, fontFamily: "'Inter', sans-serif" }}>
                Comprehensive SDKs for real-time pair data, swap history, and liquidity tracking.
              </p>
              <div
                style={{
                  background: "#0f0807",
                  borderRadius: 10,
                  padding: 16,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  fontFamily: "monospace",
                  fontSize: 13,
                  color: "#ec5c33",
                }}
              >
                <span>npm install @aperture/sdk</span>
                <button
                  type="button"
                  aria-label="Copy"
                  style={{
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    padding: 4,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <CopyIcon />
                </button>
              </div>
            </div>
          </Reveal>

          {/* RIGHT — Live Data */}
          <Reveal delay={200}>
            <div
              style={{
                background: "#363030",
                borderRadius: 10,
                padding: 24,
                display: "flex",
                flexDirection: "column",
                gap: 8,
                height: "100%",
                boxSizing: "border-box",
              }}
            >
              <span
                style={{
                  fontSize: 13,
                  color: "#5d5958",
                  textTransform: "uppercase",
                  fontFamily: "'Inter', sans-serif",
                  marginBottom: 8,
                }}
              >
                Live Data
              </span>
              {liveDataRows.map((r, i) => (
                <div
                  key={r.label}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "12px 0",
                    borderBottom:
                      i === liveDataRows.length - 1 ? "none" : "1px solid rgba(255,255,255,0.08)",
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  <span style={{ fontSize: 13, color: "#5d5958" }}>{r.label}</span>
                  <span
                    style={{
                      fontSize: 16,
                      color: "#fffcf7",
                      fontFamily: "monospace",
                      fontWeight: 500,
                    }}
                  >
                    {r.value}
                  </span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
        <style>{`
          @media (max-width: 768px) {
            .aperture-live-grid { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </section>

      {/* ═══ 9. COMMUNITY ═══ */}
      <section style={{ background: "#0f0807" }}>
        <div
          style={{
            maxWidth: 1070,
            margin: "0 auto",
            padding: "80px 24px",
            textAlign: "center",
          }}
        >
          <Reveal delay={100}>
            <h2
              style={{
                fontSize: 28,
                color: "#fffcf7",
                fontWeight: 700,
                fontFamily: "'Space Grotesk', sans-serif",
                letterSpacing: "-0.02em",
                lineHeight: "120%",
                margin: "0 0 12px 0",
              }}
            >
              Built by the community
            </h2>
            <p
              style={{
                fontSize: 16,
                color: "#5d5958",
                lineHeight: "160%",
                margin: "0 auto 40px auto",
                maxWidth: 600,
                fontFamily: "'Inter', sans-serif",
              }}
            >
              We follow institutional-grade security protocols and math-based verification.
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: 16,
                textAlign: "left",
              }}
              className="aperture-community-grid"
            >
              {communityCards.map((c) => (
                <div
                  key={c.name}
                  style={{
                    background: "#363030",
                    borderRadius: 10,
                    padding: 20,
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                  }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: "999px",
                      background: "rgba(236,92,51,0.1)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <LogoMark size={20} color="#ec5c33" />
                  </div>
                  <div
                    style={{
                      fontSize: 16,
                      color: "#fffcf7",
                      fontWeight: 700,
                      fontFamily: "'Space Grotesk', sans-serif",
                    }}
                  >
                    {c.name}
                  </div>
                  <div style={{ fontSize: 13, color: "#5d5958", fontFamily: "monospace" }}>{c.handle}</div>
                  <div style={{ fontSize: 13, color: "#5d5958", lineHeight: "160%", fontFamily: "'Inter', sans-serif" }}>
                    {c.desc}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
        <style>{`
          @media (max-width: 768px) {
            .aperture-community-grid { grid-template-columns: 1fr 1fr !important; }
          }
          @media (max-width: 480px) {
            .aperture-community-grid { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </section>

      {/* ═══ 10. TESTIMONIALS ═══ */}
      <section style={{ background: "#0f0807" }}>
        <div
          style={{
            maxWidth: 1070,
            margin: "0 auto",
            padding: "80px 24px",
            textAlign: "center",
          }}
        >
          <Reveal delay={100}>
            <p
              style={{
                fontSize: 13,
                color: "#ec5c33",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                margin: "0 0 40px 0",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Validated By The Sovereign Network
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 20,
                textAlign: "left",
              }}
              className="aperture-testimonials-grid"
            >
              {testimonials.map((t) => (
                <div
                  key={t.name}
                  style={{
                    background: "#363030",
                    borderRadius: 10,
                    padding: 24,
                    display: "flex",
                    flexDirection: "column",
                    gap: 16,
                  }}
                >
                  <div
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontSize: 32,
                      color: "#ec5c33",
                      lineHeight: 1,
                    }}
                  >
                    &ldquo;
                  </div>
                  <p
                    style={{
                      fontSize: 13,
                      color: "#fffcf7",
                      lineHeight: "160%",
                      fontStyle: "italic",
                      margin: 0,
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    {t.quote}
                  </p>
                  <div style={{ height: 1, background: "rgba(255,255,255,0.08)" }} />
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    <span
                      style={{
                        fontSize: 16,
                        color: "#fffcf7",
                        fontWeight: 700,
                        fontFamily: "'Space Grotesk', sans-serif",
                      }}
                    >
                      {t.name}
                    </span>
                    <span style={{ fontSize: 13, color: "#5d5958", fontFamily: "'Inter', sans-serif" }}>
                      {t.role}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 32 }}>
              <a
                href="#"
                style={{
                  fontSize: 13,
                  color: "#ec5c33",
                  textDecoration: "none",
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                See More →
              </a>
            </div>
          </Reveal>
        </div>
        <style>{`
          @media (max-width: 768px) {
            .aperture-testimonials-grid { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </section>

      {/* ═══ 11. FAQ ═══ */}
      <section style={{ background: "#0f0807" }}>
        <div
          style={{
            maxWidth: 1070,
            margin: "0 auto",
            padding: "80px 24px",
          }}
        >
          <Reveal delay={100}>
            <h2
              style={{
                fontSize: 28,
                color: "#fffcf7",
                fontWeight: 700,
                fontFamily: "'Space Grotesk', sans-serif",
                letterSpacing: "-0.02em",
                lineHeight: "120%",
                textAlign: "center",
                margin: "0 0 40px 0",
              }}
            >
              Decoding The Future Of DEX Trading
            </h2>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                maxWidth: 800,
                margin: "0 auto",
              }}
            >
              {faqs.map((f, i) => {
                const open = openFaq === i;
                return (
                  <div
                    key={f.q}
                    style={{
                      borderBottom: "1px solid rgba(255,255,255,0.08)",
                      borderTop: i === 0 ? "1px solid rgba(255,255,255,0.08)" : "none",
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaq(open ? null : i)}
                      style={{
                        width: "100%",
                        background: "transparent",
                        border: "none",
                        cursor: "pointer",
                        padding: "20px 0",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 16,
                        textAlign: "left",
                        color: "inherit",
                      }}
                    >
                      <span
                        style={{
                          fontSize: 16,
                          color: "#fffcf7",
                          fontFamily: "'Inter', sans-serif",
                          fontWeight: 500,
                        }}
                      >
                        {f.q}
                      </span>
                      <PlusIcon open={open} />
                    </button>
                    <div
                      style={{
                        maxHeight: open ? 300 : 0,
                        overflow: "hidden",
                        transition: "max-height 300ms ease, padding 300ms ease",
                        padding: open ? "0 0 20px 0" : "0",
                      }}
                    >
                      <p
                        style={{
                          fontSize: 13,
                          color: "#5d5958",
                          lineHeight: "160%",
                          margin: 0,
                          fontFamily: "'Inter', sans-serif",
                        }}
                      >
                        {f.a}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ 12. FINAL CTA ═══ */}
      <section style={{ background: "#0f0807" }}>
        <div
          style={{
            maxWidth: 1070,
            margin: "0 auto",
            padding: "100px 24px",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 24,
          }}
        >
          <Reveal delay={100}>
            <h2
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 700,
                fontSize: 36,
                color: "#fffcf7",
                letterSpacing: "-0.02em",
                lineHeight: "120%",
                margin: 0,
              }}
            >
              Start Your
              <br />
              <span style={{ color: "#ec5c33" }}>Aperture Integration</span>
            </h2>
            <p
              style={{
                fontSize: 16,
                color: "#5d5958",
                lineHeight: "160%",
                maxWidth: 600,
                margin: "0 auto",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Our protocol provides the deterministic finality and institutional-grade security required to
              navigate DEX pairs with confidence.
            </p>
            <a
              href="#"
              style={{
                display: "inline-block",
                background: "#ec5c33",
                color: "#fffcf7",
                borderRadius: 999,
                padding: "16px 32px",
                fontSize: 16,
                fontWeight: 700,
                textDecoration: "none",
                fontFamily: "'Inter', sans-serif",
                marginTop: 8,
              }}
            >
              Get Access
            </a>
          </Reveal>
        </div>
      </section>

      {/* ═══ 13. FOOTER ═══ */}
      <footer
        style={{
          background: "#0f0807",
          borderTop: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div
          style={{
            maxWidth: 1070,
            margin: "0 auto",
            padding: "60px 24px 40px",
            display: "flex",
            justifyContent: "space-between",
            gap: 40,
            flexWrap: "wrap",
          }}
          className="aperture-footer-row"
        >
          {/* LEFT */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 300 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <LogoMark size={24} />
              <span
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 700,
                  fontSize: 18,
                  color: "#fffcf7",
                  letterSpacing: "-0.02em",
                }}
              >
                Aperture
              </span>
            </div>
            <p style={{ fontSize: 13, color: "#5d5958", lineHeight: "160%", margin: 0, fontFamily: "'Inter', sans-serif" }}>
              Architecting DEX intelligence through institutional-grade infrastructure.
            </p>
          </div>

          {/* RIGHT — link groups */}
          <div
            style={{
              display: "flex",
              gap: 40,
              flexWrap: "wrap",
            }}
          >
            {footerGroups.map((g) => (
              <div key={g.header} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <span
                  style={{
                    fontSize: 13,
                    color: "#fffcf7",
                    fontWeight: 700,
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  {g.header}
                </span>
                {g.links.map((l) => (
                  <a
                    key={l}
                    href="#"
                    style={{
                      fontSize: 13,
                      color: "#5d5958",
                      textDecoration: "none",
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    {l}
                  </a>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.08)",
            maxWidth: 1070,
            margin: "0 auto",
            padding: "20px 24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 12,
          }}
          className="aperture-footer-bottom"
        >
          <span
            style={{
              fontSize: 10,
              color: "#5d5958",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              fontFamily: "'Inter', sans-serif",
            }}
          >
            © 2026 APERTURE // ALL RIGHTS RESERVED
          </span>
          <span
            style={{
              fontSize: 10,
              color: "#5d5958",
              fontFamily: "'Inter', sans-serif",
            }}
          >
            Built on Arc™ — Arc is a trademark of Circle Internet Group, Inc.
          </span>
        </div>

        <style>{`
          @media (max-width: 768px) {
            .aperture-footer-row { flex-direction: column !important; }
            .aperture-footer-bottom { flex-direction: column !important; text-align: center; }
          }
        `}</style>
      </footer>
    </main>
  );
}
