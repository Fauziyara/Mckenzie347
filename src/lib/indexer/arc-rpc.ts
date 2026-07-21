/**
 * Arc RPC Client — reads real data from Arc testnet via JSON-RPC
 * Handles rate limiting with retry + delay
 */

const RPC_URL = 'https://rpc.testnet.arc.network';

// Function selectors
export const SELECTORS = {
  allPairsLength: '0x574f2ba3',
  allPairs: '0x1e3dd18b', // Custom selector (not standard UniV2 0x1d3199b3)
  getPair: '0xe6a43905',
  createPair: '0xc9c65396',
  token0: '0x0dfe1681',
  token1: '0xd21220a7',
  getReserves: '0x0902f1ac',
  symbol: '0x95d89b41',
  name: '0x06fdde03',
  decimals: '0x313ce567',
  totalSupply: '0x18160ddd',
  balanceOf: '0x70a08231',
  factory: '0xc45a0155',
} as const;

// Event topic hashes
export const TOPICS = {
  Swap: '0xd78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130a40ecc1ad0',
  Sync: '0x1c411e9a96e071241c2f21f7726b17ae89e3cab4c78be50e062b03a9fffbbad1',
  Transfer: '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
} as const;

// Known factories on Arc testnet
export const FACTORIES = [
  '0xd67f63a4f26a497b364d1c82e6747aec8b5743a5', // Main factory (36940+ pairs)
  '0xa16af7fc064e181c5bc335b30f0827b23b23e3a8', // Small factory (5 pairs)
  '0x7483847d46db2920dd64efa676cf72dcf765814f', // 1 pair
] as const;

export const MAIN_FACTORY = FACTORIES[0];

// Known tokens
export const KNOWN_TOKENS: Record<string, { symbol: string; name: string; decimals: number }> = {
  '0x3600000000000000000000000000000000000000': { symbol: 'USDC', name: 'USD Coin', decimals: 6 },
  '0x89b50855aa3be2f677cd6303cec089b5f319d72a': { symbol: 'EURC', name: 'Euro Coin', decimals: 6 },
  '0xe9185f0c5f296ed1797aae4238d26ccabeadb86c': { symbol: 'USYC', name: 'USYC', decimals: 6 },
  '0x911b4000d3422f482f4062a913885f7b035382df': { symbol: 'WUSDC', name: 'Wrapped USDC', decimals: 6 },
};

export interface RpcResult {
  result?: string | null;
  error?: { code: number; message: string };
}

export async function rpc(method: string, params: any[], retries = 3): Promise<any> {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const resp = await fetch(RPC_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jsonrpc: '2.0', method, params, id: 1 }),
      });

      if (resp.status === 429) {
        await sleep(2000 * (attempt + 1));
        continue;
      }

      const data: RpcResult = await resp.json();
      if (data.error) {
        if (data.error.code === -32005 || data.error.message.includes('rate')) {
          await sleep(2000 * (attempt + 1));
          continue;
        }
        return null;
      }
      return data.result ?? null;
    } catch (e) {
      if (attempt < retries - 1) {
        await sleep(1000 * (attempt + 1));
      }
    }
  }
  return null;
}

export async function rpcBatch(calls: { method: string; params: any[] }[], batchSize = 5): Promise<any[]> {
  const results: any[] = new Array(calls.length).fill(null);

  for (let i = 0; i < calls.length; i += batchSize) {
    const batch = calls.slice(i, i + batchSize);
    const body = batch.map((c, idx) => ({
      jsonrpc: '2.0',
      method: c.method,
      params: c.params,
      id: i + idx + 1,
    }));

    try {
      const resp = await fetch(RPC_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (resp.status === 400) {
        // Batch too large, fallback to single calls
        for (let j = 0; j < batch.length; j++) {
          results[i + j] = await rpc(batch[j].method, batch[j].params);
          await sleep(100);
        }
        continue;
      }

      if (resp.status === 429) {
        await sleep(3000);
        i -= batchSize; // retry this batch
        continue;
      }

      const data = await resp.json() as RpcResult[];
      if (Array.isArray(data)) {
        for (const item of data) {
          const idx = (item as any).id - 1;
          results[idx] = item.result ?? null;
        }
      }
    } catch (e) {
      // Fallback to single calls
      for (let j = 0; j < batch.length; j++) {
        results[i + j] = await rpc(batch[j].method, batch[j].params);
        await sleep(100);
      }
    }

    await sleep(150);
  }

  return results;
}

export function decodeAddress(hex: string | null): string | null {
  if (!hex || hex === '0x' || hex.length < 66) return null;
  return '0x' + hex.slice(2).slice(24, 64 + 24).toLowerCase();
}

export function decodeUint(hex: string | null): bigint {
  if (!hex || hex === '0x' || hex.length < 66) return 0n;
  return BigInt(hex);
}

export function decodeString(hex: string | null): string {
  if (!hex || hex === '0x' || hex.length < 10) return '';
  try {
    // ABI-encoded string: offset(32) + length(32) + data
    const data = hex.slice(2);
    const length = parseInt(data.slice(64, 128), 16);
    if (length <= 0 || length > 256) return '';
    const strHex = data.slice(128, 128 + length * 2);
    return Buffer.from(strHex, 'hex').toString('utf8').replace(/\u0000/g, '');
  } catch {
    return '';
  }
}

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function getLatestBlock(): Promise<number> {
  const result = await rpc('eth_blockNumber', []);
  return result ? parseInt(result, 16) : 0;
}

export async function getBlockTimestamp(blockNumber: number): Promise<number> {
  const result = await rpc('eth_getBlockByNumber', [hex(blockNumber), false]);
  if (!result || typeof result !== 'object') return 0;
  try {
    return parseInt(result.timestamp, 16);
  } catch {
    return 0;
  }
}

export function hex(n: number | bigint): string {
  return '0x' + n.toString(16);
}

export function padUint(n: number | bigint): string {
  return n.toString(16).padStart(64, '0');
}
