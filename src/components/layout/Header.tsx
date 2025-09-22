// src\components\layout\Header.tsx
import Link from "next/link";

export default function Header() {
  return (
    <header className="flex h-12 bg-white dark:bg-gray-900 shadow px-4 items-center">
      {/* Left */}
      <div className="text-lg font-bold">Kordor AI</div>

      {/* Middle */}
      <nav className="flex-1 flex justify-center space-x-6">
        <Link
          href="/makeen"
          className="text-gray-700 dark:text-gray-200 hover:underline"
        >
          Kordor Care
        </Link>
        <a
          href="#"
          className="text-gray-700 dark:text-gray-200 hover:underline"
        >
          Dashboard
        </a>
        <a
          href="#"
          className="text-gray-700 dark:text-gray-200 hover:underline"
        >
          Settings
        </a>
      </nav>

      {/* Right */}
      <div>
        <button className="text-sm px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded">
          Log in
        </button>
      </div>
    </header>
  );
}
