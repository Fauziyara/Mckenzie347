/**
 * API Route: /api/indexer/pairs/[address]/swaps
 * Returns swap history for a specific pair
 */

import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/indexer/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ address: string }> }
) {
  try {
    const { address } = await params;
    const db = getDB();
    const searchParams = request.nextUrl.searchParams;
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 200);
    const offset = parseInt(searchParams.get('offset') || '0');

    const swaps = db.prepare(`
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
        s.pair_address
      FROM swaps s
      WHERE s.pair_address = ?
      ORDER BY s.timestamp DESC
      LIMIT ? OFFSET ?
    `).all(address, limit, offset);

    const total = (db.prepare(
      'SELECT COUNT(*) as total FROM swaps WHERE pair_address = ?'
    ).get(address) as { total: number }).total;

    return NextResponse.json({
      success: true,
      total,
      limit,
      offset,
      swaps,
    });
  } catch (error: any) {
    console.error('[api] Pair swaps error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
