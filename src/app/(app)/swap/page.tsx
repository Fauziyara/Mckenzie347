"use client";

import { useEffect, useMemo, useState, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { formatNumber } from "@/lib/format";
import { TokenLogo } from "@/components/token-logo";
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
  useChainId,
} from "wagmi";
import { parseUnits, formatUnits, parseGwei, erc20Abi } from "viem";

// ============================================================
// Aperture DEX — Arc Testnet AMM Swap (Spot Only)
// Swap tokens via UniswapV2 pairs on Arc testnet
// ============================================================

const USDC_ADDRESS = "0x3600000000000000000000000000000000000000" as const;

// ── Known AMM pair contracts on Arc testnet ──
const AMM_PAIRS: Record<string, { address: `0x${string}`; token0: `0x${string}`; token1: `0x${string}` }> = {
  "USDC/EURC": {
    address: "0xa5cf14f962ed710024a9a626569d984e6253827b",
    token0: "0x3600000000000000000000000000000000000000", // USDC
    token1: "0x89b50855aa3be2f677cd6303cec089b5f319d72a", // EURC
  },
  "USDC/cirBTC": {
    address: "0x789ca3efc403df1fe58867d50eba5c3fa0e652c8",
    token0: "0x3600000000000000000000000000000000000000", // USDC
    token1: "0xf0c4a4ce82a5746abaad9425360ab04fbba432bf", // cirBTC
  },
};

// Token metadata
const TOKENS: Record<string, { address: `0x${string}`; decimals: number; name: string }> = {
  USDC: { address: USDC_ADDRESS, decimals: 6, name: "USD Coin" },
  EURC: { address: "0x89b50855aa3be2f677cd6303cec089b5f319d72a", decimals: 6, name: "Euro Coin" },
  cirBTC: { address: "0xf0c4a4ce82a5746abaad9425360ab04fbba432bf", decimals: 8, name: "Circle BTC" },
};

// Available swap tokens (for token selector)
const SWAP_TOKENS = Object.entries(TOKENS).map(([symbol, meta]) => ({
  symbol,
  name: meta.name,
}));

