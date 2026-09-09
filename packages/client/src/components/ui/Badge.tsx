import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "copper" | "success" | "warning" | "outline" | "slate" | "basalt";
  size?: "sm" | "md";
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = "default",
  size = "md",
  children,
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center font-medium rounded-full tracking-wide transition-colors";

  const sizeStyles = {
    sm: "px-2.5 py-0.5 text-xs",
    md: "px-3 py-1 text-xs"
  };

  const variantStyles = {
    default: "bg-sand-100 text-basalt-800 border border-sand-200",
    copper: "bg-copper-50 text-copper-600 border border-copper-500/20 font-semibold",
    success: "bg-emerald-50 text-emerald-800 border border-emerald-300",
    warning: "bg-amber-50 text-amber-800 border border-amber-300",
    outline: "bg-transparent text-basalt-700 border border-sand-300",
    slate: "bg-basalt-900 text-sand-50 border border-basalt-700",
    basalt: "bg-basalt-950 text-white border border-basalt-800"
  };

  return (
    <span
      className={twMerge(
        clsx(baseStyles, sizeStyles[size], variantStyles[variant], className)
      )}
      {...props}
    >
      {children}
    </span>
  );
};
