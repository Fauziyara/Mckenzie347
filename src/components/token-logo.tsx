import React from "react";

const TOKEN_COLORS: Record<string, string> = {
  ARC: "from-emerald-500 to-emerald-700",
  USDC: "from-blue-500 to-blue-700",
  WETH: "from-violet-500 to-violet-700",
  WBTC: "from-amber-500 to-orange-700",
  DAI: "from-yellow-400 to-yellow-600",
  TEST: "from-gray-500 to-gray-700",
  MOON: "from-purple-500 to-pink-600",
  DEFI: "from-cyan-500 to-teal-600",
  APE: "from-orange-500 to-red-600",
  WARP: "from-indigo-500 to-purple-600",
  PEPE: "from-green-500 to-lime-600",
  FOMO: "from-red-500 to-rose-700",
  DOGE: "from-yellow-500 to-amber-600",
  SHIB: "from-orange-400 to-red-500",
  BONK: "from-amber-400 to-orange-600",
  WIF: "from-pink-500 to-fuchsia-600",
  SOL: "from-teal-400 to-cyan-600",
  XRP: "from-slate-400 to-slate-600",
  BNB: "from-yellow-400 to-amber-500",
  LINK: "from-blue-400 to-indigo-600",
  EURC: "from-blue-500 to-blue-700",
  USDT: "from-green-500 to-emerald-700",
};

export function TokenLogo({ symbol, size = 24 }: { symbol: string; size?: number }) {
  const gradient = TOKEN_COLORS[symbol] || "from-gray-500 to-gray-700";
  const initials = symbol.slice(0, 2);
  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${gradient} font-bold text-background`}
      style={{ width: size, height: size, fontSize: size * 0.36 }}
    >
      {initials}
    </div>
  );
}
