"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { formatNumber } from "@/lib/format";
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
  useChainId,
} from "wagmi";
import { parseUnits, formatUnits, parseGwei, erc20Abi } from "viem";

// ============================================================
// Presto DEX — Arc Testnet on-chain swap
// ============================================================

const PRESTO_ROUTER = "0x5794a8284a29493871fbfa3c4f343d42001424d6" as const;

const TOKENS = [
  {
    symbol: "USDC",
    name: "USD Coin",
    address: "0x3600000000000000000000000000000000000000" as const,
    decimals: 6,
    logo: "usdc",
  },
  {
    symbol: "EURC",
    name: "Euro Coin",
    address: "0x89B50855Aa3bE2F677cD6303Cec089B5F319D72a" as const,
    decimals: 6,
    logo: "eurc",
  },
  {
    symbol: "USDT",
    name: "Tether USD",
    address: "0x59125072f5692DdF22c99514805D1232C3999646" as const,
    decimals: 6,
    logo: "usdt",
  },
] as const;

// Token icons (real SVG logos)
function TokenIcon({ symbol, size = 20 }: { symbol: string; size?: number }) {
  const s = size;
  if (symbol === "usdc") {
    return (
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none" style={{display:"inline-block",verticalAlign:"middle"}}>
        <circle cx="12" cy="12" r="12" fill="#2775CA" />
        <path d="M14.5 12.8c0-.2-.2-.4-.4-.4h-.5v-1.2h.5c.2 0 .4-.2.4-.4s-.2-.4-.4-.4h-.5v-.2c0-1.6-1.2-3-2.8-3-1.5 0-2.7 1.2-2.8 2.7-.4.1-.7.3-.7.7v2.8c0 .4.3.6.7.7.1 1.5 1.3 2.7 2.8 2.7 1.6 0 2.8-1.4 2.8-3v-.2h.5c.2 0 .4-.2.4-.4z" fill="#fff"/>
      </svg>
    );
  }
  // EURC logo removed
  if (symbol === "usdt") {
    return (
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none" style={{display:"inline-block",verticalAlign:"middle"}}>
        <circle cx="12" cy="12" r="12" fill="#26A17B" />
        <path d="M7 8.5h10v2.2h-3.6v7.3H10.6v-7.3H7z" fill="#fff"/>
      </svg>
    );
  }
  return null;
}

