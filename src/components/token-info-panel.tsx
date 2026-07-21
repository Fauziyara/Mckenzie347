import React from "react";

interface TokenInfoPanelProps {
  holders?: number;
  top10HoldersPct?: number;
  devHoldingsPct?: number;
  sniperHoldingsPct?: number;
  insidersPct?: number;
  bundlersPct?: number;
  renounced?: boolean;
  lpBurnedPct?: number;
  lpLockedPct?: number;
  tokenBurnPct?: number;
  proTraders?: number;
  feesPaid?: number;
  tokenAddress?: string;
  devAddress?: string;
  poolAddress?: string;
  quoteAddress?: string;
  txnAddress?: string;
  price?: string;
  marketCapUsd?: string;
  liquidityUsd?: string;
  volume24h?: string;
  priceSymbol?: string;
}

function StatIcon({ name, className }: { name: string; className?: string }) {
  const props = {
    className,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  switch (name) {
    case "persons":
      return (<svg {...props}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 0 8 4 4 0 0 0 0-8M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></svg>);
    case "code":
      return (<svg {...props}><path d="M16 18l6-6-6-6M8 6l-6 6 6 6" /></svg>);
    case "target":
      return (<svg {...props}><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></svg>);
    case "at":
      return (<svg {...props}><path d="M12 2a10 10 0 1 0 0 20M16 8v8M12 8h4" /></svg>);
    case "box":
      return (<svg {...props}><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /></svg>);
    case "shield":
      return (<svg {...props}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>);
    case "flame":
      return (<svg {...props}><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" /></svg>);
    case "lock":
      return (<svg {...props}><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>);
    case "person":
      return (<svg {...props}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" /></svg>);
    case "chart":
      return (<svg {...props}><path d="M3 3v18h18" /><path d="M7 14l4-4 4 4 6-6" /></svg>);
    case "dollar":
      return (<svg {...props}><path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>);
    case "gas":
      return (<svg {...props}><path d="M3 22h12V4l-4-2H3v20zM15 8l3 3v9a2 2 0 0 1-2 2" /></svg>);
    case "refresh":
      return (<svg {...props}><path d="M23 4v6h-6M1 20v-6h6" /><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" /></svg>);
    case "chevron":
      return (<svg {...props}><path d="M6 9l6 6 6-6" /></svg>);
    case "copy":
      return (<svg {...props}><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>);
    default:
      return null;
  }
}

export function TokenInfoPanel({
  holders = 9000,
  top10HoldersPct = 14,
  devHoldingsPct = 0,
  sniperHoldingsPct = 0,
  insidersPct = 17,
  bundlersPct = 11,
  renounced = false,
  lpBurnedPct = 0,
  lpLockedPct = 0,
  tokenBurnPct = 0,
  proTraders = 2300,
  feesPaid = 21.51,
  tokenAddress = "0xb2000000...b301",
  devAddress = "0xd8ba9e58...4a28",
  poolAddress = "0x02f924e1...0013",
  quoteAddress = "0x00000000...0000",
  txnAddress = "0xa67f3d4d...4e7d",
  price = "0.023400",
  priceSymbol = "ARC",
  marketCapUsd = "$2.34M",
  liquidityUsd = "$12.0K",
  volume24h = "$45.0K",
}: TokenInfoPanelProps = {}) {
  const stats = [
    { label: "Top 10 H.", value: top10HoldersPct + "%", icon: "persons", danger: top10HoldersPct > 10 },
    { label: "Dev H.", value: devHoldingsPct + "%", icon: "code", good: devHoldingsPct <= 5 },
    { label: "Snipers H.", value: sniperHoldingsPct + "%", icon: "target", danger: sniperHoldingsPct > 5 },
    { label: "Insiders", value: insidersPct + "%", icon: "at", danger: insidersPct > 10 },
    { label: "Bundlers", value: bundlersPct + "%", icon: "box", danger: bundlersPct > 5 },
    { label: "Renounced", value: renounced ? "Yes" : "\u2014", icon: "shield", good: renounced },
    { label: "LP Burned", value: lpBurnedPct + "%", icon: "flame", danger: lpBurnedPct === 0, good: lpBurnedPct > 50 },
    { label: "LP Locked", value: lpLockedPct + "%", icon: "lock", danger: lpLockedPct === 0, good: lpLockedPct > 50 },
    { label: "Token Burn", value: tokenBurnPct.toFixed(1) + "%", icon: "flame" },
  ];

  const earlyBuyers = [
    { label: "TOKEN", addr: tokenAddress },
    { label: "DEV", addr: devAddress },
    { label: "POOL", addr: poolAddress },
    { label: "QUOTE", addr: quoteAddress },
    { label: "TXN", addr: txnAddress },
  ];

  const colorFor = (s: typeof stats[0]) => {
    if (s.danger) return "text-red-400";
    if (s.good) return "text-emerald-400";
    return "text-foreground";
  };
  const iconColorFor = (s: typeof stats[0]) => {
    if (s.danger) return "text-red-400";
    if (s.good) return "text-emerald-400";
    return "text-muted-foreground";
  };

  return (
    <div className="rounded-lg border border-border bg-card">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border">
        <div className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <StatIcon name="chevron" className="h-3 w-3" />
          Token Info
        </div>
        <StatIcon name="refresh" className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground cursor-pointer" />
      </div>

      {/* Stats Grid 3 columns - each metric in a bordered box */}
      <div className="grid grid-cols-3 gap-1.5 p-2">
        {stats.map((s) => (
          <div key={s.label} className="flex flex-col items-center gap-1 rounded-md border border-border bg-muted/20 px-1.5 py-2 text-center">
            <StatIcon name={s.icon} className={"h-4 w-4 " + iconColorFor(s)} />
            <span className={"text-sm font-semibold tabular-nums " + colorFor(s)}>{s.value}</span>
            <span className="text-[10px] text-muted-foreground leading-tight">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Holders / Pro Traders / Paid / Fees - each in a bordered box */}
      <div className="grid grid-cols-2 gap-1.5 px-2 pb-2">
        <div className="flex items-center gap-1.5 rounded-md border border-border bg-muted/20 px-2 py-1.5 text-xs">
          <StatIcon name="person" className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          <span className="font-medium text-foreground">{(holders / 1000).toFixed(1)}K</span>
          <span className="text-muted-foreground">Holders</span>
        </div>
        <div className="flex items-center gap-1.5 rounded-md border border-border bg-muted/20 px-2 py-1.5 text-xs">
          <StatIcon name="chart" className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          <span className="font-medium text-foreground">{(proTraders / 1000).toFixed(1)}K</span>
          <span className="text-muted-foreground">Pro Traders</span>
        </div>
        <div className="flex items-center gap-1.5 rounded-md border border-border bg-muted/20 px-2 py-1.5 text-xs">
          <StatIcon name="dollar" className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
          <span className="font-medium text-emerald-400">Paid</span>
          <span className="text-muted-foreground">Dex Paid</span>
        </div>
        <div className="flex items-center gap-1.5 rounded-md border border-border bg-muted/20 px-2 py-1.5 text-xs">
          <StatIcon name="gas" className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          <span className="font-medium text-foreground">{feesPaid}</span>
          <span className="text-muted-foreground">Fees Paid</span>
        </div>
      </div>

      {/* Early Buyers Section */}
      <div className="border-t border-border px-3 py-2">
        <div className="mb-2 flex items-center gap-1 text-xs font-medium text-muted-foreground">
          <StatIcon name="chart" className="h-3.5 w-3.5" />
          View Early Buyers
        </div>
        <div className="space-y-1">
          {earlyBuyers.map((eb) => (
            <div key={eb.label} className="flex items-center justify-between gap-2 rounded-md border border-border bg-muted/20 px-2 py-1">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="text-[10px] font-semibold text-muted-foreground shrink-0">{eb.label}</span>
                <span className="font-mono text-[10px] text-muted-foreground truncate">{eb.addr}</span>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button className="text-muted-foreground hover:text-foreground" title="Copy">
                  <StatIcon name="copy" className="h-3 w-3" />
                </button>
                <button className="text-blue-400 hover:text-blue-300" title="Chart">
                  <StatIcon name="chart" className="h-3 w-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Token Banner Section */}
      <div className="border-t border-border px-3 py-2">
        <div className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
          <StatIcon name="chevron" className="h-3 w-3" />
          Token Banner
        </div>
        <div className="mt-1 text-xs text-muted-foreground italic">Token has no banner</div>
      </div>
    </div>
  );
}