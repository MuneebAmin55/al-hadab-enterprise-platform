import React from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { setPrequalModalOpen } from "../app/uiSlice";
import {
  useGetCompanyProfileQuery,
  useGetClientsQuery,
  useGetCapabilitiesQuery,
  useGetProjectsQuery,
  useGetPublicWorkforceQuery
} from "../services/apiSlice";
import type { CapabilityVertical, ClientEntity, ProjectCaseStudy } from "@alhadab/shared";
import { VERIFIED_CLIENTS } from "@alhadab/shared";
import {
  Button,
  Badge,
  ScrollReveal,
  SEOHead,
  SectionHeader,
  StatBanner,
  ProjectCard,
  CapabilityCard,
  ClientLogo,
  PageLoader
} from "../components/ui";
import {
  Building2,
  FileCheck,
  ArrowUpRight,
  Truck,
  Layers,
  ChevronRight,
  ArrowRight,
  ArrowLeft
} from "lucide-react";

export const HomePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { language } = useAppSelector((state) => state.ui);
  const isAr = language === "ar";
  const Arrow = isAr ? ArrowLeft : ArrowRight;

  const { data: profile } = useGetCompanyProfileQuery();
  const { data: clients, isLoading: clientsLoading } = useGetClientsQuery();
  const { data: capabilities, isLoading: capabilitiesLoading } = useGetCapabilitiesQuery();
  const { data: projects, isLoading: projectsLoading } = useGetProjectsQuery();
  const { data: workforceSummary } = useGetPublicWorkforceQuery();

  // Only fall back to VERIFIED_CLIENTS when the API has responded with zero results
  // (not while loading — avoid flash of wrong content)
  const displayClients =
    clientsLoading
      ? null
      : clients && clients.length > 0
        ? clients
        : VERIFIED_CLIENTS;

  const dynamicStats = profile?.stats
    ? {
        ...profile.stats,
        activeWorkforce: workforceSummary?.totalEmployees ?? profile.stats.activeWorkforce
      }
    : undefined;

  const handleOpenPrequal = () => {
    dispatch(setPrequalModalOpen(true));
  };

  // Structured Data (Organization Schema)
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "GeneralContractor",
    "name": isAr ? "شركة الهضب للتجارة والمقاولات" : "AL-HADAB Trading & Contracting Co.",
    "legalName": isAr ? "شركة الهضب للتجارة والمقاولات ذات مسؤولية محدودة" : "AL-HADAB Trading & Contracting Company LLC",
    "foundingDate": "1976",
    "url": "https://alhadab.com.sa",
    "logo": "https://alhadab.com.sa/logo.png",
    "telephone": "+966 11 249 8383",
    "email": "info@alhadab.com.sa",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Al-Diyar Street, Granada District",
      "addressLocality": "Riyadh",
      "postalCode": "13242",
      "addressCountry": "SA"
    },
    "description": isAr
      ? "شركة سعودية مصنفة بالدرجة الأولى تأسست عام 1396هـ (1976م) متخصصة في مقاولات البنية التحتية، شبكات المياه، تصريف السيول، والطرق."
      : "Saudi Class 1 General Contractor established 1976 specializing in mega civil infrastructure, water networks, flood mitigation, and highways."
  };

  const flagshipProjects = projects?.filter((p) => p.isFlagship) || projects?.slice(0, 3) || [];

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* SEO Metadata & Structured Data */}
      <SEOHead
        titleAr="الرئيسية — مقاول البنية التحتية الوطني منذ 1396هـ"
        titleEn="Home — Saudi Class 1 Infrastructure Contractor Est. 1976"
        descriptionAr="شركة الهضب للتجارة والمقاولات: صرح وطني تأسس عام 1396هـ (1976م) لتنفيذ أضخم مشاريع البنية التحتية، شبكات المياه والسيول، والطرق في المملكة العربية السعودية."
        descriptionEn="AL-HADAB Trading & Contracting Co. — Tier-1 Saudi contractor established in 1976 executing monumental hydraulic, highway, and civil infrastructure packages aligned with Saudi Vision 2030."
        canonicalPath="/"
        jsonLd={organizationJsonLd}
      />

      {/* 1. Sovereign Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-sand-100/70 via-sand-50 to-sand-50 pt-16 pb-20 border-b border-sand-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Headline */}
            <ScrollReveal direction="up" delay={0.1} className="lg:col-span-7 space-y-6 text-start">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-copper-50 border border-copper-500/20 text-copper-600 text-xs font-semibold shadow-xs">
                <span>{isAr ? "منذ 1396هـ (1976م)" : "Since 1396 AH / 1976 G"}</span>
                <span className="h-1 w-1 rounded-full bg-copper-500" />
                <span>{isAr ? "قرابة خمسة عقود من الريادة الوطنية" : "48+ Years of Proven Engineering"}</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-basalt-950 leading-[1.15]">
                {isAr ? (
                  <>
                    نبني بنية تحتية <br />
                    <span className="text-copper-500">تدعم مستقبل المملكة</span>
                  </>
                ) : (
                  <>
                    Engineering Enduring <br />
                    <span className="text-copper-500">National Infrastructure</span>
                  </>
                )}
              </h1>

              <p className="text-base sm:text-lg text-basalt-600 leading-relaxed max-w-2xl">
                {isAr
                  ? "نوظف خبرتنا الفنية الراسخة وأسطولنا الميكانيكي المتكامل لتنفيذ كبرى مشاريع المياه، درء السيول، الطرق والجسور، والطاقة المتجددة وفق أعلى معايير الجودة والسلامة لرؤية السعودية 2030."
                  : "Deploying five decades of technical craftsmanship, an owned heavy equipment fleet, and uncompromising safety standards to build Saudi Arabia's critical hydraulic, road, energy, and civic lifelines."}
              </p>

              <div className="pt-2 flex flex-wrap gap-4">
                <Button
                  variant="primary"
                  size="lg"
                  iconStart={<FileCheck className="h-5 w-5" />}
                  onClick={handleOpenPrequal}
                >
                  {isAr ? "التأهيل المسبق الفوري" : "Fast-Track Prequalification"}
                </Button>

                <Link to="/projects">
                  <Button variant="tectonic" size="lg" iconEnd={<ArrowUpRight className="h-4 w-4 rtl:rotate-[-90deg]" />}>
                    {isAr ? "استعرض سجل المشاريع" : "Explore Project Vault"}
                  </Button>
                </Link>
              </div>
            </ScrollReveal>

            {/* Right Visual Architectural Anchor */}
            <ScrollReveal direction="left" delay={0.2} className="lg:col-span-5">
              <div className="relative rounded-[10px] overflow-hidden border border-sand-300 shadow-elevation-3 bg-basalt-950 group">
                <img
                  src="https://images.unsplash.com/photo-1541888946425-d0fbb180c5f5?auto=format&fit=crop&w=1200&q=80"
                  alt="Saudi Infrastructure Execution Site"
                  className="w-full h-80 sm:h-96 object-cover opacity-85 group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-basalt-950 via-basalt-950/40 to-transparent" />
                <div className="absolute bottom-6 start-6 end-6 text-white space-y-2 text-start">
                  <Badge variant="copper">{isAr ? "مشروع استراتيجي نشط" : "Active Strategic Package"}</Badge>
                  <h3 className="text-lg font-bold leading-snug">
                    {isAr
                      ? "مشروع درء أخطار السيول وتصريف الأمطار بمكة المكرمة"
                      : "Makkah Stormwater Drainage & Flood Mitigation Phase IV"}
                  </h3>
                  <p className="text-xs text-sand-300">
                    {isAr
                      ? "أمانة العاصمة المقدسة | عبارات صندوقية ثلاثية وقنوات هيدروليكية"
                      : "Holy Makkah Municipality | Triple-cell precast culverts"}
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* 2. Verified Corporate Statistics Banner */}
      <ScrollReveal direction="up" delay={0.15}>
        <StatBanner isAr={isAr} statsData={dynamicStats} />
      </ScrollReveal>

      {/* 3. The Cohort Intent Router (Pathways for Every Stakeholder) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="up">
          <SectionHeader
            badge={isAr ? "بوابات الشركاء والعملاء" : "Stakeholder Intent Gateways"}
            titleAr="كيف يمكن لشركة الهضب دعم أهدافكم؟"
            titleEn="How AL-HADAB Partners With Your Organization"
            descriptionAr="مسارات مخصصة تمنح كل جهة وصولاً مباشراً إلى المتطلبات الفنية، الوثائق الرسمية، وبوابات التقديم."
            descriptionEn="Dedicated pathways providing direct access to technical specifications, dossiers, and tendering desks."
            align="center"
            isAr={isAr}
            className="mb-10"
          />
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Cohort 1: Government & Municipalities */}
          <ScrollReveal direction="up" delay={0.1}>
            <div className="bg-white border border-sand-200 rounded-[10px] p-6 sm:p-7 hover:border-copper-500/40 hover:shadow-elevation-2 transition-all space-y-4 text-start h-full flex flex-col justify-between">
              <div className="space-y-3">
                <div className="h-11 w-11 rounded-[8px] bg-copper-50 text-copper-600 flex items-center justify-center font-bold">
                  <Building2 className="h-6 w-6" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-basalt-950">
                  {isAr ? "الجهات الحكومية والبلديات" : "Government & Municipalities"}
                </h3>
                <p className="text-xs sm:text-sm text-basalt-600 leading-relaxed">
                  {isAr
                    ? "تنفيذ مشاريع درء السيول، شبكات المياه، صيانة ونظافة المدن، وتشجير الميادين المعتمدة على منصة اعتماد."
                    : "Municipal flood canals, utility lines, urban hygiene, and smart afforestation via the Etimad platform."}
                </p>
              </div>
              <Link
                to="/contact"
                className="inline-flex items-center text-xs font-bold text-copper-600 hover:text-copper-700 pt-2"
              >
                <span>{isAr ? "تقديم طلب مناقصة حكومية" : "Submit Municipal RFP"}</span>
                <Arrow className="h-3.5 w-3.5 ms-1.5" />
              </Link>
            </div>
          </ScrollReveal>

          {/* Cohort 2: Giga-Projects & Developers */}
          <ScrollReveal direction="up" delay={0.2}>
            <div className="bg-white border border-sand-200 rounded-[10px] p-6 sm:p-7 hover:border-copper-500/40 hover:shadow-elevation-2 transition-all space-y-4 text-start h-full flex flex-col justify-between">
              <div className="space-y-3">
                <div className="h-11 w-11 rounded-[8px] bg-copper-50 text-copper-600 flex items-center justify-center font-bold">
                  <Layers className="h-6 w-6" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-basalt-950">
                  {isAr ? "المشاريع الكبرى والمطورون" : "Giga-Projects & Developers"}
                </h3>
                <p className="text-xs sm:text-sm text-basalt-600 leading-relaxed">
                  {isAr
                    ? "خبرة تنفيذية في بيئات مشاريع صندوق الاستثمارات العامة (أمالا، القدية، كافد) مع جاهزية حشد أسطول سريع."
                    : "Proven delivery inside PIF mega-project environments (Amaala, Qiddiya, KAFD) with rapid heavy fleet mobilization."}
                </p>
              </div>
              <button
                onClick={handleOpenPrequal}
                className="inline-flex items-center text-xs font-bold text-copper-600 hover:text-copper-700 pt-2 text-start"
              >
                <span>{isAr ? "تحميل ملف التأهيل الموسوم" : "Download Prequalification Pack"}</span>
                <Arrow className="h-3.5 w-3.5 ms-1.5" />
              </button>
            </div>
          </ScrollReveal>

          {/* Cohort 3: Subcontractors & Suppliers */}
          <ScrollReveal direction="up" delay={0.3}>
            <div className="bg-white border border-sand-200 rounded-[10px] p-6 sm:p-7 hover:border-copper-500/40 hover:shadow-elevation-2 transition-all space-y-4 text-start h-full flex flex-col justify-between">
              <div className="space-y-3">
                <div className="h-11 w-11 rounded-[8px] bg-copper-50 text-copper-600 flex items-center justify-center font-bold">
                  <Truck className="h-6 w-6" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-basalt-950">
                  {isAr ? "الموردون والمقاولون من الباطن" : "Subcontractors & Suppliers"}
                </h3>
                <p className="text-xs sm:text-sm text-basalt-600 leading-relaxed">
                  {isAr
                    ? "بوابة رقمية مباشرة لتسجيل الشركات الموردة للمواد والمعدات وفحص السجل التجاري والاعتماد المسبق."
                    : "Structured onboarding desk to submit company profile, verify CR, and pre-qualify for active infrastructure packages."}
                </p>
              </div>
              <Link
                to="/suppliers"
                className="inline-flex items-center text-xs font-bold text-copper-600 hover:text-copper-700 pt-2"
              >
                <span>{isAr ? "تسجيل مورد جديد" : "Register as Vendor"}</span>
                <Arrow className="h-3.5 w-3.5 ms-1.5" />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 4. Flagship Projects Showcase */}
      {projectsLoading ? (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <PageLoader variant="shimmer-grid" count={3} />
        </section>
      ) : flagshipProjects.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <ScrollReveal direction="up">
            <SectionHeader
              badge={isAr ? "المشاريع الاستراتيجية" : "Flagship Projects"}
              titleAr="نماذج من إنجازاتنا الوطنية الكبرى"
              titleEn="Flagship Infrastructure Case Studies"
              descriptionAr="أعمال بنية تحتية نفذت بدقة هندسية عالية لصالح كبرى الجهات والمدن بالمملكة."
              descriptionEn="Monumental engineering packages delivered with uncompromising quality for Saudi ministries and Amanats."
              action={
                <Link to="/projects">
                  <Button variant="tectonic" size="md" iconEnd={<Arrow className="h-4 w-4" />}>
                    {isAr ? "عرض سجل المشاريع الكامل" : "Explore Full Vault"}
                  </Button>
                </Link>
              }
              isAr={isAr}
            />
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {flagshipProjects.map((project: ProjectCaseStudy, idx: number) => (
              <ScrollReveal key={project.id} direction="up" delay={0.1 * (idx + 1)}>
                <ProjectCard project={project} isAr={isAr} featured />
              </ScrollReveal>
            ))}
          </div>
        </section>
      )}

      {/* 5. Multidisciplinary Engineering Capabilities (The 8 Verticals) */}
      <section className="bg-sand-100/60 py-16 sm:py-20 border-y border-sand-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <ScrollReveal direction="up">
            <SectionHeader
              badge={isAr ? "مجالات الاختصاص والتميز" : "Core Capabilities"}
              titleAr="قدرات هندسية تغطي كافة احتياجات البنية التحتية"
              titleEn="Comprehensive Infrastructure Disciplines"
              descriptionAr="ثمانية قطاعات رئيسية تقدم حلولاً متكاملة من الأعمال الأرضية والمدنية حتى المرافق الذكية المستدامة."
              descriptionEn="Eight specialized engineering verticals executing civil, hydraulic, electrical, and civic infrastructure."
              action={
                <Link to="/capabilities">
                  <Button variant="tectonic" size="md" iconEnd={<ChevronRight className="h-4 w-4 rtl:rotate-180" />}>
                    {isAr ? "استعرض كافة المواصفات الفنية" : "View All Specifications"}
                  </Button>
                </Link>
              }
              isAr={isAr}
            />
          </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {capabilitiesLoading
              ? <PageLoader variant="shimmer-grid" count={8} />
              : capabilities?.map((vert: CapabilityVertical, idx: number) => (
                <ScrollReveal key={vert.id} direction="up" delay={0.05 * (idx + 1)}>
                  <CapabilityCard vertical={vert} isAr={isAr} />
                </ScrollReveal>
              ))
            }
          </div>
        </div>
      </section>

      {/* 6. Verified National Partners (19+ Verified Entities) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <ScrollReveal direction="up">
          <SectionHeader
            badge={isAr ? "شركاء النجاح والمسيرة" : "Institutional Trust"}
            titleAr="خبرات معتمدة مع أكثر من 19 جهة وطنية رائدة"
            titleEn="Trusted by 19+ National Titans"
            descriptionAr="سجل حافل بالتعاون مع الوزارات السيادية، شركات صندوق الاستثمارات العامة، والأمانات الكبرى بالمملكة."
            descriptionEn="An established delivery record alongside Saudi ministries, PIF developers, and regional municipal authorities."
            align="center"
            isAr={isAr}
          />
        </ScrollReveal>

        {/* Partner Logo Grid */}
        {clientsLoading ? (
          <PageLoader variant="shimmer-clients" />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
            {displayClients?.map((client: ClientEntity, idx: number) => (
              <ScrollReveal key={client.id} direction="up" delay={0.02 * (idx + 1)}>
                <ClientLogo client={client} isAr={isAr} />
              </ScrollReveal>
            ))}
          </div>
        )}
      </section>

      {/* 7. High-Stakes Conversion Dock */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <ScrollReveal direction="up">
          <div className="rounded-[10px] bg-gradient-to-br from-basalt-950 via-basalt-900 to-basalt-950 text-white p-8 sm:p-12 border border-basalt-800 shadow-elevation-4">
            <div className="max-w-3xl space-y-4 text-start">
              <Badge variant="copper">{isAr ? "الخطوة التالية" : "Take Action"}</Badge>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                {isAr ? "هل تخطط لمشروع البنية التحتية القادم؟" : "Ready to Engineer Your Next Infrastructure Package?"}
              </h2>
              <p className="text-sm text-sand-300 leading-relaxed">
                {isAr
                  ? "تواصل مباشرة مع لجنة التقدير والتسعير الهندسي للحصول على دراسة مبدئية، أو قم بتحميل الملف التأهيلي الموسوم رسمياً لتقديمه للجان المشتريات والمناقصات."
                  : "Connect directly with our Chief Estimators for technical review, or download our officially stamped pre-qualification dossier for tender committee evaluation."}
              </p>

              <div className="pt-4 flex flex-wrap gap-4">
                <Link to="/contact">
                  <Button variant="primary" size="lg">
                    {isAr ? "تقديم طلب مناقصة / RFP" : "Submit Scoped RFP"}
                  </Button>
                </Link>
                <Button variant="secondary" size="lg" onClick={handleOpenPrequal}>
                  {isAr ? "تحميل ملف التأهيل (PDF)" : "Download Dossier (PDF)"}
                </Button>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
};
