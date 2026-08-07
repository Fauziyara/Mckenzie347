"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { useAccount } from "wagmi";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { TokenLogo } from "@/components/token-logo";
import { formatUsd, formatPrice, formatPct, formatNumber, shortAddr } from "@/lib/format";
import { formatUnits } from "viem";

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

  useEffect(() => { setMounted(true); }, []);

  // Fetch market prices
  useEffect(() => {
    fetch("/api/markets")
      .then(r => r.json())
      .then(data => {
        if (data.success && data.markets) {
          const m: MarketData = {};
          for (const item of data.markets) {
            m[item.symbol] = { price: item.price || 0, change24h: item.change24h || 0 };
          }
          setMarkets(m);
        } else if (data.markets) {
          const m: MarketData = {};
          for (const item of data.markets) {
            m[item.symbol] = { price: item.price || 0, change24h: item.change24h || 0 };
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

  // Fetch real on-chain balances
  const fetchBalances = useCallback(async (wallet: string) => {
    setLoading(true);
    try {
      const results = await Promise.all(
        TOKENS.map(async (token) => {
          const paddedAddr = wallet.toLowerCase().slice(2).padStart(64, "0");
          const data = BALANCE_OF_SELECTOR + paddedAddr;
          const res = await fetch(RPC_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              jsonrpc: "2.0",
              id: 1,
              method: "eth_call",
              params: [{ to: token.address, data }, "latest"],
            }),
          }).then(r => r.json());

          const hexBalance = res?.result || "0x0";
          const balance = Number(formatUnits(BigInt(hexBalance), token.decimals));

          // Get price from markets or static
          const market = markets[token.symbol];
          const price = market?.price ?? STATIC_PRICES[token.symbol] ?? 0;
          const change24h = market?.change24h ?? 0;

          return {
            symbol: token.symbol,
            name: token.name,
            amount: balance,
            price,
            valueUsd: balance * price,
            change24h,
          } as Holding;
        })
      );

      // Filter out zero balances
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
    if (isConnected && address) {
      fetchBalances(address);
    } else {
      setHoldings([]);
      setLoading(false);
    }
  }, [mounted, isConnected, address, fetchBalances]);

  // Auto-refresh every 15s
  useEffect(() => {
    if (!isConnected || !address) return;
    const interval = setInterval(() => fetchBalances(address), 15000);
    return () => clearInterval(interval);
  }, [isConnected, address, fetchBalances]);

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
      <Header active="Portfolio" />
      <main className="w-full flex-1 px-4 py-6">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Portfolio</h1>
            <p className="text-sm text-muted-foreground">
              {mounted && isConnected && address
                ? `Wallet ${shortAddr(address)} · ${stats.count} assets · Live on-chain`
                : "Connect wallet to view real balances"}
            </p>
          </div>
          {mounted && isConnected && address && (
            <button
              type="button"
              onClick={copyAddress}
              className="rounded-md border border-border bg-muted/30 px-3 py-1.5 text-xs font-medium hover:bg-muted/50 cursor-pointer"
            >
              {copied ? "Copied!" : "Copy Address"}
            </button>
          )}
        </div>

        {/* Stats Cards */}
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
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

        {/* Not Connected */}
        {!loading && !isConnected && (
          <div className="rounded-lg border border-dashed border-border p-12 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted/30">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted-foreground">
                <rect x="2" y="6" width="20" height="12" rx="2" />
                <path d="M22 10H2" />
              </svg>
            </div>
            <p className="text-sm text-muted-foreground">Wallet not connected</p>
            <p className="mt-1 text-xs text-muted-foreground">Connect your wallet to view real Arc testnet balances</p>
          </div>
        )}

        {/* No Holdings */}
        {!loading && isConnected && holdings.length === 0 && (
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
                  <th className="px-3 py-2.5 text-left font-medium text-muted-foreground">Asset</th>
                  <th className="px-3 py-2.5 text-right font-medium text-muted-foreground">Amount</th>
                  <th className="px-3 py-2.5 text-right font-medium text-muted-foreground">Price</th>
                  <th className="px-3 py-2.5 text-right font-medium text-muted-foreground">Value</th>
                  <th className="px-3 py-2.5 text-right font-medium text-muted-foreground">24h</th>
                  <th className="px-3 py-2.5 text-right font-medium text-muted-foreground">Action</th>
                </tr>
              </thead>
              <tbody>
                {sortedHoldings.map((h) => {
                  const chPos = h.change24h >= 0;
                  return (
                    <tr key={h.symbol} className="border-b border-border/40 last:border-0 hover:bg-muted/20">
                      <td className="px-3 py-2.5">
                        <div className="flex items-center gap-2">
                          <TokenLogo symbol={h.symbol} size={28} />
                          <div>
                            <div className="font-medium">{h.symbol}</div>
                            <div className="text-[10px] text-muted-foreground">{h.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-2.5 text-right font-mono text-xs">{formatNumber(h.amount, h.symbol === "cirBTC" ? 8 : 4)}</td>
                      <td className="px-3 py-2.5 text-right font-mono text-xs">{formatPrice(h.price)}</td>
                      <td className="px-3 py-2.5 text-right font-mono text-xs font-medium">{formatUsd(h.valueUsd)}</td>
                      <td className={`px-3 py-2.5 text-right font-mono text-xs ${chPos ? "text-emerald-400" : "text-red-400"}`}>
                        {formatPct(h.change24h)}
                      </td>
                      <td className="px-3 py-2.5 text-right">
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
                  <td className="px-3 py-2.5 font-medium" colSpan={3}>Total</td>
                  <td className="px-3 py-2.5 text-right font-mono text-sm font-bold">{formatUsd(stats.totalValue)}</td>
                  <td colSpan={2} />
                </tr>
              </tfoot>
            </table>
          </div>
        )}

        {/* Info Bar */}
        {!loading && isConnected && holdings.length > 0 && (
          <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live · Auto-refresh every 15s · Arc Testnet
            </span>
            <span>Reading from RPC: {RPC_URL.replace("https://", "")}</span>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
