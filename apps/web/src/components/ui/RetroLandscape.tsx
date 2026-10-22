"use client";

import React from "react";
import Image from "next/image";

interface RetroLandscapeProps {
  className?: string;
  variant?: "hero" | "footer";
}

export const RetroLandscape: React.FC<RetroLandscapeProps> = ({
  className = "",
  variant = "hero",
}) => {
  const isHero = variant === "hero";
  const imageSrc = "/images/landing.png";

  const altText = isHero
    ? "Linocut woodblock engraving of financial growth chart ridges, rising golden coin sun, hikers, and emerald cashflow stream"
    : "Linocut woodblock engraving of calm financial reserves under golden coin moon and pine forest";

  return (
    <div className={`w-full select-none relative overflow-hidden ${className}`}>
      <div className="relative w-full aspect-[3712/1152]">
        <Image
          src={imageSrc}
          alt={altText}
          width={3712}
          height={1152}
          priority={isHero}
          sizes="100vw"
          className="w-full h-full object-cover select-none pointer-events-none block"
        />
        {/* Gradasi Atas: Gambar atas (1) & gambar bawah (2) sama-sama memiliki gradasi di bagian atasnya */}
        <div
          className={`absolute inset-x-0 top-0 bg-gradient-to-b from-[#08110A] pointer-events-none z-10 ${
            isHero
              ? "h-8 sm:h-14 md:h-20 to-transparent"
              : "h-14 sm:h-24 md:h-36 via-[#08110A]/50 to-transparent"
          }`}
        />

        {/* Gradasi Bawah: HANYA untuk gambar bawah (2), gambar atas (1) tidak ada gradasi bawah */}
        {!isHero && (
          <div className="absolute inset-x-0 bottom-0 h-32 sm:h-48 md:h-64 lg:h-80 bg-gradient-to-t from-[#08110A] via-[#08110A]/75 to-transparent pointer-events-none z-10" />
        )}
      </div>
    </div>
  );
};

export default RetroLandscape;
