// src/utils/handleSocketMessage.ts
import type { Message } from "@/app/voice/types/voice-types";

type ReplyMessage = {
  type: "reply";
  transcript: string;
  reply: string;
};

function isReplyMessage(v: unknown): v is ReplyMessage {
  if (!v || typeof v !== "object") return false;
  const o = v as Record<string, unknown>;
  return (
    o.type === "reply" &&
    typeof o.transcript === "string" &&
    typeof o.reply === "string"
  );
}

export function handleSocketMessage(
  json: unknown,
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>
) {
  if (isReplyMessage(json)) {
    const { transcript, reply } = json;
    setMessages((prev) => [
      ...prev,
      { type: "user", content: transcript },
      { type: "bot", content: reply },
    ]);
  }
}
