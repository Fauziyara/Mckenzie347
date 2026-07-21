/**
 * API Route: /api/indexer/sync
 * Triggers indexer sync (pair discovery + reserve update + swap sync)
 */

import { NextRequest, NextResponse } from 'next/server';
import { fullSync, quickSync, discoverPairs, updateAllReserves, syncSwaps } from '@/lib/indexer/sync';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const mode = body.mode || 'quick'; // 'full' | 'quick' | 'pairs' | 'reserves' | 'swaps'

    let result: string;

    switch (mode) {
      case 'full':
        await fullSync({ maxPairs: body.maxPairs ?? 200, swapBlocks: body.swapBlocks ?? 1000 });
        result = 'full sync complete';
        break;
      case 'quick':
        await quickSync();
        result = 'quick sync complete';
        break;
      case 'pairs':
        await discoverPairs(body.maxPairs ?? 200);
        result = 'pair discovery complete';
        break;
      case 'reserves':
        await updateAllReserves();
        result = 'reserve update complete';
        break;
      case 'swaps':
        const count = await syncSwaps(body.blocksBack ?? 1000);
        result = `synced ${count} swaps`;
        break;
      default:
        return NextResponse.json({ error: 'Invalid mode. Use: full, quick, pairs, reserves, swaps' }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: result, mode });
  } catch (error: any) {
    console.error('[indexer] Sync error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'ready',
    modes: ['full', 'quick', 'pairs', 'reserves', 'swaps'],
    usage: 'POST /api/indexer/sync with { "mode": "quick" }',
  });
}
