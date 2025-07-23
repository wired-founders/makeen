// src\components\ChatBubble.tsx
import { Message } from "@/types/chat";
import { Bot, User, DollarSign, CheckCircle, XCircle } from "lucide-react";
import Image from "next/image";

type Props = {
  message: Message;
};

export default function ChatBubble({ message }: Props) {
  const isUser = message.sender === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-2`}>
      <div
        className={`max-w-[75%] p-3 rounded-xl text-sm shadow-sm border ${
          isUser
            ? "bg-blue-600 text-white border-blue-500 rounded-br-sm"
            : "bg-gray-100 text-gray-800 border-gray-300 rounded-bl-sm"
        }`}
      >
        <div className="mb-1 flex items-center gap-1 text-xs opacity-70">
          {isUser ? <User size={14} /> : <Bot size={14} />}
          {isUser ? "You" : "Makeen"}
        </div>

        {message.type === "image" && message.file && (
          <div className="mb-2">
            <Image
              src={URL.createObjectURL(message.file)}
              alt="Uploaded book"
              width={180}
              height={180}
              className="rounded-lg border"
            />
          </div>
        )}

        <p className="leading-relaxed whitespace-pre-wrap">{message.content}</p>

        {message.result && (
          <div className="mt-3 text-sm text-left space-y-1 border-t pt-2 border-gray-300">
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
                  ? `Available (${message.result.stock ?? 0} copies)`
                  : "Out of Stock"}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
