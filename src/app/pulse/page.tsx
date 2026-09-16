"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { shortAddr, timeAgo, formatNumber } from "@/lib/format";

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
  token0_symbol: string;
  token1_symbol: string;
  token0_decimals: number;
  token1_decimals: number;
}

interface Pair {
  address: string;
  pair_index: number;
  token0: string;
  token1: string;
  reserve0: string;
  reserve1: string;
  updated_at: number;
  token0_symbol: string;
  token1_symbol: string;
  token0_decimals: number;
  token1_decimals: number;
}

interface TopPair {
  address: string;
  total_swaps: number;
  token0_symbol: string;
  token1_symbol: string;
}

interface PulseData {
  success: boolean;
  timestamp: number;
  stats: {
    totalPairs: number;
    totalSwaps: number;
    totalTokens: number;
    liquidPairs: number;
    recentActivity: number;
  };
  recentSwaps: Swap[];
  newPairs: Pair[];
  topPairs: TopPair[];
}

function fmtNum(n: number): string {
  if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`;
  if (n >= 1e3) return `$${(n / 1e3).toFixed(1)}K`;
  return n.toFixed(2);
}

function fmtTok(n: number, decimals: number): string {
  const val = n / (10 ** decimals);
  if (val >= 1e9) return `${(val / 1e9).toFixed(2)}B`;
  if (val >= 1e6) return `${(val / 1e6).toFixed(2)}M`;
  if (val >= 1e3) return `${(val / 1e3).toFixed(1)}K`;
  if (val >= 1) return val.toFixed(4);
  return val.toFixed(6);
}

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-xl border border-border/50 bg-card/30 p-3 sm:p-4">
      <div className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider">{label}</div>
      <div className="mt-1 text-lg sm:text-2xl font-bold text-foreground font-mono">{value}</div>
      {sub && <div className="mt-0.5 text-[10px] sm:text-xs text-muted-foreground">{sub}</div>}
    </div>
  );
}

function PanelHeader({ title, count }: { title: string; count?: string }) {
  return (
    <div className="border-b border-border/50 px-3 sm:px-4 py-3 flex items-center justify-between">
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      {count && <span className="text-[10px] sm:text-xs text-muted-foreground bg-muted/30 px-2 py-0.5 rounded-full">{count}</span>}
    </div>
  );
}

function SwapRow({ swap }: { swap: Swap }) {
  const isBuy = swap.amount0_in !== "0" && swap.amount0_in !== "";
  const amountIn = isBuy ? swap.amount0_in : swap.amount1_in;
  const amountOut = isBuy ? swap.amount1_out : swap.amount0_out;
  const decimalsIn = isBuy ? swap.token0_decimals : swap.token1_decimals;
  const decimalsOut = isBuy ? swap.token1_decimals : swap.token0_decimals;
  const symbolIn = isBuy ? swap.token0_symbol : swap.token1_symbol;
  const symbolOut = isBuy ? swap.token1_symbol : swap.token0_symbol;

  const valIn = parseFloat(amountIn || "0") / (10 ** decimalsIn);
  const valOut = parseFloat(amountOut || "0") / (10 ** decimalsOut);

  return (
    <div className="flex items-center gap-2 sm:gap-3 border-b border-border/30 last:border-0 px-3 sm:px-4 py-2.5 hover:bg-muted/20 transition-colors">
      <div className={`flex h-8 w-8 items-center justify-center rounded-full text-[10px] font-bold shrink-0 ${
        isBuy ? "bg-emerald-500/15 text-emerald-400" : "bg-red-500/15 text-red-400"
      }`}>
        {isBuy ? "BUY" : "SELL"}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 text-xs sm:text-sm">
          <span className="font-semibold text-foreground">{swap.token0_symbol}/{swap.token1_symbol}</span>
          <span className="text-muted-foreground text-[10px]">{timeAgo(swap.timestamp)}</span>
        </div>
        <div className="text-[10px] sm:text-xs text-muted-foreground font-mono mt-0.5">
          {fmtTok(valIn, 0)} {symbolIn} → {fmtTok(valOut, 0)} {symbolOut}
        </div>
      </div>
      <a
        href={`https://testnet.arcscan.app/tx/${swap.tx_hash}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[10px] text-muted-foreground hover:text-emerald-400 transition-colors shrink-0"
      >
        ↗
      </a>
    </div>
  );
}

