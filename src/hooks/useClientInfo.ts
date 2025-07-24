// src/hooks/useClientInfo.ts
"use client";

import { useEffect, useState } from "react";

export function useClientInfo() {
  const [clientInfo, setClientInfo] = useState<{
    userAgent?: string;
    language?: string;
    screenWidth?: number;
    screenHeight?: number;
    platform?: string;
    timezone?: string;
  }>({});

  useEffect(() => {
    setClientInfo({
      userAgent: navigator.userAgent,
      language: navigator.language,
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight,
      platform: navigator.platform,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    });
  }, []);

  return clientInfo;
}
