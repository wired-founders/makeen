// src\app\api\client-meta\route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  const userAgent = req.headers.get("user-agent") ?? "unknown";

  console.log("📊 Client Meta Logged:");
  console.log({ ip, userAgent, ...body });

  return NextResponse.json({ success: true });
}
