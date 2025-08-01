// src/app/voice/layout.tsx
import type { ReactNode } from "react";

export const metadata = {
  title: "Voice Agent | Kordor",
  description:
    "Talk to our AI voice agent in real time — powered by Deepgram, GPT-4o, and ElevenLabs.",
};

export default function VoiceLayout({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
      {children}
    </main>
  );
}
