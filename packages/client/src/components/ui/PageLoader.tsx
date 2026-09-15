import React from "react";
import { Loader2 } from "lucide-react";
import { useAppSelector } from "../../app/hooks";

export interface PageLoaderProps {
  labelAr?: string;
  labelEn?: string;
  variant?: "fullscreen" | "card" | "shimmer-grid" | "shimmer-stats" | "shimmer-clients" | "shimmer-article" | "shimmer-single" | "shimmer-list";
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

  // Stat banner skeleton — 4 equal cells
  if (variant === "shimmer-stats") {
    return (
      <div className="w-full animate-pulse py-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-sand-200 rounded-[8px] h-24" />
          ))}
        </div>
      </div>
    );
  }

  // Client logo grid — 12 cells matching the actual grid layout
  if (variant === "shimmer-clients") {
    return (
      <div className="w-full animate-pulse py-2">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="h-20 rounded-[8px] bg-sand-200 border border-sand-100" />
          ))}
        </div>
      </div>
    );
  }

  // Full news/blog article page skeleton
  if (variant === "shimmer-article") {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 animate-pulse space-y-8 py-8">
        <div className="flex gap-2">
          <div className="h-4 w-16 bg-sand-200 rounded" />
          <div className="h-4 w-4 bg-sand-200 rounded" />
          <div className="h-4 w-32 bg-sand-200 rounded" />
        </div>
        <div className="space-y-4">
          <div className="flex gap-2">
            <div className="h-5 w-24 bg-sand-200 rounded-full" />
            <div className="h-5 w-32 bg-sand-200 rounded-full" />
          </div>
          <div className="h-10 w-3/4 bg-sand-200 rounded" />
          <div className="h-6 w-1/2 bg-sand-200 rounded" />
          <div className="flex justify-between pt-2 border-t border-sand-100">
            <div className="h-4 w-28 bg-sand-200 rounded" />
            <div className="h-8 w-24 bg-sand-200 rounded" />
          </div>
        </div>
        <div className="h-64 sm:h-96 w-full bg-sand-200 rounded-[10px]" />
        <div className="p-6 bg-sand-100 rounded-[8px] space-y-2">
          <div className="h-4 w-full bg-sand-200 rounded" />
          <div className="h-4 w-5/6 bg-sand-200 rounded" />
          <div className="h-4 w-4/5 bg-sand-200 rounded" />
        </div>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 w-full bg-sand-200 rounded" />
              <div className="h-4 w-11/12 bg-sand-200 rounded" />
              <div className="h-4 w-4/5 bg-sand-200 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Single dark card skeleton — for HQ panel, profile sidebar, etc.
  if (variant === "shimmer-single") {
    return (
      <div className="w-full animate-pulse">
        <div className="rounded-[8px] bg-basalt-900 border border-basalt-800 p-6 space-y-4">
          <div className="h-5 w-24 bg-basalt-700 rounded-full" />
          <div className="h-6 w-48 bg-basalt-700 rounded" />
          <div className="h-4 w-40 bg-basalt-700 rounded" />
          <div className="space-y-3 pt-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex gap-3 items-start">
                <div className="h-4 w-4 bg-basalt-700 rounded shrink-0 mt-0.5" />
                <div className="h-4 w-full bg-basalt-700 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Stacked list rows — for news cards, job rows
  if (variant === "shimmer-list") {
    return (
      <div className="w-full space-y-5 animate-pulse py-4">
        {[...Array(count)].map((_, i) => (
          <div
            key={i}
            className="rounded-[8px] bg-white border border-sand-200 p-5 space-y-3 shadow-elevation-1"
          >
            <div className="flex gap-2">
              <div className="h-5 w-20 bg-sand-200 rounded-full" />
              <div className="h-5 w-28 bg-sand-200 rounded-full" />
            </div>
            <div className="h-5 w-3/4 bg-sand-200 rounded" />
            <div className="space-y-2">
              <div className="h-3.5 w-full bg-sand-200 rounded" />
              <div className="h-3.5 w-5/6 bg-sand-200 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Default: shimmer-grid
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
