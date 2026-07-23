"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { mockPairs, type Pair } from "@/lib/mock-data";
import { formatUsd, formatPrice, shortAddr } from "@/lib/format";
import Link from "next/link";

export default function PelacakPage() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<"searching" | "notfound" | "found" | null>(null);
  const [pair, setPair] = useState<Pair | null>(null);

  function search(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    setResult("searching");
    setTimeout(() => {
      const q = query.toLowerCase();
      const found = mockPairs.find(p =>
        p.address.toLowerCase() === q ||
        p.token0.address.toLowerCase() === q ||
        p.token0.symbol.toLowerCase() === q ||
        p.address.toLowerCase().includes(q) ||
        p.token0.address.toLowerCase().includes(q)
      );
      if (found) {
        setPair(found);
        setResult("found");
      } else {
        setResult("notfound");
      }
    }, 300);
  }

  return (
    <>
      <Header active="Tracker" />
      <main className="w-full flex-1 px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight">Tracker</h1>
          <p className="text-sm text-muted-foreground">Cek token & pair by address atau symbol</p>
        </div>

        <form onSubmit={search} className="mb-6 flex gap-2">
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="0x... atau symbol (ARC, DEFI, dll)"
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
            Mencari...
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
                <h2 className="text-lg font-bold">{pair.token0.symbol} / {pair.token1.symbol}</h2>
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
                <div className="mt-1 font-mono text-sm">{formatPrice(pair.priceToken0PerToken1)}</div>
              </div>
              <div className="rounded border border-border p-3">
                <div className="text-xs text-muted-foreground">Liquidity</div>
                <div className="mt-1 font-mono text-sm">{formatUsd(pair.liquidityUsd)}</div>
              </div>
              <div className="rounded border border-border p-3">
                <div className="text-xs text-muted-foreground">Volume 24h</div>
                <div className="mt-1 font-mono text-sm">{formatUsd(pair.volume24h)}</div>
              </div>
              <div className="rounded border border-border p-3">
                <div className="text-xs text-muted-foreground">Mkt Cap</div>
                <div className="mt-1 font-mono text-sm">{formatUsd(pair.marketCapUsd)}</div>
              </div>
            </div>
            <div className="mt-3 space-y-1 text-xs text-muted-foreground">
              <div>Token 0: {pair.token0.symbol} — {shortAddr(pair.token0.address)}</div>
              <div>Token 1: {pair.token1.symbol} — {shortAddr(pair.token1.address)}</div>
              <div>Factory: {shortAddr(pair.factory)}</div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}