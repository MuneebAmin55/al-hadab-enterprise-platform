import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PrequalificationRequestSchema, PrequalificationRequestInput } from "@alhadab/shared";
import { ModalDialog } from "../ui/ModalDialog";
import { Button } from "../ui/Button";
import { useRequestPrequalMutation } from "../../services/apiSlice";
import { useAppSelector } from "../../app/hooks";
import { ShieldCheck, Download, CheckCircle2, FileText } from "lucide-react";

export interface PrequalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrequalModal: React.FC<PrequalModalProps> = ({ isOpen, onClose }) => {
  const { language } = useAppSelector((state) => state.ui);
  const isAr = language === "ar";
  const [requestPrequal, { isLoading }] = useRequestPrequalMutation();
  const [dossierResult, setDossierResult] = useState<any | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<PrequalificationRequestInput>({
    resolver: zodResolver(PrequalificationRequestSchema),
    defaultValues: {
      purposeOfRequest: "TENDER_PREQUALIFICATION"
    }
  });

  const onSubmit = async (data: PrequalificationRequestInput) => {
    try {
      const response = await requestPrequal(data).unwrap();
      setDossierResult(response.dossier);
    } catch (err) {
      console.error("Failed to generate dossier:", err);
    }
  };

  const handleClose = () => {
    reset();
    setDossierResult(null);
    onClose();
  };

