// src\components\analyticss\ClientTracker.tsx
// src/components/ClientTracker.tsx
"use client";
import { useClientInfo } from "@/hooks/useClientInfo";
import { useEffect } from "react";

export default function ClientTracker() {
  const client = useClientInfo();

  useEffect(() => {
    console.log("📲 Client Info:", client);
    // You can also send this to an API endpoint if needed
  }, [client]);

  return null; // no UI
}
