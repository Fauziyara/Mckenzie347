"use client";

import { useEffect, useState, useRef } from "react";

interface Ticker {
  symbol: string;
  price: string;
  change: number;
}

export function TickerBar() {
  const [gainers, setGainers] = useState<Ticker[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let mounted = true;

    async function loadTickers() {
      try {
        const res = await fetch("/api/markets");
        const data = await res.json();
        if (!mounted || !data.success || !data.markets) return;

        const g: Ticker[] = data.markets
          .filter((m: any) => m.change24h > 0)
          .sort((a: any, b: any) => b.change24h - a.change24h)
          .slice(0, 10)
          .map((m: any) => ({
            symbol: m.baseAsset,
            price: m.price >= 1 ? `$${m.price.toFixed(2)}` : `$${m.price.toFixed(6)}`,
            change: m.change24h,
          }));

        setGainers(g);
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

  // Seamless scroll using scrollLeft
  useEffect(() => {
    const container = containerRef.current;
    if (!container || gainers.length === 0) return;

    let raf: number;
    let paused = false;

    const onEnter = () => { paused = true; };
    const onLeave = () => { paused = false; };
    container.addEventListener("mouseenter", onEnter);
    container.addEventListener("mouseleave", onLeave);

    const tick = () => {
      if (!paused) {
        container.scrollLeft += 0.5;
        const setWidth = container.scrollWidth / 4;
        if (setWidth > 0 && container.scrollLeft >= setWidth) {
          container.scrollLeft -= setWidth;
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      container.removeEventListener("mouseenter", onEnter);
      container.removeEventListener("mouseleave", onLeave);
    };
  }, [gainers]);

  if (gainers.length === 0) return null;

  const renderSet = () => (
    <div className="flex shrink-0">
      {gainers.map((t, i) => (
        <div key={i} className="flex items-center gap-1.5 px-3 py-1.5">
          <span className="text-xs font-semibold text-foreground">{t.symbol}</span>
          <span className="text-xs text-muted-foreground">{t.price}</span>
          <span className="text-xs font-medium text-emerald-400">+{t.change.toFixed(2)}%</span>
          <span className="text-muted-foreground/30 ml-1">|</span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="flex border-b border-border bg-muted/30">
      {/* Fixed GAINERS label - does not move */}
      <div className="flex items-center gap-1.5 px-3 py-1.5 border-r border-border bg-background flex-shrink-0 z-10">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald-400">
          <path d="M3 17l6-6 4 4 8-8M21 7v6h-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wide">Gainers</span>
      </div>
      {/* Scrolling content */}
      <div
        ref={containerRef}
        className="overflow-hidden flex-1"
        style={{ scrollBehavior: "auto" }}
      >
        <div className="flex">
          {renderSet()}
          {renderSet()}
          {renderSet()}
          {renderSet()}
        </div>
      </div>
    </div>
  );
}
