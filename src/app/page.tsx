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

function MiniSparkline({ data, positive }: { data: number[]; positive: boolean }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const points = data.map((v, i) => `${(i / (data.length - 1)) * 60},${20 - ((v - min) / range) * 16}`).join(" ");

  return (
    <svg width="60" height="20" className="opacity-60">
      <polyline
        points={points}
        fill="none"
        stroke={positive ? "#fbbf24" : "#f87171"}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Home() {
  const totalVolume = mockPairs.reduce((a, p) => a + p.volume24h, 0);
  const totalLiquidity = mockPairs.reduce((a, p) => a + p.liquidityUsd, 0);
  const totalMcap = mockPairs.reduce((a, p) => a + p.marketCapUsd, 0);
  const gainers = mockPairs.filter(p => p.priceChange24h > 0).length;

  // Mock sparkline data for stats
  const volumeSpark = [12, 15, 14, 18, 22, 19, 24, 21, 26, 28];
  const liquiditySpark = [8, 10, 12, 11, 14, 15, 13, 16, 18, 17];
  const mcapSpark = [20, 22, 25, 24, 28, 30, 29, 32, 35, 34];

  return (
    <>
      <Header active="Explore" />
      <main className="w-full flex-1">
        {/* Hero — asymmetric left-aligned */}
        <section className="relative overflow-hidden border-b border-border/50">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-950/20 via-background to-background" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_left,_var(--tw-gradient-stops))] from-amber-900/15 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-dot-grid-amber" />
          <div className="relative w-full px-4 py-12 sm:py-16">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-400 mb-6 animate-fade-in">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
                </span>
                Arc Testnet Live
              </div>
              <h1 className="text-4xl sm:text-6xl font-bold tracking-tight mb-4 animate-fade-in-up">
                Discover & Trade{" "}
                <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 bg-clip-text text-transparent">
                  Arc Tokens
                </span>
              </h1>
              <p className="text-muted-foreground text-base sm:text-lg mb-8 max-w-lg animate-fade-in-up stagger-1">
                Real-time analytics, on-chain swaps, and portfolio tracking for the Arc ecosystem.
              </p>
              <div className="flex flex-wrap items-center gap-3 animate-fade-in-up stagger-2">
                <a
                  href="/swap"
                  className="btn-lift rounded-xl bg-amber-500 px-6 py-3 text-sm font-semibold text-background hover:bg-amber-400 transition-colors"
                >
                  Start Swapping
                </a>
                <a
                  href="#pairs"
                  className="btn-lift rounded-xl border border-border bg-muted/40 px-6 py-3 text-sm font-semibold text-foreground hover:bg-muted transition-colors"
                >
                  Explore Pairs
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Stats — full width with mini sparklines */}
        <section className="border-b border-border/50 bg-muted/10">
          <div className="w-full px-4 py-6">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="stat-card-glow rounded-xl border border-border/50 bg-card/30 p-4 animate-fade-in-up stagger-1">
                <div className="flex items-end justify-between">
                  <div>
                    <div className="text-2xl font-bold text-foreground"><AnimatedNumber value={totalVolume} /></div>
                    <div className="text-xs text-muted-foreground mt-1">24H Volume</div>
                  </div>
                  <MiniSparkline data={volumeSpark} positive={true} />
                </div>
              </div>
              <div className="stat-card-glow rounded-xl border border-border/50 bg-card/30 p-4 animate-fade-in-up stagger-2">
                <div className="flex items-end justify-between">
                  <div>
                    <div className="text-2xl font-bold text-foreground"><AnimatedNumber value={totalLiquidity} /></div>
                    <div className="text-xs text-muted-foreground mt-1">Total Liquidity</div>
                  </div>
                  <MiniSparkline data={liquiditySpark} positive={true} />
                </div>
              </div>
              <div className="stat-card-glow rounded-xl border border-border/50 bg-card/30 p-4 animate-fade-in-up stagger-3">
                <div className="flex items-end justify-between">
                  <div>
                    <div className="text-2xl font-bold text-foreground"><AnimatedNumber value={totalMcap} /></div>
                    <div className="text-xs text-muted-foreground mt-1">Combined MCap</div>
                  </div>
                  <MiniSparkline data={mcapSpark} positive={true} />
                </div>
              </div>
              <div className="stat-card-glow rounded-xl border border-border/50 bg-card/30 p-4 animate-fade-in-up stagger-4">
                <div className="flex items-end justify-between">
                  <div>
                    <div className="text-2xl font-bold text-amber-400">{gainers}<span className="text-muted-foreground text-lg">/{mockPairs.length}</span></div>
                    <div className="text-xs text-muted-foreground mt-1">Gainers Today</div>
                  </div>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500/20">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-amber-400">
                      <path d="M23 6l-9.5 9.5-5-5L1 18" />
                      <path d="M17 6h6v6" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pairs — full width */}
        <section id="pairs" className="w-full px-4 py-6">
          <div className="mb-5 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">All Pairs</h2>
              <p className="text-sm text-muted-foreground">
                <span className="text-amber-400 font-medium">{mockPairs.length}</span> pairs across Arc network
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
