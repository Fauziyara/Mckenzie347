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
      <main className="flex-1">
        {/* ===== HERO ===== */}
        <section className="relative overflow-hidden min-h-screen flex items-center">
          {/* Aurora background */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0" style={{ background: "radial-gradient(circle at 18% 22%, rgba(16,185,129,0.15), transparent 32%), radial-gradient(circle at 82% 18%, rgba(255,140,0,0.06), transparent 28%), radial-gradient(circle at 52% 58%, rgba(16,185,129,0.08), transparent 34%), linear-gradient(transparent, var(--background) 82%)" }} />
            <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)", backgroundSize: "48px 48px" }} />
          </div>

          {/* Floating orbs */}
          <div className="absolute pointer-events-none" style={{
            width: "clamp(260px,38vw,560px)", height: "clamp(260px,38vw,560px)",
            top: "9vh", right: "-8vw", borderRadius: "9999px",
            background: "radial-gradient(circle, rgba(16,185,129,0.12), rgba(20,184,166,0.05) 34%, transparent 68%)",
            filter: "blur(10px)", opacity: 0.6
          }} />

          {/* Content */}
          <div className="relative z-10 w-full px-4 py-20 sm:py-28">
            <div className="max-w-5xl mx-auto">
              {/* Logo */}
              <div className="mb-8 flex justify-center">
                <Image src="/aperture-logo.svg" alt="Aperture" width={80} height={80} priority />
              </div>

              {/* Badge */}
              <div className="flex justify-center mb-6">
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-3 py-1.5 text-xs font-medium text-emerald-400" style={{ backdropFilter: "blur(14px)" }}>
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                  </span>
                  <span className="tracking-wider uppercase text-[10px] font-bold">Arc Network — Testnet Live</span>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-center text-5xl sm:text-7xl font-bold tracking-tighter mb-6" style={{ fontFamily: "var(--font-heading, 'Space Grotesk'), sans-serif" }}>
                <span className="block">The DEX Scanner</span>
                <span className="block mt-2" style={{
                  WebkitTextFillColor: "transparent",
                  background: "linear-gradient(135deg, #10b981 0%, #5ee9b5 38%, #14b8a6 74%, #f97316 100%)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                }}>
                  built on Arc.
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
                <a href="/swap" className="inline-flex items-center gap-2 rounded-full border border-border bg-transparent px-7 py-3.5 text-sm font-semibold text-foreground transition-all hover:bg-muted/50 hover:border-emerald-500/30">
                  Start Swapping
                </a>
              </div>

              {/* Floating stat cards */}
              <div className="grid grid-cols-3 gap-3 max-w-2xl mx-auto">
                {[
                  { label: "24H VOLUME", value: formatUsd(totalVolume) },
                  { label: "LIQUIDITY", value: formatUsd(totalLiquidity) },
                  { label: "DEX PAIRS", value: `${totalPairs}` },
                ].map((stat, i) => (
                  <div key={i} className="rounded-2xl p-4 text-center" style={{
                    background: "linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02)), rgba(14,14,18,0.72)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    backdropFilter: "blur(22px)",
                    boxShadow: "inset 0 1px rgba(255,255,255,0.06), 0 24px 80px rgba(0,0,0,0.2)",
                  }}>
                    <div className="text-xl sm:text-2xl font-bold text-foreground" style={{ fontFamily: "var(--font-heading, 'Space Grotesk'), sans-serif", fontVariantNumeric: "tabular-nums" }}>
                      {stat.value}
                    </div>
                    <div className="text-[9px] tracking-widest uppercase text-muted-foreground mt-1" style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}>
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ===== MARQUEE ===== */}
        <section className="overflow-hidden border-y border-border/30 py-6">
          <div className="flex gap-8 animate-[pulse_3s_ease-in-out_infinite] whitespace-nowrap">
            {["REAL-TIME ANALYTICS", "ON-CHAIN SWAPS", "PORTFOLIO TRACKING", "LIVE PULSE FEED", "DEX PAIR SCANNER", "TOKEN TRACKER", "LP FARMING"].map((text, i) => (
              <span key={i} className="text-2xl sm:text-3xl font-bold tracking-tight text-muted-foreground/30" style={{ fontFamily: "var(--font-heading, 'Space Grotesk'), sans-serif" }}>
                {text} <span className="text-emerald-500/40">●</span>
              </span>
            ))}
          </div>
        </section>

        {/* ===== FEATURES ===== */}
        <section className="py-20 sm:py-28 px-4">
          <div className="max-w-6xl mx-auto">
            {/* Section header */}
            <div className="flex items-end justify-between mb-12 pb-6 border-b border-border/30">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" style={{ boxShadow: "0 0 14px rgba(16,185,129,0.8)" }} />
                  <span className="text-[10px] tracking-widest uppercase text-muted-foreground" style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}>Features</span>
                </div>
                <h2 className="text-3xl sm:text-5xl font-bold tracking-tight" style={{ fontFamily: "var(--font-heading, 'Space Grotesk'), sans-serif" }}>
                  Everything you need.
                </h2>
              </div>
              <span className="hidden sm:block text-xs tracking-widest uppercase text-muted-foreground" style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}>
                06 modules
              </span>
            </div>

            {/* Feature grid — 3 columns with 1px gap */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.06)" }}>
              {features.map((f) => (
                <a key={f.title} href={f.href} className="group block p-6 sm:p-8 transition-all hover:bg-emerald-500/5" style={{ background: "var(--background)" }}>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-[10px] tracking-widest uppercase text-muted-foreground/50" style={{ fontFamily: "ui-monospace, SFMono-Regular, Meno, monospace" }}>
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

        {/* ===== STATS BANNER ===== */}
        <section className="px-4 py-16 border-t border-border/30">
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

        {/* ===== CTA ===== */}
        <section className="relative overflow-hidden px-4 py-20 sm:py-28 border-t border-border/30">
          {/* Glow bg */}
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