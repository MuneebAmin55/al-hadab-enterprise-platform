import React from "react";
import { Link } from "react-router-dom";
import type { ProjectCaseStudy } from "@alhadab/shared";
import { Badge } from "./Badge";
import { MapPin, Calendar, ArrowUpRight, CheckCircle2, Clock } from "lucide-react";

export interface ProjectCardProps {
  project: ProjectCaseStudy;
  isAr: boolean;
  featured?: boolean;
  className?: string;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  isAr,
  featured = false,
  className = ""
}) => {
  const isCompleted = project.executionStatus === "COMPLETED";

  return (
    <div
      className={`group relative flex flex-col bg-white border border-sand-200 rounded-[10px] overflow-hidden transition-all duration-300 hover:shadow-elevation-3 hover:border-copper-500/40 text-start ${className}`}
    >
      {/* Media Box */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-basalt-900">
        <img
          src={project.heroImageUrl}
          alt={isAr ? project.titleAr : project.titleEn}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-basalt-950/80 via-basalt-950/20 to-transparent" />

        {/* Badges Overlay */}
        <div className="absolute top-3 inset-x-3 flex items-center justify-between gap-2">
          <Badge variant={isCompleted ? "success" : "copper"} className="text-[11px] font-semibold">
            <span className="flex items-center gap-1">
              {isCompleted ? (
                <CheckCircle2 className="h-3 w-3" />
              ) : (
                <Clock className="h-3 w-3" />
              )}
              <span>
                {isCompleted
                  ? isAr
                    ? "منجز بالكامل"
                    : "Completed"
                  : isAr
                  ? "قيد التنفيذ النشط"
                  : "Active Execution"}
              </span>
            </span>
          </Badge>

          {project.isFlagship && (
            <Badge variant="basalt" className="text-[11px] bg-basalt-900/90 text-copper-400 border-copper-500/30">
              {isAr ? "مشروع استراتيجي" : "Flagship Project"}
            </Badge>
          )}
        </div>

        {/* Location & Year Overlay */}
        <div className="absolute bottom-3 inset-x-3 flex items-center justify-between text-white/90 text-xs font-medium">
          <span className="inline-flex items-center gap-1 bg-basalt-950/60 backdrop-blur-sm px-2 py-0.5 rounded">
            <MapPin className="h-3 w-3 text-copper-400" />
            <span>{isAr ? project.cityAr : project.cityEn}</span>
          </span>
          <span className="inline-flex items-center gap-1 bg-basalt-950/60 backdrop-blur-sm px-2 py-0.5 rounded font-mono text-[11px]">
            <Calendar className="h-3 w-3 text-copper-400" />
            <span>{project.yearGregorian} م / {project.yearHijri} هـ</span>
          </span>
        </div>
      </div>

      {/* Content Body */}
      <div className="flex-1 p-5 sm:p-6 flex flex-col justify-between space-y-4">
        <div className="space-y-2.5">
          {/* Client Monogram / Entity */}
          <div className="text-xs font-semibold text-copper-600 uppercase tracking-wider">
            {isAr ? project.clientNameAr : project.clientNameEn}
          </div>

          <h3 className="text-lg font-bold text-basalt-950 group-hover:text-copper-600 transition-colors line-clamp-2">
            <Link to={`/projects/${project.slug}`} className="focus:outline-none focus:underline">
              {isAr ? project.titleAr : project.titleEn}
            </Link>
          </h3>

          <p className="text-xs sm:text-sm text-basalt-600 line-clamp-3 leading-relaxed">
            {isAr ? project.summaryAr : project.summaryEn}
          </p>
        </div>

        {/* Metrics Bar Preview */}
        {project.metrics && project.metrics.length > 0 && (
          <div className="pt-3 border-t border-sand-200 grid grid-cols-2 gap-2 text-start">
            {project.metrics.slice(0, 2).map((m, idx) => (
              <div key={idx} className="bg-sand-50 rounded p-2 border border-sand-100">
                <div className="text-[10px] text-basalt-500 truncate">
                  {isAr ? m.labelAr : m.labelEn}
                </div>
                <div className="text-xs font-bold text-basalt-900 font-mono flex items-baseline gap-1 mt-0.5">
                  <span>{m.value}</span>
                  <span className="text-[10px] text-copper-600 font-normal">
                    {isAr ? m.unitAr : m.unitEn}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Action Link */}
        <div className="pt-2">
          <Link
            to={`/projects/${project.slug}`}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-copper-600 hover:text-copper-700 transition-colors focus-ring rounded"
          >
            <span>{isAr ? "استعراض ملف المشروع الفني" : "Inspect Technical Case Study"}</span>
            <ArrowUpRight className="h-3.5 w-3.5 rtl:rotate-[-90deg]" />
          </Link>
        </div>
      </div>
    </div>
  );
};
