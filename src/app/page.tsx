"use client";

import React, { useState, useEffect, useMemo, type CSSProperties } from "react";
import { Reveal } from "@/components/reveal";
import { mockPairs } from "@/lib/mock-data";
import { formatUsd } from "@/lib/format";

/* ============================================================ */
/*  Global keyframes injected once                              */
/* ============================================================ */

const KEYFRAMES = `
@keyframes burstBreathe {
  0%, 100% { transform: scale(1); opacity: 0.85; }
  50% { transform: scale(1.03); opacity: 1; }
}
@keyframes dotPulse {
  0%, 100% { opacity: 0.55; }
  50%      { opacity: 1; }
}
@keyframes dotPulse {
  0%, 100% { opacity: 0.55; }
  50%      { opacity: 1; }
}
@keyframes floatY {
  0%, 100% { transform: translateY(0); }
  50%      { transform: translateY(-8px); }
}
`;

/* ============================================================ */
/*  Aperture logo                                               */
/* ============================================================ */

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

/* ============================================================ */
/*  Radial burst visualization                                  */
/* ============================================================ */

type BurstLine = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color: string;
  length: number;
  delay: number;
};

function useBurstLines(): BurstLine[] {
  return useMemo(() => {
    const lines: BurstLine[] = [];
    const cx = 720; // center x (1440px wide svg)
    const cy = 500; // bottom center (500px tall svg)
    const colors = [
      "#FF8A5C",
      "#FF7A45",
      "#E94B8A",
      "#D63D8A",
      "#9B4DE0",
      "#7A3FCB",
      "#6B3FCC",
    ];

    for (let i = 0; i < 350; i++) {
      // Angle in upper hemisphere: 18° to 162° (math convention, y up)
      const angle = Math.PI * (0.1 + Math.random() * 0.8);
      const length = 80 + Math.random() * 370;
      const x2 = cx + Math.cos(angle) * length;
      const y2 = cy - Math.sin(angle) * length; // SVG y is downward

      const t = (length - 80) / 370;
      const colorIdx = Math.floor(t * (colors.length - 1));
      const color = colors[colorIdx];

      lines.push({
        x1: cx,
        y1: cy,
        x2,
        y2,
        color,
        length,
        delay: Math.random() * 3,
      });
    }
    return lines;
  }, []);
}

function RadialBurst() {
  const lines = useBurstLines();
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.width / 2;
    const cy = rect.height;
    const dx = (e.clientX - rect.left - cx) / cx;
    const dy = (e.clientY - rect.top - cy) / cy;
    setMouse({ x: dx * 30, y: dy * 15 });
  };

  const handleMouseLeave = () => setMouse({ x: 0, y: 0 });

  const burstGroupStyle: CSSProperties = {
    transformOrigin: "720px 500px",
    transform: `translate(${mouse.x}px, ${mouse.y}px)`,
    transition: "transform 0.15s ease-out",
    animation: "burstBreathe 4s ease-in-out infinite",
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        position: "relative",
        width: "100%",
        height: 500,
        overflow: "hidden",
        background:
          "radial-gradient(ellipse 80% 100% at 50% 100%, #F0DFF0 0%, #F5F2F8 60%, #F5F2F8 100%)",
      }}
    >
      <svg
        viewBox="0 0 1440 500"
        width="100%"
        height="500"
        preserveAspectRatio="xMidYMax slice"
        style={{ display: "block" }}
      >
        <defs>
          <radialGradient id="originGlow" cx="50%" cy="100%" r="35%">
            <stop offset="0%" stopColor="#FF8A5C" stopOpacity="0.55" />
            <stop offset="35%" stopColor="#E94B8A" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#9B4DE0" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="originCore" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFB088" stopOpacity="0.9" />
            <stop offset="60%" stopColor="#FF8A5C" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#FF8A5C" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Origin glow */}
        <rect x="0" y="0" width="1440" height="500" fill="url(#originGlow)" />

        {/* Rotating burst group */}
        <g style={burstGroupStyle}>
          {lines.map((l, i) => (
            <g key={i}>
              <line
                x1={l.x1}
                y1={l.y1}
                x2={l.x2}
                y2={l.y2}
                stroke={l.color}
                strokeWidth={1}
                strokeOpacity={0.5}
              />
              <circle
                cx={l.x2}
                cy={l.y2}
                r={3}
                fill={l.color}
                style={{
                  animation: `dotPulse 3s ease-in-out infinite`,
                  animationDelay: `${l.delay}s`,
                }}
              />
            </g>
          ))}
        </g>

        {/* Core glow at origin */}
        <circle cx="720" cy="500" r="90" fill="url(#originCore)" />
        <circle cx="720" cy="500" r="6" fill="#FFD9C0" opacity="0.9" />
      </svg>
    </div>
  );
}

