import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import {
  CAPABILITY_VERTICALS,
  VERIFIED_CLIENTS,
  DEFAULT_WORKFORCE_CATEGORIES,
  ALHADAB_CORPORATE_PROFILE,
  VERIFIED_NEWS_ARTICLES,
  VERIFIED_JOB_OPENINGS
} from "@alhadab/shared";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting AL-HADAB enterprise database seed...");

  // 1. Seed Administrative Accounts
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    throw new Error(
      "ADMIN_EMAIL and ADMIN_PASSWORD must be defined in environment variables before seeding."
    );
  }

  const adminPasswordHash = await bcrypt.hash(adminPassword, 12);
  const adminUser = await prisma.user.upsert({
    where: { email: adminEmail },
    update: { passwordHash: adminPasswordHash },
    create: {
      email: adminEmail,
      passwordHash: adminPasswordHash,
      fullName: "Eng. Tariq Al-Hadab (Chief Executive Admin)",
      role: "SUPERADMIN",
      isActive: true
    }
  });
  console.log(`Seeded admin user: ${adminUser.email}`);

  const editorUser = await prisma.user.upsert({
    where: { email: "editor@alhadab.com.sa" },
    update: { passwordHash: adminPasswordHash },
    create: {
      email: "editor@alhadab.com.sa",
      passwordHash: adminPasswordHash,
      fullName: "Nouf Al-Otaibi (Corporate Content Editor)",
      role: "EDITOR",
      isActive: true
    }
  });
  console.log(`Seeded editor user: ${editorUser.email}`);

  const estimatorUser = await prisma.user.upsert({
    where: { email: "estimator@alhadab.com.sa" },
    update: { passwordHash: adminPasswordHash },
    create: {
      email: "estimator@alhadab.com.sa",
      passwordHash: adminPasswordHash,
      fullName: "Eng. Fahad Al-Zahrani (Lead Tenders Estimator)",
      role: "ESTIMATOR",
      isActive: true
    }
  });
  console.log(`Seeded estimator user: ${estimatorUser.email}`);

  const auditorUser = await prisma.user.upsert({
    where: { email: "auditor@alhadab.com.sa" },
    update: { passwordHash: adminPasswordHash },
    create: {
      email: "auditor@alhadab.com.sa",
      passwordHash: adminPasswordHash,
      fullName: "Dr. Khaled Al-Mutairi (Compliance & QHSSE Auditor)",
      role: "AUDITOR",
      isActive: true
    }
  });
  console.log(`Seeded auditor user: ${auditorUser.email}`);

  // 2. Seed Verified National Clients
  for (const client of VERIFIED_CLIENTS) {
    await prisma.clientEntity.upsert({
      where: { id: client.id },
      update: {
        nameAr: client.nameAr,
        nameEn: client.nameEn,
        category: client.category,
        monogram: client.monogram,
        descriptionAr: client.descriptionAr,
        descriptionEn: client.descriptionEn
      },
      create: {
        id: client.id,
        slug: client.slug,
        nameAr: client.nameAr,
        nameEn: client.nameEn,
        category: client.category,
        monogram: client.monogram,
        descriptionAr: client.descriptionAr,
        descriptionEn: client.descriptionEn,
        isFeatured: true
      }
    });
  }
  console.log(`Seeded ${VERIFIED_CLIENTS.length} verified national client entities.`);

  // 3. Seed Capability Verticals
  for (const vertical of CAPABILITY_VERTICALS) {
    await prisma.capabilityVertical.upsert({
      where: { id: vertical.id },
      update: {
        code: vertical.code,
        titleAr: vertical.titleAr,
        titleEn: vertical.titleEn,
        shortDescAr: vertical.shortDescAr,
        shortDescEn: vertical.shortDescEn,
        fullDescAr: vertical.fullDescAr,
        fullDescEn: vertical.fullDescEn,
        iconName: vertical.iconName,
        subServicesAr: JSON.stringify(vertical.subServicesAr),
        subServicesEn: JSON.stringify(vertical.subServicesEn),
        equipmentDeployed: JSON.stringify(vertical.equipmentDeployed),
        standards: JSON.stringify(vertical.standards)
      },
      create: {
        id: vertical.id,
        code: vertical.code,
        titleAr: vertical.titleAr,
        titleEn: vertical.titleEn,
        shortDescAr: vertical.shortDescAr,
        shortDescEn: vertical.shortDescEn,
        fullDescAr: vertical.fullDescAr,
        fullDescEn: vertical.fullDescEn,
        iconName: vertical.iconName,
        subServicesAr: JSON.stringify(vertical.subServicesAr),
        subServicesEn: JSON.stringify(vertical.subServicesEn),
        equipmentDeployed: JSON.stringify(vertical.equipmentDeployed),
        standards: JSON.stringify(vertical.standards)
      }
    });
  }
  console.log(`Seeded ${CAPABILITY_VERTICALS.length} capability verticals.`);

  // 4. Seed Flagship Case Studies
  const flagshipProjects = [
    {
      slug: "makkah-stormwater-drainage-phase-4",
      titleAr: "مشروع درء أخطار السيول وتصريف مياه الأمطار بالعاصمة المقدسة",
      titleEn: "Holy Makkah Stormwater Drainage & Flood Mitigation System",
      clientId: "c-makkah",
      verticalId: "stormwater-flood",
      region: "WESTERN",
      cityAr: "مكة المكرمة",
      cityEn: "Makkah Al-Mukarramah",
      lat: 21.3891,
      lng: 39.8579,
      executionStatus: "COMPLETED",
      yearHijri: 1445,
      yearGregorian: 2024,
      summaryAr: "تنفيذ عبارات صندوقية خرسانية ثلاثية العيون وقنوات هيدروليكية مفتوحة بطول إجمالي 18.5 كم لحماية الأحياء السكنية من السيول الجارفة.",
      summaryEn: "Turnkey delivery of triple-cell precast box culverts and open hydraulic canals spanning 18.5 km to safeguard Holy Makkah urban districts.",
      challengeAr: "طبوغرافيا جبلية وعرة وكثافة عمرانية وحركة مرورية مدار الساعة أثناء مواسم الحج والعمرة مع متطلبات حفر صخري عميق.",
      challengeEn: "Rugged mountainous terrain, dense urban fabric, high pilgrim traffic during seasonal peaks, and continuous deep granite rock trenching.",
      solutionAr: "استخدام تقنيات التكسير الصخري الهيدروليكي بدون تفجير، وتصنيع العبارات الصندوقية في ورش مسبقة الصب ونقلها ليلاً لتقليل الإرباك المروري.",
      solutionEn: "Deployment of non-explosive hydraulic rock excavation, off-site precast culvert manufacturing, and night-shift logistics to eliminate traffic bottlenecks.",
      metrics: JSON.stringify([
        { labelAr: "أطوال القنوات المنجزة", labelEn: "Total Canal Length", value: "18.5", unitAr: "كم", unitEn: "km" },
        { labelAr: "كميات القطع الصخري", labelEn: "Rock Excavation Volume", value: "620,000", unitAr: "م³", unitEn: "m³" },
        { labelAr: "ساعات العمل الآمنة", labelEn: "Safe Man-Hours (Zero LTI)", value: "3,800,000", unitAr: "ساعة", unitEn: "hrs" },
        { labelAr: "الخرسانة المسلحة المصبوبة", labelEn: "Structural Reinforced Concrete", value: "145,000", unitAr: "م³", unitEn: "m³" }
      ]),
      fleetUnits: JSON.stringify(["حفارات هيدروليكية 49 طن", "معدات مد الأنابيب الموجهة", "رافعات 100 طن", "فراشات ومداحل"]),
      heroImageUrl: "https://images.unsplash.com/photo-1541888946425-d0fbb180c5f5?auto=format&fit=crop&w=1600&q=80",
      galleryUrls: JSON.stringify([
        "https://images.unsplash.com/photo-1590496793929-36417d3117de?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=800&q=80"
      ]),
      isFlagship: true
    },
    {
      slug: "riyadh-potable-water-transmission-trunk",
      titleAr: "مشروع خط النقل الاستراتيجي لمياه الشرب ومحطة الضخ بالرياض",
      titleEn: "Riyadh Strategic Potable Water Transmission Pipeline & Booster Station",
      clientId: "c-riyadh-water",
      verticalId: "water-wastewater",
      region: "CENTRAL",
      cityAr: "الرياض",
      cityEn: "Riyadh",
      lat: 24.7136,
      lng: 46.6753,
      executionStatus: "COMPLETED",
      yearHijri: 1444,
      yearGregorian: 2023,
      summaryAr: "تمديد خط أنابيب حديد الدكتايل قطر 1,200 مم بطول 42 كم مع إنشاء محطة ضخ بقدرة 180,000 م³ يومياً وربطها بنظام التحكم SCADA.",
      summaryEn: "Installation of 42 km of 1,200mm Ductile Iron potable transmission lines and a 180,000 m³/day booster pumping station with SCADA integration.",
      challengeAr: "تقاطع خط النقل مع طرق سريعة وشبكات بنية تحتية قائمة لشركات الاتصالات والكهرباء بدون انقطاع الإمدادات.",
      challengeEn: "Crossing major arterial expressways and live telecom/power utility corridors without service disruptions.",
      solutionAr: "تنفيذ تقنية الثقب الأفقي الموجه والدفع النفقي (Micro-tunneling) أسفل التقاطعات الحيوية واختبارات ضغط هيدروستاتيكي 24 بار.",
      solutionEn: "Execution of micro-tunneling under key arterial road intersections and high-pressure 24-bar hydrostatic testing.",
      metrics: JSON.stringify([
        { labelAr: "طول خط النقل", labelEn: "Pipeline Total Length", value: "42", unitAr: "كم", unitEn: "km" },
        { labelAr: "قطر الأنبوب الرئيسي", labelEn: "Pipe Diameter", value: "1,200", unitAr: "مم", unitEn: "mm" },
        { labelAr: "طاقة الضخ اليومية", labelEn: "Daily Pumping Capacity", value: "180,000", unitAr: "م³/يوم", unitEn: "m³/day" },
        { labelAr: "ساعات العمل الآمنة", labelEn: "Safe Man-Hours", value: "2,450,000", unitAr: "ساعة", unitEn: "hrs" }
      ]),
      fleetUnits: JSON.stringify(["ماكينات لحام هيدروليكية", "مضخات اختبار الضغط", "حفارات CAT 336", "شاحنات نقل ثقيلة"]),
      heroImageUrl: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1600&q=80",
      galleryUrls: JSON.stringify([
        "https://images.unsplash.com/photo-1541888946425-d0fbb180c5f5?auto=format&fit=crop&w=800&q=80"
      ]),
      isFlagship: true
    },
    {
      slug: "qiddiya-arterial-earthworks-and-services",
      titleAr: "أعمال التسويات الترابية الكبرى وممرات الخدمات بمشروع القدية",
      titleEn: "Qiddiya Giga-Project Mass Grading & Infrastructure Utility Corridors",
      clientId: "c-qiddiya",
      verticalId: "roads-bridges",
      region: "CENTRAL",
      cityAr: "القدية، الرياض",
      cityEn: "Qiddiya, Riyadh",
      lat: 24.5886,
      lng: 46.3214,
      executionStatus: "ACTIVE_EXECUTION",
      yearHijri: 1446,
      yearGregorian: 2024,
      summaryAr: "تنفيذ أعمال الحفر والردم والتسويات الترابية لأكثر من 4.5 مليون متر مكعب وشق ممرات الخدمات للبنية التحتية.",
      summaryEn: "Mass earthworks exceeding 4.5 million m³ of cut and fill, and utility service corridors for the premier entertainment destination.",
      challengeAr: "طبيعة صخرية قاسية، فروقات مناسيب حادة تصل إلى 200 متر على حافة جبال طويق، وجداول تسليم متسارعة.",
      challengeEn: "Tough dolomitic rock formations, steep 200m elevation differentials along the Tuwaiq escarpment, and fast-track delivery milestones.",
      solutionAr: "تشغيل أسطول ميكانيكي مكثف يضم أكثر من 70 وحدة معدات ثقيلة بأنظمة توجيه GPS ثلاثية الأبعاد وورديات عمل متواصلة.",
      solutionEn: "Mobilization of an owned fleet exceeding 70 heavy units with 3D GPS machine control systems operating continuous double shifts.",
      metrics: JSON.stringify([
        { labelAr: "إجمالي أعمال الحفر والردم", labelEn: "Total Cut & Fill Volume", value: "4,500,000", unitAr: "م³", unitEn: "m³" },
        { labelAr: "المعدات الثقيلة المشغلة", labelEn: "Heavy Equipment Mobilized", value: "72", unitAr: "وحدة", unitEn: "units" },
        { labelAr: "ساعات العمل الآمنة", labelEn: "Safe Man-Hours", value: "1,950,000", unitAr: "ساعة", unitEn: "hrs" }
      ]),
      fleetUnits: JSON.stringify(["جريدرات 140M ليزرية", "شاحنات قلاب 32 م³", "مداحل اهتزازية 25 طن", "بلدوزرات CAT D8R"]),
      heroImageUrl: "https://images.unsplash.com/photo-1590496793929-36417d3117de?auto=format&fit=crop&w=1600&q=80",
      galleryUrls: JSON.stringify([]),
      isFlagship: true
    }
  ];

  for (const proj of flagshipProjects) {
    await prisma.projectCaseStudy.upsert({
      where: { slug: proj.slug },
      update: {
        titleAr: proj.titleAr,
        titleEn: proj.titleEn,
        clientId: proj.clientId,
        verticalId: proj.verticalId,
        region: proj.region,
        cityAr: proj.cityAr,
        cityEn: proj.cityEn,
        lat: proj.lat,
        lng: proj.lng,
        executionStatus: proj.executionStatus,
        yearHijri: proj.yearHijri,
        yearGregorian: proj.yearGregorian,
        summaryAr: proj.summaryAr,
        summaryEn: proj.summaryEn,
        challengeAr: proj.challengeAr,
        challengeEn: proj.challengeEn,
        solutionAr: proj.solutionAr,
        solutionEn: proj.solutionEn,
        metrics: proj.metrics,
        fleetUnits: proj.fleetUnits,
        heroImageUrl: proj.heroImageUrl,
        galleryUrls: proj.galleryUrls,
        isFlagship: proj.isFlagship
      },
      create: {
        slug: proj.slug,
        titleAr: proj.titleAr,
        titleEn: proj.titleEn,
        clientId: proj.clientId,
        verticalId: proj.verticalId,
        region: proj.region,
        cityAr: proj.cityAr,
        cityEn: proj.cityEn,
        lat: proj.lat,
        lng: proj.lng,
        executionStatus: proj.executionStatus,
        yearHijri: proj.yearHijri,
        yearGregorian: proj.yearGregorian,
        summaryAr: proj.summaryAr,
        summaryEn: proj.summaryEn,
        challengeAr: proj.challengeAr,
        challengeEn: proj.challengeEn,
        solutionAr: proj.solutionAr,
        solutionEn: proj.solutionEn,
        metrics: proj.metrics,
        fleetUnits: proj.fleetUnits,
        heroImageUrl: proj.heroImageUrl,
        galleryUrls: proj.galleryUrls,
        isFlagship: proj.isFlagship
      }
    });
  }
  console.log(`Seeded ${flagshipProjects.length} flagship projects.`);

  // 5. Seed Company Profile (singleton)
  await prisma.companyProfile.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      nameAr: ALHADAB_CORPORATE_PROFILE.nameAr,
      nameEn: ALHADAB_CORPORATE_PROFILE.nameEn,
      legalEntityAr: ALHADAB_CORPORATE_PROFILE.legalEntityAr,
      legalEntityEn: ALHADAB_CORPORATE_PROFILE.legalEntityEn,
      foundingYearHijri: ALHADAB_CORPORATE_PROFILE.foundingYearHijri,
      foundingYearGregorian: ALHADAB_CORPORATE_PROFILE.foundingYearGregorian,
      headquartersAr: ALHADAB_CORPORATE_PROFILE.headquartersAr,
      headquartersEn: ALHADAB_CORPORATE_PROFILE.headquartersEn,
      addressAr: ALHADAB_CORPORATE_PROFILE.addressAr,
      addressEn: ALHADAB_CORPORATE_PROFILE.addressEn,
      phonePrimary: ALHADAB_CORPORATE_PROFILE.phonePrimary,
      phoneSecondary: ALHADAB_CORPORATE_PROFILE.phoneSecondary,
      whatsapp: ALHADAB_CORPORATE_PROFILE.whatsapp,
      emailOfficial: ALHADAB_CORPORATE_PROFILE.emailOfficial,
      emailTenders: ALHADAB_CORPORATE_PROFILE.emailTenders,
      contractorClassification: ALHADAB_CORPORATE_PROFILE.contractorClassification,
      crNumber: ALHADAB_CORPORATE_PROFILE.crNumber,
      vatNumber: ALHADAB_CORPORATE_PROFILE.vatNumber,
      statsYearsOfExperience: ALHADAB_CORPORATE_PROFILE.stats?.yearsOfExperience ?? 35,
      statsActiveWorkforce: ALHADAB_CORPORATE_PROFILE.stats?.activeWorkforce ?? 1850,
      statsHeavyEquipmentUnits: ALHADAB_CORPORATE_PROFILE.stats?.heavyEquipmentUnits ?? 420,
      statsSafeManHoursLogged: ALHADAB_CORPORATE_PROFILE.stats?.safeManHoursLogged ?? 12500000,
      statsNationalPartnersCount: ALHADAB_CORPORATE_PROFILE.stats?.nationalPartnersCount ?? 48,
      statsCompletedProjectsCount: ALHADAB_CORPORATE_PROFILE.stats?.completedProjectsCount ?? 160,
      shortDescAr: ALHADAB_CORPORATE_PROFILE.shortDescAr,
      shortDescEn: ALHADAB_CORPORATE_PROFILE.shortDescEn,
      fullDescAr: ALHADAB_CORPORATE_PROFILE.fullDescAr,
      fullDescEn: ALHADAB_CORPORATE_PROFILE.fullDescEn,
      founderMessageAr: ALHADAB_CORPORATE_PROFILE.founderMessageAr,
      founderMessageEn: ALHADAB_CORPORATE_PROFILE.founderMessageEn,
      visionAr: ALHADAB_CORPORATE_PROFILE.visionAr,
      visionEn: ALHADAB_CORPORATE_PROFILE.visionEn,
      missionAr: ALHADAB_CORPORATE_PROFILE.missionAr,
      missionEn: ALHADAB_CORPORATE_PROFILE.missionEn,
      mainImageUrl: ALHADAB_CORPORATE_PROFILE.mainImageUrl,
      seoTitleAr: ALHADAB_CORPORATE_PROFILE.seoTitleAr,
      seoTitleEn: ALHADAB_CORPORATE_PROFILE.seoTitleEn,
      seoDescAr: ALHADAB_CORPORATE_PROFILE.seoDescAr,
      seoDescEn: ALHADAB_CORPORATE_PROFILE.seoDescEn,
      isPublished: true
    }
  });
  console.log("Seeded Company Profile singleton.");

  // 6. Seed Workforce Categories
  for (const cat of DEFAULT_WORKFORCE_CATEGORIES) {
    await prisma.workforceCategory.upsert({
      where: { id: cat.id },
      update: {
        nameEn: cat.nameEn,
        nameAr: cat.nameAr,
        employeeCount: cat.employeeCount,
        descriptionEn: cat.descriptionEn,
        descriptionAr: cat.descriptionAr,
        displayOrder: cat.displayOrder,
        isActive: cat.isActive
      },
      create: {
        id: cat.id,
        nameEn: cat.nameEn,
        nameAr: cat.nameAr,
        employeeCount: cat.employeeCount,
        descriptionEn: cat.descriptionEn,
        descriptionAr: cat.descriptionAr,
        displayOrder: cat.displayOrder,
        isActive: cat.isActive
      }
    });
  }
  console.log(`Seeded ${DEFAULT_WORKFORCE_CATEGORIES.length} workforce categories.`);

  // 7. Seed News Articles
  for (const article of VERIFIED_NEWS_ARTICLES) {
    await prisma.newsArticle.upsert({
      where: { slug: article.slug },
      update: {
        titleAr: article.titleAr,
        titleEn: article.titleEn,
        summaryAr: article.summaryAr,
        summaryEn: article.summaryEn,
        contentAr: article.contentAr,
        contentEn: article.contentEn,
        featuredImageUrl: article.featuredImageUrl,
        author: article.author,
        category: article.category,
        isFeatured: article.isFeatured,
        isPublished: article.isPublished
      },
      create: {
        id: article.id,
        slug: article.slug,
        titleAr: article.titleAr,
        titleEn: article.titleEn,
        summaryAr: article.summaryAr,
        summaryEn: article.summaryEn,
        contentAr: article.contentAr,
        contentEn: article.contentEn,
        featuredImageUrl: article.featuredImageUrl,
        author: article.author,
        category: article.category,
        isFeatured: article.isFeatured,
        isPublished: article.isPublished
      }
    });
  }
  console.log(`Seeded ${VERIFIED_NEWS_ARTICLES.length} news articles.`);

  // 8. Seed Job Openings
  for (const job of VERIFIED_JOB_OPENINGS) {
    await prisma.jobOpening.upsert({
      where: { id: job.id },
      update: {
        titleAr: job.titleAr,
        titleEn: job.titleEn,
        department: job.department,
        location: job.location,
        employmentType: job.employmentType,
        descriptionAr: job.descriptionAr,
        descriptionEn: job.descriptionEn,
        requirementsAr: job.requirementsAr,
        requirementsEn: job.requirementsEn,
        isPublished: job.isPublished
      },
      create: {
        id: job.id,
        titleAr: job.titleAr,
        titleEn: job.titleEn,
        department: job.department,
        location: job.location,
        employmentType: job.employmentType,
        descriptionAr: job.descriptionAr,
        descriptionEn: job.descriptionEn,
        requirementsAr: job.requirementsAr,
        requirementsEn: job.requirementsEn,
        isPublished: job.isPublished
      }
    });
  }
  console.log(`Seeded ${VERIFIED_JOB_OPENINGS.length} job openings.`);

  console.log("AL-HADAB database seeding completed successfully.");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
