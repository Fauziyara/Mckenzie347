/**
 * Arc Indexer Scheduler — runs continuously via PM2
 * 
 * Tasks:
 * - Pair discovery: every 10 min (enumerate new pairs from factory)
 * - Reserve update: every 2 min (update reserves for all known pairs)
 * - Swap sync: every 1 min (scan recent blocks for Swap events)
 * 
 * Usage: npx tsx src/lib/indexer/scheduler.ts
 */

import { quickSync, discoverPairs, updateAllReserves, syncSwaps } from './sync';

const PAIR_DISCOVERY_INTERVAL = 10 * 60 * 1000;  // 10 min
const RESERVE_UPDATE_INTERVAL = 2 * 60 * 1000;   // 2 min
const SWAP_SYNC_INTERVAL = 60 * 1000;             // 1 min

let running = false;

async function runTask(name: string, fn: () => Promise<any>): Promise<void> {
  if (running) {
    console.log(`[scheduler] Skipping ${name} — previous task still running`);
    return;
  }
  running = true;
  const start = Date.now();
  console.log(`[scheduler] Starting ${name}...`);
  try {
    await fn();
    console.log(`[scheduler] ${name} complete in ${((Date.now() - start) / 1000).toFixed(1)}s`);
  } catch (e: any) {
    console.error(`[scheduler] ${name} error:`, e.message);
  }
  running = false;
}

async function main(): Promise<void> {
  console.log('=========================================');
  console.log('  Arc Indexer Scheduler');
  console.log('=========================================');
  console.log(`  Pair discovery: every ${PAIR_DISCOVERY_INTERVAL / 1000}s`);
  console.log(`  Reserve update: every ${RESERVE_UPDATE_INTERVAL / 1000}s`);
  console.log(`  Swap sync:      every ${SWAP_SYNC_INTERVAL / 1000}s`);
  console.log('=========================================\n');

  // Initial quick sync
  console.log('[scheduler] Initial quick sync...');
  await runTask('initial-quick-sync', quickSync);

  // Schedule recurring tasks
  setInterval(() => runTask('pair-discovery', () => discoverPairs(100)), PAIR_DISCOVERY_INTERVAL);
  setInterval(() => runTask('reserve-update', updateAllReserves), RESERVE_UPDATE_INTERVAL);
  setInterval(() => runTask('swap-sync', () => syncSwaps(500)), SWAP_SYNC_INTERVAL);

  console.log('\n[scheduler] All tasks scheduled. Waiting...\n');
}

process.on('SIGINT', () => {
  console.log('\n[scheduler] Shutting down...');
  process.exit(0);
});
process.on('SIGTERM', () => {
  console.log('\n[scheduler] SIGTERM received. Shutting down...');
  process.exit(0);
});

main().catch(console.error);
