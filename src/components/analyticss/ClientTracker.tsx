// src/components/analyticss/ClientTracker.tsx
"use client";

import { useClientInfo } from "@/hooks/useClientInfo";
import { useEffect } from "react";

export default function ClientTracker() {
  const client = useClientInfo();

  useEffect(() => {
    if (!client.userAgent) return;

    fetch("/api/client-meta", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(client),
    });
  }, [client]);

  return null; // hidden component
}
