/**
 * Regenerate dense dummy swaps for ALL pairs
 * More swaps, tighter intervals = better chart
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

const pairs = db.prepare(`
  SELECT p.*, 
         t0.decimals as token0_decimals, t0.symbol as token0_symbol,
         t1.decimals as token1_decimals, t1.symbol as token1_symbol
  FROM pairs p
  LEFT JOIN tokens t0 ON p.token0 = t0.address
  LEFT JOIN tokens t1 ON p.token1 = t1.address
`).all() as any[];

console.log(`Found ${pairs.length} pairs`);

// Clear all
db.prepare('DELETE FROM swaps').run();
console.log('Cleared all swaps');

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
  
  const sym0 = (pair.token0_symbol || '').toUpperCase();
  const sym1 = (pair.token1_symbol || '').toUpperCase();
  
  let basePrice: number;
  if (sym0.includes('EURC') && sym1.includes('USDC')) {
    basePrice = 1.368;
  } else if (sym0.includes('USDC') && sym1.includes('USDT')) {
    basePrice = 0.999;
  } else if (sym0.includes('BTC') || sym1.includes('BTC')) {
    basePrice = randomBetween(50000, 70000);
  } else if (sym0.includes('ETH') || sym1.includes('ETH')) {
    basePrice = randomBetween(2500, 4000);
  } else {
    basePrice = randomBetween(0.1, 10);
  }
  
  // Generate 100-200 swaps per pair, every 5-15 minutes
  const numSwaps = Math.floor(randomBetween(100, 200));
  const avgInterval = 10 * 60 * 1000; // 10 minutes average
  
  let swapsAdded = 0;
  let currentTime = now - (numSwaps * avgInterval);
  
  for (let i = 0; i < numSwaps; i++) {
    // Randomize interval 5-15 minutes
    currentTime += randomBetween(5 * 60 * 1000, 15 * 60 * 1000);
    if (currentTime > now) currentTime = now;
    
    const timestamp = Math.floor(currentTime / 1000);
    const blockNumber = 52725000 + Math.floor((now - currentTime) / 1000 / 2);
    
    // Price random walk with momentum
    const trend = randomBetween(-0.0002, 0.0005);
    const noise = randomBetween(-0.015, 0.015);
    const price = basePrice * (1 + trend * i + noise);
    
    // Amount based on price
    let amount0: number, amount1: number;
    if (price > 1000) {
      amount0 = randomBetween(0.01, 0.5);
      amount1 = amount0 * price;
    } else if (price > 1) {
      amount0 = randomBetween(100, 2000);
      amount1 = amount0 * price;
    } else {
      amount0 = randomBetween(10000, 500000);
      amount1 = amount0 * price;
    }
    
    const isBuy = Math.random() > 0.5;
    
    if (isBuy) {
      insert.run(
        generateTxHash(), blockNumber, timestamp,
        generateAddress(), generateAddress(),
        (amount0 * (10 ** dec0)).toFixed(0), '0', '0',
        (amount1 * (10 ** dec1)).toFixed(0),
        pairAddress, 0
      );
    } else {
      const amt1In = randomBetween(100, 2000);
      const amt0Out = amt1In / price;
      insert.run(
        generateTxHash(), blockNumber, timestamp,
        generateAddress(), generateAddress(),
        '0', (amt1In * (10 ** dec1)).toFixed(0),
        (amt0Out * (10 ** dec0)).toFixed(0), '0',
        pairAddress, 0
      );
    }
    swapsAdded++;
  }
  
  totalSwaps += swapsAdded;
  console.log(`  ${sym0}/${sym1}: ${swapsAdded} swaps`);
}

console.log(`\n✅ Total: ${totalSwaps} swaps`);

// Check candles for ACHS
const achs = db.prepare(`
  SELECT COUNT(*) as c FROM swaps 
  WHERE pair_address = '0xd644d3ae8048b968b1c1e270d61493908a8ddc6b'
`).get() as any;
console.log(`ACHS swaps: ${achs.c}`);

db.close();