/* ============================================================ */
/*  Section: NAV                                                */
/* ============================================================ */

function Nav() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        height: 68,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 40px",
        background: isScrolled ? "#FFFFFF" : "transparent",
        boxShadow: isScrolled ? "0 1px 0 rgba(0,0,0,0.06)" : "none",
        transition: "background 0.2s ease, box-shadow 0.2s ease",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <ApertureLogo />
        <span
          style={{
            fontSize: 16,
            fontWeight: 500,
            color: "#0A2540",
            letterSpacing: "-0.01em",
          }}
        >
          Aperture
        </span>
      </div>

      <div style={{ display: "flex", gap: 28 }}>
        {[
          { label: "Explore", href: "/explore" },
          { label: "Pairs", href: "/explore" },
          { label: "API", href: "/explore" },
          { label: "Docs", href: "https://docs.aperture.xyz" },
        ].map((l) => (
          <a
            key={l.label}
            href={l.href}
            style={{
              fontSize: 14,
              fontWeight: 400,
              color: "#425466",
              textDecoration: "none",
            }}
          >
            {l.label}
          </a>
        ))}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <a
          href="/explore"
          style={{
            fontSize: 14,
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
            fontSize: 14,
            fontWeight: 400,
            padding: "8px 16px",
            borderRadius: 4,
            textDecoration: "none",
            transition: "background 0.2s ease",
          }}
        >
          Go to app
        </a>
      </div>
    </nav>
  );
}

/* ============================================================ */
/*  Section: HERO                                               */
/* ============================================================ */

function Hero() {
  const [blockNum, setBlockNum] = useState(845231);

  useEffect(() => {
    const id = setInterval(() => {
      setBlockNum((n) => n + 1 + Math.floor(Math.random() * 3));
    }, 3000);
    return () => clearInterval(id);
  }, []);

  return (
    <section
      style={{
        position: "relative",
        minHeight: "80vh",
        padding: "120px 0 80px",
        background: "#FFFFFF",
        overflow: "hidden",
      }}
    >
      {/* Gradient mesh blobs */}
      <div
        style={{
          position: "absolute",
          top: -120,
          right: -80,
          width: 520,
          height: 520,
          borderRadius: "50%",
          background: "#FF6BCB",
          filter: "blur(130px)",
          opacity: 0.45,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 60,
          right: 200,
          width: 380,
          height: 380,
          borderRadius: "50%",
          background: "#FF8A4C",
          filter: "blur(120px)",
          opacity: 0.35,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 200,
          right: -40,
          width: 440,
          height: 440,
          borderRadius: "50%",
          background: "#8B5CF6",
          filter: "blur(140px)",
          opacity: 0.4,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: -60,
          right: 320,
          width: 300,
          height: 300,
          borderRadius: "50%",
          background: "#635BFF",
          filter: "blur(100px)",
          opacity: 0.3,
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "relative",
          maxWidth: 1180,
          margin: "0 auto",
          padding: "0 40px",
          display: "grid",
          gridTemplateColumns: "60% 40%",
          gap: 40,
          alignItems: "center",
        }}
      >
        {/* Left column */}
        <div>
          <div
            style={{
              fontSize: 14,
              fontWeight: 400,
              color: "#6B7C93",
              marginBottom: 24,
              fontFamily:
                "'SF Mono', 'JetBrains Mono', Menlo, monospace",
            }}
          >
            Block {blockNum.toLocaleString()} • 12 active pairs
          </div>

          <h1
            style={{
              fontSize: 56,
              fontWeight: 300,
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
              color: "#0A2540",
              margin: "0 0 24px 0",
            }}
          >
            Scan every{" "}
            <span style={{ color: "#00D66F" }}>pair</span> on Arc Network.
          </h1>

          <p
            style={{
              fontSize: 20,
              fontWeight: 400,
              lineHeight: 1.5,
              color: "#425466",
              maxWidth: 520,
              margin: "0 0 36px 0",
            }}
          >
            Aperture indexes every liquidity pool, swap, and price feed on Arc
            Network in real time — the data layer your dApp can rely on.
          </p>

          <div style={{ display: "flex", gap: 16 }}>
            <a
              href="/explore"
              style={{
                background: "#635BFF",
                color: "#FFFFFF",
                fontSize: 16,
                fontWeight: 400,
                padding: "12px 18px",
                borderRadius: 4,
                textDecoration: "none",
                transition: "background 0.2s ease",
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
                fontSize: 16,
                fontWeight: 400,
                padding: "12px 18px",
                borderRadius: 4,
                textDecoration: "none",
                transition: "background 0.2s ease",
              }}
            >
              Read docs
            </a>
          </div>
        </div>

        {/* Right column: floating mini data card */}
        <div style={{ position: "relative" }}>
          <div
            style={{
              background: "#FFFFFF",
              borderRadius: 8,
              boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
              padding: 24,
              animation: "floatY 6s ease-in-out infinite",
            }}
          >
            <div
              style={{
                fontSize: 13,
                fontWeight: 500,
                color: "#6B7C93",
                marginBottom: 12,
                textTransform: "uppercase",
                letterSpacing: "0.04em",
              }}
            >
              Top pair
            </div>
            <div
              style={{
                fontSize: 22,
                fontWeight: 500,
                color: "#0A2540",
                marginBottom: 16,
              }}
            >
              {mockPairs[0].token0.symbol} / {mockPairs[0].token1.symbol}
            </div>
            <Row label="24h Volume" value={formatUsd(mockPairs[0].volume24h)} />
            <Row
              label="Liquidity"
              value={formatUsd(mockPairs[0].liquidityUsd)}
            />
            <Row
              label="24h Txns"
              value={mockPairs[0].txCount24h.toLocaleString()}
            />
            <Row
              label="Price Change"
              value={`${mockPairs[0].priceChange24h >= 0 ? "+" : ""}${mockPairs[0].priceChange24h.toFixed(2)}%`}
              valueColor={
                mockPairs[0].priceChange24h >= 0 ? "#00D66F" : "#E5484D"
              }
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function Row({
  label,
  value,
  valueColor,
}: {
  label: string;
  value: string;
  valueColor?: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 0",
        borderTop: "1px solid #E3E8EE",
      }}
    >
      <span style={{ fontSize: 14, color: "#6B7C93" }}>{label}</span>
      <span
        style={{
          fontSize: 15,
          fontWeight: 500,
          color: valueColor || "#0A2540",
          fontFamily: "'SF Mono', 'JetBrains Mono', Menlo, monospace",
        }}
      >
        {value}
      </span>
    </div>
  );
}

