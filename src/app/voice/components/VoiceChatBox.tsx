// src/app/voice/page.tsx
"use client";

import { useState } from "react";
import { Mic, Send } from "lucide-react";
import VoiceHeader from "./VoiceHeader";
import { useVoiceChat } from "../hooks/useVoiceChat";

export default function VoiceChatUI() {
  const [recording, setRecording] = useState(false);
  const { messages } = useVoiceChat(recording);

  return (
    <div className="flex flex-col h-[500px] border rounded-xl overflow-hidden shadow-lg">
      <VoiceHeader />
      <div className="flex-1 p-4 overflow-y-auto space-y-2 bg-gray-50 dark:bg-zinc-900">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`max-w-xs px-4 py-2 rounded-lg text-sm ${
              msg.type === "user"
                ? "ml-auto bg-blue-600 text-white"
                : "mr-auto bg-gray-200 dark:bg-zinc-700"
            }`}
          >
            {msg.content}
          </div>
        ))}
      </div>
      <div className="p-4 border-t border-gray-200 dark:border-white/10 flex items-center gap-2">
        <button
          onClick={() => setRecording((r) => !r)}
          className={`p-2 rounded-full ${
            recording ? "bg-red-600" : "bg-blue-600"
          } text-white hover:opacity-80`}
        >
          <Mic className="h-5 w-5" />
        </button>
        <input
          disabled
          placeholder="Voice only"
          className="flex-1 bg-gray-100 dark:bg-zinc-800 rounded-full px-4 py-2 text-sm focus:outline-none"
        />
        <button
          disabled
          className="p-2 rounded-full bg-gray-300 dark:bg-zinc-700 text-gray-500 cursor-not-allowed"
        >
          <Send className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
