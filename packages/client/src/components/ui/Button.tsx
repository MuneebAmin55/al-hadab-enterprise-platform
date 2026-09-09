import React, { forwardRef } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Loader2 } from "lucide-react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "tectonic" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  iconStart?: React.ReactNode;
  iconEnd?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      iconStart,
      iconEnd,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-all duration-150 focus-ring disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.985] rounded-[6px]";

    const sizeStyles = {
      sm: "h-9 px-3.5 text-xs gap-1.5",
      md: "h-11 px-5 text-sm gap-2",
      lg: "h-13 px-7 text-base gap-2.5"
    };

    const variantStyles = {
      primary:
        "bg-copper-500 text-white hover:bg-copper-600 shadow-sm border-t border-white/20",
      secondary:
        "bg-basalt-900 text-sand-50 hover:bg-basalt-950 border border-basalt-800 shadow-sm",
      tectonic:
        "bg-white text-basalt-950 border border-sand-300 hover:border-basalt-500 hover:bg-sand-50 shadow-elevation-1",
      ghost:
        "bg-transparent text-basalt-700 hover:text-basalt-950 hover:bg-sand-100",
      destructive:
        "bg-red-700 text-white hover:bg-red-800 shadow-sm"
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={twMerge(
          clsx(
            baseStyles,
            sizeStyles[size],
            variantStyles[variant],
            className
          )
        )}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin text-current" />
        ) : (
          iconStart
        )}
        <span>{children}</span>
        {!isLoading && iconEnd}
      </button>
    );
  }
);

Button.displayName = "Button";
