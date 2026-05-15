"use client";

import React from "react";
import Skeleton from "@/components/Skeleton";

export default function TransactionsSkeleton() {
  return (
    <div className="max-w-[1440px] mx-auto animate-in fade-in duration-500">
      {/* Header Skeleton */}
      <div className="mb-8">
        <Skeleton width={250} height={32} className="mb-2" />
        <Skeleton width={350} height={20} />
      </div>

      {/* Filter Bar Skeleton */}
      <div className="bg-surface/80 backdrop-blur-[12px] border border-white/10 rounded-xl p-4 mb-6 flex flex-col lg:flex-row gap-4 justify-between items-center">
        <Skeleton width="100%" height={40} className="lg:w-96" borderRadius={8} />
        <div className="flex gap-3 w-full lg:w-auto">
          <Skeleton width={120} height={40} borderRadius={8} />
          <Skeleton width={150} height={40} borderRadius={8} className="ml-auto lg:ml-0" />
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="bg-surface/80 backdrop-blur-[12px] border border-white/10 rounded-xl shadow-sm overflow-hidden min-h-[400px]">
        <div className="p-6 border-b border-outline-variant/10">
          <div className="grid grid-cols-6 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} width="100%" height={16} />
            ))}
          </div>
        </div>
        <div className="p-6 space-y-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="grid grid-cols-6 gap-4 items-center">
              <Skeleton width="80%" height={14} />
              <div className="flex items-center gap-2">
                <Skeleton width={32} height={32} borderRadius="50%" />
                <Skeleton width="60%" height={14} />
              </div>
              <Skeleton width="90%" height={14} />
              <Skeleton width="50%" height={14} className="ml-auto" />
              <Skeleton width={60} height={20} borderRadius={4} className="mx-auto" />
              <Skeleton width={24} height={24} borderRadius="50%" className="ml-auto" />
            </div>
          ))}
        </div>
        {/* Pagination Skeleton */}
        <div className="p-6 border-t border-outline-variant/10 flex justify-between items-center">
          <Skeleton width={200} height={16} />
          <div className="flex gap-2">
            <Skeleton width={32} height={32} borderRadius={6} />
            <Skeleton width={32} height={32} borderRadius={6} />
            <Skeleton width={32} height={32} borderRadius={6} />
          </div>
        </div>
      </div>
    </div>
  );
}