/* ============================================================ */
/*  Section: TRUSTED BY                                         */
/* ============================================================ */

function TrustedBy() {
  const logos = ["ArcSwap", "AuroraFi", "LumenDAO", "PrismLend", "NexusAMM", "Vortex"];
  return (
    <section
      style={{
        padding: "64px 0",
        background: "#FFFFFF",
      }}
    >
      <div
        style={{
          maxWidth: 1180,
          margin: "0 auto",
          padding: "0 40px",
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontSize: 14,
            fontWeight: 400,
            color: "#6B7C93",
            marginBottom: 32,
          }}
        >
          Trusted by teams building on Arc
        </p>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "48px 56px",
            alignItems: "center",
          }}
        >
          {logos.map((name) => (
            <span
              key={name}
              style={{
                fontSize: 20,
                fontWeight: 600,
                color: "#0A2540",
                opacity: 0.5,
                letterSpacing: "-0.01em",
              }}
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================ */
/*  Section: FEATURES                                           */
/* ============================================================ */

type Feature = { title: string; desc: string; icon: React.ReactNode };

const FEATURES: Feature[] = [
  {
    title: "Pair Discovery",
    desc: "Every liquidity pool on Arc, indexed the instant it's created.",
    icon: (
      <IconCircle>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 3 L12 21 M3 12 L21 12" />
      </IconCircle>
    ),
  },
  {
    title: "Swap History",
    desc: "Every trade, decoded and timestamped, queryable to the millisecond.",
    icon: (
      <IconCircle>
        <path d="M3 17 L9 11 L13 15 L21 7" />
        <path d="M15 7 L21 7 L21 13" />
      </IconCircle>
    ),
  },
  {
    title: "Liquidity Tracking",
    desc: "Track TVL changes, deposits, and withdrawals across every pair.",
    icon: (
      <IconCircle>
        <rect x="4" y="10" width="5" height="10" />
        <rect x="9.5" y="6" width="5" height="14" />
        <rect x="15" y="13" width="5" height="7" />
      </IconCircle>
    ),
  },
  {
    title: "Price Feeds",
    desc: "Real-time spot prices with sub-second latency, streamed via WebSocket.",
    icon: (
      <IconCircle>
        <path d="M3 12 C6 8, 9 16, 12 12 C15 8, 18 16, 21 12" />
      </IconCircle>
    ),
  },
  {
    title: "Analytics API",
    desc: "REST and GraphQL endpoints for volume, OHLCV, and depth across pairs.",
    icon: (
      <IconCircle>
        <path d="M4 4 L20 4 L20 20 L4 20 Z" />
        <path d="M8 16 L8 12 M12 16 L12 8 M16 16 L16 14" />
      </IconCircle>
    ),
  },
  {
    title: "Block Scanner",
    desc: "Inspect any block, transaction, or log event on Arc Network.",
    icon: (
      <IconCircle>
        <path d="M4 6 L20 6 L20 18 L4 18 Z" />
        <path d="M4 10 L20 10" />
        <circle cx="8" cy="14" r="1.2" fill="#635BFF" stroke="none" />
      </IconCircle>
    ),
  },
];

function IconCircle({ children }: { children: React.ReactNode }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#635BFF"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  );
}

function FeatureCard({ feature, delay }: { feature: Feature; delay: number }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Reveal delay={delay}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: "#FFFFFF",
          borderRadius: 8,
          padding: 28,
          boxShadow: hovered
            ? "0 8px 24px rgba(0,0,0,0.08)"
            : "0 1px 2px rgba(0,0,0,0.04)",
          transition: "box-shadow 0.2s ease",
          height: "100%",
        }}
      >
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 8,
            background: "#F5F2F8",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 20,
          }}
        >
          {feature.icon}
        </div>
        <h3
          style={{
            fontSize: 24,
            fontWeight: 500,
            color: "#0A2540",
            margin: "0 0 8px 0",
            letterSpacing: "-0.01em",
          }}
        >
          {feature.title}
        </h3>
        <p
          style={{
            fontSize: 17,
            fontWeight: 400,
            lineHeight: 1.5,
            color: "#425466",
            margin: 0,
          }}
        >
          {feature.desc}
        </p>
      </div>
    </Reveal>
  );
}

