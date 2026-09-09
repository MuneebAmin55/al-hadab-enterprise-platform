import React, { useState } from "react";
import { useAppSelector } from "../app/hooks";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import {
  Briefcase,
  MapPin,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Users,
  Award,
  ArrowRight
} from "lucide-react";

export const CareersPage: React.FC = () => {
  const { language } = useAppSelector((state) => state.ui);
  const isAr = language === "ar";
  const [appliedRole, setAppliedRole] = useState<string | null>(null);
  const [applicationSubmitted, setApplicationSubmitted] = useState(false);

  const openPositions = [
    {
      id: "pos-01",
      titleAr: "مهندس مدني أول - مدير موقع مشاريع مياه وسيول",
      titleEn: "Senior Civil Site Engineer - Water & Stormwater",
      departmentAr: "إدارة البنية التحتية والمياه",
      departmentEn: "Hydraulic Infrastructure Division",
      locationAr: "مكة المكرمة",
      locationEn: "Makkah Al-Mukarramah",
      experienceAr: "7-10 سنوات خبرة في مشاريع خطوط النقل والعبارات الصندوقية",
      experienceEn: "7-10 years experience in trunk pipelines & culverts",
      typeAr: "دوام كامل",
      typeEn: "Full-Time"
    },
    {
      id: "pos-02",
      titleAr: "مهندس جودة وسلامة ميدانية (QA/QC & HSE Lead)",
      titleEn: "Field QA/QC & HSE Lead Engineer",
      departmentAr: "إدارة الجودة والسلامة والصحة المهنية",
      departmentEn: "QHSSE Corporate Division",
      locationAr: "الرياض (مقر الشركة والمشاريع الكبرى)",
      locationEn: "Riyadh (Headquarters & Giga-Projects)",
      experienceAr: "5-8 سنوات خبرة وشهادات OSHA / NEBOSH معتمدة",
      experienceEn: "5-8 years experience with certified NEBOSH/OSHA",
      typeAr: "دوام كامل",
      typeEn: "Full-Time"
    },
    {
      id: "pos-03",
      titleAr: "مهندس كهروميكانيك - إنارة ذكية ومحطات ضخ",
      titleEn: "MEP Engineer - Smart Lighting & Pumping Stations",
      departmentAr: "قطاع الأعمال الكهربائية والطاقة",
      departmentEn: "Electrical & Energy Division",
      locationAr: "جدة والمنطقة الغربية",
      locationEn: "Jeddah & Western Province",
      experienceAr: "4-7 سنوات خبرة في محطات التحويل وأنظمة التحكم الآلي",
      experienceEn: "4-7 years in MV substations and SCADA automation",
      typeAr: "دوام كامل",
      typeEn: "Full-Time"
    },
    {
      id: "pos-04",
      titleAr: "مساح أراضي عام - مشاريع تسويات ترابية وطرق",
      titleEn: "Senior Land Surveyor - Earthworks & Highways",
      departmentAr: "إدارة المساحة والتحكم الطبوغرافي",
      departmentEn: "Topographical Survey Division",
      locationAr: "القدية، الرياض",
      locationEn: "Qiddiya, Riyadh",
      experienceAr: "5+ سنوات خبرة بأجهزة Total Station و GPS ثلاثي الأبعاد",
      experienceEn: "5+ years with 3D GPS machine guidance & Total Station",
      typeAr: "دوام كامل",
      typeEn: "Full-Time"
    }
  ];

  return (
    <div className="space-y-12 py-12">
      {/* Header Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-b border-sand-200 pb-8 space-y-3 text-start">
          <Badge variant="copper">{isAr ? "الكفاءات والوظائف" : "Careers & Talent Hub"}</Badge>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-basalt-950">
            {isAr ? "ابنِ مستقبلك المهني مع رواد البنية التحتية" : "Build Your Career on Five Decades of Engineering Legacy"}
          </h1>
          <p className="text-sm sm:text-base text-basalt-600 max-w-3xl leading-relaxed">
            {isAr
              ? "نعتز بكادرنا الوطني المتنوع ونوفر بيئة عمل هندسية محفزة تتيح للمهندسين والفنيين السعوديين قيادة أضخم المشاريع الإنشائية وفق أعلى ممارسات السلامة والتطوير المهني."
              : "Fostering national engineering excellence across iconic infrastructure projects with competitive career progression and uncompromised safety culture."}
          </p>
        </div>
      </section>

      {/* Culture & Saudization Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-[8px] bg-white border border-sand-200 space-y-3 text-start shadow-sm">
            <div className="h-10 w-10 rounded bg-copper-50 text-copper-600 flex items-center justify-center font-bold">
              <Users className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-basalt-950">
              {isAr ? "تمكين الكفاءات الوطنية" : "Saudization & Talent Mentorship"}
            </h3>
            <p className="text-xs text-basalt-600 leading-relaxed">
              {isAr
                ? "برامج تدريبية وتأهيلية مكثفة للمهندسين حديثي التخرج لنيل الاعتماد المهني والارتقاء للمناصب القيادية الميدانية."
                : "Continuous development programs empowering Saudi graduate engineers into senior site management."}
            </p>
          </div>

          <div className="p-6 rounded-[8px] bg-white border border-sand-200 space-y-3 text-start shadow-sm">
            <div className="h-10 w-10 rounded bg-copper-50 text-copper-600 flex items-center justify-center font-bold">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-basalt-950">
              {isAr ? "بيئة عمل آمنة ومستقرة" : "Safety-First Site Culture"}
            </h3>
            <p className="text-xs text-basalt-600 leading-relaxed">
              {isAr
                ? "التزام حازم بتدابير السلامة والصحة المهنية ومعدات الحماية الشخصية وفق معايير ISO 45001 العالمية."
                : "Strict enforcement of occupational health and safety protocols backed by our 14.5M safe man-hours record."}
            </p>
          </div>

          <div className="p-6 rounded-[8px] bg-white border border-sand-200 space-y-3 text-start shadow-sm">
            <div className="h-10 w-10 rounded bg-copper-50 text-copper-600 flex items-center justify-center font-bold">
              <Award className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-basalt-950">
              {isAr ? "مشاريع وطنية كبرى" : "Iconic National Projects"}
            </h3>
            <p className="text-xs text-basalt-600 leading-relaxed">
              {isAr
                ? "فرصة فريدة للمشاركة الميدانية في تنفيذ مشاريع صندوق الاستثمارات العامة الكبرى وبنية المدن الذكية."
                : "Real site exposure to Vision 2030 giga-project infrastructures across the Kingdom."}
            </p>
          </div>
        </div>
      </section>

      {/* Job Openings Directory */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-start border-b border-sand-200 pb-3">
          <h2 className="text-xl font-bold text-basalt-950">
            {isAr ? "الوظائف الهندسية الشاغرة" : "Current Engineering Vacancies"}
          </h2>
        </div>

        <div className="space-y-4">
          {openPositions.map((pos) => (
            <div
              key={pos.id}
              className="bg-white border border-sand-200 rounded-[8px] p-6 hover:border-copper-500/40 hover:shadow-elevation-1 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 text-start"
            >
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2 items-center">
                  <Badge variant="copper">{isAr ? pos.departmentAr : pos.departmentEn}</Badge>
                  <span className="text-xs text-basalt-500 font-medium">{isAr ? pos.typeAr : pos.typeEn}</span>
                </div>
                <h3 className="text-lg font-bold text-basalt-950">
                  {isAr ? pos.titleAr : pos.titleEn}
                </h3>
                <div className="flex flex-wrap gap-4 text-xs text-basalt-600">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-copper-500" />
                    <span>{isAr ? pos.locationAr : pos.locationEn}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-copper-500" />
                    <span>{isAr ? pos.experienceAr : pos.experienceEn}</span>
                  </span>
                </div>
              </div>

              <div>
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => {
                    setAppliedRole(isAr ? pos.titleAr : pos.titleEn);
                    setApplicationSubmitted(false);
                  }}
                >
                  {isAr ? "تقديم طلب مباشر" : "Fast-Track Apply"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Application Slide-in / Modal State */}
      {appliedRole && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-basalt-950/70 backdrop-blur-sm">
          <div className="bg-white border border-sand-300 rounded-[8px] p-6 sm:p-8 max-w-lg w-full text-start space-y-4 shadow-elevation-4">
            {applicationSubmitted ? (
              <div className="text-center py-6 space-y-4">
                <div className="inline-flex p-3 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">
                  <CheckCircle2 className="h-10 w-10" />
                </div>
                <h4 className="text-lg font-bold text-basalt-950">
                  {isAr ? "تم استلام طلب التوظيف بنجاح" : "Application Submitted Successfully"}
                </h4>
                <p className="text-xs text-basalt-600 leading-relaxed">
                  {isAr
                    ? "سيتواصل معك فريق استقطاب الكفاءات الهندسية بشركة الهضب في حال تطابق المؤهلات مع متطلبات الوظيفة الشاغرة."
                    : "Our talent acquisition team will review your CV and contact you within 7 business days."}
                </p>
                <Button variant="tectonic" size="md" onClick={() => setAppliedRole(null)}>
                  {isAr ? "إغلاق" : "Close"}
                </Button>
              </div>
            ) : (
              <>
                <div className="border-b border-sand-200 pb-3">
                  <h3 className="text-base font-bold text-basalt-950">
                    {isAr ? "التقديم على وظيفة:" : "Apply For:"} {appliedRole}
                  </h3>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setApplicationSubmitted(true);
                  }}
                  className="space-y-3"
                >
                  <div>
                    <label className="block text-xs font-semibold text-basalt-800 mb-1">
                      {isAr ? "الاسم الكامل *" : "Full Name *"}
                    </label>
                    <input
                      required
                      type="text"
                      placeholder={isAr ? "م. فهد القحطاني" : "Eng. Fahad Al-Qahtani"}
                      className="w-full h-10 px-3 text-xs bg-sand-50/50 border border-sand-300 rounded-[6px] focus-ring"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-basalt-800 mb-1">
                        {isAr ? "رقم الجوال *" : "Mobile *"}
                      </label>
                      <input
                        required
                        type="tel"
                        placeholder="+966 5X XXX XXXX"
                        className="w-full h-10 px-3 text-xs bg-sand-50/50 border border-sand-300 rounded-[6px] focus-ring"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-basalt-800 mb-1">
                        {isAr ? "البريد الإلكتروني *" : "Email *"}
                      </label>
                      <input
                        required
                        type="email"
                        placeholder="engineer@email.com"
                        className="w-full h-10 px-3 text-xs bg-sand-50/50 border border-sand-300 rounded-[6px] focus-ring"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-basalt-800 mb-1">
                      {isAr ? "رقم عضوية هيئة المهندسين (إن وجد)" : "Saudi Council of Engineers (SCE) ID"}
                    </label>
                    <input
                      type="text"
                      placeholder="SCE-XXXXXX"
                      className="w-full h-10 px-3 text-xs bg-sand-50/50 border border-sand-300 rounded-[6px] focus-ring font-mono"
                    />
                  </div>

                  <div className="p-3 rounded-[6px] bg-sand-50 border border-sand-200 text-xs text-basalt-600">
                    <p className="font-semibold text-basalt-800 mb-1">
                      {isAr ? "إرفاق السيرة الذاتية (CV)" : "Attach Curriculum Vitae (PDF)"}
                    </p>
                    <input type="file" accept=".pdf,.doc,.docx" className="text-xs text-basalt-500" />
                  </div>

                  <div className="pt-2 flex gap-3">
                    <Button type="submit" variant="primary" size="md" className="flex-1">
                      {isAr ? "إرسال طلب التوظيف" : "Submit Application"}
                    </Button>
                    <Button
                      type="button"
                      variant="tectonic"
                      size="md"
                      onClick={() => setAppliedRole(null)}
                    >
                      {isAr ? "إلغاء" : "Cancel"}
                    </Button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
