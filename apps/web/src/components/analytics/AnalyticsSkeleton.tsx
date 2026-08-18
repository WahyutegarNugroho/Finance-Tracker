"use client";

import React from "react";
import Skeleton from "@/components/Skeleton";

export default function AnalyticsSkeleton() {
  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-500">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Balance */}
        <div className="bg-surface border border-outline-variant/20 shadow-sm rounded-xl p-6 md:col-span-3 h-28 flex justify-between items-center">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-40" />
            <Skeleton className="h-3 w-32" />
          </div>
          <Skeleton className="h-12 w-12 rounded-full" />
        </div>
        {/* Income */}
        <div className="bg-surface border border-outline-variant/20 shadow-sm rounded-xl p-5 md:col-span-1 h-32 flex flex-col justify-between">
          <div className="flex justify-between items-center">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-3 w-32" />
        </div>
        {/* Expense */}
        <div className="bg-surface border border-outline-variant/20 shadow-sm rounded-xl p-5 md:col-span-2 h-32 flex flex-col justify-between">
          <div className="flex justify-between items-center">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-3 w-32" />
        </div>
      </div>

      {/* Trend Chart Skeleton */}
      <div className="bg-surface border border-outline-variant/20 shadow-sm rounded-xl p-6 h-[400px] flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-6 w-48" />
          <div className="flex gap-4">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
        <Skeleton className="flex-1 w-full rounded-lg" />
      </div>

      {/* Bottom Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {[1, 2].map((i) => (
          <div key={i} className="bg-surface border border-outline-variant/20 shadow-sm rounded-xl p-6 h-[300px] flex flex-col gap-6">
            <Skeleton className="h-6 w-40" />
            <div className="flex gap-8 items-center justify-center h-full">
              <Skeleton className="h-40 w-40 rounded-full" />
              <div className="flex flex-col gap-3 flex-1">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
