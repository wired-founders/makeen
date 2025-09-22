// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { IPINFO_TOKEN } from "@/config/env";

export async function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const headers = req.headers;

  // ---------- IP + Geo Info ----------
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "8.8.8.8"; // fallback for localhost/dev

  let geo: any = {};
  try {
    const res = await fetch(`https://ipinfo.io/${ip}?token=${IPINFO_TOKEN}`);
    if (res.ok) geo = await res.json();
  } catch (err) {
    console.error("Geo lookup failed", err);
  }

  // ---------- Referrer + UTM ----------
  const referrer = headers.get("referer") || "direct";
  const utmSource = url.searchParams.get("utm_source") || "unknown";
  const utmMedium = url.searchParams.get("utm_medium") || "unknown";
  const utmCampaign = url.searchParams.get("utm_campaign") || "unknown";

  // ---------- Log all ----------
  console.log("Visitor analytics:", {
    path: url.pathname,
    ip,
    city: geo?.city,
    region: geo?.region,
    country: geo?.country,
    org: geo?.org,
    referrer,
    utmSource,
    utmMedium,
    utmCampaign,
  });

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"], // skip static assets
};
