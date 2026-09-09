import { z } from "zod";

export const VendorRegistrationSchema = z.object({
  companyNameAr: z.string().min(3, "اسم الشركة بالعربية مطلوب"),
  companyNameEn: z.string().min(3, "Company name in English is required"),
  crNumber: z.string().regex(/^\d{10}$/, "السجل التجاري يجب أن يتكون من 10 أرقام"),
  vatNumber: z.string().regex(/^3\d{13}3$/, "الرقم الضريبي يجب أن يتكون من 15 رقماً ويبدأ وينتهي برقم 3"),
  gosiRegistrationNumber: z.string().min(5, "رقم التأمينات الاجتماعية مطلوب"),
  nitaqatRating: z.enum(["PLATINUM", "HIGH_GREEN", "MID_GREEN", "LOW_GREEN"]),
  headOfficeCity: z.string().min(2, "مدينة المقر الرئيسي مطلوبة"),
  authorizedSignatoryName: z.string().min(3, "اسم المفوض بالتوقيع مطلوب"),
  authorizedMobile: z.string().regex(/^(\+?966|0)?[5]\d{8}$/, "رقم جوال سعودي صحيح مطلوب"),
  officialEmail: z.string().email("بريد إلكتروني رسمي مطلوب"),
  tradeSpecialties: z.array(z.string()).min(1, "يرجى تحديد مجال اختصاص واحد على الأقل"),
  equipmentFleetAvailable: z.boolean().default(false),
  hasIsoCertification: z.boolean().default(false),
  bankName: z.string().min(2, "اسم البنك المعتمد مطلوب"),
  ibanNumber: z.string().regex(/^SA\d{22}$/, "رقم الآيبان يجب أن يبدأ بـ SA ويليه 22 رقماً"),
  termsAccepted: z.literal(true, {
    errorMap: () => ({ message: "يجب الموافقة على ميثاق نزاهة الموردين والشروط والأحكام" })
  })
});

export type VendorRegistrationInput = z.infer<typeof VendorRegistrationSchema>;
