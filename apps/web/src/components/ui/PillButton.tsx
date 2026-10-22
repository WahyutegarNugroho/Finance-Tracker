import React from "react";
import Link from "next/link";

export type PillButtonVariant = "neon" | "forest" | "sand" | "outline" | "white";
export type PillButtonSize = "sm" | "md" | "lg";

interface PillButtonBaseProps {
  children: React.ReactNode;
  variant?: PillButtonVariant;
  size?: PillButtonSize;
  icon?: string;
  iconPosition?: "left" | "right";
  className?: string;
  disabled?: boolean;
}

type PillButtonAsButton = PillButtonBaseProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined;
  };

type PillButtonAsLink = PillButtonBaseProps &
  React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
  };

export type PillButtonProps = PillButtonAsButton | PillButtonAsLink;

const variantStyles: Record<PillButtonVariant, string> = {
  neon: "bg-[#39E75F] text-[#08110A] hover:bg-[#2EE06E] active:bg-[#25C860] border-2 border-[#08110A] shadow-[2px_2px_0px_#08110A] hover:shadow-[4px_4px_0px_#08110A]",
  forest: "bg-[#08110A] text-[#F5EFE6] hover:bg-[#112015] active:bg-[#050C06] border-2 border-[#39E75F]/30 hover:border-[#39E75F] shadow-[2px_2px_0px_#39E75F]",
  sand: "bg-[#F5EFE6] text-[#08110A] hover:bg-white active:bg-[#E7DFD4] border-2 border-[#08110A] shadow-[2px_2px_0px_#08110A]",
  outline: "bg-transparent text-current border-2 border-current hover:bg-white/10 active:bg-white/20",
  white: "bg-white text-[#08110A] hover:bg-[#F5EFE6] active:bg-[#E7DFD4] border-2 border-[#08110A] shadow-[2px_2px_0px_#08110A]",
};

const sizeStyles: Record<PillButtonSize, string> = {
  sm: "px-4 py-2 min-h-[44px] text-xs sm:text-sm tracking-wider",
  md: "px-6 py-2.5 min-h-[44px] text-sm tracking-wide",
  lg: "px-8 py-3.5 min-h-[48px] text-base tracking-wider",
};

export const PillButton: React.FC<PillButtonProps> = ({
  children,
  variant = "neon",
  size = "md",
  icon,
  iconPosition = "right",
  className = "",
  disabled = false,
  href,
  ...rest
}) => {
  const baseClasses = `inline-flex items-center justify-center gap-2 rounded-full font-display font-extrabold uppercase whitespace-nowrap flex-shrink-0 transition-all duration-200 cursor-pointer select-none active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#39E75F] focus-visible:ring-offset-2 focus-visible:ring-offset-[#08110A] disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

  const content = (
    <>
      {icon && iconPosition === "left" && (
        <span className="material-symbols-outlined text-[1.1em] leading-none">{icon}</span>
      )}
      <span>{children}</span>
      {icon && iconPosition === "right" && (
        <span className="material-symbols-outlined text-[1.1em] leading-none">{icon}</span>
      )}
    </>
  );

  if (href) {
    const isExternal = href.startsWith("http") || href.startsWith("#");
    if (isExternal) {
      return (
        <a href={href} className={baseClasses} {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}>
          {content}
        </a>
      );
    }
    return (
      <Link href={href} className={baseClasses} {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      disabled={disabled}
      className={baseClasses}
      {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {content}
    </button>
  );
};

export default PillButton;
