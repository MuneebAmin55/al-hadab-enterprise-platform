export interface CapabilityVertical {
  id: string;
  code: string;
  titleAr: string;
  titleEn: string;
  shortDescAr: string;
  shortDescEn: string;
  fullDescAr: string;
  fullDescEn: string;
  iconName: string;
  subServicesAr: string[];
  subServicesEn: string[];
  subServices?: {
    ar: string[];
    en: string[];
  };
  equipmentDeployed: string[];
  standards: string[];
  recentProjects?: {
    id: string;
    slug: string;
    titleAr: string;
    titleEn: string;
    heroImageUrl: string;
  }[];
  projects?: {
    id: string;
    slug: string;
    titleAr: string;
    titleEn: string;
    clientNameAr?: string;
    clientNameEn?: string;
    heroImageUrl: string;
    executionStatus?: string;
  }[];
}

export const CAPABILITY_VERTICALS: CapabilityVertical[] = [
  {
    id: "water-wastewater",
    code: "WATER_WASTEWATER",
    titleAr: "شبكات المياه والصرف الصحي ومحطات الضخ",
    titleEn: "Water & Wastewater Networks & Pumping Stations",
    shortDescAr: "إنشاء وصيانة خطوط النقل الرئيسية، شبكات التوزيع، محطات الضخ والرفع، ومحطات المعالجة الحديثة.",
    shortDescEn: "Turnkey execution of trunk transmission lines, distribution networks, lift/pumping stations, and modern treatment plants.",
    fullDescAr: "تمتلك شركة الهضب سجلاً عريقاً في تنفيذ شبكات المياه والصرف الصحي بأعلى معايير الدقة الهندسية، بما في ذلك الحفر المفتوح والثقب الأفقي الموجه وتمديد خطوط الأنابيب ذات الأقطار الكبيرة (حتى 1,600 مم) واختبارات الضغط الهيدروستاتيكي وتكامل غرف الصمامات والتحكم SCADA.",
    fullDescEn: "AL-HADAB possesses an established track record in water and sewage infrastructure, executing open-cut and micro-tunneling installations for large-diameter pipelines (up to 1,600mm), hydrostatic testing, valve chambers, and SCADA monitoring integration.",
    iconName: "Droplets",
    subServicesAr: [
      "خطوط نقل المياه الاستراتيجية (DIP, GRP, HDPE)",
      "شبكات الصرف الصحي وخزانات الجمع",
      "محطات الضخ والمعالجة المدمجة",
      "غرف المحابس وتخفيض الضغوط",
      "اختبارات الضغط الهيدروستاتيكي والتعقيم"
    ],
    subServicesEn: [
      "Strategic Water Transmission Mains (DIP, GRP, HDPE)",
      "Gravity Sewer Networks & Collection Basins",
      "Pumping Stations & Compact Treatment Plants",
      "Valve Chambers & Pressure Reducing Stations",
      "Hydrostatic Pressure Testing & Disinfection"
    ],
    equipmentDeployed: [
      "حفارات هيدروليكية ثقيلة (CAT 349 / 336)",
      "معدات سحب وتبطين الخنادق Trench Boxes",
      "ماكينات لحام البولي إيثيلين بالصهر الكهربائي",
      "مضخات نزح المياه الجوفية التوربينية"
    ],
    standards: ["SASO", "NWC Guidelines", "DIN EN 805", "ASTM D3035"]
  },
  {
    id: "stormwater-flood",
    code: "STORMWATER_FLOOD",
    titleAr: "تصريف السيول ومياه الأمطار والحد من المخاطر",
    titleEn: "Stormwater & Flood Mitigation Infrastructure",
    shortDescAr: "تنفيذ قنوات التصريف الصندوقية، مصائد التهدئة، شبكات تصريف مياه الأمطار والحلول الهندسية للحد من أخطار السيول.",
    shortDescEn: "Construction of precast box culverts, retention basins, stormwater collection channels, and flood alleviation systems.",
    fullDescAr: "تعد الهضب من الرواد الوطنيين في مشاريع درء أخطار السيول للمدن الكبرى، حيث نفذت بنجاح قنوات مائية ضخمة وأنظمة تصريف متكاملة للأمانات والهيئات الملكية، مساهمة في حماية الأرواح والممتلكات وتحسين مرونة المدن السعودية في مواجهة التقلبات المناخية.",
    fullDescEn: "AL-HADAB is a national leader in urban flood mitigation, delivering large-scale stormwater canals and drainage systems for Amanats and Royal Commissions, protecting urban assets and enhancing regional climate resilience.",
    iconName: "CloudRain",
    subServicesAr: [
      "العبارات الصندوقية مسبقة الصب والمصبوبة موقعياً",
      "قنوات تصريف السيول الخرسانية المفتوحة والمغطاة",
      "بحيرات التهدئة وأحواض التبخير والاحتجاز",
      "مصائد السيول وشبكات تصريف الأنفاق والشوارع"
    ],
    subServicesEn: [
      "Precast & Cast-in-Place Concrete Box Culverts",
      "Open & Covered Hydraulic Storm Drainage Canals",
      "Attenuation Lakes & Retention/Detention Basins",
      "Surface Runoff Catch Basins & Tunnel Drainage"
    ],
    equipmentDeployed: [
      "حفارات مد يد طويلة Long Reach Excavators",
      "محطات خلط الخرسانة المتنقلة",
      "رافعات تلسكوبية لنقل العبارات مسبقة الصب (50-100 طن)",
      "مداحل التربة الاهتزازية الثقيلة"
    ],
    standards: ["MOMRA Specifications", "AASHTO", "ACI 318", "ASTM C1433"]
  },
  {
    id: "roads-bridges",
    code: "ROADS_BRIDGES",
    titleAr: "الطرق والجسور والبنية التحتية الشاملة",
    titleEn: "Roads, Bridges & Comprehensive Civil Infrastructure",
    shortDescAr: "سفلتة وإنشاء الطرق السريعة والشريانية، الجسور والتقاطعات، أعمال التسوية الترابية، والأرصفة والإنارة المصاحبة.",
    shortDescEn: "Arterial highways, bridge structures, grade-separated interchanges, massive earthworks, and integrated urban streetscapes.",
    fullDescAr: "منذ عام 1396هـ، قامت الشركة بتمهيد وشق آلاف الكيلومترات من الطرق بمختلف فئاتها، معتمدة على أسطول ضخم من الفراشات (Pavers) والمكاشط والمداحل ومختبرات فحص الجودة الميدانية التي تضمن كثافة الدمك واستواء المسارات ومطابقتها لمعايير وزارة النقل والخدمات اللوجستية.",
    fullDescEn: "Since 1976, the company has paved thousands of kilometers of highway and municipal road networks, supported by an owned fleet of pavers, cold planers, compactors, and on-site testing laboratories ensuring compliance with Ministry of Transport standards.",
    iconName: "Compass",
    subServicesAr: [
      "أعمال القطع والردم والتسوية الدقيقة بالليزر",
      "طبقات الأساس والأساس المساعد الحصوي المدموك",
      "طبقات الأسفلت الرابطة والسطحية وفق التصاميم السوبربيف (Superpave)",
      "الجسور الخرسانية، الجدران الاستنادية، والأنفاق",
      "العلامات المرورية، الدهانات الحرارية، وحواجز السلامة"
    ],
    subServicesEn: [
      "Mass Earthworks, Cutting, Filling & Laser Grading",
      "Compacted Crushed Aggregate Sub-base & Base Courses",
      "Superpave Asphalt Binder & Wearing Courses",
      "Concrete Overpasses, Reinforced Earth Walls & Underpasses",
      "Thermoplastic Road Marking, Signage & Crash Barriers"
    ],
    equipmentDeployed: [
      "فراشات أسفلت إلكترونية (Wirtgen / Vögele)",
      "كاشطات أسفلت باردة Wirtgen Cold Planers",
      "جريدرات Caterpillar 140M مع تحكم ليزري ثلاثي الأبعاد",
      "مداحل حديدية ومطاطية مزدوجة HAMM & CAT"
    ],
    standards: ["Ministry of Transport (MOT)", "AASHTO Superpave", "ASTM D2950"]
  },
  {
    id: "electrical-energy",
    code: "ELECTRICAL_ENERGY",
    titleAr: "الأعمال الكهربائية والطاقة المتجددة والإنارة",
    titleEn: "Electrical Networks, Renewable Energy & Public Lighting",
    shortDescAr: "محطات التحويل، كابلات الجهد المتوسط والمنخفض، إنارة الشوارع الذكية LED، وأنظمة الطاقة الشمسية الكهروضوئية.",
    shortDescEn: "Substations, MV/LV underground cabling, smart LED street lighting networks, and decentralized solar photovoltaic installations.",
    fullDescAr: "تنفيذ البنية التحتية الكهربائية للمخططات السكنية والصناعية، وتوريد وتركيب شبكات الإنارة الحديثة الموفرة للطاقة بالشراكة مع الشركة السعودية للكهرباء والشركة الوطنية لخدمات كفاءة الطاقة (ترشيد)، إلى جانب إدماج حلول الطاقة النظيفة ومزارع الطاقة الشمسية الموزعة.",
    fullDescEn: "Executing electrical power distribution for mega-developments in partnership with SEC and Tarshid, including smart lighting retrofit programs and distributed photovoltaic solar farms aligned with the Saudi Green Initiative.",
    iconName: "Zap",
    subServicesAr: [
      "شبكات التوزيع الكهربائية للجهد المنخفض والمتوسط (13.8kV / 33kV)",
      "محطات التحويل المدمجة والمحولات الزيتية والجافة",
      "أعمدة وإنارة الشوارع التجميلية وأنظمة التحكم الذكي CMS",
      "محطات الطاقة الشمسية الكهروضوئية للمرافق والمواقع النائية",
      "أنظمة التأريض الموحد والحماية من الصواعق"
    ],
    subServicesEn: [
      "LV and MV Underground Power Distribution (13.8kV / 33kV)",
      "Package Substations & Dry/Oil Transformers",
      "Smart Architectural Street Poles & CMS Lighting Systems",
      "Off-Grid & Grid-Tied Solar Photovoltaic Systems",
      "Substation Earthing & Lightning Protection Systems"
    ],
    equipmentDeployed: [
      "شاحنات سحب وتمديد الكابلات الهيدروليكية",
      "رافعات سلة معزولة للأعمال الحية (Boom Trucks)",
      "أجهزة اختبار حقن التيار العالي والمقاومة النوعية",
      "مجموعات توليد الطاقة المتنقلة للمواقع المعزولة"
    ],
    standards: ["Saudi Electricity Company (SEC)", "SASO IEC", "Tarshid Specs"]
  },
  {
    id: "buildings-facilities",
    code: "BUILDINGS_FACILITIES",
    titleAr: "المباني والمرافق العامة والخدمية",
    titleEn: "General Construction, Buildings & Civic Facilities",
    shortDescAr: "إنشاء المجمعات الإدارية، المرافق التعليمية، المنشآت الصحية، والمراكز اللوجستية والخدمية.",
    shortDescEn: "Civic administration complexes, educational institutions, healthcare centers, and logistics hubs.",
    fullDescAr: "تقديم خدمات المقاولات العامة للأبنية بمختلف وظائفها، مع الالتزام التام بكود البناء السعودي (SBC) وتطبيق مفاهيم الاستدامة وترشيد استهلاك الموارد من خلال حلول هندسية متكاملة تشمل الأعمال الإنشائية والمعمارية والميكانيكية والكهربائية (MEP).",
    fullDescEn: "Turnkey general contracting for multi-use institutional buildings complying strictly with the Saudi Building Code (SBC), integrating advanced MEP systems, high-durability envelopes, and energy-efficient lifecycle operations.",
    iconName: "Building2",
    subServicesAr: [
      "الهياكل الإنشائية الخرسانية والخرسانة مسبقة الإجهاد",
      "الهياكل الفولاذية للمستودعات والمراكز اللوجستية",
      "الأعمال الكهروميكانيكية الشاملة (HVAC, Plumbing, Firefighting)",
      "التشطيبات المعمارية الفاخرة والعزل الحراري والمائي المتقدم",
      "أنظمة إدارة المباني الذكية (BMS) والتحكم في الدخول"
    ],
    subServicesEn: [
      "Reinforced Concrete & Post-Tensioned Structural Frames",
      "Structural Steel Engineering for Logistics Hubs",
      "Turnkey MEP Systems (HVAC, Fire Suppression, Plumbing)",
      "Architectural Envelopes & Advanced Polyurea Waterproofing",
      "Smart Building Management Systems (BMS) & Access Control"
    ],
    equipmentDeployed: [
      "رافعات برجية Tower Cranes ومصاعد مواقع شيد",
      "مضخات خرسانة هيدروليكية متحركة 42-56 متر",
      "سقالات معيارية متوافقة مع معايير OSHA",
      "ماكينات تسوية وتشطيب الهليكوبتر الخرسانية"
    ],
    standards: ["Saudi Building Code (SBC)", "NFPA", "ASHRAE", "BS EN"]
  },
  {
    id: "landscaping-irrigation",
    code: "LANDSCAPING_IRRIGATION",
    titleAr: "تنسيق المواقع والحدائق والتشجير والري",
    titleEn: "Public Parks, Urban Afforestation & Smart Irrigation",
    shortDescAr: "تصميم وتنفيذ الحدائق العامة، الميادين، تشجير المحاور الحضرية، شبكات الري الآلية المعالجة، والمسطحات الخضراء.",
    shortDescEn: "Large-scale urban parks, public plazas, highway afforestation belts, automated TSE irrigation networks, and civic greening.",
    fullDescAr: "دعماً لمستهدفات مبادرة السعودية الخضراء ورؤية 2030 لرفع نصيب الفرد من المساحات الخضراء وتحسين المشهد الحضري، تضطلع الهضب بتنفيذ كبرى مشاريع التشجير والحدائق الحضرية المعتمدة على النباتات المحلية المتكيفة مع المناخ الجاف وتقنيات الري الذكي الموفر للمياه.",
    fullDescEn: "Directly advancing the Saudi Green Initiative and Quality of Life Vision 2030 targets, AL-HADAB executes massive urban parks, drought-tolerant native afforestation, and automated TSE water irrigation networks.",
    iconName: "Trees",
    subServicesAr: [
      "شبكات الري المحوسبة بنظام SCADA والتحكم بالطقس",
      "محطات الضخ والفلترة لمياه الصرف المعالجة ثلاثياً (TSE)",
      "زراعة الأشجار المحلية (الغاف، السدر، الطلح) والمسطحات الخضراء",
      "الممرات الحضرية، مسارات المشاة والدراجات، والأثاث الحضري",
      "النوافير المائية والإنارة التجميلية للميادين"
    ],
    subServicesEn: [
      "Smart Weather-Sensed Central SCADA Irrigation Networks",
      "Treated Sewage Effluent (TSE) Filtration & Boosters",
      "Native Arid Afforestation (Ghaf, Sidr, Acacia) & Turf",
      "Pedestrian Promenades, Cycle Tracks & Urban Street Furniture",
      "Architectural Water Features & Landscape Lighting"
    ],
    equipmentDeployed: [
      "حفارات خنادق الري الآلية Continuous Trenchers",
      "شاحنات نقل وتوريد التربة الزراعية والمخصبات",
      "صهاريج مياه معالجة مجهزة بمضخات ضغط",
      "ماكينات تقليم وتثبيت الأشجار الكبيرة"
    ],
    standards: ["Saudi Green Initiative Guidelines", "MOMRA Parks Code", "ISO 14001"]
  },
  {
    id: "urban-cleaning",
    code: "URBAN_CLEANING",
    titleAr: "نظافة المدن وإدارة النفايات والمشهد الحضري",
    titleEn: "Municipal City Cleaning & Solid Waste Management",
    shortDescAr: "خدمات النظافة البلدية الشاملة، الكنس الآلي للشوارع، جمع وفرز النفايات، وتحسين جودة الحياة والمشهد الحضري.",
    shortDescEn: "Municipal-scale sanitation contracts, mechanical street sweeping, integrated solid waste collection, and urban hygiene operations.",
    fullDescAr: "تشغيل وإدارة عقود نظافة المدن الكبرى عبر أساطيل متطورة من المكانس الآلية وشاحنات الضغط وفرق العمل المدربة، وفق مؤشرات أداء دقيقة (KPIs) تضمن استدامة النظافة العامة ورفع تصنيف المدن السعودية على مؤشرات جودة الحياة العالمية.",
    fullDescEn: "Managing multi-year municipal sanitation concessions with specialized vehicle fleets (mechanical sweepers, compactor trucks, wash units) adhering to rigorous SLAs and performance indicators for major Saudi Amanats.",
    iconName: "Sparkles",
    subServicesAr: [
      "الكنس الآلي واليدوي للشوارع والمحاور الرئيسية والفرعية",
      "تفريغ ونقل الحاويات البلدية وضغط النفايات",
      "غسيل وتعقيم الأرصفة والساحات العامة والأسواق",
      "برامج التدوير وفرز النفايات من المصدر",
      "إزالة التشوهات البصرية ومخلفات الهدم والبناء"
    ],
    subServicesEn: [
      "Mechanical & Manual Arterial Sweeping Operations",
      "Compactor Container Collection & Transfer Operations",
      "High-Pressure Washing of Plazas & Public Markets",
      "Source Segregation & Circular Waste Diversion",
      "Visual Pollution Removal & Demolition Waste Clearance"
    ],
    equipmentDeployed: [
      "مكانس شوارع آلية متطورة Dulevo / Bucher",
      "شاحنات ضغط النفايات الهيدروليكية (16-24 م³)",
      "شاحنات غسيل شوارع وحاويات بضغط مائي مرتفع",
      "أنظمة تتبع الأسطول الآلي GPS Telematics"
    ],
    standards: ["National Waste Management Center (MWAN)", "Balady SLAs"]
  },
  {
    id: "dams-civil-defense",
    code: "DAMS_CIVIL_DEFENSE",
    titleAr: "السدود وتجهيزات السلامة والدفاع المدني",
    titleEn: "Dams Construction & Civil Defense Infrastructure",
    shortDescAr: "إنشاء السدود الترابية والخرسانية، قنوات التحويل، وتوريد وصيانة تجهيزات الحماية والسلامة التابعة للدفاع المدني.",
    shortDescEn: "Earth-fill and concrete gravity dam construction, spillways, flood diversion channels, and Civil Defense safety installations.",
    fullDescAr: "بناء السدود الترابية والركامية والخرسانية لحصاد مياه الأمطار وتغذية الآبار الجوفية ودرء أخطار السيول الجارفة في المناطق الوعرة والجبلية، مع تركيب أنظمة الإنذار المبكر والتجهيزات التخصصية المعتمدة من المديرية العامة للدفاع المدني.",
    fullDescEn: "Constructing gravity, rockfill, and earthen dams for rainwater harvesting, aquifer recharge, and mountain runoff mitigation, complete with spillways, monitoring piezometers, and early warning sirens approved by Civil Defense authorities.",
    iconName: "ShieldAlert",
    subServicesAr: [
      "السدود الترابية ذات اللب الطيني والركامية المقواة",
      "السدود الخرسانية المدموكة بالحدل (RCC Dams)",
      "المفيضات الخرسانية وقنوات تصريف المياه الفائضة",
      "أجهزة قياس مناسيب المياه والحساسات الجيوتقنية",
      "مراكز وتجهيزات الدفاع المدني الميدانية للإنقاذ"
    ],
    subServicesEn: [
      "Clay-Core Rockfill & Earthen Recharge Dams",
      "Roller-Compacted Concrete (RCC) Gravity Dams",
      "Reinforced Concrete Spillways & Stilling Basins",
      "Piezometric Sensors & Dam Safety Telemetry",
      "Civil Defense Rapid Response Staging Infrastructure"
    ],
    equipmentDeployed: [
      "شاحنات نقل الصخور الثقيلة Articulated Dump Trucks",
      "مداحل تكسير ودك الصخور الاهتزازية 25 طن",
      "معدات الحقن الإسمنتي للأساسات Grouting Rigs",
      "حفارات هيدروليكية ذات شاكوش صخري هيدروليكي"
    ],
    standards: ["Ministry of Environment, Water and Agriculture", "ICOLD Standards"]
  }
];
