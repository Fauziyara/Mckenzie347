"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import type { Pair } from "@/lib/mock-data";
import { formatUsd, formatPrice, formatNumber, timeAgo, shortAddr, formatPct } from "@/lib/format";
import { Sparkline } from "@/components/sparkline";
import { TokenLogo } from "@/components/token-logo";
import { Input } from "@/components/ui/input";
import { QuickBuyModal } from "@/components/quick-buy-modal";

type SortKey = "createdAt" | "liquidityUsd" | "volume24h" | "txCount24h" | "marketCapUsd";
type Tab = "top" | "tren" | "baru" | "lonjakan" | "dipantau";

const TAB_INFO: Record<Tab, { label: string; desc: string }> = {
  top: { label: "Top", desc: "All pairs on Arc network" },
  tren: { label: "Trending", desc: "Pair dengan harga naik" },
  baru: { label: "New", desc: "Pair baru (≤24 h)" },
  lonjakan: { label: "Surge", desc: "Pair dengan kenaikan >10%" },
  dipantau: { label: "Watchlist", desc: "Pair yang kamu pantau" },
};

export function PairTable({ pairs }: { pairs: Pair[] }) {
  const [search, setSearch] = useState("");
  const [minLiq, setMinLiq] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("createdAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [tab, setTab] = useState<Tab>("top");
  const [timeframe, setTimeframe] = useState<"5m" | "1h" | "24h">("5m");
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [buyPair, setBuyPair] = useState<Pair | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("aperture-watchlist");
    if (saved) setWatchlist(JSON.parse(saved));
    const handler = () => {
      const s = localStorage.getItem("aperture-watchlist");
      setWatchlist(s ? JSON.parse(s) : []);
    };
    window.addEventListener("storage", handler);
    // Simulate loading
    const t = setTimeout(() => setLoading(false), 400);
    return () => { window.removeEventListener("storage", handler); clearTimeout(t); };
  }, []);

  const filtered = useMemo(() => {
    let result = [...pairs];

    if (tab === "baru") {
      result = result.filter(p => Date.now() / 1000 - p.createdAt < 86400);
    } else if (tab === "tren") {
      result = result.filter(p => {
        const ch = timeframe === "5m" ? p.priceChange5m : timeframe === "1h" ? p.priceChange1h : p.priceChange24h;
        return ch > 0;
      });
    } else if (tab === "lonjakan") {
      result = result.filter(p => {
        const ch = timeframe === "5m" ? p.priceChange5m : timeframe === "1h" ? p.priceChange1h : p.priceChange24h;
        return ch > 10;
      });
    } else if (tab === "dipantau") {
      result = result.filter(p => watchlist.includes(p.address));
    }

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(p =>
        p.token0.symbol.toLowerCase().includes(q) ||
        p.token1.symbol.toLowerCase().includes(q) ||
        p.address.toLowerCase().includes(q)
      );
    }

    const min = parseFloat(minLiq);
    if (!isNaN(min) && min > 0) result = result.filter(p => p.liquidityUsd >= min);

    if (tab === "tren" || tab === "lonjakan") {
      const chKey = timeframe === "5m" ? "priceChange5m" : timeframe === "1h" ? "priceChange1h" : "priceChange24h";
      result.sort((a, b) => (b as any)[chKey] - (a as any)[chKey]);
    } else {
      result.sort((a, b) => {
        const diff = a[sortKey] - b[sortKey];
        return sortDir === "asc" ? diff : -diff;
      });
    }

    // Always pin live swap pairs to top
    result.sort((a, b) => (b.isSwapReal ? 1 : 0) - (a.isSwapReal ? 1 : 0));

    return result;
  }, [pairs, search, minLiq, sortKey, sortDir, tab, timeframe, watchlist]);

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("desc"); }
  }

  function SortIcon({ k }: { k: SortKey }) {
    if (sortKey !== k) return <span className="text-muted-foreground/30">↕</span>;
    return <span className="text-foreground">{sortDir === "asc" ? "↑" : "↓"}</span>;
  }

  function getChange(p: Pair) {
    return timeframe === "5m" ? p.priceChange5m : timeframe === "1h" ? p.priceChange1h : p.priceChange24h;
  }

  // Loading skeleton
  if (loading) {
    return (
      <div className="space-y-3">
        <div className="flex gap-2">
          {[1,2,3,4,5].map(i => (
            <div key={i} className="h-8 w-20 animate-pulse rounded-md bg-muted/50" />
          ))}
        </div>
        <div className="h-10 w-full animate-pulse rounded-md bg-muted/30" />
        <div className="overflow-x-auto rounded-lg border border-border">
          <div className="space-y-1 p-2">
            {[1,2,3,4,5,6,7,8].map(i => (
              <div key={i} className="flex h-12 animate-pulse items-center gap-4 rounded bg-muted/20 px-3">
                <div className="h-4 w-24 rounded bg-muted/40" />
                <div className="h-4 w-16 rounded bg-muted/40" />
                <div className="h-4 w-12 rounded bg-muted/40" />
                <div className="ml-auto h-4 w-16 rounded bg-muted/40" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Tabs + Timeframe */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 rounded-lg bg-muted/50 p-1">
            {([
              ["top", "Top"],
              ["tren", "Trending"],
              ["baru", "New"],
              ["lonjakan", "Surge"],
              ["dipantau", `Watchlist${watchlist.length ? ` (${watchlist.length})` : ""}`],
            ] as [Tab, string][]).map(([t, label]) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                  tab === t
                    ? "bg-emerald-500 text-background shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1 rounded-lg bg-muted/50 p-1">
            {(["5m", "1h", "24h"] as const).map(tf => (
              <button
                key={tf}
                type="button"
                onClick={() => setTimeframe(tf)}
                className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                  timeframe === tf
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>
        <div className="hidden sm:block text-xs text-muted-foreground">
          {TAB_INFO[tab].desc} — <span className="text-foreground font-medium">{filtered.length}</span> pairs
        </div>
      </div>

      {/* Search + Sort */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Input
          placeholder="Search token, symbol, or address..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="sm:max-w-sm bg-muted/30 border-border/50"
        />
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground whitespace-nowrap">Min Liq:</span>
          <Input
            type="number"
            placeholder="0"
            value={minLiq}
            onChange={e => setMinLiq(e.target.value)}
            className="w-28 bg-muted/30 border-border/50"
          />
        </div>
        <div className="hidden items-center gap-1 sm:ml-auto sm:flex">
          <span className="text-xs text-muted-foreground mr-1">Sort:</span>
          {([
            ["createdAt", "New"],
            ["marketCapUsd", "MCap"],
            ["liquidityUsd", "Liq"],
            ["volume24h", "Vol"],
            ["txCount24h", "TX"],
          ] as [SortKey, string][]).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => toggleSort(key)}
              className={`h-7 rounded-md px-2.5 text-xs font-medium gap-1 inline-flex items-center justify-center border transition-colors cursor-pointer ${
                sortKey === key
                  ? "bg-emerald-500 text-background border-emerald-500 hover:bg-emerald-600"
                  : "border-border bg-background hover:bg-muted hover:text-foreground"
              }`}
            >
              {label}
              <SortIcon k={key} />
            </button>
          ))}
        </div>
      </div>

      {/* ===== DESKTOP TABLE (md and up) ===== */}
      <div className="hidden overflow-x-auto rounded-lg border border-border md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="px-3 py-2.5 text-left font-medium text-muted-foreground">Pair</th>
              <th className="px-3 py-2.5 text-center font-medium text-muted-foreground">Chart</th>
              <th className="px-3 py-2.5 text-right font-medium text-muted-foreground">Price</th>
              <th className="px-3 py-2.5 text-right font-medium text-muted-foreground">{timeframe}</th>
              <th className="px-3 py-2.5 text-right font-medium text-muted-foreground">Mkt Cap</th>
              <th className="px-3 py-2.5 text-right font-medium text-muted-foreground">Liquidity</th>
              <th className="px-3 py-2.5 text-right font-medium text-muted-foreground">Volume</th>
              <th className="px-3 py-2.5 text-right font-medium text-muted-foreground">TX (B/S)</th>
              <th className="px-3 py-2.5 text-right font-medium text-muted-foreground">Token Info</th>
                            <th className="px-3 py-2.5 text-center font-medium text-muted-foreground">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={11} className="px-4 py-12 text-center text-muted-foreground">
                  {tab === "dipantau" ? "No tokens in watchlist. Click ☆ Watch on pair page." : "No pairs found"}
                </td>
              </tr>
            ) : (
              filtered.map(pair => {
                const isNew = Date.now() / 1000 - pair.createdAt < 86400;
                const change = getChange(pair);
                const isPositive = change >= 0;
                return (
                  <tr key={pair.address} className="border-b border-border/40 transition-colors last:border-0 hover:bg-muted/20">
                    <td className="px-3 py-2.5">
                      <Link href={pair.isSwapReal ? "/swap" : `/pair/${pair.address}`} className="block">
                        <div className="flex items-center gap-2">
                          <TokenLogo symbol={pair.token0.symbol} size={24} />
                          <span className="font-medium">{pair.token0.symbol}</span>
                          <span className="text-muted-foreground text-xs">/ {pair.token1.symbol}</span>
                          {isNew && (
                            <span className="rounded bg-emerald-500/20 px-1 py-0 text-[9px] font-bold text-emerald-400">NEW</span>
                          )}
                          {pair.isSwapReal && (
                            <span className="rounded bg-emerald-500/20 px-1.5 py-0 text-[9px] font-bold text-emerald-400 border border-emerald-500/30 flex items-center gap-0.5">
                              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />LIVE
                            </span>
                          )}
                        </div>
                        <div className="mt-0.5 font-mono text-[10px] text-muted-foreground">{shortAddr(pair.address)}</div>
                      </Link>
                    </td>
                    <td className="px-3 py-2.5">
                      <Link href={`/pair/${pair.address}`}>
                        <Sparkline data={pair.sparkline} positive={isPositive} width={72} height={24} />
                      </Link>
                    </td>
                    <td className="px-3 py-2.5 text-right font-mono text-xs">{formatPrice(pair.priceToken0PerToken1)}</td>
                    <td className={`px-3 py-2.5 text-right font-mono text-xs font-medium ${isPositive ? "text-emerald-400" : "text-red-400"}`}>{formatPct(change)}</td>
                    <td className="px-3 py-2.5 text-right font-mono text-xs">{formatUsd(pair.marketCapUsd)}</td>
                    <td className="px-3 py-2.5 text-right font-mono text-xs">{formatUsd(pair.liquidityUsd)}</td>
                    <td className="px-3 py-2.5 text-right font-mono text-xs">{formatUsd(pair.volume24h)}</td>
                    <td className="px-3 py-2.5 text-right font-mono text-xs">
                      <span className="text-emerald-400">{pair.buys24h}</span>
                      <span className="text-muted-foreground">/</span>
                      <span className="text-red-400">{pair.sells24h}</span>
                    </td>
                    <td className="px-3 py-2.5 text-right font-mono text-xs text-muted-foreground">
                      <div className="inline-grid grid-cols-3 gap-x-2 gap-y-0.5 text-[10px] items-center">
  <span className="flex items-center gap-0.5 text-red-400"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 0 8 4 4 0 0 0 0-8M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>{pair.top10Pct}%</span>
  <span className="flex items-center gap-0.5 text-red-400"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 18h20M3 6l4 4 5-6 5 6 4-4-2 12H5L3 6z"/></svg>{pair.devPct}%</span>
  <span className="flex items-center gap-0.5 text-red-400"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>{pair.sniperPct}%</span>
  <span className="flex items-center gap-0.5 text-red-400"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>{pair.insiderPct}%</span>
  <span className="flex items-center gap-0.5 text-red-400"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 12h.01M15 12h.01M9 15h.01M15 15h.01M12 2a8 8 0 0 0-8 8v12l3-2 2 2 3-2 3 2 2-2 3 2V10a8 8 0 0 0-8-8z"/></svg>{pair.bundlerPct}%</span>
  <span className="flex items-center gap-0.5 text-emerald-400"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>Paid</span>
</div>
                    </td>
                                        <td className="px-3 py-2.5 text-center">
                      <button
                        type="button"
                        onClick={() => setBuyPair(pair)}
                        className="rounded-md bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400 hover:bg-emerald-500/20 transition-colors cursor-pointer"
                      >
                        Buy
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* ===== MOBILE CARDS (below md) ===== */}
      <div className="space-y-2 md:hidden">
        {filtered.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            {tab === "dipantau" ? "Belum ada pair dipantau" : "No pairs found"}
          </div>
        ) : (
          filtered.map(pair => {
            const isNew = Date.now() / 1000 - pair.createdAt < 86400;
            const change = getChange(pair);
            const isPositive = change >= 0;
            return (
              <div key={pair.address} className="rounded-lg border border-border p-3">
                <div className="flex items-start justify-between">
                  <Link href={pair.isSwapReal ? "/swap" : `/pair/${pair.address}`}>
                    <div className="flex items-center gap-2">
                      <TokenLogo symbol={pair.token0.symbol} size={28} />
                      <span className="font-medium">{pair.token0.symbol}</span>
                      <span className="text-muted-foreground text-xs">/ {pair.token1.symbol}</span>
                      {isNew && <span className="rounded bg-emerald-500/20 px-1 text-[9px] font-bold text-emerald-400">NEW</span>}
                      {pair.isSwapReal && (
                        <span className="rounded bg-emerald-500/20 px-1 text-[9px] font-bold text-emerald-400 border border-emerald-500/30">LIVE</span>
                      )}
                    </div>
                    <div className="mt-0.5 font-mono text-[10px] text-muted-foreground">{shortAddr(pair.address)}</div>
                  </Link>
                  <Sparkline data={pair.sparkline} positive={isPositive} width={60} height={20} />
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm">{formatPrice(pair.priceToken0PerToken1)}</span>
                    <span className={`font-mono text-xs font-medium ${isPositive ? "text-emerald-400" : "text-red-400"}`}>{formatPct(change)}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setBuyPair(pair)}
                    className="rounded-md bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400 hover:bg-emerald-500/20 cursor-pointer"
                  >
                    Buy
                  </button>
                </div>
                <div className="mt-2 grid grid-cols-3 gap-2 text-[10px] text-muted-foreground">
                  <div>Liq: <span className="font-mono text-foreground">{formatUsd(pair.liquidityUsd)}</span></div>
                  <div>Vol: <span className="font-mono text-foreground">{formatUsd(pair.volume24h)}</span></div>
                  <div>TX: <span className="text-emerald-400">{pair.buys24h}</span>/<span className="text-red-400">{pair.sells24h}</span></div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <p className="text-xs text-muted-foreground">
        {filtered.length} dari {pairs.length} pairs
      </p>

      {/* Quick Buy Modal */}
      {buyPair && <QuickBuyModal pair={buyPair} onClose={() => setBuyPair(null)} />}
    </div>
  );
}
