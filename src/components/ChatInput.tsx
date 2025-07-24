// src\components\ChatInput.tsx
"use client";

import { Send, UploadCloud, X } from "lucide-react";
import { useState } from "react";
import type { Message } from "@/types/chat";
import type { RefObject } from "react";

type Props = {
  onSend: (msg: Omit<Message, "id">) => void;
  fileInputRef: RefObject<HTMLInputElement | null>;
};

export default function ChatInput({ onSend, fileInputRef }: Props) {
  const [input, setInput] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed && !file) return;

    onSend({
      sender: "user",
      type: file && trimmed ? "both" : file ? "image" : "text",
      content: trimmed,
      file: file ?? undefined, // ✅ fix type error
    });

    setInput("");
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        {/* Upload Icon */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="text-gray-500 hover:text-blue-600 p-2 rounded hover:bg-gray-100"
          title="Upload image"
        >
          <UploadCloud size={18} />
        </button>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const selected = e.target.files?.[0];
            if (selected) setFile(selected);
          }}
        />

        {/* Text Input */}
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !file) handleSend();
          }}
          placeholder="Type a book name or upload image..."
          className="flex-1 text-sm border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Send Button */}
        <button
          onClick={handleSend}
          className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:bg-gray-300"
          disabled={!input.trim() && !file}
          title="Send"
        >
          <Send size={16} />
        </button>
      </div>

      {/* File Preview */}
      {file && (
        <div className="text-xs text-gray-500 flex items-center gap-2 pl-2">
          📎 <span className="truncate">{file.name}</span>
          <button
            onClick={() => {
              setFile(null);
              if (fileInputRef.current) fileInputRef.current.value = "";
            }}
            className="hover:text-red-500"
            title="Remove file"
          >
            <X size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
