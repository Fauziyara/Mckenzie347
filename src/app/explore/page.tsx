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
        {/* Stats - full width */}
        <section className="border-b border-border/50 bg-muted/10">
          <div className="w-full px-4 py-5">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="stat-card-glow rounded-xl border border-border/50 bg-card/30 p-4">
                <div className="text-2xl font-bold text-foreground"><AnimatedNumber value={totalVolume} /></div>
                <div className="text-xs text-muted-foreground mt-1">24H Volume</div>
              </div>
              <div className="stat-card-glow rounded-xl border border-border/50 bg-card/30 p-4">
                <div className="text-2xl font-bold text-foreground"><AnimatedNumber value={totalLiquidity} /></div>
                <div className="text-xs text-muted-foreground mt-1">Total Liquidity</div>
              </div>
              <div className="stat-card-glow rounded-xl border border-border/50 bg-card/30 p-4">
                <div className="text-2xl font-bold text-foreground"><AnimatedNumber value={totalMcap} /></div>
                <div className="text-xs text-muted-foreground mt-1">Combined MCap</div>
              </div>
              <div className="stat-card-glow rounded-xl border border-border/50 bg-card/30 p-4">
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
