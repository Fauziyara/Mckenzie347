"use client";

import { useState, useEffect } from "react";
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

interface TradeHistoryTabsProps {
  pairAddress: string;
}

export function TradeHistoryTabs({ pairAddress }: TradeHistoryTabsProps) {
  const [swaps, setSwaps] = useState<Swap[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSwaps() {
      try {
        const res = await fetch(`/api/indexer/pairs/${pairAddress}/swaps?limit=50`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (data.success) {
          setSwaps(data.swaps);
        } else {
          setError("Failed to load data swap");
        }
      } catch (e) {
        console.error("Failed to fetch swaps:", e);
        setError("Failed to load data swap");
      } finally {
        setLoading(false);
      }
    }

    fetchSwaps();
    const interval = setInterval(fetchSwaps, 15000); // refresh 15s
    return () => clearInterval(interval);
  }, [pairAddress]);

  if (loading) {
    return (
      <div className="rounded-lg border border-border bg-muted/10">
        <div className="border-b border-border px-3 py-2">
          <h3 className="text-xs font-semibold text-muted-foreground">History Swap</h3>
        </div>
        <div className="p-4 space-y-2">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-10 animate-pulse rounded bg-muted/20" />
          ))}
        </div>
      </div>
    );
  }

  if (error || swaps.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-muted/10">
        <div className="border-b border-border px-3 py-2">
          <h3 className="text-xs font-semibold text-muted-foreground">History Swap</h3>
        </div>
        <div className="p-6 text-center text-muted-foreground">
          <p className="text-sm">{error || "No swaps yet for this pair"}</p>
          <p className="mt-1 text-xs">Swap akan muncul setelah ada aktivitas trading</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-muted/10">
      <div className="border-b border-border px-3 py-2 flex items-center justify-between">
        <h3 className="text-xs font-semibold text-muted-foreground">History Swap</h3>
        <span className="text-[10px] text-muted-foreground">{swaps.length} transaksi</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border/50 text-muted-foreground">
              <th className="px-3 py-2 text-left">Waktu</th>
              <th className="px-3 py-2 text-left">Tipe</th>
              <th className="px-3 py-2 text-right">Amount In</th>
              <th className="px-3 py-2 text-right">Amount Out</th>
              <th className="px-3 py-2 text-left">From</th>
              <th className="px-3 py-2 text-left">To</th>
            </tr>
          </thead>
          <tbody>
            {swaps.map((swap, i) => {
              const isBuy = swap.amount0_in !== "0" && swap.amount0_in !== "";
              const amountIn = isBuy ? swap.amount0_in : swap.amount1_in;
              const amountOut = isBuy ? swap.amount1_out : swap.amount0_out;
              const tokenIn = isBuy ? "Token0" : "Token1";
              const tokenOut = isBuy ? "Token1" : "Token0";

              return (
                <tr key={swap.tx_hash + i} className="border-b border-border/30 hover:bg-muted/20">
                  <td className="px-3 py-2">{timeAgo(swap.timestamp)}</td>
                  <td className="px-3 py-2">
                    <span className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${
                      isBuy ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"
                    }`}>
                      {isBuy ? "BELI" : "JUAL"}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-right font-mono">{formatNumber(parseFloat(amountIn) / 1e6, 4)} {tokenIn}</td>
                  <td className="px-3 py-2 text-right font-mono">{formatNumber(parseFloat(amountOut) / 1e6, 4)} {tokenOut}</td>
                  <td className="px-3 py-2 font-mono">{shortAddr(swap.sender, 8)}</td>
                  <td className="px-3 py-2 font-mono">{shortAddr(swap.recipient, 8)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
