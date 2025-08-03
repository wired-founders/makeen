// src\utils\handleSocketMessage.ts
import type { Message } from "@/app/voice/types/voice-types";

export function handleSocketMessage(
  json: any,
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>
) {
  if (json?.type === "reply") {
    const { transcript, reply } = json;
    setMessages((prev) => [
      ...prev,
      { type: "user", content: transcript },
      { type: "bot", content: reply },
    ]);
  }
}
