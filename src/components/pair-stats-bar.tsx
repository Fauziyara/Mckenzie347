import { formatUsd, formatNumber, formatPrice } from "@/lib/format";

interface PairStatsData {
  price: string;
  priceSymbol: string;
  marketCapUsd: string;
  liquidityUsd: string;
  volume24h: string;
  holders: number;
}

export function PairStatsBar({ stats }: { stats: PairStatsData }) {
  const items = [
    { label: "Price", value: `${formatPrice(parseFloat(stats.price))} ${stats.priceSymbol}` },
    { label: "Mkt Cap", value: formatUsd(parseFloat(stats.marketCapUsd)) },
    { label: "Liquidity", value: formatUsd(parseFloat(stats.liquidityUsd)) },
    { label: "Volume 24h", value: formatUsd(parseFloat(stats.volume24h)) },
    { label: "Holders", value: formatNumber(stats.holders, 0) },
  ];

  return (
    <div className="grid grid-cols-5 gap-1.5 px-2 py-2 border-b border-border">
      {items.map((s) => (
        <div key={s.label} className="flex flex-col items-center gap-0.5 rounded-md border border-border bg-muted/20 px-2 py-1.5 text-center">
          <span className="text-[10px] uppercase tracking-wide text-muted-foreground">{s.label}</span>
          <span className="text-sm font-semibold tabular-nums">{s.value}</span>
        </div>
      ))}
    </div>
  );
}
