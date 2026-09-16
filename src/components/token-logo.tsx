import React from "react";

// Crypto icon image URLs — GitHub CDN first, CoinCap fallback
const CRYPTO_ICONS: Record<string, string> = {
  ETH: "https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/eth.png",
  SOL: "https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/sol.png",
  LINK: "https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/link.png",
  DOGE: "https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/doge.png",
  AVAX: "https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/avax.png",
  BNB: "https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/bnb.png",
  XRP: "https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/xrp.png",
  USDC: "https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/usdc.png",
  USDT: "https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/usdt.png",
  DAI: "https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/dai.png",
  WETH: "https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/weth.png",
  WBTC: "https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/wbtc.png",
  // CoinCap CDN for tokens not in GitHub repo
  ARB: "https://assets.coincap.io/assets/icons/arb@2x.png",
  PEPE: "https://assets.coincap.io/assets/icons/pepe@2x.png",
  WIF: "https://assets.coincap.io/assets/icons/wif@2x.png",
  SUI: "https://assets.coincap.io/assets/icons/sui@2x.png",
  APT: "https://assets.coincap.io/assets/icons/apt@2x.png",
  NEAR: "https://assets.coincap.io/assets/icons/near@2x.png",
  // Arc testnet tokens — local PNG
  EURC: "/tokens/eurc.png",
  CIRBTC: "/tokens/cirbtc.svg",
  cirBTC: "/tokens/cirbtc.svg",
  MOG: "/tokens/mog.png",
  mog: "/tokens/mog.png",
  SYN: "/tokens/syn.png",
};

// Fallback chain: GitHub → CoinCap → gradient
const COINCAP_FALLBACK: Record<string, string> = {
  ETH: "https://assets.coincap.io/assets/icons/eth@2x.png",
  SOL: "https://assets.coincap.io/assets/icons/sol@2x.png",
  LINK: "https://assets.coincap.io/assets/icons/link@2x.png",
  DOGE: "https://assets.coincap.io/assets/icons/doge@2x.png",
  AVAX: "https://assets.coincap.io/assets/icons/avax@2x.png",
  BNB: "https://assets.coincap.io/assets/icons/bnb@2x.png",
  XRP: "https://assets.coincap.io/assets/icons/xrp@2x.png",
  USDC: "https://assets.coincap.io/assets/icons/usdc@2x.png",
  USDT: "https://assets.coincap.io/assets/icons/usdt@2x.png",
};

