import { NextResponse } from "next/server";

const RPC_URL = "https://rpc.testnet.arc.network";

const PAIRS: Record<string, string> = {
  "USDC/EURC": "0xa5cf14f962ed710024a9a626569d984e6253827b",
  "USDC/cirBTC": "0x789ca3efc403df1fe58867d50eba5c3fa0e652c8",
};

async function ethCall(to: string, data: string) {
  const res = await fetch(RPC_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "eth_call", params: [{ to, data }, "latest"] }),
    next: { revalidate: 5 },
  });
  const j = await res.json();
  return j.result || null;
}

export async function GET() {
  try {
    const results: Record<string, { reserve0: string; reserve1: string; token0: string }> = {};

    for (const [key, address] of Object.entries(PAIRS)) {
      const [reservesHex, token0Hex] = await Promise.all([
        ethCall(address, "0x0902f1ac"),  // getReserves()
        ethCall(address, "0x0dfe1681"),  // token0()
      ]);

      if (reservesHex && reservesHex.length >= 130 && token0Hex && token0Hex.length >= 42) {
        results[key] = {
          reserve0: "0x" + reservesHex.slice(2, 66),
          reserve1: "0x" + reservesHex.slice(66, 130),
          token0: "0x" + token0Hex.slice(26).toLowerCase(),
        };
      }
    }

    return NextResponse.json({ success: true, pairs: results }, {
      headers: { "Cache-Control": "public, s-maxage=5, stale-while-revalidate=10" },
    });
  } catch (e) {
    return NextResponse.json({ success: false, error: String(e) }, { status: 500 });
  }
}
