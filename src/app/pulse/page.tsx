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

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-lg border border-border bg-muted/20 p-3 sm:p-4">
      <div className="text-xs text-muted-foreground uppercase tracking-wider">{label}</div>
      <div className="mt-1 text-base sm:text-xl font-bold text-foreground">{value}</div>
      {sub && <div className="mt-0.5 text-xs text-muted-foreground">{sub}</div>}
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

  const formattedIn = (parseFloat(amountIn) / (10 ** decimalsIn)).toFixed(4);
  const formattedOut = (parseFloat(amountOut) / (10 ** decimalsOut)).toFixed(4);

  return (
    <div className="flex items-center gap-2 sm:gap-3 border-b border-border/50 px-2 sm:px-3 py-2 sm:py-2.5 hover:bg-muted/30">
      <div className={`flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full text-xs font-bold shrink-0 ${
        isBuy ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"
      }`}>
        {isBuy ? "B" : "S"}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 text-sm">
          <span className="font-semibold">{swap.token0_symbol}/{swap.token1_symbol}</span>
          <span className="text-muted-foreground">•</span>
          <span className="text-xs text-muted-foreground">{timeAgo(swap.timestamp)}</span>
        </div>
        <div className="text-xs text-muted-foreground">
          {formattedIn} {symbolIn} → {formattedOut} {symbolOut}
        </div>
      </div>
      <div className="text-right">
        <div className={`text-sm font-semibold ${isBuy ? "text-emerald-400" : "text-red-400"}`}>
          {isBuy ? "+" : "-"}{formattedOut} {symbolOut}
        </div>
        <a
          href={`https://testnet.arcscan.app/tx/${swap.tx_hash}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] text-muted-foreground hover:text-emerald-400"
        >
          View ↗
        </a>
      </div>
    </div>
  );
}

function NewPairRow({ pair }: { pair: Pair }) {
  const liquidity = (parseFloat(pair.reserve0) / (10 ** pair.token0_decimals)).toFixed(2);
  return (
    <div className="flex items-center gap-3 border-b border-border/50 px-3 py-2.5 hover:bg-muted/30">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold">
        {pair.token0_symbol.slice(0, 2)}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="font-semibold text-sm">{pair.token0_symbol}/{pair.token1_symbol}</span>
          <span className="rounded bg-blue-500/20 px-1.5 py-0.5 text-[10px] font-bold text-blue-400">NEW</span>
        </div>
        <div className="text-xs text-muted-foreground font-mono">{shortAddr(pair.address, 12)}</div>
      </div>
      <div className="text-right">
        <div className="text-sm font-semibold">{formatNumber(parseFloat(liquidity), 2)} {pair.token0_symbol}</div>
        <div className="text-[10px] text-muted-foreground">Liquidity</div>
      </div>
    </div>
  );
}

function TopPairRow({ pair, rank }: { pair: TopPair; rank: number }) {
  return (
    <div className="flex items-center gap-3 border-b border-border/50 px-3 py-2.5 hover:bg-muted/30">
      <span className="text-sm font-bold text-muted-foreground w-6">#{rank}</span>
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-sm">{pair.token0_symbol}/{pair.token1_symbol}</div>
        <div className="text-xs text-muted-foreground font-mono">{shortAddr(pair.address, 10)}</div>
      </div>
      <div className="text-right">
        <div className="text-sm font-semibold">{pair.total_swaps} swaps</div>
        <div className="text-[10px] text-muted-foreground">Total</div>
      </div>
    </div>
  );
}

// Pulse data comes from /api/indexer/pulse — real on-chain data
// Mock generation removed — data is fetched from Arc testnet indexer

export default function PulsePage() {
  const [data, setData] = useState<PulseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  useEffect(() => {
    // Initial load from real indexer API
    const load = async () => {
      try {
        const res = await fetch("/api/indexer/pulse?limit=50");
        const json = await res.json();
        if (json.success) {
          setData(json);
        }
      } catch (e) {
        console.error("Failed to load pulse data:", e);
      } finally {
        setLoading(false);
        setLastUpdate(new Date());
      }
    };
    load();

    // Live updates every 10 seconds
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
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-24 animate-pulse rounded-lg bg-muted/30"></div>
              ))}
            </div>
            <div className="h-96 animate-pulse rounded-lg bg-muted/20"></div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (error && !data) {
    return (
      <>
        <Header logoColor="green" />
        <main className="w-full flex-1 px-4 py-6">
          <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-6 text-center">
            <div className="text-sm font-medium text-red-400">Failed to load data Pulse</div>
            <div className="mt-1 text-xs text-muted-foreground">{error}</div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!data) return null;

  return (
    <>
      <Header logoColor="green" />
      <main className="w-full flex-1 px-4 py-6">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">Aperture Pulse</h1>
            <p className="text-sm text-muted-foreground">
              Real-time DEX activity feed
            </p>
          </div>
          <div className="flex items-center gap-3">
            {lastUpdate && (
              <span className="text-xs text-muted-foreground">
                Updated {lastUpdate.toLocaleTimeString()}
              </span>
            )}
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500"></span>
              <span className="text-xs font-medium text-emerald-400">LIVE</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-6 grid grid-cols-2 gap-2 sm:gap-3 sm:grid-cols-3 lg:grid-cols-5">
          <StatCard label="Total Pairs" value={String(data.stats.totalPairs)} sub="Indexed" />
          <StatCard label="Total Swaps" value={String(data.stats.totalSwaps)} sub="All time" />
          <StatCard label="Total Tokens" value={String(data.stats.totalTokens)} sub="Unique" />
          <StatCard label="Liquid Pairs" value={String(data.stats.liquidPairs)} sub="Has liquidity" />
          <StatCard label="Activity (1h)" value={String(data.stats.recentActivity)} sub="Recent swaps" />
        </div>

        <div className="grid gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* Recent Swaps */}
          <div className="rounded-lg border border-border bg-muted/10">
            <div className="border-b border-border px-4 py-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground">Recent Swaps</h3>
              <span className="text-xs text-muted-foreground">{data.recentSwaps.length} tx</span>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {data.recentSwaps.length === 0 ? (
                <div className="px-4 py-8 text-center text-xs text-muted-foreground">
                  <p>No swaps yet tercatat</p>
                  <p className="mt-1">Swaps will appear here in real-time</p>
                </div>
              ) : (
                data.recentSwaps.map((swap) => (
                  <SwapRow key={swap.tx_hash} swap={swap} />
                ))
              )}
            </div>
          </div>

          {/* New Pairs */}
          <div className="rounded-lg border border-border bg-muted/10">
            <div className="border-b border-border px-4 py-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground">New Pairs</h3>
              <span className="text-xs text-muted-foreground">Latest</span>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {data.newPairs.length === 0 ? (
                <div className="px-4 py-8 text-center text-xs text-muted-foreground">
                  No new pairs yet
                </div>
              ) : (
                data.newPairs.map((pair) => (
                  <NewPairRow key={pair.address} pair={pair} />
                ))
              )}
            </div>
          </div>

          {/* Top Pairs */}
          <div className="rounded-lg border border-border bg-muted/10">
            <div className="border-b border-border px-4 py-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground">Top Pairs</h3>
              <span className="text-xs text-muted-foreground">By activity</span>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {data.topPairs.length === 0 ? (
                <div className="px-4 py-8 text-center text-xs text-muted-foreground">
                  <p>No activity yet</p>
                  <p className="mt-1">Pairs with the most swaps will appear here</p>
                </div>
              ) : (
                data.topPairs.map((pair, i) => (
                  <TopPairRow key={pair.address} pair={pair} rank={i + 1} />
                ))
              )}
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="mt-6 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
              ⟳
            </div>
            <div>
              <div className="text-sm font-medium text-foreground">
                Real-time Indexer
              </div>
              <div className="mt-1 text-xs text-muted-foreground">
                Data berasal dari SQLite indexer yang sync setiap 10 m.
                Swap detection aktif — event Swap dari semua pair tercatat otomatis.
                Page refreshes every 10s for latest updates.
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
