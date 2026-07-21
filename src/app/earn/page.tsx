"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { TokenLogo } from "@/components/token-logo";
import { mockPairs } from "@/lib/mock-data";
import { formatUsd, formatNumber, formatPct } from "@/lib/format";

interface Pool {
  id: string;
  pairLabel: string;
  token0: string;
  token1: string;
  pairAddress: string;
  tvl: number;
  apy: number;
  reward: string;
  risk: "Low" | "Med" | "High";
  myStake: number;
  earned: number;
}

const STORAGE_KEY = "aperture-earn";

function buildPools(): Pool[] {
  return mockPairs.slice(0, 8).map((p, i) => ({
    id: `pool-${i + 1}`,
    pairLabel: `${p.token0.symbol}/${p.token1.symbol}`,
    token0: p.token0.symbol,
    token1: p.token1.symbol,
    pairAddress: p.address,
    tvl: p.liquidityUsd * (0.35 + (i % 5) * 0.12),
    apy: [48.2, 22.5, 91.0, 15.8, 63.4, 37.1, 112.6, 8.9][i] ?? 20,
    reward: ["ARC", "USDC", "ARC", "USDC", "ARC", "WETH", "ARC", "USDC"][i] ?? "ARC",
    risk: (["Low", "Med", "High", "Low", "Med", "Med", "High", "Low"] as const)[i] ?? "Med",
    myStake: 0,
    earned: 0,
  }));
}

