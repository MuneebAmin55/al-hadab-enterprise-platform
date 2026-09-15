import { z } from "zod";

/**
 * UpdateCompanyProfileSchema — used by admin PATCH /company/profile
 * All fields are optional to support partial (field-level) updates.
 */
export const UpdateCompanyProfileSchema = z.object({
  // Identity
  nameAr: z.string().min(2).optional(),
  nameEn: z.string().min(2).optional(),
  legalEntityAr: z.string().min(2).optional(),
  legalEntityEn: z.string().min(2).optional(),
  foundingYearHijri: z.number().int().min(1300).max(1500).optional(),
  foundingYearGregorian: z.number().int().min(1900).max(2100).optional(),

  // Location & Contact
  headquartersAr: z.string().min(2).optional(),
  headquartersEn: z.string().min(2).optional(),
  addressAr: z.string().min(5).optional(),
  addressEn: z.string().min(5).optional(),
  phonePrimary: z.string().min(7).optional(),
  phoneSecondary: z.string().optional(),
  whatsapp: z.string().optional(),
  emailOfficial: z.string().email().optional(),
  emailTenders: z.string().email().optional(),

  // Legal
  contractorClassification: z.string().optional(),
  crNumber: z.string().optional(),
  vatNumber: z.string().optional(),

  // Stats
  statsYearsOfExperience: z.number().int().min(0).optional(),
  statsActiveWorkforce: z.number().int().min(0).optional(),
  statsHeavyEquipmentUnits: z.number().int().min(0).optional(),
  statsSafeManHoursLogged: z.number().int().min(0).optional(),
  statsNationalPartnersCount: z.number().int().min(0).optional(),
  statsCompletedProjectsCount: z.number().int().min(0).optional(),

  // Bilingual Content
  shortDescAr: z.string().min(10).optional(),
  shortDescEn: z.string().min(10).optional(),
  fullDescAr: z.string().min(20).optional(),
  fullDescEn: z.string().min(20).optional(),
  founderMessageAr: z.string().optional(),
  founderMessageEn: z.string().optional(),
  visionAr: z.string().optional(),
  visionEn: z.string().optional(),
  missionAr: z.string().optional(),
  missionEn: z.string().optional(),

  // Media
  mainImageUrl: z.string().url().optional().or(z.literal("")),

  // SEO
  seoTitleAr: z.string().optional(),
  seoTitleEn: z.string().optional(),
  seoDescAr: z.string().optional(),
  seoDescEn: z.string().optional(),

  // Publishing
  isPublished: z.boolean().optional()
});

export type UpdateCompanyProfileInput = z.infer<typeof UpdateCompanyProfileSchema>;
