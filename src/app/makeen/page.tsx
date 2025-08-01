// src\app\makeen\page.tsx
"use client";

import Image from "next/image";
import ChatPopup from "@/components/ChatPopup";

const featuredBooks = [
  {
    title: "The Psychology of Money",
    image: "/books/psychology-of-money.jpg",
    price: "$14.99",
  },
  {
    title: "Atomic Habits",
    image: "/books/atomic-habits.jpg",
    price: "$18.50",
  },
  {
    title: "Deep Work",
    image: "/books/deep-work.jpg",
    price: "$12.00",
  },
];

export default function BookLookupPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-black text-black dark:text-white font-sans">
      <ChatPopup />

      {/* Hero Section */}
      <section className="text-center py-24 px-6 sm:px-12">
        <h1 className="text-5xl sm:text-6xl font-bold tracking-tight leading-tight mb-6">
          Discover Books That Inspire
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-xl mx-auto mb-8">
          Curated reads to spark your curiosity, ambition, and growth.
        </p>
        <a
          href="#featured"
          className="inline-block bg-black text-white dark:bg-white dark:text-black px-6 py-3 rounded-full text-sm font-semibold hover:opacity-90 transition"
        >
          Browse Collection
        </a>
      </section>

      {/* Featured Books */}
      <section
        id="featured"
        className="py-16 px-4 sm:px-12 bg-gray-50 dark:bg-[#111]"
      >
        <h2 className="text-2xl font-semibold mb-10 text-center">
          Featured Books
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 md:gap-10 max-w-6xl mx-auto">
          {featuredBooks.map((book, index) => (
            <div
              key={index}
              className="border border-gray-200 dark:border-white/10 rounded-xl p-4 flex flex-col items-center shadow hover:shadow-lg transition bg-white dark:bg-zinc-900"
            >
              <Image
                src={book.image}
                alt={book.title}
                width={160}
                height={240}
                className="rounded mb-4 object-cover transition-transform hover:scale-105"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/fallback.jpg";
                }}
              />
              <h3 className="text-lg font-medium mb-1 text-center">
                {book.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {book.price}
              </p>
              <button className="mt-4 px-4 py-2 bg-black text-white dark:bg-white dark:text-black rounded-full text-sm font-semibold hover:opacity-90">
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-6 text-center text-sm text-gray-500 dark:text-gray-400">
        © {new Date().getFullYear()} Makeen Books. All rights reserved.
      </footer>
    </div>
  );
}
