import { NextResponse } from "next/server";
import { getTokenHolders } from "@/lib/arc-rpc";

export const dynamic = "force-dynamic";
export const revalidate = 60;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");
    const limit = parseInt(searchParams.get("limit") || "20", 10);
    if (!token) return NextResponse.json({ error: "token param required" }, { status: 400 });
    const holders = await getTokenHolders(token, limit);
    return NextResponse.json(holders);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
