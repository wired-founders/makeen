// src\hooks\useClientInfo.ts
// src/hooks/useClientInfo.ts
"use client";

import { useEffect, useState } from "react";

export function useClientInfo() {
  const [clientInfo, setClientInfo] = useState<{
    userAgent?: string;
    language?: string;
    screenWidth?: number;
    screenHeight?: number;
  }>({});

  useEffect(() => {
    setClientInfo({
      userAgent: navigator.userAgent,
      language: navigator.language,
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight,
    });
  }, []);

  return clientInfo;
}
