// src\hooks\useProgressLoader.ts
import { useEffect, useState } from "react";

export function useProgressLoader(active: boolean) {
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!active) {
      setProgress(0);
      setLoading(false);
      return;
    }

    setLoading(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setLoading(false);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [active]);

  return { loading, progress };
}
