"use client";

import Link from "next/link";
import Image from "next/image";
import SearchBar from "./SearchBar";
import {
  ShoppingCart,
  LogIn,
  Moon,
  Sun,
  ChevronDown,
  Mail,
  Phone,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";

export default function Header() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  return (
    <header className="sticky top-0 z-50 w-full shadow bg-[#2e2f6e] text-white">
      {/* Top Contact Row */}
      <div className="flex justify-end items-center px-4 py-1 text-xs gap-4">
        <div className="flex items-center gap-1">
          <Mail size={14} /> info@makeenbooks.com
        </div>
        <div className="flex items-center gap-1">
          <Phone size={14} /> (94) 772560087
        </div>
        <div className="flex items-center gap-1">
          <LogIn size={14} />
          <span>My Account</span>
          <ChevronDown size={14} />
        </div>
      </div>

      {/* Main Row */}
      <div className="bg-white dark:bg-black px-4 sm:px-8 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-black dark:text-white relative">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="MakeenBooks"
            width={40}
            height={40}
            className="rounded"
          />
          <Link
            href="/"
            className="text-lg font-bold tracking-tight text-[#2e2f6e] dark:text-white"
          >
            MAKEEN <span className="text-xs block -mt-1">BOOKS</span>
          </Link>
        </div>

        {/* SearchBar */}
        <SearchBar />

        {/* Icons */}
        <div className="flex items-center gap-3 text-sm">
          <button className="flex items-center gap-1 hover:opacity-80">
            🛒 <span>My Cart</span>
            <span className="ml-1 text-red-500 text-xs">(0)</span>
          </button>

          <button
            onClick={toggleTheme}
            className="p-2 hover:opacity-80"
            title="Toggle Dark Mode"
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </div>
    </header>
  );
}
