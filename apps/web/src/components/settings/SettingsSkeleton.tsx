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
      <div className="glass-card rounded-xl p-6">
        <Skeleton width={150} height={24} className="mb-6" />
        <div className="flex flex-col sm:flex-row gap-8 items-center mb-8">
          <Skeleton width={96} height={96} borderRadius="50%" />
          <div className="flex-grow w-full space-y-4">
            <div>
              <Skeleton width={100} height={12} className="mb-2" />
              <Skeleton width="100%" height={40} borderRadius={8} />
            </div>
            <div>
              <Skeleton width={100} height={12} className="mb-2" />
              <Skeleton width="100%" height={40} borderRadius={8} />
            </div>
          </div>
        </div>
        <div className="border-t border-outline-variant/10 pt-6">
          <Skeleton width={150} height={12} className="mb-2" />
          <Skeleton width="50%" height={48} borderRadius={8} />
        </div>
        <div className="mt-8 flex justify-end">
          <Skeleton width={140} height={44} borderRadius={8} />
        </div>
      </div>

      {/* Appearance Skeleton */}
      <div className="glass-card rounded-xl p-6 space-y-4">
        <Skeleton width={150} height={24} className="mb-6" />
        <div className="flex items-center justify-between p-4 border border-outline-variant/10 rounded-lg">
          <div className="flex items-center gap-4">
            <Skeleton width={40} height={40} borderRadius="50%" />
            <div className="space-y-1">
              <Skeleton width={100} height={16} />
              <Skeleton width={150} height={12} />
            </div>
          </div>
          <Skeleton width={44} height={24} borderRadius={12} />
        </div>
        <div className="flex items-center justify-between p-4 border border-outline-variant/10 rounded-lg">
          <div className="flex items-center gap-4">
            <Skeleton width={40} height={40} borderRadius="50%" />
            <div className="space-y-1">
              <Skeleton width={100} height={16} />
              <Skeleton width={150} height={12} />
            </div>
          </div>
          <Skeleton width={120} height={36} borderRadius={8} />
        </div>
      </div>

      {/* Categories Skeleton */}
      <div className="glass-card rounded-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <Skeleton width={150} height={24} />
          <Skeleton width={100} height={32} borderRadius={8} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center justify-between p-3 border border-outline-variant/10 rounded-lg">
              <div className="flex items-center gap-3">
                <Skeleton width={40} height={40} borderRadius={8} />
                <div className="space-y-1">
                  <Skeleton width={80} height={14} />
                  <Skeleton width={40} height={10} />
                </div>
              </div>
              <div className="flex gap-1">
                <Skeleton width={24} height={24} borderRadius={4} />
                <Skeleton width={24} height={24} borderRadius={4} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
