import React from "react";

export type StickerColor = "neon" | "yellow" | "orange" | "sky" | "sand" | "forest" | "white";

interface StickerBadgeProps {
  text: string;
  subtext?: string;
  icon?: string;
  color?: StickerColor;
  rotate?: number;
  size?: "sm" | "md" | "lg";
  shape?: "pill" | "circle" | "stamp";
  className?: string;
}

const colorStyles: Record<StickerColor, string> = {
  neon: "bg-[#39E75F] text-[#08110A] border-[#08110A] shadow-[2px_2px_0px_#08110A]",
  yellow: "bg-[#FDE047] text-[#08110A] border-[#08110A] shadow-[2px_2px_0px_#08110A]",
  orange: "bg-[#FB923C] text-[#08110A] border-[#08110A] shadow-[2px_2px_0px_#08110A]",
  sky: "bg-[#7DD3FC] text-[#08110A] border-[#08110A] shadow-[2px_2px_0px_#08110A]",
  sand: "bg-[#F5EFE6] text-[#08110A] border-[#08110A] shadow-[2px_2px_0px_#08110A]",
  forest: "bg-[#08110A] text-[#39E75F] border-[#39E75F] shadow-[2px_2px_0px_#39E75F]",
  white: "bg-white text-[#08110A] border-[#08110A] shadow-[2px_2px_0px_#08110A]",
};

const rotateStyles: Record<number, string> = {
  [-6]: "-rotate-6",
  [-4]: "-rotate-4",
  [-3]: "-rotate-3",
  [-2]: "-rotate-2",
  [-1]: "-rotate-1",
  0: "rotate-0",
  1: "rotate-1",
  2: "rotate-2",
  3: "rotate-3",
  4: "rotate-4",
  6: "rotate-6",
};

export const StickerBadge: React.FC<StickerBadgeProps> = ({
  text,
  subtext,
  icon,
  color = "neon",
  rotate = 0,
  size = "md",
  shape = "pill",
  className = "",
}) => {
  const rotationClass = rotateStyles[rotate] || "rotate-0";
  const colorClass = colorStyles[color];

  if (shape === "circle") {
    const circleSize = size === "sm" ? "w-12 h-12 text-[10px]" : size === "lg" ? "w-20 h-20 text-xs" : "w-16 h-16 text-[11px]";
    return (
      <div
        className={`inline-flex flex-col items-center justify-center rounded-full border-2 font-display font-extrabold uppercase text-center leading-tight transition-transform hover:scale-110 select-none ${circleSize} ${colorClass} ${rotationClass} ${className}`}
      >
        {icon && <span className="material-symbols-outlined text-sm">{icon}</span>}
        <span className="tracking-tighter px-1">{text}</span>
        {subtext && <span className="text-[8px] opacity-80">{subtext}</span>}
      </div>
    );
  }

  const paddingClass = size === "sm" ? "px-2.5 py-0.5 text-xs" : size === "lg" ? "px-5 py-2 text-base" : "px-3.5 py-1 text-sm";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border-2 font-display font-black uppercase tracking-wider transition-all hover:scale-105 select-none ${paddingClass} ${colorClass} ${rotationClass} ${className}`}
    >
      {icon && <span className="material-symbols-outlined text-[1em] leading-none">{icon}</span>}
      <span>{text}</span>
      {subtext && <span className="opacity-75 text-[0.8em] font-normal normal-case ml-1">{subtext}</span>}
    </span>
  );
};

export default StickerBadge;
