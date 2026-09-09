import React from "react";
import { Link } from "react-router-dom";
import type { CapabilityVertical } from "@alhadab/shared";
import {
  Droplets,
  CloudRain,
  Compass,
  Zap,
  Building2,
  Trees,
  Sparkles,
  ShieldAlert,
  ArrowRight,
  ArrowLeft,
  CheckCircle2
} from "lucide-react";

export interface CapabilityCardProps {
  vertical: CapabilityVertical;
  isAr: boolean;
  className?: string;
}

export const CapabilityCard: React.FC<CapabilityCardProps> = ({
  vertical,
  isAr,
  className = ""
}) => {
  const Arrow = isAr ? ArrowLeft : ArrowRight;

  const getIcon = (code: string) => {
    switch (code) {
      case "WATER_WASTEWATER":
        return <Droplets className="h-6 w-6" />;
      case "STORMWATER_FLOOD":
        return <CloudRain className="h-6 w-6" />;
      case "ROADS_BRIDGES":
        return <Compass className="h-6 w-6" />;
      case "ELECTRICAL_ENERGY":
        return <Zap className="h-6 w-6" />;
      case "BUILDINGS_FACILITIES":
        return <Building2 className="h-6 w-6" />;
      case "LANDSCAPING_IRRIGATION":
        return <Trees className="h-6 w-6" />;
      case "URBAN_CLEANING":
        return <Sparkles className="h-6 w-6" />;
      case "DAMS_CIVIL_DEFENSE":
        return <ShieldAlert className="h-6 w-6" />;
      default:
        return <Compass className="h-6 w-6" />;
    }
  };

  const subServices = isAr
    ? vertical.subServicesAr || vertical.subServices?.ar || []
    : vertical.subServicesEn || vertical.subServices?.en || [];

  return (
    <div
      className={`group relative flex flex-col justify-between bg-white border border-sand-200 rounded-[10px] p-6 sm:p-7 transition-all duration-300 hover:shadow-elevation-3 hover:border-copper-500/40 text-start ${className}`}
    >
      <div className="space-y-4">
        {/* Discipline Icon */}
        <div className="h-12 w-12 rounded-[8px] bg-sand-100 border border-sand-200 group-hover:bg-copper-500 group-hover:text-white group-hover:border-copper-600 flex items-center justify-center text-copper-600 transition-colors shadow-sm">
          {getIcon(vertical.code)}
        </div>

        {/* Header */}
        <div className="space-y-1.5">
          <div className="text-[11px] font-mono font-bold text-copper-600 tracking-wider">
            {vertical.code}
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-basalt-950 group-hover:text-copper-600 transition-colors">
            {isAr ? vertical.titleAr : vertical.titleEn}
          </h3>
          <p className="text-xs sm:text-sm text-basalt-600 leading-relaxed line-clamp-3">
            {isAr ? vertical.shortDescAr : vertical.shortDescEn}
          </p>
        </div>

        {/* Sub-services highlight */}
        {subServices.length > 0 && (
          <div className="pt-3 border-t border-sand-200 space-y-2">
            <div className="text-[11px] font-bold text-basalt-500 uppercase tracking-wider">
              {isAr ? "مجالات العمل التخصصية" : "Specialized Scope"}
            </div>
            <ul className="space-y-1.5">
              {subServices.slice(0, 3).map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-basalt-700 leading-tight">
                  <CheckCircle2 className="h-3.5 w-3.5 text-copper-500 shrink-0 mt-0.5" />
                  <span className="line-clamp-1">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Footer Navigation */}
      <div className="pt-6 mt-4 border-t border-sand-200 flex items-center justify-between">
        <Link
          to={`/capabilities`}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-copper-600 hover:text-copper-700 transition-colors"
        >
          <span>{isAr ? "المواصفات الفنية الكاملة" : "Full Specifications"}</span>
          <Arrow className="h-3.5 w-3.5" />
        </Link>

        <Link
          to={`/projects?vertical=${vertical.id}`}
          className="text-xs text-basalt-500 hover:text-basalt-900 transition-colors"
        >
          {isAr ? "المشاريع المنفذة" : "Projects"}
        </Link>
      </div>
    </div>
  );
};
