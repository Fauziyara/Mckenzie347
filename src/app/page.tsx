import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { mockPairs } from "@/lib/mock-data";
import { formatUsd } from "@/lib/format";
import Image from "next/image";

export default function LandingPage() {
  const totalVolume = mockPairs.reduce((a, p) => a + p.volume24h, 0);
  const totalLiquidity = mockPairs.reduce((a, p) => a + p.liquidityUsd, 0);
  const totalPairs = mockPairs.length;

  const features = [
    {
      icon: "📊",
      title: "Explore Pairs",
      desc: "Browse all DEX pairs on Arc testnet with real-time liquidity, volume, and price data.",
      href: "/explore",
    },
    {
      icon: "⚡",
      title: "Live Pulse",
      desc: "Real-time swap feed with animated entries — never miss a trade on Arc Network.",
      href: "/pulse",
    },
    {
      icon: "🔍",
      title: "Token Tracker",
      desc: "Search any token or pair by contract address or symbol. Quick lookup, instant results.",
      href: "/pelacak",
    },
    {
      icon: "🔄",
      title: "On-chain Swap",
      desc: "Swap tokens directly via Presto DEX with percentage-based presets and slippage control.",
      href: "/swap",
    },
    {
      icon: "💼",
      title: "Portfolio",
      desc: "Track your wallet balance, token holdings, and transaction history in one place.",
      href: "/portofolio",
    },
    {
      icon: "🌾",
      title: "Earn",
      desc: "Stake LP tokens and farm rewards. Monitor APY, TVL, and reward pools.",
      href: "/earn",
    },
  ];

  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/40 via-background to-background" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/20 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-dot-grid-emerald" />
          <div className="relative w-full px-4 py-20 sm:py-28 text-center">
            {/* Logo */}
            <div className="mb-6 flex justify-center">
              <Image
                src="/aperture-logo.svg"
                alt="Aperture"
                width={72}
                height={72}
                priority
              />
            </div>

            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400 mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              Arc Network — Testnet Live
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight mb-4">
              The DEX Scanner{" "}
              <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
                for Arc Network
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-muted-foreground text-base sm:text-lg mb-8 max-w-2xl mx-auto">
              Real-time analytics, on-chain swaps, and portfolio tracking.
              Everything you need to navigate DEX pairs on Arc Network — in one dashboard.
            </p>

            {/* CTA */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <a
                href="/explore"
                className="btn-lift rounded-xl bg-emerald-500 px-6 py-3 text-sm font-semibold text-background hover:bg-emerald-600 transition-colors"
              >
                Launch App →
              </a>
              <a
                href="/swap"
                className="btn-lift rounded-xl border border-border bg-muted/40 px-6 py-3 text-sm font-semibold text-foreground hover:bg-muted transition-colors"
              >
                Start Swapping
              </a>
            </div>

            {/* Stats */}
            <div className="mt-16 flex flex-wrap items-center justify-center gap-8 sm:gap-12">
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-foreground">{formatUsd(totalVolume)}</div>
                <div className="text-xs text-muted-foreground mt-1">24H Volume</div>
              </div>
              <div className="h-8 w-px bg-border" />
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-foreground">{formatUsd(totalLiquidity)}</div>
                <div className="text-xs text-muted-foreground mt-1">Total Liquidity</div>
              </div>
              <div className="h-8 w-px bg-border" />
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-emerald-400">{totalPairs}</div>
                <div className="text-xs text-muted-foreground mt-1">DEX Pairs</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="border-t border-border/50 bg-muted/5">
          <div className="w-full px-4 py-16 sm:py-20">
            <div className="mb-10 text-center">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
                Everything you need
              </h2>
              <p className="text-muted-foreground text-sm">
                A complete toolkit for DEX trading on Arc Network
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
              {features.map((f) => (
                <a
                  key={f.title}
                  href={f.href}
                  className="group rounded-xl border border-border/50 bg-card/30 p-5 transition-all hover:border-emerald-500/30 hover:bg-emerald-500/5"
                >
                  <div className="mb-3 text-2xl">{f.icon}</div>
                  <h3 className="font-semibold text-sm text-foreground mb-1.5 group-hover:text-emerald-400 transition-colors">
                    {f.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {f.desc}
                  </p>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Bottom */}
        <section className="border-t border-border/50">
          <div className="w-full px-4 py-16 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">
              Ready to explore?
            </h2>
            <p className="text-muted-foreground text-sm mb-6 max-w-lg mx-auto">
              Jump into the dashboard and start tracking DEX pairs on Arc Network testnet.
            </p>
            <a
              href="/explore"
              className="btn-lift inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 text-sm font-semibold text-background hover:bg-emerald-600 transition-colors"
            >
              Launch App
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
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