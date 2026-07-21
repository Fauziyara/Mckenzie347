/**
 * API Route: /api/indexer/pairs
 * Returns all indexed pairs from SQLite with token info + reserves
 */

import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/indexer/db';

export async function GET(request: NextRequest) {
  try {
    const db = getDB();
    const searchParams = request.nextUrl.searchParams;
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 500);
    const offset = parseInt(searchParams.get('offset') || '0');
    const sortBy = searchParams.get('sort') || 'pair_index';
    const sortOrder = searchParams.get('order') === 'desc' ? 'DESC' : 'ASC';
    const hasLiquidity = searchParams.get('liquidity') === 'true';

    // Validate sort column
    const validSorts = ['pair_index', 'total_swaps', 'updated_at', 'reserve0', 'reserve1'];
    const sortCol = validSorts.includes(sortBy) ? sortBy : 'pair_index';

    let query = `
      SELECT
        p.address,
        p.factory,
        p.pair_index,
        p.token0,
        p.token1,
        p.reserve0,
        p.reserve1,
        COALESCE(swap_counts.cnt, 0) AS total_swaps,
        p.total_volume0,
        p.total_volume1,
        p.updated_at,
        t0.symbol AS token0_symbol,
        t0.name AS token0_name,
        t0.decimals AS token0_decimals,
        t1.symbol AS token1_symbol,
        t1.name AS token1_name,
        t1.decimals AS token1_decimals
      FROM pairs p
      LEFT JOIN tokens t0 ON p.token0 = t0.address
      LEFT JOIN tokens t1 ON p.token1 = t1.address
      LEFT JOIN (
        SELECT pair_address, COUNT(*) as cnt FROM swaps GROUP BY pair_address
      ) swap_counts ON p.address = swap_counts.pair_address
    `;

    const conditions: string[] = [];
    if (hasLiquidity) {
      conditions.push('(CAST(p.reserve0 AS INTEGER) > 0 OR CAST(p.reserve1 AS INTEGER) > 0)');
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ` ORDER BY p.${sortCol} ${sortOrder} LIMIT ? OFFSET ?`;

    const pairs = db.prepare(query).all(limit, offset);

    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM pairs';
    if (hasLiquidity) {
      countQuery += ' WHERE CAST(reserve0 AS INTEGER) > 0 OR CAST(reserve1 AS INTEGER) > 0';
    }
    const total = (db.prepare(countQuery).get() as { total: number }).total;

    return NextResponse.json({
      success: true,
      total,
      limit,
      offset,
      pairs,
    });
  } catch (error: any) {
    console.error('[api] Pairs query error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}