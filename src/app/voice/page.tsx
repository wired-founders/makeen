"use client";

import VoiceHeader from "./components/VoiceHeader";
import VoiceChatBox from "./components/VoiceChatBox";

export default function VoiceChatPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white flex flex-col">
      {/* Header */}
      <VoiceHeader />

      {/* Hero Section */}
      <section className="text-center px-6 sm:px-12 pt-28 pb-16">
        <h1 className="text-4xl sm:text-6xl font-bold leading-tight tracking-tight max-w-4xl mx-auto mb-6">
          Talk to Your AI Book Assistant
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-10">
          Ask questions about books, get reading suggestions, or find out more
          about your favorite authors — just talk!
        </p>
      </section>

      {/* Chat Section */}
      <section className="px-4 sm:px-8 pb-20 max-w-2xl mx-auto w-full">
        <VoiceChatBox />
      </section>
    </div>
  );
}
