"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ParticleField } from "@/components/particle-field";
import { mockPairs } from "@/lib/mock-data";
import { formatUsd } from "@/lib/format";
import { Reveal } from "@/components/reveal";
import { useState } from "react";

const stats = [
  { value: "0%", label: "Downtime", sub: "99.9% uptime SLA" },
  { value: "12K+", label: "Pairs Tracked", sub: "Across Arc Network" },
  { value: "0.3s", label: "Latency", sub: "Real-time indexing" },
  { value: "24/7", label: "Monitoring", sub: "Always watching" },
];

const features = [
  { icon: "cube", title: "Immutable Ledger", desc: "Every swap, liquidity change, and price movement is permanently recorded on Arc's public ledger." },
  { icon: "verify", title: "Math-Based Proof", desc: "Cryptographic verification ensures all pair data is accurate and tamper-proof." },
  { icon: "global", title: "Global Consensus", desc: "Decentralized validation across nodes — no single point of failure." },
  { icon: "route", title: "Cryptographic Routing", desc: "Securely routing assets through validated liquidity pools." },
  { icon: "bolt", title: "Sub-second Finality", desc: "Instant transaction settlement across global rails." },
  { icon: "bridge", title: "Omni-chain Bridging", desc: "Syncing assets perfectly across protocols and chains." },
];

const securityPoints = [
  { label: "Cold Storage", value: "100%" },
  { label: "HSM Nodes", value: "24" },
  { label: "Multi-Sig", value: "5/7" },
  { label: "Jurisdictions", value: "12" },
];

const community = [
  { name: "X / Twitter", handle: "@aperture_dex", members: "Latest updates, pair alerts, and announcements", icon: "x" },
  { name: "Discord", handle: "discord.gg/aperture", members: "Community support, discussions, and direct assistance", icon: "discord" },
  { name: "Telegram", handle: "t.me/aperture_dex", members: "Real-time updates, support channels, and community chat", icon: "telegram" },
  { name: "GitHub", handle: "github.com/aperture", members: "Open-source tools, SDKs, and developer resources", icon: "github" },
];

const testimonials = [
  { quote: "Aperture provided the real-time analytics and deterministic finality we were searching for. Their DEX scanner redefined how we track liquidity.", name: "Michael Chen", role: "CTO, Sentinel Capital" },
  { quote: "Integrating Aperture's data elevated our approach to decentralized trading. The seamless on-chain operations are unmatched.", name: "Aisha Malik", role: "Lead Blockchain Engineer" },
  { quote: "Aperture's deterministic finality and liquidity solutions empowered us to optimize asset allocation across pairs.", name: "Louis Ramirez", role: "Head of Product Development" },
];

const faqs = [
  { q: "Is Aperture backed by real on-chain data?", a: "Yes. Aperture indexes real-time data directly from Arc Network's public ledger. Every pair, swap, and liquidity change is verified on-chain." },
  { q: "How does Aperture verify total volume?", a: "Aperture uses cryptographic proofs embedded in Arc's protocol to ensure that volume data matches actual on-chain transactions. No estimates, no approximations." },
  { q: "How does Aperture handle network congestion?", a: "Aperture dynamically adjusts indexing throughput using adaptive parameters. When demand spikes, the system prioritizes critical pair data to maintain sub-second latency." },
  { q: "What defines Aperture's security architecture?", a: "Aperture's security is built on a Zero-Trust framework, combining cryptographic verification, decentralized consensus, and institutional-grade infrastructure." },
  { q: "Can I audit the Aperture protocol?", a: "Yes. Aperture is fully transparent. All indexing logic, pair calculations, and data pipelines are open to independent audit." },
  { q: "How does Aperture bridge legacy finance?", a: "Aperture connects traditional financial systems with decentralized protocols through secure interoperability layers on Arc Network." },
];

function FeatureIcon({ name }: { name: string }) {
  const icons: Record<string, React.ReactNode> = {
    cube: <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />,
    verify: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
    global: <><circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></>,
    route: <><circle cx="6" cy="19" r="3" /><path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15" /><circle cx="18" cy="5" r="3" /></>,
    bolt: <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />,
    bridge: <path d="M6 9V3h12v6M6 18v3h12v-3M3 12h18M6 9c0 3 6 3 6 3s6 0 6-3" />,
  };
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      {icons[name] || icons.cube}
    </svg>
  );
}

