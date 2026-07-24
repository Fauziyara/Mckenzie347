import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { mockPairs } from "@/lib/mock-data";
import { formatUsd } from "@/lib/format";
import Image from "next/image";

export default function LandingPage() {
  const totalVolume = mockPairs.reduce((a, p) => a + p.volume24h, 0);
  const totalLiquidity = mockPairs.reduce((a, p) => a + p.liquidityUsd, 0);
  const totalPairs = mockPairs.length;
  const gainers = mockPairs.filter(p => p.priceChange24h > 0).length;

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

  return (
    <>
      <Header />
      <main className="flex-1 intellio-grain">
        {/* ===== HERO — Intellio style ===== */}
        <section className="intellio-hero min-h-screen flex items-center pt-20 relative">
          {/* Content */}
          <div className="relative z-10 w-full px-4 py-20 sm:py-28">
            <div className="max-w-6xl mx-auto">
              {/* Logo + Badge */}
              <div className="flex flex-col items-center mb-8">
                <Image src="/aperture-logo.svg" alt="Aperture" width={72} height={72} priority className="mb-6 intellio-float" />
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
                <span className="block text-white">Elevate Your</span>
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
              <p className="text-center text-white/70 text-sm sm:text-base mb-10 max-w-2xl mx-auto leading-relaxed" style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}>
                Real-time analytics · on-chain swaps · portfolio tracking<br />
                Everything you need to navigate DEX pairs on Arc Network.
              </p>

              {/* CTA */}
              <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
                <a href="/explore" className="group inline-flex items-center gap-2 rounded-full bg-emerald-500 px-7 py-3.5 text-sm font-semibold text-black transition-all hover:bg-emerald-400 hover:-translate-y-0.5" style={{ boxShadow: "0 16px 46px rgba(16,185,129,0.35), inset 0 1px rgba(255,255,255,0.5)" }}>
                  Launch App
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="transition-transform group-hover:translate-x-0.5">
                    <path d="M5 12h14M13 5l7 7-7 7" />
                  </svg>
                </a>
                <a href="/pulse" className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white transition-all hover:bg-white/10 hover:border-emerald-500/30" style={{ backdropFilter: "blur(10px)" }}>
                  View Live Pulse
                </a>
              </div>
            </div>
          </div>

          {/* Scroll cue */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10">
            <span className="text-[10px] tracking-widest uppercase text-white/40" style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}>Scroll</span>
            <div className="relative w-px h-9 bg-white/20 overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full bg-emerald-500" style={{ animation: "scroll-bar 1.8s ease-in-out infinite" }} />
            </div>
          </div>
        </section>

        {/* ===== STATS COUNTER ===== */}
        <section className="intellio-stats-bg px-4 py-16 border-y border-white/5">
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
                <div className="text-[10px] tracking-widest uppercase text-white/40 mt-2" style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ===== MARQUEE ===== */}
        <section className="intellio-marquee-bg overflow-hidden border-b border-white/5 py-6">
          <div className="flex gap-8 animate-marquee whitespace-nowrap">
            {[...Array(2)].map((_, dup) => marqueeItems.map((text, i) => (
              <span key={`${dup}-${i}`} className="text-2xl sm:text-3xl font-bold tracking-tight text-white/15" style={{ fontFamily: "var(--font-heading, 'Space Grotesk'), sans-serif" }}>
                {text} <span className="text-emerald-500/40">●</span>
              </span>
            )))}
          </div>
        </section>

        {/* ===== FEATURES ===== */}
        <section className="intellio-section py-20 sm:py-28 px-4">
          <div className="max-w-6xl mx-auto">
            {/* Section header */}
            <div className="text-center mb-16">
              <div className="flex items-center justify-center gap-2 mb-3">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" style={{ boxShadow: "0 0 14px rgba(16,185,129,0.8)" }} />
                <span className="text-[10px] tracking-widest uppercase text-white/40" style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}>Features</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-bold tracking-tight mb-4 text-white" style={{ fontFamily: "var(--font-heading, 'Space Grotesk'), sans-serif" }}>
                Powerful Tools for<br className="sm:hidden" /> DEX Trading
              </h2>
              <p className="text-white/50 text-sm max-w-lg mx-auto">
                Everything you need to scan, track, and trade on Arc Network — all in one platform.
              </p>
            </div>

            {/* Feature grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.06)" }}>
              {features.map((f) => (
                <a key={f.title} href={f.href} className="intellio-feature-card group block p-6 sm:p-8" style={{ background: "var(--background)" }}>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-[10px] tracking-widest uppercase text-white/30" style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}>
                      {f.num}
                    </span>
                    <span className="rounded-full border border-emerald-500/20 bg-emerald-500/5 px-2.5 py-1 text-[9px] tracking-wider uppercase text-emerald-400">
                      {f.badge}
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold tracking-tight mb-4 text-white group-hover:text-emerald-400 transition-colors" style={{ fontFamily: "var(--font-heading, 'Space Grotesk'), sans-serif" }}>
                    {f.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-white/50 leading-relaxed">
                    {f.desc}
                  </p>
                  <div className="mt-5 flex items-center gap-1.5 text-xs text-white/30 group-hover:text-emerald-400 transition-colors">
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

        {/* ===== STATS BANNER ===== */}
        <section className="intellio-stats-bg px-4 py-16 border-t border-white/5">
          <div className="max-w-4xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "24H Volume", value: formatUsd(totalVolume) },
              { label: "Total Liquidity", value: formatUsd(totalLiquidity) },
              { label: "Gainers Today", value: `${gainers}/${totalPairs}` },
              { label: "Network", value: "Arc Testnet" },
            ].map((stat, i) => (
              <div key={i} className="rounded-2xl p-5 text-center" style={{
                background: "linear-gradient(135deg, rgba(255,255,255,0.04), transparent)",
                border: "1px solid rgba(255,255,255,0.05)",
              }}>
                <div className="text-lg sm:text-2xl font-bold text-white" style={{ fontFamily: "var(--font-heading, 'Space Grotesk'), sans-serif" }}>
                  {stat.value}
                </div>
                <div className="text-[9px] tracking-widest uppercase text-white/40 mt-1.5" style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ===== FINAL CTA ===== */}
        <section className="intellio-cta-bg relative overflow-hidden px-4 py-20 sm:py-28 border-t border-white/5">
          <div className="relative z-10 text-center max-w-lg mx-auto">
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" style={{ boxShadow: "0 0 14px rgba(16,185,129,0.8)" }} />
              <span className="text-[10px] tracking-widest uppercase text-white/40" style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}>
                Ready
              </span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight mb-4 text-white" style={{ fontFamily: "var(--font-heading, 'Space Grotesk'), sans-serif" }}>
              Start exploring.
            </h2>
            <p className="text-white/50 text-sm mb-8">
              Jump into the dashboard and track DEX pairs on Arc Network testnet.
            </p>
            <a href="/explore" className="group inline-flex items-center gap-2 rounded-full bg-emerald-500 px-8 py-4 text-sm font-semibold text-black transition-all hover:bg-emerald-400 hover:-translate-y-0.5" style={{ boxShadow: "0 16px 46px rgba(16,185,129,0.35), inset 0 1px rgba(255,255,255,0.5)" }}>
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