// src\components\CardSkeletonLoader.tsx
import React from "react";

export function CardSkeletonLoader({
  isLoading,
  children,
}: {
  isLoading: boolean;
  children: React.ReactNode;
}) {
  if (isLoading) {
    return (
      <div className="p-6 rounded-xl border shadow-sm max-w-md bg-muted/10">
        <div className="h-20 w-full bg-muted animate-pulse rounded" />
      </div>
    );
  }

  return (
    <div className="p-6 rounded-xl border shadow-sm max-w-md bg-muted/10">
      {children}
    </div>
  );
}
