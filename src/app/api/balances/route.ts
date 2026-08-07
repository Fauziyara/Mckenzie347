import { NextRequest, NextResponse } from "next/server";

const RPC_URL = "https://rpc.testnet.arc.network";

const TOKENS = [
  { symbol: "USDC", name: "USD Coin", address: "0x3600000000000000000000000000000000000000", decimals: 6 },
  { symbol: "cirBTC", name: "Circle Wrapped Bitcoin", address: "0xf0c4a4ce82a5746abaad9425360ab04fbba432bf", decimals: 8 },
  { symbol: "EURC", name: "Euro Coin", address: "0x89b50855aa3be2f677cd6303cec089b5f319d72a", decimals: 6 },
];

function formatBalance(hexStr: string, decimals: number): number {
  try {
    const big = BigInt(hexStr || "0x0");
    return Number(big) / Math.pow(10, decimals);
  } catch {
    return 0;
  }
}

export async function POST(req: NextRequest) {
  try {
    const { wallet } = await req.json();

    if (!wallet || !wallet.startsWith("0x") || wallet.length < 42) {
      return NextResponse.json({ error: "Invalid wallet address" }, { status: 400 });
    }

    const balances = [];
    
    // Sequential fetch with delay to avoid Arc RPC rate limit (-32011)
    for (let i = 0; i < TOKENS.length; i++) {
      const token = TOKENS[i];
      const paddedAddr = wallet.toLowerCase().slice(2).padStart(64, "0");
      const data = "0x70a08231" + paddedAddr;
      
      let amount = 0;
      let attempts = 0;
      
      while (attempts < 3) {
        try {
          const res = await fetch(RPC_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              jsonrpc: "2.0", id: 1, method: "eth_call",
              params: [{ to: token.address, data }, "latest"],
            }),
          }).then(r => r.json());
          
          if (res?.error) {
            // Rate limited — wait and retry
            attempts++;
            await new Promise(r => setTimeout(r, 500 * attempts));
            continue;
          }
          
          amount = formatBalance(res?.result || "0x0", token.decimals);
          break;
        } catch {
          attempts++;
          await new Promise(r => setTimeout(r, 500 * attempts));
        }
      }
      
      balances.push({
        symbol: token.symbol,
        name: token.name,
        amount,
      });
      
      // Small delay between tokens
      if (i < TOKENS.length - 1) await new Promise(r => setTimeout(r, 200));
    }

    return NextResponse.json({ success: true, balances });
  } catch (e: any) {
    console.error("Balance proxy error:", e);
    return NextResponse.json({ error: e.message || "Failed" }, { status: 500 });
  }
}
