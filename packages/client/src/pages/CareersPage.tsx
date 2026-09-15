import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAppSelector } from "../app/hooks";
import { Badge, Button, SEOHead } from "../components/ui";
import {
  useGetJobOpeningsQuery,
  useSubmitJobApplicationMutation
} from "../services/apiSlice";
import type { JobOpeningEntity } from "@alhadab/shared";
import {
  Briefcase,
  MapPin,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Users,
  Award,
  ArrowRight,
  Search,
  Filter,
  Calendar,
  AlertCircle,
  UploadCloud,
  FileText,
  X
} from "lucide-react";

interface FastApplyFormData {
  applicantName: string;
  email: string;
  phone: string;
  coverLetter?: string;
  resumeFile: FileList;
}

export const CareersPage: React.FC = () => {
  const { language } = useAppSelector((state) => state.ui);
  const isAr = language === "ar";

  const [selectedDept, setSelectedDept] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedJobForModal, setSelectedJobForModal] = useState<JobOpeningEntity | null>(null);

  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

  const { data: jobOpenings = [], isLoading } = useGetJobOpeningsQuery();
  const [submitApplication, { isLoading: isSubmitting }] = useSubmitJobApplicationMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<FastApplyFormData>();

  // Extract unique departments for filter tabs
  const departments = useMemo(() => {
    const set = new Set<string>();
    jobOpenings.forEach((j) => {
      if (j.department) set.add(j.department);
    });
    return Array.from(set);
  }, [jobOpenings]);

  // Client-side filtering if needed
  const filteredJobs = useMemo(() => {
    return jobOpenings.filter((job) => {
      const matchDept = selectedDept === "ALL" || job.department === selectedDept;
      const matchSearch =
        !searchQuery ||
        job.titleAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.descriptionAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.descriptionEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.location.toLowerCase().includes(searchQuery.toLowerCase());
      return matchDept && matchSearch;
    });
  }, [jobOpenings, selectedDept, searchQuery]);

  const onFastApplySubmit = async (data: FastApplyFormData) => {
    if (!selectedJobForModal) return;
    setSubmitError(null);

    try {
      const file = data.resumeFile?.[0];
      if (!file) {
        setSubmitError(isAr ? "يرجى إرفاق ملف السيرة الذاتية (CV)" : "Please attach your resume (CV)");
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        setSubmitError(isAr ? "حجم الملف يتجاوز الحد الأقصى (10 ميجابايت)" : "File size exceeds 10MB limit");
        return;
      }

      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const base64String = reader.result as string;
          await submitApplication({
            jobOpeningId: selectedJobForModal.id,
            applicantName: data.applicantName,
            email: data.email,
            phone: data.phone,
            coverLetter: data.coverLetter || "",
            resumeBase64: base64String,
            resumeFileName: file.name
          }).unwrap();

          setSubmitSuccess(true);
          reset();
          setSelectedFileName(null);
        } catch (err: any) {
          setSubmitError(err?.data?.error?.message || (isAr ? "تعذر إرسال الطلب، يرجى المحاولة لاحقاً" : "Failed to submit application. Please try again."));
        }
      };
      reader.onerror = () => {
        setSubmitError(isAr ? "فشل قراءة ملف السيرة الذاتية" : "Failed to read resume file");
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      setSubmitError(err?.data?.error?.message || (isAr ? "حدث خطأ أثناء المعالجة" : "An error occurred during submission"));
    }
  };

  return (
    <div className="space-y-12 py-12">
      <SEOHead
        titleAr="التوظيف والكفاءات — انضم لرواد الهندسة والبنية التحتية"
        titleEn="Careers & Talent Hub — Join Saudi Infrastructure Leaders"
        descriptionAr="استكشف الفرص الوظيفية والفرص الهندسية الميدانية في شركة الهضب للتجارة والمقاولات: وظائف مهندسين مدنيين، كهروميكانيك، مساحين، وخبراء الجودة والسلامة."
        descriptionEn="Explore engineering career opportunities at AL-HADAB: civil engineers, MEP engineers, land surveyors, and QHSSE leads across mega projects in Saudi Arabia."
        canonicalPath="/careers"
      />

      {/* Header Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-b border-sand-200 pb-8 space-y-3 text-start">
          <Badge variant="copper">{isAr ? "الكفاءات والتوظيف" : "Careers & Talent Hub"}</Badge>
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
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-sand-200 pb-4 text-start">
          <div>
            <h2 className="text-xl font-bold text-basalt-950">
              {isAr ? "الوظائف الهندسية الشاغرة" : "Current Engineering Vacancies"}
            </h2>
            <p className="text-xs text-basalt-500 mt-0.5">
              {isAr
                ? `متاح حالياً (${filteredJobs.length}) وظيفة شاغرة لاستقطاب الكفاءات`
                : `Currently available (${filteredJobs.length}) open positions`}
            </p>
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="absolute start-3 top-2.5 h-4 w-4 text-basalt-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isAr ? "بحث في الوظائف والمواقع..." : "Search positions & locations..."}
              className="w-full h-9 ps-9 pe-8 text-xs bg-white border border-sand-300 rounded-[6px] focus-ring"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute end-2.5 top-2.5 text-basalt-400 hover:text-basalt-700"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Department Filter Tabs */}
        {departments.length > 0 && (
          <div className="flex flex-wrap gap-2 text-start">
            <button
              onClick={() => setSelectedDept("ALL")}
              className={`px-3.5 py-1.5 rounded-[6px] text-xs font-semibold transition-colors ${
                selectedDept === "ALL"
                  ? "bg-copper-600 text-white shadow-sm"
                  : "bg-white text-basalt-700 border border-sand-200 hover:border-copper-300"
              }`}
            >
              {isAr ? "جميع الأقسام" : "All Departments"} ({jobOpenings.length})
            </button>
            {departments.map((dept) => {
              const count = jobOpenings.filter((j) => j.department === dept).length;
              return (
                <button
                  key={dept}
                  onClick={() => setSelectedDept(dept)}
                  className={`px-3.5 py-1.5 rounded-[6px] text-xs font-semibold transition-colors ${
                    selectedDept === dept
                      ? "bg-copper-600 text-white shadow-sm"
                      : "bg-white text-basalt-700 border border-sand-200 hover:border-copper-300"
                  }`}
                >
                  {dept} ({count})
                </button>
              );
            })}
          </div>
        )}

        {/* Jobs List / Grid */}
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 rounded-[8px] bg-sand-200 animate-pulse" />
            ))}
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="text-center py-16 bg-white border border-sand-200 rounded-[8px] space-y-3">
            <AlertCircle className="h-10 w-10 text-basalt-400 mx-auto" />
            <p className="text-sm font-semibold text-basalt-800">
              {isAr ? "لا توجد وظائف شاغرة مطابقة للبحث" : "No matching vacancies found"}
            </p>
            <p className="text-xs text-basalt-500">
              {isAr ? "جرب تغيير خيارات التصفية أو البحث" : "Try adjusting your search query or department filter"}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredJobs.map((pos) => (
              <div
                key={pos.id}
                className="bg-white border border-sand-200 rounded-[8px] p-6 hover:border-copper-500/50 hover:shadow-elevation-1 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 text-start"
              >
                <div className="space-y-2.5 max-w-2xl">
                  <div className="flex flex-wrap gap-2 items-center">
                    <Badge variant="copper">{pos.department}</Badge>
                    <span className="text-xs text-basalt-600 font-semibold px-2 py-0.5 rounded bg-sand-100">
                      {pos.employmentType}
                    </span>
                    {pos.applicationDeadline && (
                      <span className="text-[11px] text-copper-700 font-medium flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {isAr ? "حتى " : "Deadline: "}
                        {new Date(pos.applicationDeadline).toLocaleDateString(isAr ? "ar-SA" : "en-US")}
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-basalt-950 hover:text-copper-700 transition-colors">
                    <Link to={`/careers/${pos.id}`}>
                      {isAr ? pos.titleAr : pos.titleEn}
                    </Link>
                  </h3>

                  <p className="text-xs text-basalt-600 line-clamp-2 leading-relaxed">
                    {isAr ? pos.descriptionAr : pos.descriptionEn}
                  </p>

                  <div className="flex flex-wrap gap-4 text-xs text-basalt-600 pt-1">
                    <span className="flex items-center gap-1 font-medium">
                      <MapPin className="h-3.5 w-3.5 text-copper-500" />
                      <span>{pos.location}</span>
                    </span>
                    <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      <span>{isAr ? "اعتماد المهندسين" : "SCE Verified"}</span>
                    </span>
                  </div>
                </div>

                <div className="flex flex-row md:flex-col items-center md:items-end gap-3 shrink-0">
                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => {
                      setSelectedJobForModal(pos);
                      setSubmitSuccess(false);
                      setSubmitError(null);
                    }}
                    className="w-full sm:w-auto"
                  >
                    {isAr ? "تقديم طلب مباشر" : "Fast-Track Apply"}
                  </Button>
                  <Link to={`/careers/${pos.id}`}>
                    <Button variant="ghost" size="sm" className="text-xs">
                      {isAr ? "تفاصيل الوظيفة" : "View Details"}
                      {isAr ? <ArrowRight className="h-3 w-3 rotate-180 ms-1" /> : <ArrowRight className="h-3 w-3 ms-1" />}
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Fast-Track Apply Modal */}
      {selectedJobForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-basalt-950/70 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white border border-sand-300 rounded-[12px] p-6 sm:p-8 max-w-lg w-full text-start space-y-4 shadow-elevation-4 my-8">
            {submitSuccess ? (
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
                <Button
                  variant="tectonic"
                  size="md"
                  onClick={() => {
                    setSelectedJobForModal(null);
                    setSubmitSuccess(false);
                  }}
                >
                  {isAr ? "إغلاق" : "Close"}
                </Button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between border-b border-sand-200 pb-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-copper-700">
                      {isAr ? "تقديم طلب توظيف فوري" : "Fast-Track Application"}
                    </span>
                    <h3 className="text-base font-bold text-basalt-950 truncate max-w-xs sm:max-w-sm">
                      {isAr ? selectedJobForModal.titleAr : selectedJobForModal.titleEn}
                    </h3>
                  </div>
                  <button
                    onClick={() => setSelectedJobForModal(null)}
                    className="text-basalt-400 hover:text-basalt-700 p-1"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit(onFastApplySubmit)} className="space-y-3.5">
                  {submitError && (
                    <div className="p-3 rounded-[6px] bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      <span>{submitError}</span>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-basalt-800 mb-1">
                      {isAr ? "الاسم الكامل *" : "Full Name *"}
                    </label>
                    <input
                      type="text"
                      placeholder={isAr ? "م. فهد القحطاني" : "Eng. Fahad Al-Qahtani"}
                      className="w-full h-10 px-3 text-xs bg-sand-50/50 border border-sand-300 rounded-[6px] focus-ring"
                      {...register("applicantName", {
                        required: isAr ? "الاسم مطلوب" : "Name is required",
                        minLength: { value: 3, message: isAr ? "يجب أن يكون 3 أحرف على الأقل" : "Min 3 characters" }
                      })}
                    />
                    {errors.applicantName && (
                      <p className="text-[11px] text-red-600 mt-0.5">{errors.applicantName.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-basalt-800 mb-1">
                        {isAr ? "رقم الجوال *" : "Mobile *"}
                      </label>
                      <input
                        type="tel"
                        placeholder="+966 5X XXX XXXX"
                        className="w-full h-10 px-3 text-xs bg-sand-50/50 border border-sand-300 rounded-[6px] focus-ring"
                        {...register("phone", {
                          required: isAr ? "رقم الجوال مطلوب" : "Phone is required"
                        })}
                      />
                      {errors.phone && (
                        <p className="text-[11px] text-red-600 mt-0.5">{errors.phone.message}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-basalt-800 mb-1">
                        {isAr ? "البريد الإلكتروني *" : "Email *"}
                      </label>
                      <input
                        type="email"
                        placeholder="engineer@email.com"
                        className="w-full h-10 px-3 text-xs bg-sand-50/50 border border-sand-300 rounded-[6px] focus-ring"
                        {...register("email", {
                          required: isAr ? "البريد الإلكتروني مطلوب" : "Email is required",
                          pattern: { value: /^\S+@\S+$/i, message: isAr ? "بريد غير صالح" : "Invalid email" }
                        })}
                      />
                      {errors.email && (
                        <p className="text-[11px] text-red-600 mt-0.5">{errors.email.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-basalt-800 mb-1">
                      {isAr ? "نبذة عن الخبرة والمشاريع السابقة" : "Cover Letter / Highlights"}
                    </label>
                    <textarea
                      rows={2}
                      placeholder={isAr ? "سنوات الخبرة، المشاريع المنفذة..." : "Brief project experience or credentials..."}
                      className="w-full p-2.5 text-xs bg-sand-50/50 border border-sand-300 rounded-[6px] focus-ring resize-none"
                      {...register("coverLetter")}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-basalt-800 mb-1">
                      {isAr ? "إرفاق السيرة الذاتية (CV) *" : "Attach Resume (PDF/DOCX) *"}
                    </label>
                    <div className="p-3 border-2 border-dashed border-sand-300 hover:border-copper-500 rounded-[6px] bg-sand-50 text-center relative cursor-pointer">
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        {...register("resumeFile", {
                          required: isAr ? "يرجى إرفاق السيرة الذاتية" : "Resume is required",
                          onChange: (e) => {
                            const f = e.target.files?.[0];
                            if (f) setSelectedFileName(f.name);
                          }
                        })}
                      />
                      <UploadCloud className="h-5 w-5 text-copper-600 mx-auto mb-0.5" />
                      <p className="text-xs font-semibold text-basalt-800">
                        {selectedFileName || (isAr ? "انقر لاختيار ملف السيرة الذاتية" : "Click to select CV file")}
                      </p>
                      <p className="text-[10px] text-basalt-400">PDF, DOCX (Max 10MB)</p>
                    </div>
                    {errors.resumeFile && (
                      <p className="text-[11px] text-red-600 mt-0.5">{errors.resumeFile.message}</p>
                    )}
                  </div>

                  <div className="pt-2 flex gap-3">
                    <Button
                      type="submit"
                      variant="primary"
                      size="md"
                      disabled={isSubmitting}
                      className="flex-1"
                    >
                      {isSubmitting ? (isAr ? "جاري الإرسال..." : "Submitting...") : (isAr ? "إرسال طلب التوظيف" : "Submit Application")}
                    </Button>
                    <Button
                      type="button"
                      variant="tectonic"
                      size="md"
                      onClick={() => setSelectedJobForModal(null)}
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
