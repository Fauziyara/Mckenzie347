"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useAccount } from "wagmi";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { TokenLogo } from "@/components/token-logo";
import { mockPairs } from "@/lib/mock-data";
import { formatUsd, formatPrice, formatPct, formatNumber, shortAddr } from "@/lib/format";

interface Holding {
  id: string;
  symbol: string;
  name: string;
  amount: number;
  price: number;
  valueUsd: number;
  change24h: number;
  pairAddress: string;
  avgBuy: number;
  pnlUsd: number;
  pnlPct: number;
}

type ActionMode = "depo" | "wd" | "swap" | null;

const STORAGE_KEY = "aperture-portfolio";
// Deposit address EVM (Arc Testnet)
const PLATFORM_DEPOSIT_ADDRESS = "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1";

function recompute(h: Holding, amount: number, price: number, avgBuy: number): Holding {
  const valueUsd = amount * price;
  const cost = amount * avgBuy;
  const pnlUsd = valueUsd - cost;
  const pnlPct = cost > 0 ? (pnlUsd / cost) * 100 : 0;
  return { ...h, amount, price, avgBuy, valueUsd, pnlUsd, pnlPct };
}

function buildDefaultHoldings(): Holding[] {
  const picks = mockPairs.slice(0, 6);
  return picks.map((p, i) => {
    const amount = [1250, 42.5, 890, 3.2, 15000, 0.85][i] ?? 100;
    const avgBuy = p.priceToken0PerToken1 * (0.82 + (i % 4) * 0.05);
    const base: Holding = {
      id: p.address,
      symbol: p.token0.symbol,
      name: p.token0.name,
      amount: 0,
      price: p.priceToken0PerToken1,
      valueUsd: 0,
      change24h: p.priceChange24h,
      pairAddress: p.address,
      avgBuy,
      pnlUsd: 0,
      pnlPct: 0,
    };
    return recompute(base, amount, p.priceToken0PerToken1, avgBuy);
  });
}

