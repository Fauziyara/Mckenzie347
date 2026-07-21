/**
 * API Route: /api/indexer/pairs/[address]
 * Returns single pair by address with token info + reserves
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

    const pair = db.prepare(`
      SELECT
        p.address,
        p.factory,
        p.pair_index,
        p.token0,
        p.token1,
        p.reserve0,
        p.reserve1,
        p.total_swaps,
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
      WHERE p.address = ?
    `).get(address) as any;

    if (!pair) {
      return NextResponse.json({ error: 'Pair not found' }, { status: 404 });
    }

    // Calculate price: token0 per token1 (and vice versa)
    const reserve0 = BigInt(pair.reserve0 || '0');
    const reserve1 = BigInt(pair.reserve1 || '0');
    const decimals0 = pair.token0_decimals || 18;
    const decimals1 = pair.token1_decimals || 18;

    let priceToken0PerToken1 = '0';
    let priceToken1PerToken0 = '0';

    if (reserve1 > 0n && reserve0 > 0n) {
      // price of token0 in terms of token1 = reserve1 / reserve0 (adjusted for decimals)
      const numerator = reserve1 * (10n ** BigInt(decimals0));
      const denominator = reserve0 * (10n ** BigInt(decimals1));
      priceToken0PerToken1 = (Number(numerator) / Number(denominator)).toFixed(10);

      // price of token1 in terms of token0 = reserve0 / reserve1
      const numerator2 = reserve0 * (10n ** BigInt(decimals1));
      const denominator2 = reserve1 * (10n ** BigInt(decimals0));
      priceToken1PerToken0 = (Number(numerator2) / Number(denominator2)).toFixed(10);
    }

    return NextResponse.json({
      success: true,
      pair: {
        ...pair,
        priceToken0PerToken1,
        priceToken1PerToken0,
        reserve0Formatted: (Number(reserve0) / (10 ** decimals0)).toFixed(6),
        reserve1Formatted: (Number(reserve1) / (10 ** decimals1)).toFixed(6),
      },
    });
  } catch (error: any) {
    console.error('[api] Pair detail error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
