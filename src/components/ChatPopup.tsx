// src\components\ChatPopup.tsx
"use client";

import { useState } from "react";
import { X, MessageCircle } from "lucide-react";
import ChatBotUI from "./ChatBotUI";
import clsx from "clsx";

export default function ChatPopup() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:opacity-90"
      >
        {isOpen ? <X size={20} /> : <MessageCircle size={20} />}
      </button>

      {/* Chat Panel with glow animation on open */}
      {isOpen && (
        <div
          className={clsx(
            "fixed bottom-20 right-6 w-[350px] max-w-[90vw] h-[500px] rounded-2xl shadow-2xl overflow-hidden z-50 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-white/10 flex flex-col",
            "animate-popup-glow"
          )}
        >
          <div className="bg-zinc-100 dark:bg-zinc-800 text-sm font-medium text-zinc-900 dark:text-white px-4 py-3 flex justify-between items-center">
            <span className="flex items-center gap-2">
              <span>📚 BookBot</span>
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-zinc-500 hover:text-red-500"
            >
              <X size={18} />
            </button>
          </div>
          <div className="flex-1 overflow-hidden p-2">
            <ChatBotUI />
          </div>
        </div>
      )}
    </>
  );
}