// UniswapV2Pair ABI — minimal subset for swaps
const UNISWAP_V2_PAIR_ABI = [
  {
    type: "function",
    name: "swap",
    inputs: [
      { name: "amount0Out", type: "uint256" },
      { name: "amount1Out", type: "uint256" },
      { name: "to", type: "address" },
      { name: "data", type: "bytes" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "getReserves",
    inputs: [],
    outputs: [
      { name: "_reserve0", type: "uint112" },
      { name: "_reserve1", type: "uint112" },
      { name: "_blockTimestampLast", type: "uint32" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "token0",
    inputs: [],
    outputs: [{ name: "", type: "address" }],
    stateMutability: "view",
  },
] as const;

// UniswapV2 amount out calculation
function getAmountOut(amountIn: bigint, reserveIn: bigint, reserveOut: bigint): bigint {
  if (amountIn <= 0n || reserveIn <= 0n || reserveOut <= 0n) return 0n;
  const amountInWithFee = amountIn * 997n;
  const numerator = amountInWithFee * reserveOut;
  const denominator = reserveIn * 1000n + amountInWithFee;
  return numerator / denominator;
}

// Find pair for a given from→to
function findPair(from: string, to: string): { pairKey: string; address: `0x${string}` } | null {
  // Try direct key
  const key1 = `${from}/${to}`;
  const key2 = `${to}/${from}`;
  if (AMM_PAIRS[key1]) return { pairKey: key1, address: AMM_PAIRS[key1].address };
  if (AMM_PAIRS[key2]) return { pairKey: key2, address: AMM_PAIRS[key2].address };
  return null;
}

type TxStep = "idle" | "approving" | "transferring" | "swapping" | "done" | "error";

// Token selector dropdown
function TokenSelect({ value, onChange, exclude }: { value: string; onChange: (s: string) => void; exclude?: string }) {
  const [open, setOpen] = useState(false);
  const tokens = SWAP_TOKENS.filter(t => t.symbol !== exclude);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-full border border-border bg-background px-3 py-2 text-sm font-semibold outline-none hover:border-emerald-500/50 cursor-pointer"
      >
        <TokenLogo symbol={value} size={24} />
        <span>{value}</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="ml-auto text-muted-foreground">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full z-50 mt-1 max-h-[320px] w-[220px] overflow-y-auto rounded-xl border border-border bg-background shadow-xl">
            {tokens.map((t) => (
              <button
                key={t.symbol}
                type="button"
                onClick={() => { onChange(t.symbol); setOpen(false); }}
                className={`flex w-full items-center gap-3 px-3 py-2.5 text-sm hover:bg-muted/40 cursor-pointer ${t.symbol === value ? "bg-muted/20" : ""}`}
              >
                <TokenLogo symbol={t.symbol} size={24} />
                <div className="flex flex-col items-start">
                  <span className="font-semibold">{t.symbol}</span>
                  <span className="text-xs text-muted-foreground">{t.name}</span>
                </div>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function SwapContent() {
  const params = useSearchParams();
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { writeContractAsync } = useWriteContract();

  const [fromSymbol, setFromSymbol] = useState("USDC");
  const [toSymbol, setToSymbol] = useState("cirBTC");
  const [amount, setAmount] = useState("");
  const [toast, setToast] = useState<string | null>(null);
  const [txStep, setTxStep] = useState<TxStep>("idle");
  const [txHash, setTxHash] = useState<string | null>(null);
  const [pendingHash, setPendingHash] = useState<string | null>(null);

  // Read URL params — fallback to closest AMM pair if token unknown
  useEffect(() => {
    const fromParam = params.get("from");
    const toParam = params.get("to");
    if (fromParam && TOKENS[fromParam]) {
      setFromSymbol(fromParam);
    } else if (fromParam) {
      // Unknown token from explorer — default to USDC
      setFromSymbol("USDC");
    }
    if (toParam && TOKENS[toParam]) {
      setToSymbol(toParam);
    } else if (toParam) {
      // Unknown token (BTC, ETH, etc from explorer) — default to cirBTC
      setToSymbol("cirBTC");
    }
  }, [params]);

  const isWrongChain = isConnected && chainId !== 5042002;

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 6000);
    return () => clearTimeout(t);
  }, [toast]);

  // ── Pair lookup ──
  const pairInfo = useMemo(() => findPair(fromSymbol, toSymbol), [fromSymbol, toSymbol]);
  const hasPair = pairInfo !== null;

  // ── Balances (no auto-polling to avoid rate limits) ──
  const { data: fromBalance, refetch: refetchFromBalance } = useReadContract({
    address: TOKENS[fromSymbol]?.address,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: [address ?? "0x0"],
    query: { enabled: !!address && !!TOKENS[fromSymbol], refetchInterval: false, staleTime: 30_000 },
  });

  const { data: toBalanceData, refetch: refetchToBalance } = useReadContract({
    address: TOKENS[toSymbol]?.address,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: [address ?? "0x0"],
    query: { enabled: !!address && !!TOKENS[toSymbol], refetchInterval: false, staleTime: 30_000 },
  });

  // ── Reserves (fetch from own API to avoid CORS/timeout) ──
  const [reserves, setReserves] = useState<{ reserve0: bigint; reserve1: bigint; token0Addr: string } | null>(null);

  useEffect(() => {
    if (!pairInfo) { setReserves(null); return; }
    let cancelled = false;

    const fetchReserves = async () => {
      try {
        // Use own API to avoid CORS issues with direct RPC
        const res = await fetch("/api/reserves");
        const data = await res.json();
        if (cancelled || !data.success) return;

        // Find our pair in the response
        const pairData = data.pairs[pairInfo.pairKey];
        if (!pairData) return;

        setReserves({
          reserve0: BigInt(pairData.reserve0),
          reserve1: BigInt(pairData.reserve1),
          token0Addr: pairData.token0,
        });
      } catch (e) {
        console.error("Failed to fetch reserves:", e);
        // Fallback: try direct RPC
        try {
          const rpcUrl = "https://rpc.testnet.arc.network";
          const [resReserves, resToken0] = await Promise.all([
            fetch(rpcUrl, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "eth_call", params: [{ to: pairInfo.address, data: "0x0902f1ac" }, "latest"] }),
            }).then(r => r.json()),
            fetch(rpcUrl, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ jsonrpc: "2.0", id: 2, method: "eth_call", params: [{ to: pairInfo.address, data: "0x0dfe1681" }, "latest"] }),
            }).then(r => r.json()),
          ]);

          if (cancelled) return;
          const reservesHex = resReserves?.result || "";
          const token0Hex = resToken0?.result || "";
          if (reservesHex.length < 130 || token0Hex.length < 42) return;

          setReserves({
            reserve0: BigInt("0x" + reservesHex.slice(2, 66)),
            reserve1: BigInt("0x" + reservesHex.slice(66, 130)),
            token0Addr: "0x" + token0Hex.slice(26).toLowerCase(),
          });
        } catch (e2) {
          console.error("RPC fallback also failed:", e2);
        }
      }
    };

    fetchReserves();
    const interval = setInterval(fetchReserves, 12000);
    return () => { cancelled = true; clearInterval(interval); };
  }, [pairInfo]);

  // ── Calculate amounts ──
  const fromDecimals = TOKENS[fromSymbol]?.decimals ?? 6;
  const toDecimals = TOKENS[toSymbol]?.decimals ?? 6;
  const amountNum = Number(amount) || 0;
  const amountRaw = amountNum > 0 ? parseUnits(amount.toString(), fromDecimals) : 0n;

  const { amountOut, priceImpact, exchangeRate } = useMemo(() => {
    if (!reserves || !pairInfo || amountNum <= 0) {
      return { amountOut: 0n, priceImpact: 0, exchangeRate: 0 };
    }

    const fromAddr = TOKENS[fromSymbol]?.address.toLowerCase();
    const fromIsToken0 = reserves.token0Addr === fromAddr;

    const reserveIn = fromIsToken0 ? reserves.reserve0 : reserves.reserve1;
    const reserveOut = fromIsToken0 ? reserves.reserve1 : reserves.reserve0;

    const out = getAmountOut(amountRaw, reserveIn, reserveOut);

    // Spot price
    const reserveInHuman = Number(formatUnits(reserveIn, fromDecimals));
    const reserveOutHuman = Number(formatUnits(reserveOut, toDecimals));
    const spotPrice = reserveInHuman > 0 ? reserveOutHuman / reserveInHuman : 0;

    // Execution price
    const outHuman = Number(formatUnits(out, toDecimals));
    const execPrice = amountNum > 0 ? outHuman / amountNum : 0;

    // Price impact
    const impact = spotPrice > 0 ? ((spotPrice - execPrice) / spotPrice) * 100 : 0;

    // Exchange rate (1 fromToken = X toToken)
    const rate = spotPrice;

    return { amountOut: out, priceImpact: Math.max(impact, 0), exchangeRate: rate };
  }, [reserves, pairInfo, amountRaw, amountNum, fromSymbol, toSymbol, fromDecimals, toDecimals]);

  const amountOutHuman = Number(formatUnits(amountOut, toDecimals));

  // ── Allowance (no auto-polling) ──
  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: TOKENS[fromSymbol]?.address,
    abi: erc20Abi,
    functionName: "allowance",
    args: [address ?? "0x0", pairInfo?.address ?? "0x0"],
    query: { enabled: !!address && !!pairInfo, refetchInterval: false, staleTime: 30_000 },
  });

  const needsApprove = amountRaw > 0n && (allowance !== undefined ? allowance < amountRaw : true);

  // Balance check
  const fromBalanceHuman = fromBalance ? Number(formatUnits(fromBalance, fromDecimals)) : 0;
  const toBalanceHuman = toBalanceData ? Number(formatUnits(toBalanceData, toDecimals)) : 0;
  const insufficientBalance = amountNum > 0 && amountNum > fromBalanceHuman;

  const canSwap =
    isConnected &&
    !isWrongChain &&
    hasPair &&
    amountNum > 0 &&
    !insufficientBalance &&
    amountOut > 0n &&
    (txStep === "idle" || txStep === "done" || txStep === "error");

  // ── Tx receipt watcher ──
  const { data: receipt } = useWaitForTransactionReceipt({
    hash: pendingHash as `0x${string}` | undefined,
    query: { enabled: !!pendingHash },
  });

  useEffect(() => {
    if (receipt && (txStep === "swapping" || txStep === "transferring")) {
      setTxStep("done");
      setToast(`✅ Swapped ${amount} ${fromSymbol} → ${formatNumber(amountOutHuman, toDecimals === 8 ? 8 : 4)} ${toSymbol}`);
      setAmount("");
      setTxHash(pendingHash);
      setPendingHash(null);
      refetchFromBalance();
      refetchToBalance();
      refetchAllowance();
    }
  }, [receipt, txStep]);

  // ── Execute Swap ──
  const handleSwap = useCallback(async () => {
    if (!canSwap || !address || !writeContractAsync || !pairInfo || !reserves) return;

    setTxStep("idle");
    setToast(null);

    try {
      const fromAddr = TOKENS[fromSymbol]?.address.toLowerCase();
      const fromIsToken0 = reserves.token0Addr === fromAddr;
      const reserveIn = fromIsToken0 ? reserves.reserve0 : reserves.reserve1;
      const reserveOut = fromIsToken0 ? reserves.reserve1 : reserves.reserve0;

      const amountOutMin = getAmountOut(amountRaw, reserveIn, reserveOut);
      // Apply 0.5% slippage
      const minOut = (amountOutMin * 995n) / 1000n;

      // Step 1: Approve if needed
      if (needsApprove) {
        setTxStep("approving");
        setToast(`Approving ${fromSymbol}...`);
        const approveHash = await writeContractAsync({
          address: TOKENS[fromSymbol].address,
          abi: erc20Abi,
          functionName: "approve",
          args: [pairInfo.address, amountRaw],
          gasPrice: parseGwei("21"),
        });
        setPendingHash(approveHash);
        // Wait for approval to confirm
        await new Promise((r) => setTimeout(r, 5000));
        setPendingHash(null);
        refetchAllowance();
      }

      // Step 2: Transfer tokens to pair
      setTxStep("transferring");
      setToast(`Sending ${fromSymbol} to pool...`);
      const transferHash = await writeContractAsync({
        address: TOKENS[fromSymbol].address,
        abi: erc20Abi,
        functionName: "transfer",
        args: [pairInfo.address, amountRaw],
        gasPrice: parseGwei("21"),
      });
      setPendingHash(transferHash);
      await new Promise((r) => setTimeout(r, 5000));
      setPendingHash(null);

      // Step 3: Call swap on pair
      setTxStep("swapping");
      setToast("Executing swap...");

      const amount0Out = fromIsToken0 ? 0n : minOut;
      const amount1Out = fromIsToken0 ? minOut : 0n;

      const swapHash = await writeContractAsync({
        address: pairInfo.address,
        abi: UNISWAP_V2_PAIR_ABI,
        functionName: "swap",
        args: [amount0Out, amount1Out, address, "0x" as `0x${string}`],
        gasPrice: parseGwei("21"),
      });
      setPendingHash(swapHash);
    } catch (e: unknown) {
      console.error("Swap error:", e);
      const msg = e instanceof Error ? e.message : "Unknown error";
      setTxStep("error");
      setToast(`❌ ${msg.slice(0, 120)}`);
      setPendingHash(null);
    }
  }, [canSwap, address, writeContractAsync, pairInfo, reserves, fromSymbol, toSymbol, amountRaw, needsApprove]);

  // ── Set Max ──
  function setMax() {
    if (fromBalance) {
      const bal = Number(formatUnits(fromBalance, fromDecimals));
      setAmount(bal.toFixed(fromDecimals));
    }
  }

  // ── Flip direction ──
  function handleFlip() {
    const tmp = fromSymbol;
    setFromSymbol(toSymbol);
    setToSymbol(tmp);
    setAmount("");
    setTxStep("idle");
  }

  // ── Button label ──
  const buttonLabel = !isConnected
    ? "Connect Wallet"
    : isWrongChain
      ? "Switch to Arc Testnet"
      : !hasPair
        ? "No liquidity pool"
        : txStep === "approving" ? "Approving..."
        : txStep === "transferring" ? "Sending..."
        : txStep === "swapping" ? "Swapping..."
        : txStep === "done" ? "Swap Complete ✓"
        : txStep === "error" ? "Try Again"
        : insufficientBalance ? "Insufficient Balance"
        : amountNum <= 0 ? "Enter Amount"
        : needsApprove ? `Approve & Swap`
        : "Swap";

  const buttonDisabled = !isConnected ? false : isWrongChain ? false : !canSwap;

  return (
    <>
      <Header logoColor="green" active="Swap" />
      <main className="w-full flex-1 px-4 flex items-center justify-center" style={{ minHeight: "calc(100vh - 180px)" }}>
        <div className="mx-auto w-full max-w-[480px]">

          {/* ── SWAP CARD ── */}
          <div className="rounded-2xl glass-strong p-6 shadow-sm sm:p-8 neon-emerald">

            {/* Title */}
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-foreground">Swap</h2>
              <span className="text-xs text-muted-foreground px-2 py-1 rounded-md bg-muted/30 border border-border/50">Arc Testnet</span>
            </div>

            {isWrongChain && (
              <div className="mb-4 rounded-lg border border-yellow-500/40 bg-yellow-500/10 px-3 py-2 text-xs text-yellow-400">
                ⚠️ Wallet not on Arc Testnet. Switch to chain ID 5042002.
              </div>
            )}

            {!hasPair && fromSymbol !== toSymbol && (
              <div className="mb-4 rounded-lg border border-orange-500/40 bg-orange-500/10 px-3 py-2 text-xs text-orange-400">
                No liquidity pool found for {fromSymbol}/{toSymbol}. Try USDC ↔ cirBTC or USDC ↔ EURC.
              </div>
            )}

            {/* ── YOU PAY ── */}
            <div className="rounded-xl border border-border bg-muted/20 p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">You Pay</span>
                {isConnected && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>Balance: <span className="font-mono text-foreground">{formatNumber(fromBalanceHuman, fromDecimals === 8 ? 8 : 4)}</span></span>
                    <button
                      type="button"
                      onClick={setMax}
                      className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-400 hover:bg-emerald-500/20 cursor-pointer"
                    >
                      MAX
                    </button>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={amount}
                  onChange={(e) => { setAmount(e.target.value); setTxStep("idle"); }}
                  placeholder="0.00"
                  disabled={!isConnected}
                  className="min-w-0 flex-1 bg-transparent text-3xl font-mono font-semibold outline-none placeholder:text-muted-foreground/40 disabled:opacity-40 sm:text-4xl"
                />
                <TokenSelect value={fromSymbol} onChange={(s) => { setFromSymbol(s); setAmount(""); setTxStep("idle"); }} exclude={toSymbol} />
              </div>
              {insufficientBalance && (
                <div className="mt-2 text-xs text-red-400">Insufficient {fromSymbol} balance</div>
              )}
            </div>

            {/* ── FLIP BUTTON ── */}
            <div className="relative z-10 -my-3 flex justify-center">
              <button
                type="button"
                onClick={handleFlip}
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 hover:text-emerald-300 cursor-pointer transition-all border border-emerald-500/30"
                aria-label="Flip swap direction"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M7 4v16" />
                  <path d="M3 8l4-4 4 4" />
                  <path d="M17 20V4" />
                  <path d="M21 16l-4 4-4-4" />
                </svg>
              </button>
            </div>

            {/* ── YOU RECEIVE ── */}
            <div className="rounded-xl border border-border bg-muted/20 p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">You Receive</span>
                {isConnected && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>Balance: <span className="font-mono text-foreground">{formatNumber(toBalanceHuman, toDecimals === 8 ? 8 : 4)}</span></span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-3">
                <div className="min-w-0 flex-1 text-3xl font-mono font-semibold text-emerald-400 sm:text-4xl">
                  {amountOutHuman > 0 ? formatNumber(amountOutHuman, toDecimals === 8 ? 8 : 4) : "0.00"}
                </div>
                <TokenSelect value={toSymbol} onChange={(s) => { setToSymbol(s); setTxStep("idle"); }} exclude={fromSymbol} />
              </div>
            </div>

            {/* ── SWAP DETAILS ── */}
            {hasPair && amountNum > 0 && (
              <div className="mt-4 space-y-2 px-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Rate</span>
                  <span className="font-mono text-emerald-400">
                    1 {fromSymbol} = {exchangeRate > 0 ? formatNumber(exchangeRate, toDecimals === 8 ? 8 : 4) : "..."} {toSymbol}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Price Impact</span>
                  <span className={`font-mono ${priceImpact > 3 ? "text-red-400" : priceImpact > 1 ? "text-yellow-400" : "text-emerald-400"}`}>
                    {priceImpact.toFixed(2)}%
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Min. Received</span>
                  <span className="font-mono text-emerald-400">
                    {amountOut > 0n ? formatNumber(Number(formatUnits((amountOut * 995n) / 1000n, toDecimals)), toDecimals === 8 ? 8 : 4) : "0"} {toSymbol}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Slippage</span>
                  <span className="font-mono text-emerald-400">0.5%</span>
                </div>
              </div>
            )}

            {/* ── ACTION BUTTON ── */}
            <button
              type="button"
              disabled={buttonDisabled}
              onClick={handleSwap}
              className={`mt-5 w-full rounded-full py-4 text-base font-bold text-white transition-all ${
                buttonDisabled
                  ? "cursor-not-allowed bg-muted/40 text-muted-foreground"
                  : (txStep === "approving" || txStep === "swapping" || txStep === "transferring")
                    ? "animate-pulse bg-gradient-to-r from-violet-500 to-emerald-500"
                    : "bg-gradient-to-r from-violet-500 to-emerald-500 hover:from-violet-400 hover:to-emerald-400 cursor-pointer"
              }`}
            >
              {buttonLabel}
            </button>

            {/* TX link */}
            {txHash && txStep === "done" && (
              <a
                href={`https://testnet.arcscan.app/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 block text-center text-xs text-blue-400 hover:underline"
              >
                View on Arcscan ↗
              </a>
            )}
          </div>

          {/* ── TOAST ── */}
          {toast && (
            <div className={`mt-3 rounded-lg border px-3 py-2 text-center text-xs flex items-center justify-center gap-2 ${
              txStep === "done"
                ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
                : txStep === "error"
                  ? "border-red-500/40 bg-red-500/10 text-red-300"
                  : "border-yellow-500/40 bg-yellow-500/10 text-yellow-300"
            }`}>
              {txStep === "done" && (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5" /></svg>
              )}
              {txStep === "error" && (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" /><path d="M15 9l-6 6M9 9l6 6" /></svg>
              )}
              {(txStep === "approving" || txStep === "swapping" || txStep === "transferring") && (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="animate-spin"><path d="M21 12a9 9 0 11-6.219-8.56" /></svg>
              )}
              {toast}
            </div>
          )}

          {/* ── FOOTER ── */}
          <div className="mt-4 flex items-center justify-center gap-4 text-xs text-muted-foreground">
            <span>⛽ ~$0.001</span>
            <span className="text-border">·</span>
            <span>⏱️ ~2s</span>
            <span className="text-border">·</span>
            <span>🔒 0.5% slippage</span>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function SwapPage() {
  return (
    <Suspense fallback={
      <>
        <Header logoColor="green" active="Swap" />
        <main className="w-full flex-1 flex items-center justify-center min-h-[60vh]">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
        </main>
        <Footer />
      </>
    }>
      <SwapContent />
    </Suspense>
  );
}
