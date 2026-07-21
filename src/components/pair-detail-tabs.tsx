"use client";

import { useState, useEffect } from "react";
import { formatUsd, formatNumber, shortAddr, timeAgo } from "@/lib/format";

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
}

interface Holder {
  address: string;
  balance: string;
  percentage: number;
}

interface Transfer {
  tx_hash: string;
  block_number: number;
  timestamp: number;
  from: string;
  to: string;
  value: string;
  symbol: string;
}

interface PairDetailTabsProps {
  pairAddress: string;
  token0: string;
  token1: string;
  symbol0: string;
  symbol1: string;
  decimals0: number;
  decimals1: number;
  priceToken0PerToken1: string;
}

type Tab = "trades" | "holders" | "transfers" | "toptraders";

const TABS: { id: Tab; label: string }[] = [
  { id: "trades", label: "Trades" },
  { id: "holders", label: "Holders" },
  { id: "transfers", label: "Transfers" },
  { id: "toptraders", label: "Top Traders" },
];

export function PairDetailTabs({
  pairAddress,
  token0,
  token1,
  symbol0,
  symbol1,
  decimals0,
  decimals1,
  priceToken0PerToken1,
}: PairDetailTabsProps) {
  const [activeTab, setActiveTab] = useState<Tab>("trades");
  const [swaps, setSwaps] = useState<Swap[]>([]);
  const [holders, setHolders] = useState<Holder[]>([]);
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (activeTab === "trades") {
      fetchSwaps();
    } else if (activeTab === "holders") {
      fetchHolders();
    } else if (activeTab === "transfers") {
      fetchTransfers();
    } else if (activeTab === "toptraders") {
      fetchSwaps();
    }
  }, [activeTab, pairAddress]);

  async function fetchSwaps() {
    setLoading(true);
    try {
      const res = await fetch(`/api/indexer/pairs/${pairAddress}/swaps?limit=50`);
      if (res.ok) {
        const data = await res.json();
        if (data.success) setSwaps(data.swaps);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function fetchHolders() {
    setLoading(true);
    try {
      // Try token0 holders
      const res = await fetch(`/api/arc/holders?token=${token0}&limit=30`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setHolders(data);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function fetchTransfers() {
    setLoading(true);
    try {
      const res = await fetch(`/api/arc/transfers?token=${token0}&symbol=${symbol0}&decimals=${decimals0}&blocks=10000`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setTransfers(data);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const price = parseFloat(priceToken0PerToken1);

  // Process swaps for trades tab
  const processedSwaps = swaps.map(s => {
    const isBuy = s.amount0_in !== "0" && s.amount0_in !== "";
    const tokenAmount = isBuy
      ? parseFloat(s.amount1_out) / (10 ** decimals1)
      : parseFloat(s.amount0_out) / (10 ** decimals0);
    const usdAmount = tokenAmount * price;
    return { ...s, isBuy, tokenAmount, usdAmount };
  });

  // Aggregate top traders
  const traderStats = swaps.reduce((acc, s) => {
    const addr = s.sender;
    if (!acc[addr]) {
      acc[addr] = { address: addr, buys: 0, sells: 0, totalUsd: 0, count: 0 };
    }
    const isBuy = s.amount0_in !== "0" && s.amount0_in !== "";
    const tokenAmount = isBuy
      ? parseFloat(s.amount1_out) / (10 ** decimals1)
      : parseFloat(s.amount0_out) / (10 ** decimals0);
    const usdAmount = tokenAmount * price;

    if (isBuy) acc[addr].buys++;
    else acc[addr].sells++;
    acc[addr].totalUsd += usdAmount;
    acc[addr].count++;
    return acc;
  }, {} as Record<string, { address: string; buys: number; sells: number; totalUsd: number; count: number }>);

  const topTraders = Object.values(traderStats).sort((a, b) => b.totalUsd - a.totalUsd).slice(0, 20);

  return (
    <div className="rounded-lg border border-border bg-card">
      {/* Tab bar */}
      <div className="flex items-center gap-1 border-b border-border px-2 py-1">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`rounded px-3 py-1 text-[11px] font-medium transition-colors cursor-pointer ${
              activeTab === tab.id
                ? "bg-emerald-500/20 text-emerald-400"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
            {tab.id === "holders" && holders.length > 0 && (
              <span className="ml-1 text-[9px] text-muted-foreground">({holders.length})</span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="flex h-32 items-center justify-center">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
          </div>
        ) : activeTab === "trades" ? (
          <TradesTable swaps={processedSwaps} symbol0={symbol0} price={price} />
        ) : activeTab === "holders" ? (
          <HoldersTable holders={holders} decimals0={decimals0} />
        ) : activeTab === "transfers" ? (
          <TransfersTable transfers={transfers} decimals0={decimals0} />
        ) : activeTab === "toptraders" ? (
          <TopTradersTable traders={topTraders} />
        ) : null}
      </div>
    </div>
  );
}

function TradesTable({ swaps, symbol0, price }: { swaps: any[]; symbol0: string; price: number }) {
  return (
    <table className="w-full text-xs">
      <thead>
        <tr className="border-b border-border/50 text-[10px] uppercase text-muted-foreground/60">
          <th className="px-3 py-1.5 text-left">Age</th>
          <th className="px-3 py-1.5 text-left">Type</th>
          <th className="px-3 py-1.5 text-right">MC</th>
          <th className="px-3 py-1.5 text-right">{symbol0}</th>
          <th className="px-3 py-1.5 text-right">Total USD</th>
          <th className="px-3 py-1.5 text-right">Trader</th>
        </tr>
      </thead>
      <tbody>
        {swaps.length === 0 ? (
          <tr><td colSpan={6} className="py-8 text-center text-muted-foreground">No trades yet</td></tr>
        ) : (
          swaps.map((swap, i) => (
            <tr key={swap.tx_hash + i} className="border-b border-border/20 hover:bg-muted/10">
              <td className="px-3 py-1.5 text-muted-foreground">{timeAgo(swap.timestamp)}</td>
              <td className="px-3 py-1.5">
                <span className={`font-medium ${swap.isBuy ? "text-emerald-400" : "text-red-400"}`}>
                  {swap.isBuy ? "Buy" : "Sell"}
                </span>
              </td>
              <td className="px-3 py-1.5 text-right font-mono text-muted-foreground">
                ${formatNumber(price, 0)}
              </td>
              <td className="px-3 py-1.5 text-right font-mono">
                {formatNumber(swap.tokenAmount, 2)}
              </td>
              <td className="px-3 py-1.5 text-right font-mono">
                ${swap.usdAmount.toFixed(2)}
              </td>
              <td className="px-3 py-1.5 text-right font-mono text-muted-foreground">
                {shortAddr(swap.sender, 6)}
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}

function HoldersTable({ holders, decimals0 }: { holders: Holder[]; decimals0: number }) {
  return (
    <table className="w-full text-xs">
      <thead>
        <tr className="border-b border-border/50 text-[10px] uppercase text-muted-foreground/60">
          <th className="px-3 py-1.5 text-left">#</th>
          <th className="px-3 py-1.5 text-left">Address</th>
          <th className="px-3 py-1.5 text-right">Balance</th>
          <th className="px-3 py-1.5 text-right">%</th>
        </tr>
      </thead>
      <tbody>
        {holders.length === 0 ? (
          <tr><td colSpan={4} className="py-8 text-center text-muted-foreground">No holder data</td></tr>
        ) : (
          holders.map((holder, i) => (
            <tr key={holder.address + i} className="border-b border-border/20 hover:bg-muted/10">
              <td className="px-3 py-1.5 text-muted-foreground">{i + 1}</td>
              <td className="px-3 py-1.5 font-mono">{shortAddr(holder.address, 8)}</td>
              <td className="px-3 py-1.5 text-right font-mono">{formatNumber(parseFloat(holder.balance) / (10 ** decimals0), 4)}</td>
              <td className="px-3 py-1.5 text-right font-mono text-emerald-400">{holder.percentage?.toFixed(2) || "0.00"}%</td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}

function TransfersTable({ transfers, decimals0 }: { transfers: Transfer[]; decimals0: number }) {
  return (
    <table className="w-full text-xs">
      <thead>
        <tr className="border-b border-border/50 text-[10px] uppercase text-muted-foreground/60">
          <th className="px-3 py-1.5 text-left">Age</th>
          <th className="px-3 py-1.5 text-left">From</th>
          <th className="px-3 py-1.5 text-left">To</th>
          <th className="px-3 py-1.5 text-right">Amount</th>
          <th className="px-3 py-1.5 text-right">Tx</th>
        </tr>
      </thead>
      <tbody>
        {transfers.length === 0 ? (
          <tr><td colSpan={5} className="py-8 text-center text-muted-foreground">No transfer data</td></tr>
        ) : (
          transfers.map((tx, i) => (
            <tr key={tx.tx_hash + i} className="border-b border-border/20 hover:bg-muted/10">
              <td className="px-3 py-1.5 text-muted-foreground">{timeAgo(tx.timestamp)}</td>
              <td className="px-3 py-1.5 font-mono text-muted-foreground">{shortAddr(tx.from, 6)}</td>
              <td className="px-3 py-1.5 font-mono text-muted-foreground">{shortAddr(tx.to, 6)}</td>
              <td className="px-3 py-1.5 text-right font-mono">{formatNumber(parseFloat(tx.value) / (10 ** decimals0), 4)} {tx.symbol}</td>
              <td className="px-3 py-1.5 text-right font-mono text-muted-foreground">{shortAddr(tx.tx_hash, 6)}</td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}

function TopTradersTable({ traders }: { traders: { address: string; buys: number; sells: number; totalUsd: number; count: number }[] }) {
  return (
    <table className="w-full text-xs">
      <thead>
        <tr className="border-b border-border/50 text-[10px] uppercase text-muted-foreground/60">
          <th className="px-3 py-1.5 text-left">#</th>
          <th className="px-3 py-1.5 text-left">Trader</th>
          <th className="px-3 py-1.5 text-right">Buys</th>
          <th className="px-3 py-1.5 text-right">Sells</th>
          <th className="px-3 py-1.5 text-right">Total USD</th>
          <th className="px-3 py-1.5 text-right">Trades</th>
        </tr>
      </thead>
      <tbody>
        {traders.length === 0 ? (
          <tr><td colSpan={6} className="py-8 text-center text-muted-foreground">No trader data yet</td></tr>
        ) : (
          traders.map((trader, i) => (
            <tr key={trader.address + i} className="border-b border-border/20 hover:bg-muted/10">
              <td className="px-3 py-1.5 text-muted-foreground">{i + 1}</td>
              <td className="px-3 py-1.5 font-mono">{shortAddr(trader.address, 8)}</td>
              <td className="px-3 py-1.5 text-right font-mono text-emerald-400">{trader.buys}</td>
              <td className="px-3 py-1.5 text-right font-mono text-red-400">{trader.sells}</td>
              <td className="px-3 py-1.5 text-right font-mono">${formatNumber(trader.totalUsd, 2)}</td>
              <td className="px-3 py-1.5 text-right font-mono text-muted-foreground">{trader.count}</td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}
