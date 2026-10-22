import React from "react";

export type ScoutBadgeVariant = "forest" | "sand" | "yellow" | "neon";

interface ScoutBadgeProps {
  title: string;
  subtitle?: string;
  icon?: string;
  variant?: ScoutBadgeVariant;
  size?: "sm" | "md" | "lg";
  rotate?: number;
  className?: string;
}

const variantStyles: Record<ScoutBadgeVariant, { ring: string; bg: string; text: string; iconBg: string }> = {
  forest: {
    ring: "border-[#39E75F]/40",
    bg: "bg-[#08110A]",
    text: "text-[#F5EFE6]",
    iconBg: "bg-[#39E75F] text-[#08110A]",
  },
  sand: {
    ring: "border-[#08110A]/30",
    bg: "bg-[#F5EFE6]",
    text: "text-[#08110A]",
    iconBg: "bg-[#08110A] text-[#39E75F]",
  },
  yellow: {
    ring: "border-[#08110A]/30",
    bg: "bg-[#FDE047]",
    text: "text-[#08110A]",
    iconBg: "bg-[#08110A] text-[#FDE047]",
  },
  neon: {
    ring: "border-[#08110A]/30",
    bg: "bg-[#39E75F]",
    text: "text-[#08110A]",
    iconBg: "bg-[#08110A] text-[#39E75F]",
  },
};

const sizeStyles: Record<"sm" | "md" | "lg", { dim: string; iconSize: string; textSize: string; subtextSize: string }> = {
  sm: { dim: "w-20 h-20", iconSize: "text-[20px]", textSize: "text-[9px]", subtextSize: "text-[7px]" },
  md: { dim: "w-28 h-28", iconSize: "text-[28px]", textSize: "text-[10px]", subtextSize: "text-[8px]" },
  lg: { dim: "w-36 h-36", iconSize: "text-[34px]", textSize: "text-[12px]", subtextSize: "text-[9px]" },
};

export const ScoutBadge: React.FC<ScoutBadgeProps> = ({
  title,
  subtitle,
  icon = "landscape",
  variant = "forest",
  size = "md",
  rotate = 0,
  className = "",
}) => {
  const v = variantStyles[variant];
  const s = sizeStyles[size];

  return (
    <div
      style={{ transform: `rotate(${rotate}deg)` }}
      className={`relative rounded-full border-4 ${v.ring} ${v.bg} ${v.text} ${s.dim} p-1.5 shadow-[4px_4px_0px_#08110A] transition-transform duration-300 hover:scale-105 select-none shrink-0 flex items-center justify-center ${className}`}
    >
      {/* Inner dashed circle */}
      <div className="w-full h-full rounded-full border-2 border-dashed border-current/30 flex flex-col items-center justify-center text-center p-2">
        {/* Center Icon */}
        <div className={`rounded-full p-1.5 mb-1 flex items-center justify-center ${v.iconBg}`}>
          <span className={`material-symbols-outlined ${s.iconSize} leading-none`}>
            {icon}
          </span>
        </div>

        {/* Text */}
        <span className={`font-display font-black uppercase tracking-wider leading-none ${s.textSize}`}>
          {title}
        </span>
        {subtitle && (
          <span className={`font-mono font-bold uppercase tracking-widest opacity-75 mt-0.5 leading-none ${s.subtextSize}`}>
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );
};

export default ScoutBadge;
