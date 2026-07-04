"use client";

import React from "react";

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
}

// ponytail: inline style sizing → accept Tailwind class strings when refactoring skeleton system
export default function Skeleton({ className = "", width, height, borderRadius }: SkeletonProps) {
  const style: React.CSSProperties = {
    width: width,
    height: height,
    borderRadius: borderRadius,
  };

  return (
    <div 
      className={`skeleton ${className}`} 
      style={style}
    ></div>
  );
}
