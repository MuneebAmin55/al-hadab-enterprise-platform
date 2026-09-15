import { z } from "zod";

export const JobApplicationStatusEnum = z.enum([
  "NEW",
  "REVIEWING",
  "SHORTLISTED",
  "INTERVIEW",
  "REJECTED",
  "HIRED"
]);

export type JobApplicationStatus = z.infer<typeof JobApplicationStatusEnum>;

export interface JobOpeningEntity {
  id: string;
  titleEn: string;
  titleAr: string;
  department: string;
  location: string;
  employmentType: string; // FULL_TIME, PART_TIME, CONTRACT, INTERNSHIP
  descriptionEn: string;
  descriptionAr: string;
  requirementsEn: string;
  requirementsAr: string;
  applicationDeadline?: string | null;
  isPublished: boolean;
  applicationCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface JobApplicationEntity {
  id: string;
  jobOpeningId: string;
  jobOpening?: JobOpeningEntity;
  applicantName: string;
  email: string;
  phone: string;
  resumeUrl: string;
  resumeFileName?: string | null;
  coverLetter?: string | null;
  status: JobApplicationStatus;
  adminNotes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export const CreateJobOpeningSchema = z.object({
  titleEn: z.string().min(3, "English title must be at least 3 characters"),
  titleAr: z.string().min(3, "Arabic title must be at least 3 characters"),
  department: z.string().min(2, "Department is required"),
  location: z.string().min(2, "Location is required"),
  employmentType: z.string().default("FULL_TIME"),
  descriptionEn: z.string().min(10, "English description is required"),
  descriptionAr: z.string().min(10, "Arabic description is required"),
  requirementsEn: z.string().min(10, "English requirements are required"),
  requirementsAr: z.string().min(10, "Arabic requirements are required"),
  applicationDeadline: z.string().nullable().optional(),
  isPublished: z.boolean().default(true)
});

export type CreateJobOpeningInput = z.infer<typeof CreateJobOpeningSchema>;

export const UpdateJobOpeningSchema = CreateJobOpeningSchema.partial();
export type UpdateJobOpeningInput = z.infer<typeof UpdateJobOpeningSchema>;

export const SubmitJobApplicationSchema = z.object({
  jobOpeningId: z.string().min(1, "Job Opening ID is required"),
  applicantName: z.string().min(2, "Applicant name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(7, "Valid phone number is required"),
  coverLetter: z.string().optional(),
  resumeBase64: z.string().min(1, "Resume file is required"),
  resumeFileName: z.string().min(1, "Resume file name is required")
});

export type SubmitJobApplicationInput = z.infer<typeof SubmitJobApplicationSchema>;

export const UpdateJobApplicationStatusSchema = z.object({
  status: JobApplicationStatusEnum,
  adminNotes: z.string().optional()
});

export type UpdateJobApplicationStatusInput = z.infer<typeof UpdateJobApplicationStatusSchema>;

export const UpdateJobApplicationNotesSchema = z.object({
  adminNotes: z.string()
});

export type UpdateJobApplicationNotesInput = z.infer<typeof UpdateJobApplicationNotesSchema>;

export const VERIFIED_JOB_OPENINGS: JobOpeningEntity[] = [
  {
    id: "job-01",
    titleAr: "مهندس مدني أول - مدير موقع مشاريع مياه وسيول",
    titleEn: "Senior Civil Site Engineer - Water & Stormwater",
    department: "Hydraulic Infrastructure Division",
    location: "Makkah Al-Mukarramah / مكة المكرمة",
    employmentType: "FULL_TIME",
    descriptionAr: "قيادة العمليات التنفيذية لمشاريع خطوط تصريف السيول ومحطات التجميع الرئيسية وفق المعايير الهندسية والجدول الزمني المعتمد.",
    descriptionEn: "Lead on-site construction and hydraulic infrastructure execution for stormwater drainage networks and trunk culverts in compliance with national codes.",
    requirementsAr: "7-10 سنوات خبرة في مشاريع شبكات المياه والعبارات الصندوقية، شهادة معتمدة من هيئة المهندسين السعوديين، إتقان إدارة فرق العمل الميدانية.",
    requirementsEn: "7-10 years experience in trunk pipelines, box culverts, SCE accreditation, proven site leadership and contractor coordination.",
    applicationDeadline: "2026-12-31T23:59:59Z",
    isPublished: true,
    applicationCount: 4,
    createdAt: "2026-01-15T08:00:00Z",
    updatedAt: "2026-01-15T08:00:00Z"
  },
  {
    id: "job-02",
    titleAr: "مهندس جودة وسلامة ميدانية (QA/QC & HSE Lead)",
    titleEn: "Field QA/QC & HSE Lead Engineer",
    department: "QHSSE Corporate Division",
    location: "Riyadh / الرياض",
    employmentType: "FULL_TIME",
    descriptionAr: "تطبيق منظومة السلامة والصحة المهنية ISO 45001 ومراقبة معايير الجودة الشاملة في المشاريع الإنشائية الكبرى.",
    descriptionEn: "Enforce ISO 45001 occupational health & safety protocols and manage corporate quality assurance across major infrastructure sites.",
    requirementsAr: "5-8 سنوات خبرة هندسية، شهادات NEBOSH IGC أو OSHA معتمدة، خبرة مثبتة في إعداد خطط الجودة وتقييم المخاطر الميدانية.",
    requirementsEn: "5-8 years civil/safety engineering experience, NEBOSH or OSHA certified, expertise in QA/QC inspection regimes and risk assessments.",
    applicationDeadline: "2026-11-30T23:59:59Z",
    isPublished: true,
    applicationCount: 2,
    createdAt: "2026-02-01T08:00:00Z",
    updatedAt: "2026-02-01T08:00:00Z"
  },
  {
    id: "job-03",
    titleAr: "مهندس كهروميكانيك - إنارة ذكية ومحطات ضخ",
    titleEn: "MEP Engineer - Smart Lighting & Pumping Stations",
    department: "Electrical & Energy Division",
    location: "Jeddah / جدة",
    employmentType: "FULL_TIME",
    descriptionAr: "إدارة تنفيذ الأعمال الكهروميكانيكية لمحطات الرفع والضخ وشبكات الإنارة الذكية على الطرق السريعة والمجمعات التنموية.",
    descriptionEn: "Supervise electro-mechanical execution for municipal pumping stations, medium-voltage distribution, and smart highway lighting infrastructure.",
    requirementsAr: "4-7 سنوات خبرة في محطات التحويل الكهربائي ولوحات التحكم SCADA، رخصة قيادة سعودية، اعتماد الهيئة السعودية للمهندسين.",
    requirementsEn: "4-7 years in MV substations, SCADA automation and municipal pump commissioning. SCE accreditation required.",
    applicationDeadline: "2026-12-15T23:59:59Z",
    isPublished: true,
    applicationCount: 1,
    createdAt: "2026-02-10T08:00:00Z",
    updatedAt: "2026-02-10T08:00:00Z"
  },
  {
    id: "job-04",
    titleAr: "مساح أراضي عام - مشاريع تسويات ترابية وطرق",
    titleEn: "Senior Land Surveyor - Earthworks & Highways",
    department: "Topographical Survey Division",
    location: "Qiddiya, Riyadh / القدية، الرياض",
    employmentType: "FULL_TIME",
    descriptionAr: "تنفيذ الرفع المساحي الدقيق وإعداد النماذج الطبوغرافية ثلاثية الأبعاد لتوجيه الآليات الثقيلة في مشاريع التسويات الكبرى.",
    descriptionEn: "Perform high-precision topographical surveys and generate 3D machine guidance terrain models for large-scale earthmoving projects.",
    requirementsAr: "5+ سنوات خبرة عملية في تشغيل أجهزة Total Station و GPS ثلاثي الأبعاد وبرامج Civil 3D.",
    requirementsEn: "5+ years hands-on experience with GPS 3D machine guidance, robotic total stations, and Autodesk Civil 3D.",
    applicationDeadline: "2026-10-31T23:59:59Z",
    isPublished: true,
    applicationCount: 3,
    createdAt: "2026-02-20T08:00:00Z",
    updatedAt: "2026-02-20T08:00:00Z"
  }
];
