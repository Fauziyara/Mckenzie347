"use client";

import { use, useState, useEffect } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { SyncBadge } from "@/components/sync-badge";
import { formatUsd, formatPrice, formatNumber, timeAgo, shortAddr } from "@/lib/format";
import { PairChart } from "@/components/pair-chart";
import { TradePanel } from "@/components/trade-panel";
import { TokenInfoPanel } from "@/components/token-info-panel";
import { TradeHistoryTabs } from "@/components/trade-history-tabs";
import Link from "next/link";

interface PairData {
  address: string;
  factory: string;
  pair_index: number;
  token0: string;
  token1: string;
  reserve0: string;
  reserve1: string;
  total_swaps: number;
  total_volume0: string;
  total_volume1: string;
  updated_at: number;
  token0_symbol: string;
  token0_name: string;
  token0_decimals: number;
  token1_symbol: string;
  token1_name: string;
  token1_decimals: number;
  priceToken0PerToken1: string;
  priceToken1PerToken0: string;
  reserve0Formatted: string;
  reserve1Formatted: string;
}

export default function PairDetailClient({ params }: { params: Promise<{ address: string }> }) {
  const { address } = use(params);
  const [pair, setPair] = useState<PairData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [watched, setWatched] = useState(false);

  useEffect(() => {
    async function fetchPair() {
      try {
        const res = await fetch(`/api/indexer/pairs/${address}`);
        if (!res.ok) {
          if (res.status === 404) {
            setError("Pair not found on Arc testnet");
            return;
          }
          throw new Error(`HTTP ${res.status}`);
        }
        const data = await res.json();
        if (data.success && data.pair) {
          setPair(data.pair);
        } else {
          setError("Invalid pair data");
        }
      } catch (e) {
        console.error("Failed to fetch pair:", e);
        setError("Failed to load pair from indexer");
      } finally {
        setLoading(false);
      }
    }
    fetchPair();
    const interval = setInterval(fetchPair, 30000);
    return () => clearInterval(interval);
  }, [address]);

  useEffect(() => {
    const saved = localStorage.getItem("aperture-watchlist");
    if (saved) {
      const list: string[] = JSON.parse(saved);
      setWatched(list.includes(address));
    }
  }, [address]);

  function toggleWatch() {
    const saved = localStorage.getItem("aperture-watchlist");
    let list: string[] = saved ? JSON.parse(saved) : [];
    if (watched) list = list.filter(a => a !== address);
    else list.push(address);
    localStorage.setItem("aperture-watchlist", JSON.stringify(list));
    setWatched(!watched);
  }

  if (error) {
    return (
      <>
        <Header active="Explore" />
        <main className="w-full flex-1 px-4 py-6">
          <div className="mb-4">
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">← Back</Link>
          </div>
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-6 text-center">
            <p className="text-red-400">{error}</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (loading) {
    return (
      <>
        <Header active="Explore" />
        <main className="w-full flex-1 px-4 py-6">
          <div className="mb-4 h-4 w-32 animate-pulse rounded bg-muted/50" />
          <div className="grid gap-4 lg:grid-cols-[1fr_380px]">
            <div className="space-y-4">
              <div className="h-20 animate-pulse rounded-lg bg-muted/30" />
              <div className="h-96 animate-pulse rounded-lg bg-muted/20" />
            </div>
            <div className="h-96 animate-pulse rounded-lg bg-muted/20" />
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!pair) return null;

  return (
    <>
      <Header active="Explore" />
      <main className="w-full flex-1 px-2 py-2">
        <div className="mb-2">
          <Link href="/" className="text-xs text-muted-foreground hover:text-foreground transition-colors">← Back</Link>
        </div>

        {/* Compact header bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-3 border-b border-border bg-muted/5 px-2 sm:px-4 py-2 sm:py-2.5 rounded-t-lg">
          <div className="flex flex-wrap items-center gap-x-3 sm:gap-x-4 gap-y-1">
            <div className="flex items-center gap-3">
              <div className="flex h-7 w-7 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 text-[10px] sm:text-xs font-bold text-background shrink-0">
                {pair.token0_symbol?.slice(0, 2)}
              </div>
              <div>
                <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                  <h1 className="text-sm sm:text-base font-bold tracking-tight">{pair.token0_symbol}</h1>
                  <span className="text-[10px] sm:text-xs text-muted-foreground">{pair.token0_name} / {pair.token1_symbol}</span>
                  <span className="rounded bg-emerald-500/20 px-1.5 py-0.5 text-[9px] font-bold text-emerald-400">LIVE</span>
                </div>
                <div className="mt-0.5 font-mono text-[10px] text-muted-foreground">{shortAddr(pair.address, 10)}</div>
              </div>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] uppercase tracking-wide text-muted-foreground">Price</span>
              <span className="text-xs sm:text-sm font-semibold">{formatPrice(Number(pair.priceToken0PerToken1))} {pair.token1_symbol}</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] uppercase tracking-wide text-muted-foreground">Reserve 0</span>
              <span className="text-xs sm:text-sm font-semibold">{pair.reserve0Formatted}</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] uppercase tracking-wide text-muted-foreground">Reserve 1</span>
              <span className="text-xs sm:text-sm font-semibold">{pair.reserve1Formatted}</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] uppercase tracking-wide text-muted-foreground">Swaps</span>
              <span className="text-xs sm:text-sm font-semibold">{formatNumber(pair.total_swaps, 0)}</span>
            </div>
          </div>
          <div className="flex items-center">
            <button
              type="button"
              onClick={toggleWatch}
              className={`flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                watched
                  ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-400"
                  : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {watched ? "★ Watching" : "☆ Watch"}
            </button>
          </div>
        </div>

        {/* Main layout: chart + tabs (left) | trade panel (right) */}
        <div className="grid gap-2 lg:grid-cols-[1fr_340px] xl:grid-cols-[1fr_380px]">
          <div className="space-y-2">
            <PairChart
              pairAddress={pair.address}
              symbol0={pair.token0_symbol}
              symbol1={pair.token1_symbol}
              decimals0={pair.token0_decimals}
              decimals1={pair.token1_decimals}
              currentPrice={pair.priceToken0PerToken1}
            />
            <TradeHistoryTabs pairAddress={pair.address} />
            <SyncBadge syncedAt={pair.updated_at} />
          </div>
          <div>
            <TradePanel
              pair={{
                address: pair.address,
                token0: { symbol: pair.token0_symbol, name: pair.token0_symbol, decimals: pair.token0_decimals },
                token1: { symbol: pair.token1_symbol, name: pair.token1_symbol, decimals: pair.token1_decimals },
                priceToken0PerToken1: pair.priceToken0PerToken1,
                priceToken1PerToken0: pair.priceToken1PerToken0,
              }}
            />
            <div className="mt-2"><TokenInfoPanel /></div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
