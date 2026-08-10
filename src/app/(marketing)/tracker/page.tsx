"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { formatUsd, formatPrice, shortAddr } from "@/lib/format";
import Link from "next/link";

export default function TrackerPage() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<"searching" | "notfound" | "found" | null>(null);
  const [pair, setPair] = useState<any | null>(null);

  async function search(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    setResult("searching");
    try {
      const res = await fetch(`/api/indexer/pairs?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (data.success && data.pairs && data.pairs.length > 0) {
        setPair(data.pairs[0]);
        setResult("found");
      } else {
        // Try direct address lookup
        const res2 = await fetch(`/api/indexer/pairs/${encodeURIComponent(query)}`);
        const data2 = await res2.json();
        if (data2.success && data2.pair) {
          setPair(data2.pair);
          setResult("found");
        } else {
          setResult("notfound");
        }
      }
    } catch {
      setResult("notfound");
    }
  }

  return (
    <>
      <Header logoColor="green" active="Tracker" />
      <main className="w-full flex-1 px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight">Tracker</h1>
          <p className="text-sm text-muted-foreground">Search token & pair by address or symbol</p>
        </div>

        <form onSubmit={search} className="mb-6 flex gap-2">
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="0x... or symbol (e.g. USDC, WETH)"
            className="flex-1 rounded-lg border border-border bg-muted/30 px-4 py-2 text-sm outline-none focus:border-emerald-500/50"
          />
          <button
            type="submit"
            className="rounded-lg bg-emerald-500 px-6 py-2 text-sm font-medium text-background hover:bg-emerald-600 cursor-pointer"
          >
            Search
          </button>
        </form>

        {result === "searching" && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-muted border-t-emerald-500" />
            Searching Arc testnet...
          </div>
        )}

        {result === "notfound" && (
          <div className="rounded-lg border border-border p-6 text-center">
            <p className="text-sm text-muted-foreground">No pairs found for "{query}"</p>
          </div>
        )}

        {result === "found" && pair && (
          <div className="rounded-lg border border-border p-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold">{pair.token0_symbol || pair.token0?.symbol} / {pair.token1_symbol || pair.token1?.symbol}</h2>
                <p className="font-mono text-xs text-muted-foreground">{pair.address}</p>
              </div>
              <Link
                href={`/pair/${pair.address}`}
                className="rounded-md bg-emerald-500 px-4 py-1.5 text-xs font-medium text-background hover:bg-emerald-600"
              >
                View Detail →
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded border border-border p-3">
                <div className="text-xs text-muted-foreground">Price</div>
                <div className="mt-1 font-mono text-sm">{formatPrice(Number(pair.priceToken0PerToken1) || 0)}</div>
              </div>
              <div className="rounded border border-border p-3">
                <div className="text-xs text-muted-foreground">Reserve 0</div>
                <div className="mt-1 font-mono text-sm">{pair.reserve0Formatted || "—"}</div>
              </div>
              <div className="rounded border border-border p-3">
                <div className="text-xs text-muted-foreground">Reserve 1</div>
                <div className="mt-1 font-mono text-sm">{pair.reserve1Formatted || "—"}</div>
              </div>
              <div className="rounded border border-border p-3">
                <div className="text-xs text-muted-foreground">Swaps</div>
                <div className="mt-1 font-mono text-sm">{pair.total_swaps || 0}</div>
              </div>
            </div>
            <div className="mt-3 space-y-1 text-xs text-muted-foreground">
              <div>Token 0: {pair.token0_symbol} — {shortAddr(pair.token0)}</div>
              <div>Token 1: {pair.token1_symbol} — {shortAddr(pair.token1)}</div>
              <div>Factory: {shortAddr(pair.factory)}</div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
