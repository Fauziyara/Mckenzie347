"use client";

import { useState } from "react";
import { formatPrice, formatUsd } from "@/lib/format";

export function QuickBuyModal({ pair, onClose }: { pair: any; onClose: () => void }) {
  const [amount, setAmount] = useState("");
  const [slippage, setSlippage] = useState("1");
  const [status, setStatus] = useState<"idle" | "pending" | "success">("idle");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!amount) return;
    setStatus("pending");
    setTimeout(() => setStatus("success"), 1500);
  }

  const expectedOut = amount ? (parseFloat(amount) / pair.priceToken0PerToken1).toFixed(4) : "0";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full max-w-md rounded-xl border border-border bg-card p-5 shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {status === "success" ? (
          <div className="py-8 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald-400">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <h3 className="text-base font-semibold">Swap Berhasil (Mock)</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {amount} {pair.token1.symbol} → {expectedOut} {pair.token0.symbol}
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-4 w-full rounded-lg bg-emerald-500 py-2 text-sm font-medium text-background hover:bg-emerald-600 cursor-pointer"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold">Quick Swap</h3>
                <p className="text-xs text-muted-foreground">{pair.token0.symbol} / {pair.token1.symbol}</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="text-muted-foreground hover:text-foreground cursor-pointer text-xl leading-none"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="mb-1 block text-xs text-muted-foreground">Pay with {pair.token1.symbol}</label>
                <input
                  type="number"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  placeholder="0.0"
                  className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm outline-none focus:border-emerald-500/50"
                  autoFocus
                />
              </div>

              <div className="flex items-center justify-center py-1">
                <div className="flex h-7 w-7 items-center justify-center rounded-full border border-border text-muted-foreground">↓</div>
              </div>

              <div>
                <label className="mb-1 block text-xs text-muted-foreground">Terima {pair.token0.symbol}</label>
                <div className="w-full rounded-lg border border-border bg-muted/20 px-3 py-2 text-sm font-mono">
                  {expectedOut}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Slippage:</span>
                {["0.5", "1", "3"].map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSlippage(s)}
                    className={`rounded px-2 py-0.5 text-xs cursor-pointer ${
                      slippage === s ? "bg-foreground text-background" : "bg-muted/50 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {s}%
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Price</span>
                <span className="font-mono">1 {pair.token0.symbol} = {formatPrice(pair.priceToken0PerToken1)} {pair.token1.symbol}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Liquidity</span>
                <span className="font-mono">{formatUsd(pair.liquidityUsd)}</span>
              </div>

              <button
                type="submit"
                disabled={!amount || status === "pending"}
                className="w-full rounded-lg bg-emerald-500 py-2.5 text-sm font-semibold text-background hover:bg-emerald-600 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
              >
                {status === "pending" ? "Processing..." : `Swap ${pair.token1.symbol} → ${pair.token0.symbol}`}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
