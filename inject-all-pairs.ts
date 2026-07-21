/**
 * Inject dummy swaps for ALL pairs
 * Run: npx tsx inject-all-pairs.ts
 */

import Database from 'better-sqlite3';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data', 'arc-indexer.db');
const db = new Database(DB_PATH);

function randomBetween(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

function generateTxHash(): string {
  return '0x' + Array.from({ length: 64 }, () => 
    Math.floor(Math.random() * 16).toString(16)
  ).join('');
}

function generateAddress(): string {
  return '0x' + Array.from({ length: 40 }, () => 
    Math.floor(Math.random() * 16).toString(16)
  ).join('');
}

// Get all pairs with their tokens
const pairs = db.prepare(`
  SELECT p.*, 
         t0.decimals as token0_decimals, t0.symbol as token0_symbol,
         t1.decimals as token1_decimals, t1.symbol as token1_symbol
  FROM pairs p
  LEFT JOIN tokens t0 ON p.token0 = t0.address
  LEFT JOIN tokens t1 ON p.token1 = t1.address
`).all() as any[];

console.log(`Found ${pairs.length} pairs`);

// Clear all existing swaps
db.prepare('DELETE FROM swaps').run();
console.log('Cleared all existing swaps');

const insert = db.prepare(`
  INSERT INTO swaps 
  (tx_hash, block_number, timestamp, sender, recipient, amount0_in, amount1_in, amount0_out, amount1_out, pair_address, log_index)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const now = Date.now();
let totalSwaps = 0;

for (const pair of pairs) {
  const pairAddress = pair.address;
  const dec0 = pair.token0_decimals || 18;
  const dec1 = pair.token1_decimals || 18;
  
  // Determine base price based on pair type
  let basePrice: number;
  const sym0 = (pair.token0_symbol || '').toUpperCase();
  const sym1 = (pair.token1_symbol || '').toUpperCase();
  
  if (sym0.includes('EURC') && sym1.includes('USDC')) {
    basePrice = 1.368; // EURC/WUSDC
  } else if (sym0.includes('USDC') && sym1.includes('USDT')) {
    basePrice = 0.999; // Stablecoin pair
  } else if (sym0.includes('BTC') || sym1.includes('BTC')) {
    basePrice = randomBetween(50000, 70000); // BTC pair
  } else if (sym0.includes('ETH') || sym1.includes('ETH')) {
    basePrice = randomBetween(2500, 4000); // ETH pair
  } else {
    // Random price for other pairs
    basePrice = randomBetween(0.1, 10);
  }
  
  // Generate 24-72 swaps per pair (last 12-36 hours)
  const numSwaps = Math.floor(randomBetween(24, 72));
  const intervalMs = (48 * 60 * 60 * 1000) / numSwaps; // Spread over 48 hours
  
  let swapsAdded = 0;
  
  for (let i = 0; i < numSwaps; i++) {
    const timestamp = now - (numSwaps - i) * intervalMs;
    const blockNumber = 52725000 + Math.floor(i * randomBetween(5, 15));
    
    // Price with random walk (slight trend + noise)
    const trend = randomBetween(-0.0003, 0.0008) * i;
    const noise = randomBetween(-0.02, 0.02);
    const price = basePrice * (1 + trend + noise);
    
    // Random amount (scaled based on price)
    let amount0: number, amount1: number;
    
    if (price > 1000) {
      // High price pair (BTC, ETH) - smaller amounts
      amount0 = randomBetween(0.01, 0.5);
      amount1 = amount0 * price;
    } else if (price > 1) {
      // Medium price
      amount0 = randomBetween(100, 2000);
      amount1 = amount0 * price;
    } else {
      // Low price (meme coins) - larger amounts
      amount0 = randomBetween(10000, 1000000);
      amount1 = amount0 * price;
    }
    
    const isBuy = Math.random() > 0.5;
    
    if (isBuy) {
      insert.run(
        generateTxHash(),
        blockNumber,
        Math.floor(timestamp / 1000),
        generateAddress(),
        generateAddress(),
        (amount0 * (10 ** dec0)).toFixed(0),
        '0',
        '0',
        (amount1 * (10 ** dec1)).toFixed(0),
        pairAddress,
        0
      );
    } else {
      // For sell, calculate reverse
      const amt1In = randomBetween(100, 2000);
      const amt0Out = amt1In / price;
      
      insert.run(
        generateTxHash(),
        blockNumber,
        Math.floor(timestamp / 1000),
        generateAddress(),
        generateAddress(),
        '0',
        (amt1In * (10 ** dec1)).toFixed(0),
        (amt0Out * (10 ** dec0)).toFixed(0),
        '0',
        pairAddress,
        0
      );
    }
    
    swapsAdded++;
  }
  
  totalSwaps += swapsAdded;
  console.log(`  ${sym0}/${sym1}: ${swapsAdded} swaps (base price ~${basePrice.toFixed(4)})`);
}

console.log(`\n✅ Total: ${totalSwaps} swaps across ${pairs.length} pairs`);

// Verify
const total = db.prepare('SELECT COUNT(*) as c FROM swaps').get() as any;
console.log(`   DB total: ${total.c}`);

// Show sample prices for a few pairs
console.log('\nSample prices:');
const sample = db.prepare(`
  SELECT s.pair_address, t0.symbol, t1.symbol,
         CASE 
           WHEN CAST(s.amount0_in AS REAL) > 0 
           THEN CAST(s.amount1_out AS REAL) / CAST(s.amount0_in AS REAL) * (10.0 / 1e18)
           ELSE CAST(s.amount1_in AS REAL) / CAST(s.amount0_out AS REAL) / (10.0 / 1e18)
         END as price
  FROM swaps s
  JOIN pairs p ON s.pair_address = p.address
  LEFT JOIN tokens t0 ON p.token0 = t0.address
  LEFT JOIN tokens t1 ON p.token1 = t1.address
  WHERE price > 0
  GROUP BY s.pair_address
  LIMIT 5
`).all() as any[];

sample.forEach((s: any) => {
  console.log(`  ${s.symbol0}/${s.symbol1}: ~${s.price?.toFixed(6) || 'N/A'}`);
});

db.close();
