"use client";

import { useState, useEffect, useRef } from "react";
import { formatUsd, formatNumber, shortAddr, timeAgo } from "@/lib/format";

interface Swap {
  tx_hash: string;
  block_number: number;
  timestamp: number;
  sender: string;
  recipient: string;
  amount0_in: string;
  amount1_in: string;
  amount0_out: string;
  amount1_out: string;
  pair_address: string;
}

interface LiveTradesFeedProps {
  pairAddress: string;
  symbol0: string;
  symbol1: string;
  decimals0: number;
  decimals1: number;
  priceToken0PerToken1: string;
}

export function LiveTradesFeed({ pairAddress, symbol0, symbol1, decimals0, decimals1, priceToken0PerToken1 }: LiveTradesFeedProps) {
  const [swaps, setSwaps] = useState<Swap[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "buy" | "sell">("all");
  const [autoScroll, setAutoScroll] = useState(true);
  const prevCountRef = useRef(0);

  useEffect(() => {
    async function fetchSwaps() {
      try {
        const res = await fetch(`/api/indexer/pairs/${pairAddress}/swaps?limit=80`);
        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            setSwaps(data.swaps);
          }
        }
      } catch (e) {
        console.error("Failed to fetch swaps:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchSwaps();
    const iv = setInterval(fetchSwaps, 5000);
    return () => clearInterval(iv);
  }, [pairAddress]);

  const price = parseFloat(priceToken0PerToken1);

  const processedSwaps = swaps.map(s => {
    const isBuy = s.amount0_in !== "0" && s.amount0_in !== "";
    const tokenAmount = isBuy
      ? parseFloat(s.amount1_out) / (10 ** decimals1)
      : parseFloat(s.amount0_out) / (10 ** decimals0);
    const usdAmount = tokenAmount * price;
    return { ...s, isBuy, tokenAmount, usdAmount };
  });

  const filteredSwaps = filter === "all"
    ? processedSwaps
    : processedSwaps.filter(s => filter === "buy" ? s.isBuy : !s.isBuy);

  return (
    <div className="flex h-full flex-col rounded-lg border border-border bg-card">
      {/* Header with filters */}
      <div className="flex items-center justify-between border-b border-border px-3 py-2">
        <div className="flex items-center gap-1">
          {(["all", "buy", "sell"] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded px-2 py-0.5 text-[10px] font-medium transition-colors cursor-pointer ${
                filter === f
                  ? f === "buy"
                    ? "bg-emerald-500/20 text-emerald-400"
                    : f === "sell"
                    ? "bg-red-500/20 text-red-400"
                    : "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {f === "all" ? "All" : f === "buy" ? "Buy" : "Sell"}
            </button>
          ))}
        </div>
        <button
          onClick={() => setAutoScroll(!autoScroll)}
          className={`rounded px-2 py-0.5 text-[10px] font-medium cursor-pointer transition-colors ${
            autoScroll
              ? "bg-emerald-500/20 text-emerald-400"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Instant
        </button>
      </div>

      {/* Column headers */}
      <div className="grid grid-cols-[40px_50px_1fr_70px_1fr] gap-1 border-b border-border/50 px-3 py-1 text-[9px] uppercase tracking-wide text-muted-foreground/60">
        <span>Age</span>
        <span>Type</span>
        <span className="text-right">Token</span>
        <span className="text-right">USD</span>
        <span className="text-right">Trader</span>
      </div>

      {/* Trades list */}
      <div className="flex-1 overflow-y-auto" style={{ maxHeight: "500px" }}>
        {loading ? (
          <div className="flex h-32 items-center justify-center">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
          </div>
        ) : filteredSwaps.length === 0 ? (
          <div className="flex h-32 items-center justify-center text-xs text-muted-foreground">
            No trades yet
          </div>
        ) : (
          filteredSwaps.map((swap, i) => (
            <div
              key={swap.tx_hash + i}
              className={`grid grid-cols-[40px_50px_1fr_70px_1fr] gap-1 px-3 py-1 text-[11px] border-b border-border/20 hover:bg-muted/10 ${
                swap.isBuy ? "bg-emerald-500/5" : "bg-red-500/5"
              }`}
            >
              <span className="text-muted-foreground">{timeAgo(swap.timestamp)}</span>
              <span>
                <span className={`font-medium ${swap.isBuy ? "text-emerald-400" : "text-red-400"}`}>
                  {swap.isBuy ? "Buy" : "Sell"}
                </span>
              </span>
              <span className="text-right font-mono text-foreground/80">
                {swap.tokenAmount < 0.001 ? swap.tokenAmount.toFixed(6) : swap.tokenAmount < 1 ? swap.tokenAmount.toFixed(4) : formatNumber(swap.tokenAmount, 2)}
              </span>
              <span className="text-right font-mono text-foreground/80">
                ${swap.usdAmount.toFixed(2)}
              </span>
              <span className="text-right font-mono text-muted-foreground">
                {shortAddr(swap.sender, 4)}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
