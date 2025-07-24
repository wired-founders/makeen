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
  const scrollRef = useRef<HTMLDivElement>(null);

  // Welcome message on mount
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

  // Auto-scroll to bottom
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async (msg: Omit<Message, "id">) => {
    if (loading) return; // 🛑 Prevent spam clicks

    const userMsg: Message = { ...msg, id: crypto.randomUUID() };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    // Show fake typing bubble
    const typingMsg: Message = {
      id: "typing",
      sender: "bot",
      type: "typing",
      content: "",
    };
    setMessages((prev) => [...prev, typingMsg]);

    try {
      let sessionId = localStorage.getItem("chat_session_id");
      if (!sessionId) {
        sessionId = crypto.randomUUID();
        localStorage.setItem("chat_session_id", sessionId);
        await fetch("/api/session-init", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        });
      }

      const formData = new FormData();
      formData.append("message", msg.content.trim());
      formData.append("sessionId", sessionId);
      if (msg.file) formData.append("file", msg.file);

      const response = await fetch("http://localhost:4000/api/chat", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      const replyText = data.replies?.[0]?.reply || "🤖 No response received.";

      // Remove typing bubble before adding actual reply
      setMessages((prev) => [...prev].filter((m) => m.id !== "typing"));

      const botMsg: Message = {
        id: crypto.randomUUID(),
        sender: "bot",
        type: "text",
        content: replyText,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      console.error("❌ Failed to send message to backend:", error);
      // Remove typing bubble
      setMessages((prev) => [...prev].filter((m) => m.id !== "typing"));

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
    <div className="flex flex-col h-full space-y-2 text-sm">
      {/* Chat area */}
      <div className="flex-1 overflow-y-auto rounded-lg p-3 bg-white dark:bg-zinc-900 scroll-smooth">
        {messages.map((msg) => (
          <ChatBubble key={msg.id} message={msg} />
        ))}
        <div ref={scrollRef} />
      </div>

      {/* Input */}
      <div className="border-t pt-2 dark:border-white/10">
        <ChatInput onSend={handleSend} fileInputRef={fileInputRef} />
      </div>
    </div>
  );
}
