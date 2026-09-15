import { z } from "zod";

export const InquiryIntentEnum = z.enum([
  "GOVERNMENT_TENDER",
  "ENTERPRISE_RFP",
  "SUBCONTRACTOR_ONBOARD",
  "TECHNICAL_RFI",
  "CAREER_APPLICATION"
]);

export type InquiryIntent = z.infer<typeof InquiryIntentEnum>;

export const InquiryStatusEnum = z.enum([
  "NEW",
  "IN_PROGRESS",
  "IN_REVIEW",
  "CONTACTED",
  "RESPONDED",
  "COMPLETED",
  "ARCHIVED"
]);

export type InquiryStatus = z.infer<typeof InquiryStatusEnum>;

export interface InquiryEntity {
  id: string;
  trackingId: string;
  intentType: InquiryIntent;
  fullName: string;
  organization: string;
  email: string;
  phone: string;
  scopedData: Record<string, any>;
  workflowStatus: InquiryStatus;
  internalNotes?: string | null;
  isRead?: boolean;
  createdAt: string;
  updatedAt?: string;
}

export const ScopedInquirySchema = z.object({
  intentType: InquiryIntentEnum,
  fullName: z.string().min(3, "Full name must be at least 3 characters"),
  organization: z.string().min(2, "Organization name must be at least 2 characters"),
  email: z.string().email("Invalid official email address"),
  phone: z.string().min(9, "Phone number must be at least 9 digits").regex(/^(\+?966|0)?[5]\d{8}$/, "Must be a valid Saudi mobile number (+966 5X XXX XXXX)"),
  
  // Scoped fields based on intent
  governmentDepartment: z.string().optional(),
  etimadReferenceNumber: z.string().optional(),
  projectEstimatedBudget: z.enum(["BELOW_10M", "10M_50M", "50M_200M", "ABOVE_200M"]).optional(),
  executionTimelineMonths: z.number().int().positive().optional(),
  verticalOfInterest: z.string().optional(),
  
  // Subcontractor specifics
  crNumber: z.string().regex(/^\d{10}$/, "Saudi Commercial Registration must be exactly 10 digits").optional(),
  vatNumber: z.string().regex(/^3\d{13}3$/, "Saudi VAT number must be 15 digits starting and ending with 3").optional(),
  tradeCategory: z.string().optional(),

  // Candidate specifics
  sceAccreditationNumber: z.string().optional(),
  yearsOfExperience: z.number().int().min(0).optional(),

  // Free-form scope description
  messageOrScope: z.string().min(10, "Please provide at least 10 characters detailing the project scope or inquiry"),
  consentToPdplPolicy: z.literal(true, {
    errorMap: () => ({ message: "You must consent to the Saudi Personal Data Protection Law (PDPL) policy" })
  })
});

export type ScopedInquiryInput = z.infer<typeof ScopedInquirySchema>;

export const UpdateInquiryStatusSchema = z.object({
  status: InquiryStatusEnum,
  notes: z.string().optional()
});

export type UpdateInquiryStatusInput = z.infer<typeof UpdateInquiryStatusSchema>;

export const UpdateInquiryNotesSchema = z.object({
  internalNotes: z.string()
});

export type UpdateInquiryNotesInput = z.infer<typeof UpdateInquiryNotesSchema>;

export const ToggleInquiryReadSchema = z.object({
  isRead: z.boolean().optional()
});

export type ToggleInquiryReadInput = z.infer<typeof ToggleInquiryReadSchema>;

export const PrequalificationRequestSchema = z.object({
  fullName: z.string().min(3, "Full name is required"),
  officialEmail: z.string().email("A valid corporate or government email is required"),
  entityName: z.string().min(2, "Entity name is required"),
  jobTitle: z.string().min(2, "Job title is required"),
  mobileNumber: z.string().min(9, "Mobile number is required"),
  purposeOfRequest: z.enum([
    "TENDER_PREQUALIFICATION",
    "VENDOR_REGISTRATION",
    "JOINT_VENTURE_EVALUATION",
    "BANK_CREDIT_AUDIT",
    "GOVERNMENT_VERIFICATION"
  ])
});

export type PrequalificationRequestInput = z.infer<typeof PrequalificationRequestSchema>;

