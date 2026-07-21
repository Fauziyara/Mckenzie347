/**
 * Arc Indexer — syncs pairs and swaps from Arc testnet to SQLite
 *
 * Two sync modes:
 * 1. Pair Discovery: enumerate all pairs from factory, store token0/token1/reserves
 * 2. Swap Sync: scan Swap events per pair, store to swaps table
 */

import { rpc, rpcBatch, decodeAddress, decodeUint, decodeString, sleep, hex, padUint,
  SELECTORS, TOPICS, MAIN_FACTORY, FACTORIES, KNOWN_TOKENS, getLatestBlock, getBlockTimestamp } from './arc-rpc';
import { getDB, getState, setState, upsertToken, upsertPair, updateReserves, insertSwap, incrementPairSwapCount } from './db';

// ===== TOKEN CACHE =====
const tokenCache = new Map<string, { symbol: string; name: string; decimals: number }>();

async function getTokenInfo(address: string): Promise<{ symbol: string; name: string; decimals: number }> {
  const addr = address.toLowerCase();
  if (tokenCache.has(addr)) return tokenCache.get(addr)!;
  if (addr in KNOWN_TOKENS) {
    tokenCache.set(addr, KNOWN_TOKENS[addr]);
    return KNOWN_TOKENS[addr];
  }

  // Sequential: symbol, name, decimals (Arc RPC doesn't support batch)
  const symHex = await rpc('eth_call', [{ to: addr, data: SELECTORS.symbol }, 'latest']);
  await sleep(80);
  const nameHex = await rpc('eth_call', [{ to: addr, data: SELECTORS.name }, 'latest']);
  await sleep(80);
  const decHex = await rpc('eth_call', [{ to: addr, data: SELECTORS.decimals }, 'latest']);

  const info = {
    symbol: decodeString(symHex) || 'UNK',
    name: decodeString(nameHex) || 'Unknown',
    decimals: decHex ? parseInt(decHex, 16) || 18 : 18,
  };

  tokenCache.set(addr, info);
  return info;
}

// ===== PAIR DISCOVERY (event-based via Sync events) =====
// allPairs(uint256) REVERTS for index > 0 on Arc testnet factories.
// Instead, we scan eth_getLogs for Sync events to discover active pair contracts.

