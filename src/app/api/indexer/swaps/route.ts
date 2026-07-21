/**
 * API Route: /api/indexer/swaps
 * Returns swap history from SQLite
 */

import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/indexer/db';

export async function GET(request: NextRequest) {
  try {
    const db = getDB();
    const searchParams = request.nextUrl.searchParams;
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 500);
    const offset = parseInt(searchParams.get('offset') || '0');
    const pairAddress = searchParams.get('pair');

    let query = `
      SELECT
        s.*,
        t0.symbol AS token0_symbol,
        t0.decimals AS token0_decimals,
        t1.symbol AS token1_symbol,
        t1.decimals AS token1_decimals
      FROM swaps s
      JOIN pairs p ON s.pair_address = p.address
      LEFT JOIN tokens t0 ON p.token0 = t0.address
      LEFT JOIN tokens t1 ON p.token1 = t1.address
    `;

    const params: any[] = [];
    if (pairAddress) {
      query += ' WHERE s.pair_address = ?';
      params.push(pairAddress.toLowerCase());
    }

    query += ' ORDER BY s.block_number DESC, s.log_index DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const swaps = db.prepare(query).all(...params);

    let totalQuery = 'SELECT COUNT(*) as total FROM swaps';
    let totalParams: any[] = [];
    if (pairAddress) {
      totalQuery += ' WHERE pair_address = ?';
      totalParams = [pairAddress.toLowerCase()];
    }
    const total = (db.prepare(totalQuery).get(...totalParams) as { total: number }).total;

    return NextResponse.json({
      success: true,
      total,
      limit,
      offset,
      swaps,
    });
  } catch (error: any) {
    console.error('[api] Swaps query error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
