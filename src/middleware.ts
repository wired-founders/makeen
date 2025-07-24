// src\middleware.ts
import { NextRequest, NextResponse } from "next/server";

export interface IpInfo {
  city?: string;
  region?: string;
  country?: string;
  org?: string;
}

export async function middleware(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "8.8.8.8"; // fallback for localhost/dev

  const res = await fetch(`https://ipinfo.io/lite/${ip}?token=${process.env.IPINFO_TOKEN}`);
  const geo = (await res.json()) as IpInfo;

  console.log("🌍 Geo Info:", {
    ip,
    city: geo?.city,
    region: geo?.region,
    country: geo?.country,
    org: geo?.org,
  });

  return NextResponse.next();
}
