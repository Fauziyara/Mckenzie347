"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { useAccount } from "wagmi";
import { encodeFunctionData, formatUnits } from "viem";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { TokenLogo } from "@/components/token-logo";
import { formatUsd, formatPrice, formatPct, formatNumber, shortAddr } from "@/lib/format";

// Arc testnet tokens
const USDC_ADDRESS = "0x3600000000000000000000000000000000000000";
const CIRBTC_ADDRESS = "0xf0c4a4ce82a5746abaad9425360ab04fbba432bf";
const EURC_ADDRESS = "0x89b50855aa3be2f677cd6303cec089b5f319d72a";
const RPC_URL = "https://rpc.testnet.arc.network";

const TOKENS = [
  { symbol: "USDC", name: "USD Coin", address: USDC_ADDRESS, decimals: 6 },
  { symbol: "cirBTC", name: "Circle Wrapped Bitcoin", address: CIRBTC_ADDRESS, decimals: 8 },
  { symbol: "EURC", name: "Euro Coin", address: EURC_ADDRESS, decimals: 6 },
];

// Multicall3 address on Arc testnet
const MULTICALL3_ADDRESS = "0xcA11bde05977b3631167028862bE2a173976CA11";

// Decode aggregate3 return data manually (no viem decodeAbiParameters needed)
function decodeAggregate3Result(hexResult: string): { success: boolean; data: string | null }[] {
  const hex = hexResult.slice(2);
  const results: { success: boolean; data: string | null }[] = [];

  // Skip offset word (32 bytes) — array starts at 0x20
  const arrLen = parseInt(hex.slice(64, 128), 16);

  for (let i = 0; i < arrLen; i++) {
    // Each tuple offset (32 bytes)
    const tupleOffset = parseInt(hex.slice(128 + i * 64, 128 + (i + 1) * 64), 16);

    // success (bool) — 32 bytes at tupleOffset
    const success = parseInt(hex.slice(tupleOffset * 2, tupleOffset * 2 + 64), 16) === 1;

    // returnData offset (relative to tuple start)
    const dataOffsetRel = parseInt(hex.slice(tupleOffset * 2 + 64, tupleOffset * 2 + 128), 16);

    // returnData length
    const dataLen = parseInt(hex.slice(tupleOffset * 2 + dataOffsetRel * 2, tupleOffset * 2 + dataOffsetRel * 2 + 64), 16);

    // returnData
    const dataHex = dataLen > 0
      ? hex.slice(tupleOffset * 2 + dataOffsetRel * 2 + 64, tupleOffset * 2 + dataOffsetRel * 2 + 64 + dataLen * 2)
      : "";

    results.push({ success, data: dataHex ? "0x" + dataHex : null });
  }

  return results;
}

const MULTICALL3_ABI = [
  {
    type: "function",
    name: "aggregate3",
    inputs: [
      { name: "calls", type: "tuple[]", components: [
        { name: "target", type: "address" },
        { name: "allowFailure", type: "bool" },
        { name: "callData", type: "bytes" },
      ]},
    ],
    outputs: [
      { name: "returnData", type: "tuple[]", components: [
        { name: "success", type: "bool" },
        { name: "returnData", type: "bytes" },
      ]},
    ],
    stateMutability: "payable",
  },
] as const;

// balanceOf(address) = 0x70a08231
const BALANCE_OF_SELECTOR = "0x70a08231";

interface Holding {
  symbol: string;
  name: string;
  amount: number;
  price: number;
  valueUsd: number;
  change24h: number;
}

interface MarketData {
  [symbol: string]: { price: number; change24h: number };
}