  return (
    <ModalDialog
      isOpen={isOpen}
      onClose={handleClose}
      title={isAr ? "بوابة التأهيل المسبق الفوري" : "Instant Pre-Qualification Vault"}
      subtitle={
        isAr
          ? "تحميل الملف التعريفي والوثائق الرسمية (السجل التجاري، شهادة التصنيف، الآيزو) موسومة رقمياً"
          : "Download official corporate profile and qualification credentials stamped with your entity name"
      }
    >
      {dossierResult ? (
        <div className="text-center py-4 space-y-5">
          <div className="inline-flex p-3 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">
            <CheckCircle2 className="h-10 w-10" />
          </div>

          <div>
            <h4 className="text-lg font-bold text-basalt-950">
              {isAr ? "تم إصدار الملف التأهيلي بنجاح" : "Dossier Issued Successfully"}
            </h4>
            <p className="mt-1 text-sm text-basalt-600">
              {isAr ? "المعرف الرقمي للملف:" : "Document Tracking ID:"}{" "}
              <span className="font-mono font-semibold text-copper-600">
                {dossierResult.documentId}
              </span>
            </p>
          </div>

          <div className="p-4 rounded-[6px] bg-sand-100/70 border border-sand-200 text-start text-xs space-y-2">
            <div className="flex items-center gap-2 text-basalt-800 font-semibold">
              <ShieldCheck className="h-4 w-4 text-copper-500" />
              <span>{isAr ? "البيانات المعتمدة المرفقة في الملف:" : "Certified Attached Data:"}</span>
            </div>
            <ul className="list-disc list-inside text-basalt-600 space-y-1 ps-2">
              <li>{isAr ? "السجل التجاري والتصنيف المقاولاتي: الدرجة الأولى" : "Commercial Registration & Contractor Classification: Class 1"}</li>
              <li>{isAr ? "شهادات الجودة والسلامة: ISO 9001, ISO 14001, ISO 45001" : "ISO Accreditations: 9001, 14001, 45001"}</li>
              <li>{isAr ? "أسطول المعدات الثقيلة المعتمد: 280+ وحدة ميكانيكية" : "Audited Heavy Machinery Fleet: 280+ active units"}</li>
              <li>{isAr ? "سجل ساعات العمل الآمنة: 14,500,000 ساعة عمل بدون حوادث" : "Zero LTI Safe Man-Hours: 14.5M logged"}</li>
            </ul>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              variant="primary"
              size="lg"
              iconStart={<Download className="h-4 w-4" />}
              onClick={() => {
                alert(
                  isAr
                    ? `جاري بدء تحميل الملف التأهيلي الرسمي (${dossierResult.documentId})...`
                    : `Initiating download for ${dossierResult.documentId}...`
                );
              }}
            >
              {isAr ? "تحميل الملف الآن (PDF)" : "Download Dossier Now (PDF)"}
            </Button>
            <Button variant="tectonic" size="lg" onClick={handleClose}>
              {isAr ? "إغلاق النافذة" : "Close Window"}
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-basalt-800 mb-1">
              {isAr ? "الاسم الكامل *" : "Full Name *"}
            </label>
            <input
              type="text"
              {...register("fullName")}
              placeholder={isAr ? "م. طارق المنصور" : "Eng. Tariq Al-Mansoor"}
              className="w-full h-11 px-3 text-sm bg-sand-50/50 border border-sand-300 rounded-[6px] focus-ring"
            />
            {errors.fullName && (
              <p className="mt-1 text-xs text-red-600">{errors.fullName.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-basalt-800 mb-1">
                {isAr ? "البريد الإلكتروني الرسمي *" : "Official Corporate Email *"}
              </label>
              <input
                type="email"
                {...register("officialEmail")}
                placeholder="name@entity.gov.sa"
                className="w-full h-11 px-3 text-sm bg-sand-50/50 border border-sand-300 rounded-[6px] focus-ring"
              />
              {errors.officialEmail && (
                <p className="mt-1 text-xs text-red-600">{errors.officialEmail.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-basalt-800 mb-1">
                {isAr ? "اسم الجهة أو الشركة *" : "Entity / Company Name *"}
              </label>
              <input
                type="text"
                {...register("entityName")}
                placeholder={isAr ? "أمانة العاصمة المقدسة / شركة البحر الأحمر" : "Red Sea Global / Ministry"}
                className="w-full h-11 px-3 text-sm bg-sand-50/50 border border-sand-300 rounded-[6px] focus-ring"
              />
              {errors.entityName && (
                <p className="mt-1 text-xs text-red-600">{errors.entityName.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-basalt-800 mb-1">
                {isAr ? "المسمى الوظيفي *" : "Job Title *"}
              </label>
              <input
                type="text"
                {...register("jobTitle")}
                placeholder={isAr ? "مدير المشتريات / استشاري هندسي" : "Procurement Director / Lead Engineer"}
                className="w-full h-11 px-3 text-sm bg-sand-50/50 border border-sand-300 rounded-[6px] focus-ring"
              />
              {errors.jobTitle && (
                <p className="mt-1 text-xs text-red-600">{errors.jobTitle.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-basalt-800 mb-1">
                {isAr ? "رقم الجوال *" : "Mobile Number *"}
              </label>
              <input
                type="tel"
                {...register("mobileNumber")}
                placeholder="+966 5X XXX XXXX"
                className="w-full h-11 px-3 text-sm bg-sand-50/50 border border-sand-300 rounded-[6px] focus-ring"
              />
              {errors.mobileNumber && (
                <p className="mt-1 text-xs text-red-600">{errors.mobileNumber.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-basalt-800 mb-1">
              {isAr ? "الغرض من طلب الملف *" : "Purpose of Request *"}
            </label>
            <select
              {...register("purposeOfRequest")}
              className="w-full h-11 px-3 text-sm bg-sand-50/50 border border-sand-300 rounded-[6px] focus-ring"
            >
              <option value="TENDER_PREQUALIFICATION">
                {isAr ? "تأهيل لمناقصة حكومية / مشروع خاص" : "Tender Pre-Qualification Evaluation"}
              </option>
              <option value="VENDOR_REGISTRATION">
                {isAr ? "تسجيل موردين واعتماد مقاولين" : "Vendor Registration Assessment"}
              </option>
              <option value="JOINT_VENTURE_EVALUATION">
                {isAr ? "شراكة ائتلافية أو مشروع مشترك" : "Joint Venture Consortium Partnership"}
              </option>
              <option value="BANK_CREDIT_AUDIT">
                {isAr ? "تدقيق بنكي وتسهيلات مصرفية" : "Financial Institution / Credit Audit"}
              </option>
              <option value="GOVERNMENT_VERIFICATION">
                {isAr ? "تحقق رسمي لجهة حكومية" : "Government Regulatory Verification"}
              </option>
            </select>
          </div>

          <div className="pt-3">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              isLoading={isLoading}
              iconStart={<FileText className="h-4 w-4" />}
            >
              {isAr ? "إنشاء وتحميل الملف التأهيلي الموسوم" : "Generate & Download Watermarked Dossier"}
            </Button>
          </div>
        </form>
      )}
    </ModalDialog>
  );
};
