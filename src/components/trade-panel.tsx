"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { WalletButton } from "@/components/wallet-button";
import { formatPrice } from "@/lib/format";

type OrderType = "market" | "limit" | "advanced";
type Priority = "low" | "medium" | "high";

interface TradePanelProps {
  pair: {
    address: string;
    token0: { symbol: string; name: string; decimals: number };
    token1: { symbol: string; name: string; decimals: number };
    priceToken0PerToken1: string;
    priceToken1PerToken0: string;
  };
}

export function TradePanel({ pair }: TradePanelProps) {
  const { isConnected } = useAccount();
  const [side, setSide] = useState<"buy" | "sell">("buy");
  const [orderType, setOrderType] = useState<OrderType>("market");
  const [amount, setAmount] = useState("");
  const [slippage, setSlippage] = useState("1");
  const [customSlippage, setCustomSlippage] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [mev, setMev] = useState(true);

  const price = side === "buy" ? pair.priceToken0PerToken1 : pair.priceToken1PerToken0;
  const expectedOut = amount ? (parseFloat(amount) / parseFloat(price)).toFixed(4) : "0";

  const handleSlippageSelect = (v: string) => {
    setSlippage(v);
    setCustomSlippage("");
  };

  const handleCustomSlippage = (v: string) => {
    setCustomSlippage(v);
    if (v && !isNaN(Number(v))) {
      setSlippage(v);
    }
  };

  return (
    <div className="rounded-lg border border-border glass card-glow">
      {/* Buy/Sell tabs */}
      <div className="flex border-b border-border">
        <button
          type="button"
          onClick={() => setSide("buy")}
          className={`flex-1 py-2 text-sm font-semibold transition-colors cursor-pointer ${
            side === "buy" ? "bg-emerald-500 text-background" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Buy
        </button>
        <button
          type="button"
          onClick={() => setSide("sell")}
          className={`flex-1 py-2 text-sm font-semibold transition-colors cursor-pointer ${
            side === "sell" ? "bg-red-500 text-background" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Sell
        </button>
      </div>

      <div className="p-3 space-y-3">
        {/* Order type */}
        <div className="flex gap-1">
          {(["market", "limit", "advanced"] as const).map(t => (
            <button
              key={t}
              type="button"
              onClick={() => setOrderType(t)}
              className={`flex-1 rounded px-2 py-1 text-xs font-medium cursor-pointer ${
                orderType === t ? "bg-foreground text-background" : "bg-muted/50 text-muted-foreground"
              }`}
            >
              {t === "market" ? "Market" : t === "limit" ? "Limit" : "Advanced"}
            </button>
          ))}
        </div>

        {/* Amount input */}
        <div>
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>Amount ({side === "buy" ? pair.token1.symbol : pair.token0.symbol})</span>
            <span>≈ {expectedOut} {side === "buy" ? pair.token0.symbol : pair.token1.symbol}</span>
          </div>
          <input
            type="text"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            placeholder="0.0"
            className="w-full rounded border border-border bg-background px-3 py-2 font-mono text-sm outline-none focus:border-emerald-500"
          />
        </div>

        {/* Quick amounts */}
        <div className="flex gap-1">
          {["10", "50", "100", "500"].map(v => (
            <button
              key={v}
              type="button"
              onClick={() => setAmount(v)}
              className="flex-1 rounded bg-muted/50 px-2 py-1 text-xs text-muted-foreground hover:bg-muted cursor-pointer"
            >
              {v}
            </button>
          ))}
        </div>

        {/* Slippage */}
        <div>
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>Slippage</span>
            <span>{slippage}%</span>
          </div>
          <div className="flex gap-1">
            {["0.5", "1", "2"].map(v => (
              <button
                key={v}
                type="button"
                onClick={() => handleSlippageSelect(v)}
                className={`flex-1 rounded px-2 py-1 text-xs cursor-pointer ${
                  slippage === v && !customSlippage ? "bg-foreground text-background" : "bg-muted/50 text-muted-foreground"
                }`}
              >
                {v}%
              </button>
            ))}
            <input
              type="text"
              value={customSlippage}
              onChange={e => handleCustomSlippage(e.target.value)}
              placeholder="Custom"
              className={`flex-1 rounded px-2 py-1 text-xs text-center outline-none bg-muted/50 text-muted-foreground focus:text-foreground ${customSlippage ? "ring-1 ring-foreground" : ""}`}
            />
          </div>
          {Number(slippage) > 5 && (
            <p className="text-[10px] text-red-400 mt-1">High slippage — you may receive significantly less</p>
          )}
        </div>

        {/* Priority & MEV */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <div className="text-xs text-muted-foreground mb-1">Priority</div>
            <div className="flex gap-1">
              {(["low", "medium", "high"] as const).map(p => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  className={`flex-1 rounded px-2 py-1 text-xs cursor-pointer ${
                    priority === p ? "bg-foreground text-background" : "bg-muted/50 text-muted-foreground"
                  }`}
                  title={p === "low" ? "Slow" : p === "medium" ? "Standard" : "Fast"}
                >
                  {p === "low" ? "Slow" : p === "medium" ? "Std" : "Fast"}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-1">MEV</div>
            <button
              type="button"
              onClick={() => setMev(!mev)}
              className={`w-full rounded px-2 py-1 text-xs cursor-pointer ${
                mev ? "bg-emerald-500/20 text-emerald-400" : "bg-muted/50 text-muted-foreground"
              }`}
            >
              {mev ? "Protected" : "Unprotected"}
            </button>
          </div>
        </div>

        {/* Action button */}
        {isConnected ? (
          <button
            type="button"
            className={`w-full rounded-lg py-2.5 text-sm font-semibold cursor-pointer ${
              side === "buy" ? "bg-emerald-500 text-background hover:bg-emerald-600" : "bg-red-500 text-background hover:bg-red-600"
            }`}
          >
            {side === "buy" ? `Buy ${pair.token0.symbol}` : `Sell ${pair.token0.symbol}`}
          </button>
        ) : (
          <div className="space-y-2">
            <WalletButton />
            <p className="text-center text-xs text-muted-foreground">Connect Wallet to trade</p>
          </div>
        )}

        {/* Price info */}
        <div className="rounded bg-muted/30 p-2 text-center">
          <div className="text-[10px] text-muted-foreground">Current Price</div>
          <div className="font-mono text-sm font-semibold">
            1 {pair.token0.symbol} = {formatPrice(parseFloat(pair.priceToken0PerToken1))} {pair.token1.symbol}
          </div>
        </div>
      </div>
    </div>
  );
}
