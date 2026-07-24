import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ParticleField } from "@/components/particle-field";
import { mockPairs } from "@/lib/mock-data";
import { formatUsd } from "@/lib/format";
import Image from "next/image";
import { Reveal } from "@/components/reveal";

export default function LandingPage() {
  const totalVolume = mockPairs.reduce((a, p) => a + p.volume24h, 0);
  const totalLiquidity = mockPairs.reduce((a, p) => a + p.liquidityUsd, 0);
  const totalPairs = mockPairs.length;
  const gainers = mockPairs.filter(p => p.priceChange24h > 0).length;
  const topPair = [...mockPairs].sort((a, b) => b.volume24h - a.volume24h)[0];

  const stats = [
    { value: formatUsd(totalVolume), label: "24H Volume", suffix: "" },
    { value: "99.9", label: "Uptime", suffix: "%" },
    { value: formatUsd(totalLiquidity), label: "Total Liquidity", suffix: "" },
    { value: `${totalPairs}`, label: "DEX Pairs", suffix: "+" },
  ];

  const marqueeItems = [
    "REAL-TIME ANALYTICS", "ON-CHAIN SWAPS", "PORTFOLIO TRACKING",
    "LIVE PULSE FEED", "DEX PAIR SCANNER", "TOKEN TRACKER", "LP FARMING"
  ];

  const features = [
    { num: "01", title: "Explore", desc: "Browse all DEX pairs on Arc testnet. Real-time liquidity, volume, and price data at your fingertips.", href: "/explore", badge: "Live" },
    { num: "02", title: "Pulse", desc: "Real-time swap feed with animated entries. Never miss a trade on Arc Network.", href: "/pulse", badge: "Real-time" },
    { num: "03", title: "Tracker", desc: "Search any token or pair by contract address or symbol. Quick lookup, instant results.", href: "/pelacak", badge: "Search" },
    { num: "04", title: "Swap", desc: "On-chain swaps via Presto DEX with percentage presets and slippage control.", href: "/swap", badge: "On-chain" },
    { num: "05", title: "Portfolio", desc: "Track wallet balance, token holdings, and transaction history in one place.", href: "/portofolio", badge: "Wallet" },
    { num: "06", title: "Earn", desc: "Stake LP tokens and farm rewards. Monitor APY, TVL, and reward pools.", href: "/earn", badge: "Farming" },
  ];

  const workflowStats = [
    { value: `${totalPairs}`, suffix: "+", label: "Total DEX pairs indexed across Arc Network" },
    { value: "99", suffix: "%", label: "Uptime guarantee for real-time data feeds" },
    { value: "10", suffix: "k+", label: "Data points processed every second on-chain" },
  ];

  const integrations = [
    "PRESTO DEX", "ARC NETWORK", "WETH", "USDC", "WSOL", "ARC SCAN", "LP POOLS",
  ];

  return (
    <div className="relative min-h-screen landing-bg">
      {/* ===== Emerald light glow from top ===== */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        <div className="absolute top-0 left-1/2 -translate-x-1/2" style={{
          width: "100%", height: "100vh",
          background: "radial-gradient(ellipse 900px 400px at 50% 0%, rgba(16, 185, 129, 0.15) 0%, rgba(16, 185, 129, 0.06) 30%, transparent 60%)",
        }} />
        <div className="absolute top-0" style={{
          width: "100%", height: "100vh",
          background: "radial-gradient(ellipse 1200px 300px at 25% 0%, rgba(16, 185, 129, 0.08) 0%, transparent 55%)",
        }} />
        <div className="absolute top-0" style={{
          width: "100%", height: "100vh",
          background: "radial-gradient(ellipse 1200px 300px at 75% 0%, rgba(16, 185, 129, 0.08) 0%, transparent 55%)",
        }} />
      </div>

      {/* ===== Particles ===== */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 1 }}>
        <ParticleField />
      </div>

      {/* ===== Content ===== */}
      <div className="relative" style={{ zIndex: 10 }}>
        <Header showTicker={false} showFaucet={false} />
        <main className="flex-1">

          {/* ===== 1. HERO — badge + headline + subtitle + CTA + 3 dashboard mockups ===== */}
          <section className="relative pt-32 pb-20 px-4">
            <div className="max-w-6xl mx-auto text-center">
              {/* Badge */}
              <div className="flex justify-center mb-8">
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-5 py-2.5 text-sm font-medium text-emerald-400" style={{ backdropFilter: "blur(14px)" }}>
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                  </span>
                  <span className="tracking-wider uppercase text-[11px] font-bold">Arc Network — Testnet Live</span>
                </div>
              </div>

              {/* Headline */}
              <h1 className="text-5xl sm:text-7xl lg:text-[80px] font-bold tracking-tight mb-6 landing-text-heading" style={{ fontFamily: "var(--font-heading, 'Space Grotesk'), sans-serif", lineHeight: "1em" }}>
                Discover & Trade
              </h1>
              <h1 className="text-5xl sm:text-7xl lg:text-[80px] font-bold tracking-tight mb-8" style={{ fontFamily: "var(--font-heading, 'Space Grotesk'), sans-serif", lineHeight: "1em" }}>
                <span style={{
                  WebkitTextFillColor: "transparent",
                  background: "linear-gradient(135deg, #10b981 0%, #5ee9b5 50%, #f97316 100%)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                }}>
                  DEX Pairs
                </span>
              </h1>

              {/* Subtitle */}
              <p className="landing-text text-sm sm:text-base mb-10 max-w-3xl mx-auto leading-relaxed">
                Real-time DEX pair analytics built on Arc Network — track liquidity, volume, and swaps.
              </p>

              {/* CTA */}
              <div className="flex justify-center gap-4 mb-16">
                <a href="/swap" className="group inline-flex items-center gap-2 rounded-full px-8 py-4 text-base font-semibold transition-all hover:-translate-y-0.5" style={{ background: "linear-gradient(135deg, #10b981, #5ee9b5)", boxShadow: "0 4px 20px rgba(16, 185, 129, 0.3)", color: "#000" }}>
                  Start Swapping
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="transition-transform group-hover:translate-x-1">
                    <path d="M5 12h14M13 5l7 7-7 7" />
                  </svg>
                </a>
                <a href="/explore" className="group inline-flex items-center gap-2 rounded-full border border-emerald-500/50 bg-transparent px-8 py-4 text-base font-semibold landing-text-heading transition-all hover:bg-emerald-500/10">
                  Explore Pairs
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="transition-transform group-hover:translate-x-1">
                    <path d="M5 12h14M13 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>

            {/* 3 Dashboard Mockup Cards — like Intellio */}
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-4 items-end">
              {/* Left card — small */}
              <div className="lg:col-span-3 rounded-2xl p-5" style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(16, 185, 129, 0.1)",
                backdropFilter: "blur(20px)",
                boxShadow: "0 0 40px -10px rgba(16, 185, 129, 0.15)",
              }}>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] tracking-widest uppercase landing-text-subtle" style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}>Dashboard</span>
                  <span className="landing-text-muted">···</span>
                </div>
                <div className="rounded-xl p-4 mb-3" style={{ background: "linear-gradient(135deg, rgba(16,185,129,0.15), rgba(16,185,129,0.05))" }}>
                  <div className="text-2xl font-bold landing-text-heading" style={{ fontFamily: "var(--font-heading, 'Space Grotesk'), sans-serif" }}>
                    {formatUsd(totalVolume)}
                  </div>
                  <div className="text-[10px] tracking-wider uppercase text-emerald-400 mt-1">24H Volume</div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-lg p-2.5 landing-card-inner">
                    <div className="text-xs font-bold landing-text-heading">{formatUsd(topPair.liquidityUsd)}</div>
                    <div className="text-[9px] landing-text-subtle">Top Pool</div>
                  </div>
                  <div className="rounded-lg p-2.5 landing-card-inner">
                    <div className="text-xs font-bold landing-text-heading">{totalPairs}</div>
                    <div className="text-[9px] landing-text-subtle">Pairs</div>
                  </div>
                </div>
                {/* Mini chart */}
                <div className="mt-3 flex items-end gap-1 h-12">
                  {[40, 65, 35, 80, 55].map((h, i) => (
                    <div key={i} className="flex-1 rounded-t" style={{ height: `${h}%`, background: "linear-gradient(180deg, #10b981, rgba(16,185,129,0.1))" }} />
                  ))}
                </div>
              </div>

              {/* Center card — big */}
              <div className="lg:col-span-6 rounded-2xl p-6" style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(16, 185, 129, 0.1)",
                backdropFilter: "blur(20px)",
                boxShadow: "0 0 60px -10px rgba(16, 185, 129, 0.2)",
              }}>
                {/* Top row — 3 stats */}
                <div className="grid grid-cols-3 gap-3 mb-5">
                  <div>
                    <div className="text-[10px] tracking-wider uppercase landing-text-subtle mb-1">Total Pairs</div>
                    <div className="text-2xl font-bold landing-text-heading" style={{ fontFamily: "var(--font-heading, 'Space Grotesk'), sans-serif" }}>{totalPairs}</div>
                    
                  </div>
                  <div>
                    <div className="text-[10px] tracking-wider uppercase landing-text-subtle mb-1">24H Volume</div>
                    <div className="text-2xl font-bold landing-text-heading" style={{ fontFamily: "var(--font-heading, 'Space Grotesk'), sans-serif" }}>{formatUsd(totalVolume)}</div>
                    
                  </div>
                  <div>
                    <div className="text-[10px] tracking-wider uppercase landing-text-subtle mb-1">Total TVL</div>
                    <div className="text-2xl font-bold landing-text-heading" style={{ fontFamily: "var(--font-heading, 'Space Grotesk'), sans-serif" }}>{formatUsd(totalLiquidity)}</div>
                    
                  </div>
                </div>
                {/* Bar chart */}
                <div className="rounded-xl p-4 landing-card-inner">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-semibold landing-text-heading">Pair Performance</span>
                    <span className="rounded-full border landing-border  px-3 py-1 text-[10px] landing-text-body">24H ⌄</span>
                  </div>
                  <div className="flex items-end gap-2 h-32">
                    {mockPairs.slice(0, 5).map((p, i) => {
                      const h = Math.min(100, Math.max(20, (p.volume24h / topPair.volume24h) * 100));
                      return (
                        <div key={i} className="flex-1 rounded-t" style={{
                          height: `${h}%`,
                          background: "linear-gradient(180deg, #10b981, rgba(16,185,129,0.05))",
                        }} />
                      );
                    })}
                  </div>
                  <div className="flex gap-2 mt-2">
                    {mockPairs.slice(0, 5).map((p, i) => (
                      <div key={i} className="flex-1 text-center text-[8px] landing-text-muted truncate">{p.token0.symbol}/{p.token1.symbol}</div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right card — small */}
              <div className="lg:col-span-3 rounded-2xl p-5" style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(16, 185, 129, 0.1)",
                backdropFilter: "blur(20px)",
                boxShadow: "0 0 40px -10px rgba(16, 185, 129, 0.15)",
              }}>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] tracking-widest uppercase landing-text-subtle" style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}>Live Feed</span>
                  <span className="landing-text-muted">···</span>
                </div>
                <div className="rounded-xl p-4 mb-3" style={{ background: "linear-gradient(135deg, rgba(16,185,129,0.15), rgba(16,185,129,0.05))" }}>
                  <div className="text-2xl font-bold text-emerald-400" style={{ fontFamily: "var(--font-heading, 'Space Grotesk'), sans-serif" }}>{totalPairs}</div>
                  <div className="text-[10px] tracking-wider uppercase landing-text mt-1">Pairs Tracked</div>
                </div>
                <div className="space-y-2">
                  {mockPairs.slice(0, 2).map((p, i) => (
                    <div key={i} className="flex items-center justify-between rounded-lg p-2 landing-bg-hover">
                      <span className="text-xs landing-text-body">{p.token0.symbol}/{p.token1.symbol}</span>
                      <span className='text-xs font-bold landing-text-body'>
                        {p.volume24h > 1000 ? (p.volume24h/1000).toFixed(1) + 'K' : p.volume24h.toFixed(0)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ===== 2. BRAND MARQUEE ===== */}
          <Reveal delay={100}>
          <section className="py-8 border-y landing-border">
            <div className="max-w-5xl mx-auto px-4">
              <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12">
                {integrations.map((item, i) => (
                  <span key={i} className="text-sm font-bold tracking-wider landing-text-muted" style={{ fontFamily: "var(--font-heading, 'Space Grotesk'), sans-serif" }}>
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </section>
          </Reveal>

          {/* ===== 3. WORKFLOW STATS ===== */}
          <Reveal delay={150}>
          <section className="py-20 px-4">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-5xl font-bold tracking-tight landing-text-heading mb-3" style={{ fontFamily: "var(--font-heading, 'Space Grotesk'), sans-serif" }}>
                  Power Up Your Workflow
                </h2>
                <p className="landing-text-subtle text-sm max-w-md mx-auto">Real-time data infrastructure built for the Arc Network ecosystem</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                {workflowStats.map((s, i) => (
                  <div key={i} className="text-center">
                    <div className="text-5xl sm:text-6xl font-bold mb-2" style={{
                      fontFamily: "var(--font-heading, 'Space Grotesk'), sans-serif",
                      WebkitTextFillColor: "transparent",
                      background: "linear-gradient(135deg, #10b981, #5ee9b5)",
                      WebkitBackgroundClip: "text",
                      backgroundClip: "text",
                    }}>
                      {s.value}<span className="text-2xl">{s.suffix}</span>
                    </div>
                    <p className="landing-text-subtle text-xs max-w-[200px] mx-auto leading-relaxed">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
          </Reveal>

          {/* ===== 4. BENEFITS MARQUEE ===== */}
          <Reveal delay={100}>
          <section className="overflow-hidden border-y landing-border py-6 landing-bg-hover">
            <div className="flex gap-8 animate-marquee whitespace-nowrap">
              {[...Array(2)].map((_, dup) => marqueeItems.map((text, i) => (
                <span key={`${dup}-${i}`} className="text-2xl sm:text-3xl font-bold tracking-tight landing-text-muted" style={{ fontFamily: "var(--font-heading, 'Space Grotesk'), sans-serif" }}>
                  {text} <span className="text-emerald-500/30">●</span>
                </span>
              )))}
            </div>
          </section>
          </Reveal>

          {/* ===== 5. FEATURES ===== */}
          <Reveal delay={150}>
          <section className="py-20 sm:py-28 px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" style={{ boxShadow: "0 0 10px rgba(16,185,129,0.6)" }} />
                  <span className="text-[10px] tracking-widest uppercase landing-text-muted" style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}>Features</span>
                </div>
                <h2 className="text-3xl sm:text-5xl font-bold tracking-tight mb-4 landing-text-heading" style={{ fontFamily: "var(--font-heading, 'Space Grotesk'), sans-serif" }}>
                  Powerful Features
                </h2>
                <p className="landing-text-subtle text-sm max-w-lg mx-auto">
                  Everything you need to scan, track, and trade on Arc Network — all in one platform.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {features.map((f) => (
                  <a key={f.title} href={f.href} className="group block p-6 sm:p-8 rounded-2xl transition-all hover:-translate-y-1" style={{
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.05)",
                    backdropFilter: "blur(10px)",
                  }}>
                    <div className="flex items-center justify-between mb-6">
                      <span className="text-[10px] tracking-widest uppercase landing-text-muted" style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}>{f.num}</span>
                      <span className="rounded-full border border-emerald-500/15 bg-emerald-500/5 px-2.5 py-1 text-[9px] tracking-wider uppercase text-emerald-400">{f.badge}</span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold tracking-tight mb-4 landing-text-heading group-hover:text-emerald-400 transition-colors" style={{ fontFamily: "var(--font-heading, 'Space Grotesk'), sans-serif" }}>{f.title}</h3>
                    <p className="text-xs sm:text-sm landing-text-subtle leading-relaxed">{f.desc}</p>
                    <div className="mt-5 flex items-center gap-1.5 text-xs landing-text-muted group-hover:text-emerald-400 transition-colors">
                      <span>Open</span>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="transition-transform group-hover:translate-x-1">
                        <path d="M5 12h14M13 5l7 7-7 7" />
                      </svg>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </section>
          </Reveal>

          {/* ===== 6. ABOUT ===== */}
          <Reveal delay={150}>
          <section className="py-20 sm:py-28 px-4 border-t landing-border">
            <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" style={{ boxShadow: "0 0 10px rgba(16,185,129,0.6)" }} />
                  <span className="text-[10px] tracking-widest uppercase landing-text-muted" style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}>About</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-6 landing-text-heading" style={{ fontFamily: "var(--font-heading, 'Space Grotesk'), sans-serif" }}>
                  Smarter Trading
                </h2>
                <p className="landing-text-subtle text-sm mb-8 leading-relaxed">
                  Aperture brings real-time DEX analytics to Arc Network. Scan pairs, track swaps, manage your portfolio, and execute on-chain trades — all from a single, intuitive interface.
                </p>
                <div className="space-y-3">
                  {["Real-time pair scanner with live data", "On-chain swaps via Presto DEX", "Portfolio tracking with wallet integration", "LP farming with APY monitoring"].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <span className="text-emerald-400 text-xs">◆</span>
                      <span className="landing-text-body text-sm">{item}</span>
                    </div>
                  ))}
                </div>
                <a href="/explore" className="inline-flex items-center gap-2 mt-8 rounded-full border border-emerald-500/30 bg-emerald-500/5 px-6 py-3 text-sm font-semibold text-emerald-400 transition-all hover:bg-emerald-500/10">
                  Try for Free
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M13 5l7 7-7 7" /></svg>
                </a>
              </div>
              <div className="rounded-2xl p-6" style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.05)",
                backdropFilter: "blur(20px)",
                boxShadow: "0 0 60px -20px rgba(16, 185, 129, 0.2)",
              }}>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-semibold landing-text-heading">Top Pair Spotlight</span>
                  <span className="rounded-full border border-emerald-500/15 bg-emerald-500/5 px-2.5 py-1 text-[9px] tracking-wider uppercase text-emerald-400">Live</span>
                </div>
                <div className="rounded-xl p-4 mb-3 landing-card-inner">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg font-bold landing-text-heading">{topPair.token0.symbol}/{topPair.token1.symbol}</span>
                    <span className='text-sm font-bold landing-text-body'>{formatUsd(topPair.volume24h)}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mt-3">
                    <div>
                      <div className="text-[10px] tracking-wider uppercase landing-text-muted">Volume</div>
                      <div className="text-sm font-bold landing-text-heading">{formatUsd(topPair.volume24h)}</div>
                    </div>
                    <div>
                      <div className="text-[10px] tracking-wider uppercase landing-text-muted">Liquidity</div>
                      <div className="text-sm font-bold landing-text-heading">{formatUsd(topPair.liquidityUsd)}</div>
                    </div>
                    <div>
                      <div className="text-[10px] tracking-wider uppercase landing-text-muted">Fee</div>
                      <div className="text-sm font-bold landing-text-heading">0.3%</div>
                    </div>
                    <div>
                      <div className="text-[10px] tracking-wider uppercase landing-text-muted">Txns 24H</div>
                      <div className="text-sm font-bold landing-text-heading">{topPair.txCount24h || "—"}</div>
                    </div>
                  </div>
                </div>
                <a href={`/pair/${topPair.address}`} className="block text-center text-xs text-emerald-400 hover:text-emerald-300 transition-colors py-2">
                  View Full Details →
                </a>
              </div>
            </div>
          </section>
          </Reveal>

          {/* ===== 7. FINAL CTA ===== */}
          <Reveal delay={100}>
          <section className="relative overflow-hidden px-4 py-20 sm:py-28 border-t landing-border">
            <div className="absolute inset-0 pointer-events-none" style={{
              background: "radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.06), transparent 50%)"
            }} />
            <div className="relative z-10 text-center max-w-lg mx-auto">
              <div className="flex justify-center mb-6">
                <Image src="/aperture-logo.svg" alt="Aperture" width={56} height={56} />
              </div>
              <h2 className="text-3xl sm:text-5xl font-bold tracking-tight mb-4 landing-text-heading" style={{ fontFamily: "var(--font-heading, 'Space Grotesk'), sans-serif" }}>
                Start exploring.
              </h2>
              <p className="landing-text-subtle text-sm mb-8">
                Jump into the dashboard and track DEX pairs on Arc Network testnet.
              </p>
              <a href="/explore" className="group inline-flex items-center gap-2 rounded-full px-8 py-4 text-sm font-semibold text-black transition-all hover:-translate-y-0.5" style={{
                background: "linear-gradient(135deg, #10b981, #5ee9b5)",
                boxShadow: "0 0 30px rgba(16, 185, 129, 0.3), inset 0 1px rgba(255,255,255,0.5)",
              }}>
                Launch App
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="transition-transform group-hover:translate-x-1">
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
