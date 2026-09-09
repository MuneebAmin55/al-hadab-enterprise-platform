export interface CorporateProfile {
  nameAr: string;
  nameEn: string;
  legalEntityAr: string;
  legalEntityEn: string;
  foundingYearHijri: number;
  foundingYearGregorian: number;
  headquartersAr: string;
  headquartersEn: string;
  addressAr: string;
  addressEn: string;
  phonePrimary: string;
  phoneSecondary: string;
  whatsapp: string;
  emailOfficial: string;
  emailTenders: string;
  contractorClassification: string;
  crNumber: string;
  vatNumber: string;
  stats: {
    yearsOfExperience: number;
    activeWorkforce: number;
    heavyEquipmentUnits: number;
    safeManHoursLogged: number;
    nationalPartnersCount: number;
    completedProjectsCount: number;
  };
}

export const ALHADAB_CORPORATE_PROFILE: CorporateProfile = {
  nameAr: "شركة الهضب للتجارة والمقاولات",
  nameEn: "AL-HADAB Trading & Contracting Co.",
  legalEntityAr: "شركة سعودية ذات مسؤولية محدودة",
  legalEntityEn: "Saudi Limited Liability Company",
  foundingYearHijri: 1396,
  foundingYearGregorian: 1976,
  headquartersAr: "الرياض، المملكة العربية السعودية",
  headquartersEn: "Riyadh, Kingdom of Saudi Arabia",
  addressAr: "شارع الديار، حي غرناطة، ص.ب 13242، الرياض، المملكة العربية السعودية",
  addressEn: "Al-Diyar Street, Granada District, P.O. Box 13242, Riyadh, Kingdom of Saudi Arabia",
  phonePrimary: "+966 11 249 8383",
  phoneSecondary: "+966 11 249 8686",
  whatsapp: "+966 50 440 0807",
  emailOfficial: "info@alhadab.com.sa",
  emailTenders: "tenders@alhadab.com.sa",
  contractorClassification: "تصنيف الدرجة الأولى (Class 1 Contractor)",
  crNumber: "1010028491",
  vatNumber: "300189421500003",
  stats: {
    yearsOfExperience: 48,
    activeWorkforce: 1250,
    heavyEquipmentUnits: 280,
    safeManHoursLogged: 14500000,
    nationalPartnersCount: 19,
    completedProjectsCount: 165
  }
};
