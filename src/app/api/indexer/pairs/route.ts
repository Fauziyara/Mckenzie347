/**
 * API Route: /api/indexer/pairs
 * Returns all indexed pairs from SQLite with token info + reserves
 * Computes price, formatted reserves, and volume in USD
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
    const searchQuery = searchParams.get('q');

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
    if (searchQuery) {
      conditions.push(`(
        LOWER(p.address) LIKE '%${searchQuery.toLowerCase()}%' OR
        LOWER(p.token0) LIKE '%${searchQuery.toLowerCase()}%' OR
        LOWER(p.token1) LIKE '%${searchQuery.toLowerCase()}%' OR
        LOWER(COALESCE(t0.symbol, '')) LIKE '%${searchQuery.toLowerCase()}%' OR
        LOWER(COALESCE(t1.symbol, '')) LIKE '%${searchQuery.toLowerCase()}%'
      )`);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ` ORDER BY p.${sortCol} ${sortOrder} LIMIT ? OFFSET ?`;

    const rows = db.prepare(query).all(limit, offset) as any[];

    // Compute derived fields using BigInt for precision
    const pairs = rows.map((row) => {
      const d0 = row.token0_decimals || 6;
      const d1 = row.token1_decimals || 6;
      const r0Str = String(row.reserve0 || "0");
      const r1Str = String(row.reserve1 || "0");

      // Use BigInt for raw reserves (can be >2^53)
      const r0Big = BigInt(r0Str);
      const r1Big = BigInt(r1Str);

      // Format reserves: divide by 10^decimals
      function formatReserve(big: bigint, decimals: number): string {
        if (big === 0n) return "0";
        const divisor = BigInt(10) ** BigInt(decimals);
        const whole = big / divisor;
        const fraction = big % divisor;
        const fractionStr = fraction.toString().padStart(decimals, "0").slice(0, 4);
        const wholeNum = Number(whole);
        if (wholeNum >= 1e12) return (wholeNum / 1e12).toFixed(2) + "T";
        if (wholeNum >= 1e9) return (wholeNum / 1e9).toFixed(2) + "B";
        if (wholeNum >= 1e6) return (wholeNum / 1e6).toFixed(2) + "M";
        if (wholeNum >= 1e3) return (wholeNum / 1e3).toFixed(2) + "K";
        return whole.toString() + "." + fractionStr;
      }

      // Price = reserve1/reserve0 (in human-readable units)
      // priceToken0PerToken1 = how much token1 per 1 token0
      function calcPrice(r0: bigint, r1: bigint, d0: number, d1: number): number {
        if (r0 === 0n || r1 === 0n) return 0;
        const adj0 = r0 * BigInt(10) ** BigInt(18 - d0);
        const adj1 = r1 * BigInt(10) ** BigInt(18 - d1);
        // adj1 / adj0 gives price in 1e18 fixed point
        const price18 = Number((adj1 * BigInt(1e18)) / adj0) / 1e18;
        return price18;
      }

      const priceToken0PerToken1 = calcPrice(r0Big, r1Big, d0, d1);
      const priceToken1PerToken0 = calcPrice(r1Big, r0Big, d1, d0);

      const reserve0Formatted = formatReserve(r0Big, d0);
      const reserve1Formatted = formatReserve(r1Big, d1);

      const vol0Str = String(row.total_volume0 || "0");
      const vol1Str = String(row.total_volume1 || "0");
      const vol0Formatted = Number(BigInt(vol0Str)) / Math.pow(10, d0);
      const vol1Formatted = Number(BigInt(vol1Str)) / Math.pow(10, d1);

      // Liquidity estimate (in token0 units)
      const liq0 = Number(r0Big) / Math.pow(10, d0);
      const liq1 = Number(r1Big) / Math.pow(10, d1);

      return {
        ...row,
        reserve0Formatted,
        reserve1Formatted,
        priceToken0PerToken1,
        priceToken1PerToken0,
        volume0Formatted: vol0Formatted,
        volume1Formatted: vol1Formatted,
        liquidityUsd: liq0 + liq1,
      };
    });

    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM pairs';
    const countConditions: string[] = [];
    if (hasLiquidity) {
      countConditions.push('CAST(reserve0 AS INTEGER) > 0 OR CAST(reserve1 AS INTEGER) > 0');
    }
    if (countConditions.length > 0) {
      countQuery += ' WHERE ' + countConditions.join(' AND ');
    }
    const total = (db.prepare(countQuery).get() as { total: number }).total;

    // Compute aggregate stats
    const statsQuery = `
      SELECT
        COUNT(*) as total_pairs,
        SUM(COALESCE(swap_counts.cnt, 0)) as total_swaps,
        SUM(CAST(p.total_volume0 AS INTEGER)) as total_volume0_raw
      FROM pairs p
      LEFT JOIN (
        SELECT pair_address, COUNT(*) as cnt FROM swaps GROUP BY pair_address
      ) swap_counts ON p.address = swap_counts.pair_address
    `;
    const stats = db.prepare(statsQuery).get() as any;

    return NextResponse.json({
      success: true,
      total,
      limit,
      offset,
      pairs,
      stats: {
        totalPairs: stats?.total_pairs || 0,
        totalSwaps: stats?.total_swaps || 0,
      },
    });
  } catch (error: any) {
    console.error('[api] Pairs query error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
