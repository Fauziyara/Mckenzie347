/**
 * API Route: /api/markets
 * Returns crypto pairs with real-time data from CoinGecko + Arc testnet indexer
 * Includes: price, volume 24h, change 24h, market cap, tx count from Arc indexer
 */

import { NextRequest, NextResponse } from "next/server";

const COINGECKO_IDS: Record<string, { cgId: string; arcSymbols: string[] }> = {
  BTC: { cgId: "bitcoin", arcSymbols: ["cirBTC"] },
  ETH: { cgId: "ethereum", arcSymbols: ["ETH"] },
  SOL: { cgId: "solana", arcSymbols: ["solXC"] },
  LINK: { cgId: "chainlink", arcSymbols: ["LINK"] },
  ARB: { cgId: "arbitrum", arcSymbols: ["ARB"] },
  DOGE: { cgId: "dogecoin", arcSymbols: ["DOGE"] },
  PEPE: { cgId: "pepe", arcSymbols: ["APEPE"] },
  WIF: { cgId: "wif-coin", arcSymbols: ["WIF"] },
  SUI: { cgId: "sui", arcSymbols: ["SUI"] },
  APT: { cgId: "aptos", arcSymbols: ["APT"] },
  AVAX: { cgId: "avalanche-2", arcSymbols: ["AVAX"] },
  BNB: { cgId: "binancecoin", arcSymbols: ["BNB"] },
  XRP: { cgId: "ripple", arcSymbols: ["XRP"] },
  NEAR: { cgId: "near", arcSymbols: ["NEAR"] },
};

// Arc testnet native pairs — map to CoinGecko for real-time pricing
// cirBTC tracks BTC 1:1, so use BTC price from CoinGecko
const ARC_PAIRS: { symbol: string; name: string; peggedTo?: string; basePrice: number }[] = [
  { symbol: "cirBTC", name: "Circle BTC", peggedTo: "bitcoin", basePrice: 64500 },
  { symbol: "EURC", name: "Euro Coin", basePrice: 1.08 },

];

