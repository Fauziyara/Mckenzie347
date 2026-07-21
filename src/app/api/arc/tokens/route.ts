import { NextResponse } from "next/server";
import { getArcTokens } from "@/lib/arc-rpc";

export const dynamic = "force-dynamic";
export const revalidate = 30;

export async function GET() {
  try {
    const tokens = await getArcTokens();
    return NextResponse.json(tokens);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
