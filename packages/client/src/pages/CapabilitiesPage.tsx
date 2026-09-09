import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAppSelector } from "../app/hooks";
import { useGetCapabilitiesQuery } from "../services/apiSlice";
import type { CapabilityVertical } from "@alhadab/shared";
import {
  Badge,
  Button,
  ScrollReveal,
  SEOHead,
  SectionHeader,
  PageLoader,
  PageError
} from "../components/ui";
import {
  Droplets,
  CloudRain,
  Compass,
  Zap,
  Building2,
  Trees,
  Sparkles,
  ShieldAlert,
  CheckCircle2,
  Truck,
  FileCheck,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  Layers,
  FileText
} from "lucide-react";

export const CapabilitiesPage: React.FC = () => {
  const { language } = useAppSelector((state) => state.ui);
  const isAr = language === "ar";
  const Arrow = isAr ? ArrowLeft : ArrowRight;

  const { data: capabilities, isLoading, isError, refetch } = useGetCapabilitiesQuery();
  const [selectedVerticalId, setSelectedVerticalId] = useState<string>("water-wastewater");

  const selectedVertical =
    capabilities?.find((c) => c.id === selectedVerticalId) || capabilities?.[0];

  const getIcon = (code: string) => {
    switch (code) {
      case "WATER_WASTEWATER":
        return <Droplets className="h-5 w-5" />;
      case "STORMWATER_FLOOD":
        return <CloudRain className="h-5 w-5" />;
      case "ROADS_BRIDGES":
        return <Compass className="h-5 w-5" />;
      case "ELECTRICAL_ENERGY":
        return <Zap className="h-5 w-5" />;
      case "BUILDINGS_FACILITIES":
        return <Building2 className="h-5 w-5" />;
      case "LANDSCAPING_IRRIGATION":
        return <Trees className="h-5 w-5" />;
      case "URBAN_CLEANING":
        return <Sparkles className="h-5 w-5" />;
      case "DAMS_CIVIL_DEFENSE":
        return <ShieldAlert className="h-5 w-5" />;
      default:
        return <Compass className="h-5 w-5" />;
    }
  };

  const getSubServices = (vertical: CapabilityVertical): string[] => {
    if (isAr) {
      return vertical.subServicesAr || vertical.subServices?.ar || [];
    }
    return vertical.subServicesEn || vertical.subServices?.en || [];
  };

  return (
    <div className="space-y-12 py-12">
      {/* SEO Metadata */}
      <SEOHead
        titleAr="القدرات الهندسية الشاملة — 8 قطاعات تخصصية"
        titleEn="Engineering Capabilities — 8 Specialized Infrastructure Disciplines"
        descriptionAr="استعرض القطاعات الهندسية لشركة الهضب: شبكات المياه والصرف الصحي، درء أخطار السيول، الطرق والجسور، الطاقة والإنارة الذكية، والمباني العامة."
        descriptionEn="Detailed technical specifications of AL-HADAB's 8 civil infrastructure verticals: water transmission, flood culverts, highway engineering, energy, and civic works."
        canonicalPath="/capabilities"
      />

      {/* Header Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="up">
          <div className="border-b border-sand-200 pb-8 space-y-3 text-start">
            <Badge variant="copper">{isAr ? "مجالات الاختصاص الهندسية" : "Engineering Disciplines"}</Badge>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-basalt-950 tracking-tight">
              {isAr ? "القدرات الهندسية الشاملة" : "Comprehensive Infrastructure Capabilities"}
            </h1>
            <p className="text-sm sm:text-base text-basalt-600 max-w-3xl leading-relaxed">
              {isAr
                ? "نجمع بين الخبرة التراكمية، الكفاءات الفنية المتخصصة، والأسطول المملوك لتقديم أعمال مقاولات متكاملة تغطي كافة مجالات البنية التحتية والمدن السعودية وفق أعلى المعايير الهندسية."
                : "Uniting deep engineering craftsmanship, certified human capital, and heavy equipment assets across 8 foundational infrastructure verticals for public and private clients."}
            </p>
          </div>
        </ScrollReveal>
      </section>

      {/* Interactive Two-Column Capabilities Explorer */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {isLoading ? (
          <PageLoader variant="fullscreen" />
        ) : isError ? (
          <PageError onRetry={() => refetch()} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Discipline Selector Tabs */}
            <div className="lg:col-span-4 space-y-2">
              <h3 className="text-xs font-bold text-basalt-500 uppercase tracking-wider mb-3 px-2 text-start">
                {isAr ? "اختر القطاع الهندسي" : "Select Discipline"}
              </h3>
              {capabilities?.map((vert: CapabilityVertical) => {
                const isSelected = vert.id === selectedVertical?.id;
                return (
                  <button
                    key={vert.id}
                    onClick={() => setSelectedVerticalId(vert.id)}
                    className={`w-full p-4 rounded-[8px] text-start border transition-all flex items-center gap-3.5 focus-ring ${
                      isSelected
                        ? "bg-basalt-950 text-white border-basalt-950 shadow-elevation-2"
                        : "bg-white text-basalt-800 border-sand-200 hover:border-copper-500/40 hover:bg-sand-50"
                    }`}
                  >
                    <div
                      className={`h-10 w-10 rounded-[6px] flex items-center justify-center shrink-0 ${
                        isSelected ? "bg-copper-500 text-white" : "bg-sand-100 text-copper-600"
                      }`}
                    >
                      {getIcon(vert.code)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold truncate">
                        {isAr ? vert.titleAr : vert.titleEn}
                      </p>
                      <p
                        className={`text-xs truncate mt-0.5 ${
                          isSelected ? "text-sand-300" : "text-basalt-500"
                        }`}
                      >
                        {isAr ? vert.shortDescAr : vert.shortDescEn}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Right Detailed Technical Specification Panel */}
            {selectedVertical && (
              <div className="lg:col-span-8 bg-white border border-sand-200 rounded-[10px] p-6 sm:p-8 space-y-8 shadow-elevation-1 text-start">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="copper">{selectedVertical.code}</Badge>
                    <span className="text-xs text-basalt-400 font-mono">
                      {isAr ? "مواصفة هندسية معتمدة" : "Standard Specification"}
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-extrabold text-basalt-950 tracking-tight">
                    {isAr ? selectedVertical.titleAr : selectedVertical.titleEn}
                  </h2>
                  <p className="text-sm sm:text-base text-basalt-600 leading-relaxed">
                    {isAr ? selectedVertical.fullDescAr : selectedVertical.fullDescEn}
                  </p>
                </div>

                {/* Sub-Services Checklist */}
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-basalt-900 border-b border-sand-200 pb-2">
                    {isAr ? "نطاق الخدمات والأعمال التخصصية" : "Scope of Services & Technical Specializations"}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {getSubServices(selectedVertical).map((service: string, idx: number) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2.5 text-xs sm:text-sm text-basalt-800 bg-sand-50/60 rounded p-2.5 border border-sand-100"
                      >
                        <CheckCircle2 className="h-4 w-4 text-copper-500 shrink-0 mt-0.5" />
                        <span className="leading-snug">{service}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Equipment Fleet & QA/QC Standards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-sand-200">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm font-bold text-basalt-900">
                      <Truck className="h-4 w-4 text-copper-500" />
                      <span>{isAr ? "المعدات والأسطول المخصص" : "Dedicated Equipment Assets"}</span>
                    </div>
                    <ul className="text-xs text-basalt-600 space-y-2 list-disc list-inside ps-1">
                      {selectedVertical.equipmentDeployed.map((item: string, idx: number) => (
                        <li key={idx} className="leading-relaxed">{item}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm font-bold text-basalt-900">
                      <FileCheck className="h-4 w-4 text-copper-500" />
                      <span>{isAr ? "المعايير والمواصفات المعتمدة" : "Quality & Compliance Standards"}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {selectedVertical.standards.map((std: string, idx: number) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded bg-sand-100 border border-sand-200 text-xs font-mono font-medium text-basalt-800"
                        >
                          {std}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Direct Link to Relevant Projects */}
                <div className="pt-6 border-t border-sand-200 flex flex-wrap items-center justify-between gap-4">
                  <Link to={`/projects?vertical=${selectedVertical.id}`}>
                    <Button variant="primary" size="md" iconEnd={<Arrow className="h-4 w-4" />}>
                      {isAr ? "استعرض المشاريع المنفذة في هذا القطاع" : "View Projects in this Discipline"}
                    </Button>
                  </Link>
                  <Link to="/contact">
                    <Button variant="tectonic" size="md">
                      {isAr ? "طلب دراسة فنية وعرض أسعار" : "Request Engineering RFI"}
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
};
