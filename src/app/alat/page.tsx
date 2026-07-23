"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { mockPairs } from "@/lib/mock-data";
import { formatUsd, formatPrice, formatPct, timeAgo, shortAddr } from "@/lib/format";
import { Sparkline } from "@/components/sparkline";
import Link from "next/link";

export default function AlatPage() {
  const [watchlist, setWatchlist] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("aperture-watchlist");
    if (saved) setWatchlist(JSON.parse(saved));
  }, []);

  const watchedPairs = mockPairs.filter(p => watchlist.includes(p.address));

  function removeWatch(addr: string) {
    const updated = watchlist.filter(a => a !== addr);
    setWatchlist(updated);
    localStorage.setItem("aperture-watchlist", JSON.stringify(updated));
  }

  return (
    <>
      <Header active="Tools" />
      <main className="w-full flex-1 px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight">Tools</h1>
          <p className="text-sm text-muted-foreground">{watchedPairs.length} pair dalam daftar pantauan</p>
        </div>

        {watchedPairs.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border p-12 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted/30">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted-foreground">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </div>
            <p className="text-sm text-muted-foreground">Belum ada pair dipantau</p>
            <Link href="/" className="mt-3 inline-block text-sm text-emerald-400 hover:underline">← Explore pairs</Link>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="px-3 py-2.5 text-left font-medium text-muted-foreground">Pair</th>
                  <th className="px-3 py-2.5 text-center font-medium text-muted-foreground">Chart</th>
                  <th className="px-3 py-2.5 text-right font-medium text-muted-foreground">Price</th>
                  <th className="px-3 py-2.5 text-right font-medium text-muted-foreground">24h</th>
                  <th className="px-3 py-2.5 text-right font-medium text-muted-foreground">Liquidity</th>
                  <th className="px-3 py-2.5 text-right font-medium text-muted-foreground">Volume</th>
                  <th className="px-3 py-2.5 text-right font-medium text-muted-foreground">Action</th>
                </tr>
              </thead>
              <tbody>
                {watchedPairs.map(pair => {
                  const isPositive = pair.priceChange24h >= 0;
                  return (
                    <tr key={pair.address} className="border-b border-border/40 last:border-0 hover:bg-muted/20">
                      <td className="px-3 py-2.5">
                        <Link href={`/pair/${pair.address}`}>
                          <div className="font-medium">{pair.token0.symbol}/{pair.token1.symbol}</div>
                          <div className="font-mono text-[10px] text-muted-foreground">{shortAddr(pair.address)}</div>
                        </Link>
                      </td>
                      <td className="px-3 py-2.5">
                        <Link href={`/pair/${pair.address}`}>
                          <Sparkline data={pair.sparkline} positive={isPositive} width={72} height={24} />
                        </Link>
                      </td>
                      <td className="px-3 py-2.5 text-right font-mono text-xs">{formatPrice(pair.priceToken0PerToken1)}</td>
                      <td className={`px-3 py-2.5 text-right font-mono text-xs ${isPositive ? "text-emerald-400" : "text-red-400"}`}>{formatPct(pair.priceChange24h)}</td>
                      <td className="px-3 py-2.5 text-right font-mono text-xs">{formatUsd(pair.liquidityUsd)}</td>
                      <td className="px-3 py-2.5 text-right font-mono text-xs">{formatUsd(pair.volume24h)}</td>
                      <td className="px-3 py-2.5 text-right">
                        <button
                          type="button"
                          onClick={() => removeWatch(pair.address)}
                          className="text-xs text-red-400 hover:text-red-300 cursor-pointer"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}