export const VERIFIED_INQUIRIES: InquiryEntity[] = [
  {
    id: "inq-01",
    trackingId: "INQ-2026-891042",
    intentType: "GOVERNMENT_TENDER",
    fullName: "م. عبد العزيز بن سلطان المقرن",
    organization: "أمانة العاصمة المقدسة - وكالة المشاريع الكبرى",
    email: "a.almuqrin@holymakkah.gov.sa",
    phone: "+966504419821",
    scopedData: {
      governmentDepartment: "إدارة هندسة تصريف السيول ودرء الأخطار",
      etimadReferenceNumber: "ETM-2026-WTR-9941",
      projectEstimatedBudget: "50M_200M",
      executionTimelineMonths: 18,
      verticalOfInterest: "stormwater-flood",
      messageOrScope: "طرح حزمة عبارات صندوقية وقنوات خرسانية مسلحة بحي الشوقية لحماية المخططات السكنية مع أعمال نقل خطوط الخدمات القائمة واشتراطات تصنيف مقاولين درجة أولى."
    },
    workflowStatus: "NEW",
    internalNotes: "مناقصة كبرى عبر منصة اعتماد. تم تحميل الكراسة والاطلاع على جداول الكميات BOQ.",
    isRead: false,
    createdAt: "2026-09-12T08:30:00.000Z",
    updatedAt: "2026-09-12T08:30:00.000Z"
  },
  {
    id: "inq-02",
    trackingId: "INQ-2026-773195",
    intentType: "ENTERPRISE_RFP",
    fullName: "Eng. Fahad Al-Zahrani",
    organization: "National Water Company (NWC) - Western Cluster",
    email: "f.zahrani@nwc.com.sa",
    phone: "+966551239088",
    scopedData: {
      governmentDepartment: "Strategic Potable Transmission Division",
      etimadReferenceNumber: "NWC-RFP-2026-5510",
      projectEstimatedBudget: "ABOVE_200M",
      executionTimelineMonths: 24,
      verticalOfInterest: "water-wastewater",
      messageOrScope: "Installation of 36 km of 1400mm ductile iron trunk line and construction of two 50,000 m3 balancing reservoirs in North Jeddah."
    },
    workflowStatus: "IN_PROGRESS",
    internalNotes: "Estimator committee reviewing geotechnical reports and ductile iron valve supply chains.",
    isRead: true,
    createdAt: "2026-09-10T11:15:00.000Z",
    updatedAt: "2026-09-11T14:20:00.000Z"
  },
  {
    id: "inq-03",
    trackingId: "INQ-2026-642819",
    intentType: "SUBCONTRACTOR_ONBOARD",
    fullName: "خالد بن إبراهيم التميمي",
    organization: "شركة التميمي للحفريات والأعمال الهيدروليكية المتقدمة",
    email: "k.tamimi@tamimi-excavations.com.sa",
    phone: "+966503991204",
    scopedData: {
      crNumber: "1010349812",
      vatNumber: "300481920100003",
      tradeCategory: "أعمال التكسير والحفر الصخري العميق بدون تفجير",
      messageOrScope: "نرغب بالتأهيل كمقاول باطن متخصص لأعمال الحفر الصخري واستخدام القواطع الهيدروليكية الثقيلة لمشاريع خطوط المياه في التضاريس الجبلية."
    },
    workflowStatus: "CONTACTED",
    internalNotes: "تم التواصل هاتفياً مع المدير العام، وطلبنا إرسال بروفايل المعدات وقائمة المشاريع السابقة.",
    isRead: true,
    createdAt: "2026-09-08T09:40:00.000Z",
    updatedAt: "2026-09-09T16:00:00.000Z"
  },
  {
    id: "inq-04",
    trackingId: "INQ-2026-519083",
    intentType: "TECHNICAL_RFI",
    fullName: "Dr. Marcus Vance",
    organization: "Red Sea Global Infrastructure Advisory",
    email: "m.vance@redseaglobal.com",
    phone: "+966548772310",
    scopedData: {
      projectEstimatedBudget: "50M_200M",
      verticalOfInterest: "electromechanical-pumping",
      messageOrScope: "Request for technical capability audit and pump station SCADA architecture data sheet for high-salinity coastal storm runoff stations."
    },
    workflowStatus: "COMPLETED",
    internalNotes: "Technical data pack and SCADA architecture whitepaper emailed by VP of MEP Operations.",
    isRead: true,
    createdAt: "2026-09-05T14:10:00.000Z",
    updatedAt: "2026-09-07T10:30:00.000Z"
  },
  {
    id: "inq-05",
    trackingId: "INQ-2026-402911",
    intentType: "GOVERNMENT_TENDER",
    fullName: "م. نايف بن راشد الحربي",
    organization: "الهيئة الملكية للجبيل وينبع - قطاع التشغيل والصيانة",
    email: "n.harbi@rcjy.gov.sa",
    phone: "+966509981244",
    scopedData: {
      governmentDepartment: "إدارة شبكات المرافق وتصريف مياه التبريد",
      etimadReferenceNumber: "RCJY-TEN-2026-018",
      projectEstimatedBudget: "10M_50M",
      executionTimelineMonths: 12,
      verticalOfInterest: "concrete-culverts",
      messageOrScope: "صيانة واستبدال مقاطع العبارات الخرسانية المتضررة بطول 4.2 كم بالمنطقة الصناعية مع معالجة فواصل التمدد الهيدروليكية."
    },
    workflowStatus: "IN_PROGRESS",
    internalNotes: "فريق التقدير الفني يدرس جدول الكميات. جاري التواصل مع الموردين المعتمدين لمواد العزل الإيبوكسي.",
    isRead: true,
    createdAt: "2026-09-03T10:00:00.000Z",
    updatedAt: "2026-09-04T12:00:00.000Z"
  },
  {
    id: "inq-06",
    trackingId: "INQ-2026-318720",
    intentType: "ENTERPRISE_RFP",
    fullName: "سالم بن عبد الله الشهري",
    organization: "مجموعة العليان للإنشاءات المتطورة",
    email: "s.shehri@olayanconst.com.sa",
    phone: "+966567220199",
    scopedData: {
      projectEstimatedBudget: "BELOW_10M",
      verticalOfInterest: "site-earthworks",
      messageOrScope: "طلب تسعير مقطوعية لأعمال الردم والتسوية والدمك لمخطط لوجستي بمساحة 120,000 م2 شرق الرياض."
    },
    workflowStatus: "ARCHIVED",
    internalNotes: "المشروع خارج النطاق التخصصي الحالي للشركة وتم الاعتذار رسمياً.",
    isRead: true,
    createdAt: "2026-08-28T16:20:00.000Z",
    updatedAt: "2026-08-30T09:15:00.000Z"
  }
];
