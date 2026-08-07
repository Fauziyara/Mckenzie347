"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { TokenLogo } from "@/components/token-logo";
import { formatPrice, formatPct, shortAddr } from "@/lib/format";
import { Input } from "@/components/ui/input";

type SortKey = "priceToken0PerToken1" | "txCount24h" | "liquidityUsd" | "createdAt";
type Tab = "top" | "trending" | "new" | "watchlist";

// Map Arc testnet symbols to recognizable names
const SYMBOL_MAP: Record<string, string> = {
  cirBTC: "BTC",
  solXC: "SOL",
  APEPE: "PEPE",
  mog: "MOG",
  BULLY: "BULLY",
  WUSDC: "USDC",
  wUSDC: "USDC",
  EURC: "EURC",
  ACHS: "ACHS",
  AWE: "AWE",
  SYN: "SYN",
  KITTY: "KITTY",
  JAY: "JAY",
};

function mapSymbol(sym: string): string {
  return SYMBOL_MAP[sym] || sym;
}

// Leverage tiers based on token
function getLeverage(sym: string): string {
  const mapped = mapSymbol(sym);
  if (["BTC", "ETH", "SOL"].includes(mapped)) return "100x";
  return "50x";
}

export function PairTable({ pairs }: { pairs: any[] }) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("txCount24h");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [tab, setTab] = useState<Tab>("top");
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [buyPair, setBuyPair] = useState<any | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("aperture-watchlist");
    if (saved) setWatchlist(JSON.parse(saved));
    const handler = () => {
      const s = localStorage.getItem("aperture-watchlist");
      setWatchlist(s ? JSON.parse(s) : []);
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  function toggleWatch(address: string) {
    setWatchlist(prev => {
      const next = prev.includes(address) ? prev.filter(a => a !== address) : [...prev, address];
      localStorage.setItem("aperture-watchlist", JSON.stringify(next));
      return next;
    });
  }

  const filtered = useMemo(() => {
    let result = [...pairs];

    if (tab === "watchlist") {
      result = result.filter(p => watchlist.includes(p.address));
    }

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(p => {
        const s0 = (p.token0?.symbol || "").toLowerCase();
        const s1 = (p.token1?.symbol || "").toLowerCase();
        const m0 = mapSymbol(p.token0?.symbol || "").toLowerCase();
        const m1 = mapSymbol(p.token1?.symbol || "").toLowerCase();
        return s0.includes(q) || s1.includes(q) || m0.includes(q) || m1.includes(q) || p.address.toLowerCase().includes(q);
      });
    }

    result.sort((a, b) => {
      let diff = 0;
      if (sortKey === "priceToken0PerToken1") diff = (Number(a.priceToken0PerToken1) || 0) - (Number(b.priceToken0PerToken1) || 0);
      else if (sortKey === "txCount24h") diff = (a.total_swaps || a.txCount24h || 0) - (b.total_swaps || b.txCount24h || 0);
      else if (sortKey === "liquidityUsd") diff = (Number(a.liquidityUsd) || 0) - (Number(b.liquidityUsd) || 0);
      else diff = (a.createdAt || 0) - (b.createdAt || 0);
      return sortDir === "asc" ? diff : -diff;
    });

    return result;
  }, [pairs, search, sortKey, sortDir, tab, watchlist]);

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("desc"); }
  }

  return (
    <div className="space-y-3">
      {/* Tabs */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 rounded-lg bg-muted/50 p-1">
            {([
              ["top", "Top"],
              ["trending", "Trending"],
              ["new", "New"],
              ["watchlist", `★ ${watchlist.length}`],
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
        </div>
        <Input
          placeholder="Search token or address..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="sm:max-w-xs bg-muted/30 border-border/50 h-8 text-xs"
        />
      </div>

      {/* ===== COMPACT TABLE (like perpetuals exchange) ===== */}
      <div className="overflow-hidden rounded-lg border border-border">
        {/* Header */}
        <div className="flex items-center border-b border-border bg-muted/30 px-2 sm:px-3 py-2 text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
          <div className="w-5 sm:w-6 shrink-0" />
          <div className="flex-1 ml-1 sm:ml-2 min-w-0">Pair</div>
          <div className="hidden md:block w-16 text-center">Lev</div>
          <div
            className="w-20 sm:w-28 text-right cursor-pointer hover:text-foreground shrink-0"
            onClick={() => toggleSort("priceToken0PerToken1")}
          >
            Price {sortKey === "priceToken0PerToken1" && (sortDir === "desc" ? "↓" : "↑")}
          </div>
          <div className="hidden sm:block w-20 text-right">24h</div>
          <div
            className="hidden lg:block w-24 text-right cursor-pointer hover:text-foreground"
            onClick={() => toggleSort("txCount24h")}
          >
            Swaps {sortKey === "txCount24h" && (sortDir === "desc" ? "↓" : "↑")}
          </div>
          <div className="w-14 sm:w-16 text-center shrink-0">Trade</div>
        </div>

        {/* Rows */}
        {filtered.length === 0 ? (
          <div className="px-4 py-12 text-center text-sm text-muted-foreground">
            {tab === "watchlist" ? "No pairs in watchlist. Click ★ to add." : "No pairs found"}
          </div>
        ) : (
          filtered.map((pair, idx) => {
            const sym0 = pair.token0?.symbol || "?";
            const sym1 = pair.token1?.symbol || "?";
            const mapped0 = mapSymbol(sym0);
            const mapped1 = mapSymbol(sym1);
            const lev = getLeverage(sym0);
            const price = Number(pair.priceToken0PerToken1) || 0;
            const swaps = pair.total_swaps || pair.txCount24h || 0;
            const change = 0; // No historical price data yet
            const isPositive = change >= 0;
            const isWatched = watchlist.includes(pair.address);

            return (
              <div
                key={pair.address}
                className={`flex items-center px-2 sm:px-3 py-2 sm:py-2.5 border-b border-border/40 last:border-0 transition-colors hover:bg-muted/20 ${idx % 2 === 0 ? "" : "bg-muted/5"}`}
              >
                {/* Star */}
                <button
                  type="button"
                  onClick={() => toggleWatch(pair.address)}
                  className="w-5 sm:w-6 shrink-0 flex items-center justify-center text-muted-foreground hover:text-amber-400 transition-colors"
                >
                  {isWatched ? "★" : "☆"}
                </button>

                {/* Pair name + logos */}
                <Link href={`/pair/${pair.address}`} className="flex-1 flex items-center gap-1.5 sm:gap-2 ml-1 sm:ml-2 min-w-0">
                  <div className="flex items-center" style={{ marginRight: -4 }}>
                    <TokenLogo symbol={mapped0} size={22} />
                    <div style={{ marginLeft: -7 }}>
                      <TokenLogo symbol={mapped1} size={22} />
                    </div>
                  </div>
                  <span className="font-medium text-xs sm:text-sm truncate">{mapped0}</span>
                  <span className="text-muted-foreground text-[10px] sm:text-xs">/{mapped1}</span>
                  <span className="hidden sm:inline-flex rounded bg-emerald-500/20 px-1.5 py-0 text-[9px] font-bold text-emerald-400 border border-emerald-500/30 items-center gap-0.5">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    LIVE
                  </span>
                </Link>

                {/* Leverage */}
                <div className="hidden md:block w-16 text-center">
                  <span className="rounded bg-amber-500/15 px-1.5 py-0.5 text-[10px] font-bold text-amber-400">
                    {lev}
                  </span>
                </div>

                {/* Price */}
                <div className="w-20 sm:w-28 text-right font-mono text-xs text-foreground shrink-0">
                  {formatPrice(price)}
                </div>

                {/* 24h change */}
                <div className={`hidden sm:block w-20 text-right font-mono text-xs font-medium ${isPositive ? "text-emerald-400" : "text-red-400"}`}>
                  {formatPct(change)}
                </div>

                {/* Swaps */}
                <div className="hidden lg:block w-24 text-right font-mono text-xs text-muted-foreground">
                  {swaps}
                </div>

                {/* Trade button */}
                <div className="w-14 sm:w-16 text-center shrink-0">
                  <button
                    type="button"
                    onClick={() => setBuyPair(pair)}
                    className="rounded-md bg-emerald-500/10 px-2.5 py-1 text-[10px] font-medium text-emerald-400 hover:bg-emerald-500/20 transition-colors cursor-pointer"
                  >
                    Trade
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      <p className="text-xs text-muted-foreground">
        {filtered.length} of {pairs.length} pairs
      </p>

      {/* Quick Buy Modal */}
      {buyPair && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={() => setBuyPair(null)}>
          <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 m-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">
                {mapSymbol(buyPair.token0?.symbol || "?")} / {mapSymbol(buyPair.token1?.symbol || "?")}
              </h3>
              <button onClick={() => setBuyPair(null)} className="text-muted-foreground hover:text-foreground">✕</button>
            </div>
            <p className="text-xs text-muted-foreground mb-2">Address: {shortAddr(buyPair.address)}</p>
            <p className="text-xs text-muted-foreground mb-2">Price: {formatPrice(Number(buyPair.priceToken0PerToken1) || 0)}</p>
            <p className="text-xs text-muted-foreground mb-4">Swaps: {buyPair.total_swaps || 0}</p>
            <Link href={`/pair/${buyPair.address}`}>
              <button className="w-full rounded-lg bg-emerald-500 py-2.5 text-sm font-medium text-background hover:bg-emerald-600 transition-colors">
                View Pair Details
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
