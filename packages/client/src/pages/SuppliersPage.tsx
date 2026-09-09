import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { VendorRegistrationSchema, VendorRegistrationInput } from "@alhadab/shared";
import { useRegisterVendorMutation } from "../services/apiSlice";
import { useAppSelector } from "../app/hooks";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import {
  Truck,
  ShieldCheck,
  CheckCircle2,
  FileText,
  AlertCircle,
  Building2,
  Phone
} from "lucide-react";

export const SuppliersPage: React.FC = () => {
  const { language } = useAppSelector((state) => state.ui);
  const isAr = language === "ar";
  const [registerVendor, { isLoading }] = useRegisterVendorMutation();
  const [successResult, setSuccessResult] = useState<any | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<VendorRegistrationInput>({
    resolver: zodResolver(VendorRegistrationSchema),
    defaultValues: {
      nitaqatRating: "PLATINUM",
      equipmentFleetAvailable: true,
      hasIsoCertification: false,
      tradeSpecialties: ["اعمال الحفر والردم والقطع الصخري"]
    }
  });

  const onSubmit = async (data: VendorRegistrationInput) => {
    try {
      const response = await registerVendor(data).unwrap();
      setSuccessResult(response);
    } catch (err: any) {
      alert(err?.data?.error?.message || "Registration failed. Please check Commercial Registration number.");
    }
  };

  const tradeOptions = [
    "اعمال الحفر والردم والقطع الصخري",
    "توريد وصب الخرسانة الجاهزة",
    "أنابيب ومحابس مياه الشرب والصرف",
    "أعمال الكابلات والكهرباء والإنارة",
    "تأجير وتشغيل المعدات الثقيلة",
    "أعمال التشجير والمستلزمات الزراعية والري",
    "الفحوصات واختبارات الجودة وضبط المواد"
  ];

  return (
    <div className="space-y-12 py-12">
      {/* Header Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-b border-sand-200 pb-8 space-y-3 text-start">
          <Badge variant="copper">{isAr ? "بوابة الشركاء والموردين" : "Vendor & Subcontractor Hub"}</Badge>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-basalt-950">
            {isAr ? "تسجيل واعتماد الموردين والمقاولين" : "Vendor Prequalification & Onboarding Portal"}
          </h1>
          <p className="text-sm sm:text-base text-basalt-600 max-w-3xl leading-relaxed">
            {isAr
              ? "تحرص شركة الهضب على بناء شراكات استراتيجية عادلة ومستدامة مع كبرى الشركات الموردة للمواد، مقاولي الباطن المتخصصين، ومزودي أساطيل المعدات بالمملكة."
              : "Building transparent and long-term partnerships with specialized trade subcontractors, material fabricators, and heavy equipment providers."}
          </p>
        </div>
      </section>

      {/* Main Registration Form or Success Screen */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {successResult ? (
          <div className="bg-white border border-sand-200 rounded-[8px] p-8 sm:p-12 text-center space-y-6 shadow-elevation-2">
            <div className="inline-flex p-3 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">
              <CheckCircle2 className="h-12 w-12" />
            </div>

            <div>
              <h3 className="text-2xl font-bold text-basalt-950">
                {isAr ? "تم تسجيل ملف المنشأة بنجاح" : "Vendor Profile Submitted Successfully"}
              </h3>
              <p className="text-sm text-basalt-600 mt-2">
                {isAr ? "رقم المتابعة والاعتماد:" : "Tracking Reference ID:"}{" "}
                <span className="font-mono font-bold text-copper-600">
                  {successResult.trackingId}
                </span>
              </p>
            </div>

            <p className="text-xs text-basalt-500 max-w-lg mx-auto leading-relaxed">
              {isAr
                ? "سيتم مراجعة الوثائق المرفوعة (السجل التجاري، التأمينات، ونطاقات) من قبل لجنة تقييم الموردين والتواصل معكم خلال 5 أيام عمل لإتمام التدقيق المالي والفني."
                : "Your documentation will be reviewed by our Procurement Committee within 5 business days for compliance vetting and inclusion in our active tender bidding roster."}
            </p>

            <Button
              variant="tectonic"
              size="md"
              onClick={() => {
                setSuccessResult(null);
                reset();
              }}
            >
              {isAr ? "تسجيل منشأة أخرى" : "Register Another Entity"}
            </Button>
          </div>
        ) : (
          <div className="bg-white border border-sand-200 rounded-[8px] p-6 sm:p-10 shadow-elevation-1 space-y-8 text-start">
            <div className="border-b border-sand-200 pb-4">
              <h3 className="text-lg font-bold text-basalt-950">
                {isAr ? "نموذج التأهيل المسبق للموردين والمقاولين" : "Subcontractor Pre-Screening Form"}
              </h3>
              <p className="text-xs text-basalt-500 mt-1">
                {isAr ? "يرجى تعبئة البيانات النظامية بدقة وفق السجل التجاري المعتمد" : "Please input verified corporate details matching your Saudi Commercial Registration"}
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Company Names */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-basalt-800 mb-1">
                    {isAr ? "اسم الشركة (بالعربية) *" : "Company Name (Arabic) *"}
                  </label>
                  <input
                    type="text"
                    {...register("companyNameAr")}
                    placeholder="شركة الأعمال المتقدمة للمقاولات"
                    className="w-full h-11 px-3 text-sm bg-sand-50/50 border border-sand-300 rounded-[6px] focus-ring"
                  />
                  {errors.companyNameAr && (
                    <p className="mt-1 text-xs text-red-600">{errors.companyNameAr.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-basalt-800 mb-1">
                    {isAr ? "اسم الشركة (بالإنجليزية) *" : "Company Name (English) *"}
                  </label>
                  <input
                    type="text"
                    {...register("companyNameEn")}
                    placeholder="Advanced Works Contracting Co."
                    className="w-full h-11 px-3 text-sm bg-sand-50/50 border border-sand-300 rounded-[6px] focus-ring"
                  />
                  {errors.companyNameEn && (
                    <p className="mt-1 text-xs text-red-600">{errors.companyNameEn.message}</p>
                  )}
                </div>
              </div>

              {/* CR and VAT Identification */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-basalt-800 mb-1">
                    {isAr ? "رقم السجل التجاري (10 أرقام) *" : "Commercial Registration (10 digits) *"}
                  </label>
                  <input
                    type="text"
                    maxLength={10}
                    {...register("crNumber")}
                    placeholder="1010XXXXXX"
                    className="w-full h-11 px-3 text-sm bg-sand-50/50 border border-sand-300 rounded-[6px] focus-ring font-mono"
                  />
                  {errors.crNumber && (
                    <p className="mt-1 text-xs text-red-600">{errors.crNumber.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-basalt-800 mb-1">
                    {isAr ? "الرقم الضريبي (15 رقماً) *" : "VAT Number (15 digits) *"}
                  </label>
                  <input
                    type="text"
                    maxLength={15}
                    {...register("vatNumber")}
                    placeholder="300XXXXXXXXXXX3"
                    className="w-full h-11 px-3 text-sm bg-sand-50/50 border border-sand-300 rounded-[6px] focus-ring font-mono"
                  />
                  {errors.vatNumber && (
                    <p className="mt-1 text-xs text-red-600">{errors.vatNumber.message}</p>
                  )}
                </div>
              </div>

              {/* GOSI and Nitaqat */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-basalt-800 mb-1">
                    {isAr ? "رقم التأمينات الاجتماعية (GOSI) *" : "GOSI Number *"}
                  </label>
                  <input
                    type="text"
                    {...register("gosiRegistrationNumber")}
                    placeholder="9823411"
                    className="w-full h-11 px-3 text-sm bg-sand-50/50 border border-sand-300 rounded-[6px] focus-ring"
                  />
                  {errors.gosiRegistrationNumber && (
                    <p className="mt-1 text-xs text-red-600">{errors.gosiRegistrationNumber.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-basalt-800 mb-1">
                    {isAr ? "نطاق السعودة *" : "Nitaqat Rating *"}
                  </label>
                  <select
                    {...register("nitaqatRating")}
                    className="w-full h-11 px-3 text-sm bg-sand-50/50 border border-sand-300 rounded-[6px] focus-ring"
                  >
                    <option value="PLATINUM">{isAr ? "بلاتيني" : "Platinum"}</option>
                    <option value="HIGH_GREEN">{isAr ? "أخضر مرتفع" : "High Green"}</option>
                    <option value="MID_GREEN">{isAr ? "أخضر متوسط" : "Mid Green"}</option>
                    <option value="LOW_GREEN">{isAr ? "أخضر منخفض" : "Low Green"}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-basalt-800 mb-1">
                    {isAr ? "مدينة المقر الرئيسي *" : "Head Office City *"}
                  </label>
                  <input
                    type="text"
                    {...register("headOfficeCity")}
                    placeholder={isAr ? "الرياض / جدة / الدمام" : "Riyadh / Jeddah / Dammam"}
                    className="w-full h-11 px-3 text-sm bg-sand-50/50 border border-sand-300 rounded-[6px] focus-ring"
                  />
                  {errors.headOfficeCity && (
                    <p className="mt-1 text-xs text-red-600">{errors.headOfficeCity.message}</p>
                  )}
                </div>
              </div>

              {/* Authorized Signatory Details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-basalt-800 mb-1">
                    {isAr ? "اسم المفوض بالتوقيع *" : "Signatory Name *"}
                  </label>
                  <input
                    type="text"
                    {...register("authorizedSignatoryName")}
                    placeholder={isAr ? "سعد بن فهد" : "Saad Bin Fahad"}
                    className="w-full h-11 px-3 text-sm bg-sand-50/50 border border-sand-300 rounded-[6px] focus-ring"
                  />
                  {errors.authorizedSignatoryName && (
                    <p className="mt-1 text-xs text-red-600">{errors.authorizedSignatoryName.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-basalt-800 mb-1">
                    {isAr ? "رقم الجوال الرسمي *" : "Mobile Number *"}
                  </label>
                  <input
                    type="tel"
                    {...register("authorizedMobile")}
                    placeholder="+966 5X XXX XXXX"
                    className="w-full h-11 px-3 text-sm bg-sand-50/50 border border-sand-300 rounded-[6px] focus-ring"
                  />
                  {errors.authorizedMobile && (
                    <p className="mt-1 text-xs text-red-600">{errors.authorizedMobile.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-basalt-800 mb-1">
                    {isAr ? "البريد الإلكتروني الرسمي *" : "Corporate Email *"}
                  </label>
                  <input
                    type="email"
                    {...register("officialEmail")}
                    placeholder="procurement@entity.com"
                    className="w-full h-11 px-3 text-sm bg-sand-50/50 border border-sand-300 rounded-[6px] focus-ring"
                  />
                  {errors.officialEmail && (
                    <p className="mt-1 text-xs text-red-600">{errors.officialEmail.message}</p>
                  )}
                </div>
              </div>

              {/* Banking Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-basalt-800 mb-1">
                    {isAr ? "اسم البنك المعتمد *" : "Bank Name *"}
                  </label>
                  <input
                    type="text"
                    {...register("bankName")}
                    placeholder={isAr ? "مصرف الراجحي / البنك الأهلي السعودي" : "Al Rajhi Bank / SNB"}
                    className="w-full h-11 px-3 text-sm bg-sand-50/50 border border-sand-300 rounded-[6px] focus-ring"
                  />
                  {errors.bankName && (
                    <p className="mt-1 text-xs text-red-600">{errors.bankName.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-basalt-800 mb-1">
                    {isAr ? "رقم الآيبان (IBAN) *" : "IBAN Number (starts with SA) *"}
                  </label>
                  <input
                    type="text"
                    maxLength={24}
                    {...register("ibanNumber")}
                    placeholder="SA0380000000608010167519"
                    className="w-full h-11 px-3 text-sm bg-sand-50/50 border border-sand-300 rounded-[6px] focus-ring font-mono"
                  />
                  {errors.ibanNumber && (
                    <p className="mt-1 text-xs text-red-600">{errors.ibanNumber.message}</p>
                  )}
                </div>
              </div>

              {/* Terms Acceptance */}
              <div className="p-4 rounded-[6px] bg-sand-50 border border-sand-200">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register("termsAccepted")}
                    className="mt-1 h-4 w-4 text-copper-600 focus-ring rounded"
                  />
                  <span className="text-xs text-basalt-700 leading-relaxed">
                    {isAr
                      ? "أقر بصحة كافة البيانات النظامية المذكورة أعلاه ومطابقتها للسجلات الرسمية لدى وزارة التجارة والجهات الرقابية، وأوافق على ميثاق نزاهة الموردين المعتمد لدى شركة الهضب."
                      : "I certify that all corporate information matches official Ministry of Commerce records, and agree to AL-HADAB's Supplier Integrity Code of Conduct."}
                  </span>
                </label>
                {errors.termsAccepted && (
                  <p className="mt-1.5 text-xs text-red-600 ps-6.5">{errors.termsAccepted.message}</p>
                )}
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                isLoading={isLoading}
                iconStart={<FileText className="h-5 w-5" />}
              >
                {isAr ? "إرسال ملف التأهيل المسبق للمراجعة" : "Submit Prequalification for Review"}
              </Button>
            </form>
          </div>
        )}
      </section>
    </div>
  );
};
