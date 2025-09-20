// src\app\voice\hooks\useVoiceChat.ts
import { useEffect, useRef, useState } from "react";
import { BACKEND_URL } from "@/config/env";
import { setupWebSocket } from "@/utils/setupWebSocket";
import { Message } from "../types/voice-types";

import { handleVoiceSocketMessage } from "@/utils/handleVoiceSocketMessage";

export function useVoiceChat(recording: boolean) {
  const [messages, setMessages] = useState<Message[]>([]);
  const socketRef = useRef<WebSocket | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Uint8Array[]>([]);

  useEffect(() => {
    if (!recording) return;

    const start = async () => {
      try {
        const socket = setupWebSocket(
          `${BACKEND_URL.replace(/^http/, "ws")}/voice/deepgram-stream`
        );
        socketRef.current = socket;

        // Simple audio element for playback

        socket.onopen = async () => {
          const stream = await navigator.mediaDevices.getUserMedia({
            audio: {
              sampleRate: 16000,
              channelCount: 1,
              echoCancellation: true,
              noiseSuppression: true,
            },
          });
          streamRef.current = stream;

          const audioCtx = new AudioContext({ sampleRate: 16000 });
          audioCtxRef.current = audioCtx;

          await audioCtx.audioWorklet.addModule("/mic-processor.js");

          const source = audioCtx.createMediaStreamSource(stream);
          const micNode = new AudioWorkletNode(audioCtx, "mic-processor");

          micNode.port.onmessage = (e) => {
            const { audio } = e.data;

            if (socket.readyState === WebSocket.OPEN && audio.byteLength > 0) {
              socket.send(audio);
            }
          };

          source.connect(micNode);
        };

        socket.onmessage = (event) => {
          handleVoiceSocketMessage(event, audioRef.current, setMessages);
        };

        socket.onerror = (err) => {
          console.error("❌ WebSocket error details:", {
            error: err,
            readyState: socket.readyState,
            url: socket.url,
          });
        };

        socket.onclose = (event) => {
          console.log("🔴 WebSocket closed:", {
            code: event.code,
            reason: event.reason,
            wasClean: event.wasClean,
          });
        };
      } catch (err) {
        console.error("❌ Voice chat setup failed:", err);
      }
    };

    start();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }

      socketRef.current?.close();
      audioCtxRef.current?.close();

      if (audioRef.current) {
        audioRef.current.pause();
        if (audioRef.current.src) {
          URL.revokeObjectURL(audioRef.current.src);
        }
      }
      // Clear refs
      streamRef.current = null;
      socketRef.current = null;
      audioCtxRef.current = null;
      audioRef.current = null;
      audioChunksRef.current = [];
    };
  }, [recording]);

  return { messages };
}
