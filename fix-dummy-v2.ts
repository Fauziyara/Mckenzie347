/**
 * Regenerate dummy swaps with correct price direction
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

// Clear
db.prepare('DELETE FROM swaps WHERE pair_address = ?').run(PAIR_ADDRESS);
console.log('Cleared old swaps');

const now = Date.now();
const swaps = [];

for (let i = 0; i < 48; i++) {
  const timestamp = now - (48 - i) * 30 * 60 * 1000;
  const blockNumber = 52725000 + i * 10;
  
  // Price with random walk (trending slightly up)
  const trend = 0.0005 * i;
  const noise = randomBetween(-0.015, 0.015);
  const price = BASE_PRICE * (1 + trend + noise);
  
  const eurcAmount = randomBetween(500, 3000);
  const wusdcAmount = eurcAmount * price;
  
  const isBuy = i % 2 === 0;
  
  if (isBuy) {
    swaps.push({
      tx_hash: generateTxHash(),
      block_number: blockNumber,
      timestamp: Math.floor(timestamp / 1000),
      sender: generateAddress(),
      recipient: generateAddress(),
      amount0_in: (eurcAmount * (10 ** TOKEN0_DECIMALS)).toFixed(0),
      amount1_in: '0',
      amount0_out: '0',
      amount1_out: (wusdcAmount * (10 ** TOKEN1_DECIMALS)).toFixed(0),
      pair_address: PAIR_ADDRESS,
      log_index: 0,
    });
  } else {
    const wusdcIn = randomBetween(500, 3000);
    const eurcOut = wusdcIn / price;
    
    swaps.push({
      tx_hash: generateTxHash(),
      block_number: blockNumber,
      timestamp: Math.floor(timestamp / 1000),
      sender: generateAddress(),
      recipient: generateAddress(),
      amount0_in: '0',
      amount1_in: (wusdcIn * (10 ** TOKEN1_DECIMALS)).toFixed(0),
      amount0_out: (eurcOut * (10 ** TOKEN0_DECIMALS)).toFixed(0),
      amount1_out: '0',
      pair_address: PAIR_ADDRESS,
      log_index: 0,
    });
  }
}

const insert = db.prepare(`
  INSERT INTO swaps 
  (tx_hash, block_number, timestamp, sender, recipient, amount0_in, amount1_in, amount0_out, amount1_out, pair_address, log_index)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

for (const s of swaps) {
  insert.run(s.tx_hash, s.block_number, s.timestamp, s.sender, s.recipient,
    s.amount0_in, s.amount1_in, s.amount0_out, s.amount1_out, s.pair_address, s.log_index);
}

console.log(`✅ Inserted ${swaps.length} swaps`);

const all = db.prepare('SELECT * FROM swaps WHERE pair_address = ? ORDER BY timestamp').all(PAIR_ADDRESS) as any[];
console.log('\nPrice check (first 5):');
all.slice(0, 5).forEach((s: any) => {
  const a0in = parseFloat(s.amount0_in) / 1e6;
  const a1in = parseFloat(s.amount1_in) / 1e18;
  const a0out = parseFloat(s.amount0_out) / 1e6;
  const a1out = parseFloat(s.amount1_out) / 1e18;
  
  let price = 0;
  if (a0in > 0) price = a1out / a0in;
  else price = a1in / a0out;
  
  console.log(`  ${a0in > 0 ? 'BUY' : 'SELL'}: ${price.toFixed(4)}`);
});

db.close();