export async function discoverPairs(maxPairs = 500): Promise<number> {
  const db = getDB();
  const startTime = Date.now();
  const lastDiscoveryBlock = parseInt(getState('last_discovery_block', '0'));

  const latestBlock = await getLatestBlock();
  if (!latestBlock) {
    console.log('[indexer] Failed to get latest block for discovery');
    return 0;
  }

  // Scan window: from last discovery block (or 10000 blocks back) to latest
  const fromBlock = lastDiscoveryBlock > 0 ? lastDiscoveryBlock + 1 : Math.max(0, latestBlock - 10000);
  const toBlock = latestBlock;

  console.log(`[indexer] Discovering pairs via Sync events: blocks ${fromBlock}..${toBlock}`);

  // Query Sync events (no address filter — catch ALL pairs across all factories)
  const logs = await rpc('eth_getLogs', [{
    fromBlock: hex(fromBlock),
    toBlock: hex(toBlock),
    topics: [TOPICS.Sync],
  }]);

  if (!logs || !Array.isArray(logs)) {
    console.log('[indexer] No Sync events found or RPC error');
    setState('last_discovery_block', String(toBlock));
    return 0;
  }

  // Extract unique pair addresses from log emitters
  const pairSet = new Set<string>();
  for (const log of logs) {
    if (log.address) pairSet.add(log.address.toLowerCase());
  }

  console.log(`[indexer] Found ${pairSet.size} unique pair addresses from ${logs.length} Sync events`);

  if (pairSet.size === 0) {
    setState('last_discovery_block', String(toBlock));
    console.log('[indexer] No pairs discovered');
    return 0;
  }

  // Also check existing pairs in DB to avoid redundant work
  const existingPairs = new Set(
    (db.prepare('SELECT address FROM pairs').all() as { address: string }[]).map(r => r.address.toLowerCase())
  );

  // Filter to new pairs only, limit by maxPairs
  const newPairAddrs = [...pairSet].filter(a => !existingPairs.has(a)).slice(0, maxPairs);
  console.log(`[indexer] New pairs to index: ${newPairAddrs.length} (skipped ${pairSet.size - newPairAddrs.length} existing)`);

  // Fetch token0, token1, getReserves, factory — sequential (Arc RPC doesn't support batch)
  const batchSize = 1; // process 1 pair at a time
  let newCount = 0;

  for (let i = 0; i < newPairAddrs.length; i++) {
    const pairAddr = newPairAddrs[i];

    // Sequential calls — Arc RPC rate limit requires delay between calls
    const t0Hex = await rpc('eth_call', [{ to: pairAddr, data: SELECTORS.token0 }, 'latest']);
    await sleep(100);
    const t1Hex = await rpc('eth_call', [{ to: pairAddr, data: SELECTORS.token1 }, 'latest']);
    await sleep(100);
    const resHex = await rpc('eth_call', [{ to: pairAddr, data: SELECTORS.getReserves }, 'latest']);
    await sleep(100);
    const factoryHex = await rpc('eth_call', [{ to: pairAddr, data: SELECTORS.factory }, 'latest']);
    await sleep(100);

    const t0 = decodeAddress(t0Hex);
    const t1 = decodeAddress(t1Hex);
    const factoryAddr = decodeAddress(factoryHex) || 'unknown';

    if (!t0 || !t1) {
      console.log(`[indexer]   Skip ${pairAddr}: missing token0/token1`);
      continue;
    }

    const r0 = resHex ? BigInt('0x' + resHex.slice(2, 66)) : 0n;
    const r1 = resHex ? BigInt('0x' + resHex.slice(66, 130)) : 0n;

    // Get token info (cached)
    const [info0, info1] = await Promise.all([getTokenInfo(t0), getTokenInfo(t1)]);

    upsertToken(t0, info0.symbol, info0.name, info0.decimals, 0);
    upsertToken(t1, info1.symbol, info1.name, info1.decimals, 0);
    upsertPair(pairAddr, factoryAddr, 0, t0, t1, 0);
    updateReserves(pairAddr, r0.toString(), r1.toString());
    newCount++;

    console.log(`[indexer]   + ${pairAddr} (${info0.symbol}/${info1.symbol}) reserves: ${r0.toString()} / ${r1.toString()}`);

    await sleep(150); // Rate limit protection
  }

  setState('last_discovery_block', String(toBlock));

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`[indexer] Pair discovery complete: +${newCount} new pairs in ${elapsed}s`);
  return newCount;
}

// ===== RESERVE UPDATE =====

export async function updateAllReserves(): Promise<void> {
  const db = getDB();
  const pairs = db.prepare('SELECT address FROM pairs').all() as { address: string }[];

  console.log(`[indexer] Updating reserves for ${pairs.length} pairs...`);

  let updated = 0;

  for (const pair of pairs) {
    const resHex = await rpc('eth_call', [{ to: pair.address, data: SELECTORS.getReserves }, 'latest']);
    if (!resHex || resHex === '0x') {
      await sleep(100);
      continue;
    }

    const r0 = BigInt('0x' + resHex.slice(2, 66));
    const r1 = BigInt('0x' + resHex.slice(66, 130));
    updateReserves(pair.address, r0.toString(), r1.toString());
    updated++;

    await sleep(120); // Rate limit
  }

  console.log(`[indexer] Updated reserves for ${updated}/${pairs.length} pairs`);
}

// ===== SWAP SYNC =====

