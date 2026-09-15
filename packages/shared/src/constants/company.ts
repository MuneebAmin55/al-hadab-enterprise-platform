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
  // --- CMS-managed bilingual content fields ---
  shortDescAr: string;
  shortDescEn: string;
  fullDescAr: string;
  fullDescEn: string;
  founderMessageAr: string;
  founderMessageEn: string;
  visionAr: string;
  visionEn: string;
  missionAr: string;
  missionEn: string;
  mainImageUrl: string;
  // --- Bilingual SEO ---
  seoTitleAr: string;
  seoTitleEn: string;
  seoDescAr: string;
  seoDescEn: string;
  // --- CMS publishing control ---
  isPublished: boolean;
  updatedAt?: string; // ISO string from DB; omitted from fallback constant
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
  },
  shortDescAr: "خمسة عقود من الريادة في قطاع البنية التحتية بالمملكة العربية السعودية",
  shortDescEn: "Five decades of infrastructure leadership in the Kingdom of Saudi Arabia",
  fullDescAr: "شركة الهضب للتجارة والمقاولات شركة سعودية رائدة تأسست عام 1396هـ / 1976م في مدينة الرياض، وعلى مدار خمسة عقود متواصلة أثبتت مكانتها بوصفها شريكاً استراتيجياً موثوقاً في تنفيذ مشاريع البنية التحتية الكبرى للجهات الحكومية وشبه الحكومية والقطاع الخاص. تمتلك الشركة تصنيف الدرجة الأولى من وزارة الشؤون البلدية والقروية والإسكان في مجالات متعددة تشمل: شبكات المياه والصرف الصحي، والطرق والأبنية، والأعمال الكهربائية.",
  fullDescEn: "AL-HADAB Trading & Contracting Co. is a premier Saudi enterprise established in 1396 AH / 1976 CE in Riyadh. Over five consecutive decades, the company has cemented its position as a trusted strategic partner in delivering large-scale infrastructure projects for governmental, quasi-governmental, and private sector clients. Holding a Class 1 Contractor classification from MOMRAH across water & wastewater networks, roads & buildings, and electrical works.",
  founderMessageAr: "منذ اليوم الأول، آمنّا بأن البنية التحتية ليست مجرد خرسانة وأنابيب، بل هي الأساس الذي تقوم عليه الحضارة وتنطلق منه طموحات الأجيال القادمة. هذا الإيمان هو الذي قادنا لخمسة عقود من العطاء دون توقف.",
  founderMessageEn: "From day one, we believed that infrastructure is not merely concrete and pipes — it is the foundation upon which civilizations are built and from which the ambitions of future generations are launched. This conviction has driven us for five uninterrupted decades of dedicated service.",
  visionAr: "أن نكون الشريك المفضّل لمشاريع البنية التحتية الكبرى في المملكة العربية السعودية، مساهمين فاعلين في تحقيق أهداف رؤية 2030 وبناء مستقبل مستدام.",
  visionEn: "To be the preferred partner for large-scale infrastructure projects in the Kingdom of Saudi Arabia, actively contributing to Vision 2030 objectives and building a sustainable future.",
  missionAr: "تقديم حلول مقاولات متكاملة وعالية الجودة في مجالات البنية التحتية، بكفاءة تشغيلية عالية، وفق أعلى معايير السلامة والاستدامة، مع الالتزام الراسخ بتطوير الكوادر الوطنية وتعزيز قيم الشراكة مع عملائنا.",
  missionEn: "To deliver comprehensive, high-quality contracting solutions in infrastructure domains with superior operational efficiency, adhering to the highest safety and sustainability standards, while firmly committing to developing national talent and strengthening the value of partnership with our clients.",
  mainImageUrl: "",
  seoTitleAr: "شركة الهضب للتجارة والمقاولات | رائدة البنية التحتية في المملكة",
  seoTitleEn: "AL-HADAB Trading & Contracting Co. | Saudi Arabia's Infrastructure Leader",
  seoDescAr: "شركة الهضب للتجارة والمقاولات، خمسة عقود من الخبرة في تنفيذ مشاريع البنية التحتية الكبرى في المملكة العربية السعودية. تصنيف الدرجة الأولى في المياه، الصرف الصحي، الطرق، والأعمال الكهربائية.",
  seoDescEn: "AL-HADAB Trading & Contracting Co. — Five decades of expertise delivering large-scale infrastructure projects across Saudi Arabia. Class 1 Contractor in water, wastewater, roads, and electrical works.",
  isPublished: true
};

