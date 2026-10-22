"use client";

import React from "react";
import Skeleton from "@/components/Skeleton";

export default function SettingsSkeleton() {
  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-8 h-full animate-in fade-in duration-500">
      <div className="space-y-2">
        <Skeleton width={200} height={32} />
        <Skeleton width={300} height={20} />
      </div>

      {/* Profile Section Skeleton */}
      <div className="bg-white dark:bg-[#0D1910] border-2 border-[#08110A]/10 dark:border-white/10 shadow-[4px_4px_0px_#08110A] dark:shadow-[4px_4px_0px_rgba(255,255,255,0.08)] rounded-3xl p-6 sm:p-8">
        <Skeleton width={150} height={24} className="mb-6" />
        <div className="flex flex-col sm:flex-row gap-8 items-center mb-8">
          <Skeleton width={96} height={96} borderRadius="50%" />
          <div className="flex-grow w-full space-y-4">
            <div>
              <Skeleton width={100} height={12} className="mb-2" />
              <Skeleton width="100%" height={44} borderRadius={12} />
            </div>
            <div>
              <Skeleton width={100} height={12} className="mb-2" />
              <Skeleton width="100%" height={44} borderRadius={12} />
            </div>
          </div>
        </div>
        <div className="border-t border-[#08110A]/10 dark:border-white/10 pt-6">
          <Skeleton width={150} height={12} className="mb-2" />
          <Skeleton width="50%" height={44} borderRadius={12} />
        </div>
        <div className="mt-8 flex justify-end">
          <Skeleton width={140} height={44} borderRadius={24} />
        </div>
      </div>

      {/* Appearance Skeleton */}
      <div className="bg-white dark:bg-[#0D1910] border-2 border-[#08110A]/10 dark:border-white/10 shadow-[4px_4px_0px_#08110A] dark:shadow-[4px_4px_0px_rgba(255,255,255,0.08)] rounded-3xl p-6 sm:p-8 space-y-4">
        <Skeleton width={150} height={24} className="mb-6" />
        <div className="flex items-center justify-between p-4 border border-[#08110A]/10 dark:border-white/10 rounded-2xl">
          <div className="flex items-center gap-4">
            <Skeleton width={44} height={44} borderRadius={12} />
            <div className="space-y-1">
              <Skeleton width={100} height={16} />
              <Skeleton width={150} height={12} />
            </div>
          </div>
          <Skeleton width={52} height={28} borderRadius={16} />
        </div>
        <div className="flex items-center justify-between p-4 border border-[#08110A]/10 dark:border-white/10 rounded-2xl">
          <div className="flex items-center gap-4">
            <Skeleton width={44} height={44} borderRadius={12} />
            <div className="space-y-1">
              <Skeleton width={100} height={16} />
              <Skeleton width={150} height={12} />
            </div>
          </div>
          <Skeleton width={120} height={44} borderRadius={12} />
        </div>
      </div>

      {/* Categories Skeleton */}
      <div className="bg-white dark:bg-[#0D1910] border-2 border-[#08110A]/10 dark:border-white/10 shadow-[4px_4px_0px_#08110A] dark:shadow-[4px_4px_0px_rgba(255,255,255,0.08)] rounded-3xl p-6 sm:p-8">
        <div className="flex justify-between items-center mb-6">
          <Skeleton width={150} height={24} />
          <Skeleton width={120} height={40} borderRadius={20} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center justify-between p-3.5 border border-[#08110A]/10 dark:border-white/10 rounded-2xl">
              <div className="flex items-center gap-3">
                <Skeleton width={40} height={40} borderRadius={12} />
                <div className="space-y-1">
                  <Skeleton width={80} height={14} />
                  <Skeleton width={40} height={10} />
                </div>
              </div>
              <div className="flex gap-1">
                <Skeleton width={32} height={32} borderRadius={8} />
                <Skeleton width={32} height={32} borderRadius={8} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
