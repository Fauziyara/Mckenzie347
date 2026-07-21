"use client"
import { use, useState, useEffect, useRef } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { PairDetailHeader } from "@/components/pair-detail-header";
import { PairChart } from "@/components/pair-chart";
import { TradePanel } from "@/components/trade-panel";
import { TokenInfoPanel } from "@/components/token-info-panel";
import { PairDetailTabs } from "@/components/pair-detail-tabs";
import { SyncBadge } from "@/components/sync-badge";
import { formatUsd, formatPrice, formatNumber, timeAgo, shortAddr } from "@/lib/format";
import { mockPairs, generateMockTrades, type Pair, type TradeEntry } from "@/lib/mock-data";
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
  const [mockPair, setMockPair] = useState<Pair | null>(null);
  const [pair, setPair] = useState<PairData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [watched, setWatched] = useState(false);

  useEffect(() => {
    const mock = mockPairs.find(p => p.address.toLowerCase() === address.toLowerCase());
    if (mock) {
      setMockPair(mock);
      setLoading(false);
    } else {
      async function fetchPair() {
        try {
          const res = await fetch(`/api/indexer/pairs/${address}`);
          if (!res.ok) {
            if (res.status === 404) {
              setError("Pair tidak ditemukan");
              return;
            }
            throw new Error(`HTTP ${res.status}`);
          }
          const data = await res.json();
          if (data.success && data.pair) {
            setPair(data.pair);
          } else {
            setError("Data pair tidak valid");
          }
        } catch (e) {
          console.error("Failed to fetch pair:", e);
          setError("Failed to load data pair");
        } finally {
          setLoading(false);
        }
      }

      fetchPair();
      const interval = setInterval(fetchPair, 30000);
      return () => clearInterval(interval);
    }

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
      </>
    );
  }

  // === MOCK PAIR RENDER ===
  if (mockPair) {
    const p = mockPair;
    return (
      <>
        <Header active="Explore" />
        <main className="w-full flex-1 px-2 py-2">
          <div className="mb-2">
            <Link href="/" className="text-xs text-muted-foreground hover:text-foreground transition-colors">← Back</Link>
          </div>

          {/* Mock header */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-muted/5 px-4 py-2.5 rounded-t-lg">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 text-xs font-bold text-background">
                  {p.token0.symbol.slice(0, 2)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-base font-bold tracking-tight">{p.token0.symbol}</h1>
                    <span className="text-xs text-muted-foreground">{p.token0.name} / {p.token1.symbol}</span>
                    <span className="rounded bg-purple-500/20 px-1.5 py-0.5 text-[9px] font-bold text-purple-400">MOCK</span>
                  </div>
                  <div className="mt-0.5 font-mono text-[10px] text-muted-foreground">{shortAddr(p.address, 10)}</div>
                </div>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] uppercase tracking-wide text-muted-foreground">Price</span>
                <span className="text-sm font-semibold">{formatPrice(p.priceToken0PerToken1)} {p.token1.symbol}</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] uppercase tracking-wide text-muted-foreground">Mkt Cap</span>
                <span className="text-sm font-semibold">{formatUsd(p.marketCapUsd)}</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] uppercase tracking-wide text-muted-foreground">Liquidity</span>
                <span className="text-sm font-semibold">{formatUsd(p.liquidityUsd)}</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] uppercase tracking-wide text-muted-foreground">Volume 24h</span>
                <span className="text-sm font-semibold">{formatUsd(p.volume24h)}</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] uppercase tracking-wide text-muted-foreground">Holders</span>
                <span className="text-sm font-semibold">{formatNumber(p.holders, 0)}</span>
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
                {watched ? "★" : "☆"}
              </button>
            </div>
          </div>

          {/* Mock chart + sidebar */}
          <div className="grid gap-2 lg:grid-cols-[1fr_380px]">
            <div className="space-y-2">
              <MockPairChart pair={p} />
              <MockTradeTable pair={p} />
            </div>
            <div>
              <TradePanel pair={{
                address: p.address,
                token0: { symbol: p.token0.symbol, name: p.token0.name, decimals: p.token0.decimals },
                token1: { symbol: p.token1.symbol, name: p.token1.name, decimals: p.token1.decimals },
                priceToken0PerToken1: String(p.priceToken0PerToken1),
                priceToken1PerToken0: String(p.priceToken1PerToken0),
              }} />
              <div className="mt-2"><TokenInfoPanel /></div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // === REAL PAIR RENDER ===
  if (!pair) return null;

  return (
    <>
      <Header active="Explore" />
      <main className="w-full flex-1 px-2 py-2">
        <div className="mb-2">
          <Link href="/" className="text-xs text-muted-foreground hover:text-foreground transition-colors">← Back</Link>
        </div>

        {/* Compact header bar */}
        <PairDetailHeader pair={pair} watched={watched} onToggleWatch={toggleWatch} />

        {/* Main layout: chart + tabs (left) | trade panel (right) */}
        <div className="grid gap-2 lg:grid-cols-[1fr_380px]">
          <div className="space-y-2">
            <PairChart
              pairAddress={pair.address}
              symbol0={pair.token0_symbol}
              symbol1={pair.token1_symbol}
              decimals0={pair.token0_decimals}
              decimals1={pair.token1_decimals}
              currentPrice={pair.priceToken0PerToken1}
            />
            <PairDetailTabs
              pairAddress={pair.address}
              token0={pair.token0}
              token1={pair.token1}
              symbol0={pair.token0_symbol}
              symbol1={pair.token1_symbol}
              decimals0={pair.token0_decimals}
              decimals1={pair.token1_decimals}
              priceToken0PerToken1={pair.priceToken0PerToken1}
            />
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

// === Mock chart for mock pairs ===
function MockPairChart({ pair }: { pair: Pair }) {
  const [tf, setTf] = useState("1m");
  const [showIndicators, setShowIndicators] = useState(false);
  const [showPriceLine, setShowPriceLine] = useState(true);
  const candles = pair.ohlcv || [];

  if (candles.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-4">
        <div className="h-[400px] flex items-center justify-center text-muted-foreground text-sm">
          No chart data
        </div>
      </div>
    );
  }

  const prices = candles.flatMap(c => [c.high, c.low]);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const range = max - min || 1;
  const height = 400;
  const volumeHeight = 60;
  const padding = { top: 8, right: 0, bottom: 16, left: 0 };
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(900);
  useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver((entries) => {
      const w = entries[0].contentRect.width;
      if (w > 0) setWidth(w);
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);
  // SVG uses viewBox 0 0 1000 height, width=100% so it stretches to container
  // preserveAspectRatio="none" makes it fill edge-to-edge
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom - volumeHeight;
  const candleW = Math.max(2, (chartW / candles.length) * 0.9);
  const step = chartW / candles.length;
  const maxVol = Math.max(...candles.map(c => c.volume));

  const y = (price: number) => padding.top + ((max - price) / range) * chartH;
  const x = (i: number) => padding.left + i * step + step / 2;

  const last = candles[candles.length - 1];
  const prev = candles[candles.length - 2];
  const change = last && prev ? ((last.close - prev.close) / prev.close * 100) : 0;
  const totalVol = candles.reduce((a, b) => a + b.volume, 0);

  const fmt = (n: number) => {
    if (n >= 1000) return n.toFixed(0);
    if (n >= 1) return n.toFixed(2);
    if (n >= 0.01) return n.toFixed(4);
    return n.toFixed(6);
  };

  const priceLines = [];
  for (let i = 0; i <= 4; i++) {
    priceLines.push(min + (range / 4) * i);
  }

  const tfs = ["1s", "30s", "1m", "5m", "15m", "1h"];

  return (
    <div className="flex flex-col rounded-lg border border-border bg-card">
      {/* Timeframe controls — all clickable */}
      <div className="flex items-center justify-between border-b border-border px-3 py-1.5">
        <div className="flex items-center gap-1">
          {tfs.map((iv) => (
            <button
              key={iv}
              onClick={() => setTf(iv)}
              className={tf === iv ? "bg-emerald-500/20 text-emerald-400" : "text-muted-foreground hover:text-foreground hover:bg-muted/30"}
            >
              {iv}
            </button>
          ))}
          <div className="relative ml-2">
            <button
              onClick={() => setShowIndicators(!showIndicators)}
              className={showIndicators ? "bg-emerald-500/20 text-emerald-400" : "text-muted-foreground hover:text-foreground hover:bg-muted/30"}
            >
              Indicators
            </button>
            {showIndicators && (
              <div className="absolute left-0 top-full mt-1 z-20 w-40 rounded-lg border border-border bg-popover shadow-lg">
                <div className="p-1">
                  {["MA (7)", "MA (25)", "MA (99)", "Bollinger Bands", "RSI", "MACD", "Volume Profile"].map(ind => (
                    <button
                      key={ind}
                      onClick={() => setShowIndicators(false)}
                      className="block w-full rounded px-2 py-1 text-left text-[11px] text-muted-foreground hover:bg-muted/30 hover:text-foreground cursor-pointer"
                    >
                      {ind}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <button
            onClick={() => setShowPriceLine(!showPriceLine)}
            className="text-muted-foreground hover:text-foreground hover:bg-muted/30"
          >
            Price
          </button>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-muted-foreground/60">
          <span>% log auto</span>
        </div>
      </div>

      {/* OHLC header */}
      <div className="flex items-center gap-3 border-b border-border/50 px-3 py-1.5 text-[11px]">
        <span className="font-semibold text-foreground">{pair.token0.symbol} · {tf} · Mock</span>
        <span className="text-muted-foreground">O: <span className="text-foreground/80">{fmt(last.open)}</span></span>
        <span className="text-muted-foreground">H: <span className="text-foreground/80">{fmt(last.high)}</span></span>
        <span className="text-muted-foreground">L: <span className="text-foreground/80">{fmt(last.low)}</span></span>
        <span className="text-muted-foreground">C: <span className="text-foreground/80">{fmt(last.close)}</span></span>
        <span className={change >= 0 ? "text-emerald-400" : "text-red-400"}>
          {change >= 0 ? "+" : ""}{change.toFixed(2)}%
        </span>
        <span className="text-muted-foreground">Vol: <span className="text-foreground/80">{formatNumber(totalVol, 2)}</span></span>
      </div>

      {/* Chart */}
      <div ref={containerRef} className="w-full">
        <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="block w-full">
          {priceLines.map((price, i) => (
            <g key={i}>
              <line x1={0} y1={y(price)} x2={width} y2={y(price)} stroke="currentColor" strokeOpacity="0.1" strokeDasharray="4 4" />
              <text x={width - 50} y={y(price) + 4} fill="currentColor" fillOpacity="0.6" fontSize="10" fontFamily="monospace" style={{ textShadow: "0 0 4px rgba(0,0,0,0.8)" }}>
                {fmt(price)}
              </text>
            </g>
          ))}

          {showPriceLine && (
            <line x1={0} y1={y(last.close)} x2={width} y2={y(last.close)} stroke={change >= 0 ? "#22c55e" : "#ef4444"} strokeDasharray="4 4" strokeOpacity="0.5" />
          )}

          {candles.map((candle, i) => {
            const isGreen = candle.close >= candle.open;
            const color = isGreen ? "#22c55e" : "#ef4444";
            return (
              <g key={i}>
                <line x1={x(i)} y1={y(candle.high)} x2={x(i)} y2={y(candle.low)} stroke={color} strokeWidth="1" />
                <rect
                  x={x(i) - candleW / 2}
                  y={y(Math.max(candle.open, candle.close))}
                  width={candleW}
                  height={Math.max(1, Math.abs(y(candle.open) - y(candle.close)))}
                  fill={color}
                  fillOpacity="0.8"
                />
                {maxVol > 0 && (
                  <rect
                    x={x(i) - candleW / 2}
                    y={height - padding.bottom - (candle.volume / maxVol) * volumeHeight}
                    width={candleW}
                    height={(candle.volume / maxVol) * volumeHeight}
                    fill={color}
                    fillOpacity="0.3"
                  />
                )}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
function MockTradeTable({ pair }: { pair: Pair }) {
  const mockTrades = generateMockTrades(pair.address);
  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="flex items-center gap-1 border-b border-border px-2 py-1">
        <button className="rounded px-3 py-1 text-[11px] font-medium bg-emerald-500/20 text-emerald-400">Trades</button>
        <button className="rounded px-3 py-1 text-[11px] font-medium text-muted-foreground">Holders ({pair.holders})</button>
        <button className="rounded px-3 py-1 text-[11px] font-medium text-muted-foreground">Top Traders</button>
      </div>
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-border/50 text-[10px] uppercase text-muted-foreground/60">
            <th className="px-3 py-1.5 text-left">Age</th>
            <th className="px-3 py-1.5 text-left">Type</th>
            <th className="px-3 py-1.5 text-right">MC</th>
            <th className="px-3 py-1.5 text-right">{pair.token0.symbol}</th>
            <th className="px-3 py-1.5 text-right">Total USD</th>
            <th className="px-3 py-1.5 text-right">Trader</th>
          </tr>
        </thead>
        <tbody>
          {mockTrades.length === 0 ? (
            <tr><td colSpan={6} className="py-6 text-center text-muted-foreground">Mock data — generate trades for demo</td></tr>
          ) : (
            mockTrades.map((trade, i) => (
              <tr key={i} className="border-b border-border/20 hover:bg-muted/10">
                <td className="px-3 py-1.5 text-muted-foreground">{timeAgo(Math.floor(Date.now()/1000) - trade.ageSec)}</td>
                <td className="px-3 py-1.5">
                  <span className={`font-medium ${trade.type === "buy" ? "text-emerald-400" : "text-red-400"}`}>
                    {trade.type === "buy" ? "Buy" : "Sell"}
                  </span>
                </td>
                <td className="px-3 py-1.5 text-right font-mono text-muted-foreground">{formatUsd(trade.marketCap)}</td>
                <td className="px-3 py-1.5 text-right font-mono">{trade.tokenAmount < 0.001 ? trade.tokenAmount.toFixed(6) : trade.tokenAmount < 1 ? trade.tokenAmount.toFixed(4) : formatNumber(trade.tokenAmount, 2)}</td>
                <td className="px-3 py-1.5 text-right font-mono">${trade.amountUsd.toFixed(2)}</td>
                <td className="px-3 py-1.5 text-right font-mono text-muted-foreground">{shortAddr(trade.trader, 6)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

// === Mock live feed ===
function MockLiveFeed({ pair }: { pair: Pair }) {
  const trades = generateMockTrades(pair.address);
  return (
    <div className="flex h-full flex-col rounded-lg border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-3 py-2">
        <div className="flex items-center gap-1">
          <span className="rounded px-2 py-0.5 text-[10px] font-medium bg-foreground text-background">All</span>
          <span className="rounded px-2 py-0.5 text-[10px] font-medium text-muted-foreground">Buy</span>
          <span className="rounded px-2 py-0.5 text-[10px] font-medium text-muted-foreground">Sell</span>
        </div>
        <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-medium text-emerald-400">Instant</span>
      </div>
      <div className="grid grid-cols-[40px_50px_1fr_70px_1fr] gap-1 border-b border-border/50 px-3 py-1 text-[9px] uppercase tracking-wide text-muted-foreground/60">
        <span>Age</span>
        <span>Type</span>
        <span className="text-right">Token</span>
        <span className="text-right">USD</span>
        <span className="text-right">Trader</span>
      </div>
      <div className="overflow-y-auto" style={{ maxHeight: "500px" }}>
        {trades.length === 0 ? (
          <div className="flex h-32 items-center justify-center text-xs text-muted-foreground">No trades</div>
        ) : (
          trades.map((trade, i) => (
            <div
              key={i}
              className={`grid grid-cols-[40px_50px_1fr_70px_1fr] gap-1 px-3 py-1 text-[11px] border-b border-border/20 hover:bg-muted/10 ${
                trade.type === "buy" ? "bg-emerald-500/5" : "bg-red-500/5"
              }`}
            >
              <span className="text-muted-foreground">{timeAgo(Math.floor(Date.now()/1000) - trade.ageSec)}</span>
              <span className={`font-medium ${trade.type === "buy" ? "text-emerald-400" : "text-red-400"}`}>
                {trade.type === "buy" ? "Buy" : "Sell"}
              </span>
              <span className="text-right font-mono text-foreground/80">{trade.tokenAmount < 0.001 ? trade.tokenAmount.toFixed(6) : trade.tokenAmount < 1 ? trade.tokenAmount.toFixed(4) : formatNumber(trade.tokenAmount, 2)}</span>
              <span className="text-right font-mono text-foreground/80">${trade.amountUsd.toFixed(2)}</span>
              <span className="text-right font-mono text-muted-foreground">{shortAddr(trade.trader, 4)}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
