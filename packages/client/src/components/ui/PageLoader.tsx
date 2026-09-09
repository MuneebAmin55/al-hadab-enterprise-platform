import React from "react";
import { Loader2 } from "lucide-react";
import { useAppSelector } from "../../app/hooks";

export interface PageLoaderProps {
  labelAr?: string;
  labelEn?: string;
  variant?: "fullscreen" | "card" | "shimmer-grid";
  count?: number;
}

export const PageLoader: React.FC<PageLoaderProps> = ({
  labelAr = "جاري تحميل البيانات الهندسية...",
  labelEn = "Loading engineering data...",
  variant = "shimmer-grid",
  count = 6
}) => {
  const { language } = useAppSelector((state) => state.ui);
  const isAr = language === "ar";

  if (variant === "fullscreen") {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center space-y-4">
        <div className="h-12 w-12 rounded-full bg-copper-50 border border-copper-200 flex items-center justify-center text-copper-600">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
        <p className="text-sm font-medium text-basalt-700">
          {isAr ? labelAr : labelEn}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 animate-pulse py-4">
      {/* Header skeleton */}
      <div className="space-y-3">
        <div className="h-6 w-32 bg-sand-200 rounded" />
        <div className="h-8 w-64 bg-sand-200 rounded" />
        <div className="h-4 w-96 max-w-full bg-sand-200 rounded" />
      </div>

      {/* Grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
        {[...Array(count)].map((_, i) => (
          <div
            key={i}
            className="rounded-[8px] bg-white border border-sand-200 p-6 space-y-4 shadow-elevation-1"
          >
            <div className="h-44 w-full bg-sand-200 rounded-[6px]" />
            <div className="h-5 w-3/4 bg-sand-200 rounded" />
            <div className="space-y-2">
              <div className="h-3.5 w-full bg-sand-200 rounded" />
              <div className="h-3.5 w-5/6 bg-sand-200 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