const TOKEN_COLORS: Record<string, string> = {
  ARC: "from-emerald-500 to-emerald-700",
  USDC: "from-blue-500 to-blue-700",
  WUSDC: "from-blue-500 to-blue-700",
  wUSDC: "from-blue-500 to-blue-700",
  WETH: "from-violet-500 to-violet-700",
  WBTC: "from-amber-500 to-orange-700",
  cirBTC: "from-amber-500 to-orange-700",
  DAI: "from-yellow-400 to-yellow-600",
  TEST: "from-gray-500 to-gray-700",
  MOON: "from-purple-500 to-pink-600",
  DEFI: "from-cyan-500 to-teal-600",
  APE: "from-orange-500 to-red-600",
  APEPE: "from-orange-500 to-red-600",
  WARP: "from-indigo-500 to-purple-600",
  PEPE: "from-green-500 to-lime-600",
  FOMO: "from-red-500 to-rose-700",
  DOGE: "from-yellow-500 to-amber-600",
  SHIB: "from-orange-400 to-red-500",
  BONK: "from-amber-400 to-orange-600",
  WIF: "from-pink-500 to-fuchsia-600",
  SOL: "from-teal-400 to-cyan-600",
  solXC: "from-teal-400 to-cyan-600",
  XRP: "from-slate-400 to-slate-600",
  BNB: "from-yellow-400 to-amber-500",
  LINK: "from-blue-400 to-indigo-600",
  EURC: "from-blue-500 to-blue-700",
  Circle: "from-blue-500 to-blue-700",
  USDT: "from-green-500 to-emerald-700",
  SYN: "from-purple-500 to-pink-600",
  SY: "from-purple-500 to-pink-600",
  BULLY: "from-red-500 to-rose-700",
  AWE: "from-cyan-500 to-teal-600",
  mog: "from-green-500 to-lime-600",
  CAT: "from-orange-400 to-amber-600",
  KITTY: "from-pink-400 to-rose-600",
  JAY: "from-indigo-500 to-purple-600",
  JEN: "from-purple-400 to-pink-600",
  PI: "from-emerald-400 to-teal-600",
  REX: "from-red-500 to-orange-700",
  MM: "from-slate-500 to-slate-700",
  AVN: "from-red-500 to-rose-700",
  USF: "from-emerald-500 to-teal-700",
  AD: "from-orange-500 to-red-600",
  CB: "from-blue-400 to-indigo-600",
  ST: "from-gray-400 to-slate-600",
  TTY: "from-pink-400 to-purple-600",
  ARCT: "from-emerald-500 to-teal-700",
  ARCHT: "from-emerald-500 to-teal-700",
  ARCDICT: "from-indigo-500 to-purple-700",
  DEMO: "from-gray-500 to-gray-700",
  HENRY: "from-amber-500 to-red-600",
  LACHESIS: "from-red-500 to-rose-700",
  QUINN: "from-violet-500 to-purple-700",
  JADEN: "from-cyan-500 to-blue-700",
  ETH: "from-violet-500 to-violet-700",
  ARB: "from-blue-400 to-blue-700",
  SUI: "from-cyan-400 to-blue-600",
  APT: "from-slate-400 to-slate-700",
  AVAX: "from-red-500 to-orange-600",
  NEAR: "from-emerald-400 to-teal-600",
};

// Generate deterministic color from symbol hash
function hashColor(symbol: string): string {
  let hash = 0;
  for (let i = 0; i < symbol.length; i++) {
    hash = ((hash << 5) - hash) + symbol.charCodeAt(i);
    hash |= 0;
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 65%, 45%)`;
}

export function TokenLogo({ symbol, size = 24 }: { symbol: string; size?: number }) {
  const iconUrl = CRYPTO_ICONS[symbol?.toUpperCase()];
  const gradient = TOKEN_COLORS[symbol];
  const initials = symbol?.slice(0, 2).toUpperCase() || "??";
  const fontSize = Math.max(8, Math.floor(size * 0.34));

  // If we have a real crypto icon URL, render <img>
  if (iconUrl) {
    const fallbackUrl = COINCAP_FALLBACK[symbol?.toUpperCase()];
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={iconUrl}
        alt={symbol}
        width={size}
        height={size}
        className="shrink-0 rounded-full border border-white/10"
        style={{ width: size, height: size }}
        onError={(e) => {
          const target = e.currentTarget;
          if (fallbackUrl && target.src !== fallbackUrl) {
            // Try CoinCap fallback first
            target.src = fallbackUrl;
          } else {
            // Final fallback: gradient circle with initials
            target.style.display = "none";
            const parent = target.parentElement;
            if (parent) {
              parent.innerHTML = `<div class="flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${gradient || ""} font-bold text-white border border-white/10" style="width:${size}px;height:${size}px;font-size:${fontSize}px">${initials}</div>`;
            }
          }
        }}
      />
    );
  }

  if (gradient) {
    return (
      <div
        className={`flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${gradient} font-bold text-white border border-white/10`}
        style={{ width: size, height: size, fontSize }}
      >
        {initials}
      </div>
    );
  }

  // Fallback: solid color from hash
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-full font-bold text-white border border-white/10"
      style={{
        width: size,
        height: size,
        fontSize,
        background: hashColor(symbol),
      }}
    >
      {initials}
    </div>
  );
}
