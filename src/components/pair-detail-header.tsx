"use client";

import { formatUsd, formatNumber, formatPrice, shortAddr } from "@/lib/format";

interface PairHeaderData {
  token0_symbol: string;
  token0_name: string;
  token1_symbol: string;
  token1_name: string;
  address: string;
  token0: string;
  token1: string;
  token0_decimals: number;
  token1_decimals: number;
  priceToken0PerToken1: string;
  priceToken1PerToken0: string;
  reserve0Formatted: string;
  reserve1Formatted: string;
  total_swaps: number;
  total_volume0: string;
  total_volume1: string;
}

interface PairDetailHeaderProps {
  pair: PairHeaderData;
  watched: boolean;
  onToggleWatch: () => void;
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</span>
      <span className="text-sm font-semibold">{value}</span>
    </div>
  );
}

export function PairDetailHeader({ pair, watched, onToggleWatch }: PairDetailHeaderProps) {
  const price = parseFloat(pair.priceToken0PerToken1);
  const displayPrice = price > 0 && price < 0.01 ? 1 / price : price;

  const liqUsd = parseFloat(pair.reserve0Formatted) * price + parseFloat(pair.reserve1Formatted);
  const vol0 = parseFloat(pair.total_volume0) / (10 ** pair.token0_decimals);
  const vol1 = parseFloat(pair.total_volume1) / (10 ** pair.token1_decimals);
  const totalVol = vol0 * price + vol1;

  const supply = parseFloat(pair.reserve0Formatted) + parseFloat(pair.reserve1Formatted);
  const mcap = supply * displayPrice;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-muted/5 px-4 py-2.5">
      {/* Left: token identity + stats inline */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 text-xs font-bold text-background">
            {pair.token0_symbol.slice(0, 2)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold tracking-tight">{pair.token0_symbol}</h1>
              <span className="text-xs text-muted-foreground">{pair.token0_name} / {pair.token1_symbol}</span>
              <span className="rounded bg-blue-500/20 px-1.5 py-0.5 text-[9px] font-bold text-blue-400">REAL</span>
            </div>
            <div className="mt-0.5 font-mono text-[10px] text-muted-foreground">{shortAddr(pair.address, 10)}</div>
          </div>
        </div>

        <Stat label="Price" value={formatUsd(displayPrice)} />
        <Stat label="Mkt Cap" value={formatUsd(mcap)} />
        <Stat label="Liquidity" value={formatUsd(liqUsd)} />
        <Stat label="Volume" value={formatUsd(totalVol)} />
        <Stat label="Swaps" value={formatNumber(pair.total_swaps, 0)} />
      </div>

      {/* Right: watch button only */}
      <div className="flex items-center">
        <button
          type="button"
          onClick={onToggleWatch}
          className={`flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
            watched
              ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-400"
              : "border-border text-muted-foreground hover:text-foreground"
          }`}
        >
          {watched ? "★" : "☆"}
        </button>
      </div>
    </div>
  );
}
