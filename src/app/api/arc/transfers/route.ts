import { NextResponse } from "next/server";
import { getRecentTransfers } from "@/lib/arc-rpc";

export const dynamic = "force-dynamic";
export const revalidate = 30;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");
    const symbol = searchParams.get("symbol") || "TOKEN";
    const decimals = parseInt(searchParams.get("decimals") || "6", 10);
    const blocksBack = parseInt(searchParams.get("blocks") || "5000", 10);
    if (!token) return NextResponse.json({ error: "token param required" }, { status: 400 });
    const transfers = await getRecentTransfers(token, symbol, decimals, blocksBack);
    return NextResponse.json(transfers);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
