import React from "react";
import { Badge } from "./Badge";

export interface SectionHeaderProps {
  badge?: string;
  badgeVariant?: "copper" | "basalt" | "outline" | "success";
  titleAr: string;
  titleEn: string;
  descriptionAr?: string;
  descriptionEn?: string;
  align?: "start" | "center";
  action?: React.ReactNode;
  isAr: boolean;
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  badge,
  badgeVariant = "copper",
  titleAr,
  titleEn,
  descriptionAr,
  descriptionEn,
  align = "start",
  action,
  isAr,
  className = ""
}) => {
  const isCentered = align === "center";

  return (
    <div
      className={`flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-sand-200 ${
        isCentered ? "text-center md:text-center items-center" : "text-start"
      } ${className}`}
    >
      <div className={`space-y-3 ${isCentered ? "mx-auto max-w-3xl" : "max-w-3xl"}`}>
        {badge && (
          <div>
            <Badge variant={badgeVariant}>{badge}</Badge>
          </div>
        )}
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-basalt-950 tracking-tight leading-tight">
          {isAr ? titleAr : titleEn}
        </h2>
        {(descriptionAr || descriptionEn) && (
          <p className="text-sm sm:text-base text-basalt-600 leading-relaxed max-w-2xl">
            {isAr ? descriptionAr : descriptionEn}
          </p>
        )}
      </div>

      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
};
