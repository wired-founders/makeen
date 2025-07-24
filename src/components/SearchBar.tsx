"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { mockBooks } from "@/data/mockBooks";

export default function SearchBar() {
  const [search, setSearch] = useState("");
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const filteredBooks = search
    ? mockBooks.filter((book) =>
        book.title.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        listRef.current &&
        !listRef.current.contains(e.target as Node) &&
        !inputRef.current?.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
        setHighlightIndex(-1);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!filteredBooks.length) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIndex((prev) => (prev + 1) % filteredBooks.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIndex((prev) =>
        prev <= 0 ? filteredBooks.length - 1 : prev - 1
      );
    } else if (e.key === "Enter" && highlightIndex >= 0) {
      setSearch(filteredBooks[highlightIndex].title);
      setShowSuggestions(false);
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
      setHighlightIndex(-1);
    }
  };

  return (
    <div className="relative flex flex-1 max-w-2xl w-full border rounded overflow-hidden text-sm shadow-sm">
      <button className="flex items-center px-3 bg-gray-100 dark:bg-zinc-800 border-r text-gray-600 dark:text-gray-300">
        Categories <ChevronDown size={14} className="ml-1" />
      </button>
      <input
        ref={inputRef}
        type="text"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setHighlightIndex(-1);
          setShowSuggestions(true);
        }}
        onKeyDown={handleKeyDown}
        placeholder="I am shopping for..."
        className="flex-1 px-3 py-2 outline-none bg-white dark:bg-zinc-900"
      />
      <button className="bg-[#2e2f6e] text-white px-4 py-2">
        🔍 Search
      </button>

      {showSuggestions && filteredBooks.length > 0 && (
        <ul
          ref={listRef}
          className="absolute top-full mt-1 left-0 w-full bg-white dark:bg-zinc-900 shadow-md border border-gray-200 dark:border-white/10 rounded z-50 text-sm max-h-60 overflow-y-auto"
        >
          {filteredBooks.map((book, i) => (
            <li
              key={i}
              className={`px-4 py-2 cursor-pointer ${
                highlightIndex === i
                  ? "bg-blue-100 dark:bg-zinc-800"
                  : "hover:bg-gray-100 dark:hover:bg-zinc-800"
              }`}
              onClick={() => {
                setSearch(book.title);
                setShowSuggestions(false);
              }}
            >
              {book.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