// Presto Router ABI (only what we need)
const PRESTO_ABI = [
  {
    type: "function",
    name: "getQuote",
    inputs: [
      { name: "tokenIn", type: "address" },
      { name: "tokenOut", type: "address" },
      { name: "amountIn", type: "uint256" },
    ],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "swap",
    inputs: [
      { name: "tokenIn", type: "address" },
      { name: "tokenOut", type: "address" },
      { name: "amountIn", type: "uint256" },
      { name: "minAmountOut", type: "uint256" },
      { name: "deadline", type: "uint256" },
    ],
    outputs: [{ name: "amountOut", type: "uint256" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "paused",
    inputs: [],
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "view",
  },
] as const;

type TxStep = "idle" | "approving" | "swapping" | "done" | "error";

export default function SwapPage() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { writeContractAsync } = useWriteContract();

  const [fromIdx, setFromIdx] = useState(0);
  const [toIdx, setToIdx] = useState(1);
  const [amount, setAmount] = useState("");
  const [slippage, setSlippage] = useState("1");
  const [toast, setToast] = useState<string | null>(null);
  const [txStep, setTxStep] = useState<TxStep>("idle");
  const [txHash, setTxHash] = useState<string | null>(null);
  const [pendingApproveHash, setPendingApproveHash] = useState<string | null>(null);
  const [pendingSwapHash, setPendingSwapHash] = useState<string | null>(null);

  const fromToken = TOKENS[fromIdx];
  const toToken = TOKENS[toIdx];

  const isWrongChain = isConnected && chainId !== 5042002;

  // ===== Toast auto-dismiss =====
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(t);
  }, [toast]);

  // ===== Prevent same token =====
  useEffect(() => {
    if (fromIdx === toIdx) {
      setToIdx((toIdx + 1) % TOKENS.length);
    }
  }, [fromIdx, toIdx]);

  // ===== Read: paused status =====
  const { data: isPaused } = useReadContract({
    address: PRESTO_ROUTER,
    abi: PRESTO_ABI,
    functionName: "paused",
  });

  // ===== Read: fromToken balance =====
  const { data: fromBalance, refetch: refetchFromBalance } = useReadContract({
    address: fromToken.address,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: [address ?? "0x0"],
    query: { enabled: !!address },
  });

  // ===== Read: toToken balance =====
  const { data: toBalance, refetch: refetchToBalance } = useReadContract({
    address: toToken.address,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: [address ?? "0x0"],
    query: { enabled: !!address },
  });

  // ===== Read: allowance (fromToken → router) =====
  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: fromToken.address,
    abi: erc20Abi,
    functionName: "allowance",
    args: [address ?? "0x0", PRESTO_ROUTER],
    query: { enabled: !!address },
  });

  // ===== Compute amount in raw units =====
  const amountNum = Number(amount) || 0;
  const amountRaw = amountNum > 0 ? parseUnits(amount.toString(), fromToken.decimals) : 0n;

  // ===== Read: getQuote from Presto router =====
  const { data: quoteRaw, refetch: refetchQuote } = useReadContract({
    address: PRESTO_ROUTER,
    abi: PRESTO_ABI,
    functionName: "getQuote",
    args: [fromToken.address, toToken.address, amountRaw],
    query: { enabled: !!address && amountRaw > 0n },
  });

  // ===== Compute display values =====
  const quoteDisplay = quoteRaw ? formatUnits(quoteRaw, toToken.decimals) : "0";
  const quoteNum = quoteRaw ? Number(formatUnits(quoteRaw, toToken.decimals)) : 0;
  const slip = Number(slippage) || 0;
  const minOutRaw = quoteRaw
    ? (quoteRaw * BigInt(Math.floor((100 - slip) * 100))) / 10000n
    : 0n;
  const minOutDisplay = minOutRaw > 0n ? formatUnits(minOutRaw, toToken.decimals) : "0";
  const rate =
    quoteNum > 0 && amountNum > 0 ? quoteNum / amountNum : 0;
  // Mock price impact — stablecoin pairs have low impact
  const priceImpact = amountNum > 0 ? Math.min(amountNum * 0.001, 2.5) : 0;

  const fromBalDisplay = fromBalance
    ? formatUnits(fromBalance, fromToken.decimals)
    : "0";
  const toBalDisplay = toBalance
    ? formatUnits(toBalance, toToken.decimals)
    : "0";

  const needsApprove =
    amountRaw > 0n && (allowance ? allowance < amountRaw : true);

  const canSwap =
    isConnected &&
    !isWrongChain &&
    !isPaused &&
    amountNum > 0 &&
    fromBalance !== undefined &&
    amountRaw <= fromBalance &&
    fromIdx !== toIdx &&
    (txStep === "idle" || txStep === "done" || txStep === "error");

  // ===== Wait for approve tx =====
  const { data: approveReceipt } = useWaitForTransactionReceipt({
    hash: pendingApproveHash as `0x${string}` | undefined,
    query: { enabled: !!pendingApproveHash },
  });

  useEffect(() => {
    if (approveReceipt && txStep === "approving") {
      refetchAllowance();
    }
  }, [approveReceipt, txStep, refetchAllowance]);

  // ===== Wait for swap tx =====
  const { data: swapReceipt } = useWaitForTransactionReceipt({
    hash: pendingSwapHash as `0x${string}` | undefined,
    query: { enabled: !!pendingSwapHash },
  });

  useEffect(() => {
    if (swapReceipt && txStep === "swapping") {
      setTxStep("done");
      setToast(
        `✅ Swap berhasil! ${formatNumber(amountNum, 4)} ${fromToken.symbol} → ${formatNumber(quoteNum, 4)} ${toToken.symbol}`
      );
      setAmount("");
      setTxHash(pendingSwapHash);
      setPendingSwapHash(null);
      // Refetch balances
      refetchFromBalance();
      refetchToBalance();
      refetchQuote();
    }
  }, [swapReceipt, txStep]);

  // ===== Handle swap =====
  const handleSwap = useCallback(async () => {
    if (!canSwap || !address || !writeContractAsync) return;

    setTxStep("idle");
    setToast(null);

    try {
      // Step 1: Approve if needed
      if (needsApprove) {
        setTxStep("approving");
        setToast("⏳ Approving token...");
        const approveHash = await writeContractAsync({
          address: fromToken.address,
          abi: erc20Abi,
          functionName: "approve",
          args: [PRESTO_ROUTER, amountRaw],
          // Arc testnet only accepts legacy tx (type 0), force gasPrice
          gasPrice: parseGwei("21"),
        });
        setPendingApproveHash(approveHash);
        // Wait for receipt
        await new Promise((r) => setTimeout(r, 3000));
        setPendingApproveHash(null);
      }

      // Step 2: Swap
      setTxStep("swapping");
      setToast("⏳ Eksekusi swap on-chain...");

      const deadline = BigInt(Math.floor(Date.now() / 1000) + 1200); // 20 min
      const swapHash = await writeContractAsync({
        address: PRESTO_ROUTER,
        abi: PRESTO_ABI,
        functionName: "swap",
        args: [fromToken.address, toToken.address, amountRaw, minOutRaw, deadline],
        gasPrice: parseGwei("21"),
      });
      setPendingSwapHash(swapHash);
    } catch (e: unknown) {
      console.error("Swap error:", e);
      const msg = e instanceof Error ? e.message : "Unknown error";
      setTxStep("error");
      setToast(`❌ ${msg.slice(0, 120)}`);
      setPendingApproveHash(null);
      setPendingSwapHash(null);
    }
  }, [
    canSwap,
    address,
    writeContractAsync,
    needsApprove,
    fromToken,
    amountRaw,
    minOutRaw,
  ]);

  function flip() {
    setFromIdx(toIdx);
    setToIdx(fromIdx);
    setAmount("");
  }

  function setMax() {
    if (fromBalance) {
      setAmount(formatUnits(fromBalance, fromToken.decimals));
    }
  }

  const stepLabel = useMemo(() => {
    switch (txStep) {
      case "approving":
        return "Approving...";
      case "swapping":
        return "Swapping on-chain...";
      case "done":
        return "Swap berhasil!";
      case "error":
        return "Failed - coba lagi";
      default:
        return null;
    }
  }, [txStep]);

  return (
    <>
      <Header active="Swap" />
      <main className="w-full flex-1 px-4 py-8 sm:py-10">
        <div className="mx-auto w-full max-w-[560px]">
          <div className="rounded-2xl glass-strong p-6 shadow-sm sm:p-8 neon-emerald">
            {/* Header */}
            <div className="mb-3 flex items-center justify-between">
              <span className="text-lg font-semibold">On-Chain Swap</span>
              <div className="flex items-center gap-2">
                {isPaused ? (
                  <span className="rounded border border-red-500/40 bg-red-500/10 px-2 py-1 text-xs text-red-400">
                    DEX Paused
                  </span>
                ) : (
                  <span className="rounded border border-emerald-500/40 bg-emerald-500/10 px-2 py-1 text-xs text-emerald-400">
                    ● Live
                  </span>
                )}
                <span className="rounded border border-border bg-muted/40 px-2 py-1 text-xs text-muted-foreground">
                </span>
              </div>
            </div>

            {/* Wrong chain warning */}
            {isWrongChain && (
              <div className="mb-4 rounded-lg border border-yellow-500/40 bg-yellow-500/10 px-3 py-2 text-xs text-yellow-400">
                ⚠️ Wallet not on Arc Testnet. Switch to chain 5042002 in your wallet.
              </div>
            )}

            {/* Not connected */}
            {!isConnected && (
              <div className="mb-4 rounded-lg border border-blue-500/40 bg-blue-500/10 px-3 py-3 text-center text-sm text-blue-400">
                Connect your wallet first to swap on-chain
              </div>
            )}

            {/* From */}
            <div className="mb-3 rounded-xl border border-border bg-muted/20 p-4">
              <div className="mb-3 flex items-center justify-between text-sm text-muted-foreground">
                <span>From</span>
                {isConnected && (
                  <button
                    type="button"
                    onClick={setMax}
                    className="hover:text-foreground cursor-pointer"
                  >
                    Balance:{" "}
                    <span className="font-mono text-foreground">
                      {formatNumber(Number(fromBalDisplay), 4)}
                    </span>{" "}
                    · MAX
                  </button>
                )}
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={amount}
                  onChange={(e) => {
                    setAmount(e.target.value);
                    setTxStep("idle");
                  }}
                  placeholder="0.00"
                  disabled={!isConnected}
                  className="min-w-0 flex-1 bg-transparent text-4xl font-mono font-semibold outline-none disabled:opacity-40"
                />
                <select
                  value={fromIdx}
                  onChange={(e) => {
                    setFromIdx(Number(e.target.value));
                    setAmount("");
                  }}
                  className="max-w-[160px] rounded-xl border border-border bg-background px-3 py-3 text-base font-semibold outline-none focus:border-emerald-500/50"
                >
                  {TOKENS.map((t, i) => (
                    <option key={t.symbol} value={i}>
                      {t.symbol}
                    </option>
                  ))}
                </select>
              </div>
              {isConnected && amountNum > 0 && fromBalance !== undefined && (
                <div className="mt-2 text-sm text-muted-foreground">
                  {amountRaw > fromBalance && (
                    <span className="text-red-400">Melebihi balance</span>
                  )}
                </div>
              )}
            </div>

            {/* Flip */}
            <div className="relative z-10 -my-1 flex justify-center">
              <button
                type="button"
                onClick={flip}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-background text-muted-foreground hover:border-emerald-500/50 hover:text-emerald-400 cursor-pointer"
                title="Flip"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M7 10V3M7 3L4 6M7 3l3 3" />
                  <path d="M17 14v7M17 21l3-3M17 21l-3-3" />
                </svg>
              </button>
            </div>

            {/* To */}
            <div className="mb-4 rounded-xl border border-border bg-muted/20 p-4">
              <div className="mb-3 flex items-center justify-between text-sm text-muted-foreground">
                <span>To</span>
                {isConnected && (
                  <span>
                    Balance:{" "}
                    <span className="font-mono text-foreground">
                      {formatNumber(Number(toBalDisplay), 4)}
                    </span>
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <div className="min-w-0 flex-1 text-4xl font-mono font-semibold text-foreground">
                  {amountNum > 0 && quoteRaw ? formatNumber(quoteNum, 6) : "0.00"}
                </div>
                <select
                  value={toIdx}
                  onChange={(e) => setToIdx(Number(e.target.value))}
                  className="max-w-[160px] rounded-xl border border-border bg-background px-3 py-3 text-base font-semibold outline-none focus:border-emerald-500/50"
                >
                  {TOKENS.map((t, i) => (
                    <option key={t.symbol} value={i}>
                      {t.symbol}
                    </option>
                  ))}
                </select>
              </div>
              {amountNum > 0 && quoteRaw && (
                <div className="mt-2 text-sm text-muted-foreground">
                  Min receive ({slippage}% slip):{" "}
                  <span className="font-mono text-blue-400">
                    {formatNumber(Number(minOutDisplay), 6)} {toToken.symbol}
                  </span>
                </div>
              )}
            </div>

            {/* Slippage */}
            <div className="mb-4">
              <div className="mb-2 flex items-center justify-between text-sm text-muted-foreground">
                <span>Slippage</span>
                <span>{slippage}%</span>
              </div>
              <div className="flex gap-1">
                {["0.5", "1", "2", "5"].map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setSlippage(v)}
                    className={`flex-1 rounded-lg px-3 py-2.5 text-sm font-medium cursor-pointer ${
                      slippage === v
                        ? "bg-foreground text-background"
                        : "bg-muted/50 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {v}%
                  </button>
                ))}
              </div>
            </div>

            {/* Rate box */}
            {amountNum > 0 && quoteRaw && rate > 0 && (
              <div className="mb-5 space-y-2 rounded-xl border border-border bg-muted/20 px-4 py-3 text-sm text-muted-foreground">
                <div className="flex justify-between">
                  <span>Rate</span>
                  <span className="font-mono text-foreground">
                    1 {fromToken.symbol} ≈ {formatNumber(rate, 6)} {toToken.symbol}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Price Impact</span>
                  <span className={priceImpact > 1 ? "text-red-400 font-mono" : "font-mono text-foreground"}>
                    {priceImpact.toFixed(2)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Router</span>
                  <span className="font-mono text-foreground text-xs">
                    {PRESTO_ROUTER.slice(0, 8)}...{PRESTO_ROUTER.slice(-6)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Network</span>
                  <span className="text-foreground">Arc Testnet (5042002)</span>
                </div>
                {needsApprove && (
                  <div className="flex justify-between">
                    <span>Approve</span>
                    <span className="text-yellow-400">Diperlukan (1x tx)</span>
                  </div>
                )}
              </div>
            )}

            {/* Swap button */}
            <button
              type="button"
              disabled={!canSwap}
              onClick={handleSwap}
              className={`w-full rounded-xl py-4 text-base font-semibold cursor-pointer transition-colors ${
                canSwap
                  ? (txStep as string) === "approving" || (txStep as string) === "swapping"
                    ? "bg-yellow-500/80 text-background animate-pulse"
                    : needsApprove
                      ? "bg-yellow-600 text-white hover:bg-yellow-500"
                      : "bg-blue-500 text-white hover:bg-blue-400"
                  : "bg-muted/40 text-muted-foreground cursor-not-allowed"
              }`}
            >
              {!isConnected
                ? "Connect Wallet"
                : isWrongChain
                  ? "Switch ke Arc Testnet"
                  : isPaused
                    ? "DEX sedang paused"
                    : stepLabel
                      ? stepLabel
                      : amountNum <= 0
                        ? "Masukkan amount"
                        : fromBalance !== undefined && amountRaw > fromBalance
                          ? "Amount melebihi balance"
                          : needsApprove
                            ? `Approve & Swap ${fromToken.symbol} → ${toToken.symbol}`
                            : `Swap ${fromToken.symbol} → ${toToken.symbol}`}
            </button>

            {/* Tx hash link */}
            {txHash && txStep === "done" && (
              <a
                href={`https://testnet.arcscan.app/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 block text-center text-xs text-blue-400 hover:underline"
              >
                View tx on Arcscan ↗
              </a>
            )}
          </div>

          {toast && (
            <div
              className={`mt-3 rounded-lg border px-3 py-2 text-center text-xs ${
                toast.startsWith("✅")
                  ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
                  : toast.startsWith("⏳")
                    ? "border-yellow-500/40 bg-yellow-500/10 text-yellow-300"
                    : "border-red-500/40 bg-red-500/10 text-red-300"
              }`}
            >
              {toast}
            </div>
          )}

          {/* Info box */}
          <div className="mt-4 rounded-xl border border-border bg-muted/10 px-4 py-3 text-xs text-muted-foreground">
            <div className="mb-1 font-semibold text-foreground">ℹ️ About On-Chain Swap</div>
            <ul className="space-y-1">
              <li>• Swap real tokens on Arc Testnet</li>
              <li>• Stablecoin pairs: USDC ↔ EURC ↔ USDT</li>
              <li>• Quote directly from smart contract (getQuote)</li>
              <li>• Requires 1x approval per token before first swap</li>
              <li>• Gas paid in native USDC on Arc Testnet</li>
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