export default function PortofolioPage() {
  const { address, isConnected } = useAccount();
  const [mounted, setMounted] = useState(false);
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [loading, setLoading] = useState(true);
  const [markets, setMarkets] = useState<MarketData>({});
  const [copied, setCopied] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [manualAddress, setManualAddress] = useState("");
  const [searchedAddress, setSearchedAddress] = useState<string | null>(null);

  // Effective address: wallet-connected > manual search > null
  const activeAddress = searchedAddress ?? (isConnected ? address : null) ?? null;

  useEffect(() => { setMounted(true); }, []);

  // Fetch market prices
  useEffect(() => {
    fetch("/api/markets")
      .then(r => r.json())
      .then(data => {
        const raw = data.markets || (data.success ? data.markets : []);
        if (Array.isArray(raw)) {
          const m: MarketData = {};
          for (const item of raw) {
            const sym = item.baseAsset || item.symbol || item.pair?.split("/")[0];
            if (sym) m[sym] = { price: item.price || 0, change24h: item.change24h || 0 };
          }
          setMarkets(m);
        }
      })
      .catch(() => {});
  }, []);

  // Static fallback prices
  const STATIC_PRICES: Record<string, number> = {
    USDC: 1,
    cirBTC: 64000,
    EURC: 1.08,
  };

  // Fetch real on-chain balances via API proxy (avoids CORS + rate limit)
  const fetchBalances = useCallback(async (wallet: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/balances", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wallet }),
      }).then(r => r.json());

      const results: Holding[] = [];
      if (res?.success && Array.isArray(res.balances)) {
        for (const b of res.balances) {
          const market = markets[b.symbol];
          const price = market?.price ?? STATIC_PRICES[b.symbol] ?? 0;
          results.push({
            symbol: b.symbol,
            name: b.name || b.symbol,
            amount: b.amount || 0,
            price,
            valueUsd: (b.amount || 0) * price,
            change24h: market?.change24h ?? 0,
          });
        }
      }

      const nonZero = results.filter(h => h.amount > 0.000001);
      setHoldings(nonZero);
    } catch (e) {
      console.error("Failed to fetch balances:", e);
      setHoldings([]);
    } finally {
      setLoading(false);
    }
  }, [markets]);

  useEffect(() => {
    if (!mounted) return;
    if (activeAddress) {
      fetchBalances(activeAddress);
    } else {
      setHoldings([]);
      setLoading(false);
    }
  }, [mounted, activeAddress, fetchBalances]);

  // No auto-refresh — manual only via Refresh button

  function searchAddress(e: React.FormEvent) {
    e.preventDefault();
    const addr = manualAddress.trim();
    if (/^0x[a-fA-F0-9]{40}$/.test(addr)) {
      setSearchedAddress(addr);
    } else {
      setToast("Invalid address format");
    }
  }

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2500);
    return () => clearTimeout(t);
  }, [toast]);

  const stats = useMemo(() => {
    const totalValue = holdings.reduce((s, h) => s + h.valueUsd, 0);
    const best = [...holdings].sort((a, b) => b.change24h - a.change24h)[0];
    const worst = [...holdings].sort((a, b) => a.change24h - b.change24h)[0];
    return { totalValue, best, worst, count: holdings.length };
  }, [holdings]);

  const sortedHoldings = useMemo(() => {
    return [...holdings].sort((a, b) => b.valueUsd - a.valueUsd);
  }, [holdings]);

  async function copyAddress() {
    if (!address) return;
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setToast("Address copied");
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setToast("Failed to copy");
    }
  }

  return (
    <>
      <Header logoColor="green" active="Portfolio" />
      <main className="w-full flex-1 px-4 py-6">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Portfolio</h1>
            <p className="text-sm text-muted-foreground">
              {mounted && activeAddress
                ? `Wallet ${shortAddr(activeAddress)} · ${stats.count} assets · Live on-chain`
                : "Connect wallet or paste an address to view balances"}
            </p>
          </div>
          {mounted && activeAddress && (
            <>
            <button
              type="button"
              onClick={() => {
                if (activeAddress) {
                  navigator.clipboard.writeText(activeAddress);
                  setCopied(true);
                  setToast("Address copied");
                  setTimeout(() => setCopied(false), 1800);
                }
              }}
              className="rounded-md border border-border bg-muted/30 px-3 py-1.5 text-xs font-medium hover:bg-muted/50 cursor-pointer"
            >
              {copied ? "Copied!" : "Copy Address"}
            </button>
            <button type="button" onClick={() => activeAddress && fetchBalances(activeAddress)} disabled={loading || !activeAddress} className="rounded-md border border-border bg-muted/30 px-3 py-1.5 text-xs font-medium hover:bg-muted/50 cursor-pointer disabled:opacity-50">
              {loading ? "Loading…" : "↻ Refresh"}
            </button>
            </>
          )}
        </div>

        {/* Stats Cards */}
        <div className="mb-6 grid grid-cols-2 gap-2 sm:gap-3 sm:grid-cols-4">
          <div className="rounded-md border border-border bg-muted/20 px-3 py-3">
            <div className="text-[11px] text-muted-foreground">Total Value</div>
            <div className="mt-1 text-lg font-bold font-mono">{formatUsd(stats.totalValue)}</div>
          </div>
          <div className="rounded-md border border-border bg-muted/20 px-3 py-3">
            <div className="text-[11px] text-muted-foreground">Assets</div>
            <div className="mt-1 text-lg font-bold font-mono">{stats.count}</div>
          </div>
          <div className="rounded-md border border-border bg-muted/20 px-3 py-3">
            <div className="text-[11px] text-muted-foreground">Top Performer</div>
            <div className="mt-1 text-sm font-semibold">
              {stats.best ? stats.best.symbol : "—"}
              {stats.best && (
                <span className={`ml-2 font-mono text-xs ${stats.best.change24h >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                  {formatPct(stats.best.change24h)}
                </span>
              )}
            </div>
          </div>
          <div className="rounded-md border border-border bg-muted/20 px-3 py-3">
            <div className="text-[11px] text-muted-foreground">Lowest Performer</div>
            <div className="mt-1 text-sm font-semibold">
              {stats.worst ? stats.worst.symbol : "—"}
              {stats.worst && (
                <span className={`ml-2 font-mono text-xs ${stats.worst.change24h >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                  {formatPct(stats.worst.change24h)}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-muted border-t-emerald-500" />
            <span className="ml-3 text-sm text-muted-foreground">Loading on-chain balances...</span>
          </div>
        )}

        {/* Not Connected — Manual Address Search */}
        {!loading && !activeAddress && (
          <div className="space-y-4">
            <form onSubmit={searchAddress} className="flex flex-col sm:flex-row gap-2 max-w-lg">
              <input
                type="text"
                value={manualAddress}
                onChange={e => setManualAddress(e.target.value)}
                placeholder="0x... paste wallet address"
                spellCheck={false}
                autoComplete="off"
                className="flex-1 rounded-lg border border-border bg-muted/30 px-4 py-2 text-sm font-mono outline-none focus:border-emerald-500/50"
              />
              <button
                type="submit"
                className="rounded-lg bg-emerald-500 px-6 py-2 text-sm font-medium text-background hover:bg-emerald-600 cursor-pointer"
              >
                Search
              </button>
            </form>
            <div className="rounded-lg border border-dashed border-border p-12 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted/30">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted-foreground">
                  <rect x="2" y="6" width="20" height="12" rx="2" />
                  <path d="M22 10H2" />
                </svg>
              </div>
              <p className="text-sm text-muted-foreground">Connect wallet or paste an address above</p>
              <p className="mt-1 text-xs text-muted-foreground">View real Arc testnet token balances (USDC, cirBTC, EURC)</p>
            </div>
          </div>
        )}

        {/* No Holdings */}
        {!loading && activeAddress && holdings.length === 0 && (
          <div className="rounded-lg border border-dashed border-border p-12 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted/30">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted-foreground">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v12M8 10h8M8 14h8" />
              </svg>
            </div>
            <p className="text-sm text-muted-foreground">No token balances found</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Get testnet tokens from the faucet, or swap USDC → cirBTC/EURC on the swap page
            </p>
            <a
              href="/swap"
              className="mt-3 inline-block text-sm text-emerald-400 hover:underline"
            >
              Go to Swap →
            </a>
          </div>
        )}

        {/* Holdings Table */}
        {!loading && holdings.length > 0 && (
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="px-2 sm:px-3 py-2.5 text-left font-medium text-muted-foreground">Asset</th>
                  <th className="hidden sm:table-cell px-3 py-2.5 text-right font-medium text-muted-foreground">Amount</th>
                  <th className="hidden md:table-cell px-3 py-2.5 text-right font-medium text-muted-foreground">Price</th>
                  <th className="px-2 sm:px-3 py-2.5 text-right font-medium text-muted-foreground">Value</th>
                  <th className="px-2 sm:px-3 py-2.5 text-right font-medium text-muted-foreground">24h</th>
                  <th className="hidden sm:table-cell px-3 py-2.5 text-right font-medium text-muted-foreground">Action</th>
                </tr>
              </thead>
              <tbody>
                {sortedHoldings.map((h) => {
                  const chPos = h.change24h >= 0;
                  return (
                    <tr key={h.symbol} className="border-b border-border/40 last:border-0 hover:bg-muted/20">
                      <td className="px-2 sm:px-3 py-2.5">
                        <div className="flex items-center gap-2">
                          <TokenLogo symbol={h.symbol} size={24} />
                          <div className="min-w-0">
                            <div className="font-medium text-sm">{h.symbol}</div>
                            <div className="text-[10px] text-muted-foreground truncate">{h.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="hidden sm:table-cell px-3 py-2.5 text-right font-mono text-xs">{formatNumber(h.amount, h.symbol === "cirBTC" ? 8 : 4)}</td>
                      <td className="hidden md:table-cell px-3 py-2.5 text-right font-mono text-xs">{formatPrice(h.price)}</td>
                      <td className="px-2 sm:px-3 py-2.5 text-right font-mono text-xs font-medium">{formatUsd(h.valueUsd)}</td>
                      <td className={`px-2 sm:px-3 py-2.5 text-right font-mono text-xs ${chPos ? "text-emerald-400" : "text-red-400"}`}>
                        {formatPct(h.change24h)}
                      </td>
                      <td className="hidden sm:table-cell px-3 py-2.5 text-right">
                        <a
                          href="/swap"
                          className="rounded border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-400 hover:bg-emerald-500/20"
                        >
                          Swap
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="border-t border-border bg-muted/20">
                  <td className="px-2 sm:px-3 py-2.5 font-medium" colSpan={3}>Total</td>
                  <td className="px-2 sm:px-3 py-2.5 text-right font-mono text-sm font-bold">{formatUsd(stats.totalValue)}</td>
                  <td colSpan={2} />
                </tr>
              </tfoot>
            </table>
          </div>
        )}

        {/* Info Bar */}
        {!loading && activeAddress && holdings.length > 0 && (
          <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live · Arc Testnet
            </span>
            <span>Reading from RPC: {RPC_URL.replace("https://", "")}</span>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
