// src\app\voice\components\VoiceChatBox.tsx
// src/components/VoiceChatBox.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { Mic, Send } from "lucide-react";
import VoiceHeader from "./VoiceHeader";

export default function VoiceChatBox() {
  const [messages, setMessages] = useState<
    { type: "user" | "bot"; content: string }[]
  >([]);
  const [recording, setRecording] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    if (!recording) return;

    const start = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioCtx = new AudioContext();
      audioCtxRef.current = audioCtx;

      await audioCtx.audioWorklet.addModule("/mic-processor.js");

      const source = audioCtx.createMediaStreamSource(stream);
      const micNode = new AudioWorkletNode(audioCtx, "mic-processor");

      micNode.port.onmessage = (e) => {
        const { audio } = e.data;
        if (socketRef.current?.readyState === WebSocket.OPEN) {
          const float32Array = new Float32Array(audio);
          socketRef.current.send(float32Array.buffer);
        }
      };

      source.connect(micNode).connect(audioCtx.destination);

      const socket = new WebSocket(`wss://api.deepgram.com/v1/listen`, [
        "token",
        process.env.NEXT_PUBLIC_DEEPGRAM_API_KEY!,
      ]);
      socketRef.current = socket;

      socket.onmessage = async (msg) => {
        const dg = JSON.parse(msg.data);
        const t = dg.channel?.alternatives?.[0]?.transcript;
        if (t) {
          setMessages((prev) => [...prev, { type: "user", content: t }]);

          const chatRes = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/chat`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                message: t,
                userId: "voice-user",
                platform: "web",
              }),
            }
          );

          const chatData = await chatRes.json();
          const botReply = chatData.replies?.[0]?.reply || "🤖 No reply";

          setMessages((prev) => [...prev, { type: "bot", content: botReply }]);

          const audioRes = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tts`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ text: botReply }),
            }
          );

          const audioBlob = await audioRes.blob();
          new Audio(URL.createObjectURL(audioBlob)).play();
        }
      };
    };

    start();

    return () => {
      socketRef.current?.close();
      audioCtxRef.current?.close();
    };
  }, [recording]);

  const toggleRecording = () => setRecording((prev) => !prev);

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
          onClick={toggleRecording}
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
