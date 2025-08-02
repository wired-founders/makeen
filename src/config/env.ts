// src\config\env.ts

function getEnvVar(key: string, fallback?: string): string {
  const value = process.env[key] || fallback;
  if (!value) {
    throw new Error(`❌ Missing environment variable: ${key}`);
  }
  return value;
}

// 🔐 Server-side secrets

// 🌐 Public (must start with NEXT_PUBLIC_)
export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
export const IPINFO_TOKEN = process.env.IPINFO_TOKEN;
export const DATABASE_URL = process.env.DATABASE_URL;
export const DEEPGRAM_API_KEY = process.env.DEEPGRAM_API_KEY;
