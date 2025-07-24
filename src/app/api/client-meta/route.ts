// src\app\api\client-meta\route.ts
import { NextRequest, NextResponse } from "next/server";

export function GET(req: NextRequest) {
  const ip = req.headers.get("x-user-ip") || "unknown";
  const userAgent = req.headers.get("x-user-agent") || "unknown";
  return NextResponse.json({ ip, userAgent });
}
