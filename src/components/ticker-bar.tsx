"use client";

import { useEffect, useState } from "react";

export function TickerBar() {
  const [tickers, setTickers] = useState<{ symbol: string; price: string; change: number }[]>([]);

  useEffect(() => {
    let mounted = true;

    async function loadTickers() {
      try {
        const res = await fetch("/api/markets");
        const data = await res.json();
        if (!mounted || !data.success || !data.markets) return;

        // Filter gainers only (change > 0), sort by change desc, take top 10
        const gainers = data.markets
          .filter((m: any) => m.change24h > 0)
          .sort((a: any, b: any) => b.change24h - a.change24h)
          .slice(0, 10)
          .map((m: any) => ({
            symbol: m.baseAsset,
            price: m.price >= 1 ? `$${m.price.toFixed(2)}` : `$${m.price.toFixed(6)}`,
            change: m.change24h,
          }));

        // Duplicate for seamless loop
        setTickers([...gainers, ...gainers]);
      } catch (e) {
        console.error("TickerBar: failed to fetch markets:", e);
      }
    }

    loadTickers();
    const interval = setInterval(loadTickers, 15000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  if (tickers.length === 0) return null;

  return (
    <div className="relative overflow-hidden border-b border-border bg-muted/30">
      <div className="flex items-center">
        {/* Left label */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 border-r border-border bg-background flex-shrink-0 z-10">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald-400">
            <path d="M3 17l6-6 4 4 8-8M21 7v6h-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wide">Gainers</span>
        </div>

        {/* Marquee */}
        <div className="flex animate-marquee whitespace-nowrap">
          {tickers.map((t, i) => (
            <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 flex-shrink-0">
              <span className="text-xs font-semibold text-foreground">{t.symbol}</span>
              <span className="text-xs text-muted-foreground">{t.price}</span>
              <span className="text-xs font-medium text-emerald-400">
                +{t.change.toFixed(2)}%
              </span>
              <span className="text-muted-foreground/30 ml-1">|</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}