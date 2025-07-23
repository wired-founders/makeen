// src\components\ClientWrapper.tsx
'use client';

import { useChatSession } from "@/hooks/useChatSession";

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  useChatSession(); // 👈 this will create or load the sessionId
  return <>{children}</>;
}
