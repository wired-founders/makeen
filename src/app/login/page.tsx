// src\app\login\page.tsx
"use client";
import "boxicons/css/boxicons.min.css";
import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[url('/brick-bgg.png')] bg-cover bg-center px-4">

      {/* 🪔 Lamp image */}
      <Image
        src="/lamp.png"
        alt="Lamp"
        width={120}
        height={120}
        className="absolute top-[-20px] left-1/2 -translate-x-1/2 z-20 pointer-events-none object-contain"
      />

      {/* 🔽 Light rays down the card */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[300px] h-[500px] bg-gradient-to-b from-yellow-200/30 to-transparent blur-[80px] opacity-80 z-0" />

      {/* 🔆 Lamp glow (flicker) */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full bg-gradient-to-b from-yellow-200/80 to-transparent blur-[100px] z-0 animate-flicker" />

      {/* 🧊 Login card */}
      <div className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-md border border-white/20 shadow-[0_0_80px_rgba(255,255,150,0.08)] rounded-2xl p-8 text-white">
        <form>
          <h1 className="text-3xl font-bold text-center mb-6">Login</h1>

          <div className="relative mb-6">
            <input
              type="text"
              placeholder="Username"
              required
              className="w-full py-3 px-5 pr-12 rounded-full border border-white/20 bg-transparent text-white placeholder-white focus:outline-none"
            />
            <i className="bx bxs-user absolute right-5 top-1/2 -translate-y-1/2 text-white text-lg" />
          </div>

          <div className="relative mb-6">
            <input
              type="password"
              placeholder="Password"
              required
              className="w-full py-3 px-5 pr-12 rounded-full border border-white/20 bg-transparent text-white placeholder-white focus:outline-none"
            />
            <i className="bx bxs-lock-alt absolute right-5 top-1/2 -translate-y-1/2 text-white text-lg" />
          </div>

          <div className="flex justify-between text-sm mb-6">
            <label className="flex items-center gap-1">
              <input type="checkbox" className="accent-white" />
              Remember me
            </label>
            <a href="#" className="hover:underline">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-full bg-white text-gray-800 font-semibold hover:bg-gray-200 transition"
          >
            Login
          </button>

          <div className="text-center text-sm mt-6">
            <p>
              Don&apos;t have an account?{" "}
              <a href="#" className="font-semibold underline">
                Register
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
