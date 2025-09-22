// src/components/analytics/GTMProvider.tsx
"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
  }
}

export default function GTMProvider() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const url = pathname + (searchParams?.toString() ? `?${searchParams}` : "");
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "page_view",
      page_location: url,
      page_path: pathname,
      page_title: document.title,
    });
  }, [pathname, searchParams]);

  return null;
}
