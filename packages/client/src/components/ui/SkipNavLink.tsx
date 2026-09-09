import React from "react";
import { useAppSelector } from "../../app/hooks";

export interface SkipNavLinkProps {
  targetId?: string;
}

export const SkipNavLink: React.FC<SkipNavLinkProps> = ({ targetId = "main-content" }) => {
  const { language } = useAppSelector((state) => state.ui);
  const isAr = language === "ar";

  return (
    <a
      href={`#${targetId}`}
      className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:start-3 focus:z-50 focus:px-4 focus:py-2.5 focus:bg-copper-500 focus:text-white focus:font-bold focus:text-sm focus:rounded-[6px] focus:shadow-elevation-3 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2"
    >
      {isAr ? "الانتقال المباشر إلى المحتوى الرئيسي" : "Skip to main content"}
    </a>
  );
};
