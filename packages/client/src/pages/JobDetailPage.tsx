import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAppSelector } from "../app/hooks";
import { Badge, Button, SEOHead } from "../components/ui";
import {
  useGetJobOpeningByIdQuery,
  useSubmitJobApplicationMutation
} from "../services/apiSlice";
import {
  Briefcase,
  MapPin,
  Clock,
  Calendar,
  ChevronLeft,
  ChevronRight,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  FileText,
  ShieldCheck,
  Building2,
  User,
  Mail,
  Phone,
  ArrowRight
} from "lucide-react";

interface ApplyFormData {
  applicantName: string;
  email: string;
  phone: string;
  coverLetter?: string;
  resumeFile: FileList;
}

export const JobDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { language } = useAppSelector((state) => state.ui);
  const isAr = language === "ar";

  const { data: job, isLoading, error } = useGetJobOpeningByIdQuery(id || "", {
    skip: !id
  });

  const [submitApplication, { isLoading: isSubmitting }] = useSubmitJobApplicationMutation();

  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<ApplyFormData>();

  const onSubmit = async (data: ApplyFormData) => {
    setSubmitError(null);
    if (!job || !id) return;

    try {
      const file = data.resumeFile?.[0];
      if (!file) {
        setSubmitError(isAr ? "يرجى إرفاق ملف السيرة الذاتية (CV)" : "Please attach your resume (CV)");
        return;
      }

      // Check size (<= 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setSubmitError(isAr ? "حجم الملف يتجاوز الحد الأقصى (10 ميجابايت)" : "File size exceeds 10MB limit");
        return;
      }

      // Convert to Base64
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const base64String = reader.result as string;
          await submitApplication({
            jobOpeningId: job.id,
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

  if (isLoading) {
    return (
      <div className="min-h-[60vh] max-w-5xl mx-auto px-4 py-16 space-y-6">
        <div className="h-8 w-1/4 rounded bg-sand-200 animate-pulse" />
        <div className="h-10 w-3/4 rounded bg-sand-200 animate-pulse" />
        <div className="h-64 rounded bg-sand-200 animate-pulse" />
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-6">
        <AlertCircle className="h-16 w-16 text-copper-500 mx-auto" />
        <h2 className="text-2xl font-bold text-basalt-950">
          {isAr ? "الوظيفة غير متوفرة" : "Job Opening Not Found"}
        </h2>
        <p className="text-sm text-basalt-600">
          {isAr
            ? "قد تكون هذه الوظيفة قد اكتملت أو تم إيقاف استقبال الطلبات عليها."
            : "This position might have been filled or is no longer accepting applications."}
        </p>
        <Link to="/careers">
          <Button variant="primary" size="md">
            {isAr ? "العودة إلى دليل الوظائف" : "Back to Careers Hub"}
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-12 py-10">
      <SEOHead
        titleAr={`${job.titleAr} — التوظيف الهندسي | شركة الهضب`}
        titleEn={`${job.titleEn} — Engineering Careers | AL-HADAB`}
        descriptionAr={job.descriptionAr.slice(0, 150)}
        descriptionEn={job.descriptionEn.slice(0, 150)}
        canonicalPath={`/careers/${job.id}`}
      />

      {/* Breadcrumb & Navigation */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 text-xs text-basalt-500 mb-6">
          <Link to="/careers" className="hover:text-copper-600 transition-colors flex items-center gap-1">
            {isAr ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
            {isAr ? "الوظائف والفرص الهندسية" : "Careers & Openings"}
          </Link>
          <span>/</span>
          <span className="text-basalt-800 font-medium truncate max-w-xs sm:max-w-md">
            {isAr ? job.titleAr : job.titleEn}
          </span>
        </div>

        {/* Job Header Card */}
        <div className="bg-white border border-sand-200 rounded-[12px] p-6 sm:p-8 shadow-sm text-start space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="copper">{job.department}</Badge>
                <span className="text-xs font-semibold px-2.5 py-1 rounded bg-sand-100 text-basalt-700">
                  {job.employmentType}
                </span>
                {job.applicationDeadline && (
                  <span className="text-xs text-copper-700 font-medium flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {isAr ? "الموعد النهائي: " : "Deadline: "}
                    {new Date(job.applicationDeadline).toLocaleDateString(isAr ? "ar-SA" : "en-US")}
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-basalt-950">
                {isAr ? job.titleAr : job.titleEn}
              </h1>
            </div>

            <a href="#apply-form">
              <Button variant="primary" size="lg">
                {isAr ? "تقديم الطلب الآن" : "Apply For This Role"}
              </Button>
            </a>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-sand-200 text-xs text-basalt-600">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-copper-600" />
              <div>
                <p className="text-[10px] text-basalt-400 uppercase font-semibold">{isAr ? "الموقع" : "Location"}</p>
                <p className="font-semibold text-basalt-800">{job.location}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-copper-600" />
              <div>
                <p className="text-[10px] text-basalt-400 uppercase font-semibold">{isAr ? "القطاع" : "Division"}</p>
                <p className="font-semibold text-basalt-800">{job.department}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-copper-600" />
              <div>
                <p className="text-[10px] text-basalt-400 uppercase font-semibold">{isAr ? "نوع الدوام" : "Type"}</p>
                <p className="font-semibold text-basalt-800">{job.employmentType}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-copper-600" />
              <div>
                <p className="text-[10px] text-basalt-400 uppercase font-semibold">{isAr ? "المعايير" : "Standards"}</p>
                <p className="font-semibold text-basalt-800">{isAr ? "اعتماد هيئة المهندسين" : "SCE Verified"}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Grid: Description & Application Form */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-start">
          
          {/* Left / Main Column: Details */}
          <div className="lg:col-span-7 space-y-8">
            {/* Job Description */}
            <div className="bg-white border border-sand-200 rounded-[8px] p-6 space-y-4">
              <h2 className="text-lg font-bold text-basalt-950 flex items-center gap-2 border-b border-sand-200 pb-3">
                <FileText className="h-5 w-5 text-copper-600" />
                {isAr ? "الوصف الوظيفي والمسؤوليات الميدانية" : "Job Description & Site Responsibilities"}
              </h2>
              <div className="text-sm text-basalt-700 leading-relaxed whitespace-pre-line space-y-2">
                <p>{isAr ? job.descriptionAr : job.descriptionEn}</p>
              </div>
            </div>

            {/* Requirements */}
            <div className="bg-white border border-sand-200 rounded-[8px] p-6 space-y-4">
              <h2 className="text-lg font-bold text-basalt-950 flex items-center gap-2 border-b border-sand-200 pb-3">
                <ShieldCheck className="h-5 w-5 text-copper-600" />
                {isAr ? "المؤهلات والمتطلبات المهنية" : "Requirements & Professional Qualifications"}
              </h2>
              <div className="text-sm text-basalt-700 leading-relaxed whitespace-pre-line space-y-2">
                <p>{isAr ? job.requirementsAr : job.requirementsEn}</p>
              </div>
            </div>

            {/* Saudi Engineering Legacy Callout */}
            <div className="p-5 rounded-[8px] bg-sand-50 border border-sand-200 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-copper-700">
                {isAr ? "بيئة العمل في شركة الهضب" : "Engineering Environment at AL-HADAB"}
              </h4>
              <p className="text-xs text-basalt-600 leading-relaxed">
                {isAr
                  ? "نوفر بيئة هندسية احترافية تساند المهندسين الوطنيين برواتب تنافسية، برامج تدريب معتمدة، وتأمين طبي شامل لتمكين القيادات الهندسية في أضخم مشاريع رؤية المملكة 2030."
                  : "We offer competitive remuneration, structured SCE mentoring, and comprehensive medical coverage to lead landmark infrastructure sites."}
              </p>
            </div>
          </div>

          {/* Right Column: Application Form */}
          <div id="apply-form" className="lg:col-span-5">
            <div className="bg-white border border-sand-300 rounded-[12px] p-6 sm:p-7 shadow-elevation-2 sticky top-24 space-y-5">
              <div className="border-b border-sand-200 pb-3">
                <Badge variant="copper" className="mb-2">
                  {isAr ? "نموذج التقديم المباشر" : "Direct Application Form"}
                </Badge>
                <h3 className="text-base font-bold text-basalt-950">
                  {isAr ? "التقديم على هذا المنصب" : "Apply For This Position"}
                </h3>
                <p className="text-xs text-basalt-500 mt-1">
                  {isAr
                    ? "يرجى تعبئة البيانات بدقة وإرفاق أحدث نسخة من سيرتك الذاتية."
                    : "Please fill in your details accurately and attach your latest resume."}
                </p>
              </div>

              {submitSuccess ? (
                <div className="text-center py-8 space-y-4">
                  <div className="inline-flex p-3 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">
                    <CheckCircle2 className="h-10 w-10" />
                  </div>
                  <h4 className="text-base font-bold text-basalt-950">
                    {isAr ? "تم استلام طلبك بنجاح" : "Application Received"}
                  </h4>
                  <p className="text-xs text-basalt-600 leading-relaxed">
                    {isAr
                      ? "شكراً لاهتمامك بالانضمام لشركة الهضب. سيقوم فريق استقطاب الكفاءات بمراجعة بياناتك والتواصل معك."
                      : "Thank you for applying. Our talent acquisition team will review your qualifications and contact you soon."}
                  </p>
                  <Button
                    variant="tectonic"
                    size="md"
                    onClick={() => setSubmitSuccess(false)}
                    className="w-full"
                  >
                    {isAr ? "تقديم طلب آخر" : "Submit Another Application"}
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  {submitError && (
                    <div className="p-3 rounded-[6px] bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      <span>{submitError}</span>
                    </div>
                  )}

                  {/* Applicant Name */}
                  <div>
                    <label className="block text-xs font-semibold text-basalt-800 mb-1">
                      {isAr ? "الاسم الكامل *" : "Full Name *"}
                    </label>
                    <div className="relative">
                      <User className="absolute start-3 top-2.5 h-4 w-4 text-basalt-400" />
                      <input
                        type="text"
                        placeholder={isAr ? "م. فهد القحطاني" : "Eng. Fahad Al-Qahtani"}
                        className="w-full h-10 ps-9 pe-3 text-xs bg-sand-50/50 border border-sand-300 rounded-[6px] focus-ring"
                        {...register("applicantName", {
                          required: isAr ? "الاسم مطلوب" : "Name is required",
                          minLength: { value: 3, message: isAr ? "يجب أن يكون الاسم 3 أحرف على الأقل" : "Minimum 3 characters" }
                        })}
                      />
                    </div>
                    {errors.applicantName && (
                      <p className="text-[11px] text-red-600 mt-1">{errors.applicantName.message}</p>
                    )}
                  </div>

                  {/* Email & Phone */}
                  <div className="space-y-4 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-basalt-800 mb-1">
                        {isAr ? "البريد الإلكتروني *" : "Email Address *"}
                      </label>
                      <div className="relative">
                        <Mail className="absolute start-3 top-2.5 h-4 w-4 text-basalt-400" />
                        <input
                          type="email"
                          placeholder="engineer@email.com"
                          className="w-full h-10 ps-9 pe-3 text-xs bg-sand-50/50 border border-sand-300 rounded-[6px] focus-ring"
                          {...register("email", {
                            required: isAr ? "البريد الإلكتروني مطلوب" : "Email is required",
                            pattern: { value: /^\S+@\S+$/i, message: isAr ? "بريد إلكتروني غير صالح" : "Invalid email" }
                          })}
                        />
                      </div>
                      {errors.email && (
                        <p className="text-[11px] text-red-600 mt-1">{errors.email.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-basalt-800 mb-1">
                        {isAr ? "رقم الجوال *" : "Mobile Phone *"}
                      </label>
                      <div className="relative">
                        <Phone className="absolute start-3 top-2.5 h-4 w-4 text-basalt-400" />
                        <input
                          type="tel"
                          placeholder="+966 5X XXX XXXX"
                          className="w-full h-10 ps-9 pe-3 text-xs bg-sand-50/50 border border-sand-300 rounded-[6px] focus-ring"
                          {...register("phone", {
                            required: isAr ? "رقم الجوال مطلوب" : "Phone is required",
                            minLength: { value: 8, message: isAr ? "رقم الجوال قصير جداً" : "Too short" }
                          })}
                        />
                      </div>
                      {errors.phone && (
                        <p className="text-[11px] text-red-600 mt-1">{errors.phone.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Cover Letter / Notes */}
                  <div>
                    <label className="block text-xs font-semibold text-basalt-800 mb-1">
                      {isAr ? "نبذة عن الخبرات أو خطاب التقديم" : "Cover Letter / Highlights"}
                    </label>
                    <textarea
                      rows={3}
                      placeholder={
                        isAr
                          ? "اذكر أهم المشاريع الميدانية التي قمت بإدارتها أو مجالات تخصصك الدقيق..."
                          : "Brief summary of major projects managed or key technical specialties..."
                      }
                      className="w-full p-3 text-xs bg-sand-50/50 border border-sand-300 rounded-[6px] focus-ring resize-none"
                      {...register("coverLetter")}
                    />
                  </div>

                  {/* Secure Resume File Upload */}
                  <div>
                    <label className="block text-xs font-semibold text-basalt-800 mb-1">
                      {isAr ? "إرفاق السيرة الذاتية (CV) *" : "Attach Resume (PDF/DOCX) *"}
                    </label>
                    <div className="p-4 border-2 border-dashed border-sand-300 hover:border-copper-500 rounded-[8px] bg-sand-50/50 transition-colors text-center relative cursor-pointer">
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        {...register("resumeFile", {
                          required: isAr ? "يرجى إرفاق ملف السيرة الذاتية" : "Resume is required",
                          onChange: (e) => {
                            const f = e.target.files?.[0];
                            if (f) setSelectedFileName(f.name);
                          }
                        })}
                      />
                      <UploadCloud className="h-6 w-6 text-copper-600 mx-auto mb-1" />
                      <p className="text-xs font-semibold text-basalt-800">
                        {selectedFileName || (isAr ? "انقر لاختيار الملف أو اسحبه هنا" : "Click to select or drag file here")}
                      </p>
                      <p className="text-[10px] text-basalt-400 mt-1">
                        {isAr ? "صيغ PDF, DOCX (الحد الأقصى 10 ميجابايت)" : "PDF, DOCX formats (Max 10MB)"}
                      </p>
                    </div>
                    {errors.resumeFile && (
                      <p className="text-[11px] text-red-600 mt-1">{errors.resumeFile.message}</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    disabled={isSubmitting}
                    className="w-full"
                  >
                    {isSubmitting
                      ? (isAr ? "جاري الإرسال..." : "Submitting...")
                      : (isAr ? "إرسال طلب التوظيف" : "Submit Job Application")}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
