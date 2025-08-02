// src\app\voice\hooks\useVoiceChat.ts
import { useEffect, useRef, useState } from "react";
import { DEEPGRAM_API_KEY, BACKEND_URL } from "@/config/env";

type Message = { type: "user" | "bot"; content: string };

export function useVoiceChat(recording: boolean) {
  const [messages, setMessages] = useState<Message[]>([]);
  const socketRef = useRef<WebSocket | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    if (!recording) {
      console.log("⏹ Recording is off.");
      return;
    }

    console.log("🎙️ Voice recording started...");

    const start = async () => {
      try {
        console.log("🔄 Requesting mic access...");
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        console.log("✅ Mic access granted");

        const audioCtx = new AudioContext();
        audioCtxRef.current = audioCtx;

        console.log("📦 Loading mic-processor.js...");
        await audioCtx.audioWorklet.addModule("/mic-processor.js");
        console.log("✅ Audio worklet loaded");

        const source = audioCtx.createMediaStreamSource(stream);
        const micNode = new AudioWorkletNode(audioCtx, "mic-processor");

        micNode.port.onmessage = (e) => {
          const { audio } = e.data;
          if (socketRef.current?.readyState === WebSocket.OPEN) {
            const float32Array = new Float32Array(audio);
            socketRef.current.send(float32Array.buffer);
            console.log("📤 Audio chunk sent to Deepgram");
          }
        };

        source.connect(micNode).connect(audioCtx.destination);
        console.log("🔊 Audio nodes connected");

        const socket = new WebSocket(
          `wss://api.deepgram.com/v1/listen?punctuate=true&interim_results=true&language=en&token=${DEEPGRAM_API_KEY}`
        );

        socketRef.current = socket;

        socket.onopen = () => {
          console.log("🔗 Deepgram socket open — sending auth");

          socket.send(
            JSON.stringify({
              type: "config",
              token: DEEPGRAM_API_KEY,
            })
          );
        };

        socketRef.current = socket;

        socket.onopen = () => {
          console.log("🔗 Connected to Deepgram WebSocket");
        };

        socket.onerror = (err) => {
          console.error("❌ Deepgram WebSocket error:", err);
        };

        socket.onmessage = async (msg) => {
          const dg = JSON.parse(msg.data);
          const t = dg.channel?.alternatives?.[0]?.transcript;

          if (!t?.length) return;
          console.log("📝 Transcript received:", t);

          setMessages((prev) => [...prev, { type: "user", content: t }]);

          try {
            const chatRes = await fetch(`${BACKEND_URL}/api/voice`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                message: t,
                userId: "voice-user",
                platform: "web",
              }),
            });

            const chatData = await chatRes.json();
            const botReply = chatData.replies?.[0]?.reply || "🤖 No reply";
            console.log("🤖 Bot replied:", botReply);

            setMessages((prev) => [
              ...prev,
              { type: "bot", content: botReply },
            ]);

            const audioRes = await fetch(`${BACKEND_URL}/api/tts`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ text: botReply }),
            });

            const audioBlob = await audioRes.blob();
            console.log("🔊 Playing TTS audio");
            new Audio(URL.createObjectURL(audioBlob)).play();
          } catch (err) {
            console.error("❌ Failed to fetch or play bot reply:", err);
          }
        };
      } catch (error) {
        console.error("❌ Voice chat setup error:", error);
      }
    };

    start();

    return () => {
      console.log("🧹 Cleaning up voice session...");
      socketRef.current?.close();
      audioCtxRef.current?.close();
    };
  }, [recording]);

  return { messages };
}
