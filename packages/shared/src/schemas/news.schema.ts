import { z } from "zod";

export const NewsCategoryEnum = z.enum([
  "PRESS_RELEASE",
  "PROJECT_MILESTONE",
  "PARTNERSHIP",
  "AWARDS",
  "CORPORATE",
  "COMMUNITY"
]);

export type NewsCategoryType = z.infer<typeof NewsCategoryEnum>;

export interface NewsArticleEntity {
  id: string;
  slug: string;
  titleAr: string;
  titleEn: string;
  summaryAr: string;
  summaryEn: string;
  contentAr: string;
  contentEn: string;
  featuredImageUrl: string;
  author: string;
  publishedAt: string;
  category: NewsCategoryType | string;
  isFeatured: boolean;
  isPublished: boolean;
  seoTitleAr: string;
  seoTitleEn: string;
  seoDescAr: string;
  seoDescEn: string;
  createdAt?: string;
  updatedAt?: string;
}

export const CreateNewsArticleSchema = z.object({
  id: z.string().optional(),
  slug: z
    .string()
    .min(3, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
  titleAr: z.string().min(3, "Arabic title must be at least 3 characters"),
  titleEn: z.string().min(3, "English title must be at least 3 characters"),
  summaryAr: z.string().min(10, "Arabic summary must be at least 10 characters"),
  summaryEn: z.string().min(10, "English summary must be at least 10 characters"),
  contentAr: z.string().min(20, "Arabic content must be at least 20 characters"),
  contentEn: z.string().min(20, "English content must be at least 20 characters"),
  featuredImageUrl: z.string().url("Must be a valid URL").or(z.literal("")).default(""),
  author: z.string().default("AL-HADAB Media Center"),
  publishedAt: z.string().default(() => new Date().toISOString()),
  category: NewsCategoryEnum.default("CORPORATE"),
  isFeatured: z.boolean().default(false),
  isPublished: z.boolean().default(true),
  seoTitleAr: z.string().default(""),
  seoTitleEn: z.string().default(""),
  seoDescAr: z.string().default(""),
  seoDescEn: z.string().default("")
});

export type CreateNewsArticleInput = z.infer<typeof CreateNewsArticleSchema>;

export const UpdateNewsArticleSchema = CreateNewsArticleSchema.partial().omit({ id: true });

export type UpdateNewsArticleInput = z.infer<typeof UpdateNewsArticleSchema>;

export const VERIFIED_NEWS_ARTICLES: NewsArticleEntity[] = [
  {
    id: "news-01",
    slug: "alhadab-signs-strategic-infrastructure-package-amaala",
    titleAr: "شركة الهضب توقع عقد تنفيذ حزمة البنية التحتية والمرافق الاستراتيجية بمشروع أمالا",
    titleEn: "AL-HADAB Signs Strategic Infrastructure Package for AMAALA Red Sea Destination",
    summaryAr: "وقعت شركة الهضب للتجارة والمقاولات عقداً تنفيذياً رئيسياً لتطوير ممرات الخدمات وشبكات المياه وقنوات تصريف السيول ضمن وجهة أمالا الفاخرة على ساحل البحر الأحمر.",
    summaryEn: "AL-HADAB Trading & Contracting Co. has signed a flagship contract to engineer master utility corridors, hydraulic flood protection, and potable distribution networks for the ultra-luxury AMAALA destination.",
    contentAr: `أعلنت شركة الهضب للتجارة والمقاولات (المصنفة بالدرجة الأولى) عن توقيع عقد تنفيذ أعمال البنية التحتية الشاملة ضمن أحد أرقى المشاريع السياحية البيئية في المملكة العربية السعودية تحت مظلة صندوق الاستثمارات العامة (PIF).

يتضمن نطاق الأعمال الهندسي:
- تنفيذ أكثر من 45 كم من خطوط نقل المياه المعالجة وشبكات التغذية الرئيسية.
- بناء قنوات تصريف مياه الأمطار والسيول الخرسانية الصندوقية لحماية المواقع الإنشائية والمرافق الشاطئية.
- تمديد مسارات كابلات الجهد المتوسط وممرات الألياف الضوئية الذكية.
- أعمال التسويات الترابية الدقيقة وإدارة حركة الآليات والمعدات الثقيلة بأعلى معايير الاستدامة البيئية.

وأكد المهندس طارق الهضب، الرئيس التنفيذي، أن هذا المشروع يجسد التزام الشركة بدعم مستهدفات رؤية المملكة 2030 وبناء بنية تحتية وطنية بمعايير عالمية متفوقة.`,
    contentEn: `AL-HADAB Trading & Contracting Co. (Class 1 Contractor) has officially announced the signing of a comprehensive infrastructure execution contract for one of Saudi Arabia's premier ultra-luxury regenerative tourism destinations under the Public Investment Fund (PIF) umbrella.

The engineering scope entails:
- Execution of over 45 kilometers of treated effluent transmission mains and potable distribution trunk lines.
- Construction of reinforced concrete box culverts and hydraulic flood mitigation channels safeguarding coastal master assets.
- Trenching and installation of medium-voltage power feeder ducts and smart fiber-optic corridors.
- Precision mass earthworks utilizing low-emission heavy machinery fleets in full compliance with rigorous environmental charters.

Eng. Tariq Al-Hadab, Chief Executive, emphasized that this milestone underscores AL-HADAB's five-decade commitment to delivering sovereign infrastructure aligned with Saudi Vision 2030.`,
    featuredImageUrl: "https://images.unsplash.com/photo-1541888946425-d0fbb186156a?q=80&w=1200&auto=format&fit=crop",
    author: "AL-HADAB Corporate Communications",
    publishedAt: "2026-08-15T09:00:00.000Z",
    category: "PROJECT_MILESTONE",
    isFeatured: true,
    isPublished: true,
    seoTitleAr: "الهضب توقع عقد البنية التحتية لمشروع أمالا | المركز الإعلامي",
    seoTitleEn: "AL-HADAB Awards AMAALA Infrastructure Package | Media Center",
    seoDescAr: "تفاصيل توقيع شركة الهضب للتجارة والمقاولات لعقد تنفيذ البنية التحتية وشبكات الخدمات لوجهة أمالا السياحية.",
    seoDescEn: "Details on AL-HADAB Trading & Contracting contract signing for the AMAALA luxury tourism destination infrastructure."
  },
  {
    id: "news-02",
    slug: "alhadab-achieves-10-million-safe-man-hours-milestone",
    titleAr: "الهضب تسجل إنجازاً نوعياً بتحقيق 10 ملايين ساعة عمل آمنة بدون حوادث مهدرة للوقت",
    titleEn: "AL-HADAB Reaches 10 Million Safe Man-Hours Milestone Without Lost-Time Incidents",
    summaryAr: "احتفلت الشركة بتحقيق 10 ملايين ساعة عمل آمنة عبر كافة مواقع المشاريع الإنشائية بالرياض ومكة وجدة، مما يعكس كفاءة برامج السلامة والصحة المهنية الصارمة.",
    summaryEn: "AL-HADAB marks a prestigious HSE milestone by logging 10,000,000 safe man-hours without Lost Time Incidents across simultaneous megaproject construction sites.",
    contentAr: `احتفت شركة الهضب للتجارة والمقاولات بتسجيل أكثر من 10 ملايين ساعة عمل خالية تماماً من الحوادث المهدرة للوقت (Zero LTI)، تتويجاً لجهود فرق السلامة والصحة المهنية وتطبيق برامج الرقابة التكتيكية الصارمة (ISO 45001:2018).

شمل هذا الإنجاز أكثر من 1,450 مهندساً وفنياً وعاملاً موزعين على مشاريع شبكات المياه الاستراتيجية، ومشاريع تصريف السيول الكبرى في العاصمة المقدسة والرياض وجدة.

تضمنت برامج السلامة المنفذة:
- تنظيم أكثر من 1,200 ورشة عمل تدريبية ميدانية يومية (Toolbox Talks).
- اعتماد أنظمة الفحص المسبق الذكية لجميع المعدات الثقيلة والحفارات الهيدروليكية.
- فرق طوارئ طبية متقدمة متواجدة على مدار 24 ساعة في كافة المواقع النائية والمدنية.`,
    contentEn: `AL-HADAB Trading & Contracting Co. celebrated logging over 10 million man-hours with Zero Lost Time Incidents (LTI), honoring its health, safety, and environmental (HSE) governance under ISO 45001:2018 certifications.

This milestone covers 1,450+ engineers, site supervisors, and technical personnel deployed across major hydraulic drainage, potable pipeline, and road resurfacing sites in Riyadh, Makkah, and Jeddah.

Key HSE initiatives include:
- Over 1,200 structured daily toolbox safety briefings delivered in multiple languages.
- Rigorous computerized pre-shift inspection audits for all heavy excavator and crane fleets.
- Dedicated 24/7 on-site mobile paramedic units across urban and remote corridors.`,
    featuredImageUrl: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1200&auto=format&fit=crop",
    author: "HSE & Quality Assurance Directorate",
    publishedAt: "2026-07-28T10:30:00.000Z",
    category: "AWARDS",
    isFeatured: true,
    isPublished: true,
    seoTitleAr: "الهضب تحقق 10 ملايين ساعة عمل آمنة | السلامة المهنية",
    seoTitleEn: "AL-HADAB Logs 10 Million Safe Man-Hours | Safety Milestone",
    seoDescAr: "سجلت شركة الهضب للتجارة والمقاولات 10 ملايين ساعة عمل آمنة دون إصابات هادرة للوقت بمشاريعها الوطنية.",
    seoDescEn: "AL-HADAB reaches 10 million safe work hours milestone across national infrastructure contracts in Saudi Arabia."
  },
  {
    id: "news-03",
    slug: "expansion-of-specialized-hydraulic-and-drainage-fleet-2026",
    titleAr: "الهضب تعزز أسطولها بمعدات هيدروليكية تخصصية لدعم مشاريع تصريف السيول الكبرى",
    titleEn: "AL-HADAB Expands Specialized Hydraulic Fleet with 85 New Heavy Machinery Units",
    summaryAr: "استلمت الشركة دفعة جديدة من الحفارات العملاقة وآلات مد الأنابيب ومضخات النزح الجوفي لتعزيز سرعة إنجاز مشاريع الحماية من السيول بالمملكة.",
    summaryEn: "AL-HADAB has taken delivery of 85 cutting-edge heavy excavators, pipe-layers, and dewatering equipment to accelerate municipal stormwater mitigation contracts.",
    contentAr: `ضمن استراتيجيتها لتحديث الأسطول الميكانيكي المستمر، أعلنت شركة الهضب عن توريد 85 وحدة من الآليات الثقيلة والمعدات التخصصية بقيمة استثمارية تتجاوز 45 مليون ريال.

شملت الدفعة الجديدة:
- حفارات مجنزرة فائقة القدرة مزودة بأنظمة توجيه ليزري دقيق للحفر المائل والمستقيم.
- آلات تركيب الأنابيب الخرسانية مسبقة الصنع بقطر يصل إلى 3,000 ملم.
- مضخات نزح مياه جوفية بقدرات تصريف عالية للتعامل مع مناسيب المياه المرتفعة في المناطق الساحلية.
- شاحنات نقل ثقيل وصهاريج نقل مياه مجهزة بأنظمة تقليل الانبعاثات الكربونية.`,
    contentEn: `As part of its ongoing fleet modernization strategy, AL-HADAB has taken delivery of 85 specialized heavy units with a total capital investment surpassing SAR 45 million.

The new deployment includes:
- Ultra-high-tonnage tracked excavators equipped with GPS laser guidance systems for precision channel grading.
- Heavy-duty side-boom pipelayers capable of handling precast reinforced concrete pipes up to 3,000mm diameter.
- High-volume deep-well dewatering pump arrays engineered for high water table operations in coastal zones.
- Low-emission heavy haul tipper fleets optimized for urban logistical compliance.`,
    featuredImageUrl: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?q=80&w=1200&auto=format&fit=crop",
    author: "Plant & Fleet Operations",
    publishedAt: "2026-06-10T14:15:00.000Z",
    category: "CORPORATE",
    isFeatured: false,
    isPublished: true,
    seoTitleAr: "الهضب تعزز أسطول المعدات الثقيلة بـ 85 آلية جديدة",
    seoTitleEn: "AL-HADAB Fleet Expansion 85 New Units | Infrastructure Tech",
    seoDescAr: "توريد 85 آلية ومعدة تخصصية جديدة لتعزيز قدرات شركة الهضب في تنفيذ مشاريع السيول والمياه الكبرى.",
    seoDescEn: "AL-HADAB deploys 85 advanced machinery units to bolster nationwide civil infrastructure delivery."
  }
];