export async function syncSwaps(blocksBack = 500): Promise<number> {
  const db = getDB();
  const latestBlock = await getLatestBlock();
  if (!latestBlock) {
    console.log('[indexer] Failed to get latest block');
    return 0;
  }

  // Get last synced block
  let lastSwapBlock = parseInt(getState('last_swap_block', '0'));
  if (lastSwapBlock === 0) {
    lastSwapBlock = Math.max(0, latestBlock - blocksBack);
  }

  const fromBlock = lastSwapBlock + 1;
  const toBlock = latestBlock;

  if (fromBlock > toBlock) {
    console.log('[indexer] No new blocks to sync');
    return 0;
  }

  console.log(`[indexer] Syncing swaps: blocks ${fromBlock}..${toBlock}`);

  // Get all pair addresses from DB
  const pairs = db.prepare('SELECT address FROM pairs').all() as { address: string }[];
  if (pairs.length === 0) {
    console.log('[indexer] No pairs in DB, run pair discovery first');
    return 0;
  }

  // Query Swap events for each pair (batch by 10 pairs)
  let totalSwaps = 0;
  const pairBatchSize = 10;

  for (let i = 0; i < pairs.length; i += pairBatchSize) {
    const pairBatch = pairs.slice(i, i + pairBatchSize);

    for (const pair of pairBatch) {
      // eth_getLogs with Swap topic
      const logs = await rpc('eth_getLogs', [{
        fromBlock: hex(fromBlock),
        toBlock: hex(toBlock),
        address: pair.address,
        topics: [TOPICS.Swap],
      }]);

      if (!logs || logs === '0x') {
        await sleep(100);
        continue;
      }

      // eth_getLogs returns array of log objects
      let parsed: any[];
      if (Array.isArray(logs)) {
        parsed = logs as any[];
      } else {
        try {
          parsed = JSON.parse(logs as string);
        } catch {
          parsed = [];
        }
      }

      if (!Array.isArray(parsed) || parsed.length === 0) {
        await sleep(100);
        continue;
      }

      for (const log of parsed) {
        // Swap event: (address sender, uint amount0In, uint amount1In, uint amount0Out, uint amount1Out, address to)
        const data = log.data;
        if (!data || data.length < 322) continue;

        const amount0In = BigInt('0x' + data.slice(2, 66));
        const amount1In = BigInt('0x' + data.slice(66, 130));
        const amount0Out = BigInt('0x' + data.slice(130, 194));
        const amount1Out = BigInt('0x' + data.slice(194, 258));

        const sender = log.topics && log.topics[1] ? '0x' + log.topics[1].slice(26) : '';
        const to = log.topics && log.topics[2] ? '0x' + log.topics[2].slice(26) : '';

        const blockNum = parseInt(log.blockNumber, 16);
        let timestamp = 0;
        try {
          timestamp = await getBlockTimestamp(blockNum);
        } catch {}

        insertSwap({
          pair_address: pair.address,
          tx_hash: log.transactionHash,
          log_index: log.logIndex ? parseInt(log.logIndex, 16) : 0,
          block_number: blockNum,
          timestamp,
          sender: sender.toLowerCase(),
          recipient: to.toLowerCase(),
          amount0_in: amount0In.toString(),
          amount1_in: amount1In.toString(),
          amount0_out: amount0Out.toString(),
          amount1_out: amount1Out.toString(),
        });

        // Update pair stats
        incrementPairSwapCount(pair.address, amount0In.toString(), amount1In.toString());
        totalSwaps++;
      }

      await sleep(150); // Rate limit
    }
  }

  setState('last_swap_block', String(toBlock));
  console.log(`[indexer] Synced ${totalSwaps} new swaps`);
  return totalSwaps;
}

// ===== FULL SYNC =====

export async function fullSync(opts?: { maxPairs?: number; swapBlocks?: number }): Promise<void> {
  console.log('[indexer] === Starting full sync ===');

  // Phase 1: Discover pairs
  console.log('[indexer] Phase 1: Pair discovery...');
  await discoverPairs(opts?.maxPairs ?? 200);

  // Phase 2: Update reserves
  console.log('[indexer] Phase 2: Reserve update...');
  await updateAllReserves();

  // Phase 3: Sync swaps
  console.log('[indexer] Phase 3: Swap sync...');
  await syncSwaps(opts?.swapBlocks ?? 1000);

  console.log('[indexer] === Full sync complete ===');
}

export async function quickSync(): Promise<void> {
  console.log('[indexer] === Quick sync (reserves + recent swaps) ===');
  await updateAllReserves();
  await syncSwaps(500);
  console.log('[indexer] === Quick sync done ===');
}
