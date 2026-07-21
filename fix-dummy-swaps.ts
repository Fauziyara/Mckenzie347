/**
 * Fix dummy swaps - regenerate with proper amounts
 */

import Database from 'better-sqlite3';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data', 'arc-indexer.db');
const db = new Database(DB_PATH);

const PAIR_ADDRESS = '0xfa61e1de61daf2ef4d8d9bad4b99fa21c8efab8a';
const TOKEN0_DECIMALS = 6;
const TOKEN1_DECIMALS = 18;
const BASE_PRICE = 1.368;

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

// Clear existing dummy swaps
db.prepare('DELETE FROM swaps WHERE pair_address = ?').run(PAIR_ADDRESS);
console.log('Cleared old dummy swaps');

// Generate new swaps for last 24 hours (every 30 min)
const now = Date.now();
const swaps = [];

for (let i = 0; i < 48; i++) {
  const timestamp = now - (48 - i) * 30 * 60 * 1000;
  const blockNumber = 52725000 + i * 10;
  
  // Random price movement (±2%)
  const priceChange = randomBetween(-0.02, 0.02);
  const price = BASE_PRICE * (1 + priceChange);
  
  // Random EURC amount (100 - 5000)
  const eurcAmount = randomBetween(100, 5000);
  const wusdcAmount = eurcAmount * price;
  
  // Alternate: even = buy WUSDC with EURC, odd = sell WUSDC for EURC
  const isBuy = i % 2 === 0;
  
  swaps.push({
    tx_hash: generateTxHash(),
    block_number: blockNumber,
    timestamp: Math.floor(timestamp / 1000),
    sender: generateAddress(),
    recipient: generateAddress(),
    amount0_in: isBuy ? (eurcAmount * (10 ** TOKEN0_DECIMALS)).toFixed(0) : '0',
    amount1_in: isBuy ? '0' : (wusdcAmount * (10 ** TOKEN1_DECIMALS)).toFixed(0),
    amount0_out: isBuy ? '0' : (eurcAmount * (10 ** TOKEN0_DECIMALS)).toFixed(0),
    amount1_out: isBuy ? (wusdcAmount * (10 ** TOKEN1_DECIMALS)).toFixed(0) : '0',
    pair_address: PAIR_ADDRESS,
    log_index: 0,
  });
}

// Insert
const insert = db.prepare(`
  INSERT INTO swaps 
  (tx_hash, block_number, timestamp, sender, recipient, amount0_in, amount1_in, amount0_out, amount1_out, pair_address, log_index)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

let inserted = 0;
for (const swap of swaps) {
  insert.run(
    swap.tx_hash,
    swap.block_number,
    swap.timestamp,
    swap.sender,
    swap.recipient,
    swap.amount0_in,
    swap.amount1_in,
    swap.amount0_out,
    swap.amount1_out,
    swap.pair_address,
    swap.log_index
  );
  inserted++;
}

console.log(`✅ Inserted ${inserted} proper dummy swaps`);

// Verify
const count = db.prepare('SELECT COUNT(*) as c FROM swaps WHERE pair_address = ?').get(PAIR_ADDRESS) as any;
console.log(`   Total in DB: ${count.c}`);

// Check amounts
const sample = db.prepare('SELECT * FROM swaps WHERE pair_address = ? LIMIT 2').all(PAIR_ADDRESS) as any[];
sample.forEach((s: any, i: number) => {
  console.log(`   Sample ${i}: a0in=${s.amount0_in}, a1in=${s.amount1_in}, a0out=${s.amount0_out}, a1out=${s.amount1_out}`);
});

db.close();