function SocialIcon({ name }: { name: string }) {
  const icons: Record<string, React.ReactNode> = {
    x: <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />,
    discord: <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.126-.094.252-.192.372-.291a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.3 12.3 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.056c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />,
    telegram: <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.329-.913.489-1.302.481-.428-.009-1.252-.242-1.865-.442-.751-.244-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />,
    github: <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />,
  };
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      {icons[name] || icons.x}
    </svg>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-white/5">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-5 text-left transition-colors hover:text-emerald-400"
      >
        <span className="text-sm font-medium pr-4">{q}</span>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`flex-shrink-0 transition-transform ${open ? "rotate-180" : ""}`}>
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      {open && (
        <div className="pb-5 text-sm leading-relaxed opacity-60 transition-all">
          {a}
        </div>
      )}
    </div>
  );
}

export default function Home() {
  const topPair = mockPairs[0];
  const totalVolume = mockPairs.reduce((a, p) => a + p.volume24h, 0);

  return (
    <div className="relative min-h-screen landing-bg overflow-hidden">
      <ParticleField />
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        <div className="landing-glow absolute top-0 left-1/2 -translate-x-1/2" />
        <div className="landing-glow-side-1 absolute top-0 left-0" />
        <div className="landing-glow-side-2 absolute top-0 right-0" />
      </div>

      <div className="relative" style={{ zIndex: 1 }}>
        <Header showTicker={false} showFaucet={false} />
        <main className="w-full flex-1">
          {/* ===== HERO — MintWeb3 style ===== */}
          <section className="relative min-h-screen flex items-center justify-center px-4 pt-20">
            <div className="max-w-4xl mx-auto text-center">
              {/* Block ticker */}
              <Reveal delay={0}>
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-4 py-1.5 text-xs font-mono landing-text-subtle mb-8" style={{ backdropFilter: "blur(14px)" }}>
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                  Block 845,231 — {mockPairs.length} Active Pairs
                </div>
              </Reveal>

              {/* Headline — spread letter style like MintWeb3 */}
              <Reveal delay={100}>
                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6 landing-text-heading" style={{ fontFamily: "var(--font-heading, 'Space Grotesk'), sans-serif", lineHeight: "1.1em", letterSpacing: "-0.02em" }}>
                  The Foundation Of
                </h1>
              </Reveal>
              <Reveal delay={200}>
                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-8" style={{ fontFamily: "var(--font-heading, 'Space Grotesk'), sans-serif", lineHeight: "1.1em", letterSpacing: "-0.02em" }}>
                  <span style={{
                    WebkitTextFillColor: "transparent",
                    background: "linear-gradient(135deg, #10b981 0%, #5ee9b5 50%, #14b8a6 100%)",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                  }}>
                    DEX Intelligence
                  </span>
                </h1>
              </Reveal>

              <Reveal delay={300}>
                <p className="landing-text text-sm sm:text-base mb-10 max-w-xl mx-auto leading-relaxed">
                  A transparent, decentralized DEX scanner built on Arc Network — designed to serve as the immutable foundation for real-time pair analytics, on-chain swaps, and portfolio tracking.
                </p>
              </Reveal>

              <Reveal delay={400}>
                <div className="flex justify-center gap-4 mb-16">
                  <a href="/explore" className="group inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold transition-all hover:-translate-y-0.5" style={{ background: "linear-gradient(135deg, #10b981, #5ee9b5)", boxShadow: "0 4px 24px rgba(16, 185, 129, 0.3)", color: "#000" }}>
                    Start Exploring
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="transition-transform group-hover:translate-x-1">
                      <path d="M5 12h14M13 5l7 7-7 7" />
                    </svg>
                  </a>
                  <a href="#security" className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 px-7 py-3.5 text-sm font-semibold landing-text-heading transition-all hover:bg-emerald-500/5">
                    Read Whitepaper
                  </a>
                </div>
              </Reveal>
            </div>
          </section>

          {/* ===== TRUSTED BY ===== */}
          <Reveal>
            <section className="py-12 border-y landing-border">
              <p className="text-center text-xs tracking-widest uppercase landing-text-muted mb-8">Trusted by the global DEX ecosystem</p>
              <div className="flex flex-wrap items-center justify-center gap-8 px-4">
                {["Arc Network", "Circle", "USDC", "WETH", "WBTC", "SOL", "ARB"].map((brand, i) => (
                  <span key={i} className="text-sm font-bold tracking-wider landing-text-muted" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    {brand}
                  </span>
                ))}
              </div>
            </section>
          </Reveal>

          {/* ===== FEATURE SPOTLIGHT — alternating layout ===== */}
          <Reveal>
            <section className="py-20 sm:py-32 px-4">
              <div className="max-w-5xl mx-auto">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                  <div>
                    <span className="text-xs tracking-widest uppercase landing-text-muted mb-4 block">The Foundation</span>
                    <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-6 landing-text-heading" style={{ fontFamily: "var(--font-heading, 'Space Grotesk'), sans-serif" }}>
                      Real-time pair analytics, verified on-chain
                    </h2>
                    <p className="landing-text-subtle text-sm mb-6 leading-relaxed">
                      Aperture indexes every liquidity pool, swap, and price movement on Arc Network. No estimates — just deterministic, mathematically verified data.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <span className="rounded-full border border-emerald-500/20 bg-emerald-500/5 px-4 py-1.5 text-xs landing-text-subtle">Immutable Ledger</span>
                      <span className="rounded-full border border-emerald-500/20 bg-emerald-500/5 px-4 py-1.5 text-xs landing-text-subtle">Math-Based Proof</span>
                      <span className="rounded-full border border-emerald-500/20 bg-emerald-500/5 px-4 py-1.5 text-xs landing-text-subtle">Global Consensus</span>
                    </div>
                  </div>
                  <div className="rounded-2xl border landing-border p-6 landing-card">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs tracking-widest uppercase landing-text-muted">Live Preview</span>
                      <span className="text-xs landing-text-subtle font-mono">{topPair.token0.symbol}/{topPair.token1.symbol}</span>
                    </div>
                    <div className="text-3xl font-bold landing-text-heading mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                      {formatUsd(topPair.volume24h)}
                    </div>
                    <div className="text-xs landing-text-subtle mb-6">24H Volume</div>
                    <div className="space-y-3">
                      <div className="flex justify-between text-xs"><span className="landing-text-muted">Liquidity</span><span className="landing-text-body font-mono">{formatUsd(topPair.liquidityUsd)}</span></div>
                      <div className="flex justify-between text-xs"><span className="landing-text-muted">Fee Tier</span><span className="landing-text-body font-mono">0.3%</span></div>
                      <div className="flex justify-between text-xs"><span className="landing-text-muted">Transactions 24H</span><span className="landing-text-body font-mono">{topPair.txCount24h}</span></div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </Reveal>

          {/* ===== STATS — big numbers ===== */}
          <Reveal>
            <section className="py-20 px-4 border-y landing-border">
              <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                {stats.map((s, i) => (
                  <div key={i}>
                    <div className="text-4xl sm:text-5xl font-bold mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif", background: "linear-gradient(135deg, #10b981, #5ee9b5)", WebkitTextFillColor: "transparent", WebkitBackgroundClip: "text", backgroundClip: "text" }}>
                      {s.value}
                    </div>
                    <div className="text-sm font-semibold landing-text-heading mb-1">{s.label}</div>
                    <div className="text-xs landing-text-muted">{s.sub}</div>
                  </div>
                ))}
              </div>
            </section>
          </Reveal>

          {/* ===== SECURITY GRID ===== */}
          <section id="security" className="py-20 sm:py-28 px-4">
            <Reveal>
              <div className="max-w-3xl mx-auto text-center mb-16">
                <span className="text-xs tracking-widest uppercase landing-text-muted mb-4 block">Security Verified Through Absolute Logic</span>
                <h2 className="text-3xl sm:text-5xl font-bold tracking-tight landing-text-heading" style={{ fontFamily: "var(--font-heading, 'Space Grotesk'), sans-serif" }}>
                  Institutional-grade infrastructure
                </h2>
              </div>
            </Reveal>
            <div className="max-w-5xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((f, i) => (
                <Reveal key={i} delay={i * 80}>
                  <div className="rounded-xl border landing-border p-6 landing-card transition-all hover:border-emerald-500/30 h-full">
                    <div className="mb-4 text-emerald-400">
                      <FeatureIcon name={f.icon} />
                    </div>
                    <h3 className="text-lg font-bold mb-2 landing-text-heading" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{f.title}</h3>
                    <p className="text-xs landing-text-subtle leading-relaxed">{f.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </section>

          {/* ===== SECURITY POINTS — horizontal bar ===== */}
          <Reveal>
            <section className="py-16 px-4 border-y landing-border">
              <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                {securityPoints.map((p, i) => (
                  <div key={i}>
                    <div className="text-3xl font-bold landing-text-heading mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{p.value}</div>
                    <div className="text-xs tracking-widest uppercase landing-text-muted">{p.label}</div>
                  </div>
                ))}
              </div>
            </section>
          </Reveal>

          {/* ===== COMMUNITY ===== */}
          <section className="py-20 sm:py-28 px-4">
            <Reveal>
              <div className="max-w-3xl mx-auto text-center mb-14">
                <span className="text-xs tracking-widest uppercase landing-text-muted mb-4 block">Leaders in DEX infrastructure</span>
                <h2 className="text-3xl sm:text-5xl font-bold tracking-tight landing-text-heading mb-4" style={{ fontFamily: "var(--font-heading, 'Space Grotesk'), sans-serif" }}>
                  Built by the community
                </h2>
                <p className="landing-text-subtle text-sm max-w-lg mx-auto">
                  We follow institutional-grade security protocols and math-based verification to keep your DEX intelligence absolute.
                </p>
              </div>
            </Reveal>
            <div className="max-w-4xl mx-auto grid sm:grid-cols-2 gap-4">
              {community.map((c, i) => (
                <Reveal key={i} delay={i * 80}>
                  <div className="flex items-center gap-4 rounded-xl border landing-border p-5 landing-card transition-all hover:border-emerald-500/30">
                    <div className="text-emerald-400 flex-shrink-0">
                      <SocialIcon name={c.icon} />
                    </div>
                    <div>
                      <div className="text-sm font-semibold landing-text-heading">{c.name}</div>
                      <div className="text-xs landing-text-muted font-mono">{c.handle}</div>
                      <div className="text-xs landing-text-subtle mt-1">{c.members}</div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </section>

          {/* ===== TESTIMONIALS ===== */}
          <Reveal>
            <section className="py-20 px-4 border-y landing-border">
              <div className="max-w-5xl mx-auto">
                <div className="grid md:grid-cols-3 gap-6">
                  {testimonials.map((t, i) => (
                    <div key={i} className="rounded-xl border landing-border p-6 landing-card">
                      <p className="text-sm landing-text-body leading-relaxed mb-4 italic">"{t.quote}"</p>
                      <div>
                        <div className="text-sm font-semibold landing-text-heading">{t.name}</div>
                        <div className="text-xs landing-text-muted">{t.role}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </Reveal>

          {/* ===== FAQ ===== */}
          <section className="py-20 sm:py-28 px-4">
            <Reveal>
              <div className="max-w-2xl mx-auto text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight landing-text-heading mb-4" style={{ fontFamily: "var(--font-heading, 'Space Grotesk'), sans-serif" }}>
                  Frequently Asked Questions
                </h2>
              </div>
            </Reveal>
            <div className="max-w-2xl mx-auto">
              {faqs.map((f, i) => (
                <Reveal key={i} delay={i * 50}>
                  <FaqItem q={f.q} a={f.a} />
                </Reveal>
              ))}
            </div>
          </section>

          {/* ===== FINAL CTA ===== */}
          <Reveal>
            <section className="relative overflow-hidden px-4 py-20 sm:py-28 border-t landing-border text-center">
              <div className="max-w-3xl mx-auto">
                <h2 className="text-4xl sm:text-6xl font-bold tracking-tight mb-6 landing-text-heading" style={{ fontFamily: "var(--font-heading, 'Space Grotesk'), sans-serif", lineHeight: "1.1em" }}>
                  Start Your DEX
                </h2>
                <h2 className="text-4xl sm:text-6xl font-bold tracking-tight mb-6" style={{ fontFamily: "var(--font-heading, 'Space Grotesk'), sans-serif", lineHeight: "1.1em" }}>
                  <span style={{
                    WebkitTextFillColor: "transparent",
                    background: "linear-gradient(135deg, #10b981 0%, #5ee9b5 50%, #14b8a6 100%)",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                  }}>
                    Intelligence Journey
                  </span>
                </h2>
                <p className="landing-text-subtle text-sm mb-8 max-w-lg mx-auto">
                  Our protocol provides the deterministic finality and institutional-grade security required to navigate DEX pairs with confidence.
                </p>
                <a href="/explore" className="group inline-flex items-center gap-2 rounded-full px-8 py-4 text-base font-semibold transition-all hover:-translate-y-0.5" style={{ background: "linear-gradient(135deg, #10b981, #5ee9b5)", boxShadow: "0 4px 24px rgba(16, 185, 129, 0.3)", color: "#000" }}>
                  Get Access
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="transition-transform group-hover:translate-x-1">
                    <path d="M5 12h14M13 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </section>
          </Reveal>
        </main>
        <Footer />
      </div>
    </div>
  );
}
