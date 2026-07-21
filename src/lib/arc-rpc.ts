// Arc Testnet RPC client
const ARC_RPC = "https://rpc.testnet.arc.network";
const ARCSCAN_API = "https://testnet.arcscan.app/api";

export interface ArcStats {
  chainId: string;
  blockNumber: number;
  gasPrice: string;
  latestBlockTxCount: number;
  latestBlockHash: string;
  timestamp: number;
}

export interface ArcToken {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: string;
  totalSupplyFormatted: string;
  type: string;
  cataloged: boolean;
}

export interface ArcTransfer {
  txHash: string;
  blockNumber: number;
  from: string;
  to: string;
  value: string;
  valueFormatted: string;
  tokenSymbol: string;
  timestamp: number;
}

export interface ArcHolder {
  address: string;
  value: string;
  valueFormatted: string;
}

async function rpcCall(method: string, params: unknown[]): Promise<unknown> {
  const res = await fetch(ARC_RPC, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", method, params, id: 1 }),
    next: { revalidate: 0 },
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error.message);
  return data.result;
}

async function arcscan(module: string, action: string, params: Record<string, string> = {}): Promise<unknown> {
  const url = new URL(ARCSCAN_API);
  url.searchParams.set("module", module);
  url.searchParams.set("action", action);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  const res = await fetch(url.toString(), { next: { revalidate: 30 } });
  const data = await res.json();
  if (data.status !== "1") throw new Error(data.message || "Arcscan error");
  return data.result;
}

export async function getArcStats(): Promise<ArcStats> {
  const [chainId, blockNumber, gasPrice, block] = await Promise.all([
    rpcCall("eth_chainId", []),
    rpcCall("eth_blockNumber", []),
    rpcCall("eth_gasPrice", []),
    rpcCall("eth_getBlockByNumber", ["latest", true]),
  ]) as [string, string, string, any];

  const blockObj = block || {};
  const txCount = Array.isArray(blockObj.transactions) ? blockObj.transactions.length : 0;

  return {
    chainId: String(parseInt(chainId, 16)),
    blockNumber: parseInt(blockNumber, 16),
    gasPrice: (parseInt(gasPrice, 16) / 1e9).toFixed(2),
    latestBlockTxCount: txCount,
    latestBlockHash: blockObj.hash || "",
    timestamp: Date.now(),
  };
}

const KNOWN_TOKENS = [
  { address: "0x3600000000000000000000000000000000000000", symbol: "USDC", name: "USD Coin", decimals: 6 },
  { address: "0x89B50855Aa3bE2F677cD6303Cec089B5F319D72a", symbol: "EURC", name: "Euro Coin", decimals: 6 },
  { address: "0xe9185F0c5F296Ed1797AaE4238D26CCaBEadb86C", symbol: "USYC", name: "USYC", decimals: 6 },
];

export async function getArcTokens(): Promise<ArcToken[]> {
  const tokens: ArcToken[] = [];
  for (const t of KNOWN_TOKENS) {
    try {
      const info = await arcscan("token", "getToken", { contractaddress: t.address }) as any;
      const decimals = parseInt(info.decimals || String(t.decimals), 10);
      const supply = info.totalSupply || "0";
      const supplyNum = BigInt(supply);
      const supplyFormatted = formatTokenAmount(supplyNum, decimals);
      tokens.push({
        address: t.address,
        name: info.name || t.name,
        symbol: info.symbol || t.symbol,
        decimals,
        totalSupply: supply,
        totalSupplyFormatted: supplyFormatted,
        type: info.type || "ERC-20",
        cataloged: Boolean(info.cataloged),
      });
    } catch {
      tokens.push({
        address: t.address,
        name: t.name,
        symbol: t.symbol,
        decimals: t.decimals,
        totalSupply: "0",
        totalSupplyFormatted: "0",
        type: "ERC-20",
        cataloged: false,
      });
    }
  }
  return tokens;
}

export async function getTokenHolders(tokenAddress: string, limit = 20): Promise<ArcHolder[]> {
  try {
    const result = await arcscan("token", "getTokenHolders", {
      contractaddress: tokenAddress,
      page: "1",
      offset: String(limit),
    }) as any[];
    return (result || []).map((h) => {
      const value = h.value || "0";
      return {
        address: h.address,
        value,
        valueFormatted: formatTokenAmount(BigInt(value), 6),
      };
    });
  } catch {
    return [];
  }
}

const TRANSFER_TOPIC = "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df588b3ee";

export async function getRecentTransfers(tokenAddress: string, tokenSymbol: string, decimals: number, blocksBack = 5000): Promise<ArcTransfer[]> {
  try {
    const latestHex = await rpcCall("eth_blockNumber", []) as string;
    const latest = parseInt(latestHex, 16);
    const from = Math.max(0, latest - blocksBack);
    const fromHex = "0x" + from.toString(16);

    const logs = await rpcCall("eth_getLogs", [{
      fromBlock: fromHex,
      toBlock: "latest",
      address: tokenAddress,
      topics: [TRANSFER_TOPIC],
    }]) as any[];

    return (logs || []).slice(-30).reverse().map((log) => {
      const fromAddr = "0x" + (log.topics?.[1] || "").slice(26);
      const toAddr = "0x" + (log.topics?.[2] || "").slice(26);
      const value = log.data || "0x0";
      return {
        txHash: log.transactionHash,
        blockNumber: parseInt(log.blockNumber, 16),
        from: fromAddr,
        to: toAddr,
        value,
        valueFormatted: formatTokenAmount(BigInt(value), decimals),
        tokenSymbol,
        timestamp: 0,
      };
    });
  } catch {
    return [];
  }
}

function formatTokenAmount(value: bigint, decimals: number): string {
  if (value === 0n) return "0";
  const divisor = 10n ** BigInt(decimals);
  const whole = value / divisor;
  const fraction = value % divisor;
  const fracStr = fraction.toString().padStart(decimals, "0").slice(0, 4);
  const wholeStr = whole.toLocaleString("en-US");
  return wholeStr + "." + fracStr;
}
