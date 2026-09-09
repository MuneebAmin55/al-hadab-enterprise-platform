export interface ClientEntity {
  id: string;
  slug: string;
  nameAr: string;
  nameEn: string;
  category: "MINISTRY" | "AMANAT" | "PIF_GIGA" | "SEMI_GOV" | "AUTHORITY" | "PRIVATE";
  monogram: string;
  descriptionAr: string;
  descriptionEn: string;
}

export const VERIFIED_CLIENTS: ClientEntity[] = [
  {
    id: "c-housing",
    slug: "ministry-of-housing",
    nameAr: "وزارة البلديات والإسكان",
    nameEn: "Ministry of Municipalities and Housing",
    category: "MINISTRY",
    monogram: "MOMRAH",
    descriptionAr: "تنفيذ البنية التحتية الشاملة للمخططات السكنية وشبكات الخدمات العامة.",
    descriptionEn: "Master residential infrastructure development and public utilities delivery."
  },
  {
    id: "c-sec",
    slug: "saudi-electricity-company",
    nameAr: "الشركة السعودية للكهرباء",
    nameEn: "Saudi Electricity Company (SEC)",
    category: "SEMI_GOV",
    monogram: "SEC",
    descriptionAr: "تمديد كابلات الجهد المتوسط ومحطات التوزيع وإنارة الطرق والمخططات.",
    descriptionEn: "MV underground cabling, power distribution substations, and roadway electrification."
  },
  {
    id: "c-stc",
    slug: "stc-group",
    nameAr: "مجموعة stc",
    nameEn: "stc Group",
    category: "SEMI_GOV",
    monogram: "stc",
    descriptionAr: "الأعمال المدنية لشبكات الاتصالات والألياف الضوئية وغرف التحكم.",
    descriptionEn: "Civil works for telecommunications, fiber duct corridors, and network shelters."
  },
  {
    id: "c-tarshid",
    slug: "tarshid-energy-efficiency",
    nameAr: "الشركة الوطنية لخدمات كفاءة الطاقة (ترشيد)",
    nameEn: "National Energy Services Company (Tarshid)",
    category: "SEMI_GOV",
    monogram: "TARSHID",
    descriptionAr: "مشاريع استبدال وتطوير إنارة الشوارع الذكية الموفرة للطاقة بالمملكة.",
    descriptionEn: "Nationwide smart LED street lighting retrofit and energy efficiency programs."
  },
  {
    id: "c-amaala",
    slug: "amaala-red-sea-global",
    nameAr: "أمالا (البحر الأحمر الدولية)",
    nameEn: "Amaala (Red Sea Global / PIF)",
    category: "PIF_GIGA",
    monogram: "AMAALA",
    descriptionAr: "أعمال البنية التحتية التمهيدية ومسارات الخدمات للمشروع الفاخر على البحر الأحمر.",
    descriptionEn: "Enabling infrastructure packages and utility corridors for the ultra-luxury giga-project."
  },
  {
    id: "c-qiddiya",
    slug: "qiddiya-investment-company",
    nameAr: "شركة القدية للاستثمار",
    nameEn: "Qiddiya Investment Company (PIF)",
    category: "PIF_GIGA",
    monogram: "QIDDIYA",
    descriptionAr: "أعمال التسويات الترابية الكبرى، شبكات تصريف السيول، وشوارع المخطط العام.",
    descriptionEn: "Mass earthworks, stormwater retention canals, and arterial spine infrastructure."
  },
  {
    id: "c-kafd",
    slug: "king-abdullah-financial-district",
    nameAr: "مركز الملك عبدالله المالي (كافد)",
    nameEn: "King Abdullah Financial District (KAFD)",
    category: "SEMI_GOV",
    monogram: "KAFD",
    descriptionAr: "أعمال صيانة وتطوير شبكات البنية التحتية المساندة والمناظر الطبيعية الحضرية.",
    descriptionEn: "Specialized infrastructure maintenance and urban landscape civil coordination."
  },
  {
    id: "c-energy",
    slug: "ministry-of-energy",
    nameAr: "وزارة الطاقة",
    nameEn: "Ministry of Energy",
    category: "MINISTRY",
    monogram: "MOE",
    descriptionAr: "أعمال المقاولات المدنية والكهربائية للمرافق التابعة لمنظومة الطاقة.",
    descriptionEn: "Civil and electrical contracting works for national energy facilities."
  },
  {
    id: "c-modon",
    slug: "modon-industrial-cities",
    nameAr: "الهيئة السعودية للمدن الصناعية (مدن)",
    nameEn: "Saudi Authority for Industrial Cities (MODON)",
    category: "AUTHORITY",
    monogram: "MODON",
    descriptionAr: "تطوير البنية التحتية، شبكات المياه والصرف، والطرق للمدن الصناعية.",
    descriptionEn: "Industrial city utility master development, water/effluent piping, and heavy haul roads."
  },
  {
    id: "c-makkah",
    slug: "makkah-municipality",
    nameAr: "أمانة العاصمة المقدسة",
    nameEn: "Holy Makkah Municipality",
    category: "AMANAT",
    monogram: "MAKKAH",
    descriptionAr: "مشاريع درء أخطار السيول وتصريف مياه الأمطار والأنفاق وسفلتة الشوارع بمكة.",
    descriptionEn: "Stormwater flood mitigation box culverts, underpass drainage, and urban resurfacing."
  },
  {
    id: "c-jeddah",
    slug: "jeddah-municipality",
    nameAr: "أمانة محافظة جدة",
    nameEn: "Jeddah Municipality",
    category: "AMANAT",
    monogram: "JEDDAH",
    descriptionAr: "تنفيذ قنوات تصريف مياه الأمطار الصندوقية ومشاريع النظافة وتحسين المشهد الحضري.",
    descriptionEn: "Concrete stormwater channels, city hygiene management, and urban greening."
  },
  {
    id: "c-baha",
    slug: "baha-municipality",
    nameAr: "أمانة منطقة الباحة",
    nameEn: "Al Baha Municipality",
    category: "AMANAT",
    monogram: "BAHA",
    descriptionAr: "سفلتة الطرق الجبلية، الجدران الاستنادية، الحدائق العامة، ومشاريع درء السيول.",
    descriptionEn: "Mountain terrain road paving, stone retaining structures, and municipal parks."
  },
  {
    id: "c-irrigation",
    slug: "general-irrigation-authority",
    nameAr: "المؤسسة العامة للري",
    nameEn: "General Irrigation Authority",
    category: "AUTHORITY",
    monogram: "GIA",
    descriptionAr: "خطوط نقل المياه المعالجة وقنوات الري الزراعي وخزانات التوزيع الاستراتيجية.",
    descriptionEn: "Agricultural irrigation canals, TSE transmission pipelines, and storage reservoirs."
  },
  {
    id: "c-diplomatic",
    slug: "diplomatic-quarter-authority",
    nameAr: "الهيئة العامة لحي السفارات",
    nameEn: "Diplomatic Quarter General Authority",
    category: "AUTHORITY",
    monogram: "DQ",
    descriptionAr: "أعمال الصيانة التخصصية وتنسيق المواقع وتطوير المرافق العامة بالحي.",
    descriptionEn: "High-spec public realm maintenance, civic landscaping, and infrastructure upgrades."
  },
  {
    id: "c-tourism",
    slug: "saudi-tourism-authority",
    nameAr: "الهيئة السعودية للسياحة",
    nameEn: "Saudi Tourism Authority",
    category: "AUTHORITY",
    monogram: "STA",
    descriptionAr: "تجهيز المواقع والمرافق الخدمية والبنية التحتية للمواقع السياحية والوجهات الوطنية.",
    descriptionEn: "Site civil preparation and access infrastructure for strategic national tourism assets."
  },
  {
    id: "c-maarif",
    slug: "maarif-education",
    nameAr: "معارف للتعليم والتدريب",
    nameEn: "Ma'arif Education & Training",
    category: "PRIVATE",
    monogram: "MAARIF",
    descriptionAr: "إنشاء المجمعات التعليمية والمدارس النموذجية والمرافق الرياضية التابعة لها.",
    descriptionEn: "Turnkey general contracting for school campuses and educational sports complexes."
  },
  {
    id: "c-royal-reserve",
    slug: "imam-abdulaziz-royal-reserve",
    nameAr: "هيئة تطوير محمية الإمام عبدالعزيز بن محمد الملكية",
    nameEn: "Imam Abdulaziz bin Mohammed Royal Reserve",
    category: "AUTHORITY",
    monogram: "RESERVE",
    descriptionAr: "تمهيد المسارات البيئية، السدود التخزينية، وحلول حماية البيئة والتنوع الفطري.",
    descriptionEn: "Eco-sensitive access roads, earth retention weirs, and environmental perimeter barriers."
  },
  {
    id: "c-ummalqura",
    slug: "umm-al-qura-development",
    nameAr: "شركة أم القرى للتنمية والإعمار (وجهة مسار)",
    nameEn: "Umm Al Qura Development (Masar Destination)",
    category: "PRIVATE",
    monogram: "MASAR",
    descriptionAr: "أعمال البنية التحتية وحزم الخدمات اللوجستية لمشروع مسار مكة المكرمة.",
    descriptionEn: "Infrastructure utilities and civil packages for the iconic Masar urban corridor."
  },
  {
    id: "c-riyadh-water",
    slug: "national-water-company",
    nameAr: "شركة المياه الوطنية",
    nameEn: "National Water Company (NWC)",
    category: "SEMI_GOV",
    monogram: "NWC",
    descriptionAr: "تنفيذ خطوط النقل الرئيسية والتوصيلات المنزلية ومحطات المعالجة والتنقية.",
    descriptionEn: "Potable distribution networks, household connections, and wastewater treatment plants."
  }
];
