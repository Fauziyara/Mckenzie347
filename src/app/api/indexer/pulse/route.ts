/**
 * API Route: /api/indexer/pulse
 * Returns real-time pulse data: recent swaps, new pairs, stats
 */

import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/indexer/db';

export async function GET(request: NextRequest) {
  try {
    const db = getDB();
    const searchParams = request.nextUrl.searchParams;
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);

    // Recent swaps across all pairs (last 50)
    const recentSwaps = db.prepare(`
      SELECT
        s.tx_hash,
        s.block_number,
        s.timestamp,
        s.sender,
        s.recipient,
        s.amount0_in,
        s.amount1_in,
        s.amount0_out,
        s.amount1_out,
        s.pair_address,
        t0.symbol AS token0_symbol,
        t1.symbol AS token1_symbol,
        t0.decimals AS token0_decimals,
        t1.decimals AS token1_decimals
      FROM swaps s
      LEFT JOIN pairs p ON s.pair_address = p.address
      LEFT JOIN tokens t0 ON p.token0 = t0.address
      LEFT JOIN tokens t1 ON p.token1 = t1.address
      ORDER BY s.timestamp DESC
      LIMIT ?
    `).all(limit);

    // New pairs (created in last 24h, by pair_index desc = newest)
    const newPairs = db.prepare(`
      SELECT
        p.address,
        p.pair_index,
        p.token0,
        p.token1,
        p.reserve0,
        p.reserve1,
        p.updated_at,
        t0.symbol AS token0_symbol,
        t1.symbol AS token1_symbol,
        t0.decimals AS token0_decimals,
        t1.decimals AS token1_decimals
      FROM pairs p
      LEFT JOIN tokens t0 ON p.token0 = t0.address
      LEFT JOIN tokens t1 ON p.token1 = t1.address
      ORDER BY p.pair_index DESC
      LIMIT 10
    `).all();

    // Stats
    const totalPairs = (db.prepare('SELECT COUNT(*) as c FROM pairs').get() as any).c;
    const totalSwaps = (db.prepare('SELECT COUNT(*) as c FROM swaps').get() as any).c;
    const totalTokens = (db.prepare('SELECT COUNT(*) as c FROM tokens').get() as any).c;

    // Pairs with liquidity > 0
    const liquidPairs = (db.prepare(`
      SELECT COUNT(*) as c FROM pairs
      WHERE CAST(reserve0 AS INTEGER) > 0 OR CAST(reserve1 AS INTEGER) > 0
    `).get() as any).c;

    // Recent activity (swaps in last hour)
    const oneHourAgo = Date.now() - 3600000;
    const recentActivity = (db.prepare(`
      SELECT COUNT(*) as c FROM swaps WHERE timestamp > ?
    `).get(oneHourAgo) as any).c;

    // Top pairs by swap count (most active)
    const topPairs = db.prepare(`
      SELECT
        p.address,
        COUNT(s.tx_hash) AS total_swaps,
        t0.symbol AS token0_symbol,
        t1.symbol AS token1_symbol
      FROM swaps s
      JOIN pairs p ON s.pair_address = p.address
      LEFT JOIN tokens t0 ON p.token0 = t0.address
      LEFT JOIN tokens t1 ON p.token1 = t1.address
      GROUP BY s.pair_address
      ORDER BY total_swaps DESC
      LIMIT 5
    `).all();

    return NextResponse.json({
      success: true,
      timestamp: Date.now(),
      stats: {
        totalPairs,
        totalSwaps,
        totalTokens,
        liquidPairs,
        recentActivity,
      },
      recentSwaps,
      newPairs,
      topPairs,
    });
  } catch (error: any) {
    console.error('[api] Pulse error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
