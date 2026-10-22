"use client";

import React from "react";

interface NeonSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  formatValue?: (val: number) => string;
  icon?: string;
  className?: string;
}

export const NeonSlider: React.FC<NeonSliderProps> = ({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  formatValue = (v) => v.toString(),
  icon,
  className = "",
}) => {
  const percentage = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));

  return (
    <div className={`space-y-2.5 ${className}`}>
      <div className="flex items-center justify-between text-xs sm:text-sm">
        <label
          htmlFor={`slider-${label.replace(/\s+/g, "-").toLowerCase()}`}
          className="flex items-center gap-1.5 font-display font-bold uppercase tracking-wider text-[#F5EFE6] cursor-pointer"
        >
          {icon && <span className="material-symbols-outlined text-[16px] text-[#39E75F]">{icon}</span>}
          {label}
        </label>
        <span className="font-display font-extrabold text-[#39E75F] bg-[#39E75F]/15 border border-[#39E75F]/30 px-2.5 py-0.5 rounded-full text-xs sm:text-sm tracking-wide">
          {formatValue(value)}
        </span>
      </div>

      <div className="relative flex items-center h-8 select-none group focus-within:ring-2 focus-within:ring-[#39E75F] focus-within:ring-offset-2 focus-within:ring-offset-[#08110A] rounded-full px-1">
        {/* Track background */}
        <div className="absolute left-1 right-1 h-2 rounded-full bg-[#112015] border border-white/10 overflow-hidden">
          {/* Active fill */}
          <div
            className="h-full bg-gradient-to-r from-[#39E75F]/70 to-[#39E75F] transition-all duration-75"
            style={{ width: `${percentage}%` }}
          />
        </div>

        {/* Real HTML range input over top for native accessibility and keyboard control */}
        <input
          id={`slider-${label.replace(/\s+/g, "-").toLowerCase()}`}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          aria-label={label}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
          aria-valuetext={formatValue(value)}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute w-full h-full opacity-0 cursor-pointer z-10 focus:outline-none"
        />

        {/* Styled custom thumb indicator */}
        <div
          aria-hidden="true"
          className="absolute w-6 h-6 rounded-full bg-[#39E75F] border-2 border-[#08110A] shadow-[0_0_10px_rgba(57,231,95,0.6)] pointer-events-none transform -translate-x-1/2 transition-transform duration-75"
          style={{ left: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default NeonSlider;