function NewPairRow({ pair }: { pair: Pair }) {
  const liq0 = parseFloat(pair.reserve0 || "0") / (10 ** pair.token0_decimals);
  return (
    <div className="flex items-center gap-3 border-b border-border/30 last:border-0 px-3 sm:px-4 py-2.5 hover:bg-muted/20 transition-colors">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/15 text-blue-400 text-[10px] font-bold shrink-0">
        {pair.token0_symbol.slice(0, 2).toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="font-semibold text-xs sm:text-sm text-foreground">{pair.token0_symbol}/{pair.token1_symbol}</span>
          <span className="rounded bg-blue-500/15 px-1.5 py-0.5 text-[9px] font-bold text-blue-400">NEW</span>
        </div>
        <div className="text-[10px] text-muted-foreground font-mono mt-0.5">{shortAddr(pair.address, 8)}</div>
      </div>
      <div className="text-right shrink-0">
        <div className="text-xs font-semibold text-foreground font-mono">{fmtTok(liq0, 0)}</div>
        <div className="text-[9px] text-muted-foreground">{pair.token0_symbol} liq</div>
      </div>
    </div>
  );
}

function TopPairRow({ pair, rank }: { pair: TopPair; rank: number }) {
  return (
    <div className="flex items-center gap-3 border-b border-border/30 last:border-0 px-3 sm:px-4 py-2.5 hover:bg-muted/20 transition-colors">
      <span className={`text-sm font-bold w-6 text-center ${rank <= 3 ? "text-emerald-400" : "text-muted-foreground"}`}>#{rank}</span>
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-xs sm:text-sm text-foreground">{pair.token0_symbol}/{pair.token1_symbol}</div>
        <div className="text-[10px] text-muted-foreground font-mono mt-0.5">{shortAddr(pair.address, 8)}</div>
      </div>
      <div className="text-right shrink-0">
        <div className="text-xs font-semibold text-foreground font-mono">{pair.total_swaps}</div>
        <div className="text-[9px] text-muted-foreground">swaps</div>
      </div>
    </div>
  );
}

export default function PulsePage() {
  const [data, setData] = useState<PulseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/indexer/pulse?limit=50");
        const json = await res.json();
        if (json.success) setData(json);
      } catch (e) {
        console.error("Failed to load pulse data:", e);
      } finally {
        setLoading(false);
        setLastUpdate(new Date());
      }
    };
    load();

    const tick = async () => {
      try {
        const res = await fetch("/api/indexer/pulse?limit=50");
        const json = await res.json();
        if (json.success) {
          setData(json);
          setLastUpdate(new Date());
        }
      } catch (e) {
        console.error("Failed to update pulse data:", e);
      }
    };
    const interval = setInterval(tick, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading && !data) {
    return (
      <>
        <Header logoColor="green" />
        <main className="w-full flex-1 px-4 py-6">
          <div className="space-y-4">
            <div className="h-8 w-48 animate-pulse rounded bg-muted/50"></div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-24 animate-pulse rounded-xl bg-muted/30"></div>
              ))}
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-64 animate-pulse rounded-xl bg-muted/20"></div>
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!data) return (
    <>
      <Header logoColor="green" />
      <main className="w-full flex-1 px-4 py-6">
        <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-6 text-center">
          <div className="text-sm font-medium text-red-400">Failed to load Pulse data</div>
        </div>
      </main>
      <Footer />
    </>
  );

  return (
    <>
      <Header logoColor="green" />
      <main className="w-full flex-1 px-3 sm:px-4 py-4 sm:py-6">
        {/* Header */}
        <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h1 className="text-lg sm:text-2xl font-bold text-foreground">Pulse</h1>
            <p className="text-xs sm:text-sm text-muted-foreground">Real-time DEX activity feed</p>
          </div>
          <div className="flex items-center gap-3">
            {lastUpdate && (
              <span className="text-[10px] sm:text-xs text-muted-foreground font-mono">
                {lastUpdate.toLocaleTimeString()}
              </span>
            )}
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500"></span>
              <span className="text-[10px] sm:text-xs font-medium text-emerald-400">LIVE</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-4 sm:mb-6 grid grid-cols-2 gap-2 sm:gap-3 sm:grid-cols-3 lg:grid-cols-5">
          <StatCard label="Pairs" value={String(data.stats.totalPairs)} sub="Indexed" />
          <StatCard label="Swaps" value={String(data.stats.totalSwaps)} sub="All time" />
          <StatCard label="Tokens" value={String(data.stats.totalTokens)} sub="Unique" />
          <StatCard label="Liquid" value={String(data.stats.liquidPairs)} sub="Has liquidity" />
          <StatCard label="Activity" value={String(data.stats.recentActivity)} sub="Swaps (1h)" />
        </div>

        {/* Three panels */}
        <div className="grid gap-3 sm:gap-4 lg:grid-cols-3">
          {/* Recent Swaps */}
          <div className="rounded-xl border border-border/50 bg-card/20 overflow-hidden">
            <PanelHeader title="Recent Swaps" count={`${data.recentSwaps.length} tx`} />
            <div className="max-h-[420px] overflow-y-auto">
              {data.recentSwaps.length === 0 ? (
                <div className="px-4 py-12 text-center">
                  <p className="text-xs text-muted-foreground">No swaps yet</p>
                </div>
              ) : (
                data.recentSwaps.map((swap, i) => (
                  <SwapRow key={`${swap.tx_hash}-${i}`} swap={swap} />
                ))
              )}
            </div>
          </div>

          {/* New Pairs */}
          <div className="rounded-xl border border-border/50 bg-card/20 overflow-hidden">
            <PanelHeader title="New Pairs" count="Latest" />
            <div className="max-h-[420px] overflow-y-auto">
              {data.newPairs.length === 0 ? (
                <div className="px-4 py-12 text-center">
                  <p className="text-xs text-muted-foreground">No new pairs</p>
                </div>
              ) : (
                data.newPairs.map((pair) => (
                  <NewPairRow key={pair.address} pair={pair} />
                ))
              )}
            </div>
          </div>

          {/* Top Pairs */}
          <div className="rounded-xl border border-border/50 bg-card/20 overflow-hidden">
            <PanelHeader title="Top Pairs" count="By activity" />
            <div className="max-h-[420px] overflow-y-auto">
              {data.topPairs.length === 0 ? (
                <div className="px-4 py-12 text-center">
                  <p className="text-xs text-muted-foreground">No activity yet</p>
                </div>
              ) : (
                data.topPairs.map((pair, i) => (
                  <TopPairRow key={pair.address} pair={pair} rank={i + 1} />
                ))
              )}
            </div>
          </div>
        </div>

        {/* Info bar */}
        <div className="mt-4 sm:mt-6 flex items-center gap-2 px-3 py-2.5 rounded-xl border border-emerald-500/15 bg-emerald-500/5">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
          <span className="text-[10px] sm:text-xs text-muted-foreground">
            SQLite indexer syncs every 10m · Swap detection active · Auto-refresh 10s
          </span>
        </div>
      </main>
      <Footer />
    </>
  );
}
