import React from "react";
import { useParams, Link } from "react-router-dom";
import { useAppSelector } from "../app/hooks";
import { useGetProjectBySlugQuery } from "../services/apiSlice";
import type { ProjectCaseStudy } from "@alhadab/shared";
import {
  Badge,
  Button,
  MetricCard,
  ScrollReveal,
  SEOHead,
  SectionHeader,
  PageLoader,
  PageError
} from "../components/ui";
import {
  MapPin,
  Calendar,
  Building2,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Truck,
  Layers,
  Award,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  FileCheck
} from "lucide-react";

export const ProjectDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { language } = useAppSelector((state) => state.ui);
  const isAr = language === "ar";
  const Arrow = isAr ? ArrowLeft : ArrowRight;
  const BackArrow = isAr ? ArrowRight : ArrowLeft;

  const { data: project, isLoading, isError, refetch } = useGetProjectBySlugQuery(slug || "");

  if (isLoading) {
    return (
      <div className="py-24 max-w-7xl mx-auto px-4">
        <PageLoader variant="fullscreen" />
      </div>
    );
  }

  if (isError || !project) {
    return (
      <div className="py-24 max-w-xl mx-auto px-4">
        <PageError
          titleAr="لم يتم العثور على دراسة الحالة المطلوبة"
          titleEn="Case study not found"
          messageAr="عذراً، لم نتمكن من جلب ملف المشروع المطلوب. قد يكون تم تغيير الرابط أو أرشفة المشروع."
          messageEn="We could not locate this project dossier. It may have been archived or relocated."
          onRetry={() => refetch()}
        />
        <div className="text-center mt-6">
          <Link to="/projects">
            <Button variant="primary" size="md">
              {isAr ? "العودة إلى سجل المشاريع" : "Return to Projects Vault"}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const isCompleted = project.executionStatus === "COMPLETED";

  // Breadcrumb Structured Data
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": isAr ? "الرئيسية" : "Home",
        "item": "https://alhadab.com.sa/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": isAr ? "سجل المشاريع" : "Projects",
        "item": "https://alhadab.com.sa/projects"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": isAr ? project.titleAr : project.titleEn,
        "item": `https://alhadab.com.sa/projects/${project.slug}`
      }
    ]
  };

  return (
    <div className="space-y-12 py-10">
      {/* SEO Metadata */}
      <SEOHead
        titleAr={project.titleAr}
        titleEn={project.titleEn}
        descriptionAr={project.summaryAr}
        descriptionEn={project.summaryEn}
        ogImage={project.heroImageUrl}
        canonicalPath={`/projects/${project.slug}`}
        jsonLd={breadcrumbJsonLd}
      />

      {/* Back Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-start">
        <Link
          to="/projects"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-copper-600 hover:text-copper-700 transition-colors focus-ring rounded"
        >
          <BackArrow className="h-4 w-4" />
          <span>{isAr ? "العودة لكافة المشاريع" : "Back to Projects Directory"}</span>
        </Link>
      </div>

      {/* Hero Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="up">
          <div className="relative rounded-[10px] overflow-hidden border border-sand-300 bg-basalt-950 text-white min-h-[380px] sm:min-h-[440px] flex items-end shadow-elevation-3">
            <img
              src={project.heroImageUrl}
              alt={isAr ? project.titleAr : project.titleEn}
              className="absolute inset-0 w-full h-full object-cover opacity-45"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-basalt-950 via-basalt-950/60 to-transparent" />

            <div className="relative z-10 p-6 sm:p-10 space-y-4 max-w-4xl text-start">
              <div className="flex flex-wrap gap-2 items-center">
                <Badge variant="copper">{isAr ? project.verticalTitleAr : project.verticalTitleEn}</Badge>
                <Badge variant={isCompleted ? "success" : "warning"}>
                  {isCompleted
                    ? isAr
                      ? "مشروع مكتمل ومنجز"
                      : "Completed & Handed Over"
                    : isAr
                    ? "قيد التنفيذ النشط"
                    : "Active Execution"}
                </Badge>
                {project.isFlagship && (
                  <Badge variant="basalt" className="bg-basalt-900 text-copper-400 border-copper-500/30">
                    {isAr ? "مشروع استراتيجي" : "Flagship Package"}
                  </Badge>
                )}
              </div>

              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight tracking-tight">
                {isAr ? project.titleAr : project.titleEn}
              </h1>

              <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs sm:text-sm text-sand-300 font-medium">
                <div className="flex items-center gap-1.5">
                  <Building2 className="h-4 w-4 text-copper-400" />
                  <span>{isAr ? project.clientNameAr : project.clientNameEn}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-copper-400" />
                  <span>{isAr ? project.cityAr : project.cityEn}</span>
                </div>
                <div className="flex items-center gap-1.5 font-mono">
                  <Calendar className="h-4 w-4 text-copper-400" />
                  <span>{project.yearGregorian}م ({project.yearHijri}هـ)</span>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* Executive Summary & Key Technical Metrics */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Narrative Column */}
          <div className="lg:col-span-8 space-y-8 text-start">
            {/* Summary */}
            <ScrollReveal direction="up">
              <div className="bg-white border border-sand-200 rounded-[10px] p-6 sm:p-8 space-y-4 shadow-elevation-1">
                <h2 className="text-xl font-bold text-basalt-950 border-b border-sand-200 pb-3">
                  {isAr ? "ملخص المشروع والنطاق التنفيذي" : "Executive Scope & Project Overview"}
                </h2>
                <p className="text-sm sm:text-base text-basalt-700 leading-relaxed">
                  {isAr ? project.summaryAr : project.summaryEn}
                </p>
              </div>
            </ScrollReveal>

            {/* Challenge & Solution Architecture */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Challenge */}
              <ScrollReveal direction="up" delay={0.1}>
                <div className="bg-white border border-sand-200 rounded-[10px] p-6 sm:p-7 space-y-3 shadow-elevation-1 h-full">
                  <div className="h-10 w-10 rounded-[6px] bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
                    <AlertTriangle className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-bold text-basalt-950">
                    {isAr ? "التحدي الهندسي الميداني" : "Engineering Challenge"}
                  </h3>
                  <p className="text-xs sm:text-sm text-basalt-600 leading-relaxed">
                    {isAr ? project.challengeAr : project.challengeEn}
                  </p>
                </div>
              </ScrollReveal>

              {/* Solution */}
              <ScrollReveal direction="up" delay={0.2}>
                <div className="bg-white border border-sand-200 rounded-[10px] p-6 sm:p-7 space-y-3 shadow-elevation-1 h-full">
                  <div className="h-10 w-10 rounded-[6px] bg-copper-50 text-copper-600 flex items-center justify-center font-bold">
                    <Lightbulb className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-bold text-basalt-950">
                    {isAr ? "الحل الهندسي والتنفيذ الفني" : "Engineered Solution"}
                  </h3>
                  <p className="text-xs sm:text-sm text-basalt-600 leading-relaxed">
                    {isAr ? project.solutionAr : project.solutionEn}
                  </p>
                </div>
              </ScrollReveal>
            </div>

            {/* Fleet & Units Deployed */}
            {project.fleetUnitsDeployed && project.fleetUnitsDeployed.length > 0 && (
              <ScrollReveal direction="up" delay={0.25}>
                <div className="bg-white border border-sand-200 rounded-[10px] p-6 sm:p-7 space-y-4 shadow-elevation-1">
                  <div className="flex items-center gap-2 text-sm font-bold text-basalt-950 border-b border-sand-200 pb-2">
                    <Truck className="h-4 w-4 text-copper-500" />
                    <span>{isAr ? "المعدات والأسطول المخصص للمشروع" : "Dedicated Equipment & Machinery Fleet"}</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {project.fleetUnitsDeployed.map((unit, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-basalt-700 bg-sand-50/70 p-2 rounded border border-sand-100">
                        <CheckCircle2 className="h-3.5 w-3.5 text-copper-500 shrink-0" />
                        <span>{unit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            )}

            {/* Gallery Grid */}
            {project.galleryUrls && project.galleryUrls.length > 0 && (
              <ScrollReveal direction="up" delay={0.3}>
                <div className="space-y-4">
                  <h3 className="text-base font-bold text-basalt-950">
                    {isAr ? "معرض صور الموقع والتنفيذ" : "On-Site Execution Gallery"}
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {project.galleryUrls.map((url, idx) => (
                      <div key={idx} className="aspect-[4/3] rounded-[8px] overflow-hidden bg-basalt-900 border border-sand-200 shadow-sm group">
                        <img
                          src={url}
                          alt={`${project.titleEn} - Image ${idx + 1}`}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            )}
          </div>

          {/* Right Sidebar: Key Metrics & Technical Specifications */}
          <div className="lg:col-span-4 space-y-6 text-start">
            {/* Metrics Showcase Card */}
            {project.metrics && project.metrics.length > 0 && (
              <div className="bg-white border border-sand-200 rounded-[10px] p-6 space-y-4 shadow-elevation-1">
                <h3 className="text-sm font-bold text-basalt-900 uppercase tracking-wider border-b border-sand-200 pb-2">
                  {isAr ? "المؤشرات الهندسية الكمية" : "Technical Metrics"}
                </h3>
                <div className="space-y-3">
                  {project.metrics.map((m, idx) => (
                    <div key={idx} className="p-3 bg-sand-50 rounded-[6px] border border-sand-100">
                      <div className="text-xs text-basalt-500">
                        {isAr ? m.labelAr : m.labelEn}
                      </div>
                      <div className="text-lg font-extrabold text-basalt-950 font-mono flex items-baseline gap-1.5 mt-0.5">
                        <span className="text-copper-600">{m.value}</span>
                        <span className="text-xs font-normal text-basalt-600">
                          {isAr ? m.unitAr : m.unitEn}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Consultation CTA */}
            <div className="bg-basalt-950 text-white border border-basalt-800 rounded-[10px] p-6 space-y-4 shadow-elevation-2">
              <Badge variant="copper">{isAr ? "طلب دراسة فنية" : "Engineering Review"}</Badge>
              <h4 className="text-base font-bold leading-snug">
                {isAr
                  ? "هل تحتاج لتنفيذ حزمة مشابهة لهذا المشروع؟"
                  : "Planning a Similar Civil Infrastructure Package?"}
              </h4>
              <p className="text-xs text-sand-300 leading-relaxed">
                {isAr
                  ? "فريق التقدير الهندسي مستعد لمراجعة المخططات وجداول الكميات (BOQ) وتقديم دراسة جدوى فنية."
                  : "Our chief estimators are ready to review your tender BOQs and technical specifications."}
              </p>
              <div className="pt-2 space-y-2">
                <Link to="/contact" className="block w-full">
                  <Button variant="primary" size="md" className="w-full justify-center">
                    {isAr ? "طلب تسعير ومناقصة" : "Request Tender Estimate"}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
