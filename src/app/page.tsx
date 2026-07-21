"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { SyncBadge } from "@/components/sync-badge";
import { PairTable } from "@/components/pair-table";
import { mockPairs, lastSyncedAt } from "@/lib/mock-data";
import { formatUsd } from "@/lib/format";

function AnimatedNumber({ value, prefix = "", suffix = "" }: { value: number; prefix?: string; suffix?: string }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const duration = 1200;
    const start = performance.now();
    const step = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.round(value * eased));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [value]);
  return <span>{prefix}{formatUsd(display)}{suffix}</span>;
}

export default function Home() {
  const totalVolume = mockPairs.reduce((a, p) => a + p.volume24h, 0);
  const totalLiquidity = mockPairs.reduce((a, p) => a + p.liquidityUsd, 0);
  const totalMcap = mockPairs.reduce((a, p) => a + p.marketCapUsd, 0);
  const gainers = mockPairs.filter(p => p.priceChange24h > 0).length;

  return (
    <>
      <Header active="Explore" />
      <main className="w-full flex-1">
        {/* Hero - full width left aligned */}
        <section className="relative overflow-hidden border-b border-border/50">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/40 via-background to-background" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/20 via-transparent to-transparent" />
          <div className="relative w-full px-4 py-10 sm:py-14 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400 mb-4">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              Arc Testnet Live
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight mb-3">
              Discover & Trade{" "}
              <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
                Arc Tokens
              </span>
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base mb-5 max-w-xl mx-auto">
              Real-time analytics, on-chain swaps, and portfolio tracking for the Arc ecosystem.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <a
                href="/swap"
                className="rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-background hover:bg-emerald-600 transition-colors"
              >
                Start Swapping
              </a>
              <a
                href="#pairs"
                className="rounded-xl border border-border bg-muted/40 px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-muted transition-colors"
              >
                Explore Pairs
              </a>
            </div>
          </div>
        </section>

        {/* Stats - full width */}
        <section className="border-b border-border/50 bg-muted/10">
          <div className="w-full px-4 py-5">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-xl border border-border/50 bg-card/30 p-4">
                <div className="text-2xl font-bold text-foreground"><AnimatedNumber value={totalVolume} /></div>
                <div className="text-xs text-muted-foreground mt-1">24H Volume</div>
              </div>
              <div className="rounded-xl border border-border/50 bg-card/30 p-4">
                <div className="text-2xl font-bold text-foreground"><AnimatedNumber value={totalLiquidity} /></div>
                <div className="text-xs text-muted-foreground mt-1">Total Liquidity</div>
              </div>
              <div className="rounded-xl border border-border/50 bg-card/30 p-4">
                <div className="text-2xl font-bold text-foreground"><AnimatedNumber value={totalMcap} /></div>
                <div className="text-xs text-muted-foreground mt-1">Combined MCap</div>
              </div>
              <div className="rounded-xl border border-border/50 bg-card/30 p-4">
                <div className="text-2xl font-bold text-emerald-400">{gainers}<span className="text-muted-foreground text-lg">/{mockPairs.length}</span></div>
                <div className="text-xs text-muted-foreground mt-1">Gainers Today</div>
              </div>
            </div>
          </div>
        </section>

        {/* Pairs - full width, visible immediately */}
        <section id="pairs" className="w-full px-4 py-5">
          <div className="mb-4 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">All Pairs</h2>
              <p className="text-sm text-muted-foreground">
                <span className="text-emerald-400 font-medium">{mockPairs.length}</span> pairs across Arc network
              </p>
            </div>
            <SyncBadge syncedAt={lastSyncedAt} />
          </div>
          <PairTable pairs={mockPairs} />
        </section>
      </main>
      <Footer />
    </>
  );
}
