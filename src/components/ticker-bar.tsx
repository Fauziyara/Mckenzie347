"use client";

import { useEffect, useState } from "react";
import { mockPairs } from "@/lib/mock-data";

export function TickerBar() {
  const [tickers, setTickers] = useState<{ symbol: string; mcap: string; change: number }[]>([]);

  useEffect(() => {
    // Build ticker from mock pairs - sort by 5m change desc
    const sorted = [...mockPairs]
      .sort((a, b) => b.priceChange5m - a.priceChange5m)
      .slice(0, 15)
      .map(p => ({
        symbol: p.token0.symbol,
        mcap: p.marketCapUsd >= 1e9 ? `$${(p.marketCapUsd / 1e9).toFixed(2)}B` : p.marketCapUsd >= 1e6 ? `$${(p.marketCapUsd / 1e6).toFixed(2)}M` : `$${(p.marketCapUsd / 1e3).toFixed(1)}K`,
        change: p.priceChange5m,
      }));

    // Duplicate for seamless loop
    setTickers([...sorted, ...sorted]);
  }, []);

  if (tickers.length === 0) return null;

  return (
    <div className="relative overflow-hidden border-b border-border bg-muted/30">
      <div className="flex items-center">
        {/* Left label */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 border-r border-border bg-background/50 flex-shrink-0 z-10">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-amber-400">
            <path d="M3 17l6-6 4 4 8-8M21 7v6h-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-[10px] font-semibold text-amber-400 uppercase tracking-wide">Gainers</span>
        </div>

        {/* Marquee */}
        <div className="flex animate-marquee whitespace-nowrap">
          {tickers.map((t, i) => (
            <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 flex-shrink-0">
              <span className="text-xs font-semibold text-foreground">{t.symbol}</span>
              <span className="text-xs text-muted-foreground">{t.mcap}</span>
              <span className={`text-xs font-medium ${t.change >= 0 ? "text-amber-400" : "text-red-400"}`}>
                {t.change >= 0 ? "+" : ""}{t.change.toFixed(1)}%
              </span>
              <span className="text-muted-foreground/30 ml-1">|</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
