import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface MetricCardProps {
  value: string | number;
  suffix?: string;
  label: string;
  sublabel?: string;
  className?: string;
  highlight?: boolean;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  value,
  suffix,
  label,
  sublabel,
  className,
  highlight = false
}) => {
  return (
    <div
      className={twMerge(
        clsx(
          "rounded-[6px] p-6 border transition-all duration-200",
          highlight
            ? "bg-gradient-to-br from-basalt-900 to-basalt-950 text-white border-basalt-800 shadow-elevation-2"
            : "bg-white text-basalt-950 border-sand-200 hover:border-copper-500/30 hover:shadow-elevation-1",
          className
        )
      )}
    >
      <div className="flex items-baseline gap-1">
        <span
          className={clsx(
            "text-3xl sm:text-4xl font-extrabold tracking-tight tabular-nums",
            highlight ? "text-white" : "text-basalt-950"
          )}
        >
          {value}
        </span>
        {suffix && (
          <span
            className={clsx(
              "text-xl sm:text-2xl font-bold",
              highlight ? "text-copper-400" : "text-copper-500"
            )}
          >
            {suffix}
          </span>
        )}
      </div>
      <p
        className={clsx(
          "mt-2 text-sm font-semibold",
          highlight ? "text-sand-100" : "text-basalt-800"
        )}
      >
        {label}
      </p>
      {sublabel && (
        <p
          className={clsx(
            "mt-1 text-xs leading-relaxed",
            highlight ? "text-sand-300" : "text-basalt-500"
          )}
        >
          {sublabel}
        </p>
      )}
    </div>
  );
};