export default function EarnPage() {
  const [pools, setPools] = useState<Pool[]>([]);
  const [tab, setTab] = useState<"all" | "my">("all");
  const [selected, setSelected] = useState<Pool | null>(null);
  const [amount, setAmount] = useState("");
  const [mode, setMode] = useState<"stake" | "unstake">("stake");
  const [toast, setToast] = useState<string | null>(null);
  const [filterRisk, setFilterRisk] = useState<"All" | "Low" | "Med" | "High">("All");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setPools(JSON.parse(saved));
        return;
      } catch {
        // fall through
      }
    }
    const defaults = buildPools();
    setPools(defaults);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaults));
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2200);
    return () => clearTimeout(t);
  }, [toast]);

  // Simulate reward accrual every 8s for staked pools
  useEffect(() => {
    const iv = setInterval(() => {
      setPools((prev) => {
        if (!prev.some((p) => p.myStake > 0)) return prev;
        const next = prev.map((p) => {
          if (p.myStake <= 0) return p;
          const hourly = (p.myStake * (p.apy / 100)) / (365 * 24);
          const tick = hourly * (8 / 3600);
          return { ...p, earned: p.earned + tick };
        });
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        return next;
      });
    }, 8000);
    return () => clearInterval(iv);
  }, []);

  function persist(next: Pool[]) {
    setPools(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  const stats = useMemo(() => {
    const totalStaked = pools.reduce((s, p) => s + p.myStake, 0);
    const totalEarned = pools.reduce((s, p) => s + p.earned, 0);
    const active = pools.filter((p) => p.myStake > 0).length;
    const avgApy =
      active > 0
        ? pools.filter((p) => p.myStake > 0).reduce((s, p) => s + p.apy, 0) / active
        : pools.reduce((s, p) => s + p.apy, 0) / Math.max(pools.length, 1);
    return { totalStaked, totalEarned, active, avgApy };
  }, [pools]);

  const visible = useMemo(() => {
    let rows = [...pools];
    if (tab === "my") rows = rows.filter((p) => p.myStake > 0);
    if (filterRisk !== "All") rows = rows.filter((p) => p.risk === filterRisk);
    return rows.sort((a, b) => b.apy - a.apy);
  }, [pools, tab, filterRisk]);

  function openModal(pool: Pool, m: "stake" | "unstake") {
    setSelected(pool);
    setMode(m);
    setAmount("");
  }

  function confirmAction() {
    if (!selected) return;
    const val = parseFloat(amount);
    if (!val || val <= 0) {
      setToast("Masukkan amount valid");
      return;
    }
    const next = pools.map((p) => {
      if (p.id !== selected.id) return p;
      if (mode === "stake") {
        return { ...p, myStake: p.myStake + val };
      }
      const unstake = Math.min(val, p.myStake);
      return { ...p, myStake: Math.max(0, p.myStake - unstake) };
    });
    persist(next);
    setToast(mode === "stake" ? `Staked ${val} on ${selected.pairLabel}` : `Unstaked ${val} from ${selected.pairLabel}`);
    setSelected(null);
    setAmount("");
  }

  function claim(poolId: string) {
    const next = pools.map((p) => (p.id === poolId ? { ...p, earned: 0 } : p));
    persist(next);
    setToast("Reward di-claim");
  }

  function claimAll() {
    const next = pools.map((p) => ({ ...p, earned: 0 }));
    persist(next);
    setToast("All reward di-claim");
  }

  function riskColor(risk: Pool["risk"]) {
    if (risk === "Low") return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
    if (risk === "High") return "text-red-400 bg-red-500/10 border-red-500/20";
    return "text-amber-400 bg-amber-500/10 border-amber-500/20";
  }

  return (
    <>
      <Header active="Earn" />
      <main className="w-full flex-1 px-4 py-6">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Earn</h1>
            <p className="text-sm text-muted-foreground">
              Stake LP & farm rewards on Arc testnet · {pools.length} pools
            </p>
          </div>
          <button
            type="button"
            onClick={claimAll}
            disabled={stats.totalEarned <= 0}
            className="rounded-md bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-background hover:bg-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            Claim All ({formatUsd(stats.totalEarned)})
          </button>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-md border border-border bg-muted/20 px-3 py-3">
            <div className="text-[11px] text-muted-foreground">My Staked</div>
            <div className="mt-1 text-lg font-bold font-mono">{formatUsd(stats.totalStaked)}</div>
          </div>
          <div className="rounded-md border border-border bg-muted/20 px-3 py-3">
            <div className="text-[11px] text-muted-foreground">Pending Rewards</div>
            <div className="mt-1 text-lg font-bold font-mono text-emerald-400">{formatUsd(stats.totalEarned)}</div>
          </div>
          <div className="rounded-md border border-border bg-muted/20 px-3 py-3">
            <div className="text-[11px] text-muted-foreground">Active Positions</div>
            <div className="mt-1 text-lg font-bold font-mono">{stats.active}</div>
          </div>
          <div className="rounded-md border border-border bg-muted/20 px-3 py-3">
            <div className="text-[11px] text-muted-foreground">Avg APY</div>
            <div className="mt-1 text-lg font-bold font-mono text-emerald-400">{stats.avgApy.toFixed(1)}%</div>
          </div>
        </div>

        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1 rounded-md border border-border bg-muted/20 p-0.5">
            {([
              ["all", "All Pools"],
              ["my", "My Positions"],
            ] as const).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setTab(key)}
                className={`rounded px-3 py-1 text-xs font-medium cursor-pointer ${
                  tab === key ? "bg-muted/60 text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1">
            {(["All", "Low", "Med", "High"] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setFilterRisk(r)}
                className={`rounded-md px-2.5 py-1 text-xs font-medium cursor-pointer border ${
                  filterRisk === r
                    ? "border-emerald-500/30 bg-emerald-500/15 text-emerald-400"
                    : "border-border bg-muted/30 text-muted-foreground hover:text-foreground"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {visible.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border p-12 text-center">
            <p className="text-sm text-muted-foreground">
              {tab === "my" ? "Belum ada posisi stake" : "Tidak ada pool"}
            </p>
            {tab === "my" && (
              <button
                type="button"
                onClick={() => setTab("all")}
                className="mt-3 text-sm text-emerald-400 hover:underline cursor-pointer"
              >
                View all pools →
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="px-3 py-2.5 text-left font-medium text-muted-foreground">Pool</th>
                  <th className="px-3 py-2.5 text-right font-medium text-muted-foreground">TVL</th>
                  <th className="px-3 py-2.5 text-right font-medium text-muted-foreground">APY</th>
                  <th className="px-3 py-2.5 text-center font-medium text-muted-foreground">Reward</th>
                  <th className="px-3 py-2.5 text-center font-medium text-muted-foreground">Risk</th>
                  <th className="px-3 py-2.5 text-right font-medium text-muted-foreground">My Stake</th>
                  <th className="px-3 py-2.5 text-right font-medium text-muted-foreground">Earned</th>
                  <th className="px-3 py-2.5 text-right font-medium text-muted-foreground">Action</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((pool) => (
                  <tr key={pool.id} className="border-b border-border/40 last:border-0 hover:bg-muted/20">
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-2">
                        <div className="flex -space-x-1.5">
                          <TokenLogo symbol={pool.token0} size={22} />
                          <TokenLogo symbol={pool.token1} size={22} />
                        </div>
                        <div>
                          <Link href={`/pair/${pool.pairAddress}`} className="font-medium hover:underline">
                            {pool.pairLabel}
                          </Link>
                          <div className="text-[10px] text-muted-foreground">LP Farm</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-2.5 text-right font-mono text-xs">{formatUsd(pool.tvl)}</td>
                    <td className="px-3 py-2.5 text-right font-mono text-xs text-emerald-400 font-semibold">
                      {pool.apy.toFixed(1)}%
                    </td>
                    <td className="px-3 py-2.5 text-center">
                      <span className="inline-flex items-center gap-1 rounded border border-border bg-muted/30 px-1.5 py-0.5 text-[10px] font-medium">
                        <TokenLogo symbol={pool.reward} size={12} />
                        {pool.reward}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-center">
                      <span className={`inline-block rounded border px-1.5 py-0.5 text-[10px] font-medium ${riskColor(pool.risk)}`}>
                        {pool.risk}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-right font-mono text-xs">
                      {pool.myStake > 0 ? formatUsd(pool.myStake) : "—"}
                    </td>
                    <td className="px-3 py-2.5 text-right font-mono text-xs text-emerald-400">
                      {pool.earned > 0 ? formatUsd(pool.earned) : "—"}
                    </td>
                    <td className="px-3 py-2.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => openModal(pool, "stake")}
                          className="rounded-md bg-emerald-500 px-2.5 py-1 text-[11px] font-semibold text-background hover:bg-emerald-400 cursor-pointer"
                        >
                          Stake
                        </button>
                        {pool.myStake > 0 && (
                          <button
                            type="button"
                            onClick={() => openModal(pool, "unstake")}
                            className="rounded-md border border-border bg-muted/30 px-2.5 py-1 text-[11px] font-medium hover:bg-muted/50 cursor-pointer"
                          >
                            Unstake
                          </button>
                        )}
                        {pool.earned > 0 && (
                          <button
                            type="button"
                            onClick={() => claim(pool.id)}
                            className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-400 hover:bg-emerald-500/20 cursor-pointer"
                          >
                            Claim
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {selected && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <div className="w-full max-w-sm rounded-xl border border-border bg-background p-5 shadow-2xl">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold capitalize">{mode} · {selected.pairLabel}</h3>
                  <p className="text-xs text-muted-foreground">
                    APY {selected.apy.toFixed(1)}% · My stake {formatUsd(selected.myStake)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  className="text-muted-foreground hover:text-foreground cursor-pointer text-lg leading-none"
                >
                  ×
                </button>
              </div>
              <div className="mb-3">
                <label className="mb-1 block text-xs text-muted-foreground">Amount (USD)</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="flex-1 rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm font-mono outline-none focus:border-emerald-500/50"
                  />
                  {mode === "unstake" && (
                    <button
                      type="button"
                      onClick={() => setAmount(String(selected.myStake))}
                      className="rounded-lg border border-border bg-muted/30 px-3 py-2 text-xs font-medium hover:bg-muted/50 cursor-pointer"
                    >
                      MAX
                    </button>
                  )}
                  {mode === "stake" && (
                    <button
                      type="button"
                      onClick={() => setAmount("100")}
                      className="rounded-lg border border-border bg-muted/30 px-3 py-2 text-xs font-medium hover:bg-muted/50 cursor-pointer"
                    >
                      $100
                    </button>
                  )}
                </div>
              </div>
              {mode === "stake" && amount && parseFloat(amount) > 0 && (
                <div className="mb-3 rounded-md border border-border bg-muted/20 px-3 py-2 text-xs text-muted-foreground">
                  Est. yearly reward:{" "}
                  <span className="font-mono text-emerald-400">
                    {formatUsd(parseFloat(amount) * (selected.apy / 100))}
                  </span>
                </div>
              )}
              <button
                type="button"
                onClick={confirmAction}
                className="w-full rounded-lg bg-emerald-500 py-2.5 text-sm font-semibold text-background hover:bg-emerald-400 cursor-pointer"
              >
                Confirm {mode === "stake" ? "Stake" : "Unstake"}
              </button>
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
