// src\app\voice\page.tsx
"use client";

import { useState, useEffect, useRef } from "react";

export default function AIVoiceChatPage() {
  const [transcript, setTranscript] = useState("");
  const [reply, setReply] = useState("");
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
          setTranscript(t);

          // Send to GPT backend
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
          setReply(botReply);

          // ElevenLabs TTS
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

  const toggleRecording = () => {
    setRecording((prev) => !prev);
  };

  return (
    <div className="p-4 max-w-md mx-auto space-y-4">
      <h1 className="text-xl font-bold">🎙️ Real-Time Voice Chat</h1>
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded"
        onClick={toggleRecording}
      >
        {recording ? "🛑 Stop" : "🎤 Start"}
      </button>
      <div>
        <p>
          <strong>You said:</strong> {transcript}
        </p>
        <p>
          <strong>Bot replied:</strong> {reply}
        </p>
      </div>
    </div>
  );
}
