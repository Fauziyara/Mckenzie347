export interface Token {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
}

export interface Pair {
  address: string;
  token0: Token;
  token1: Token;
  reserve0: number;
  reserve1: number;
  priceToken0PerToken1: number;
  priceToken1PerToken0: number;
  marketCapUsd: number;
  liquidityUsd: number;
  volume5m: number;
  volume1h: number;
  volume24h: number;
  txCount5m: number;
  txCount1h: number;
  txCount24h: number;
  buys24h: number;
  sells24h: number;
  buyTax: number;
  sellTax: number;
  holders: number;
  creators: number;
  priceChange5m: number;
  priceChange1h: number;
  priceChange24h: number;
  sparkline: number[];
  createdAt: number;
  syncedAt: number;
  factory: string;
  // Token info panel
  top10Pct: number;
  devPct: number;
  sniperPct: number;
  insiderPct: number;
  bundlerPct: number;
  lpLockedPct: number;
  lpBurnedPct: number;
  tokenBurnedPct: number;
  // Chart data
  ohlcv: Candle[];
  // Swap status
  isSwapReal?: boolean;
}

export interface Candle {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface Swap {
  txHash: string;
  sender: string;
  amount0In: number;
  amount0Out: number;
  amount1In: number;
  amount1Out: number;
  blockNumber: number;
  timestamp: number;
  isBuy: boolean;
  amountUsd: number;
}

export interface TradeEntry {
  id: string;
  ageSec: number;
  type: "buy" | "sell";
  marketCap: number;
  tokenAmount: number;
  amountUsd: number;
  trader: string;
  traderLabel?: "DEV" | "KAMU" | "DILACAK";
}

export interface HolderEntry {
  rank: number;
  address: string;
  amount: number;
  pct: number;
  valueUsd: number;
  label?: string;
}

export const tokens = {
  ARC: { address: "0xarc0000000000000000000000000000000000001", name: "Arc", symbol: "ARC", decimals: 18 },
  USDC: { address: "0xarc0000000000000000000000000000000000002", name: "USD Coin", symbol: "USDC", decimals: 6 },
  WETH: { address: "0xarc0000000000000000000000000000000000003", name: "Wrapped Ether", symbol: "WETH", decimals: 18 },
  WBTC: { address: "0xarc0000000000000000000000000000000000004", name: "Wrapped BTC", symbol: "WBTC", decimals: 8 },
  DAI: { address: "0xarc0000000000000000000000000000000000005", name: "Dai Stablecoin", symbol: "DAI", decimals: 18 },
  TEST: { address: "0xarc0000000000000000000000000000000000006", name: "TestToken", symbol: "TEST", decimals: 18 },
  MOON: { address: "0xarc0000000000000000000000000000000000007", name: "MoonShot", symbol: "MOON", decimals: 9 },
  DEFI: { address: "0xarc0000000000000000000000000000000000008", name: "DeFiToken", symbol: "DEFI", decimals: 18 },
  APE: { address: "0xarc0000000000000000000000000000000000009", name: "ApeToken", symbol: "APE", decimals: 18 },
  WARP: { address: "0xarc0000000000000000000000000000000000010", name: "WarpSpeed", symbol: "WARP", decimals: 18 },
  PEPE: { address: "0xarc0000000000000000000000000000000000011", name: "PepeClone", symbol: "PEPE", decimals: 18 },
  FOMO: { address: "0xarc0000000000000000000000000000000000012", name: "FomoToken", symbol: "FOMO", decimals: 18 },
  DOGE: { address: "0xarc0000000000000000000000000000000000013", name: "DogeClone", symbol: "DOGE", decimals: 18 },
  SHIB: { address: "0xarc0000000000000000000000000000000000014", name: "ShibClone", symbol: "SHIB", decimals: 18 },
  BONK: { address: "0xarc0000000000000000000000000000000000015", name: "BonkClone", symbol: "BONK", decimals: 18 },
  WIF: { address: "0xarc0000000000000000000000000000000000016", name: "DogWifHat", symbol: "WIF", decimals: 18 },
  SOL: { address: "0xarc0000000000000000000000000000000000017", name: "SolClone", symbol: "SOL", decimals: 9 },
  XRP: { address: "0xarc0000000000000000000000000000000000018", name: "XrpClone", symbol: "XRP", decimals: 6 },
  BNB: { address: "0xarc0000000000000000000000000000000000019", name: "BnbClone", symbol: "BNB", decimals: 18 },
  LINK: { address: "0xarc0000000000000000000000000000000000020", name: "LinkClone", symbol: "LINK", decimals: 18 },
  // Real Arc testnet tokens
  USDC_REAL: { address: "0x3600000000000000000000000000000000000000", name: "USD Coin", symbol: "USDC", decimals: 6 },
  EURC_REAL: { address: "0x89B50855Aa3bE2F677cD6303Cec089B5F319D72a", name: "Euro Coin", symbol: "EURC", decimals: 6 },
  USDT_REAL: { address: "0x59125072f5692DdF22c99514805D1232C3999646", name: "Tether USD", symbol: "USDT", decimals: 6 },
};

function genSparkline(base: number, trend: number): number[] {
  const arr: number[] = [];
  let v = base * 0.95;
  for (let i = 0; i < 20; i++) {
    const noise = (Math.random() - 0.5) * base * 0.02;
    v += (trend > 0 ? 1 : -1) * base * 0.002 + noise;
    v = Math.max(v, base * 0.5);
    arr.push(v);
  }
  arr.push(base);
  return arr;
}

function genOHLCV(basePrice: number, change24h: number, count: number = 120): Candle[] {
  const candles: Candle[] = [];
  const now = Math.floor(Date.now() / 1000);
  let price = basePrice * (1 - change24h / 100);
  for (let i = count; i > 0; i--) {
    const open = price;
    const volatility = basePrice * 0.015;
    const close = open + (Math.random() - 0.45) * volatility * 2;
    const high = Math.max(open, close) + Math.random() * volatility;
    const low = Math.min(open, close) - Math.random() * volatility;
    const volume = Math.random() * 50000 + 10000;
    candles.push({
      time: now - i * 60,
      open, high, low, close: Math.max(close, 0.0001),
      volume,
    });
    price = close;
  }
  // last candle = current price
  candles[candles.length - 1].close = basePrice;
  return candles;
}

function makePair(
  address: string,
  token0: Token, token1: Token,
  price: number, liqUsd: number,
  ageMin: number, vol24h: number, tx24h: number,
  mcapUsd: number,
  ch5m: number, ch1h: number, ch24h: number,
  buyTax: number, sellTax: number,
  holders: number,
  top10Pct: number = 0, devPct: number = 0, sniperPct: number = 0,
  insiderPct: number = 0, bundlerPct: number = 0,
  lpLockedPct: number = 0, lpBurnedPct: number = 0, tokenBurnedPct: number = 0,
  isSwapReal: boolean = false,
): Pair {
  const now = Math.floor(Date.now() / 1000);
  const reserve0 = liqUsd / 2 / price;
  const reserve1 = liqUsd / 2;
  const buys = Math.floor(tx24h * 0.55);
  return {
    address,
    token0, token1,
    reserve0, reserve1,
    priceToken0PerToken1: price,
    priceToken1PerToken0: 1 / price,
    marketCapUsd: mcapUsd,
    liquidityUsd: liqUsd,
    volume5m: vol24h * 0.05,
    volume1h: vol24h * 0.15,
    volume24h: vol24h,
    txCount5m: Math.floor(tx24h * 0.05),
    txCount1h: Math.floor(tx24h * 0.15),
    txCount24h: tx24h,
    buys24h: buys,
    sells24h: tx24h - buys,
    buyTax, sellTax,
    holders,
    creators: Math.floor(holders / 4000),
    priceChange5m: ch5m,
    priceChange1h: ch1h,
    priceChange24h: ch24h,
    sparkline: genSparkline(price, ch24h),
    createdAt: now - ageMin * 60,
    syncedAt: now,
    factory: "0xfactory000000000000000000000000000000000001",
    top10Pct, devPct, sniperPct, insiderPct, bundlerPct,
    lpLockedPct, lpBurnedPct, tokenBurnedPct,
    ohlcv: genOHLCV(price, ch24h, 120),
    isSwapReal,
  };
}

export const mockPairs: Pair[] = [
  // === REAL SWAP PAIRS (Arc Testnet - Presto DEX) ===
  makePair("0xpresto000000000000000000000000000000000001", tokens.USDC_REAL, tokens.EURC_REAL, 0.854, 125000, 7200, 89000, 342, 0, 0.01, 0.02, 0.03, 0, 0, 580, 0, 0, 0, 0, 0, 100, 0, 0, true),
  makePair("0xpresto000000000000000000000000000000000002", tokens.EURC_REAL, tokens.USDT_REAL, 1.172, 98000, 7200, 67000, 289, 0, -0.01, 0.01, 0.02, 0, 0, 420, 0, 0, 0, 0, 0, 100, 0, 0, true),
  makePair("0xpresto000000000000000000000000000000000003", tokens.USDC_REAL, tokens.USDT_REAL, 1.001, 156000, 7200, 112000, 456, 0, 0.00, 0.01, 0.01, 0, 0, 720, 0, 0, 0, 0, 0, 100, 0, 0, true),

  makePair("0xpair0010000000000000000000000000000000000001", tokens.WETH, tokens.USDC, 1250000, 3125000, 4320, 850000, 342, 65000000, 0.4, 1.1, 2.3, 0, 0, 9200, 18, 3, 1, 6, 2, 95, 0, 40),
  makePair("0xpair0020000000000000000000000000000000000002", tokens.WETH, tokens.USDC, 180, 459000, 2880, 320000, 198, 280000000, -0.8, -1.2, -3.4, 0, 0, 15400, 22, 0, 0, 4, 1, 100, 0, 30),
  makePair("0xpair0030000000000000000000000000000000000003", tokens.WBTC, tokens.USDC, 2.5, 162500, 1440, 45000, 67, 1100000000, 0.3, 0.9, -2.1, 0, 0, 8800, 15, 0, 0, 3, 0, 90, 5, 25),
  makePair("0xpair0050000000000000000000000000000000000005", tokens.DAI, tokens.USDC, 890000, 890500, 10080, 2100000, 891, 5000000000, 0.01, 0.02, 0.01, 0, 0, 42000, 12, 0, 0, 2, 0, 100, 0, 0),
  makePair("0xpair0120000000000000000000000000000000000012", tokens.WETH, tokens.USDC, 45, 114750, 4320, 78000, 55, 280000000, -0.3, 0.4, 1.2, 0, 0, 15400, 20, 0, 0, 5, 1, 95, 0, 20),

  // Trending up
  makePair("0xpair0040000000000000000000000000000000000004", tokens.MOON, tokens.USDC, 0.0089, 89000, 180, 450000, 1200, 8900000, 12.5, 28.4, 67.3, 0, 0, 5400, 35, 8, 5, 12, 4, 60, 0, 50),
  makePair("0xpair0070000000000000000000000000000000000007", tokens.APE, tokens.USDC, 0.345, 134000, 240, 560000, 890, 34500000, 8.2, 15.6, 42.1, 2, 3, 7800, 28, 5, 3, 9, 3, 70, 0, 35),
  makePair("0xpair0080000000000000000000000000000000000008", tokens.WARP, tokens.USDC, 0.123, 67000, 90, 340000, 670, 12300000, 15.3, 32.1, 89.5, 0, 0, 3200, 42, 12, 8, 15, 6, 50, 0, 45),

  // New pairs (<24h)
  makePair("0xpair0090000000000000000000000000000000000009", tokens.DEFI, tokens.USDC, 0.456, 45000, 45, 230000, 450, 4560000, 5.4, 12.3, 0, 0, 0, 2100, 48, 15, 10, 18, 8, 30, 0, 55),
  makePair("0xpair0100000000000000000000000000000000000010", tokens.PEPE, tokens.USDC, 0.000123, 23000, 15, 89000, 234, 1230000, 22.1, 0, 0, 0, 0, 890, 55, 20, 15, 22, 10, 10, 0, 60),
  makePair("0xpair0110000000000000000000000000000000000011", tokens.FOMO, tokens.USDC, 0.0789, 34000, 30, 156000, 345, 7890000, 18.7, 0, 0, 0, 0, 1500, 52, 18, 12, 20, 9, 20, 0, 50),
  makePair("0xpair0130000000000000000000000000000000000013", tokens.TEST, tokens.USDC, 0.0234, 12000, 5, 45000, 120, 2340000, 45.2, 0, 0, 0, 0, 450, 65, 25, 20, 28, 12, 5, 0, 70),

  // Surging
  makePair("0xpair0140000000000000000000000000000000000014", tokens.DOGE, tokens.USDC, 0.000056, 78000, 320, 670000, 980, 5600000, 18.9, 45.6, 123.4, 0, 0, 6700, 38, 6, 4, 10, 3, 65, 0, 40),
  makePair("0xpair0150000000000000000000000000000000000015", tokens.APE, tokens.USDC, 0.089, 56000, 200, 890000, 1100, 8900000, 22.3, 56.7, 156.7, 1, 2, 4500, 40, 7, 5, 11, 4, 55, 0, 45),

  // Losing
  makePair("0xpair0060000000000000000000000000000000000006", tokens.PEPE, tokens.USDC, 0.000089, 15000, 600, 23000, 45, 890000, -5.6, -12.3, -34.5, 0, 0, 2300, 45, 4, 2, 8, 2, 40, 0, 30),
  makePair("0xpair0160000000000000000000000000000000000016", tokens.FOMO, tokens.USDC, 0.0045, 28000, 400, 45000, 89, 4500000, -8.9, -18.7, -45.6, 3, 5, 1800, 48, 10, 7, 14, 5, 35, 0, 25),
  makePair("0xpair0170000000000000000000000000000000000017", tokens.SHIB, tokens.USDC, 0.089, 89000, 720, 560000, 1200, 89000000, 5.2, 12.4, 28.7, 0, 1, 12300, 25, 3, 2, 7, 3, 80, 0, 35),
  makePair("0xpair0180000000000000000000000000000000000018", tokens.SHIB, tokens.USDC, 0.000012, 45000, 1440, 230000, 890, 12000000, -3.4, -8.1, -22.5, 0, 0, 8900, 32, 5, 3, 9, 2, 60, 0, 30),
  makePair("0xpair0190000000000000000000000000000000000019", tokens.BONK, tokens.USDC, 0.00045, 23000, 180, 89000, 456, 4500000, 12.3, 28.9, 67.2, 0, 0, 3400, 42, 10, 7, 14, 5, 45, 0, 50),
  makePair("0xpair0200000000000000000000000000000000000020", tokens.WIF, tokens.USDC, 1.23, 234000, 360, 890000, 567, 123000000, 8.9, 18.7, 45.3, 0, 0, 6700, 20, 2, 1, 5, 2, 90, 0, 25),
  makePair("0xpair0210000000000000000000000000000000000021", tokens.SOL, tokens.USDC, 89.5, 567000, 2880, 1200000, 2340, 8900000000, 2.1, 5.6, 12.8, 0, 0, 15600, 14, 1, 0, 3, 1, 100, 0, 15),
  makePair("0xpair0220000000000000000000000000000000000022", tokens.XRP, tokens.USDC, 0.567, 178000, 4320, 670000, 1890, 567000000, -0.9, -2.3, -5.6, 0, 0, 21000, 11, 0, 0, 2, 0, 95, 0, 10),
  makePair("0xpair0230000000000000000000000000000000000023", tokens.BNB, tokens.USDC, 312, 445000, 5760, 980000, 1234, 4500000000, 1.2, 3.4, 8.9, 0, 0, 18900, 16, 0, 0, 4, 1, 100, 0, 20),
  makePair("0xpair0240000000000000000000000000000000000024", tokens.LINK, tokens.USDC, 12.3, 289000, 3600, 560000, 890, 1230000000, -1.5, -3.7, -9.2, 0, 0, 13400, 18, 0, 0, 3, 1, 85, 0, 18),
  makePair("0xpair0250000000000000000000000000000000000025", tokens.WIF, tokens.USDC, 0.000089, 67000, 240, 340000, 789, 8900000, 15.6, 34.2, 78.9, 1, 2, 4500, 38, 8, 5, 12, 4, 50, 0, 45),
];

export const lastSyncedAt = Math.floor(Date.now() / 1000);

export function generateMockSwaps(pairAddress: string): Swap[] {
  const pair = mockPairs.find(p => p.address === pairAddress);
  if (!pair) return [];
  const swaps: Swap[] = [];
  const now = Math.floor(Date.now() / 1000);
  const baseBlock = 8552300;
  for (let i = 0; i < 30; i++) {
    const isBuy = Math.random() > 0.45;
    const amountUsd = Math.random() * 500 + 10;
    const tokenAmount = amountUsd / pair.priceToken0PerToken1;
    const baseAmount = amountUsd / pair.priceToken1PerToken0;
    swaps.push({
      txHash: "0x" + Math.random().toString(16).slice(2, 18).padEnd(16, "0") + Math.random().toString(16).slice(2, 18).padEnd(16, "0"),
      sender: "0x" + Math.random().toString(16).slice(2, 12).padEnd(10, "0") + Math.random().toString(16).slice(2, 18).padEnd(16, "0") + Math.random().toString(16).slice(2, 18).padEnd(16, "0"),
      amount0In: isBuy ? 0 : tokenAmount,
      amount0Out: isBuy ? tokenAmount : 0,
      amount1In: isBuy ? baseAmount : 0,
      amount1Out: isBuy ? 0 : baseAmount,
      blockNumber: baseBlock + i,
      timestamp: now - i * Math.floor(Math.random() * 120 + 30),
      isBuy,
      amountUsd,
    });
  }
  return swaps.sort((a, b) => b.timestamp - a.timestamp);
}

export function generateMockCandles(pairAddress: string, count: number): Candle[] {
  const pair = mockPairs.find(p => p.address === pairAddress);
  if (!pair || !pair.ohlcv) return [];
  return pair.ohlcv.slice(-count);
}

export function generateMockTrades(pairAddress: string): TradeEntry[] {
  const pair = mockPairs.find(p => p.address === pairAddress);
  if (!pair) return [];
  const trades: TradeEntry[] = [];
  const now = Math.floor(Date.now() / 1000);
  for (let i = 0; i < 50; i++) {
    const isBuy = Math.random() > 0.42;
    const amountUsd = Math.random() * 500 + 5;
    const tokenAmount = amountUsd / pair.priceToken0PerToken1;
    const label = Math.random() > 0.95 ? "DEV" : Math.random() > 0.92 ? "DILACAK" : undefined;
    trades.push({
      id: `trade-${i}`,
      ageSec: Math.floor(Math.random() * 3600) + i * 5,
      type: isBuy ? "buy" : "sell",
      marketCap: pair.marketCapUsd * (1 + (Math.random() - 0.5) * 0.05),
      tokenAmount,
      amountUsd,
      trader: "0x" + Math.random().toString(16).slice(2, 8) + "..." + Math.random().toString(16).slice(2, 6),
      traderLabel: label as any,
    });
  }
  return trades.sort((a, b) => a.ageSec - b.ageSec);
}

export function generateMockHolders(pairAddress: string): HolderEntry[] {
  const pair = mockPairs.find(p => p.address === pairAddress);
  if (!pair) return [];
  const holders: HolderEntry[] = [];
  let remaining = 100;
  for (let i = 0; i < 20; i++) {
    const pct = i === 0 ? pair.top10Pct / 2 : Math.min(remaining * 0.15, pair.top10Pct / 10 * Math.random() + 0.5);
    const amount = (pct / 100) * 1e9;
    remaining -= pct;
    holders.push({
      rank: i + 1,
      address: "0x" + Math.random().toString(16).slice(2, 8) + "..." + Math.random().toString(16).slice(2, 6),
      amount,
      pct: Math.min(pct, remaining + pct),
      valueUsd: (pct / 100) * pair.marketCapUsd,
      label: i === 0 ? "DEV" : i === 1 ? "Bundler" : undefined,
    });
  }
  return holders;
}
