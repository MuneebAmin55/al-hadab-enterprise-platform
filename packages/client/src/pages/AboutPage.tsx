import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAppSelector } from "../app/hooks";
import {
  useGetCompanyProfileQuery,
  useGetPublicWorkforceQuery
} from "../services/apiSlice";
import {
  Badge,
  Button,
  MetricCard,
  ScrollReveal,
  SEOHead,
  SectionHeader,
  StatBanner,
  PageLoader
} from "../components/ui";
import {
  Building2,
  Award,
  ShieldCheck,
  CheckCircle2,
  Truck,
  Users,
  Compass,
  FileCheck,
  Calendar,
  Layers,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  Target,
  Clock,
  HardHat
} from "lucide-react";

export const AboutPage: React.FC = () => {
  const { language } = useAppSelector((state) => state.ui);
  const isAr = language === "ar";
  const Arrow = isAr ? ArrowLeft : ArrowRight;

  const { data: profile } = useGetCompanyProfileQuery();
  const { data: workforceSummary, isLoading: workforceLoading } = useGetPublicWorkforceQuery();

  const dynamicStats = profile?.stats
    ? {
        ...profile.stats,
        activeWorkforce: workforceSummary?.totalEmployees ?? profile.stats.activeWorkforce
      }
    : undefined;

  const [activeDecade, setActiveDecade] = useState<number>(0);

  const milestones = [
    {
      year: "1396هـ / 1976م",
      titleAr: "التأسيس والانطلاقة بالرياض",
      titleEn: "Founding & Initial Capital Mobilization",
      descAr: "تأسست شركة الهضب للتجارة والمقاولات في مدينة الرياض كمؤسسة مقاولات عامة وطنية متخصصة في أعمال الحفر وتسوية الأراضي وشبكات البنية التحتية الأولية.",
      descEn: "Established in Riyadh as an indigenous general contracting firm specialized in mass earthworks, land grading, and initial municipal utility networks."
    },
    {
      year: "1405هـ / 1985م",
      titleAr: "التوسع في شبكات المياه والصرف الصحي",
      titleEn: "Expansion into Water & Sewer Infrastructure",
      descAr: "الفوز بأولى الحزم الاستراتيجية لمد خطوط نقل المياه الرئيسية ومحطات الضخ لصالح وزارة الزراعة والمياه والمصالح البلدية في المنطقة الوسطى.",
      descEn: "Awarded first strategic trunk water transmission mains and booster stations for the Ministry of Agriculture & Water and Central Province municipalities."
    },
    {
      year: "1418هـ / 1998م",
      titleAr: "ريادة مشاريع تصريف السيول والأمطار",
      titleEn: "Pioneering Flood Mitigation Systems",
      descAr: "تنفيذ قنوات التصريف الصندوقية الخرسانية الضخمة وبحيرات التهدئة للأمانات والهيئات الملكية لمواجهة التقلبات المناخية وحماية المدن السعودية.",
      descEn: "Delivery of massive cast-in-place and precast storm culverts and retention basins for regional Amanats, fortifying urban climate resilience."
    },
    {
      year: "1431هـ / 2010م",
      titleAr: "نيل تصنيف الدرجة الأولى (Class 1)",
      titleEn: "Class 1 Contractor Classification",
      descAr: "حصول الشركة على التصنيف الأعلى من وزارة الشؤون البلدية والقروية والإسكان في مجالات المياه، الصرف الصحي، الطرق، والأعمال الكهربائية.",
      descEn: "Attained Class 1 Contractor accreditation from MOMRAH across water, wastewater, arterial roads, and electrical power disciplines."
    },
    {
      year: "1437هـ / 2016م",
      titleAr: "مواكبة رؤية السعودية 2030",
      titleEn: "Saudi Vision 2030 Strategic Alignment",
      descAr: "إعادة هيكلة العمليات التشغيلية، رقمنة إدارة الأسطول والمشاريع بنظام ERP متكامل، وتوسيع الشراكات مع مشاريع صندوق الاستثمارات العامة PIF.",
      descEn: "Operational modernization, telematics fleet integration, and executing high-precision enabling works for PIF giga-project destinations."
    },
    {
      year: "1447هـ / 2026م",
      titleAr: "خمسة عقود من الريادة واستشراف المستقبل",
      titleEn: "Five Decades of Engineering Legacy",
      descAr: "الاحتفاء بمرور خمسين عاماً هجرياً على التأسيس، مع أسطول يتجاوز 280 معدة ثقيلة، وأكثر من 14.5 مليون ساعة عمل آمنة، واستدامة بيئية كاملة.",
      descEn: "Marking 50 Hijri years of uninterrupted delivery with 280+ heavy equipment units, 14.5M+ safe man-hours, and smart infrastructure operations."
    }
  ];

  const leadershipTeam = [
    {
      nameAr: "المهندس / طارق بن عبدالله الهضب",
      nameEn: "Eng. Tariq Al-Hadab",
      roleAr: "رئيس مجلس الإدارة والرئيس التنفيذي",
      roleEn: "Chairman & Chief Executive Officer",
      bioAr: "خبرة قيادية تفوق 25 عاماً في قطاع الهندسة والمقاولات، قاد خلالها تحول الشركة الاستراتيجي نحو مشاريع البنية التحتية الكبرى والمشاريع التنموية السيادية.",
      bioEn: "Over 25 years of engineering and executive leadership, steering AL-HADAB's strategic expansion across national mega-projects and PIF developments."
    },
    {
      nameAr: "المهندس / فيصل الدوسري",
      nameEn: "Eng. Faisal Al-Dossary",
      roleAr: "نائب الرئيس للعمليات التشغيلية (COO)",
      roleEn: "Chief Operating Officer",
      bioAr: "خبير في إدارة سلاسل الإمداد اللوجستية وحشد الأساطيل الثقيلة وإدارة مواقع التنفيذ في التضاريس الجبلية والصحراوية الوعرة بأعلى معايير الدقة.",
      bioEn: "Specialist in construction logistics, fleet mobilization, and executing complex terrain civil works across the Kingdom's diverse provinces."
    },
    {
      nameAr: "المهندس / خالد الشهري",
      nameEn: "Eng. Khaled Al-Shehri",
      roleAr: "مدير الشؤون الفنية وضمان الجودة (QA/QC)",
      roleEn: "Technical Director & QA/QC Lead",
      bioAr: "عضو الهيئة السعودية للمهندسين ومراجع معتمد لأنظمة الكود السعودي (SBC) والمواصفات القياسية العالمية DIN و ASTM و SASO لمشاريع البنية التحتية.",
      bioEn: "Saudi Council of Engineers accredited specialist overseeing strict adherence to Saudi Building Codes and international ASTM/DIN/SASO audits."
    },
    {
      nameAr: "المهندس / سلمان المطيري",
      nameEn: "Eng. Salman Al-Mutairi",
      roleAr: "مدير إدارة الصحة والسلامة والبيئة (QHSSE)",
      roleEn: "Corporate QHSSE Director",
      bioAr: "حاصل على شهادات NEBOSH و OSHA الدولية، قاد تحقيق أكثر من 14.5 مليون ساعة عمل متواصلة دون أي إصابات هادرة للوقت (Zero LTI).",
      bioEn: "NEBOSH and OSHA certified director who steered AL-HADAB to 14.5M+ consecutive man-hours with zero lost-time incidents."
    }
  ];

  const certifications = [
    {
      code: "ISO 9001:2015",
      titleAr: "نظام إدارة الجودة العالمي",
      titleEn: "Quality Management System",
      descAr: "التزام صارم بإجراءات ضبط الجودة والاختبارات المعملية الميدانية لكافة المواد والخرسانات والأسفلت.",
      descEn: "Rigorous quality controls and accredited laboratory testing for all earth, concrete, and asphalt layers."
    },
    {
      code: "ISO 14001:2015",
      titleAr: "نظام الإدارة البيئية",
      titleEn: "Environmental Management System",
      descAr: "حماية البيئات الطبيعية والمحميات، والحد من الانبعاثات الكربونية وإعادة تدوير مخلفات الإنشاء.",
      descEn: "Protecting native ecology, controlling construction carbon footprint, and circular waste diversion."
    },
    {
      code: "ISO 45001:2018",
      titleAr: "نظام إدارة السلامة والصحة المهنية",
      titleEn: "Occupational Health & Safety",
      descAr: "تطبيق أعلى اشتراطات الأمان الميداني لكافة الكوادر والمشغلين في مواقع العمل الشاقة والأنفاق.",
      descEn: "Uncompromising on-site workforce safety protocols across confined spaces, deep excavations, and heavy plants."
    }
  ];

  const visionPillars = [
    {
      titleAr: "استدامة الموارد المائية ومقاومة السيول",
      titleEn: "Water Sustainability & Flood Resilience",
      descAr: "تنفيذ خطوط النقل الاستراتيجية وقنوات التصريف الهيدروليكية لحماية مدن المملكة وإعادة استغلال مياه الأمطار والمعالجة الثلاثية.",
      descEn: "Building trunk transmission lines and hydraulic flood networks protecting Saudi cities and recycling TSE water."
    },
    {
      titleAr: "مبادرة السعودية الخضراء وجودة الحياة",
      titleEn: "Saudi Green Initiative & Urban Quality",
      descAr: "إنشاء شبكات الري الذكية المركزية SCADA، وتشجير المحاور الحضرية والميادين بالنباتات المحلية المتكيفة مع المناخ الجاف.",
      descEn: "Delivering central smart SCADA irrigation, urban afforestation corridors, and civic parks with drought-tolerant flora."
    },
    {
      titleAr: "المحتوى المحلي وتوطين الكفاءات",
      titleEn: "Local Content & National Talent",
      descAr: "تمكين المهندسين والفنيين السعوديين، والاعتماد على سلاسل الإمداد والمصانع الوطنية بنسبة محتوى محلي متنامية سنوياً.",
      descEn: "Empowering Saudi civil engineers, certified operators, and prioritizing national manufacturing supply chains."
    }
  ];

  return (
    <div className="space-y-16 sm:space-y-24 py-12">
      {/* SEO Metadata */}
      <SEOHead
        titleAr="من نحن — خمسة عقود من الريادة الوطنية"
        titleEn="About Us — Five Decades of National Engineering Excellence"
        descriptionAr="تعرف على مسيرة شركة الهضب للتجارة والمقاولات منذ عام 1396هـ (1976م)، مجلس الإدارة، أسطول المعدات الثقيلة، والشهادات والاعتمادات الرسمية."
        descriptionEn="Learn about AL-HADAB's 48-year journey since 1976 in Saudi Arabia, executive stewardship, heavy fleet assets, ISO accreditations, and Vision 2030 alignment."
        canonicalPath="/about"
      />

      {/* Header Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="up">
          <div className="border-b border-sand-200 pb-10 space-y-4 text-start">
            <Badge variant="copper">{isAr ? "من نحن ومسيرتنا" : "About AL-HADAB"}</Badge>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-basalt-950 tracking-tight leading-tight">
              {isAr
                ? "خمسة عقود من البناء الصادق والشراكة الوطنية"
                : "Five Decades of Enduring National Infrastructure Craftsmanship"}
            </h1>
            <p className="text-base sm:text-lg text-basalt-600 max-w-4xl leading-relaxed">
              {isAr
                ? (profile?.shortDescAr || "تأسست شركة الهضب للتجارة والمقاولات عام 1396هـ (1976م) كصرح مقاولات وطني مصنف بالدرجة الأولى بالرياض. على مدار 48 عاماً، شاركت الشركة بفاعلية في بناء البنية التحتية للمملكة عبر مشاريع شبكات المياه والسيول، الطرق والجسور، والطاقة، مستندةً إلى أسطول مملوك يتجاوز 280 معدة ثقيلة وسجل سلامة قياسي.")
                : (profile?.shortDescEn || "Founded in 1396 AH (1976 G) in Riyadh, AL-HADAB is a premier Class 1 General Contractor. Over five uninterrupted decades, the company has delivered essential civil infrastructure for ministries, Amanats, and PIF giga-projects with an owned fleet exceeding 280 heavy machines.")}
            </p>
          </div>
        </ScrollReveal>
      </section>

      {/* Verified Stats Banner */}
      <ScrollReveal direction="up" delay={0.1}>
        <StatBanner isAr={isAr} statsData={dynamicStats} />
      </ScrollReveal>

      {/* Corporate Heritage & Core Values */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="up">
          <SectionHeader
            badge={isAr ? "المبادئ المؤسسية" : "Institutional Principles"}
            titleAr="الرؤية والرسالة والقيم الجوهرية"
            titleEn="Vision, Mission & Core Values"
            descriptionAr="مبادئ هندسية ثابتة أرست دعائم النجاح والاستقرار لأكثر من 48 عاماً."
            descriptionEn="Enduring engineering foundations driving performance stability since 1976."
            isAr={isAr}
            className="mb-8"
          />
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          <ScrollReveal direction="up" delay={0.1}>
            <div className="p-8 rounded-[10px] bg-white border border-sand-200 space-y-4 text-start shadow-elevation-1 h-full flex flex-col justify-between">
              <div className="space-y-3">
                <div className="h-12 w-12 rounded-[8px] bg-copper-50 text-copper-600 flex items-center justify-center font-bold">
                  <Compass className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-basalt-950">{isAr ? "رؤيتنا" : "Our Vision"}</h3>
                <p className="text-sm text-basalt-600 leading-relaxed">
                  {isAr
                    ? (profile?.visionAr || "أن تكون شركة الهضب النموذج الوطني الأعلى مكانة والأكثر موثوقية في قطاع المقاولات والهندسة المدنية بالمملكة العربية السعودية، وشريك التنمية الأول لكبرى المشاريع السيادية.")
                    : (profile?.visionEn || "To be the Kingdom's benchmark indigenous contracting and civil engineering partner, recognized for unmatched structural integrity, financial stability, and operational precision.")}
                </p>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.2}>
            <div className="p-8 rounded-[10px] bg-white border border-sand-200 space-y-4 text-start shadow-elevation-1 h-full flex flex-col justify-between">
              <div className="space-y-3">
                <div className="h-12 w-12 rounded-[8px] bg-copper-50 text-copper-600 flex items-center justify-center font-bold">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-basalt-950">{isAr ? "رسالتنا" : "Our Mission"}</h3>
                <p className="text-sm text-basalt-600 leading-relaxed">
                  {isAr
                    ? (profile?.missionAr || "تنفيذ وتسليم مشاريع البنية التحتية والمدن بأعلى المواصفات الفنية المعتمدة عالمياً، مع الالتزام التام بكود البناء السعودي ومعايير السلامة المهنية، بقيادة كفاءات وطنية متخصصة.")
                    : (profile?.missionEn || "Delivering infrastructure and civic works to rigorous global engineering standards, adhering strictly to the Saudi Building Code with zero compromise on safety and precision.")}
                </p>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.3}>
            <div className="p-8 rounded-[10px] bg-white border border-sand-200 space-y-4 text-start shadow-elevation-1 h-full flex flex-col justify-between">
              <div className="space-y-3">
                <div className="h-12 w-12 rounded-[8px] bg-copper-50 text-copper-600 flex items-center justify-center font-bold">
                  <Award className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-basalt-950">{isAr ? "هدفنا الاستراتيجي" : "Strategic Commitment"}</h3>
                <p className="text-sm text-basalt-600 leading-relaxed">
                  {isAr
                    ? "المساهمة المحورية في تحقيق مستهدفات رؤية السعودية 2030، والارتقاء بجودة الحياة والمشهد الحضري للمدن، وتأصيل الاستدامة البيئية عبر حلول تصريف السيول والطاقة النظيفة."
                    : "Actively advancing Saudi Vision 2030 targets by fortifying urban resilience, delivering smart water distribution networks, and accelerating local content integration."}
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Five Decades Interactive Timeline */}
      <section className="bg-sand-100/60 py-16 sm:py-20 border-y border-sand-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <ScrollReveal direction="up">
            <SectionHeader
              badge={isAr ? "المسيرة التاريخية" : "Historical Journey"}
              titleAr="خمسة عقود من المحطات الوطنية البارزة (1396هـ — اليوم)"
              titleEn="Five Decades of Defining Milestones (1976 — Present)"
              descriptionAr="سجل زمني يوثق تطور الشركة من بدايات التأسيس حتى قيادة أضخم المشاريع الإنشائية."
              descriptionEn="An audited chronology tracing the firm's evolution from foundation to mega-project leadership."
              isAr={isAr}
            />
          </ScrollReveal>

          {/* Timeline Milestones Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {milestones.map((m, idx) => {
              const isSelected = activeDecade === idx;
              return (
                <ScrollReveal key={idx} direction="up" delay={0.08 * (idx + 1)}>
                  <div
                    onClick={() => setActiveDecade(idx)}
                    className={`cursor-pointer p-6 rounded-[10px] border transition-all text-start h-full flex flex-col justify-between ${
                      isSelected
                        ? "bg-white border-copper-500 shadow-elevation-2 ring-2 ring-copper-500/20"
                        : "bg-white/80 border-sand-200 hover:border-copper-500/40 hover:bg-white"
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold px-2.5 py-1 rounded bg-sand-100 text-copper-600 border border-sand-200">
                          {m.year}
                        </span>
                        <span className="text-xs text-basalt-400 font-mono">
                          Phase {idx + 1}
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-basalt-950">
                        {isAr ? m.titleAr : m.titleEn}
                      </h4>
                      <p className="text-xs sm:text-sm text-basalt-600 leading-relaxed">
                        {isAr ? m.descAr : m.descEn}
                      </p>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Leadership & Executive Governance */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <ScrollReveal direction="up">
          <SectionHeader
            badge={isAr ? "القيادة والحوكمة" : "Executive Governance"}
            titleAr="مجلس الإدارة والقيادة التشغيلية"
            titleEn="Board of Directors & Operational Stewardship"
            descriptionAr="كفاءات هندسية وقيادية تتولى إدارة العمليات والمشاريع بأعلى معايير الحوكمة والشفافية."
            descriptionEn="Seasoned executive leaders overseeing national operations with uncompromising governance."
            isAr={isAr}
          />
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {leadershipTeam.map((leader, i) => (
            <ScrollReveal key={i} direction="up" delay={0.1 * (i + 1)}>
              <div className="bg-white border border-sand-200 rounded-[10px] p-6 space-y-4 text-start shadow-elevation-1 h-full flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="h-12 w-12 rounded-full bg-basalt-950 text-copper-400 border border-basalt-800 flex items-center justify-center font-bold font-mono shadow-inner">
                    {isAr ? "م" : "ENG"}
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-basalt-950">{isAr ? leader.nameAr : leader.nameEn}</h4>
                    <p className="text-xs font-semibold text-copper-600 mt-0.5">{isAr ? leader.roleAr : leader.roleEn}</p>
                  </div>
                  <p className="text-xs text-basalt-600 leading-relaxed">{isAr ? leader.bioAr : leader.bioEn}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Specialized Human Capital & Workforce Distribution */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <ScrollReveal direction="up">
          <SectionHeader
            badge={isAr ? "الكوادر البشرية" : "Specialized Workforce"}
            titleAr="توزيع الكوادر الهندسية والفنية الميدانية"
            titleEn="Multidisciplinary Technical & Engineering Labor Breakdown"
            descriptionAr={`تعتمد شركة الهضب على أسطول بشري ذاتي التنفيذ يتجاوز ${(workforceSummary?.totalEmployees ?? 1250).toLocaleString()} كادراً متخصصاً يضمنون السيطرة الكاملة على الجودة ومعايير السلامة.`}
            descriptionEn={`AL-HADAB deploys a self-performing, highly skilled workforce exceeding ${(workforceSummary?.totalEmployees ?? 1250).toLocaleString()} certified personnel with zero operational dependency on third-party basic trades.`}
            isAr={isAr}
          />
        </ScrollReveal>

        {/* Categories Grid */}
        {workforceLoading ? (
          <PageLoader variant="shimmer-list" count={6} />
        ) : (workforceSummary?.categories ?? []).length === 0 ? (
          <div className="py-10 text-center text-basalt-400 text-sm">
            {isAr ? "لا توجد بيانات قوى عاملة متاحة حالياً" : "No workforce data available yet"}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {(workforceSummary?.categories ?? []).map((cat, idx) => {
            const totalActive = workforceSummary?.totalEmployees || 1;
            const sharePct = ((cat.employeeCount / totalActive) * 100).toFixed(1);

            return (
              <ScrollReveal key={cat.id || idx} direction="up" delay={0.05 * (idx + 1)}>
                <div className="bg-white border border-sand-200 rounded-[10px] p-5 sm:p-6 space-y-3.5 text-start shadow-elevation-1 hover:border-copper-500/40 hover:shadow-elevation-2 transition-all h-full flex flex-col justify-between group">
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="h-10 w-10 rounded-[8px] bg-copper-50 text-copper-600 flex items-center justify-center font-bold group-hover:bg-copper-600 group-hover:text-white transition-colors">
                        <HardHat className="h-5 w-5" />
                      </div>
                      <span className="font-mono text-xs font-bold px-2.5 py-1 rounded bg-sand-100 text-copper-700 border border-sand-200">
                        {cat.employeeCount.toLocaleString()} {isAr ? "كادر" : "staff"}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-basalt-950">
                      {isAr ? cat.nameAr : cat.nameEn}
                    </h4>

                    {(cat.descriptionAr || cat.descriptionEn) && (
                      <p className="text-xs text-basalt-600 leading-relaxed">
                        {isAr ? cat.descriptionAr : cat.descriptionEn}
                      </p>
                    )}
                  </div>

                  {/* Share Percentage Progress Bar */}
                  <div className="space-y-1.5 pt-3 border-t border-sand-100">
                    <div className="flex justify-between text-[11px] font-semibold text-basalt-500">
                      <span>{isAr ? "النسبة من إجمالي القوى العاملة" : "Workforce Share"}</span>
                      <span className="font-mono text-copper-600 font-bold">{sharePct}%</span>
                    </div>
                    <div className="w-full bg-sand-200/80 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-copper-500 h-1.5 rounded-full transition-all duration-700"
                        style={{ width: `${Math.min(100, Math.max(2, Number(sharePct)))}%` }}
                      />
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      )}

        {/* National Localization Trust Badge */}
        <div className="p-4 sm:p-5 rounded-[10px] bg-sand-100/70 border border-sand-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3 text-start">
            <div className="h-9 w-9 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="font-bold text-basalt-900">
                {isAr ? "كفاءات معتمدة ومطابقة للاشتراطات التنظيمية (Nitaqat & QHSSE)" : "Certified Personnel & Full Regulatory Compliance (Nitaqat & QHSSE)"}
              </p>
              <p className="text-basalt-500 text-[11px]">
                {isAr
                  ? "برامج تدريب مستمرة على اشتراطات السلامة المهنية OSHA/NEBOSH وتوطين الكوادر الهندسية بنطاق بلاتيني."
                  : "Continuous safety training in high-risk environments with Platinum-rated Saudization compliance."}
              </p>
            </div>
          </div>
          <Badge variant="success" className="whitespace-nowrap">
            {isAr ? "نطاق بلاتيني معتمد" : "Platinum Nitaqat Rated"}
          </Badge>
        </div>
      </section>

      {/* ISO Certifications & Official Accreditation */}
      <section className="bg-basalt-950 text-white py-16 sm:py-20 border-y border-basalt-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <ScrollReveal direction="up">
            <SectionHeader
              badge={isAr ? "الاعتمادات والجودة" : "Quality & Compliance"}
              badgeVariant="basalt"
              titleAr="شهادات الجودة العالمية والاعتمادات الوطنية"
              titleEn="Triple ISO Certifications & National Accreditations"
              descriptionAr="نظام جودة متكامل وموثق يضمن مطابقة أدق المعايير الدولية في كافة مراحل التوريد والإنشاء والتسليم."
              descriptionEn="Audited institutional standards guaranteeing strict adherence across testing, supply chain, and turnkey execution."
              isAr={isAr}
            />
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {certifications.map((cert, idx) => (
              <ScrollReveal key={idx} direction="up" delay={0.1 * (idx + 1)}>
                <div className="bg-basalt-900 border border-basalt-800 rounded-[10px] p-6 sm:p-7 space-y-4 text-start shadow-elevation-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold px-3 py-1 rounded bg-basalt-950 text-copper-400 border border-copper-500/30">
                      {cert.code}
                    </span>
                    <ShieldCheck className="h-5 w-5 text-copper-400" />
                  </div>
                  <h4 className="text-lg font-bold text-white">
                    {isAr ? cert.titleAr : cert.titleEn}
                  </h4>
                  <p className="text-xs sm:text-sm text-sand-300 leading-relaxed">
                    {isAr ? cert.descAr : cert.descEn}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <div className="pt-4 border-t border-basalt-800 flex flex-wrap items-center justify-between gap-4 text-xs text-sand-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>{isAr ? "معتمد رسمي في منصة اعتماد (المشتريات الحكومية)" : "Accredited on Saudi Etimad Tender Portal"}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>{isAr ? "تأهيل بلدي المعتمد من وزارة البلديات والإسكان" : "Balady MOMRAH Pre-Qualified Contractor"}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>{isAr ? "عضوية الهيئة السعودية للمقاولين (SCA)" : "Saudi Contractors Authority (SCA) Verified Member"}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Equipment Fleet & Logistics Capacity */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <ScrollReveal direction="up">
          <SectionHeader
            badge={isAr ? "القدرة التشغيلية" : "Physical Fleet Equity"}
            titleAr="أسطول المعدات الثقيلة وجاهزية الحشد الميداني"
            titleEn="Owned Heavy Machinery & Rapid Mobilization Fleet"
            descriptionAr="تمتلك الشركة أسطولاً يتجاوز 280 وحدة من المعدات الثقيلة المتخصصة وورش صيانة مركزية تضمن التشغيل المستمر."
            descriptionEn="Over 280 owned heavy machinery units supported by central mobile maintenance stations ensuring uninterrupted field operations."
            isAr={isAr}
          />
        </ScrollReveal>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <MetricCard value="75" suffix="+" label={isAr ? "حفارات ثقيلة ومد يد" : "Heavy Excavators (CAT 349/336)"} />
          <MetricCard value="45" suffix="+" label={isAr ? "فراشات ومداحل أسفلت" : "Asphalt Pavers & Compactors"} />
          <MetricCard value="85" suffix="+" label={isAr ? "شاحنات قلاب ومعدات نقل" : "Heavy Haul Tipper Trucks"} />
          <MetricCard value="75" suffix="+" label={isAr ? "معدات مد الأنابيب واللحام" : "Pipe Layer & Trench Systems"} />
        </div>
      </section>

      {/* Vision 2030 Pillars Alignment */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <ScrollReveal direction="up">
          <SectionHeader
            badge={isAr ? "رؤية السعودية 2030" : "Saudi Vision 2030"}
            titleAr="التزامنا تجاه مستهدفات التحول الوطني"
            titleEn="Direct Alignment With Saudi Vision 2030"
            descriptionAr="مساهمة هندسية مباشرة في تعزيز الاستدامة وتطوير المشهد الحضري للمدن السعودية."
            descriptionEn="Engineering tangible value across the Kingdom's sustainability and civic quality of life goals."
            isAr={isAr}
            className="mb-8"
          />
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {visionPillars.map((pillar, idx) => (
            <ScrollReveal key={idx} direction="up" delay={0.1 * (idx + 1)}>
              <div className="bg-white border border-sand-200 rounded-[10px] p-6 sm:p-7 space-y-3 text-start shadow-elevation-1 h-full">
                <div className="h-10 w-10 rounded-[6px] bg-copper-50 text-copper-600 flex items-center justify-center font-bold">
                  <Target className="h-5 w-5" />
                </div>
                <h4 className="text-base sm:text-lg font-bold text-basalt-950">
                  {isAr ? pillar.titleAr : pillar.titleEn}
                </h4>
                <p className="text-xs sm:text-sm text-basalt-600 leading-relaxed">
                  {isAr ? pillar.descAr : pillar.descEn}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>
    </div>
  );
};
