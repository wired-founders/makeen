// src\utils\handleVoiceSocketMessage.ts
import { playBase64Audio } from "./playBase64Audio";
import { playAudioChunk } from "./playAudioChunk";
import { handleSocketMessage } from "@/utils/handleSocketMessage";
import { Dispatch, SetStateAction } from "react";
import { Message } from "@/app/voice/types/voice-types";

export function handleVoiceSocketMessage(
  event: MessageEvent,
  audioRef: HTMLAudioElement | null,
  setMessages: Dispatch<SetStateAction<Message[]>>
) {
  try {
    if (event.data instanceof ArrayBuffer) {
      console.log("🔊 Handling ArrayBuffer audio chunk");
      playAudioChunk(event.data);
      return;
    }

    if (event.data instanceof Blob) {
      console.log("🧩 Received audio blob:", event.data.size, "bytes");
      event.data
        .arrayBuffer()
        .then((buffer) => {
          playAudioChunk(buffer);
        })
        .catch((err) => {
          console.error("❌ Blob processing failed:", err);
        });
      return;
    }

    if (typeof event.data === "string") {
      const json = JSON.parse(event.data);

      if (json.type === "reply") {
        console.log("💬 Handling bot reply");
        handleSocketMessage(json, setMessages);
        return;
      }

      if (json.type === "audio") {
        console.log("🎧 Playing base64 audio");
        playBase64Audio(json.data, audioRef);
        // ❌ comment out this redundant decoding
        // const binary = atob(json.data);
        // const buffer = new Uint8Array(binary.length);
        // for (let i = 0; i < binary.length; i++) {
        //   buffer[i] = binary.charCodeAt(i);
        // }
        // playAudioChunk(buffer.buffer);
        return;
      }
    }

    console.warn("⚠️ Unknown message type:", typeof event.data);
  } catch (err) {
    console.error("❌ WS message handling error:", err);
  }
}
