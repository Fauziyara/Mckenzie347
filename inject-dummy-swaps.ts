/**
 * Inject dummy swap data for testing chart & history
 * Run: npx tsx inject-dummy-swaps.ts
 */

import Database from 'better-sqlite3';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data', 'arc-indexer.db');
const db = new Database(DB_PATH);

// Pair EURC/WUSDC
const PAIR_ADDRESS = '0xfa61e1de61daf2ef4d8d9bad4b99fa21c8efab8a';
const TOKEN0_DECIMALS = 6;  // EURC
const TOKEN1_DECIMALS = 18; // WUSDC

// Base price: 1 EURC = 1.368 WUSDC
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

// Generate swaps for last 24 hours
const now = Date.now();
const oneHour = 60 * 60 * 1000;
const swaps = [];

for (let i = 0; i < 48; i++) {
  const timestamp = now - (48 - i) * 30 * 60 * 1000; // Every 30 min
  const blockNumber = 52725000 + i * 10;
  
  // Random price movement (±2%)
  const priceChange = randomBetween(-0.02, 0.02);
  const price = BASE_PRICE * (1 + priceChange);
  
  // Random amounts
  const amount0In = randomBetween(100, 5000); // EURC in
  const amount1Out = amount0In * price * randomBetween(0.98, 1.02); // WUSDC out
  
  // Alternate buy/sell
  const isBuy = i % 2 === 0;
  
  swaps.push({
    tx_hash: generateTxHash(),
    block_number: blockNumber,
    timestamp: Math.floor(timestamp / 1000),
    sender: generateAddress(),
    recipient: generateAddress(),
    amount0_in: isBuy ? (amount0In * (10 ** TOKEN0_DECIMALS)).toFixed(0) : '0',
    amount1_in: isBuy ? '0' : (amount0In * (10 ** TOKEN1_DECIMALS)).toFixed(0),
    amount0_out: isBuy ? '0' : (amount1Out * (10 ** TOKEN0_DECIMALS)).toFixed(0),
    amount1_out: isBuy ? (amount1Out * (10 ** TOKEN1_DECIMALS)).toFixed(0) : '0',
    pair_address: PAIR_ADDRESS,
    log_index: 0,
  });
}

// Insert swaps
const insert = db.prepare(`
  INSERT OR IGNORE INTO swaps 
  (tx_hash, block_number, timestamp, sender, recipient, amount0_in, amount1_in, amount0_out, amount1_out, pair_address, log_index)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

let inserted = 0;
for (const swap of swaps) {
  try {
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
  } catch (e) {
    console.error('Failed to insert:', e);
  }
}

console.log(`✅ Inserted ${inserted} dummy swaps for pair ${PAIR_ADDRESS}`);
console.log(`   Time range: ${new Date(swaps[0].timestamp * 1000).toISOString()} to ${new Date(swaps[swaps.length-1].timestamp * 1000).toISOString()}`);

// Update pair reserves to reflect "current" state
const latestSwap = swaps[swaps.length - 1];
const newReserve0 = (parseFloat(latestSwap.amount0_in || '1000000000000') / (10 ** TOKEN0_DECIMALS) * randomBetween(0.9, 1.1)).toFixed(0);
const newReserve1 = (parseFloat(latestSwap.amount1_out || '1370000000000000000000000') / (10 ** TOKEN1_DECIMALS) * randomBetween(0.9, 1.1)).toFixed(0);

db.prepare(`
  UPDATE pairs 
  SET reserve0 = ?, reserve1 = ?, updated_at = ?
  WHERE address = ?
`).run(newReserve0, newReserve1, now, PAIR_ADDRESS);

console.log(`✅ Updated reserves: ${newReserve0} / ${newReserve1}`);

db.close();