function Features() {
  return (
    <section style={{ padding: "100px 0", background: "#FFFFFF" }}>
      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "0 40px" }}>
        <Reveal>
          <h2
            style={{
              fontSize: 44,
              fontWeight: 300,
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
              color: "#0A2540",
              margin: "0 0 16px 0",
              textAlign: "center",
            }}
          >
            One indexer. Every signal on Arc.
          </h2>
          <p
            style={{
              fontSize: 20,
              fontWeight: 400,
              color: "#425466",
              textAlign: "center",
              maxWidth: 600,
              margin: "0 auto 64px auto",
            }}
          >
            From raw block data to decoded swaps — everything you need to build
            on Arc, in one place.
          </p>
        </Reveal>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 24,
          }}
        >
          {FEATURES.map((f, i) => (
            <FeatureCard key={f.title} feature={f} delay={i * 80} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================ */
/*  Section: SHOWCASE                                           */
/* ============================================================ */

function Showcase() {
  const checks = [
    "Filter by token, pair, or pool address",
    "Sort by volume, liquidity, or 24h change",
    "Deep-link to any pair detail page",
    "Export swap history as JSON or CSV",
  ];

  return (
    <section style={{ padding: "100px 0", background: "#F6F9FC" }}>
      <div
        style={{
          maxWidth: 1180,
          margin: "0 auto",
          padding: "0 40px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 64,
          alignItems: "center",
        }}
      >
        <Reveal>
          <div>
            <p
              style={{
                fontSize: 14,
                fontWeight: 400,
                color: "#635BFF",
                marginBottom: 16,
              }}
            >
              EXPLORER
            </p>
            <h2
              style={{
                fontSize: 42,
                fontWeight: 300,
                letterSpacing: "-0.02em",
                lineHeight: 1.1,
                color: "#0A2540",
                margin: "0 0 20px 0",
              }}
            >
              Find any pair in seconds.
            </h2>
            <p
              style={{
                fontSize: 19,
                fontWeight: 400,
                lineHeight: 1.5,
                color: "#425466",
                margin: "0 0 28px 0",
              }}
            >
              Search across every pool on Arc by symbol, address, or token
              metadata. The explorer surface gives you instant clarity.
            </p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {checks.map((c) => (
                <li
                  key={c}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 12,
                    marginBottom: 14,
                    fontSize: 16,
                    color: "#0A2540",
                  }}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    style={{ flexShrink: 0, marginTop: 1 }}
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="11"
                      fill="#00D66F"
                      opacity="0.12"
                    />
                    <path
                      d="M7 12.5 L11 16 L17 8"
                      stroke="#00D66F"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span style={{ fontWeight: 400 }}>{c}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div
            style={{
              background: "#0A2540",
              borderRadius: 8,
              padding: 28,
              fontFamily: "'SF Mono', 'JetBrains Mono', Menlo, monospace",
              fontSize: 13.5,
              lineHeight: 1.7,
              boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
            }}
          >
            <TermLine>
              <span style={{ color: "#6B7C93" }}>{"// top pairs"}</span>
            </TermLine>
            <TermLine>
              <span style={{ color: "#8B5CF6" }}>GET</span>
              <span style={{ color: "#E3E8EE" }}>/api/pairs</span>
              <span style={{ color: "#6B7C93" }}>?limit=3</span>
            </TermLine>
            <TermLine>
              <span style={{ color: "#6B7C93" }}>{"// response"}</span>
            </TermLine>
            <TermLine>
              <span style={{ color: "#E3E8EE" }}>{"{"}</span>
            </TermLine>
            {mockPairs.slice(0, 3).map((p, i) => (
              <div key={i} style={{ paddingLeft: 16 }}>
                <TermLine>
                  <span style={{ color: "#FF8A5C" }}>"{p.token0.symbol}/{p.token1.symbol}"</span>
                  <span style={{ color: "#E3E8EE" }}>: {"{"}</span>
                </TermLine>
                <div style={{ paddingLeft: 16 }}>
                  <TermLine>
                    <span style={{ color: "#9B4DE0" }}>"volume24h"</span>
                    <span style={{ color: "#E3E8EE" }}>: </span>
                    <span style={{ color: "#00D66F" }}>{formatUsd(p.volume24h)}</span>
                    <span style={{ color: "#E3E8EE" }}>,</span>
                  </TermLine>
                  <TermLine>
                    <span style={{ color: "#9B4DE0" }}>"liquidity"</span>
                    <span style={{ color: "#E3E8EE" }}>: </span>
                    <span style={{ color: "#00D66F" }}>{formatUsd(p.liquidityUsd)}</span>
                    <span style={{ color: "#E3E8EE" }}>,</span>
                  </TermLine>
                  <TermLine>
                    <span style={{ color: "#9B4DE0" }}>"txns24h"</span>
                    <span style={{ color: "#E3E8EE" }}>: </span>
                    <span style={{ color: "#FFD9C0" }}>{p.txCount24h.toLocaleString()}</span>
                  </TermLine>
                </div>
                <TermLine>
                  <span style={{ color: "#E3E8EE" }}>{i < 2 ? "}," : "}"}</span>
                </TermLine>
              </div>
            ))}
            <TermLine>
              <span style={{ color: "#E3E8EE" }}>{"}"}</span>
            </TermLine>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function TermLine({ children }: { children: React.ReactNode }) {
  return <div style={{ minHeight: "1.7em" }}>{children}</div>;
}

/* ============================================================ */
/*  Section: BACKBONE (NEW — radial burst)                     */
/* ============================================================ */

function Backbone() {
  const stats = [
    { value: "845K+", desc: "blocks indexed on Arc Network" },
    { value: formatUsd(mockPairs[0].volume24h), desc: "24h volume across all pairs" },
    { value: "99.9%", desc: "uptime since launch" },
    { value: "12", desc: "active pairs tracked in real time" },
  ];

  return (
    <section
      style={{
        background:
          "linear-gradient(180deg, #FFFFFF 0%, #F5F2F8 22%, #F5F2F8 100%)",
      }}
    >
      {/* Headline */}
      <div style={{ padding: "80px 0 40px", textAlign: "center" }}>
        <Reveal>
          <h2
            style={{
              fontSize: 48,
              fontWeight: 300,
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
              color: "#0A2540",
              margin: 0,
            }}
          >
            The backbone of on-chain data
          </h2>
        </Reveal>
      </div>

      {/* Stats bar */}
      <div style={{ background: "#F5F2F8", padding: "48px 0" }}>
        <div
          style={{
            maxWidth: 1180,
            margin: "0 auto",
            padding: "0 40px",
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 24,
            textAlign: "center",
          }}
        >
          {stats.map((s, i) => (
            <Reveal key={i} delay={i * 90}>
              <div>
                <div
                  style={{
                    fontSize: 44,
                    fontWeight: 500,
                    color: "#0A2540",
                    letterSpacing: "-0.02em",
                    lineHeight: 1.1,
                    marginBottom: 8,
                  }}
                >
                  {s.value}
                </div>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 400,
                    color: "#6B7C93",
                    lineHeight: 1.4,
                    maxWidth: 220,
                    margin: "0 auto",
                  }}
                >
                  {s.desc}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Radial burst */}
      <Reveal>
        <RadialBurst />
      </Reveal>
    </section>
  );
}

/* ============================================================ */
/*  Section: STATS (dark navy)                                  */
/* ============================================================ */

function StatsDark() {
  const totalVolume = mockPairs.reduce((s, p) => s + p.volume24h, 0);
  const stats = [
    { value: "845,231", label: "LATEST BLOCK" },
    { value: formatUsd(totalVolume), label: "24H VOLUME" },
    { value: "12", label: "ACTIVE PAIRS" },
    { value: "99.9%", label: "UPTIME" },
  ];
  return (
    <section style={{ background: "#0A2540", padding: "100px 0" }}>
      <div
        style={{
          maxWidth: 1180,
          margin: "0 auto",
          padding: "0 40px",
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 32,
          textAlign: "center",
        }}
      >
        {stats.map((s, i) => (
          <Reveal key={i} delay={i * 90}>
            <div>
              <div
                style={{
                  fontSize: 36,
                  fontWeight: 300,
                  color: "#FFFFFF",
                  fontFamily: "'SF Mono', 'JetBrains Mono', Menlo, monospace",
                  letterSpacing: "-0.01em",
                  marginBottom: 10,
                }}
              >
                {s.value}
              </div>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 400,
                  color: "#6B7C93",
                  letterSpacing: "0.08em",
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

/* ============================================================ */
/*  Section: HOW IT WORKS                                       */
/* ============================================================ */

function HowItWorks() {
  const steps = [
    {
      n: "01",
      title: "Connect your dApp",
      desc: "Point your app at the Aperture REST or GraphQL endpoint — no SDK install required.",
    },
    {
      n: "02",
      title: "Query any pair",
      desc: "Fetch swaps, liquidity, OHLCV, and metadata for any pool on Arc with a single call.",
    },
    {
      n: "03",
      title: "Ship with confidence",
      desc: "Every data point is indexed from finalized blocks and streamed with sub-second latency.",
    },
  ];
  return (
    <section style={{ padding: "100px 0", background: "#FFFFFF" }}>
      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "0 40px" }}>
        <Reveal>
          <h2
            style={{
              fontSize: 44,
              fontWeight: 300,
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
              color: "#0A2540",
              margin: "0 0 64px 0",
              textAlign: "center",
            }}
          >
            How it works
          </h2>
        </Reveal>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 40,
          }}
        >
          {steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 100}>
              <div>
                <div
                  style={{
                    fontSize: 56,
                    fontWeight: 500,
                    color: "#635BFF",
                    opacity: 0.25,
                    lineHeight: 1,
                    marginBottom: 16,
                    fontFamily: "'SF Mono', 'JetBrains Mono', Menlo, monospace",
                  }}
                >
                  {s.n}
                </div>
                <h3
                  style={{
                    fontSize: 24,
                    fontWeight: 500,
                    color: "#0A2540",
                    margin: "0 0 12px 0",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {s.title}
                </h3>
                <p
                  style={{
                    fontSize: 17,
                    fontWeight: 400,
                    lineHeight: 1.5,
                    color: "#425466",
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
  );
}

/* ============================================================ */
/*  Section: DEVELOPER                                          */
/* ============================================================ */

function Developer() {
  const checks = [
    "REST + GraphQL endpoints for every dataset",
    "WebSocket streams for live swaps and prices",
    "Generous rate limits on every plan, including free",
    "TypeScript SDK and Python client maintained in-tree",
  ];

  return (
    <section style={{ padding: "100px 0", background: "#F6F9FC" }}>
      <div
        style={{
          maxWidth: 1180,
          margin: "0 auto",
          padding: "0 40px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 64,
          alignItems: "center",
        }}
      >
        <Reveal>
          <div
            style={{
              background: "#0A2540",
              borderRadius: 8,
              padding: 28,
              fontFamily: "'SF Mono', 'JetBrains Mono', Menlo, monospace",
              fontSize: 13.5,
              lineHeight: 1.8,
              boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
            }}
          >
            <TermLine>
              <span style={{ color: "#FF8A5C" }}>import</span>
              <span style={{ color: "#E3E8EE" }}> {"{ Aperture }"} </span>
              <span style={{ color: "#FF8A5C" }}>from</span>
              <span style={{ color: "#00D66F" }}>{"@aperture/sdk"}</span>
              <span style={{ color: "#E3E8EE" }}>;</span>
            </TermLine>
            <TermLine>&nbsp;</TermLine>
            <TermLine>
              <span style={{ color: "#FF8A5C" }}>const</span>
              <span style={{ color: "#E3E8EE" }}> client = </span>
              <span style={{ color: "#FF8A5C" }}>new</span>
              <span style={{ color: "#9B4DE0" }}> Aperture</span>
              <span style={{ color: "#E3E8EE" }}>{"({"}</span>
            </TermLine>
            <TermLine>
              <span style={{ color: "#E3E8EE" }}>  network: </span>
              <span style={{ color: "#00D66F" }}>"arc-mainnet"</span>
              <span style={{ color: "#E3E8EE" }}>,</span>
            </TermLine>
            <TermLine>
              <span style={{ color: "#E3E8EE" }}>  apiKey: process.env.</span>
              <span style={{ color: "#FFD9C0" }}>APERTURE_KEY</span>
              <span style={{ color: "#E3E8EE" }}>,</span>
            </TermLine>
            <TermLine>
              <span style={{ color: "#E3E8EE" }}>{"});"}</span>
            </TermLine>
            <TermLine>&nbsp;</TermLine>
            <TermLine>
              <span style={{ color: "#FF8A5C" }}>const</span>
              <span style={{ color: "#E3E8EE" }}> pairs = </span>
              <span style={{ color: "#FF8A5C" }}>await</span>
              <span style={{ color: "#E3E8EE" }}> client.</span>
              <span style={{ color: "#9B4DE0" }}>pairs</span>
              <span style={{ color: "#E3E8EE" }}>.list({"{"}</span>
            </TermLine>
            <TermLine>
              <span style={{ color: "#E3E8EE" }}>  orderBy: </span>
              <span style={{ color: "#00D66F" }}>"volume24h"</span>
              <span style={{ color: "#E3E8EE" }}>,</span>
            </TermLine>
            <TermLine>
              <span style={{ color: "#E3E8EE" }}>  limit: </span>
              <span style={{ color: "#FFD9C0" }}>10</span>
              <span style={{ color: "#E3E8EE" }}>,</span>
            </TermLine>
            <TermLine>
              <span style={{ color: "#E3E8EE" }}>{"});"}</span>
            </TermLine>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div>
            <p
              style={{
                fontSize: 14,
                fontWeight: 400,
                color: "#635BFF",
                marginBottom: 16,
              }}
            >
              DEVELOPER PLATFORM
            </p>
            <h2
              style={{
                fontSize: 42,
                fontWeight: 300,
                letterSpacing: "-0.02em",
                lineHeight: 1.1,
                color: "#0A2540",
                margin: "0 0 20px 0",
              }}
            >
              Built for builders, from block one.
            </h2>
            <p
              style={{
                fontSize: 19,
                fontWeight: 400,
                lineHeight: 1.5,
                color: "#425466",
                margin: "0 0 28px 0",
              }}
            >
              A clean API surface over the entire Arc Network. Read pairs,
              stream swaps, and integrate pricing without running your own
              indexer.
            </p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {checks.map((c) => (
                <li
                  key={c}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 12,
                    marginBottom: 14,
                    fontSize: 16,
                    color: "#0A2540",
                  }}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    style={{ flexShrink: 0, marginTop: 1 }}
                  >
                    <circle cx="12" cy="12" r="11" fill="#635BFF" opacity="0.12" />
                    <path
                      d="M7 12.5 L11 16 L17 8"
                      stroke="#635BFF"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span style={{ fontWeight: 400 }}>{c}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ============================================================ */
/*  Section: CTA                                                */
/* ============================================================ */

function CTA() {
  return (
    <section style={{ position: "relative", background: "#0A2540", padding: "120px 0", overflow: "hidden" }}>
      {/* subtle mesh */}
      <div
        style={{
          position: "absolute",
          top: -100,
          left: "20%",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: "#635BFF",
          filter: "blur(140px)",
          opacity: 0.3,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -120,
          right: "15%",
          width: 360,
          height: 360,
          borderRadius: "50%",
          background: "#8B5CF6",
          filter: "blur(130px)",
          opacity: 0.25,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "relative",
          maxWidth: 720,
          margin: "0 auto",
          padding: "0 40px",
          textAlign: "center",
        }}
      >
        <Reveal>
          <h2
            style={{
              fontSize: 48,
              fontWeight: 300,
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
              color: "#FFFFFF",
              margin: "0 0 20px 0",
            }}
          >
            Start scanning Arc Network today.
          </h2>
          <p
            style={{
              fontSize: 20,
              fontWeight: 400,
              color: "#9BA8C7",
              margin: "0 0 36px 0",
            }}
          >
            Free to explore. No API key required for public data.
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
            <a
              href="/explore"
              style={{
                background: "#635BFF",
                color: "#FFFFFF",
                fontSize: 16,
                fontWeight: 400,
                padding: "12px 18px",
                borderRadius: 4,
                textDecoration: "none",
                transition: "background 0.2s ease",
              }}
            >
              Explore pairs
            </a>
            <a
              href="https://docs.aperture.xyz"
              style={{
                background: "transparent",
                border: "1px solid rgba(255,255,255,0.25)",
                color: "#FFFFFF",
                fontSize: 16,
                fontWeight: 400,
                padding: "12px 18px",
                borderRadius: 4,
                textDecoration: "none",
                transition: "background 0.2s ease",
              }}
            >
              Read docs
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ============================================================ */
/*  Section: FOOTER                                             */
/* ============================================================ */

function Footer() {
  const cols: { heading: string; links: { label: string; href: string }[] }[] = [
    {
      heading: "Product",
      links: [
        { label: "Explore", href: "/explore" },
        { label: "Pairs", href: "/explore" },
        { label: "Swap", href: "/explore" },
        { label: "Portfolio", href: "/explore" },
      ],
    },
    {
      heading: "Resources",
      links: [
        { label: "Docs", href: "https://docs.aperture.xyz" },
        { label: "API", href: "/explore" },
        { label: "GitHub", href: "https://docs.aperture.xyz" },
        { label: "Status", href: "https://docs.aperture.xyz" },
      ],
    },
    {
      heading: "Company",
      links: [
        { label: "About", href: "/explore" },
        { label: "Blog", href: "/explore" },
        { label: "Contact", href: "/explore" },
        { label: "Privacy", href: "/explore" },
      ],
    },
  ];

  return (
    <footer style={{ background: "#0A2540", padding: "80px 0 40px" }}>
      <div
        style={{
          maxWidth: 1180,
          margin: "0 auto",
          padding: "0 40px",
          display: "grid",
          gridTemplateColumns: "1.5fr 1fr 1fr 1fr",
          gap: 48,
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <ApertureLogo color="#FFFFFF" />
            <span style={{ fontSize: 16, fontWeight: 500, color: "#FFFFFF" }}>
              Aperture
            </span>
          </div>
          <p
            style={{
              fontSize: 14,
              fontWeight: 400,
              color: "#6B7C93",
              maxWidth: 240,
              lineHeight: 1.5,
            }}
          >
            The DEX scanner for Arc Network. Real-time pair data, swaps, and
            analytics — indexed at the block.
          </p>
          <p
            style={{
              fontSize: 13,
              fontWeight: 500,
              color: "#425466",
              marginTop: 20,
              letterSpacing: "0.02em",
            }}
          >
            Built on Arc™
          </p>
        </div>

        {cols.map((col) => (
          <div key={col.heading}>
            <h4
              style={{
                fontSize: 13,
                fontWeight: 500,
                color: "#FFFFFF",
                margin: "0 0 16px 0",
                letterSpacing: "0.04em",
                textTransform: "uppercase",
              }}
            >
              {col.heading}
            </h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {col.links.map((l) => (
                <li key={l.label} style={{ marginBottom: 10 }}>
                  <a
                    href={l.href}
                    style={{
                      fontSize: 14,
                      fontWeight: 400,
                      color: "#9BA8C7",
                      textDecoration: "none",
                    }}
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div
        style={{
          maxWidth: 1180,
          margin: "64px auto 0",
          padding: "24px 40px 0",
          borderTop: "1px solid rgba(255,255,255,0.08)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span style={{ fontSize: 13, color: "#6B7C93" }}>
          © {new Date().getFullYear()} Aperture. All rights reserved.
        </span>
        <span style={{ fontSize: 13, color: "#6B7C93" }}>
          Indexed on Arc Network
        </span>
      </div>
    </footer>
  );
}

/* ============================================================ */
/*  Page                                                        */
/* ============================================================ */

export default function LandingPage() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: KEYFRAMES }} />
      <div
        style={{
          fontFamily: "'Inter', -apple-system, system-ui, sans-serif",
          color: "#0A2540",
          background: "#FFFFFF",
        }}
      >
        <Nav />
        <Hero />
        <TrustedBy />
        <Features />
        <Showcase />
        <Backbone />
        <StatsDark />
        <HowItWorks />
        <Developer />
        <CTA />
        <Footer />
      </div>
    </>
  );
}
