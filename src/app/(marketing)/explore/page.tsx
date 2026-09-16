"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { TokenLogo } from "@/components/token-logo";

interface Market {
  id: string;
  pair: string;
  baseAsset: string;
  quoteAsset: string;
  price: number;
  change24h: number;
  volume24h: number;
  marketCap: number;
  txCount: number;
}

// ── Helpers ──────────────────────────────────────────────

function fmtVol(n: number): string {
  if (!n || n <= 0) return "$0";
  if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`;
  if (n >= 1e3) return `$${(n / 1e3).toFixed(1)}K`;
  return `$${n.toFixed(0)}`;
}

function fmtPrice(n: number): string {
  if (!n || !isFinite(n)) return "0";
  if (n >= 1000) return n.toLocaleString("en-US", { maximumFractionDigits: 0 });
  if (n >= 1) return n.toFixed(2);
  if (n >= 0.01) return n.toFixed(4);
  return n.toFixed(8);
}

/** Deterministic pseudo-random generator seeded by string */
function seededRand(seed: string): () => number {
  let h = 1779033703 ^ seed.length;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    h ^= h >>> 16;
    return (h >>> 0) / 4294967296;
  };
}

/** Generate a sparkline SVG path string (50x24 viewBox) */
function sparkPath(positive: boolean, seed: string): string {
  const rand = seededRand(seed + "-spark");
  const n = 12;
  const points: [number, number][] = [];
  let y = 12;
  for (let i = 0; i < n; i++) {
    const x = (i / (n - 1)) * 50;
    const drift = positive ? -0.6 : 0.6;
    const noise = (rand() - 0.5) * 5;
    y = Math.max(3, Math.min(21, y + drift + noise));
    points.push([x, y]);
  }
  return points.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
}

// ── Sort type ────────────────────────────────────────────

type SortKey = "volume" | "marketCap" | "change" | "price";

// ── Component ────────────────────────────────────────────

export default function ExplorePage() {
  const [markets, setMarkets] = useState<Market[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [sortKey, setSortKey] = useState<SortKey>("volume");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [activeCategory, setActiveCategory] = useState<"all" | "watchlist">("all");
  const [tick, setTick] = useState(0);

  // Load watchlist from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("aperture-watchlist");
      if (saved) setWatchlist(JSON.parse(saved));
    } catch {}
  }, []);

  // Fetch markets
  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch("/api/markets", { signal: AbortSignal.timeout(8000) });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (!cancelled && data.success) {
          setMarkets(data.markets);
          setError(null);
        } else if (!cancelled && !data.success) {
          throw new Error(data.error || "API error");
        }
      } catch (e: any) {
        if (!cancelled) setError(e.message || "Failed to load");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  // Auto-refresh every 15s
  useEffect(() => {
    const interval = setInterval(() => {
      fetch("/api/markets", { signal: AbortSignal.timeout(8000) })
        .then(r => r.json())
        .then(data => {
          if (data.success) setMarkets(data.markets);
        })
        .catch(() => {});
      setTick(t => t + 1);
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  function toggleWatch(id: string) {
    setWatchlist(prev => {
      const next = prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id];
      try { localStorage.setItem("aperture-watchlist", JSON.stringify(next)); } catch {}
      return next;
    });
  }

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("desc"); }
  }

  const filtered = markets.filter(m => {
    if (activeCategory === "watchlist" && !watchlist.includes(m.id)) return false;
    if (search) {
      const q = search.toLowerCase();
      return m.pair.toLowerCase().includes(q) || m.baseAsset.toLowerCase().includes(q);
    }
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    let diff = 0;
    if (sortKey === "volume") diff = a.volume24h - b.volume24h;
    else if (sortKey === "marketCap") diff = a.marketCap - b.marketCap;
    else if (sortKey === "change") diff = a.change24h - b.change24h;
    else if (sortKey === "price") diff = a.price - b.price;
    return sortDir === "asc" ? diff : -diff;
  });

  const totalVolume = markets.reduce((a, m) => a + m.volume24h, 0);
  const totalMcap = markets.reduce((a, m) => a + m.marketCap, 0);
  const gainers = markets.filter(m => m.change24h > 0).length;


  const arrow = (key: SortKey) => sortKey === key ? (sortDir === "desc" ? "↓" : "↑") : "";

  return (
    <>
      <Header logoColor="green" active="Explore" />
      <main className="w-full flex-1 bg-explore">
        {/* Stats Bar */}
        <section className="border-b border-border/50 bg-muted/10">
          <div className="w-full px-4 py-4">
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-xl border border-border/50 bg-card/30 p-3">
                <div className="text-base sm:text-xl font-bold text-foreground font-mono">{loading ? "—" : fmtVol(totalVolume)}</div>
                <div className="text-xs text-muted-foreground mt-0.5">Total Volume 24h</div>
              </div>
              <div className="rounded-xl border border-border/50 bg-card/30 p-3">
                <div className="text-base sm:text-xl font-bold text-foreground font-mono">{loading ? "—" : fmtVol(totalMcap)}</div>
                <div className="text-xs text-muted-foreground mt-0.5">Total Market Cap</div>
              </div>
              <div className="rounded-xl border border-border/50 bg-card/30 p-3">
                <div className="text-base sm:text-xl font-bold text-emerald-400 font-mono">{loading ? "—" : <>{gainers}<span className="text-muted-foreground text-sm sm:text-base">/{markets.length}</span></>}</div>
                <div className="text-xs text-muted-foreground mt-0.5">Gainers</div>
              </div>
            </div>
          </div>
        </section>

        {/* Markets Table */}
        <section className="w-full px-2 sm:px-4 py-4">
          {/* Filter + Search */}
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <div className="flex items-center gap-1 rounded-lg bg-muted/50 p-1">
              <button
                type="button"
                onClick={() => setActiveCategory("all")}
                className={`rounded-md px-3 py-1 text-xs font-semibold cursor-pointer transition-colors ${activeCategory === "all" ? "bg-emerald-500 text-background" : "text-muted-foreground hover:text-foreground"}`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setActiveCategory("watchlist")}
                className={`rounded-md px-3 py-1 text-xs font-semibold cursor-pointer transition-colors ${activeCategory === "watchlist" ? "bg-emerald-500 text-background" : "text-muted-foreground hover:text-foreground"}`}
              >
                ★ {watchlist.length}
              </button>
            </div>
            <input
              type="text"
              placeholder="Search pair..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="h-8 w-full sm:max-w-xs rounded-lg border border-border/50 bg-muted/30 px-2.5 py-1 text-xs text-foreground placeholder:text-muted-foreground outline-none focus:border-emerald-500/50 transition-colors"
            />
          </div>

          {/* Loading state */}
          {loading && (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mb-4"></div>
                <p className="text-muted-foreground text-sm">Loading markets...</p>
              </div>
            </div>
          )}

          {/* Error state */}
          {!loading && error && (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <p className="text-red-400 text-sm mb-2">Failed to load markets</p>
                <p className="text-muted-foreground text-xs mb-4">{error}</p>
                <button
                  type="button"
                  onClick={() => { setLoading(true); setError(null); fetch("/api/markets").then(r => r.json()).then(d => { if (d.success) setMarkets(d.markets); }).catch(() => setError("Retry failed")).finally(() => setLoading(false)); }}
                  className="rounded-lg bg-emerald-500 px-4 py-2 text-xs font-bold text-background hover:bg-emerald-400 transition-colors"
                >
                  Retry
                </button>
              </div>
            </div>
          )}

          {/* Table */}
          {!loading && !error && (
            <>
              <div className="rounded-lg border border-border overflow-x-auto bg-background">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-muted/30 text-[10px] sm:text-[11px] font-medium text-muted-foreground uppercase tracking-wide">
                      <th className="px-2 py-2.5 text-left">Pair</th>
                      <th className="hidden sm:table-cell px-1 py-2.5 text-center">Trend</th>
                      <th
                        className="px-1 sm:px-2 py-2.5 text-right cursor-pointer hover:text-foreground transition-colors"
                        onClick={() => toggleSort("price")}
                      >
                        Price {arrow("price")}
                      </th>
                      <th
                        className="hidden md:table-cell px-2 py-2.5 text-right cursor-pointer hover:text-foreground transition-colors"
                        onClick={() => toggleSort("marketCap")}
                      >
                        MCap {arrow("marketCap")}
                      </th>
                      <th
                        className="px-1 sm:px-2 py-2.5 text-right cursor-pointer hover:text-foreground transition-colors"
                        onClick={() => toggleSort("change")}
                      >
                        24h {arrow("change")}
                      </th>
                      <th
                        className="hidden sm:table-cell px-1 sm:px-2 py-2.5 text-right cursor-pointer hover:text-foreground transition-colors"
                        onClick={() => toggleSort("volume")}
                      >
                        Vol {arrow("volume")}
                      </th>
                      <th className="px-1 sm:px-2 py-2.5 text-center">Swap</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sorted.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-4 py-12 text-center text-sm text-muted-foreground">
                          {activeCategory === "watchlist" ? "No watchlist items" : "No markets found"}
                        </td>
                      </tr>
                    ) : (
                      sorted.map((m, idx) => {
                        const isPositive = m.change24h >= 0;
                        const isWatched = watchlist.includes(m.id);
                        const spark = sparkPath(isPositive, m.id + tick);
                        return (
                          <tr
                            key={m.id}
                            className={`border-b border-border/40 last:border-0 transition-colors hover:bg-muted/20 ${idx % 2 === 0 ? "" : "bg-muted/5"}`}
                          >
                            {/* Pair */}
                            <td className="py-2 sm:py-2.5 px-1.5 sm:px-2 text-left">
                              <div className="flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => toggleWatch(m.id)}
                                  className="flex items-center justify-center text-sm text-muted-foreground hover:text-amber-400 transition-colors shrink-0"
                                  aria-label={isWatched ? "Remove from watchlist" : "Add to watchlist"}
                                >
                                  {isWatched ? "★" : "☆"}
                                </button>
                                <TokenLogo symbol={m.baseAsset} size={28} />
                                <div className="flex items-center gap-1 min-w-0">
                                  <span className="font-bold text-xs sm:text-sm text-foreground truncate">{m.baseAsset}</span>
                                  <span className="text-muted-foreground text-[10px] sm:text-xs">/USDC</span>
                                  {m.txCount > 0 && (
                                    <span className="hidden sm:inline-flex items-center gap-0.5 rounded bg-emerald-500/20 px-1 py-0.5 text-[9px] font-bold text-emerald-400 border border-emerald-500/30">
                                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                      LIVE
                                    </span>
                                  )}
                                </div>
                              </div>
                            </td>

                            {/* Trend (Sparkline) */}
                            <td className="hidden sm:table-cell px-1 py-2.5 text-center">
                              <svg width="50" height="24" viewBox="0 0 50 24" className="inline-block">
                                <path
                                  d={spark}
                                  fill="none"
                                  stroke={isPositive ? "#34d399" : "#f87171"}
                                  strokeWidth="1.5"
                                  strokeLinejoin="round"
                                  strokeLinecap="round"
                                />
                              </svg>
                            </td>

                            {/* Price */}
                            <td className="px-1 sm:px-2 py-2 sm:py-2.5 text-right">
                              <span className="font-mono text-xs sm:text-sm text-foreground">${fmtPrice(m.price)}</span>
                            </td>

                            {/* Market Cap */}
                            <td className="hidden md:table-cell px-2 py-2.5 text-right">
                              <span className="font-mono text-xs text-muted-foreground">{fmtVol(m.marketCap)}</span>
                            </td>

                            {/* 24h Change */}
                            <td className="px-1 sm:px-2 py-2 sm:py-2.5 text-right">
                              <span className={`font-mono text-xs sm:text-sm font-semibold ${isPositive ? "text-emerald-400" : "text-red-400"}`}>
                                {isPositive ? "+" : ""}{m.change24h.toFixed(2)}%
                              </span>
                            </td>

                            {/* Volume */}
                            <td className="hidden sm:table-cell px-1 sm:px-2 py-2 sm:py-2.5 text-right">
                              <span className="font-mono text-xs text-muted-foreground">{fmtVol(m.volume24h)}</span>
                            </td>

                            {/* Swap Button */}
                            <td className="px-1 sm:px-2 py-2 sm:py-2.5 text-center">
                              <a
                                href={`/swap?from=USDC&to=${m.baseAsset}`}
                                className="inline-flex items-center justify-center rounded-lg bg-emerald-500 px-2.5 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs font-bold text-background hover:bg-emerald-400 active:scale-95 transition-all"
                              >
                                Swap
                              </a>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between mt-3 px-1">
                <p className="text-[10px] sm:text-xs text-muted-foreground">
                </p>
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-[10px] text-emerald-400 font-medium">Live</span>
                </div>
              </div>
            </>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