export default function PortofolioPage() {
  const { address, isConnected } = useAccount();
  const [mounted, setMounted] = useState(false);
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [hideDust, setHideDust] = useState(false);
  const [sortBy, setSortBy] = useState<"value" | "pnl" | "change">("value");
  const [toast, setToast] = useState<string | null>(null);

  // Action modal state
  const [actionMode, setActionMode] = useState<ActionMode>(null);
  const [selected, setSelected] = useState<Holding | null>(null);
  const [amount, setAmount] = useState("");
  const [swapTo, setSwapTo] = useState("");
  const [sendAddress, setSendAddress] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setHoldings(JSON.parse(saved));
        return;
      } catch {
        // fall through
      }
    }
    const defaults = buildDefaultHoldings();
    setHoldings(defaults);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaults));
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2200);
    return () => clearTimeout(t);
  }, [toast]);

  const stats = useMemo(() => {
    const totalValue = holdings.reduce((s, h) => s + h.valueUsd, 0);
    const totalPnl = holdings.reduce((s, h) => s + h.pnlUsd, 0);
    const cost = totalValue - totalPnl;
    const totalPnlPct = cost > 0 ? (totalPnl / cost) * 100 : 0;
    const best = [...holdings].sort((a, b) => b.pnlPct - a.pnlPct)[0];
    const worst = [...holdings].sort((a, b) => a.pnlPct - b.pnlPct)[0];
    return { totalValue, totalPnl, totalPnlPct, best, worst, count: holdings.length };
  }, [holdings]);

  const visible = useMemo(() => {
    let rows = [...holdings];
    if (hideDust) rows = rows.filter((h) => h.valueUsd >= 1);
    rows.sort((a, b) => {
      if (sortBy === "pnl") return b.pnlUsd - a.pnlUsd;
      if (sortBy === "change") return b.change24h - a.change24h;
      return b.valueUsd - a.valueUsd;
    });
    return rows;
  }, [holdings, hideDust, sortBy]);

  function persist(next: Holding[]) {
    setHoldings(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  function openAction(mode: ActionMode, holding?: Holding) {
    setActionMode(mode);
    setSelected(holding ?? holdings[0] ?? null);
    setAmount("");
    setSwapTo("");
    setSendAddress("");
    setCopied(false);
  }

  function closeAction() {
    setActionMode(null);
    setSelected(null);
    setAmount("");
    setSwapTo("");
    setSendAddress("");
    setCopied(false);
  }

  function isValidEvmAddress(addr: string) {
    return /^0x[a-fA-F0-9]{40}$/.test(addr.trim());
  }

  function confirmAction() {
    if (!actionMode) return;
    const val = parseFloat(amount);
    if (!val || val <= 0) {
      setToast("Masukkan amount valid");
      return;
    }

    if (actionMode === "wd") {
      if (!selected) {
        setToast("Pilih aset dulu");
        return;
      }
      const toAddr = sendAddress.trim();
      if (!toAddr) {
        setToast("Masukkan send address");
        return;
      }
      if (!isValidEvmAddress(toAddr)) {
        setToast("Address EVM tidak valid");
        return;
      }
      if (val > selected.amount) {
        setToast("Amount melebihi balance");
        return;
      }
      const next = holdings
        .map((h) => {
          if (h.id !== selected.id) return h;
          return recompute(h, h.amount - val, h.price, h.avgBuy);
        })
        .filter((h) => h.amount > 0.0000001);
      persist(next);
      setToast(`Withdraw ${formatNumber(val, 4)} ${selected.symbol} → ${shortAddr(toAddr)}`);
      closeAction();
      return;
    }

    if (actionMode === "swap") {
      if (!selected) {
        setToast("Pilih aset sumber");
        return;
      }
      if (!swapTo) {
        setToast("Select token tujuan");
        return;
      }
      if (val > selected.amount) {
        setToast("Amount melebihi balance");
        return;
      }
      if (swapTo === selected.symbol) {
        setToast("Token tujuan harus beda");
        return;
      }

      const targetPair = mockPairs.find((p) => p.token0.symbol === swapTo);
      const targetPrice = targetPair?.priceToken0PerToken1 ?? selected.price;
      const srcValue = val * selected.price;
      const dstAmount = targetPrice > 0 ? srcValue / targetPrice : 0;

      let next = holdings.map((h) => {
        if (h.id !== selected.id) return h;
        return recompute(h, h.amount - val, h.price, h.avgBuy);
      });

      const existing = next.find((h) => h.symbol === swapTo);
      if (existing) {
        next = next.map((h) => {
          if (h.symbol !== swapTo) return h;
          const newAmount = h.amount + dstAmount;
          const newAvg = newAmount > 0 ? (h.amount * h.avgBuy + dstAmount * targetPrice) / newAmount : targetPrice;
          return recompute(h, newAmount, targetPrice, newAvg);
        });
      } else if (targetPair) {
        const newHolding: Holding = recompute(
          {
            id: targetPair.address,
            symbol: targetPair.token0.symbol,
            name: targetPair.token0.name,
            amount: 0,
            price: targetPrice,
            valueUsd: 0,
            change24h: targetPair.priceChange24h,
            pairAddress: targetPair.address,
            avgBuy: targetPrice,
            pnlUsd: 0,
            pnlPct: 0,
          },
          dstAmount,
          targetPrice,
          targetPrice
        );
        next = [...next, newHolding];
      }

      next = next.filter((h) => h.amount > 0.0000001);
      persist(next);
      setToast(`Swap ${formatNumber(val, 4)} ${selected.symbol} → ${formatNumber(dstAmount, 4)} ${swapTo}`);
      closeAction();
    }
  }

  const modalTitle =
    actionMode === "depo" ? "Deposit" : actionMode === "wd" ? "Withdraw" : actionMode === "swap" ? "Swap" : "";

  const depositAddress = (mounted && isConnected && address) ? address : PLATFORM_DEPOSIT_ADDRESS;

  async function copyDepositAddress() {
    try {
      await navigator.clipboard.writeText(depositAddress);
      setCopied(true);
      setToast("Address disalin");
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setToast("Failed copy address");
    }
  }

  const tokenOptions = useMemo(() => {
    const fromHoldings = holdings.map((h) => h.symbol);
    const fromPairs = mockPairs.map((p) => p.token0.symbol);
    return Array.from(new Set([...fromHoldings, ...fromPairs])).sort();
  }, [holdings]);

  const qrUrl =
    "https://api.qrserver.com/v1/create-qr-code/?size=180x180&margin=8&data=" +
    encodeURIComponent(depositAddress);

  return (
    <>
      <Header active="Portfolio" />
      <main className="w-full flex-1 px-4 py-6">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Portfolio</h1>
            <p className="text-sm text-muted-foreground">
              {mounted && isConnected && address
                ? `Wallet ${shortAddr(address)} · ${stats.count} aset`
                : "Demo mode · connect wallet to sync real balance (testnet)"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => openAction("depo")}
              className="rounded-md bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-background hover:bg-emerald-400 cursor-pointer"
            >
              Deposit
            </button>
            <button
              type="button"
              onClick={() => openAction("wd", holdings[0])}
              className="rounded-md border border-border bg-muted/30 px-3 py-1.5 text-xs font-medium hover:bg-muted/50 cursor-pointer"
            >
              Withdraw
            </button>
            <button
              type="button"
              onClick={() => openAction("swap", holdings[0])}
              className="rounded-md border border-blue-500/30 bg-blue-500/10 px-3 py-1.5 text-xs font-medium text-blue-400 hover:bg-blue-500/20 cursor-pointer"
            >
              Swap
            </button>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-md border border-border bg-muted/20 px-3 py-3">
            <div className="text-[11px] text-muted-foreground">Total Value</div>
            <div className="mt-1 text-lg font-bold font-mono">{formatUsd(stats.totalValue)}</div>
          </div>
          <div className="rounded-md border border-border bg-muted/20 px-3 py-3">
            <div className="text-[11px] text-muted-foreground">Unrealized PnL</div>
            <div className={`mt-1 text-lg font-bold font-mono ${stats.totalPnl >= 0 ? "text-emerald-400" : "text-red-400"}`}>
              {formatUsd(stats.totalPnl)} ({formatPct(stats.totalPnlPct)})
            </div>
          </div>
          <div className="rounded-md border border-border bg-muted/20 px-3 py-3">
            <div className="text-[11px] text-muted-foreground">Best Performer</div>
            <div className="mt-1 text-sm font-semibold">
              {stats.best ? `${stats.best.symbol}` : "—"}
              {stats.best && (
                <span className="ml-2 font-mono text-emerald-400 text-xs">{formatPct(stats.best.pnlPct)}</span>
              )}
            </div>
          </div>
          <div className="rounded-md border border-border bg-muted/20 px-3 py-3">
            <div className="text-[11px] text-muted-foreground">Worst Performer</div>
            <div className="mt-1 text-sm font-semibold">
              {stats.worst ? `${stats.worst.symbol}` : "—"}
              {stats.worst && (
                <span className={`ml-2 font-mono text-xs ${stats.worst.pnlPct >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                  {formatPct(stats.worst.pnlPct)}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Sort:</span>
            {([
              ["value", "Value"],
              ["pnl", "PnL"],
              ["change", "24h"],
            ] as const).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setSortBy(key)}
                className={`rounded-md px-2.5 py-1 text-xs font-medium cursor-pointer ${
                  sortBy === key
                    ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                    : "bg-muted/30 text-muted-foreground border border-border hover:text-foreground"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
            <input
              type="checkbox"
              checked={hideDust}
              onChange={(e) => setHideDust(e.target.checked)}
              className="accent-emerald-500"
            />
            Sembunyikan dust (&lt; $1)
          </label>
        </div>

        {visible.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border p-12 text-center">
            <p className="text-sm text-muted-foreground">Belum ada holding</p>
            <button
              type="button"
              onClick={() => openAction("depo")}
              className="mt-3 inline-block text-sm text-emerald-400 hover:underline cursor-pointer"
            >
              + Deposit aset
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="px-3 py-2.5 text-left font-medium text-muted-foreground">Assets</th>
                  <th className="px-3 py-2.5 text-right font-medium text-muted-foreground">Amount</th>
                  <th className="px-3 py-2.5 text-right font-medium text-muted-foreground">Price</th>
                  <th className="px-3 py-2.5 text-right font-medium text-muted-foreground">Value</th>
                  <th className="px-3 py-2.5 text-right font-medium text-muted-foreground">Avg Buy</th>
                  <th className="px-3 py-2.5 text-right font-medium text-muted-foreground">PnL</th>
                  <th className="px-3 py-2.5 text-right font-medium text-muted-foreground">24h</th>
                  <th className="px-3 py-2.5 text-right font-medium text-muted-foreground">Action</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((h) => {
                  const isPos = h.pnlUsd >= 0;
                  const chPos = h.change24h >= 0;
                  return (
                    <tr key={h.id} className="border-b border-border/40 last:border-0 hover:bg-muted/20">
                      <td className="px-3 py-2.5">
                        <Link href={`/pair/${h.pairAddress}`} className="flex items-center gap-2">
                          <TokenLogo symbol={h.symbol} size={24} />
                          <div>
                            <div className="font-medium">{h.symbol}</div>
                            <div className="text-[10px] text-muted-foreground">{h.name}</div>
                          </div>
                        </Link>
                      </td>
                      <td className="px-3 py-2.5 text-right font-mono text-xs">{formatNumber(h.amount, 4)}</td>
                      <td className="px-3 py-2.5 text-right font-mono text-xs">{formatPrice(h.price)}</td>
                      <td className="px-3 py-2.5 text-right font-mono text-xs font-medium">{formatUsd(h.valueUsd)}</td>
                      <td className="px-3 py-2.5 text-right font-mono text-xs text-muted-foreground">{formatPrice(h.avgBuy)}</td>
                      <td className={`px-3 py-2.5 text-right font-mono text-xs ${isPos ? "text-emerald-400" : "text-red-400"}`}>
                        <div>{formatUsd(h.pnlUsd)}</div>
                        <div className="text-[10px]">{formatPct(h.pnlPct)}</div>
                      </td>
                      <td className={`px-3 py-2.5 text-right font-mono text-xs ${chPos ? "text-emerald-400" : "text-red-400"}`}>
                        {formatPct(h.change24h)}
                      </td>
                      <td className="px-3 py-2.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => openAction("depo", h)}
                            className="rounded border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-400 hover:bg-emerald-500/20 cursor-pointer"
                          >
                            Deposit
                          </button>
                          <button
                            type="button"
                            onClick={() => openAction("wd", h)}
                            className="rounded border border-border bg-muted/30 px-2 py-0.5 text-[11px] font-medium hover:bg-muted/50 cursor-pointer"
                          >
                            Withdraw
                          </button>
                          <button
                            type="button"
                            onClick={() => openAction("swap", h)}
                            className="rounded border border-blue-500/30 bg-blue-500/10 px-2 py-0.5 text-[11px] font-medium text-blue-400 hover:bg-blue-500/20 cursor-pointer"
                          >
                            Swap
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {actionMode && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <div className="w-full max-w-sm rounded-xl border border-border bg-background p-5 shadow-2xl">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold">{modalTitle}</h3>
                  <p className="text-xs text-muted-foreground">
                    {actionMode === "depo"
                      ? "Scan QR atau copy address EVM"
                      : actionMode === "wd"
                      ? selected
                        ? `Kirim ${selected.symbol} ke address EVM · balance ${formatNumber(selected.amount, 4)}`
                        : "Pilih aset & isi send address"
                      : selected
                      ? `${selected.symbol} · balance ${formatNumber(selected.amount, 4)}`
                      : "Pilih aset"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={closeAction}
                  className="text-muted-foreground hover:text-foreground cursor-pointer text-lg leading-none"
                >
                  ×
                </button>
              </div>

              {actionMode === "depo" ? (
                <div className="space-y-4">
                  <div className="flex flex-col items-center gap-3 rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-4">
                    <div className="flex w-full items-center justify-between gap-2">
                      <span className="text-[11px] font-medium text-emerald-400">Deposit Address (EVM)</span>
                      <span className="rounded border border-border bg-muted/40 px-1.5 py-0.5 text-[10px] text-muted-foreground">
                        Arc Testnet - 5042002
                      </span>
                    </div>
                    <div className="rounded-xl border border-border bg-white p-2 shadow-sm">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={qrUrl}
                        alt="Deposit QR"
                        width={180}
                        height={180}
                        className="h-[180px] w-[180px]"
                      />
                    </div>
                    <code className="w-full break-all rounded-md border border-border bg-muted/30 px-2.5 py-2 text-center font-mono text-[11px] text-foreground">
                      {depositAddress}
                    </code>
                    <button
                      type="button"
                      onClick={copyDepositAddress}
                      className="w-full rounded-md border border-emerald-500/30 bg-emerald-500/15 px-3 py-2 text-xs font-semibold text-emerald-400 hover:bg-emerald-500/25 cursor-pointer"
                    >
                      {copied ? "Address Copied" : "Copy Address"}
                    </button>
                    <p className="text-center text-[10px] leading-relaxed text-muted-foreground">
                      Scan QR or copy address, then send tokens on Arc Testnet (Chain ID 5042002).
                      {mounted && isConnected && address
                        ? " Address ini adalah wallet yang terhubung."
                        : " Connect wallet agar address deposit mengikuti wallet kamu."}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={closeAction}
                    className="w-full rounded-lg bg-emerald-500 py-2.5 text-sm font-semibold text-background hover:bg-emerald-400 cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <>
                  <div className="mb-3">
                    <label className="mb-1 block text-xs text-muted-foreground">
                      {actionMode === "swap" ? "From" : "Assets"}
                    </label>
                    <select
                      value={selected?.id ?? ""}
                      onChange={(e) => {
                        const h = holdings.find((x) => x.id === e.target.value) ?? null;
                        setSelected(h);
                      }}
                      className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm outline-none focus:border-emerald-500/50"
                    >
                      {holdings.length === 0 && <option value="">— empty —</option>}
                      {holdings.map((h) => (
                        <option key={h.id} value={h.id}>
                          {h.symbol} ({formatNumber(h.amount, 4)})
                        </option>
                      ))}
                    </select>
                  </div>

                  {actionMode === "swap" && (
                    <div className="mb-3">
                      <label className="mb-1 block text-xs text-muted-foreground">To</label>
                      <select
                        value={swapTo}
                        onChange={(e) => setSwapTo(e.target.value)}
                        className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm outline-none focus:border-emerald-500/50"
                      >
                        <option value="">Select token</option>
                        {tokenOptions
                          .filter((s) => s !== selected?.symbol)
                          .map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                      </select>
                    </div>
                  )}

                  {actionMode === "wd" && (
                    <div className="mb-3">
                      <label className="mb-1 block text-xs text-muted-foreground">
                        Send Address (EVM)
                      </label>
                      <input
                        type="text"
                        value={sendAddress}
                        onChange={(e) => setSendAddress(e.target.value)}
                        placeholder="0x..."
                        spellCheck={false}
                        autoComplete="off"
                        className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 font-mono text-xs outline-none focus:border-amber-500/50"
                      />
                      <div className="mt-1.5 flex flex-wrap items-center gap-2">
                        <span className="rounded border border-border bg-muted/40 px-1.5 py-0.5 text-[10px] text-muted-foreground">
                          Arc Testnet · 5042002
                        </span>
                        {mounted && isConnected && address && (
                          <button
                            type="button"
                            onClick={() => setSendAddress(address)}
                            className="rounded border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium text-amber-400 hover:bg-amber-500/20 cursor-pointer"
                          >
                            Use my wallet
                          </button>
                        )}
                        {sendAddress.trim() && (
                          <span className={`text-[10px] ${isValidEvmAddress(sendAddress) ? "text-emerald-400" : "text-red-400"}`}>
                            {isValidEvmAddress(sendAddress) ? "Address valid" : "Format address salah"}
                          </span>
                        )}
                      </div>
                      <p className="mt-1.5 text-[10px] leading-relaxed text-muted-foreground">
                        Double-check address. Withdraw ke network Arc Testnet (Chain ID 5042002). Salah address = aset hilang.
                      </p>
                    </div>
                  )}

                  <div className="mb-3">
                    <label className="mb-1 block text-xs text-muted-foreground">
                      Amount {selected ? `(${selected.symbol})` : ""}
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        min="0"
                        step="any"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        className="flex-1 rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm font-mono outline-none focus:border-emerald-500/50"
                      />
                      {(actionMode === "wd" || actionMode === "swap") && selected && (
                        <button
                          type="button"
                          onClick={() => setAmount(String(selected.amount))}
                          className="rounded-lg border border-border bg-muted/30 px-3 py-2 text-xs font-medium hover:bg-muted/50 cursor-pointer"
                        >
                          MAX
                        </button>
                      )}
                    </div>
                  </div>

                  {selected && amount && parseFloat(amount) > 0 && (
                    <div className="mb-3 rounded-md border border-border bg-muted/20 px-3 py-2 text-xs text-muted-foreground space-y-1">
                      {actionMode === "wd" && (
                        <>
                          <div>
                            Withdraw value:{" "}
                            <span className="font-mono text-amber-400">
                              {formatUsd(parseFloat(amount) * selected.price)}
                            </span>
                          </div>
                          {sendAddress.trim() && (
                            <div className="break-all">
                              To:{" "}
                              <span className={`font-mono ${isValidEvmAddress(sendAddress) ? "text-foreground" : "text-red-400"}`}>
                                {sendAddress.trim()}
                              </span>
                            </div>
                          )}
                          <div>
                            Network:{" "}
                            <span className="text-foreground">Arc Testnet (5042002)</span>
                          </div>
                        </>
                      )}
                      {actionMode === "swap" && swapTo && (() => {
                        const tp = mockPairs.find((p) => p.token0.symbol === swapTo)?.priceToken0PerToken1 ?? selected.price;
                        const out = tp > 0 ? (parseFloat(amount) * selected.price) / tp : 0;
                        return (
                          <div>
                            Receive ≈{" "}
                            <span className="font-mono text-blue-400">
                              {formatNumber(out, 4)} {swapTo}
                            </span>
                            {" "}({formatUsd(parseFloat(amount) * selected.price)})
                          </div>
                        );
                      })()}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={confirmAction}
                    className={`w-full rounded-lg py-2.5 text-sm font-semibold cursor-pointer ${
                      actionMode === "wd"
                        ? "bg-amber-500 text-background hover:bg-amber-400"
                        : "bg-blue-500 text-white hover:bg-blue-400"
                    }`}
                  >
                    {actionMode === "wd" ? "Confirm Withdraw" : `Confirm ${modalTitle}`}
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {toast && (
          <div className="fixed bottom-6 right-6 z-50 rounded-lg border border-emerald-500/30 bg-background/95 px-4 py-2 text-xs font-medium text-emerald-400 shadow-xl backdrop-blur">
            {toast}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
