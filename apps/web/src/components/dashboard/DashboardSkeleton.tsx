"use client";

import React from "react";
import Skeleton from "@/components/Skeleton";

export default function DashboardSkeleton() {
  return (
    <div className="max-w-[1440px] mx-auto animate-in fade-in duration-500">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
        <div className="space-y-2">
          <Skeleton width={200} height={32} />
          <Skeleton width={300} height={20} />
        </div>
        <Skeleton width={150} height={40} borderRadius={8} />
      </div>

      {/* Summary Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {/* Total Balance */}
        <div className="bg-surface border border-outline-variant/20 shadow-sm rounded-xl p-5 h-32 lg:col-span-2 flex flex-col justify-between">
          <div className="flex justify-between">
            <Skeleton width={100} height={16} />
            <Skeleton width={32} height={32} borderRadius={8} />
          </div>
          <div className="space-y-2">
            <Skeleton width="60%" height={24} />
            <Skeleton width="40%" height={12} />
          </div>
        </div>
        {/* Other 3 cards */}
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-surface border border-outline-variant/20 shadow-sm rounded-xl p-5 h-32 lg:col-span-1 flex flex-col justify-between">
            <div className="flex justify-between">
              <Skeleton width={100} height={16} />
              <Skeleton width={32} height={32} borderRadius={8} />
            </div>
            <div className="space-y-2">
              <Skeleton width="60%" height={24} />
              <Skeleton width="40%" height={12} />
            </div>
          </div>
        ))}
      </div>

      {/* Charts Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-surface border border-outline-variant/20 shadow-sm rounded-xl p-6 lg:col-span-2 h-[350px] flex flex-col">
          <div className="flex justify-between mb-8">
            <Skeleton width={150} height={24} />
            <Skeleton width={120} height={20} />
          </div>
          <div className="flex-1 flex items-end gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex-1 flex flex-col justify-end gap-2 h-full">
                <div className="flex gap-1 items-end h-[60%]">
                  <Skeleton width="40%" height="70%" />
                  <Skeleton width="40%" height="40%" />
                </div>
                <Skeleton width="100%" height={10} />
              </div>
            ))}
          </div>
        </div>
        <div className="bg-surface border border-outline-variant/20 shadow-sm rounded-xl p-6 h-[350px] flex flex-col items-center">
          <Skeleton width={150} height={24} className="self-start mb-10" />
          <div className="relative w-40 h-40 rounded-full border-[12px] border-surface-variant flex items-center justify-center">
             <Skeleton width={60} height={20} />
          </div>
          <div className="w-full mt-8 space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex justify-between">
                <div className="flex items-center gap-2">
                  <Skeleton width={10} height={10} borderRadius="50%" />
                  <Skeleton width={80} height={12} />
                </div>
                <Skeleton width={30} height={12} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Transactions Skeleton */}
      <div className="bg-surface border border-outline-variant/20 shadow-sm rounded-xl p-6">
        <div className="flex justify-between mb-6">
          <Skeleton width={180} height={24} />
          <Skeleton width={80} height={16} />
        </div>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center justify-between p-3 border border-outline-variant/10 rounded-lg">
              <div className="flex items-center gap-4">
                <Skeleton width={48} height={48} borderRadius={12} />
                <div className="space-y-2">
                  <Skeleton width={120} height={16} />
                  <Skeleton width={80} height={10} />
                </div>
              </div>
              <Skeleton width={70} height={16} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
