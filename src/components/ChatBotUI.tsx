// src\components\ChatBotUI.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import ChatBubble from "./ChatBubble";
import ChatInput from "./ChatInput";
import type { Message } from "@/types/chat";

export default function ChatBotUI() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 👋 Welcome message on mount
  useEffect(() => {
    setMessages([
      {
        id: crypto.randomUUID(),
        sender: "bot",
        type: "text",
        content:
          "👋 Hi! I'm BookBot. Ask me about a book by typing or uploading an image.",
      },
    ]);
  }, []);

  const handleSend = async (msg: Omit<Message, "id">) => {
    const userMsg: Message = { ...msg, id: crypto.randomUUID() };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      // ✅ Step 1: Get or create session ID
      let sessionId = localStorage.getItem("chat_session_id");
      if (!sessionId) {
        sessionId = crypto.randomUUID();
        localStorage.setItem("chat_session_id", sessionId);

        // (Optional) notify backend
        await fetch("/api/session-init", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        });
      }

      // ✅ Step 2: Build form data
      const formData = new FormData();
      formData.append("message", msg.content.trim());
      formData.append("sessionId", sessionId);

      if (msg.file) {
        formData.append("file", msg.file);
      }

      // ✅ Step 3: Send request
      const response = await fetch("http://localhost:4000/api/chat", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      const replyText = data.replies?.[0]?.reply || "🤖 No response received.";

      const botMsg: Message = {
        id: crypto.randomUUID(),
        sender: "bot",
        type: "text",
        content: replyText,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          sender: "bot",
          type: "text",
          content: "⚠️ Network or server error. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3 text-sm">
      <div className="h-64 overflow-y-auto border rounded-md p-3 bg-gray-50 space-y-2 scroll-smooth">
        {messages.map((msg) => (
          <ChatBubble key={msg.id} message={msg} />
        ))}
        {loading && (
          <p className="text-gray-400 text-xs italic">Bot is thinking...</p>
        )}
      </div>
      <ChatInput onSend={handleSend} fileInputRef={fileInputRef} />
    </div>
  );
}
