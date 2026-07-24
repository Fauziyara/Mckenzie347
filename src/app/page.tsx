import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { mockPairs } from "@/lib/mock-data";
import { formatUsd } from "@/lib/format";
import Image from "next/image";

export default function LandingPage() {
  const totalVolume = mockPairs.reduce((a, p) => a + p.volume24h, 0);
  const totalLiquidity = mockPairs.reduce((a, p) => a + p.liquidityUsd, 0);
  const totalPairs = mockPairs.length;
  const totalTx = mockPairs.reduce((a, p) => a + p.txCount24h, 0);
  const gainers = mockPairs.filter(p => p.priceChange24h > 0).length;
  const topPair = [...mockPairs].sort((a, b) => b.volume24h - a.volume24h)[0];

  const features = [
    { num: "01", title: "Explore", desc: "Browse all DEX pairs on Arc testnet with real-time liquidity, volume, and price data.", href: "/explore", badge: "Live", icon: "grid" },
    { num: "02", title: "Pulse", desc: "Real-time swap feed with animated entries. Never miss a trade on Arc Network.", href: "/pulse", badge: "Real-time", icon: "activity" },
    { num: "03", title: "Tracker", desc: "Search any token or pair by contract address or symbol. Quick lookup, instant results.", href: "/pelacak", badge: "Search", icon: "search" },
    { num: "04", title: "Swap", desc: "On-chain swaps via Presto DEX with percentage presets and slippage control.", href: "/swap", badge: "On-chain", icon: "swap" },
    { num: "05", title: "Portfolio", desc: "Track wallet balance, token holdings, and transaction history in one place.", href: "/portofolio", badge: "Wallet", icon: "wallet" },
    { num: "06", title: "Earn", desc: "Stake LP tokens and farm rewards. Monitor APY, TVL, and reward pools.", href: "/earn", badge: "Farming", icon: "farm" },
  ];

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

  // Live activity feed (mock recent swaps)
  const liveActivity = [
    { pair: "tUSDC / tETH", type: "Buy", amount: "$1,240", time: "2s ago", addr: "0x4a...8b2c" },
    { pair: "tUSDC / tARC", type: "Sell", amount: "$580", time: "14s ago", addr: "0x7f...3e1d" },
    { pair: "tETH / tUSDC", type: "Buy", amount: "$3,200", time: "38s ago", addr: "0x2c...9a4f" },
    { pair: "tUSDC / tBTC", type: "Buy", amount: "$890", time: "1m ago", addr: "0x9d...6b2e" },
    { pair: "tARC / tUSDC", type: "Sell", amount: "$2,100", time: "2m ago", addr: "0x1e...5c7d" },
    { pair: "tUSDC / tETH", type: "Buy", amount: "$4,500", time: "3m ago", addr: "0x8a...2f3b" },
  ];

  // LP opportunities
  const lpPools = [
    { pair: "tUSDC / tETH", apy: "24.5%", tvl: "$890K", reward: "0.5% per swap" },
    { pair: "tUSDC / tARC", apy: "42.8%", tvl: "$320K", reward: "0.8% per swap" },
    { pair: "tETH / tUSDC", apy: "18.2%", tvl: "$1.2M", reward: "0.3% per swap" },
  ];

  return (
    <>
      <Header />
      <main className="flex-1">
        {/* ===== HERO ===== */}
        <section className="relative overflow-hidden min-h-screen flex items-center pt-20">
          {/* Aurora background */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0" style={{
              background: "radial-gradient(circle at 18% 22%, rgba(16,185,129,0.15), transparent 32%), radial-gradient(circle at 82% 18%, rgba(249,115,22,0.06), transparent 28%), radial-gradient(circle at 52% 58%, rgba(20,184,166,0.08), transparent 34%), linear-gradient(transparent, var(--background) 82%)"
            }} />
            <div className="absolute inset-0" style={{
              backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
              backgroundSize: "48px 48px"
            }} />
          </div>

          {/* Floating orbs */}
          <div className="absolute pointer-events-none" style={{
            width: "clamp(260px,38vw,560px)", height: "clamp(260px,38vw,560px)",
            top: "9vh", right: "-8vw", borderRadius: "9999px",
            background: "radial-gradient(circle, rgba(16,185,129,0.12), rgba(20,184,166,0.05) 34%, transparent 68%)",
            filter: "blur(10px)", opacity: 0.6
          }} />
          <div className="absolute pointer-events-none" style={{
            width: "clamp(220px,30vw,440px)", height: "clamp(220px,30vw,440px)",
            bottom: "-12vh", left: "42vw", borderRadius: "9999px",
            background: "radial-gradient(circle, rgba(249,115,22,0.06), rgba(16,185,129,0.04) 42%, transparent 70%)",
            filter: "blur(10px)", opacity: 0.5
          }} />

          {/* Content */}
          <div className="relative z-10 w-full px-4 py-20 sm:py-28">
            <div className="max-w-6xl mx-auto">
              {/* Logo + Badge */}
              <div className="flex flex-col items-center mb-8">
                <Image src="/aperture-logo.svg" alt="Aperture" width={72} height={72} priority className="mb-6" />
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-3 py-1.5 text-xs font-medium text-emerald-400" style={{ backdropFilter: "blur(14px)" }}>
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                  </span>
                  <span className="tracking-wider uppercase text-[10px] font-bold">Arc Network — Testnet Live</span>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-center text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tighter mb-6" style={{ fontFamily: "var(--font-heading, 'Space Grotesk'), sans-serif" }}>
                <span className="block">Elevate Your</span>
                <span className="block mt-2" style={{
                  WebkitTextFillColor: "transparent",
                  background: "linear-gradient(135deg, #10b981 0%, #5ee9b5 38%, #14b8a6 74%, #f97316 100%)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                }}>
                  DEX Experience
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-center text-muted-foreground text-sm sm:text-base mb-10 max-w-2xl mx-auto leading-relaxed" style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}>
                Real-time analytics · on-chain swaps · portfolio tracking<br />
                Everything you need to navigate DEX pairs on Arc Network.
              </p>

              {/* CTA */}
              <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
                <a href="/explore" className="group inline-flex items-center gap-2 rounded-full bg-emerald-500 px-7 py-3.5 text-sm font-semibold text-black transition-all hover:bg-emerald-400 hover:-translate-y-0.5" style={{ boxShadow: "0 16px 46px rgba(16,185,129,0.25), inset 0 1px rgba(255,255,255,0.5)" }}>
                  Launch App
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="transition-transform group-hover:translate-x-0.5">
                    <path d="M5 12h14M13 5l7 7-7 7" />
                  </svg>
                </a>
                <a href="/pulse" className="inline-flex items-center gap-2 rounded-full border border-border bg-transparent px-7 py-3.5 text-sm font-semibold text-foreground transition-all hover:bg-muted/50 hover:border-emerald-500/30">
                  View Live Pulse
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ===== STATS COUNTER ===== */}
        <section className="relative px-4 py-16 border-y border-border/30" style={{ background: "linear-gradient(180deg, transparent, rgba(16,185,129,0.02), transparent)" }}>
          <div className="max-w-5xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl sm:text-5xl font-bold tracking-tight" style={{
                  fontFamily: "var(--font-heading, 'Space Grotesk'), sans-serif",
                  fontVariantNumeric: "tabular-nums",
                  WebkitTextFillColor: "transparent",
                  background: "linear-gradient(135deg, #10b981, #5ee9b5)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                }}>
                  {stat.value}{stat.suffix}
                </div>
                <div className="text-[10px] tracking-widest uppercase text-muted-foreground mt-2" style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ===== MARQUEE ===== */}
        <section className="overflow-hidden border-b border-border/30 py-6">
          <div className="flex gap-8 animate-marquee whitespace-nowrap">
            {[...Array(2)].map((_, dup) => marqueeItems.map((text, i) => (
              <span key={`${dup}-${i}`} className="text-2xl sm:text-3xl font-bold tracking-tight text-muted-foreground/30" style={{ fontFamily: "var(--font-heading, 'Space Grotesk'), sans-serif" }}>
                {text} <span className="text-emerald-500/40">●</span>
              </span>
            )))}
          </div>
        </section>

        {/* ===== FEATURES ===== */}
        <section className="py-20 sm:py-28 px-4">
          <div className="max-w-6xl mx-auto">
            {/* Section header */}
            <div className="text-center mb-16">
              <div className="flex items-center justify-center gap-2 mb-3">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" style={{ boxShadow: "0 0 14px rgba(16,185,129,0.8)" }} />
                <span className="text-[10px] tracking-widest uppercase text-muted-foreground" style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}>Features</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-bold tracking-tight mb-4" style={{ fontFamily: "var(--font-heading, 'Space Grotesk'), sans-serif" }}>
                Powerful Tools for<br className="sm:hidden" /> DEX Trading
              </h2>
              <p className="text-muted-foreground text-sm max-w-lg mx-auto">
                Everything you need to scan, track, and trade on Arc Network — all in one platform.
              </p>
            </div>

            {/* Feature grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.06)" }}>
              {features.map((f) => (
                <a key={f.title} href={f.href} className="group block p-6 sm:p-8 transition-all hover:bg-emerald-500/5" style={{ background: "var(--background)" }}>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-[10px] tracking-widest uppercase text-muted-foreground/50" style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}>
                      {f.num}
                    </span>
                    <span className="rounded-full border border-emerald-500/20 bg-emerald-500/5 px-2.5 py-1 text-[9px] tracking-wider uppercase text-emerald-400">
                      {f.badge}
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold tracking-tight mb-4 group-hover:text-emerald-400 transition-colors" style={{ fontFamily: "var(--font-heading, 'Space Grotesk'), sans-serif" }}>
                    {f.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {f.desc}
                  </p>
                  <div className="mt-5 flex items-center gap-1.5 text-xs text-muted-foreground/50 group-hover:text-emerald-400 transition-colors">
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

        {/* ===== TOP PAIR SPOTLIGHT ===== */}
        <section className="px-4 py-16 border-t border-border/30">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-2 mb-8">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" style={{ boxShadow: "0 0 14px rgba(16,185,129,0.8)" }} />
              <span className="text-[10px] tracking-widest uppercase text-muted-foreground" style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}>Top Pair</span>
            </div>
            <div className="rounded-3xl p-8 sm:p-12 text-center" style={{
              background: "linear-gradient(135deg, rgba(16,185,129,0.08), rgba(20,184,166,0.04))",
              border: "1px solid rgba(16,185,129,0.15)",
              backdropFilter: "blur(22px)",
            }}>
              <div className="text-sm text-muted-foreground mb-2" style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}>
                {topPair.token0.symbol} / {topPair.token1.symbol}
              </div>
              <div className="text-4xl sm:text-6xl font-bold tracking-tight mb-6" style={{ fontFamily: "var(--font-heading, 'Space Grotesk'), sans-serif" }}>
                {formatUsd(topPair.volume24h)}
              </div>
              <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-12 text-xs" style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}>
                <div>
                  <span className="text-muted-foreground tracking-wider uppercase text-[10px] block mb-1">Liquidity</span>
                  <span className="text-foreground font-bold">{formatUsd(topPair.liquidityUsd)}</span>
                </div>
                <div>
                  <span className="text-muted-foreground tracking-wider uppercase text-[10px] block mb-1">24H Tx</span>
                  <span className="text-foreground font-bold">{topPair.txCount24h}</span>
                </div>
                <div>
                  <span className="text-muted-foreground tracking-wider uppercase text-[10px] block mb-1">Change</span>
                  <span className={`font-bold ${topPair.priceChange24h >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                    {topPair.priceChange24h >= 0 ? "+" : ""}{topPair.priceChange24h.toFixed(2)}%
                  </span>
                </div>
              </div>
              <a href={`/pair/${topPair.address}`} className="mt-8 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-6 py-3 text-sm font-semibold text-emerald-400 transition-all hover:bg-emerald-500/20 hover:-translate-y-0.5">
                View Pair Details
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M13 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>
        </section>

        {/* ===== LP OPPORTUNITIES ===== */}
        <section className="py-20 sm:py-28 px-4 border-t border-border/30">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-2 mb-3">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" style={{ boxShadow: "0 0 14px rgba(16,185,129,0.8)" }} />
                <span className="text-[10px] tracking-widest uppercase text-muted-foreground" style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}>Earn</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-bold tracking-tight mb-4" style={{ fontFamily: "var(--font-heading, 'Space Grotesk'), sans-serif" }}>
                LP Opportunities
              </h2>
              <p className="text-muted-foreground text-sm max-w-lg mx-auto">
                Provide liquidity and earn rewards from trading fees on Arc Network.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {lpPools.map((pool, i) => (
                <div key={i} className="rounded-2xl p-6 transition-all hover:-translate-y-1" style={{
                  background: "linear-gradient(135deg, rgba(255,255,255,0.04), transparent)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-bold" style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}>
                      {pool.pair}
                    </span>
                    <span className="rounded-full border border-emerald-500/20 bg-emerald-500/5 px-2.5 py-1 text-[9px] tracking-wider uppercase text-emerald-400">
                      Active
                    </span>
                  </div>
                  <div className="text-3xl font-bold text-emerald-400 mb-4" style={{ fontFamily: "var(--font-heading, 'Space Grotesk'), sans-serif" }}>
                    {pool.apy}
                    <span className="text-xs text-muted-foreground ml-1">APY</span>
                  </div>
                  <div className="space-y-2 text-xs" style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">TVL</span>
                      <span className="text-foreground font-bold">{pool.tvl}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Fee</span>
                      <span className="text-foreground font-bold">{pool.reward}</span>
                    </div>
                  </div>
                  <a href="/earn" className="mt-5 block text-center rounded-full border border-border py-2.5 text-xs font-semibold text-foreground transition-all hover:border-emerald-500/30 hover:bg-emerald-500/5 hover:text-emerald-400">
                    Stake LP
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== LIVE ACTIVITY FEED ===== */}
        <section className="py-20 sm:py-28 px-4 border-t border-border/30">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-2 mb-3">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="text-[10px] tracking-widest uppercase text-emerald-400" style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}>Live Activity</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-bold tracking-tight mb-4" style={{ fontFamily: "var(--font-heading, 'Space Grotesk'), sans-serif" }}>
                Recent Swaps
              </h2>
              <p className="text-muted-foreground text-sm">
                Real-time DEX transactions on Arc Network testnet.
              </p>
            </div>

            <div className="space-y-2">
              {liveActivity.map((tx, i) => (
                <div key={i} className="flex items-center justify-between rounded-xl px-4 py-3 transition-all hover:bg-muted/30" style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.04)",
                }}>
                  <div className="flex items-center gap-3">
                    <span className={`inline-flex items-center justify-center rounded-full w-8 h-8 text-[10px] font-bold ${tx.type === "Buy" ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}`}>
                      {tx.type === "Buy" ? "↑" : "↓"}
                    </span>
                    <div>
                      <div className="text-sm font-bold">{tx.pair}</div>
                      <div className="text-[10px] text-muted-foreground" style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}>
                        {tx.addr} · {tx.time}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-bold ${tx.type === "Buy" ? "text-emerald-400" : "text-red-400"}`}>
                      {tx.type}
                    </div>
                    <div className="text-xs text-muted-foreground" style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}>
                      {tx.amount}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-8">
              <a href="/pulse" className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400 hover:underline" style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}>
                View All Transactions
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M13 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>
        </section>

        {/* ===== STATS BANNER ===== */}
        <section className="px-4 py-16 border-t border-border/30" style={{ background: "linear-gradient(180deg, transparent, rgba(16,185,129,0.02), transparent)" }}>
          <div className="max-w-4xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "24H Volume", value: formatUsd(totalVolume) },
              { label: "Total Liquidity", value: formatUsd(totalLiquidity) },
              { label: "Gainers Today", value: `${gainers}/${totalPairs}` },
              { label: "24H Transactions", value: `${totalTx.toLocaleString()}` },
            ].map((stat, i) => (
              <div key={i} className="rounded-2xl p-5 text-center" style={{
                background: "linear-gradient(135deg, rgba(255,255,255,0.04), transparent)",
                border: "1px solid rgba(255,255,255,0.05)",
              }}>
                <div className="text-lg sm:text-2xl font-bold text-foreground" style={{ fontFamily: "var(--font-heading, 'Space Grotesk'), sans-serif" }}>
                  {stat.value}
                </div>
                <div className="text-[9px] tracking-widest uppercase text-muted-foreground mt-1.5" style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ===== FINAL CTA ===== */}
        <section className="relative overflow-hidden px-4 py-20 sm:py-28 border-t border-border/30">
          <div className="absolute inset-0 pointer-events-none" style={{
            background: "radial-gradient(circle at 50% 50%, rgba(16,185,129,0.08), transparent 50%)"
          }} />
          <div className="relative z-10 text-center max-w-lg mx-auto">
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" style={{ boxShadow: "0 0 14px rgba(16,185,129,0.8)" }} />
              <span className="text-[10px] tracking-widest uppercase text-muted-foreground" style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}>
                Ready
              </span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight mb-4" style={{ fontFamily: "var(--font-heading, 'Space Grotesk'), sans-serif" }}>
              Start exploring.
            </h2>
            <p className="text-muted-foreground text-sm mb-8">
              Jump into the dashboard and track DEX pairs on Arc Network testnet.
            </p>
            <a href="/explore" className="group inline-flex items-center gap-2 rounded-full bg-emerald-500 px-8 py-4 text-sm font-semibold text-black transition-all hover:bg-emerald-400 hover:-translate-y-0.5" style={{ boxShadow: "0 16px 46px rgba(16,185,129,0.25), inset 0 1px rgba(255,255,255,0.5)" }}>
              Launch App
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="transition-transform group-hover:translate-x-1">
                <path d="M5 12h14M13 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}