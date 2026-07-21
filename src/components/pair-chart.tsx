"use client";

import { useState, useEffect, useMemo } from "react";
import { CandleChart, type Candle } from "@/components/candle-chart";

type Interval = "1s" | "30s" | "1m" | "5m" | "15m" | "1h";

const INTERVALS: Interval[] = ["1s", "30s", "1m", "5m", "15m", "1h"];

const INTERVAL_MS: Record<Interval, number> = {
  "1s": 1000,
  "30s": 30000,
  "1m": 60000,
  "5m": 300000,
  "15m": 900000,
  "1h": 3600000,
};

interface Swap {
  tx_hash: string;
  timestamp: number;
  amount0_in: string;
  amount1_in: string;
  amount0_out: string;
  amount1_out: string;
  token0_decimals: number;
  token1_decimals: number;
}

interface PairChartProps {
  pairAddress: string;
  symbol0: string;
  symbol1: string;
  decimals0: number;
  decimals1: number;
  currentPrice: string;
}

export function PairChart({ pairAddress, symbol0, symbol1, decimals0, decimals1, currentPrice }: PairChartProps) {
  const [chartInterval, setChartInterval] = useState<Interval>("1m");
  const [swaps, setSwaps] = useState<Swap[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSwaps() {
      try {
        const res = await fetch(`/api/indexer/pairs/${pairAddress}/swaps?limit=200`);
        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            setSwaps(data.swaps);
          }
        }
      } catch (e) {
        console.error("Failed to fetch swaps for chart:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchSwaps();
    const iv = setInterval(fetchSwaps, 15000);
    return () => clearInterval(iv);
  }, [pairAddress]);

  const candles = useMemo(() => {
    if (swaps.length === 0) return [];

    const intervalMs = INTERVAL_MS[chartInterval];
    const groups: Record<number, Swap[]> = {};

    for (const swap of swaps) {
      const bucket = Math.floor(swap.timestamp * 1000 / intervalMs) * intervalMs;
      if (!groups[bucket]) groups[bucket] = [];
      groups[bucket].push(swap);
    }

    const result: Candle[] = [];
    const sortedBuckets = Object.keys(groups).map(Number).sort((a, b) => a - b);

    for (const bucket of sortedBuckets) {
      const bucketSwaps = groups[bucket];
      let open = 0, high = 0, low = Infinity, close = 0, volume = 0;

      for (let i = 0; i < bucketSwaps.length; i++) {
        const s = bucketSwaps[i];
        const amt0In = parseFloat(s.amount0_in) / (10 ** decimals0);
        const amt1In = parseFloat(s.amount1_in) / (10 ** decimals1);
        const amt0Out = parseFloat(s.amount0_out) / (10 ** decimals0);
        const amt1Out = parseFloat(s.amount1_out) / (10 ** decimals1);

        let price = 0;
        if (amt0In > 0 && amt1Out > 0) {
          price = amt1Out / amt0In;
        } else if (amt1In > 0 && amt0Out > 0) {
          price = amt1In / amt0Out;
        }

        let displayPrice = price;
        if (price > 0 && price < 0.01) {
          displayPrice = 1.0 / price;
        }

        if (i === 0) open = displayPrice;
        close = displayPrice;
        if (displayPrice > high) high = displayPrice;
        if (displayPrice < low) low = displayPrice;
        volume += amt0In + amt0Out;
      }

      result.push({
        time: bucket,
        open,
        high,
        low: low === Infinity ? 0 : low,
        close,
        volume,
      });
    }

    return result;
  }, [swaps, chartInterval, decimals0, decimals1]);

  const lastCandle = candles[candles.length - 1];
  const prevCandle = candles[candles.length - 2];
  const priceChange = lastCandle && prevCandle
    ? ((lastCandle.close - prevCandle.close) / prevCandle.close * 100)
    : 0;
  const totalVolume = candles.reduce((a, b) => a + b.volume, 0);

  const fmt = (n: number) => {
    if (n >= 1000) return n.toFixed(0);
    if (n >= 1) return n.toFixed(2);
    if (n >= 0.01) return n.toFixed(4);
    return n.toFixed(6);
  };

  return (
    <div className="flex flex-col rounded-lg border border-border bg-card">
      {/* Timeframe controls */}
      <div className="flex items-center justify-between border-b border-border px-3 py-1.5">
        <div className="flex items-center gap-1">
          {INTERVALS.map((iv) => (
            <button
              key={iv}
              onClick={() => setChartInterval(iv)}
              className={`rounded px-2 py-0.5 text-[11px] font-medium transition-colors cursor-pointer ${
                chartInterval === iv
                  ? "bg-emerald-500/20 text-emerald-400"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {iv}
            </button>
          ))}
          <span className="ml-2 text-[10px] text-muted-foreground/60">Indicators</span>
          <span className="ml-1 rounded bg-muted/30 px-1.5 py-0.5 text-[10px] text-muted-foreground">Price</span>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-muted-foreground/60">
          <span>% log auto</span>
        </div>
      </div>

      {/* OHLC header */}
      <div className="flex items-center gap-3 border-b border-border/50 px-3 py-1.5 text-[11px]">
        <span className="font-semibold text-foreground">{symbol0} · {chartInterval}</span>
        {lastCandle && (
          <>
            <span className="text-muted-foreground">
              O: <span className="text-foreground/80">{fmt(lastCandle.open)}</span>
            </span>
            <span className="text-muted-foreground">
              H: <span className="text-foreground/80">{fmt(lastCandle.high)}</span>
            </span>
            <span className="text-muted-foreground">
              L: <span className="text-foreground/80">{fmt(lastCandle.low)}</span>
            </span>
            <span className="text-muted-foreground">
              C: <span className="text-foreground/80">{fmt(lastCandle.close)}</span>
            </span>
            <span className={priceChange >= 0 ? "text-emerald-400" : "text-red-400"}>
              {priceChange >= 0 ? "+" : ""}{priceChange.toFixed(2)}%
            </span>
            <span className="text-muted-foreground">
              Vol: <span className="text-foreground/80">{totalVolume.toFixed(2)}</span>
            </span>
          </>
        )}
      </div>

      {/* Chart */}
      <div className="h-[400px] w-full p-2">
        {loading ? (
          <div className="flex h-full items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
          </div>
        ) : candles.length === 0 ? (
          <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
            No swap data available
          </div>
        ) : (
          <CandleChart candles={candles} height={400} />
        )}
      </div>

      {/* Bottom range info */}
      <div className="flex items-center justify-between border-t border-border/50 px-3 py-1 text-[10px] text-muted-foreground">
        <span>Swaps: {swaps.length}</span>
        <span>Updated: {new Date().toLocaleTimeString("en-US", { hour12: false })}</span>
      </div>
    </div>
  );
}
