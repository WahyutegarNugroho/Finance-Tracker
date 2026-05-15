"use client";

import React from "react";
import Skeleton from "@/components/Skeleton";

export default function BudgetSkeleton() {
  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-500">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-5 w-64" />
        </div>
        <Skeleton className="h-11 w-40 rounded-lg" />
      </div>

      {/* Summary Card Skeleton */}
      <div className="glass-card rounded-xl p-8 h-44 flex flex-col justify-between">
        <div className="flex justify-between items-end">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-12 w-64" />
          </div>
          <div className="flex gap-8">
            <div className="flex flex-col items-end gap-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-8 w-32" />
            </div>
            <div className="flex flex-col items-end gap-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-8 w-20" />
            </div>
          </div>
        </div>
        <Skeleton className="h-4 w-full rounded-full" />
      </div>

      {/* Grid Header */}
      <Skeleton className="h-8 w-40" />

      {/* Category Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="glass-card rounded-xl p-5 h-48 flex flex-col justify-between">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-5 w-32" />
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-end">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-4 w-12" />
              </div>
              <Skeleton className="h-2 w-full rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
