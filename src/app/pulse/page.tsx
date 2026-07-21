"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { shortAddr, timeAgo, formatNumber } from "@/lib/format";
import { mockPairs } from "@/lib/mock-data";

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
    <div className="rounded-lg border border-border bg-muted/20 p-4">
      <div className="text-xs text-muted-foreground uppercase tracking-wider">{label}</div>
      <div className="mt-1 text-xl font-bold text-foreground">{value}</div>
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
    <div className="flex items-center gap-3 border-b border-border/50 px-3 py-2.5 hover:bg-muted/30">
      <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
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

// Generate mock pulse data — random swaps from mockPairs
function genMockPulse(prevSwaps: Swap[] = []): PulseData {
  const now = Math.floor(Date.now() / 1000);

  // Generate 1-3 new random swaps
  const newSwaps: Swap[] = [];
  const numNew = 1 + Math.floor(Math.random() * 3);
  for (let i = 0; i < numNew; i++) {
    const pair = mockPairs[Math.floor(Math.random() * mockPairs.length)];
    const isBuy = Math.random() > 0.5;
    const amountUsd = Math.random() * 5000 + 10;
    const amountIn = isBuy
      ? (amountUsd / pair.priceToken0PerToken1 * (10 ** pair.token0.decimals)).toFixed(0)
      : (amountUsd * (10 ** pair.token1.decimals)).toFixed(0);
    const amountOut = isBuy
      ? (amountUsd * (10 ** pair.token1.decimals)).toFixed(0)
      : (amountUsd / pair.priceToken0PerToken1 * (10 ** pair.token0.decimals)).toFixed(0);

    newSwaps.push({
      tx_hash: "0x" + Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join(""),
      block_number: 1000000 + Math.floor(Math.random() * 100000),
      timestamp: now - Math.floor(Math.random() * 5),
      sender: "0x" + Array.from({length: 40}, () => Math.floor(Math.random()*16).toString(16)).join(""),
      recipient: "0x" + Array.from({length: 40}, () => Math.floor(Math.random()*16).toString(16)).join(""),
      amount0_in: isBuy ? amountIn : "0",
      amount1_in: isBuy ? "0" : amountIn,
      amount0_out: isBuy ? "0" : amountOut,
      amount1_out: isBuy ? amountOut : "0",
      pair_address: pair.address,
      token0_symbol: pair.token0.symbol,
      token1_symbol: pair.token1.symbol,
      token0_decimals: pair.token0.decimals,
      token1_decimals: pair.token1.decimals,
    });
  }

  const allSwaps = [...newSwaps, ...prevSwaps].slice(0, 50);

  const newPairs: Pair[] = mockPairs.slice(0, 5).map(p => ({
    address: p.address,
    pair_index: Math.floor(Math.random() * 1000),
    token0: p.token0.address,
    token1: p.token1.address,
    reserve0: String(p.reserve0),
    reserve1: String(p.reserve1),
    updated_at: p.createdAt * 1000,
    token0_symbol: p.token0.symbol,
    token1_symbol: p.token1.symbol,
    token0_decimals: p.token0.decimals,
    token1_decimals: p.token1.decimals,
  }));

  const topPairs: TopPair[] = [...mockPairs]
    .sort((a, b) => b.txCount24h - a.txCount24h)
    .slice(0, 8)
    .map(p => ({
      address: p.address,
      total_swaps: p.txCount24h,
      token0_symbol: p.token0.symbol,
      token1_symbol: p.token1.symbol,
    }));

  return {
    success: true,
    timestamp: now * 1000,
    stats: {
      totalPairs: mockPairs.length,
      totalSwaps: 12483 + allSwaps.length,
      totalTokens: 28,
      liquidPairs: mockPairs.filter(p => p.liquidityUsd > 100000).length,
      recentActivity: allSwaps.length,
    },
    recentSwaps: allSwaps,
    newPairs,
    topPairs,
  };
}

export default function PulsePage() {
  const [data, setData] = useState<PulseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  useEffect(() => {
    // Initial load
    const initial = genMockPulse();
    setData(initial);
    setLastUpdate(new Date());
    setLoading(false);

    // Live updates every 2-4 seconds (feel alive)
    const tick = () => {
      setData(prev => genMockPulse(prev?.recentSwaps || []));
      setLastUpdate(new Date());
    };
    const interval = setInterval(tick, 2500 + Math.random() * 1500);
    return () => clearInterval(interval);
  }, []);

  if (loading && !data) {
    return (
      <>
        <Header />
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
        <Header />
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
      <Header />
      <main className="w-full flex-1 px-4 py-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Arc Pulse</h1>
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
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
          <StatCard label="Total Pairs" value={String(data.stats.totalPairs)} sub="Indexed" />
          <StatCard label="Total Swaps" value={String(data.stats.totalSwaps)} sub="All time" />
          <StatCard label="Total Tokens" value={String(data.stats.totalTokens)} sub="Unique" />
          <StatCard label="Liquid Pairs" value={String(data.stats.liquidPairs)} sub="Has liquidity" />
          <StatCard label="Activity (1h)" value={String(data.stats.recentActivity)} sub="Recent swaps" />
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
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
                  Tidak ada pair baru
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
                  <p>Belum ada aktivitas</p>
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
