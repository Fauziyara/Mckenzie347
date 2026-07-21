/**
 * API Route: /api/indexer/stats
 * Returns indexer stats: total pairs, total swaps, DB size, last sync
 */

import { NextRequest, NextResponse } from 'next/server';
import { getDB, getState, getDBPath } from '@/lib/indexer/db';
import fs from 'fs';

export async function GET() {
  try {
    const db = getDB();

    const pairCount = (db.prepare('SELECT COUNT(*) as c FROM pairs').get() as { c: number }).c;
    const tokenCount = (db.prepare('SELECT COUNT(*) as c FROM tokens').get() as { c: number }).c;
    const swapCount = (db.prepare('SELECT COUNT(*) as c FROM swaps').get() as { c: number }).c;

    // Pairs with liquidity
    const liquidPairs = (db.prepare('SELECT COUNT(*) as c FROM pairs WHERE CAST(reserve0 AS INTEGER) > 0 OR CAST(reserve1 AS INTEGER) > 0').get() as { c: number }).c;

    // Top pair by swaps
    const topPair = db.prepare(`
      SELECT p.address, p.total_swaps, t0.symbol AS s0, t1.symbol AS s1
      FROM pairs p
      LEFT JOIN tokens t0 ON p.token0 = t0.address
      LEFT JOIN tokens t1 ON p.token1 = t1.address
      ORDER BY p.total_swaps DESC LIMIT 1
    `).get() as any;

    // Recent swaps count (last 24h)
    const dayAgo = Math.floor(Date.now() / 1000) - 86400;
    const recentSwaps = (db.prepare('SELECT COUNT(*) as c FROM swaps WHERE timestamp > ?').get(dayAgo) as { c: number }).c;

    // Sync state
    const lastSwapBlock = getState('last_swap_block', '0');
    const factoryIndexes: Record<string, string> = {};
    const factories = ['0xd67f63a4f26a497b364d1c82e6747aec8b5743a5', '0xa16af7fc064e181c5bc335b30f0827b23b23e3a8', '0x7483847d46db2920dd64efa676cf72dcf765814f'];
    for (const f of factories) {
      factoryIndexes[f] = getState(`factory_${f}_lastIndex`, '0');
    }

    // DB file size
    let dbSize = 0;
    try {
      const stats = fs.statSync(getDBPath());
      dbSize = stats.size;
    } catch {}

    return NextResponse.json({
      success: true,
      pairs: pairCount,
      tokens: tokenCount,
      swaps: swapCount,
      liquidPairs,
      recentSwaps24h: recentSwaps,
      topPair: topPair ? {
        address: topPair.address,
        pair: `${topPair.s0 || '?'}/${topPair.s1 || '?'}`,
        swaps: topPair.total_swaps,
      } : null,
      sync: {
        lastSwapBlock,
        factoryIndexes,
      },
      dbSize,
      dbPath: getDBPath(),
    });
  } catch (error: any) {
    console.error('[api] Stats error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
