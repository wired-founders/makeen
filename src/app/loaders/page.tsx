// src\app\loaders\page.tsx
// src\app\page.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useProgressLoader } from "@/hooks/useProgressLoader";
import { CardSkeletonLoader } from "@/components/CardSkeletonLoader";
import { SubmitButtonWithLoader } from "@/components/SubmitButtonWithLoader";

type Mode = "none" | "initial" | "route" | "card" | "submit" | "async";

export default function HomePage() {
  const [mode, setMode] = useState<Mode>("none");
  const [initialLoading, setInitialLoading] = useState(false);
  const [localLoading, setLocalLoading] = useState(false);
  const [asyncLoading, setAsyncLoading] = useState(false);

  const { loading, progress } = useProgressLoader(mode === "route");

  // Handle "initial" full-screen loader
  useEffect(() => {
    if (mode === "initial") {
      setInitialLoading(true);
      const timeout = setTimeout(() => setInitialLoading(false), 2000);
      return () => clearTimeout(timeout);
    }
  }, [mode]);

  // Handle async mode separately
  useEffect(() => {
    if (mode === "async") {
      setAsyncLoading(true);
      const timeout = setTimeout(() => setAsyncLoading(false), 2000);
      return () => clearTimeout(timeout);
    }
  }, [mode]);

  return (
    <main className="min-h-screen bg-background text-foreground px-6 py-10">
      <div className="max-w-4xl mx-auto space-y-10">
        <header className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">
            🔄 Loading Screen Explorer
          </h1>
          <p className="text-muted-foreground">
            Test different types of loading states you might use in a modern
            SaaS UI.
          </p>
        </header>

        {/* Mode Selector */}
        <div className="flex flex-wrap gap-2">
          {["initial", "route", "card", "submit", "async", "none"].map((m) => (
            <Button
              key={m}
              variant={mode === m ? "default" : "secondary"}
              onClick={() => {
                // Reset all loading states to ensure clean rerender
                setInitialLoading(false);
                setLocalLoading(false);
                setAsyncLoading(false);

                if (m === "card" || m === "submit") {
                  // force rerender by clearing mode first
                  setMode("none");
                  setTimeout(() => {
                    setMode(m as Mode);
                    setLocalLoading(true);
                    setTimeout(() => setLocalLoading(false), 2000);
                  }, 10);
                } else if (m === "async") {
                  setMode(m as Mode);
                  setAsyncLoading(true);
                  setTimeout(() => setAsyncLoading(false), 2000);
                } else if (m === "initial") {
                  setMode(m as Mode);
                  setInitialLoading(true);
                  setTimeout(() => setInitialLoading(false), 2000);
                } else {
                  setMode(m as Mode); // fallback for "none" or "route"
                }
              }}
              className="capitalize"
            >
              {m}
            </Button>
          ))}
        </div>

        <section className="space-y-6 pt-6">
          {/* Full-screen Initial Logo Loader */}
          {mode === "initial" && initialLoading && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-zinc-950">
              <Image
                src="/logo-kordor.svg"
                alt="Loading..."
                width={100}
                height={100}
                className="animate-bounce"
              />
            </div>
          )}

          {/* Route Progress Bar */}
          {mode === "route" && loading && (
            <div className="w-full h-2 bg-gray-200 rounded overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}

          {/* Card Skeleton Loader */}
          {mode === "card" && (
            <CardSkeletonLoader isLoading={localLoading}>
              <p className="text-sm text-muted-foreground">
                ✅ This card content loaded successfully.
              </p>
            </CardSkeletonLoader>
          )}

          {/* Submit Button Loader */}
          {mode === "submit" && (
            <SubmitButtonWithLoader
              isLoading={localLoading}
              onClick={() => {
                setLocalLoading(true);
                setTimeout(() => setLocalLoading(false), 2000);
              }}
            />
          )}

          {/* Async Feature Loader */}
          {mode === "async" && (
            <div className="p-6 rounded-xl border shadow-sm max-w-md bg-muted/10">
              {asyncLoading ? (
                <p className="text-sm text-muted-foreground">
                  ⏳ Loading async feature...
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  ✅ Async feature loaded!
                </p>
              )}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
