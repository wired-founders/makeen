// src\app\voice\hooks\useVoiceChat.ts
import { useEffect, useRef, useState } from "react";
import { BACKEND_URL } from "@/config/env";
import { setupWebSocket } from "@/utils/setupWebSocket";
import { handleSocketMessage } from "@/utils/handleSocketMessage";
import { Message } from "../types/voice-types";
import { playBase64Audio } from "@/utils/playBase64Audio";
import { playAudioChunk } from "@/utils/playAudioChunk";

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
        audioRef.current = new Audio();
        audioRef.current.autoplay = true;

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
          if (event.data instanceof ArrayBuffer) {
            // ✅ Directly stream ArrayBuffer

            playAudioChunk(event.data);
          } else if (event.data instanceof Blob) {
            // ✅ Convert Blob → ArrayBuffer → stream
            console.log("🔊 Received audio blob:", event.data.size, "bytes");
            event.data
              .arrayBuffer()
              .then((buffer) => {
                playAudioChunk(buffer); // ← real-time streaming
              })
              .catch((err) => {
                console.error("❌ Blob processing failed:", err);
              });
          } else if (typeof event.data === "string") {
            try {
              const json = JSON.parse(event.data);

              if (json.type === "reply") {
                handleSocketMessage(json, setMessages);
              } else if (json.type === "audio") {
                playBase64Audio(json.data, audioRef.current);
                const binary = atob(json.data);
                const buffer = new Uint8Array(binary.length);
                for (let i = 0; i < binary.length; i++) {
                  buffer[i] = binary.charCodeAt(i);
                }
                playAudioChunk(buffer.buffer, audioRef.current!); // ✅
              }
            } catch (err) {
              console.error("❌ JSON parse failed:", event.data, err);
            }
          } else {
            console.warn("❓ Unknown data type:", event.data);
          }
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
