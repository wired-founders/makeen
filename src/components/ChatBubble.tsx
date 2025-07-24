// src\components\ChatBubble.tsx
import { Message } from "@/types/chat";
import { Bot, User, DollarSign, CheckCircle, XCircle } from "lucide-react";
import Image from "next/image";

type Props = {
  message: Message;
};

export default function ChatBubble({ message }: Props) {
  const isUser = message.sender === "user";

  // Generate timestamp
  const timestamp = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-3`}>
      <div
        className={`max-w-[75%] px-3 py-2 rounded-2xl text-sm border shadow-sm ${
          isUser
            ? "bg-blue-600 text-white border-blue-500 rounded-br-md"
            : "bg-gray-100 dark:bg-zinc-800 text-gray-800 dark:text-white border-gray-300 dark:border-white/10 rounded-bl-md"
        }`}
      >
        <div className="flex items-center gap-1 text-xs opacity-60">
          {isUser ? <User size={14} /> : <Bot size={14} />}
          {isUser ? "You" : "BookBot"}
        </div>

        {/* Optional image */}
        {message.type === "image" && message.file && (
          <Image
            src={URL.createObjectURL(message.file)}
            alt="Uploaded book"
            width={180}
            height={180}
            className="rounded-lg border"
          />
        )}

        {/* Typing bubble animation */}
        {message.type === "typing" ? (
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.2s]" />
            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.1s]" />
            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
          </div>
        ) : (
          <p className="whitespace-pre-wrap leading-snug text-sm">
            {message.content}
          </p>
        )}

        {/* Optional book result */}
        {message.result && (
          <div className="mt-2 text-sm text-left space-y-1 border-t pt-2 border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-200">
            <div>
              <strong>📖 Title:</strong> {message.result.title || "N/A"}
            </div>
            <div>
              <strong>✍️ Author:</strong> {message.result.author || "N/A"}
            </div>
            {message.result.isbn && (
              <div>
                <strong>🔢 ISBN:</strong> {message.result.isbn}
              </div>
            )}
            {message.result.price != null && (
              <div className="flex items-center gap-1">
                <DollarSign size={14} />
                {message.result.price.toFixed(2)}
              </div>
            )}
            {typeof message.result.available === "boolean" && (
              <div className="flex items-center gap-1">
                {message.result.available ? (
                  <CheckCircle className="text-green-600" size={16} />
                ) : (
                  <XCircle className="text-red-600" size={16} />
                )}
                {message.result.available
                  ? `In Stock (${message.result.stock ?? 0})`
                  : "Out of Stock"}
              </div>
            )}
          </div>
        )}

        {/* Timestamp */}
        <div className="text-xs text-right text-gray-400 dark:text-gray-500 pt-1">
          {timestamp}
        </div>
      </div>
    </div>
  );
}
