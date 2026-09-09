import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ScopedInquirySchema, ScopedInquiryInput } from "@alhadab/shared";
import { useSubmitInquiryMutation } from "../services/apiSlice";
import { useAppSelector } from "../app/hooks";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import {
  Building2,
  Phone,
  Mail,
  MapPin,
  FileCheck,
  CheckCircle2,
  Send,
  ShieldCheck,
  MessageSquare
} from "lucide-react";

export const ContactPage: React.FC = () => {
  const { language } = useAppSelector((state) => state.ui);
  const isAr = language === "ar";
  const [submitInquiry, { isLoading }] = useSubmitInquiryMutation();
  const [submittedReceipt, setSubmittedReceipt] = useState<any | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors }
  } = useForm<ScopedInquiryInput>({
    resolver: zodResolver(ScopedInquirySchema),
    defaultValues: {
      intentType: "ENTERPRISE_RFP",
      consentToPdplPolicy: true
    }
  });

  const selectedIntent = watch("intentType");

  const onSubmit = async (data: ScopedInquiryInput) => {
    try {
      const response = await submitInquiry(data).unwrap();
      setSubmittedReceipt(response);
    } catch (err: any) {
      alert(err?.data?.error?.message || "Submission failed. Please check required fields.");
    }
  };

  return (
    <div className="space-y-12 py-12">
      {/* Header Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-b border-sand-200 pb-8 space-y-3 text-start">
          <Badge variant="copper">{isAr ? "التواصل والمناقصات" : "Contact & Tender Ingestion"}</Badge>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-basalt-950">
            {isAr ? "تقديم طلبات المناقصات والتواصل المباشر" : "Direct RFP Submission & Enterprise Inquiry"}
          </h1>
          <p className="text-sm sm:text-base text-basalt-600 max-w-3xl leading-relaxed">
            {isAr
              ? "نرحب بالتواصل مع ممثلي الوزارات السيادية، مديري مشتريات المشاريع الكبرى، واستشاريي الهندسة لمناقشة نطاق المشاريع وتقديم العروض الفنية والمالية."
              : "Direct channel for ministries, PIF procurement committees, and engineering PMOs to submit tender packages and request technical evaluations."}
          </p>
        </div>
      </section>

      {/* Main Grid: Form on Left/Center, HQ Details on Right */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Inquiry Form Column */}
          <div className="lg:col-span-8 bg-white border border-sand-200 rounded-[8px] p-6 sm:p-10 shadow-elevation-1 text-start space-y-6">
            {submittedReceipt ? (
              <div className="py-12 text-center space-y-5">
                <div className="inline-flex p-3 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">
                  <CheckCircle2 className="h-12 w-12" />
                </div>
                <h3 className="text-2xl font-bold text-basalt-950">
                  {isAr ? "تم استلام طلبكم بنجاح" : "Inquiry Submitted Successfully"}
                </h3>
                <p className="text-sm text-basalt-600">
                  {isAr ? "رقم المتابعة المرجعي:" : "Tracking Reference ID:"}{" "}
                  <span className="font-mono font-bold text-copper-600">
                    {submittedReceipt.trackingId}
                  </span>
                </p>
                <p className="text-xs text-basalt-500 max-w-md mx-auto leading-relaxed">
                  {isAr ? submittedReceipt.messageAr : submittedReceipt.messageEn}
                </p>
                <Button
                  variant="tectonic"
                  size="md"
                  onClick={() => {
                    setSubmittedReceipt(null);
                    reset();
                  }}
                >
                  {isAr ? "إرسال استفسار آخر" : "Submit Another Inquiry"}
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <h3 className="text-base font-bold text-basalt-950">
                    {isAr ? "اختر طبيعة الاستفسار أو المناقصة *" : "Select Inquiry / Tender Nature *"}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                    <label
                      className={`p-3 rounded-[6px] border text-xs font-semibold cursor-pointer transition-all flex items-center gap-2.5 ${
                        selectedIntent === "GOVERNMENT_TENDER"
                          ? "bg-copper-50 border-copper-500 text-copper-700"
                          : "bg-white border-sand-300 text-basalt-700 hover:bg-sand-50"
                      }`}
                    >
                      <input
                        type="radio"
                        value="GOVERNMENT_TENDER"
                        {...register("intentType")}
                        className="sr-only"
                      />
                      <Building2 className="h-4 w-4" />
                      <span>{isAr ? "مناقصة جهة حكومية / بلدية" : "Government / Municipal Tender"}</span>
                    </label>

                    <label
                      className={`p-3 rounded-[6px] border text-xs font-semibold cursor-pointer transition-all flex items-center gap-2.5 ${
                        selectedIntent === "ENTERPRISE_RFP"
                          ? "bg-copper-50 border-copper-500 text-copper-700"
                          : "bg-white border-sand-300 text-basalt-700 hover:bg-sand-50"
                      }`}
                    >
                      <input
                        type="radio"
                        value="ENTERPRISE_RFP"
                        {...register("intentType")}
                        className="sr-only"
                      />
                      <FileCheck className="h-4 w-4" />
                      <span>{isAr ? "مشروع خاص أو مطور عقاري" : "Private / Giga-Project RFP"}</span>
                    </label>

                    <label
                      className={`p-3 rounded-[6px] border text-xs font-semibold cursor-pointer transition-all flex items-center gap-2.5 ${
                        selectedIntent === "TECHNICAL_RFI"
                          ? "bg-copper-50 border-copper-500 text-copper-700"
                          : "bg-white border-sand-300 text-basalt-700 hover:bg-sand-50"
                      }`}
                    >
                      <input
                        type="radio"
                        value="TECHNICAL_RFI"
                        {...register("intentType")}
                        className="sr-only"
                      />
                      <MessageSquare className="h-4 w-4" />
                      <span>{isAr ? "استفسار فني لاستشاري هندسي" : "Consultant Technical RFI"}</span>
                    </label>

                    <label
                      className={`p-3 rounded-[6px] border text-xs font-semibold cursor-pointer transition-all flex items-center gap-2.5 ${
                        selectedIntent === "SUBCONTRACTOR_ONBOARD"
                          ? "bg-copper-50 border-copper-500 text-copper-700"
                          : "bg-white border-sand-300 text-basalt-700 hover:bg-sand-50"
                      }`}
                    >
                      <input
                        type="radio"
                        value="SUBCONTRACTOR_ONBOARD"
                        {...register("intentType")}
                        className="sr-only"
                      />
                      <ShieldCheck className="h-4 w-4" />
                      <span>{isAr ? "شراكة أو توريد عام" : "General Partnership"}</span>
                    </label>
                  </div>
                </div>

                {/* Primary Contact Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-basalt-800 mb-1">
                      {isAr ? "الاسم الكامل *" : "Full Name *"}
                    </label>
                    <input
                      type="text"
                      {...register("fullName")}
                      placeholder={isAr ? "م. خالد العتيبي" : "Eng. Khaled Al-Otaibi"}
                      className="w-full h-11 px-3 text-sm bg-sand-50/50 border border-sand-300 rounded-[6px] focus-ring"
                    />
                    {errors.fullName && (
                      <p className="mt-1 text-xs text-red-600">{errors.fullName.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-basalt-800 mb-1">
                      {isAr ? "الجهة أو الشركة *" : "Organization / Entity *"}
                    </label>
                    <input
                      type="text"
                      {...register("organization")}
                      placeholder={isAr ? "أمانة محافظة جدة / شركة القدية" : "Ministry / Company"}
                      className="w-full h-11 px-3 text-sm bg-sand-50/50 border border-sand-300 rounded-[6px] focus-ring"
                    />
                    {errors.organization && (
                      <p className="mt-1 text-xs text-red-600">{errors.organization.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-basalt-800 mb-1">
                      {isAr ? "البريد الإلكتروني الرسمي *" : "Official Email *"}
                    </label>
                    <input
                      type="email"
                      {...register("email")}
                      placeholder="k.otaibi@entity.gov.sa"
                      className="w-full h-11 px-3 text-sm bg-sand-50/50 border border-sand-300 rounded-[6px] focus-ring"
                    />
                    {errors.email && (
                      <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-basalt-800 mb-1">
                      {isAr ? "رقم الجوال السعودي *" : "Saudi Mobile (+966 5X) *"}
                    </label>
                    <input
                      type="tel"
                      {...register("phone")}
                      placeholder="+966 50 123 4567"
                      className="w-full h-11 px-3 text-sm bg-sand-50/50 border border-sand-300 rounded-[6px] focus-ring"
                    />
                    {errors.phone && (
                      <p className="mt-1 text-xs text-red-600">{errors.phone.message}</p>
                    )}
                  </div>
                </div>

                {/* Conditional Fields based on Intent */}
                {selectedIntent === "GOVERNMENT_TENDER" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-[6px] bg-sand-50 border border-sand-200">
                    <div>
                      <label className="block text-xs font-semibold text-basalt-800 mb-1">
                        {isAr ? "رقم المنافسة على منصة اعتماد (إن وجد)" : "Etimad Tender Reference ID"}
                      </label>
                      <input
                        type="text"
                        {...register("etimadReferenceNumber")}
                        placeholder="ETM-2026-XXXXX"
                        className="w-full h-10 px-3 text-xs bg-white border border-sand-300 rounded-[6px] focus-ring font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-basalt-800 mb-1">
                        {isAr ? "الإدارة أو الأمانة المعنية" : "Government Directorate / Municipal Dept"}
                      </label>
                      <input
                        type="text"
                        {...register("governmentDepartment")}
                        placeholder={isAr ? "وكالة المشاريع والتعمير" : "Projects & Engineering Directorate"}
                        className="w-full h-10 px-3 text-xs bg-white border border-sand-300 rounded-[6px] focus-ring"
                      />
                    </div>
                  </div>
                )}

                {/* Message / Scope Textarea */}
                <div>
                  <label className="block text-xs font-semibold text-basalt-800 mb-1">
                    {isAr ? "تفاصيل نطاق المشروع أو الاستفسار الهندسي *" : "Project Scope Details or Technical RFI *"}
                  </label>
                  <textarea
                    rows={4}
                    {...register("messageOrScope")}
                    placeholder={
                      isAr
                        ? "يرجى توضيح موقع المشروع، نطاق الأعمال المطلوب (شبكات، مياه، أسفلت، حفر)، والجدول الزمني التقديري للتنفيذ..."
                        : "Please describe project site location, scope of works (water, roads, earthworks), and target execution timeline..."
                    }
                    className="w-full p-3 text-sm bg-sand-50/50 border border-sand-300 rounded-[6px] focus-ring"
                  />
                  {errors.messageOrScope && (
                    <p className="mt-1 text-xs text-red-600">{errors.messageOrScope.message}</p>
                  )}
                </div>

                {/* PDPL Privacy Compliance Checkbox */}
                <div className="p-3 rounded-[6px] bg-sand-50 border border-sand-200">
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      {...register("consentToPdplPolicy")}
                      className="mt-1 h-4 w-4 text-copper-600 focus-ring rounded"
                    />
                    <span className="text-xs text-basalt-600 leading-relaxed">
                      {isAr
                        ? "أوافق على معالجة هذه البيانات والتواصل الرسمي وفق متطلبات نظام حماية البيانات الشخصية السعودي (PDPL)."
                        : "I consent to data processing in accordance with the Saudi Personal Data Protection Law (PDPL)."}
                    </span>
                  </label>
                  {errors.consentToPdplPolicy && (
                    <p className="mt-1 text-xs text-red-600 ps-6.5">{errors.consentToPdplPolicy.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full"
                  isLoading={isLoading}
                  iconStart={<Send className="h-4 w-4" />}
                >
                  {isAr ? "إرسال طلب المناقصة رسمياً" : "Submit Scoped RFP Package"}
                </Button>
              </form>
            )}
          </div>

          {/* Riyadh Headquarters Directory Column */}
          <div className="lg:col-span-4 space-y-6 text-start">
            <div className="bg-basalt-950 text-white border border-basalt-800 rounded-[8px] p-6 space-y-5 shadow-elevation-2">
              <div>
                <Badge variant="copper">{isAr ? "المقر الرئيسي" : "Headquarters"}</Badge>
                <h3 className="text-lg font-bold text-white mt-2">
                  {isAr ? "شركة الهضب للتجارة والمقاولات" : "AL-HADAB Headquarters"}
                </h3>
                <p className="text-xs text-sand-300 font-mono mt-0.5">
                  {isAr ? "مبنى الشركة الرئيسي - الرياض" : "Corporate Office - Riyadh"}
                </p>
              </div>

              <div className="space-y-3 text-xs text-sand-300">
                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 text-copper-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">
                    {isAr
                      ? "شارع الديار، حي غرناطة، ص.ب 13242، الرياض، المملكة العربية السعودية"
                      : "Al-Diyar Street, Granada District, P.O. Box 13242, Riyadh, Saudi Arabia"}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-copper-400 shrink-0" />
                  <a href="tel:+966112498383" className="font-mono hover:text-white">
                    +966 11 249 8383 / 8686
                  </a>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-copper-400 shrink-0" />
                  <span className="font-mono">tenders@alhadab.com.sa</span>
                </div>
              </div>

              <div className="border-t border-basalt-800 pt-4">
                <p className="text-[11px] text-sand-400 leading-relaxed">
                  {isAr
                    ? "ساعات العمل الرسمية: الأحد إلى الخميس، من 8:00 صباحاً حتى 5:00 مساءً بتوقيت مكة المكرمة."
                    : "Office Hours: Sunday to Thursday, 8:00 AM to 5:00 PM (AST)."}
                </p>
              </div>
            </div>

            {/* Quick Fast-Track Alternative */}
            <div className="bg-sand-100/70 border border-sand-200 rounded-[8px] p-6 space-y-2">
              <h4 className="text-xs font-bold text-basalt-900">
                {isAr ? "للطلبات العاجلة ولجان المشتريات:" : "For Urgent Tender Committees:"}
              </h4>
              <p className="text-xs text-basalt-600 leading-relaxed">
                {isAr
                  ? "يمكنكم التواصل مباشرة مع الإدارة العامة لتقدير المشاريع والمناقصات عبر الخط المباشر."
                  : "Connect directly with our Chief Commercial Estimating Directorate for immediate tender assistance."}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