export async function GET(req: NextRequest) {
  try {
    const ids = Object.values(COINGECKO_IDS).map(t => t.cgId).join(",");
    const cgUrl = `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_vol=true&include_24hr_change=true&include_market_cap=true`;

    const cgRes = await fetch(cgUrl, {
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(3000),
      headers: { "Accept": "application/json" },
    }).catch(() => null);

    let cgData: any = {};
    if (cgRes && cgRes.ok) {
      cgData = await cgRes.json();
    } else {
      // CoinGecko unavailable — use static fallback prices
      cgData = {
        bitcoin: { usd: 64500, usd_24h_vol: 30e9, usd_24h_change: 0.5, usd_market_cap: 1.3e12 },
        ethereum: { usd: 3200, usd_24h_vol: 15e9, usd_24h_change: 0.3, usd_market_cap: 380e9 },
        solana: { usd: 145, usd_24h_vol: 3e9, usd_24h_change: 1.2, usd_market_cap: 65e9 },
        ripple: { usd: 0.62, usd_24h_vol: 1e9, usd_24h_change: -0.5, usd_market_cap: 35e9 },
        binancecoin: { usd: 585, usd_24h_vol: 2e9, usd_24h_change: 0.8, usd_market_cap: 85e9 },
        dogecoin: { usd: 0.12, usd_24h_vol: 1e9, usd_24h_change: 2.1, usd_market_cap: 17e9 },
        chainlink: { usd: 14.5, usd_24h_vol: 400e6, usd_24h_change: -0.3, usd_market_cap: 8.5e9 },
        near: { usd: 5.2, usd_24h_vol: 300e6, usd_24h_change: 4.9, usd_market_cap: 5.5e9 },
        "avalanche-2": { usd: 27, usd_24h_vol: 500e6, usd_24h_change: 0.9, usd_market_cap: 10e9 },
        sui: { usd: 0.69, usd_24h_vol: 200e6, usd_24h_change: 0.2, usd_market_cap: 1.6e9 },
        arbitrum: { usd: 0.78, usd_24h_vol: 300e6, usd_24h_change: 1.1, usd_market_cap: 3e9 },
        pepe: { usd: 0.0000085, usd_24h_vol: 800e6, usd_24h_change: 0.6, usd_market_cap: 3.5e9 },
      };
    }

    // Fetch Arc indexer swap counts + pair data
    let arcSwaps: Record<string, number> = {};
    let arcPrices: Record<string, { price: number; volume: number; change: number }> = {};
    try {
      const arcRes = await fetch("http://localhost:3000/api/indexer/pairs?limit=200", {
        next: { revalidate: 30 },
        signal: AbortSignal.timeout(3000),
      }).catch(() => null);
      if (!arcRes) throw new Error("arc unavailable");
      const arcData = await arcRes.json();
      if (arcData.success) {
        for (const p of arcData.pairs) {
          const s0 = (p.token0_symbol || "").toLowerCase();
          const s1 = (p.token1_symbol || "").toLowerCase();
          const swaps = p.total_swaps || 0;

          // Match CoinGecko pairs
          for (const [symbol, config] of Object.entries(COINGECKO_IDS)) {
            for (const arcSym of config.arcSymbols) {
              if (s0 === arcSym.toLowerCase() || s1 === arcSym.toLowerCase()) {
                arcSwaps[symbol] = (arcSwaps[symbol] || 0) + swaps;
              }
            }
          }

          // Match Arc native pairs
          for (const ap of ARC_PAIRS) {
            if (s0 === ap.symbol.toLowerCase() || s1 === ap.symbol.toLowerCase()) {
              const swapCount = arcSwaps[ap.symbol] || 0;
              arcSwaps[ap.symbol] = swapCount + swaps;

              if (!arcPrices[ap.symbol]) {
                const priceRaw = Number(p.priceToken0PerToken1 || p.priceToken1PerToken0 || 0);
                const vol = Number(p.total_volume0 || 0) / Math.pow(10, p.token0_decimals || 6);
                if (priceRaw > 0) {
                  arcPrices[ap.symbol] = { price: priceRaw, volume: vol, change: 0 };
                }
              }
            }
          }
        }
      }
    } catch (e) {
      // Arc indexer not critical, continue without it
    }

    // Build CoinGecko markets
    const cgMarkets = Object.entries(COINGECKO_IDS).filter(([symbol]) => symbol !== "BTC").map(([symbol, config]) => {
      const cg = cgData[config.cgId] || {};
      const price = cg.usd || 0;
      const volume24h = cg.usd_24h_vol || 0;
      const change24h = cg.usd_24h_change || 0;
      const marketCap = cg.usd_market_cap || 0;
      const txCount = arcSwaps[symbol] || 0;

      return {
        id: `${symbol.toLowerCase()}-usdc`,
        pair: `${symbol}/USDC`,
        baseAsset: symbol,
        quoteAsset: "USDC",
        price,
        change24h,
        volume24h,
        marketCap,
        txCount,
      };
    });

    // Build Arc native markets
    // cirBTC uses real-time BTC price from CoinGecko (pegged 1:1 to BTC)
    const arcMarkets = ARC_PAIRS.map((ap) => {
      const txCount = arcSwaps[ap.symbol] || 0;
      let price = ap.basePrice;
      let change24h = 0;
      let volume24h = 0;
      let marketCap = 0;

      // If pegged to a CoinGecko asset, use its real-time data
      if (ap.peggedTo) {
        // Try direct cgId lookup first (e.g. "bitcoin" for cirBTC)
        const cg = cgData[ap.peggedTo] || {};
        price = cg.usd || ap.basePrice;
        change24h = cg.usd_24h_change || 0;
        volume24h = cg.usd_24h_vol || 0;
        marketCap = cg.usd_market_cap || 0;
      }

      return {
        id: `${ap.symbol.toLowerCase()}-usdc`,
        pair: `${ap.symbol}/USDC`,
        baseAsset: ap.symbol,
        quoteAsset: "USDC",
        price,
        change24h,
        volume24h,
        marketCap,
        txCount,
      };
    });

    return NextResponse.json({ success: true, markets: [...arcMarkets, ...cgMarkets] });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
