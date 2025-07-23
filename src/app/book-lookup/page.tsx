// src\app\book-lookup\page.tsx
"use client";

import ChatBotUI from "@/components/ChatBotUI";

export default function BookLookupPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-white py-10 px-4">
      <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
        <h1 className="text-2xl font-semibold text-gray-800 mb-3 flex items-center gap-2">
          📚 Book Lookup Assistant
        </h1>
        <p className="text-gray-600 text-sm mb-6">
          Ask about any book using text or an image. Our AI assistant will try to extract the title and author for you.
        </p>

        <ChatBotUI />
      </div>
    </div>
  );
}
