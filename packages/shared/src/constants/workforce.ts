export interface WorkforceCategoryEntity {
  id: string;
  nameEn: string;
  nameAr: string;
  employeeCount: number;
  descriptionEn?: string | null;
  descriptionAr?: string | null;
  displayOrder: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface WorkforceStatsSummary {
  totalEmployees: number;
  totalCategories: number;
  categories: WorkforceCategoryEntity[];
}

export const DEFAULT_WORKFORCE_CATEGORIES: WorkforceCategoryEntity[] = [
  {
    id: "wf-cat-1",
    nameEn: "Engineers",
    nameAr: "المهندسون",
    employeeCount: 120,
    descriptionEn: "Civil, hydraulic, structural, and electrical project engineers.",
    descriptionAr: "مهندسو المشاريع المدنية والهيدروليكية والإنشائية والكهربائية.",
    displayOrder: 1,
    isActive: true
  },
  {
    id: "wf-cat-2",
    nameEn: "Supervisors",
    nameAr: "المشرفون الميدانيون",
    employeeCount: 85,
    descriptionEn: "Field site superintendents, QA/QC inspectors, and QHSSE supervisors.",
    descriptionAr: "مشرفو المواقع الميدانية وضبط الجودة والسلامة والصحة المهنية.",
    displayOrder: 2,
    isActive: true
  },
  {
    id: "wf-cat-3",
    nameEn: "Technicians",
    nameAr: "الفنيون",
    employeeCount: 210,
    descriptionEn: "Surveyors, laboratory technicians, and pipeline alignment specialists.",
    descriptionAr: "فنيو المساحة والمختبرات وضبط مناسيب وتمديدات خطوط الأنابيب.",
    displayOrder: 3,
    isActive: true
  },
  {
    id: "wf-cat-4",
    nameEn: "Heavy Truck & Equipment Drivers",
    nameAr: "سائقو الشاحنات والمعدات الثقيلة",
    employeeCount: 160,
    descriptionEn: "Certified operators for excavators, asphalt pavers, rollers, and tipper trucks.",
    descriptionAr: "مشغلو الحفارات العملاقة ومداحل الأسفلت والشاحنات القلابة المعتمدون.",
    displayOrder: 4,
    isActive: true
  },
  {
    id: "wf-cat-5",
    nameEn: "Electricians",
    nameAr: "الكهربائيون",
    employeeCount: 95,
    descriptionEn: "Medium & low voltage substation technicians and SCADA panel electricians.",
    descriptionAr: "فنيو المحطات وشبكات الجهد المتوسط والمنخفض ولوحات التحكم والمراقبة.",
    displayOrder: 5,
    isActive: true
  },
  {
    id: "wf-cat-6",
    nameEn: "Drivers & Fleet Operators",
    nameAr: "السائقون ومشغلو الأسطول",
    employeeCount: 110,
    descriptionEn: "Logistics, mobile service units, and crew transportation drivers.",
    descriptionAr: "سائقو الخدمات اللوجستية ووحدات الصيانة المتنقلة وحافلات نقل الكوادر.",
    displayOrder: 6,
    isActive: true
  },
  {
    id: "wf-cat-7",
    nameEn: "Managers & Project Directors",
    nameAr: "المدراء ورؤساء الأقسام",
    employeeCount: 45,
    descriptionEn: "Contract administrators, project managers, and executive directors.",
    descriptionAr: "مدراء المشاريع والتعاقدات والتخطيط المالي والإداري.",
    displayOrder: 7,
    isActive: true
  },
  {
    id: "wf-cat-8",
    nameEn: "Skilled Workers",
    nameAr: "العمالة المهنية الماهرة",
    employeeCount: 380,
    descriptionEn: "Certified pipe fitters, steel fixers, carpenters, and trenching crew.",
    descriptionAr: "حرفيون مهنيون في تركيب الأنابيب والحدادة والنجارة المسلحة والحفر.",
    displayOrder: 8,
    isActive: true
  },
  {
    id: "wf-cat-9",
    nameEn: "Administrative Staff",
    nameAr: "الكادر الإداري",
    employeeCount: 45,
    descriptionEn: "Procurement specialists, HR coordinators, accounting, and compliance staff.",
    descriptionAr: "أخصائيو المشتريات والموارد البشرية والمحاسبة والامتثال النظامي.",
    displayOrder: 9,
    isActive: true
  }
];
