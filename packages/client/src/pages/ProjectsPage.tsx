import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useAppSelector } from "../app/hooks";
import { useGetProjectsQuery, useGetCapabilitiesQuery } from "../services/apiSlice";
import type { ProjectCaseStudy, CapabilityVertical } from "@alhadab/shared";
import {
  Badge,
  Button,
  ScrollReveal,
  SEOHead,
  SectionHeader,
  ProjectCard,
  PageLoader,
  PageError
} from "../components/ui";
import {
  Search,
  MapPin,
  Calendar,
  Layers,
  Compass,
  X,
  RotateCcw
} from "lucide-react";

export const ProjectsPage: React.FC = () => {
  const { language } = useAppSelector((state) => state.ui);
  const isAr = language === "ar";
  const [searchParams, setSearchParams] = useSearchParams();

  const verticalParam = searchParams.get("vertical") || "";
  const regionParam = searchParams.get("region") || "";
  const [searchTerm, setSearchTerm] = useState("");

  const { data: capabilities } = useGetCapabilitiesQuery();
  const {
    data: projects,
    isLoading,
    isError,
    refetch
  } = useGetProjectsQuery({
    vertical: verticalParam || undefined,
    region: regionParam || undefined,
    searchQuery: searchTerm || undefined
  });

  const handleVerticalChange = (id: string) => {
    const params = new URLSearchParams(searchParams);
    if (id === "") {
      params.delete("vertical");
    } else {
      params.set("vertical", id);
    }
    setSearchParams(params);
  };

  const handleRegionChange = (reg: string) => {
    const params = new URLSearchParams(searchParams);
    if (reg === "") {
      params.delete("region");
    } else {
      params.set("region", reg);
    }
    setSearchParams(params);
  };

  const clearAllFilters = () => {
    setSearchTerm("");
    setSearchParams({});
  };

  const hasActiveFilters = Boolean(verticalParam || regionParam || searchTerm);

  const regions = [
    { code: "", labelAr: "كافة المناطق", labelEn: "All Regions" },
    { code: "CENTRAL", labelAr: "المنطقة الوسطى (الرياض)", labelEn: "Central (Riyadh)" },
    { code: "WESTERN", labelAr: "المنطقة الغربية (مكة وجدة)", labelEn: "Western (Makkah/Jeddah)" },
    { code: "SOUTHERN", labelAr: "المنطقة الجنوبية (الباحة)", labelEn: "Southern (Al Baha)" },
    { code: "EASTERN", labelAr: "المنطقة الشرقية", labelEn: "Eastern Province" }
  ];

  return (
    <div className="space-y-12 py-12">
      {/* SEO Metadata */}
      <SEOHead
        titleAr="سجل المشاريع المنفذة — دراسات حالة موثقة"
        titleEn="Projects Portfolio Vault — Audited Engineering Case Studies"
        descriptionAr="استعرض مشاريع البنية التحتية المنفذة لشركة الهضب: تصريف السيول بمكة، شبكات المياه بالرياض، مشاريع القدية وأمالا، وتمديد الكابلات للشركة السعودية للكهرباء."
        descriptionEn="Explore AL-HADAB's delivered infrastructure case studies across Saudi Arabia for ministries, PIF developments, and regional municipalities."
        canonicalPath="/projects"
      />

      {/* Header Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="up">
          <div className="border-b border-sand-200 pb-8 space-y-3 text-start">
            <Badge variant="copper">{isAr ? "سجل الإنجازات والخبرات" : "Project Portfolio Vault"}</Badge>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-basalt-950 tracking-tight">
              {isAr ? "مشاريع البنية التحتية المنفذة" : "Delivered Infrastructure Projects"}
            </h1>
            <p className="text-sm sm:text-base text-basalt-600 max-w-3xl leading-relaxed">
              {isAr
                ? "استعرض تفاصيل المشاريع الحيوية التي نفذتها الهضب لصالح الوزارات السيادية، الأمانات، ومشاريع صندوق الاستثمارات العامة الكبرى."
                : "Explore audited engineering case studies delivered for ministries, municipal authorities, and PIF giga-project developments."}
            </p>
          </div>
        </ScrollReveal>
      </section>

      {/* Filter & Search Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="up" delay={0.1}>
          <div className="bg-white border border-sand-200 rounded-[10px] p-5 sm:p-6 shadow-elevation-1 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              {/* Search Input */}
              <div className="md:col-span-4 relative">
                <Search className="absolute start-3.5 top-3.5 h-4 w-4 text-basalt-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={isAr ? "ابحث باسم المشروع، العميل، أو المدينة..." : "Search project, client, or city..."}
                  className="w-full h-11 ps-10 pe-3 text-sm bg-sand-50/50 border border-sand-300 rounded-[6px] focus-ring"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute end-3 top-3.5 text-basalt-400 hover:text-basalt-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Vertical Filter Dropdown */}
              <div className="md:col-span-4">
                <select
                  value={verticalParam}
                  onChange={(e) => handleVerticalChange(e.target.value)}
                  className="w-full h-11 px-3 text-sm bg-sand-50/50 border border-sand-300 rounded-[6px] focus-ring"
                >
                  <option value="">{isAr ? "كافة القطاعات الهندسية" : "All Capabilities"}</option>
                  {capabilities?.map((c: CapabilityVertical) => (
                    <option key={c.id} value={c.id}>
                      {isAr ? c.titleAr : c.titleEn}
                    </option>
                  ))}
                </select>
              </div>

              {/* Region Filter Dropdown */}
              <div className="md:col-span-4">
                <select
                  value={regionParam}
                  onChange={(e) => handleRegionChange(e.target.value)}
                  className="w-full h-11 px-3 text-sm bg-sand-50/50 border border-sand-300 rounded-[6px] focus-ring"
                >
                  {regions.map((r) => (
                    <option key={r.code} value={r.code}>
                      {isAr ? r.labelAr : r.labelEn}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Active Filter Pills */}
            {hasActiveFilters && (
              <div className="pt-3 border-t border-sand-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-basalt-500 font-medium">
                    {isAr ? "التصفيات النشطة:" : "Active Filters:"}
                  </span>
                  {verticalParam && (
                    <Badge variant="copper">
                      {isAr ? "القطاع: " : "Vertical: "}
                      {capabilities?.find((c) => c.id === verticalParam)?.[isAr ? "titleAr" : "titleEn"] || verticalParam}
                    </Badge>
                  )}
                  {regionParam && (
                    <Badge variant="copper">
                      {isAr ? "المنطقة: " : "Region: "}
                      {regions.find((r) => r.code === regionParam)?.[isAr ? "labelAr" : "labelEn"] || regionParam}
                    </Badge>
                  )}
                  {searchTerm && (
                    <Badge variant="default">
                      "{searchTerm}"
                    </Badge>
                  )}
                </div>

                <button
                  onClick={clearAllFilters}
                  className="inline-flex items-center gap-1 text-copper-600 hover:text-copper-700 font-medium"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>{isAr ? "إعادة ضبط التصفيات" : "Reset All Filters"}</span>
                </button>
              </div>
            )}
          </div>
        </ScrollReveal>
      </section>

      {/* Geospatial Project Matrix / Coverage Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="up" delay={0.15}>
          <div className="rounded-[10px] bg-basalt-950 text-white p-6 border border-basalt-800 shadow-elevation-2 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4 text-start">
              <div className="h-12 w-12 rounded-[8px] bg-basalt-900 border border-basalt-800 flex items-center justify-center text-copper-400 shrink-0">
                <Compass className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  {isAr ? "التوزيع الجغرافي للمشاريع عبر مناطق المملكة" : "Geographic Project Spread Across KSA"}
                </h3>
                <p className="text-xs text-sand-300 mt-0.5">
                  {isAr
                    ? "مواقع تشغيلية نشطة في منطقة الرياض، العاصمة المقدسة وجدة، والمنطقة الجنوبية والشرقية."
                    : "Active operational sites across Central, Western, Southern, and Eastern administrative regions."}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-sand-300 font-mono bg-basalt-900 px-3 py-1.5 rounded border border-basalt-800">
                {isAr
                  ? `إجمالي المشاريع المعروضة: ${projects?.length || 0}`
                  : `Matching Projects: ${projects?.length || 0}`}
              </span>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* Projects Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {isLoading ? (
          <PageLoader variant="shimmer-grid" count={6} />
        ) : isError ? (
          <PageError onRetry={() => refetch()} />
        ) : projects && projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((proj: ProjectCaseStudy, idx: number) => (
              <ScrollReveal key={proj.id} direction="up" delay={0.06 * (idx + 1)}>
                <ProjectCard project={proj} isAr={isAr} />
              </ScrollReveal>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center rounded-[10px] bg-white border border-sand-200 p-8 space-y-4">
            <Layers className="h-12 w-12 mx-auto text-basalt-400" />
            <h3 className="text-lg font-bold text-basalt-950">
              {isAr ? "لا توجد مشاريع مطابقة للتصفيات المختارة" : "No projects match the selected criteria"}
            </h3>
            <p className="text-xs text-basalt-500 max-w-sm mx-auto">
              {isAr
                ? "يرجى تجربة البحث بكلمات مختلفة أو اختيار قطاع أو منطقة أخرى."
                : "Try adjusting your search terms or clearing vertical and region filters."}
            </p>
            {hasActiveFilters && (
              <Button variant="secondary" size="sm" onClick={clearAllFilters}>
                {isAr ? "إعادة ضبط التصفيات" : "Clear All Filters"}
              </Button>
            )}
          </div>
        )}
      </section>
    </div>
  );
};
