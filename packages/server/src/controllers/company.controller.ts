import { Request, Response, NextFunction } from "express";
import { UpdateCompanyProfileSchema } from "@alhadab/shared";
import { ALHADAB_CORPORATE_PROFILE } from "@alhadab/shared";
import { prisma } from "../utils/prisma";

/**
 * Maps a Prisma CompanyProfile row to the CorporateProfile shape
 * consumed by the frontend. Stats are stored flat in the DB and
 * re-nested here for API compatibility.
 */
function mapDbRowToProfile(row: any) {
  return {
    nameAr: row.nameAr,
    nameEn: row.nameEn,
    legalEntityAr: row.legalEntityAr,
    legalEntityEn: row.legalEntityEn,
    foundingYearHijri: row.foundingYearHijri,
    foundingYearGregorian: row.foundingYearGregorian,
    headquartersAr: row.headquartersAr,
    headquartersEn: row.headquartersEn,
    addressAr: row.addressAr,
    addressEn: row.addressEn,
    phonePrimary: row.phonePrimary,
    phoneSecondary: row.phoneSecondary,
    whatsapp: row.whatsapp,
    emailOfficial: row.emailOfficial,
    emailTenders: row.emailTenders,
    contractorClassification: row.contractorClassification,
    crNumber: row.crNumber,
    vatNumber: row.vatNumber,
    stats: {
      yearsOfExperience: row.statsYearsOfExperience,
      activeWorkforce: row.statsActiveWorkforce,
      heavyEquipmentUnits: row.statsHeavyEquipmentUnits,
      safeManHoursLogged: row.statsSafeManHoursLogged,
      nationalPartnersCount: row.statsNationalPartnersCount,
      completedProjectsCount: row.statsCompletedProjectsCount
    },
    shortDescAr: row.shortDescAr,
    shortDescEn: row.shortDescEn,
    fullDescAr: row.fullDescAr,
    fullDescEn: row.fullDescEn,
    founderMessageAr: row.founderMessageAr,
    founderMessageEn: row.founderMessageEn,
    visionAr: row.visionAr,
    visionEn: row.visionEn,
    missionAr: row.missionAr,
    missionEn: row.missionEn,
    mainImageUrl: row.mainImageUrl,
    seoTitleAr: row.seoTitleAr,
    seoTitleEn: row.seoTitleEn,
    seoDescAr: row.seoDescAr,
    seoDescEn: row.seoDescEn,
    isPublished: row.isPublished,
    updatedAt: row.updatedAt?.toISOString()
  };
}

export class CompanyController {
  /**
   * GET /api/v1/company/profile — public
   * Returns the DB row when available; falls back to the hardcoded
   * constant so the site is never broken by an empty database.
   */
  static async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const row = await prisma.companyProfile.findUnique({
        where: { id: "singleton" }
      });

      const data = row ? mapDbRowToProfile(row) : ALHADAB_CORPORATE_PROFILE;

      return res.status(200).json({ success: true, statusCode: 200, data });
    } catch (error) {
      // Graceful fallback: never 500 the public profile endpoint
      return res.status(200).json({
        success: true,
        statusCode: 200,
        data: ALHADAB_CORPORATE_PROFILE
      });
    }
  }

  /**
   * PATCH /api/v1/company/profile — protected (SUPERADMIN | EDITOR)
   * Upserts the singleton profile row with validated partial data.
   * Stats fields arrive flat (e.g. statsActiveWorkforce) and are
   * stored flat in the DB — no transformation needed for writes.
   */
  static async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = UpdateCompanyProfileSchema.parse(req.body);

      // Build the upsert payload — only include provided fields
      const updateData: Record<string, unknown> = { ...validated };

      // For a brand-new singleton row, fall back to the constant for
      // any fields not supplied in this request
      const fallback = ALHADAB_CORPORATE_PROFILE;

      const row = await prisma.companyProfile.upsert({
        where: { id: "singleton" },
        update: updateData,
        create: {
          id: "singleton",
          nameAr: validated.nameAr ?? fallback.nameAr,
          nameEn: validated.nameEn ?? fallback.nameEn,
          legalEntityAr: validated.legalEntityAr ?? fallback.legalEntityAr,
          legalEntityEn: validated.legalEntityEn ?? fallback.legalEntityEn,
          foundingYearHijri: validated.foundingYearHijri ?? fallback.foundingYearHijri,
          foundingYearGregorian: validated.foundingYearGregorian ?? fallback.foundingYearGregorian,
          headquartersAr: validated.headquartersAr ?? fallback.headquartersAr,
          headquartersEn: validated.headquartersEn ?? fallback.headquartersEn,
          addressAr: validated.addressAr ?? fallback.addressAr,
          addressEn: validated.addressEn ?? fallback.addressEn,
          phonePrimary: validated.phonePrimary ?? fallback.phonePrimary,
          phoneSecondary: validated.phoneSecondary ?? fallback.phoneSecondary,
          whatsapp: validated.whatsapp ?? fallback.whatsapp,
          emailOfficial: validated.emailOfficial ?? fallback.emailOfficial,
          emailTenders: validated.emailTenders ?? fallback.emailTenders,
          contractorClassification: validated.contractorClassification ?? fallback.contractorClassification,
          crNumber: validated.crNumber ?? fallback.crNumber,
          vatNumber: validated.vatNumber ?? fallback.vatNumber,
          statsYearsOfExperience: validated.statsYearsOfExperience ?? fallback.stats.yearsOfExperience,
          statsActiveWorkforce: validated.statsActiveWorkforce ?? fallback.stats.activeWorkforce,
          statsHeavyEquipmentUnits: validated.statsHeavyEquipmentUnits ?? fallback.stats.heavyEquipmentUnits,
          statsSafeManHoursLogged: validated.statsSafeManHoursLogged ?? fallback.stats.safeManHoursLogged,
          statsNationalPartnersCount: validated.statsNationalPartnersCount ?? fallback.stats.nationalPartnersCount,
          statsCompletedProjectsCount: validated.statsCompletedProjectsCount ?? fallback.stats.completedProjectsCount,
          shortDescAr: validated.shortDescAr ?? fallback.shortDescAr,
          shortDescEn: validated.shortDescEn ?? fallback.shortDescEn,
          fullDescAr: validated.fullDescAr ?? fallback.fullDescAr,
          fullDescEn: validated.fullDescEn ?? fallback.fullDescEn,
          founderMessageAr: validated.founderMessageAr ?? fallback.founderMessageAr,
          founderMessageEn: validated.founderMessageEn ?? fallback.founderMessageEn,
          visionAr: validated.visionAr ?? fallback.visionAr,
          visionEn: validated.visionEn ?? fallback.visionEn,
          missionAr: validated.missionAr ?? fallback.missionAr,
          missionEn: validated.missionEn ?? fallback.missionEn,
          mainImageUrl: validated.mainImageUrl ?? fallback.mainImageUrl,
          seoTitleAr: validated.seoTitleAr ?? fallback.seoTitleAr,
          seoTitleEn: validated.seoTitleEn ?? fallback.seoTitleEn,
          seoDescAr: validated.seoDescAr ?? fallback.seoDescAr,
          seoDescEn: validated.seoDescEn ?? fallback.seoDescEn,
          isPublished: validated.isPublished ?? fallback.isPublished
        }
      });

      return res.status(200).json({
        success: true,
        statusCode: 200,
        data: mapDbRowToProfile(row),
        messageAr: "تم تحديث ملف الشركة بنجاح.",
        messageEn: "Company profile updated successfully."
      });
    } catch (error) {
      next(error);
    }
  }
}
