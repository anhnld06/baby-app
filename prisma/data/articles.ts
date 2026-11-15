import type {
  EvidenceLevel,
  KnowledgeStage,
  KnowledgeType,
} from "@prisma/client";

export type CuratedSource = {
  organization: string;
  title: string;
  url: string;
  evidenceTier: string;
};

export type CuratedArticle = {
  slug: string;
  title: string;
  summary: string;
  content: string;
  category: string;
  stage: KnowledgeStage;
  minimumAgeDays?: number;
  maximumAgeDays?: number;
  evidenceLevel: EvidenceLevel;
  knowledgeType: KnowledgeType;
  sources: CuratedSource[];
};

const sources = {
  planning: {
    organization: "CDC",
    title: "Planning for Pregnancy",
    url: "https://www.cdc.gov/pregnancy/about/index.html",
    evidenceTier: "Hướng dẫn cơ quan y tế",
  },
  pregnancyNutrition: {
    organization: "ACOG",
    title: "Healthy Eating During Pregnancy",
    url: "https://www.acog.org/womens-health/faqs/healthy-eating-during-pregnancy",
    evidenceTier: "Hướng dẫn chuyên môn",
  },
  antenatal: {
    organization: "WHO",
    title: "WHO recommendations on antenatal care for a positive pregnancy experience",
    url: "https://www.who.int/publications/i/item/9789241549912",
    evidenceTier: "Hướng dẫn WHO",
  },
  alcohol: {
    organization: "CDC",
    title: "About Alcohol Use During Pregnancy",
    url: "https://www.cdc.gov/alcohol-pregnancy/about/index.html",
    evidenceTier: "Hướng dẫn cơ quan y tế",
  },
  maternalWarnings: {
    organization: "ACOG",
    title: "Urgent Maternal Warning Signs",
    url: "https://www.acog.org/giving/programs/quality-and-safety/resources",
    evidenceTier: "Hướng dẫn an toàn người bệnh",
  },
  postnatal: {
    organization: "WHO",
    title: "WHO recommendations on maternal and newborn care for a positive postnatal experience",
    url: "https://www.who.int/publications/i/item/9789240045989",
    evidenceTier: "Hướng dẫn WHO",
  },
  postpartumPain: {
    organization: "ACOG",
    title: "Postpartum Pain Management",
    url: "https://www.acog.org/womens-health/faqs/postpartum-pain-management",
    evidenceTier: "Hướng dẫn chuyên môn",
  },
  newbornCare: {
    organization: "WHO",
    title: "Caring for a newborn",
    url: "https://www.who.int/tools/your-life-your-health/life-phase/newborns-and-children-under-5-years/caring-for-newborns",
    evidenceTier: "Hướng dẫn WHO",
  },
  newbornDanger: {
    organization: "WHO",
    title: "Recommendations on maternal and newborn care after birth",
    url: "https://www.who.int/publications/i/item/9789240045989",
    evidenceTier: "Hướng dẫn WHO",
  },
  feeding: {
    organization: "WHO",
    title: "Infant and young child feeding",
    url: "https://www.who.int/news-room/fact-sheets/detail/infant-and-young-child-feeding",
    evidenceTier: "Khuyến nghị WHO",
  },
  breastfeedingVi: {
    organization: "UNICEF Việt Nam",
    title: "Những điều lưu ý khi nuôi con bằng sữa mẹ",
    url: "https://www.unicef.org/vietnam/vi/nh%E1%BB%AFng-%C4%91i%E1%BB%81u-l%C6%B0u-%C3%BD-khi-nu%C3%B4i-con-b%E1%BA%B1ng-s%E1%BB%AFa-m%E1%BA%B9",
    evidenceTier: "Tài liệu giáo dục sức khỏe",
  },
  safeSleep: {
    organization: "CDC",
    title: "Providing Care for Babies to Sleep Safely",
    url: "https://www.cdc.gov/sudden-infant-death/sleep-safely/index.html",
    evidenceTier: "Hướng dẫn an toàn",
  },
  crying: {
    organization: "NHS",
    title: "Soothing a crying baby",
    url: "https://www.nhs.uk/baby/caring-for-a-newborn/soothing-a-crying-baby/",
    evidenceTier: "Hướng dẫn dịch vụ y tế",
  },
  colic: {
    organization: "NHS",
    title: "Colic",
    url: "https://www.nhs.uk/conditions/colic/",
    evidenceTier: "Hướng dẫn dịch vụ y tế",
  },
  vitaminD: {
    organization: "CDC",
    title: "Vitamin D and Breastfeeding",
    url: "https://www.cdc.gov/breastfeeding-special-circumstances/hcp/diet-micronutrients/vitamin-d.html",
    evidenceTier: "Hướng dẫn cơ quan y tế",
  },
  solids: {
    organization: "CDC",
    title: "When, What, and How to Introduce Solid Foods",
    url: "https://www.cdc.gov/infant-toddler-nutrition/foods-and-drinks/when-what-and-how-to-introduce-solid-foods.html",
    evidenceTier: "Hướng dẫn cơ quan y tế",
  },
  complementary: {
    organization: "WHO",
    title: "Guideline for complementary feeding of infants and young children 6–23 months",
    url: "https://www.who.int/publications/i/item/9789240081864",
    evidenceTier: "Hướng dẫn WHO",
  },
  menuVi: {
    organization: "UNICEF Việt Nam",
    title: "Thực đơn cho con từ 6 đến 12 tháng tuổi",
    url: "https://www.unicef.org/vietnam/vi/thuc-don-cho-con-tu-6-den-12-thang-tuoi",
    evidenceTier: "Tài liệu giáo dục sức khỏe",
  },
  choking: {
    organization: "CDC",
    title: "Choking Hazards",
    url: "https://www.cdc.gov/infant-toddler-nutrition/foods-and-drinks/choking-hazards.html",
    evidenceTier: "Hướng dẫn an toàn",
  },
  milestones: {
    organization: "CDC",
    title: "Infants & Toddlers: Milestones & Schedules",
    url: "https://www.cdc.gov/parents/infants/milestones-and-schedules.html",
    evidenceTier: "Công cụ theo dõi phát triển",
  },
  toddler: {
    organization: "CDC",
    title: "Positive Parenting Tips: Toddlers (1–2 years)",
    url: "https://www.cdc.gov/child-development/positive-parenting-tips/toddlers-1-2-years.html",
    evidenceTier: "Hướng dẫn nuôi dạy trẻ",
  },
  vaccines: {
    organization: "WHO",
    title: "Recommended Routine Immunizations for Children",
    url: "https://www.who.int/publications/m/item/table-2-summary-of-who-position-papers-recommended-routine-immunizations-for-children",
    evidenceTier: "Khuyến nghị WHO",
  },
  jaundiceAAP: {
    organization: "HealthyChildren.org (AAP)",
    title: "Jaundice in Newborns",
    url: "https://www.healthychildren.org/English/ages-stages/baby/Pages/jaundice.aspx",
    evidenceTier: "Hướng dẫn hiệp hội chuyên khoa",
  },
  jaundiceMayo: {
    organization: "Mayo Clinic",
    title: "Infant jaundice - Symptoms & causes",
    url: "https://www.mayoclinic.org/diseases-conditions/infant-jaundice/symptoms-causes/syc-20373865",
    evidenceTier: "Tài liệu y khoa uy tín",
  },
  skinRashesAAP: {
    organization: "HealthyChildren.org (AAP)",
    title: "Newborn Rashes and Birthmarks",
    url: "https://www.healthychildren.org/English/tips-tools/symptom-checker/Pages/symptomviewer.aspx?symptom=Newborn+Rashes+and+Birthmarks",
    evidenceTier: "Hướng dẫn hiệp hội chuyên khoa",
  },
  babyAcneMayo: {
    organization: "Mayo Clinic",
    title: "Baby acne - Symptoms & causes",
    url: "https://www.mayoclinic.org/diseases-conditions/baby-acne/symptoms-causes/syc-20369880",
    evidenceTier: "Tài liệu y khoa uy tín",
  },
  diaperRashAAP: {
    organization: "HealthyChildren.org (AAP)",
    title: "Common Diaper Rashes & Treatments",
    url: "https://www.healthychildren.org/English/ages-stages/baby/diapers-clothing/Pages/Diaper-Rash.aspx",
    evidenceTier: "Hướng dẫn hiệp hội chuyên khoa",
  },
  diaperRashMayo: {
    organization: "Mayo Clinic",
    title: "Diaper rash - Symptoms & causes",
    url: "https://www.mayoclinic.org/diseases-conditions/diaper-rash/symptoms-causes/syc-20371636",
    evidenceTier: "Tài liệu y khoa uy tín",
  },
  spitUpAAP: {
    organization: "HealthyChildren.org (AAP)",
    title: "Baby Burping, Hiccups & Spit-Up",
    url: "https://www.healthychildren.org/English/ages-stages/baby/feeding-nutrition/Pages/baby-burping-hiccups-and-spit-up.aspx",
    evidenceTier: "Hướng dẫn hiệp hội chuyên khoa",
  },
  pyloricMayo: {
    organization: "Mayo Clinic",
    title: "Pyloric stenosis - Symptoms and causes",
    url: "https://www.mayoclinic.org/diseases-conditions/pyloric-stenosis/symptoms-causes/syc-20351416",
    evidenceTier: "Tài liệu y khoa uy tín",
  },
  stoolMayo: {
    organization: "Mayo Clinic",
    title: "Baby poop: color, consistency and sometimes surprises!",
    url: "https://mcpress.mayoclinic.org/parenting/baby-poop-color-consistency-sometimes-surprises/",
    evidenceTier: "Tài liệu giáo dục sức khỏe",
  },
  feverAAP: {
    organization: "HealthyChildren.org (AAP)",
    title: "Fever and Your Baby",
    url: "https://www.healthychildren.org/English/health-issues/conditions/fever/Pages/Fever-and-Your-Baby.aspx",
    evidenceTier: "Hướng dẫn hiệp hội chuyên khoa",
  },
  coldAAP: {
    organization: "HealthyChildren.org (AAP)",
    title: "How to Care for Your Child's Cold",
    url: "https://www.healthychildren.org/English/health-issues/conditions/flu/Pages/caring-for-Your-childs-cold-or-flu.aspx",
    evidenceTier: "Hướng dẫn hiệp hội chuyên khoa",
  },
  coldMedsFDA: {
    organization: "FDA",
    title: "Use Caution When Giving Cough and Cold Products to Kids",
    url: "https://www.fda.gov/drugs/special-features/use-caution-when-giving-cough-and-cold-products-kids",
    evidenceTier: "Cảnh báo an toàn cơ quan quản lý",
  },
  cesareanACOG: {
    organization: "ACOG",
    title: "Cesarean Birth",
    url: "https://www.acog.org/womens-health/faqs/cesarean-birth",
    evidenceTier: "Hướng dẫn chuyên môn",
  },
  unplannedCesareanACOG: {
    organization: "ACOG",
    title: "What to Know About Unplanned Cesarean Births",
    url: "https://www.acog.org/womens-health/experts-and-stories/the-latest/what-to-know-about-unplanned-cesarean-births",
    evidenceTier: "Hướng dẫn chuyên môn",
  },
  hospitalBagNHS: {
    organization: "NHS",
    title: "Hospital bag checklist",
    url: "https://www.nhs.uk/best-start-in-life/pregnancy/preparing-for-labour-and-birth/hospital-bag-checklist/",
    evidenceTier: "Hướng dẫn dịch vụ y tế",
  },
  carSeatNHTSA: {
    organization: "NHTSA",
    title: "Hospital Discharge Recommendations for Safe Transportation of Children",
    url: "https://www.nhtsa.gov/sites/nhtsa.gov/files/documents/812106_hospitaldischrgerecsafetranschildren.pdf",
    evidenceTier: "Hướng dẫn an toàn cơ quan quản lý",
  },
  laborSignsACOG: {
    organization: "ACOG",
    title: "How to Tell When Labor Begins",
    url: "https://www.acog.org/womens-health/faqs/how-to-tell-when-labor-begins",
    evidenceTier: "Hướng dẫn chuyên môn",
  },
  laborSignsNHS: {
    organization: "NHS",
    title: "Signs that labour has begun",
    url: "https://www.nhs.uk/pregnancy/labour-and-birth/signs-that-labour-has-begun/",
    evidenceTier: "Hướng dẫn dịch vụ y tế",
  },
  episiotomyNHS: {
    organization: "NHS",
    title: "Episiotomy and perineal tears",
    url: "https://www.nhs.uk/pregnancy/labour-and-birth/episiotomy-and-perineal-tears/",
    evidenceTier: "Hướng dẫn dịch vụ y tế",
  },
  mastitisLLL: {
    organization: "La Leche League USA",
    title: "Mastitis, Slowed Milk Flow, and Milk Blisters",
    url: "https://lllusa.org/mastitis/",
    evidenceTier: "Tài liệu hỗ trợ nuôi con bằng sữa mẹ",
  },
  engorgementLLL: {
    organization: "La Leche League USA",
    title: "Engorgement",
    url: "https://lllusa.org/engorgement/",
    evidenceTier: "Tài liệu hỗ trợ nuôi con bằng sữa mẹ",
  },
  postpartumConditionsACOG: {
    organization: "ACOG",
    title: "3 Conditions to Watch for After Childbirth",
    url: "https://www.acog.org/womens-health/experts-and-stories/the-latest/3-conditions-to-watch-for-after-childbirth",
    evidenceTier: "Hướng dẫn chuyên môn",
  },
  lochiaNHS: {
    organization: "NHS Healthier Together",
    title: "Blood loss - what to expect after birth",
    url: "https://www.healthiertogether.nhs.uk/new-parent-and-baby/blood-loss---what-to-expect-after-birth",
    evidenceTier: "Hướng dẫn dịch vụ y tế",
  },
  teethingAAP: {
    organization: "HealthyChildren.org (AAP)",
    title: "Teething & Tooth Care",
    url: "https://www.healthychildren.org/English/ages-stages/baby/teething-tooth-care/Pages/default.aspx",
    evidenceTier: "Hướng dẫn hiệp hội chuyên khoa",
  },
  teethingReliefAAP: {
    organization: "HealthyChildren.org (AAP)",
    title: "How to Help Teething Symptoms without Medications",
    url: "https://www.healthychildren.org/English/ages-stages/baby/teething-tooth-care/Pages/How-to-Help-Teething-Symptoms-without-Medications.aspx",
    evidenceTier: "Hướng dẫn hiệp hội chuyên khoa",
  },
  benzocaineFDA: {
    organization: "FDA",
    title: "FDA takes action against OTC benzocaine teething products",
    url: "https://www.fda.gov/news-events/press-announcements/fda-takes-action-against-use-otc-benzocaine-teething-products-due-serious-safety-risk-lack-benefit",
    evidenceTier: "Cảnh báo an toàn cơ quan quản lý",
  },
  homeopathicRecallFDA: {
    organization: "FDA",
    title: "FDA announces Standard Homeopathic Company's nationwide recall of Hyland's teething tablets",
    url: "https://www.fda.gov/drugs/drug-safety-and-availability/fda-announces-standard-homeopathic-companys-nationwide-voluntary-recall-hylands-teething-tablets",
    evidenceTier: "Cảnh báo an toàn cơ quan quản lý",
  },
  sleepStagesAAP: {
    organization: "HealthyChildren.org (AAP)",
    title: "Stages of Newborn Sleep",
    url: "https://www.healthychildren.org/English/ages-stages/baby/sleep/Pages/phases-of-sleep.aspx",
    evidenceTier: "Hướng dẫn hiệp hội chuyên khoa",
  },
  daynightAAP: {
    organization: "HealthyChildren.org (AAP)",
    title: "Reversing Day-Night Reversal",
    url: "https://www.healthychildren.org/English/ages-stages/baby/sleep/Pages/Reversing-Day-Night-Reversal.aspx",
    evidenceTier: "Hướng dẫn hiệp hội chuyên khoa",
  },
  helpingSleepNHS: {
    organization: "NHS",
    title: "Helping your baby to sleep",
    url: "https://www.nhs.uk/baby/caring-for-a-newborn/helping-your-baby-to-sleep/",
    evidenceTier: "Hướng dẫn dịch vụ y tế",
  },
  stridorAAP: {
    organization: "HealthyChildren.org (AAP)",
    title: "Stridor & Laryngomalacia: Is My Baby's Noisy Breathing Serious?",
    url: "https://www.healthychildren.org/English/health-issues/conditions/ear-nose-throat/Pages/laryngomalacia-and-stridor-is-my-babys-noisy-breathing-serious.aspx",
    evidenceTier: "Hướng dẫn hiệp hội chuyên khoa",
  },
  swaddlingAAP: {
    organization: "HealthyChildren.org (AAP)",
    title: "Swaddling: Is it Safe for Your Baby?",
    url: "https://www.healthychildren.org/English/ages-stages/baby/diapers-clothing/Pages/Swaddling-Is-it-Safe.aspx",
    evidenceTier: "Hướng dẫn hiệp hội chuyên khoa",
  },
  safeSleepPolicyAAP: {
    organization: "American Academy of Pediatrics",
    title: "Sleep-Related Infant Deaths: Updated 2022 Recommendations for Reducing Infant Deaths in the Sleep Environment",
    url: "https://doi.org/10.1542/peds.2022-057990",
    evidenceTier: "Khuyến cáo chính sách hiệp hội chuyên khoa",
  },
  pacifierCochrane: {
    organization: "Cochrane",
    title: "Pacifiers for reducing the risk of sudden infant death syndrome (SIDS)",
    url: "https://www.cochranelibrary.com/cdsr/doi/10.1002/14651858.CD011147.pub2/full",
    evidenceTier: "Cochrane Review",
  },
  clusterFeedingABM: {
    organization: "Academy of Breastfeeding Medicine",
    title: "ABM Clinical Protocol #9: Use of Supplementary Feedings in the Healthy Term Breastfed Neonate (Revised 2017)",
    url: "https://abm.memberclicks.net/assets/DOCUMENTS/PROTOCOLS/3-supplementation-protocol-english.pdf",
    evidenceTier: "Hướng dẫn lâm sàng hiệp hội chuyên khoa",
  },
  newbornBreastfeedingCDC: {
    organization: "CDC",
    title: "Newborn Breastfeeding Basics",
    url: "https://www.cdc.gov/infant-toddler-nutrition/breastfeeding/newborn-basics.html",
    evidenceTier: "Hướng dẫn cơ quan y tế",
  },
  llliFrequency: {
    organization: "La Leche League International",
    title: "Newborn Breastfeeding Frequency FAQs",
    url: "https://llli.org/breastfeeding-info/frequency-feeding-frequently-asked-questions-faqs/",
    evidenceTier: "Tài liệu hỗ trợ nuôi con bằng sữa mẹ",
  },
  llliOversupply: {
    organization: "La Leche League International",
    title: "Breast Milk Oversupply and Overactive Milk Ejection Reflex",
    url: "https://llli.org/breastfeeding-info/oversupply/",
    evidenceTier: "Tài liệu hỗ trợ nuôi con bằng sữa mẹ",
  },
  llliLowSupply: {
    organization: "La Leche League International",
    title: "Signs Baby Isn't Getting Enough Breastmilk",
    url: "https://llli.org/breastfeeding-info/is-baby-getting-enough/",
    evidenceTier: "Tài liệu hỗ trợ nuôi con bằng sữa mẹ",
  },
  formulaAmountAAP: {
    organization: "HealthyChildren.org (AAP)",
    title: "Amount and Schedule of Baby Formula Feedings",
    url: "https://www.healthychildren.org/English/ages-stages/baby/formula-feeding/Pages/amount-and-schedule-of-formula-feedings.aspx",
    evidenceTier: "Hướng dẫn hiệp hội chuyên khoa",
  },
  formulaPrepNHS: {
    organization: "NHS",
    title: "How to make up baby formula",
    url: "https://www.nhs.uk/baby/breastfeeding-and-bottle-feeding/bottle-feeding/making-up-baby-formula/",
    evidenceTier: "Hướng dẫn dịch vụ y tế",
  },
  formulaHowMuchCDC: {
    organization: "CDC",
    title: "How Much and How Often to Feed Infant Formula",
    url: "https://www.cdc.gov/infant-toddler-nutrition/formula-feeding/how-much-and-how-often.html",
    evidenceTier: "Hướng dẫn cơ quan y tế",
  },
  bottleFeedingCDC: {
    organization: "CDC",
    title: "About Feeding From a Bottle",
    url: "https://www.cdc.gov/infant-toddler-nutrition/bottle-feeding/index.html",
    evidenceTier: "Hướng dẫn cơ quan y tế",
  },
  breastfeedingWarningAAP: {
    organization: "HealthyChildren.org (AAP)",
    title: "Warning Signs of Breastfeeding Problems",
    url: "https://www.healthychildren.org/English/ages-stages/baby/breastfeeding/Pages/Warning-Signs-of-Breastfeeding-Problems.aspx",
    evidenceTier: "Hướng dẫn hiệp hội chuyên khoa",
  },
  wetDiapersNorfolk: {
    organization: "Just One Norfolk (NHS)",
    title: "What's In The Nappy",
    url: "https://www.justonenorfolk.nhs.uk/healthy-lifestyles/infant-feeding/breastfeeding/whats-in-the-nappy/",
    evidenceTier: "Hướng dẫn dịch vụ y tế",
  },
  enoughMilkAAP: {
    organization: "HealthyChildren.org (AAP)",
    title: "How to Tell if Your Breastfed Baby is Getting Enough Milk",
    url: "https://www.healthychildren.org/English/ages-stages/baby/breastfeeding/Pages/How-to-Tell-if-Baby-is-Getting-Enough-Milk.aspx",
    evidenceTier: "Hướng dẫn hiệp hội chuyên khoa",
  },
  dehydrationNHS: {
    organization: "NHS",
    title: "Dehydration",
    url: "https://www.nhs.uk/conditions/dehydration/",
    evidenceTier: "Hướng dẫn dịch vụ y tế",
  },
  reflexesAAP: {
    organization: "HealthyChildren.org (AAP)",
    title: "Newborn Reflexes",
    url: "https://www.healthychildren.org/English/ages-stages/baby/Pages/newborn-reflexes.aspx",
    evidenceTier: "Hướng dẫn hiệp hội chuyên khoa",
  },
  reflexesJournal: {
    organization: "Int J Pediatr (peer-reviewed)",
    title: "Futagi Y, Toribe Y, Suzuki Y — The Grasp Reflex and Moro Reflex in Infants: Hierarchy of Primitive Reflex Responses (2012)",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC3384944/",
    evidenceTier: "Nghiên cứu bình duyệt",
  },
  thermalWHO: {
    organization: "WHO",
    title: "Thermal protection of the newborn: a practical guide",
    url: "https://www.who.int/publications/i/item/WHO_RHT_MSM_97.2",
    evidenceTier: "Hướng dẫn WHO",
  },
  cchdCDC: {
    organization: "CDC",
    title: "Clinical Screening and Diagnosis for Critical Congenital Heart Defects",
    url: "https://www.cdc.gov/heart-defects/hcp/screening/index.html",
    evidenceTier: "Hướng dẫn cơ quan y tế",
  },
  ehdiCDC: {
    organization: "CDC",
    title: "EHDI 1-3-6 Benchmarks (newborn hearing screening)",
    url: "https://www.cdc.gov/hearing-loss-children/articles/baby-hearing-screening-infographic.html",
    evidenceTier: "Hướng dẫn cơ quan y tế",
  },
  hearingScreeningNHS: {
    organization: "NHS",
    title: "Newborn hearing screening",
    url: "https://www.nhs.uk/baby/newborn-screening/hearing-test/",
    evidenceTier: "Hướng dẫn dịch vụ y tế",
  },
  newbornVisitAAP: {
    organization: "HealthyChildren.org (AAP)",
    title: "Your Checkup Checklist: Newborn Visit (2 to 5 days old)",
    url: "https://www.healthychildren.org/English/ages-stages/Your-Childs-Checkups/Pages/Your-Checkup-Checklist-Newborn-Visit-2-to-5-days-old.aspx",
    evidenceTier: "Hướng dẫn hiệp hội chuyên khoa",
  },
  moh2246: {
    organization: "Bộ Y tế Việt Nam",
    title: "Quyết định 2246/QĐ-BYT ngày 01/8/2024 — Hướng dẫn khám sức khỏe định kỳ cho trẻ em dưới 24 tháng tuổi",
    url: "https://luatvietnam.vn/y-te/quyet-dinh-2246-qd-byt-2024-tai-lieu-huong-dan-kham-suc-khoe-dinh-ky-tre-duoi-24-thang-tuoi-361968-d1.html",
    evidenceTier: "Văn bản pháp quy Bộ Y tế (qua trang tổng hợp luật)",
  },
  cordCareAAP: {
    organization: "HealthyChildren.org (AAP)",
    title: "Umbilical Cord Care in Newborns",
    url: "https://www.healthychildren.org/English/ages-stages/baby/bathing-skin-care/Pages/Umbilical-Cord-Care.aspx",
    evidenceTier: "Hướng dẫn hiệp hội chuyên khoa",
  },
  cordDelayedAAP: {
    organization: "AAP",
    title: "Umbilical Cord – Delayed Separation Past 3 Weeks",
    url: "https://publications.aap.org/patiented/article/doi/10.1542/ppe_schmitt_257/82222/Umbilical-Cord-Delayed-Separation-Past-3-Weeks",
    evidenceTier: "Tài liệu giáo dục bệnh nhân hiệp hội chuyên khoa",
  },
  granulomaSheffield: {
    organization: "Sheffield Children's NHS Foundation Trust",
    title: "Umbilical granuloma",
    url: "https://library.sheffieldchildrens.nhs.uk/umbilical-granuloma/",
    evidenceTier: "Hướng dẫn dịch vụ y tế",
  },
  omphalitisKingston: {
    organization: "Kingston and Richmond NHS Foundation Trust",
    title: "Umbilical disorders in children",
    url: "https://www.kingstonandrichmond.nhs.uk/services/healthcare-professionals/how-refer/paediatric-referrals/umbilical-disorders-children",
    evidenceTier: "Hướng dẫn dịch vụ y tế",
  },
  cordAntisepticsCochrane: {
    organization: "Cochrane",
    title: "Umbilical cord antiseptics for preventing sepsis and death among newborns",
    url: "https://www.cochranelibrary.com/cdsr/doi/10.1002/14651858.CD008635.pub3/full",
    evidenceTier: "Cochrane Review",
  },
  cordCareAAPPolicy: {
    organization: "American Academy of Pediatrics",
    title: "Umbilical Cord Care in the Newborn Infant (Clinical Report, Pediatrics 2016)",
    url: "https://publications.aap.org/pediatrics/article/138/3/e20162149/52610/Umbilical-Cord-Care-in-the-Newborn-Infant",
    evidenceTier: "Báo cáo lâm sàng hiệp hội chuyên khoa",
  },
  visionAAP: {
    organization: "HealthyChildren.org (AAP)",
    title: "Infant Vision Development: What Can Babies See?",
    url: "https://www.healthychildren.org/English/ages-stages/baby/Pages/Babys-Vision-Development.aspx",
    evidenceTier: "Hướng dẫn hiệp hội chuyên khoa",
  },
  visionWarningAAP: {
    organization: "HealthyChildren.org (AAP)",
    title: "Warning Signs of Vision Problems in Infants & Children",
    url: "https://www.healthychildren.org/English/health-issues/conditions/eyes/Pages/Warning-Signs-of-Vison-Problems-in-Children.aspx",
    evidenceTier: "Hướng dẫn hiệp hội chuyên khoa",
  },
  redReflexMoorfields: {
    organization: "Moorfields Eye Hospital NHS Foundation Trust",
    title: "Red reflex",
    url: "https://www.moorfields.nhs.uk/eye-conditions/red-reflex",
    evidenceTier: "Hướng dẫn dịch vụ y tế",
  },
  stickyEyeNHS: {
    organization: "West London Healthier Together (NHS)",
    title: "My baby has a sticky eye",
    url: "https://healthiertogether.westlondon.nhs.uk/parentscarers/worried-your-baby-unwell-under-3-months/my-baby-has-sticky-eye",
    evidenceTier: "Hướng dẫn dịch vụ y tế",
  },
  squintFrimley: {
    organization: "Frimley Health Healthier Together (NHS)",
    title: "Vision",
    url: "https://frimley-healthiertogether.nhs.uk/parentscarers/your-childs-development/vision",
    evidenceTier: "Hướng dẫn dịch vụ y tế",
  },
  hearingScreeningAAP: {
    organization: "HealthyChildren.org (AAP)",
    title: "Hearing Screening for Newborns, Children & Adolescents: AAP Policy Explained",
    url: "https://www.healthychildren.org/English/ages-stages/baby/Pages/Purpose-of-Newborn-Hearing-Screening.aspx",
    evidenceTier: "Hướng dẫn hiệp hội chuyên khoa",
  },
  colostrumAAP: {
    organization: "HealthyChildren.org (AAP)",
    title: "Colostrum: Your Baby's First Meal",
    url: "https://www.healthychildren.org/English/ages-stages/baby/breastfeeding/Pages/Colostrum-Your-Babys-First-Meal.aspx",
    evidenceTier: "Hướng dẫn hiệp hội chuyên khoa",
  },
  whatToExpectCDC: {
    organization: "CDC",
    title: "What to Expect While Breastfeeding",
    url: "https://www.cdc.gov/infant-toddler-nutrition/breastfeeding/what-to-expect-while-breastfeeding.html",
    evidenceTier: "Hướng dẫn cơ quan y tế",
  },
  firstDaysNHS: {
    organization: "NHS",
    title: "Breastfeeding: the first few days",
    url: "https://www.nhs.uk/baby/breastfeeding-and-bottle-feeding/breastfeeding/the-first-few-days/",
    evidenceTier: "Hướng dẫn dịch vụ y tế",
  },
  transitionalMatureAAP: {
    organization: "HealthyChildren.org (AAP)",
    title: "Transitional Milk and Mature Milk",
    url: "https://www.healthychildren.org/English/ages-stages/baby/breastfeeding/Pages/Transitional-Milk-and-Mature-Milk.aspx",
    evidenceTier: "Hướng dẫn hiệp hội chuyên khoa",
  },
  increasingSupplyLLLI: {
    organization: "La Leche League International",
    title: "Increasing Breastmilk Supply",
    url: "https://llli.org/news/increasing-breastmilk-supply/",
    evidenceTier: "Tài liệu hỗ trợ nuôi con bằng sữa mẹ",
  },
  foremilkHindmilkLLLI: {
    organization: "La Leche League International",
    title: "Foremilk and Hindmilk – Myths and Facts",
    url: "https://llli.org/breastfeeding-info/foremilk-and-hindmilk/",
    evidenceTier: "Tài liệu hỗ trợ nuôi con bằng sữa mẹ",
  },
  relactationLLLI: {
    organization: "La Leche League International",
    title: "Relactation",
    url: "https://llli.org/breastfeeding-info/relactation/",
    evidenceTier: "Tài liệu hỗ trợ nuôi con bằng sữa mẹ",
  },
  positionsNHS: {
    organization: "NHS",
    title: "Breastfeeding positions",
    url: "https://www.nhs.uk/best-start-in-life/baby/feeding-your-baby/breastfeeding/how-to-breastfeed/breastfeeding-positions/",
    evidenceTier: "Hướng dẫn dịch vụ y tế",
  },
  positioningLLLI: {
    organization: "La Leche League International",
    title: "Breastfeeding Positions, Latch, and Positioning",
    url: "https://llli.org/breastfeeding-info/positioning/",
    evidenceTier: "Tài liệu hỗ trợ nuôi con bằng sữa mẹ",
  },
  latchAAP: {
    organization: "HealthyChildren.org (AAP)",
    title: "Ensuring Proper Latch On While Breastfeeding",
    url: "https://www.healthychildren.org/English/ages-stages/baby/breastfeeding/Pages/ensuring-proper-latch-on.aspx",
    evidenceTier: "Hướng dẫn hiệp hội chuyên khoa",
  },
  soreNipplesNHS: {
    organization: "NHS",
    title: "Sore or cracked nipples when breastfeeding",
    url: "https://www.nhs.uk/baby/breastfeeding-and-bottle-feeding/breastfeeding-problems/sore-nipples/",
    evidenceTier: "Hướng dẫn dịch vụ y tế",
  },
  persistentPainLLLI: {
    organization: "La Leche League International",
    title: "Persistent Pain When Breastfeeding",
    url: "https://llli.org/news/persistent-pain-when-breastfeeding-2/",
    evidenceTier: "Tài liệu hỗ trợ nuôi con bằng sữa mẹ",
  },
  nursingStrikeNHS: {
    organization: "Cambridgeshire & Peterborough Children's Health (NHS)",
    title: "Sudden breast refusal and nursing strikes",
    url: "https://cambspborochildrenshealth.nhs.uk/feeding-and-eating/breastfeeding/sudden-breast-refusal-and-nursing-strikes/",
    evidenceTier: "Hướng dẫn dịch vụ y tế",
  },
  nursingStrikeLLLGB: {
    organization: "La Leche League GB",
    title: "Nursing strikes",
    url: "https://laleche.org.uk/nursing-strikes/",
    evidenceTier: "Tài liệu hỗ trợ nuôi con bằng sữa mẹ",
  },
  tenStepsWHO: {
    organization: "WHO",
    title: "Ten steps to successful breastfeeding",
    url: "https://www.who.int/teams/nutrition-and-food-safety/food-and-nutrition-actions-in-health-systems/ten-steps-to-successful-breastfeeding",
    evidenceTier: "Hướng dẫn WHO",
  },
  pumpingMethodsCochrane: {
    organization: "Cochrane",
    title: "Methods of milk expression for lactating women",
    url: "https://www.cochrane.org/evidence/CD006170_methods-milk-expression-lactating-women",
    evidenceTier: "Cochrane Review",
  },
  pumpingCDC: {
    organization: "CDC",
    title: "Pumping Breast Milk",
    url: "https://www.cdc.gov/infant-toddler-nutrition/breastfeeding/pumping-breast-milk.html",
    evidenceTier: "Hướng dẫn cơ quan y tế",
  },
  workplaceCDC: {
    organization: "CDC",
    title: "Breastfeeding and Returning to Your Workplace",
    url: "https://www.cdc.gov/infant-toddler-nutrition/breastfeeding/returning-to-your-workplace.html",
    evidenceTier: "Hướng dẫn cơ quan y tế",
  },
  storageCDC: {
    organization: "CDC",
    title: "Breast Milk Storage and Preparation",
    url: "https://www.cdc.gov/breastfeeding/breast-milk-preparation-and-storage/handling-breastmilk.html",
    evidenceTier: "Hướng dẫn cơ quan y tế",
  },
  storageFAQCDC: {
    organization: "CDC",
    title: "Breast Milk Storage Questions and Answers",
    url: "https://www.cdc.gov/breastfeeding/php/guidelines-recommendations/faqs.html",
    evidenceTier: "Hướng dẫn cơ quan y tế",
  },
  storageNHS: {
    organization: "NHS",
    title: "Storing breast milk",
    url: "https://www.nhs.uk/best-start-in-life/baby/feeding-your-baby/breastfeeding/expressing-your-breast-milk/storing-breast-milk/",
    evidenceTier: "Hướng dẫn dịch vụ y tế",
  },
  pumpHygieneCDC: {
    organization: "CDC",
    title: "How to Clean and Sanitize Breast Pumps",
    url: "https://www.cdc.gov/hygiene/about/about-breast-pump-hygiene.html",
    evidenceTier: "Hướng dẫn cơ quan y tế",
  },
  medSafetyAAP: {
    organization: "HealthyChildren.org (AAP)",
    title: "Medication Safety Tips for Breastfeeding Parents",
    url: "https://www.healthychildren.org/English/ages-stages/baby/breastfeeding/Pages/Medications-and-Breastfeeding.aspx",
    evidenceTier: "Hướng dẫn hiệp hội chuyên khoa",
  },
  medSafetyCDC: {
    organization: "CDC",
    title: "Prescription Medication Use (Breastfeeding Special Circumstances)",
    url: "https://www.cdc.gov/breastfeeding-special-circumstances/hcp/vaccine-medication-drugs/prescriptions.html",
    evidenceTier: "Hướng dẫn cơ quan y tế",
  },
  lactmedFactSheet: {
    organization: "NIH — LactMed",
    title: "Fact Sheet: Drugs and Lactation Database (LactMed®)",
    url: "https://www.ncbi.nlm.nih.gov/books/NBK547437/",
    evidenceTier: "Cơ sở dữ liệu lâm sàng quốc gia",
  },
  contraceptionCDCMEC: {
    organization: "CDC",
    title: "U.S. Medical Eligibility Criteria (MEC) 2024 — Combined Hormonal Contraceptives",
    url: "https://www.cdc.gov/contraception/hcp/usmec/combined-hormonal-contraceptives.html",
    evidenceTier: "Hướng dẫn cơ quan y tế",
  },
  alcoholCDCBreastfeeding: {
    organization: "CDC",
    title: "Alcohol (Breastfeeding Special Circumstances)",
    url: "https://www.cdc.gov/breastfeeding-special-circumstances/hcp/vaccine-medication-drugs/alcohol.html",
    evidenceTier: "Hướng dẫn cơ quan y tế",
  },
  maternalDietCDC: {
    organization: "CDC",
    title: "Maternal Diet and Breastfeeding",
    url: "https://www.cdc.gov/breastfeeding-special-circumstances/hcp/diet-micronutrients/maternal-diet.html",
    evidenceTier: "Hướng dẫn cơ quan y tế",
  },
  safeSleepSevenLLLGB: {
    organization: "La Leche League GB",
    title: "Safer Sleep & the Breastfed Baby",
    url: "https://laleche.org.uk/safe-sleep-the-breastfed-baby/",
    evidenceTier: "Tài liệu hỗ trợ nuôi con bằng sữa mẹ",
  },
  weaningNHS: {
    organization: "NHS",
    title: "How to stop breastfeeding",
    url: "https://www.nhs.uk/baby/breastfeeding-and-bottle-feeding/breastfeeding/how-to-stop-breastfeeding/",
    evidenceTier: "Hướng dẫn dịch vụ y tế",
  },
  weaningAAP: {
    organization: "HealthyChildren.org (AAP)",
    title: "Weaning Your Baby",
    url: "https://www.healthychildren.org/English/ages-stages/baby/breastfeeding/Pages/Weaning-Your-Baby.aspx",
    evidenceTier: "Hướng dẫn hiệp hội chuyên khoa",
  },
  weaningLLLI: {
    organization: "La Leche League International",
    title: "Weaning - How To",
    url: "https://llli.org/breastfeeding-info/weaning-how-to/",
    evidenceTier: "Tài liệu hỗ trợ nuôi con bằng sữa mẹ",
  },
  contraindicationsCDC: {
    organization: "CDC",
    title: "Contraindications to Breastfeeding",
    url: "https://www.cdc.gov/breastfeeding-special-circumstances/hcp/",
    evidenceTier: "Hướng dẫn cơ quan y tế",
  },
  nvpTimingAAFP: {
    organization: "American Family Physician (AAFP)",
    title: "Nausea and Vomiting During Pregnancy",
    url: "https://www.aafp.org/afp/2026/0600/nausea-vomiting-during-pregnancy",
    evidenceTier: "Tài liệu bình duyệt chuyên khoa",
  },
  fetusGrowthACOG: {
    organization: "ACOG",
    title: "How Your Fetus Grows During Pregnancy",
    url: "https://www.acog.org/womens-health/faqs/how-your-fetus-grows-during-pregnancy",
    evidenceTier: "Hướng dẫn chuyên môn",
  },
  datingScanNHS: {
    organization: "NHS",
    title: "12-week scan",
    url: "https://www.nhs.uk/pregnancy/your-pregnancy-care/12-week-scan/",
    evidenceTier: "Hướng dẫn dịch vụ y tế",
  },
  quickeningNHS: {
    organization: "NHS",
    title: "Your baby's movements",
    url: "https://www.nhs.uk/pregnancy/keeping-well/your-babys-movements/",
    evidenceTier: "Hướng dẫn dịch vụ y tế",
  },
  antenatalAppointmentsNHS: {
    organization: "NHS",
    title: "Your antenatal appointments",
    url: "https://www.nhs.uk/pregnancy/your-pregnancy-care/your-antenatal-appointments/",
    evidenceTier: "Hướng dẫn dịch vụ y tế",
  },
  niceNG201: {
    organization: "NICE",
    title: "NG201: Antenatal care",
    url: "https://www.nice.org.uk/guidance/ng201",
    evidenceTier: "Hướng dẫn NICE",
  },
  braxtonHicksStatPearls: {
    organization: "StatPearls (NCBI Bookshelf)",
    title: "Braxton Hicks Contractions",
    url: "https://www.ncbi.nlm.nih.gov/books/NBK470546/",
    evidenceTier: "Tài liệu tham khảo lâm sàng",
  },
  edemaNHS: {
    organization: "NHS",
    title: "Swollen ankles, feet and fingers in pregnancy",
    url: "https://www.nhs.uk/pregnancy/related-conditions/common-symptoms/swollen-ankles-feet-and-fingers/",
    evidenceTier: "Hướng dẫn dịch vụ y tế",
  },
  visitScheduleACOG2025: {
    organization: "ACOG",
    title: "New ACOG Guidance Recommends Transformation to US Prenatal Care Delivery",
    url: "https://www.acog.org/news/news-releases/2025/04/new-acog-guidance-recommends-transformation-to-us-prenatal-care-delivery",
    evidenceTier: "Thông cáo hiệp hội chuyên khoa",
  },
  gbsACOG797: {
    organization: "ACOG (mirrored by SMFM)",
    title: "Committee Opinion #797: Prevention of Group B Streptococcal Early-Onset Disease in Newborns",
    url: "https://publications.smfm.org/publications/596-acog-committee-opinion-797-prevention-of-group-b/",
    evidenceTier: "Khuyến cáo hiệp hội chuyên khoa",
  },
  cdcGBS: {
    organization: "CDC",
    title: "About Group B Strep",
    url: "https://www.cdc.gov/group-b-strep/about/index.html",
    evidenceTier: "Hướng dẫn cơ quan y tế",
  },
  postTermAAFP: {
    organization: "American Family Physician (AAFP)",
    title: "Common Questions About Late-Term and Postterm Pregnancy",
    url: "https://www.aafp.org/pubs/afp/issues/2014/0801/p160.html",
    evidenceTier: "Tài liệu bình duyệt chuyên khoa",
  },
  backPainNHS: {
    organization: "NHS",
    title: "Back pain in pregnancy",
    url: "https://www.nhs.uk/pregnancy/related-conditions/common-symptoms/back-pain/",
    evidenceTier: "Hướng dẫn dịch vụ y tế",
  },
  cochraneBackPain: {
    organization: "Cochrane",
    title: "Interventions for preventing and treating low-back and pelvic pain during pregnancy",
    url: "https://www.cochranelibrary.com/cdsr/doi/10.1002/14651858.CD001139.pub4/references",
    evidenceTier: "Cochrane Review",
  },
  cochraneEdema: {
    organization: "Cochrane (qua PubMed)",
    title: "Interventions for leg oedema and varicosities in pregnancy",
    url: "https://pubmed.ncbi.nlm.nih.gov/16678328/",
    evidenceTier: "Cochrane Review",
  },
  rcogHG69: {
    organization: "RCOG",
    title: "Green-top Guideline No. 69: The Management of Nausea and Vomiting of Pregnancy and Hyperemesis Gravidarum",
    url: "https://www.rcog.org.uk/guidance/browse-all-guidance/green-top-guidelines/the-management-of-nausea-and-vomiting-of-pregnancy-and-hyperemesis-gravidarum-green-top-guideline-no-69/",
    evidenceTier: "Hướng dẫn hiệp hội chuyên khoa (Anh)",
  },
  hgNHS: {
    organization: "NHS",
    title: "Severe vomiting in pregnancy",
    url: "https://www.nhs.uk/pregnancy/complications/severe-vomiting/",
    evidenceTier: "Hướng dẫn dịch vụ y tế",
  },
  acogPB189: {
    organization: "ACOG (qua GuidelineCentral)",
    title: "Practice Bulletin No. 189: Nausea and Vomiting of Pregnancy",
    url: "https://www.guidelinecentral.com/guideline/308423/",
    evidenceTier: "Hướng dẫn lâm sàng hiệp hội chuyên khoa",
  },
  cochraneNVP: {
    organization: "Cochrane",
    title: "Interventions for nausea and vomiting in early pregnancy",
    url: "https://www.cochranelibrary.com/cdsr/doi/10.1002/14651858.CD007575.pub4/full",
    evidenceTier: "Cochrane Review",
  },
  acogPB222HTN: {
    organization: "ACOG (qua AAFP)",
    title: "Practice Bulletin No. 222: Gestational Hypertension and Preeclampsia",
    url: "https://www.aafp.org/pubs/afp/issues/2019/1115/p649.html",
    evidenceTier: "Hướng dẫn lâm sàng hiệp hội chuyên khoa",
  },
  nhsPreeclampsia: {
    organization: "NHS",
    title: "Pre-eclampsia",
    url: "https://www.nhs.uk/conditions/pre-eclampsia/",
    evidenceTier: "Hướng dẫn dịch vụ y tế",
  },
  nichdPreeclampsia: {
    organization: "NICHD",
    title: "About Preeclampsia and Eclampsia",
    url: "https://www.nichd.nih.gov/health/topics/preeclampsia/conditioninfo",
    evidenceTier: "Hướng dẫn cơ quan y tế",
  },
  uspstfAspirin: {
    organization: "USPSTF (qua JAMA)",
    title: "Aspirin Use to Prevent Preeclampsia and Related Morbidity and Mortality",
    url: "https://jamanetwork.com/journals/jama/fullarticle/2784499",
    evidenceTier: "Khuyến cáo lực lượng đặc nhiệm dự phòng Hoa Kỳ",
  },
  nhsGDM: {
    organization: "NHS",
    title: "Gestational diabetes",
    url: "https://www.nhs.uk/conditions/gestational-diabetes/",
    evidenceTier: "Hướng dẫn dịch vụ y tế",
  },
  cdcGDM: {
    organization: "CDC",
    title: "Gestational Diabetes",
    url: "https://www.cdc.gov/diabetes/about/gestational-diabetes.html",
    evidenceTier: "Hướng dẫn cơ quan y tế",
  },
  rcogEarlyBleeding: {
    organization: "RCOG",
    title: "Bleeding and/or pain in early pregnancy",
    url: "https://www.rcog.org.uk/for-the-public/browse-our-patient-information/bleeding-andor-pain-in-early-pregnancy/",
    evidenceTier: "Hướng dẫn hiệp hội chuyên khoa (Anh)",
  },
  nhsVaginalBleeding: {
    organization: "NHS",
    title: "Vaginal bleeding in pregnancy",
    url: "https://www.nhs.uk/pregnancy/common-symptoms/vaginal-bleeding/",
    evidenceTier: "Hướng dẫn dịch vụ y tế",
  },
  nhsPlacentaComplications: {
    organization: "NHS",
    title: "What complications can affect the placenta?",
    url: "https://www.nhs.uk/pregnancy/labour-and-birth/placenta-complications/",
    evidenceTier: "Hướng dẫn dịch vụ y tế",
  },
  cuhPlacentaPraevia: {
    organization: "Cambridge University Hospitals (NHS)",
    title: "Placenta praevia (low-lying placenta)",
    url: "https://www.cuh.nhs.uk/patient-information/placenta-praevia-low-lying-placenta/",
    evidenceTier: "Hướng dẫn dịch vụ y tế",
  },
  acogPB142Cervical: {
    organization: "ACOG (qua GuidelineCentral)",
    title: "Practice Bulletin No. 142: Cerclage for the Management of Cervical Insufficiency",
    url: "https://www.guidelinecentral.com/guideline/308493/",
    evidenceTier: "Hướng dẫn lâm sàng hiệp hội chuyên khoa",
  },
  acogPB233Anemia: {
    organization: "ACOG",
    title: "Practice Bulletin No. 233: Anemia in Pregnancy",
    url: "https://www.acog.org/clinical/clinical-guidance/practice-bulletin/articles/2021/08/anemia-in-pregnancy",
    evidenceTier: "Hướng dẫn lâm sàng hiệp hội chuyên khoa",
  },
  cdcMMWRIron: {
    organization: "CDC",
    title: "Recommendations to Prevent and Control Iron Deficiency in the United States (MMWR 1998)",
    url: "https://www.cdc.gov/mmwr/pdf/rr/rr4703.pdf",
    evidenceTier: "Hướng dẫn cơ quan y tế",
  },
  acogPretermLabor: {
    organization: "ACOG",
    title: "Preterm Labor and Birth",
    url: "https://www.acog.org/womens-health/faqs/preterm-labor-and-birth",
    evidenceTier: "Hướng dẫn chuyên môn",
  },
  nhsPrematureLabor: {
    organization: "NHS",
    title: "Premature labour and birth",
    url: "https://www.nhs.uk/pregnancy/labour-and-birth/premature-labour-and-birth/",
    evidenceTier: "Hướng dẫn dịch vụ y tế",
  },
  cdcPretermBirth: {
    organization: "CDC",
    title: "Preterm Birth",
    url: "https://www.cdc.gov/maternal-infant-health/preterm-birth/index.html",
    evidenceTier: "Hướng dẫn cơ quan y tế",
  },
  acogCorticosteroids: {
    organization: "ACOG",
    title: "Committee Opinion #713: Antenatal Corticosteroid Therapy for Fetal Maturation",
    url: "https://www.acog.org/clinical/clinical-guidance/committee-opinion/articles/2017/08/antenatal-corticosteroid-therapy-for-fetal-maturation",
    evidenceTier: "Khuyến cáo hiệp hội chuyên khoa",
  },
  acogMagnesium: {
    organization: "ACOG",
    title: "Committee Opinion #455: Magnesium Sulfate Before Anticipated Preterm Birth for Neuroprotection",
    url: "https://www.acog.org/clinical/clinical-guidance/committee-opinion/articles/2010/03/magnesium-sulfate-before-anticipated-preterm-birth-for-neuroprotection",
    evidenceTier: "Khuyến cáo hiệp hội chuyên khoa",
  },
  niceNG25Preterm: {
    organization: "NICE",
    title: "NG25: Preterm labour and birth",
    url: "https://www.nice.org.uk/guidance/ng25/chapter/Recommendations",
    evidenceTier: "Hướng dẫn NICE",
  },
  statPearlsPROM: {
    organization: "StatPearls (NCBI Bookshelf)",
    title: "Preterm and Term Prelabor Rupture of Membranes (PPROM and PROM)",
    url: "https://www.ncbi.nlm.nih.gov/books/NBK532888/",
    evidenceTier: "Tài liệu tham khảo lâm sàng",
  },
  acogFetalMovement: {
    organization: "ACOG",
    title: "Special Tests for Monitoring Fetal Well-Being",
    url: "https://www.acog.org/womens-health/faqs/special-tests-for-monitoring-fetal-well-being",
    evidenceTier: "Hướng dẫn chuyên môn",
  },
  affirmTrialLancet: {
    organization: "The Lancet",
    title: "AFFIRM trial — Awareness of fetal movements and care package to reduce fetal mortality",
    url: "https://www.thelancet.com/journals/lancet/article/PIIS0140-6736(18)31543-5/fulltext",
    evidenceTier: "Thử nghiệm ngẫu nhiên có đối chứng, bình duyệt",
  },
  cochraneFetalMovement: {
    organization: "Cochrane",
    title: "Interventions relating to fetal movements for improving pregnancy outcomes",
    url: "https://www.cochranelibrary.com/cdsr/doi/10.1002/14651858.CD014714/references",
    evidenceTier: "Cochrane Review",
  },
  acogSMFMCesareanConsensus: {
    organization: "ACOG/SMFM",
    title: "Safe Prevention of the Primary Cesarean Delivery (Obstetric Care Consensus, 2014)",
    url: "https://www.ajog.org/article/s0002-9378(14)00055-6/fulltext",
    evidenceTier: "Đồng thuận chăm sóc sản khoa hiệp hội chuyên khoa",
  },
  acogCPG8: {
    organization: "ACOG",
    title: "Clinical Practice Guideline No. 8: First and Second Stage Labor Management (2024)",
    url: "https://www.acog.org/clinical/clinical-guidance/clinical-practice-guideline/articles/2024/01/first-and-second-stage-labor-management",
    evidenceTier: "Hướng dẫn lâm sàng hiệp hội chuyên khoa",
  },
  niceNG235: {
    organization: "NICE",
    title: "NG235: Intrapartum care",
    url: "https://www.nice.org.uk/guidance/ng235/chapter/Recommendations",
    evidenceTier: "Hướng dẫn NICE",
  },
  aafpFetalMonitoring: {
    organization: "American Family Physician (AAFP)",
    title: "Intrapartum Fetal Monitoring",
    url: "https://www.aafp.org/pubs/afp/issues/2020/0801/p158.html",
    evidenceTier: "Tài liệu bình duyệt chuyên khoa",
  },
  niceNG229: {
    organization: "NICE",
    title: "NG229: Fetal monitoring in labour",
    url: "https://www.nice.org.uk/guidance/ng229/chapter/Recommendations",
    evidenceTier: "Hướng dẫn NICE",
  },
  cochraneEFM: {
    organization: "Cochrane",
    title: "Continuous cardiotocography (CTG) as a form of electronic fetal monitoring (EFM) for fetal assessment during labour",
    url: "https://www.cochranelibrary.com/cdsr/doi/10.1002/14651858.CD006066.pub3/full",
    evidenceTier: "Cochrane Review",
  },
  acogArriveStatement: {
    organization: "ACOG/SMFM",
    title: "Clinical guidance for integration of the findings of The ARRIVE Trial",
    url: "https://opqic.org/acog-practice-advisory-smfm-clinical-statement-clinical-guidance-for-integration-of-the-findings-of-the-arrive-trial-labor-induction-versus-expectant-management-in-low-risk-nulliparous-women/",
    evidenceTier: "Khuyến cáo lâm sàng hiệp hội chuyên khoa",
  },
  niceNG207Induction: {
    organization: "NICE",
    title: "NG207: Inducing labour",
    url: "https://www.nice.org.uk/guidance/ng207",
    evidenceTier: "Hướng dẫn NICE",
  },
  aafpCervicalRipening: {
    organization: "American Family Physician (AAFP)",
    title: "Cervical Ripening and Labor Induction and Augmentation",
    url: "https://www.aafp.org/pubs/afp/issues/2022/0200/p177.html",
    evidenceTier: "Tài liệu bình duyệt chuyên khoa",
  },
  nhsInducingLabour: {
    organization: "NHS",
    title: "Inducing labour",
    url: "https://www.nhs.uk/pregnancy/labour-and-birth/signs-of-labour/inducing-labour/",
    evidenceTier: "Hướng dẫn dịch vụ y tế",
  },
  cochraneMembraneSweep: {
    organization: "Cochrane",
    title: "Membrane sweeping for induction of labour",
    url: "https://www.cochrane.org/evidence/CD000451_membrane-sweeping-induction-labour",
    evidenceTier: "Cochrane Review",
  },
  cochraneEpidural: {
    organization: "Cochrane",
    title: "Epidural versus non-epidural or no analgesia for pain management in labour",
    url: "https://www.cochrane.org/evidence/CD000331_epidurals-pain-relief-labour",
    evidenceTier: "Cochrane Review",
  },
  aafpEpidural: {
    organization: "American Family Physician (AAFP)",
    title: "Epidural Analgesia for Labor Pain",
    url: "https://www.aafp.org/pubs/afp/issues/2012/0801/p241.html",
    evidenceTier: "Tài liệu bình duyệt chuyên khoa",
  },
  nhsPainRelief: {
    organization: "NHS",
    title: "Pain relief in labour",
    url: "https://www.nhs.uk/pregnancy/labour-and-birth/pain-relief-in-labour/",
    evidenceTier: "Hướng dẫn dịch vụ y tế",
  },
  nhsEpiduralSideEffects: {
    organization: "NHS",
    title: "Side effects of an epidural",
    url: "https://www.nhs.uk/tests-and-treatments/epidural/side-effects/",
    evidenceTier: "Hướng dẫn dịch vụ y tế",
  },
  nichdPainRelief: {
    organization: "NICHD",
    title: "What are the options for pain relief during labor and delivery?",
    url: "https://www.nichd.nih.gov/health/topics/labor-delivery/topicinfo/pain-relief",
    evidenceTier: "Hướng dẫn cơ quan y tế",
  },
  cochraneLaborSupport: {
    organization: "Cochrane",
    title: "Continuous support for women during childbirth",
    url: "https://www.cochrane.org/evidence/CD003766_continuous-support-women-during-childbirth",
    evidenceTier: "Cochrane Review",
  },
  cochraneWaterImmersion: {
    organization: "Cochrane",
    title: "Immersion in water during labour and birth",
    url: "https://www.cochrane.org/evidence/CD000111_immersion-water-labour-and-birth",
    evidenceTier: "Cochrane Review",
  },
  cochraneTENS: {
    organization: "Cochrane",
    title: "Transcutaneous electrical nerve stimulation (TENS) for pain management in labour",
    url: "https://www.cochrane.org/evidence/CD007214_tens-transcutaneous-nerve-stimulation-pain-relief-labour",
    evidenceTier: "Cochrane Review",
  },
  whoIntrapartumCare: {
    organization: "WHO",
    title: "WHO recommendations: Intrapartum care for a positive childbirth experience",
    url: "https://www.who.int/publications/i/item/9789241550215",
    evidenceTier: "Hướng dẫn WHO",
  },
  rcogPerinealTears: {
    organization: "RCOG",
    title: "Perineal tears during childbirth",
    url: "https://www.rcog.org.uk/for-the-public/perineal-tears-and-episiotomies-in-childbirth/perineal-tears-during-childbirth/",
    evidenceTier: "Hướng dẫn hiệp hội chuyên khoa (Anh)",
  },
  rcogOASI: {
    organization: "RCOG",
    title: "Care of a third- or fourth-degree tear (OASI)",
    url: "https://www.rcog.org.uk/for-the-public/browse-our-patient-information/care-of-a-third-or-fourth-degree-tear-that-occurred-during-childbirth-also-known-as-obstetric-anal-sphincter-injury-oasi/",
    evidenceTier: "Hướng dẫn hiệp hội chuyên khoa (Anh)",
  },
  cochraneEpisiotomy: {
    organization: "Cochrane",
    title: "Selective versus routine use of episiotomy for vaginal birth",
    url: "https://www.cochrane.org/evidence/CD000081_selective-versus-routine-use-episiotomy-vaginal-birth",
    evidenceTier: "Cochrane Review",
  },
  nhsEpisiotomyTears: {
    organization: "NHS",
    title: "Episiotomy and perineal tears",
    url: "https://www.nhs.uk/pregnancy/labour-and-birth/what-happens/episiotomy-and-perineal-tears/",
    evidenceTier: "Hướng dẫn dịch vụ y tế",
  },
  cochranePerinealMassage: {
    organization: "Cochrane",
    title: "Antenatal perineal massage for reducing perineal trauma",
    url: "https://www.cochrane.org/evidence/CD005123_antenatal-perineal-massage-reducing-perineal-trauma",
    evidenceTier: "Cochrane Review",
  },
  cochraneWarmCompress: {
    organization: "Cochrane",
    title: "Perineal techniques during the second stage of labour for reducing perineal trauma",
    url: "https://www.cochrane.org/evidence/CD006672_perineal-techniques-during-second-stage-labour-reducing-perineal-trauma",
    evidenceTier: "Cochrane Review",
  },
  aafpVBAC: {
    organization: "American Family Physician (AAFP)",
    title: "ACOG Updates Recommendations on Vaginal Birth After Previous Cesarean Delivery",
    url: "https://www.aafp.org/pubs/afp/issues/2011/0115/p214.html",
    evidenceTier: "Tài liệu bình duyệt chuyên khoa",
  },
  acogVBACFAQ: {
    organization: "ACOG",
    title: "Vaginal Birth After Cesarean Delivery (VBAC)",
    url: "https://www.acog.org/womens-health/faqs/vaginal-birth-after-cesarean-delivery",
    evidenceTier: "Hướng dẫn chuyên môn",
  },
  cochraneVBAC: {
    organization: "Cochrane",
    title: "Planned elective repeat caesarean section versus planned vaginal birth for women with a previous caesarean birth",
    url: "https://www.cochranelibrary.com/cdsr/doi/10.1002/14651858.CD004224.pub2/references",
    evidenceTier: "Cochrane Review",
  },
  whoCordClamping: {
    organization: "WHO",
    title: "Guideline: Delayed Umbilical Cord Clamping for Improved Maternal and Infant Health and Nutrition Outcomes",
    url: "https://www.who.int/publications/i/item/9789241508209",
    evidenceTier: "Hướng dẫn WHO",
  },
  acogCO814CordClamping: {
    organization: "ACOG",
    title: "Committee Opinion #814: Delayed Umbilical Cord Clamping After Birth",
    url: "https://www.acog.org/clinical/clinical-guidance/committee-opinion/articles/2020/12/delayed-umbilical-cord-clamping-after-birth",
    evidenceTier: "Khuyến cáo hiệp hội chuyên khoa",
  },
  figoCordClamping: {
    organization: "FIGO",
    title: "Good Practice Recommendations on delayed umbilical cord clamping",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC9290637/",
    evidenceTier: "Khuyến cáo hiệp hội sản phụ khoa quốc tế",
  },
  cochraneCordClamping: {
    organization: "Cochrane",
    title: "Effect of timing of umbilical cord clamping of term infants on maternal and neonatal outcomes",
    url: "https://www.cochrane.org/evidence/CD004074_effect-timing-umbilical-cord-clamping-term-infants-maternal-and-neonatal-outcomes",
    evidenceTier: "Cochrane Review",
  },
  cochraneSkinToSkin: {
    organization: "Cochrane",
    title: "Immediate or early skin-to-skin contact for mothers and their healthy newborn infants",
    url: "https://www.cochrane.org/evidence/CD003519_immediate-or-early-skin-skin-contact-mothers-and-their-healthy-newborn-infants",
    evidenceTier: "Cochrane Review",
  },
  unicefBFISkinToSkin: {
    organization: "UNICEF UK Baby Friendly Initiative",
    title: "Skin-to-skin contact",
    url: "https://www.unicef.org.uk/babyfriendly/baby-friendly-resources/implementing-standards-resources/skin-to-skin-contact/",
    evidenceTier: "Sáng kiến Bệnh viện thân thiện với trẻ (WHO/UNICEF)",
  },
  cochraneThirdStage: {
    organization: "Cochrane",
    title: "Active versus expectant management for women in the third stage of labour",
    url: "https://www.cochrane.org/evidence/CD007412_active-versus-expectant-management-women-third-stage-labour",
    evidenceTier: "Cochrane Review",
  },
  acogApgarScore: {
    organization: "ACOG/AAP",
    title: "Committee Opinion: The Apgar Score",
    url: "https://www.acog.org/clinical/clinical-guidance/committee-opinion/articles/2015/10/the-apgar-score",
    evidenceTier: "Khuyến cáo chung hiệp hội chuyên khoa",
  },
  nhsBodyAfterBirth: {
    organization: "NHS",
    title: "Your body after the birth",
    url: "https://www.nhs.uk/pregnancy/labour-and-birth/your-body/",
    evidenceTier: "Hướng dẫn dịch vụ y tế",
  },
  cochranePostpartumConstipation: {
    organization: "Cochrane",
    title: "Interventions for treating postpartum constipation",
    url: "https://www.cochrane.org/evidence/CD010273_interventions-treating-postpartum-constipation",
    evidenceTier: "Cochrane Review",
  },
  nhsKeepingFit: {
    organization: "NHS",
    title: "Keeping fit and healthy with a baby",
    url: "https://www.nhs.uk/baby/support-and-services/keeping-fit-and-healthy-with-a-baby/",
    evidenceTier: "Hướng dẫn dịch vụ y tế",
  },
  nhsPostPregnancyBody: {
    organization: "NHS",
    title: "Your post-pregnancy body",
    url: "https://www.nhs.uk/baby/support-and-services/your-post-pregnancy-body/",
    evidenceTier: "Hướng dẫn dịch vụ y tế",
  },
  nhsCesareanRecovery: {
    organization: "NHS",
    title: "Caesarean section – Recovery",
    url: "https://www.nhs.uk/tests-and-treatments/caesarean-section/recovery/",
    evidenceTier: "Hướng dẫn dịch vụ y tế",
  },
  acogExercisePostpartum: {
    organization: "ACOG",
    title: "Committee Opinion #804: Physical Activity and Exercise During Pregnancy and the Postpartum Period",
    url: "https://www.acog.org/clinical/clinical-guidance/committee-opinion/articles/2020/04/physical-activity-and-exercise-during-pregnancy-and-the-postpartum-period",
    evidenceTier: "Khuyến cáo hiệp hội chuyên khoa",
  },
  nhsSexContraceptionAfterBirth: {
    organization: "NHS",
    title: "Sex and contraception after birth",
    url: "https://www.nhs.uk/baby/support-and-services/sex-and-contraception-after-birth/",
    evidenceTier: "Hướng dẫn dịch vụ y tế",
  },
  acogPostpartumBirthControl: {
    organization: "ACOG",
    title: "Postpartum Birth Control",
    url: "https://www.acog.org/womens-health/faqs/postpartum-birth-control",
    evidenceTier: "Hướng dẫn chuyên môn",
  },
  cdcLAM: {
    organization: "CDC",
    title: "U.S. MEC Appendix G: Lactational Amenorrhea Method",
    url: "https://www.cdc.gov/contraception/hcp/usmec/lactational-amenorrhea-method.html",
    evidenceTier: "Hướng dẫn cơ quan y tế",
  },
  cochraneLAM: {
    organization: "Cochrane",
    title: "Lactational amenorrhoea method for family planning",
    url: "https://www.cochranelibrary.com/cdsr/doi/10.1002/14651858.CD001329.pub2/full",
    evidenceTier: "Cochrane Review",
  },
  cdcIUDTiming: {
    organization: "CDC",
    title: "U.S. MEC Appendix B: Classifications for Intrauterine Devices",
    url: "https://www.cdc.gov/contraception/hcp/usmec/intrauterine-devices.html",
    evidenceTier: "Hướng dẫn cơ quan y tế",
  },
  cochraneIUDTiming: {
    organization: "Cochrane",
    title: "Immediate versus delayed postpartum insertion of contraceptive implant and IUD",
    url: "https://www.cochranelibrary.com/cdsr/doi/10.1002/14651858.CD011913.pub3/full",
    evidenceTier: "Cochrane Review",
  },
  whoBirthSpacing: {
    organization: "WHO",
    title: "Report of a WHO Technical Consultation on Birth Spacing",
    url: "https://www.who.int/publications/i/item/WHO-RHR-07.1",
    evidenceTier: "Hướng dẫn WHO",
  },
  acogCO736: {
    organization: "ACOG",
    title: "Committee Opinion #736: Optimizing Postpartum Care",
    url: "https://www.acog.org/clinical/clinical-guidance/committee-opinion/articles/2018/05/optimizing-postpartum-care",
    evidenceTier: "Khuyến cáo hiệp hội chuyên khoa",
  },
  cochranePelvicFloor: {
    organization: "Cochrane",
    title: "Pelvic floor muscle training for preventing and treating urinary and faecal incontinence in antenatal and postnatal women",
    url: "https://www.cochranelibrary.com/cdsr/doi/10.1002/14651858.CD007471.pub4/full",
    evidenceTier: "Cochrane Review",
  },
  acogPPDFaq: {
    organization: "ACOG",
    title: "Postpartum Depression (FAQ)",
    url: "https://www.acog.org/womens-health/faqs/postpartum-depression",
    evidenceTier: "Hướng dẫn chuyên môn",
  },
  nhsPostnatalDepression: {
    organization: "NHS",
    title: "Postnatal depression",
    url: "https://www.nhs.uk/mental-health/conditions/postnatal-depression/",
    evidenceTier: "Hướng dẫn dịch vụ y tế",
  },
  acogCPG4MentalHealth: {
    organization: "ACOG",
    title: "Clinical Practice Guideline No. 4: Screening and Diagnosis of Mental Health Conditions During Pregnancy and Postpartum",
    url: "https://ilpqc.org/wp-content/uploads/2025/05/Screening-and-Diagnosis-of-Mental-Health-Conditions-During-Pregnancy-and-Postpartum_ACOG-Clinical-Practice-Guideline-No.-4-1.pdf",
    evidenceTier: "Hướng dẫn lâm sàng hiệp hội chuyên khoa",
  },
  acogCPG5MentalHealth: {
    organization: "ACOG",
    title: "Clinical Practice Guideline No. 5: Treatment and Management of Mental Health Conditions During Pregnancy and Postpartum",
    url: "https://ilpqc.org/wp-content/uploads/2025/05/Treatment-and-Management-of-Mental-Health-Conditions-During-Pregnancy-and-Postpartum_ACOG-Clinical-Practice-Guideline-No.-5.pdf",
    evidenceTier: "Hướng dẫn lâm sàng hiệp hội chuyên khoa",
  },
  cdcPPDPrevalence: {
    organization: "CDC",
    title: "Postpartum Depression",
    url: "https://www.cdc.gov/reproductive-health/depression/index.html",
    evidenceTier: "Hướng dẫn cơ quan y tế",
  },
  cdcPPDTiming: {
    organization: "CDC",
    title: "Timing of Postpartum Depressive Symptoms (Preventing Chronic Disease)",
    url: "https://www.cdc.gov/pcd/issues/2023/23_0107.htm",
    evidenceTier: "Nghiên cứu giám sát cơ quan y tế",
  },
  uspstfDepressionScreening: {
    organization: "USPSTF",
    title: "Depression and Suicide Risk in Adults: Screening",
    url: "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/screening-depression-suicide-risk-adults",
    evidenceTier: "Khuyến cáo lực lượng đặc nhiệm dự phòng Hoa Kỳ",
  },
  uspstfPerinatalPrevention: {
    organization: "USPSTF",
    title: "Perinatal Depression: Preventive Interventions",
    url: "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/perinatal-depression-preventive-interventions",
    evidenceTier: "Khuyến cáo lực lượng đặc nhiệm dự phòng Hoa Kỳ",
  },
  nhsPostpartumPsychosis: {
    organization: "NHS",
    title: "Post-partum psychosis",
    url: "https://www.nhs.uk/mental-health/conditions/post-partum-psychosis/",
    evidenceTier: "Hướng dẫn dịch vụ y tế",
  },
  bmcPsychiatryPsychosisPrevalence: {
    organization: "BMC Psychiatry (peer-reviewed)",
    title: "Systematic review on the incidence of perinatal psychosis",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC5534064/",
    evidenceTier: "Nghiên cứu bình duyệt",
  },
  rcogVTE: {
    organization: "RCOG",
    title: "Diagnosis and treatment of venous thrombosis in pregnancy and after birth",
    url: "https://www.rcog.org.uk/for-the-public/browse-our-patient-information/diagnosis-and-treatment-of-venous-thrombosis-in-pregnancy-and-after-birth/",
    evidenceTier: "Hướng dẫn hiệp hội chuyên khoa (Anh)",
  },
  nhsDVTPregnancy: {
    organization: "NHS",
    title: "Deep vein thrombosis in pregnancy",
    url: "https://www.nhs.uk/pregnancy/related-conditions/complications/deep-vein-thrombosis/",
    evidenceTier: "Hướng dẫn dịch vụ y tế",
  },
  cdcVTEToolkit: {
    organization: "CDC",
    title: "Blood Clots During and After Pregnancy",
    url: "https://www.cdc.gov/blood-clots/index.html",
    evidenceTier: "Hướng dẫn cơ quan y tế",
  },
  cdcHearHer: {
    organization: "CDC",
    title: "Urgent Maternal Warning Signs and Symptoms (Hear Her)",
    url: "https://www.cdc.gov/hearher/maternal-warning-signs/index.html",
    evidenceTier: "Chiến dịch y tế cộng đồng cơ quan y tế",
  },
  cdcSSIBasics: {
    organization: "CDC",
    title: "Surgical Site Infections Basics",
    url: "https://www.cdc.gov/surgical-site-infections/about/index.html",
    evidenceTier: "Hướng dẫn cơ quan y tế",
  },
  merckEndometritis: {
    organization: "Merck Manual Professional Edition",
    title: "Postpartum Endometritis",
    url: "https://www.merckmanuals.com/professional/gynecology-and-obstetrics/postpartum-care-and-associated-disorders/postpartum-endometritis",
    evidenceTier: "Tài liệu tham khảo lâm sàng",
  },
  whoMaternalSepsis: {
    organization: "WHO",
    title: "Maternal sepsis can kill",
    url: "https://www.who.int/health-topics/maternal-health/maternal-sepsis-can-kill",
    evidenceTier: "Hướng dẫn WHO",
  },
  pmcSepsisReview: {
    organization: "Peer-reviewed (PMC)",
    title: "Sepsis and Septic Shock During Pregnancy and Postpartum",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC12270757/",
    evidenceTier: "Nghiên cứu bình duyệt",
  },
  cdcInfectionDeaths: {
    organization: "CDC",
    title: "Pregnancy-Related Deaths Due to Infection: Pregnancy Mortality Surveillance System, 2012–2019",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC12697529/",
    evidenceTier: "Nghiên cứu giám sát cơ quan y tế",
  },
  frontiersSleepMaturation: {
    organization: "Frontiers in Neuroscience (bình duyệt)",
    title: "Scoping review on infant sleep maturation (Gilchrist et al. 2025)",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC12075199/",
    evidenceTier: "Nghiên cứu bình duyệt",
  },
  whoSleepGuideline: {
    organization: "WHO",
    title: "Guidelines on Physical Activity, Sedentary Behaviour and Sleep for Children under 5 years of age",
    url: "https://www.who.int/publications/i/item/9789241550536",
    evidenceTier: "Hướng dẫn WHO",
  },
  cdcShortSleepMMWR: {
    organization: "CDC",
    title: "MMWR 70(38): Short Sleep Duration Among Infants",
    url: "https://www.cdc.gov/mmwr/volumes/70/wr/mm7038a1.htm",
    evidenceTier: "Nghiên cứu giám sát cơ quan y tế",
  },
  aapSleepingThroughNight: {
    organization: "HealthyChildren.org (AAP)",
    title: "Sleeping Through the Night",
    url: "https://www.healthychildren.org/English/ages-stages/baby/sleep/Pages/Sleeping-Through-the-Night.aspx",
    evidenceTier: "Hướng dẫn hiệp hội chuyên khoa",
  },
  pennestriSleepStudy: {
    organization: "Pediatrics (bình duyệt)",
    title: "Uninterrupted Infant Sleep, Development, and Maternal Mood (Pennestri et al. 2018)",
    url: "https://publications.aap.org/pediatrics/article-abstract/142/6/e20174330/37494/Uninterrupted-Infant-Sleep-Development-and",
    evidenceTier: "Nghiên cứu bình duyệt",
  },
  gradisarSleepTraining: {
    organization: "Pediatrics (bình duyệt)",
    title: "Behavioral Interventions for Infant Sleep Problems: A Randomized Controlled Trial (Gradisar et al. 2016)",
    url: "https://publications.aap.org/pediatrics/article/137/6/e20151486/52401/Behavioral-Interventions-for-Infant-Sleep-Problems",
    evidenceTier: "Thử nghiệm ngẫu nhiên có đối chứng, bình duyệt",
  },
  aafpSleepTraining: {
    organization: "American Family Physician (AAFP)",
    title: "Getting an Infant to Sleep: Graduated Extinction and Sleep Fading Are Effective",
    url: "https://www.aafp.org/afp/2016/1101/p750",
    evidenceTier: "Tài liệu bình duyệt chuyên khoa",
  },
  aaoVisionDevelopment: {
    organization: "American Academy of Ophthalmology",
    title: "Vision Development: Newborn to 12 Months",
    url: "https://www.aao.org/eye-health/tips-prevention/baby-vision-development-first-year",
    evidenceTier: "Hướng dẫn hiệp hội chuyên khoa",
  },
  aapSocialSmile: {
    organization: "HealthyChildren.org (AAP)",
    title: "When do babies first smile?",
    url: "https://www.healthychildren.org/English/tips-tools/ask-the-pediatrician/Pages/When-do-babies-first-smile.aspx",
    evidenceTier: "Hướng dẫn hiệp hội chuyên khoa",
  },
  cdcMilestone2mo: {
    organization: "CDC",
    title: "Milestone Moments Checklist — Your baby at 2 months",
    url: "https://www.cdc.gov/act-early/media/pdfs/2025/05/Eng.-2-months-Milestone-Moments-Checklist-2021-P.pdf",
    evidenceTier: "Công cụ theo dõi phát triển cơ quan y tế",
  },
  cdcMilestone4mo: {
    organization: "CDC",
    title: "Milestone Moments Checklist — Your baby at 4 months",
    url: "https://www.cdc.gov/act-early/media/pdfs/2025/05/Eng.-4-months-Milestone-Moments-Checklist-2021-P.pdf",
    evidenceTier: "Công cụ theo dõi phát triển cơ quan y tế",
  },
  cdcMilestone6mo: {
    organization: "CDC",
    title: "Milestones by 6 Months",
    url: "https://www.cdc.gov/act-early/milestones/6-months.html",
    evidenceTier: "Công cụ theo dõi phát triển cơ quan y tế",
  },
  cdcMilestone9mo: {
    organization: "CDC",
    title: "Milestones by 9 Months",
    url: "https://www.cdc.gov/act-early/milestones/9-months.html",
    evidenceTier: "Công cụ theo dõi phát triển cơ quan y tế",
  },
  nhsSeparationAnxiety: {
    organization: "NHS",
    title: "Separation anxiety",
    url: "https://www.nhs.uk/baby/babys-development/behaviour/separation-anxiety/",
    evidenceTier: "Hướng dẫn dịch vụ y tế",
  },
  aapTummyTime: {
    organization: "HealthyChildren.org (AAP)",
    title: "Back to Sleep, Tummy to Play",
    url: "https://www.healthychildren.org/English/ages-stages/baby/sleep/Pages/back-to-sleep-tummy-to-play.aspx",
    evidenceTier: "Hướng dẫn hiệp hội chuyên khoa",
  },
  aapMotor4to7: {
    organization: "HealthyChildren.org (AAP)",
    title: "Movement Milestones: Babies 4 to 7 Months",
    url: "https://www.healthychildren.org/English/ages-stages/baby/Pages/Movement-4-to-7-Months.aspx",
    evidenceTier: "Hướng dẫn hiệp hội chuyên khoa",
  },
  aapMotorBirthTo3: {
    organization: "HealthyChildren.org (AAP)",
    title: "Movement Milestones: Birth to 3 Months",
    url: "https://www.healthychildren.org/English/ages-stages/baby/Pages/Movement-Birth-to-Three-Months.aspx",
    evidenceTier: "Hướng dẫn hiệp hội chuyên khoa",
  },
  cdcGrowthChartRec: {
    organization: "CDC",
    title: "Growth Chart Recommendations",
    url: "https://www.cdc.gov/growth-chart-training/hcp/overview/recommended.html",
    evidenceTier: "Hướng dẫn cơ quan y tế",
  },
  cdcWHOUsing: {
    organization: "CDC",
    title: "Using WHO Growth Standard Charts",
    url: "https://www.cdc.gov/growth-chart-training/hcp/using-growth-charts/who-using.html",
    evidenceTier: "Hướng dẫn cơ quan y tế",
  },
  aapGrowthPercentiles: {
    organization: "HealthyChildren.org (AAP)",
    title: "Understanding Growth Charts: A Parent's Guide to Percentiles & Z-Scores",
    url: "https://www.healthychildren.org/English/health-issues/conditions/Glands-Growth-Disorders/Pages/growth-charts-by-the-numbers.aspx",
    evidenceTier: "Hướng dẫn hiệp hội chuyên khoa",
  },
  cdcBreastfeedingGrowth: {
    organization: "CDC",
    title: "Breastfeeding and Infant Growth Standards",
    url: "https://www.cdc.gov/growth-chart-training/hcp/using-growth-charts/who-breastfeeding.html",
    evidenceTier: "Hướng dẫn cơ quan y tế",
  },
  moh845: {
    organization: "Bộ Y tế Việt Nam",
    title: "Quyết định 845/QĐ-BYT — Lịch tiêm các vắc xin phòng lao, viêm gan B, bạch hầu, ho gà, uốn ván, bại liệt, sởi, Hib",
    url: "https://luatvietnam.vn/y-te/quyet-dinh-845-qd-byt-bo-y-te-52528-d1.html",
    evidenceTier: "Văn bản pháp quy Bộ Y tế (qua trang tổng hợp luật)",
  },
  cdcPinkBookVaccineAdmin: {
    organization: "CDC",
    title: "Pink Book — Chapter 6: Vaccine Administration",
    url: "https://www.cdc.gov/pinkbook/hcp/table-of-contents/chapter-6-vaccine-administration.html",
    evidenceTier: "Hướng dẫn cơ quan y tế",
  },
  cdcBeforeDuringAfterShots: {
    organization: "CDC",
    title: "Before, During, and After Shots",
    url: "https://www.cdc.gov/vaccines-children/before-during-after-shots/index.html",
    evidenceTier: "Hướng dẫn cơ quan y tế",
  },
  cdcCatchUpSchedule: {
    organization: "CDC",
    title: "Catch-up Immunization Schedule for Children and Adolescents",
    url: "https://www.cdc.gov/vaccines/hcp/imz-schedules/child-adolescent-catch-up.html",
    evidenceTier: "Hướng dẫn cơ quan y tế",
  },
  aafpGERD: {
    organization: "American Family Physician (AAFP)",
    title: "Diagnosis and Treatment of Gastroesophageal Reflux in Infants and Children",
    url: "https://www.aafp.org/pubs/afp/issues/2015/1015/p705.html",
    evidenceTier: "Tài liệu bình duyệt chuyên khoa",
  },
  aapSpitUp: {
    organization: "HealthyChildren.org (AAP)",
    title: "Why Babies Spit Up",
    url: "https://www.healthychildren.org/English/ages-stages/baby/feeding-nutrition/Pages/Why-Babies-Spit-Up.aspx",
    evidenceTier: "Hướng dẫn hiệp hội chuyên khoa",
  },
  naspghanGERD: {
    organization: "NASPGHAN/ESPGHAN",
    title: "Pediatric GERD Clinical Practice Guidelines Summary (2018)",
    url: "https://www.naspghan.org/files/documents/pdfs/position-papers/PedGERD%20Summary%20FINAL.pdf",
    evidenceTier: "Hướng dẫn lâm sàng hiệp hội chuyên khoa",
  },
  aapBLW: {
    organization: "HealthyChildren.org (AAP)",
    title: "Baby-Led Weaning: Is It Safe?",
    url: "https://www.healthychildren.org/English/ages-stages/baby/feeding-nutrition/Pages/baby-led-weaning-is-it-safe.aspx",
    evidenceTier: "Hướng dẫn hiệp hội chuyên khoa",
  },
  dauriaBLWReview: {
    organization: "Italian Journal of Pediatrics (bình duyệt)",
    title: "Baby-led weaning: what a systematic review of the literature adds on",
    url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5934812/",
    evidenceTier: "Tổng quan hệ thống bình duyệt",
  },
  nutrientsBLWReview: {
    organization: "Nutrients (bình duyệt)",
    title: "Current Evidence on Nutrient Intakes and Infant Growth: BLW vs Conventional Weaning",
    url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC11397666/",
    evidenceTier: "Tổng quan bình duyệt",
  },
  blissTrial: {
    organization: "BMC Pediatrics (bình duyệt)",
    title: "Development and pilot testing of Baby-Led Introduction to SolidS (BLISS)",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC4549838/",
    evidenceTier: "Thử nghiệm thí điểm bình duyệt",
  },
  nhsChokingGagging: {
    organization: "NHS",
    title: "Choking and gagging on food",
    url: "https://www.nhs.uk/best-start-in-life/baby/weaning/safe-weaning/choking-and-gagging-on-food/",
    evidenceTier: "Hướng dẫn dịch vụ y tế",
  },
  cdcWaterDrinks: {
    organization: "CDC",
    title: "Foods and Drinks to Encourage",
    url: "https://www.cdc.gov/infant-toddler-nutrition/foods-and-drinks/foods-and-drinks-to-encourage.html",
    evidenceTier: "Hướng dẫn cơ quan y tế",
  },
  northstoneLumpySolids: {
    organization: "Journal of Human Nutrition and Dietetics (bình duyệt)",
    title: "The effect of age of introduction to lumpy solids on foods eaten and reported feeding difficulties",
    url: "https://pubmed.ncbi.nlm.nih.gov/11301932/",
    evidenceTier: "Nghiên cứu đoàn hệ bình duyệt",
  },
  espghanComplementary: {
    organization: "ESPGHAN Committee on Nutrition",
    title: "Complementary Feeding: A Position Paper (2017)",
    url: "https://journals.lww.com/jpgn/Fulltext/2017/01000/Complementary_Feeding___A_Position_Paper_by_the.21.aspx",
    evidenceTier: "Hướng dẫn hiệp hội chuyên khoa",
  },
  nhs7to9months: {
    organization: "NHS",
    title: "7 to 9 months — Feeding your baby",
    url: "https://www.nhs.uk/best-start-in-life/baby/weaning/what-to-feed-your-baby/7-to-9-months/",
    evidenceTier: "Hướng dẫn dịch vụ y tế",
  },
  zublerMilestones2022: {
    organization: "Pediatrics (bình duyệt, nhóm chuyên gia CDC/AAP)",
    title: "Evidence-Informed Milestones for Developmental Surveillance Tools",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC9680195",
    evidenceTier: "Nghiên cứu phương pháp luận bình duyệt",
  },
  aapMotor8to12: {
    organization: "HealthyChildren.org (AAP)",
    title: "Movement Milestones in Babies 8 to 12 Months Old",
    url: "https://www.healthychildren.org/English/ages-stages/baby/Pages/Movement-8-to-12-Months.aspx",
    evidenceTier: "Hướng dẫn hiệp hội chuyên khoa",
  },
  cdcMilestone15mo: {
    organization: "CDC",
    title: "Milestones by 15 Months",
    url: "https://www.cdc.gov/act-early/milestones/15-months.html",
    evidenceTier: "Công cụ theo dõi phát triển cơ quan y tế",
  },
  cdcMilestone18mo: {
    organization: "CDC",
    title: "Milestones by 18 Months",
    url: "https://www.cdc.gov/act-early/milestones/18-months.html",
    evidenceTier: "Công cụ theo dõi phát triển cơ quan y tế",
  },
  aapPhysicalDevTrack: {
    organization: "HealthyChildren.org (AAP)",
    title: "Is Your Baby's Physical Development on Track?",
    url: "https://www.healthychildren.org/English/ages-stages/baby/Pages/Is-Your-Babys-Physical-Development-on-Track.aspx",
    evidenceTier: "Hướng dẫn hiệp hội chuyên khoa",
  },
  aapBabyWalkers: {
    organization: "HealthyChildren.org (AAP)",
    title: "Baby Walkers: A Dangerous Choice",
    url: "https://www.healthychildren.org/English/safety-prevention/at-home/Pages/baby-walkers-a-dangerous-choice.aspx",
    evidenceTier: "Hướng dẫn an toàn hiệp hội chuyên khoa",
  },
  aapEmotionalSocial8to12: {
    organization: "HealthyChildren.org (AAP)",
    title: "Emotional and Social Development: 8 to 12 Months",
    url: "https://www.healthychildren.org/English/ages-stages/baby/Pages/Emotional-and-Social-Development-8-12-Months.aspx",
    evidenceTier: "Hướng dẫn hiệp hội chuyên khoa",
  },
  aapTemperament: {
    organization: "HealthyChildren.org (AAP)",
    title: "Your Baby's Temperament",
    url: "https://www.healthychildren.org/English/ages-stages/baby/Pages/Babys-Temperament.aspx",
    evidenceTier: "Hướng dẫn hiệp hội chuyên khoa",
  },
  cdcAutismSigns: {
    organization: "CDC",
    title: "Signs and Symptoms of Autism Spectrum Disorder",
    url: "https://www.cdc.gov/autism/signs-symptoms/index.html",
    evidenceTier: "Hướng dẫn cơ quan y tế",
  },
  nidcdMilestones: {
    organization: "NIDCD (NIH)",
    title: "Speech and Language Developmental Milestones",
    url: "https://www.nidcd.nih.gov/health/speech-and-language",
    evidenceTier: "Hướng dẫn cơ quan y tế",
  },
  aapBilingual: {
    organization: "HealthyChildren.org (AAP/ASHA)",
    title: "Young Children Learning Multiple Languages: Parent FAQs",
    url: "https://www.healthychildren.org/English/ages-stages/gradeschool/school/Pages/7-Myths-Facts-Bilingual-Children-Learning-Language.aspx",
    evidenceTier: "Hướng dẫn hiệp hội chuyên khoa",
  },
  aapLanguageDelay: {
    organization: "HealthyChildren.org (AAP)",
    title: "Language Delays in Toddlers: Information for Parents",
    url: "https://www.healthychildren.org/English/ages-stages/toddler/Pages/language-delay.aspx",
    evidenceTier: "Hướng dẫn hiệp hội chuyên khoa",
  },
  aapBreastfeedingSolids: {
    organization: "HealthyChildren.org (AAP)",
    title: "Breastfeeding & Solid Foods: Working Together",
    url: "https://www.healthychildren.org/English/ages-stages/baby/breastfeeding/Pages/Working-Together-Breastfeeding-and-Solid-Foods.aspx",
    evidenceTier: "Hướng dẫn hiệp hội chuyên khoa",
  },
  aapWhyFormulaNotCowMilk: {
    organization: "HealthyChildren.org (AAP)",
    title: "Why Do Infants Need Baby Formula Instead of Cow's Milk?",
    url: "https://www.healthychildren.org/English/ages-stages/baby/formula-feeding/Pages/Why-Formula-Instead-of-Cows-Milk.aspx",
    evidenceTier: "Hướng dẫn hiệp hội chuyên khoa",
  },
  cdcCowsMilk: {
    organization: "CDC",
    title: "Cow's Milk and Milk Alternatives",
    url: "https://www.cdc.gov/infant-toddler-nutrition/foods-and-drinks/cows-milk-and-milk-alternatives.html",
    evidenceTier: "Hướng dẫn cơ quan y tế",
  },
  nhsDrinksAndCups: {
    organization: "NHS",
    title: "Drinks and cups for babies and young children",
    url: "https://www.nhs.uk/baby/weaning-and-feeding/drinks-and-cups-for-babies-and-young-children/",
    evidenceTier: "Hướng dẫn dịch vụ y tế",
  },
  aapBottleToCup: {
    organization: "HealthyChildren.org (AAP)",
    title: "From Bottle to Cup: Helping Your Child Make a Healthy Transition",
    url: "https://www.healthychildren.org/English/ages-stages/baby/feeding-nutrition/Pages/Discontinuing-the-Bottle.aspx",
    evidenceTier: "Hướng dẫn hiệp hội chuyên khoa",
  },
  aapFruitJuice: {
    organization: "HealthyChildren.org (AAP)",
    title: "Where We Stand: Fruit Juice for Children",
    url: "https://www.healthychildren.org/English/healthy-living/nutrition/Pages/Where-We-Stand-Fruit-Juice.aspx",
    evidenceTier: "Hướng dẫn hiệp hội chuyên khoa",
  },
  massignanTeethingMeta: {
    organization: "Pediatrics (bình duyệt)",
    title: "Signs and Symptoms of Primary Tooth Eruption: A Meta-analysis",
    url: "https://pubmed.ncbi.nlm.nih.gov/26908659/",
    evidenceTier: "Tổng quan phân tích gộp bình duyệt",
  },
  aapBreastfeedingTeeth: {
    organization: "HealthyChildren.org (AAP)",
    title: "Breastfeeding After Your Baby Gets Teeth",
    url: "https://www.healthychildren.org/English/ages-stages/baby/breastfeeding/Pages/When-Your-Baby-Gets-Teeth.aspx",
    evidenceTier: "Hướng dẫn hiệp hội chuyên khoa",
  },
  cdcMilestone2yr: {
    organization: "CDC",
    title: "Milestones by 2 Years",
    url: "https://www.cdc.gov/act-early/milestones/2-years.html",
    evidenceTier: "Công cụ theo dõi phát triển cơ quan y tế",
  },
  cdcMilestone30mo: {
    organization: "CDC",
    title: "Milestones by 30 Months",
    url: "https://www.cdc.gov/act-early/milestones/30-months.html",
    evidenceTier: "Công cụ theo dõi phát triển cơ quan y tế",
  },
  cdcMilestone3yr: {
    organization: "CDC",
    title: "Milestones by 3 Years",
    url: "https://www.cdc.gov/act-early/milestones/3-years.html",
    evidenceTier: "Công cụ theo dõi phát triển cơ quan y tế",
  },
  cdcMilestoneKeyPoints: {
    organization: "CDC",
    title: "Key Points about CDC's Developmental Milestone Checklists",
    url: "https://www.cdc.gov/act-early/milestones/key-points.html",
    evidenceTier: "Hướng dẫn cơ quan y tế",
  },
  aapHandFinger1yo: {
    organization: "HealthyChildren.org (AAP)",
    title: "Hand and Finger Skills: 1 Year Olds",
    url: "https://www.healthychildren.org/English/ages-stages/toddler/Pages/Hand-and-Finger-Skills-1-Year-Olds.aspx",
    evidenceTier: "Hướng dẫn hiệp hội chuyên khoa",
  },
  aafpToiletTraining2019: {
    organization: "American Family Physician (AAFP)",
    title: "Toilet Training: Common Questions and Answers",
    url: "https://www.aafp.org/pubs/afp/issues/2019/1015/p468.html",
    evidenceTier: "Tài liệu bình duyệt chuyên khoa",
  },
  aapPottyTraining: {
    organization: "HealthyChildren.org (AAP)",
    title: "Potty Training",
    url: "https://www.healthychildren.org/English/ages-stages/toddler/toilet-training/Pages/default.aspx",
    evidenceTier: "Hướng dẫn hiệp hội chuyên khoa",
  },
  nhsPottyTraining: {
    organization: "NHS",
    title: "Potty training your child",
    url: "https://www.nhs.uk/best-start-in-life/toddler/potty-training-your-child/",
    evidenceTier: "Hướng dẫn dịch vụ y tế",
  },
  aapBedwetting: {
    organization: "HealthyChildren.org (AAP)",
    title: "Bedwetting: 3 Common Reasons & What Families Can Do",
    url: "https://www.healthychildren.org/English/ages-stages/toddler/toilet-training/Pages/Bedwetting.aspx",
    evidenceTier: "Hướng dẫn hiệp hội chuyên khoa",
  },
  nhsBedwetting: {
    organization: "NHS",
    title: "Bedwetting in children",
    url: "https://www.nhs.uk/symptoms/bedwetting/",
    evidenceTier: "Hướng dẫn dịch vụ y tế",
  },
  aapPottyRegression: {
    organization: "HealthyChildren.org (AAP)",
    title: "Potty Training Regression",
    url: "https://www.healthychildren.org/English/ages-stages/toddler/toilet-training/Pages/Regression.aspx",
    evidenceTier: "Hướng dẫn hiệp hội chuyên khoa",
  },
  blumToiletTrainingStudy: {
    organization: "Pediatrics (bình duyệt)",
    title: "Relationship between age at initiation of toilet training and duration of training",
    url: "https://pubmed.ncbi.nlm.nih.gov/12671117/",
    evidenceTier: "Nghiên cứu đoàn hệ tiến cứu bình duyệt",
  },
  aapdPeriodicity: {
    organization: "AAPD (Hiệp hội Nha khoa Nhi khoa Hoa Kỳ)",
    title: "Periodicity of Examination, Preventive Dental Services, Anticipatory Guidance/Counseling, and Oral Treatment for Infants, Children, and Adolescents",
    url: "https://www.aapd.org/globalassets/media/policies_guidelines/bp_periodicity.pdf",
    evidenceTier: "Hướng dẫn thực hành tốt nhất hiệp hội chuyên khoa",
  },
  aapFirstTooth: {
    organization: "HealthyChildren.org (AAP)",
    title: "Baby's First Tooth: 7 Facts Parents Should Know",
    url: "https://www.healthychildren.org/English/ages-stages/baby/teething-tooth-care/Pages/Babys-First-Tooth-Facts-Parents-Should-Know.aspx",
    evidenceTier: "Hướng dẫn hiệp hội chuyên khoa",
  },
  aapdFluorideTherapy: {
    organization: "AAPD",
    title: "Fluoride Therapy",
    url: "https://www.aapd.org/media/Policies_Guidelines/BP_FluorideTherapy.pdf",
    evidenceTier: "Hướng dẫn thực hành tốt nhất hiệp hội chuyên khoa",
  },
  cdcFluoride: {
    organization: "CDC",
    title: "About Fluoride",
    url: "https://www.cdc.gov/oral-health/prevention/about-fluoride.html",
    evidenceTier: "Hướng dẫn cơ quan y tế",
  },
  aapFluorideFAQ: {
    organization: "HealthyChildren.org (AAP)",
    title: "FAQ: Fluoride and Children",
    url: "https://www.healthychildren.org/English/healthy-living/oral-health/Pages/FAQ-Fluoride-and-Children.aspx",
    evidenceTier: "Hướng dẫn hiệp hội chuyên khoa",
  },
  aapToothbrushing: {
    organization: "HealthyChildren.org (AAP)",
    title: "Toothbrushing Tips for Young Children",
    url: "https://www.healthychildren.org/English/healthy-living/oral-health/Pages/Toothbrushing-Tips-for-Young-Children.aspx",
    evidenceTier: "Hướng dẫn hiệp hội chuyên khoa",
  },
  aapdECCDefinition: {
    organization: "AAPD",
    title: "Definition of Early Childhood Caries (ECC)",
    url: "https://www.aapd.org/assets/1/7/d_ecc.pdf",
    evidenceTier: "Định nghĩa chính sách hiệp hội chuyên khoa",
  },
  cdcOralHealthSurveillance: {
    organization: "CDC",
    title: "2024 Oral Health Surveillance Report — Selected Findings",
    url: "https://www.cdc.gov/oral-health/php/2024-oral-health-surveillance-report/selected-findings.html",
    evidenceTier: "Nghiên cứu giám sát cơ quan y tế",
  },
  uspstfFluorideVarnish: {
    organization: "USPSTF",
    title: "Prevention of Dental Caries in Children Younger Than Age 5 Years: Screening and Interventions",
    url: "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/prevention-of-dental-caries-in-children-younger-than-age-5-years-screening-and-interventions1",
    evidenceTier: "Khuyến cáo lực lượng đặc nhiệm dự phòng Hoa Kỳ",
  },
  aapdPacifierPolicy: {
    organization: "AAPD",
    title: "Policy on Pacifiers",
    url: "https://www.aapd.org/globalassets/media/policies_guidelines/p_on-pacifiers.pdf",
    evidenceTier: "Chính sách hiệp hội chuyên khoa",
  },
  aapDigitalEcosystems2026: {
    organization: "AAP",
    title: "Digital Ecosystems, Children, and Adolescents (Policy Statement)",
    url: "https://publications.aap.org/pediatrics/article/157/2/e2025075320/206129/Digital-Ecosystems-Children-and-Adolescents-Policy",
    evidenceTier: "Tuyên bố chính sách hiệp hội chuyên khoa",
  },
  aapScreenTimeQA: {
    organization: "AAP",
    title: "Screen Time Limits for Young Children (Q&A Portal)",
    url: "https://www.aap.org/en/patient-care/media-and-children/center-of-excellence-on-social-media-and-youth-mental-health/qa-portal/qa-portal-library/qa-portal-library-questions/screen-time-limits-for-young-children/",
    evidenceTier: "Hướng dẫn hiệp hội chuyên khoa",
  },
  aapCorporalPunishment: {
    organization: "HealthyChildren.org (AAP)",
    title: "American Academy of Pediatrics Updates Policy on Corporal Punishment",
    url: "https://www.healthychildren.org/English/news/Pages/AAP-Updates-Corporal-Punishment-Policy.aspx",
    evidenceTier: "Chính sách hiệp hội chuyên khoa",
  },
  aapTimeOut: {
    organization: "HealthyChildren.org (AAP)",
    title: "How to Give a Time-Out",
    url: "https://www.healthychildren.org/English/family-life/family-dynamics/communication-discipline/Pages/Time-Outs-101.aspx",
    evidenceTier: "Hướng dẫn hiệp hội chuyên khoa",
  },
  aapDisciplineFramework: {
    organization: "HealthyChildren.org (AAP)",
    title: "What's the Best Way to Discipline My Child?",
    url: "https://www.healthychildren.org/English/family-life/family-dynamics/communication-discipline/Pages/Disciplining-Your-Child.aspx",
    evidenceTier: "Hướng dẫn hiệp hội chuyên khoa",
  },
  aapAutismScreening: {
    organization: "HealthyChildren.org (AAP)",
    title: "How Pediatricians Screen for Autism",
    url: "https://www.healthychildren.org/English/health-issues/conditions/Autism/Pages/How-Doctors-Screen-for-Autism.aspx",
    evidenceTier: "Hướng dẫn hiệp hội chuyên khoa",
  },
  uspstfAutismScreening: {
    organization: "USPSTF",
    title: "Autism Spectrum Disorder in Young Children: Screening",
    url: "https://www.uspreventiveservicestaskforce.org/uspstf/document/RecommendationStatementFinal/autism-spectrum-disorder-in-young-children-screening",
    evidenceTier: "Khuyến cáo lực lượng đặc nhiệm dự phòng Hoa Kỳ",
  },
  fdaEpaFishAdvice: {
    organization: "FDA/EPA (Hoa Kỳ)",
    title: "Advice about Eating Fish",
    url: "https://www.fda.gov/food/consumers/advice-about-eating-fish",
    evidenceTier: "Hướng dẫn liên bang Hoa Kỳ",
  },
  nhsFoodsToAvoidPregnancy: {
    organization: "NHS (Anh)",
    title: "Foods to avoid in pregnancy",
    url: "https://www.nhs.uk/pregnancy/keeping-well/foods-to-avoid/",
    evidenceTier: "Hướng dẫn y tế quốc gia (NHS)",
  },
  cochraneCaffeinePregnancy: {
    organization: "Cochrane",
    title: "Caffeine avoidance for preventing fetal growth restriction and other adverse pregnancy outcomes",
    url: "https://www.cochranelibrary.com/cdsr/doi/10.1002/14651858.CD006965.pub4/full",
    evidenceTier: "Tổng quan hệ thống Cochrane",
  },
  cdcIodineBreastfeeding: {
    organization: "CDC",
    title: "Iodine and Breastfeeding",
    url: "https://www.cdc.gov/breastfeeding-special-circumstances/hcp/diet-micronutrients/iodine.html",
    evidenceTier: "Hướng dẫn liên bang Hoa Kỳ",
  },
  ataIodinePregnancy: {
    organization: "American Thyroid Association",
    title: "Iodine Supplementation for Pregnancy and Lactation",
    url: "https://www.thyroid.org/wp-content/uploads/2012/05/ATAIodineRec.pdf",
    evidenceTier: "Hướng dẫn hiệp hội chuyên khoa",
  },
  ignVietnamIodine: {
    organization: "Iodine Global Network",
    title: "An opportunity for progress: iodine status, salt iodization and regional disparities in Vietnam",
    url: "https://ign.org/app/uploads/2025/08/An-opportunity-for-progress-iodine-status-salt-iodization-and-regional-disparities-in-Vietnam.pdf",
    evidenceTier: "Báo cáo tổ chức chuyên môn quốc tế",
  },
  nationalAcademiesCholineB12: {
    organization: "National Academies (Hoa Kỳ)",
    title: "Dietary Reference Intakes for Folate, Vitamin B12, Choline and related nutrients",
    url: "https://www.nationalacademies.org/read/6015/chapter/14",
    evidenceTier: "Báo cáo cơ quan khoa học quốc gia Hoa Kỳ",
  },
  cholineNutrientsReview2019: {
    organization: "Nutrients (tạp chí bình duyệt)",
    title: "Choline: Exploring the Growing Science on Its Benefits for Moms and Babies",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC6722688/",
    evidenceTier: "Bài tổng quan bình duyệt",
  },
  cdcVitaminB12Breastfeeding: {
    organization: "CDC",
    title: "Vitamin B12 and Breastfeeding",
    url: "https://www.cdc.gov/breastfeeding-special-circumstances/hcp/diet-micronutrients/vitamin-b12.html",
    evidenceTier: "Hướng dẫn liên bang Hoa Kỳ",
  },
  plosOneVietnamMicronutrient2012: {
    organization: "PLOS ONE (tạp chí bình duyệt)",
    title: "Micronutrient Deficits Are Still Public Health Issues among Women and Young Children in Vietnam",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC3328495/",
    evidenceTier: "Nghiên cứu bình duyệt (khảo sát quốc gia)",
  },
  niceNg247MaternalNutrition: {
    organization: "NICE (Anh)",
    title: "Maternal and child nutrition: nutrition and weight management in pregnancy, and nutrition in children up to 5 years (NG247)",
    url: "https://www.nice.org.uk/guidance/ng247",
    evidenceTier: "Hướng dẫn lâm sàng quốc gia (NICE)",
  },
  motherToBabyHerbalProducts: {
    organization: "MotherToBaby (OTIS)",
    title: "Herbal Products",
    url: "https://mothertobaby.org/fact-sheets/herbal-products-pregnancy/",
    evidenceTier: "Tờ thông tin dịch vụ thông tin quái thai học (liên kết NIH)",
  },
  motherToBabyGinger: {
    organization: "MotherToBaby (OTIS)",
    title: "Ginger",
    url: "https://mothertobaby.org/fact-sheets/ginger-pregnancy/",
    evidenceTier: "Tờ thông tin dịch vụ thông tin quái thai học (liên kết NIH)",
  },
  motherToBabyEchinacea: {
    organization: "MotherToBaby (OTIS)",
    title: "Echinacea",
    url: "https://mothertobaby.org/fact-sheets/echinacea-preparations-pregnancy/",
    evidenceTier: "Tờ thông tin dịch vụ thông tin quái thai học (liên kết NIH)",
  },
  nccihChamomile: {
    organization: "NCCIH (NIH)",
    title: "Chamomile",
    url: "https://www.nccih.nih.gov/health/chamomile",
    evidenceTier: "Trung tâm y học bổ sung/tích hợp quốc gia Hoa Kỳ",
  },
  raspberryLeafReview: {
    organization: "PMC (tạp chí bình duyệt)",
    title: "Biophysical effects, safety and efficacy of raspberry leaf use in pregnancy: a systematic integrative review",
    url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7871383/",
    evidenceTier: "Tổng quan hệ thống",
  },
  cochraneGalactagogues2020: {
    organization: "Cochrane",
    title: "Oral galactagogues (natural therapies or drugs) for increasing breast milk production in mothers of non-hospitalised term infants",
    url: "https://www.cochranelibrary.com/cdsr/doi/10.1002/14651858.CD011505.pub2/references",
    evidenceTier: "Tổng quan hệ thống Cochrane",
  },
  fdaHighIntensitySweeteners: {
    organization: "FDA (Hoa Kỳ)",
    title: "High-Intensity Sweeteners",
    url: "https://www.fda.gov/food/food-additives-petitions/high-intensity-sweeteners",
    evidenceTier: "Hướng dẫn liên bang Hoa Kỳ",
  },
  whoNonSugarSweeteners2023: {
    organization: "WHO",
    title: "Use of non-sugar sweeteners: WHO guideline",
    url: "https://www.who.int/news/item/15-05-2023-who-advises-not-to-use-non-sugar-sweeteners-for-weight-control-in-a-new-who-guideline",
    evidenceTier: "Hướng dẫn của Tổ chức Y tế Thế giới",
  },
  sweetenersInMilkNutrients2022: {
    organization: "Nutrients (tạp chí bình duyệt)",
    title: "Artificial Sweeteners in Breast Milk: A Clinical Investigation with a Kinetic Perspective",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC9268461/",
    evidenceTier: "Nghiên cứu lâm sàng bình duyệt",
  },
  rauNgotEthnopharmacolReview2020: {
    organization: "Journal of Ethnopharmacology (tạp chí bình duyệt)",
    title: "Sauropus androgynus L. Merr. — A phytochemical, pharmacological and toxicological review",
    url: "https://pubmed.ncbi.nlm.nih.gov/32205260/",
    evidenceTier: "Tổng quan bình duyệt",
  },
  papayaRatModel2002: {
    organization: "British Journal of Nutrition (tạp chí bình duyệt)",
    title: "Papaya (Carica papaya) consumption is unsafe in pregnancy: fact or fable? Scientific evaluation of a common belief using a rat model",
    url: "https://pubmed.ncbi.nlm.nih.gov/12144723/",
    evidenceTier: "Nghiên cứu thực nghiệm (mô hình động vật)",
  },
  pineappleNhsMyth: {
    organization: "NHS (Anh)",
    title: "Foods to avoid in pregnancy (dứa và bromelain)",
    url: "https://www.nhs.uk/pregnancy/keeping-well/foods-to-avoid/",
    evidenceTier: "Hướng dẫn y tế quốc gia (NHS)",
  },
  coconutWaterReview2024: {
    organization: "Pakistan Journal of Medical Sciences (tạp chí bình duyệt)",
    title: "Is coconut water truly a miracle drink in pregnancy or a myth?",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC11395342/",
    evidenceTier: "Bài tổng quan bình duyệt",
  },
  acogSeafoodAdvisory2017: {
    organization: "ACOG",
    title: "Update on Seafood Consumption During Pregnancy (Practice Advisory)",
    url: "https://www.acog.org/clinical/clinical-guidance/practice-advisory/articles/2017/01/update-on-seafood-consumption-during-pregnancy",
    evidenceTier: "Hướng dẫn hiệp hội chuyên khoa (ACOG)",
  },
  iacovouFodmapColicRct2018: {
    organization: "Alimentary Pharmacology & Therapeutics (tạp chí bình duyệt)",
    title: "Reducing the intake of dietary FODMAPs of breastfeeding mothers is associated with a greater improvement of infantile colic symptoms",
    url: "https://pubmed.ncbi.nlm.nih.gov/30306603/",
    evidenceTier: "Thử nghiệm ngẫu nhiên có đối chứng",
  },
  abmAllergicProctocolitis2011: {
    organization: "Academy of Breastfeeding Medicine",
    title: "ABM Clinical Protocol #24: Allergic Proctocolitis in the Exclusively Breastfed Infant",
    url: "https://pubmed.ncbi.nlm.nih.gov/22050274/",
    evidenceTier: "Hướng dẫn hiệp hội chuyên khoa",
  },
  allergicProctocolitisChildren2025: {
    organization: "Children (Basel) (tạp chí bình duyệt)",
    title: "The Immunological Mechanisms Involved in the Pathophysiology of Allergic Proctocolitis",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC12191760/",
    evidenceTier: "Bài tổng quan bình duyệt",
  },
  nhsBreastfeedingDiet: {
    organization: "NHS (Anh)",
    title: "Breastfeeding and diet",
    url: "https://www.nhs.uk/baby/breastfeeding-and-bottle-feeding/breastfeeding-and-lifestyle/diet/",
    evidenceTier: "Hướng dẫn y tế quốc gia (NHS)",
  },
  niceNg194PostnatalCare: {
    organization: "NICE (Anh)",
    title: "Postnatal care (NG194)",
    url: "https://www.nice.org.uk/guidance/ng194",
    evidenceTier: "Hướng dẫn lâm sàng quốc gia (NICE)",
  },
  laoPdrPostpartumRestriction: {
    organization: "PMC (tạp chí bình duyệt)",
    title: "Postpartum dietary restriction and dietary diversity among women in northern Lao PDR",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC8710103/",
    evidenceTier: "Nghiên cứu bình duyệt",
  },
  cdcChildScheduleNotes: {
    organization: "CDC",
    title: "Child and Adolescent Immunization Schedule — Notes",
    url: "https://www.cdc.gov/vaccines/hcp/imz-schedules/child-adolescent-notes.html",
    evidenceTier: "Hướng dẫn liên bang Hoa Kỳ",
  },
  aapSchedule2026: {
    organization: "AAP (Pediatrics)",
    title: "Recommended Childhood and Adolescent Immunization Schedule, United States, 2026",
    url: "https://publications.aap.org/pediatrics/article/157/3/e2025075754/206175/Recommended-Childhood-and-Adolescent-Immunization",
    evidenceTier: "Hướng dẫn hiệp hội chuyên khoa (AAP)",
  },
  hcdcTcmrSchedule: {
    organization: "Trung tâm Kiểm soát Bệnh tật TP.HCM (HCDC)",
    title: "Lịch tiêm vắc xin trong chương trình Tiêm chủng mở rộng",
    url: "https://hcdc.vn/lich-tiem-vac-xin-trong-chuong-trinh-tiem-chung-mo-rong-6GNqhH.html",
    evidenceTier: "Cơ quan y tế công cộng địa phương (Việt Nam)",
  },
  thongTu52TcmrBatBuoc: {
    organization: "Bộ Y tế Việt Nam (qua LuatVietnam)",
    title: "Thông tư 52/2025/TT-BYT — Danh mục bệnh truyền nhiễm và vắc xin bắt buộc",
    url: "https://luatvietnam.vn/y-te/thong-tu-52-2025-tt-byt-danh-muc-benh-truyen-nhiem-va-vac-xin-bat-buoc-422882-d1.html",
    evidenceTier: "Văn bản pháp quy Bộ Y tế Việt Nam",
  },
  vnvcTcmr024: {
    organization: "VNVC",
    title: "Lịch tiêm chủng cho trẻ 0-24 tháng",
    url: "https://vnvc.vn/lich-tiem-chung-cho-tre-0-24-thang/",
    evidenceTier: "Cơ sở tiêm chủng (đối chiếu lịch TCMR)",
  },
  quyetDinh1575SangLoc: {
    organization: "Bộ Y tế Việt Nam",
    title: "Quyết định 1575/QĐ-BYT — Hướng dẫn khám sàng lọc trước tiêm chủng cho trẻ em",
    url: "https://thuvienphapluat.vn/van-ban/The-thao-Y-te/Quyet-dinh-1575-QD-BYT-2023-Huong-dan-kham-sang-loc-truoc-tiem-chung-tre-em-560859.aspx",
    evidenceTier: "Văn bản pháp quy Bộ Y tế Việt Nam",
  },
  cdcContraindicationsPrecautions: {
    organization: "CDC",
    title: "Contraindications and Precautions (General Best Practice Guidance for Immunization)",
    url: "https://www.cdc.gov/vaccines/hcp/imz-best-practices/contraindications-precautions.html",
    evidenceTier: "Hướng dẫn liên bang Hoa Kỳ",
  },
  cdcFebrileSeizures: {
    organization: "CDC",
    title: "Febrile Seizures and Vaccines",
    url: "https://www.cdc.gov/vaccine-safety/about/febrile-seizures.html",
    evidenceTier: "Hướng dẫn liên bang Hoa Kỳ",
  },
  cdcMmrvSafety: {
    organization: "CDC",
    title: "MMRV Vaccine Safety",
    url: "https://www.cdc.gov/vaccine-safety/vaccines/mmrv.html",
    evidenceTier: "Hướng dẫn liên bang Hoa Kỳ",
  },
  vncdcTheoDoiPhanUng: {
    organization: "Cục Y tế Dự phòng (vncdc.gov.vn)",
    title: "Chuyên gia hướng dẫn theo dõi, phát hiện phản ứng sau tiêm chủng",
    url: "https://vncdc.gov.vn/chuyen-gia-huong-dan-theo-doi-phat-hien-phan-ung-sau-tiem-chung-nd14945.html",
    evidenceTier: "Cơ quan y tế dự phòng Việt Nam",
  },
  vnvcDauHieuNguyHiem: {
    organization: "VNVC",
    title: "5 dấu hiệu nguy hiểm sau tiêm phòng cần cấp cứu ngay",
    url: "https://vnvc.vn/dau-hieu-nguy-hiem-sau-tiem-phong/",
    evidenceTier: "Cơ sở tiêm chủng (đối chiếu hướng dẫn y tế dự phòng)",
  },
  hambidgeDelayedMmrSeizure2014: {
    organization: "Pediatrics (tạp chí bình duyệt)",
    title: "Timely versus delayed early childhood vaccination and seizures",
    url: "https://divisionofresearch.kaiserpermanente.org/publications/timely-versus-delayed-early-childhood-vaccination-and-seizures/",
    evidenceTier: "Nghiên cứu quan sát lớn (Vaccine Safety Datalink)",
  },
  glanzImmuneOverload2018: {
    organization: "HealthyChildren.org (AAP), trích dẫn JAMA 2018",
    title: "Vaccine studies examine the evidence (nghiên cứu Glanz và cộng sự)",
    url: "https://www.healthychildren.org/English/safety-prevention/immunizations/Pages/vaccine-studies-examine-the-evidence.aspx",
    evidenceTier: "Hướng dẫn hiệp hội chuyên khoa, trích dẫn nghiên cứu bình duyệt",
  },
  offitMultipleVaccines2002: {
    organization: "Pediatrics (AAP)",
    title: "Addressing Parents' Concerns: Do Multiple Vaccines Overwhelm or Weaken the Infant's Immune System?",
    url: "https://publications.aap.org/pediatrics/article/109/1/124/79755/Addressing-Parents-Concerns-Do-Multiple-Vaccines",
    evidenceTier: "Bài tổng quan bình duyệt (AAP)",
  },
  cdcEidMeaslesVietnam2025: {
    organization: "CDC — Emerging Infectious Diseases",
    title: "Nghiên cứu huyết thanh học và dịch tễ dịch sởi tại TP.HCM, 2024",
    url: "https://wwwnc.cdc.gov/eid/article/31/10/25-0234_article",
    evidenceTier: "Nghiên cứu bình duyệt (tạp chí CDC)",
  },
  diphtheriaVietnamGenomic: {
    organization: "Scientific Reports / LSHTM",
    title: "Genomic epidemiology of diphtheria outbreaks in Vietnam",
    url: "https://www.nature.com/articles/s41598-026-38608-2",
    evidenceTier: "Nghiên cứu bình duyệt (giải trình tự gen)",
  },
  unicefVietnamImmunization: {
    organization: "UNICEF Việt Nam",
    title: "Immunization — vaccine hesitancy and coverage in Vietnam",
    url: "https://www.unicef.org/vietnam/immunization",
    evidenceTier: "Báo cáo tổ chức quốc tế",
  },
  quinvaxemContentAnalysis: {
    organization: "PMC (tạp chí bình duyệt)",
    title: "Phân tích truyền thông về sự cố Quinvaxem tại Việt Nam, 2012-2013",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC11362720/",
    evidenceTier: "Nghiên cứu bình duyệt (phân tích truyền thông)",
  },
  hviid2019MmrAutismDenmark: {
    organization: "Annals of Internal Medicine (tạp chí bình duyệt)",
    title: "Measles, Mumps, Rubella Vaccination and Autism: A Nationwide Cohort Study",
    url: "https://pubmed.ncbi.nlm.nih.gov/30831578/",
    evidenceTier: "Nghiên cứu đoàn hệ quy mô quốc gia",
  },
  taylor2014VaccineAutismMetaAnalysis: {
    organization: "Vaccine (tạp chí bình duyệt)",
    title: "Vaccines are not associated with autism: An evidence-based meta-analysis",
    url: "https://www.sciencedirect.com/science/article/abs/pii/S0264410X14006367",
    evidenceTier: "Phân tích gộp bình duyệt",
  },
  cochraneMmrChildren2012: {
    organization: "Cochrane",
    title: "Vaccines for measles, mumps and rubella in children",
    url: "https://www.cochranelibrary.com/cdsr/doi/10.1002/14651858.CD004407.pub3/abstract",
    evidenceTier: "Tổng quan hệ thống Cochrane",
  },
  cdcThimerosal: {
    organization: "CDC",
    title: "Thimerosal and Vaccines",
    url: "https://www.cdc.gov/vaccine-safety/about/thimerosal.html",
    evidenceTier: "Hướng dẫn liên bang Hoa Kỳ",
  },
  hviid2025AluminumVaccines: {
    organization: "Annals of Internal Medicine (tạp chí bình duyệt)",
    title: "Aluminum-Adsorbed Vaccines and Chronic Diseases in Childhood",
    url: "https://www.acpjournals.org/doi/10.7326/ANNALS-25-00997",
    evidenceTier: "Nghiên cứu đoàn hệ quy mô quốc gia",
  },
  daley2022AluminumAsthma: {
    organization: "Academic Pediatrics (tạp chí bình duyệt)",
    title: "Association Between Aluminum Exposure From Vaccines and Persistent Asthma",
    url: "https://www.academicpedsjnl.net/article/S1876-2859(22)00417-X/fulltext",
    evidenceTier: "Nghiên cứu đoàn hệ (Vaccine Safety Datalink)",
  },
  cdcHpvVaccinationRec: {
    organization: "CDC",
    title: "HPV Vaccination Recommendations",
    url: "https://www.cdc.gov/hpv/hcp/vaccination-recommendations/index.html",
    evidenceTier: "Hướng dẫn liên bang Hoa Kỳ",
  },
  aapNews2026ScheduleDeparts: {
    organization: "AAP News",
    title: "AAP's 2026 immunization schedule keeps routine recommendations intact",
    url: "https://publications.aap.org/aapnews/news/34141/AAP-s-2026-immunization-schedule-keeps-routine",
    evidenceTier: "Tin tức hiệp hội chuyên khoa (AAP)",
  },
  vietnamHpvProgram2026: {
    organization: "Báo Tuổi Trẻ / VNVC (trích dẫn Quyết định 2780/QĐ-BYT)",
    title: "Năm 2026, trẻ sẽ được tiêm vắc xin HPV miễn phí trong chương trình TCMR",
    url: "https://tuoitre.vn/nam-2026-tre-se-duoc-tiem-hai-loai-vac-xin-tien-trieu-hoan-toan-mien-phi-20251226114934111.htm",
    evidenceTier: "Báo chí trong nước trích dẫn văn bản Bộ Y tế",
  },
  vietnamCovidBoosterGuidance: {
    organization: "Bệnh viện Nhi Đồng Thành Phố",
    title: "COVID-19 trở lại, cẩn thận với biến thể mới và tái nhiễm ở trẻ",
    url: "https://bvndtp.org.vn/covid-19-tro-lai-can-than-voi-bien-the-moi-va-tai-nhiem-o-tre/",
    evidenceTier: "Bệnh viện nhi chuyên khoa (Việt Nam)",
  },
  ahaNewsroomChoking2025: {
    organization: "American Heart Association (AHA)",
    title: "Updated CPR guidelines tackle choking response, opioid-related emergencies and revised chain of survival",
    url: "https://newsroom.heart.org/news/updated-cpr-guidelines-tackle-choking-response-opioid-related-emergencies-and-a-revised-chain-of-survival",
    evidenceTier: "Hướng dẫn hiệp hội chuyên khoa (AHA/AAP, 2025)",
  },
  redCrossInfantChoking: {
    organization: "American Red Cross",
    title: "Infant Choking: How To Help",
    url: "https://www.redcross.org/take-a-class/resources/learn-first-aid/infant-choking",
    evidenceTier: "Tổ chức sơ cứu uy tín quốc tế",
  },
  ahaPediatricBls2025Review: {
    organization: "PMC (tạp chí bình duyệt)",
    title: "Updated pediatric cardiopulmonary resuscitation: a comprehensive review of the 2025 guidelines",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC13175904/",
    evidenceTier: "Bài tổng quan bình duyệt (hướng dẫn AHA/AAP 2025)",
  },
  nhsResuscitateChild: {
    organization: "NHS (Anh)",
    title: "How to resuscitate a child",
    url: "https://www.nhs.uk/baby/first-aid-and-safety/first-aid/how-to-resuscitate-a-child/",
    evidenceTier: "Hướng dẫn y tế quốc gia (NHS)",
  },
  aapDrowningPrevention2026: {
    organization: "AAP (Pediatrics)",
    title: "Prevention of Drowning: Policy Statement",
    url: "https://publications.aap.org/pediatrics/article/doi/10.1542/peds.2026-077410/207630/Prevention-of-Drowning-Policy-Statement",
    evidenceTier: "Hướng dẫn hiệp hội chuyên khoa (AAP)",
  },
  redCrossDryDrowning: {
    organization: "American Red Cross",
    title: "Debunking Dry or Delayed/Secondary Drowning",
    url: "https://www.redcross.org/take-a-class/resources/articles/dry-or-delayed-secondary-drowning",
    evidenceTier: "Tổ chức sơ cứu uy tín quốc tế",
  },
  whoVietnamDrowning2025: {
    organization: "WHO Việt Nam / Bộ Y tế",
    title: "Urgent call for stronger action to prevent child drowning in Viet Nam",
    url: "https://www.who.int/vietnam/news/detail/25-07-2025-drowning-rates-not-reducing-fast-enough--says-the-moh--who-and-partners-on-world-drowning-prevention-day",
    evidenceTier: "Báo cáo tổ chức quốc tế phối hợp Bộ Y tế Việt Nam",
  },
  aapSafeSleep2022: {
    organization: "HealthyChildren.org (AAP)",
    title: "A Parent's Guide to Safe Sleep",
    url: "https://www.healthychildren.org/English/ages-stages/baby/sleep/Pages/a-parents-guide-to-safe-sleep.aspx",
    evidenceTier: "Hướng dẫn hiệp hội chuyên khoa (AAP, 2022)",
  },
  nhsBurnsTreatment: {
    organization: "NHS (Anh)",
    title: "Burns and scalds: Treatment",
    url: "https://www.nhs.uk/conditions/burns-and-scalds/treatment/",
    evidenceTier: "Hướng dẫn y tế quốc gia (NHS)",
  },
  ameriburnFirstAid: {
    organization: "American Burn Association",
    title: "Burn First Aid",
    url: "https://www.ameriburn.org/patients/burn-first-aid",
    evidenceTier: "Hiệp hội chuyên khoa bỏng (Hoa Kỳ)",
  },
  healthyChildrenBurnFaq: {
    organization: "HealthyChildren.org (AAP)",
    title: "First Aid for Burns: Parent FAQs",
    url: "https://www.healthychildren.org/English/safety-prevention/all-around/Pages/First-Aid-For-Burns.aspx",
    evidenceTier: "Hướng dẫn hiệp hội chuyên khoa (AAP)",
  },
  healthyChildrenHeadInjury: {
    organization: "HealthyChildren.org (AAP)",
    title: "Head Injury in Children: How to Know If It's Minor or Serious",
    url: "https://www.healthychildren.org/English/health-issues/injuries-emergencies/Pages/Head-Injury.aspx",
    evidenceTier: "Hướng dẫn hiệp hội chuyên khoa (AAP)",
  },
  pecarnValidationPmc: {
    organization: "PMC (tạp chí bình duyệt)",
    title: "Nghiên cứu xác nhận quy tắc PECARN chấn thương đầu ở trẻ em",
    url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC8765658/",
    evidenceTier: "Nghiên cứu bình duyệt (quy tắc quyết định lâm sàng)",
  },
  nbtHeadInjuryAdvice: {
    organization: "NHS (North Bristol Trust)",
    title: "Head injury advice for babies, toddlers and children",
    url: "https://www.nbt.nhs.uk/our-services/a-z-services/emergency-department/ed-miu-patient-information/head-injury-advice-babies-toddlers-children",
    evidenceTier: "Hướng dẫn y tế quốc gia (NHS)",
  },
  poisonControlIpecac: {
    organization: "Poison Control (National Capital Poison Center)",
    title: "Ipecac: Don't use it",
    url: "https://www.poison.org/articles/ipecac-do-not-use-it",
    evidenceTier: "Trung tâm chống độc uy tín (Hoa Kỳ)",
  },
  poisonControlIronPoisoning: {
    organization: "Poison Control (National Capital Poison Center)",
    title: "Iron poisoning: A simple but serious mistake",
    url: "https://www.poison.org/articles/iron-poisoning",
    evidenceTier: "Trung tâm chống độc uy tín (Hoa Kỳ)",
  },
  cdcIronPoisoningMmwr: {
    organization: "CDC (MMWR)",
    title: "Cụm ca ngộ độc sắt tử vong ở trẻ nhỏ",
    url: "https://www.cdc.gov/mmwr/preview/mmwrhtml/00019593.htm",
    evidenceTier: "Báo cáo dịch tễ học liên bang Hoa Kỳ",
  },
  bachMaiChongDoc: {
    organization: "Bệnh viện Bạch Mai",
    title: "Trung tâm Chống độc — thông tin đơn vị",
    url: "https://bachmai.gov.vn/don-vi/trung-tam-chong-doc/eaff97c4-121e-d4ef-3ba7-70a76002a867",
    evidenceTier: "Bệnh viện tuyến trung ương (Việt Nam) — ⚠️ số điện thoại chưa xác minh được, xem ghi chú",
  },
  poisonControlBatteryGuideline: {
    organization: "Poison Control (National Capital Poison Center)",
    title: "Button Battery Ingestion Triage and Treatment Guideline",
    url: "https://www.poison.org/battery/guideline",
    evidenceTier: "Trung tâm chống độc uy tín (Hoa Kỳ)",
  },
  cpscMagnetStandard2022: {
    organization: "CPSC (Ủy ban An toàn Sản phẩm Tiêu dùng Hoa Kỳ)",
    title: "CPSC Approves New Federal Safety Standard for Magnets",
    url: "https://www.cpsc.gov/Newsroom/News-Releases/2022/CPSC-Approves-New-Federal-Safety-Standard-for-Magnets-to-Prevent-Deaths-and-Serious-Injuries-from-High-Powered-Magnet-Ingestion",
    evidenceTier: "Cơ quan quản lý an toàn sản phẩm liên bang Hoa Kỳ",
  },
  aapCarSeatPolicy2018: {
    organization: "AAP (Pediatrics)",
    title: "Child Passenger Safety (Policy Statement, tái xác nhận 2/2025)",
    url: "https://publications.aap.org/pediatrics/article/142/5/e20182460/38530/Child-Passenger-Safety",
    evidenceTier: "Hướng dẫn hiệp hội chuyên khoa (AAP)",
  },
  nhtsaCarSeats: {
    organization: "NHTSA (Hoa Kỳ)",
    title: "Car Seats and Booster Seats",
    url: "https://www.nhtsa.gov/vehicle-safety/car-seats-and-booster-seats",
    evidenceTier: "Cơ quan an toàn giao thông liên bang Hoa Kỳ",
  },
  nhtsaHeatstroke: {
    organization: "NHTSA (Hoa Kỳ)",
    title: "Heatstroke (chiến dịch phòng chống trẻ tử vong do bỏ quên trong xe)",
    url: "https://www.nhtsa.gov/campaign/heatstroke",
    evidenceTier: "Cơ quan an toàn giao thông liên bang Hoa Kỳ",
  },
  vietnamCarSeatLaw2024: {
    organization: "Chính phủ Việt Nam (Cổng thông tin điện tử Chính phủ)",
    title: "Luật Trật tự, an toàn giao thông đường bộ 36/2024/QH15 — quy định ghế an toàn cho trẻ em",
    url: "https://xaydungchinhsach.chinhphu.vn/",
    evidenceTier: "Văn bản pháp luật Việt Nam (Quốc hội)",
  },
  vietnamCarSeatUsageRate: {
    organization: "VietnamNet (trích dẫn nghiên cứu trong nước)",
    title: "Child car seat use remains low despite Vietnam's new rules",
    url: "https://vietnamnet.vn/en/child-car-seat-use-remains-low-despite-vietnam-s-new-rules-2542666.html",
    evidenceTier: "Báo chí trong nước trích dẫn nghiên cứu",
  },
  vietnamMotorbikeHelmetChild: {
    organization: "PMC (tạp chí bình duyệt)",
    title: "Effects of helmet nonuse and seating position on patterns/severity of injuries in child motorcycle passengers (Việt Nam)",
    url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6686244/",
    evidenceTier: "Nghiên cứu bình duyệt (Việt Nam)",
  },
  vietnamMotorbikeHelmetLaw: {
    organization: "LawNet (trích dẫn Nghị định 168/2024/NĐ-CP)",
    title: "From 2025: fines for not wearing a helmet while riding a motorcycle in Vietnam",
    url: "https://lawnet.vn/judgment/en/tin-tuc/from-2025-what-are-the-fines-for-not-wearing-a-helmet-while-riding-a-motorcycle-in-vietnam-13160",
    evidenceTier: "Văn bản pháp luật Việt Nam (Nghị định)",
  },
  unicefVietnamDrowningSurvey: {
    organization: "UNICEF (Vietnam Multi-center Injury Survey)",
    title: "Vietnam Multi-center Injury Survey — báo cáo đuối nước và thương tích trẻ em",
    url: "http://swimsafe.org/wp-content/uploads/2009/09/Vietnam-UNICEFfinalVMISreportfinal.pdf",
    evidenceTier: "Báo cáo khảo sát tổ chức quốc tế",
  },
  cpscBucketDrowning: {
    organization: "CPSC (Ủy ban An toàn Sản phẩm Tiêu dùng Hoa Kỳ)",
    title: "Government And Industry Move To Reduce Infant Bucket Drownings",
    url: "https://www.cpsc.gov/Newsroom/News-Releases/1990/Government-And-Industry-Move-To-Reduce-Infant-Bucket-Drownings",
    evidenceTier: "Cơ quan quản lý an toàn sản phẩm liên bang Hoa Kỳ",
  },
  childrensBurnsTrustHotDrinks: {
    organization: "Children's Burns Trust (Anh)",
    title: "Hot drinks — nguyên nhân hàng đầu gây bỏng ở trẻ nhỏ",
    url: "https://cbtrust.org.uk/get-informed/causes-of-burns-and-preventions/hot-drinks/",
    evidenceTier: "Tổ chức chuyên khoa bỏng (Anh)",
  },
  healthyChildrenAcetaminophen: {
    organization: "HealthyChildren.org (AAP)",
    title: "Acetaminophen for Fever and Pain",
    url: "https://www.healthychildren.org/English/safety-prevention/at-home/medication-safety/Pages/Acetaminophen-for-Fever-and-Pain.aspx",
    evidenceTier: "Hướng dẫn hiệp hội chuyên khoa (AAP)",
  },
  healthyChildrenIbuprofen: {
    organization: "HealthyChildren.org (AAP)",
    title: "Ibuprofen for Fever and Pain",
    url: "https://www.healthychildren.org/English/safety-prevention/at-home/medication-safety/Pages/Ibuprofen-for-Fever-and-Pain.aspx",
    evidenceTier: "Hướng dẫn hiệp hội chuyên khoa (AAP)",
  },
  aapFeverAntipyretic2011: {
    organization: "AAP (Pediatrics)",
    title: "Fever and Antipyretic Use in Children (tái xác nhận 2022)",
    url: "https://publications.aap.org/pediatrics/article/127/3/e20103852/65016/Fever-and-Antipyretic-Use-in-Children",
    evidenceTier: "Hướng dẫn hiệp hội chuyên khoa (AAP)",
  },
  cochraneAntipyreticsCombined: {
    organization: "Cochrane",
    title: "Alternating and combined antipyretics for treating fever in children",
    url: "https://www.cochrane.org/CD009572/INFECTN_alternating-and-combined-antipyretics-treatment-fever-children",
    evidenceTier: "Tổng quan hệ thống Cochrane",
  },
  cdcMedicationSafetyProtect: {
    organization: "CDC (PROTECT Initiative)",
    title: "Medication Safety — Up and Away",
    url: "https://www.cdc.gov/medication-safety/protect/index.html",
    evidenceTier: "Hướng dẫn liên bang Hoa Kỳ",
  },
  poisonControlEssentialOils: {
    organization: "Poison Control (National Capital Poison Center)",
    title: "Essential Oils — an toàn với trẻ nhỏ",
    url: "https://www.poison.org/articles/essential-oils",
    evidenceTier: "Trung tâm chống độc uy tín (Hoa Kỳ)",
  },
  healthyChildrenEmergencyWhen: {
    organization: "HealthyChildren.org (AAP)",
    title: "When Your Child Needs Emergency Medical Services",
    url: "https://www.healthychildren.org/English/health-issues/injuries-emergencies/Pages/When-Your-Child-Needs-Emergency-Medical-Services.aspx",
    evidenceTier: "Hướng dẫn hiệp hội chuyên khoa (AAP)",
  },
  nhsAnaphylaxis: {
    organization: "NHS (Anh)",
    title: "Anaphylaxis",
    url: "https://www.nhs.uk/conditions/anaphylaxis/",
    evidenceTier: "Hướng dẫn y tế quốc gia (NHS)",
  },
  aapEpinephrineFirstAid2017: {
    organization: "AAP (Pediatrics)",
    title: "Epinephrine for First-aid Management of Anaphylaxis",
    url: "https://publications.aap.org/pediatrics/article/139/3/e20164006/53753/Epinephrine-for-First-aid-Management-of",
    evidenceTier: "Hướng dẫn hiệp hội chuyên khoa (AAP)",
  },
  vietnamEmergencyNumber115: {
    organization: "Thư viện Pháp luật (trích dẫn Thông tư 22/2014/TT-BTTTT)",
    title: "Cấp cứu gọi số nào? 115 là số dịch vụ viễn thông khẩn cấp",
    url: "https://thuvienphapluat.vn/hoi-dap-phap-luat/cap-cuu-goi-so-nao-cap-cuu-y-te-la-dich-vu-vien-thong-khan-cap-dung-khong-138068052.html",
    evidenceTier: "Văn bản pháp luật Việt Nam (Thông tư)",
  },
  brunieCoPoisoningPostpartum: {
    organization: "Medical Journal (Brunei) — PubMed",
    title: "Unintentional deaths from carbon-monoxide poisoning due to a traditional practice observed during the post-partum period",
    url: "https://pubmed.ncbi.nlm.nih.gov/27628167/",
    evidenceTier: "Báo cáo ca bệnh bình duyệt",
  },
  tuoiTreNamThanBongNang: {
    organization: "Tuổi Trẻ / PLO (trích dẫn BS. Ngô Đức Hiệp, BV Chợ Rẫy)",
    title: "5 sản phụ bỏng nặng do nằm than sau sinh",
    url: "https://tuoitre.vn/plo/5-san-phu-bong-nang-do-nam-than-sau-sinh-109561907.htm",
    evidenceTier: "Báo chí trong nước trích dẫn bác sĩ chuyên khoa",
  },
  vinmecLaTrauSoSinh: {
    organization: "Vinmec",
    title: "Hơ lá trầu cho trẻ sơ sinh có tốt không?",
    url: "https://www.vinmec.com/vie/bai-viet/ho-la-trau-cho-tre-so-sinh-co-toan-khong-vi",
    evidenceTier: "Bệnh viện tư nhân lớn (Việt Nam)",
  },
  vaginalSteamingBurnCase: {
    organization: "PubMed (báo cáo ca bệnh)",
    title: "Báo cáo ca bỏng độ 2 do xông hơi vùng kín",
    url: "https://pubmed.ncbi.nlm.nih.gov/30366886/",
    evidenceTier: "Báo cáo ca bệnh bình duyệt",
  },
  acogPostpartumPainManagement: {
    organization: "ACOG",
    title: "Postpartum Pain Management (khuyến nghị ngâm ấm/sitz bath)",
    url: "https://www.acog.org/womens-health/faqs/postpartum-pain-management",
    evidenceTier: "Hướng dẫn hiệp hội chuyên khoa (ACOG)",
  },
  suckhoedoisongKiengTamNhiemTrung: {
    organization: "Sức khỏe & Đời sống (trích dẫn BS. Phan Chí Thành, BV Phụ Sản Trung Ương)",
    title: "Nhiều phụ nữ bị nhiễm trùng \"chỗ ấy\" do thói quen kiêng tắm gội sau sinh",
    url: "https://suckhoedoisong.vn/nhieu-phu-nu-bi-nhiem-trung-cho-ay-do-thoi-quen-kieng-tam-goi-sau-sinh-169230428150510342.htm",
    evidenceTier: "Báo chí y tế trích dẫn bác sĩ chuyên khoa (Việt Nam)",
  },
  tuDuTamGoiSauSinh: {
    organization: "Bệnh viện Từ Dũ",
    title: "Tắm gội sau sinh: kiêng hay không kiêng, nói 1 câu",
    url: "https://www.tudu.com.vn/vn/y-hoc-thuong-thuc/suc-khoe-phu-nu/lam-me-an-toan/cham-soc-ba-me-mang-thai/tam-goi-sau-sinh-kieng-hay-khong-kieng-noi-1-cau/",
    evidenceTier: "Bệnh viện phụ sản tuyến đầu (Việt Nam)",
  },
  niceNg194PerinealCare: {
    organization: "NICE (Anh)",
    title: "Postnatal care (NG194) — chăm sóc vết khâu tầng sinh môn",
    url: "https://www.nice.org.uk/guidance/ng194/chapter/recommendations",
    evidenceTier: "Hướng dẫn lâm sàng quốc gia (NICE)",
  },
  neonatalMastauxePmc: {
    organization: "PMC (tạp chí bình duyệt)",
    title: "Neonatal Mastauxe / Breast Enlargement of the Newborn",
    url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4422278/",
    evidenceTier: "Bài tổng quan bình duyệt (sơ sinh học)",
  },
  vinmecNanSuaSoSinh: {
    organization: "Vinmec (trích dẫn BS. Lê Thị Kim Dung)",
    title: "Ngực trẻ nổi cục, nặn ra sữa là dấu hiệu bệnh gì?",
    url: "https://www.vinmec.com/vie/bai-viet/nguc-tre-noi-cuc-nan-ra-sua-la-dau-hieu-benh-gi-vi",
    evidenceTier: "Bệnh viện tư nhân lớn (Việt Nam), trích dẫn bác sĩ chuyên khoa",
  },
  cdcInfantBotulismHoney: {
    organization: "CDC",
    title: "Foods and Drinks to Avoid or Limit — mật ong và ngộ độc botulism ở trẻ dưới 1 tuổi",
    url: "https://www.cdc.gov/infant-toddler-nutrition/foods-and-drinks/foods-and-drinks-to-avoid-or-limit.html",
    evidenceTier: "Hướng dẫn liên bang Hoa Kỳ",
  },
  whoDelayedFirstBath: {
    organization: "WHO",
    title: "WHO recommendations on maternal and newborn care for a positive postnatal experience",
    url: "https://www.who.int/publications/i/item/9789240045989",
    evidenceTier: "Hướng dẫn của Tổ chức Y tế Thế giới",
  },
  joghDelayedBathReview2022: {
    organization: "Journal of Global Health (tạp chí bình duyệt)",
    title: "Tổng quan hệ thống về thời điểm tắm lần đầu cho trẻ sơ sinh",
    url: "https://jogh.org/2022/jogh-12-12004",
    evidenceTier: "Tổng quan hệ thống bình duyệt",
  },
  coiningMalaysianFamPhys2011: {
    organization: "Malaysian Family Physician (tạp chí bình duyệt, truy cập mở)",
    title: "Coining: An Ancient Treatment Widely Practiced Among Asians",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC4170418/",
    evidenceTier: "Báo cáo ca bệnh + tổng quan bình duyệt",
  },
  camphorToxicityCoinRubbing2002: {
    organization: "JAMA (tạp chí bình duyệt)",
    title: "Camphor Intoxication After Cao Gío (Coin Rubbing), JAMA 2002;288(1):45",
    url: "https://jamanetwork.com/journals/jama/fullarticle/195071",
    evidenceTier: "Báo cáo ca bệnh bình duyệt — ⚠️ URL suy luận theo mẫu JAMA, cần xác minh trước khi hiển thị công khai",
  },
  vinmecCaoGioTreEm: {
    organization: "Vinmec",
    title: "Có nên đánh cảm (cạo gió) cho trẻ em?",
    url: "https://www.vinmec.com/vie/bai-viet/co-nen-danh-cam-cho-tre-em-vi",
    evidenceTier: "Bệnh viện tư nhân lớn (Việt Nam)",
  },
  tuoiTreSoCuuSaiCachCoGiat: {
    organization: "Tuổi Trẻ (trích dẫn BS. Dương Thị Huyền Trang, BV Nhi đồng Cần Thơ)",
    title: "Cảnh báo sơ cứu sai cách khi trẻ co giật do sốt",
    url: "https://tuoitre.vn/",
    evidenceTier: "Báo chí y tế trích dẫn bác sĩ cấp cứu nhi (Việt Nam) — ⚠️ URL trang chủ, chưa xác minh được đường dẫn bài viết cụ thể, cần kiểm tra lại trước khi hiển thị công khai",
  },
  epilepsyStigmaVietnam2008: {
    organization: "Epilepsy & Behavior (tạp chí bình duyệt)",
    title: "Meanings of epilepsy in its sociocultural context and implications for stigma: Vietnam & China",
    url: "https://pubmed.ncbi.nlm.nih.gov/18248774/",
    evidenceTier: "Nghiên cứu dân tộc học bình duyệt",
  },
  murrayBmcPediatricsInfantCrying2019: {
    organization: "BMC Pediatrics (tạp chí bình duyệt)",
    title: "Assistance for parents with unsettled infants in Central Vietnam: a qualitative investigation of health professionals' perspectives",
    url: "https://bmcpediatr.biomedcentral.com/articles/10.1186/s12887-019-1533-3",
    evidenceTier: "Nghiên cứu định tính bình duyệt",
  },
  macknin2000TeethingSymptoms: {
    organization: "Pediatrics (tạp chí bình duyệt)",
    title: "Symptoms Associated with Infant Teething: A Prospective Study",
    url: "https://pubmed.ncbi.nlm.nih.gov/10742317/",
    evidenceTier: "Nghiên cứu tiến cứu bình duyệt",
  },
  fdaAmberTeethingNecklace2018: {
    organization: "FDA (Hoa Kỳ)",
    title: "FDA warns against teething necklaces, bracelets and other jewelry",
    url: "https://www.fda.gov/consumers/consumer-updates/faqs-teething-necklaces-bracelets-and-other-jewelry-marketed-relieve-teething-pain-or-provide",
    evidenceTier: "Cảnh báo an toàn liên bang Hoa Kỳ",
  },
  fdaBenzocaineTeethingGel2018: {
    organization: "FDA (Hoa Kỳ)",
    title: "FDA warns against use of benzocaine teething products",
    url: "https://www.fda.gov/drugs/drug-safety-and-availability/fda-drug-safety-communication-fda-warns-serious-risks-and-death-when-methemoglobinemia-treatment",
    evidenceTier: "Cảnh báo an toàn liên bang Hoa Kỳ",
  },
  ddhSwaddlingRiskPmc: {
    organization: "PMC (tạp chí bình duyệt)",
    title: "Traditional (Mongolian) swaddling and developmental dysplasia of the hip: RCT",
    url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC8513275/",
    evidenceTier: "Thử nghiệm ngẫu nhiên có đối chứng",
  },
  aaosBowLegs: {
    organization: "OrthoInfo (AAOS)",
    title: "Bowed Legs (Genu Varum, Blount's Disease)",
    url: "https://www.orthoinfo.org/en/diseases--conditions/bowed-legs-blounts-disease/",
    evidenceTier: "Hướng dẫn hiệp hội chuyên khoa chỉnh hình (Hoa Kỳ)",
  },
  danTriVuotMuiChoCao: {
    organization: "Dân Trí (trích dẫn bác sĩ chuyên khoa)",
    title: "Tai hại khi \"vuốt mũi cho cao\" ở trẻ",
    url: "https://dantri.com.vn/suc-khoe/tai-hai-khi-vuot-mui-cho-cao-o-tre-1417433670.htm",
    evidenceTier: "Báo chí y tế trích dẫn bác sĩ (Việt Nam)",
  },
  galloway2006PressuringChildrenEat: {
    organization: "Appetite (tạp chí bình duyệt)",
    title: "\"Finish your soup\": Counterproductive effects of pressuring children to eat on intake and affect",
    url: "https://pubmed.ncbi.nlm.nih.gov/16626838/",
    evidenceTier: "Nghiên cứu thực nghiệm bình duyệt",
  },
  vienDinhDuongBeoPhiTre: {
    organization: "Viện Dinh dưỡng Quốc gia (Bộ Y tế Việt Nam)",
    title: "Béo phì không chỉ là chuyện của con mà là lối sống của cả nhà",
    url: "https://viendinhduong.vn/vi/article/tin-tuc/beo-phi-khong-chi-la-chuyen-cua-con-ma-la-loi-song-cua-ca-nha-69452436396fdfd8c109b2f5",
    evidenceTier: "Cơ quan dinh dưỡng quốc gia (Việt Nam)",
  },
  aapGrandRoundsWalkersDelay: {
    organization: "AAP Grand Rounds",
    title: "Baby Walkers Delay Motor and Mental Development",
    url: "https://publications.aap.org/aapgrandrounds/article/3/1/1/85909/Baby-Walkers-Delay-Motor-and-Mental-Development",
    evidenceTier: "Hướng dẫn hiệp hội chuyên khoa (AAP)",
  },
  uscFolkloreThoiNoi: {
    organization: "USC Digital Folklore Archives",
    title: "\"Thôi nôi\": Vietnamese 1st Birthday Celebration",
    url: "https://folklore.usc.edu/thoi-noi-vietnamese-1st-birthday-celebration/",
    evidenceTier: "Kho tư liệu văn hóa dân gian học thuật",
  },
  healthlineOverstimulatedBaby: {
    organization: "Healthline",
    title: "11 Signs of an Overstimulated Baby and How To Soothe Them",
    url: "https://www.healthline.com/health/baby/11-signs-of-an-overstimulated-baby-and-how-to-soothe-them",
    evidenceTier: "Nội dung y tế tiêu dùng bình duyệt biên tập",
  },
  fetalHeartRateGenderMetaAnalysis: {
    organization: "PMC (tạp chí bình duyệt)",
    title: "The role of fetal heart rate in first trimester sonograms in prediction of fetal sex: a systematic review and meta-analysis",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC10422800/",
    evidenceTier: "Tổng quan hệ thống và phân tích gộp",
  },
  villamorLunarCalendarGender2010: {
    organization: "Paediatric and Perinatal Epidemiology (tạp chí bình duyệt), qua ActualGyn",
    title: "Predicting Baby Gender Using the Chinese Lunar Calendar (Villamor et al. 2010, 2.840.755 ca sinh)",
    url: "https://www.actualgyn.com/en/article/2023/281",
    evidenceTier: "Nghiên cứu dân số bình duyệt",
  },
  zuoYueziPpdStudy2024: {
    organization: "PMC (tạp chí bình duyệt)",
    title: "Heterogeneity of \"Zuo Yuezi\" practices among Chinese postpartum women and its association with postpartum depression",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC12989433/",
    evidenceTier: "Nghiên cứu đoàn hệ bình duyệt",
  },
  sanhujoriwonKoreaPpdStudy: {
    organization: "PMC (tạp chí bình duyệt)",
    title: "Ecological factors affecting first-time mothers' satisfaction with Sanhujoriwons (trung tâm chăm sóc sau sinh Hàn Quốc)",
    url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10280916/",
    evidenceTier: "Nghiên cứu bình duyệt",
  },
  costigan2006HeartburnHair: {
    organization: "Birth (tạp chí bình duyệt)",
    title: "Pregnancy folklore revisited: the case of heartburn and hair",
    url: "https://pubmed.ncbi.nlm.nih.gov/17150070/",
    evidenceTier: "Nghiên cứu bình duyệt (quy mô nhỏ, chưa lặp lại)",
  },
  nuchalCordReviewPmc: {
    organization: "PMC (tạp chí bình duyệt)",
    title: "Nuchal cord and its implications",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC5719938/",
    evidenceTier: "Bài tổng quan bình duyệt (sản khoa)",
  },
  jSexMed2019IntercourseInduction: {
    organization: "Journal of Sexual Medicine (tạp chí bình duyệt)",
    title: "Sexual Intercourse for Induction of Spontaneous Onset of Labor: Systematic Review and Meta-Analysis",
    url: "https://academic.oup.com/jsm/article-abstract/16/11/1787/6980623",
    evidenceTier: "Tổng quan hệ thống và phân tích gộp",
  },
  jukic2013PregnancyLength: {
    organization: "Human Reproduction (tạp chí bình duyệt)",
    title: "Length of human pregnancy and contributors to its natural variation",
    url: "https://pubmed.ncbi.nlm.nih.gov/23922246/",
    evidenceTier: "Nghiên cứu đoàn hệ tiến cứu bình duyệt",
  },
  cochraneBreastStimulationInduction: {
    organization: "Cochrane (qua Evidence Based Birth)",
    title: "Breast stimulation for cervical ripening and induction of labour",
    url: "https://evidencebasedbirth.com/ebb-125-evidence-on-acupressure-acupuncture-and-breast-stimulation/",
    evidenceTier: "Tổng quan hệ thống Cochrane",
  },
  cochraneEpiduralAnalgesia: {
    organization: "Cochrane",
    title: "Epidural versus non-epidural or no analgesia for pain management in labour",
    url: "https://www.cochrane.org/evidence/CD000331_epidurals-pain-relief-labour",
    evidenceTier: "Tổng quan hệ thống Cochrane",
  },
  acogCommitteeOpinion339Epidural: {
    organization: "ACOG",
    title: "Committee Opinion No. 339: Analgesia and Cesarean Delivery Rates",
    url: "https://pubmed.ncbi.nlm.nih.gov/16738188/",
    evidenceTier: "Hướng dẫn hiệp hội chuyên khoa (ACOG)",
  },
  wolraich1995SugarMetaAnalysis: {
    organization: "JAMA (tạp chí bình duyệt)",
    title: "The Effect of Sugar on Behavior or Cognition in Children: A Meta-analysis",
    url: "https://jamanetwork.com/journals/jama/fullarticle/391812",
    evidenceTier: "Phân tích gộp bình duyệt (23 thử nghiệm mù đôi)",
  },
  hooverMilich1994SugarExpectancy: {
    organization: "Journal of Abnormal Child Psychology (tạp chí bình duyệt)",
    title: "Effects of sugar ingestion expectancies on mother-child interactions",
    url: "https://pubmed.ncbi.nlm.nih.gov/7963081/",
    evidenceTier: "Nghiên cứu thực nghiệm bình duyệt",
  },
  bellAinsworth1972Crying: {
    organization: "Child Development (tạp chí bình duyệt)",
    title: "Infant crying and maternal responsiveness",
    url: "https://eric.ed.gov/?id=EJ066002",
    evidenceTier: "Nghiên cứu nền tảng bình duyệt (tâm lý học gắn bó)",
  },
  aapEarlyLiteracy: {
    organization: "AAP",
    title: "Early Literacy",
    url: "https://www.aap.org/en/patient-care/early-childhood/early-childhood-health-and-development/early-literacy/",
    evidenceTier: "Hướng dẫn hiệp hội chuyên khoa (AAP)",
  },
  harvardKnuckleCracking: {
    organization: "Harvard Health Publishing",
    title: "Does cracking knuckles cause arthritis?",
    url: "https://www.health.harvard.edu/pain/does-cracking-knuckles-cause-arthritis",
    evidenceTier: "Nội dung y tế biên tập bởi trường y (Harvard)",
  },
  eccles2005WetColdColds: {
    organization: "Family Practice (tạp chí bình duyệt)",
    title: "Acute cooling of the feet and the onset of common cold symptoms",
    url: "https://academic.oup.com/fampra/article-abstract/22/6/608/497956",
    evidenceTier: "Thử nghiệm đối chứng bình duyệt",
  },
  price2012CioFiveYearFollowup: {
    organization: "Pediatrics (tạp chí bình duyệt)",
    title: "Five-year follow-up of harms and benefits of behavioral infant sleep intervention: randomized trial",
    url: "https://pubmed.ncbi.nlm.nih.gov/22585766/",
    evidenceTier: "Thử nghiệm ngẫu nhiên có đối chứng, theo dõi dài hạn",
  },
  douglasHill2013SleepUnder6mo: {
    organization: "Journal of Developmental & Behavioral Pediatrics (tạp chí bình duyệt)",
    title: "Behavioral Sleep Interventions in the First Six Months of Life Do Not Improve Outcomes for Mothers or Infants: A Systematic Review",
    url: "https://pubmed.ncbi.nlm.nih.gov/24042081/",
    evidenceTier: "Tổng quan hệ thống bình duyệt",
  },
  czosnykowska2018MilkComposition: {
    organization: "Nutrients (tạp chí bình duyệt)",
    title: "Nghiên cứu thành phần sữa mẹ theo thời gian cho con bú kéo dài",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC6316538/",
    evidenceTier: "Nghiên cứu bình duyệt",
  },
  stettler2002RapidWeightGain: {
    organization: "Pediatrics (tạp chí bình duyệt)",
    title: "Weight Gain in the First Week of Life and Overweight in Adulthood (tăng cân nhanh giai đoạn sơ sinh và béo phì sau này)",
    url: "https://pubmed.ncbi.nlm.nih.gov/11826195/",
    evidenceTier: "Nghiên cứu đoàn hệ đa trung tâm bình duyệt",
  },
  accelWeightGainObesityMeta2020: {
    organization: "PLOS ONE (tạp chí bình duyệt)",
    title: "Accelerated weight gain, prematurity and the risk of childhood obesity: a meta-analysis",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC7199955/",
    evidenceTier: "Phân tích gộp bình duyệt",
  },
  canapariWakeWindows: {
    organization: "BS. Craig Canapari (chuyên gia giấc ngủ nhi khoa, Yale)",
    title: "Do Wake Windows Help Babies and Kids Nap Better?",
    url: "https://drcraigcanapari.com/do-wake-windows-help-babies-and-kids-nap-better/",
    evidenceTier: "Blog chuyên gia y khoa được chứng nhận",
  },
  paruthi2016AasmSleepDuration: {
    organization: "American Academy of Sleep Medicine (AASM)",
    title: "Recommended Amount of Sleep for Pediatric Populations: A Consensus Statement",
    url: "https://jcsm.aasm.org/doi/10.5664/jcsm.6288",
    evidenceTier: "Tuyên bố đồng thuận hiệp hội chuyên khoa (AASM)",
  },
  aapResponsiveFeedingFactSheet: {
    organization: "AAP",
    title: "Responsive Feeding fact sheet",
    url: "https://downloads.aap.org/AAP/PDF/Responsive%20Feeding.pdf",
    evidenceTier: "Hướng dẫn hiệp hội chuyên khoa (AAP)",
  },
  ipp2010SimultaneousVaccineInjectionPain: {
    organization: "PubMed (thử nghiệm ngẫu nhiên có đối chứng)",
    title: "Comparison of distress and pain in infants randomized to groups receiving standard versus multiple immunizations",
    url: "https://pubmed.ncbi.nlm.nih.gov/20362342/",
    evidenceTier: "Thử nghiệm ngẫu nhiên có đối chứng",
  },
  cochraneBreastfeedingVaccinePain: {
    organization: "Cochrane",
    title: "Does breastfeeding reduce vaccination pain in babies aged 1 to 12 months?",
    url: "https://www.cochrane.org/CD011248/",
    evidenceTier: "Tổng quan hệ thống Cochrane",
  },
  creganHartmannBreastVolumeMilk: {
    organization: "PMC (tạp chí bình duyệt)",
    title: "Maternal Breast Growth and Body Mass Index Are Associated with Milk Production in Women",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC11397153/",
    evidenceTier: "Nghiên cứu bình duyệt",
  },
  abmProtocol36Mastitis: {
    organization: "Academy of Breastfeeding Medicine",
    title: "ABM Clinical Protocol #36: The Mastitis Spectrum",
    url: "https://www.bfmed.org/protocols",
    evidenceTier: "Hướng dẫn lâm sàng hiệp hội chuyên khoa",
  },
  rinker2008BreastfeedingPtosis: {
    organization: "Aesthetic Surgery Journal (qua ScienceDaily)",
    title: "The Effect of Breastfeeding on Breast Aesthetics",
    url: "https://www.sciencedaily.com/releases/2007/11/071101202225.htm",
    evidenceTier: "Nghiên cứu bình duyệt (báo cáo qua truyền thông khoa học)",
  },
  whoLamFamilyPlanning: {
    organization: "WHO / Family Planning: A Global Handbook for Providers",
    title: "Phương pháp vô kinh cho con bú (LAM) — tiêu chuẩn Bellagio",
    url: "https://fphandbook.org/",
    evidenceTier: "Hướng dẫn của Tổ chức Y tế Thế giới",
  },
  diastasisRectiExerciseVsBinding: {
    organization: "PMC (tạp chí bình duyệt)",
    title: "Tổng quan hệ thống và phân tích gộp: tập luyện cơ bụng/sàn chậu cho loạn sản cơ thẳng bụng (diastasis recti)",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC8721086/",
    evidenceTier: "Tổng quan hệ thống bình duyệt",
  },
  dysphoricMilkEjectionReflexPmc: {
    organization: "Frontiers in Global Women's Health (tạp chí bình duyệt)",
    title: "Dysphoric Milk Ejection Reflex: The Psychoneurobiology of the Breastfeeding Experience",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC8594038/",
    evidenceTier: "Bài tổng quan bình duyệt",
  },
  healthyChildrenHiccups: {
    organization: "Healthline (đối chiếu hướng dẫn nhi khoa)",
    title: "Newborn Hiccups: Causes and How to Help",
    url: "https://www.healthline.com/health/childrens-health/newborn-hiccups",
    evidenceTier: "Nội dung y tế tiêu dùng biên tập",
  },
  pmcGerdBodyMovementInfant: {
    organization: "PMC (tạp chí bình duyệt)",
    title: "Gastroesophageal Reflux and Body Movement in Infants",
    url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3112532/",
    evidenceTier: "Nghiên cứu bình duyệt",
  },
  pmcLightExposureCircadianInfant: {
    organization: "PMC (tạp chí bình duyệt)",
    title: "The role of light exposure in infant circadian rhythm establishment: A scoping review",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC11685245/",
    evidenceTier: "Tổng quan phạm vi bình duyệt",
  },
  natureSrep44749PhotoperiodSleep: {
    organization: "Scientific Reports (Nature, tạp chí bình duyệt)",
    title: "Dependence of nighttime sleep duration in one-month-old infants on photoperiod",
    url: "https://www.nature.com/articles/srep44749",
    evidenceTier: "Nghiên cứu bình duyệt",
  },
  healthyChildrenUmbilicalCordCare: {
    organization: "HealthyChildren.org (AAP)",
    title: "Umbilical Cord Care in Newborns",
    url: "https://www.healthychildren.org/English/ages-stages/baby/bathing-skin-care/Pages/Umbilical-Cord-Care.aspx",
    evidenceTier: "Hướng dẫn hiệp hội chuyên khoa (AAP)",
  },
  clevelandClinicOmphalitis: {
    organization: "Cleveland Clinic",
    title: "Omphalitis: Signs and Symptoms",
    url: "https://my.clevelandclinic.org/health/diseases/omphalitis",
    evidenceTier: "Bệnh viện học thuật lớn (Hoa Kỳ)",
  },
  nhsJaundiceInBabies: {
    organization: "NHS (Anh)",
    title: "Jaundice in babies",
    url: "https://www.nhs.uk/conditions/jaundice-in-babies/",
    evidenceTier: "Hướng dẫn y tế quốc gia (NHS)",
  },
  clevelandClinicKernicterus: {
    organization: "Cleveland Clinic",
    title: "Jaundice and Kernicterus: What's Normal for a Newborn?",
    url: "https://my.clevelandclinic.org/health/diseases/25014-kernicterus",
    evidenceTier: "Bệnh viện học thuật lớn (Hoa Kỳ)",
  },
  clevelandClinicYeastDiaperRash: {
    organization: "Cleveland Clinic",
    title: "Yeast Diaper Rash (Candida Diaper Dermatitis)",
    url: "https://my.clevelandclinic.org/health/diseases/22307-yeast-diaper-rash",
    evidenceTier: "Bệnh viện học thuật lớn (Hoa Kỳ)",
  },
  mdcalcRomeIVDyschezia: {
    organization: "MDCalc (đối chiếu tiêu chuẩn Rome IV)",
    title: "Rome IV Diagnostic Criteria for Infant Dyschezia",
    url: "https://www.mdcalc.com/calc/10314/rome-iv-diagnostic-criteria-infant-dyschezia",
    evidenceTier: "Công cụ lâm sàng đối chiếu tiêu chuẩn bình duyệt",
  },
  pmc8767117RomeIVColicConstipation: {
    organization: "PMC (tạp chí bình duyệt)",
    title: "Narrative Review: Prevalence of Infantile Colic, Regurgitation, and Constipation — Rome IV Criteria",
    url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC8767117/",
    evidenceTier: "Tổng quan bình duyệt",
  },
  cdcPickyEaters: {
    organization: "CDC",
    title: "Picky Eaters and What to Do",
    url: "https://www.cdc.gov/infant-toddler-nutrition/foods-and-drinks/picky-eaters.html",
    evidenceTier: "Hướng dẫn liên bang Hoa Kỳ",
  },
  healthyChildrenPickyEaters: {
    organization: "HealthyChildren.org (AAP)",
    title: "10 Tips for Parents of Picky Eaters",
    url: "https://www.healthychildren.org/English/ages-stages/toddler/nutrition/Pages/Picky-Eaters.aspx",
    evidenceTier: "Hướng dẫn hiệp hội chuyên khoa (AAP)",
  },
  aapNewsPfdIcd10: {
    organization: "AAP News",
    title: "New ICD-10-CM codes for pediatric feeding disorder",
    url: "https://publications.aap.org/aapnews/news/16585/New-ICD-10-CM-codes-for-pediatric-feeding-disorder",
    evidenceTier: "Tin tức hiệp hội chuyên khoa (AAP)",
  },
  nhsConstipationChildren: {
    organization: "NHS (Anh)",
    title: "Constipation in children",
    url: "https://www.nhs.uk/conditions/baby/health/constipation-in-children/",
    evidenceTier: "Hướng dẫn y tế quốc gia (NHS)",
  },
  niddkHirschsprung: {
    organization: "NIDDK (NIH)",
    title: "Hirschsprung Disease: Symptoms & Causes",
    url: "https://www.niddk.nih.gov/health-information/digestive-diseases/hirschsprung-disease/symptoms-causes",
    evidenceTier: "Viện nghiên cứu liên bang Hoa Kỳ (NIH)",
  },
  healthyChildrenAggressiveBehavior: {
    organization: "HealthyChildren.org (AAP)",
    title: "10 Tips to Prevent Aggressive Behavior in Young Children",
    url: "https://www.healthychildren.org/English/ages-stages/toddler/Pages/Aggressive-Behavior.aspx",
    evidenceTier: "Hướng dẫn hiệp hội chuyên khoa (AAP)",
  },
  aapEffectiveDiscipline2018Policy: {
    organization: "AAP (Pediatrics)",
    title: "Effective Discipline to Raise Healthy Children (Policy Statement 2018)",
    url: "https://publications.aap.org/pediatrics/article/142/6/e20183112/37452/Effective-Discipline-to-Raise-Healthy-Children",
    evidenceTier: "Chính sách hiệp hội chuyên khoa (AAP)",
  },
  naeycBiting: {
    organization: "NAEYC (Hiệp hội Giáo dục Mầm non Hoa Kỳ)",
    title: "Understanding and Responding to Children Who Bite",
    url: "https://www.naeyc.org/our-work/families/understanding-and-responding-children-who-bite",
    evidenceTier: "Tổ chức giáo dục mầm non chuyên môn",
  },
  nidcdStuttering: {
    organization: "NIDCD (NIH)",
    title: "Stuttering",
    url: "https://www.nidcd.nih.gov/health/stuttering",
    evidenceTier: "Viện nghiên cứu liên bang Hoa Kỳ (NIH)",
  },
  healthyChildrenStutteringToddlers: {
    organization: "HealthyChildren.org (AAP)",
    title: "Stuttering in Toddlers & Preschoolers: What's Typical, What's Not?",
    url: "https://www.healthychildren.org/English/ages-stages/toddler/Pages/Stuttering-in-Toddlers-Preschoolers.aspx",
    evidenceTier: "Hướng dẫn hiệp hội chuyên khoa (AAP)",
  },
  healthyChildrenPacifiersThumbSucking: {
    organization: "HealthyChildren.org (AAP)",
    title: "Baby Pacifiers & Thumb Sucking: What Parents Need to Know",
    url: "https://www.healthychildren.org/English/ages-stages/baby/crying-colic/Pages/Pacifiers-and-Thumb-Sucking.aspx",
    evidenceTier: "Hướng dẫn hiệp hội chuyên khoa (AAP)",
  },
  aacapTantrums: {
    organization: "AACAP (Hiệp hội Tâm thần Nhi khoa & Vị thành niên Hoa Kỳ)",
    title: "Temper Tantrums and Outbursts (Facts for Families)",
    url: "https://www.aacap.org/AACAP/Families_and_Youth/Facts_for_Families/FFF-Guide/Temper_Tantrums.aspx",
    evidenceTier: "Hướng dẫn hiệp hội chuyên khoa (AACAP)",
  },
  johnsHopkinsTantrums: {
    organization: "Johns Hopkins Medicine",
    title: "When to Worry about Toddler Temper Tantrums",
    url: "https://www.hopkinsmedicine.org/health/wellness-and-prevention/babies-and-toddlers-discipline/when-to-worry-about-toddler-temper-tantrums",
    evidenceTier: "Bệnh viện học thuật lớn (Hoa Kỳ)",
  },
  nhsHyperemesisGuysStThomas: {
    organization: "NHS (Guy's and St Thomas')",
    title: "Hyperemesis gravidarum",
    url: "https://www.guysandstthomas.nhs.uk/health-information/hyperemesis-gravidarum",
    evidenceTier: "Hướng dẫn y tế quốc gia (NHS)",
  },
  labcorpGdmScreeningAcog: {
    organization: "Labcorp (đối chiếu khuyến nghị ACOG)",
    title: "Gestational Diabetes Screen (ACOG Recommendations)",
    url: "https://www.labcorp.com/tests/102277/gestational-diabetes-screen-acog-recommendations",
    evidenceTier: "Hướng dẫn xét nghiệm đối chiếu ACOG",
  },
  nhsOgttGateshead: {
    organization: "NHS (Gateshead Health)",
    title: "Having an OGTT in Pregnancy",
    url: "https://www.gatesheadhealth.nhs.uk/resources/having-an-oral-glucose-tolerance-test-ogtt-in-pregnancy/",
    evidenceTier: "Hướng dẫn y tế quốc gia (NHS)",
  },
  acogExerciseCommitteeOpinion804: {
    organization: "ACOG",
    title: "Physical Activity and Exercise During Pregnancy and the Postpartum Period (Committee Opinion No. 804)",
    url: "https://www.acog.org/clinical/clinical-guidance/committee-opinion/articles/2020/04/physical-activity-and-exercise-during-pregnancy-and-the-postpartum-period",
    evidenceTier: "Hướng dẫn hiệp hội chuyên khoa (ACOG)",
  },
  cdcBreastfeedingWhatToExpect: {
    organization: "CDC",
    title: "What to Expect While Breastfeeding",
    url: "https://www.cdc.gov/infant-toddler-nutrition/breastfeeding/what-to-expect-while-breastfeeding.html",
    evidenceTier: "Hướng dẫn liên bang Hoa Kỳ",
  },
  cochraneLanolinNipple: {
    organization: "Cochrane",
    title: "The effect of breast milk and lanolin on sore nipples",
    url: "https://www.cochrane.org/evidence/CD007366_interventions-treating-painful-nipples-among-breastfeeding-women",
    evidenceTier: "Tổng quan hệ thống Cochrane",
  },
  pmcPartnerSupportPPDSystematicReview: {
    organization: "PMC (tạp chí bình duyệt)",
    title: "Couples-based interventions for perinatal depression and anxiety: A global systematic review",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC13033398/",
    evidenceTier: "Tổng quan hệ thống bình duyệt",
  },
  natureSocialSupportPPD: {
    organization: "Nature Scientific Reports (tạp chí bình duyệt)",
    title: "Association between social support and postpartum depression",
    url: "https://www.nature.com/articles/s41598-022-07248-7",
    evidenceTier: "Nghiên cứu bình duyệt",
  },
  merckManualPPD: {
    organization: "Merck Manual (Ấn bản chuyên môn)",
    title: "Postpartum Depression",
    url: "https://www.merckmanuals.com/professional/gynecology-and-obstetrics/postpartum-care-and-associated-disorders/postpartum-depression",
    evidenceTier: "Cẩm nang y khoa chuyên môn",
  },
  mdcalcEPDS: {
    organization: "MDCalc",
    title: "Edinburgh Postnatal Depression Scale (EPDS) Calculator",
    url: "https://www.mdcalc.com/calc/10466/edinburgh-postnatal-depression-scale-epds",
    evidenceTier: "Công cụ lâm sàng đối chiếu thang đo đã xác thực",
  },
  nichdEarlyChildCareStudy: {
    organization: "NICHD (NIH) Study of Early Child Care",
    title: "Nghiên cứu đoàn hệ lớn về chăm sóc trẻ sớm và gắn kết mẹ-con",
    url: "https://www.nichd.nih.gov/research/supported/seccyd",
    evidenceTier: "Nghiên cứu đoàn hệ đa trung tâm bình duyệt (NIH)",
  },
  cfocIllnessExclusionStandard: {
    organization: "Caring for Our Children (National Health and Safety Performance Standards)",
    title: "Tiêu chuẩn loại trừ trẻ ốm khỏi nhà trẻ dựa trên bằng chứng",
    url: "https://nrckids.org/CFOC",
    evidenceTier: "Tiêu chuẩn quốc gia dựa trên bằng chứng (Hoa Kỳ)",
  },
  aapMediaScreenFreeMealtimes: {
    organization: "AAP",
    title: "Family Media Use Plan — khuyến nghị bữa ăn không màn hình",
    url: "https://www.healthychildren.org/English/family-life/Media/Pages/How-to-Make-a-Family-Media-Use-Plan.aspx",
    evidenceTier: "Hướng dẫn hiệp hội chuyên khoa (AAP)",
  },
  sawicki1997SiblingPrep: {
    organization: "Pediatric Nursing (tạp chí bình duyệt)",
    title: "Hướng dẫn tư vấn chuẩn bị tâm lý cho anh/chị khi có em bé",
    url: "https://pubmed.ncbi.nlm.nih.gov/9382891/",
    evidenceTier: "Nghiên cứu/tư vấn lâm sàng bình duyệt",
  },
  cdcYellowBookTravelVaccine: {
    organization: "CDC (Yellow Book)",
    title: "Travel with Infants and Children — lịch tiêm chủng du lịch quốc tế",
    url: "https://wwwnc.cdc.gov/travel/yellowbook/2026/family/travel-with-infants-children",
    evidenceTier: "Hướng dẫn liên bang Hoa Kỳ (y tế du lịch)",
  },
  healthyChildrenAirTravelInfant: {
    organization: "HealthyChildren.org (AAP)",
    title: "Air Travel with Infants and Children",
    url: "https://www.healthychildren.org/English/family-life/Travel/Pages/Air-Travel-With-Infants-and-Children.aspx",
    evidenceTier: "Hướng dẫn hiệp hội chuyên khoa (AAP)",
  },
} satisfies Record<string, CuratedSource>;

const scientific = "SCIENTIFIC_GUIDELINE" as const;
const traditional = "TRADITIONAL_PRACTICE" as const;
const harmful = "POTENTIALLY_HARMFUL" as const;

export const curatedArticles: CuratedArticle[] = [
  {
    slug: "chuan-bi-mang-thai-checklist",
    title: "Checklist 3 tháng trước khi mang thai",
    summary: "Các việc nên chuẩn bị trước khi có thai: khám sức khỏe, thuốc đang dùng, tiêm chủng, lối sống và bệnh nền.",
    content: `## Bắt đầu từ đâu
- Đặt lịch khám tiền thai với bác sĩ sản khoa, đặc biệt nếu mẹ có bệnh nền, từng sảy thai, sinh non hoặc đang dùng thuốc dài ngày.
- Rà soát toàn bộ thuốc kê đơn, thuốc không kê đơn, vitamin và thảo dược. Không tự ngừng thuốc điều trị bệnh nền.
- Kiểm tra tình trạng tiêm chủng, sức khỏe răng miệng và các xét nghiệm cần thiết theo tiền sử.
- Ngừng thuốc lá, thuốc lá điện tử, rượu và chất kích thích; tránh khói thuốc thụ động.
- Ăn đa dạng, vận động đều, ngủ đủ và hướng tới cân nặng phù hợp trước thai kỳ.

## Cùng chuẩn bị với người bạn đời
- Chia sẻ tiền sử bệnh gia đình và nguy cơ di truyền với nhân viên y tế.
- Thống nhất hỗ trợ việc nhà, tài chính, nơi khám và kế hoạch khi có tình huống khẩn cấp.

Lưu ý: Không có một gói xét nghiệm giống nhau cho mọi người. Bác sĩ sẽ cá thể hóa theo tuổi, bệnh sử và nguy cơ.`,
    category: "Chuẩn bị mang thai",
    stage: "PRECONCEPTION",
    evidenceLevel: "STRONG",
    knowledgeType: scientific,
    sources: [sources.planning],
  },
  {
    slug: "acid-folic-truoc-va-dau-thai-ky",
    title: "Axit folic: nên dùng trước khi có thai",
    summary: "Folic acid giúp giảm nguy cơ dị tật ống thần kinh; nên bắt đầu ít nhất 1 tháng trước khi mang thai.",
    content: `## Khuyến nghị chung
- Phụ nữ có khả năng mang thai thường được khuyến nghị bổ sung 400 microgam axit folic mỗi ngày, bắt đầu ít nhất 1 tháng trước khi có thai và tiếp tục trong giai đoạn đầu thai kỳ.
- Khi mang thai, nhu cầu folate tổng thể tăng; vitamin trước sinh thường cung cấp phần bổ sung cần thiết.
- Ăn thêm rau lá xanh, đậu, ngũ cốc tăng cường vi chất và trái cây, nhưng thực phẩm không luôn thay thế đủ viên bổ sung.

## Khi nào cần hỏi bác sĩ
Một số người có thể cần liều khác, ví dụ từng có thai bị dị tật ống thần kinh hoặc đang dùng một số thuốc. Không tự dùng liều cao vì liều phù hợp cần dựa trên bệnh sử.`,
    category: "Dinh dưỡng của mẹ",
    stage: "PRECONCEPTION",
    evidenceLevel: "STRONG",
    knowledgeType: scientific,
    sources: [sources.planning, sources.pregnancyNutrition],
  },
  {
    slug: "thuoc-vaccine-chat-kich-thich-truoc-thai-ky",
    title: "Thuốc, vaccine và chất cần tránh trước thai kỳ",
    summary: "Rà soát thuốc và vaccine trước khi mang thai; không có mức rượu nào được biết là an toàn trong thai kỳ.",
    content: `## Việc cần làm
- Mang danh sách hoặc vỏ của mọi thuốc, thực phẩm bổ sung và thảo dược tới buổi khám tiền thai.
- Hỏi bác sĩ vaccine nào cần tiêm trước thai kỳ và cần chờ bao lâu trước khi thụ thai.
- Ngừng rượu khi bắt đầu có ý định mang thai; tránh thuốc lá, cần sa và các chất kích thích.
- Giảm tiếp xúc hóa chất độc hại, phân mèo và động vật gặm nhấm; dùng bảo hộ nếu công việc có nguy cơ.

Không tự ngừng thuốc: Một số thuốc có nguy cơ cho thai, nhưng ngừng đột ngột thuốc động kinh, tâm thần, huyết áp hoặc bệnh mạn tính cũng có thể nguy hiểm. Hãy đổi thuốc cùng bác sĩ.`,
    category: "An toàn",
    stage: "PRECONCEPTION",
    evidenceLevel: "STRONG",
    knowledgeType: scientific,
    sources: [sources.planning, sources.alcohol],
  },
  {
    slug: "lich-kham-thai-va-cac-moc-quan-trong",
    title: "Lịch khám thai và các mốc quan trọng",
    summary: "Khám sớm và đều giúp theo dõi sức khỏe mẹ, sự phát triển của thai và phát hiện nguy cơ kịp thời.",
    content: `## Trong thai kỳ
- Khám thai sớm để xác nhận tuổi thai, ngày dự sinh và đánh giá nguy cơ.
- Mỗi lần khám thường theo dõi huyết áp, cân nặng và các dấu hiệu cần lưu ý; xét nghiệm được chỉ định theo từng giai đoạn.
- Các mốc thường gặp gồm siêu âm xác định tuổi thai, xét nghiệm máu và nhiễm trùng, sàng lọc đái tháo đường thai kỳ và theo dõi tăng trưởng thai.
- Từ nửa sau thai kỳ, mẹ được hướng dẫn theo dõi cử động thai và chuẩn bị kế hoạch sinh.

Lưu ý: Lịch cụ thể phụ thuộc hướng dẫn tại Việt Nam, tuổi thai và mức nguy cơ. Thai kỳ nguy cơ cao cần theo dõi dày hơn.`,
    category: "Khám thai",
    stage: "PREGNANCY",
    evidenceLevel: "STRONG",
    knowledgeType: scientific,
    sources: [sources.antenatal],
  },
  {
    slug: "dinh-duong-va-vi-chat-khi-mang-thai",
    title: "Ăn uống và vi chất khi mang thai",
    summary: "Ưu tiên bữa ăn đa dạng và dùng vitamin trước sinh đúng liều; không cần “ăn cho hai người”.",
    content: `## Một bữa ăn cân bằng
- Kết hợp rau quả, ngũ cốc nguyên hạt, đạm từ thịt cá trứng đậu, sữa hoặc thực phẩm thay thế phù hợp và chất béo lành mạnh.
- Chú ý sắt, folate, canxi, i-ốt, vitamin D, choline và omega-3 từ thực phẩm và viên bổ sung được tư vấn.
- Uống đủ nước; chia nhỏ bữa nếu buồn nôn hoặc ợ nóng.

## Dùng viên bổ sung an toàn
- Dùng một khẩu phần vitamin trước sinh mỗi ngày theo nhãn và hướng dẫn của bác sĩ.
- Không uống gấp đôi để “bù”; quá liều một số chất, đặc biệt vitamin A dạng retinol, có thể gây hại.
- Người ăn chay, thiếu máu hoặc có bệnh lý cần kế hoạch riêng.

Mẹo thực tế: Kết hợp thực phẩm giàu sắt với vitamin C; tránh uống trà hoặc cà phê ngay cùng bữa giàu sắt.`,
    category: "Dinh dưỡng của mẹ",
    stage: "PREGNANCY",
    evidenceLevel: "STRONG",
    knowledgeType: scientific,
    sources: [sources.pregnancyNutrition, sources.antenatal],
  },
  {
    slug: "thuc-pham-can-tranh-khi-mang-thai",
    title: "Thực phẩm và đồ uống cần tránh khi mang thai",
    summary: "Tránh rượu, thực phẩm sống hoặc chưa tiệt trùng và cá thủy ngân cao; giữ an toàn thực phẩm.",
    content: `## Nên tránh
- Rượu bia ở mọi dạng: chưa xác định được lượng hay thời điểm nào an toàn trong thai kỳ.
- Thịt, cá, trứng hoặc hải sản sống/chưa chín kỹ; sữa và nước trái cây chưa tiệt trùng.
- Cá có hàm lượng thủy ngân cao; chọn các loại cá ít thủy ngân và ăn lượng phù hợp theo tư vấn địa phương.
- Thực phẩm để lâu ở nhiệt độ phòng hoặc không rõ điều kiện bảo quản.

## Trong bếp
- Rửa tay, tách đồ sống khỏi đồ chín, nấu chín kỹ và làm lạnh sớm.
- Rửa rau quả dưới vòi nước sạch; không dùng xà phòng để rửa thực phẩm.

Lưu ý: Caffeine cần được giới hạn theo tư vấn sản khoa. Thảo dược “tự nhiên” vẫn có thể tương tác thuốc hoặc không an toàn.`,
    category: "An toàn thực phẩm",
    stage: "PREGNANCY",
    evidenceLevel: "STRONG",
    knowledgeType: scientific,
    sources: [sources.pregnancyNutrition, sources.alcohol],
  },
  {
    slug: "van-dong-ngu-va-kho-chiu-thai-ky",
    title: "Vận động, giấc ngủ và khó chịu thường gặp",
    summary: "Vận động vừa sức và các điều chỉnh đơn giản thường giúp mẹ khỏe hơn, nếu không có chống chỉ định.",
    content: `## Chăm sóc hằng ngày
- Duy trì vận động mức vừa như đi bộ nếu bác sĩ không dặn hạn chế; tăng từ từ nếu trước đây ít vận động.
- Nghỉ khi chóng mặt, đau, khó thở bất thường, ra máu hoặc có cơn co; liên hệ nhân viên y tế.
- Buồn nôn: thử bữa nhỏ, thức ăn nhạt và tránh mùi kích thích. Táo bón: tăng nước, chất xơ và vận động nhẹ.
- Ợ nóng: ăn ít mỗi bữa, không nằm ngay sau ăn. Đau lưng: chú ý tư thế và tránh nâng vật nặng sai cách.

Không tự dùng thuốc: Kể cả thuốc cảm, giảm đau, thuốc nam hoặc tinh dầu cũng cần kiểm tra độ an toàn trong thai kỳ.`,
    category: "Chăm sóc thai kỳ",
    stage: "PREGNANCY",
    evidenceLevel: "MODERATE",
    knowledgeType: scientific,
    sources: [sources.antenatal],
  },
  {
    slug: "dau-hieu-nguy-hiem-khi-mang-thai",
    title: "Dấu hiệu nguy hiểm trong thai kỳ",
    summary: "Ra máu nhiều, khó thở, đau ngực, co giật, đau đầu dữ dội hoặc thai giảm cử động cần được đánh giá ngay.",
    content: `## Đi cấp cứu hoặc liên hệ cơ sở y tế ngay
- Khó thở, đau ngực, ngất, co giật hoặc lú lẫn.
- Chảy máu âm đạo nhiều, đau bụng dữ dội hoặc dịch chảy ra nghi vỡ ối.
- Đau đầu dữ dội không giảm, nhìn mờ, sưng mặt/tay đột ngột.
- Sốt, nôn liên tục không giữ được nước, hoặc cảm giác rất yếu.
- Thai giảm hoặc ngừng cử động so với kiểu thường ngày sau khi đã bắt đầu cảm nhận đều.
- Ý nghĩ làm hại bản thân.

Quan trọng: Danh sách không bao quát mọi tình huống. Nếu mẹ cảm thấy “có gì đó không ổn”, hãy đi khám và nói rõ mình đang mang thai.`,
    category: "Dấu hiệu nguy hiểm",
    stage: "PREGNANCY",
    evidenceLevel: "STRONG",
    knowledgeType: scientific,
    sources: [sources.maternalWarnings, sources.antenatal],
  },
  {
    slug: "ke-hoach-sinh-va-tuan-dau-sau-sinh",
    title: "Chuẩn bị sinh và tuần đầu sau sinh",
    summary: "Lập kế hoạch linh hoạt cho nơi sinh, người hỗ trợ, cho bú, chăm sóc sau sinh và tình huống khẩn cấp.",
    content: `## Trước ngày sinh
- Chọn cơ sở sinh và đường đi; lưu số điện thoại cần thiết, giấy tờ, hồ sơ thai và nhóm máu nếu có.
- Trao đổi mong muốn về da kề da, cho bú sớm, giảm đau và người đồng hành; kế hoạch có thể thay đổi vì an toàn.
- Chuẩn bị người hỗ trợ việc nhà, bữa ăn và thời gian nghỉ của mẹ trong những tuần đầu.

## Sau sinh
- Mẹ và bé cần được theo dõi tại cơ sở y tế đủ thời gian và có các lần kiểm tra trong 6 tuần đầu.
- Hỏi rõ cách chăm vết mổ/tầng sinh môn, thuốc, kế hoạch tái khám, tránh thai sau sinh và dấu hiệu nguy hiểm.
- Lưu lịch tiêm chủng và khám của bé theo chương trình tại Việt Nam.`,
    category: "Chuẩn bị sinh",
    stage: "PREGNANCY",
    evidenceLevel: "STRONG",
    knowledgeType: scientific,
    sources: [sources.antenatal, sources.postnatal],
  },
  {
    slug: "phuc-hoi-6-tuan-dau-sau-sinh",
    title: "Phục hồi trong 6 tuần đầu sau sinh",
    summary: "Nghỉ ngơi, vận động tăng dần, chăm vết thương và tái khám là nền tảng phục hồi sau sinh.",
    content: `## Chăm sóc cơ thể
- Nghỉ khi có thể, nhận giúp đỡ và tăng vận động từ từ; tránh gắng sức nếu đau hoặc chảy máu tăng.
- Giữ vết mổ hoặc tầng sinh môn sạch, khô và làm đúng hướng dẫn xuất viện.
- Sản dịch thường thay đổi màu và giảm dần. Mùi hôi, sốt, đau tăng hoặc chảy máu nhiều cần khám.
- Ăn đa dạng, uống theo khát và dùng thuốc/vi chất đúng chỉ định.

## Các lần theo dõi
WHO khuyến nghị chăm sóc sớm trong 24 giờ đầu và thêm các lần liên hệ trong 6 tuần đầu. Lịch cụ thể tùy nơi sinh và nguy cơ của mẹ-bé.

Lưu ý: Phục hồi không phải cuộc thi. Đau khiến mẹ không thể tự chăm sóc hoặc chăm bé là lý do để liên hệ bác sĩ.`,
    category: "Hậu sản",
    stage: "POSTPARTUM",
    evidenceLevel: "STRONG",
    knowledgeType: scientific,
    sources: [sources.postnatal, sources.postpartumPain],
  },
  {
    slug: "dinh-duong-me-cho-con-bu",
    title: "Dinh dưỡng cho mẹ đang cho con bú",
    summary: "Mẹ không cần kiêng khem rộng rãi; ưu tiên thực phẩm đa dạng, đủ nước và tư vấn vi chất theo chế độ ăn.",
    content: `## Ăn uống thực tế
- Ăn đa dạng đủ nhóm thực phẩm và tăng lượng theo cảm giác đói; nhu cầu phụ thuộc thể trạng, hoạt động và mức độ cho bú.
- Uống khi khát và để nước ở nơi thường cho bé bú. Không có đồ uống đặc biệt nào bắt buộc để “gọi sữa”.
- Không cần kiêng thực phẩm chỉ vì sợ bé “lạnh bụng” nếu mẹ và bé không có phản ứng rõ ràng.
- Người ăn chay/thuần chay nên hỏi bác sĩ về vitamin B12, sắt, i-ốt và các chất khác.

## Caffeine và rượu
Caffeine truyền vào sữa với lượng nhỏ; nếu bé khó ngủ hoặc bồn chồn, mẹ nên giảm. An toàn nhất là tránh rượu; hãy hỏi chuyên gia nếu cần hướng dẫn cụ thể về thời điểm cho bú.`,
    category: "Dinh dưỡng của mẹ",
    stage: "POSTPARTUM",
    evidenceLevel: "MODERATE",
    knowledgeType: scientific,
    sources: [sources.feeding, sources.breastfeedingVi],
  },
  {
    slug: "suc-khoe-tinh-than-sau-sinh",
    title: "Sức khỏe tinh thần sau sinh",
    summary: "Buồn thoáng qua có thể gặp, nhưng buồn kéo dài, lo âu nặng hoặc ý nghĩ gây hại cần được hỗ trợ chuyên môn.",
    content: `## Điều cần quan sát
- Những ngày đầu có thể dễ khóc, nhạy cảm và kiệt sức. Nếu triệu chứng nặng, kéo dài quá khoảng 2 tuần hoặc cản trở sinh hoạt, hãy tìm hỗ trợ.
- Trầm cảm và lo âu sau sinh có thể xảy ra với bất kỳ ai; đây không phải lỗi của mẹ.
- Nói thật với người thân và nhân viên y tế về giấc ngủ, lo âu, suy nghĩ ám ảnh hoặc cảm giác mất kết nối với bé.

## Cần cấp cứu ngay
- Có ý nghĩ làm hại bản thân hoặc em bé.
- Nghe hoặc thấy điều người khác không thấy, hoang mang nặng, kích động bất thường hoặc mất liên hệ thực tế.

Đừng ở một mình trong tình huống khẩn cấp. Nhờ người tin cậy ở cạnh và đến cơ sở cấp cứu gần nhất.`,
    category: "Tinh thần của mẹ",
    stage: "POSTPARTUM",
    evidenceLevel: "STRONG",
    knowledgeType: scientific,
    sources: [sources.postnatal, sources.maternalWarnings],
  },
  {
    slug: "dau-hieu-nguy-hiem-sau-sinh",
    title: "Dấu hiệu nguy hiểm của mẹ sau sinh",
    summary: "Biến chứng có thể xuất hiện sau khi về nhà; đau ngực, khó thở, co giật hay chảy máu nhiều cần cấp cứu.",
    content: `## Cấp cứu ngay
- Đau ngực, thở gấp hoặc khó thở, co giật, ngất hoặc lú lẫn.
- Chảy máu thấm ướt khoảng hai băng vệ sinh mỗi giờ trong hơn một đến hai giờ, hoặc choáng yếu.
- Đau bụng dưới dữ dội, đau/sưng/đỏ một chân, hoặc ý nghĩ làm hại mình hay bé.

## Liên hệ bác sĩ ngay trong ngày
- Sốt từ 38°C, đau đầu không giảm hoặc kèm thay đổi thị giác.
- Nôn dai dẳng, đau khi tiểu, vết mổ đỏ/sưng/chảy dịch, sản dịch hôi.
- Vú đỏ nóng đau kèm sốt hoặc cảm giác giống cúm.

Khi đi khám, hãy nói rõ mẹ mới sinh và ngày sinh, kể cả khi triệu chứng tưởng không liên quan.`,
    category: "Dấu hiệu nguy hiểm",
    stage: "POSTPARTUM",
    evidenceLevel: "STRONG",
    knowledgeType: scientific,
    sources: [sources.postpartumPain, sources.maternalWarnings],
  },
  {
    slug: "cham-soc-be-so-sinh-hang-ngay",
    title: "Chăm sóc bé sơ sinh hằng ngày",
    summary: "Giữ ấm vừa phải, da kề da, vệ sinh tay, bú theo nhu cầu và chăm rốn khô sạch.",
    content: `## Những nền tảng đầu tiên
- Da kề da giúp giữ ấm và hỗ trợ gắn kết, bú mẹ; luôn giữ đường thở của bé thông thoáng và có người tỉnh táo quan sát.
- Cho bé ở gần mẹ và bú theo dấu hiệu đói. Rửa tay trước khi chạm bé và sau thay tã.
- Trì hoãn lần tắm đầu ít nhất 24 giờ nếu điều kiện cho phép; sau đó tắm nhanh trong phòng ấm và không bao giờ để bé một mình gần nước.
- Giữ cuống rốn sạch, khô, gập mép tã xuống dưới rốn; không bôi lá, bột, dầu hay thuốc nếu nhân viên y tế không chỉ định.
- Đưa bé đi khám sàng lọc, tiêm chủng và tái khám đúng hẹn.

Lưu ý: Trẻ sinh non, nhẹ cân, vàng da hoặc có bệnh cần kế hoạch chăm sóc riêng.`,
    category: "Chăm sóc sơ sinh",
    stage: "NEWBORN_0_28_DAYS",
    minimumAgeDays: 0,
    maximumAgeDays: 28,
    evidenceLevel: "STRONG",
    knowledgeType: scientific,
    sources: [sources.newbornCare, sources.postnatal],
  },
  {
    slug: "bu-me-va-dau-hieu-be-bu-du",
    title: "Bú mẹ và dấu hiệu bé nhận đủ sữa",
    summary: "Bú theo nhu cầu, quan sát ngậm bắt vú, tã ướt và tăng trưởng hữu ích hơn việc áp một lịch cứng cho mọi bé.",
    content: `## Cho bú theo dấu hiệu
- Dấu hiệu đói sớm gồm cựa mình, tìm vú, đưa tay lên miệng; khóc là dấu hiệu muộn.
- Đưa bé sát người, đầu và thân thẳng; miệng ngậm sâu. Đau núm vú kéo dài, nứt chảy máu hoặc bé tách vú liên tục cần được kiểm tra khớp ngậm.
- Bú mẹ hoàn toàn nghĩa là không thêm nước, trà, mật ong hay thức ăn khác trong 6 tháng đầu, trừ thuốc hoặc vi chất được chỉ định.

## Theo dõi đủ sữa
- Quan sát tiếng nuốt, bé tỉnh táo phù hợp, số tã ướt tăng trong những ngày đầu và đường tăng trưởng qua các lần khám.
- Cân nặng có thể giảm sinh lý ban đầu nhưng cần được nhân viên y tế theo dõi.

Đi khám sớm nếu bé bú kém rõ rệt, khó đánh thức để bú, tiểu rất ít, khô miệng hoặc vàng da tăng.`,
    category: "Bú và dinh dưỡng",
    stage: "NEWBORN_0_28_DAYS",
    minimumAgeDays: 0,
    maximumAgeDays: 28,
    evidenceLevel: "STRONG",
    knowledgeType: scientific,
    sources: [sources.feeding, sources.breastfeedingVi],
  },
  {
    slug: "ngu-an-toan-cho-be",
    title: "Giấc ngủ an toàn cho bé dưới 1 tuổi",
    summary: "Luôn đặt bé nằm ngửa trên mặt phẳng chắc, phẳng và để nôi trống cho mọi giấc ngủ.",
    content: `## Mỗi lần bé ngủ
- Đặt bé nằm ngửa, kể cả ngủ trưa và ban đêm.
- Dùng nệm chắc, phẳng, vừa khít với cũi/nôi và ga bọc vừa vặn.
- Để không gian ngủ trống: không gối, chăn rời, thú bông, quây cũi hoặc đồ định vị.
- Cho bé ngủ cùng phòng với người chăm sóc, trên bề mặt ngủ riêng, lý tưởng ít nhất 6 tháng đầu.
- Tránh khói thuốc và tránh để bé quá nóng.

## Nếu bé lăn được
Vẫn đặt bé nằm ngửa lúc bắt đầu giấc. Khi bé tự lăn hai chiều, không cần liên tục lật lại, nhưng nôi phải hoàn toàn trống.

Nguy hiểm: Không để bé ngủ thường xuyên trên sofa, ghế bành, võng, ghế ô tô ngoài lúc di chuyển hoặc bề mặt nghiêng. Người chăm sóc đã uống rượu hay dùng thuốc gây buồn ngủ càng không được ngủ chung bề mặt với bé.`,
    category: "Giấc ngủ",
    stage: "NEWBORN_0_28_DAYS",
    minimumAgeDays: 0,
    maximumAgeDays: 28,
    evidenceLevel: "STRONG",
    knowledgeType: scientific,
    sources: [sources.safeSleep],
  },
  {
    slug: "be-quay-khoc-va-colic",
    title: "Bé quấy khóc, khóc dạ đề: làm gì an toàn?",
    summary: "Kiểm tra nhu cầu cơ bản, dỗ nhẹ nhàng và xin trợ giúp khi quá tải; tuyệt đối không rung lắc bé.",
    content: `## Thử theo thứ tự
- Kiểm tra bé đói, tã bẩn, quá nóng/lạnh, cần ợ hơi hoặc cần được ôm.
- Ôm sát, đung đưa nhẹ, nói nhỏ hoặc dùng âm thanh đều ở mức nhỏ; giảm ánh sáng và kích thích.
- Ghi lại thời điểm, thời lượng khóc và liên quan tới cữ bú để trao đổi khi khám.
- Các loại nước lá, men vi sinh hay thuốc “chống colic” không nên tự dùng vì bằng chứng hạn chế và có thể gây hại.

## Khi người chăm sóc sắp mất bình tĩnh
Đặt bé nằm ngửa trong cũi trống an toàn, rời phòng vài phút để bình tĩnh và gọi người hỗ trợ. Tuyệt đối không rung, lắc hoặc đánh bé.

Đi khám ngay nếu tiếng khóc yếu/cao khác thường, bé khó thở, sốt hoặc lạnh, nôn vọt, phát ban không mất màu khi ấn, bú kém hay không có tã ướt trong nhiều giờ.`,
    category: "Mẹo dân gian & sự thật",
    stage: "NEWBORN_0_28_DAYS",
    minimumAgeDays: 0,
    maximumAgeDays: 120,
    evidenceLevel: "MODERATE",
    knowledgeType: traditional,
    sources: [sources.crying, sources.colic],
  },
  {
    slug: "van-minh-ran-do-va-ngu-khong-yen",
    title: "“Vặn mình”, rặn đỏ mặt và ngủ không yên",
    summary: "Nhiều cử động, tiếng rên và rặn ở bé nhỏ là do hệ thần kinh-tiêu hóa còn non; không nên tự bổ sung hay chữa mẹo.",
    content: `## Điều thường có thể gặp
Bé sơ sinh có thể duỗi, co người, giật mình, phát tiếng trong lúc ngủ hoặc đỏ mặt khi cố phối hợp rặn. Nếu bé vẫn bú, thở, tỉnh và tăng trưởng bình thường, đây thường không đồng nghĩa thiếu canxi hay bệnh.

## Mẹ có thể làm
- Theo dõi thời điểm, quay video ngắn nếu cần cho bác sĩ xem.
- Vỗ ợ sau bú khi phù hợp, tránh ép bú quá mức và luôn giữ giấc ngủ an toàn.
- Hỏi bác sĩ trước khi dùng canxi, vitamin D, men, thuốc hoặc thảo dược. Vitamin D có chỉ định theo chế độ bú và hướng dẫn y tế, không dựa riêng vào biểu hiện “vặn mình”.

## Cần khám
Các cử động lặp nhịp không dừng khi giữ nhẹ, tím tái, mắt lệch, ngừng thở, bỏ bú, sốt, nôn xanh hoặc bụng chướng là dấu hiệu cần đánh giá khẩn cấp.`,
    category: "Mẹo dân gian & sự thật",
    stage: "NEWBORN_0_28_DAYS",
    minimumAgeDays: 0,
    maximumAgeDays: 120,
    evidenceLevel: "LIMITED",
    knowledgeType: traditional,
    sources: [sources.newbornCare, sources.newbornDanger],
  },
  {
    slug: "cham-soc-ron-va-tam-be",
    title: "Chăm rốn và tắm bé đúng cách",
    summary: "Rốn cần sạch và khô; không đắp lá, tro, dầu hoặc chất không được nhân viên y tế chỉ định.",
    content: `## Chăm rốn khô
- Rửa tay trước và sau khi chăm rốn.
- Gập tã dưới cuống rốn, để thoáng; nếu bẩn, làm sạch bằng nước sạch rồi thấm khô.
- Cuống thường tự rụng; không giật dù chỉ còn dính một phần nhỏ.

## Tắm an toàn
- Chuẩn bị đủ đồ trước khi tắm, kiểm tra nước bằng tay và luôn giữ một tay trên bé.
- Tắm nhanh trong phòng ấm, lau khô và mặc đồ ngay.
- Không để bé một mình dù chỉ vài giây, kể cả trong chậu rất nông.

Đi khám nếu vùng đỏ lan ra da bụng, sưng nóng, có mủ/mùi hôi, chảy máu không dừng hoặc bé sốt/bú kém.`,
    category: "Chăm sóc sơ sinh",
    stage: "NEWBORN_0_28_DAYS",
    minimumAgeDays: 0,
    maximumAgeDays: 28,
    evidenceLevel: "STRONG",
    knowledgeType: scientific,
    sources: [sources.newbornCare],
  },
  {
    slug: "meo-dan-gian-can-tranh-cho-tre-so-sinh",
    title: "Những mẹo dân gian nên tránh ở trẻ sơ sinh",
    summary: "Đắp chất lên rốn, cho uống mật ong/nước lá, hơ than hay rung lắc đều có thể gây nguy hiểm.",
    content: `## Không nên làm
- Không đắp lá, tro, bột, dầu, thuốc hoặc đồng xu lên rốn: có thể gây nhiễm trùng và che lấp dấu hiệu bất thường.
- Không cho trẻ dưới 6 tháng uống nước, trà hay nước lá; không cho trẻ dưới 12 tháng dùng mật ong.
- Không hơ than trong phòng kín hoặc đặt nguồn nhiệt sát mẹ và bé: nguy cơ bỏng, ngạt khí và cháy.
- Không nặn tuyến vú của bé, chọc vỡ mụn, cạo lông tơ hay chà xát da mạnh.
- Không rung lắc, bẻ chân tay, nắn đầu hay tác động cột sống để chữa khóc/vặn mình.
- Không tự mua kháng sinh, thuốc ho-cảm, thuốc ngủ, men hay thảo dược cho bé.

Thay thế an toàn: Giữ vệ sinh, chăm rốn khô, bú phù hợp, da kề da có giám sát và hỏi nhân viên y tế khi lo lắng.`,
    category: "Mẹo dân gian & sự thật",
    stage: "NEWBORN_0_28_DAYS",
    minimumAgeDays: 0,
    maximumAgeDays: 90,
    evidenceLevel: "POTENTIALLY_HARMFUL",
    knowledgeType: harmful,
    sources: [sources.newbornCare, sources.crying, sources.feeding],
  },
  {
    slug: "dau-hieu-nguy-hiem-o-tre-so-sinh",
    title: "Dấu hiệu nguy hiểm ở trẻ sơ sinh",
    summary: "Bú kém, co giật, thở nhanh/khó, ít cử động, sốt hoặc hạ thân nhiệt và vàng da sớm cần khám ngay.",
    content: `## Đưa bé đi cấp cứu hoặc cơ sở y tế ngay
- Không bú được hoặc bú kém rõ rệt, khó đánh thức, ít hoặc không cử động tự nhiên.
- Co giật, tím tái, ngừng thở, rút lõm lồng ngực hoặc thở rất nhanh.
- Nhiệt độ từ 38°C ở trẻ dưới 3 tháng; hoặc thân nhiệt thấp, da lạnh bất thường.
- Vàng da xuất hiện trong 24 giờ đầu, vàng tăng nhanh hoặc vàng tới lòng bàn tay/bàn chân.
- Nôn màu xanh, bụng chướng, phân có máu, mất nước hoặc không tiểu.
- Rốn đỏ lan, có mủ/mùi hôi kèm bé mệt hoặc sốt.

Không chờ mẹo tại nhà có tác dụng. Trẻ sơ sinh có thể xấu đi nhanh; nếu phân vân, nên gọi cơ sở y tế và đi khám sớm.`,
    category: "Dấu hiệu nguy hiểm",
    stage: "NEWBORN_0_28_DAYS",
    minimumAgeDays: 0,
    maximumAgeDays: 28,
    evidenceLevel: "STRONG",
    knowledgeType: scientific,
    sources: [sources.newbornDanger, sources.newbornCare],
  },
  {
    slug: "bu-va-tang-truong-1-3-thang",
    title: "Bú và tăng trưởng giai đoạn 1–3 tháng",
    summary: "Tiếp tục sữa mẹ hoàn toàn khi có thể hoặc sữa công thức pha đúng hướng dẫn; theo dõi đường tăng trưởng thay vì so sánh từng bé.",
    content: `## Dinh dưỡng chính
- Sữa mẹ hoặc sữa công thức dành cho trẻ nhỏ là nguồn dinh dưỡng chính; không thêm nước, bột, mật ong hay nước trái cây.
- Bú theo dấu hiệu đói-no. Không ép bé uống hết bình và không kê bình cho bé tự bú.
- Pha sữa đúng tỷ lệ trên nhãn bằng dụng cụ sạch; không tự pha loãng hay đặc hơn.

## Theo dõi tăng trưởng
Cân nặng, chiều dài và vòng đầu cần được đặt trên biểu đồ tăng trưởng qua nhiều lần đo. Một con số đơn lẻ ít ý nghĩa hơn xu hướng.

Khám sớm nếu bé bú giảm, nôn vọt lặp lại, ít tã ướt, lừ đừ hoặc không tăng cân như dự kiến.`,
    category: "Bú và dinh dưỡng",
    stage: "INFANT_1_3_MONTHS",
    minimumAgeDays: 29,
    maximumAgeDays: 91,
    evidenceLevel: "STRONG",
    knowledgeType: scientific,
    sources: [sources.feeding],
  },
  {
    slug: "choi-va-phat-trien-1-3-thang",
    title: "Chơi và phát triển cùng bé 1–3 tháng",
    summary: "Nói chuyện, giao tiếp mắt và tummy time khi thức giúp phát triển; mỗi bé có nhịp riêng.",
    content: `## Hoạt động đơn giản
- Nói, hát và đáp lại âm thanh/cử chỉ của bé; cho bé nhìn khuôn mặt ở khoảng cách gần.
- Cho nằm sấp khi thức, tỉnh táo và có người quan sát, bắt đầu ngắn rồi tăng dần.
- Đặt đồ chơi tương phản an toàn trước mặt để bé nhìn và xoay đầu; tránh màn hình.
- Đổi bên bế và hướng đầu trong cũi để giảm tì một điểm, nhưng khi ngủ vẫn luôn nằm ngửa.

## Theo dõi chứ không chấm điểm
Mốc phát triển mô tả điều đa số trẻ làm được ở một độ tuổi, không phải hạn chót cứng. Nếu bé mất kỹ năng đã có, ít phản ứng với âm thanh/khuôn mặt hoặc mẹ có bất kỳ lo lắng nào, hãy trao đổi sớm với bác sĩ.`,
    category: "Phát triển",
    stage: "INFANT_1_3_MONTHS",
    minimumAgeDays: 29,
    maximumAgeDays: 91,
    evidenceLevel: "MODERATE",
    knowledgeType: scientific,
    sources: [sources.milestones],
  },
  {
    slug: "vitamin-d-va-vi-chat-cho-be",
    title: "Vitamin D và vi chất cho bé",
    summary: "Trẻ bú mẹ thường cần nguồn vitamin D bổ sung; liều và sản phẩm nên được xác nhận với nhân viên y tế.",
    content: `## Điều cần biết
- Sữa mẹ thường không cung cấp đủ vitamin D. Nhiều hướng dẫn khuyến nghị trẻ bú mẹ hoàn toàn hoặc một phần bổ sung 400 IU vitamin D mỗi ngày từ những ngày đầu.
- Trẻ uống đủ lượng sữa công thức tăng cường vitamin D có thể không cần bổ sung giống trẻ bú mẹ; hãy hỏi bác sĩ theo lượng sữa thực tế.
- Dùng đúng ống nhỏ giọt của sản phẩm và kiểm tra đơn vị trên nhãn vì nồng độ có thể khác nhau.

Không tự tăng liều: Vitamin D quá liều có thể gây hại. Trẻ sinh non, bệnh gan-thận hoặc có vấn đề hấp thu cần chỉ định riêng.`,
    category: "Vi chất",
    stage: "INFANT_1_3_MONTHS",
    minimumAgeDays: 29,
    maximumAgeDays: 365,
    evidenceLevel: "STRONG",
    knowledgeType: scientific,
    sources: [sources.vitaminD],
  },
  {
    slug: "ngu-va-lan-lay-3-6-thang",
    title: "Ngủ an toàn khi bé bắt đầu lẫy",
    summary: "Ngừng quấn khi bé có dấu hiệu lẫy; vẫn đặt nằm ngửa và giữ cũi trống.",
    content: `## Khi bé chuẩn bị lẫy
- Ngừng quấn chặt tay ngay khi bé có dấu hiệu cố lăn; túi ngủ vừa vặn, không làm nặng là lựa chọn khác.
- Luôn đặt bé nằm ngửa khi bắt đầu giấc ngủ.
- Nếu bé tự lăn hai chiều, có thể để bé tự chọn tư thế; không dùng gối chặn hoặc đồ định vị.
- Hạ mặt nệm cũi khi bé bắt đầu chống tay/ngồi và loại bỏ vật bé có thể giẫm để trèo.

Nhắc lại: Ngủ sâu hơn không đồng nghĩa an toàn hơn. Không dùng chăn nặng, túi ngủ có trọng lượng, võng hoặc mặt phẳng nghiêng để “giữ giấc”.`,
    category: "Giấc ngủ",
    stage: "INFANT_3_6_MONTHS",
    minimumAgeDays: 92,
    maximumAgeDays: 182,
    evidenceLevel: "STRONG",
    knowledgeType: scientific,
    sources: [sources.safeSleep],
  },
  {
    slug: "dau-hieu-san-sang-an-dam",
    title: "Dấu hiệu bé sẵn sàng ăn dặm",
    summary: "Phần lớn trẻ bắt đầu khoảng 6 tháng khi kiểm soát đầu-cổ, ngồi có hỗ trợ và nuốt được thức ăn.",
    content: `## Không chỉ nhìn vào số tháng
Khoảng 6 tháng, quan sát bé có thể:
- Ngồi một mình hoặc có hỗ trợ và giữ đầu-cổ vững.
- Mở miệng khi đưa thức ăn, đưa đồ vật lên miệng.
- Nuốt thức ăn thay vì luôn đẩy ra bằng lưỡi.
- Với và nắm đồ vật phù hợp.

## Chưa phải dấu hiệu đủ
Thức giấc ban đêm, nhìn người lớn ăn, mọc răng hoặc đưa tay vào miệng một mình không có nghĩa cần ăn dặm sớm.

Không cho ăn trước 4 tháng. Trẻ sinh non hoặc có vấn đề nuốt/tăng trưởng cần đánh giá riêng theo tuổi hiệu chỉnh và khả năng phát triển.`,
    category: "Ăn dặm",
    stage: "INFANT_3_6_MONTHS",
    minimumAgeDays: 92,
    maximumAgeDays: 210,
    evidenceLevel: "STRONG",
    knowledgeType: scientific,
    sources: [sources.solids, sources.complementary],
  },
  {
    slug: "phat-trien-3-6-thang",
    title: "Chơi, giao tiếp và phát triển 3–6 tháng",
    summary: "Chơi trên sàn, trò chuyện và đọc sách hằng ngày hỗ trợ vận động, ngôn ngữ và gắn kết.",
    content: `## Cùng bé học qua chơi
- Tạo thời gian chơi trên sàn sạch, có giám sát để bé với, lăn và khám phá.
- Đọc sách tranh, gọi tên đồ vật, bắt chước âm thanh và chờ bé đáp lại.
- Đưa đồ chơi an toàn từ bên này sang bên kia để bé theo dõi và với lấy.
- Hạn chế thời gian trong ghế rung, ghế ô tô khi không di chuyển và các dụng cụ giữ bé cố định.

## Khi cần trao đổi sớm
Hãy nói với bác sĩ nếu bé mất kỹ năng, rất mềm/cứng, ít giao tiếp mắt, không phản ứng với âm thanh hoặc không kiểm soát đầu tiến bộ. Can thiệp sớm hữu ích khi có vấn đề.`,
    category: "Phát triển",
    stage: "INFANT_3_6_MONTHS",
    minimumAgeDays: 92,
    maximumAgeDays: 182,
    evidenceLevel: "MODERATE",
    knowledgeType: scientific,
    sources: [sources.milestones],
  },
  {
    slug: "an-dam-6-12-thang-theo-thang",
    title: "Ăn dặm 6–12 tháng: lượng, độ thô và nhịp bữa",
    summary: "Bắt đầu ít và mềm, tăng dần lượng, số bữa, độ thô; sữa mẹ hoặc sữa công thức vẫn rất quan trọng.",
    content: `## Giai đoạn đầu
- Khoảng 6 tháng: bắt đầu 2–3 thìa thức ăn mềm, đặc vừa, 1–2 lần/ngày rồi tăng theo tín hiệu của bé.
- 6–8 tháng: thường 2–3 bữa/ngày; tăng dần độ đặc và cho cầm thức ăn mềm phù hợp.
- 9–11 tháng: thường 3–4 bữa/ngày và có thể thêm 1–2 bữa phụ bổ dưỡng theo nhu cầu.

## Mỗi bữa nên đa dạng
Kết hợp thực phẩm giàu sắt/đạm như thịt, cá, trứng, đậu; rau quả; ngũ cốc/củ; thêm chất béo phù hợp. Cháo quá loãng làm giảm mật độ dinh dưỡng.

Cho ăn đáp ứng: Ngồi cùng bé, quan sát dấu hiệu đói-no, khuyến khích nhưng không ép. Bé có thể cần thử một món nhiều lần mới chấp nhận.`,
    category: "Ăn dặm",
    stage: "INFANT_6_12_MONTHS",
    minimumAgeDays: 183,
    maximumAgeDays: 365,
    evidenceLevel: "STRONG",
    knowledgeType: scientific,
    sources: [sources.complementary, sources.menuVi],
  },
  {
    slug: "di-ung-va-gioi-thieu-thuc-pham-moi",
    title: "Giới thiệu thực phẩm mới và dị ứng",
    summary: "Cho thử từng món với lượng nhỏ khi bé khỏe, theo dõi phản ứng và chuẩn bị cách xử trí khẩn cấp.",
    content: `## Cách thử an toàn
- Cho thử lượng nhỏ ban ngày khi bé khỏe và người lớn có thể quan sát.
- Bắt đầu từng thực phẩm đơn thành phần; có thể chờ 3–5 ngày giữa món mới để dễ nhận biết phản ứng.
- Thực phẩm dễ gây dị ứng vẫn có thể được giới thiệu cùng các thực phẩm khác khi bé sẵn sàng, ở dạng không gây hóc.
- Bé chàm nặng hoặc đã dị ứng trứng cần hỏi bác sĩ trước khi thử đậu phộng.

## Nhận biết phản ứng
Mề đay, sưng môi/mặt, nôn lặp lại, khò khè, khó thở, lừ đừ hoặc ngất sau ăn cần xử trí khẩn cấp. Gọi cấp cứu nếu có khó thở hoặc phản ứng nhiều cơ quan.

Không bôi thức ăn lên da để “thử dị ứng”; cách này không dự đoán an toàn khi ăn.`,
    category: "Ăn dặm",
    stage: "INFANT_6_12_MONTHS",
    minimumAgeDays: 183,
    maximumAgeDays: 365,
    evidenceLevel: "STRONG",
    knowledgeType: scientific,
    sources: [sources.solids],
  },
  {
    slug: "thuc-pham-can-tranh-duoi-1-tuoi",
    title: "Thực phẩm cần tránh dưới 1 tuổi",
    summary: "Không mật ong, không sữa bò làm đồ uống chính, tránh đồ chưa tiệt trùng và thực phẩm có nguy cơ hóc.",
    content: `## Tránh hoàn toàn hoặc trì hoãn
- Không cho mật ong sống hoặc đã nấu trước 12 tháng vì nguy cơ ngộ độc botulinum.
- Không dùng sữa bò làm đồ uống chính trước 12 tháng; sữa chua và phô mai tiệt trùng không thêm đường có thể dùng phù hợp.
- Tránh sữa/nước trái cây chưa tiệt trùng, trứng/thịt/cá sống hoặc chưa chín kỹ.
- Tránh đồ uống có đường, nước ngọt, trà/cà phê; không thêm đường hoặc chất tạo ngọt.
- Hạn chế muối và thực phẩm chế biến nhiều natri.

## Luôn xét nguy cơ hóc
Không cho hạt nguyên, bỏng ngô, kẹo cứng, nho/cà chua bi nguyên quả, xúc xích cắt khoanh, miếng thịt dai hoặc thìa bơ hạt đặc.`,
    category: "An toàn thực phẩm",
    stage: "INFANT_6_12_MONTHS",
    minimumAgeDays: 183,
    maximumAgeDays: 365,
    evidenceLevel: "STRONG",
    knowledgeType: scientific,
    sources: [sources.choking, sources.solids],
  },
  {
    slug: "phong-hoc-nghen-khi-an-dam",
    title: "Phòng hóc nghẹn khi ăn dặm",
    summary: "Tư thế ngồi thẳng, kết cấu phù hợp và giám sát liên tục quan trọng hơn chọn ăn đút hay tự chỉ huy.",
    content: `## Trong mọi bữa ăn
- Cho bé ngồi thẳng, tỉnh táo, trong ghế ăn vững; không ăn khi nằm, bò, chạy, trên xe hoặc trong xe đẩy.
- Người lớn ở sát và quan sát liên tục; bữa ăn bình tĩnh, không thúc ép hoặc làm bé cười khi đang nhai.
- Nấu mềm, bỏ xương/hạt, nghiền hoặc cắt theo kích thước và kỹ năng của bé.
- Nho và quả tròn cần cắt dọc thành miếng nhỏ; bơ hạt phải phết mỏng hoặc pha loãng, không cho từng cục.

## Chuẩn bị trước
Người chăm sóc nên học sơ cứu hóc nghẹn trẻ nhỏ từ đơn vị uy tín. Ọe vẫn có tiếng và luồng khí; hóc hoàn toàn thường im lặng, không ho/khóc được và có thể tím — cần cấp cứu ngay.`,
    category: "An toàn",
    stage: "INFANT_6_12_MONTHS",
    minimumAgeDays: 183,
    maximumAgeDays: 730,
    evidenceLevel: "STRONG",
    knowledgeType: scientific,
    sources: [sources.choking],
  },
  {
    slug: "phat-trien-va-an-toan-6-12-thang",
    title: "Phát triển và an toàn nhà ở 6–12 tháng",
    summary: "Khi bé bò, vịn đứng và khám phá bằng miệng, cần tạo khu chơi an toàn và theo dõi kỹ năng theo thời gian.",
    content: `## Học qua tương tác
- Chơi ú òa, chuyền đồ vật, đọc sách, gọi tên đồ vật và đáp lại tiếng bập bẹ.
- Cho bé chơi trên sàn có giám sát; đặt đồ chơi vừa tầm để khuyến khích với, xoay, bò.
- Không dùng xe tập đi có bánh; bé có thể tiếp cận cầu thang và vật nguy hiểm rất nhanh.

## Làm nhà an toàn
- Chặn cầu thang, cố định đồ nội thất, che ổ điện, cất pin cúc áo, thuốc, hóa chất và vật nhỏ khỏi tầm với.
- Không để bé một mình trên giường, ghế, bàn thay tã hoặc gần nước.

Nếu bé mất kỹ năng, không phản ứng với tên/âm thanh, ít giao tiếp hoặc vận động không tiến bộ, hãy trao đổi với bác sĩ thay vì “chờ lớn sẽ tự hết”.`,
    category: "Phát triển",
    stage: "INFANT_6_12_MONTHS",
    minimumAgeDays: 183,
    maximumAgeDays: 365,
    evidenceLevel: "MODERATE",
    knowledgeType: scientific,
    sources: [sources.milestones],
  },
  {
    slug: "an-dam-be-tu-chi-huy-blw-vs-an-dam-truyen-thong",
    title: "Ăn dặm bé tự chỉ huy (BLW) và ăn dặm truyền thống: bằng chứng nói gì",
    summary: "Bằng chứng hiện tại không cho thấy BLW làm tăng nguy cơ hóc thật sự so với đút thìa, nhưng kết quả về tăng trưởng và lượng sắt còn mâu thuẫn giữa các nghiên cứu; phiên bản BLISS (BLW có điều chỉnh, ưu tiên thực phẩm giàu sắt và tránh thực phẩm dễ hóc) được thiết kế để khắc phục các lo ngại này.",
    content: `## BLW là gì
Ăn dặm bé tự chỉ huy (baby-led weaning) là cách cho bé tự cầm thức ăn nguyên miếng mềm để tự ăn ngay từ đầu, thay vì đút thìa thức ăn nghiền/xay.

## Bằng chứng về nguy cơ hóc — không tăng so với đút thìa
Một tổng quan hệ thống (2018) và một tổng quan mới hơn (2026) đều không tìm thấy khác biệt có ý nghĩa về tỷ lệ hóc thật sự giữa nhóm BLW và nhóm ăn dặm truyền thống — dù các nghiên cứu gốc thường khó phân biệt rạch ròi giữa "ọe" (phản xạ bảo vệ bình thường) và "hóc" (cấp cứu thật sự) khi tự báo cáo. NHS cũng khẳng định: "không có nguy cơ hóc cao hơn khi bé tự ăn so với khi được đút thìa."

## Bằng chứng về tăng trưởng và lượng sắt — còn mâu thuẫn
Đây là điểm CÒN GÂY TRANH CÃI thật sự giữa các nghiên cứu: một số nghiên cứu quan sát cho thấy bé theo BLW (không điều chỉnh) nhận ít sắt hơn đáng kể so với bé ăn dặm truyền thống, trong khi một tổng quan khác lại không thấy khác biệt rõ về sắt/huyết sắc tố. Một điểm đáng chú ý được nhiều nghiên cứu đồng thuận: DÙ theo cách nào, phần lớn trẻ ở cả hai nhóm đều KHÔNG đạt đủ lượng sắt khuyến nghị hằng ngày — đây là vấn đề chung của giai đoạn ăn dặm, không phải chỉ riêng BLW. Về cân nặng, các nghiên cứu cũng cho kết quả khác nhau (không nhất quán bé nào nặng hơn), và không có nghiên cứu nào ghi nhận suy dinh dưỡng ở nhóm nào.

## BLISS — phiên bản BLW có điều chỉnh
BLISS (Baby-Led Introduction to SolidS) là phiên bản được thiết kế riêng để khắc phục hai lo ngại lớn nhất của BLW gốc: chủ động hướng dẫn cha mẹ ưu tiên thực phẩm giàu sắt (thịt đỏ, ngũ cốc tăng cường sắt dạng bé tự cầm được) ngay từ tuần đầu, và tránh các thực phẩm dễ gây hóc (như táo sống, nho nguyên quả). Một thử nghiệm thí điểm cho thấy nhóm BLISS được cho ăn thực phẩm giàu sắt nhiều hơn đáng kể và ít tiếp xúc thực phẩm nguy cơ hóc cao hơn nhiều so với nhóm BLW thông thường — nhưng đây mới là nghiên cứu thí điểm quy mô nhỏ, cần thêm nghiên cứu lớn hơn để khẳng định chắc chắn.

## Kết luận thực tế
AAP xem BLW và đút thìa là hai cách tiếp cận có thể kết hợp, không loại trừ nhau — không có bằng chứng đủ mạnh để khẳng định cách nào "tốt hơn" hẳn. Dù chọn cách nào, điều quan trọng nhất vẫn là: đảm bảo đủ thực phẩm giàu sắt, luôn giám sát khi ăn, và áp dụng tư thế ngồi thẳng an toàn.`,
    category: "Ăn dặm",
    stage: "INFANT_6_12_MONTHS",
    minimumAgeDays: 183,
    maximumAgeDays: 365,
    evidenceLevel: "MODERATE",
    knowledgeType: scientific,
    sources: [sources.aapBLW, sources.dauriaBLWReview, sources.nutrientsBLWReview, sources.blissTrial],
  },
  {
    slug: "phan-biet-oe-va-hoc-khi-an-dam",
    title: "Phân biệt ọe (gagging) và hóc (choking) khi ăn dặm",
    summary: "Ọe là phản xạ bảo vệ bình thường — có tiếng động lớn, mặt đỏ, bé vẫn thở được; hóc là cấp cứu thật sự — gần như im lặng, bé không thở/ho/khóc được, môi/da có thể tím tái.",
    content: `## Ọe (gagging) — phản xạ bảo vệ bình thường
Ọe là cách cơ thể bé ngăn thức ăn đi vào đường thở khi bé đang học nhai-nuốt. Đặc điểm: có tiếng động RÕ RÀNG (ho, khạc), mặt có thể đỏ ửng (khó thấy hơn ở da sẫm màu), chảy nước mắt, lưỡi đẩy thức ăn ra phía trước, đôi khi kèm nôn nhẹ. Đây là hiện tượng RẤT PHỔ BIẾN, phổ biến hơn nhiều so với hóc thật sự.

Phản xạ ọe của bé ban đầu rất nhạy (kích hoạt ngay ở phần giữa/trước lưỡi) và dần lùi về phía sau lưỡi, giảm nhạy cảm hơn theo thời gian luyện tập ăn — quá trình này thường diễn ra trong khoảng 4-9 tháng tuổi.

## Hóc (choking) — cấp cứu thật sự
Hóc là khi đường thở bị tắc nghẽn thật sự. Đặc điểm: GẦN NHƯ IM LẶNG — bé không ho/khóc/thở được bình thường. Da có thể tím tái (ở da sáng màu dễ thấy hơn; ở da sẫm màu, chú ý màu môi, nướu, móng tay). Đây là tình huống cần xử trí ngay: gọi giúp đỡ, bế bé ra khỏi ghế ăn, đỡ ngực-cằm, vỗ lưng 5 lần giữa hai xương bả vai (và tiếp tục các bước sơ cứu hóc nghẹn tiêu chuẩn nếu chưa hết tắc nghẽn).

## Cách ghi nhớ đơn giản
Ọe: ồn ào, bé vẫn thở/ho được, thường tự hết. Hóc: im lặng bất thường, bé KHÔNG ho/khóc/thở được — cần hành động ngay, không chờ đợi.

Cha mẹ nên học sơ cứu hóc nghẹn trẻ nhỏ từ đơn vị uy tín trước khi bắt đầu ăn dặm để sẵn sàng xử trí nếu cần (xem thêm bài "Phòng hóc nghẹn khi ăn dặm").`,
    category: "An toàn",
    stage: "INFANT_6_12_MONTHS",
    minimumAgeDays: 183,
    maximumAgeDays: 365,
    evidenceLevel: "STRONG",
    knowledgeType: scientific,
    sources: [sources.nhsChokingGagging, sources.aapBLW, sources.dauriaBLWReview],
  },
  {
    slug: "nuoc-uong-cho-be-6-12-thang",
    title: "Nước uống cho bé 6–12 tháng",
    summary: "Có thể cho bé nhấp vài ngụm nước cùng bữa ăn từ khoảng 6 tháng khi bắt đầu ăn dặm, nhưng sữa mẹ/sữa công thức vẫn phải là nguồn chất lỏng chính; uống quá nhiều nước có thể gây nguy hiểm thật sự (ngộ độc nước/hạ natri máu) dù các ca ghi nhận thường liên quan đến lượng rất lớn.",
    content: `## Khi nào bắt đầu cho uống nước
Từ khoảng 6 tháng tuổi khi bé bắt đầu ăn dặm, có thể cho bé nhấp vài ngụm nước từ cốc/ly cùng bữa ăn. CDC đưa ra khoảng tham khảo khoảng 120-240ml (4-8 oz) nước/ngày cho giai đoạn này — bổ sung thêm, không thay thế sữa mẹ/sữa công thức vốn vẫn là nguồn dinh dưỡng và chất lỏng chính.

## Trước 6 tháng
Bé bú mẹ hoàn toàn thường không cần thêm nước ngay cả khi trời nóng; bé bú công thức có thể cần thêm chút nước đun sôi để nguội trong thời tiết rất nóng, nhưng nên hỏi ý kiến nhân viên y tế.

## Nguy cơ uống quá nhiều nước — có thật nhưng thường liên quan lượng rất lớn
Cho trẻ nhỏ uống LƯỢNG NƯỚC RẤT LỚN (thay thế sữa, hoặc uống liên tục nhiều lần trong ngày) có thể gây ngộ độc nước — hạ natri máu dẫn đến co giật, đã được ghi nhận trong y văn. Các trường hợp được báo cáo thường liên quan đến lượng nước lớn hơn nhiều so với vài ngụm cùng bữa ăn (ví dụ vài trăm ml/ngày liên tục nhiều ngày), không phải mức độ nước uống thông thường theo hướng dẫn ở trên. Đây là lý do các hướng dẫn chính thức luôn nhấn mạnh: nước chỉ là bổ sung với lượng nhỏ, sữa vẫn phải là nguồn chính trong năm đầu đời.`,
    category: "Ăn dặm",
    stage: "INFANT_6_12_MONTHS",
    minimumAgeDays: 183,
    maximumAgeDays: 365,
    evidenceLevel: "MODERATE",
    knowledgeType: scientific,
    sources: [sources.nhsDrinksAndCups, sources.cdcWaterDrinks],
  },
  {
    slug: "do-tho-thuc-an-tu-nhuyen-den-lon-cop-va-cua-so-quan-trong",
    title: "Độ thô thức ăn: từ nhuyễn đến lợn cợn và \"cửa sổ quan trọng\"",
    summary: "Các hướng dẫn khuyến nghị chuyển từ thức ăn nhuyễn sang lợn cợn/thô hơn và thức ăn cầm tay ngay khi bé có thể xử lý được, thường trong khoảng 7-9 tháng; một nghiên cứu đoàn hệ lớn cho thấy giới thiệu thức ăn lợn cợn muộn (sau 9-10 tháng) có liên quan đến nhiều vấn đề ăn uống hơn sau này.",
    content: `## Nguyên tắc chung
NHS khuyến nghị chuyển dần từ thức ăn xay nhuyễn sang nghiền lợn cợn, thô hơn và thức ăn cầm tay NGAY KHI bé có thể xử lý được, không nên trì hoãn kéo dài ở giai đoạn ăn nhuyễn.

## Bằng chứng về "cửa sổ quan trọng" của độ thô
Một nghiên cứu đoàn hệ lớn (hơn 9,000 cặp mẹ-con) cho thấy: bé được cho ăn thức ăn lợn cợn TRƯỚC 6 tháng có ít vấn đề ăn uống hơn ở tháng 15 so với bé được giới thiệu độ thô này SAU 10 tháng. Hướng dẫn của Hiệp hội Tiêu hóa-Gan mật-Dinh dưỡng Nhi khoa Châu Âu (ESPGHAN, 2017) vẫn trích dẫn phát hiện này, khuyến nghị bé nên ăn được thức ăn lợn cợn muộn nhất là khoảng 8-10 tháng tuổi, và không nên kéo dài việc chỉ ăn thức ăn xay nhuyễn quá lâu.

## Không nên hiểu là một "hạn chót" cứng nhắc
Đây là một nghiên cứu quan sát lớn (không phải thử nghiệm đối chứng ngẫu nhiên), và các hướng dẫn thực hành như NHS diễn đạt mềm mại hơn: khuyến khích tăng độ thô đều đặn theo khả năng của từng bé, không đưa ra một "hạn chót" cứng nhắc. Nên hiểu đây là lý do để KHÔNG trì hoãn không cần thiết việc tăng độ thô, chứ không phải một mốc giờ cần hoảng sợ nếu lỡ qua.

## Thực hành gợi ý
Quan sát khả năng của bé (có thể di chuyển thức ăn trong miệng, nhai bằng lợi) để tăng dần độ thô — từ nghiền mịn, đến nghiền lợn cợn có cục nhỏ mềm, đến thức ăn cắt miếng mềm cho bé tự cầm.`,
    category: "Ăn dặm",
    stage: "INFANT_6_12_MONTHS",
    minimumAgeDays: 183,
    maximumAgeDays: 365,
    evidenceLevel: "MODERATE",
    knowledgeType: scientific,
    sources: [sources.northstoneLumpySolids, sources.espghanComplementary, sources.nhs7to9months],
  },
  {
    slug: "van-dong-tho-6-12-thang-ngoi-bo-dung-vin-di-men",
    title: "Vận động thô 6–12 tháng: ngồi, bò, đứng vịn, đi men",
    summary: "Theo bảng mốc phát triển hiện tại của CDC: ngồi vững không cần đỡ là mốc 9 tháng; đứng vịn và đi men theo đồ đạc là mốc 12 tháng; bò không còn được liệt kê trong bảng mốc CDC (vì quá đa dạng cách thức và thời điểm) — không bò không đồng nghĩa có vấn đề; bước đi độc lập đầu tiên thường là mốc 15-18 tháng, muộn hơn nhiều so với \"khoảng 1 tuổi\" hay được nhắc.",
    content: `## Ngồi vững không cần đỡ — mốc 9 tháng
Theo bảng mốc hiện tại của CDC: bé tự ngồi dậy được và ngồi vững không cần đỡ là mốc 9 THÁNG (không phải 6 tháng như một số tài liệu cũ vẫn ghi). AAP cũng nêu cụ thể: nếu bé chưa ngồi vững một mình lúc 9 tháng, nên báo với bác sĩ.

## Bò — không còn là một mốc chuẩn
Đáng chú ý: bảng mốc phát triển HIỆN TẠI của CDC KHÔNG còn liệt kê "bò" như một mốc cụ thể theo tháng tuổi nào — có thể vì cách bò và thời điểm bò rất đa dạng giữa các bé. AAP xác nhận rõ: "một số bé không bao giờ bò — thay vào đó bé có thể trườn bằng mông hoặc trườn bằng bụng" và đây được xem là biến thể bình thường, không phải dấu hiệu bất thường, miễn là cha mẹ không thấy bé có vấn đề vận động rõ rệt khác.

## Đứng vịn và đi men — mốc 12 tháng
Theo CDC: "đứng dậy vịn vào đồ vật" và "đi men (đi bám theo đồ đạc)" đều là mốc 12 THÁNG trong bảng hiện tại.

## Đi độc lập — muộn hơn nhiều so với "khoảng 1 tuổi"
Đây là điểm chỉnh sửa quan trọng nhất: theo CDC hiện tại, "đi được vài bước một mình" là mốc 15 THÁNG, và "đi vững hoàn toàn không cần vịn" là mốc 18 THÁNG — muộn hơn đáng kể so với "khoảng 1 tuổi" mà nhiều tài liệu (bao gồm một số bài viết cũ của chính AAP) vẫn còn ghi. Khoảng dao động bình thường được xem là rộng, từ khoảng 9 đến 18 tháng.

## Không có danh sách "dấu hiệu cảnh báo" cụ thể theo tháng
Giống các giai đoạn khác, CDC hiện chỉ đưa nguyên tắc chung: nếu bé không đạt một mốc, mất kỹ năng đã có, hoặc cha mẹ có bất kỳ lo lắng nào, nên trao đổi với bác sĩ — không có một danh sách "dấu hiệu cảnh báo" liệt kê sẵn theo từng tháng như một số tài liệu cũ.

## Xe tập đi có bánh — nên tránh
Xem thêm bài riêng về xe tập đi có bánh: AAP kêu gọi cấm sản xuất/bán loại xe này vì nguy cơ chấn thương cao và không giúp ích (thậm chí có thể làm CHẬM biết đi).`,
    category: "Phát triển",
    stage: "INFANT_6_12_MONTHS",
    minimumAgeDays: 183,
    maximumAgeDays: 547,
    evidenceLevel: "STRONG",
    knowledgeType: scientific,
    sources: [sources.cdcMilestone9mo, sources.cdcMilestone2mo, sources.zublerMilestones2022, sources.aapMotor8to12, sources.cdcMilestone15mo, sources.cdcMilestone18mo, sources.aapPhysicalDevTrack],
  },
  {
    slug: "xe-tap-di-co-banh-vi-sao-nen-tranh",
    title: "Xe tập đi có bánh: vì sao AAP kêu gọi cấm",
    summary: "AAP đã kêu gọi cấm sản xuất và bán xe tập đi có bánh vì nguy cơ chấn thương cao (chủ yếu do ngã cầu thang) và không giúp bé biết đi sớm hơn — thậm chí có thể làm chậm quá trình này.",
    content: `## Nguy cơ chấn thương
Xe tập đi có bánh giúp bé di chuyển rất nhanh (có thể hơn 1 mét/giây) — đủ nhanh để ngã xuống cầu thang trước khi người lớn kịp phản ứng, dù đang đứng ngay gần. Đây là nguyên nhân phổ biến nhất gây chấn thương liên quan đến loại xe này, có thể dẫn đến gãy xương và chấn thương đầu nghiêm trọng.

## Không giúp ích cho việc biết đi — thậm chí có thể làm chậm
Nhiều cha mẹ nghĩ xe tập đi giúp bé biết đi sớm hơn — nhưng AAP khẳng định điều ngược lại: xe tập đi KHÔNG giúp, và trên thực tế có thể làm CHẬM thời điểm bé bắt đầu biết đi.

## Lập trường chính thức
AAP đã kêu gọi cấm sản xuất và bán xe tập đi có bánh (một số quốc gia như Canada đã cấm loại sản phẩm này). Các lựa chọn thay thế an toàn hơn: ghế hoạt động cố định (không bánh, có ghế xoay/nhún tại chỗ), cũi chơi, hoặc để bé chơi tự do trên sàn có giám sát.`,
    category: "An toàn",
    stage: "INFANT_6_12_MONTHS",
    minimumAgeDays: 183,
    maximumAgeDays: 547,
    evidenceLevel: "STRONG",
    knowledgeType: scientific,
    sources: [sources.aapBabyWalkers],
  },
  {
    slug: "nhan-thuc-xa-hoi-6-12-thang-do-vat-va-lo-au-nguoi-la",
    title: "Nhận thức-xã hội 6–12 tháng: hiểu đồ vật vẫn tồn tại và lo âu người lạ",
    summary: "Bé bắt đầu hiểu đồ vật vẫn tồn tại dù không nhìn thấy (mốc CDC: tìm đồ vật rơi lúc 9 tháng, tìm đồ vật bị giấu lúc 12 tháng); lo âu người lạ/chia ly thường bắt đầu khoảng 6-9 tháng và là điều bình thường, mức độ khác nhau nhiều giữa các bé tùy tính khí.",
    content: `## Hiểu đồ vật vẫn tồn tại (object permanence)
Theo mốc CDC: ở 9 tháng, bé "tìm đồ vật khi thấy nó rơi ra khỏi tầm nhìn" (như thìa hay đồ chơi); ở 12 tháng, bé tiến thêm một bước là "tìm đồ vật bé thấy bạn giấu đi" (như đồ chơi dưới khăn). Đây là các dấu hiệu hành vi cho thấy bé đang phát triển hiểu biết rằng đồ vật vẫn tồn tại dù không nhìn thấy — khái niệm mà tâm lý học phát triển gọi là "object permanence", dù CDC không dùng thuật ngữ này trong tài liệu dành cho phụ huynh.

## Lo âu người lạ và lo âu chia ly
Theo CDC (mốc 9 tháng): bé có thể "rụt rè, bám dính hoặc sợ người lạ", và "phản ứng khi bạn rời đi (nhìn theo, với tay hoặc khóc)". NHS xác nhận đây là hiện tượng phổ biến trong khoảng 6 tháng đến 3 tuổi, xuất hiện khi bé bắt đầu hiểu đồ vật/người vẫn tồn tại và nhận ra sự phụ thuộc vào người chăm sóc — đây là dấu hiệu phát triển BÌNH THƯỜNG, thường tự giảm dần.

## Mức độ khác nhau nhiều tùy tính khí — không phải vấn đề cần "chữa"
AAP nhấn mạnh rõ: mỗi bé có tính khí riêng — có bé rất dễ thích nghi, có bé phản ứng mạnh hơn với người lạ/tình huống mới — và "cả hai đều hoàn toàn bình thường và khỏe mạnh, không bé nào 'tốt hơn' bé nào". Mức độ lo âu người lạ mạnh hay nhẹ không phải là dấu hiệu tốt/xấu, chỉ phản ánh tính cách riêng của từng bé.

## Chơi tương tác
Chơi ú òa (bé cười khi chơi trò này là mốc 9 tháng theo CDC), chơi vỗ tay/"pat-a-cake" cùng người lớn (mốc 12 tháng) là các hoạt động tương tác xã hội phù hợp giai đoạn này.

## Khi nào cần trao đổi với bác sĩ
CDC không còn liệt kê danh sách "dấu hiệu cảnh báo" riêng theo từng tháng — nguyên tắc chung vẫn là: nếu bé không đạt mốc phát triển, mất kỹ năng đã có, hoặc cha mẹ có bất kỳ lo lắng nào (bao gồm hoàn toàn không phản ứng với người quen/lạ theo bất kỳ cách nào), nên trao đổi với bác sĩ.`,
    category: "Phát triển",
    stage: "INFANT_6_12_MONTHS",
    minimumAgeDays: 183,
    maximumAgeDays: 365,
    evidenceLevel: "MODERATE",
    knowledgeType: scientific,
    sources: [sources.cdcMilestone9mo, sources.cdcMilestone2mo, sources.nhsSeparationAnxiety, sources.aapEmotionalSocial8to12, sources.aapTemperament],
  },
  {
    slug: "ngon-ngu-6-12-thang-tu-dau-tien-va-tre-song-ngu",
    title: "Ngôn ngữ 6–12 tháng: từ đầu tiên và trẻ song ngữ",
    summary: "Bé thường nói từ đầu tiên có nghĩa khoảng 12 tháng (thường là gọi đúng \"mama\"/\"dada\"); khả năng HIỂU lời nói thường đi trước khả năng NÓI được; nuôi dạy song ngữ KHÔNG gây chậm ngôn ngữ — tổng vốn từ ở cả hai ngôn ngữ cộng lại tương đương trẻ chỉ học một ngôn ngữ.",
    content: `## Từ đầu tiên
Theo NIDCD (Viện Quốc gia về Điếc và Rối loạn Giao tiếp, Mỹ), phần lớn bé có "một hoặc hai từ" (như "hi", "dog", "dada", "mama") vào sinh nhật đầu tiên. CDC mô tả mốc 12 tháng cụ thể là bé "gọi đúng cha/mẹ bằng 'mama' hoặc 'dada' hoặc tên gọi đặc biệt khác" — được xem như một dạng "từ đầu tiên" thực tế. Các từ khác ngoài "mama/dada" thường xuất hiện muộn hơn một chút, khoảng 15 tháng theo mốc CDC.

## Hiểu trước khi nói được
Khả năng HIỂU ngôn ngữ (tiếp nhận) thường phát triển trước khả năng tự NÓI (diễn đạt). Theo CDC, bé hiểu và phản ứng với từ "không" (dừng lại/khựng lại một chút khi nghe) là mốc 12 tháng — trước khi bé tự nói được nhiều từ. Nếu chỉ có vấn đề về khả năng nói (diễn đạt) mà khả năng hiểu vẫn tốt, đây thường là một bức tranh khác (ít đáng lo hơn) so với khi cả hai khả năng đều chậm.

## Trẻ song ngữ không bị chậm ngôn ngữ
Đây là một lo lắng phổ biến của cha mẹ nhưng KHÔNG được bằng chứng ủng hộ: AAP (cùng Hiệp hội Nghe nói Hoa Kỳ - ASHA) khẳng định rõ: "Nếu một bé tiếp xúc với nhiều hơn một ngôn ngữ, tổng số từ bé biết nên tương đương với số từ của một bé cùng tuổi chỉ học một ngôn ngữ." Ví dụ minh họa: một bé chỉ học tiếng Anh có thể biết 50 từ tiếng Anh lúc 2 tuổi; một bé học cả tiếng Anh và tiếng Việt có thể biết 25 từ mỗi thứ tiếng — tổng cộng vẫn là 50 từ. Các mốc phát triển giao tiếp sớm (bập bẹ, cười, gọi tên) giống nhau ở mọi ngôn ngữ.

## Liên quan đến thính giác
Vì chậm ngôn ngữ có thể là dấu hiệu của vấn đề thính giác, nếu bé có dấu hiệu chậm phát triển ngôn ngữ, việc kiểm tra thính lực thường là một phần trong quá trình đánh giá — đặc biệt nếu bé chưa từng được sàng lọc thính lực đầy đủ hoặc kết quả trước đó chưa rõ ràng.`,
    category: "Phát triển",
    stage: "INFANT_6_12_MONTHS",
    minimumAgeDays: 183,
    maximumAgeDays: 365,
    evidenceLevel: "STRONG",
    knowledgeType: scientific,
    sources: [sources.cdcMilestone9mo, sources.cdcMilestone2mo, sources.cdcMilestone15mo, sources.nidcdMilestones, sources.aapBilingual, sources.aapLanguageDelay],
  },
  {
    slug: "sua-tiep-tuc-sau-an-dam-va-chuyen-sang-sua-bo",
    title: "Sữa tiếp tục sau khi ăn dặm và chuyển sang sữa bò lúc 12 tháng",
    summary: "Ăn dặm chỉ nên bổ sung, không thay thế sữa mẹ/công thức — sữa vẫn là nguồn dinh dưỡng chính đến hết năm đầu; sữa bò chỉ nên dùng làm đồ uống chính từ 12 tháng (không phải vì \"không tốt\" mà vì ít sắt và có thể gây kích ứng ruột ở trẻ nhỏ hơn), dù có thể dùng lượng nhỏ trong nấu ăn hoặc sữa chua/phô mai tiệt trùng sớm hơn.",
    content: `## Sữa vẫn là nguồn dinh dưỡng chính
Thức ăn dặm được giới thiệu từ 6 tháng nhằm BỔ SUNG, không thay thế sữa mẹ/sữa công thức — sữa vẫn cung cấp phần lớn dinh dưỡng cần thiết trong suốt năm đầu đời. Bé có thể vẫn bú 3-4 cữ sữa/ngày (cộng thêm vài bữa ăn dặm) đến tận 12 tháng tuổi. Nên cho bú/uống sữa trước, hoặc không để bữa ăn dặm lấn át hoàn toàn các cữ sữa quá sớm.

## Vì sao chưa dùng sữa bò làm đồ uống chính trước 12 tháng
Không phải vì sữa bò "không tốt" nói chung, mà vì hai lý do cụ thể: (1) sữa bò có hàm lượng sắt thấp và có thể gây kích ứng niêm mạc dạ dày-ruột ở trẻ nhỏ hơn, dẫn đến mất máu vi thể (không nhìn thấy bằng mắt thường) qua thời gian, làm tăng nguy cơ thiếu sắt; (2) hàm lượng đạm và khoáng chất cao trong sữa bò có thể gây áp lực lên thận còn non nớt của trẻ nhỏ.

## Ngoại lệ: dùng trong nấu ăn hoặc sữa chua/phô mai
NHS xác nhận: có thể dùng sữa bò trong NẤU ĂN hoặc trộn vào thức ăn từ khoảng 6 tháng tuổi — chỉ riêng việc dùng làm ĐỒ UỐNG CHÍNH mới cần đợi đến 12 tháng. Theo CDC, sữa chua không đường và các sản phẩm sữa bò khác (không phải dạng uống) có thể được giới thiệu sớm hơn 12 tháng.

## Chuyển từ bình sang cốc
Cả AAP và NHS khuyến nghị giới thiệu cốc (cốc hở, cốc có ống hút, hoặc cốc mỏ vịt không van chống tràn) từ khoảng 6 tháng, song song với ăn dặm. Về thời điểm cai hẳn bình sữa: AAP đưa ra khung 12-18 tháng, trong khi NHS khuyến nghị nên hạn chế bú bình ngay từ khi bé tròn 1 tuổi — đây là khác biệt thật giữa hai nguồn, không phải sai sót.

## Nước ép trái cây — chưa nên dùng trước 12 tháng
AAP khuyến nghị không cho trẻ dưới 12 tháng uống nước ép trái cây vì không mang lại lợi ích dinh dưỡng rõ rệt, có thể gây sâu răng và tạo thói quen thích vị ngọt hơn là nước lọc.`,
    category: "Ăn dặm",
    stage: "INFANT_6_12_MONTHS",
    minimumAgeDays: 183,
    maximumAgeDays: 365,
    evidenceLevel: "STRONG",
    knowledgeType: scientific,
    sources: [sources.aapBreastfeedingSolids, sources.aapWhyFormulaNotCowMilk, sources.cdcCowsMilk, sources.nhsDrinksAndCups, sources.aapBottleToCup, sources.aapFruitJuice],
  },
  {
    slug: "moc-rang-anh-huong-an-uong-cua-be",
    title: "Mọc răng ảnh hưởng đến ăn uống của bé",
    summary: "Một phân tích tổng hợp trên tạp chí Pediatrics tìm thấy liên quan giữa mọc răng và giảm ăn thức ăn đặc (không phải giảm bú/uống) — nhưng các trang hướng dẫn chính thức cho phụ huynh (NHS/AAP) hiện KHÔNG liệt kê chán ăn là triệu chứng mọc răng chính thức, nên đây là điểm còn khoảng trống giữa nghiên cứu và tài liệu tư vấn phổ thông.",
    content: `## Mọc răng có ảnh hưởng đến việc ăn không?
Đây là điểm còn khoảng trống thật sự giữa các loại nguồn: một phân tích tổng hợp (bình duyệt) đăng trên tạp chí Pediatrics của AAP tìm thấy mối liên quan có ý nghĩa thống kê giữa mọc răng và việc GIẢM ĂN THỨC ĂN ĐẶC (không phải giảm bú sữa/uống nước) ở một số nghiên cứu. Tuy nhiên, các trang hướng dẫn CHÍNH THỨC dành cho phụ huynh của cả NHS và AAP hiện KHÔNG liệt kê chán ăn/từ chối ăn là triệu chứng mọc răng trong danh sách chính thức của họ (chỉ liệt kê: nướu sưng đỏ, chảy dãi nhiều, sốt nhẹ dưới 38°C, má ửng đỏ, thích cắn/gặm, khó chịu, ngủ không ngon).

## Vì sao có khoảng trống này
Có thể vì bằng chứng về ảnh hưởng lên sự thèm ăn còn khá mới/hạn chế so với các triệu chứng kinh điển khác, hoặc vì hiệu ứng này chỉ rõ ràng với thức ăn cần nhai (không phải bú/uống) nên dễ bị bỏ qua trong các danh sách triệu chứng tổng quát. Cha mẹ có thể nhận thấy bé giảm hứng thú với thức ăn đặc/thô trong vài ngày quanh lúc mọc răng — đây có thể là một hiện tượng thật, dù chưa được các trang hướng dẫn chính thức xác nhận rõ ràng như một "triệu chứng chuẩn".

## Không nên nhầm với các nguyên nhân khác
Nhắc lại: theo khuyến cáo chính thức, mọc răng KHÔNG gây sốt cao, tiêu chảy hay nôn (xem bài "Mọc răng: triệu chứng thật sự và cách giảm khó chịu an toàn") — nếu bé bỏ ăn kèm các dấu hiệu này, nên tìm nguyên nhân khác thay vì quy hết cho mọc răng.

## Gợi ý thực tế (dựa trên nguyên tắc chung, không phải khuyến cáo chính thức riêng cho mọc răng)
Nếu nghi ngờ bé giảm ăn vì khó chịu ở nướu, có thể thử cho ăn khi nướu đã được làm dịu (sau khi ngậm vòng nướu lạnh), không ép ăn khi bé đang khó chịu, và không cần lo lắng nếu bé chỉ giảm ăn nhẹ trong vài ngày rồi trở lại bình thường.`,
    category: "Mọc răng",
    stage: "INFANT_6_12_MONTHS",
    minimumAgeDays: 183,
    maximumAgeDays: 365,
    evidenceLevel: "LIMITED",
    knowledgeType: scientific,
    sources: [sources.massignanTeethingMeta, sources.teethingAAP, sources.aapBreastfeedingTeeth],
  },
  {
    slug: "tiem-chung-va-so-theo-doi",
    title: "Tiêm chủng và sổ theo dõi sức khỏe",
    summary: "Tiêm đúng lịch quốc gia và mang sổ sức khỏe tới mọi lần khám; lịch có thể thay đổi theo nơi ở và tiền sử.",
    content: `## Cách theo dõi
- Giữ một bản ghi tên vaccine, ngày tiêm, số liều, cơ sở tiêm và lịch hẹn tiếp theo.
- Mang sổ tới mọi lần khám và báo tiền sử dị ứng hoặc phản ứng sau tiêm.
- Nếu lỡ lịch, liên hệ cơ sở tiêm chủng để được xếp lịch bù; thông thường không nên tự kết luận phải tiêm lại từ đầu.
- Trẻ sinh non, có bệnh nền hoặc đi/đến vùng dịch có thể cần kế hoạch riêng.

Sau tiêm: Hỏi cơ sở tiêm về phản ứng thường gặp và dấu hiệu cần cấp cứu. Khó thở, sưng mặt, lừ đừ bất thường hoặc co giật cần trợ giúp y tế ngay.

Lưu ý: App không thay thế lịch Tiêm chủng mở rộng hiện hành tại Việt Nam.`,
    category: "Tiêm chủng",
    stage: "INFANT_6_12_MONTHS",
    minimumAgeDays: 0,
    maximumAgeDays: 730,
    evidenceLevel: "STRONG",
    knowledgeType: scientific,
    sources: [sources.vaccines],
  },
  {
    slug: "bua-an-can-bang-cho-tre-1-2-tuoi",
    title: "Bữa ăn cân bằng cho trẻ 1–2 tuổi",
    summary: "Ba bữa chính và bữa phụ phù hợp, đa dạng nhóm thực phẩm; cha mẹ quyết định món, trẻ quyết định lượng ăn.",
    content: `## Nhịp ăn đơn giản
- Duy trì giờ bữa chính và 1–2 bữa phụ tương đối ổn định; cho ngồi cùng gia đình khi có thể.
- Mỗi ngày xoay vòng rau quả, ngũ cốc/củ, thực phẩm giàu đạm-sắt và sữa/sản phẩm thay thế phù hợp.
- Cho nước lọc là đồ uống thường xuyên; tránh đồ uống có đường và hạn chế thức ăn quá mặn.
- Tiếp tục cho bú mẹ đến 2 tuổi hoặc lâu hơn nếu mẹ và bé mong muốn.

## Khi trẻ kén ăn
Cho khẩu phần nhỏ, luôn có ít nhất một món quen, không ép hoặc dùng đồ ngọt làm phần thưởng. Trẻ có thể cần gặp một món nhiều lần.

Khám nếu trẻ sụt cân, ho/sặc thường xuyên khi ăn, chỉ chấp nhận rất ít kết cấu hoặc bữa ăn luôn là cuộc chiến.`,
    category: "Dinh dưỡng của bé",
    stage: "TODDLER",
    minimumAgeDays: 366,
    maximumAgeDays: 730,
    evidenceLevel: "STRONG",
    knowledgeType: scientific,
    sources: [sources.complementary, sources.toddler],
  },
  {
    slug: "ngu-cho-tre-1-2-tuoi",
    title: "Giấc ngủ cho trẻ 1–2 tuổi",
    summary: "Trẻ 1–2 tuổi thường cần tổng 11–14 giờ ngủ mỗi 24 giờ, gồm cả giấc trưa.",
    content: `## Xây nhịp ngủ
- Giữ giờ thức và trình tự trước ngủ tương đối ổn định: vệ sinh, sách, ôm và tắt đèn.
- Cho vận động và ánh sáng ban ngày; giảm hoạt động kích thích và màn hình gần giờ ngủ.
- Không dùng thuốc, siro hoặc thảo dược gây ngủ nếu không có chỉ định.
- Chuyển khỏi cũi khi trẻ có thể trèo ra hoặc đã vượt giới hạn an toàn của sản phẩm; giữ phòng ngủ chống ngã và chống kẹt.

## Khi cần hỏi bác sĩ
Ngáy to thường xuyên, ngừng thở, thở gắng sức, rất buồn ngủ ban ngày hoặc mất ngủ kéo dài cần được đánh giá.`,
    category: "Giấc ngủ",
    stage: "TODDLER",
    minimumAgeDays: 366,
    maximumAgeDays: 730,
    evidenceLevel: "MODERATE",
    knowledgeType: scientific,
    sources: [sources.toddler],
  },
  {
    slug: "con-an-va-day-con-tich-cuc",
    title: "Cơn ăn vạ và cách đồng hành tích cực",
    summary: "Giữ bình tĩnh, gọi tên cảm xúc, đặt giới hạn ngắn gọn và nhất quán giúp trẻ học tự điều chỉnh.",
    content: `## Khi cơn ăn vạ xảy ra
- Trước hết bảo đảm an toàn, hạ giọng và dùng ít từ: “Con đang giận. Mẹ ở đây.”
- Giữ giới hạn rõ ràng với việc đánh, cắn, ném đồ; không giảng dài giữa lúc trẻ quá tải.
- Khi trẻ dịu, kết nối lại và chỉ cách diễn đạt nhu cầu bằng từ hoặc cử chỉ.

## Phòng ngừa
- Nhịp ăn-ngủ tương đối đều, báo trước khi chuyển hoạt động và cho hai lựa chọn nhỏ phù hợp.
- Khen cụ thể hành vi mong muốn: “Con đặt đồ chơi vào giỏ rất gọn.”
- Người lớn cần thay phiên nghỉ khi kiệt sức.

Không đánh, dọa, nhốt hoặc làm nhục trẻ. Nếu cơn quá dữ dội, gây thương tích, kéo dài bất thường hoặc đi cùng chậm ngôn ngữ, hãy trao đổi với bác sĩ.`,
    category: "Nuôi dạy tích cực",
    stage: "TODDLER",
    minimumAgeDays: 366,
    maximumAgeDays: 1095,
    evidenceLevel: "MODERATE",
    knowledgeType: scientific,
    sources: [sources.toddler, sources.milestones],
  },
  {
    slug: "phat-trien-ngon-ngu-va-man-hinh",
    title: "Ngôn ngữ, vui chơi và màn hình ở tuổi chập chững",
    summary: "Trẻ học tốt nhất qua nói chuyện, chơi và tương tác thật; theo dõi mốc phát triển để hành động sớm khi lo lắng.",
    content: `## Mỗi ngày
- Đọc sách tranh, gọi tên đồ vật và mở rộng lời trẻ: trẻ nói “xe”, người lớn đáp “xe đỏ chạy nhanh”.
- Cho trẻ giúp việc nhỏ, chơi xếp khối, giả vờ, hát và vận động ngoài trời an toàn.
- Ưu tiên tương tác trực tiếp. Với trẻ 2 tuổi, nếu dùng màn hình, giới hạn khoảng tối đa 1 giờ/ngày nội dung chất lượng và có người lớn cùng xem; ít hơn vẫn tốt hơn.

## Trao đổi sớm nếu lo lắng
Mốc phát triển là công cụ quan sát, không phải chẩn đoán. Đừng chờ nếu trẻ mất kỹ năng, ít giao tiếp mắt/cử chỉ, không phản ứng với tên, hoặc ngôn ngữ-vận động khiến gia đình lo lắng.`,
    category: "Phát triển",
    stage: "TODDLER",
    minimumAgeDays: 366,
    maximumAgeDays: 1095,
    evidenceLevel: "MODERATE",
    knowledgeType: scientific,
    sources: [sources.milestones, sources.toddler],
  },
  {
    slug: "an-toan-trong-nha-cho-tre-chap-chung",
    title: "An toàn trong nhà cho trẻ chập chững",
    summary: "Chống ngã, bỏng, ngộ độc, đuối nước và hóc bằng cách thay đổi môi trường trước khi trẻ khám phá.",
    content: `## Kiểm tra ngang tầm mắt trẻ
- Khóa thuốc, hóa chất, rượu, vật sắc và pin cúc áo; giữ nguyên bao bì, không gọi thuốc là kẹo.
- Cố định tủ/kệ/TV vào tường, dùng chặn cầu thang và khóa cửa sổ phù hợp.
- Quay cán nồi vào trong, để đồ nóng và dây điện ngoài tầm; kiểm tra nhiệt độ nước tắm.
- Không để trẻ một mình gần bồn, xô, hồ hoặc chậu nước; đuối nước có thể xảy ra nhanh và im lặng.
- Cắt thức ăn đúng cách và luôn cho ngồi khi ăn.

## Ngoài đường
Dùng ghế an toàn ô tô phù hợp cân nặng/chiều cao và đội mũ bảo hiểm đúng cỡ khi ngồi xe theo quy định địa phương.`,
    category: "An toàn",
    stage: "TODDLER",
    minimumAgeDays: 366,
    maximumAgeDays: 1095,
    evidenceLevel: "STRONG",
    knowledgeType: scientific,
    sources: [sources.choking, sources.toddler],
  },
  {
    slug: "vang-da-o-tre-so-sinh",
    title: "Vàng da ở trẻ sơ sinh: khi nào bình thường, khi nào cần khám ngay",
    summary: "Vàng da rất phổ biến ở trẻ sơ sinh và thường tự hết; nhưng vàng da trong 24 giờ đầu hoặc lan rộng cần được khám ngay.",
    content: `## Thường gặp và thường lành tính
- Khoảng một nửa trẻ sơ sinh có vàng da do gan còn non chưa xử lý kịp bilirubin; thường xuất hiện ngày thứ 2-3, bắt đầu ở mặt rồi lan dần xuống thân.
- Trẻ bú mẹ có thể vàng da nhẹ kéo dài đến 1 tháng tuổi; trẻ bú sữa công thức thường hết trong khoảng 2 tuần.
- Trẻ nên được kiểm tra vàng da khi khám sàng lọc 3-5 ngày tuổi.

## Yếu tố cần theo dõi sát hơn
Sinh non (trước 2 tuần so với dự sinh), bú chưa hiệu quả, từng có anh/chị bị vàng da nặng phải chiếu đèn, hoặc bị bầm tím da đầu lúc sinh.

## Đi khám ngay nếu
- Vàng da xuất hiện trong 24 giờ đầu sau sinh.
- Vàng lan xuống bụng, tay, chân hoặc tròng trắng mắt chuyển vàng.
- Bé khó đánh thức để bú, rất quấy hoặc bú kém rõ rệt.

Phần lớn vàng da không cần điều trị; khi cần, phương pháp phổ biến là chiếu đèn tại cơ sở y tế. Vàng da nặng không theo dõi có thể ảnh hưởng não bộ, vì vậy đừng chủ quan với các dấu hiệu trên.`,
    category: "Triệu chứng thường gặp",
    stage: "NEWBORN_0_28_DAYS",
    minimumAgeDays: 0,
    maximumAgeDays: 28,
    evidenceLevel: "STRONG",
    knowledgeType: scientific,
    sources: [sources.jaundiceAAP, sources.jaundiceMayo],
  },
  {
    slug: "phat-ban-da-thuong-gap-o-tre-so-sinh",
    title: "Mụn sữa, milia và rôm sảy: phân biệt và cách chăm sóc da bé",
    summary: "Ba tình trạng da rất phổ biến và lành tính ở trẻ nhỏ, phân biệt chủ yếu qua thời điểm xuất hiện và hình dạng nốt.",
    content: `## Phân biệt qua thời điểm
- Milia: các nốt trắng nhỏ li ti ở mũi, má, thường có ngay từ lúc sinh, tự hết trong vòng vài tuần đến khoảng 2-3 tháng.
- Mụn sữa (mụn trứng cá sơ sinh): các nốt đỏ nhỏ ở mặt, xuất hiện khoảng tuần 2-4 do nội tiết tố từ mẹ, tự hết trong 4-6 tháng; không cần bôi kem, không nặn.
- Rôm sảy: mảng hồng lấm tấm ở mặt, cổ, ngực do tuyến mồ hôi chưa hoàn thiện, thường khi bé nóng; cải thiện khi mặc thoáng, ở phòng mát hơn.

## Chăm sóc chung
Giữ da sạch, khô, tránh ủ ấm quá mức, không tự ý bôi kem, dầu hoặc thuốc không được chỉ định.

## Cần khám nếu
Nốt sưng mủ, lan rộng nhanh, kèm sốt, hoặc không giống các mô tả trên — có thể là nhiễm trùng da hoặc bệnh lý khác cần đánh giá.`,
    category: "Triệu chứng thường gặp",
    stage: "NEWBORN_0_28_DAYS",
    minimumAgeDays: 0,
    maximumAgeDays: 180,
    evidenceLevel: "STRONG",
    knowledgeType: scientific,
    sources: [sources.skinRashesAAP, sources.babyAcneMayo],
  },
  {
    slug: "hom-ta-o-tre",
    title: "Hăm tã: nguyên nhân, phòng ngừa và khi nào cần khám",
    summary: "Phần lớn hăm tã do da tiếp xúc lâu với ẩm ướt; đổi tã thường xuyên và dùng kem bảo vệ da giúp cải thiện trong vài ngày.",
    content: `## Phòng ngừa và chăm sóc tại nhà
- Thay tã thường xuyên, lau khô nhẹ nhàng, để da thoáng khí một lúc mỗi ngày nếu có thể.
- Dùng khăn lau không mùi hoặc nước ấm; thoa lớp kem có kẽm oxit hoặc petrolatum tạo lớp bảo vệ.
- Chọn tã vừa vặn, đủ thấm hút.

## Khi nào nghĩ đến nấm men
Vùng da đỏ tươi, bóng, viền rõ, có các nốt nhỏ vệ tinh xung quanh, đặc biệt ở nếp gấp da — thường cần thuốc kháng nấm bôi theo chỉ định, khác với hăm do ẩm ướt đơn thuần.

## Đi khám nếu
Hăm không đỡ sau 2-3 ngày chăm sóc tại nhà, xuất hiện mụn nước/mủ/đóng vảy, bé rất đau khi chạm, hoặc kèm sốt.`,
    category: "Triệu chứng thường gặp",
    stage: "NEWBORN_0_28_DAYS",
    minimumAgeDays: 0,
    maximumAgeDays: 365,
    evidenceLevel: "STRONG",
    knowledgeType: scientific,
    sources: [sources.diaperRashAAP, sources.diaperRashMayo],
  },
  {
    slug: "tro-sua-va-non-o-tre",
    title: "Trớ sữa và nôn: phân biệt và khi nào là dấu hiệu đáng lo",
    summary: "Trớ sữa nhẹ nhàng sau bú thường vô hại; nôn vọt thành tia lặp lại cần được khám sớm để loại trừ nguyên nhân cần can thiệp.",
    content: `## Trớ sữa thông thường
Sữa trào ra nhẹ nhàng, thường kèm ợ hơi, bé vẫn thoải mái, không sặc hay khó chịu. Đây là hiện tượng rất phổ biến do trào ngược sinh lý, thường bắt đầu trước 8 tuần tuổi và cải thiện dần, phần lớn hết trước 1 tuổi.

## Khi nào là nôn thật sự
Nôn ra nhiều, có lực mạnh hơn, bé mệt mỏi, kèm sốt hoặc bú kém — có thể là dấu hiệu bệnh lý cần được khám.

## Dấu hiệu cần khám sớm: hẹp môn vị
Nôn vọt thành tia (bắn xa), thường bắt đầu tuần 3-6 tuổi (hiếm sau 3 tháng), bé vẫn đói và muốn bú ngay sau khi nôn, có thể thấy sóng nhu động ở bụng, sụt cân hoặc tăng cân kém — cần được bác sĩ khám sớm.

Đi khám ngay nếu bé nôn vọt lặp lại, nôn ra dịch xanh/vàng, có máu, bụng chướng, hoặc có dấu hiệu mất nước (ít tã ướt, môi khô, lừ đừ).`,
    category: "Triệu chứng thường gặp",
    stage: "NEWBORN_0_28_DAYS",
    minimumAgeDays: 0,
    maximumAgeDays: 365,
    evidenceLevel: "STRONG",
    knowledgeType: scientific,
    sources: [sources.spitUpAAP, sources.pyloricMayo],
  },
  {
    slug: "nac-cut-va-nhip-tho-binh-thuong",
    title: "Nấc cụt và nhịp thở bình thường ở trẻ sơ sinh",
    summary: "Nấc cụt và thở không đều là hiện tượng rất thường gặp; biết các dấu hiệu bất thường giúp cha mẹ yên tâm hơn.",
    content: `## Nấc cụt
Rất phổ biến, thường do bú no hoặc nuốt hơi, hầu như không làm bé khó chịu dù cha mẹ lo lắng hơn. Có thể thử đổi tư thế, vỗ ợ hơi hoặc tạm dừng cữ bú.

## Nhịp thở bình thường
- Trẻ sơ sinh thở nhanh và không đều: khoảng 40-60 lần/phút lúc thức, chậm hơn lúc ngủ; thở chủ yếu bằng bụng.
- "Thở theo chu kỳ" (thở nhanh vài giây rồi ngừng ngắn 5-10 giây) khá thường gặp trong vài tuần đầu và thường vô hại nếu bé tự thở lại bình thường.
- Tiếng khụt khịt, è è do đường thở mũi còn nhỏ cũng thường gặp, không đáng lo nếu bé vẫn bú tốt và tăng cân.

## Cần khám ngay nếu
Ngừng thở trên 10-20 giây, tím tái quanh môi/da, thở rất nhanh kéo dài, rút lõm ngực khi thở, thở rít khi hít vào, hoặc bú kém/tăng cân chậm.`,
    category: "Triệu chứng thường gặp",
    stage: "NEWBORN_0_28_DAYS",
    minimumAgeDays: 0,
    maximumAgeDays: 90,
    evidenceLevel: "STRONG",
    knowledgeType: scientific,
    sources: [sources.spitUpAAP, sources.newbornCare],
  },
  {
    slug: "phan-va-tao-bon-o-tre-so-sinh",
    title: "Phân và táo bón ở trẻ sơ sinh: bình thường và bất thường",
    summary: "Tần suất đi ngoài của trẻ sơ sinh rất đa dạng; rặn đỏ mặt thường bình thường, còn phân cứng hoặc đổi màu bất thường cần chú ý.",
    content: `## Phân bình thường
- Vài ngày đầu là phân su (đen/xanh sẫm, dính).
- Bé bú mẹ: phân vàng mù tạt, mềm, lợn cợn hạt. Bé bú công thức: phân nâu/be, đặc hơn.
- Tần suất rất khác nhau: có thể sau mỗi cữ bú hoặc vài ngày một lần (trẻ bú mẹ có thể tới 7 ngày không đi ngoài) — miễn phân vẫn mềm khi ra thì thường vẫn bình thường.
- Rặn, đỏ mặt, gồng người khi đi ngoài là bình thường vì bé đang tập phối hợp cơ, không đồng nghĩa táo bón nếu phân vẫn mềm.

## Dấu hiệu táo bón
Phân cứng, khô, rặn kéo dài trên 10 phút không ra, bé có vẻ đau, hoặc bé bú công thức không đi ngoài 3-4 ngày kèm phân cứng khi ra.

## Đi khám nếu
Phân màu đỏ/đen (sau giai đoạn phân su)/trắng/xám, có máu, bụng chướng cứng, nôn, bỏ bú, hoặc trẻ dưới 1 tháng không đi ngoài cả ngày.`,
    category: "Triệu chứng thường gặp",
    stage: "NEWBORN_0_28_DAYS",
    minimumAgeDays: 0,
    maximumAgeDays: 365,
    evidenceLevel: "MODERATE",
    knowledgeType: scientific,
    sources: [sources.stoolMayo],
  },
  {
    slug: "sot-o-tre-nho-khi-nao-can-kham",
    title: "Sốt ở trẻ nhỏ: đo đúng cách và ngưỡng cần đi khám theo từng độ tuổi",
    summary: "Ngưỡng cần gọi bác sĩ khác nhau theo tuổi; trẻ dưới 3 tháng sốt từ 38°C trở lên cần được khám ngay dù không có triệu chứng khác.",
    content: `## Đo nhiệt độ đúng cách
- Nhiệt kế hậu môn cho kết quả chính xác nhất, đặc biệt quan trọng với trẻ dưới 3 tháng.
- Tránh dùng nhiệt kế tai ở trẻ dưới 6 tháng (ống tai còn nhỏ, dễ sai số); không dựa vào sờ trán hay miếng dán đo nhiệt.
- Sốt được định nghĩa là nhiệt độ hậu môn từ 38°C (100.4°F) trở lên.

## Ngưỡng cần gọi bác sĩ theo tuổi
- Dưới 3 tháng tuổi: sốt từ 38°C trở lên — gọi bác sĩ ngay lập tức, kể cả khi bé không có triệu chứng nào khác.
- 3-6 tháng tuổi: gọi bác sĩ khi nhiệt độ từ 38.3°C (101°F) trở lên.
- Trên 6 tháng tuổi: báo bác sĩ khi nhiệt độ từ 39.4°C (103°F) trở lên.

## Luôn cần khám ngay bất kể tuổi
Bé lừ đừ, khó đánh thức, bỏ bú, phát ban không mất màu khi ấn, co giật, khó thở, hoặc sốt kèm cứng cổ.

Ngưỡng ở trẻ dưới 3 tháng thấp hơn nhiều vì hệ miễn dịch còn non và nguy cơ nhiễm trùng nặng cao hơn — đừng chờ thêm triệu chứng khác ở nhóm tuổi này.`,
    category: "Triệu chứng thường gặp",
    stage: "NEWBORN_0_28_DAYS",
    minimumAgeDays: 0,
    maximumAgeDays: 1095,
    evidenceLevel: "STRONG",
    knowledgeType: scientific,
    sources: [sources.feverAAP],
  },
  {
    slug: "ho-nghet-mui-cam-lanh-o-tre-duoi-1-tuoi",
    title: "Ho, nghẹt mũi và cảm lạnh thông thường ở trẻ dưới 1 tuổi",
    summary: "Nhỏ mũi nước muối, hút mũi và máy tạo ẩm là các biện pháp an toàn; tuyệt đối không dùng thuốc ho cảm không kê đơn cho trẻ nhỏ.",
    content: `## Chăm sóc tại nhà an toàn
- Nhỏ 1-2 giọt nước muối sinh lý mỗi bên mũi để làm loãng dịch, sau đó dùng dụng cụ hút mũi — hiệu quả tốt nhất ở trẻ dưới 6 tháng.
- Dùng máy tạo ẩm phun sương mát (vệ sinh thường xuyên để tránh nấm mốc); tránh loại phun sương nóng.
- Cho bú/uống đủ nước, kê cao đầu khi ngủ nếu phù hợp với độ tuổi và hướng dẫn về giấc ngủ an toàn.

## Tuyệt đối không dùng
- Thuốc ho, cảm không kê đơn cho trẻ dưới 4 tuổi: không có bằng chứng hiệu quả ở trẻ nhỏ và có nguy cơ tác dụng phụ nghiêm trọng (co giật, dị ứng, khó thở).
- Mật ong cho trẻ dưới 12 tháng vì nguy cơ ngộ độc botulinum ở trẻ sơ sinh.

## Đi khám nếu
Thở khó hoặc thở nhanh bất thường, sốt kéo dài trên 3 ngày hoặc sốt tái lại sau khi đã hạ, bú kém, hoặc có dấu hiệu mất nước.`,
    category: "Triệu chứng thường gặp",
    stage: "NEWBORN_0_28_DAYS",
    minimumAgeDays: 0,
    maximumAgeDays: 365,
    evidenceLevel: "STRONG",
    knowledgeType: scientific,
    sources: [sources.coldAAP, sources.coldMedsFDA],
  },
  {
    slug: "so-sanh-sinh-thuong-va-sinh-mo",
    title: "Sinh thường và sinh mổ: khác biệt, thời gian hồi phục và khi nào cần mổ",
    summary: "Sinh mổ là phẫu thuật lớn nên thời gian nằm viện và hồi phục thường lâu hơn sinh thường; cả hai đều có thể cần thiết tùy tình huống.",
    content: `## Khác biệt chính
- Sinh thường: thường nằm viện khoảng 24-48 giờ; có thể vận động, tự chăm bé lại trong vài ngày; hồi phục hoàn toàn trung bình 2-6 tuần.
- Sinh mổ: là phẫu thuật vùng bụng, thường nằm viện 2-4 ngày; thời gian hồi phục thường lâu hơn sinh thường.
- Sau sinh mổ, mô bên trong lành trong khoảng 6-8 tuần, sẹo tử cung tiếp tục ổn định đến khoảng tuần 12; nên tránh nâng vật nặng và lái xe khoảng 4-6 tuần đầu.
- Giảm đau: sinh thường thường dùng nghỉ ngơi, chườm lạnh, thuốc giảm đau thông thường; sinh mổ thường phối hợp ibuprofen và paracetamol theo lịch, opioid chỉ khi cần thêm.
- Vận động sớm sau mổ (ngồi dậy, đi lại nhẹ trong ngày đầu) giúp tuần hoàn tốt hơn và giảm nguy cơ huyết khối.

## Khi nào cần sinh mổ
Ngôi thai bất thường (ngôi mông...), chuyển dạ không tiến triển, tim thai bất thường, sa dây rốn, nhau bong non/nhau tiền đạo, hoặc các nguy cơ khác cho mẹ và bé — có thể là mổ chủ động hoặc mổ cấp cứu.

Không có lựa chọn nào "tốt hơn" tuyệt đối — bác sĩ sẽ tư vấn dựa trên tình trạng cụ thể của mẹ và bé.`,
    category: "Chuẩn bị sinh",
    stage: "PREGNANCY",
    evidenceLevel: "STRONG",
    knowledgeType: scientific,
    sources: [sources.cesareanACOG, sources.unplannedCesareanACOG],
  },
  {
    slug: "chuan-bi-do-di-sinh-cho-me",
    title: "Chuẩn bị đồ đi sinh cho mẹ (sinh thường và sinh mổ)",
    summary: "Một túi đồ chuẩn bị sẵn từ tuần 36 giúp mẹ chủ động hơn khi chuyển dạ; sinh mổ cần thêm vài món phù hợp với vết mổ.",
    content: `## Giấy tờ và vật dụng cơ bản
- Hồ sơ khám thai, giấy tờ tùy thân, kế hoạch sinh nếu có.
- Quần áo rộng rãi khi chuyển dạ, áo choàng/dép đi trong viện, đồ ngủ cài khuy phía trước để tiện cho bú.
- 2-3 áo ngực cho con bú, vài bộ quần áo thay.

## Đồ dùng sau sinh
- 5-6 quần lót rời hoặc dùng một lần, 2 gói băng vệ sinh sau sinh thấm hút cao, miếng lót thấm sữa.
- Đồ vệ sinh cá nhân, đồ ăn nhẹ, nước uống, sạc điện thoại dây dài, đồ giải trí.

## Nếu sinh mổ theo kế hoạch
Nên mang thêm quần lót cạp cao hoặc rộng rãi để không cọ vào vết mổ; các vật dụng băng vệ sinh sau sinh vẫn dùng như sinh thường.

Gợi ý: có thể chuẩn bị riêng một túi cho lúc chuyển dạ/sinh và một túi cho những ngày nằm viện sau đó để dễ tìm đồ.`,
    category: "Chuẩn bị sinh",
    stage: "PREGNANCY",
    evidenceLevel: "MODERATE",
    knowledgeType: scientific,
    sources: [sources.hospitalBagNHS],
  },
  {
    slug: "chuan-bi-do-di-sinh-cho-be",
    title: "Chuẩn bị đồ đi sinh cho bé",
    summary: "Bé cần vài bộ quần áo cơ bản, tã và đặc biệt là ghế ngồi ô tô lắp đúng cách trước khi xuất viện nếu về nhà bằng xe hơi.",
    content: `## Quần áo và vật dụng cơ bản
- Bộ đồ về nhà, mũ, bao tay chống xước, tất/bao chân; áo ấm nếu trời lạnh.
- Ít nhất 3 bộ body/áo liền và 3 bộ đồ ngủ liền dùng hằng ngày.
- Khăn xô/khăn quấn, chăn mỏng cho chặng về nhà.

## Tã và khăn lau
Nhiều bệnh viện không cung cấp sẵn tã cho bé — nên mang theo khoảng 20-24 miếng tã cho 1-2 ngày nằm viện (trẻ sơ sinh thường thay 10-12 lần/ngày), cùng bông gòn hoặc khăn lau phù hợp.

## Ghế ngồi ô tô — bắt buộc trước khi về nhà
Nếu về nhà bằng ô tô, cần chuẩn bị sẵn ghế ngồi trẻ em quay mặt về sau, lắp đặt đúng cách trước khi xuất viện. Đây là khuyến nghị an toàn bắt buộc, không phải tùy chọn.`,
    category: "Chuẩn bị sinh",
    stage: "PREGNANCY",
    evidenceLevel: "STRONG",
    knowledgeType: scientific,
    sources: [sources.hospitalBagNHS, sources.carSeatNHTSA],
  },
  {
    slug: "dau-hieu-chuyen-da-that-va-gia",
    title: "Dấu hiệu chuyển dạ thật và chuyển dạ giả (cơn gò Braxton Hicks)",
    summary: "Cơn gò chuyển dạ thật đều đặn, ngày càng gần và mạnh hơn dù nghỉ ngơi; cơn gò giả thường giảm khi thay đổi tư thế hoặc nghỉ ngơi.",
    content: `## Phân biệt qua đặc điểm cơn gò
- Chuyển dạ thật: cơn co đều đặn, khoảng cách ngày càng ngắn lại, cường độ tăng dần theo thời gian, không giảm khi nghỉ ngơi hay đổi tư thế; đau thường bắt đầu ở lưng rồi lan ra trước.
- Chuyển dạ giả (Braxton Hicks): cơn co không đều, không gần lại theo thời gian, thường giảm hoặc mất khi nghỉ ngơi, đi bộ hoặc đổi tư thế; đau thường chỉ ở phía trước.

## Khi nào gọi hộ sinh/đến viện
Khi cơn gò đến đều đặn khoảng mỗi 5 phút một lần trở lên, mỗi cơn kéo dài khoảng 60-90 giây. Các dấu hiệu chuyển dạ thật khác: ra nhớt hồng (nút nhầy), đau mỏi lưng dưới, cảm giác nặng vùng chậu.

## Cần đến viện ngay bất kể thời điểm nếu
Vỡ ối, ra máu âm đạo, thai giảm cử động rõ rệt, một cơn gò kéo dài trên 2 phút, có từ 6 cơn gò trở lên trong 10 phút, hoặc có dấu hiệu chuyển dạ trước tuần 37.`,
    category: "Chuẩn bị sinh",
    stage: "PREGNANCY",
    evidenceLevel: "STRONG",
    knowledgeType: scientific,
    sources: [sources.laborSignsACOG, sources.laborSignsNHS],
  },
  {
    slug: "cham-soc-vet-khau-tang-sinh-mon",
    title: "Chăm sóc vết khâu tầng sinh môn sau sinh thường",
    summary: "Vết rách hoặc vết cắt tầng sinh môn thường lành trong khoảng một tháng; giữ sạch, khô và theo dõi dấu hiệu nhiễm trùng.",
    content: `## Chăm sóc hằng ngày
- Chỉ khâu thường tự tiêu; vết thương thường lành trong khoảng một tháng.
- Rửa vùng kín bằng nước ấm sau khi đi vệ sinh, lau khô theo chiều từ trước ra sau.
- Tập bài tập cơ sàn chậu (kegel) khi được hướng dẫn để hỗ trợ phục hồi.
- Giảm đau bằng paracetamol, ibuprofen (hỏi ý kiến nếu đang cho con bú), chườm lạnh, để vùng kín thoáng khí khi có thể.

## Dấu hiệu nhiễm trùng cần khám
Da quanh vết khâu đỏ, sưng; dịch tiết có mùi hôi hoặc mủ; đau ngày càng tăng thay vì giảm dần; đau kéo dài quá 2-3 tuần; sốt hoặc ớn lạnh.

Đi khám ngay nếu có các dấu hiệu trên hoặc vết thương hở, chảy máu nhiều bất thường.`,
    category: "Hậu sản",
    stage: "POSTPARTUM",
    evidenceLevel: "STRONG",
    knowledgeType: scientific,
    sources: [sources.episiotomyNHS],
  },
  {
    slug: "cham-soc-vet-mo-sau-sinh",
    title: "Chăm sóc vết mổ sau sinh mổ",
    summary: "Giữ vết mổ sạch và khô trong những ngày đầu; đau và tê nhẹ quanh sẹo thường giảm dần, nhưng cần cảnh giác dấu hiệu nhiễm trùng.",
    content: `## Chăm sóc tại nhà
- Giữ băng vô trùng trong 24-48 giờ đầu theo hướng dẫn của nhân viên y tế; giữ vết mổ khô trong vài ngày đầu, sau đó vệ sinh nhẹ nhàng đều đặn.
- Đau tức, tê nhẹ quanh sẹo là bình thường và cải thiện dần theo thời gian.
- Mặc quần lót cạp cao/rộng để tránh cọ xát vào vết mổ; tránh nâng vật nặng hơn bé theo hướng dẫn bác sĩ.

## Dấu hiệu cần đi khám ngay
Sốt trên 38°C, vết mổ ngày càng đỏ/sưng/đau hơn, chảy dịch hoặc mủ, vết mổ hở, dịch có mùi hôi, chảy máu nhiều, hoặc tiểu khó.

Những dấu hiệu này có thể báo hiệu nhiễm trùng vết mổ cần được xử trí sớm, không nên tự theo dõi thêm ở nhà.`,
    category: "Hậu sản",
    stage: "POSTPARTUM",
    evidenceLevel: "STRONG",
    knowledgeType: scientific,
    sources: [sources.cesareanACOG, sources.postpartumConditionsACOG],
  },
  {
    slug: "cuong-sua-tac-tia-sua-viem-vu",
    title: "Cương sữa, tắc tia sữa và viêm vú: cách nhận biết và xử lý",
    summary: "Ba tình trạng này thuộc cùng một chuỗi viêm ở vú; phần lớn cải thiện tại nhà, nhưng viêm vú kèm sốt cao cần dùng kháng sinh.",
    content: `## Nhận biết
- Cương sữa: cả hai bên vú căng, cứng, nóng, thường gặp ngày 3-5 sau sinh.
- Tắc tia sữa: một vùng vú nổi cục cứng, nóng, có thể kèm mảng đỏ, do dòng sữa bị chậm ở một vùng.
- Viêm vú: đau vú kèm triệu chứng giống cảm cúm toàn thân — mệt mỏi, ớn lạnh, sốt.

## Xử lý tại nhà
- Tiếp tục cho bú/hút sữa đều đặn theo nhu cầu của bé, nghỉ ngơi đầy đủ.
- Chườm lạnh giữa các cữ bú (tránh chườm nóng hoặc xoa bóp mạnh vì có thể làm viêm nặng hơn); xoa nhẹ nhàng hướng về phía nách/xương đòn.
- Mặc áo ngực nâng đỡ nhưng không bó chặt; đổi tư thế cho bú.

## Khi nào cần khám (có thể cần kháng sinh)
Không cải thiện sau 8-24 giờ chăm sóc tại nhà, sốt cao hoặc sốt đột ngột, có vệt đỏ lan từ quầng vú ra nách, có mủ hoặc máu trong sữa, hoặc đầu vú nứt có dấu hiệu nhiễm trùng. Vẫn có thể tiếp tục cho bú/hút sữa khi đang dùng kháng sinh theo chỉ định.`,
    category: "Bú và dinh dưỡng",
    stage: "POSTPARTUM",
    evidenceLevel: "STRONG",
    knowledgeType: scientific,
    sources: [sources.mastitisLLL, sources.engorgementLLL],
  },
  {
    slug: "san-dich-sau-sinh",
    title: "Sản dịch sau sinh: bình thường và khi nào là dấu hiệu bất thường",
    summary: "Sản dịch thường kéo dài 4-6 tuần và đổi màu dần từ đỏ sang vàng nhạt; ra máu ồ ạt hoặc có mùi hôi là dấu hiệu cần khám ngay.",
    content: `## Diễn tiến bình thường
- Ngày 1-5: máu đỏ tươi/đỏ sẫm, lượng nhiều nhất, có thể có cục nhỏ (không quá kích thước đồng xu nhỏ, khoảng 2.5cm).
- Khoảng ngày 4 đến 2 tuần: chuyển sang màu hồng nhạt/nâu, loãng hơn.
- Từ khoảng tuần 2 đến tuần 6: màu vàng nhạt/trắng, lượng ít, có thể ra lấm tấm.

## Dấu hiệu băng huyết sau sinh — cần cấp cứu ngay
Thấm ướt một băng vệ sinh đầy mỗi 1-2 giờ (hoặc 2 băng/giờ trong 1-2 giờ liền), ra cục máu đông lớn hơn khoảng 2.5cm, chóng mặt/choáng váng, tim đập nhanh. Có thể xảy ra trong vòng 24 giờ sau sinh nhưng cũng có thể muộn hơn, tới 12 tuần sau sinh.

## Dấu hiệu nhiễm trùng cần khám
Sản dịch có mùi hôi bất thường ở bất kỳ giai đoạn nào, sốt, hoặc sản dịch đang giảm bỗng ra nhiều trở lại — nên liên hệ nhân viên y tế.`,
    category: "Hậu sản",
    stage: "POSTPARTUM",
    evidenceLevel: "STRONG",
    knowledgeType: scientific,
    sources: [sources.postpartumConditionsACOG, sources.lochiaNHS],
  },
  {
    slug: "moc-rang-o-tre",
    title: "Mọc răng: triệu chứng thật sự và cách giảm khó chịu an toàn",
    summary: "Mọc răng thường bắt đầu 4-7 tháng tuổi và gây chảy dãi, khó chịu nhẹ; sốt cao hay tiêu chảy không phải do mọc răng và cần tìm nguyên nhân khác.",
    content: `## Thời điểm và thứ tự thường gặp
Phần lớn bé mọc răng đầu tiên khoảng 4-7 tháng tuổi (có bé sớm/muộn hơn nhiều vẫn bình thường), thường bắt đầu từ răng cửa giữa hàm dưới, sau đó hàm trên, rồi đến răng hàm và răng nanh.

## Triệu chứng thường do mọc răng
Chảy nhiều dãi, thích cắn/gặm đồ vật, nướu sưng đỏ nhẹ, hơi cáu gắt, sốt rất nhẹ (dưới ngưỡng sốt 38°C).

## Không phải do mọc răng
Theo khuyến cáo của hiệp hội nhi khoa Hoa Kỳ, mọc răng KHÔNG gây sốt cao, tiêu chảy hay nôn — nếu bé có các triệu chứng này, nên tìm nguyên nhân khác thay vì cho là do mọc răng.

## Cách giảm khó chịu an toàn
Vòng ngậm nướu để lạnh (không để đông cứng), khăn sạch ướp lạnh, xoa nhẹ nướu bằng ngón tay sạch, thìa lạnh; có thể dùng paracetamol/ibuprofen theo liều phù hợp nếu bé thực sự khó chịu nhiều.

## Cần tránh
Gel/thuốc bôi nướu chứa benzocain (FDA cảnh báo không dùng cho trẻ dưới 2 tuổi do nguy cơ methemoglobin máu), viên vi lượng đồng căn trị mọc răng (từng bị thu hồi do hàm lượng không ổn định), và vòng/dây chuyền hổ phách đeo cổ (nguy cơ nghẹt thở, siết cổ).`,
    category: "Mọc răng",
    stage: "INFANT_3_6_MONTHS",
    minimumAgeDays: 60,
    maximumAgeDays: 730,
    evidenceLevel: "STRONG",
    knowledgeType: scientific,
    sources: [sources.teethingAAP, sources.teethingReliefAAP, sources.benzocaineFDA, sources.homeopathicRecallFDA],
  },
  {
    slug: "giac-ngu-sinh-ly-va-tieng-dong-binh-thuong-khi-ngu",
    title: "Giấc ngủ sinh lý của trẻ sơ sinh: vì sao bé hay giật mình, rên è è khi ngủ",
    summary: "Trẻ sơ sinh ngủ nhiều nhưng chia thành giấc ngủ động và giấc ngủ sâu xen kẽ; giật mình, rên, thở không đều khi ngủ thường là bình thường.",
    content: `## Tổng thời gian ngủ
Trẻ sơ sinh thường ngủ khoảng 14-18 giờ mỗi ngày nhưng chia thành nhiều giấc ngắn 1-4 giờ, không phải một mạch dài. Các nguồn chính thức đưa ra khoảng hơi khác nhau (AAP: khoảng 16-17 giờ; NHS: 8-18 giờ; UNICEF: 14-18 giờ) — đây là khoảng tham khảo rộng, không phải con số cố định cho mọi bé.

## Hai loại giấc ngủ xen kẽ
Khoảng một nửa thời gian ngủ của bé là "giấc ngủ động" (mắt cử động, tay chân giật nhẹ, có thể phát ra tiếng) và nửa còn lại là "giấc ngủ sâu" (nằm yên hơn). Chu kỳ này lặp lại nhiều lần và khác hẳn người lớn cho tới khoảng 6 tháng tuổi.

## Tiếng động và cử động khi ngủ thường là bình thường
- Giật mình, rên, ê a, thở nhanh-chậm xen kẽ hoặc ngừng thở ngắn 5-10 giây rồi thở lại (gọi là "thở theo chu kỳ") là hiện tượng sinh lý bình thường ở giấc ngủ động, không cần đánh thức bé.
- Không cần can thiệp nếu bé vẫn hồng hào và tự thở lại bình thường.

## Lệch ngày đêm
Nhiều bé sơ sinh chưa có "đồng hồ sinh học" nên ngủ nhiều ban ngày và thức/đòi bú nhiều về đêm trong vài tuần đầu — hiện tượng này thường tự cải thiện. Có thể hỗ trợ bằng cách giữ ban ngày sáng, có tiếng động sinh hoạt bình thường, còn ban đêm giữ ánh sáng dịu và chỉ tương tác vừa đủ để bú-thay tã-dỗ nhẹ.

## Khó vào giấc mà không được bế
Trong những tuần đầu, việc bé chỉ ngủ được khi được bế hoặc đung đưa là bình thường, không phải "tật xấu" cần sửa ngay.

## Cần khám nếu
Thở rít thành tiếng liên tục, rút lõm ngực khi thở, ngừng thở trên 10-20 giây, tím tái, hoặc bé khó đánh thức/bú rất kém.`,
    category: "Giấc ngủ",
    stage: "NEWBORN_0_28_DAYS",
    minimumAgeDays: 0,
    maximumAgeDays: 60,
    evidenceLevel: "MODERATE",
    knowledgeType: scientific,
    sources: [sources.sleepStagesAAP, sources.daynightAAP, sources.helpingSleepNHS, sources.stridorAAP],
  },
  {
    slug: "quan-be-num-ti-gia-va-nhiet-do-phong-ngu",
    title: "Quấn bé, núm ti giả và nhiệt độ phòng khi ngủ: những câu hỏi thường gặp",
    summary: "Quấn đúng cách, cân nhắc núm ti giả và giữ phòng ngủ mát vừa phải bổ sung cho nguyên tắc ngủ an toàn cơ bản (nằm ngửa, nệm phẳng, phòng ngủ trống).",
    content: `## Quấn bé (swaddling)
- Không có bằng chứng cho thấy quấn làm giảm nguy cơ đột tử ở trẻ sơ sinh (SIDS); nhưng nếu quấn, luôn đặt bé nằm ngửa — nguy cơ tử vong tăng rất cao nếu bé quấn chặt mà lại nằm sấp hoặc lật sấp.
- Quấn vừa vặn ở ngực nhưng để rộng rãi vùng hông-đầu gối (co gập tự nhiên được) để tránh ảnh hưởng khớp háng; không dùng khăn/túi quấn có trọng lượng.
- Ngừng quấn tay ngay khi bé có dấu hiệu cố lật, thường khoảng 3-4 tháng nhưng có thể sớm hơn — đây là mốc an toàn quan trọng hơn việc phản xạ giật mình (Moro) đã hết hay chưa.

## Núm ti giả
AAP khuyến nghị cho bé ngậm núm ti giả khi ngủ trưa/tối vì quan sát thấy giảm nguy cơ SIDS, kể cả khi núm rơi ra khỏi miệng bé. Tuy nhiên cơ chế bảo vệ chưa được hiểu rõ, và Cochrane ghi nhận chưa có thử nghiệm ngẫu nhiên có đối chứng nào xác nhận điều này — mới chỉ có bằng chứng quan sát. Nếu bé bú mẹ, nên đợi việc bú mẹ ổn định (khớp ngậm tốt, lên cân đều) trước khi giới thiệu núm ti giả; không ép nếu bé từ chối; không đeo dây quanh cổ bé.

## Nhiệt độ phòng
Không có một con số nhiệt độ phòng được mọi tổ chức thống nhất: AAP cho biết khó đưa ra ngưỡng cụ thể vì các nghiên cứu định nghĩa "quá nóng" khác nhau, trong khi NHS khuyến nghị khoảng 16-20°C. Con số "68-72°F" thường lan truyền trên mạng không xác nhận được là khuyến cáo chính thức của AAP/CDC.
- Dấu hiệu bé quá nóng: đổ mồ hôi, da ửng đỏ, ngực sờ thấy nóng. Tay chân mát là bình thường, không phải dấu hiệu lạnh.
- Chưa đủ bằng chứng để khuyến nghị dùng quạt như một biện pháp giảm nguy cơ SIDS (theo AAP). Điều hòa và máy tạo ẩm chưa được WHO/CDC/AAP/NHS đề cập trực tiếp trong hướng dẫn ngủ an toàn — nếu dùng, nên giữ phòng mát vừa phải, không thổi trực tiếp vào bé và vệ sinh thiết bị thường xuyên.

## Ngủ cùng phòng, không cùng giường
Cho bé ngủ cùng phòng nhưng trên bề mặt riêng (nôi/cũi) ít nhất 6 tháng đầu giúp giảm nguy cơ SIDS khoảng 50% theo AAP; bé ngủ phòng riêng có nguy cơ cao hơn 2.75-11.5 lần. Nằm chung giường có nguy cơ tăng rất cao (hơn 10 lần) nếu người lớn dùng rượu/thuốc an thần hoặc hút thuốc, và tăng 22-67 lần nếu ngủ chung trên sofa/ghế bành — tuyệt đối tránh hai tình huống này.`,
    category: "Giấc ngủ",
    stage: "NEWBORN_0_28_DAYS",
    minimumAgeDays: 0,
    maximumAgeDays: 180,
    evidenceLevel: "MODERATE",
    knowledgeType: scientific,
    sources: [sources.swaddlingAAP, sources.safeSleepPolicyAAP, sources.pacifierCochrane, sources.safeSleep],
  },
  {
    slug: "bu-cum-va-so-cu-bu-moi-ngay",
    title: "Bú cụm và số cữ bú mỗi ngày ở trẻ sơ sinh",
    summary: "Bú dồn dập nhiều lần trong vài giờ (bú cụm) và số cữ bú dao động 8-12 lần/ngày đều có thể bình thường; quan trọng là bé tăng cân và có đủ tã ướt/phân.",
    content: `## Bú cụm là gì
Bú cụm (cluster feeding) là khi bé muốn bú nhiều lần liên tiếp trong khoảng thời gian ngắn, thường vào buổi tối hoặc trong các đợt tăng trưởng nhanh. Đây là hành vi bình thường của trẻ sơ sinh, giúp kích thích tăng lượng sữa mẹ — không tự nó là dấu hiệu có vấn đề về bú.

## Số cữ bú mỗi ngày
Trẻ bú mẹ hoàn toàn thường bú khoảng 8-12 lần/24 giờ trong những tuần đầu, nhưng khoảng dao động thực tế rộng hơn (có nguồn ghi nhận 4-13 lần/ngày) vì mỗi bé và mỗi mẹ khác nhau. Các tổ chức y tế chủ động không đưa ra một con số duy nhất mà nhấn mạnh theo dõi dấu hiệu đói-no, số tã ướt/phân và đà tăng cân thay vì đếm chính xác số cữ.

## Bé đòi bú lại ngay sau khi vừa bú xong
Điều này khá phổ biến và có thể là bé bú để thỏa mãn nhu cầu mút-ngậm chứ không chỉ vì đói. Đây không phải lúc nào cũng là dấu hiệu bất thường, nhưng nếu đi kèm khớp ngậm đau/nông, không nghe tiếng nuốt, hoặc bé không tăng cân tốt thì nên được đánh giá khớp ngậm và lượng sữa.

## Không cần đánh thức nếu bé bú tốt
Bú cụm không có nghĩa là bé "bú không đủ" ở cữ trước; không cần ép bé bú thêm hoặc bổ sung sữa công thức chỉ vì bú cụm.

## Cần trao đổi với nhân viên y tế nếu
- Mỗi cữ bú thường xuyên kéo dài dưới 10 phút hoặc trên 50 phút.
- Không nghe tiếng nuốt sau khi sữa mẹ đã về.
- Ít hơn 6 tã ướt và 4 lần đi ngoài mỗi ngày sau ngày thứ 7, hoặc bé không tăng cân như mong đợi.`,
    category: "Bú và dinh dưỡng",
    stage: "NEWBORN_0_28_DAYS",
    minimumAgeDays: 0,
    maximumAgeDays: 28,
    evidenceLevel: "STRONG",
    knowledgeType: scientific,
    sources: [sources.clusterFeedingABM, sources.newbornBreastfeedingCDC, sources.llliFrequency, sources.breastfeedingWarningAAP],
  },
  {
    slug: "danh-thuc-be-bu-va-bo-sung-sua-cong-thuc-khi-nao-can",
    title: "Đánh thức bé bú và khi nào thực sự cần bổ sung sữa công thức",
    summary: "Nên đánh thức bé nếu ngủ quá 4-5 giờ chưa bú trong vài tuần đầu; việc bổ sung sữa công thức cho bé bú mẹ chỉ nên dựa trên dấu hiệu y khoa cụ thể, không phải vì bú cụm hay quấy khóc.",
    content: `## Khi nào cần đánh thức bé bú
Với trẻ bú sữa công thức, AAP nêu rõ: nếu bé ngủ hơn 4-5 giờ trong vài tuần đầu và bỏ lỡ cữ bú, nên đánh thức bé. Với trẻ bú mẹ, các nguồn không đưa ra một ngưỡng giờ cụ thể riêng, nhưng logic theo dõi cân nặng và nguy cơ vàng da trong 2-3 tuần đầu — giai đoạn bé cần lấy lại cân nặng lúc sinh (trung bình khoảng 8-9 ngày, hầu hết bé lấy lại được trước 3 tuần tuổi) — dẫn tới khuyến cáo tương tự về việc theo dõi sát và có thể cần đánh thức bú nếu bé ngủ quá lâu.

## Các dấu hiệu y khoa để cân nhắc bổ sung sữa công thức
Theo hướng dẫn của Hiệp hội Y học Bú mẹ (ABM), việc bổ sung có thể cần cân nhắc khi có các dấu hiệu khách quan như: bé sụt cân từ 8-10% trở lên tính đến ngày thứ 5 hoặc muộn hơn, ít hơn 4 lần đi ngoài đến ngày thứ 4, có dấu hiệu mất nước hoặc hạ đường huyết đã được xác nhận, vàng da liên quan đến bú kém, hoặc mẹ có vấn đề thực sự về sữa về chậm/ít sữa dù đã hỗ trợ khớp ngậm và tần suất bú. Bản thân ABM cũng lưu ý: "sụt cân 10% không tự động là dấu hiệu cần bổ sung sữa, mà là dấu hiệu cần được đánh giá thêm."

## Không phải lý do để bổ sung
Bú cụm bình thường, mẹ mệt mỏi đơn thuần, hoặc bé quấy khóc không kèm các dấu hiệu trên không phải là lý do y khoa để tự ý bổ sung sữa công thức khi mẹ vẫn muốn nuôi con hoàn toàn bằng sữa mẹ.

## Lưu ý
Đây là các dấu hiệu chung mang tính tham khảo; quyết định bổ sung nên được nhân viên y tế đánh giá dựa trên tình trạng cụ thể của mẹ và bé, không tự áp dụng máy móc.`,
    category: "Bú và dinh dưỡng",
    stage: "NEWBORN_0_28_DAYS",
    minimumAgeDays: 0,
    maximumAgeDays: 28,
    evidenceLevel: "MODERATE",
    knowledgeType: scientific,
    sources: [sources.formulaAmountAAP, sources.clusterFeedingABM],
  },
  {
    slug: "pha-sua-cong-thuc-va-bu-binh-dung-cach",
    title: "Pha sữa công thức và cho bú bình đúng cách",
    summary: "Nước pha sữa cần đạt tối thiểu 70°C, luôn theo đúng tỷ lệ trên nhãn, và cho bú bình theo nhịp chậm giúp bé kiểm soát lượng bú tốt hơn.",
    content: `## Pha sữa an toàn
- Dùng nước đun sôi để nguội còn ít nhất 70°C khi pha (nước sôi để khoảng 30 phút thường vẫn đủ nóng); không dùng nước đã nguội hẳn cho trẻ nhỏ trong giai đoạn này.
- Luôn theo đúng tỷ lệ nước-bột ghi trên nhãn sản phẩm; không tự thêm nước (làm loãng, giảm dinh dưỡng) hoặc thêm bột (có thể gây táo bón, mất nước).
- Pha từng bình một lần dùng; sữa đã pha nên dùng trong vòng 2 giờ ở nhiệt độ phòng, hoặc cất tủ lạnh ngay và dùng trong 24 giờ; bỏ phần sữa bé bú không hết.
- Không hâm sữa bằng lò vi sóng vì có thể nóng không đều, gây bỏng miệng bé.

## Lượng và tần suất tham khảo
Tuần đầu: khoảng 30-60ml/cữ; đến khoảng 1 tháng tuổi: khoảng 90-120ml/cữ, thường mỗi 3-4 giờ. Đây là khoảng tham khảo — theo dõi dấu hiệu no của bé quan trọng hơn ép hết bình.

## Bú bình theo nhịp chậm (paced bottle feeding)
Giữ bé ở tư thế ngồi thẳng hơn, cầm bình gần nằm ngang để sữa chỉ chảy ra khi bé mút chủ động, cho bé nghỉ giữa chừng, và dừng khi bé có dấu hiệu no dù bình chưa hết — cách này giúp mô phỏng nhịp bú mẹ, giảm nguy cơ bú quá no và hữu ích cho bé vừa bú mẹ vừa bú bình. Không kê bình cho bé tự bú một mình.`,
    category: "Bú và dinh dưỡng",
    stage: "NEWBORN_0_28_DAYS",
    minimumAgeDays: 0,
    maximumAgeDays: 90,
    evidenceLevel: "STRONG",
    knowledgeType: scientific,
    sources: [sources.formulaPrepNHS, sources.formulaHowMuchCDC, sources.formulaAmountAAP, sources.bottleFeedingCDC],
  },
  {
    slug: "it-sua-hay-nhieu-sua-dau-hieu-tu-me-va-be",
    title: "Ít sữa hay nhiều sữa: dấu hiệu nhận biết từ mẹ và bé",
    summary: "Bú cụm hay quấy khóc một mình không phải dấu hiệu ít sữa; ngược lại, bé sặc/ọc khi bú và mẹ luôn căng tức có thể là dấu hiệu nhiều sữa/xuống sữa mạnh.",
    content: `## Dấu hiệu có thể là nhiều sữa/xuống sữa mạnh
- Bé: ho, sặc, mút vội, rụt ti ra rồi vào liên tục khi xuống sữa; có thể ưỡn người/quấy khi bú; bú nhanh nhưng no hơi nhiều nên phân lỏng, sủi bọt, đôi khi có tia máu nhỏ do kích ứng ruột.
- Mẹ: xuống sữa mạnh (cảm giác tia sữa phun mạnh), vú không bao giờ cảm thấy "hết sữa" dù vừa cho bú xong, hay bị tắc tia sữa/viêm vú tái diễn.

## Dấu hiệu có thể là ít sữa
Bé ngủ li bì, ít năng lượng, dễ ngủ gật ngay khi mới bú được một lúc; khớp ngậm nông hoặc gây đau cho mẹ; đến ngày 10-14 chưa lấy lại cân nặng lúc sinh, hoặc tăng cân dưới khoảng 150-240g/tuần; ít hơn 3-4 lần đi ngoài/ngày ở ngày thứ 4; nước tiểu không trong/nhạt màu.

## Không phải là dấu hiệu ít sữa
Bú thường xuyên, quấy khóc, hoặc muốn được bế thường KHÔNG phải bằng chứng đáng tin cậy cho việc ít sữa — đây thường là hành vi bình thường của trẻ sơ sinh. Cách đánh giá đáng tin cậy nhất vẫn là đà tăng cân và số tã ướt/phân theo thời gian, không phải cảm giác chủ quan hay tần suất đòi bú.

## Nên làm gì
Nếu nghi ngờ nhiều sữa hoặc ít sữa, nên được nhân viên y tế/chuyên gia tư vấn sữa mẹ đánh giá khớp ngậm, tư thế bú và cân nặng của bé trước khi tự điều chỉnh chế độ ăn hoặc dùng sản phẩm "lợi sữa"/"giảm sữa" không rõ nguồn gốc.`,
    category: "Bú và dinh dưỡng",
    stage: "NEWBORN_0_28_DAYS",
    minimumAgeDays: 0,
    maximumAgeDays: 90,
    evidenceLevel: "STRONG",
    knowledgeType: scientific,
    sources: [sources.llliOversupply, sources.llliLowSupply, sources.breastfeedingWarningAAP],
  },
  {
    slug: "so-ta-uot-va-nuoc-tieu-cua-tre-so-sinh",
    title: "Số tã ướt và nước tiểu của trẻ sơ sinh trong tuần đầu",
    summary: "Số tã ướt tăng dần mỗi ngày trong tuần đầu và thường đạt 6+ tã ướt/ngày từ ngày 5-7; các nguồn quốc tế đưa số liệu hơi khác nhau ở ngày 3-4, nên đây là khoảng tham khảo.",
    content: `## Số tã ướt tăng dần theo ngày
Nhiều nguồn thống nhất về xu hướng chung: ít tã ướt ở ngày 1-2, tăng dần và đạt khoảng 6 tã ướt trở lên mỗi ngày từ khoảng ngày 5-7 tuổi trở đi. Tuy nhiên số liệu cụ thể ở ngày 3-4 khác nhau giữa các nguồn: CDC ghi nhận khoảng 5 tã ướt vào ngày 3, trong khi một số tài liệu của NHS/UNICEF Anh ghi nhận khoảng 3 tã ướt vào ngày 3. Vì vậy nên xem đây là xu hướng tăng dần tham khảo, không phải một bảng số liệu tuyệt đối cho mọi bé.

## Màu sắc nước tiểu bình thường
Nước tiểu bình thường có màu trong đến vàng nhạt.

## Vệt hồng/cam trong tã (tinh thể urat)
Trong vài ngày đầu, có thể thấy vệt màu hồng hoặc cam như "bụi gạch" trong tã — đây thường là tinh thể urat do nước tiểu còn cô đặc, khá phổ biến và thường vô hại. Nếu bé vẫn có ít nhất 4 tã ướt/ngày, thường không đáng lo; nếu vệt này còn tiếp diễn sau vài ngày đầu hoặc bé có ít tã ướt, nên hỏi bác sĩ.

## Dấu hiệu mất nước cần chú ý
Ít tã ướt hơn bình thường theo tuổi, nước tiểu vàng sậm/cô đặc, kèm các dấu hiệu khác như: mắt trũng, khóc không có nước mắt, thóp lõm, khô miệng, hoặc bé lừ đừ/dễ cáu gắt bất thường — các dấu hiệu này cần được khám sớm, không chỉ dựa vào một dấu hiệu đơn lẻ.`,
    category: "Bài tiết",
    stage: "NEWBORN_0_28_DAYS",
    minimumAgeDays: 0,
    maximumAgeDays: 28,
    evidenceLevel: "MODERATE",
    knowledgeType: scientific,
    sources: [sources.newbornBreastfeedingCDC, sources.wetDiapersNorfolk, sources.enoughMilkAAP, sources.dehydrationNHS],
  },
  {
    slug: "phan-xa-nguyen-thuy-o-tre-so-sinh",
    title: "Các phản xạ nguyên thủy ở trẻ sơ sinh: Moro, tìm vú, mút, nắm, bước",
    summary: "Trẻ sơ sinh có sẵn nhiều phản xạ tự động biến mất dần trong vài tháng đầu; phản xạ mất hẳn một bên hoặc không đối xứng là dấu hiệu cần khám.",
    content: `## Các phản xạ thường gặp
- Phản xạ giật mình (Moro): khi đầu bé đột ngột ngửa ra hoặc có tiếng động lớn, bé dang tay chân rồi thu lại, có thể kèm khóc to. Thường rõ nhất trong tháng đầu và mờ dần — một số nguồn ghi nhận giảm rõ khoảng 2 tháng tuổi, nguồn khác ghi nhận biến mất hoàn toàn tới khoảng 6 tháng, nên hiểu đây là quá trình mờ dần trong vài tháng chứ không có một mốc cố định duy nhất.
- Phản xạ tìm vú (rooting): chạm nhẹ vào má/miệng bé, bé quay đầu về phía chạm để tìm vú, hỗ trợ bú; thường mất dần khoảng 4 tháng tuổi.
- Phản xạ mút: chạm vào vòm miệng khiến bé mút theo nhịp, là nền tảng để bé bú; đây không hẳn là phản xạ "biến mất" mà dần chuyển thành kỹ năng bú có ý thức của bé.
- Phản xạ nắm tay (palmar grasp): chạm lòng bàn tay khiến bé nắm chặt (đủ chặt để tưởng như treo được, nhưng đây không phải cử động có kiểm soát); thường mất dần khoảng 5-6 tháng.
- Phản xạ bước (stepping): giữ bé đứng thẳng, chân chạm mặt phẳng, bé có động tác như đang bước; thường mất dần khoảng 2 tháng và không liên quan gì tới việc bé biết đi sau này.

## Khi nào cần lưu ý
Nếu phản xạ rõ ràng khác nhau giữa hai bên cơ thể, hoặc hoàn toàn không thấy phản xạ, nên báo với bác sĩ — có thể liên quan đến vấn đề thần kinh, tủy sống hoặc tổn thương dây thần kinh/đám rối cần được đánh giá chuyên khoa, không nên tự chẩn đoán hay chờ đợi.`,
    category: "Phát triển",
    stage: "NEWBORN_0_28_DAYS",
    minimumAgeDays: 0,
    maximumAgeDays: 180,
    evidenceLevel: "MODERATE",
    knowledgeType: scientific,
    sources: [sources.reflexesAAP, sources.reflexesJournal],
  },
  {
    slug: "than-nhiet-va-do-nhiet-do-dung-cach-cho-tre-so-sinh",
    title: "Vì sao trẻ sơ sinh dễ mất nhiệt và cách đo nhiệt độ đúng cách",
    summary: "Trẻ sơ sinh mất nhiệt nhanh hơn người lớn do diện tích da lớn so với cơ thể và chưa run được để sinh nhiệt; đo nhiệt độ ở hậu môn chính xác nhất trong tháng đầu.",
    content: `## Vì sao trẻ sơ sinh dễ bị lạnh
So với người lớn, trẻ sơ sinh có diện tích da lớn hơn nhiều so với thể tích cơ thể, lớp mỡ dưới da mỏng và chưa run được để sinh nhiệt — vì vậy dễ mất nhiệt qua tiếp xúc bề mặt lạnh, không khí lạnh, gió lùa hoặc da ướt. Đây là lý do da kề da và lau khô ngay sau sinh rất quan trọng.

## Nhiệt độ bình thường và hạ thân nhiệt
Nhiệt độ bình thường của trẻ sơ sinh khoảng 36.5-37.5°C (đo nách hoặc hậu môn). Theo phân loại của WHO: hạ thân nhiệt nhẹ khoảng 36.0-36.4°C, trung bình 32.0-35.9°C, nặng dưới 32°C. Dấu hiệu sớm gồm: tay chân lạnh, da tái/nổi vân tím, bé lừ đừ hoặc bú kém, khóc bất thường. Xử trí cơ bản là ủ ấm và da kề da; hạ thân nhiệt trung bình-nặng cần được xử trí y tế, không tự điều trị tại nhà.

## Đo nhiệt độ đúng cách
Với trẻ dưới 3 tháng, nhiệt kế hậu môn cho kết quả chính xác nhất và quan trọng để không bỏ sót sốt cần khám gấp. Đo nách tiện lợi để sàng lọc nhanh nhưng kém chính xác hơn (thường thấp hơn nhiệt độ hậu môn). Nhiệt kế tai không đáng tin cậy ở trẻ nhỏ do ống tai còn hẹp/cong; không dựa vào sờ trán.

## Ngưỡng sốt và một lưu ý quan trọng của WHO
Sốt được định nghĩa là nhiệt độ hậu môn từ 38°C trở lên, và ở trẻ 0-3 tháng tuổi đây luôn là dấu hiệu cần gọi bác sĩ ngay. Một điểm WHO nhấn mạnh mà cha mẹ dễ bỏ qua: ở trẻ sơ sinh, thân nhiệt THẤP bất thường (dưới khoảng 35.5°C) cũng là dấu hiệu nguy hiểm ngang với sốt cao, vì trẻ nhỏ có thể phản ứng với nhiễm trùng nặng bằng hạ thân nhiệt thay vì sốt.

## Nhiệt độ phòng
Không có một con số nhiệt độ phòng ngủ được mọi tổ chức thống nhất; NHS gợi ý khoảng 16-20°C cho phòng ngủ tại nhà (xem thêm bài "Quấn bé, núm ti giả và nhiệt độ phòng khi ngủ").`,
    category: "Triệu chứng thường gặp",
    stage: "NEWBORN_0_28_DAYS",
    minimumAgeDays: 0,
    maximumAgeDays: 28,
    evidenceLevel: "MODERATE",
    knowledgeType: scientific,
    sources: [sources.thermalWHO, sources.feverAAP],
  },
  {
    slug: "sang-loc-so-sinh-va-lich-kham-thang-dau",
    title: "Sàng lọc sơ sinh và lịch khám trong tháng đầu",
    summary: "Trẻ sơ sinh thường được sàng lọc máu gót chân, tim bẩm sinh và thính lực trước khi xuất viện; WHO khuyến nghị thêm các lần khám vào khoảng ngày 3, ngày 7-14 và tuần 6.",
    content: `## Sàng lọc sơ sinh phổ biến
- Sàng lọc máu gót chân (bloodspot): lấy máu gót chân trong 24-48 giờ đầu để tầm soát một số bệnh rối loạn chuyển hóa/di truyền hiếm gặp; một số nơi làm thêm lần hai khoảng 2 tuần tuổi.
- Sàng lọc tim bẩm sinh nặng bằng đo độ bão hòa oxy (pulse oximetry): thường thực hiện khi bé đã được ít nhất 24 giờ tuổi, đo ở tay phải và một chân; giúp phát hiện sớm một số bệnh tim bẩm sinh nặng dù không phát hiện được tất cả các trường hợp.
- Sàng lọc thính lực: khuyến nghị thực hiện trước 1 tháng tuổi, tốt nhất trước khi xuất viện, vì khả năng học ngôn ngữ của não bộ giảm dần theo tuổi nếu thính lực có vấn đề mà không được phát hiện sớm.

## Lịch khám sau sinh cho bé (theo khuyến nghị của WHO)
Ngoài thời gian theo dõi tối thiểu 24 giờ tại cơ sở sinh, WHO khuyến nghị thêm các lần khám vào khoảng ngày 3 (48-72 giờ), trong khoảng ngày 7-14, và ở tuần thứ 6 — có thể tại nhà hoặc cơ sở y tế tùy điều kiện, và cần khám thêm nếu có yếu tố nguy cơ.

## Lần khám đầu tiên với bác sĩ nhi (tham khảo theo AAP)
Thường vào khoảng 2-5 ngày tuổi, tập trung vào: cân nặng và tình trạng bú, sàng lọc vàng da, xem lại kết quả sàng lọc máu/thính lực, kiểm tra rốn, tư vấn giấc ngủ an toàn, và sức khỏe tinh thần của mẹ.

## Tại Việt Nam
Bộ Y tế đã ban hành Quyết định 2246/QĐ-BYT (1/8/2024) hướng dẫn khám sức khỏe định kỳ cho trẻ dưới 24 tháng tuổi, nhưng mốc khám sớm nhất trong văn bản này là 2-3 tháng tuổi — hiện chưa tìm thấy văn bản riêng của Bộ Y tế quy định lịch khám chuyên biệt cho giai đoạn 0-28 ngày tuổi. Trong giai đoạn này, việc theo dõi bé thường gắn với hướng dẫn xuất viện của cơ sở sinh và các mốc tiêm chủng theo Chương trình Tiêm chủng Mở rộng.`,
    category: "Khám và sàng lọc sơ sinh",
    stage: "NEWBORN_0_28_DAYS",
    minimumAgeDays: 0,
    maximumAgeDays: 28,
    evidenceLevel: "MODERATE",
    knowledgeType: scientific,
    sources: [sources.cchdCDC, sources.ehdiCDC, sources.hearingScreeningNHS, sources.postnatal, sources.newbornVisitAAP, sources.moh2246],
  },
  {
    slug: "u-hat-ron-va-dau-hieu-nhiem-trung-ron",
    title: "U hạt rốn, chảy máu rốn và dấu hiệu nhiễm trùng rốn cần phân biệt",
    summary: "Rốn thường rụng trong khoảng 1-3 tuần; u hạt rốn lành tính và thường xử lý đơn giản, nhưng đỏ lan ra da bụng kèm mủ/hôi là cấp cứu nhiễm trùng rốn thực sự.",
    content: `## Thời gian rụng rốn bình thường
Cuống rốn thường khô và rụng trong khoảng 1-3 tuần sau sinh (một số nguồn ghi nhận trung bình 10-15 ngày). Nếu đến khoảng 3 tuần mà rốn vẫn chưa rụng, nên cho bé đi khám kiểm tra.

## U hạt rốn (umbilical granuloma)
Sau khi rốn rụng, đôi khi còn lại một khối mô nhỏ màu hồng/đỏ ở rốn, có thể hơi ướt hoặc rỉ dịch trong/vàng nhạt — đây là u hạt rốn, khá thường gặp và không phải nhiễm trùng. Nhiều trường hợp tự hết sau khoảng một tuần; nếu không, bác sĩ có thể xử lý đơn giản (ví dụ chấm muối ăn tại nhà theo hướng dẫn nhân viên y tế, hoặc thuốc chấm chuyên dụng) — thường không phải tình huống cấp cứu.

## Chảy máu ít khi rốn sắp rụng
Vài giọt máu sẫm màu dính tã đúng lúc cuống rốn sắp rụng là bình thường. Chảy máu tươi, chảy nhiều hoặc thấm ướt là bất thường — cần liên hệ bác sĩ ngay.

## Nhiễm trùng rốn (omphalitis) — dấu hiệu cấp cứu thực sự
Khác với rốn ẩm nhẹ khi đang lành hay u hạt rốn rỉ dịch trong, nhiễm trùng rốn có các dấu hiệu: đỏ lan rộng ra vùng da bụng quanh rốn (không chỉ đỏ tại chân rốn), sưng nề, chảy mủ hoặc dịch có mùi hôi, kèm bé có biểu hiện không khỏe (sốt hoặc hạ thân nhiệt, bú kém, lừ đừ). Đây là một cấp cứu nhi khoa thực sự vì có thể diễn tiến nhanh sang nhiễm trùng huyết — cần đưa bé đi khám ngay, không tự theo dõi thêm ở nhà.

## Không cần bôi cồn hay sát khuẩn thường quy
Ở các nước có hệ thống y tế phát triển và sinh tại cơ sở y tế, hướng dẫn hiện nay của AAP là chăm rốn khô-sạch, không cần bôi cồn hay chất sát khuẩn thường quy — việc này từng phổ biến trước đây nhưng không còn được khuyến nghị vì không cho thấy lợi ích rõ ràng trong môi trường bệnh viện/nguồn lực tốt. Khuyến nghị bôi chlorhexidine của WHO chỉ áp dụng riêng cho trường hợp sinh tại nhà ở khu vực có tỷ lệ tử vong sơ sinh rất cao — không mâu thuẫn với AAP mà là khuyến nghị theo từng bối cảnh khác nhau. Việc đắp lá, bột hay các chất dân gian khác lên rốn vẫn nên tránh hoàn toàn.`,
    category: "Chăm sóc sơ sinh",
    stage: "NEWBORN_0_28_DAYS",
    minimumAgeDays: 0,
    maximumAgeDays: 28,
    evidenceLevel: "STRONG",
    knowledgeType: scientific,
    sources: [sources.cordCareAAP, sources.cordDelayedAAP, sources.granulomaSheffield, sources.omphalitisKingston, sources.cordAntisepticsCochrane, sources.cordCareAAPPolicy],
  },
  {
    slug: "thi-giac-va-thinh-giac-cua-tre-so-sinh",
    title: "Thị giác và thính giác của trẻ sơ sinh: bình thường và dấu hiệu cần khám",
    summary: "Trẻ sơ sinh nhìn rõ nhất ở khoảng cách 20-30cm và thích khuôn mặt, mảng tương phản; mắt lác thoáng qua hay chảy nước mắt nhẹ thường lành tính, nhưng phản xạ đỏ đồng tử bất thường luôn cần khám ngay.",
    content: `## Thị giác trong tháng đầu
Trẻ sơ sinh nhìn rõ nhất ở khoảng cách 20-30cm — gần đúng khoảng cách từ mặt bé đến mặt người bế khi cho bú. Bé có thể thấy ánh sáng, hình khối, khuôn mặt và chuyển động từ khi sinh, nhưng tầm nhìn xa còn mờ; bé thường thích nhìn các hoa văn tương phản cao (như hình tròn đồng tâm) — một phần lý do bé thích nhìn khuôn mặt người. Khả năng dõi theo vật di chuyển bằng mắt phát triển dần và thường rõ ràng hơn ở khoảng 3 tháng tuổi, chưa phải kỹ năng có ngay từ ngày đầu.

## Các hiện tượng ở mắt thường lành tính
- Mắt lác/nhìn lệch không cố định: khá bình thường ở trẻ nhỏ, thường giảm dần và hết trong khoảng 3 tháng tuổi; nếu mắt vẫn lệch cố định sau mốc này nên được khám.
- Đốm đỏ ở lòng trắng mắt do vỡ mạch máu nhỏ lúc sinh (xuất huyết dưới kết mạc): khá thường gặp, không ảnh hưởng thị lực, tự hết sau vài tuần.
- Chảy nước mắt/mắt hơi dính ghèn do tuyến lệ chưa hoàn thiện: khá phổ biến, thường tự hết trong năm đầu; có thể lau nhẹ bằng nước đun sôi để nguội, lau từ khóe trong ra ngoài, dùng bông sạch riêng cho mỗi lần lau.

## Dấu hiệu cần khám ngay về mắt
Đồng tử có màu trắng/xám thay vì đỏ khi chụp ảnh có đèn flash hoặc khi khám (phản xạ đỏ đồng tử bất thường), mắt rung giật nhanh bất thường, chảy mủ/ghèn kèm sưng đỏ, hoặc một mắt luôn lệch cố định không thay đổi — cần được khám sớm vì có thể liên quan đến đục thủy tinh thể bẩm sinh hoặc bất thường võng mạc.

## Thính giác
Phản ứng giật mình với tiếng động lớn là một trong những dấu hiệu sớm cho thấy bé nghe được. Tất cả trẻ sơ sinh nên được sàng lọc thính lực trước 1 tháng tuổi (lý tưởng trước khi xuất viện) để phát hiện sớm các vấn đề thính lực, vì phát hiện và can thiệp càng sớm càng hỗ trợ tốt cho phát triển ngôn ngữ sau này. Dấu hiệu cần lưu ý: bé không giật mình với tiếng động lớn, không quay đầu về phía có âm thanh.`,
    category: "Triệu chứng thường gặp",
    stage: "NEWBORN_0_28_DAYS",
    minimumAgeDays: 0,
    maximumAgeDays: 90,
    evidenceLevel: "STRONG",
    knowledgeType: scientific,
    sources: [sources.visionAAP, sources.visionWarningAAP, sources.redReflexMoorfields, sources.stickyEyeNHS, sources.squintFrimley, sources.hearingScreeningAAP],
  },
  {
    slug: "sua-non-sua-chuyen-tiep-va-co-che-cung-cau-sua",
    title: "Sữa non, sữa chuyển tiếp và cơ chế \"cung-cầu\" của sữa mẹ",
    summary: "Sữa non ít về lượng nhưng đủ cho bé những ngày đầu; sữa \"về\" thường trong 2-5 ngày sau sinh, và lượng sữa sau đó được điều chỉnh theo nguyên tắc bú/hút càng nhiều, sữa càng tạo nhiều.",
    content: `## Sữa non — ít nhưng đủ
Sữa non đặc, màu vàng, giàu đạm và kháng thể, ít hơn về lượng so với sữa sau này — điều này khớp với dạ dày rất nhỏ của trẻ sơ sinh. Các nguồn y tế nhấn mạnh: ngực chưa căng ngay ngày sinh không có nghĩa là không đủ sữa cho bé trong những ngày đầu; quan trọng là cho bú thường xuyên, không phải bú lâu.

## Sữa "về" (sữa chuyển tiếp)
Ngực thường căng, ấm hơn trong khoảng 2-4 ngày sau sinh (một số nguồn ghi nhận có thể tới 5 ngày, đặc biệt ở người sinh con so) — đây là dấu hiệu sữa chuyển tiếp đã "về". Nếu đến khoảng ngày 3-5 sau sinh mà chưa thấy dấu hiệu này, kết hợp với bé có dấu hiệu bú chưa đủ (sụt cân nhiều, ít tã ướt/phân), nên được nhân viên y tế đánh giá — đây gọi là "chậm sữa về" và không phải lúc nào cũng có nguyên nhân rõ ràng.

## Sữa trưởng thành
Khoảng cuối tuần thứ 2 sau sinh, sữa thường được xem là "trưởng thành" — có thể trông loãng hơn, hơi trắng xanh lúc mới tiết ra (trước khi phần chất béo được giải phóng trong cữ bú).

## Cơ chế cung-cầu
Việc bé bú hoặc mẹ hút sữa ra khỏi ngực chính là tín hiệu để cơ thể tạo thêm sữa cho lần sau; bú/hút càng thường xuyên và càng lấy hết sữa, cơ thể càng tạo nhiều. Ngược lại, bỏ cữ bú hoặc bổ sung sữa công thức không cần thiết có thể làm giảm tín hiệu này và giảm dần lượng sữa mẹ tạo ra.

## Nếu cần gọi lại sữa (relactation)
Nếu vì lý do nào đó mẹ đã giảm bú/hút một thời gian và muốn khôi phục nguồn sữa, có thể thử hút hoặc vắt tay rất thường xuyên (khoảng 8-12 lần/ngày kể cả ban đêm) kết hợp da kề da và cho bé ngậm ti nhiều nhất có thể kể cả khi không đói. Kết quả khác nhau tùy người — một số mẹ khôi phục đủ sữa, một số vẫn cần bổ sung thêm; nên có hỗ trợ từ chuyên gia tư vấn sữa mẹ trong quá trình này.`,
    category: "Bú và dinh dưỡng",
    stage: "POSTPARTUM",
    evidenceLevel: "MODERATE",
    knowledgeType: scientific,
    sources: [sources.colostrumAAP, sources.whatToExpectCDC, sources.firstDaysNHS, sources.transitionalMatureAAP, sources.clusterFeedingABM, sources.increasingSupplyLLLI, sources.relactationLLLI],
  },
  {
    slug: "sua-dau-sua-cuoi-su-that-ve-sua-loang",
    title: "\"Sữa đầu, sữa cuối\" và sự thật về quan niệm \"sữa loãng không có chất\"",
    summary: "Không có hai loại sữa tách biệt — tất cả tuyến sữa tạo ra cùng một loại sữa; độ béo tăng dần trong một cữ bú tùy lượng sữa còn lại trong ngực, không phải do màu sắc hay độ loãng quyết định.",
    content: `## Sự thật từ tổ chức hỗ trợ nuôi con bằng sữa mẹ
"Sữa đầu" và "sữa cuối" chỉ mô tả sữa có sẵn ở các thời điểm khác nhau trong một cữ bú, không phải hai loại sữa khác nhau về bản chất. Lượng chất béo trong sữa mẹ thay đổi tùy theo lượng sữa đã tích tụ trong ống dẫn và ngực đã được bú/hút cạn tới đâu — không phải một mốc thời gian hay ranh giới cố định.

## Vì sao "sữa loãng" không đồng nghĩa "ít chất"
Không thể biết bé nhận được bao nhiêu chất béo chỉ dựa vào thời gian bú: có bé bú xong một lượng sữa trong 5 phút, có bé mất 40 phút mới bú được lượng tương đương. Miễn là bé bú hiệu quả, có thể để bé tự quyết định thời gian bú mỗi bên — bé sẽ nhận đủ lượng chất béo cần thiết theo nhịp riêng của mình.

## Áp dụng cho quan niệm dân gian
Quan niệm "sữa loãng, màu trong là sữa không có chất, không đủ dinh dưỡng cho con" không được các tổ chức hỗ trợ nuôi con bằng sữa mẹ xác nhận — màu sắc và độ đặc/loãng của sữa mẹ có thể thay đổi tự nhiên trong ngày và giữa các cữ bú mà không phản ánh chất lượng dinh dưỡng.

## Về việc đổi bên khi bú
Không có một quy tắc chung thống nhất từ các tổ chức y tế lớn (WHO/CDC/AAP/NHS) về việc phải bú hết một bên rồi mới đổi bên, hay phải đổi bên giữa chừng. Hướng dẫn thực tế nhất là: cho bé bú theo nhịp của bé, đổi bên khi bé có vẻ chậm lại hoặc mất hứng thú, và để bé tự quyết định khi nào xong một bên.

## Khi nào cần lưu ý thật sự
Nếu mẹ có sữa xuống quá mạnh khiến bé sặc/khó chịu và phân bé xanh, sủi bọt kèm tăng cân kém, đây có thể là tình trạng "quá tải đường" do xuống sữa nhanh — khác với vấn đề "chất lượng sữa", và nên được tư vấn viên sữa mẹ hoặc bác sĩ đánh giá thay vì tự kết luận sữa "không tốt".`,
    category: "Mẹo dân gian & sự thật",
    stage: "POSTPARTUM",
    evidenceLevel: "STRONG",
    knowledgeType: traditional,
    sources: [sources.foremilkHindmilkLLLI, sources.positioningLLLI],
  },
  {
    slug: "tu-the-bu-va-dau-hieu-khop-ngam-tot",
    title: "Tư thế bú và dấu hiệu khớp ngậm tốt",
    summary: "Không có một tư thế bú \"đúng nhất\" cho mọi mẹ; khớp ngậm tốt có các dấu hiệu cụ thể có thể tự kiểm tra: môi trề ra, cằm chạm ngực, không đau sau vài giây đầu và nghe được tiếng nuốt.",
    content: `## Các tư thế bú phổ biến
Bế nôi, bế nôi chéo tay, bế kiểu ôm bóng bầu dục, nằm nghiêng cho bú, và tư thế ngả người tự nhiên (mẹ ngả lưng, bé nằm sấp trên người mẹ) đều là các tư thế được công nhận. NHS và LLLI đều không xem một tư thế nào là "tốt nhất" cho mọi người — tư thế phù hợp phụ thuộc cơ địa mẹ, cách sinh (ví dụ sau mổ lấy thai thường hợp bế kiểu ôm bóng hoặc nằm nghiêng hơn) và nhu cầu của bé.

## Dấu hiệu khớp ngậm tốt
- Miệng bé mở rộng, môi trề ra ngoài (không mím vào trong), cằm chạm sát bầu ngực.
- Nhìn thấy phần quầng vú phía trên môi trên nhiều hơn phía dưới môi dưới.
- Sau vài giây đầu ngậm vào, mẹ không còn thấy đau.
- Nghe được tiếng nuốt đều đặn, nhịp mút sâu và chậm dần khi bé no.

## Dấu hiệu khớp ngậm chưa tốt
Má bé hóp vào khi mút, có tiếng chép miệng/tanh tách, môi cong vào trong, bé lắc đầu liên tục, không nghe tiếng nuốt, hoặc đau kéo dài quá phút đầu tiên của cữ bú.

## Vì sao khớp ngậm quan trọng
Khi ngậm đúng, núm vú mẹ nằm sâu, tựa vào phần vòm miệng mềm phía sau miệng bé. Khi ngậm nông, núm vú cọ vào phần vòm cứng phía trước, gây đau và có thể khiến bé bú không hiệu quả dù thời gian bú vẫn dài.

Nếu đã thử chỉnh tư thế và khớp ngậm nhưng đau vẫn không giảm, nên được tư vấn viên sữa mẹ hoặc nhân viên y tế quan sát trực tiếp một cữ bú để hỗ trợ, thay vì tự điều chỉnh kéo dài.`,
    category: "Bú và dinh dưỡng",
    stage: "POSTPARTUM",
    evidenceLevel: "STRONG",
    knowledgeType: scientific,
    sources: [sources.positionsNHS, sources.positioningLLLI, sources.latchAAP],
  },
  {
    slug: "dau-va-nut-dau-ti-khi-cho-con-bu",
    title: "Đau và nứt đầu ti khi cho con bú: nguyên nhân và khi nào cần khám",
    summary: "Đau nhẹ thoáng qua vài ngày đầu khá phổ biến, nhưng đau ở mọi cữ bú hoặc đầu ti nứt/chảy máu không phải là điều phải chịu đựng — cần chỉnh khớp ngậm và có thể cần khám nếu không cải thiện.",
    content: `## Đau bình thường và đau bất thường
Cảm giác hơi nhức trong vài ngày đầu khi bắt đầu cho bú khá phổ biến. Nhưng nếu đau ở một hoặc cả hai bên đầu ti trong MỌI cữ bú, hoặc đầu ti bắt đầu nứt/chảy máu, đây là dấu hiệu cần được hỗ trợ sớm — không nên cố chịu đau để tiếp tục cho bú.

## Nguyên nhân phổ biến nhất
Phần lớn trường hợp đau/nứt đầu ti liên quan đến tư thế bú hoặc khớp ngậm chưa tối ưu (xem thêm bài "Tư thế bú và dấu hiệu khớp ngậm tốt"). Chỉnh lại khớp ngậm thường là bước đầu tiên và quan trọng nhất.

## Chăm sóc tại nhà
Thoa một ít sữa mẹ lên đầu ti sau khi cho bú, thay miếng lót thấm sữa thường xuyên (tránh loại có lớp nhựa), mặc áo ngực vừa vặn không gọng. Bằng chứng hiện tại (theo tổng quan Cochrane) không cho thấy một sản phẩm bôi cụ thể nào (mỡ lanolin, miếng dán hydrogel...) vượt trội hẳn so với các biện pháp khác — vì vậy không cần cố tìm mua một sản phẩm "thần kỳ" duy nhất.

## Khi đau có thể do nguyên nhân khác
Đau sâu trong bầu vú, đau rát kéo dài sau khi bú xong (thay vì trong lúc bú), hoặc đau cả hai bên không cải thiện dù đã chỉnh khớp ngậm có thể liên quan đến nấm miệng (thrush) hoặc co thắt mạch máu ở đầu ti (hiện tượng giống Raynaud). Đây là điểm còn tranh luận trong y văn: một số tài liệu xem nấm miệng là nguyên nhân thường gặp gây đau đầu ti, trong khi một đánh giá khác (dựa trên tổng hợp của Hiệp hội Y học Bú mẹ) cho rằng vai trò của nấm trong đau đầu ti có thể bị đánh giá quá mức so với nguyên nhân cơ học hoặc co thắt mạch máu — hai nhóm nguyên nhân này khá giống nhau về triệu chứng nên khó tự phân biệt tại nhà.

## Cần khám nếu
Đau ở mọi cữ bú không cải thiện dù đã chỉnh tư thế/khớp ngậm, đầu ti nứt chảy máu, đau kéo dài quá khoảng 2 tuần, hoặc có dấu hiệu nhiễm trùng (đỏ, sưng, sốt) — nên được chuyên gia tư vấn sữa mẹ hoặc bác sĩ quan sát trực tiếp một cữ bú để tìm đúng nguyên nhân.`,
    category: "Bú và dinh dưỡng",
    stage: "POSTPARTUM",
    evidenceLevel: "MODERATE",
    knowledgeType: scientific,
    sources: [sources.soreNipplesNHS, sources.persistentPainLLLI, sources.latchAAP],
  },
  {
    slug: "be-tu-choi-bu-va-nham-lan-num-vu",
    title: "Bé đột nhiên từ chối bú (nursing strike) và \"nhầm lẫn núm vú\"",
    summary: "Bé đang bú tốt bỗng từ chối bú đột ngột thường là \"đình công bú\" tạm thời chứ không phải cai sữa; còn việc bình sữa/núm ti giả có thực sự gây \"nhầm lẫn núm vú\" hay không vẫn là điều bằng chứng khoa học chưa thống nhất.",
    content: `## Đình công bú (nursing strike) là gì
Khi một bé đang bú đều đặn tốt bỗng dưng từ chối bú hoàn toàn, đây thường được gọi là "đình công bú" — khác với cai sữa, vốn diễn ra từ từ và bé thường vẫn vui vẻ, không khó chịu. Đình công bú thường kéo dài khoảng 2-4 ngày, đôi khi lâu hơn, và gần như luôn là tạm thời.

## Các nguyên nhân thường gặp
Bé đang ốm (đau tai, đau bụng, nấm miệng), mọc răng, sữa mẹ thay đổi mùi vị/lượng đột ngột, mẹ đổi dầu gội/nước hoa làm thay đổi mùi quen thuộc, bé giật mình vì một sự cố khi đang bú (tiếng động lớn, phản ứng của mẹ khi bị cắn), căng thẳng hoặc thay đổi lịch sinh hoạt lớn. Bé không từ chối bú vì "bướng bỉnh" — luôn có một nguyên nhân đứng sau, dù đôi khi khó xác định.

## Nên làm gì
- Không ép bé ngậm vú — việc này thường gây thêm căng thẳng chứ không giúp ích.
- Tăng da kề da, địu bé nhiều hơn, thử cho bú khi bé còn lơ mơ ngủ thay vì lúc tỉnh táo.
- Vắt/hút sữa đều đặn để giữ nguồn sữa trong lúc chờ bé bú lại, có thể cho bú bằng cốc/thìa/bình sữa mẹ đã vắt.
- Thử đổi vị trí, không gian yên tĩnh khi cho bú.

## Nhầm lẫn núm vú — bằng chứng chưa rõ ràng
"Nhầm lẫn núm vú" (ý tưởng rằng cho bú bình/ngậm núm ti giả sớm khiến bé bú mẹ kém đi) là khái niệm được nhiều người tin nhưng bằng chứng khoa học hiện tại khá mâu thuẫn/hạn chế. Đáng chú ý, năm 2018 WHO/UNICEF đã sửa lại một trong "10 bước nuôi con bằng sữa mẹ thành công": từ yêu cầu tuyệt đối "không cho bú bình/ngậm núm giả" sang "tư vấn cho mẹ về cách dùng và nguy cơ của bình sữa, núm vú giả" — một số nghiên cứu tổng hợp không tìm thấy núm ti giả ảnh hưởng rõ rệt đến việc bú mẹ nếu dùng sau khi bú mẹ đã ổn định. Nói cách khác, nên thận trọng và ưu tiên bú mẹ trực tiếp trong giai đoạn đầu, nhưng không nên hoảng sợ nếu bé đã dùng bình/núm giả — đây không phải là một quy luật nhân-quả đã được chứng minh chắc chắn.`,
    category: "Bú và dinh dưỡng",
    stage: "POSTPARTUM",
    evidenceLevel: "MODERATE",
    knowledgeType: scientific,
    sources: [sources.nursingStrikeNHS, sources.nursingStrikeLLLGB, sources.tenStepsWHO],
  },
  {
    slug: "hut-sua-chon-may-tan-suat-va-ve-sinh",
    title: "Hút sữa: chọn loại máy, tần suất hút và vệ sinh dụng cụ đúng cách",
    summary: "Máy hút tay, hút điện đơn hay đôi đều có thể hiệu quả tương đương tùy hoàn cảnh; vệ sinh đúng cách các bộ phận tiếp xúc sữa sau mỗi lần dùng quan trọng để bảo vệ bé khỏi vi khuẩn.",
    content: `## Chọn loại máy hút sữa
Theo một tổng quan Cochrane so sánh các phương pháp vắt/hút sữa, không có khác biệt rõ rệt về mức độ nhiễm khuẩn giữa vắt tay và dùng máy hút; một số biện pháp chi phí thấp (vắt tay, hút bằng máy giá rẻ, kết hợp thư giãn/nghe nhạc, chườm ấm và massage ngực trước khi hút) có thể hiệu quả tương đương hoặc hơn máy hút điện đắt tiền ở một số chỉ số. Máy hút điện đôi thường tiện lợi và nhanh hơn cho việc hút thường xuyên hoặc lâu dài (ví dụ khi mẹ và bé phải xa nhau, hoặc hút sữa toàn thời gian).

## Tần suất hút sữa tham khảo
Nguyên tắc chung: hút/vắt sữa với tần suất gần giống nhịp bú bình thường của bé. Với mẹ hút sữa hoàn toàn cho bé dưới 6 tháng, một số tổ chức hỗ trợ nuôi con bằng sữa mẹ gợi ý khoảng 8-12 lần/24 giờ, giảm dần khi bé lớn hơn. Nếu cần tăng lượng sữa, có thể thử thêm một cữ hút phụ. Các cơ quan y tế lớn (CDC) không đưa ra một con số tần suất cố định mà chỉ nhấn mạnh nguyên tắc "hút theo nhịp bú của bé".

## Vệ sinh dụng cụ hút sữa
- Rửa tay bằng xà phòng trước khi hút.
- Sau mỗi lần dùng: tháo rời mọi bộ phận tiếp xúc với sữa (phễu, van, màng, bình), rửa dưới vòi nước, sau đó rửa bằng xà phòng trong chậu rửa riêng dành cho đồ ăn của bé — không rửa trực tiếp trong bồn rửa chén dùng chung.
- Để khô hoàn toàn trên khăn sạch riêng trước khi lắp lại hoặc cất, tránh nấm mốc.
- Tiệt trùng (hấp/luộc 5 phút) mỗi ngày một lần được khuyến nghị, đặc biệt quan trọng với trẻ dưới 2 tháng, sinh non hoặc có bệnh nền.
- Dây dẫn khí thường không tiếp xúc trực tiếp với sữa nên không cần rửa thường xuyên — nhưng nếu thấy có sữa hoặc nấm mốc bên trong, nên thay mới vì rất khó làm sạch triệt để.

Vệ sinh đúng cách giúp bảo vệ bé khỏi vi khuẩn — đây là khuyến nghị chi tiết và cập nhật thường xuyên từ CDC, nên tuân thủ đầy đủ thay vì rút ngắn quy trình.`,
    category: "Bú và dinh dưỡng",
    stage: "POSTPARTUM",
    evidenceLevel: "STRONG",
    knowledgeType: scientific,
    sources: [sources.pumpingMethodsCochrane, sources.pumpingCDC, sources.workplaceCDC, sources.pumpHygieneCDC],
  },
  {
    slug: "bao-quan-ra-dong-va-ham-sua-me-dung-cach",
    title: "Bảo quản, rã đông và hâm sữa mẹ đúng cách",
    summary: "CDC khuyến nghị sữa mẹ mới vắt dùng trong 4 giờ ở nhiệt độ phòng, 4 ngày trong tủ lạnh, 6-12 tháng trong ngăn đá; NHS lại đưa ra thời hạn tủ lạnh dài hơn (tới 8 ngày) — nên biết cả hai để tham khảo.",
    content: `## Bảng thời gian bảo quản (theo CDC)
- Nhiệt độ phòng (≤25°C): tối đa 4 giờ.
- Tủ lạnh (khoảng 4°C): tối đa 4 ngày.
- Ngăn đá (≤-18°C): tốt nhất trong 6 tháng, có thể chấp nhận tới 12 tháng.
- Sữa đã rã đông (để trong tủ lạnh): dùng trong vòng 24 giờ kể từ khi rã đông hoàn toàn, không bao giờ cấp đông lại.
- Sữa đã hâm ấm hoặc bé bú dở: dùng trong vòng 2 giờ, sau đó nên bỏ.

## Một khác biệt đáng chú ý: NHS đưa ra con số khác
NHS (Anh) khuyến nghị sữa mẹ có thể để tủ lạnh (ở 4°C hoặc lạnh hơn) tới 8 ngày — dài hơn nhiều so với con số 4 ngày của CDC; NHS cũng không đưa ra thời hạn cụ thể để ở nhiệt độ phòng. Đây là một khác biệt thật sự giữa hai cơ quan y tế uy tín, không phải sai sót — nếu không chắc chắn về điều kiện bảo quản, nên chọn mốc thời gian ngắn hơn (theo CDC) để an toàn.

## Rã đông đúng cách
Rã đông qua đêm trong tủ lạnh, hoặc đặt bình sữa (đậy kín) vào nước ấm/dưới vòi nước ấm. Tuyệt đối không rã đông bằng lò vi sóng — có thể tạo điểm nóng cục bộ gây bỏng miệng bé và phá hủy một số dưỡng chất.

## Hâm sữa cho bé bú
Đặt bình sữa đậy kín vào bát/cốc nước ấm (không phải nước sôi) vài phút, hoặc dưới vòi nước ấm; thử nhiệt độ trước khi cho bú (ví dụ nhỏ vài giọt lên cổ tay). Không hâm trên bếp trực tiếp, không dùng lò vi sóng.

## Vệ sinh khi kết hợp sữa mới và sữa cũ
Nên để sữa mới vắt nguội bớt trước khi trộn vào phần sữa đã để tủ lạnh/đông lạnh từ trước, tránh làm ấm lại phần sữa cũ đã được bảo quản lạnh.

## Khi mất điện
Nếu tủ đông đầy, sữa có thể giữ an toàn khoảng 48 giờ không có điện; nếu tủ đông chỉ đầy một nửa, khoảng 24 giờ. Sữa còn tinh thể đá có thể cấp đông lại; sữa đã tan hoàn toàn nhưng vẫn còn lạnh nên dùng trong ngày hoặc bỏ đi.`,
    category: "Bú và dinh dưỡng",
    stage: "POSTPARTUM",
    evidenceLevel: "MODERATE",
    knowledgeType: scientific,
    sources: [sources.storageCDC, sources.storageFAQCDC, sources.storageNHS],
  },
  {
    slug: "ket-hop-bu-me-va-sua-cong-thuc",
    title: "Kết hợp bú mẹ và sữa công thức: những điều cần biết",
    summary: "Cho bú kết hợp là lựa chọn phổ biến và được công nhận là hợp lý, nhưng thêm sữa công thức có thể làm giảm kích thích tạo sữa mẹ nếu không được quản lý cẩn thận.",
    content: `## Kết hợp là một lựa chọn hợp lý
Nhiều gia đình chọn cho bé bú cả sữa mẹ và sữa công thức vì nhiều lý do khác nhau (đi làm lại, lo lắng về lượng sữa, sức khỏe mẹ...). Đây là lựa chọn được các hướng dẫn y tế công nhận, không phải là "thất bại" trong việc nuôi con bằng sữa mẹ.

## Vì sao cần quản lý cẩn thận
Mỗi lần thay một cữ bú mẹ bằng sữa công thức, ngực nhận được ít kích thích hơn — theo cơ chế cung-cầu, điều này có thể khiến lượng sữa mẹ giảm dần theo thời gian nếu không bù lại. Vì vậy, nếu mẹ vẫn muốn duy trì sữa mẹ song song, nên: tiếp tục cho bú/hút sữa với tần suất gần như trước, cho bé bú mẹ trước khi bổ sung sữa công thức trong cùng một cữ (thay vì bù sữa công thức trước), và hút sữa ở cữ nào bị thay bằng sữa công thức nếu muốn giữ sữa.

## Không có công thức bắt buộc
Không có một tỷ lệ hay lịch trình kết hợp "chuẩn" áp dụng cho mọi gia đình — tỷ lệ và cách kết hợp phụ thuộc vào hoàn cảnh, lượng sữa mẹ thực tế và nhu cầu của bé. Nếu mẹ lo lắng về việc bổ sung sữa công thức ảnh hưởng đến sữa mẹ, nên trao đổi với nhân viên y tế hoặc chuyên gia tư vấn sữa mẹ để có kế hoạch phù hợp thay vì tự đoán.

Lưu ý: xem thêm bài "Đánh thức bé bú và khi nào thực sự cần bổ sung sữa công thức" (giai đoạn sơ sinh) và "Pha sữa công thức và cho bú bình đúng cách" để biết cách pha/bảo quản sữa công thức an toàn.`,
    category: "Bú và dinh dưỡng",
    stage: "POSTPARTUM",
    evidenceLevel: "MODERATE",
    knowledgeType: scientific,
    sources: [sources.workplaceCDC, sources.clusterFeedingABM],
  },
  {
    slug: "thuoc-tranh-thai-va-bu-me-nguyen-tac-chung",
    title: "Thuốc, tránh thai và việc cho con bú: nguyên tắc chung",
    summary: "Phần lớn thuốc tương thích với việc cho con bú, nhưng quyết định dùng thuốc cụ thể nên luôn được bác sĩ/dược sĩ xác nhận qua cơ sở dữ liệu chuyên môn (LactMed), không tự suy đoán từ danh sách chung chung.",
    content: `## Nguyên tắc chung
Phần lớn các loại thuốc đều tương thích với việc cho con bú ở một mức độ nào đó — quan điểm mặc định của các hướng dẫn y khoa là "coi thuốc là tương thích trừ khi có bằng chứng ngược lại", không phải ngược lại. Các yếu tố bác sĩ/dược sĩ cân nhắc gồm: mẹ có thực sự cần thuốc này không, thuốc có ảnh hưởng đến lượng sữa không, lượng thuốc thải vào sữa, khả năng hấp thu qua đường uống của bé, tuổi của bé, và tỷ lệ bé bú sữa mẹ trong chế độ ăn.

## Nên tra cứu ở đâu
Cơ sở dữ liệu LactMed của Viện Y tế Quốc gia Hoa Kỳ (NIH) được khuyến nghị là nguồn tra cứu cập nhật nhất cho từng loại thuốc cụ thể. Đây không phải danh sách "an toàn/không an toàn" đơn giản — quyết định cuối cùng nên có bác sĩ hoặc dược sĩ xác nhận dựa trên tình trạng cụ thể của mẹ và bé.

## Vài ví dụ hay được hỏi (chỉ mang tính tham khảo, không thay thế tư vấn y tế)
Theo LactMed: paracetamol (acetaminophen) và ibuprofen thường được xem là lựa chọn phù hợp cho giảm đau/hạ sốt khi cho con bú do lượng vào sữa mẹ thấp. Với thuốc kháng histamine, loratadin và cetirizin thường được ưu tiên hơn các loại gây buồn ngủ mạnh. Đây chỉ là ví dụ tham khảo — không tự dùng bất kỳ thuốc nào mà không hỏi ý kiến bác sĩ/dược sĩ, kể cả các thuốc kể trên.

## Tránh thai khi đang cho con bú
Các phương pháp tránh thai chỉ chứa progestin (viên uống, que cấy, tiêm) thường được xem là phù hợp với mẹ cho con bú ngay từ sau sinh. Với thuốc tránh thai kết hợp có estrogen, cần thận trọng hơn trong khoảng vài tuần đầu sau sinh — chủ yếu do nguy cơ huyết khối ở giai đoạn hậu sản chứ không chỉ vì đang cho con bú, tuy các hướng dẫn quốc tế (WHO) và của Mỹ (CDC) đưa ra mốc thời gian cụ thể hơi khác nhau. Vì vậy, mốc thời gian chính xác nên được bác sĩ sản khoa tư vấn theo từng trường hợp thay vì áp dụng một con số cố định.`,
    category: "Bú và dinh dưỡng",
    stage: "POSTPARTUM",
    evidenceLevel: "MODERATE",
    knowledgeType: scientific,
    sources: [sources.medSafetyAAP, sources.medSafetyCDC, sources.lactmedFactSheet, sources.contraceptionCDCMEC],
  },
  {
    slug: "ruou-caffeine-va-ngu-gat-khi-cho-con-bu",
    title: "Rượu, caffeine và việc ngủ gật khi cho con bú",
    summary: "Vắt bỏ sữa sau khi uống rượu không giúp cồn đào thải nhanh hơn; caffeine dưới khoảng 300mg/ngày thường không đáng lo; nếu mẹ dễ ngủ gật khi cho bú, có những cách giảm rủi ro cho bé.",
    content: `## Rượu
CDC ghi nhận: uống ở mức vừa phải (tối đa 1 đơn vị cồn/ngày) không được biết là gây hại cho bé bú mẹ. Cồn vào sữa và ra khỏi sữa theo cùng nhịp với việc cồn rời khỏi máu mẹ — khoảng 2-3 giờ cho mỗi đơn vị cồn đã uống, không nhanh hơn hay chậm hơn.

Một điểm quan trọng: **"vắt bỏ sữa" sau khi uống rượu KHÔNG giúp đào thải cồn khỏi sữa nhanh hơn** — đây là hiểu lầm phổ biến. CDC nêu rõ việc vắt/hút rồi đổ bỏ sữa không làm giảm nồng độ cồn trong sữa nhanh hơn so với việc chỉ đợi. Vắt bỏ chỉ hữu ích nếu mẹ cần giảm căng tức ngực hoặc duy trì lượng sữa vì đã bỏ lỡ một cữ bú, không phải để "làm sạch" sữa.

## Caffeine
CDC đưa ra ngưỡng cụ thể: khoảng 300mg/ngày trở xuống (tương đương 2-3 tách cà phê) được xem là mức thấp-vừa phải và ít gây vấn đề. Các biểu hiện như bé cáu gắt, khó ngủ, bồn chồn được ghi nhận ở mức mẹ dùng caffeine rất cao (khoảng 10 tách cà phê/ngày trở lên).

## Ngủ gật khi cho con bú
Đây là tình huống được các hướng dẫn an toàn giấc ngủ thừa nhận là có thể xảy ra thật, đặc biệt khi cho bú nằm ban đêm — không phải lỗi của mẹ. Nếu cho bú trên giường và có khả năng ngủ quên, nên dọn gối, chăn rời và ga trải giường lỏng lẻo ra khỏi khu vực gần bé, kê giường cách xa tường để giảm nguy cơ bé bị kẹt. Tuyệt đối không bao giờ cho bú hoặc ngủ cùng bé trên sofa/ghế bành — đây là bề mặt nguy hiểm nhất, với nguy cơ được ghi nhận cao hơn rất nhiều lần so với các bề mặt khác, dù là ngủ quên hay chủ động.`,
    category: "Bú và dinh dưỡng",
    stage: "POSTPARTUM",
    evidenceLevel: "STRONG",
    knowledgeType: scientific,
    sources: [sources.alcoholCDCBreastfeeding, sources.maternalDietCDC, sources.safeSleepPolicyAAP, sources.safeSleepSevenLLLGB],
  },
  {
    slug: "bu-me-nen-keo-dai-bao-lau-va-cach-cai-sua",
    title: "Bú mẹ nên kéo dài bao lâu và cách cai sữa nhẹ nhàng",
    summary: "WHO và AAP đều khuyến nghị bú mẹ hoàn toàn 6 tháng đầu và tiếp tục ít nhất đến 2 tuổi nếu mẹ-bé mong muốn; cai sữa từ từ giúp tránh cương sữa/viêm vú và dễ chịu hơn cho cả hai.",
    content: `## Khuyến nghị về thời gian
WHO và UNICEF khuyến nghị: bú mẹ hoàn toàn trong 6 tháng đầu, sau đó tiếp tục bú mẹ cùng ăn dặm hợp lý đến 2 tuổi hoặc lâu hơn. AAP (Mỹ) hiện đưa ra khuyến nghị tương tự sau khi cập nhật năm 2022 — trước đây AAP chỉ khuyến nghị tối thiểu 1 năm, nay đã nâng lên "2 năm hoặc lâu hơn, miễn là cả mẹ và bé đều mong muốn". Tại Việt Nam, theo số liệu UNICEF, tỷ lệ bé được bú mẹ hoàn toàn tới 6 tháng và bú tới 2 tuổi còn thấp hơn nhiều so với khuyến nghị này.

## Cai sữa từ từ thay vì đột ngột
Các nguồn đồng thuận: nên cai sữa từ từ, giảm dần từng cữ một qua nhiều tuần đến vài tháng, thay vì dừng đột ngột. Cai đột ngột dễ gây cương sữa, tắc tia sữa hoặc viêm vú cho mẹ, và có thể gây hụt hẫng về mặt tinh thần cho bé lớn hơn (vốn xem bú mẹ là một hình thức gắn kết, không chỉ là ăn).

## Cách thực hiện
- Bỏ một cữ bú mỗi vài ngày đến một tuần một lần, thường bắt đầu từ cữ giữa ngày (ít gắn với giấc ngủ) trước khi bỏ các cữ sáng/tối.
- Có thể áp dụng cách "không chủ động mời bú, nhưng cũng không từ chối khi bé đòi" để quá trình diễn ra nhẹ nhàng hơn.
- Thay thế bằng các hình thức gắn kết khác (ôm, đọc sách, chơi cùng) để bù đắp phần tinh thần của việc bú mẹ, đặc biệt với bé đã lớn.

## Ai là người quyết định cai sữa
Việc cai sữa có thể do mẹ chủ động hoặc do bé tự giảm nhu cầu bú theo thời gian — không có một "cách đúng duy nhất", miễn là quá trình diễn ra từ từ và phù hợp với cả hai.

## Một số tình huống đặc biệt còn ít bằng chứng
Việc tiếp tục cho bú trong khi đang mang thai (và nuôi con bú song song hai bé) hiện chưa có nhiều nghiên cứu lớn; bằng chứng hiện có (một nghiên cứu quan sát trên thai kỳ nguy cơ thấp) cho thấy có thể an toàn trong thai kỳ bình thường, nhưng nên hỏi ý kiến bác sĩ sản khoa nếu có thai kỳ nguy cơ cao, từng sảy thai hoặc mang song/đa thai.`,
    category: "Bú và dinh dưỡng",
    stage: "POSTPARTUM",
    evidenceLevel: "STRONG",
    knowledgeType: scientific,
    sources: [sources.weaningNHS, sources.weaningAAP, sources.weaningLLLI, sources.feeding, sources.breastfeedingVi],
  },
  {
    slug: "khi-nao-bu-me-can-than-trong-dac-biet",
    title: "Khi nào việc cho con bú cần thận trọng đặc biệt hoặc cần hỏi ý kiến bác sĩ ngay",
    summary: "Một số ít tình huống y khoa cần cân nhắc kỹ hoặc tạm dừng bú mẹ trực tiếp; đây là chủ đề nhạy cảm cần bác sĩ đánh giá theo từng trường hợp, không nên tự áp dụng một quy tắc chung.",
    content: `## Nguyên tắc quan trọng nhất
Đây là nhóm tình huống ít gặp nhưng cần được bác sĩ đánh giá cụ thể theo từng trường hợp — nội dung dưới đây chỉ mang tính tham khảo tổng quát, không thay thế tư vấn y tế cá nhân hóa.

## Các tình huống CDC liệt kê là chống chỉ định (tại Mỹ)
- Bé được chẩn đoán rối loạn chuyển hóa bẩm sinh galactosemia thể cổ điển (rất hiếm gặp).
- Mẹ nhiễm HTLV loại 1 hoặc 2.
- Mẹ đang sử dụng ma túy bất hợp pháp (như opioid, cocaine).
- Nghi ngờ hoặc xác định nhiễm virus Ebola.
- Mẹ nhiễm HIV: tại Mỹ, CDC khuyến cáo không cho bú mẹ trực tiếp nếu mẹ chưa điều trị ARV hoặc đã điều trị nhưng chưa đạt được tải lượng virus dưới ngưỡng phát hiện ổn định — khuyến cáo này áp dụng trong bối cảnh có sẵn sữa công thức an toàn, giá cả phải chăng.

## Một điểm quan trọng: HIV và bú mẹ ở các bối cảnh khác nhau
Đây là ví dụ rõ nhất cho việc khuyến cáo có thể khác nhau tùy bối cảnh nguồn lực y tế: WHO đưa ra khuyến nghị khác cho các quốc gia có tỷ lệ tử vong trẻ em do tiêu chảy/viêm phổi/suy dinh dưỡng còn cao — ở những nơi này, WHO khuyến khích mẹ nhiễm HIV vẫn bú mẹ hoàn toàn 6 tháng kèm điều trị ARV suốt đời, vì nguy cơ tử vong do không bú mẹ (thiếu dinh dưỡng, nhiễm trùng) có thể cao hơn nguy cơ lây truyền HIV khi mẹ đã điều trị ARV hiệu quả. Đây không phải là WHO và CDC "mâu thuẫn" mà là hai khuyến nghị được cân nhắc theo bối cảnh nguồn lực khác nhau — quyết định cụ thể luôn cần bác sĩ chuyên khoa tư vấn.

## Tình huống tạm thời (có thể bú lại sau khi hết)
- Lao đang hoạt động chưa điều trị: cần tạm ngừng cho bú trực tiếp (vẫn có thể cho bé bú sữa vắt ra), có thể bú lại sau khi mẹ được điều trị phù hợp khoảng 2 tuần; lao đã điều trị bằng thuốc hàng đầu thường không cần ngừng bú.
- Có tổn thương herpes đang hoạt động ngay trên vùng vú/đầu ti (tránh cho bú ở bên đó, vẫn có thể bú bên còn lại).
- Một số xét nghiệm hình ảnh dùng chất phóng xạ.

## Không tự suy đoán thêm
Với các tình huống như hóa trị/xạ trị, bằng chứng cụ thể chưa được xác minh đầy đủ trong quá trình tổng hợp bài này — nếu mẹ đang trong quá trình điều trị các bệnh lý nghiêm trọng, cần hỏi trực tiếp bác sĩ điều trị về việc có nên tiếp tục cho bú hay không, thay vì tự tra cứu và áp dụng.`,
    category: "Bú và dinh dưỡng",
    stage: "POSTPARTUM",
    evidenceLevel: "MODERATE",
    knowledgeType: scientific,
    sources: [sources.medSafetyCDC, sources.contraindicationsCDC],
  },
  {
    slug: "tam-ca-nguyet-1-thay-doi-va-phat-trien-thai",
    title: "Tam cá nguyệt thứ nhất (0–12 tuần): thay đổi của mẹ, phát triển của thai và các mốc sàng lọc",
    summary: "Mệt mỏi, buồn nôn và đi tiểu nhiều là triệu chứng rất phổ biến do nội tiết tố; thai nhi được gọi là \"fetus\" từ khoảng tuần 10-11, và các xét nghiệm sàng lọc quan trọng đầu tiên thường thực hiện ở tuần 10-14.",
    content: `## Thay đổi của mẹ
Mệt mỏi, buồn nôn/nôn nghén, căng tức ngực và đi tiểu nhiều là các triệu chứng rất phổ biến trong tam cá nguyệt đầu, chủ yếu do nội tiết tố tăng nhanh. Nghén thường bắt đầu trước tuần 9, đạt đỉnh khoảng tuần 9, và phần lớn giảm dần trước tuần 14-20 (các nguồn đưa mốc kết thúc hơi khác nhau — xem thêm bài "Nghén và nôn nghén nặng").

## Phát triển của thai
Trong 8 tuần đầu tính từ khi thụ tinh, phôi được gọi là "embryo"; từ tuần thứ 9 tính từ thụ tinh trở đi gọi là "fetus" (thai nhi) — mốc này tương ứng khoảng tuần 10-11 nếu tính theo tuổi thai thông thường (tính từ kỳ kinh cuối). Hoạt động tim có thể thấy qua siêu âm đầu dò âm đạo sớm nhất khoảng tuần 5.5-6; nghe được nhịp tim rõ bằng máy Doppler cầm tay thường trong khoảng tuần 10-12.

## Các mốc sàng lọc quan trọng
- Siêu âm xác định tuổi thai ("siêu âm 12 tuần"): thường thực hiện khoảng tuần 10-14.
- Đo độ mờ da gáy kết hợp xét nghiệm máu sàng lọc dị tật: cần thực hiện trong đúng khoảng tuần 10-14; nếu làm muộn hơn 14 tuần, phương pháp sàng lọc kết hợp này không còn áp dụng được và cần chuyển sang xét nghiệm khác ở tuần 14-20 với độ chính xác khác.
- Xét nghiệm máu lần khám đầu: nhóm máu, yếu tố Rh, công thức máu, một số bệnh truyền nhiễm (viêm gan B, HIV, giang mai...), miễn dịch rubella, và các xét nghiệm khác tùy yếu tố nguy cơ.

Lưu ý: Ra máu nhẹ khá phổ biến trong giai đoạn này (xem bài "Ra máu và biến chứng nhau thai khi mang thai" để phân biệt bình thường và cần khám ngay).`,
    category: "Chăm sóc thai kỳ",
    stage: "PREGNANCY",
    evidenceLevel: "MODERATE",
    knowledgeType: scientific,
    sources: [sources.nvpTimingAAFP, sources.fetusGrowthACOG, sources.datingScanNHS],
  },
  {
    slug: "tam-ca-nguyet-2-thay-doi-va-phat-trien-thai",
    title: "Tam cá nguyệt thứ hai (13–27 tuần): thay đổi của mẹ, phát triển của thai và các mốc sàng lọc",
    summary: "Đây thường là giai đoạn dễ chịu nhất với nhiều mẹ; bé thường được cảm nhận cử động đầu tiên (thai máy) trong khoảng tuần 16-24, và siêu âm hình thái/sàng lọc tiểu đường thai kỳ có mốc thời gian khá rõ ràng.",
    content: `## Thay đổi của mẹ
Đau dây chằng tròn (cơn đau nhói vùng bẹn/bụng dưới khi thay đổi tư thế đột ngột) khá phổ biến, thường xuất hiện từ đầu tam cá nguyệt hai và không nguy hiểm — nhưng nếu đau không giảm khi nghỉ ngơi hoặc kèm ra máu/cơn gò, cần được khám. Da có thể xuất hiện đường sậm màu giữa bụng (linea nigra) hoặc mảng sạm da (nám - melasma), thường rõ hơn từ khoảng tuần 20-24, đậm hơn ở da sẫm màu, và mờ dần sau sinh; nên dùng kem chống nắng phổ rộng để hạn chế nám nặng thêm.

## Phát triển của thai và thai máy
Phần lớn mẹ bắt đầu cảm nhận cử động thai (thai máy) trong khoảng tuần 16-24; các nguồn đưa mốc trên hơi khác nhau (một số nguồn ghi khoảng 16-20 tuần, NHS ghi rộng hơn 16-24 tuần) — mẹ mang thai lần đầu thường cảm nhận muộn hơn (thường sau tuần 20) so với mẹ đã từng sinh. Khả năng sống ngoài tử cung với chăm sóc đặc biệt hiện được xem là khoảng tuần 23-24 ở các cơ sở y tế hiện đại, nguồn lực tốt.

## Các mốc sàng lọc quan trọng
- Siêu âm hình thái học (khảo sát dị tật): thường thực hiện khoảng tuần 18-22 (một số hướng dẫn ghi cụ thể hơn là 18-21 tuần).
- Sàng lọc tiểu đường thai kỳ: thường thực hiện ở tuần 24-28 (xem thêm bài "Tiểu đường thai kỳ: sàng lọc và quản lý").

Đi khám sớm nếu: cảm thấy thai máy giảm rõ rệt sau khi đã quen với kiểu cử động thường ngày của bé (xem bài "Thai máy giảm: khi nào cần đi khám ngay").`,
    category: "Chăm sóc thai kỳ",
    stage: "PREGNANCY",
    evidenceLevel: "MODERATE",
    knowledgeType: scientific,
    sources: [sources.quickeningNHS, sources.fetusGrowthACOG],
  },
  {
    slug: "tam-ca-nguyet-3-thay-doi-va-lich-kham-tang-dan",
    title: "Tam cá nguyệt thứ ba (28–40+ tuần): thay đổi của mẹ, lịch khám tăng dần và thai kỳ quá ngày",
    summary: "Cơn gò Braxton Hicks, khó thở nhẹ, khó ngủ và phù chân là các thay đổi thường gặp; lịch khám thường dày hơn từ tuần 28, và thai kỳ kéo dài quá 41-42 tuần cần theo dõi sát hơn.",
    content: `## Thay đổi của mẹ
Cơn gò Braxton Hicks (cơn gò "tập luyện" không đau, không đều, không tăng dần) được cho là có thể bắt đầu từ khoảng tuần 6 nhưng thường chỉ cảm nhận rõ ở tam cá nguyệt hai-ba, phổ biến nhất ở tam cá nguyệt ba (xem bài "Dấu hiệu chuyển dạ thật và chuyển dạ giả" để phân biệt với chuyển dạ thật). Khó thở nhẹ khá phổ biến do tử cung đẩy cơ hoành lên cao, thường rõ nhất tam cá nguyệt ba; cần khám nếu khó thở xuất hiện đột ngột, khi đang nằm, hoặc kèm đau ngực/chóng mặt. Phù nhẹ chân/mắt cá/tay là bình thường, thường nặng hơn về cuối ngày và cuối thai kỳ (xem bài "Đau lưng và phù chân khi mang thai" để phân biệt phù bình thường và phù cần cảnh giác).

## Lịch khám tăng dần
Lịch khám truyền thống thường tăng dần: mỗi 4 tuần đến khoảng tuần 28, mỗi 2 tuần đến khoảng tuần 36, rồi mỗi tuần từ tuần 36 đến khi sinh. Tuy nhiên năm 2025, ACOG (Mỹ) đã cập nhật hướng dẫn cho phép cá thể hóa, giảm số lần khám trực tiếp với thai kỳ nguy cơ thấp/trung bình — đây là một thay đổi đáng chú ý so với lịch cố định trước đây (xem thêm bài so sánh lịch khám các nước).

## Sàng lọc liên cầu khuẩn nhóm B (GBS)
Khuyến nghị lấy mẫu xét nghiệm âm đạo-trực tràng cho mọi thai phụ trong khoảng tuần 36-37 (cụ thể 36 tuần 0 ngày đến 37 tuần 6 ngày). Nếu dương tính, mẹ sẽ được truyền kháng sinh qua đường tĩnh mạch trong lúc chuyển dạ để giảm nguy cơ nhiễm trùng cho bé, không phải điều trị trước đó.

## Thai kỳ quá ngày
"Quá ngày muộn" (late-term) là tuần 41-41 tuần 6 ngày; "quá ngày" (post-term) là sau 42 tuần. Nếu chọn theo dõi tiếp thay vì khởi phát chuyển dạ sớm, thường bắt đầu theo dõi tim thai/nước ối 2 lần/tuần từ tuần 41. Có thể cân nhắc khởi phát chuyển dạ từ tuần 41, và thường được khuyến nghị trước hoặc trong khoảng tuần 42-42 tuần 6 ngày do nguy cơ biến chứng tăng dần sau mốc này.`,
    category: "Chăm sóc thai kỳ",
    stage: "PREGNANCY",
    evidenceLevel: "MODERATE",
    knowledgeType: scientific,
    sources: [sources.braxtonHicksStatPearls, sources.edemaNHS, sources.gbsACOG797, sources.postTermAAFP, sources.visitScheduleACOG2025],
  },
  {
    slug: "lich-kham-thai-who-va-cac-nuoc-khac-nhau-the-nao",
    title: "Lịch khám thai: vì sao WHO, Anh và Mỹ đưa ra số lần khám khác nhau",
    summary: "WHO khuyến nghị tối thiểu 8 lần khám thai để giảm tử vong chu sinh (áp dụng toàn cầu, kể cả nơi thiếu nguồn lực); NHS/NICE khuyến nghị 10 lần cho con so, 7 lần cho con rạ; đây là khác biệt về bối cảnh, không phải một bên đúng một bên sai.",
    content: `## Khuyến nghị của WHO — ngưỡng tối thiểu toàn cầu
WHO khuyến nghị mô hình chăm sóc thai kỳ có tối thiểu 8 lần tiếp xúc với nhân viên y tế để giảm tử vong chu sinh, thay cho mô hình cũ chỉ 4 lần. Đây được thiết kế như một NGƯỠNG TỐI THIỂU cho mọi bối cảnh, kể cả nơi nguồn lực y tế còn hạn chế — không phải mức khám thai lý tưởng cho các hệ thống y tế có điều kiện tốt hơn.

## NHS/NICE (Anh)
Khuyến nghị khoảng 10 lần khám cho thai kỳ đầu tiên (con so) và khoảng 7 lần cho các thai kỳ sau (con rạ), với lần khám đầu (đăng ký thai) nên thực hiện trước tuần 10.

## ACOG (Mỹ) — mô hình truyền thống và xu hướng mới
Mô hình truyền thống lâu đời của Mỹ (khám mỗi 4 tuần tới khoảng tuần 28, mỗi 2 tuần tới khoảng tuần 36, mỗi tuần sau đó) tạo ra khoảng 12-15 lần khám — nhiều hơn cả NHS. Tuy nhiên năm 2025, ACOG đã ban hành hướng dẫn mới cho phép cá thể hóa: giảm số lần khám trực tiếp cho thai kỳ nguy cơ thấp/trung bình, kết hợp thêm các hình thức theo dõi khác (như khám từ xa) thay vì áp một lịch cố định cho mọi người.

## Vì sao khác nhau
Đây không phải là ba khuyến cáo mâu thuẫn cần chọn "đúng nhất", mà phản ánh sự khác biệt về bối cảnh nguồn lực y tế và mục tiêu chính sách: ngưỡng của WHO nhằm đảm bảo mức tối thiểu an toàn ở quy mô toàn cầu, trong khi các nước có hệ thống y tế phát triển hơn có thể khám dày hơn — và hiện đang có xu hướng cá thể hóa nhiều hơn dựa trên mức độ nguy cơ của từng thai phụ thay vì áp cùng một lịch cho tất cả.

Tại Việt Nam, lịch khám cụ thể nên theo hướng dẫn của cơ sở y tế đang theo dõi thai kỳ, dựa trên tuổi thai và mức độ nguy cơ của từng mẹ.`,
    category: "Khám thai",
    stage: "PREGNANCY",
    evidenceLevel: "STRONG",
    knowledgeType: scientific,
    sources: [sources.antenatal, sources.antenatalAppointmentsNHS, sources.niceNG201, sources.visitScheduleACOG2025],
  },
  {
    slug: "nghen-va-non-nghen-nang-hyperemesis-gravidarum",
    title: "Nghén và nôn nghén nặng (hyperemesis gravidarum)",
    summary: "Nghén thường bắt đầu trước tuần 9, đạt đỉnh khoảng tuần 9-16, và giảm dần trước tuần 16-20 — không chỉ xảy ra vào buổi sáng; nôn nghén nặng đến mức mất nước/sụt cân là một chẩn đoán khác, cần điều trị y tế.",
    content: `## Nghén thông thường
Buồn nôn/nôn khi mang thai xảy ra ở phần lớn thai phụ, có thể vào bất kỳ thời điểm nào trong ngày chứ không riêng buổi sáng. Thường bắt đầu trước tuần 9-10, đạt đỉnh khoảng tuần 9-16, và giảm dần, phần lớn hết trước tuần 16-20 (các nguồn đưa mốc kết thúc hơi khác nhau).

## Cách giảm nghén có bằng chứng ở các mức khác nhau
- Vitamin B6 (pyridoxine), dùng riêng hoặc kết hợp với doxylamine, được xem là lựa chọn thuốc đầu tay an toàn và hiệu quả khi cần dùng thuốc.
- Gừng có thể có ích nhưng bằng chứng còn hạn chế và chưa nhất quán giữa các nghiên cứu.
- Ăn từng bữa nhỏ, tránh mùi kích thích, nghỉ ngơi là lời khuyên phổ biến từ các hướng dẫn lâm sàng, nhưng một tổng quan Cochrane không tìm thấy nghiên cứu thử nghiệm nào về chế độ ăn/lối sống cho nghén — nghĩa là lời khuyên này dựa trên kinh nghiệm lâm sàng, chưa được thử nghiệm đối chứng.

## Nôn nghén nặng (hyperemesis gravidarum - HG)
HG là tình trạng nôn/buồn nôn nặng đến mức ảnh hưởng khả năng ăn uống bình thường, khởi phát trước tuần 16, và có thể gây mất nước, sụt cân đáng kể (thường tính khoảng từ 5% cân nặng trước mang thai trở lên), rối loạn điện giải. Ảnh hưởng khoảng 0.3-3.6% thai kỳ. Cần điều trị y tế: thuốc chống nôn, có thể cần truyền dịch hoặc nhập viện nếu không kiểm soát được bằng thuốc uống.

Lưu ý về một thay đổi trong hướng dẫn: hướng dẫn mới nhất của Anh (RCOG, 2024) khuyến cáo KHÔNG còn dùng xét nghiệm ceton niệu để đánh giá mức độ nặng của HG (khác với một số tài liệu cũ hơn vẫn liệt kê ceton niệu như một dấu hiệu đi kèm) — đây là một cập nhật gần đây, không phải sai sót giữa các nguồn.

## Cần khám/nhập viện nếu
Không giữ được thức ăn/nước uống trong 24 giờ, nước tiểu rất sẫm màu hoặc không đi tiểu trong thời gian dài, chóng mặt/hoa mắt khi đứng dậy, đau bụng, sốt, nôn ra máu, hoặc sụt cân rõ rệt.`,
    category: "Chăm sóc thai kỳ",
    stage: "PREGNANCY",
    evidenceLevel: "MODERATE",
    knowledgeType: scientific,
    sources: [sources.nvpTimingAAFP, sources.acogPB189, sources.cochraneNVP, sources.rcogHG69, sources.hgNHS],
  },
  {
    slug: "dau-lung-va-phu-chan-khi-mang-thai",
    title: "Đau lưng và phù chân khi mang thai",
    summary: "Cả hai đều rất phổ biến do thay đổi nội tiết và cơ học của thai kỳ; vận động phù hợp (bao gồm bài tập dưới nước) có bằng chứng tốt nhất cho đau lưng, còn phù đột ngột kèm đau đầu/mờ mắt cần được khám ngay vì có thể là dấu hiệu tiền sản giật.",
    content: `## Vì sao đau lưng phổ biến
Nội tiết tố (đặc biệt relaxin) làm dây chằng vùng lưng-chậu lỏng hơn để chuẩn bị cho chuyển dạ; đồng thời tử cung phát triển làm thay đổi trọng tâm cơ thể và làm căng cơ bụng, gây thêm áp lực lên lưng.

## Cách giảm đau lưng có bằng chứng
Theo một tổng quan Cochrane, tập luyện phù hợp theo từng giai đoạn thai kỳ, vật lý trị liệu và châm cứu có bằng chứng chất lượng trung bình cho thấy giảm đau vùng lưng/chậu (dù mức giảm không lớn); bài tập dưới nước (thể dục trong nước) cho thấy giảm đau và giảm nghỉ ốm liên quan đau lưng. Đai hỗ trợ vùng bụng có bằng chứng còn chưa rõ ràng/mâu thuẫn. Các lời khuyên phổ biến khác (tư thế đúng, giày phẳng, chườm ấm, paracetamol) là khuyến nghị lâm sàng chuẩn nhưng chưa được thử nghiệm đối chứng riêng cho đau lưng thai kỳ.

## Đau lưng cần khám
Đau lưng kèm sốt, ra máu âm đạo, đau khi tiểu (dấu hiệu nhiễm trùng), đau một hoặc hai bên sườn (có thể liên quan thận), hoặc đau lưng ở tam cá nguyệt hai-ba có thể là dấu hiệu chuyển dạ sớm. Đi cấp cứu ngay nếu mất cảm giác ở chân, mông hoặc vùng kín.

## Vì sao phù chân phổ biến
Cơ thể giữ nước nhiều hơn khi mang thai, cộng với tử cung lớn dần gây áp lực lên tĩnh mạch chân, làm máu khó lưu thông về tim hơn — phù thường nặng hơn về cuối ngày và cuối thai kỳ.

## Cách giảm phù và bằng chứng
Một tổng quan Cochrane về can thiệp cho phù/giãn tĩnh mạch chân khi mang thai chỉ tìm thấy 4 thử nghiệm cho 3 biện pháp — bằng chứng khá hạn chế. Vớ áp lực (compression stockings) có thể giảm triệu chứng khó chịu ở chân (dù không giảm giãn tĩnh mạch). Không tìm thấy bằng chứng thử nghiệm cụ thể cho lời khuyên phổ biến "giảm muối để giảm phù" trong thai kỳ.

## Phù cần khám ngay — dấu hiệu tiền sản giật
Sưng đột ngột hoặc tăng nhanh ở mặt, tay hoặc chân, đặc biệt kèm đau đầu dữ dội không giảm khi dùng thuốc giảm đau thông thường, nhìn mờ/thấy đốm sáng, đau vùng bụng trên (dưới sườn), hoặc cảm thấy rất khó chịu toàn thân — đây có thể là dấu hiệu tiền sản giật và cần liên hệ y tế ngay (xem thêm bài "Tăng huyết áp thai kỳ và tiền sản giật").`,
    category: "Chăm sóc thai kỳ",
    stage: "PREGNANCY",
    evidenceLevel: "MODERATE",
    knowledgeType: scientific,
    sources: [sources.backPainNHS, sources.cochraneBackPain, sources.edemaNHS, sources.cochraneEdema, sources.nhsPreeclampsia],
  },
  {
    slug: "tang-huyet-ap-thai-ky-va-tien-san-giat",
    title: "Tăng huyết áp thai kỳ và tiền sản giật",
    summary: "Huyết áp từ 140/90 mmHg trở lên sau tuần 20 (đo hai lần cách nhau ít nhất 4 giờ) là ngưỡng bắt đầu cần đánh giá; tiền sản giật có thêm protein niệu hoặc dấu hiệu tổn thương cơ quan, và có thể tiến triển thành sản giật (co giật) nếu không được theo dõi.",
    content: `## Phân biệt các loại tăng huyết áp thai kỳ
- Tăng huyết áp mạn tính: huyết áp cao được phát hiện trước tuần 20 (hoặc đã có từ trước khi mang thai).
- Tăng huyết áp thai kỳ: huyết áp cao mới xuất hiện sau tuần 20, không kèm protein niệu hay tổn thương cơ quan khác. Khoảng một phần tư trường hợp có thể tiến triển thành tiền sản giật.
- Tiền sản giật: huyết áp từ 140/90 mmHg trở lên (đo hai lần, cách nhau ít nhất 4 giờ) sau tuần 20, KÈM protein niệu đáng kể HOẶC dấu hiệu tổn thương cơ quan khác (giảm tiểu cầu, men gan tăng, suy thận, phù phổi, đau đầu/rối loạn thị giác không giải thích được) — không nhất thiết phải có protein niệu nếu đã có các dấu hiệu tổn thương cơ quan khác. Huyết áp từ 160/110 mmHg trở lên được xem là tăng huyết áp nặng.

## Dấu hiệu cần liên hệ y tế ngay
Đau đầu dữ dội không giảm với thuốc giảm đau thông thường, nhìn mờ/thấy đốm sáng/nhấp nháy, đau vùng bụng trên (đặc biệt bên phải, dưới sườn), sưng đột ngột ở mặt/tay/chân, nôn nhiều, hoặc cảm thấy rất không khỏe — đặc biệt từ nửa sau thai kỳ.

## Sản giật và hội chứng HELLP
Sản giật là tiền sản giật tiến triển gây co giật (hoặc hôn mê) — một cấp cứu sản khoa thực sự. Hội chứng HELLP (tán huyết, tăng men gan, giảm tiểu cầu) là biến chứng hiếm nhưng nghiêm trọng của tiền sản giật/sản giật, có thể đe dọa tính mạng và cần điều trị khẩn cấp.

## Aspirin liều thấp để dự phòng
Với thai phụ có yếu tố nguy cơ cao (từng tiền sản giật, mang đa thai, tăng huyết áp mạn, đái tháo đường, bệnh thận, bệnh tự miễn...) hoặc nhiều yếu tố nguy cơ trung bình, aspirin liều thấp có thể được chỉ định bắt đầu từ khoảng tuần 12-28 (tốt nhất trước tuần 16) đến khi sinh. Đáng chú ý: Mỹ (USPSTF/ACOG) khuyến nghị liều cố định 81mg/ngày, trong khi Anh (NICE) khuyến nghị khoảng liều rộng hơn 75-150mg/ngày — đây là khác biệt thật giữa hai hướng dẫn, không phải sai sót. Không tự dùng aspirin khi mang thai nếu không có chỉ định của bác sĩ.

Lưu ý: Đây là nội dung mang tính giáo dục sức khỏe, một số ngưỡng xét nghiệm cụ thể (như tiêu chuẩn chẩn đoán HELLP) cần bác sĩ sản khoa xác nhận và theo dõi trực tiếp, không tự chẩn đoán tại nhà.`,
    category: "Dấu hiệu nguy hiểm",
    stage: "PREGNANCY",
    evidenceLevel: "STRONG",
    knowledgeType: scientific,
    sources: [sources.acogPB222HTN, sources.nhsPreeclampsia, sources.nichdPreeclampsia, sources.uspstfAspirin],
  },
  {
    slug: "tieu-duong-thai-ky-sang-loc-va-quan-ly",
    title: "Tiểu đường thai kỳ: sàng lọc và quản lý",
    summary: "Sàng lọc thường thực hiện ở tuần 24-28; ACOG (Mỹ) và WHO/quốc tế (IADPSG) có hai cách sàng lọc/chẩn đoán khác nhau thực sự — không phải một bên sai, và mỗi cách cho ra tỷ lệ chẩn đoán khác nhau.",
    content: `## Thời điểm sàng lọc
Hầu hết thai phụ được sàng lọc tiểu đường thai kỳ trong khoảng tuần 24-28. Người có yếu tố nguy cơ cao có thể được sàng lọc sớm hơn ngay từ lần khám đầu.

## Hai cách sàng lọc khác nhau thật sự giữa các hướng dẫn
- Cách "hai bước" (ACOG, phổ biến ở Mỹ): uống 50g đường (không cần nhịn ăn) rồi đo đường huyết sau 1 giờ; nếu bất thường, làm tiếp nghiệm pháp dung nạp glucose 100g trong 3 giờ (cần nhịn ăn) để chẩn đoán.
- Cách "một bước" (WHO/IADPSG, phổ biến ở nhiều nước khác): chỉ cần một nghiệm pháp dung nạp glucose 75g trong 2 giờ (cần nhịn ăn); chỉ cần MỘT giá trị bất thường là đủ chẩn đoán.
- Cách một bước thường chẩn đoán tiểu đường thai kỳ ở tỷ lệ cao hơn đáng kể so với cách hai bước. ACOG hiện vẫn chủ yếu dùng cách hai bước nhưng cho phép bác sĩ lựa chọn cách một bước tùy tình huống — đây là một khác biệt hướng dẫn thật sự, không phải lỗi.

## Yếu tố nguy cơ
Thừa cân/béo phì, từng bị tiểu đường thai kỳ ở lần mang thai trước, từng sinh con nặng trên 4kg, tiền sử gia đình bị tiểu đường type 2, hội chứng buồng trứng đa nang, tuổi cao, và một số nhóm dân tộc có nguy cơ cao hơn.

## Quản lý
Bước đầu là điều chỉnh chế độ ăn và tăng vận động, kết hợp theo dõi đường huyết tại nhà. Nếu chưa đủ kiểm soát đường huyết, có thể cần dùng thuốc uống (như metformin) hoặc insulin.

## Nếu không kiểm soát tốt
Nguy cơ thai to (khó sinh, cần mổ lấy thai hoặc khởi phát chuyển dạ), hạ đường huyết và vàng da ở trẻ sơ sinh sau sinh, và với mẹ — khoảng một nửa phụ nữ từng bị tiểu đường thai kỳ sẽ phát triển tiểu đường type 2 sau này, nên cần xét nghiệm đường huyết lại khoảng 6-13 tuần sau sinh và định kỳ hằng năm sau đó.`,
    category: "Chăm sóc thai kỳ",
    stage: "PREGNANCY",
    evidenceLevel: "STRONG",
    knowledgeType: scientific,
    sources: [sources.nhsGDM, sources.cdcGDM],
  },
  {
    slug: "ra-mau-va-bien-chung-nhau-thai-khi-mang-thai",
    title: "Ra máu và biến chứng nhau thai khi mang thai",
    summary: "Ra máu nhẹ khá phổ biến ở tam cá nguyệt đầu (khoảng 15-25% thai kỳ) và không phải lúc nào cũng là dấu hiệu xấu; nhưng ra máu nhiều/đau dữ dội/chóng mặt cần cấp cứu ngay, và nhau tiền đạo (ra máu không đau) khác với nhau bong non (ra máu kèm đau, cơn gò).",
    content: `## Ra máu ở tam cá nguyệt đầu
Ra máu/ra huyết nhẹ xảy ra ở khoảng 15-25% thai kỳ trong 3 tháng đầu và không phải lúc nào cũng có nghĩa là có vấn đề — có thể do máu báo làm tổ, thay đổi mạch máu cổ tử cung, hoặc dấu hiệu dọa sảy; hiếm hơn có thể là thai ngoài tử cung hoặc thai trứng.

## Khi nào cần cấp cứu ngay (bất kỳ tuổi thai nào)
Ra máu nhiều thấm nhanh qua băng vệ sinh, đau bụng dữ dội, đau vai (dấu hiệu gợi ý thai ngoài tử cung), cảm thấy choáng váng/ngất xỉu.

## Khi nào nên liên hệ trong ngày
Ra máu nhẹ/lấm tấm không kèm đau hoặc chỉ đau bụng nhẹ — nên báo bác sĩ/hộ sinh, đặc biệt nếu dưới 20 tuần nên liên hệ đơn vị thai sớm.

## Nhau tiền đạo
Bánh nhau nằm thấp, che một phần hoặc toàn bộ cổ tử cung. Thường được phát hiện ở lần siêu âm hình thái học giữa thai kỳ (khoảng tuần 18-21); phần lớn nhau tiền đạo phát hiện sớm sẽ tự di chuyển lên cao khi tử cung lớn dần, nên thường được siêu âm kiểm tra lại ở tuần 32 và/hoặc 36. Triệu chứng đặc trưng: ra máu đỏ tươi, KHÔNG đau, thường ở 3 tháng cuối. Nếu nhau vẫn còn thấp gần cổ tử cung ở tuần 36, thường cần mổ lấy thai chủ động thay vì sinh thường.

## Nhau bong non
Bánh nhau bong sớm khỏi thành tử cung trước khi sinh — đây là tình trạng nghiêm trọng, cần được xử trí y tế ngay. Triệu chứng: đau bụng, ra máu âm đạo (đôi khi máu không chảy ra ngoài mà tụ lại phía sau nhau, nên có thể đau nhiều mà ra máu ít hoặc không thấy máu), cơn gò tử cung dày. Yếu tố nguy cơ: chấn thương bụng, hút thuốc, dùng cocaine, tăng huyết áp.

## Cách phân biệt (nguyên tắc chung, không tuyệt đối)
Ra máu đỏ tươi, KHÔNG đau → gợi ý nhau tiền đạo. Đau bụng + ra máu + cơn gò dày → gợi ý nhau bong non. Lưu ý: nhau bong non đôi khi máu không chảy ra ngoài (tụ lại bên trong), nên đau bụng dữ dội mới xuất hiện ở nửa sau thai kỳ vẫn cần được khám ngay dù không thấy ra máu.

## Hở eo tử cung (cổ tử cung ngắn)
Là tình trạng cổ tử cung mở sớm không do cơn gò, có thể gây sảy thai muộn hoặc sinh cực non. Với thai phụ từng sinh non tự nhiên trước tuần 34, có thể được đo chiều dài cổ tử cung qua siêu âm trong khoảng tuần 16-24; nếu cổ tử cung dưới 25mm, khâu vòng cổ tử cung (cerclage) có thể được cân nhắc. Với người KHÔNG có tiền sử sinh non, việc đo cổ tử cung ngắn đơn thuần chưa cho thấy lợi ích rõ rệt từ khâu vòng cổ tử cung — không phải ai có cổ tử cung ngắn cũng cần khâu.`,
    category: "Dấu hiệu nguy hiểm",
    stage: "PREGNANCY",
    evidenceLevel: "STRONG",
    knowledgeType: scientific,
    sources: [sources.rcogEarlyBleeding, sources.nhsVaginalBleeding, sources.nhsPlacentaComplications, sources.cuhPlacentaPraevia, sources.acogPB142Cervical],
  },
  {
    slug: "thieu-mau-khi-mang-thai-sang-loc-va-bo-sung-sat",
    title: "Thiếu máu khi mang thai: sàng lọc và bổ sung sắt",
    summary: "Mang thai làm loãng máu sinh lý nên huyết sắc tố giảm nhẹ là bình thường; thiếu máu thật sự được sàng lọc hai lần (đầu thai kỳ và tuần 24-28), và bổ sung sắt liều thấp được khuyến nghị từ tam cá nguyệt đầu.",
    content: `## Vì sao huyết sắc tố giảm nhẹ là bình thường
Khi mang thai, thể tích huyết tương tăng 40-50%, trong khi lượng hồng cầu chỉ tăng 15-25% — sự pha loãng này khiến chỉ số huyết sắc tố (Hb)/hematocrit giảm nhẹ một cách sinh lý, khác với thiếu máu do thiếu sắt thật sự.

## Ngưỡng chẩn đoán thiếu máu theo tam cá nguyệt
- Tam cá nguyệt 1: Hb dưới 11.0 g/dL.
- Tam cá nguyệt 2: Hb dưới 10.5 g/dL (điểm pha loãng thấp nhất của thai kỳ).
- Tam cá nguyệt 3: Hb dưới 11.0 g/dL.
Đáng chú ý: Hb quá CAO (trên 15 g/dL ở tam cá nguyệt 2-3) cũng được xem là bất thường — có thể là dấu hiệu thể tích máu không tăng đủ, liên quan nguy cơ thai chậm phát triển hoặc sinh non, không phải dấu hiệu "sắt tốt".

## Thời điểm sàng lọc
Tất cả thai phụ nên được xét nghiệm công thức máu ở lần khám đầu (tam cá nguyệt 1) và lại một lần nữa ở tuần 24-28.

## Bổ sung sắt
Bổ sung sắt liều thấp được khuyến nghị bắt đầu từ tam cá nguyệt đầu cho MỌI thai phụ (không chỉ người đã thiếu máu) để giảm tỷ lệ thiếu máu lúc sinh — đây là khuyến cáo mức bằng chứng mạnh nhất trong hướng dẫn liên quan. Khi đã xác định thiếu máu do thiếu sắt, điều trị bằng viên sắt uống là chuẩn; sắt truyền tĩnh mạch có thể cân nhắc nếu không dung nạp/đáp ứng với đường uống hoặc thiếu máu nặng ở giai đoạn muộn thai kỳ.

Lưu ý: Đây là khuyến cáo chung; liều lượng và loại sắt cụ thể cần theo chỉ định của bác sĩ sản khoa dựa trên kết quả xét nghiệm thực tế.`,
    category: "Dinh dưỡng của mẹ",
    stage: "PREGNANCY",
    evidenceLevel: "STRONG",
    knowledgeType: scientific,
    sources: [sources.acogPB233Anemia, sources.cdcMMWRIron],
  },
  {
    slug: "dau-hieu-chuyen-da-sinh-non-va-vo-oi-truoc-37-tuan",
    title: "Dấu hiệu chuyển dạ sinh non và vỡ ối trước 37 tuần",
    summary: "Cơn gò đều đặn, đau lưng dưới âm ỉ, áp lực vùng chậu hoặc thay đổi dịch âm đạo trước tuần 37 cần được báo ngay, không chờ đến lịch khám tiếp theo; nghi ngờ vỡ ối ở bất kỳ tuổi thai nào cũng cần đi khám ngay.",
    content: `## Dấu hiệu chuyển dạ sinh non (trước tuần 37)
Cơn gò tử cung đều đặn hoặc thường xuyên (có thể không đau), đau lưng dưới âm ỉ liên tục, cảm giác áp lực/nặng vùng chậu hoặc bụng dưới, thay đổi dịch âm đạo (ra nhiều hơn, loãng như nước, nhầy hoặc lẫn máu), đau quặn bụng kiểu hành kinh. Nếu có bất kỳ dấu hiệu nào trong số này trước tuần 37, KHÔNG chờ đợi — liên hệ bác sĩ ngay hoặc đến bệnh viện. Phần lớn trường hợp (khoảng 7/10 theo một số ước tính) triệu chứng sẽ giảm và bé vẫn sinh đủ tháng — nhưng luôn cần được đánh giá để loại trừ chuyển dạ thật.

## Yếu tố nguy cơ
Từng sinh non trước đó, mang đa thai, cổ tử cung ngắn, một số nhiễm trùng, và một số yếu tố khác.

## Nếu được chẩn đoán chuyển dạ sinh non
- Corticosteroid (như betamethasone) thường được chỉ định trong khoảng tuần 24-34 (một số trường hợp tới 36 tuần 6 ngày) để giúp phổi bé trưởng thành nhanh hơn nếu nguy cơ sinh trong 7 ngày tới.
- Thuốc giảm gò (tocolytics) có thể được dùng để trì hoãn chuyển dạ trong thời gian ngắn.
- Magie sulfat có thể được chỉ định ở tuổi thai rất sớm (khoảng dưới 32-33 tuần tùy hướng dẫn) để hỗ trợ bảo vệ não bộ bé, giảm nguy cơ bại não.

## Vỡ ối — luôn cần đi khám ngay, bất kể tuổi thai
Nếu nghi ngờ vỡ ối (rỉ nước liên tục hoặc chảy ồ ạt không kiểm soát được), cần liên hệ y tế ngay dù có cơn gò hay không. Rất khó tự phân biệt chắc chắn nước ối với nước tiểu rỉ hay dịch âm đạo tăng tiết — nhân viên y tế cần kiểm tra trực tiếp, không nên tự chẩn đoán tại nhà. Cần báo ngay nếu dịch có mùi hôi, đổi màu (xanh/nâu), hoặc kèm ra máu/giảm cử động thai.

- Vỡ ối gần đủ tháng: nếu chưa chuyển dạ tự nhiên trong khoảng 24 giờ, thường được đề nghị khởi phát chuyển dạ do nguy cơ nhiễm trùng tăng dần theo thời gian không có nước ối bảo vệ.
- Vỡ ối non tháng (trước 37 tuần): cách xử trí khác — thường ưu tiên theo dõi sát kèm kháng sinh phòng ngừa nhiễm trùng thay vì một mốc giờ cố định để khởi phát chuyển dạ, vì cần cân bằng giữa nguy cơ nhiễm trùng và nguy cơ sinh quá non.

## Liên quan đến GBS
Nếu chuyển dạ sinh non hoặc vỡ ối xảy ra trước mốc sàng lọc thường quy (tuần 36-37), bác sĩ thường lấy mẫu xét nghiệm GBS ngay và bắt đầu kháng sinh phòng ngừa trong lúc chờ kết quả, thay vì đợi đến lịch xét nghiệm thường quy.`,
    category: "Dấu hiệu nguy hiểm",
    stage: "PREGNANCY",
    evidenceLevel: "STRONG",
    knowledgeType: scientific,
    sources: [sources.acogPretermLabor, sources.nhsPrematureLabor, sources.acogCorticosteroids, sources.acogMagnesium, sources.niceNG25Preterm, sources.statPearlsPROM, sources.gbsACOG797],
  },
  {
    slug: "thai-may-giam-khi-nao-can-di-kham-ngay",
    title: "Thai máy giảm: khi nào cần đi khám ngay",
    summary: "Bé KHÔNG cử động ít đi vì không gian chật ở cuối thai kỳ — nếu cảm thấy cử động giảm hoặc thay đổi so với kiểu thường ngày, cần liên hệ y tế ngay lập tức, bất kể giờ giấc; việc đếm cử động theo một con số cố định hiện không còn được xem là biện pháp có bằng chứng giảm thai lưu.",
    content: `## Nguyên tắc quan trọng nhất
Nếu cảm thấy cử động của bé giảm, chậm lại hoặc khác với kiểu cử động quen thuộc hằng ngày — dù ở bất kỳ thời điểm nào trong ngày hay đêm — cần liên hệ ngay với hộ sinh/bác sĩ hoặc đến cơ sở y tế. KHÔNG chờ xem có cải thiện không, KHÔNG đợi đến sáng hôm sau, và KHÔNG chờ tới lịch khám tiếp theo.

## Cử động thai KHÔNG giảm dần khi gần đến ngày sinh
Nhiều người nghĩ bé "ít đạp hơn" vì không còn đủ chỗ cử động ở cuối thai kỳ — điều này KHÔNG đúng theo hướng dẫn y tế: cử động thai bình thường không giảm ở giai đoạn cuối thai kỳ. Một sự thay đổi (đặc biệt là giảm) trong kiểu cử động mới là điều cần chú ý, không phải bản thân việc "gần ngày sinh".

## Về việc đếm số lần đạp (kick counts)
Đây là điểm hướng dẫn đã thay đổi/còn tranh luận: một số tài liệu phổ biến trước đây khuyên đếm đủ một số lần cử động cố định trong khoảng thời gian nhất định. Tuy nhiên, hướng dẫn hiện tại của NICE (Anh) nêu rõ các chương trình đếm cử động có cấu trúc CHƯA cho thấy làm giảm tỷ lệ thai lưu — một thử nghiệm lớn (AFFIRM, hơn 400,000 sản phụ) và một tổng quan Cochrane năm 2021 đều không tìm thấy bằng chứng rõ ràng rằng các chương trình nâng cao nhận thức/đếm cử động làm giảm thai lưu, dù mức độ chắc chắn của các bằng chứng này còn thấp. Trang hướng dẫn dành cho bệnh nhân của ACOG (Mỹ) hiện cũng không đưa ra một con số cố định cụ thể mà để bác sĩ hướng dẫn riêng cho từng người.

Điều này KHÔNG có nghĩa là theo dõi cử động thai không quan trọng — ngược lại, nó có nghĩa là: quan trọng nhất là làm quen với kiểu cử động bình thường của bé và báo ngay khi có thay đổi, hơn là cố đạt đúng một con số đếm cụ thể.

## Vì sao cần báo ngay
Cử động giảm đôi khi có thể liên quan đến việc bé không nhận đủ oxy/dinh dưỡng — dù phần lớn trường hợp báo giảm cử động vẫn kết thúc với một em bé khỏe mạnh, việc kiểm tra kịp thời (thường bằng theo dõi tim thai) giúp phát hiện sớm nếu thực sự có vấn đề.`,
    category: "Dấu hiệu nguy hiểm",
    stage: "PREGNANCY",
    evidenceLevel: "MODERATE",
    knowledgeType: scientific,
    sources: [sources.quickeningNHS, sources.acogFetalMovement, sources.niceNG201, sources.affirmTrialLancet, sources.cochraneFetalMovement],
  },
  {
    slug: "cac-giai-doan-chuyen-da-va-thoi-gian-tham-khao",
    title: "Các giai đoạn chuyển dạ và thời gian tham khảo",
    summary: "Chuyển dạ có 3 giai đoạn (mở/xóa cổ tử cung, rặn sinh, sổ nhau); các mốc \"chuyển dạ kéo dài bất thường\" gần đây đã được nới rộng hơn nhiều so với tiêu chuẩn cũ từ thập niên 1950.",
    content: `## Ba giai đoạn chính
- Giai đoạn 1: từ khi có cơn co đều đặn gây mở/xóa cổ tử cung đến khi cổ tử cung mở trọn (10cm). Chia thành pha tiềm tàng (mở chậm) và pha hoạt động (mở nhanh hơn).
- Giai đoạn 2: từ khi cổ tử cung mở trọn đến khi sinh bé, gồm giai đoạn rặn sinh chủ động.
- Giai đoạn 3: từ khi sinh bé đến khi sổ nhau.
- Một số tài liệu mô tả thêm "giai đoạn 4" không chính thức: 1-2 giờ đầu sau sinh, khi mẹ được theo dõi sát nguy cơ chảy máu — đây là cách gọi mô tả, không phải một giai đoạn được đặt tên chính thức như 3 giai đoạn trên.

## Mốc bắt đầu pha hoạt động: một thay đổi đáng chú ý
Trước đây, pha hoạt động của giai đoạn 1 thường được tính từ khi cổ tử cung mở 4cm. Đồng thuận của ACOG/SMFM năm 2014 (dựa trên dữ liệu hơn 60,000 ca sinh) đã đổi mốc này thành 6cm cho phần lớn sản phụ — nghĩa là trước 6cm, tiêu chuẩn đánh giá "tiến triển chậm" của pha hoạt động không nên áp dụng. Đáng chú ý, hướng dẫn của Anh (NICE) hiện vẫn mô tả pha hoạt động bắt đầu khoảng 4-5cm — đây là một khác biệt thật giữa hai hướng dẫn, không phải lỗi.

## Thời gian được xem là bình thường đã được nới rộng
- Giai đoạn 1 tiềm tàng kéo dài: ACOG hiện định nghĩa là trên 16 giờ (áp dụng cho cả con so lẫn con rạ), thay vì các mốc ngắn hơn trước đây.
- Giai đoạn 2 (rặn sinh) kéo dài: ACOG (2024) đưa ra mốc tham khảo trên 3 giờ (con so) / trên 2 giờ (con rạ), nhưng nhấn mạnh đây là hướng dẫn để cân nhắc từng ca, không phải ngưỡng bắt buộc can thiệp ngay — vì có tới 78-82% sản phụ rặn lâu hơn mốc này vẫn sinh thường được an toàn.
- Giai đoạn 3 kéo dài: thường được xem là trên 30 phút nếu xử trí tích cực, hoặc trên 60 phút nếu để tự nhiên; nhau sổ chậm quá 30 phút làm tăng đáng kể nguy cơ băng huyết.

## Các dấu hiệu tiến triển bác sĩ/hộ sinh theo dõi
Độ mở cổ tử cung (cm), độ xóa cổ tử cung (%), độ lọt của ngôi thai so với khung chậu, và kiểu cơn co (tần suất, cường độ, đều đặn) — thường được kiểm tra lại mỗi 2-4 giờ để xác nhận có tiến triển, không chỉ dựa vào một lần khám.`,
    category: "Chuẩn bị sinh",
    stage: "PREGNANCY",
    evidenceLevel: "MODERATE",
    knowledgeType: scientific,
    sources: [sources.acogSMFMCesareanConsensus, sources.acogCPG8, sources.niceNG235],
  },
  {
    slug: "theo-doi-tim-thai-trong-chuyen-da-lien-tuc-hay-ngat-quang",
    title: "Theo dõi tim thai trong chuyển dạ: liên tục hay ngắt quãng?",
    summary: "Với chuyển dạ nguy cơ thấp, theo dõi tim thai liên tục (CTG) không làm giảm tử vong chu sinh hay bại não so với nghe ngắt quãng, nhưng làm giảm co giật sơ sinh và tăng tỷ lệ mổ lấy thai/sinh hỗ trợ — đây là một sự đánh đổi thật sự, không phải phương pháp nào \"tốt hơn\" tuyệt đối.",
    content: `## Bằng chứng từ Cochrane: một sự đánh đổi thật sự
So với nghe tim thai ngắt quãng, theo dõi tim thai điện tử liên tục ở chuyển dạ nguy cơ thấp:
- KHÔNG làm giảm rõ rệt tử vong chu sinh hay bại não.
- Giảm khoảng một nửa nguy cơ co giật ở trẻ sơ sinh — nhưng không thấy ảnh hưởng đến kết cục lâu dài (không giảm bại não).
- Làm tăng tỷ lệ mổ lấy thai và sinh hỗ trợ (forceps/giác hút).
- Độ chính xác dự đoán toan hóa máu thai còn hạn chế — tỷ lệ dương tính giả khá cao.

Đây không phải là bằng chứng "CTG liên tục tốt hơn" — mà là một đánh đổi cần cân nhắc: giảm một biến chứng hiếm gặp (co giật sơ sinh) đổi lại tăng can thiệp sản khoa, trong khi kết cục nghiêm trọng nhất (tử vong, bại não) không khác biệt rõ rệt.

## Khi nào CTG liên tục được khuyến nghị dù nguy cơ thấp
- Đang dùng oxytocin để khởi phát/tăng co.
- Đã gây tê ngoài màng cứng.
- Nước ối có phân su.
- Mẹ sốt hoặc có dấu hiệu nhiễm trùng trong chuyển dạ.
- Ra máu âm đạo không giải thích được.
- Nghe tim thai ngắt quãng phát hiện bất thường (nhịp quá nhanh/chậm, giảm nhịp lặp lại).

## Tần suất nghe tim thai ngắt quãng tham khảo (khi không có chỉ định CTG liên tục)
Các hiệp hội đưa ra tần suất hơi khác nhau (ví dụ giai đoạn 1 hoạt động: mỗi 15-30 phút; giai đoạn 2: mỗi 5-15 phút tùy hiệp hội) — bản thân các mốc phút cụ thể này được các nguồn ghi nhận là dựa trên đồng thuận chuyên gia, không phải từ thử nghiệm đối chứng ngẫu nhiên.

Lưu ý: Quyết định phương pháp theo dõi cụ thể nên do bác sĩ/hộ sinh đánh giá theo tình huống thực tế của mẹ và bé.`,
    category: "Chuẩn bị sinh",
    stage: "PREGNANCY",
    evidenceLevel: "MODERATE",
    knowledgeType: scientific,
    sources: [sources.cochraneEFM, sources.aafpFetalMonitoring, sources.niceNG229],
  },
  {
    slug: "khoi-phat-chuyen-da-khi-nao-va-phuong-phap-nao",
    title: "Khởi phát chuyển dạ: khi nào cần và các phương pháp thường dùng",
    summary: "Khởi phát chuyển dạ được cân nhắc vì lý do y khoa (quá ngày, vỡ ối không chuyển dạ, tiền sản giật...); sau thử nghiệm ARRIVE, ACOG (Mỹ) đồng ý khởi phát chủ động từ tuần 39 cho thai kỳ nguy cơ thấp con so, trong khi NICE (Anh) không áp dụng mốc này — một khác biệt guideline thật sự.",
    content: `## Lý do y khoa thường gặp để khởi phát
Thai quá ngày (thường từ tuần 41), vỡ ối nhưng chưa chuyển dạ, tiền sản giật/tăng huyết áp thai kỳ, tiểu đường thai kỳ, thai chậm phát triển, hoặc thai máy giảm kèm kết quả theo dõi đáng lo ngại.

## Khởi phát chủ động ở tuần 39 cho thai kỳ nguy cơ thấp — một thay đổi đáng chú ý
Thử nghiệm ARRIVE (hơn 6,000 sản phụ con so nguy cơ thấp) so sánh khởi phát ở tuần 39 với việc chờ chuyển dạ tự nhiên đến tuần 41: tỷ lệ mổ lấy thai THẤP HƠN ở nhóm khởi phát (18.6% so với 22.2%), tỷ lệ rối loạn tăng huyết áp cũng thấp hơn, và không có khác biệt về kết cục nghiêm trọng cho bé. Dựa trên kết quả này, ACOG/SMFM (Mỹ) cho rằng có thể hợp lý khi đề nghị khởi phát chủ động ở tuần 39 cho sản phụ con so nguy cơ thấp, với điều kiện có sự đồng thuận sau khi trao đổi kỹ. Tuy nhiên, hướng dẫn của NICE (Anh) không áp dụng mốc 39 tuần này cho thai kỳ không biến chứng — đây là một khác biệt guideline thật sự hiện tại, không phải một bên đã lỗi thời.

## Các phương pháp làm "chín muồi" cổ tử cung
- Cơ học: bóc tách màng ối (membrane sweep), đặt bóng/ống thông Foley, hoặc que nong hút ẩm — giúp cổ tử cung mở dần mà không cần theo dõi tim thai liên tục trong lúc đặt.
- Thuốc: prostaglandin (như misoprostol, dinoprostone) đặt âm đạo — misoprostol rẻ hơn nhưng tác dụng không thể đảo ngược; dinoprostone có thể rút ra nếu cần dừng tác dụng. Không dùng prostaglandin cho người từng mổ lấy thai vì tăng nguy cơ vỡ tử cung.
- Chỉ số Bishop (thang điểm 0-13) được dùng để đánh giá cổ tử cung đã sẵn sàng cho khởi phát hay cần làm chín muồi trước.

## Oxytocin (Pitocin)
Truyền tĩnh mạch để khởi phát/tăng cơn co; bắt buộc theo dõi tim thai và cơn co liên tục trong suốt quá trình vì có thể gây co bóp quá mạnh/quá dày.

## Bóc tách màng ối (membrane sweep)
Theo tổng quan Cochrane, bóc tách màng ối có thể giúp chuyển dạ tự nhiên bắt đầu sớm hơn và giảm nhu cầu khởi phát chính thức bằng phương pháp khác, nhưng mức độ chắc chắn của bằng chứng còn thấp; không thấy tăng nguy cơ biến chứng rõ rệt. Thủ thuật có thể gây khó chịu và ra máu nhẹ.

## Cân nhắc chung
Chuyển dạ khởi phát thường đau hơn, cần theo dõi nhiều hơn, có thể không thành công và cần chuyển sang phương pháp khác hoặc mổ lấy thai — nhưng với nhóm cụ thể (con so nguy cơ thấp, tuần 39), bằng chứng từ ARRIVE cho thấy khởi phát không làm tăng mà còn giảm tỷ lệ mổ lấy thai so với chờ đến tuần 41.`,
    category: "Chuẩn bị sinh",
    stage: "PREGNANCY",
    evidenceLevel: "STRONG",
    knowledgeType: scientific,
    sources: [sources.acogArriveStatement, sources.niceNG207Induction, sources.aafpCervicalRipening, sources.nhsInducingLabour, sources.cochraneMembraneSweep],
  },
  {
    slug: "gay-te-ngoai-mang-cung-va-thuoc-giam-dau-trong-chuyen-da",
    title: "Gây tê ngoài màng cứng và thuốc giảm đau trong chuyển dạ",
    summary: "Gây tê ngoài màng cứng KHÔNG làm tăng nguy cơ mổ lấy thai theo bằng chứng Cochrane tốt nhất hiện có, dù có thể kéo dài giai đoạn 2 và một số tác dụng phụ thường gặp; không còn yêu cầu phải chờ mở cổ tử cung đến một mốc cố định mới được gây tê.",
    content: `## Gây tê ngoài màng cứng — cơ chế và thời điểm
Thuốc tê được đưa qua một ống nhỏ đặt ở vùng lưng dưới, gần các dây thần kinh dẫn truyền cảm giác đau từ tử cung/đường sinh. Trước đây có quan niệm phải chờ cổ tử cung mở đến một mức nhất định mới gây tê; bằng chứng hiện tại cho thấy gây tê sớm (≤3cm) so với muộn hơn (≥4cm) không khác biệt về nguy cơ mổ lấy thai hay sinh hỗ trợ — nhiều hướng dẫn hiện nay cho phép gây tê theo yêu cầu của sản phụ bất kỳ lúc nào trong chuyển dạ, miễn an toàn.

## Có làm tăng nguy cơ mổ lấy thai không? — Không
Tổng quan Cochrane (hơn 10,000 sản phụ) cho thấy KHÔNG có khác biệt có ý nghĩa thống kê về tỷ lệ mổ lấy thai giữa nhóm gây tê và không gây tê. Gây tê có làm tăng tỷ lệ sinh hỗ trợ (forceps/giác hút) trong các nghiên cứu cũ hơn, nhưng hiệu ứng này không còn rõ trong các nghiên cứu sau năm 2005 — có thể do kỹ thuật gây tê liều thấp hiện đại hơn.

## Tác dụng phụ thường gặp
Tụt huyết áp, mất kiểm soát bàng quang tạm thời (có thể cần đặt sonde tiểu), ngứa da (do thành phần opioid trong thuốc tê, thường nhẹ), buồn nôn (thực ra ÍT hơn so với một số thuốc giảm đau khác), giảm đau không đều, kéo dài giai đoạn 2 (trung bình thêm khoảng vài chục phút), và có liên quan đến sốt trong chuyển dạ (hiện được cho là phản ứng viêm không do nhiễm trùng, nhưng lâm sàng khó phân biệt ngay nên có thể vẫn cần xử trí như nghi nhiễm trùng).

## Rủi ro hiếm gặp nhưng nghiêm trọng
Đau đầu sau chọc dò tủy sống (khoảng 1-2%, có thể cần "vá máu" - blood patch), tổn thương thần kinh tạm thời (thường hồi phục trong vài ngày-tuần), tổn thương thần kinh vĩnh viễn (rất hiếm, khoảng 1/10,000), nhiễm trùng tại vị trí gây tê (hiếm khi lan rộng). Gây tê ngoài màng cứng KHÔNG gây đau lưng mạn tính sau sinh — đau lưng sau sinh thường liên quan đến thay đổi tư thế/cân nặng khi mang thai.

## Thuốc giảm đau nhóm opioid tiêm
Có thể giảm đau và giúp thư giãn trong chuyển dạ sớm, nhưng thường tránh dùng gần thời điểm sinh vì có thể ảnh hưởng đến nhịp thở của bé ngay sau sinh; tác dụng phụ với mẹ gồm chóng mặt, buồn nôn. Bằng chứng Cochrane về ảnh hưởng cụ thể lên trẻ sơ sinh được đánh giá là còn "chưa rõ ràng", chất lượng bằng chứng thấp — nên đây là một điểm các nguồn thận trọng hơn là các trang hướng dẫn bệnh nhân diễn đạt.

## Khí cười (nitrous oxide / Entonox)
Tự hít qua mặt nạ, có tác dụng sau khoảng 15-20 giây nên cần hít đúng lúc cơn co bắt đầu; giảm đau một phần chứ không mất hoàn toàn; tác dụng phụ nhẹ và hồi phục được (chóng mặt, buồn nôn, buồn ngủ).`,
    category: "Chuẩn bị sinh",
    stage: "PREGNANCY",
    evidenceLevel: "STRONG",
    knowledgeType: scientific,
    sources: [sources.cochraneEpidural, sources.aafpEpidural, sources.nhsPainRelief, sources.nhsEpiduralSideEffects, sources.nichdPainRelief],
  },
  {
    slug: "phuong-phap-giam-dau-khong-dung-thuoc-khi-chuyen-da",
    title: "Các phương pháp giảm đau không dùng thuốc khi chuyển dạ",
    summary: "Có người đồng hành hỗ trợ liên tục (như doula) có bằng chứng mạnh và nhất quán nhất trong các biện pháp không dùng thuốc; ngâm nước có bằng chứng vừa phải cho giảm đau giai đoạn 1, nhưng ACOG khuyến cáo nên sinh trên cạn thay vì dưới nước; TENS có bằng chứng còn hạn chế.",
    content: `## Người đồng hành hỗ trợ liên tục — bằng chứng mạnh nhất
Theo tổng quan Cochrane (gần 16,000 sản phụ), có người hỗ trợ liên tục xuyên suốt chuyển dạ (đặc biệt vai trò như doula — người được đào tạo chuyên hỗ trợ sinh, không phải nhân viên bệnh viện hay người nhà) giúp: tăng tỷ lệ sinh thường tự nhiên, giảm tỷ lệ mổ lấy thai, giảm nhu cầu dùng thuốc giảm đau, rút ngắn thời gian chuyển dạ trung bình khoảng 41 phút, và giảm cảm giác trải nghiệm sinh tiêu cực — không ghi nhận tác hại. Hiệu quả rõ nhất khi người hỗ trợ là người chuyên trách (như doula), không phải nhân viên y tế bận rộn với nhiều việc khác.

## Ngâm nước khi chuyển dạ
Theo Cochrane, ngâm mình trong nước ở giai đoạn 1 giúp giảm nhẹ nhu cầu dùng gây tê vùng, không có khác biệt rõ về cách sinh hay biến chứng cho mẹ/bé. Tuy nhiên, đây là điểm có góc nhìn khác nhau đáng chú ý: ACOG khuyến cáo việc ngâm nước ở GIAI ĐOẠN 1 có thể phù hợp với thai kỳ đủ tháng, không biến chứng, nhưng KHÔNG khuyến nghị SINH dưới nước (giai đoạn 2) vì an toàn/hiệu quả chưa được xác lập đầy đủ và có báo cáo một số vấn đề sức khỏe hiếm gặp nhưng nghiêm trọng ở trẻ sơ sinh — ACOG kết luận nên để việc sinh diễn ra trên cạn.

## Máy kích thích thần kinh qua da (TENS)
Bằng chứng Cochrane cho thấy còn hạn chế về hiệu quả giảm đau của TENS, dù không có tác dụng phụ đáng kể (an toàn để lựa chọn dùng thử) — không nên kỳ vọng đây là biện pháp giảm đau mạnh.

## Thay đổi tư thế, vận động, kỹ thuật thở
Được khuyến nghị rộng rãi trong thực hành lâm sàng, nhưng nghiên cứu chưa xác định rõ mức độ hiệu quả cụ thể bằng các thử nghiệm đối chứng lớn như các phương pháp trên — nên xem đây là lựa chọn hợp lý, thoải mái, ít rủi ro, hơn là biện pháp đã được chứng minh hiệu quả rõ ràng.

## WHO và quyền được giảm đau
WHO xem việc được lựa chọn phương pháp giảm đau là một phần của "trải nghiệm sinh tích cực" — sản phụ có quyền được cung cấp giảm đau khi có yêu cầu, dù có hay không dùng thuốc.`,
    category: "Chuẩn bị sinh",
    stage: "PREGNANCY",
    evidenceLevel: "MODERATE",
    knowledgeType: scientific,
    sources: [sources.cochraneLaborSupport, sources.cochraneWaterImmersion, sources.cochraneTENS, sources.whoIntrapartumCare, sources.nhsPainRelief],
  },
  {
    slug: "rach-tang-sinh-mon-khi-sinh-phan-loai-va-phong-ngua",
    title: "Rách/rạch tầng sinh môn khi sinh: phân loại và cách phòng ngừa",
    summary: "Rách tầng sinh môn được chia thành 4 độ; rạch tầng sinh môn thường quy không còn được khuyến nghị (chỉ cắt khi thật sự cần thiết); xoa bóp đáy chậu cuối thai kỳ và chườm ấm khi rặn sinh có bằng chứng Cochrane giúp giảm nguy cơ rách nặng.",
    content: `## Phân loại rách tầng sinh môn
- Độ 1: chỉ rách da, thường tự lành nhanh, không cần khâu.
- Độ 2: rách qua cả cơ tầng sinh môn và da, thường cần khâu.
- Độ 3: rách vào cơ thắt hậu môn (chia nhỏ thành 3a/3b/3c theo mức độ tổn thương cơ thắt).
- Độ 4: rách sâu vào tận niêm mạc hậu môn/trực tràng.
Rách độ 3-4 xảy ra ở khoảng 3/100 ca sinh thường nói chung (khoảng 6/100 ở lần sinh đầu, 2/100 ở lần sinh sau).

## Rạch tầng sinh môn: thường quy hay chỉ khi cần?
Theo tổng quan Cochrane, chính sách "chỉ rạch khi cần" (restrictive) giúp giảm khoảng 30% số ca rách/tổn thương tầng sinh môn nặng so với rạch thường quy cho mọi ca sinh — rạch cho tất cả không mang lại lợi ích bảo vệ như từng nghĩ. NHS/RCOG (Anh) hiện áp dụng chính sách này: chỉ rạch khi bé cần sinh nhanh (suy thai), khi cần dùng forceps/giác hút, hoặc khi có nguy cơ rách nặng.

## Yếu tố nguy cơ rách nặng (độ 3-4)
Sinh con so, cân nặng bé lớn, sinh hỗ trợ bằng forceps, giai đoạn 2 kéo dài, ngôi thai bất thường (chẩm sau), tuổi mẹ cao hơn. Nếu từng bị rách độ 3-4 ở lần sinh trước, nguy cơ tái diễn lần sau khoảng 7-10/100.

## Các biện pháp phòng ngừa có bằng chứng
- Xoa bóp đáy chậu từ khoảng tuần 35, 1-2 lần/tuần (tự làm hoặc bạn đời hỗ trợ): theo Cochrane giúp giảm nhu cầu khâu và giảm tỷ lệ rạch tầng sinh môn, rõ nhất ở người sinh con so.
- Chườm ấm vùng tầng sinh môn trong lúc rặn sinh (giai đoạn 2): theo Cochrane (chất lượng bằng chứng trung bình) giúp giảm rách độ 3-4.
- Xoa bóp tầng sinh môn trong lúc rặn sinh cũng cho thấy giảm rách độ 3-4 trong một số nghiên cứu, nhưng bằng chứng cho các kết cục khác chưa nhất quán.

## Cách khâu/xử trí
Rách độ 1 thường tự lành, không cần khâu. Rách độ 2 và vết rạch thường được khâu bằng chỉ tự tiêu ngay sau sinh. Rách độ 3-4 cần được khâu cẩn thận hơn, thường tại phòng mổ, dưới gây tê tủy sống/ngoài màng cứng, bởi bác sĩ có kinh nghiệm.`,
    category: "Chuẩn bị sinh",
    stage: "PREGNANCY",
    evidenceLevel: "STRONG",
    knowledgeType: scientific,
    sources: [sources.rcogPerinealTears, sources.rcogOASI, sources.cochraneEpisiotomy, sources.nhsEpisiotomyTears, sources.cochranePerinealMassage, sources.cochraneWarmCompress],
  },
  {
    slug: "sinh-thuong-sau-mo-lay-thai-vbac",
    title: "Sinh thường sau mổ lấy thai (VBAC): ai phù hợp, tỷ lệ thành công và rủi ro",
    summary: "Phần lớn người từng mổ lấy thai một lần với đường mổ ngang thấp là ứng viên hợp lý cho VBAC, tỷ lệ thành công khoảng 60-80%; rủi ro chính là vỡ tử cung (hiếm nhưng nghiêm trọng), nên VBAC cần thực hiện tại cơ sở có khả năng mổ cấp cứu ngay khi cần.",
    content: `## Ai là ứng viên phù hợp
Phần lớn người từng mổ lấy thai với đường mổ ngang thấp trên tử cung (đường mổ phổ biến nhất hiện nay) là ứng viên hợp lý để thử sinh thường (TOLAC - trial of labor after cesarean). KHÔNG phù hợp: từng mổ đường dọc cổ điển hoặc đường chữ T, từng bị vỡ tử cung, hoặc từng phẫu thuật lớn trên đáy tử cung. Nếu không rõ loại đường mổ trước đó, vẫn có thể được xem là ứng viên hợp lý trong nhiều trường hợp.

## Tỷ lệ thành công
Với người là ứng viên phù hợp và chọn thử sinh thường, tỷ lệ sinh thường thành công khoảng 60-80%.

## Rủi ro chính: vỡ tử cung
Đây là biến chứng hiếm nhưng nghiêm trọng — vết mổ cũ trên tử cung có thể bục ra trong lúc chuyển dạ. Với đường mổ ngang thấp trước đó, nguy cơ được ghi nhận khoảng 0.5-0.9% (các nguồn đưa số liệu hơi khác nhau trong khoảng này). Vì biến chứng này có thể cần mổ cấp cứu trong vài phút để bảo vệ mẹ và bé, VBAC/TOLAC được khuyến nghị thực hiện tại bệnh viện có khả năng mổ lấy thai cấp cứu ngay lập tức — không phải tại nhà hay cơ sở sinh không có phẫu thuật.

## Một lưu ý về chất lượng bằng chứng
Đáng chú ý, các con số về tỷ lệ vỡ tử cung chủ yếu đến từ các nghiên cứu quan sát quy mô lớn, không phải từ thử nghiệm ngẫu nhiên có đối chứng — tổng quan Cochran về so sánh trực tiếp giữa chủ động mổ lại và thử sinh thường chỉ tìm được 2 thử nghiệm với tổng cộng 320 sản phụ, quá nhỏ để kết luận chắc chắn. Điều này không có nghĩa là số liệu không đáng tin, nhưng cha mẹ nên biết mức độ chắc chắn của bằng chứng khi cân nhắc lựa chọn cùng bác sĩ.

## Thuật ngữ
TOLAC (trial of labor after cesarean - thử chuyển dạ sau mổ lấy thai) là thuật ngữ chỉ NỖ LỰC sinh thường, bất kể kết quả; VBAC chính xác là chỉ trường hợp nỗ lực đó THÀNH CÔNG (sinh thường được). Trong giao tiếp thông thường, "VBAC" hay được dùng để chỉ chung cả quá trình.`,
    category: "Chuẩn bị sinh",
    stage: "PREGNANCY",
    evidenceLevel: "MODERATE",
    knowledgeType: scientific,
    sources: [sources.aafpVBAC, sources.acogVBACFAQ, sources.cochraneVBAC],
  },
  {
    slug: "kep-ron-muon-va-da-ke-da-ngay-sau-sinh",
    title: "Kẹp rốn muộn và da kề da ngay sau sinh",
    summary: "Chờ ít nhất 30-60 giây (WHO: khoảng 1-3 phút) trước khi kẹp rốn giúp tăng dự trữ sắt và giảm thiếu máu cho bé trong vài tháng đầu, đổi lại một phần nhỏ tăng nhu cầu chiếu đèn vàng da; da kề da ngay sau sinh, kéo dài ít nhất đến sau cữ bú đầu, có bằng chứng tốt nhất cho việc hỗ trợ bú mẹ.",
    content: `## Kẹp rốn muộn
Các tổ chức đưa ra khoảng thời gian hơi khác nhau: WHO khuyến nghị khoảng 1-3 phút, ACOG khuyến nghị ít nhất 30-60 giây (đủ tháng) hoặc ít nhất 60 giây (sinh non), NICE (Anh) cho phép tới 5 phút hoặc lâu hơn tùy sản phụ chọn. Đây không phải mâu thuẫn nghiêm trọng — chỉ là chưa có một con số giây chính xác duy nhất được mọi nơi thống nhất; điểm chung là đều khuyến nghị KHÔNG kẹp ngay lập tức (dưới ~30 giây) trừ khi cần hồi sức bé ngay.

Bằng chứng Cochrane: kẹp rốn muộn giúp tăng nồng độ huyết sắc tố ở bé lúc mới sinh và giảm hơn một nửa nguy cơ thiếu sắt ở tháng 3-6 tuổi. Đánh đổi: nhóm kẹp rốn muộn có tỷ lệ cần chiếu đèn điều trị vàng da cao hơn một chút so với nhóm kẹp sớm — nên WHO lưu ý lợi ích của kẹp muộn vượt trội hơn nguy cơ này miễn là có sẵn điều kiện điều trị vàng da nếu cần.

## Khi nào không kẹp rốn muộn
Nếu bé cần hồi sức ngay (không thở/khóc), mẹ chảy máu nhiều hoặc không ổn định huyết động, hoặc có vấn đề với tuần hoàn nhau thai (nhau bong non, nhau tiền đạo chảy máu).

## Vì sao kẹp rốn muộn không mâu thuẫn với xử trí tích cực giai đoạn 3
Trước đây, xử trí tích cực giai đoạn 3 (xem bài riêng) từng gắn liền với kẹp rốn SỚM. Hướng dẫn hiện tại đã tách hai việc này ra: tiêm thuốc co hồi tử cung (oxytocin) sớm trong vòng 1 phút sau sinh, nhưng vẫn CHỜ kẹp rốn theo khuyến nghị ở trên — nghĩa là có thể vừa xử trí tích cực phòng băng huyết, vừa kẹp rốn muộn cho bé.

## Da kề da ngay sau sinh
WHO/UNICEF (Sáng kiến Bệnh viện thân thiện với trẻ) khuyến nghị cho bé da kề da với mẹ ngay và liên tục sau sinh, ít nhất đến sau cữ bú đầu tiên (thường khoảng 1 giờ). Theo Cochrane, bằng chứng mạnh nhất (chất lượng trung bình) là da kề da giúp tăng khả năng bú mẹ hoàn toàn và bú thành công ở cữ đầu; bằng chứng về điều hòa thân nhiệt và đường huyết yếu hơn (chất lượng thấp, và mức tăng thân nhiệt được ghi nhận là "không có ý nghĩa lâm sàng"). Các lợi ích khác như gắn kết mẹ-con, tiết oxytocin thường được nhắc đến nhưng chưa được đánh giá mức độ bằng chứng rõ trong các tổng quan hệ thống.`,
    category: "Chuẩn bị sinh",
    stage: "PREGNANCY",
    evidenceLevel: "STRONG",
    knowledgeType: scientific,
    sources: [sources.whoCordClamping, sources.acogCO814CordClamping, sources.figoCordClamping, sources.cochraneCordClamping, sources.cochraneSkinToSkin, sources.unicefBFISkinToSkin],
  },
  {
    slug: "xu-tri-tich-cuc-giai-doan-3-va-du-phong-bang-huyet-sau-sinh",
    title: "Xử trí tích cực giai đoạn 3 và dự phòng băng huyết sau sinh",
    summary: "Tiêm thuốc co hồi tử cung sau sinh giúp giảm nguy cơ mất máu ≥500ml, nhưng bằng chứng về giảm băng huyết nặng (≥1000ml) còn chưa chắc chắn; băng huyết sau sinh là nguyên nhân hàng đầu gây tử vong mẹ trên toàn cầu.",
    content: `## Xử trí tích cực giai đoạn 3 là gì
Gồm ba phần: tiêm thuốc co hồi tử cung (thường là oxytocin) trong vòng khoảng 1 phút sau sinh, kéo dây rốn có kiểm soát để hỗ trợ sổ nhau, và xoa đáy tử cung sau khi nhau đã sổ.

## Bằng chứng về hiệu quả — có đánh đổi
Theo Cochrane, xử trí tích cực có thể làm giảm nguy cơ mất máu từ 500ml trở lên (bằng chứng mức độ trung bình). Tuy nhiên, hiệu quả trong việc giảm băng huyết NẶNG (từ 1000ml trở lên) được Cochrane đánh giá là "chưa chắc chắn" — bằng chứng chất lượng rất thấp. Xử trí tích cực cũng đi kèm một số bất lợi: tăng huyết áp tâm trương sau sinh, buồn nôn/nôn, đau bụng sau sinh nhiều hơn, cần dùng thuốc giảm đau nhiều hơn. Cochrane kết luận nên cung cấp thông tin về cả lợi ích và bất lợi để sản phụ cùng tham gia quyết định, không khẳng định một phương pháp vượt trội tuyệt đối — đặc biệt ở nơi có nguồn lực y tế tốt, theo dõi sát và khả năng cấp cứu sẵn sàng.

## Định nghĩa băng huyết sau sinh
Theo WHO, băng huyết sau sinh thường được định nghĩa là mất máu từ 500ml trở lên trong 24 giờ đầu sau sinh thường, hoặc từ 1000ml trở lên sau mổ lấy thai. Đáng chú ý, WHO từng ghi nhận ngưỡng 500ml là một con số mang tính quy ước, "không phải lúc nào cũng có ý nghĩa lâm sàng rõ ràng", và hiện WHO đang trong quá trình xem xét lại định nghĩa này — nghĩa là con số hiện tại là chuẩn đang dùng, không phải một con số cố định vĩnh viễn.

## Vì sao dự phòng quan trọng
Băng huyết sau sinh là nguyên nhân hàng đầu gây tử vong mẹ trên toàn cầu, chiếm hơn 1/5 tổng số ca tử vong mẹ, với phần lớn xảy ra ở các khu vực có nguồn lực y tế hạn chế.

Lưu ý: Quyết định xử trí giai đoạn 3 theo cách nào nên được trao đổi trước với bác sĩ/hộ sinh, cân nhắc điều kiện cụ thể của cơ sở sinh.`,
    category: "Chuẩn bị sinh",
    stage: "PREGNANCY",
    evidenceLevel: "MODERATE",
    knowledgeType: scientific,
    sources: [sources.cochraneThirdStage, sources.postnatal],
  },
  {
    slug: "chi-so-apgar-y-nghia-va-hieu-lam-thuong-gap",
    title: "Chỉ số Apgar: ý nghĩa và những hiểu lầm thường gặp",
    summary: "Apgar là bảng điểm nhanh đánh giá tình trạng bé ở phút thứ 1 và thứ 5 sau sinh; điểm thấp lúc 1 phút mà cải thiện ở phút thứ 5 không đáng lo, và bản thân điểm Apgar KHÔNG dùng để dự đoán sức khỏe thần kinh lâu dài của bé.",
    content: `## Apgar là gì
Thang điểm đánh giá nhanh 5 dấu hiệu của bé ngay sau sinh: màu da, nhịp tim, phản xạ, trương lực cơ, và nhịp thở — mỗi mục chấm 0-2 điểm, tổng tối đa 10 điểm. Đo ở phút thứ 1 và phút thứ 5 sau sinh; nếu điểm dưới 7 ở phút thứ 5, có thể đo lại mỗi 5 phút đến phút thứ 20.

## Cách hiểu điểm số
Điểm 7-10 ở phút thứ 5: bình thường/yên tâm. Điểm 4-6: bất thường mức độ vừa. Điểm 0-3: thấp, cần theo dõi/hỗ trợ sát. Mục đích chính của Apgar là mô tả tình trạng bé tại MỘT thời điểm và theo dõi phản ứng của bé với các biện pháp hồi sức nếu cần, không phải một chẩn đoán.

## Hiểu lầm cần tránh
ACOG và AAP cùng nhấn mạnh rõ: chỉ số Apgar một mình KHÔNG được xem là bằng chứng của hoặc hậu quả của ngạt (thiếu oxy), KHÔNG dự đoán được tử vong hay kết cục thần kinh của từng bé cụ thể, và không nên dùng cho mục đích đó. Các nghiên cứu dân số học đã nhất quán cho thấy phần lớn trẻ có điểm Apgar thấp sẽ KHÔNG bị bại não. Điểm số cũng không nên bị hiểu sai khi bé đang được hồi sức tích cực (ví dụ thở oxy hỗ trợ) — điểm thấp trong lúc đó phản ánh một phần việc đang hồi sức, không hẳn là mức độ nặng cố hữu.

## Không nên làm gì với chỉ số này
Điểm Apgar không bao giờ được dùng để trì hoãn hoặc thay thế việc hồi sức cần thiết cho bé — việc hồi sức luôn được ưu tiên thực hiện ngay, độc lập với việc tính điểm.`,
    category: "Chuẩn bị sinh",
    stage: "PREGNANCY",
    evidenceLevel: "STRONG",
    knowledgeType: scientific,
    sources: [sources.acogApgarScore],
  },
  {
    slug: "tu-cung-co-hoi-va-dau-bung-sau-sinh",
    title: "Tử cung co hồi và đau bụng (afterpains) sau sinh",
    summary: "Tử cung co nhỏ dần về kích thước ban đầu trong khoảng 6 tuần; cơn đau bụng dưới giống đau bụng kinh khi cho bú là bình thường, do oxytocin giúp tử cung co hồi.",
    content: `## Tử cung co hồi là gì
Sau sinh, tử cung co nhỏ dần từ kích thước lúc mang thai về gần kích thước ban đầu, thường mất khoảng 6 tuần. Nhân viên y tế thường theo dõi độ co hồi qua sờ nắn đáy tử cung trong 24 giờ đầu sau sinh.

## Đau bụng sau sinh (afterpains)
Cảm giác co thắt giống đau bụng kinh, đôi khi giống cơn co chuyển dạ nhẹ, là bình thường và thường rõ hơn ở người đã từng sinh con trước đó. Cho con bú làm tăng cảm giác này vì động tác bú kích thích cơ thể tiết oxytocin — cùng loại hormone giúp tử cung co bóp mạnh hơn, đây là cách cơ thể giúp kiểm soát chảy máu sau sinh.

## Giảm đau an toàn
Ibuprofen và paracetamol đều được xem là lựa chọn phù hợp và an toàn khi đang cho con bú (lượng thuốc qua sữa mẹ rất thấp); nếu đau nhiều hơn, bác sĩ có thể cân nhắc thuốc giảm đau mạnh hơn trong thời gian ngắn.

## Khi nào cần khám
Nếu đau bụng ngày càng tăng thay vì giảm dần, kèm sốt, sản dịch có mùi hôi hoặc ra máu nhiều bất thường, đây có thể là dấu hiệu nhiễm trùng (xem thêm bài "Nhiễm trùng hậu sản") chứ không phải afterpains thông thường.`,
    category: "Hậu sản",
    stage: "POSTPARTUM",
    evidenceLevel: "MODERATE",
    knowledgeType: scientific,
    sources: [sources.nhsBodyAfterBirth, sources.postpartumPain, sources.postnatal],
  },
  {
    slug: "tao-bon-va-tri-sau-sinh-cach-xu-tri-an-toan",
    title: "Táo bón và trĩ sau sinh: cách xử trí an toàn",
    summary: "Táo bón và trĩ đều rất phổ biến sau sinh; ăn nhiều chất xơ, uống đủ nước và dùng thuốc làm mềm phân khi cần là hướng xử trí chuẩn, dù bằng chứng thử nghiệm đối chứng cho riêng nhóm sau sinh còn hạn chế.",
    content: `## Táo bón sau sinh
Rất phổ biến do thay đổi nội tiết, sợ đau vết khâu/trĩ khi rặn, tác dụng phụ của viên sắt, và giảm vận động/uống nước sau sinh. Hướng xử trí: ăn nhiều rau củ quả, ngũ cốc nguyên hạt, uống đủ nước; nếu không cải thiện, có thể hỏi bác sĩ/hộ sinh về thuốc làm mềm phân.

Lưu ý về bằng chứng: một tổng quan Cochrane tìm cách đánh giá các biện pháp điều trị táo bón sau sinh nhưng không tìm thấy nghiên cứu đối chứng nào đủ tiêu chuẩn đưa vào — nghĩa là lời khuyên trên dựa trên kinh nghiệm lâm sàng chung, chưa có bằng chứng thử nghiệm trực tiếp riêng cho giai đoạn sau sinh. Điều này không có nghĩa lời khuyên sai, chỉ là mức độ bằng chứng hạn chế hơn so với các chủ đề khác.

## Trĩ sau sinh
Cũng rất phổ biến, do rặn sinh và áp lực từ thai kỳ lên tĩnh mạch vùng chậu. Thường tự hết trong vài ngày đến vài tuần. Cách giảm khó chịu: chườm gạc thấm nước cây phỉ (witch hazel), ngâm nước ấm (sitz bath), dùng ibuprofen, tránh rặn/căng thẳng khi đi vệ sinh, ngồi trên gối mềm nếu cần.

## Khi nào cần khám
Nếu cảm thấy rất khó chịu, trĩ không cải thiện, chảy máu nhiều, hoặc táo bón kéo dài không đáp ứng với các biện pháp trên — nên hỏi ý kiến hộ sinh/bác sĩ, có thể cần kem/thuốc theo toa.`,
    category: "Hậu sản",
    stage: "POSTPARTUM",
    evidenceLevel: "MODERATE",
    knowledgeType: scientific,
    sources: [sources.nhsBodyAfterBirth, sources.postpartumPain, sources.cochranePostpartumConstipation],
  },
  {
    slug: "ve-sinh-tam-va-van-dong-sau-sinh",
    title: "Vệ sinh, tắm và vận động sau sinh",
    summary: "Tắm bằng nước ấm hằng ngày là đủ để giữ vệ sinh; nên đợi hết sản dịch khoảng 7 ngày trước khi bơi; vận động nhẹ có thể bắt đầu sớm nếu sinh thường không biến chứng, còn sau mổ lấy thai cần đợi lâu hơn và theo cảm giác cơ thể.",
    content: `## Vệ sinh hằng ngày
Tắm bằng nước ấm mỗi ngày, lau khô nhẹ nhàng là đủ, không cần sản phẩm vệ sinh đặc biệt.

## Khi nào có thể bơi/tắm bồn
NHS khuyến nghị đợi khoảng 7 ngày sau khi sản dịch đã hết hẳn mới nên bơi hoặc ngâm mình trong nước dùng chung (hồ bơi, bồn tắm công cộng), để giảm nguy cơ nhiễm trùng.

## Vận động sau sinh thường không biến chứng
Có thể bắt đầu vận động nhẹ (đi bộ, giãn cơ nhẹ, bài tập sàn chậu) ngay khi cảm thấy có thể; nên đợi đến sau lần khám 6 tuần mới tập các bài cường độ cao (chạy, aerobic).

## Vận động sau mổ lấy thai hoặc sinh có biến chứng
Thời gian hồi phục lâu hơn. NHS liệt kê rõ: lái xe, tập thể dục, bê vác vật nặng hơn cân nặng của bé, và quan hệ tình dục đều nên đợi — thường khoảng 6 tuần, nhưng thời điểm chính xác nên dựa vào cảm giác cơ thể (không đau, thấy thoải mái) hơn là một con số cứng nhắc; nên hỏi hộ sinh/bác sĩ nếu chưa chắc chắn. Đi bộ nhẹ hằng ngày vẫn được khuyến khích trong lúc chờ hồi phục.

## Tách cơ bụng (diastasis recti)
Khoảng cách giữa hai bó cơ bụng thẳng thường tự thu hẹp lại, phần lớn cải thiện rõ khi bé được khoảng 8 tuần tuổi; nếu khoảng cách vẫn rõ rệt sau mốc này, nên hỏi bác sĩ.

## Một khoảng trống trong hướng dẫn chính thức
Hiện chưa tìm thấy hướng dẫn chính thức nào từ NHS/ACOG cụ thể về việc lái xe khi thiếu ngủ trong giai đoạn sau sinh — dù nghiên cứu học thuật cho thấy đây là nguy cơ thực sự (nhiều phụ huynh từng lái xe trong tình trạng rất mệt). Nguyên tắc chung về an toàn giao thông khi buồn ngủ vẫn nên được áp dụng dù không có khuyến cáo riêng cho giai đoạn sau sinh.`,
    category: "Hậu sản",
    stage: "POSTPARTUM",
    evidenceLevel: "MODERATE",
    knowledgeType: scientific,
    sources: [sources.nhsBodyAfterBirth, sources.nhsKeepingFit, sources.nhsPostPregnancyBody, sources.nhsCesareanRecovery, sources.acogExercisePostpartum],
  },
  {
    slug: "quan-he-tinh-duc-sau-sinh-khi-nao-va-nhung-dieu-can-biet",
    title: "Quan hệ tình dục sau sinh: khi nào và những điều cần biết",
    summary: "Không có một mốc thời gian bắt buộc — nên đợi đến khi cảm thấy thoải mái, hết sản dịch và vết thương đã lành; khô âm đạo (nhất là khi đang cho con bú) là nguyên nhân phổ biến gây khó chịu, và cần tránh thai ngay từ lần quan hệ đầu tiên sau sinh.",
    content: `## Không có mốc thời gian cố định
NHS nêu rõ: "không có quy tắc" về thời điểm bắt buộc phải quan hệ trở lại — nên dựa vào cảm giác thoải mái và sản dịch đã ngừng, không cần vội. Tại Mỹ, mốc khám 6 tuần sau sinh thường được xem là điểm mốc quy ước để bác sĩ đánh giá vết thương đã lành, nhưng đây là mốc tham khảo, không phải quy định cứng — trên thực tế, nhiều người có quan hệ trở lại trước mốc này.

## Vì sao có thể đau/khó chịu
Nồng độ estrogen giảm sau sinh (giảm nhiều hơn và kéo dài hơn nếu đang cho con bú) có thể gây khô âm đạo; vết khâu tầng sinh môn hoặc vết mổ chưa lành hẳn cũng có thể gây khó chịu. Có thể dùng gel bôi trơn mua tại nhà thuốc; nên thử tự chạm nhẹ trước để yên tâm trước khi quan hệ.

## Cần tránh thai ngay từ lần đầu
Có thể mang thai trở lại sớm nhất khoảng 3 tuần sau sinh — kể cả khi đang cho con bú và CHƯA có kinh trở lại. Rụng trứng luôn xảy ra TRƯỚC kỳ kinh đầu tiên khoảng 2 tuần, nghĩa là có thể mang thai mà chưa hề thấy kinh nguyệt trở lại — vì vậy cần dùng biện pháp tránh thai ngay từ lần quan hệ đầu tiên nếu chưa muốn có thai (xem thêm bài "Tránh thai sau sinh").

## Bài tập sàn chậu
Có bằng chứng Cochrane cho thấy tập cơ sàn chậu (Kegel) TRONG lúc mang thai giúp giảm nguy cơ tiểu không tự chủ sau sinh ở người chưa có triệu chứng — nhưng chưa có bằng chứng cho thấy bắt đầu tập SAU sinh giúp cải thiện tình trạng tiểu không tự chủ đã có sẵn. Vẫn có thể tập vì lợi ích tổng thể, nhưng không nên kỳ vọng đây là cách "chữa" chắc chắn nếu đã có triệu chứng.`,
    category: "Hậu sản",
    stage: "POSTPARTUM",
    evidenceLevel: "MODERATE",
    knowledgeType: scientific,
    sources: [sources.nhsSexContraceptionAfterBirth, sources.acogPostpartumBirthControl, sources.cochranePelvicFloor],
  },
  {
    slug: "tranh-thai-sau-sinh-va-phuong-phap-vo-kinh-cho-con-bu-lam",
    title: "Tránh thai sau sinh và phương pháp vô kinh cho con bú (LAM)",
    summary: "LAM chỉ hiệu quả khi đủ 3 điều kiện: bú mẹ gần như hoàn toàn, chưa có kinh trở lại, và bé dưới 6 tháng tuổi; đặt vòng tránh thai ngay sau sổ nhau (trong 10 phút) là an toàn với vòng đồng, còn thời điểm đặt IUD nói chung ảnh hưởng đến tỷ lệ tuột vòng.",
    content: `## Phương pháp vô kinh cho con bú (LAM)
Đây là biện pháp tránh thai tự nhiên chỉ hiệu quả khi đủ CẢ BA điều kiện: (1) bú mẹ gần như hoàn toàn, không để khoảng cách giữa các cữ bú quá 4 giờ ban ngày/6 giờ ban đêm; (2) chưa có kinh nguyệt trở lại; (3) bé dưới 6 tháng tuổi. Nếu một trong ba điều kiện không còn đúng, LAM không còn được xem là đáng tin cậy và cần dùng thêm biện pháp khác.

Về hiệu quả: các tài liệu tư vấn của WHO/CDC thường trích dẫn hiệu quả trên 98%, dựa trên các nghiên cứu quan sát đa trung tâm trước đây. Tuy nhiên, một tổng quan Cochrane khi xem xét lại các nghiên cứu có đối chứng cho kết quả thận trọng hơn: không thấy khác biệt rõ giữa nhóm dùng LAM có tư vấn và nhóm chỉ bú mẹ vô kinh hoàn toàn không có tư vấn riêng — nghĩa là bằng chứng RCT chưa mạnh bằng các số liệu quan sát vẫn hay được trích dẫn. Không phải là bằng chứng LAM kém hiệu quả hơn, mà là mức độ chắc chắn của bằng chứng khác nhau tùy loại nghiên cứu.

## Đặt vòng tránh thai (IUD) sau sinh
Có thể đặt vòng đồng ngay trong 10 phút sau khi sổ nhau (an toàn, không hạn chế); vòng nội tiết đặt cùng thời điểm được xem là lợi ích thường vượt trội nguy cơ. Từ 10 phút đến dưới 4 tuần sau sinh, cả hai loại vòng đều cần cân nhắc kỹ hơn; từ 4 tuần trở đi, không còn hạn chế đặc biệt. Theo Cochrane, đặt vòng ngay sau sinh giúp tăng tỷ lệ phụ nữ thực sự bắt đầu dùng biện pháp tránh thai, nhưng cũng có tỷ lệ tuột vòng trong 6 tháng đầu cao hơn đáng kể so với đặt muộn hơn — một sự đánh đổi cần biết trước khi chọn.

## Các biện pháp khác
Thuốc tránh thai chỉ chứa progestin thường phù hợp ngay sau sinh; thuốc kết hợp có estrogen cần thận trọng hơn trong vài tuần đầu do nguy cơ huyết khối giai đoạn hậu sản (xem thêm bài về huyết khối tĩnh mạch sau sinh).`,
    category: "Hậu sản",
    stage: "POSTPARTUM",
    evidenceLevel: "MODERATE",
    knowledgeType: scientific,
    sources: [sources.cdcLAM, sources.cochraneLAM, sources.cdcIUDTiming, sources.cochraneIUDTiming],
  },
  {
    slug: "kinh-nguyet-tro-lai-va-khoang-cach-giua-cac-lan-sinh",
    title: "Kinh nguyệt trở lại và khoảng cách khuyến nghị giữa các lần sinh",
    summary: "Người không cho con bú có thể có kinh trở lại sớm nhất vài tuần sau sinh; WHO khuyến nghị chờ ít nhất 24 tháng trước khi mang thai lại, trong khi ACOG (Mỹ) đưa ra khung ngắn hơn — đây là khác biệt guideline thật sự, không phải sai sót.",
    content: `## Kinh nguyệt trở lại
Với người không cho con bú, kinh nguyệt có thể trở lại trong vòng vài tuần đến khoảng 3 tháng sau sinh (số liệu cụ thể hơi khác nhau giữa các nguồn). Với người cho con bú, thời gian có thể lâu hơn nhiều — thường được nói là "khoảng 6 tháng" nhưng thực tế dao động rất rộng tùy tần suất/thời gian bú.

Quan trọng: rụng trứng luôn xảy ra TRƯỚC kỳ kinh khoảng 2 tuần — nghĩa là có thể mang thai trước khi kinh nguyệt trở lại lần đầu, dù đang cho con bú và chưa thấy kinh.

## Khoảng cách khuyến nghị giữa các lần sinh — một khác biệt guideline thật sự
- WHO khuyến nghị chờ ít nhất 24 tháng sau một lần sinh sống trước khi mang thai lại (tức khoảng cách giữa hai lần sinh tối thiểu 33 tháng), và ít nhất 6 tháng sau sảy thai/phá thai.
- ACOG (Mỹ) đưa ra khung linh hoạt và ngắn hơn: nên tránh khoảng cách dưới 6 tháng, cân nhắc kỹ nguy cơ-lợi ích nếu dưới 18 tháng, và xem khoảng 18 tháng đến 5 năm là "khoảng tối ưu".

Đây là hai khuyến nghị khác nhau thật sự từ hai tổ chức uy tín, không phải một bên lỗi thời — có thể phản ánh sự khác biệt về bối cảnh dân số/nguồn lực y tế toàn cầu (WHO) so với cách tiếp cận cá thể hóa hơn tại Mỹ (ACOG). Quyết định thời điểm mang thai lại nên được bàn cùng bác sĩ sản khoa dựa trên tình trạng sức khỏe cụ thể (như vết mổ cũ, cách sinh lần trước).`,
    category: "Hậu sản",
    stage: "POSTPARTUM",
    evidenceLevel: "MODERATE",
    knowledgeType: scientific,
    sources: [sources.acogPostpartumBirthControl, sources.whoBirthSpacing, sources.acogCO736],
  },
  {
    slug: "phan-biet-baby-blues-tram-cam-va-lo-au-sau-sinh",
    title: "Phân biệt baby blues, trầm cảm và lo âu sau sinh",
    summary: "Baby blues bắt đầu 2-3 ngày sau sinh và tự hết trong 2 tuần; nếu buồn/lo âu kéo dài quá 2 tuần hoặc ảnh hưởng đến khả năng chăm sóc bản thân/bé, đây không còn là baby blues mà cần được đánh giá — khoảng 1/7-1/8 phụ nữ trải qua trầm cảm sau sinh, và lo âu sau sinh cũng phổ biến tương đương, thường đi kèm nhau.",
    content: `## Baby blues
Cảm giác dễ khóc, lo âu nhẹ, cáu gắt xuất hiện khoảng 2-3 ngày sau sinh, đạt đỉnh trong tuần đầu, và tự hết trong vòng 2 tuần mà không cần điều trị — chỉ cần nghỉ ngơi và hỗ trợ. Đây không phải một chẩn đoán y khoa chính thức, không yêu cầu số lượng triệu chứng cụ thể như trầm cảm. Nếu triệu chứng kéo dài quá 2 tuần, cần được đánh giá thêm.

## Trầm cảm sau sinh
Khoảng 1/7 đến 1/8 phụ nữ trải qua trầm cảm chu sinh (con số hơi khác nhau giữa các nguồn tùy cách đo lường). Về mặt kỹ thuật, tiêu chuẩn chẩn đoán chính thức (DSM-5) chỉ tính "khởi phát quanh sinh" nếu triệu chứng bắt đầu trong thai kỳ hoặc trong 4 tuần đầu sau sinh — nhưng CDC và phần lớn chuyên gia lâm sàng mở rộng khung theo dõi đến 12 tháng sau sinh trong thực hành, vì trầm cảm có thể khởi phát muộn hơn nhiều so với 4 tuần. Một nghiên cứu của CDC cho thấy hơn một nửa số phụ nữ có triệu chứng ở tháng 9-10 KHÔNG hề có triệu chứng ở giai đoạn 2-6 tháng trước đó — nghĩa là trầm cảm sau sinh có thể xuất hiện mới, không chỉ là kéo dài từ sớm.

Điểm phân biệt quan trọng nhất với baby blues: triệu chứng kéo dài quá 2 tuần VÀ gây ảnh hưởng rõ rệt đến khả năng sinh hoạt, chăm sóc bản thân hoặc chăm bé — đây là yếu tố "suy giảm chức năng" mà baby blues không có.

## Lo âu sau sinh
Không có chẩn đoán riêng "lo âu sau sinh" trong DSM-5 — được xếp vào các nhóm lo âu đã có sẵn (lo âu lan tỏa, hoảng loạn, ám ảnh cưỡng chế...). Dù vậy, đây là tình trạng phổ biến, với tỷ lệ ước tính khoảng 17-20% phụ nữ sau sinh theo một số nghiên cứu dựa trên dân số. Lo âu và trầm cảm sau sinh thường đi kèm nhau: khoảng 1/4-1/3 người có lo âu sau sinh cũng có trầm cảm đi kèm, và ngược lại.

## Đây là những tình trạng có thể điều trị, không phải lỗi của mẹ
Cả ba tình trạng trên đều được các hướng dẫn y khoa nhấn mạnh là phổ biến, có thể điều trị hiệu quả, và không phải do mẹ "yếu đuối" hay "làm sai điều gì". Liệu pháp tâm lý (như CBT) thường là lựa chọn đầu tay cho mức độ nhẹ-vừa; thuốc (thường là nhóm SSRI) cũng là lựa chọn đầu tay khi cần và nhìn chung không cần ngừng cho con bú chỉ vì đang dùng thuốc — quyết định cụ thể nên có bác sĩ tư vấn theo từng trường hợp.`,
    category: "Tinh thần của mẹ",
    stage: "POSTPARTUM",
    evidenceLevel: "STRONG",
    knowledgeType: scientific,
    sources: [sources.acogCPG4MentalHealth, sources.acogCPG5MentalHealth, sources.nhsPostnatalDepression, sources.cdcPPDPrevalence, sources.cdcPPDTiming],
  },
  {
    slug: "sang-loc-tram-cam-sau-sinh-epds-va-khi-nao-thuc-hien",
    title: "Sàng lọc trầm cảm sau sinh: EPDS và khi nào cần thực hiện",
    summary: "ACOG và USPSTF khuyến nghị sàng lọc trầm cảm/lo âu tại nhiều thời điểm: lần khám thai đầu, cuối thai kỳ, và các lần khám sau sinh — không chỉ một lần; thang điểm EPDS (10 câu hỏi) là công cụ phổ biến nhất, mất chưa đến 5 phút.",
    content: `## Sàng lọc nhiều lần, không chỉ một lần
ACOG khuyến nghị mọi người nên được sàng lọc trầm cảm và lo âu bằng công cụ đã được kiểm chứng, thực hiện ở NHIỀU thời điểm: lần khám thai đầu tiên, lại một lần vào cuối thai kỳ, và ở các lần khám sau sinh — vì thời điểm khởi phát trầm cảm chu sinh phân bố khá đều giữa trước khi mang thai, trong thai kỳ và sau sinh, nên sàng lọc một lần duy nhất dễ bỏ sót. USPSTF (Mỹ) cũng khuyến nghị sàng lọc trầm cảm cho người mang thai và sau sinh ở mức khuyến cáo B.

## Thang điểm EPDS (Edinburgh Postnatal Depression Scale)
Bảng hỏi tự điền gồm 10 câu, mất dưới 5 phút, có cả câu hỏi liên quan lo âu và một câu hỏi về ý nghĩ tự làm hại bản thân. Điểm từ 10-14: mức nhẹ; 15-19: mức vừa; trên 19: mức nặng (và có thể gợi ý cần đánh giá thêm nguy cơ rối loạn lưỡng cực). Đây không phải công cụ chẩn đoán cuối cùng mà là công cụ sàng lọc — điểm cao cần được đánh giá lâm sàng thêm để xác nhận.

## PHQ-9 — công cụ thay thế
PHQ-9 (9 câu hỏi) cũng được khuyến nghị tương đương EPDS, với độ chính xác gần như nhau theo phân tích tổng hợp nhiều nghiên cứu.

## Sàng lọc dự phòng cho người có nguy cơ cao
USPSTF cũng khuyến nghị (mức B) giới thiệu người có nguy cơ cao bị trầm cảm chu sinh đến các liệu pháp tư vấn dự phòng (như CBT), với bằng chứng cho thấy giảm khoảng 39% khả năng mắc trầm cảm chu sinh ở nhóm này. Tuy nhiên, USPSTF cũng lưu ý: hiện chưa có công cụ chính xác để xác định "ai thuộc nhóm nguy cơ cao" — việc này vẫn chủ yếu dựa vào đánh giá lâm sàng và các yếu tố nguy cơ đã biết (tiền sử trầm cảm/lo âu, thiếu hỗ trợ, sang chấn...), không phải một bài test riêng.

## Sàng lọc ý nghĩ tự làm hại bản thân
USPSTF hiện đánh giá bằng chứng về sàng lọc nguy cơ tự sát riêng biệt ở nhóm này là "chưa đủ" để đưa ra khuyến cáo — không có nghĩa là không cần hỏi, mà là chưa có đủ nghiên cứu để khuyến nghị một công cụ sàng lọc chuẩn hóa riêng cho mục đích này.`,
    category: "Tinh thần của mẹ",
    stage: "POSTPARTUM",
    evidenceLevel: "STRONG",
    knowledgeType: scientific,
    sources: [sources.acogCPG4MentalHealth, sources.uspstfDepressionScreening, sources.uspstfPerinatalPrevention],
  },
  {
    slug: "loan-than-sau-sinh-dau-hieu-cap-cuu-tam-than",
    title: "Loạn thần sau sinh: dấu hiệu cấp cứu tâm thần",
    summary: "Hiếm gặp (khoảng 1-2/1000 ca sinh) nhưng là cấp cứu tâm thần thực sự, thường khởi phát rất nhanh trong 2 tuần đầu sau sinh; có tiền sử rối loạn lưỡng cực hoặc từng bị loạn thần sau sinh làm tăng nguy cơ rõ rệt — cần đưa đi cấp cứu ngay, không chờ đợi.",
    content: `## Khác gì với baby blues và trầm cảm sau sinh
Loạn thần sau sinh là một bệnh tâm thần nghiêm trọng, khởi phát ĐỘT NGỘT — thường trong vòng 2 tuần đầu sau sinh (đôi khi chỉ vài giờ-ngày sau sinh, hiếm khi muộn hơn vài tuần) — hoàn toàn khác về mức độ so với baby blues hay trầm cảm sau sinh thông thường.

## Triệu chứng
Ảo giác (nghe/nhìn/cảm nhận điều không có thật), hoang tưởng, hưng phấn bất thường (nói nhiều, bồn chồn, mất ức chế hành vi), lú lẫn nghiêm trọng, thay đổi cảm xúc thất thường/nhanh, mất ngủ, có những suy nghĩ ám ảnh bất thường về em bé.

## Mức độ phổ biến
Khoảng 1-2 trên 1000 ca sinh — hiếm nhưng không phải cực hiếm.

## Yếu tố nguy cơ rõ rệt nhất
Tiền sử bản thân hoặc gia đình mắc rối loạn lưỡng cực, hoặc từng bị loạn thần sau sinh ở lần sinh trước — đây là các yếu tố làm tăng nguy cơ RÕ RỆT (các nghiên cứu đưa ra tỷ lệ khác nhau khá nhiều, từ khoảng 1/5 đến cao hơn tùy nghiên cứu, nên xem đây là "tăng đáng kể" hơn là một con số phần trăm chính xác duy nhất).

## Vì sao là cấp cứu
Đây được xem là cấp cứu sản khoa VÀ tâm thần vì tình trạng có thể xấu đi rất nhanh, tăng nguy cơ cho cả mẹ (tự hại) và bé (nguy cơ tổn hại do hoang tưởng/ảo giác chi phối hành vi). Thường cần nhập viện điều trị.

## Gia đình cần làm gì
Nếu nghi ngờ người thân có dấu hiệu trên, cần tìm trợ giúp y tế khẩn cấp NGAY — không chờ đến lịch khám thường quy. Người bệnh có thể không nhận ra mình đang không ổn, nên người xung quanh cần chủ động hành động thay họ: gọi cấp cứu hoặc đưa đến cơ sở y tế gần nhất ngay nếu có nguy cơ gây hại cho bản thân hoặc em bé.`,
    category: "Tinh thần của mẹ",
    stage: "POSTPARTUM",
    evidenceLevel: "STRONG",
    knowledgeType: scientific,
    sources: [sources.nhsPostpartumPsychosis, sources.bmcPsychiatryPsychosisPrevalence, sources.acogCPG4MentalHealth],
  },
  {
    slug: "huyet-khoi-tinh-mach-va-nhiem-trung-hau-san-dau-hieu-cap-cuu",
    title: "Huyết khối tĩnh mạch và nhiễm trùng hậu sản: dấu hiệu cấp cứu",
    summary: "Nguy cơ huyết khối tĩnh mạch tăng cao sau sinh (NHS/RCOG: 6 tuần; CDC: tới 3 tháng); khó thở/đau ngực đột ngột là cấp cứu. Sốt sau sinh luôn cần được đánh giá — khoảng 1/5-1/4 ca nhiễm trùng nặng (sepsis) sau sinh có thể KHÔNG kèm sốt.",
    content: `## Vì sao nguy cơ huyết khối tăng sau sinh
Thai kỳ và giai đoạn hậu sản làm máu dễ đông hơn (cơ chế sinh lý tự nhiên để hạn chế mất máu khi sinh), cộng với việc ít vận động hơn — làm tăng nguy cơ hình thành cục máu đông ở tĩnh mạch chân (huyết khối tĩnh mạch sâu - DVT), có thể di chuyển lên phổi (thuyên tắc phổi - PE), là tình trạng đe dọa tính mạng.

Về thời gian nguy cơ tăng cao kéo dài bao lâu: đây là điểm các nguồn đưa ra khác nhau — NHS và RCOG (Anh) nói khoảng 6 tuần sau sinh, trong khi CDC (Mỹ) nói nguy cơ tăng cao có thể kéo dài tới 3 tháng sau sinh. Nên hiểu đây là khoảng vài tuần đến khoảng 3 tháng, không phải một mốc cứng duy nhất.

## Dấu hiệu huyết khối tĩnh mạch sâu (DVT)
Đau, sưng, nóng, đỏ ở MỘT bên chân (hiếm khi cả hai chân), thường ở bắp chân hoặc đùi; có thể đau rõ hơn khi đứng/đi lại.

## Dấu hiệu thuyên tắc phổi (PE) — cấp cứu ngay
Khó thở đột ngột, đau ngực, tim đập nhanh/không đều, ho ra máu, hoặc cảm thấy rất không khỏe/ngất xỉu. Gọi cấp cứu ngay nếu có các dấu hiệu này.

## Yếu tố nguy cơ
Mổ lấy thai, béo phì, ít vận động kéo dài, tiền sử huyết khối, hút thuốc, tuổi trên 35, mang đa thai.

## Phòng ngừa
Vận động sớm sau sinh, uống đủ nước, tất áp lực y khoa; với người nguy cơ cao, có thể cần tiêm thuốc chống đông dự phòng theo chỉ định bác sĩ.

## Nhiễm trùng tử cung (viêm nội mạc tử cung) và sốt sau sinh
Nhiễm trùng tử cung phổ biến hơn nhiều sau mổ lấy thai so với sinh thường (một số nguồn ước tính cao hơn gấp nhiều lần, dù các con số phần trăm cụ thể hơi khác nhau giữa các tài liệu). Triệu chứng: sốt, tử cung đau khi ấn, sản dịch hôi hoặc ra máu bất thường, thường xuất hiện trong vài ngày đầu sau sinh. Sốt sau sinh (từ 38°C trở lên) LUÔN cần được đánh giá y tế — không tự cho là "chỉ hơi mệt".

## Nhiễm trùng huyết (sepsis) — dấu hiệu cấp cứu cần nhớ
Đây là phản ứng viêm toàn thân nguy hiểm với nhiễm trùng, có thể diễn tiến rất nhanh. Theo chiến dịch "Urgent Maternal Warning Signs" của CDC, các dấu hiệu cần cấp cứu ngay (áp dụng tới 1 năm sau sinh) gồm: sốt từ 38°C trở lên, đau đầu dữ dội không giảm, khó thở, đau ngực/tim đập nhanh, đau bụng dữ dội không dứt, chảy máu âm đạo nhiều hoặc rỉ dịch bất thường, sưng nề tay/mặt đột ngột, mệt lả bất thường, hoặc đau/sưng/đỏ ở chân.

Điểm quan trọng cần biết: khoảng 20-25% ca nhiễm trùng huyết sau sinh nặng — kể cả những ca tử vong — KHÔNG hề có sốt. Vì vậy, không nên chỉ dựa vào "không sốt" để yên tâm nếu có các dấu hiệu khác như tim đập rất nhanh, thở gấp, đau dữ dội hoặc cảm thấy rất không ổn.

## Vết mổ/vết khâu trở nặng thành nhiễm trùng toàn thân
Ngoài các dấu hiệu nhiễm trùng tại chỗ (đỏ, sưng, chảy dịch) đã biết, cần cảnh giác khi vùng đỏ LAN RỘNG thay vì khu trú, kèm sốt, tim đập nhanh, hoặc cảm giác rất không khỏe toàn thân — đây là dấu hiệu nhiễm trùng có thể đang lan rộng, cần được khám ngay trong ngày, không chờ đợi.`,
    category: "Dấu hiệu nguy hiểm",
    stage: "POSTPARTUM",
    evidenceLevel: "STRONG",
    knowledgeType: scientific,
    sources: [sources.rcogVTE, sources.nhsDVTPregnancy, sources.cdcVTEToolkit, sources.cdcHearHer, sources.merckEndometritis, sources.pmcSepsisReview, sources.cdcSSIBasics],
  },
  {
    slug: "giac-ngu-tre-1-6-thang-va-su-that-ve-sleep-regression",
    title: "Giấc ngủ trẻ 1–6 tháng và sự thật về \"sleep regression 4 tháng\"",
    summary: "\"Sleep regression 4 tháng\" không phải thuật ngữ y khoa chính thức — AAP/NHS không dùng từ này; hiện tượng thức giấc nhiều hơn ở giai đoạn này có thật (do cấu trúc giấc ngủ trưởng thành dần) nhưng \"ngủ xuyên đêm\" trong nghiên cứu thực ra chỉ nghĩa là một mạch ngủ liên tục 6 giờ.",
    content: `## Giấc ngủ thay đổi thế nào trong giai đoạn này
Tổng thời gian ngủ giảm nhẹ (khoảng 14-17 giờ/ngày ở 0-3 tháng xuống khoảng 12-16 giờ/ngày ở 4-11 tháng theo khuyến nghị WHO), nhưng thay đổi rõ nhất là cách ngủ được "gom" lại: mạch ngủ dài nhất ban đêm kéo dài dần, và tần suất thức giấc ban đêm giảm dần từ khoảng 3 lần xuống khoảng 2 lần/đêm trong giai đoạn 4 tháng đầu theo một nghiên cứu tổng hợp gần đây.

## "Sleep regression 4 tháng" — không phải thuật ngữ chính thức
Đây là cụm từ phổ biến trong cộng đồng phụ huynh và các trang thương mại, nhưng KHÔNG xuất hiện trong tài liệu của AAP, NHS hay NICHD. Hiện tượng đứng sau cụm từ này có thật: khoảng 3-4 tháng tuổi, cấu trúc giấc ngủ của bé bắt đầu chuyển dần giống người lớn hơn (các chu kỳ ngủ ngắn khoảng 50-60 phút với những lần tỉnh giấc ngắn giữa chu kỳ), khiến bé có vẻ thức giấc nhiều hơn trước — đây là một bước phát triển bình thường của não bộ, không phải dấu hiệu có vấn đề.

## "Ngủ xuyên đêm" nghĩa là gì trong nghiên cứu — có thể khác điều bạn nghĩ
Một nghiên cứu công bố trên tạp chí Pediatrics (2018, hơn 300 trẻ) định nghĩa "ngủ xuyên đêm" chỉ là MỘT MẠCH NGỦ LIÊN TỤC 6 GIỜ — không phải nguyên đêm 10-12 giờ như nhiều người nghĩ. Theo định nghĩa này, khoảng 38% trẻ 6 tháng và 28% trẻ 12 tháng VẪN CHƯA đạt được mạch 6 giờ liên tục — và nghiên cứu này không tìm thấy liên quan giữa việc thức giấc nhiều với vấn đề phát triển hay tâm trạng của mẹ. AAP cũng nêu rõ: "một bé ngủ tốt là bé thức giấc thường xuyên nhưng có thể tự ngủ lại, không phải bé ngủ liền 10 tiếng không dậy" — thức giấc thường xuyên còn được xem là một cơ chế bảo vệ giúp bé tự đánh thức nếu gặp vấn đề về hô hấp.

## Về việc "luyện ngủ" (sleep training)
Các phương pháp như để bé tự ngủ lại có kiểm soát (graduated extinction) đã được nghiên cứu chủ yếu ở trẻ TỪ 6 THÁNG TRỞ LÊN — nghiên cứu đối chứng ở nhóm 6-16 tháng cho thấy các phương pháp này an toàn, không ảnh hưởng đến gắn kết mẹ-con hay cảm xúc của trẻ khi theo dõi lại sau 12 tháng. Với trẻ DƯỚI 6 tháng, hiện gần như CHƯA có bằng chứng thử nghiệm nào (cả ủng hộ lẫn phản đối) — các tổng quan hệ thống chủ động liệt kê đây là một khoảng trống nghiên cứu, không phải một vùng "ít nghiên cứu nhưng chắc vẫn ổn".`,
    category: "Giấc ngủ",
    stage: "INFANT_1_3_MONTHS",
    minimumAgeDays: 29,
    maximumAgeDays: 182,
    evidenceLevel: "MODERATE",
    knowledgeType: scientific,
    sources: [sources.frontiersSleepMaturation, sources.whoSleepGuideline, sources.aapSleepingThroughNight, sources.pennestriSleepStudy, sources.gradisarSleepTraining, sources.aafpSleepTraining],
  },
  {
    slug: "thi-giac-cua-tre-1-6-thang-mau-sac-phoi-hop-mat-tay",
    title: "Thị giác của trẻ 1–6 tháng: nhìn màu, phối hợp mắt-tay và các hiện tượng bình thường",
    summary: "Mắt lác/nhìn lệch thoáng qua thường hết trong khoảng 2-4 tháng; khả năng nhìn màu sắc và phối hợp mắt-tay để với đồ vật phát triển rõ rệt khoảng tháng thứ 4-5.",
    content: `## Mắt lác thoáng qua nên hết dần trong giai đoạn này
Mắt "lang thang"/lệch ngẫu nhiên ở trẻ sơ sinh thường giảm dần và hết trong khoảng 2-3 tháng tuổi. Tuy nhiên, nếu mắt vẫn lệch/lác thường xuyên và rõ rệt SAU 4 THÁNG TUỔI, đây không còn được xem là bình thường và cần được khám — hai mốc "2-3 tháng nên hết" và "4 tháng là ngưỡng cần khám" đều đến từ tài liệu của AAP, mô tả hai khía cạnh hơi khác nhau (kỳ vọng phát triển thông thường vs. ngưỡng cần quan tâm lâm sàng).

## Nhìn màu sắc và phối hợp mắt-tay
Khả năng phân biệt màu sắc và các sắc độ rõ rệt hơn khoảng tháng thứ 4-5 (các nguồn đưa mốc hơi khác nhau trong khoảng này). Cùng giai đoạn này, bé bắt đầu dùng mắt để phát hiện đồ vật gần và với/nắm lấy — nền tảng cho phối hợp mắt-tay sau này.

## Nhận diện chiều sâu
Khả năng phân biệt vật thể dựa trên thông tin thị giác (bước đầu của cảm nhận chiều sâu/không gian ba chiều) được mô tả rõ hơn khoảng tháng thứ 5-6.

## Các hiện tượng cần khám ngay (nhắc lại, xem thêm bài về mắt ở giai đoạn sơ sinh)
Đồng tử màu trắng/xám thay vì đỏ khi có đèn flash, mắt rung giật bất thường, chảy mủ/ghèn kèm sưng đỏ, hoặc một mắt lệch cố định không đổi sau 4 tháng tuổi — cần được khám sớm.`,
    category: "Phát triển",
    stage: "INFANT_1_3_MONTHS",
    minimumAgeDays: 29,
    maximumAgeDays: 182,
    evidenceLevel: "MODERATE",
    knowledgeType: scientific,
    sources: [sources.visionAAP, sources.visionWarningAAP, sources.aaoVisionDevelopment],
  },
  {
    slug: "moc-phat-trien-cdc-2-4-6-thang-day-du",
    title: "Mốc phát triển đầy đủ theo CDC ở 2, 4 và 6 tháng tuổi",
    summary: "CDC đã cập nhật bảng mốc phát triển năm 2021-2022 và không còn liệt kê \"dấu hiệu cảnh báo\" riêng theo từng tháng — thay vào đó khuyến khích cha mẹ trao đổi cởi mở với bác sĩ về bất kỳ điều gì khiến mình lo lắng.",
    content: `## Mốc 2 tháng (theo CDC)
- Xã hội-cảm xúc: bình tĩnh lại khi được nói chuyện/bế lên; nhìn vào mặt người lớn; có vẻ vui khi thấy người quen đến gần; cười khi được nói chuyện/cười với bé.
- Ngôn ngữ-giao tiếp: phát ra âm thanh khác tiếng khóc; phản ứng với tiếng động lớn.
- Tư duy-nhận thức: dõi theo người lớn di chuyển; nhìn một món đồ chơi vài giây.
- Vận động: ngẩng đầu khi nằm sấp; cử động cả hai tay hai chân; mở bàn tay trong chốc lát.

## Mốc 4 tháng (theo CDC)
- Xã hội-cảm xúc: tự cười để thu hút sự chú ý; cười khúc khích (chưa hẳn là cười to) khi được trêu; nhìn/cử động/phát âm để giữ sự chú ý của người lớn.
- Ngôn ngữ-giao tiếp: phát âm "ê" "a" (cooing); phát âm đáp lại khi người lớn nói chuyện; quay đầu về phía có tiếng nói.
- Tư duy-nhận thức: mở miệng khi thấy vú/bình sữa nếu đói; nhìn tay mình với vẻ thích thú.
- Vận động: giữ đầu vững khi được bế; cầm đồ chơi khi được đặt vào tay; vung tay đập đồ chơi; đưa tay vào miệng; chống khuỷu tay/cẳng tay nâng người khi nằm sấp.

## Mốc 6 tháng (theo CDC)
- Xã hội-cảm xúc: nhận biết người quen; thích nhìn mình trong gương; cười thành tiếng.
- Ngôn ngữ-giao tiếp: phát âm luân phiên qua lại với người lớn; "thổi bong bóng" bằng môi/lưỡi; phát ra tiếng rít/kêu.
- Tư duy-nhận thức: cho đồ vật vào miệng để khám phá; với lấy đồ chơi muốn có; mím môi ra hiệu không muốn ăn thêm.
- Vận động: lẫy từ sấp sang ngửa; chống thẳng tay khi nằm sấp; tựa vào tay để giữ thăng bằng khi ngồi.

## Một thay đổi quan trọng: không còn danh sách "dấu hiệu cảnh báo" riêng theo tháng
Khác với các bảng cũ trước 2022 (từng liệt kê cụ thể "nếu bé KHÔNG làm được X thì cần lo lắng"), bảng hiện tại của CDC chỉ đưa ra khung câu hỏi mở để trao đổi với bác sĩ: "Có điều gì bé làm hoặc không làm khiến bạn lo lắng không?", "Bé có mất kỹ năng nào từng có không?" — và nguyên tắc chung: nếu bé không đạt một hoặc nhiều mốc, đã mất kỹ năng từng có, hoặc cha mẹ có bất kỳ lo lắng nào khác, nên "hành động sớm" — trao đổi với bác sĩ và hỏi về sàng lọc phát triển, không cần chờ đủ một danh sách "dấu hiệu cảnh báo" cụ thể mới được lên tiếng.

## Một lưu ý quan trọng khác
Một số mốc trước đây hay được nhắc đến ở "khoảng 6 tháng" (như ngồi vững không cần đỡ, tự chuyển đồ vật qua hai tay, quay đầu khi được gọi tên, bập bẹ lặp âm "ba-ba"/"ma-ma") thực ra đã được CDC dời sang mốc 9 THÁNG trong bảng cập nhật hiện tại — nghĩa là chưa làm được các việc này ở 6 tháng KHÔNG đồng nghĩa với chậm phát triển. Xem thêm các mốc 6-12 tháng ở batch tiếp theo.

## Lo âu người lạ chưa xuất hiện ở giai đoạn này
Theo NHS, lo âu chia ly/sợ người lạ thường bắt đầu sớm nhất khoảng 6 tháng tuổi và phổ biến hơn trong khoảng 6 tháng đến 3 tuổi — đây không phải là điều thường gặp trong phần lớn giai đoạn 1-6 tháng.`,
    category: "Phát triển",
    stage: "INFANT_1_3_MONTHS",
    minimumAgeDays: 29,
    maximumAgeDays: 182,
    evidenceLevel: "STRONG",
    knowledgeType: scientific,
    sources: [sources.cdcMilestone2mo, sources.cdcMilestone4mo, sources.cdcMilestone6mo, sources.cdcMilestone9mo, sources.aapSocialSmile, sources.nhsSeparationAnxiety],
  },
  {
    slug: "kiem-soat-dau-tummy-time-va-lay",
    title: "Kiểm soát đầu, tummy time và lẫy",
    summary: "AAP khuyến nghị bắt đầu tummy time ngay từ ngày về nhà, 2-3 lần/ngày x 3-5 phút, tăng dần tới 15-30 phút/ngày lúc 7 tuần tuổi; bé thường lẫy được cả hai chiều trong khoảng 4-7 tháng, và không cần lật lại nếu bé đã tự lẫy được cả hai chiều lúc ngủ.",
    content: `## Kiểm soát đầu
Theo CDC: ở 2 tháng, bé ngẩng đầu lên được khi nằm sấp; ở 4 tháng, bé giữ đầu vững không cần đỡ khi được bế. Đây là tiến trình dần dần từ việc gần như không kiểm soát được đầu lúc mới sinh.

## Tummy time (nằm sấp khi thức)
AAP khuyến nghị: có thể bắt đầu ngay từ ngày bé về nhà từ bệnh viện, cho bé chơi/tương tác khi nằm sấp lúc thức 2-3 lần/ngày, mỗi lần 3-5 phút lúc đầu, tăng dần đến tổng cộng 15-30 phút/ngày khi bé được khoảng 7 tuần tuổi. Mục đích chính là xây dựng cơ cổ-vai-lưng và chuẩn bị cho các kỹ năng vận động sau này (trườn, bò), không chỉ để phòng đầu bẹp (đầu bẹp nếu có thường tự tròn lại khi bé lớn hơn và ngồi được). Nếu bé không thích, thử đặt mình hoặc một món đồ chơi trong tầm mắt bé để khuyến khích, tăng dần thời gian theo mức bé chấp nhận được.

## Lẫy
Theo AAP, khả năng lẫy thường bắt đầu xuất hiện khoảng tháng thứ 5; phần lớn bé lẫy từ sấp sang ngửa TRƯỚC, dù lẫy theo chiều ngược lại cũng hoàn toàn bình thường. Theo mốc CDC, "lẫy từ sấp sang ngửa" được liệt kê là mốc 6 tháng. Đến cuối giai đoạn 4-7 tháng, phần lớn bé có thể lẫy được cả hai chiều.

## Về giấc ngủ an toàn khi bé đã biết lẫy
Nếu bé đã tự lẫy được CẢ HAI CHIỀU một cách thoải mái (từ ngửa sang sấp và ngược lại), không cần phải lật bé lại nằm ngửa mỗi khi bé tự lẫy sấp lúc ngủ — nhưng nôi/cũi vẫn phải hoàn toàn trống (không chăn, gối, thú bông, chắn nôi mềm).`,
    category: "Phát triển",
    stage: "INFANT_1_3_MONTHS",
    minimumAgeDays: 29,
    maximumAgeDays: 213,
    evidenceLevel: "STRONG",
    knowledgeType: scientific,
    sources: [sources.cdcMilestone2mo, sources.cdcMilestone4mo, sources.cdcMilestone6mo, sources.aapTummyTime, sources.aapMotor4to7, sources.aapMotorBirthTo3],
  },
  {
    slug: "voi-nam-do-vat-va-chuan-bi-ngoi",
    title: "Với, nắm đồ vật và chuẩn bị ngồi",
    summary: "Bé cầm được đồ chơi đặt vào tay và đưa tay vào miệng khoảng 4 tháng; tư thế ngồi kiểu \"tripod\" (chống tay ra trước) xuất hiện khoảng 6 tháng, còn ngồi vững hoàn toàn không cần đỡ thường là mốc 9 tháng theo bảng cập nhật hiện tại của CDC — muộn hơn so với con số 6 tháng hay được nhắc trước đây.",
    content: `## Với và cầm nắm
Theo CDC, ở 4 tháng bé đã có thể cầm đồ chơi khi được đặt vào tay, vung tay để đập vào đồ chơi, và đưa tay vào miệng. Đây là giai đoạn phản xạ nắm tay sơ sinh (đã có từ lúc mới sinh) dần chuyển thành động tác cầm nắm có chủ đích.

## Chuyển đồ vật qua tay — muộn hơn nhiều người nghĩ
Có tài liệu phổ biến nói bé chuyển đồ vật từ tay này sang tay kia khoảng 6-8 tháng, nhưng theo bảng mốc phát triển HIỆN TẠI của CDC (cập nhật 2021-2022), đây là mốc 9 THÁNG, không phải 6 tháng. Nếu bé 6 tháng chưa làm được việc này, đây không phải dấu hiệu bất thường theo chuẩn hiện tại.

## Chuẩn bị ngồi
Theo CDC, ở 6 tháng bé "tựa vào tay để giữ thăng bằng khi ngồi" (tư thế chống tay ra trước, gọi là tripod) — đây LÀ khác với việc ngồi vững hoàn toàn không cần đỡ. Ngồi được một mình / tự ngồi dậy được liệt kê là mốc 9 THÁNG trong bảng cập nhật hiện tại của CDC — cũng muộn hơn con số "6 tháng" hay được nhắc đến trước đây. Trước 6 tháng, bé thường cần được đỡ lưng bằng tay hoặc gối khi tập ngồi.

## Vì sao có sự khác biệt về mốc tuổi giữa các nguồn
Một số tài liệu giáo dục sức khỏe (bao gồm một số bài viết cũ của chính AAP) vẫn ghi các mốc sớm hơn (ngồi vững, chuyển đồ vật ở khoảng 6-8 tháng) so với bảng CDC mới nhất (9 tháng). Đây không hẳn là mâu thuẫn — có thể phản ánh cách tính khác nhau (tuổi bắt đầu xuất hiện kỹ năng vs. tuổi mà phần lớn — khoảng 75% — trẻ đã đạt được). Cha mẹ nên xem các mốc này là khoảng tham khảo rộng, không phải hạn chót cứng nhắc.

## Khi nào cần trao đổi với bác sĩ
Nếu đến khoảng 6-9 tháng bé vẫn hoàn toàn không với/cầm đồ vật, không đưa tay vào miệng, hoặc có sự khác biệt rõ rệt giữa hai tay (chỉ dùng một tay, tay kia gần như không cử động) — nên được bác sĩ đánh giá.`,
    category: "Phát triển",
    stage: "INFANT_1_3_MONTHS",
    minimumAgeDays: 29,
    maximumAgeDays: 273,
    evidenceLevel: "MODERATE",
    knowledgeType: scientific,
    sources: [sources.cdcMilestone4mo, sources.cdcMilestone6mo, sources.cdcMilestone9mo, sources.aapMotor4to7],
  },
  {
    slug: "doc-bieu-do-tang-truong-dung-cach",
    title: "Đọc biểu đồ tăng trưởng đúng cách: percentile nghĩa là gì",
    summary: "Percentile thấp (như 10th) không đồng nghĩa \"không khỏe mạnh\" — điều quan trọng nhất là xu hướng tăng trưởng ổn định theo thời gian, không phải một con số đơn lẻ; trẻ bú mẹ thường tăng cân nhanh hơn 3 tháng đầu rồi chậm lại so với trẻ bú công thức, đây là điều bình thường.",
    content: `## Vì sao dùng biểu đồ WHO thay vì biểu đồ cũ cho trẻ dưới 2 tuổi
CDC khuyến nghị dùng biểu đồ tăng trưởng chuẩn của WHO cho trẻ từ sơ sinh đến 2 tuổi (biểu đồ CDC/NCHS cũ chỉ dùng từ 2 tuổi trở lên) — đây vẫn là khuyến nghị hiện hành. Lý do: biểu đồ WHO là một CHUẨN mô tả cách trẻ khỏe mạnh, bú mẹ NÊN tăng trưởng như thế nào (dựa trên nghiên cứu đa quốc gia ở trẻ bú mẹ trong điều kiện tối ưu), trong khi biểu đồ cũ chỉ là một THAM CHIẾU mô tả cách một nhóm trẻ Mỹ (chủ yếu bú công thức) ĐÃ tăng trưởng trong giai đoạn 1963-1994 — không phải một chuẩn lý tưởng.

## Percentile không phải "điểm số"
AAP nhấn mạnh: percentile thấp (như 10th) "không tệ hơn hay tốt hơn" percentile cao (như 90th) — đây không giống điểm số ở trường mà càng cao càng tốt. Điều quan trọng nhất là ĐÀ TĂNG TRƯỞNG theo thời gian: một điểm dữ liệu đơn lẻ không có ý nghĩa bằng việc theo dõi 5 lần đo trở lên qua nhiều tháng. Nguyên tắc chung được dạy trong nhi khoa (dù không phải lúc nào cũng được nêu thành con số cụ thể trong tài liệu chính thức): việc bé "nhảy" qua từ hai đường percentile chính trở lên (ví dụ từ trên 90th tụt xuống dưới 50th) đáng chú ý hơn nhiều so với việc bé ở ổn định tại một percentile thấp hoặc cao trong thời gian dài.

## Khác biệt tăng cân giữa bú mẹ và bú công thức
Theo CDC: trẻ bú mẹ khỏe mạnh thường tăng cân CHẬM HƠN trẻ bú công thức tính chung trong năm đầu, nhưng cụ thể hơn: khoảng 3 tháng đầu trẻ bú mẹ thường tăng cân nhanh, sau đó tăng chậm lại rõ rệt so với trẻ bú công thức từ khoảng tháng thứ 3 trở đi — đây là lý do biểu đồ WHO (xây dựng từ trẻ bú mẹ) cho thấy đường tăng cân sau tháng thứ 3 thoải hơn. Đây là kiểu tăng trưởng BÌNH THƯỜNG, không phải dấu hiệu bú mẹ "không đủ chất".

## Vòng đầu
Vòng đầu được theo dõi vì phản ánh sự phát triển của não bộ. Cũng giống cân nặng/chiều dài, xu hướng theo thời gian quan trọng hơn một số đo đơn lẻ; vòng đầu tăng rất nhanh vượt nhiều đường percentile (đặc biệt tăng nhanh bất thường) cần được bác sĩ đánh giá thêm.`,
    category: "Phát triển",
    stage: "INFANT_1_3_MONTHS",
    minimumAgeDays: 29,
    maximumAgeDays: 365,
    evidenceLevel: "STRONG",
    knowledgeType: scientific,
    sources: [sources.cdcGrowthChartRec, sources.cdcWHOUsing, sources.aapGrowthPercentiles, sources.cdcBreastfeedingGrowth],
  },
  {
    slug: "tiem-chung-2-4-thang-va-thuoc-ha-sot-truoc-khi-tiem",
    title: "Tiêm chủng 2–4 tháng và lưu ý về thuốc hạ sốt trước khi tiêm",
    summary: "Chương trình Tiêm chủng Mở rộng Việt Nam tiêm vắc xin 5 trong 1 (bạch hầu-ho gà-uốn ván-viêm gan B-Hib) và bại liệt uống ở các mốc 2, 3, 4 tháng; CDC khuyến cáo KHÔNG nên uống thuốc hạ sốt trước/ngay lúc tiêm để phòng ngừa phản ứng, vì có thể làm giảm đáp ứng miễn dịch với vắc xin.",
    content: `## Lịch tiêm 2-4 tháng tại Việt Nam
Theo Quyết định 845/QĐ-BYT của Bộ Y tế: vắc xin 5 trong 1 (bạch hầu, ho gà, uốn ván, viêm gan B, Hib) và vắc xin bại liệt uống (OPV) được tiêm/uống theo 3 mũi, mỗi tháng một mũi ở các mốc 2, 3 và 4 tháng tuổi (mũi 1 lúc 2 tháng, mũi 2 lúc 3 tháng, mũi 3 lúc 4 tháng). Lưu ý: chưa xác minh trực tiếp được trên trang chính thức của Bộ Y tế/Chương trình Tiêm chủng Mở rộng trong lần nghiên cứu này (do lỗi truy cập trang), nội dung trên được đối chiếu qua văn bản pháp quy gốc và một nguồn tổng hợp độc lập khác — nên xác nhận lại với cơ sở tiêm chủng địa phương về lịch cụ thể hiện hành.

## Lịch tương ứng tại Mỹ (để so sánh, không phải khuyến nghị cho Việt Nam)
CDC khuyến nghị 3 mũi cơ bản ở 2, 4, 6 tháng cho các vắc xin: bạch hầu-ho gà-uốn ván (DTaP), Hib, bại liệt (dạng tiêm - IPV), phế cầu (PCV), cùng với vắc xin viêm gan B và Rota theo lịch riêng.

## Phản ứng thường gặp sau tiêm
Sốt nhẹ, đau/đỏ tại chỗ tiêm, quấy khóc trong 1-2 ngày là bình thường. Cần khám nếu: sốt rất cao, khóc không dỗ được kéo dài nhiều giờ, bé lừ đừ bất thường, khó thở/sưng mặt, hoặc phát ban dạng mề đay lan nhanh.

## Về thuốc hạ sốt trước khi tiêm — một khuyến cáo chính thức quan trọng
Theo tài liệu "Pink Book" của CDC: KHÔNG khuyến nghị dùng thuốc hạ sốt (như paracetamol/ibuprofen) một cách dự phòng TRƯỚC hoặc NGAY LÚC tiêm để cố gắng phòng ngừa phản ứng — vì (1) không có bằng chứng cho thấy cách này giảm đau do tiêm, và (2) một số nghiên cứu cho thấy có thể làm giảm đáp ứng miễn dịch với một số kháng nguyên vắc xin. Đây là lập trường CHÍNH THỨC của CDC, không chỉ là một phát hiện nghiên cứu còn tranh cãi. Ngược lại, dùng thuốc hạ sốt/giảm đau SAU khi bé đã có sốt hoặc khó chịu vì tiêm là bình thường và được chấp nhận.

## Nếu lỡ lịch tiêm
Theo CDC, nếu bị trễ một mũi, KHÔNG cần tiêm lại từ đầu — vắc xin được tiêm tiếp theo lịch bù, dựa trên khoảng cách tối thiểu giữa các mũi, bất kể đã trễ bao lâu. Nên liên hệ cơ sở tiêm chủng để được sắp lịch bù phù hợp.`,
    category: "Tiêm chủng",
    stage: "INFANT_1_3_MONTHS",
    minimumAgeDays: 29,
    maximumAgeDays: 182,
    evidenceLevel: "MODERATE",
    knowledgeType: scientific,
    sources: [sources.moh845, sources.cdcPinkBookVaccineAdmin, sources.cdcBeforeDuringAfterShots, sources.cdcCatchUpSchedule],
  },
  {
    slug: "quay-khoc-va-trao-nguoc-khi-nao-het",
    title: "Quấy khóc (colic) và trớ sữa: khi nào hết",
    summary: "Quấy khóc do colic thường đạt đỉnh khoảng 6 tuần tuổi và giảm rõ rệt lúc 3-4 tháng (một số kéo dài tới 6 tháng); trớ sữa thường đạt đỉnh khoảng 4 tháng (khoảng 2/3 số trẻ), giảm còn khoảng 14% lúc 7 tháng và dưới 5% lúc 10-14 tháng.",
    content: `## Quấy khóc/colic: mốc thời gian
Quấy khóc không rõ nguyên nhân thường đạt đỉnh khoảng 3 giờ/ngày lúc 6 tuần tuổi, và thường giảm rõ rệt khi bé được 3-4 tháng (một số trường hợp có thể kéo dài đến 6 tháng). Nếu quấy khóc dữ dội vẫn tiếp diễn SAU 4 THÁNG TUỔI, nên cho bé khám để loại trừ nguyên nhân y khoa khác thay vì tiếp tục cho là "colic thông thường".

## Trớ sữa: mốc thời gian cụ thể
Theo y văn: khoảng một nửa số trẻ dưới 3 tháng trớ sữa ít nhất 1 lần/ngày; tỷ lệ này ĐẠT ĐỈNH lúc 4 THÁNG TUỔI với khoảng 2/3 số trẻ trớ ít nhất 1 lần/ngày — sau đó giảm nhanh: còn khoảng 14% lúc 7 tháng, và dưới 5% trong khoảng 10-14 tháng. Phần lớn tình trạng trớ sữa tự hết trước khi bé được 1 tuổi.

## Khi nào trớ sữa là dấu hiệu cần khám (GERD thay vì GER thông thường)
Trớ sữa/trào ngược sinh lý (GER) không cần điều trị nếu bé vẫn phát triển tốt. Cần khám nếu có thêm: không tăng cân/sụt cân, bỏ bú hoặc bú kéo dài bất thường, quấy khóc rõ rệt sau khi bú, ho/khò khè/khàn giọng kéo dài, viêm phổi/viêm tai tái phát, hoặc có máu trong chất nôn — đây là các dấu hiệu gợi ý bệnh trào ngược (GERD) cần đánh giá thêm, khác với trớ sữa sinh lý thông thường. Riêng quấy khóc/khó chịu là dấu hiệu DUY NHẤT thường ít có giá trị chẩn đoán GERD vì rất nhiều bé quấy khóc mà không hề trào ngược.`,
    category: "Triệu chứng thường gặp",
    stage: "INFANT_1_3_MONTHS",
    minimumAgeDays: 29,
    maximumAgeDays: 365,
    evidenceLevel: "STRONG",
    knowledgeType: scientific,
    sources: [sources.colic, sources.aafpGERD, sources.aapSpitUp, sources.naspghanGERD],
  },
  {
    slug: "be-bap-be-va-phat-trien-ngon-ngu-som",
    title: "Bé \"bập bẹ\" và phát triển ngôn ngữ sớm",
    summary: "Theo mốc CDC hiện tại: ê a \"ơ/a\" là mốc 4 tháng, cười thành tiếng và phát âm luân phiên/thổi bong bóng miệng là mốc 6 tháng — còn bập bẹ lặp âm rõ ràng kiểu \"ba-ba-ba\"/\"ma-ma-ma\" thực ra là mốc 9 THÁNG, muộn hơn nhiều so với con số 6 tháng hay được nhắc đến.",
    content: `## Các mốc âm thanh theo tuổi (theo CDC, đã xác minh lại)
- 2 tháng: phát ra âm thanh khác tiếng khóc; phản ứng với tiếng động lớn.
- 4 tháng: phát âm "ơ", "a" (cooing); phát âm đáp lại khi được nói chuyện; quay đầu về phía có tiếng nói.
- 6 tháng: phát âm luân phiên qua lại với người lớn (như một cuộc "trò chuyện" bằng âm thanh); "thổi bong bóng" bằng môi; phát ra tiếng rít/kêu the thé; cười thành tiếng.
- 9 tháng (ngoài phạm vi giai đoạn 1-6 tháng nhưng nên biết trước): phát ra nhiều âm thanh lặp lại rõ ràng như "ba-ba-ba-ba", "ma-ma-ma-ma".

Lưu ý quan trọng: bập bẹ lặp âm rõ ràng kiểu "ba-ba" — thứ nhiều người vẫn nghĩ là mốc 6 tháng — thực ra được CDC xếp vào mốc 9 THÁNG trong bảng cập nhật hiện tại. Ở 6 tháng, bé mới chỉ ở giai đoạn phát âm luân phiên và các âm chưa thành tiếng lặp rõ ràng (thổi bong bóng, tiếng rít).

## Bập bẹ có phải phổ quát hay phụ thuộc vào việc nghe âm thanh xung quanh?
Đây là một câu hỏi thú vị trong nghiên cứu ngôn ngữ học phát triển: có bằng chứng học thuật (không phải hướng dẫn y tế chính thức từ CDC/AAP/WHO) cho thấy trẻ khiếm thính vẫn bập bẹ ở giai đoạn đầu, nhưng kiểu "bập bẹ lặp âm rõ ràng" (canonical babbling, như "ba-ba") ở trẻ khiếm thính thường xuất hiện muộn hơn và khác biệt về đặc điểm so với trẻ nghe bình thường — gợi ý rằng phản hồi thính giác (từ môi trường và từ chính giọng của bé) đóng vai trò quan trọng cho giai đoạn bập bẹ rõ ràng này. Đây là kiến thức khoa học nền, không phải khuyến cáo lâm sàng chính thức.

## Khi nào cần lưu ý về thính giác/ngôn ngữ
Không giật mình với tiếng động lớn, không quay đầu về phía có âm thanh (mốc 4 tháng), hoặc hoàn toàn không phát ra âm thanh nào ngoài tiếng khóc — nên được kiểm tra thính lực và trao đổi với bác sĩ, đặc biệt nếu bé chưa từng được sàng lọc thính lực sơ sinh hoặc kết quả trước đó chưa rõ ràng.`,
    category: "Phát triển",
    stage: "INFANT_1_3_MONTHS",
    minimumAgeDays: 29,
    maximumAgeDays: 182,
    evidenceLevel: "MODERATE",
    knowledgeType: scientific,
    sources: [sources.cdcMilestone2mo, sources.cdcMilestone4mo, sources.cdcMilestone6mo, sources.cdcMilestone9mo, sources.hearingScreeningAAP],
  },
  {
    slug: "moc-van-dong-tho-15-36-thang",
    title: "Mốc vận động thô 15–36 tháng",
    summary: "Theo bảng mốc hiện tại của CDC: đi vững không cần vịn là mốc 18 tháng; chạy, đá bóng, đi lên vài bậc thang (không trèo) là mốc 24 tháng; nhảy hai chân rời khỏi mặt đất là mốc 30 tháng — đáng chú ý, ném bóng qua vai và leo cầu thang luân phiên chân KHÔNG còn nằm trong bảng mốc hiện tại của CDC.",
    content: `## Các mốc cụ thể theo CDC
- 15 tháng: tự đi được vài bước.
- 18 tháng: đi vững không cần vịn vào ai/vật gì; trèo lên xuống ghế sofa/ghế không cần giúp.
- 24 tháng (2 tuổi): chạy; đá được bóng; đi (không trèo) lên vài bậc thang có hoặc không cần giúp.
- 30 tháng: nhảy hai chân rời khỏi mặt đất; dùng tay xoay vặn đồ vật (như vặn nắm cửa, mở nắp chai).
- 3 tuổi: xâu chuỗi các vật lại với nhau (như hạt cườm lớn).

## Hai mốc đáng chú ý KHÔNG còn trong bảng CDC hiện tại
Ném bóng qua vai (overhand throw) và leo cầu thang luân phiên từng chân (thay vì cả hai chân dồn lên một bậc) — hai mốc vận động rất hay được nhắc trong các bảng cũ (kiểu Denver-II) — hiện KHÔNG xuất hiện trong bảng mốc rút gọn hiện tại của CDC (2022). Điều này không có nghĩa các kỹ năng này không quan trọng, chỉ là CDC không còn dùng chúng làm mốc sàng lọc chuẩn.

## Không còn danh sách "dấu hiệu cảnh báo" riêng
Giống các giai đoạn khác, CDC chỉ đưa nguyên tắc chung: nếu bé không đạt mốc, mất kỹ năng đã có, hoặc cha mẹ có lo lắng, nên trao đổi với bác sĩ — không có danh sách cụ thể theo từng tháng.

## Tham khảo thêm: nghiên cứu vận động của WHO
Nghiên cứu Phát triển Vận động của WHO (WHO Motor Development Study) chỉ theo dõi 6 mốc vận động đến "đi vững một mình" (khoảng 8-18 tháng, trung vị 12 tháng) — KHÔNG có dữ liệu chính thức của WHO cho các mốc sau đó như chạy, leo cầu thang hay nhảy.`,
    category: "Phát triển",
    stage: "TODDLER",
    minimumAgeDays: 366,
    maximumAgeDays: 1095,
    evidenceLevel: "STRONG",
    knowledgeType: scientific,
    sources: [sources.cdcMilestone15mo, sources.cdcMilestone18mo, sources.cdcMilestone2yr, sources.cdcMilestone30mo, sources.cdcMilestone3yr],
  },
  {
    slug: "moc-van-dong-tinh-va-tay-thuan-15-36-thang",
    title: "Mốc vận động tinh và tay thuận ở trẻ 15–36 tháng",
    summary: "Xếp chồng ít nhất 2 khối là mốc 15 tháng, vẽ nguệch ngoạc là mốc 18 tháng, lật từng trang sách là mốc 30 tháng, vẽ được hình tròn khi được làm mẫu là mốc 3 tuổi; tay thuận rõ rệt thường xuất hiện dần khoảng sinh nhật thứ 2, nhưng tay thuận xuất hiện RẤT SỚM (khoảng 6-8 tháng tuổi) lại là điều cần lưu ý, không phải dấu hiệu \"khéo tay sớm\".",
    content: `## Các mốc vận động tinh theo CDC
- 15 tháng: xếp chồng được ít nhất 2 vật nhỏ (như khối gỗ); biết dùng đồ vật đúng cách đơn giản (như cầm điện thoại, cốc, sách).
- 18 tháng: vẽ nguệch ngoạc; uống bằng cốc không nắp (có thể còn đổ); tự xúc ăn bằng tay; tập dùng thìa.
- 24 tháng: giữ đồ vật bằng một tay trong khi tay kia thao tác (như giữ hộp và mở nắp); thử dùng công tắc/nút/núm trên đồ chơi.
- 30 tháng: tự cởi được một số quần áo đơn giản (quần rộng, áo khoác mở); lật từng trang sách khi được đọc cho nghe.
- 3 tuổi: vẽ được hình tròn khi được làm mẫu (sao chép, không phải tự vẽ); xâu chuỗi hạt lớn; dùng nĩa.

## Tay thuận — bình thường xuất hiện dần đến khoảng 2 tuổi
AAP cho biết: đến sinh nhật thứ 2, bé có thể bắt đầu thể hiện xu hướng thuận tay phải hoặc trái rõ hơn — nhưng nhiều bé chưa có xu hướng rõ ràng này trong vài năm tiếp theo, một số bé dùng cả hai tay như nhau. Không cần ép bé dùng một tay cụ thể hay thúc đẩy quá trình này.

## Tay thuận xuất hiện RẤT SỚM — cần lưu ý, không phải dấu hiệu tốt
Đây là điểm dễ hiểu lầm: tay thuận rõ rệt xuất hiện quá sớm — cụ thể khoảng 6-8 THÁNG TUỔI (khi bé còn chưa đến giai đoạn phát triển tay thuận bình thường) — được xem là một dấu hiệu cần lưu ý trong tài liệu lâm sàng nhi khoa, có thể liên quan đến vấn đề vận động một bên cơ thể, chứ KHÔNG phải dấu hiệu bé "khéo tay sớm". Nếu nhận thấy bé chỉ dùng một tay nhất quán, hầu như không dùng tay còn lại, ở độ tuổi rất nhỏ (dưới 1 tuổi), nên trao đổi với bác sĩ để được đánh giá thêm.`,
    category: "Phát triển",
    stage: "TODDLER",
    minimumAgeDays: 366,
    maximumAgeDays: 1095,
    evidenceLevel: "MODERATE",
    knowledgeType: scientific,
    sources: [sources.cdcMilestone15mo, sources.cdcMilestone18mo, sources.cdcMilestone2yr, sources.cdcMilestone30mo, sources.cdcMilestone3yr, sources.aapHandFinger1yo],
  },
  {
    slug: "tap-ngoi-bo-ban-ngay-ban-dem-va-khi-be-quay-lai-thoi-quen-cu",
    title: "Tập ngồi bô: ban ngày, ban đêm và khi bé \"quay lại\" thói quen cũ",
    summary: "NHS khuyến nghị cứ bắt đầu tập trong khoảng 18 tháng-2.5 tuổi mà không cần chờ dấu hiệu sẵn sàng, trong khi AAP nhấn mạnh nên chờ các dấu hiệu sẵn sàng trước — một khác biệt thật giữa hai nguồn; bắt đầu tập quá sớm (trước 27 tháng) không giúp hoàn thành nhanh hơn theo một nghiên cứu đoàn hệ.",
    content: `## Hai quan điểm khác nhau về thời điểm bắt đầu
Đây là điểm khác biệt thật giữa hai nguồn uy tín, không phải sai sót: AAP nhấn mạnh nên CHỜ các dấu hiệu sẵn sàng (biết giữ tã khô 2 giờ trở lên, làm theo hướng dẫn đơn giản, thể hiện quan tâm đến việc dùng bô/nhà vệ sinh, khó chịu khi tã bẩn) trước khi bắt đầu — cho rằng chờ đúng thời điểm giúp quá trình nhanh và dễ chịu hơn. Trong khi đó, NHS khuyến nghị: "không cần chờ bé thể hiện dấu hiệu hay yêu cầu dùng bô mới bắt đầu... chờ thời điểm hoàn hảo đôi khi khiến việc này bị trì hoãn lâu hơn cần thiết" — và gợi ý cứ bắt đầu trong khoảng 18 tháng đến 2.5 tuổi.

## Bắt đầu quá sớm không giúp nhanh hơn
Một nghiên cứu đoàn hệ tiến cứu (hơn 400 trẻ) cho thấy: bắt đầu tập luyện tích cực TRƯỚC 27 tháng tuổi KHÔNG giúp hoàn thành sớm hơn — gợi ý rằng bắt đầu rất sớm mang lại "rất ít lợi ích" ở phần lớn trẻ. Bắt đầu sớm cũng không liên quan đến táo bón hay từ chối đi vệ sinh.

## Về các phương pháp
Cả phương pháp tập dần theo nhịp của bé (kiểu Brazelton) và phương pháp tập trung cao độ trong thời gian ngắn (kiểu Azrin-Foxx) đều được ghi nhận là có thể giúp trẻ khỏe mạnh học được kỹ năng này — nhưng CHƯA có nghiên cứu nào so sánh trực tiếp hai phương pháp với nhau, nên không có bằng chứng để khẳng định cách nào "tốt hơn" hẳn.

## Ban đêm — kỹ năng riêng, phát triển muộn hơn
Khô ráo ban đêm là một kỹ năng RIÊNG BIỆT và thường phát triển muộn hơn nhiều so với ban ngày. Đái dầm ban đêm dưới 5 tuổi được xem là biến thể bình thường (khoảng 15-20% trẻ 5 tuổi vẫn đái dầm, giảm dần theo tuổi). Nên đi khám nếu: bé đã khô ráo ổn định từ 6 tháng trở lên rồi bỗng đái dầm trở lại, hoặc đái dầm vẫn tiếp diễn nhiều sau tuổi đi học.

## Khi bé "quay lại" thói quen cũ — bình thường, không phải thất bại
Cả AAP và NHS đều xem việc tạm thời quay lại thói quen cũ (sau khi đã học được) là hiện tượng phổ biến và bình thường, thường liên quan đến thay đổi lớn trong cuộc sống (đi nhà trẻ, có em bé mới, chuyển nhà, ốm). Bước đầu tiên nên làm là loại trừ nguyên nhân y khoa (táo bón, nhiễm trùng tiểu) cùng bác sĩ, sau đó giữ bình tĩnh, duy trì nếp sinh hoạt ổn định và không trách phạt bé.`,
    category: "Nuôi dạy tích cực",
    stage: "TODDLER",
    minimumAgeDays: 366,
    maximumAgeDays: 1095,
    evidenceLevel: "MODERATE",
    knowledgeType: scientific,
    sources: [sources.aafpToiletTraining2019, sources.aapPottyTraining, sources.nhsPottyTraining, sources.aapBedwetting, sources.nhsBedwetting, sources.aapPottyRegression, sources.blumToiletTrainingStudy],
  },
  {
    slug: "cham-soc-rang-mieng-tre-nho",
    title: "Chăm sóc răng miệng cho trẻ nhỏ",
    summary: "Nên khám răng lần đầu khi mọc răng đầu tiên, muộn nhất trước 12 tháng tuổi; dùng kem đánh răng có fluor cỡ hạt gạo cho trẻ dưới 3 tuổi (cỡ hạt đậu cho 3-6 tuổi), đánh răng 2 lần/ngày ngay từ khi có răng đầu tiên; nên cai ti giả/mút tay trước 36 tháng, đặc biệt lưu ý từ 18 tháng khi răng nanh mọc.",
    content: `## Khám răng lần đầu
AAPD khuyến nghị: lần khám răng đầu tiên nên diễn ra vào thời điểm mọc răng đầu tiên, và muộn nhất là trước 12 THÁNG TUỔI — không cần đợi đến khi có vấn đề. Khám sớm giúp thiết lập "nhà nha khoa" quen thuộc, phát hiện sớm nguy cơ sâu răng, và tư vấn cho cha mẹ cách chăm sóc đúng.

## Kem đánh răng có fluor — lượng đúng theo tuổi
- Dưới 3 tuổi: chỉ một lượng rất nhỏ, cỡ HẠT GẠO (khoảng 0.1mg fluor).
- 3-6 tuổi: cỡ HẠT ĐẬU (khoảng 0.25mg fluor).
Lý do dùng lượng nhỏ: giảm nguy cơ nhiễm fluor răng (fluorosis) nếu bé nuốt phải kem đánh răng — trẻ nhỏ dưới 6 tuổi chiếm hơn 80% các ca báo cáo nuốt fluor tại trung tâm chống độc. Vẫn nên dùng kem có fluor (không phải kem không fluor) vì đây là biện pháp phòng sâu răng hàng đầu — cha mẹ nên là người lấy kem ra bàn chải và giám sát để bé nhổ ra thay vì nuốt.

## Đánh răng — tần suất và ai thực hiện
Đánh răng ít nhất 2 lần/ngày, bắt đầu NGAY KHI có răng đầu tiên. Cha mẹ nên là người đánh răng cho bé lúc đầu, dần chuyển sang cùng làm với bé, và trẻ thường vẫn cần người lớn hỗ trợ/giám sát đến khoảng khi có thể tự buộc dây giày (thường quanh 8 tuổi).

## Sâu răng sớm ở trẻ nhỏ (sâu răng do bú bình)
Sâu răng sớm được định nghĩa là có ít nhất 1 mặt răng sữa bị sâu/mất/trám ở trẻ từ 71 tháng tuổi trở xuống. Nguyên nhân chính: cho bú bình/uống sữa hoặc nước ngọt kéo dài (đặc biệt để bé ngậm bình khi ngủ), ăn vặt đồ ngọt thường xuyên. Theo số liệu giám sát của CDC, khoảng 11% trẻ 2-5 tuổi tại Mỹ có ít nhất 1 răng sữa bị sâu chưa điều trị.

## Bôi fluor vecni tại phòng khám
USPSTF khuyến cáo (mức B): bác sĩ nhi/bác sĩ gia đình nên bôi fluor vecni cho răng sữa của MỌI trẻ từ khi mọc răng đầu tiên, thường lặp lại mỗi 6 tháng.

## Mút tay và ngậm ti giả — khi nào cần cai
Mút tay/ngậm ti giả sớm là bình thường. Mối lo về ảnh hưởng răng miệng tăng dần từ khoảng 18 THÁNG (khi răng nanh bắt đầu mọc) và rõ rệt hơn nếu tiếp tục sau 3 tuổi. AAPD khuyến nghị nên cai thói quen này trước 36 THÁNG TUỔI để giảm nguy cơ lệch khớp cắn (hở hàm phía trước, cắn chéo). Lưu ý thú vị: ép cai ti giả quá sớm (trước khoảng 14 tháng) có thể khiến bé chuyển sang mút tay — một thói quen khó cai hơn — nên việc cai nên có thời điểm hợp lý, không quá vội.`,
    category: "Mọc răng",
    stage: "TODDLER",
    minimumAgeDays: 366,
    maximumAgeDays: 1095,
    evidenceLevel: "STRONG",
    knowledgeType: scientific,
    sources: [sources.aapdPeriodicity, sources.aapFirstTooth, sources.aapdFluorideTherapy, sources.cdcFluoride, sources.aapFluorideFAQ, sources.aapToothbrushing, sources.aapdECCDefinition, sources.cdcOralHealthSurveillance, sources.uspstfFluorideVarnish, sources.aapdPacifierPolicy],
  },
  {
    slug: "ngon-ngu-18-36-thang-cum-hai-tu-va-lam-theo-huong-dan",
    title: "Ngôn ngữ 18–36 tháng: cụm hai từ và làm theo hướng dẫn",
    summary: "Theo mốc CDC hiện tại: nói cụm 2 từ là mốc 24 tháng (không phải 18 tháng); nói được khoảng 50 từ và làm theo hướng dẫn 2 bước là mốc 30 tháng; chơi giả vờ (như cho búp bê ăn) cũng là mốc 30 tháng — muộn hơn các mốc thường được nhắc trước đây.",
    content: `## Các mốc ngôn ngữ theo CDC (đã xác minh lại)
- 18 tháng: cố nói thêm 3 từ trở lên ngoài "mama/dada"; làm theo hướng dẫn 1 bước không cần kèm cử chỉ (như đưa đồ khi được yêu cầu).
- 24 tháng: chỉ vào hình trong sách khi được hỏi; NÓI ĐƯỢC ÍT NHẤT 2 TỪ GHÉP LẠI (như "thêm sữa"); chỉ được ít nhất 2 bộ phận cơ thể khi được yêu cầu; dùng nhiều cử chỉ hơn (như hôn gió, gật đầu).
- 30 tháng: nói được KHOẢNG 50 TỪ; nói 2 từ trở lên ghép với 1 từ chỉ hành động (như "chó chạy"); gọi tên đồ vật trong sách khi được chỉ và hỏi; dùng các từ như "con", "mình"; LÀM THEO HƯỚNG DẪN 2 BƯỚC (như "đặt đồ chơi xuống rồi đóng cửa lại").
- 30 tháng (nhận thức): CHƠI GIẢ VỜ (như cho búp bê ăn một miếng đồ chơi như thể đó là thức ăn thật); biết ít nhất 1 màu sắc.

## Lưu ý quan trọng: một số mốc muộn hơn thường được nghĩ
"Nói cụm 2 từ" — điều nhiều người vẫn nghĩ là mốc 18 tháng — thực ra là mốc 24 THÁNG theo bảng CDC hiện tại. Tương tự, "làm theo hướng dẫn 2 bước" và "chơi giả vờ" — thường được cho là mốc 24 tháng — thực ra đều là mốc 30 THÁNG. Nếu bé 24 tháng chưa làm theo hướng dẫn 2 bước hay chưa chơi giả vờ, đây không phải là bất thường theo chuẩn hiện tại.

## "Bùng nổ vốn từ" — không phải thuật ngữ chính thức
Khái niệm "giai đoạn bùng nổ vốn từ" (vocabulary spurt) khoảng 18-24 tháng là một thuật ngữ trong ngôn ngữ học phát triển (học thuật), KHÔNG phải thuật ngữ chính thức của CDC/AAP/WHO. Con số cụ thể duy nhất CDC đưa ra là "khoảng 50 từ" ở mốc 30 tháng — không có số liệu chính thức về tốc độ học từ mới theo ngày/tuần.

## Dấu hiệu cần lưu ý
CDC không liệt kê danh sách "dấu hiệu cảnh báo" riêng theo tháng — chỉ có câu hỏi chung: "Bé có mất kỹ năng nào từng có không?" và nguyên tắc "nếu có bất kỳ lo lắng nào, hãy trao đổi với bác sĩ". Mất kỹ năng ngôn ngữ đã có (không chỉ riêng ngôn ngữ) luôn là một dấu hiệu đáng chú ý cần được đánh giá, bất kể tuổi.`,
    category: "Phát triển",
    stage: "TODDLER",
    minimumAgeDays: 366,
    maximumAgeDays: 1095,
    evidenceLevel: "STRONG",
    knowledgeType: scientific,
    sources: [sources.cdcMilestone18mo, sources.cdcMilestone2yr, sources.cdcMilestone30mo, sources.cdcMilestoneKeyPoints],
  },
  {
    slug: "thoi-gian-man-hinh-cho-tre-nho-who-va-aap-khac-biet-moi",
    title: "Thời gian màn hình cho trẻ nhỏ: WHO và AAP đang có khác biệt mới",
    summary: "WHO (2019) khuyến nghị KHÔNG cho trẻ dưới 2 tuổi dùng màn hình, và tối đa 1 giờ/ngày (càng ít càng tốt) cho trẻ 2-5 tuổi; AAP dường như đã chuyển hướng dẫn năm 2026 sang bỏ giới hạn giờ cố định, thiên về cách tiếp cận theo bối cảnh gia đình — một khác biệt đáng chú ý hiện tại giữa hai tổ chức.",
    content: `## Khuyến nghị của WHO (2019, vẫn là hướng dẫn hiện hành)
Trẻ dưới 1-2 tuổi: KHÔNG khuyến nghị dùng màn hình tĩnh (xem TV/video, chơi game trên máy tính). Trẻ 2-5 tuổi: thời gian màn hình tĩnh không quá 1 giờ/ngày, và "càng ít càng tốt".

## AAP dường như đã thay đổi cách tiếp cận
Trước đây, AAP có hướng dẫn khá giống WHO: tránh màn hình trước 18 tháng (ngoại trừ gọi video call với người thân — vì có tương tác qua lại, khác với xem thụ động), xem cùng người lớn và chọn nội dung chất lượng cao cho 18-24 tháng, và tối đa 1 giờ/ngày cho 2-5 tuổi. Tuy nhiên, theo các nguồn tin đưa tin về một tuyên bố chính sách mới của AAP (đầu năm 2026, "Digital Ecosystems, Children, and Adolescents"), AAP dường như đã CHUYỂN HƯỚNG khỏi khung giới hạn giờ cố định, thay vào đó nhấn mạnh cách tiếp cận linh hoạt theo hoàn cảnh từng gia đình hơn là một con số giờ cứng nhắc.

Đây là một khác biệt hiện tại đáng chú ý giữa WHO (vẫn giữ mốc 1 giờ cụ thể) và AAP (dường như không còn đưa ra mốc giờ cố định) — không phải một bên đã lỗi thời, mà là một sự thay đổi cách tiếp cận đang diễn ra. Cha mẹ nên theo dõi cập nhật từ cả hai nguồn và tham khảo ý kiến bác sĩ nhi khoa của mình.

## Mức độ chắc chắn của bằng chứng đằng sau các con số giờ cụ thể
Đây là điều quan trọng cần biết: chính WHO cũng thừa nhận bằng chứng làm nền cho các khuyến nghị về giờ màn hình cụ thể là "chất lượng rất thấp đến thấp" — hướng dẫn được xây dựng dựa trên "bằng chứng tốt nhất hiện có, đồng thuận chuyên gia, và cân nhắc giá trị/khả năng chấp nhận/tính khả thi", không phải từ các thử nghiệm đối chứng ngẫu nhiên chứng minh chắc chắn "1 giờ" là ngưỡng đúng. Điều này không có nghĩa nên bỏ qua khuyến nghị, mà để cha mẹ hiểu đây là một con số THAM KHẢO thận trọng dựa trên đồng thuận, không phải một ngưỡng khoa học tuyệt đối.

## Gợi ý thực tế
Ưu tiên tương tác trực tiếp, hạn chế tối đa màn hình trước 18-24 tháng (trừ gọi video với người thân), chọn nội dung chất lượng và xem cùng bé khi có thể, tránh dùng màn hình thay thế hoàn toàn cho giao tiếp/vui chơi trực tiếp.`,
    category: "Phát triển",
    stage: "TODDLER",
    minimumAgeDays: 366,
    maximumAgeDays: 1095,
    evidenceLevel: "MODERATE",
    knowledgeType: scientific,
    sources: [sources.whoSleepGuideline, sources.aapDigitalEcosystems2026, sources.aapScreenTimeQA],
  },
  {
    slug: "ky-luat-tich-cuc-bang-chung-thuc-te",
    title: "Kỷ luật tích cực: bằng chứng thực tế đằng sau các phương pháp",
    summary: "AAP chính thức phản đối mọi hình thức đánh đòn/trừng phạt thân thể dựa trên bằng chứng tổng hợp cho thấy tăng hành vi hung hăng mà không cải thiện hành vi; time-out có bằng chứng khi là một phần của chương trình can thiệp có cấu trúc, dù công thức \"1 phút mỗi tuổi\" là hướng dẫn thực hành của AAP chứ chưa được kiểm chứng bằng thử nghiệm liều lượng riêng.",
    content: `## AAP chính thức phản đối đánh đòn
Năm 2018, AAP cập nhật chính sách nêu rõ: đánh đòn "làm tăng tính hung hăng ở trẻ nhỏ về lâu dài và không hiệu quả trong việc dạy trẻ trách nhiệm và tự kiểm soát" — "không có lợi ích nào từ việc đánh đòn". Một phân tích tổng hợp lớn (hơn 160,000 trẻ, năm 2016) cho thấy phần lớn các chỉ số đều liên quan đến kết cục bất lợi (tăng hung hăng, lo âu, vấn đề sức khỏe tâm thần), kể cả khi tách riêng khỏi bạo hành thể chất. Trừng phạt bằng lời nói gây xấu hổ cũng được khuyến cáo tránh vì liên quan đến vấn đề sức khỏe tâm thần ở tuổi vị thành niên.

## Time-out (cách ly ngắn) — có bằng chứng khi nằm trong chương trình có cấu trúc
Time-out cho thấy hiệu quả khi là một phần của các chương trình can thiệp hành vi có cấu trúc, được nghiên cứu bằng thử nghiệm đối chứng (như liệu pháp tương tác cha mẹ-con dành cho trẻ nhỏ, hay chương trình Triple P) — các chương trình này cho thấy cải thiện hành vi và kỹ năng làm cha mẹ. Về công thức "1 phút time-out cho mỗi tuổi" (ví dụ 2 tuổi = 2 phút): đây LÀ hướng dẫn chính thức được AAP đăng tải, nhưng không có thử nghiệm nào kiểm chứng riêng công thức thời lượng này là tối ưu — nó hoạt động như một quy tắc thực hành dễ nhớ hơn là một liều lượng được chứng minh khoa học. Một số nghiên cứu cho thấy time-out ngắn (2-5 phút) hiệu quả tương đương thời gian dài hơn ở trẻ lớn hơn.

## Khen ngợi cụ thể hiệu quả hơn khen ngợi chung chung
Bằng chứng từ tâm lý học hành vi cho thấy khen ngợi CỤ THỂ (nêu rõ chính xác hành vi tốt, ví dụ "Con cất đồ chơi vào giỏ rất gọn gàng!") hiệu quả hơn khen ngợi chung chung ("Giỏi lắm!") trong việc tăng hành vi mong muốn — vì giúp trẻ biết chính xác hành động nào được công nhận. Phần lớn bằng chứng này đến từ nghiên cứu ở trẻ tuổi đi học/lâm sàng, cần thận trọng khi áp dụng trực tiếp cho nhóm 1-3 tuổi.

## Khung kỷ luật tổng thể của AAP
AAP đưa ra 10 nguyên tắc: làm gương hành vi mong muốn; đặt giới hạn rõ ràng, nhất quán; đưa ra hệ quả và thực hiện bình tĩnh; lắng nghe con trước khi giải quyết; dành sự chú ý cho hành vi tích cực; khen ngợi cụ thể; biết khi nào nên phớt lờ hành vi sai nhỏ (để hệ quả tự nhiên xảy ra nếu an toàn); chuẩn bị trước cho tình huống khó; chuyển hướng hành vi không phù hợp; và dùng time-out ngắn khi cần — hoàn toàn KHÔNG bao gồm đánh đòn hay trừng phạt bằng lời gây xấu hổ.`,
    category: "Nuôi dạy tích cực",
    stage: "TODDLER",
    minimumAgeDays: 366,
    maximumAgeDays: 1095,
    evidenceLevel: "STRONG",
    knowledgeType: scientific,
    sources: [sources.aapCorporalPunishment, sources.aapTimeOut, sources.aapDisciplineFramework],
  },
  {
    slug: "sang-loc-tu-ky-m-chat-18-24-thang",
    title: "Sàng lọc tự kỷ (M-CHAT) ở 18–24 tháng",
    summary: "AAP khuyến nghị sàng lọc tự kỷ cho MỌI trẻ ở 18 và 24 tháng bằng công cụ M-CHAT-R/F; USPSTF (Mỹ) lại cho rằng \"chưa đủ bằng chứng\" để khuyến nghị sàng lọc đại trà cho trẻ không có dấu hiệu nghi ngờ — một khác biệt thật giữa hai tổ chức; kết quả sàng lọc dương tính KHÔNG phải là chẩn đoán, chỉ là bước để đánh giá thêm.",
    content: `## Khuyến nghị của AAP
AAP khuyến nghị sàng lọc tự kỷ cho TẤT CẢ trẻ (không chỉ trẻ có dấu hiệu nghi ngờ) ở hai mốc: 18 THÁNG và 24 THÁNG, bằng công cụ M-CHAT-R/F (Bảng kiểm sàng lọc tự kỷ ở trẻ nhỏ, phiên bản sửa đổi/theo dõi) — gồm 20 câu hỏi có/không dành cho cha mẹ trả lời, cộng thêm phần phỏng vấn theo dõi nếu điểm ở mức trung bình.

## USPSTF: "chưa đủ bằng chứng" — một khác biệt thật
Đây là điểm khác biệt thật sự giữa hai cơ quan uy tín, chưa được giải quyết: USPSTF (Lực lượng đặc nhiệm dịch vụ dự phòng Hoa Kỳ) kết luận "chưa đủ bằng chứng để cân nhắc lợi ích và nguy cơ của việc sàng lọc tự kỷ ở trẻ 18-30 tháng KHÔNG có dấu hiệu nghi ngờ từ cha mẹ/người chăm sóc/nhân viên y tế" (xếp mức "I" - bằng chứng chưa đủ, không phải khuyến cáo phản đối). USPSTF ghi nhận công cụ sàng lọc CÓ THỂ phát hiện tự kỷ, nhưng bằng chứng trực tiếp về lợi ích của việc sàng lọc đại trà (so với chỉ sàng lọc khi có nghi ngờ) còn hạn chế. Trong khi đó, AAP vẫn giữ vững khuyến nghị sàng lọc cho mọi trẻ. Đây không phải lỗi của bên nào — chỉ là hai cách đánh giá khác nhau về cùng một bằng chứng.

## Kết quả dương tính KHÔNG phải là chẩn đoán
Đây là điều cha mẹ cần hiểu rõ: AAP nhấn mạnh "nếu con bạn có kết quả sàng lọc dương tính, điều đó không có nghĩa là con sẽ được chẩn đoán tự kỷ" — bác sĩ có thể hỏi thêm thông tin và/hoặc giới thiệu đến đánh giá chuyên sâu hơn. "Sàng lọc không giống với chẩn đoán tự kỷ."

## Một số dấu hiệu sớm CDC liệt kê theo tuổi
- 9 tháng: tránh/không giao tiếp mắt; không phản ứng khi gọi tên; không thể hiện cảm xúc trên khuôn mặt.
- 12 tháng: không chơi trò tương tác đơn giản (như ú òa/vỗ tay); dùng rất ít hoặc không dùng cử chỉ (như vẫy tay chào).
- 15 tháng: không chia sẻ sự thích thú với người khác (như chỉ cho xem đồ vật).
- 18 tháng: không chỉ tay để cho người khác xem điều thú vị.
- 24 tháng: không để ý khi người khác bị đau/buồn.
Ngoài ra còn nhóm hành vi lặp lại/thu hẹp: xếp đồ vật thành hàng, lặp lại từ ngữ, chơi lặp đi lặp lại với đồ chơi theo cùng một cách, phản ứng bất thường với cảm giác (âm thanh, ánh sáng, kết cấu).

## Nếu có lo lắng
Nếu có bất kỳ dấu hiệu nào ở trên hoặc cảm thấy lo lắng về sự phát triển của con, nên trao đổi với bác sĩ sớm — không cần chờ đến lịch khám 18/24 tháng, và không nên hoảng sợ nếu chỉ có một vài dấu hiệu đơn lẻ.`,
    category: "Phát triển",
    stage: "TODDLER",
    minimumAgeDays: 366,
    maximumAgeDays: 1095,
    evidenceLevel: "MODERATE",
    knowledgeType: scientific,
    sources: [sources.aapAutismScreening, sources.uspstfAutismScreening, sources.cdcAutismSigns, sources.cdcMilestone18mo],
  },
  {
    slug: "an-ca-bien-an-toan-khi-mang-thai",
    title: "Ăn cá biển an toàn khi mang thai: chọn loại nào, tránh loại nào",
    summary: "FDA/EPA chia cá thành 3 nhóm theo hàm lượng thủy ngân — nên ăn 2-3 khẩu phần/tuần nhóm \"lựa chọn tốt nhất\", hạn chế nhóm \"lựa chọn tốt\", tránh hẳn 7 loại cá thủy ngân cao (cá mập, cá kiếm, cá thu vua, cá marlin, cá orange roughy, cá ngừ mắt to, cá tilefish vùng Vịnh Mexico); cá sống/gỏi cá luôn cần tránh dù có đông lạnh.",
    content: `## Khi nào cần lưu ý
Cá là nguồn omega-3, protein và vi chất tốt cho thai kỳ, nhưng một số loại cá tích lũy thủy ngân — kim loại nặng có thể ảnh hưởng đến hệ thần kinh đang phát triển của thai nhi nếu ăn quá nhiều loại cá thủy ngân cao trong thời gian dài. Vấn đề không phải "cá có hại" mà là "chọn đúng loại và đúng lượng".

## 3 nhóm cá theo FDA/EPA
- **Lựa chọn tốt nhất** (ăn 2-3 khẩu phần/tuần, mỗi khẩu phần ~85-140g): cá hồi, cá cơm, cá trích, cá mòi, cá rô phi (tilapia), cá da trơn (catfish), tôm, cá tuyết (cod), cá minh thái (pollock).
- **Lựa chọn tốt** (ăn 1 khẩu phần/tuần): cá ngừ trắng đóng hộp (albacore), cá ngừ vây vàng, cá bơn (halibut), cá chẽm.
- **Tránh hẳn** (thủy ngân cao): cá mập, cá kiếm (swordfish), cá thu vua (king mackerel), cá marlin, cá orange roughy, cá ngừ mắt to (bigeye tuna), và cá tilefish đánh bắt ở vùng Vịnh Mexico (tilefish đánh bắt ở Đại Tây Dương lại nằm trong nhóm nên hạn chế, không phải nhóm tránh hẳn — đây là điểm dễ nhầm vì cùng tên loài nhưng khác vùng đánh bắt).

## Cá sống, gỏi cá — luôn cần tránh
NHS và FDA đều thống nhất: cá sống hoặc chưa nấu chín (sushi, sashimi, gỏi cá, hàu sống) cần tránh trong thai kỳ vì nguy cơ vi khuẩn/ký sinh trùng (Listeria, Vibrio...), **kể cả khi cá đã được đông lạnh trước đó** — đông lạnh diệt được một số ký sinh trùng nhưng không loại bỏ hoàn toàn rủi ro vi khuẩn.

## Lưu ý
Không cần loại bỏ hoàn toàn cá khỏi thực đơn — lợi ích dinh dưỡng của cá (đặc biệt omega-3 cho phát triển não thai nhi) là có thật và được khuyến khích, miễn là chọn đúng nhóm và nấu chín kỹ.`,
    category: "Dinh dưỡng thai kỳ",
    stage: "PREGNANCY",
    evidenceLevel: "STRONG",
    knowledgeType: scientific,
    sources: [sources.fdaEpaFishAdvice, sources.nhsFoodsToAvoidPregnancy, sources.acogSeafoodAdvisory2017],
  },
  {
    slug: "caffeine-khi-mang-thai",
    title: "Caffeine khi mang thai: giới hạn bao nhiêu là an toàn",
    summary: "ACOG và NHS đều đồng thuận ở ngưỡng dưới 200mg caffeine/ngày (khoảng 1 ly cà phê pha); tuy nhiên bằng chứng về việc hạn chế caffeine có thực sự thay đổi kết cục thai kỳ hay không vẫn còn xung đột — Cochrane 2015 không thấy khác biệt rõ, trong khi một số nghiên cứu quan sát mới hơn gợi ý nguy cơ tăng theo liều mà chưa xác định được ngưỡng an toàn tuyệt đối.",
    content: `## Khi nào cần lưu ý
Caffeine qua được nhau thai nhưng thai nhi/nhau thai chuyển hóa caffeine chậm hơn người lớn rất nhiều, nên caffeine có thể tích lũy. Đây là lý do các hướng dẫn khuyến cáo giới hạn lượng dùng thay vì cấm hoàn toàn.

## Ngưỡng khuyến nghị
ACOG và NHS thực ra **đồng thuận với nhau** ở mức dưới 200mg/ngày (khoảng một ly cà phê pha 240ml, hoặc 2 ly cà phê hòa tan) — đây không phải là ba con số khác nhau như đôi khi được truyền miệng, mà là một ngưỡng tương đối thống nhất giữa hai cơ quan lớn.

## Điểm CONFLICTING_EVIDENCE: hạn chế caffeine có thực sự thay đổi kết cục không?
Đây là điểm cần nói rõ: một tổng quan Cochrane (2015) xem xét các thử nghiệm hạn chế caffeine không tìm thấy khác biệt rõ ràng về cân nặng lúc sinh hay các kết cục thai kỳ khác so với nhóm không hạn chế. Trong khi đó, một số nghiên cứu quan sát mới hơn gợi ý mối liên hệ giữa lượng caffeine cao và nguy cơ sảy thai/thai nhẹ cân tăng dần theo liều, nhưng **chưa xác định được một ngưỡng "an toàn tuyệt đối"** vì đây là dữ liệu quan sát, không phải thử nghiệm đối chứng — nghĩa là chưa thể khẳng định chắc chắn quan hệ nhân quả. Cách tiếp cận thận trọng phổ biến hiện nay là giữ dưới 200mg/ngày trong khi chờ thêm bằng chứng.

## Lưu ý
Caffeine không chỉ có trong cà phê — trà, nước ngọt có ga, nước tăng lực, sô-cô-la đều có caffeine và nên được tính gộp vào tổng lượng trong ngày.`,
    category: "Dinh dưỡng thai kỳ",
    stage: "PREGNANCY",
    evidenceLevel: "MODERATE",
    knowledgeType: scientific,
    sources: [sources.nhsFoodsToAvoidPregnancy, sources.cochraneCaffeinePregnancy],
  },
  {
    slug: "iot-khi-mang-thai-va-cho-con-bu",
    title: "I-ốt khi mang thai và cho con bú: vì sao quan trọng, và điểm đáng lo ở Việt Nam",
    summary: "I-ốt cần cho hormone tuyến giáp điều khiển phát triển não thai nhi; thiếu i-ốt nặng gây tổn thương não không hồi phục. Các cơ quan đưa ra con số khuyến nghị khác nhau (WHO 250mcg/ngày, CDC/NIH Hoa Kỳ 220-290mcg/ngày) nhưng đều thống nhất nhu cầu tăng đáng kể so với người trưởng thành thường; đáng chú ý, khảo sát dinh dưỡng quốc gia Việt Nam gần nhất cho thấy phụ nữ mang thai vẫn ở dưới ngưỡng đủ i-ốt của WHO.",
    content: `## Vì sao i-ốt quan trọng
I-ốt là thành phần thiết yếu để cơ thể tạo hormone tuyến giáp (T3, T4) — hormone này điều khiển sự phát triển não bộ và hệ thần kinh của thai nhi. Thiếu i-ốt nặng trong thai kỳ là một trong những nguyên nhân có thể phòng ngừa được gây tổn thương não ở trẻ, được xác nhận qua các nghiên cứu can thiệp từ nhiều thập niên trước.

## Điểm CONFLICTING_EVIDENCE: con số khuyến nghị khác nhau giữa các cơ quan
Đây là điểm chưa thống nhất, không phải sai sót: CDC/Viện Y tế Quốc gia Hoa Kỳ khuyến nghị 220mcg/ngày khi mang thai và 290mcg/ngày khi cho con bú; WHO lại dùng mức 250mcg/ngày cho thai kỳ; Hiệp hội Tuyến giáp Hoa Kỳ khuyến nghị bổ sung thêm 150mcg/ngày từ viên uống ngoài chế độ ăn. Các con số không giống nhau tuyệt đối, nhưng đều đồng thuận: nhu cầu i-ốt khi mang thai/cho con bú **cao hơn đáng kể** so với người trưởng thành bình thường (~150mcg/ngày).

## Nguồn thực phẩm giàu i-ốt
Muối i-ốt, sữa và chế phẩm từ sữa, hải sản, trứng. Rong biển rất giàu i-ốt nhưng NHS khuyến cáo không ăn quá 1 lần/tuần vì nguy cơ dư thừa i-ốt (ngưỡng dung nạp tối đa khoảng 1.100mcg/ngày cho phụ nữ mang thai/cho con bú).

## Điểm đáng chú ý cho Việt Nam
Việt Nam từng có chương trình muối i-ốt bắt buộc thành công (đến 2005, hơn 90% hộ gia đình dùng muối đủ i-ốt), nhưng sau khi luật đổi thành tự nguyện, tỷ lệ hộ dùng muối đủ i-ốt giảm mạnh. Theo Khảo sát Dinh dưỡng Quốc gia Việt Nam gần nhất, mức i-ốt niệu trung vị ở phụ nữ mang thai (85,3 mcg/L, vùng núi nông thôn chỉ 65,6 mcg/L) **vẫn thấp hơn ngưỡng đủ i-ốt của WHO cho thai kỳ (150-249 mcg/L)** — đây là dữ liệu khảo sát thực tế, không phải suy đoán, và là lý do các bác sĩ Việt Nam thường khuyên bổ sung viên uống có i-ốt khi mang thai thay vì chỉ dựa vào chế độ ăn.

## Lưu ý
Nên hỏi bác sĩ về viên bổ sung có i-ốt phù hợp, đặc biệt nếu ăn ít muối i-ốt, ít hải sản/sữa, hoặc theo chế độ ăn chay.`,
    category: "Dinh dưỡng thai kỳ",
    stage: "PREGNANCY",
    evidenceLevel: "STRONG",
    knowledgeType: scientific,
    sources: [sources.cdcIodineBreastfeeding, sources.ataIodinePregnancy, sources.ignVietnamIodine],
  },
  {
    slug: "choline-duong-chat-de-bi-bo-quen-khi-mang-thai",
    title: "Choline: dưỡng chất quan trọng nhưng thường vắng mặt trong viên vitamin bầu",
    summary: "Viện Hàn lâm Khoa học Hoa Kỳ khuyến nghị 450mg choline/ngày khi mang thai và 550mg/ngày khi cho con bú, hỗ trợ phát triển não/tủy sống thai nhi và chức năng nhau thai; một tổng quan bình duyệt 2019 ghi nhận choline \"vắng mặt trong hầu hết viên vitamin bầu trên thị trường\" và dưới 10% phụ nữ mang thai đạt đủ lượng khuyến nghị qua ăn uống.",
    content: `## Khi nào cần lưu ý
Choline hỗ trợ phát triển não bộ, tủy sống và chức năng nhau thai trong thai kỳ. Đây là một dưỡng chất quan trọng nhưng ít được nhắc đến so với axit folic, sắt hay canxi.

## Lượng khuyến nghị
Viện Hàn lâm Khoa học Hoa Kỳ (National Academies) khuyến nghị: 425mg/ngày cho phụ nữ trưởng thành không mang thai, **450mg/ngày khi mang thai**, **550mg/ngày khi cho con bú**. Ngưỡng dung nạp tối đa là 3.500mg/ngày cho người lớn.

## Điểm đáng lưu ý: viên vitamin bầu thường thiếu choline
Một tổng quan bình duyệt trên tạp chí Nutrients (2019) nêu rõ: "choline vắng mặt trong hầu hết các viên vitamin bầu hiện có trên thị trường, và dưới 10% phụ nữ mang thai đạt được mức khuyến nghị". Đây là lý do nên chủ động bổ sung choline qua thực phẩm thay vì mặc định viên vitamin bầu đã cung cấp đủ.

## Nguồn thực phẩm giàu choline
Trứng (đặc biệt lòng đỏ), thịt (gà, bò), sữa, đậu nành, đậu phộng.

## Mức độ bằng chứng
Con số khuyến nghị (450/550mg) được xác nhận trực tiếp từ báo cáo gốc của Viện Hàn lâm Khoa học Hoa Kỳ — bằng chứng STRONG. Tuy nhiên, lợi ích lâm sàng cụ thể (ví dụ cải thiện điểm phát triển nhận thức) chủ yếu đến từ nghiên cứu trên động vật và một số nghiên cứu người còn hạn chế — chính tài liệu gốc cũng ghi nhận "cần thêm nghiên cứu trên người".`,
    category: "Dinh dưỡng thai kỳ",
    stage: "PREGNANCY",
    evidenceLevel: "MODERATE",
    knowledgeType: scientific,
    sources: [sources.nationalAcademiesCholineB12, sources.cholineNutrientsReview2019],
  },
  {
    slug: "vitamin-b12-va-che-do-an-chay-khi-mang-thai",
    title: "Vitamin B12 khi mang thai, cho con bú và chế độ ăn chay/thuần chay",
    summary: "B12 cần cho phát triển thần kinh của thai nhi/trẻ sơ sinh; CDC nêu rõ thiếu B12 không điều trị ở trẻ sơ sinh \"có thể gây tổn thương não vĩnh viễn\". Phụ nữ ăn chay/thuần chay là nhóm nguy cơ cao nhất được xác định rõ ràng; khảo sát dinh dưỡng Việt Nam 2012 ghi nhận 12% phụ nữ trong độ tuổi sinh sản thiếu B12.",
    content: `## Vì sao B12 quan trọng
B12 cần thiết cho phát triển thần kinh của thai nhi và truyền qua nhau thai cũng như sữa mẹ. CDC nêu rõ: "nếu không được điều trị, thiếu vitamin B12 ở trẻ sơ sinh có thể gây tổn thương não vĩnh viễn."

## Lượng khuyến nghị
Theo Viện Hàn lâm Khoa học Hoa Kỳ: 2,4mcg/ngày cho người trưởng thành, 2,6mcg/ngày khi mang thai, 2,8mcg/ngày khi cho con bú.

## Nhóm nguy cơ cao: ăn chay/thuần chay
CDC nêu rõ: "trẻ bú mẹ hoàn toàn từ những bà mẹ không ăn sản phẩm động vật có nguy cơ thiếu vitamin B12 cao hơn ngay sau sinh". Đây là nhóm nguy cơ được xác định rõ ràng nhất, cùng với người có bệnh lý ảnh hưởng hấp thu (thiếu máu ác tính, sau phẫu thuật dạ dày...). CDC khuyến nghị mẹ ăn chay/thuần chay khi cho con bú nên hỏi bác sĩ về việc bổ sung viên B12 phù hợp (CDC không đưa ra một con số cụ thể trên trang này).

## Điểm đáng chú ý cho Việt Nam
Khảo sát dinh dưỡng quốc gia bình duyệt năm 2012 trên 505 phụ nữ trong độ tuổi sinh sản tại Việt Nam ghi nhận **12% thiếu B12** (cộng 4% ở mức ranh giới) — theo các tác giả, con số này "cao gấp đôi ngưỡng được xem là vấn đề sức khỏe cộng đồng", cho thấy thiếu B12 không chỉ là vấn đề riêng của người ăn chay mà là một khoảng trống dinh dưỡng đáng chú ý ở quy mô dân số.

## Lưu ý
Nếu ăn chay/thuần chay hoặc ăn ít sản phẩm động vật, nên trao đổi với bác sĩ về xét nghiệm và bổ sung B12 trong thai kỳ và khi cho con bú.`,
    category: "Dinh dưỡng thai kỳ",
    stage: "PREGNANCY",
    evidenceLevel: "STRONG",
    knowledgeType: scientific,
    sources: [sources.cdcVitaminB12Breastfeeding, sources.nationalAcademiesCholineB12, sources.plosOneVietnamMicronutrient2012, sources.niceNg247MaternalNutrition],
  },
  {
    slug: "thao-duoc-khi-mang-thai-nhung-dieu-can-biet",
    title: "Thảo dược khi mang thai: gừng, trà lá mâm xôi, hoa cúc, echinacea — biết gì, chưa biết gì",
    summary: "Thảo dược được quản lý như thực phẩm chức năng, không phải thuốc — nghĩa là không bắt buộc chứng minh an toàn/hiệu quả trước khi bán; gừng có bằng chứng an toàn tương đối tốt nhất trong nhóm này, còn hiệu quả của trà lá mâm xôi giúp \"chuẩn bị chuyển dạ\" chưa được chứng minh, và độ an toàn của hoa cúc khi mang thai/cho con bú hiện \"chưa được biết rõ\" theo chính nguồn NIH.",
    content: `## Khi nào cần lưu ý
Thảo dược ở Mỹ/nhiều nước được quản lý như thực phẩm chức năng chứ không phải thuốc — nghĩa là nhà sản xuất không bắt buộc phải chứng minh an toàn hoặc hiệu quả trước khi bán ra thị trường, và chất lượng/nồng độ hoạt chất có thể không đồng đều giữa các sản phẩm. Đây là lý do các hướng dẫn y tế đều khuyên nên báo với bác sĩ trước khi dùng bất kỳ thảo dược nào khi mang thai.

## Gừng — bằng chứng an toàn tương đối tốt
Nhiều nghiên cứu dùng trung bình khoảng 1.000mg gừng/ngày không ghi nhận tăng nguy cơ dị tật bẩm sinh hay sảy thai. Đây là thảo dược có dữ liệu an toàn tốt nhất trong nhóm được xem xét ở đây. Lưu ý: gừng có thể tương tác thuốc hạ huyết áp/chống đông máu, và ở liều cao có thể hạ đường huyết.

## Trà lá mâm xôi (raspberry leaf) — chưa chứng minh hiệu quả "chuẩn bị chuyển dạ"
Đây là cách dùng truyền thống phổ biến, nhưng một tổng quan hệ thống tổng hợp các nghiên cứu trong phòng thí nghiệm, trên động vật và trên người kết luận: "các nghiên cứu trên người chưa cho thấy có hại hay có lợi rõ ràng", với một nghiên cứu nhỏ cho thấy xu hướng rút ngắn giai đoạn 2 của chuyển dạ nhưng không có ý nghĩa thống kê. Không có tổng quan Cochrane riêng về chủ đề này — bằng chứng hiện có còn yếu và cũ.

## Hoa cúc (chamomile) — độ an toàn "chưa được biết"
NCCIH (Trung tâm Y học Bổ sung/Tích hợp Quốc gia Hoa Kỳ, thuộc NIH) nêu rõ: "còn biết rất ít về việc dùng hoa cúc có an toàn hay không khi mang thai hoặc cho con bú". Đây là khoảng trống dữ liệu được chính nguồn chính thức thừa nhận, không phải lời khuyên tránh dùng hay khuyến khích dùng.

## Echinacea — dữ liệu trái chiều giữa động vật và người
Nghiên cứu trên động vật gợi ý echinacea "có thể tăng nguy cơ sảy thai", nhưng một nghiên cứu nhỏ trên người không thấy tăng nguy cơ; dữ liệu trên hơn 350 thai kỳ phơi nhiễm không thấy tăng sinh non/nhẹ cân. Một số chế phẩm echinacea từng được phát hiện nhiễm kim loại nặng (chì). Đây là điểm bằng chứng chưa nhất quán, được chính nguồn nêu rõ chứ không cố gắng giải quyết một chiều.

## Lưu ý chung
"Thảo dược generally không được khuyến khích dùng khi mang thai trừ khi có chỉ định và theo dõi của bác sĩ để điều trị một tình trạng cụ thể" (MotherToBaby). Nên luôn báo cho bác sĩ/nữ hộ sinh biết mọi thảo dược hoặc thực phẩm chức năng đang dùng.`,
    category: "Dinh dưỡng thai kỳ",
    stage: "PREGNANCY",
    evidenceLevel: "LIMITED",
    knowledgeType: scientific,
    sources: [sources.motherToBabyHerbalProducts, sources.motherToBabyGinger, sources.motherToBabyEchinacea, sources.nccihChamomile, sources.raspberryLeafReview],
  },
  {
    slug: "thao-duoc-loi-sua-that-hu",
    title: "Thảo dược \"lợi sữa\" (cỏ cà ri...): thực hư về hiệu quả tăng lượng sữa",
    summary: "Tổng quan Cochrane 2020 (41 thử nghiệm, hơn 3.000 bà mẹ) chỉ tìm thấy bằng chứng độ tin cậy THẤP về hiệu quả tăng lượng sữa của mọi loại \"galactagogue\" — cả thảo dược (cỏ cà ri, hoa chuối, thì là...) lẫn thuốc; cỏ cà ri có thể ảnh hưởng tuyến giáp theo mô hình động vật nhưng chưa có nghiên cứu nào kiểm tra trực tiếp trên người đang cho con bú.",
    content: `## Khi nào cần lưu ý
Nhiều mẹ tìm đến thảo dược "lợi sữa" khi lo lắng về lượng sữa. Trước khi dùng, nên biết bằng chứng khoa học hiện có nói gì — và quan trọng hơn, nên tìm hiểu nguyên nhân thực sự khiến lượng sữa giảm (tần suất bú/hút, kỹ thuật ngậm bắt vú...) trước khi dùng thảo dược.

## Bằng chứng độ tin cậy thấp cho MỌI loại galactagogue
Tổng quan Cochrane 2020 — tổng hợp 41 thử nghiệm ngẫu nhiên có đối chứng, hơn 3.000 bà mẹ tại 17+ quốc gia — kết luận: chỉ có "bằng chứng độ tin cậy thấp về hiệu quả của các chất lợi sữa, cả tự nhiên (cỏ cà ri, hoa chuối, thì là, gừng, chùm ngây, chà là) lẫn dược phẩm, trong việc tăng lượng sữa mẹ". Đây không phải là "không hiệu quả" mà là "chưa có đủ bằng chứng chất lượng cao để khẳng định hiệu quả" — một điểm khác biệt quan trọng.

## Cỏ cà ri và tuyến giáp — khoảng trống an toàn chưa được nghiên cứu
Mô hình động vật gợi ý cỏ cà ri có thể có tác động làm giảm hormone tuyến giáp; chưa rõ điều này có áp dụng cho người hay không. Điểm đáng chú ý: "chưa có nghiên cứu nào tính đến thời điểm hiện tại sàng lọc hoặc báo cáo về tác dụng phụ tiềm ẩn này" ở người — đây là một khoảng trống an toàn được nêu rõ, không phải một rủi ro đã được xác nhận.

## Lưu ý
Các hướng dẫn hiệp hội chuyên khoa (được trích dẫn qua nguồn thứ cấp, chưa xác minh trực tiếp từ trang gốc ACOG do lỗi truy cập) được cho là khuyến cáo không xem galactagogue là điều trị hàng đầu cho vấn đề ít sữa, vì bằng chứng hiệu quả còn chưa rõ ràng và mọi hoạt chất đều có khả năng tác dụng phụ. Nên ưu tiên đánh giá và cải thiện kỹ thuật cho bú/hút sữa trước, và trao đổi với chuyên gia tư vấn sữa mẹ hoặc bác sĩ trước khi dùng bất kỳ thảo dược lợi sữa nào.`,
    category: "Nuôi con bằng sữa mẹ",
    stage: "POSTPARTUM",
    evidenceLevel: "LIMITED",
    knowledgeType: traditional,
    sources: [sources.cochraneGalactagogues2020],
  },
  {
    slug: "chat-tao-ngot-nhan-tao-khi-mang-thai-cho-con-bu",
    title: "Chất tạo ngọt nhân tạo (đường ăn kiêng) khi mang thai và cho con bú",
    summary: "FDA xem 6 chất tạo ngọt cường độ cao đã được phê duyệt là an toàn cho cộng đồng chung, bao gồm phụ nữ mang thai, trong giới hạn lượng ăn vào chấp nhận được; tuy nhiên WHO (2023) lại khuyến cáo KHÔNG nên dùng chất tạo ngọt không đường để kiểm soát cân nặng/giảm nguy cơ bệnh — cho mọi người, kể cả phụ nữ mang thai — dựa trên tín hiệu từ các nghiên cứu quan sát độ tin cậy thấp. Đây là một khác biệt thật giữa hai cơ quan, được trình bày ở đây mà không thiên vị bên nào.",
    content: `## Khi nào cần lưu ý
Chất tạo ngọt nhân tạo (aspartame, sucralose, saccharin...) thường được cho là lựa chọn thay thế đường, nhưng độ an toàn khi mang thai/cho con bú vẫn có những góc nhìn khác nhau giữa các cơ quan y tế lớn.

## FDA: an toàn trong giới hạn cho phép, có một ngoại lệ rõ ràng
FDA khẳng định các chất tạo ngọt cường độ cao đã phê duyệt (saccharin, aspartame, acesulfame potassium, sucralose, neotame, advantame) "an toàn cho cộng đồng chung trong những điều kiện sử dụng nhất định" — không có tuyên bố riêng về thai kỳ trên trang chính thức này. Ngoại lệ rõ ràng duy nhất: người mắc bệnh phenylketon niệu (PKU) — một rối loạn di truyền hiếm gặp — cần tránh/hạn chế aspartame vì khó chuyển hóa phenylalanine, và nhãn sản phẩm chứa aspartame bắt buộc phải cảnh báo điều này.

## Điểm CONFLICTING_EVIDENCE: WHO khuyến cáo khác hướng
WHO (hướng dẫn tháng 5/2023) khuyến cáo KHÔNG nên dùng chất tạo ngọt không đường để kiểm soát cân nặng hoặc giảm nguy cơ bệnh không lây nhiễm — khuyến cáo này áp dụng cho "mọi người, bao gồm phụ nữ mang thai và cho con bú". WHO nêu rõ bằng chứng ở trẻ em và phụ nữ mang thai "còn hạn chế", dẫn ra một số nghiên cứu quan sát ghi nhận liên hệ giữa dùng chất tạo ngọt khi mang thai và tăng nguy cơ hen suyễn/dị ứng, giảm điểm nhận thức ở con (độ tin cậy rất thấp), và một phân tích gộp 3 nghiên cứu ghi nhận tăng nguy cơ sinh non (độ tin cậy thấp) — không ghi nhận liên hệ với đái tháo đường thai kỳ. Đây là khác biệt thật về cách diễn giải cùng một mảng bằng chứng, không phải sai sót của bên nào — được trình bày ở đây cho cha mẹ tự cân nhắc cùng bác sĩ.

## Khi cho con bú
Một nghiên cứu lâm sàng (2022) đo trực tiếp cho thấy một số chất tạo ngọt (acesulfame-potassium, saccharin, cyclamate) có truyền vào sữa mẹ sau khi mẹ dùng, nhưng ở mức các tác giả kết luận không đáng lo ở lượng dùng thông thường; sucralose không phát hiện được trong sữa mẹ ở nghiên cứu này. Các tác giả cũng nêu rõ: nghiên cứu này "không kết luận rằng dùng dưới ngưỡng cho phép là lành mạnh hay nên khuyến khích" — chỉ là không thấy tín hiệu nguy hại cấp tính.

## Lưu ý
Chưa có hướng dẫn riêng biệt cho việc cho con bú từ FDA/NHS/ACOG ngoài khuyến cáo chung cho cộng đồng; nên trao đổi với bác sĩ nếu dùng thường xuyên, đặc biệt nếu đang cân nhắc giữa mục tiêu kiểm soát cân nặng và khuyến cáo của WHO.`,
    category: "Dinh dưỡng thai kỳ",
    stage: "PREGNANCY",
    evidenceLevel: "MODERATE",
    knowledgeType: scientific,
    sources: [sources.fdaHighIntensitySweeteners, sources.whoNonSugarSweeteners2023, sources.sweetenersInMilkNutrients2022],
  },
  {
    slug: "rau-ngot-dua-du-du-xanh-khi-mang-thai-that-hu",
    title: "Rau ngót, dứa, đu đủ xanh khi mang thai: thực hư quan niệm dân gian",
    summary: "Rau ngót được cho là chứa papaverine (chất giãn cơ trơn) — có cơ sở hóa thực vật nhưng chưa có nghiên cứu trên người xác nhận nguy cơ sảy thai; dứa/bromelain không gây sảy thai ở lượng ăn thông thường theo NHS/ACOG (chỉ là quan ngại lý thuyết ở liều bromelain cô đặc rất cao); đu đủ XANH/chưa chín có bằng chứng từ mô hình chuột cho thấy nhựa mủ có thể gây co bóp tử cung, trong khi đu đủ CHÍN không cho thấy tác dụng này — đây là bằng chứng thực nghiệm, chưa có nghiên cứu lâm sàng trên người.",
    content: `## Rau ngót — có cơ sở hóa học nhưng chưa có bằng chứng người
Rau ngót được ghi nhận trong y văn có chứa một alkaloid được xác định là "papaverine" (chất giãn cơ trơn) từ một xét nghiệm hóa thực vật cũ; đây là cơ sở cho lời khuyên dân gian tránh ăn nhiều/uống nước ép đậm đặc rau ngót trong 3 tháng đầu. Tuy nhiên: (1) chưa có nghiên cứu hóa học hiện đại nào xác nhận chắc chắn hoạt chất này giống hệt papaverine dược phẩm; (2) một nghiên cứu dân số lớn (hơn 254.000 thai kỳ) về THUỐC papaverine không tìm thấy liên hệ với dị tật bẩm sinh; (3) **chưa có nghiên cứu lâm sàng nào trên người** kiểm tra trực tiếp việc ăn/uống rau ngót và nguy cơ sảy thai. Mức độ bằng chứng: LIMITED/TRADITIONAL — có cơ sở hóa thực vật hợp lý, chưa được kiểm chứng bằng nghiên cứu kết cục trên người.

## Dứa (thơm) — quan niệm dân gian không được NHS/ACOG xác nhận
NHS và ACOG đều không liệt dứa vào danh sách thực phẩm cần tránh khi mang thai. Một quả dứa nguyên chứa khoảng 40mg bromelain (tập trung nhiều ở lõi/thân), trong khi một khẩu phần ăn thông thường (một cốc dứa cắt miếng) chỉ chứa một phần rất nhỏ trong số đó — để đạt liều bromelain cô đặc được dùng trong các nghiên cứu về co bóp tử cung sẽ cần ăn khoảng 7-10 quả dứa nguyên cùng lúc. Có một nghiên cứu quan sát mới (2026, Nigeria, ~2.400 sản phụ) ghi nhận liên hệ giữa ăn dứa 3 tháng cuối và rút ngắn thời gian chuyển dạ/tăng sinh thường — đây là dữ liệu quan sát chưa qua thử nghiệm đối chứng ngẫu nhiên, nên chưa thể khẳng định nhân quả, và đây là câu hỏi KHÁC với quan niệm dân gian "dứa gây sảy thai" (không có bằng chứng cho quan niệm sảy thai).

## Đu đủ — CẦN phân biệt chín và xanh
Đây là chủ đề có bằng chứng thực nghiệm rõ nhất trong nhóm này: một nghiên cứu trên mô hình chuột (2002) cho thấy nước ép đu đủ CHÍN không gây co bóp tử cung đáng kể, trong khi nhựa mủ thô từ đu đủ XANH/chưa chín gây co bóp tử cung dạng co thắt tương tự oxytocin/prostaglandin — ở tử cung chuột gần đủ tháng, biểu hiện như cơn co cứng. Kết luận của chính nghiên cứu: ăn đu đủ CHÍN bình thường "có thể không gây nguy hiểm đáng kể", còn đu đủ XANH/ương ương (cô đặc nhựa mủ nhiều hơn) "có thể không an toàn khi mang thai". Giới hạn quan trọng: đây là nghiên cứu trên chuột, chưa có nghiên cứu lâm sàng trên người xác nhận, và chưa rõ việc nấu chín đu đủ xanh (như trong món gỏi đu đủ, canh đu đủ) có làm giảm hoạt tính nhựa mủ hay không.

## Lưu ý
Với cả 3 loại thực phẩm này, mức độ thận trọng hợp lý là: ăn ở lượng thông thường trong bữa ăn hàng ngày không có bằng chứng gây hại rõ ràng; nếu có tiền sử sảy thai/dọa sảy hoặc lo lắng, nên hỏi ý kiến bác sĩ sản khoa thay vì tự quyết định dựa trên quan niệm dân gian hoặc tự suy diễn từ một nghiên cứu đơn lẻ.`,
    category: "Quan niệm dân gian",
    stage: "PREGNANCY",
    evidenceLevel: "TRADITIONAL",
    knowledgeType: traditional,
    sources: [sources.rauNgotEthnopharmacolReview2020, sources.papayaRatModel2002, sources.pineappleNhsMyth],
  },
  {
    slug: "nuoc-dua-me-den-hai-san-co-vo-khi-mang-thai",
    title: "Nước dừa, mè đen, hải sản có vỏ khi mang thai: đâu là sự thật",
    summary: "Nước dừa không phải \"thức uống thần kỳ\" giúp nước ối trong/da bé đẹp như đồn — một tổng quan 2024 gọi thẳng đây là quan niệm phóng đại, dù có tín hiệu ban đầu về giảm buồn nôn; mè đen chưa có bằng chứng khoa học cho tác dụng lợi sữa/tóc dù giàu dinh dưỡng; hải sản có vỏ CHÍN kỹ an toàn — vấn đề thật sự là nấu chín, không phải \"tính hàn\" theo quan niệm dân gian.",
    content: `## Nước dừa — không phải "thức uống thần kỳ" nhưng cũng không có hại
Quan niệm dân gian cho rằng nước dừa giúp nước ối trong hơn hoặc da em bé đẹp hơn. Một tổng quan bình duyệt năm 2024 trên Pakistan Journal of Medical Sciences kết luận thẳng: nước dừa là thức uống bổ dưỡng có thể là một phần của chế độ ăn lành mạnh khi mang thai, **nhưng không phải là "thức uống thần kỳ"** — tức là bác bỏ trực tiếp khung hình phóng đại này. Có tín hiệu ban đầu (một số nghiên cứu nhỏ) cho thấy nước dừa có thể giúp giảm buồn nôn/bù nước trong 3 tháng đầu, nhưng đây là bằng chứng còn hạn chế, cần thêm nghiên cứu lớn hơn để xác nhận. Không tìm thấy bằng chứng nào ủng hộ HAY bác bỏ quan niệm "uống nước dừa đầu thai kỳ có hại" — đây đơn giản là chủ đề chưa được các cơ quan y tế lớn (NHS/ACOG/WHO) đề cập đến.

## Mè đen (vừng đen) — bổ dưỡng nhưng chưa có bằng chứng cho tác dụng lợi sữa/tóc
Mè đen giàu canxi, chất béo tốt và lignan (hoạt chất chống oxy hóa). Tuy nhiên, các cơ sở dữ liệu về an toàn thuốc/thực phẩm khi cho con bú (như e-lactancia) nêu rõ: chưa có dữ liệu công bố về việc mè đen bài tiết qua sữa mẹ, và **chưa có bằng chứng nào chứng minh tác dụng lợi sữa** dù được dùng truyền thống ở nhiều nền văn hóa (bao gồm các món "chân giò mè đen" hậu sản). Tương tự, không tìm thấy nghiên cứu nào về tác dụng với tóc của mẹ hoặc bé. Đây là quan niệm truyền thống chưa được kiểm chứng khoa học theo cả hai chiều — không phải "đã được chứng minh sai" mà là "chưa được nghiên cứu".

## Hải sản có vỏ — vấn đề thật là NẤU CHÍN, không phải "tính hàn"
FDA, ACOG và NHS đều đồng thuận rõ ràng: hải sản có vỏ (nghêu, sò, hàu, trai) SỐNG hoặc CHƯA NẤU CHÍN mang nguy cơ thật từ vi khuẩn/vi-rút (Vibrio, Listeria, norovirus...) có thể gây bệnh nặng cho mẹ và biến chứng thai kỳ — đây là lý do chính đáng để thận trọng, nhưng cơ chế là an toàn thực phẩm, không phải "tính hàn/tanh" theo khung lý luận âm dương truyền thống. Hải sản có vỏ NẤU CHÍN KỸ (nghêu/sò/hàu mở miệng khi hấp, đạt nhiệt độ khoảng 63°C) được xem là thực phẩm an toàn, giàu dinh dưỡng và có thể ăn trong thai kỳ.

## Lưu ý
Với cả nước dừa và mè đen, nên hiểu đây là thực phẩm bổ dưỡng nói chung chứ không phải "thuốc" có tác dụng cụ thể đã được chứng minh — ăn/uống ở lượng vừa phải là hợp lý mà không cần kỳ vọng hiệu quả thần kỳ. Với hải sản có vỏ, quy tắc an toàn quan trọng nhất là luôn nấu chín kỹ.`,
    category: "Quan niệm dân gian",
    stage: "PREGNANCY",
    evidenceLevel: "TRADITIONAL",
    knowledgeType: traditional,
    sources: [sources.coconutWaterReview2024, sources.acogSeafoodAdvisory2017, sources.fdaEpaFishAdvice],
  },
  {
    slug: "do-cay-do-lanh-khi-mang-thai",
    title: "Đồ cay, đồ lạnh khi mang thai: khoa học nói gì",
    summary: "Danh sách thực phẩm cần tránh chính thức của NHS không hề nhắc đến đồ cay — mối lo thực sự (nếu có) là đồ cay có thể làm nặng thêm chứng ợ nóng vốn đã phổ biến hơn khi mang thai do progesterone, không phải nguy cơ cho thai nhi; còn quan niệm về đồ lạnh/nước đá gây hại là niềm tin theo lý luận âm dương truyền thống mà khoa học hiện đại chưa (và cũng chưa từng) nghiên cứu theo hướng nào.",
    content: `## Đồ cay — không có trong danh sách cần tránh chính thức
Trang hướng dẫn "thực phẩm cần tránh khi mang thai" của NHS (danh sách chính thức, cập nhật thường xuyên) hoàn toàn không nhắc đến đồ cay. Điều này khớp với việc capsaicin (hoạt chất cay trong ớt) không được ghi nhận qua nhau thai theo cách gây hại cho thai nhi, không liên quan đến sảy thai hay sinh non trong y văn hiện có.

## Vậy vì sao vẫn có lời khuyên "hạn chế đồ cay"?
Đây là vấn đề THOẢI MÁI của mẹ, không phải AN TOÀN của thai nhi: progesterone tăng cao khi mang thai làm giãn cơ vòng thực quản dưới, khiến chứng trào ngược/ợ nóng dễ xảy ra hơn ở tam cá nguyệt 2-3; đồ cay (cùng với đồ nhiều dầu mỡ, đồ chua) là tác nhân phổ biến làm nặng thêm triệu chứng ợ nóng ở nhiều người, mang thai hay không. Lời khuyên "hạn chế nếu làm ợ nóng nặng hơn" xuất phát từ đây, không phải từ nguy cơ cho thai nhi.

## Đồ lạnh, nước đá — niềm tin dân gian chưa được khoa học đề cập đến (cả hai chiều)
Đây là điểm cần nói thẳng: không giống nhiều quan niệm dân gian khác đã được nghiên cứu và bác bỏ, quan niệm "đồ lạnh gây hại cho mẹ/bé" theo lý luận âm dương/hàn-nhiệt **chưa từng được các cơ quan y tế lớn (NHS/ACOG/CDC/WHO) nghiên cứu hoặc đề cập đến theo bất kỳ hướng nào** — không phải vì đã bị bác bỏ, mà vì đây đơn giản không phải là một phạm trù mà y học hiện đại xem xét. Về mặt sinh lý cơ bản, đồ uống lạnh cân bằng nhiệt độ với cơ thể trước khi vào hệ tuần hoàn nên chưa có cơ chế sinh học nào được đề xuất cho việc gây hại — nhưng đây là lý luận suy đoán, không phải một nghiên cứu trực tiếp bác bỏ niềm tin này.

## Lưu ý
Nên phân biệt hai điều: (1) an toàn cho thai nhi — không có bằng chứng đồ cay/đồ lạnh gây hại; (2) sự thoải mái của mẹ — nếu đồ cay khiến mẹ khó chịu vì ợ nóng, việc hạn chế là hợp lý cho chính mẹ, không phải vì lý do thai nhi.`,
    category: "Quan niệm dân gian",
    stage: "PREGNANCY",
    evidenceLevel: "TRADITIONAL",
    knowledgeType: traditional,
    sources: [sources.nhsFoodsToAvoidPregnancy],
  },
  {
    slug: "che-do-an-cua-me-anh-huong-den-be-bu-me-nhu-the-nao",
    title: "Mẹ ăn gì có thực sự ảnh hưởng đến bé bú mẹ không?",
    summary: "NHS/CDC/La Leche League đều khẳng định mẹ KHÔNG cần kiêng khem đặc biệt khi cho con bú và không có danh sách thực phẩm cần tránh mặc định; tuy nhiên có một hiện tượng hẹp, thật và đã được y văn xác nhận — dị ứng đạm sữa bò qua sữa mẹ (viêm đại tràng dị ứng), biểu hiện bằng máu/nhầy trong phân, khác hẳn với quan niệm dân gian \"mẹ ăn gì con bị vậy\" cho mọi loại thực phẩm.",
    content: `## Khuyến cáo chính thức: không cần kiêng khem đặc biệt
NHS nêu rõ: "bạn không cần theo một chế độ ăn đặc biệt nào khi cho con bú." CDC tương tự: "nhìn chung, phụ nữ không cần hạn chế hoặc tránh các thực phẩm cụ thể khi cho con bú." La Leche League (Anh) cũng khuyến cáo không nên vội kết luận do chế độ ăn của mẹ khi bé quấy khóc/khó chịu — "một số ít trẻ có vẻ phản ứng với thứ gì đó trong chế độ ăn của mẹ, nhưng có nhiều khả năng khác cần xem xét trước."

## Ngoại lệ hẹp, thật sự có bằng chứng: dị ứng đạm sữa bò qua sữa mẹ
Đây là hiện tượng cụ thể, được chẩn đoán lâm sàng, khác hẳn quan niệm dân gian chung chung: đạm sữa bò mẹ ăn vào có thể truyền qua sữa mẹ và gây viêm đại tràng dị ứng (allergic proctocolitis) ở một tỷ lệ nhỏ trẻ bú mẹ hoàn toàn (khoảng 0,2-1% trẻ khỏe mạnh, nhưng là nguyên nhân của phần lớn — khoảng 64% — các trường hợp có máu trong phân ở trẻ nhỏ). Dấu hiệu nhận biết: trẻ khỏe mạnh, đi ngoài có máu/nhầy (không chỉ là quấy khóc thông thường). Xử trí thường là mẹ thử loại bỏ đạm sữa bò khỏi chế độ ăn trong 2-4 tuần trong khi vẫn tiếp tục cho bú, kèm bổ sung canxi/vitamin D cho mẹ.

## Một hướng nghiên cứu hẹp khác: chế độ ăn ít FODMAP và colic
Một thử nghiệm ngẫu nhiên có đối chứng chéo (2018, 13 cặp mẹ-con) cho thấy chế độ ăn ít FODMAP của mẹ giúp giảm thời gian quấy khóc ở trẻ bị colic nhiều hơn so với chế độ ăn thông thường (giảm 32% so với 20%, p=0,03). Điều đáng chú ý: FODMAP KHÔNG được phát hiện trong sữa mẹ ở nghiên cứu này — cơ chế vẫn CHƯA RÕ, và chính tác giả nghiên cứu đặt câu hỏi "làm thế nào chế độ ăn ít FODMAP lại có tác dụng?". Đây là bằng chứng thật (một RCT bình duyệt) nhưng còn hạn chế (mẫu nhỏ) và không nên hiểu là xác nhận cho quan niệm dân gian "mẹ ăn hải sản/đồ lạnh nên con bị tiêu chảy" nói chung.

## Lưu ý — Đi khám nếu
Nếu bé đi ngoài có máu hoặc nhầy trong phân, hoặc có dấu hiệu dị ứng khác (nôn nhiều, phát ban, chậm tăng cân), nên đưa bé đi khám để được chẩn đoán và tư vấn cụ thể — thay vì tự loại bỏ nhiều nhóm thực phẩm khỏi chế độ ăn của mẹ mà không có hướng dẫn y tế.`,
    category: "Nuôi con bằng sữa mẹ",
    stage: "POSTPARTUM",
    evidenceLevel: "MODERATE",
    knowledgeType: scientific,
    sources: [sources.nhsBreastfeedingDiet, sources.abmAllergicProctocolitis2011, sources.allergicProctocolitisChildren2025, sources.iacovouFodmapColicRct2018],
  },
  {
    slug: "kieng-khem-sau-sinh-truyen-thong-va-khoa-hoc",
    title: "Kiêng khem sau sinh: truyền thống Việt Nam và khuyến nghị dinh dưỡng hiện nay",
    summary: "Truyền thống kiêng khem sau sinh (tránh đồ sống/lạnh, nhiều loại rau, dầu mỡ trong nhiều tuần) xuất phát từ quan niệm cơ thể sau sinh \"bị hàn\" cần được \"làm ấm lại\"; hướng dẫn dinh dưỡng chính thức (NICE, CDC) lại khuyến nghị mẹ cho con bú cần TĂNG calo và ĐA DẠNG thực phẩm — một nghiên cứu khu vực (Lào) cho thấy kiêng khem nghiêm ngặt có thể làm giảm thực sự sự đa dạng dinh dưỡng của mẹ.",
    content: `## Quan niệm truyền thống
Kiêng khem sau sinh (kiêng đồ sống/lạnh, hạn chế nhiều loại rau, hạn chế dầu mỡ, ăn nhiều món "ấm" trong vài tuần đầu) xuất phát từ quan niệm cơ thể phụ nữ sau sinh ở trạng thái "hàn"/yếu, cần chế độ ăn "làm ấm lại" để phục hồi sức khỏe lâu dài và đảm bảo nguồn sữa. Đây là quan niệm được ghi nhận rộng rãi trong các nghiên cứu nhân học về thực hành hậu sản ở Việt Nam và khu vực Đông Nam Á.

## Hướng dẫn dinh dưỡng chính thức: cần TĂNG calo và ĐA DẠNG thực phẩm
NICE (Anh, hướng dẫn NG194 về chăm sóc hậu sản) và CDC đều đi theo hướng ngược lại về mặt tổng thể: mẹ cho con bú cần TĂNG lượng calo (khoảng +330-500 kcal/ngày tùy nguồn), ăn ĐA DẠNG thực phẩm, và chú ý bổ sung đủ protein/omega-3/sắt/vitamin D/i-ốt/choline — chứ không phải loại bỏ nhiều nhóm thực phẩm trong nhiều tuần.

## Điểm CONFLICTING_EVIDENCE thực sự đáng lưu ý
Đây không phải là "khoa học chứng minh truyền thống sai" theo kiểu đơn giản — mà là một điểm căng thẳng thật giữa hai mục tiêu: một nghiên cứu bình duyệt tại khu vực Lào (bối cảnh Đông Nam Á gần gũi, dù không phải Việt Nam) ghi nhận 97% phụ nữ sau sinh có thực hành kiêng khem, và nhóm kiêng khem nghiêm ngặt đạt mức đa dạng dinh dưỡng tối thiểu chỉ 10% số lần so với 17% ở nhóm không kiêng khem — nghĩa là ở nhóm dân số đó, kiêng khem nghiêm ngặt thực sự làm giảm sự đa dạng dinh dưỡng vốn đã thấp. Đây là bằng chứng khu vực (không phải nghiên cứu trên phụ nữ Việt Nam cụ thể), nhưng là dữ liệu gần nhất có thể tìm được cho bối cảnh tương tự.

## Không phải mọi yếu tố truyền thống đều xung đột với khoa học
Cần công bằng: các yếu tố truyền thống KHÔNG hạn chế nhóm thực phẩm (như ăn món ấm/canh, dùng gừng/nghệ, nghỉ ngơi nhiều, có gia đình hỗ trợ chăm sóc) không mâu thuẫn với khuyến nghị chính thức và không cần bị khuyến khích từ bỏ. Điều thực sự đi ngược khuyến nghị "đa dạng thực phẩm" là việc LOẠI BỎ HẲN nhiều nhóm thực phẩm (rau, đạm, dầu mỡ) trong nhiều tuần liền.

## Lưu ý
Nếu gia đình có thực hành kiêng khem theo truyền thống, nên cân nhắc giữ lại phần không loại bỏ nhóm thực phẩm (nghỉ ngơi, món ấm, hỗ trợ gia đình) trong khi đảm bảo mẹ vẫn ăn đủ đa dạng — đặc biệt đủ đạm, rau xanh, chất béo tốt — để đáp ứng nhu cầu tăng lên khi cho con bú.`,
    category: "Quan niệm dân gian",
    stage: "POSTPARTUM",
    evidenceLevel: "LIMITED",
    knowledgeType: traditional,
    sources: [sources.niceNg194PostnatalCare, sources.cdcIodineBreastfeeding, sources.laoPdrPostpartumRestriction],
  },
  {
    slug: "lich-tiem-chung-mo-rong-tcmr-chi-tiet-theo-thang-tuoi",
    title: "Lịch Tiêm chủng mở rộng (TCMR) Việt Nam chi tiết theo tháng tuổi",
    summary: "Lịch TCMR miễn phí của Việt Nam: BCG + viêm gan B trong 24h đầu sau sinh; vắc-xin 5 trong 1 (ComBE Five) và uống OPV lúc 2-3-4 tháng; tiêm IPV lúc 5 tháng; sởi đơn lúc 9 tháng; viêm não Nhật Bản từ 12 tháng; sởi-rubella (MR) và nhắc 5 trong 1 lúc 18 tháng.",
    content: `## Lịch tiêm miễn phí (Chương trình Tiêm chủng mở rộng)
- **Trong 24 giờ đầu sau sinh**: BCG (lao) + viêm gan B (mũi đơn).
- **2 tháng tuổi**: 5 trong 1 (bạch hầu-ho gà-uốn ván-viêm gan B-Hib, vắc-xin ComBE Five) mũi 1 + uống bại liệt (OPV) mũi 1.
- **3 tháng tuổi**: 5 trong 1 mũi 2 + OPV mũi 2.
- **4 tháng tuổi**: 5 trong 1 mũi 3 + OPV mũi 3.
- **5 tháng tuổi**: tiêm bại liệt bất hoạt (IPV) — mũi bổ sung dạng tiêm bên cạnh 3 mũi uống.
- **9 tháng tuổi**: sởi đơn mũi 1.
- **12 tháng tuổi**: viêm não Nhật Bản (Jevax) mũi 1.
- **12 tháng + 1-2 tuần**: viêm não Nhật Bản mũi 2.
- **18 tháng tuổi**: sởi-rubella (MR) + nhắc lại 5 trong 1 (bạch hầu-ho gà-uốn ván) mũi 4.
- **Khoảng 2 tuổi**: viêm não Nhật Bản mũi 3.
- **Sau đó đến 15 tuổi**: nhắc viêm não Nhật Bản mỗi 3 năm.

## Lưu ý về nguồn xác minh
Bảng lịch trên được đối chiếu từ nhiều nguồn y tế Việt Nam (HCDC, VNVC, bệnh viện nhi) vì văn bản gốc (Thông tư 52/2025/TT-BYT) tồn tại dưới dạng PDF/hình ảnh không trích xuất được trực tiếp khi nghiên cứu — nên xem đây là lịch tham khảo ở mức tin cậy khá cao nhưng nên xác nhận lại với cơ sở tiêm chủng địa phương về lịch cụ thể và vắc-xin hiện có.

## Vắc-xin phế cầu và Rotavirus — đang trong giai đoạn chuyển đổi
Rotavirus đã chính thức vào chương trình miễn phí toàn quốc từ 2023. Vắc-xin phế cầu (phòng viêm phổi/viêm màng não do phế cầu) hiện mới trong giai đoạn THÍ ĐIỂM tại một số tỉnh/thành (2025-2026), dự kiến triển khai miễn phí toàn quốc chỉ từ khoảng 2030 — nghĩa là ở phần lớn các tỉnh thành hiện nay, phế cầu vẫn là vắc-xin dịch vụ (trả phí), dù đã được liệt kê trong danh mục bệnh truyền nhiễm bắt buộc theo quy định.

## Lưu ý
Luôn mang theo sổ/phiếu tiêm chủng đầy đủ tới mọi lần tiêm và hỏi cán bộ y tế về lịch cụ thể cho con, đặc biệt nếu trẻ sinh non, có bệnh nền, hoặc đã lỡ một mũi tiêm.`,
    category: "Tiêm chủng",
    stage: "NEWBORN_0_28_DAYS",
    minimumAgeDays: 0,
    maximumAgeDays: 1095,
    evidenceLevel: "STRONG",
    knowledgeType: scientific,
    sources: [sources.hcdcTcmrSchedule, sources.thongTu52TcmrBatBuoc, sources.vnvcTcmr024],
  },
  {
    slug: "so-sanh-lich-tiem-chung-viet-nam-va-quoc-te",
    title: "Lịch tiêm chủng Việt Nam khác gì lịch Mỹ/quốc tế: BCG, bại liệt, sởi",
    summary: "Việt Nam tiêm BCG (lao) ngay từ sơ sinh — Mỹ không tiêm BCG thường quy; Việt Nam dùng 3 liều uống OPV + 1 liều tiêm IPV, còn Mỹ chỉ dùng IPV tiêm 4 liều; Việt Nam tiêm sởi đơn từ 9 tháng (sớm hơn) rồi phối hợp sởi-rubella lúc 18 tháng, còn Mỹ dùng MMR (sởi-quai bị-rubella) 2 mũi từ 12-15 tháng.",
    content: `## Vì sao lịch khác nhau giữa các nước
Lịch tiêm chủng được thiết kế theo dịch tễ học của từng khu vực — nghĩa là khác biệt phản ánh mức độ lưu hành bệnh tại từng nơi, không phải một bên "đúng" một bên "sai".

## BCG (lao) — thường quy ở Việt Nam, KHÔNG thường quy ở Mỹ
Việt Nam tiêm BCG cho hầu hết trẻ sơ sinh trong 24 giờ đầu do gánh nặng bệnh lao còn cao; Mỹ không đưa BCG vào lịch tiêm chủng thường quy vì tỷ lệ mắc lao thấp hơn nhiều.

## Bại liệt: uống (OPV) và tiêm (IPV) khác nhau
Việt Nam dùng phối hợp 3 liều uống OPV (2-3-4 tháng) + 1 liều tiêm IPV (5 tháng). Mỹ chỉ dùng IPV (dạng tiêm) cho cả 4 liều, không còn dùng vắc-xin uống từ năm 2000. Vắc-xin 6 trong 1 (dùng IPV thay vì OPV) có tại Việt Nam nhưng chỉ ở dạng dịch vụ trả phí, chưa có trong chương trình miễn phí.

## Sởi: thời điểm và phối hợp khác nhau
Việt Nam tiêm sởi đơn mũi 1 từ 9 tháng tuổi (sớm hơn), sau đó phối hợp sởi-rubella (MR, không có thành phần quai bị) lúc 18 tháng. Mỹ dùng vắc-xin phối hợp MMR (sởi-quai bị-rubella) với mũi 1 lúc 12-15 tháng, mũi 2 lúc 4-6 tuổi — quai bị không phải thành phần thường quy trong lịch miễn phí của Việt Nam theo cách này.

## Viêm não Nhật Bản — có ở Việt Nam, không có trong lịch thường quy của Mỹ
Việt Nam đưa viêm não Nhật Bản vào lịch thường quy (từ 12 tháng, nhắc lại đến 15 tuổi) do bệnh lưu hành trong khu vực; ở Mỹ, vắc-xin này chỉ dành cho người đi du lịch đến vùng dịch, không phải lịch trẻ em thường quy.

## Lưu ý
Nếu gia đình có kế hoạch cho con sống/du học ở nước khác, nên hỏi bác sĩ về việc bổ sung các vắc-xin không có trong lịch TCMR Việt Nam (như quai bị riêng, hoặc 6 trong 1 dùng IPV) tùy nhu cầu.`,
    category: "Tiêm chủng",
    stage: "NEWBORN_0_28_DAYS",
    minimumAgeDays: 0,
    maximumAgeDays: 1095,
    evidenceLevel: "STRONG",
    knowledgeType: scientific,
    sources: [sources.cdcChildScheduleNotes, sources.hcdcTcmrSchedule, sources.thongTu52TcmrBatBuoc],
  },
  {
    slug: "vac-xin-dich-vu-pho-bien-cho-tre-nho-phe-cau-nao-mo-cau-cum",
    title: "Vắc-xin dịch vụ phổ biến cho trẻ nhỏ: phế cầu, não mô cầu, cúm mùa",
    summary: "Phế cầu (phòng viêm phổi/viêm màng não), não mô cầu và cúm mùa hiện đều là vắc-xin dịch vụ (trả phí) tại phần lớn Việt Nam — không có trong danh sách \"tránh hẳn\", mà là các vắc-xin có bằng chứng bảo vệ tốt nhưng chưa được nhà nước chi trả toàn quốc; cúm cần tiêm 2 mũi cách nhau ít nhất 1 tháng nếu là lần đầu tiêm cho trẻ 6 tháng-dưới 9 tuổi, sau đó nhắc lại hằng năm.",
    content: `## Vắc-xin phế cầu
Phòng các bệnh do phế cầu khuẩn gây ra (viêm phổi, viêm màng não, nhiễm khuẩn huyết, viêm tai giữa). Hiện đang trong giai đoạn thí điểm miễn phí tại một số tỉnh (2025-2026), dự kiến mở rộng toàn quốc muộn hơn nhiều (khoảng 2030) — ở hầu hết Việt Nam hiện nay, đây vẫn là vắc-xin dịch vụ, tiêm từ 6 tuần-2 tháng tuổi theo phác đồ nhiều mũi tùy sản phẩm và tuổi bắt đầu.

## Vắc-xin não mô cầu
Phòng viêm màng não/nhiễm khuẩn huyết do não mô cầu — bệnh có thể diễn tiến rất nhanh và nguy hiểm. Tại Việt Nam, đây là vắc-xin dịch vụ, có nhiều sản phẩm: VA-Mengoc-BC (phòng nhóm B+C, từ 6 tháng tuổi, 2 mũi cách nhau 45 ngày), và các vắc-xin thế hệ mới hơn (nhóm ACWY, nhóm B) với phác đồ khác nhau tùy sản phẩm. Nên hỏi bác sĩ về lựa chọn phù hợp với độ tuổi và nhóm nguy cơ của con.

## Vắc-xin cúm mùa
CDC khuyến nghị tiêm cúm hằng năm từ 6 tháng tuổi trở lên. Nếu đây là LẦN ĐẦU TIÊN trẻ 6 tháng-dưới 9 tuổi tiêm cúm (hoặc mới tiêm dưới 2 mũi trong đời), cần 2 mũi cách nhau ít nhất 4 tuần trong mùa đầu tiên; sau đó chỉ cần 1 mũi nhắc lại mỗi năm. Hiệu quả bảo vệ thay đổi theo từng mùa (mùa 2025-2026 tại Mỹ ghi nhận khoảng 38-41% giảm số lượt khám bệnh, ~41% giảm nhập viện ở trẻ em) — chủ yếu do mức độ "khớp" giữa chủng vắc-xin và chủng virus lưu hành thực tế thay đổi mỗi năm, không phải do vắc-xin kém chất lượng. Tại Việt Nam, đây vẫn là vắc-xin dịch vụ (dự kiến vào chương trình miễn phí muộn nhất khoảng 2030), khuyến nghị tiêm trước 2 đợt cúm cao điểm trong năm (khoảng tháng 3-4 và tháng 9-10).

## Lưu ý
"Dịch vụ" (trả phí) không đồng nghĩa với "kém cần thiết" — đây đơn giản là các vắc-xin nhà nước chưa/chỉ mới bắt đầu chi trả toàn dân, trong khi bằng chứng khoa học về hiệu quả bảo vệ vẫn tương đối vững chắc. Quyết định tiêm nên dựa trên tư vấn của bác sĩ về nguy cơ cụ thể của con và khả năng tài chính gia đình, không phải vì "miễn phí = tốt hơn, trả phí = không cần thiết".`,
    category: "Tiêm chủng",
    stage: "INFANT_3_6_MONTHS",
    minimumAgeDays: 42,
    maximumAgeDays: 1095,
    evidenceLevel: "STRONG",
    knowledgeType: scientific,
    sources: [sources.cdcChildScheduleNotes, sources.vietnamCovidBoosterGuidance],
  },
  {
    slug: "vac-xin-hpv-va-covid-19-cho-tre-hien-trang-va-tranh-cai",
    title: "Vắc-xin HPV và COVID-19 cho trẻ: hiện trạng tại Việt Nam và những tranh cãi cần biết",
    summary: "HPV sẽ được đưa vào chương trình tiêm chủng miễn phí tại Việt Nam từ 2026 (thí điểm 4 tỉnh trước, mở rộng toàn quốc từ 1/7/2026) cho bé gái 9-dưới 15 tuổi; tại Mỹ, số liều HPV khuyến nghị (1 liều hay 2 liều) đang là điểm bất đồng thật giữa CDC và AAP. Với COVID-19, Việt Nam hiện chỉ khuyến nghị tiêm nhắc cho trẻ có nguy cơ cao, không phải tiêm thường quy cho trẻ khỏe mạnh.",
    content: `## Vắc-xin HPV — sắp có trong chương trình miễn phí tại Việt Nam
HPV (human papillomavirus) là nguyên nhân chính gây ung thư cổ tử cung và một số ung thư khác. Theo quyết định của Bộ Y tế, vắc-xin HPV sẽ được tiêm miễn phí cho bé gái 9-dưới 15 tuổi, thí điểm tại 4 tỉnh (Tuyên Quang, Quảng Ngãi, Đắk Lắk, Vĩnh Long) trước, sau đó dự kiến mở rộng toàn quốc từ 1/7/2026. Trước thời điểm này, vắc-xin HPV tại Việt Nam chỉ có ở dạng dịch vụ (trả phí), cho cả nam và nữ 9-45 tuổi.

## Điểm CONFLICTING_EVIDENCE: 1 liều hay 2 liều?
Đây là điểm bất đồng thật giữa các cơ quan y tế Mỹ, chưa cần Việt Nam phải theo bên nào: CDC/ACIP đã có động thái khuyến nghị chỉ cần 1 liều HPV là đủ cho hầu hết trẻ bắt đầu tiêm ở tuổi 9-14 (dựa trên nhiều nghiên cứu cho thấy hiệu quả tương đương ở nhóm tuổi này), trong khi Hiệp hội Nhi khoa Hoa Kỳ (AAP) trong lịch tiêm chủng riêng năm 2026 vẫn giữ khuyến nghị 2 liều cho nhóm tuổi này — một bất đồng công khai giữa hai cơ quan lớn, không phải sai sót. Với người bắt đầu tiêm từ 15-26 tuổi hoặc suy giảm miễn dịch, mọi nguồn đều thống nhất cần 3 liều. Vắc-xin HPV có hiệu quả rất cao (>96% phòng tổn thương tiền ung thư mức độ cao ở nhóm chưa phơi nhiễm) và hồ sơ an toàn tốt qua giám sát hơn 135 triệu liều đã dùng tại Mỹ — tác dụng phụ đáng chú ý nhất là ngất xỉu (phản ứng chung của tiêm chủng ở tuổi vị thành niên, không riêng vắc-xin này), nên khuyến cáo ngồi/nằm và theo dõi 15 phút sau tiêm.

## Vắc-xin COVID-19 cho trẻ — Việt Nam chỉ khuyến nghị cho nhóm nguy cơ cao
Khác với giai đoạn đại dịch, hướng dẫn hiện tại của Bộ Y tế Việt Nam KHÔNG khuyến nghị tiêm COVID-19 thường quy cho trẻ khỏe mạnh — chỉ khuyến nghị tiêm nhắc cho trẻ có bệnh nền hoặc đã từng mắc COVID-19 hơn 6 tháng trước. Đây là cách tiếp cận theo nguy cơ, phù hợp với xu hướng quốc tế chung là không còn tiêm COVID-19 đại trà cho trẻ em khỏe mạnh. Tại Mỹ, khuyến nghị COVID-19 cho trẻ cũng đang trong giai đoạn tranh cãi và thay đổi liên tục giữa các cơ quan (CDC và AAP có quan điểm khác nhau) — đây là lĩnh vực còn nhiều biến động, nên cha mẹ nên hỏi trực tiếp bác sĩ về khuyến nghị mới nhất thay vì dựa vào thông tin cũ.

## Lưu ý
Với cả hai vắc-xin này, quyết định tiêm cho con nên dựa trên tư vấn của bác sĩ nhi khoa về tình trạng sức khỏe cụ thể, không phải chỉ dựa vào việc vắc-xin có "miễn phí" hay đang "gây tranh cãi" trên mạng xã hội hay không.`,
    category: "Tiêm chủng",
    stage: "TODDLER",
    evidenceLevel: "MODERATE",
    knowledgeType: scientific,
    sources: [sources.cdcHpvVaccinationRec, sources.aapNews2026ScheduleDeparts, sources.vietnamHpvProgram2026, sources.vietnamCovidBoosterGuidance],
  },
  {
    slug: "phan-ung-sau-tiem-binh-thuong-va-dau-hieu-can-di-kham-ngay",
    title: "Phản ứng sau tiêm: bình thường và dấu hiệu cần đi khám ngay",
    summary: "Sốt nhẹ, sưng đau chỗ tiêm, quấy khóc, mệt mỏi là phản ứng bình thường thường hết sau 1-2 ngày; cần theo dõi tại điểm tiêm 30 phút và tại nhà 1-2 ngày. Dấu hiệu cần đi khám ngay: sốt cao không đáp ứng thuốc hạ sốt, quấy khóc liên tục nhiều giờ, co giật, tím tái, khó thở, li bì bất thường, hoặc bất kỳ dấu hiệu nào khiến cha mẹ lo lắng.",
    content: `## Phản ứng bình thường (không cần lo lắng)
Sốt nhẹ, sưng/đỏ/đau tại chỗ tiêm, quấy khóc, mệt mỏi, chán ăn — đây là phản ứng thường gặp, cho thấy cơ thể đang đáp ứng miễn dịch, thường tự hết trong 1-2 ngày.

## Theo dõi sau tiêm — quy tắc 30 phút + 1-2 ngày
Hướng dẫn y tế dự phòng Việt Nam khuyến nghị: theo dõi tại cơ sở tiêm chủng ít nhất 30 phút sau tiêm (để phát hiện sớm phản ứng nặng/phản vệ), sau đó tiếp tục theo dõi tại nhà 1-2 ngày (để phát hiện phản ứng muộn hơn).

## Dấu hiệu cần đi khám/cấp cứu ngay
- Sốt cao (trên 39°C) không đáp ứng thuốc hạ sốt, hoặc sốt kéo dài.
- Quấy khóc liên tục không dỗ được nhiều giờ liền.
- Li bì, kém tương tác, khó đánh thức.
- Co giật hoặc cứng đờ người.
- Nôn nhiều, bú kém/bỏ bú.
- Phát ban.
- Thở nhanh, thở khó, thở rít, thở rên.
- Tím tái môi/đầu chi, chân tay lạnh, da nổi vân tím.
- Bất kỳ dấu hiệu bất thường nào khác khiến cha mẹ lo lắng.
Đây gần như trùng khớp với danh sách "cần gọi bác sĩ" trong tài liệu thông tin vắc-xin (VIS) của CDC — hai hệ thống y tế độc lập đi đến khung phân loại rất giống nhau.

## Riêng về co giật do sốt sau tiêm
Co giật do sốt (thường ở trẻ 6 tháng-5 tuổi) có thể xảy ra sau một số vắc-xin, đặc biệt sau mũi MMR (sởi-quai bị-rubella, khoảng ngày 5-12 sau tiêm). CDC nêu rõ: vắc-xin phối hợp MMRV (gộp cả thủy đậu) có nguy cơ co giật do sốt CAO HƠN so với tiêm MMR và thủy đậu thành 2 mũi riêng ở trẻ 12-23 tháng — đây là lý do khuyến nghị hiện nay ưu tiên tiêm 2 mũi riêng cho mũi đầu tiên ở trẻ nhỏ. Co giật do sốt hầu hết kéo dài 1-2 phút và không để lại di chứng lâu dài, nhưng vẫn nên đưa trẻ đi khám sau lần co giật đầu tiên, và gọi cấp cứu nếu cơn co giật kéo dài trên 5 phút.

## Lưu ý
Phản ứng bình thường không cần dùng thuốc gì đặc biệt ngoài hạ sốt nếu cần và cho bú/uống đủ nước; nếu có bất kỳ dấu hiệu nào ở trên, nên đưa trẻ đi khám ngay thay vì tự theo dõi thêm ở nhà.`,
    category: "Tiêm chủng",
    stage: "INFANT_1_3_MONTHS",
    evidenceLevel: "STRONG",
    knowledgeType: scientific,
    sources: [sources.vncdcTheoDoiPhanUng, sources.vnvcDauHieuNguyHiem, sources.cdcFebrileSeizures, sources.cdcMmrvSafety],
  },
  {
    slug: "chong-chi-dinh-hoan-tiem-va-sot-nhe-co-can-hoan-khong",
    title: "Chống chỉ định, hoãn tiêm và sốt nhẹ: khi nào thực sự cần hoãn",
    summary: "CDC, WHO và Bộ Y tế Việt Nam đều thống nhất: bệnh nhẹ (sốt nhẹ, cảm lạnh, tiêu chảy nhẹ) KHÔNG phải lý do hoãn tiêm — chỉ bệnh cấp tính mức độ vừa-nặng mới cần hoãn. Việt Nam quy định ngưỡng cụ thể: hoãn tiêm nếu nhiệt độ nách ≥38°C hoặc ≤35,5°C, cân nặng dưới 2000g, hoặc tuổi thai dưới 34 tuần (với BCG).",
    content: `## Bệnh nhẹ KHÔNG phải lý do hoãn tiêm
Đây là điểm cả CDC, WHO và Bộ Y tế Việt Nam đều thống nhất rõ ràng, không có bất đồng: sốt nhẹ, cảm lạnh thông thường, tiêu chảy nhẹ, viêm tai giữa nhẹ KHÔNG phải là lý do hoãn tiêm. CDC liệt kê rõ đây là các "chống chỉ định KHÔNG hợp lệ". Nhiều cha mẹ có thói quen tự hoãn tiêm khi con hơi sổ mũi — điều này không cần thiết theo khuyến cáo chính thức.

## Khi nào THỰC SỰ cần hoãn (theo Quyết định 1575/QĐ-BYT của Bộ Y tế)
Với trẻ trên 1 tháng tuổi, tạm hoãn tiêm nếu: nhiệt độ đo ở nách ≥38°C hoặc ≤35,5°C; đang mắc bệnh cấp tính hoặc bệnh mạn tính tiến triển; cân nặng dưới 2000g (cần chuyển tuyến khám thêm); vừa dùng globulin miễn dịch trong 3 tháng gần đây (hoãn vắc-xin sống); vừa dùng corticoid liều cao/hóa trị/xạ trị trong 14 ngày gần đây (hoãn vắc-xin sống).
Với trẻ dưới 1 tháng tuổi (sơ sinh): ngưỡng nhiệt độ tương tự (≥38°C hoặc ≤35,5°C); cân nặng dưới 2000g; **tuổi thai dưới 34 tuần → hoãn BCG đến khi đủ 34 tuần tuổi hiệu chỉnh**; mẹ có tình trạng viêm gan B ảnh hưởng đến thời điểm tiêm.

## Chống chỉ định thật sự (khác với hoãn tạm thời)
- Tiền sử phản vệ độ III trở lên sau liều trước của cùng loại vắc-xin.
- Tiền sử lồng ruột → chống chỉ định với vắc-xin Rotavirus.
- Suy giảm miễn dịch bẩm sinh nặng → chống chỉ định với vắc-xin sống (OPV, BCG, MMR, thủy đậu, Rotavirus) — đây là khác biệt quan trọng: bệnh nhẹ tạm thời thì hoãn, còn suy giảm miễn dịch nặng thật sự là chống chỉ định lâu dài với nhóm vắc-xin sống.

## So sánh với hướng dẫn quốc tế
CDC dùng ngôn ngữ định tính hơn ("bệnh cấp tính mức độ vừa-nặng") thay vì con số cụ thể; Việt Nam quy định ngưỡng số cụ thể (38°C/35,5°C, 2000g, 34 tuần thai) trong một quyết định riêng — đây là điểm khác biệt về CÁCH trình bày, không phải khác biệt về nguyên tắc cốt lõi (bệnh nhẹ không hoãn, bệnh nặng/suy giảm miễn dịch thật sự thì hoãn/chống chỉ định).

## Lưu ý
Nếu không chắc con có đang bị bệnh đến mức cần hoãn tiêm hay không, cứ đưa con đến lịch hẹn — nhân viên y tế sẽ khám sàng lọc và quyết định, thay vì cha mẹ tự ý hoãn ở nhà.`,
    category: "Tiêm chủng",
    stage: "INFANT_1_3_MONTHS",
    evidenceLevel: "STRONG",
    knowledgeType: scientific,
    sources: [sources.quyetDinh1575SangLoc, sources.cdcContraindicationsPrecautions],
  },
  {
    slug: "lich-tiem-cham-dan-cach-co-an-toan-hon-khong",
    title: "Lịch tiêm chậm/dãn cách có an toàn hơn lịch chuẩn không?",
    summary: "Không có bằng chứng nào cho thấy trì hoãn hoặc dãn cách vắc-xin an toàn hơn; ngược lại, một nghiên cứu lớn (hơn 323.000 trẻ) cho thấy trì hoãn mũi MMR đầu tiên qua 15 tháng làm TĂNG nguy cơ co giật do sốt so với tiêm đúng lịch; một nghiên cứu khác trực tiếp kiểm chứng và bác bỏ giả thuyết \"quá tải miễn dịch\".",
    content: `## Vì sao một số cha mẹ muốn trì hoãn/dãn cách
Một số cha mẹ lo ngại tiêm nhiều vắc-xin cùng lúc có thể "quá tải" hệ miễn dịch non nớt của trẻ, và cho rằng dãn cách ra sẽ an toàn hơn.

## Bằng chứng trực tiếp: trì hoãn KHÔNG an toàn hơn — thậm chí có dữ liệu ngược lại
Một nghiên cứu quan sát lớn trên 323.247 trẻ tại Mỹ (dữ liệu Vaccine Safety Datalink, công bố trên Pediatrics 2014) so sánh trực tiếp: trì hoãn mũi MMR đầu tiên qua 15 tháng (tiêm lúc 16-23 tháng) làm TĂNG nguy cơ co giật do sốt sau tiêm so với tiêm đúng lịch (12-15 tháng) — đây là bằng chứng đối đầu trực tiếp, đi ngược lại giả thuyết "trì hoãn an toàn hơn".

## Giả thuyết "quá tải miễn dịch" đã được kiểm chứng trực tiếp
Một nghiên cứu công bố trên JAMA (2018), theo dõi 994 trẻ 24-47 tháng, so sánh tổng lượng kháng nguyên vắc-xin trẻ đã tiếp nhận đến 23 tháng tuổi với nguy cơ mắc các bệnh nhiễm trùng KHÔNG liên quan đến vắc-xin sau đó — không tìm thấy khác biệt đáng kể. Điều này trực tiếp bác bỏ giả thuyết rằng lịch tiêm chuẩn làm suy yếu/quá tải hệ miễn dịch khiến trẻ dễ nhiễm bệnh khác hơn. Một bài tổng quan riêng của AAP (Pediatrics, 2002) cũng tính toán hệ miễn dịch của trẻ sơ sinh về mặt lý thuyết có thể đáp ứng với số lượng kháng nguyên lớn hơn rất nhiều so với những gì lịch tiêm hiện tại yêu cầu, và trẻ em ngày nay thực ra tiếp xúc với ÍT kháng nguyên hơn qua vắc-xin so với vài chục năm trước (nhờ công nghệ tinh chế vắc-xin tốt hơn).

## "Khoảng trống dễ tổn thương" — cái giá thực sự của trì hoãn
Trì hoãn tiêm kéo dài thời gian trẻ KHÔNG được bảo vệ trước bệnh thật — đây không phải suy đoán mà có bằng chứng dịch tễ thực tế: dữ liệu huyết thanh học tại TP.HCM trước đợt dịch sởi 2024 cho thấy chính nhóm tuổi có tỷ lệ miễn dịch thấp nhất (41,5-58,1%) là nơi dịch bùng phát đầu tiên và lan nhanh nhất (xem thêm bài về dịch sởi/bạch hầu tại Việt Nam).

## Khoảng trống nghiên cứu cần nói thẳng
Chưa có (và khó có thể có, vì lý do đạo đức) một thử nghiệm ngẫu nhiên đối chứng so sánh TOÀN BỘ kết cục sức khỏe lâu dài giữa nhóm trẻ tiêm theo lịch chuẩn và nhóm trẻ tiêm theo lịch trì hoãn/dãn cách tự chọn — đây là khoảng trống nghiên cứu có thật, không phải "chưa ai nghĩ đến nghiên cứu này". Điều đang có là các bằng chứng từng phần ở trên, và tất cả đều chỉ theo một hướng: trì hoãn không mang lại lợi ích an toàn đã được chứng minh, trong khi có bằng chứng thật về rủi ro (co giật do sốt) và về việc kéo dài khoảng trống dễ tổn thương.

## Lưu ý
Nếu có lo lắng cụ thể về lịch tiêm cho con, nên trao đổi trực tiếp với bác sĩ nhi khoa để hiểu rõ rủi ro-lợi ích của từng lựa chọn, thay vì tự áp dụng một lịch trì hoãn không có bằng chứng hỗ trợ.`,
    category: "Tiêm chủng",
    stage: "INFANT_1_3_MONTHS",
    evidenceLevel: "STRONG",
    knowledgeType: scientific,
    sources: [sources.hambidgeDelayedMmrSeizure2014, sources.glanzImmuneOverload2018, sources.offitMultipleVaccines2002, sources.cdcEidMeaslesVietnam2025],
  },
  {
    slug: "dich-soi-bach-hau-tai-viet-nam-bai-hoc-khoang-trong-tiem-chung",
    title: "Dịch sởi, bạch hầu tại Việt Nam gần đây: bài học từ khoảng trống tiêm chủng",
    summary: "Dịch sởi 2024-2025 tại Việt Nam ghi nhận hơn 45.550 ca nghi mắc, 16 tử vong năm 2024; khảo sát huyết thanh học trước dịch tại TP.HCM cho thấy miễn dịch chỉ 41,5-58,1% ở vùng bùng phát đầu tiên. Dịch bạch hầu 2023-2024 (57 ca, 7 tử vong năm 2023) liên quan trực tiếp đến tỷ lệ tiêm DTP3 thấp và miễn dịch suy giảm nhanh hơn dự kiến (~4,3 năm) sau tiêm.",
    content: `## Dịch sởi 2024-2025 — dữ liệu thật, không phải suy đoán
Năm 2024, Việt Nam ghi nhận hơn 45.550 ca nghi mắc sởi, 7.583 ca xác định, 16 ca tử vong; khoảng 25% ca xác định là trẻ DƯỚI 9 THÁNG TUỔI — tức là chưa đến tuổi tiêm sởi thường quy, cho thấy bệnh đang khai thác đúng "khoảng trống" trước độ tuổi tiêm chứ không phải do vắc-xin thất bại. Riêng TP.HCM công bố dịch từ 27/8/2024, ghi nhận 4.133 ca đến tháng 12/2024. Năm 2025, hơn 40.000 ca và 5 ca tử vong đã được ghi nhận tính đến thời điểm báo cáo.

## Bằng chứng trực tiếp: khoảng trống miễn dịch đi trước dịch bệnh
Một nghiên cứu bình duyệt (đăng trên tạp chí Emerging Infectious Diseases của CDC, 2025) khảo sát huyết thanh học tại TP.HCM từ tháng 9/2022-4/2024 — TRƯỚC khi dịch bùng phát — phát hiện tỷ lệ miễn dịch sởi thấp đáng báo động: chỉ 41,5% tại một bệnh viện nhi và 58,1% tại một bệnh viện nhi khác vào tháng 12/2023 — thấp hơn nhiều so với ngưỡng miễn dịch cộng đồng cần thiết (khoảng 95%). Vùng có tỷ lệ miễn dịch thấp nhất (phía tây TP.HCM) chính là nơi ghi nhận ca bệnh đầu tiên và tốc độ lây lan nhanh nhất, với hệ số lây nhiễm R đạt đỉnh 1,99 vào giữa tháng 8/2024 trước khi giảm dần sau các đợt tiêm bù (bắt đầu 31/8/2024 cho trẻ 1-5 tuổi, mở rộng 1/10/2024 cho trẻ 1-10 tuổi tại 31 tỉnh thành). Đây là một trong những bằng chứng định lượng, bình duyệt, rõ ràng nhất về mối liên hệ nhân quả giữa khoảng trống miễn dịch và một đợt dịch thực tế.

## Dịch bạch hầu 2023-2024 — vắc-xin có, nhưng miễn dịch suy giảm nhanh hơn dự kiến
Năm 2023: 57 ca bạch hầu, 7 tử vong trên toàn quốc, tập trung tại các tỉnh miền núi phía Bắc (Điện Biên, Hà Giang, Thái Nguyên). Một nghiên cứu giải trình tự gen (LSHTM) phát hiện: 73% ca bệnh tại miền Trung Việt Nam (giai đoạn 2015-2018) là trẻ tuổi đi học; đáng chú ý, khả năng bảo vệ sau chuỗi 4 mũi DTP chỉ kéo dài trung bình khoảng 4,3 năm — ngắn hơn nhiều so với giả định thông thường (~10 năm) — và toàn bộ một chùm ca bệnh liên quan về mặt gen đều là người CHƯA tiêm vắc-xin; 2 ca tử vong xảy ra ở trẻ đã tiêm 3+ mũi nhưng miễn dịch đã suy giảm. Nghiên cứu này khuyến nghị cân nhắc thêm mũi nhắc khi trẻ vào tuổi đi học.

## Bài học cho cha mẹ
Cả hai đợt dịch đều cho thấy: (1) khoảng trống miễn dịch trong cộng đồng — dù do trẻ chưa đủ tuổi tiêm, bỏ lỡ lịch, hay miễn dịch suy giảm theo thời gian — đều có thể dẫn đến dịch bệnh thật với ca tử vong thật; (2) tiêm đúng lịch, đủ mũi (bao gồm cả mũi nhắc) là cách bảo vệ hiệu quả nhất đã được chứng minh bằng dữ liệu thực tế tại Việt Nam, không phải lý thuyết trừu tượng từ nước ngoài.`,
    category: "Tiêm chủng",
    stage: "INFANT_6_12_MONTHS",
    evidenceLevel: "STRONG",
    knowledgeType: scientific,
    sources: [sources.cdcEidMeaslesVietnam2025, sources.diphtheriaVietnamGenomic, sources.unicefVietnamImmunization],
  },
  {
    slug: "su-co-quinvaxem-2012-va-niem-tin-vao-vaccine",
    title: "Sự cố Quinvaxem 2012-2013: chuyện gì đã xảy ra và bài học về niềm tin vaccine",
    summary: "Sau 9 ca tử vong ở trẻ được báo cáo sau tiêm Quinvaxem (2012-2013), truyền thông đưa tin tăng gấp 14 lần và tỷ lệ tiêm DTP-VGB toàn quốc giảm từ ~97% xuống ~59-60% chỉ trong một năm; WHO và đánh giá độc lập sau đó kết luận các ca tử vong \"trùng hợp ngẫu nhiên\", không liên quan nhân quả đến vắc-xin — nhưng niềm tin của công chúng không phục hồi hoàn toàn ngay cả sau kết luận này.",
    content: `## Chuyện gì đã xảy ra
Giai đoạn 2012-2013, Việt Nam ghi nhận 9 ca tử vong ở trẻ được báo cáo xảy ra sau khi tiêm vắc-xin Quinvaxem (5 trong 1, phòng bạch hầu-ho gà-uốn ván-viêm gan B-Hib). Một nghiên cứu phân tích nội dung truyền thông trực tuyến Việt Nam ghi nhận số bài báo về chủ đề này tăng gấp 14 lần (từ 7 bài trước sự cố lên 98 bài trong giai đoạn khủng hoảng), với các cách mô tả như "thủ phạm cướp đi mạng sống của 9 trẻ em", "vắc-xin rẻ tiền", "thế hệ cũ", "nguy cơ phản ứng nặng cao", và chỉ trích quyết định của Bộ Y tế là "thiếu trách nhiệm"/ưu tiên giá rẻ hơn an toàn. Bộ Y tế đã tạm ngừng sử dụng Quinvaxem vào tháng 5/2013 để chờ điều tra.

## Kết luận điều tra: không có liên quan nhân quả
Sau điều tra, WHO và các đánh giá độc lập kết luận các ca tử vong là "trùng hợp ngẫu nhiên" — không có bằng chứng liên quan nhân quả đến vắc-xin. Đây là kết luận từ quy trình điều tra chính thức, không phải nỗ lực "chữa cháy truyền thông".

## Hậu quả thực tế: niềm tin công chúng không phục hồi ngay
Đây là điểm quan trọng nhất của câu chuyện: dù kết luận điều tra rõ ràng, tỷ lệ tiêm DTP-VGB toàn quốc vẫn giảm mạnh từ khoảng 97% (2012) xuống còn khoảng 59-60% (2013) khi nhiều cha mẹ từ chối Quinvaxem và chờ đợi vắc-xin thay thế (Pentaxim) — tình trạng này càng trầm trọng hơn do sau đó xảy ra thiếu hụt nguồn cung vắc-xin thay thế. Một số khu vực nông thôn sau đó ghi nhận các đợt bùng phát uốn ván/bạch hầu rải rác. Đây là một ví dụ có thật, cụ thể tại Việt Nam, cho thấy một sự kiện AEFI (phản ứng sau tiêm được báo cáo) — dù sau này được xác nhận không liên quan nhân quả — vẫn có thể để lại tổn hại lâu dài đến niềm tin và tỷ lệ tiêm chủng.

## Vì sao câu chuyện này quan trọng với cha mẹ hôm nay
Không phải để nói "đừng lo lắng gì cả" — lo lắng của cha mẹ khi con có phản ứng sau tiêm là chính đáng và cần được lắng nghe, theo dõi, báo cáo đầy đủ. Điều câu chuyện Quinvaxem cho thấy là: (1) hệ thống giám sát và điều tra sau tiêm chủng có tồn tại và hoạt động (Bộ Y tế đã tạm ngừng vắc-xin, WHO đã vào cuộc điều tra); (2) một ca tử vong xảy ra SAU tiêm không tự động có nghĩa là DO tiêm — cần điều tra để phân biệt trùng hợp thời gian với nguyên nhân thật; (3) quyết định dựa trên nỗi sợ lan truyền trên truyền thông, thay vì kết luận điều tra chính thức, có thể dẫn đến hậu quả thật (giảm miễn dịch cộng đồng, nguy cơ dịch bệnh khác).

## Lưu ý
Vắc-xin 5 trong 1 hiện dùng trong chương trình TCMR (ComBE Five, từ 2018) là sản phẩm khác Quinvaxem, đã qua nhiều năm sử dụng an toàn tại Việt Nam.`,
    category: "Tiêm chủng",
    stage: "INFANT_1_3_MONTHS",
    evidenceLevel: "STRONG",
    knowledgeType: scientific,
    sources: [sources.quinvaxemContentAnalysis, sources.unicefVietnamImmunization],
  },
  {
    slug: "mmr-tu-ky-thanh-phan-vaccine-va-qua-tai-mien-dich-su-that",
    title: "MMR và tự kỷ, thimerosal, nhôm, \"quá tải miễn dịch\": sự thật đằng sau các lo ngại phổ biến",
    summary: "Nghiên cứu 1998 của Wakefield liên kết MMR với tự kỷ đã bị chứng minh là gian lận khoa học (dữ liệu bị thao túng, xung đột lợi ích tài chính không công khai) và bị rút lại năm 2010; các nghiên cứu sau đó trên hàng triệu trẻ (Đan Mạch 657.461 trẻ, phân tích gộp 1,2 triệu trẻ) không tìm thấy liên hệ. Thimerosal bị loại khỏi hầu hết vắc-xin trẻ em từ 2001 như một biện pháp phòng ngừa (không phải vì đã chứng minh có hại) — và tỷ lệ tự kỷ vẫn tiếp tục tăng sau đó, đi ngược lại giả thuyết nhân quả.",
    content: `## Nghiên cứu Wakefield 1998: từ "gây tranh cãi" đến "gian lận khoa học đã xác nhận"
Năm 1998, một bài báo trên tạp chí Lancet (chỉ dựa trên 12 trẻ) tuyên bố có liên kết giữa vắc-xin MMR, viêm ruột và tự kỷ. Điều tra sau đó của nhà báo Brian Deer (công bố trên BMJ 2011) phát hiện: tác giả chính (Andrew Wakefield) đã nhận khoảng 435.000 bảng Anh từ luật sư đang chuẩn bị kiện các hãng sản xuất vắc-xin — một xung đột lợi ích tài chính KHÔNG được công khai khi bài báo xuất bản; ông cũng giữ bằng sáng chế cho một vắc-xin sởi đơn lẻ sẽ hưởng lợi nếu MMR bị nghi ngờ; hồ sơ bệnh án của các trẻ trong nghiên cứu đã bị thay đổi để tạo ra vẻ ngoài triệu chứng xuất hiện sau tiêm, dù một số trẻ đã có vấn đề phát triển TRƯỚC khi tiêm. Hội đồng Y khoa Anh (GMC) kết luận Wakefield hành động "không trung thực và vô trách nhiệm", tước giấy phép hành nghề năm 2010; Lancet chính thức rút toàn bộ bài báo cùng năm.

## Các nghiên cứu quy mô lớn sau đó: không tìm thấy liên hệ
- Nghiên cứu đoàn hệ toàn quốc Đan Mạch (Hviid và cộng sự, Annals of Internal Medicine, 2019) trên **657.461 trẻ**: tỷ số nguy cơ mắc tự kỷ ở nhóm tiêm MMR so với chưa tiêm là 0,93 (KTC 95% 0,85-1,02) — không tăng nguy cơ, kể cả ở nhóm "nguy cơ cao" (có anh/chị mắc tự kỷ).
- Phân tích gộp (Taylor và cộng sự, Vaccine, 2014) trên hơn **1,2 triệu trẻ** từ 5 nghiên cứu đoàn hệ và 9.920 trẻ từ 5 nghiên cứu bệnh-chứng: không tìm thấy liên hệ giữa vắc-xin (bao gồm MMR và thimerosal riêng biệt) với tự kỷ.
- Tổng quan Cochrane (2012) tổng hợp nhiều thiết kế nghiên cứu, riêng về tự kỷ gộp 2 nghiên cứu trên gần 1,2 triệu trẻ, ghi nhận tỷ lệ tự kỷ tương tự giữa nhóm tiêm và chưa tiêm.

## Thimerosal: bị loại bỏ vì THẬN TRỌNG, không phải vì đã chứng minh có hại
Thimerosal là chất bảo quản chứa ethylmercury (khác với methylmercury độc hơn có trong cá) dùng trong lọ vắc-xin nhiều liều. Năm 1999, cơ quan y tế công cộng Mỹ cùng AAP thống nhất giảm/loại bỏ thimerosal khỏi vắc-xin trẻ em "như một biện pháp phòng ngừa" — CDC nêu rõ đây KHÔNG phải vì có bằng chứng gây hại. Điểm dữ liệu quan trọng: tỷ lệ tự kỷ tại Mỹ VẪN TIẾP TỤC TĂNG sau khi thimerosal gần như biến mất khỏi vắc-xin trẻ em (loại bỏ khỏi lịch tiêm thường quy từ 2001) — đây là bằng chứng đi ngược lại giả thuyết thimerosal gây tự kỷ, được chính CDC nêu rõ.

## Nhôm trong vắc-xin: bằng chứng lớn nhất hiện nay không thấy liên hệ có hại
Nhôm được dùng làm tá dược giúp tăng đáp ứng miễn dịch với liều kháng nguyên nhỏ hơn. Một nghiên cứu nhỏ hơn tại Mỹ (2022) từng ghi nhận tín hiệu liên hệ giữa nhôm từ vắc-xin và hen suyễn sau này — đây là một câu hỏi khoa học thật, không phải suy đoán vô căn cứ. Tuy nhiên, nghiên cứu lớn nhất và mới nhất hiện có (Đan Mạch, Annals of Internal Medicine 2025, theo dõi khoảng 1,2 triệu trẻ trong 24 năm) khảo sát 50 bệnh mạn tính không tìm thấy liên hệ giữa nhôm tích lũy từ vắc-xin với rối loạn tự miễn, dị ứng/hen suyễn, hay rối loạn phát triển thần kinh — tức là câu hỏi ban đầu đã được đặt ra một cách chính đáng và sau đó được trả lời bằng dữ liệu lớn hơn, không phải một sự thật bị che giấu.

## "Quá tải miễn dịch": giả thuyết đã được kiểm chứng trực tiếp và không được ủng hộ
Một nghiên cứu (Glanz và cộng sự, JAMA 2018) theo dõi 994 trẻ, so sánh tổng kháng nguyên vắc-xin đã tiêm với nguy cơ nhiễm trùng KHÔNG liên quan đến vắc-xin sau đó — không thấy khác biệt. Một tổng quan của AAP (Offit và cộng sự, Pediatrics 2002) tính toán hệ miễn dịch trẻ sơ sinh về lý thuyết có khả năng đáp ứng với lượng kháng nguyên lớn hơn rất nhiều so với yêu cầu của lịch tiêm hiện tại, và trẻ em ngày nay tiếp xúc với ÍT kháng nguyên hơn qua vắc-xin so với nhiều thập niên trước nhờ công nghệ tinh chế tốt hơn.

## Lưu ý
Việc tồn tại các cơ chế giám sát an toàn vắc-xin (như hệ thống báo cáo phản ứng sau tiêm, quỹ bồi thường ở một số nước) là dấu hiệu hệ thống y tế THẬN TRỌNG và minh bạch với các phản ứng hiếm gặp có thật (như phản vệ), không phải bằng chứng cho thấy vắc-xin nguy hiểm phổ biến — nhầm lẫn hai điều này là một trong những cách hiểu sai phổ biến nhất khi tiếp cận thông tin về vắc-xin.`,
    category: "Tiêm chủng",
    stage: "INFANT_6_12_MONTHS",
    evidenceLevel: "STRONG",
    knowledgeType: scientific,
    sources: [sources.hviid2019MmrAutismDenmark, sources.taylor2014VaccineAutismMetaAnalysis, sources.cochraneMmrChildren2012, sources.cdcThimerosal, sources.hviid2025AluminumVaccines, sources.daley2022AluminumAsthma, sources.offitMultipleVaccines2002],
  },
  {
    slug: "so-cuu-hoc-nghen-cho-tre-duoi-va-tren-1-tuoi",
    title: "Sơ cứu hóc nghẹn: kỹ thuật đúng cho trẻ dưới 1 tuổi và trên 1 tuổi (cập nhật 2025)",
    summary: "Hướng dẫn AHA/AAP cập nhật tháng 10/2025: trẻ dưới 1 tuổi dùng 5 lần vỗ lưng xen kẽ 5 lần ấn ngực (không ép bụng); trẻ từ 1 tuổi trở lên giờ đây dùng 5 lần vỗ lưng xen kẽ 5 lần ép bụng (thay đổi so với trước đây chỉ ép bụng) — lặp lại đến khi dị vật bật ra hoặc trẻ mất ý thức thì chuyển sang hồi sức tim phổi (CPR).",
    content: `## ⚠️ Đây là hướng dẫn vừa cập nhật — nên học thực hành trực tiếp
Hội Tim mạch Hoa Kỳ (AHA) và AAP đã ban hành bản cập nhật lớn về sơ cứu hóc nghẹn/CPR vào tháng 10/2025 — lần sửa đổi toàn diện đầu tiên kể từ 2020. Nội dung dưới đây phản ánh hướng dẫn MỚI NHẤT, có thể khác với những gì cha mẹ từng học trước đây. Đọc hướng dẫn không thay thế được việc học thực hành trực tiếp từ một đơn vị đào tạo sơ cứu uy tín — nên tham gia một lớp thực hành nếu có thể.

## Trẻ DƯỚI 1 tuổi
1. Đặt bé úp mặt dọc theo cẳng tay của người sơ cứu, cẳng tay tựa lên đùi, đầu bé thấp hơn ngực.
2. Vỗ **5 lần** vào giữa hai xương bả vai bằng gót bàn tay.
3. Lật bé ngửa lên (đầu vẫn thấp hơn ngực), ấn **5 lần** vào nửa dưới xương ức bằng gót bàn tay (kỹ thuật mới thay thế cách dùng 2 ngón tay trước đây).
4. Lặp lại chu kỳ 5 vỗ lưng + 5 ấn ngực cho đến khi dị vật bật ra HOẶC bé mất ý thức.
5. **Nếu bé mất ý thức**: đặt bé nằm trên mặt phẳng cứng và bắt đầu ngay hồi sức tim phổi (CPR) cho trẻ sơ sinh (xem bài riêng).
6. **KHÔNG dùng động tác ép bụng (Heimlich) cho trẻ dưới 1 tuổi** — nguy cơ tổn thương gan/lách do các cơ quan này còn nằm cao và chưa được bảo vệ tốt bởi khung xương sườn ở độ tuổi này.

## Trẻ TỪ 1 tuổi trở lên (thay đổi so với hướng dẫn cũ)
Trước đây, AHA chỉ khuyến nghị ép bụng (không vỗ lưng) cho nhóm tuổi này. **Hướng dẫn 2025 mới**: xen kẽ **5 lần vỗ lưng** với **5 lần ép bụng**, lặp lại đến khi dị vật bật ra hoặc trẻ mất ý thức.
- Ép bụng: đứng/quỳ phía sau trẻ (quỳ xuống nếu trẻ nhỏ), nắm tay đặt ngay trên rốn và dưới xương ức, tay kia ôm lấy nắm tay, giật mạnh vào trong và lên trên. Với trẻ nhỏ/nhẹ cân, dùng lực nhẹ nhàng hơn so với người lớn.
- Nếu trẻ mất ý thức: đặt nằm và bắt đầu CPR ngay.

## Dấu hiệu hóc nghẹn hoàn toàn cần cấp cứu ngay
Ọe (do phản xạ ăn dặm) vẫn có tiếng và luồng khí, mặt không tím — đây là bình thường, không cần can thiệp, chỉ cần theo dõi. Hóc nghẹn HOÀN TOÀN thường im lặng — trẻ không ho/khóc/phát ra tiếng được, có thể tím tái — đây là tình huống cần sơ cứu ngay lập tức theo các bước trên, đồng thời gọi người khác gọi cấp cứu 115.

## Lưu ý
Bài này hướng dẫn kỹ thuật xử trí khi đã xảy ra hóc nghẹn; các biện pháp phòng ngừa (tư thế ăn, kích thước thức ăn, giám sát) đã có trong bài "Phòng hóc nghẹn khi ăn dặm".`,
    category: "An toàn",
    stage: "INFANT_1_3_MONTHS",
    minimumAgeDays: 0,
    maximumAgeDays: 1095,
    evidenceLevel: "STRONG",
    knowledgeType: scientific,
    sources: [sources.ahaNewsroomChoking2025, sources.redCrossInfantChoking, sources.ahaPediatricBls2025Review],
  },
  {
    slug: "hoi-suc-tim-phoi-cpr-cho-tre-so-sinh-va-tre-nho",
    title: "Hồi sức tim phổi (CPR) cho trẻ sơ sinh và trẻ nhỏ (cập nhật 2025)",
    summary: "Trình tự C-A-B (ép tim trước) giữ nguyên; tốc độ ép 100-120 lần/phút, độ sâu khoảng 1/3 độ dày lồng ngực cho mọi lứa tuổi. Người sơ cứu đơn độc: tỷ lệ 30:2 ở mọi tuổi. Hai người sơ cứu: 15:2 nếu trẻ chưa dậy thì, 30:2 nếu đã dậy thì (thay cho mốc 8 tuổi cố định trước đây). Kỹ thuật ép ngực ở trẻ sơ sinh đổi từ 2 ngón tay sang gót bàn tay hoặc 2 ngón cái ôm quanh ngực.",
    content: `## ⚠️ Nội dung này KHÔNG thay thế một lớp học CPR thực hành
Đây là kiến thức nền tảng để hiểu quy trình — kỹ năng CPR thực sự cần được luyện tập tay trên mô hình dưới hướng dẫn của giảng viên được chứng nhận. Nên tham gia một khóa CPR trẻ em/trẻ sơ sinh càng sớm càng tốt.

## Khi nào bắt đầu CPR
Khi trẻ không phản ứng VÀ không thở bình thường (hoặc chỉ thở ngáp) — gọi người khác gọi cấp cứu 115 ngay trong khi bắt đầu CPR, hoặc nếu chỉ có một mình, thực hiện khoảng 2 phút CPR trước khi rời đi gọi cấp cứu.

## Trình tự C-A-B (ép tim - khai thông đường thở - thổi ngạt)
Đặt trẻ trên mặt phẳng cứng, bắt đầu ngay bằng ép tim thay vì kiểm tra đường thở trước — đây là trình tự đã được khuyến nghị từ 2010 và vẫn giữ nguyên trong bản cập nhật 2025.

## Tốc độ và độ sâu ép tim (không đổi từ 2020)
- Tốc độ: 100-120 lần/phút cho mọi lứa tuổi.
- Độ sâu: khoảng 1/3 độ dày trước-sau của lồng ngực (tương đương khoảng 4cm ở trẻ dưới 1 tuổi, khoảng 5cm ở trẻ từ 1 tuổi theo cách tính của một số hướng dẫn quốc tế).

## Kỹ thuật ép ngực theo tuổi — có thay đổi ở trẻ sơ sinh
- **Trẻ dưới 1 tuổi (cập nhật 2025)**: kỹ thuật "2 ngón tay" trước đây đã bị loại bỏ do nghiên cứu cho thấy không đạt đủ độ sâu ép. Kỹ thuật hiện tại: dùng **gót một bàn tay** ấn vào nửa dưới xương ức, hoặc **2 ngón tay cái ôm quanh lồng ngực** (ưu tiên khi có 2 người sơ cứu và có thể ôm trọn lồng ngực trẻ).
- **Trẻ từ 1 tuổi**: gót một bàn tay (trẻ nhỏ) hoặc gót một bàn tay có bàn tay kia đặt chồng lên, các ngón đan vào nhau (trẻ lớn hơn).

## Tỷ lệ ép tim : thổi ngạt
- Người sơ cứu đơn độc: **30:2** ở mọi lứa tuổi (không đổi).
- Hai người sơ cứu: **15:2** nếu trẻ CHƯA có dấu hiệu dậy thì; **30:2** (tỷ lệ người lớn) nếu trẻ ĐÃ có dấu hiệu dậy thì. Đây là thay đổi trong bản cập nhật 2025 — mốc chuyển từ "trẻ em" sang "người lớn" trước đây dùng tuổi cố định (thường là 8 tuổi), nay dựa vào dấu hiệu phát triển dậy thì thay vì một con số tuổi cứng nhắc.

## Lưu ý
Nếu không chắc trẻ còn thở bình thường hay không, luôn coi là cần CPR và bắt đầu ngay — hành động chậm trễ nguy hiểm hơn nhiều so với CPR không cần thiết ở người còn tỉnh táo (trẻ sẽ phản kháng nếu tỉnh).`,
    category: "An toàn",
    stage: "INFANT_1_3_MONTHS",
    minimumAgeDays: 0,
    maximumAgeDays: 1095,
    evidenceLevel: "STRONG",
    knowledgeType: scientific,
    sources: [sources.ahaPediatricBls2025Review, sources.nhsResuscitateChild, sources.ahaNewsroomChoking2025],
  },
  {
    slug: "phong-ngua-duoi-nuoc-va-xu-tri-khi-tre-duoi-nuoc",
    title: "Phòng ngừa đuối nước và xử trí khi trẻ bị đuối nước",
    summary: "AAP khuyến nghị nhiều lớp bảo vệ đồng thời (rào chắn hồ bơi 4 mặt, giám sát liên tục, học bơi, áo phao) vì không biện pháp đơn lẻ nào đủ để phòng ngừa đuối nước. \"Đuối nước khô/đuối nước thứ phát\" KHÔNG phải bệnh lý y khoa có thật — WHO, AAP, Hội Chữ thập đỏ đều bác bỏ thuật ngữ này. Việt Nam ghi nhận khoảng 2.000 trẻ dưới 15 tuổi tử vong do đuối nước mỗi năm — nguyên nhân tử vong hàng đầu ở nhóm tuổi này.",
    content: `## Nhiều lớp bảo vệ cùng lúc — không có biện pháp đơn lẻ nào đủ
AAP nhấn mạnh rõ: "không một biện pháp đơn lẻ nào có thể phòng ngừa mọi trường hợp đuối nước." Cần kết hợp: rào chắn hồ bơi 4 mặt với cổng tự đóng/tự khóa; giám sát người lớn liên tục, sát sao, có năng lực (không vừa trông trẻ vừa dùng điện thoại); cho trẻ học bơi (AAP hiện khuyến nghị có thể bắt đầu học bơi sau sinh nhật 1 tuổi); mặc áo phao khi đi thuyền/ở vùng nước mở; và người lớn xung quanh biết hồi sức tim phổi.

## Xử trí ngay khi trẻ được đưa ra khỏi nước
Nếu trẻ không thở bình thường hoặc không phản ứng, coi như đang/sắp ngừng tim và bắt đầu CPR NGAY LẬP TỨC. Vì đuối nước chủ yếu là vấn đề về HÔ HẤP (thiếu oxy) chứ không phải tim ngừng đập nguyên phát, hướng dẫn nhấn mạnh việc khôi phục hô hấp (thổi ngạt) quan trọng ngang với ép tim — không chỉ ép tim đơn thuần như một số tình huống ngừng tim khác.

## "Đuối nước khô" / "đuối nước thứ phát" — KHÔNG phải bệnh lý y khoa có thật
Đây là điểm cần nói rõ và dứt khoát: không có tình trạng y khoa nào được công nhận với tên "đuối nước khô," "đuối nước thứ phát," hay "đuối nước trì hoãn." WHO, AAP, Hội đồng Hồi sức Quốc tế, Hội Chữ thập đỏ Hoa Kỳ đều khuyến cáo không dùng các thuật ngữ này. Tên gọi y khoa chính xác cho một sự kiện chìm trong nước không tử vong là "tổn thương do ngâm nước" (submersion injury). Các trường hợp từng được gọi là "đuối nước khô/thứ phát" chiếm chưa đến 2% tổng số ca tử vong liên quan đến nước ở trẻ em, và biến chứng (nếu có) xuất hiện trong khung thời gian có thể nhận biết được ngay sau sự kiện, KHÔNG phải "vài ngày sau" như quan niệm phổ biến vẫn lo sợ.

## Đuối nước tại Việt Nam — dữ liệu thật, không phải suy đoán
Theo WHO và Bộ Y tế Việt Nam (7/2025): khoảng 2.000 trẻ dưới 15 tuổi tử vong do đuối nước mỗi năm tại Việt Nam — đây là NGUYÊN NHÂN TỬ VONG HÀNG ĐẦU ở nhóm tuổi này. Năm 2021, Việt Nam ghi nhận 4.019 ca tử vong do đuối nước ở mọi lứa tuổi, trong đó khoảng 40% (~1.608 ca) là trẻ dưới 14 tuổi. Tin tích cực: số ca tử vong do đuối nước ở trẻ em đã giảm hơn 20% trong giai đoạn 2020-2025, dù giới chức y tế nhận định tốc độ giảm "chưa đủ nhanh."

## Lưu ý
Với các gia đình Việt Nam có thói quen trữ nước trong xô/chậu/lu lớn, đây cũng là nguy cơ đuối nước thật (khác với đuối nước ở ao hồ/sông) — trẻ nhỏ có thể bị lộn đầu vào xô nước đầy một nửa và không tự trồi lên được vì trọng tâm cơ thể trẻ ở phần trên; nên đổ hết nước sau khi dùng hoặc đậy kín/để xa tầm với.`,
    category: "An toàn",
    stage: "TODDLER",
    evidenceLevel: "STRONG",
    knowledgeType: scientific,
    sources: [sources.aapDrowningPrevention2026, sources.redCrossDryDrowning, sources.whoVietnamDrowning2025, sources.cpscBucketDrowning],
  },
  {
    slug: "xu-tri-khan-cap-khi-phat-hien-tre-bat-tinh-luc-ngu",
    title: "Khi phát hiện trẻ bất tỉnh lúc ngủ: xử trí khẩn cấp và cập nhật an toàn giấc ngủ",
    summary: "Nếu phát hiện trẻ không phản ứng và không thở bình thường trong nôi, gọi cấp cứu và bắt đầu CPR ngay — đây là quy trình hồi sức trẻ sơ sinh chuẩn, không có phác đồ riêng cho tình huống này. Về phòng ngừa: AAP khuyến nghị ngừng quấn (swaddle) ngay khi bé có dấu hiệu tự lật (thường 3-4 tháng, có thể sớm hơn) vì bé bị quấn mà lật sấp sẽ không dùng tay để xoay mặt/bảo vệ đường thở được.",
    content: `## Nếu phát hiện trẻ bất tỉnh trong nôi
Đây không phải một tình huống có phác đồ sơ cứu riêng biệt — quy trình xử trí là hồi sức tim phổi (CPR) trẻ sơ sinh tiêu chuẩn:
1. Kiểm tra phản ứng (gọi tên, chạm nhẹ vào chân) — không lắc mạnh.
2. Nếu không phản ứng và không thở bình thường (hoặc chỉ thở ngáp): gọi người khác gọi cấp cứu 115 ngay, hoặc nếu chỉ một mình, thực hiện khoảng 2 phút CPR trước khi rời đi gọi.
3. Đặt bé trên mặt phẳng cứng, mở đường thở nhẹ nhàng (ngửa đầu-nâng cằm, tránh ngửa quá mức).
4. Bắt đầu CPR: 30 lần ép ngực (xem kỹ thuật ở bài CPR riêng) rồi 2 lần thổi ngạt, lặp lại liên tục cho đến khi có trợ giúp.

## Cập nhật quan trọng: thời điểm ngừng quấn (swaddle)
Quấn bé không phải là điều cấm kỵ, nhưng CẦN NGỪNG NGAY khi bé có bất kỳ dấu hiệu nào cho thấy đang tập lật — thường vào khoảng 3-4 tháng tuổi, nhưng AAP lưu ý điều này CÓ THỂ XẢY RA SỚM HƠN ở một số bé. Đây là mốc theo sự phát triển (khả năng lật), không phải một mốc tuổi cố định. Lý do: một bé đang bị quấn mà lật được sang tư thế nằm sấp sẽ không thể dùng tay để xoay mặt/tạo khoảng trống thở — làm tăng nguy cơ ngạt thở.

## Nhắc lại các nguyên tắc ngủ an toàn cốt lõi
Ngủ cùng phòng với người chăm sóc (trên bề mặt ngủ riêng, không nằm chung giường) ít nhất 6 tháng đầu, lý tưởng đến 12 tháng; nệm chắc phẳng, nôi trống hoàn toàn (không gối/chăn rời/thú bông); luôn đặt nằm ngửa cho đến 1 tuổi; không dùng chăn/địu/đồ ngủ có trọng lượng (weighted blanket/sleeper) cho bé.

## Lưu ý
Bài "Giấc ngủ an toàn cho bé dưới 1 tuổi" đã có các nguyên tắc phòng ngừa cơ bản; bài này bổ sung góc độ xử trí khẩn cấp và mốc ngừng quấn theo phát triển — cha mẹ nên đọc cả hai.`,
    category: "An toàn",
    stage: "NEWBORN_0_28_DAYS",
    minimumAgeDays: 0,
    maximumAgeDays: 183,
    evidenceLevel: "STRONG",
    knowledgeType: scientific,
    sources: [sources.aapSafeSleep2022, sources.nhsResuscitateChild],
  },
  {
    slug: "so-cuu-bong-cho-tre-em",
    title: "Sơ cứu bỏng cho trẻ em: làm ngay, không làm gì, khi nào cần cấp cứu",
    summary: "Xả nước mát (không đá lạnh) lên vết bỏng — NHS khuyến nghị 20 phút, AAP/Hiệp hội Bỏng Hoa Kỳ khuyến nghị tối thiểu 5 phút (một khác biệt thật giữa hai nguồn uy tín, không phải sai sót). Không dùng đá, bơ, kem đánh răng hay mẹo dân gian. Bỏng ở mặt, tay, chân, bộ phận sinh dục, khớp, hoặc phồng rộp lớn hơn lòng bàn tay trẻ luôn cần cấp cứu bất kể diện tích tổng thể.",
    content: `## Làm ngay: xả nước mát
Xả vết bỏng dưới vòi nước MÁT (không phải nước đá lạnh) càng sớm càng tốt.

## Điểm CONFLICTING_EVIDENCE: bao lâu là đủ?
NHS (Anh) khuyến nghị xả nước mát 20 phút. AAP và Hiệp hội Bỏng Hoa Kỳ khuyến nghị tối thiểu 5 phút. Đây là khác biệt thật giữa hai nguồn uy tín — không phải một bên sai. Các nghiên cứu gần đây (tổng quan trên tạp chí Burns, Annals of Emergency Medicine) nghiêng về ủng hộ 20 phút cho kết quả tốt hơn (ít sẹo hơn, giảm đau tốt hơn) ở bỏng trẻ em — nên xem 20 phút là mục tiêu lý tưởng nếu trẻ chịu được, còn 5 phút là mức tối thiểu chắc chắn có ích, không phải mức trần.

## KHÔNG làm những điều sau
Không dùng đá/nước đá (làm tổn thương mô nặng hơn, nguy cơ hạ thân nhiệt); không dùng bơ/dầu/kem đánh răng/mẹo dân gian (giữ nhiệt, tăng nguy cơ nhiễm trùng); không chà xát vết bỏng; không cố ý làm vỡ bọng nước (bọng nước là lớp bảo vệ tự nhiên).

## Quần áo/trang sức
Cởi bỏ quần áo/trang sức GẦN vết bỏng (đề phòng sưng), nhưng KHÔNG cố gỡ bất cứ thứ gì đã DÍNH vào vùng da bị bỏng.

## Phân loại mức độ bỏng
- Độ 1: đỏ da, không phồng rộp (như cháy nắng).
- Độ 2: tổn thương lớp ngoài + lớp bì, đau nhiều, thường có phồng rộp.
- Độ 3: da cháy sém/trắng/dai như da thuộc, mất cảm giác — luôn là cấp cứu.

## Khi nào cần cấp cứu ngay (bất kể diện tích tổng thể)
Bỏng điện, bỏng hóa chất, da cháy sém/trắng/mất cảm giác, hoặc bỏng ở MẶT, TAY, CHÂN, BỘ PHẬN SINH DỤC, hoặc trên một KHỚP. Theo diện tích: phồng rộp lớn hơn lòng bàn tay của trẻ, hoặc ước tính từ 10% diện tích cơ thể trở lên.

## Có thể chăm tại nhà
Bỏng nhỏ, nông, không phồng rộp và không ở các vị trí trên — sau khi xả nước mát, có thể che nhẹ bằng màng bọc thực phẩm (không quấn chặt quanh chi) trong lúc chờ được khám nếu chưa chắc chắn mức độ nghiêm trọng.`,
    category: "An toàn",
    stage: "INFANT_6_12_MONTHS",
    minimumAgeDays: 0,
    maximumAgeDays: 1095,
    evidenceLevel: "STRONG",
    knowledgeType: scientific,
    sources: [sources.nhsBurnsTreatment, sources.ameriburnFirstAid, sources.healthyChildrenBurnFaq, sources.childrensBurnsTrustHotDrinks],
  },
  {
    slug: "nga-va-chan-thuong-dau-o-tre-khi-nao-can-di-kham",
    title: "Té ngã và chấn thương đầu ở trẻ: khi nào cần đi khám ngay, và sự thật về việc để trẻ ngủ",
    summary: "Dấu hiệu cần khám ngay: mất ý thức, nôn nhiều lần (>2-3 lần), lơ mơ/khó đánh thức bất thường, co giật, chảy dịch trong/máu từ mũi-tai, đau đầu dữ dội tăng dần, thay đổi hành vi. Trẻ dưới 2 tuổi cần đánh giá riêng vì chưa biết mô tả triệu chứng. Quan niệm \"không được để trẻ ngủ sau chấn thương đầu\" đã LỖI THỜI — hướng dẫn hiện tại cho phép ngủ bình thường, chỉ cần kiểm tra mỗi 2-3 giờ.",
    content: `## Dấu hiệu cần đi khám/cấp cứu ngay
Mất ý thức (dù chỉ vài giây); nôn nhiều hơn 2-3 lần; lơ mơ, khó đánh thức, phản ứng chậm bất thường; co giật; chảy dịch trong hoặc máu từ mũi/tai; đau đầu dữ dội hoặc tăng dần; lú lẫn, nói ngọng, yếu tay chân, thay đổi thị lực; hoặc "không hành động như bình thường" theo nhận định của cha mẹ.

## Trẻ dưới 2 tuổi cần đánh giá khác
Vì trẻ nhỏ chưa thể tự mô tả đau đầu/chóng mặt, các dấu hiệu cần dựa vào hành vi/bú ăn/mức độ tỉnh táo nhiều hơn là lời kể. Một công cụ quyết định lâm sàng đã được kiểm chứng qua hơn 40.000 trẻ (PECARN) dùng bộ tiêu chí RIÊNG cho nhóm dưới 2 tuổi và nhóm từ 2 tuổi trở lên — phản ánh đúng thực tế là hai nhóm tuổi cần đánh giá khác nhau. Với trẻ dưới 2 tuổi, các yếu tố như khối máu tụ da đầu ở vùng chẩm/đỉnh/thái dương, hoặc "cha mẹ nhận thấy bé không bình thường," có giá trị cảnh báo cao dù bản thân bé không thể "kể" triệu chứng.

## Quan niệm "không được để trẻ ngủ" — đã LỖI THỜI
Đây là điểm cần sửa rõ ràng: hướng dẫn hiện tại của NHS và AAP đều nói việc để trẻ ngủ sau chấn thương đầu nhẹ là BÌNH THƯỜNG và không có hại — giấc ngủ thực ra hỗ trợ phục hồi. Thay vì đánh thức trẻ liên tục mỗi giờ suốt đêm (cách làm cũ), hướng dẫn hiện tại chỉ khuyên KIỂM TRA trẻ mỗi 2-3 giờ — không cần đánh thức hoàn toàn, chỉ cần xác nhận trẻ phản ứng bình thường (cựa quậy, có phản xạ khi gọi tên/chạm nhẹ) rồi để trẻ ngủ tiếp. Cần phân biệt rõ NGỦ BÌNH THƯỜNG (có thể đánh thức được) với BẤT TỈNH (không thể đánh thức) — đây là dấu hiệu nguy hiểm thực sự cần cấp cứu ngay.

## Lưu ý
Sau một cú ngã/va đập đầu không có dấu hiệu nguy hiểm nào ở trên, theo dõi tại nhà trong 24-48 giờ là hợp lý; nếu không chắc chắn, luôn ưu tiên đưa trẻ đi khám thay vì tự theo dõi thêm, đặc biệt với trẻ dưới 2 tuổi.`,
    category: "An toàn",
    stage: "TODDLER",
    evidenceLevel: "STRONG",
    knowledgeType: scientific,
    sources: [sources.healthyChildrenHeadInjury, sources.pecarnValidationPmc, sources.nbtHeadInjuryAdvice],
  },
  {
    slug: "so-cuu-ngo-doc-o-tre-em",
    title: "Sơ cứu ngộ độc ở trẻ em: không gây nôn, gọi ngay hỗ trợ y tế",
    summary: "KHÔNG được gây nôn dưới bất kỳ hình thức nào (AAP đã chính thức bỏ khuyến nghị dùng siro ipecac tại nhà từ năm 2003) — gây nôn không cải thiện kết cục và có thể gây hại thêm, đặc biệt với hóa chất ăn mòn. Gọi 115 hoặc đưa trẻ đi khám ngay, giữ lại vỏ/hộp sản phẩm để xác định chất đã nuốt. Viên sắt bổ sung từng là nguyên nhân ngộ độc gây tử vong hàng đầu ở trẻ nhỏ do trông giống kẹo.",
    content: `## KHÔNG được gây nôn
Đây là điểm quan trọng nhất, đã được xác lập từ lâu chứ không phải hướng dẫn mới: TUYỆT ĐỐI không cố gây nôn cho trẻ nghi ngộ độc, trừ khi được nhân viên y tế/trung tâm chống độc hướng dẫn cụ thể. AAP đã chính thức bỏ khuyến nghị dự trữ siro ipecac (gây nôn) tại nhà từ năm 2003, vì không có bằng chứng cải thiện kết cục, và với hóa chất ăn mòn (axit/kiềm/chất tẩy rửa), nôn ra sẽ gây bỏng thực quản LẦN THỨ HAI trên đường trào ngược lên.

## Cần làm ngay
1. Nếu chất còn trong miệng, giúp trẻ nhổ ra hoặc lấy ra bằng ngón tay.
2. Gọi cấp cứu 115 hoặc đưa trẻ đi khám ngay — kể cả khi trẻ có vẻ bình thường, vì một số chất gây triệu chứng muộn.
3. Giữ lại vỏ/hộp/bao bì sản phẩm để nhân viên y tế xác định chính xác chất đã nuốt.
4. Chuẩn bị sẵn thông tin: tuổi/cân nặng của trẻ, tên chất, lượng ước tính, thời điểm nuốt, tiền sử dị ứng/bệnh nền.
5. Đưa trẻ đi cấp cứu ngay nếu có bất kỳ thay đổi hành vi, bắt đầu nôn, hoặc lơ mơ.

## Viên sắt bổ sung — nguy cơ đặc biệt vì giống kẹo
Đây là một trong những nguyên nhân ngộ độc gây tử vong được ghi nhận rõ nhất trong lịch sử y văn: một báo cáo dịch tễ (CDC MMWR) ghi nhận cụm 5 ca tử vong ở trẻ nhỏ (11-18 tháng) trong 7 tháng chỉ tại một khu vực do nuốt viên sắt bổ sung, so với chỉ 3 ca tử vong do ngộ độc sắt trong cả 5 năm trước đó cùng khu vực. Nguyên nhân: viên sắt/vitamin tổng hợp có hình dạng, màu sắc giống kẹo. Tin tốt: nhờ quy định đóng gói an toàn hơn (vỉ đơn liều) và nhận thức cộng đồng tăng lên, số ca tử vong đã giảm đáng kể trong những năm gần đây so với giai đoạn trước.

## Nguyên tắc bảo quản thuốc/hóa chất an toàn
Khóa/để cao ngoài tầm với và tầm nhìn của trẻ; luôn giữ trong hộp/lọ gốc có nhãn; đóng nắp an toàn lại ngay sau mỗi lần dùng, không để "dùng xong tính sau"; KHÔNG BAO GIỜ gọi thuốc là "kẹo" để dụ trẻ uống; nhắc khách đến nhà cũng cất thuốc mang theo cẩn thận.

## Tinh dầu — nguy cơ có thật, không phải cường điệu
Một số loại tinh dầu có nguy cơ ngộ độc thật đã được ghi nhận ở trẻ nhỏ nếu nuốt phải: long não (camphor) — có thể gây co giật chỉ với lượng rất nhỏ; khuynh diệp (eucalyptus) — có thể gây co giật/hôn mê; dầu gió xanh (wintergreen/methyl salicylate) — độc tính tương đương liều lớn aspirin nếu nuốt. Nên bảo quản tinh dầu như thuốc, ngoài tầm với trẻ nhỏ.

## ⚠️ Về số điện thoại Trung tâm Chống độc tại Việt Nam
Trung tâm Chống độc (Bệnh viện Bạch Mai) là đơn vị có thật, nhưng số điện thoại trực tiếp của trung tâm KHÔNG xác minh được nhất quán qua các nguồn khác nhau trong quá trình nghiên cứu — vì vậy app này KHÔNG đưa ra một số điện thoại cụ thể để tránh sai lệch. Trong tình huống ngộ độc, hãy gọi ngay **115** (cấp cứu y tế) hoặc đến cơ sở y tế gần nhất — đây là số được xác nhận chắc chắn.`,
    category: "An toàn",
    stage: "TODDLER",
    evidenceLevel: "STRONG",
    knowledgeType: scientific,
    sources: [sources.poisonControlIpecac, sources.poisonControlIronPoisoning, sources.cdcIronPoisoningMmwr, sources.bachMaiChongDoc, sources.poisonControlEssentialOils, sources.vietnamEmergencyNumber115],
  },
  {
    slug: "nuot-phai-pin-cuc-ao-va-di-vat-nho-cap-cuu-khan-cap",
    title: "Nuốt phải pin cúc áo và dị vật nhỏ: cấp cứu khẩn cấp khác với hóc nghẹn thông thường",
    summary: "Pin cúc áo (pin cúc/pin đồng xu lithium) nguy hiểm hơn hẳn dị vật khác — có thể gây bỏng thực quản chỉ trong 2 giờ do phản ứng điện hóa, tổn thương vẫn có thể tiếp diễn sau khi lấy pin ra. Mật ong có thể dùng như biện pháp \"câu giờ\" trên đường đi cấp cứu (CHỈ với trẻ từ 12 tháng trở lên, trong vòng 12 giờ sau khi nuốt) nhưng không thay thế việc đi cấp cứu ngay. Nhiều nam châm nhỏ nuốt cùng lúc là nguy cơ nghiêm trọng riêng biệt, có thể gây thủng ruột.",
    content: `## Vì sao pin cúc áo nguy hiểm hơn hẳn dị vật khác
Khác với đồng xu hay dị vật trơ khác, một viên pin cúc áo mắc kẹt sẽ tạo ra phản ứng hóa học (nước bọt hoàn thành mạch điện, tạo dung dịch kiềm) chủ động đốt cháy mô xung quanh. Tổn thương thực quản nghiêm trọng có thể xảy ra chỉ trong VÒNG 2 GIỜ sau khi pin mắc kẹt. Điều quan trọng: tổn thương CÓ THỂ TIẾP TỤC tiến triển ngay cả SAU KHI đã lấy pin ra — đây là điểm khác biệt lớn nhất so với dị vật thông thường, và là lý do "chờ xem sao" không bao giờ là lựa chọn phù hợp với pin cúc áo.

## Mật ong — biện pháp "câu giờ" có thật, nhưng có điều kiện chặt chẽ
Hướng dẫn chính thức từ trung tâm chống độc uy tín tại Mỹ xác nhận: có thể cho uống mật ong ngay trên đường đến bệnh viện nếu nghi ngờ nuốt pin cúc/đồng xu lithium, VỚI ĐIỀU KIỆN: trẻ từ **12 tháng tuổi trở lên** (dưới 12 tháng chống chỉ định vì nguy cơ ngộ độc botulism từ bào tử trong mật ong chưa tiệt trùng), và việc nuốt xảy ra trong vòng **12 giờ** trước đó. Liều: khoảng 10ml (2 thìa cà phê), lặp lại mỗi 10 phút, tối đa 6 lần. Cơ chế: mật ong tạo lớp phủ tạm thời làm CHẬM phản ứng hóa học — **KHÔNG NGĂN CHẶN** tổn thương, chỉ trì hoãn. Nguồn hướng dẫn nhấn mạnh rõ: "mật ong KHÔNG thay thế việc lấy pin ra khẩn cấp — không được vì cho uống mật ong mà trì hoãn đến bệnh viện."

## Việc cần làm khi nghi ngờ nuốt pin cúc áo
Đến cấp cứu NGAY LẬP TỨC, dù trẻ có vẻ bình thường. Nếu đủ điều kiện (trên 12 tháng, trong 12 giờ) và có sẵn mật ong, có thể cho uống trong lúc di chuyển đến viện — không phải để thay thế việc đi cấp cứu. Trẻ dưới 12 tuổi nghi nuốt pin nên được chụp X-quang ngay để xác định vị trí, bất kể kích thước pin.

## Nam châm nhỏ — nguy cơ nghiêm trọng riêng biệt
Nguy hiểm đặc biệt xảy ra khi trẻ nuốt NHIỀU nam châm nhỏ mạnh (hoặc một nam châm cộng một vật kim loại khác) trong các lần nuốt riêng biệt — các nam châm có thể hút nhau XUYÊN QUA thành ruột, kẹp chặt mô ruột giữa chúng, gây hoại tử, thủng ruột, nhiễm trùng, thậm chí tử vong. Đây là cơ chế HOÀN TOÀN KHÁC với một dị vật trơ đơn thuần. Cần cảnh giác đặc biệt với đồ chơi nam châm nhỏ (bi nam châm, khối nam châm) — nhiều quốc gia đã ban hành quy định an toàn bắt buộc và tiếp tục thu hồi sản phẩm loại này.

## Dị vật nhỏ nói chung
Đồng xu là dị vật nuốt phải phổ biến nhất và thường tự đào thải, ít nguy hiểm hơn nhiều so với pin/nam châm. Đồ chơi có bộ phận nhỏ dành cho trẻ dưới 3 tuổi phải tuân theo quy chuẩn kích thước an toàn tại nhiều nước — mọi bộ phận đủ nhỏ để lọt qua một ống kiểm tra kích thước tiêu chuẩn đều bị cấm với đồ chơi trẻ dưới 3 tuổi.

## Lưu ý
Luôn cất pin cúc áo, đồ chơi/thiết bị có pin cúc áo tháo lắp được, và bộ nam châm nhỏ ngoài tầm với trẻ nhỏ — đây là 2 trong số ít tình huống dị vật mà thời gian phản ứng có thể quyết định mức độ tổn thương lâu dài.`,
    category: "An toàn",
    stage: "TODDLER",
    evidenceLevel: "STRONG",
    knowledgeType: scientific,
    sources: [sources.poisonControlBatteryGuideline, sources.cpscMagnetStandard2022],
  },
  {
    slug: "ghe-ngoi-o-to-cho-tre-em-tai-viet-nam",
    title: "Ghế ngồi ô tô cho trẻ em: khuyến nghị quốc tế và luật mới tại Việt Nam",
    summary: "AAP khuyến nghị ngồi quay mặt về sau CÀNG LÂU CÀNG TỐT theo giới hạn của ghế (không còn mốc cố định \"1 tuổi/9kg\" như trước), rồi chuyển sang ghế quay mặt về trước có dây đai, rồi ghế nâng đến khi dây an toàn người lớn vừa vặn (~145cm, 8-12 tuổi). Việt Nam đã có luật bắt buộc ghế an toàn ô tô cho trẻ dưới 10 tuổi/dưới 1,35m từ 1/7/2026, nhưng tỷ lệ sử dụng thực tế mới chỉ khoảng 4,6% — mức phạt với lỗi thiếu ghế đã giảm xuống chỉ còn cảnh cáo từ 15/8/2026.",
    content: `## Ghế quay mặt về sau — không còn mốc tuổi cố định
AAP đã bỏ quy tắc cũ ("ít nhất 1 tuổi và 9kg mới được quay mặt về trước"). Khuyến nghị hiện tại: trẻ nên ngồi quay mặt về sau CÀNG LÂU CÀNG TỐT, cho đến khi đạt giới hạn cân nặng/chiều cao TỐI ĐA của chính chiếc ghế đó (nhiều ghế hiện đại cho phép quay mặt về sau đến 18-23kg) — nghĩa là ranh giới thực sự nằm ở giới hạn của ghế, không phải một mốc tuổi cứng nhắc. Lý do: dữ liệu sinh cơ học va chạm mới cho thấy tư thế quay mặt về sau bảo vệ đầu/cổ/cột sống còn non nớt của trẻ tốt hơn.

## Các giai đoạn tiếp theo
- **Ghế quay mặt về trước có dây đai 5 điểm**: dùng đến khi đạt giới hạn của ghế (nhiều ghế cho phép đến 27kg trở lên).
- **Ghế nâng (booster)**: dùng đến khi dây an toàn người lớn vừa vặn đúng cách — thường khoảng chiều cao 1,45m, độ tuổi 8-12.
- **Bài kiểm tra 5 bước để biết trẻ đã sẵn sàng bỏ ghế nâng chưa** (cần đúng cả 5): lưng áp sát ghế; đầu gối gập tự nhiên ở mép ghế; dây đai ngang bụng nằm thấp, phẳng trên đùi (không tì lên bụng); dây đai vai nằm ngang qua xương đòn (không cắt ngang cổ/mặt); trẻ có thể giữ tư thế này suốt hành trình mà không trượt xuống.

## Không bao giờ để trẻ một mình trong xe
Nhiệt độ trong xe có thể tăng khoảng 20°F chỉ trong 10 phút đầu, đạt khoảng 109°F (~43°C) sau 20 phút dù trời chỉ ở mức ấm vừa phải — thân nhiệt trẻ tăng nhanh gấp 3-5 lần người lớn. Phần lớn các ca tử vong do bị bỏ quên trong xe là do NGƯỜI LỚN QUÊN, không phải cố ý — nên tạo thói quen kiểm tra ghế sau mỗi khi xuống xe.

## Luật Việt Nam — mới có hiệu lực, đang trong giai đoạn điều chỉnh
Luật Trật tự, an toàn giao thông đường bộ (36/2024/QH15) quy định: trẻ dưới 10 tuổi VÀ dưới 1,35m chiều cao không được ngồi cùng hàng ghế với lái xe (trừ xe chỉ có 1 hàng ghế), và người lái phải sử dụng/hướng dẫn sử dụng thiết bị an toàn phù hợp cho trẻ. Quy định này ban đầu dự kiến hiệu lực từ 1/1/2026, sau đó lùi lại đến **1/7/2026**. Xe kinh doanh vận tải hành khách (taxi, xe công nghệ, xe hợp đồng/tuyến cố định) được miễn trừ yêu cầu về thiết bị an toàn.

## Thực tế sử dụng tại Việt Nam còn rất thấp
Theo khảo sát trong nước, tỷ lệ dùng ghế an toàn ô tô cho trẻ mới tăng từ khoảng 1,3% (2022) lên khoảng 4,6% (2024) — vẫn còn rất thấp; 42% trẻ vẫn ngồi ở hàng ghế trước; hơn 60% cha mẹ được khảo sát thiếu kiến thức cơ bản về ghế an toàn. Đáng chú ý, mức phạt với lỗi thiếu thiết bị an toàn cho trẻ đã được điều chỉnh giảm xuống chỉ còn hình thức cảnh cáo (không phạt tiền) từ 15/8/2026 đối với xe cá nhân, trong khi lỗi để trẻ ngồi hàng ghế trước vẫn bị phạt tiền.

## Lưu ý
Đây là quy định pháp luật đang trong giai đoạn triển khai và có thể tiếp tục điều chỉnh — nên tham khảo cập nhật mới nhất từ cơ quan chức năng khi cần biết chính xác mức phạt hiện hành, thay vì chỉ dựa vào nội dung này.`,
    category: "An toàn",
    stage: "NEWBORN_0_28_DAYS",
    minimumAgeDays: 0,
    maximumAgeDays: 1095,
    evidenceLevel: "STRONG",
    knowledgeType: scientific,
    sources: [sources.aapCarSeatPolicy2018, sources.nhtsaCarSeats, sources.nhtsaHeatstroke, sources.vietnamCarSeatLaw2024, sources.vietnamCarSeatUsageRate],
  },
  {
    slug: "an-toan-xe-may-cho-tre-em-tai-viet-nam",
    title: "An toàn xe máy cho trẻ em tại Việt Nam: mũ bảo hiểm và nguy cơ chấn thương",
    summary: "Mũ bảo hiểm bắt buộc với trẻ từ 6 tuổi trở lên tại Việt Nam, nhưng tỷ lệ đội mũ ở trẻ nhỏ vẫn thấp hơn nhiều so với người lớn (15-53% ở trẻ ≤7 tuổi so với 90-99% ở người lớn). Trẻ dưới 6 tuổi được MIỄN quy định đội mũ vì mũ tiêu chuẩn quá to/nặng so với cổ trẻ — đây là khoảng trống về sản phẩm phù hợp, không phải bằng chứng trẻ nhỏ ít rủi ro hơn; thực tế trẻ nhỏ có nguy cơ chấn thương đầu/mặt cao HƠN khi không đội mũ.",
    content: `## Quy định pháp luật
Mũ bảo hiểm bắt buộc với người ngồi trên xe máy từ 6 tuổi trở lên tại Việt Nam (Nghị định 34/2010/NĐ-CP). Mức phạt hiện hành (Nghị định 168/2024/NĐ-CP, hiệu lực từ 1/1/2025): 400.000-600.000 đồng cho lỗi không đội mũ hoặc đội mũ không cài quai, áp dụng cho cả người lái và người ngồi sau, kể cả khi người ngồi sau là trẻ em từ 6 tuổi.

## Vì sao trẻ dưới 6 tuổi được miễn — và vì sao điều này không có nghĩa là an toàn hơn
Lý do miễn trừ là vì mũ bảo hiểm tiêu chuẩn hiện có trên thị trường thường quá nặng/quá to so với cổ và hộp sọ đang phát triển của trẻ nhỏ — đây là một khoảng trống về SẢN PHẨM phù hợp, KHÔNG PHẢI một đánh giá rằng trẻ nhỏ ít rủi ro hơn khi không đội mũ. Trên thực tế, dữ liệu chấn thương cho thấy điều ngược lại: trẻ từ 3 tuổi trở xuống và nhóm 4-6 tuổi có nguy cơ chấn thương đầu/mặt CAO HƠN đáng kể so với trẻ lớn hơn khi là hành khách xe máy không đội mũ.

## Tỷ lệ tuân thủ còn thấp
Người lớn đội mũ bảo hiểm đạt tỷ lệ rất cao (90-99%), nhưng trẻ em thì thấp hơn nhiều: chỉ khoảng 15-53% ở trẻ từ 7 tuổi trở xuống, 38-53% ở nhóm 7-14 tuổi (số liệu dao động theo từng nghiên cứu/khu vực/năm). Một nghiên cứu tại Hà Nam và Ninh Bình ghi nhận tỷ lệ đội mũ ĐÚNG CÁCH (cài quai đúng, vừa vặn) ở trẻ chỉ khoảng 28-30% — nhiều mũ được đội nhưng không cài quai hoặc không vừa kích cỡ. Rào cản được ghi nhận: cha mẹ cho rằng trẻ không cần mũ, trẻ phản kháng khi đội, thiếu mũ vừa kích cỡ trẻ em trên thị trường, và việc xử phạt còn yếu.

## Hiệu quả của mũ bảo hiểm
Đội mũ đúng cách giúp giảm khoảng 42% nguy cơ tử vong và gần 70% nguy cơ chấn thương nặng khi xảy ra tai nạn (số liệu WHO, áp dụng chung, không riêng Việt Nam).

## Lưu ý
Chưa tìm được hướng dẫn chính thức (WHO hay cơ quan giao thông Việt Nam) về độ tuổi tối thiểu nên cho trẻ nhỏ/sơ sinh ngồi xe máy, hay khuyến nghị cụ thể về ghế/dây an toàn gắn thêm cho xe máy — đây là khoảng trống thông tin cần lưu ý. Nên ưu tiên tìm mũ bảo hiểm vừa kích cỡ đầu trẻ (dù dưới 6 tuổi không bắt buộc theo luật) và hạn chế chở trẻ nhỏ trên xe máy khi có phương án di chuyển an toàn hơn.`,
    category: "An toàn",
    stage: "TODDLER",
    evidenceLevel: "STRONG",
    knowledgeType: scientific,
    sources: [sources.vietnamMotorbikeHelmetChild, sources.vietnamMotorbikeHelmetLaw],
  },
  {
    slug: "an-toan-trong-nha-nguy-co-thuong-gap",
    title: "An toàn trong nhà: bỏng nước sôi, té ngã từ ban công/cửa sổ, và nguy cơ từ xô/chậu trữ nước",
    summary: "Bỏng nước nóng (nước sôi, trà, cà phê) là nguyên nhân bỏng hàng đầu ở trẻ dưới 4 tuổi — da trẻ bỏng nhanh gấp khoảng 4 lần người lớn, nước 60°C chỉ cần 5 giây đã gây bỏng toàn bộ độ dày da. Té ngã từ ban công/cửa sổ chung cư là nguy cơ có thật tại Việt Nam (đã có ca việc thật gây chú ý) nhưng chưa có thống kê chính thức. Xô/chậu trữ nước đầy một nửa là nguy cơ đuối nước riêng biệt với ao hồ, do trọng tâm trẻ nhỏ dễ khiến trẻ lộn đầu vào và không tự thoát ra được.",
    content: `## Bỏng nước nóng — nguy cơ hàng đầu, đặc biệt liên quan văn hóa uống trà/cà phê nóng
Bỏng do nước nóng là nguyên nhân bỏng phổ biến nhất ở trẻ dưới 4 tuổi trên toàn cầu. Da trẻ em bỏng nhanh gấp khoảng 1/4 thời gian so với da người lớn — nước ở 60°C chỉ cần 5 giây tiếp xúc đã đủ gây bỏng toàn bộ độ dày da ở trẻ nhỏ. Với thói quen uống trà/cà phê nóng phổ biến, nên luôn để đồ uống nóng xa tầm với, không bế trẻ trong khi cầm đồ uống nóng, và cẩn thận với khăn trải bàn có thể bị trẻ kéo làm đổ đồ uống nóng xuống người.

## Té ngã từ ban công/cửa sổ — nguy cơ có thật tại các đô thị đông đúc
Đây là nguy cơ được ghi nhận qua các vụ việc thực tế tại Việt Nam và khu vực (bao gồm các vụ việc từng gây chú ý trên mạng xã hội), phản ánh mối lo ngại chung ở các thành phố châu Á có mật độ nhà cao tầng lớn. Tuy nhiên, chưa tìm được số liệu thống kê chính thức về tỷ lệ/mức độ nghiêm trọng cụ thể tại Việt Nam trong quá trình nghiên cứu — nên xem đây là nguy cơ đáng phòng ngừa dựa trên các trường hợp thực tế đã biết, không phải một con số thống kê chính xác. Biện pháp phòng ngừa hợp lý: lắp song chắn/lưới an toàn ở cửa sổ và ban công tại các tầng cao, không đặt ghế/đồ nội thất gần cửa sổ/ban công mà trẻ có thể trèo lên, giám sát chặt khi trẻ chơi gần khu vực này.

## Xô/chậu trữ nước — nguy cơ đuối nước khác với ao hồ
Đây là nguy cơ đáng chú ý với các gia đình có thói quen trữ nước sinh hoạt trong xô/chậu/lu lớn — cơ chế nguy hiểm khác với đuối nước ở ao hồ/sông: một xô nước đầy khoảng một nửa có chiều cao gần bằng nửa người trẻ nhỏ, miệng xô nằm gần trọng tâm cơ thể trẻ, khiến xô dễ mất cân bằng và trẻ có thể lộn đầu vào trong — trẻ không đủ sức để tự đẩy người ra ngoài trong tư thế này. Biện pháp đơn giản: đổ hết nước sau khi dùng xong việc nhà, hoặc đậy kín/để xa tầm với trẻ nhỏ đang tập bò/tập đi.

## Các ưu tiên chống trẻ em chung khác
Cửa chặn đầu/cuối cầu thang; khóa tủ đựng hóa chất tẩy rửa/thuốc/pin/dụng cụ sắc nhọn ưu tiên trước tiên; nắp che ổ điện; không dựa vào duy nhất nắp chai/lọ "chống trẻ em" (chỉ là một lớp bảo vệ, không phải tuyệt đối) — vẫn cần cất cao/khóa kỹ song song.

## Lưu ý
Đuối nước là nguyên nhân tử vong do thương tích hàng đầu ở trẻ em Việt Nam nói chung (xem bài riêng về phòng ngừa đuối nước) — nguy cơ từ xô/chậu là một phần trong bức tranh đó, đặc biệt với trẻ nhỏ chưa biết đi vững.`,
    category: "An toàn",
    stage: "INFANT_6_12_MONTHS",
    minimumAgeDays: 0,
    maximumAgeDays: 1095,
    evidenceLevel: "STRONG",
    knowledgeType: scientific,
    sources: [sources.childrensBurnsTrustHotDrinks, sources.cpscBucketDrowning, sources.whoVietnamDrowning2025],
  },
  {
    slug: "lieu-dung-thuoc-ha-sot-an-toan-cho-tre",
    title: "Liều dùng thuốc hạ sốt an toàn cho trẻ: paracetamol, ibuprofen và sai lầm thường gặp",
    summary: "Tính liều theo CÂN NẶNG, không theo tuổi: paracetamol 10-15mg/kg/lần, cách 4 giờ, tối đa 5 lần/24 giờ. Ibuprofen không dùng cho trẻ dưới 6 tháng (nguy cơ ảnh hưởng thận non nớt + mất nước) trừ khi bác sĩ chỉ định khác. Nguy cơ quá liều paracetamol phổ biến nhất đến từ việc dùng đồng thời 2 sản phẩm khác nhau đều chứa paracetamol mà cha mẹ không nhận ra (ví dụ thuốc cảm kết hợp cộng thêm thuốc hạ sốt riêng).",
    content: `## Tính liều theo cân nặng, không theo tuổi
Đây là nguyên tắc quan trọng nhất: liều thuốc hạ sốt luôn dựa trên CÂN NẶNG hiện tại của trẻ, không phải tuổi — dùng đúng ống/xy-lanh đong liều đi kèm sản phẩm, không dùng thìa ăn cơm tại nhà để đong.

## Paracetamol (acetaminophen)
Liều: 10-15mg/kg/lần, cách nhau 4 giờ, tối đa 5 lần trong 24 giờ. Không dùng cho trẻ dưới 2 tháng mà không có chỉ định bác sĩ; thận trọng đặc biệt với trẻ dưới 2 tuổi nói chung, nên hỏi bác sĩ/dược sĩ trước khi dùng.

## Ibuprofen — không dùng cho trẻ dưới 6 tháng
Đây là ngưỡng tuổi chính thức, có lý do cụ thể: ibuprofen (thuộc nhóm NSAID) được đào thải qua thận và có thể làm giảm lưu lượng máu đến thận; thận của trẻ dưới 6 tháng chưa phát triển đủ để bù trừ cho tác động này, đặc biệt khi trẻ đã có nguy cơ mất nước do chính bệnh gây sốt. Đến 6 tháng tuổi, chức năng thận thường đã phát triển đủ để dùng an toàn hơn.

## Điểm CONFLICTING_EVIDENCE: có nên xen kẽ/kết hợp paracetamol và ibuprofen?
Hướng dẫn lâu năm của AAP (tái xác nhận 2022) khuyên chỉ dùng MỘT loại thuốc hạ sốt tại một thời điểm, không xen kẽ/kết hợp thường xuyên trừ khi bác sĩ chỉ định cụ thể — lý do chính là nguy cơ NHẦM LẪN LIỀU DÙNG dẫn đến quá liều ngoài ý muốn, không phải vì thiếu hiệu quả. Tuy nhiên, một phân tích gộp mới hơn do chính AAP công bố (2024, 31 thử nghiệm, khoảng 5.009 trẻ) và một tổng quan Cochrane cho thấy việc kết hợp/xen kẽ CÓ THỂ hạ sốt nhanh và nhiều hơn so với dùng một loại đơn thuần, không ghi nhận biến cố nghiêm trọng liên quan trực tiếp đến thuốc trong các thử nghiệm được xem xét. Bài xã luận đi kèm của chính AAP phản biện: chỉ hạ sốt nhanh hơn không đủ để biện minh cho việc kết hợp, vì dữ liệu an toàn dài hạn còn hạn chế, và sốt có thể là phản ứng có lợi của cơ thể không cần vội vàng dập tắt. **Khuyến nghị cho cha mẹ**: giữ nguyên tắc "một loại thuốc, hỏi bác sĩ trước khi kết hợp" như lựa chọn an toàn mặc định — không phải vì kết hợp chắc chắn không có tác dụng, mà vì nguy cơ nhầm lẫn liều khi tự làm tại nhà là có thật và đã được ghi nhận.

## Nguy cơ quá liều phổ biến nhất: dùng trùng 2 sản phẩm cùng chứa paracetamol
Đây là cơ chế ngộ độc paracetamol phổ biến nhất ở trẻ em: cha mẹ cho trẻ dùng một thuốc cảm/ho dạng kết hợp (đã có sẵn paracetamol) CỘNG THÊM một liều thuốc hạ sốt paracetamol riêng, mà không nhận ra tổng liều đã vượt ngưỡng an toàn. Luôn đọc kỹ THÀNH PHẦN trên mọi sản phẩm, không chỉ tên thương mại — tổn thương gan do quá liều paracetamol thường biểu hiện triệu chứng MUỘN (24-48 giờ sau), nghĩa là trẻ có thể trông vẫn ổn trong khi gan đã bắt đầu tổn thương.

## Lưu ý
Nếu không chắc chắn về liều lượng hoặc cách phối hợp thuốc hạ sốt cho con, luôn hỏi dược sĩ hoặc bác sĩ trước khi tự quyết định — đặc biệt với trẻ dưới 6 tháng hoặc khi cân nhắc dùng nhiều hơn một loại thuốc.`,
    category: "An toàn",
    stage: "INFANT_1_3_MONTHS",
    evidenceLevel: "STRONG",
    knowledgeType: scientific,
    sources: [sources.healthyChildrenAcetaminophen, sources.healthyChildrenIbuprofen, sources.aapFeverAntipyretic2011, sources.cochraneAntipyreticsCombined, sources.cdcMedicationSafetyProtect],
  },
  {
    slug: "khi-nao-goi-cap-cuu-115-va-cach-xu-tri-phan-ve",
    title: "Khi nào gọi cấp cứu 115, khi nào đi khám, và cách xử trí sốc phản vệ",
    summary: "Gọi cấp cứu NGAY nếu trẻ: không thở/tím tái, không phản ứng, co giật trên 5 phút, chảy máu không cầm được, hoặc có dấu hiệu sốc phản vệ (phù họng, khó thở, tái/xanh tái, lơ mơ). Sau khi tiêm bút tiêm epinephrine cho sốc phản vệ, LUÔN gọi cấp cứu ngay cả khi trẻ có vẻ đỡ hơn — phản ứng hai pha (biphasic) có thể xảy ra 8-72 giờ sau.",
    content: `## Khi nào gọi cấp cứu ngay
Không thở được hoặc tím tái; không phản ứng/bất tỉnh; co giật kéo dài từ 5 phút trở lên; chảy máu không cầm được dù đã ép chặt; gãy xương/vết thương sâu nghiêm trọng; bỏng nặng hoặc từng ở trong đám cháy; có dấu hiệu sốc phản vệ; hóc nghẹn không thể lấy dị vật ra; vừa được đưa ra khỏi nước và không phản ứng. Nguyên tắc chung của AAP: "Nếu không chắc chắn điều gì đang xảy ra, nhưng cảm thấy con đang gặp nguy hiểm, hãy gọi cấp cứu."

## Dấu hiệu sốc phản vệ (anaphylaxis)
Khởi phát nhanh, thường trong vài phút sau khi tiếp xúc dị nguyên: sưng họng/lưỡi, khó thở/khó nuốt, thở khò khè, lú lẫn, ngất xỉu, da chuyển tái/xanh tái. Đặc điểm phân biệt với dị ứng nhẹ: sốc phản vệ thường ảnh hưởng NHIỀU hệ cơ quan cùng lúc (da/miệng + phổi + tim mạch + tiêu hóa), không chỉ một biểu hiện đơn lẻ.

## Cách dùng bút tiêm epinephrine (nếu trẻ đã được kê đơn)
Vị trí: mặt ngoài giữa đùi, giữ bút vuông góc (90 độ) với đùi, có thể tiêm qua quần áo nếu cần. Ấn chắc và giữ theo đúng thời gian in trên thiết bị cụ thể (khác nhau đôi chút giữa các loại bút tiêm, nên làm theo hướng dẫn ghi trên chính thiết bị đang dùng thay vì áp dụng một con số cố định). Sau khi tiêm: cho trẻ nằm xuống (kê chân cao, hoặc ngồi dậy/nâng vai nếu khó thở), không để trẻ đứng/đi lại dù cảm thấy đỡ hơn.

## Luôn gọi cấp cứu SAU KHI tiêm epinephrine — kể cả khi trẻ có vẻ đỡ
Đây là điểm dễ bị bỏ qua nhưng rất quan trọng: dù trẻ có vẻ khá hơn ngay sau khi tiêm, vẫn cần gọi cấp cứu ngay và báo rõ đã dùng epinephrine — vì phản ứng phản vệ HAI PHA (biphasic) có thể tái phát khoảng 8-72 giờ sau lần phản ứng đầu, ngay cả khi có vẻ đã ổn. Nếu không cải thiện sau 5 phút và có bút tiêm thứ hai, có thể dùng liều thứ hai.

## Số điện thoại cấp cứu tại Việt Nam
**115** là số cấp cứu y tế chính thức tại Việt Nam hiện nay, gọi miễn phí từ mọi điện thoại. ⚠️ Lưu ý: có kế hoạch hợp nhất 113/114/115 thành một đầu số chung trong tương lai (dự kiến vận hành từ khoảng 2027) — nên cập nhật lại thông tin này sau giai đoạn đó nếu có thay đổi chính thức.

## Lưu ý
Với các tình huống không rõ mức độ khẩn cấp (sốt, nôn nhẹ, phát ban không kèm khó thở), gọi hỏi ý kiến bác sĩ nhi khoa quen thuộc thường là bước phù hợp hơn là gọi cấp cứu ngay — dành số 115 cho các tình huống thực sự đe dọa tính mạng ở trên.`,
    category: "An toàn",
    stage: "TODDLER",
    evidenceLevel: "STRONG",
    knowledgeType: scientific,
    sources: [sources.healthyChildrenEmergencyWhen, sources.nhsAnaphylaxis, sources.aapEpinephrineFirstAid2017, sources.vietnamEmergencyNumber115],
  },
  {
    slug: "nam-than-nam-lua-sau-sinh-nguy-hiem-that",
    title: "Nằm than, sưởi lửa sau sinh: nguy cơ có thật, đã có ca tử vong tại Việt Nam",
    summary: "Tục nằm than/sưởi lửa sau sinh xuất phát từ quan niệm cơ thể \"bị hàn\" cần làm ấm, nhưng đã ghi nhận CA TỬ VONG THẬT do ngộ độc khí CO tại Gia Lai, cụm 5 sản phụ bỏng nặng tại nhiều tỉnh, và một báo cáo y văn quốc tế (Brunei) ghi nhận 2 ca tử vong tương tự. Nhu cầu giữ ấm là có thật, nhưng cách làm này quá nguy hiểm — có nhiều cách giữ ấm an toàn hơn.",
    content: `## Đây là một trong số ít quan niệm dân gian có bằng chứng TỬ VONG THẬT, không phải suy đoán
Khác với nhiều quan niệm dân gian khác trong bộ tài liệu này (chưa có bằng chứng gây hại rõ ràng), tục nằm than/sưởi lửa sau sinh có hồ sơ tử vong và thương tích THẬT, được báo chí và y văn ghi nhận cụ thể.

## Các ca việc thật tại Việt Nam
- Một sản phụ tại Đắk Đoa, Gia Lai tử vong một tuần sau sinh do ngộ độc khí CO khi gia đình đốt than sưởi trong phòng ngủ kín — bác sĩ điều trị nhận định tục này "không còn phù hợp với điều kiện hiện đại" vì sản phụ sau sinh vốn đã mất máu, suy yếu.
- Một cụm 5 sản phụ bị bỏng nặng (có ca bỏng độ 3, tới 5% diện tích cơ thể, một trường hợp phải cắt cụt 5 đốt ngón tay) trong 2 tháng tại nhiều tỉnh (Bình Thuận, Kiên Giang, Bình Chánh) — bác sĩ giải thích cơ chế: khí CO gắn vào hemoglobin làm giảm oxy đến mô, khiến sản phụ mất ý thức và ngã vào bếp than đang cháy.
- Một trẻ sơ sinh 14 ngày tuổi phải nhập viện vì bỏng nặng, nhiễm trùng huyết, áp xe do nằm cạnh bếp than cùng mẹ.
- Một vụ cháy nhà tại Nghệ An do đặt nồi than dưới giường sản phụ khiến chăn đệm bắt lửa.

## Bằng chứng y văn quốc tế củng cố thêm
Một báo cáo ca bệnh bình duyệt tại Brunei ghi nhận **2 sản phụ tử vong** do ngộ độc CO khi ngủ cạnh bếp than để làm ấm vùng bụng dưới — một thực hành gần như giống hệt tại khu vực Đông Nam Á, cho thấy đây không phải rủi ro riêng của Việt Nam mà là rủi ro chung của phương pháp này ở bất kỳ đâu được áp dụng.

## Vì sao vẫn có nhu cầu thật đằng sau tục lệ này
Quan niệm dân gian cho rằng cơ thể sau sinh "bị hàn", cần sưởi ấm để giúp co hồi tử cung và phục hồi sức khỏe. Nhu cầu giữ ấm cho mẹ và bé sau sinh là CÓ THẬT về mặt y khoa (hạ thân nhiệt sơ sinh là nguy cơ thật đã được y học hiện đại công nhận) — vấn đề không phải là "giữ ấm sai" mà là PHƯƠNG PHÁP nguy hiểm.

## Cách giữ ấm an toàn thay thế
Giữ phòng ở nhiệt độ ấm vừa phải bằng điều hòa/máy sưởi điện có kiểm soát (không dùng than/củi đốt trong phòng kín); mặc quần áo/đội mũ/đi tất ấm cho mẹ và bé; da kề da (skin-to-skin) giữa mẹ và bé — vừa giữ ấm vừa có lợi cho gắn kết và bú mẹ; tắm nước ấm (không phải nước lạnh).

## Lưu ý
Nếu gia đình vẫn muốn giữ không khí phòng ấm áp theo truyền thống, hãy dùng máy sưởi điện/điều hòa có kiểm soát nhiệt độ thay vì đốt than/củi trong phòng kín — đây là cách đáp ứng đúng nhu cầu giữ ấm mà không đánh đổi bằng nguy cơ ngộ độc khí, bỏng, hay cháy nhà đã được ghi nhận thật.`,
    category: "Mẹo dân gian & sự thật",
    stage: "POSTPARTUM",
    evidenceLevel: "POTENTIALLY_HARMFUL",
    knowledgeType: harmful,
    sources: [sources.brunieCoPoisoningPostpartum, sources.tuoiTreNamThanBongNang],
  },
  {
    slug: "tam-la-xong-hoi-la-cho-me-va-be-so-sinh",
    title: "Tắm lá, xông hơi lá cho mẹ và bé sơ sinh: khi nào có hại",
    summary: "Một số lá (trầu không, chè xanh) có hoạt tính kháng khuẩn thật trong thí nghiệm, nhưng nước lá tự pha chế tại nhà không tiệt trùng đã gây viêm loét da ở trẻ sơ sinh trong thực tế lâm sàng Việt Nam; xông hơi vùng kín sau sinh có báo cáo ca bỏng độ 2, trong khi ngâm ấm (sitz bath) là lựa chọn đã được ACOG xác nhận an toàn hơn cho cùng nhu cầu.",
    content: `## Tắm lá cho trẻ sơ sinh — nguy cơ đến từ khâu pha chế tại nhà, không phải bản thân cái lá
Bác sĩ da liễu tại Bệnh viện Nhi Trung ương ghi nhận các ca trẻ sơ sinh bị viêm da/loét da do tắm bằng nước lá pha chế tại nhà — nguyên nhân là lá hái từ vườn/ven đường thường nhiễm dư lượng thuốc trừ sâu hoặc vi khuẩn môi trường, và việc đun sôi tại nhà không đảm bảo tiệt trùng hoàn toàn. Bác sĩ cũng lưu ý: không có cơ sở khoa học nào cho thấy tắm lá giúp "rụng lông tơ" nhanh hơn — lông tơ tự rụng theo thời gian dù có tắm lá hay không.

## Một số lá có hoạt tính kháng khuẩn thật — nhưng chỉ trong phòng thí nghiệm
Lá trầu không (Piper betle) được chứng minh có hoạt tính kháng khuẩn thật trong nghiên cứu (bao gồm cả một số chủng tụ cầu vàng) nhờ alkaloid/tannin/terpenoid; chè xanh chứa EGCG/tannin có hoạt tính kháng khuẩn/kháng nấm trong thí nghiệm. Đây là hóa học thật — nhưng hoạt tính trong ống nghiệm KHÔNG đồng nghĩa với việc một nồi nước lá tự nấu tại nhà (nồng độ không kiểm soát, độ sạch không đảm bảo) an toàn/hiệu quả khi dùng cho da trẻ sơ sinh hoặc vết thương đang lành.

## Xông hơi vùng kín sau sinh ("xông vùng kín") — nên thay bằng ngâm ấm
Đã có báo cáo ca bệnh bình duyệt ghi nhận bỏng độ 2 do xông hơi vùng kín. Không có bằng chứng cho thấy xông hơi cải thiện quá trình lành vết thương/phục hồi sau sinh, trong khi hơi nóng/độ ẩm tiếp xúc với mô đang lành sau sinh làm TĂNG nguy cơ bỏng, chậm lành, nhiễm trùng. ACOG khuyến nghị **ngâm ấm (sitz bath)** — ngồi ngâm vùng chậu trong nước ấm — như một biện pháp đã được công nhận, đáp ứng đúng nhu cầu "nước ấm dễ chịu" mà không có nguy cơ bỏng của xông hơi.

## Ranh giới giữa "có cơ sở" và "có hại"
Với cả tắm lá và xông hơi: hóa chất thực vật cụ thể (như trong lá trầu không) có thể có hoạt tính thật, nhưng đó KHÔNG phải lý do để tự pha chế và áp dụng không kiểm soát tại nhà cho da trẻ sơ sinh hoặc vết thương đang lành — đây chính là "khoảng trống pha chế không kiểm soát" gây ra phần lớn các ca hại thực tế đã ghi nhận, không phải bản thân cây lá có độc.

## Lưu ý
Nếu muốn dùng nước ấm để làm sạch/dễ chịu cho da bé hoặc vùng kín của mẹ, nước sạch đun sôi để nguội là đủ — không cần thêm lá cây không rõ nguồn gốc/độ sạch.`,
    category: "Mẹo dân gian & sự thật",
    stage: "POSTPARTUM",
    evidenceLevel: "POTENTIALLY_HARMFUL",
    knowledgeType: harmful,
    sources: [sources.vinmecLaTrauSoSinh, sources.vaginalSteamingBurnCase, sources.acogPostpartumPainManagement],
  },
  {
    slug: "kieng-tam-goi-sau-sinh-that-hu",
    title: "Kiêng tắm gội sau sinh nhiều tuần: sự thật về nguy cơ nhiễm trùng",
    summary: "Bác sĩ tại Bệnh viện Phụ Sản Trung Ương ghi nhận nhiều ca nhiễm trùng vết khâu tầng sinh môn/vết mổ do sản phụ kiêng tắm gội 1-2 tuần sau sinh; khuyến nghị hiện nay của các bệnh viện phụ sản lớn tại Việt Nam là nên tắm nhanh bằng nước ấm trong 1-2 ngày sau sinh, chỉ cần tránh nước lạnh và ngâm lâu, không cần kiêng tắm hoàn toàn.",
    content: `## Quan niệm truyền thống và ghi nhận học thuật
Một khảo sát bình duyệt về quan niệm văn hóa hậu sản của phụ nữ Việt Nam ghi nhận: kiêng tắm là một phần phổ biến trong "ở cữ" truyền thống, có thể kéo dài đến 3 tháng 10 ngày cho con so, hoặc 1 tháng cho các lần sinh sau. Khảo sát cho thấy 93,6% phụ nữ/người chăm sóc tin rằng các kiêng cữ này bảo vệ sức khỏe mẹ/bé.

## Bằng chứng hại thật từ thực tế lâm sàng Việt Nam
Bác sĩ Phan Chí Thành (Bệnh viện Phụ Sản Trung Ương) mô tả các ca THẬT, LẶP LẠI trong thực hành lâm sàng: sản phụ kiêng tắm 1-2 tuần sau sinh dẫn đến nhiễm trùng vết khâu tầng sinh môn hoặc vết mổ. Cơ chế: sau sinh, cơ thể đổ mồ hôi nhiều hơn bình thường (một hiện tượng sinh lý thật, cơ thể đang thải bớt lượng dịch dư từ thai kỳ) — mồ hôi/tế bào chết tích tụ trên da không được rửa sạch tạo điều kiện cho vi khuẩn xâm nhập, đặc biệt nguy hiểm khi đang có vết thương hở (vết khâu/vết mổ) cần lành.

## Khuyến nghị hiện nay từ các bệnh viện phụ sản lớn
Bệnh viện Từ Dũ và các bệnh viện phụ sản lớn khác khuyến nghị: nên tắm/tắm vòi sen trong vòng 1-2 ngày sau sinh (tắm nhanh, nước ấm), không cần kiêng tắm/gội đầu/đánh răng/súc miệng — chỉ cần tránh nước LẠNH, tránh ngâm mình lâu, và tắm trong không gian kín gió, ấm áp.

## Có phần nào của quan niệm này có cơ sở thật không?
Có — nhưng hẹp hơn nhiều so với niềm tin truyền thống: việc tránh nước LẠNH và tránh gió lùa có phần hợp lý về mặt sinh lý (mất nhiệt nhanh, khó chịu, có thể gây stress vận mạch về mặt lý thuyết) — đây là lý do "tránh nước lạnh, tắm nơi kín gió" vẫn được khuyến nghị. Nhưng KHÔNG có bằng chứng nào cho thấy tắm bằng nước ẤM gây "trúng gió" như quan niệm dân gian lo ngại — phần "kiêng tắm hoàn toàn trong nhiều tuần" là phần gây hại thật, không phải phần "tránh nước lạnh".

## Lưu ý
Nên tắm nhanh bằng nước ấm trong phòng kín gió ngay từ 1-2 ngày sau sinh, đặc biệt chú ý vệ sinh vùng vết khâu/vết mổ — đây là khuyến nghị nhất quán từ các bệnh viện phụ sản tuyến đầu tại Việt Nam.`,
    category: "Mẹo dân gian & sự thật",
    stage: "POSTPARTUM",
    evidenceLevel: "POTENTIALLY_HARMFUL",
    knowledgeType: harmful,
    sources: [sources.suckhoedoisongKiengTamNhiemTrung, sources.tuDuTamGoiSauSinh, sources.niceNg194PerinealCare],
  },
  {
    slug: "nan-vu-tre-so-sinh-va-ro-luoi-bang-mat-ong",
    title: "Nặn vú trẻ sơ sinh và rơ lưỡi bằng mật ong: hai thói quen cần tránh",
    summary: "Ngực trẻ sơ sinh sưng/có sữa (galactorrhea neonatorum) là hiện tượng lành tính, tự hết do nội tiết mẹ truyền qua nhau thai — nặn/bóp có thể gây viêm/áp xe vú ở trẻ sơ sinh. Cho trẻ dưới 12 tháng dùng mật ong (kể cả để rơ lưỡi/tưa miệng) có nguy cơ ngộ độc botulism ở trẻ sơ sinh — một nguy cơ đã được CDC/AAP xác nhận rõ ràng, không phụ thuộc vào việc rơ lưỡi có hiệu quả hay không.",
    content: `## Ngực sưng ở trẻ sơ sinh — hiện tượng lành tính, KHÔNG cần can thiệp
Nhiều trẻ sơ sinh (cả trai và gái) có ngực sưng nhẹ, đôi khi rỉ ra chất lỏng như sữa — đây là do hormone của mẹ (estrogen/prolactin) truyền qua nhau thai kích thích mô vú của trẻ trong thai kỳ, hiện tượng này tự hết trong vài tuần khi nội tiết mẹ đào thải khỏi cơ thể trẻ.

## Nặn/bóp — hành động gây hại, không phải hiện tượng sưng
Quan niệm dân gian "nặn vú" để hết sưng hoặc "để ngực đẹp sau này" không có cơ sở — hình dáng ngực khi trưởng thành do giải phẫu quyết định, không phụ thuộc việc có nặn lúc sơ sinh hay không (một bác sĩ sản phụ khoa Việt Nam xác nhận trực tiếp điều này). Quan trọng hơn: việc nặn/bóp mô vú đang sưng có thể gây kích ứng mô, sưng nặng hơn, và trong một số trường hợp dẫn đến VIÊM/ÁP XE VÚ ở trẻ sơ sinh (thường do tụ cầu vàng, cần dùng kháng sinh điều trị) — biến chứng này được ghi nhận trong y văn sơ sinh học, thường xảy ra ở tuần 2-4 sau sinh.

## Rơ lưỡi/tưa miệng bằng mật ong — nguy cơ ngộ độc botulism có thật
Tưa lưỡi (nấm miệng do nấm Candida) là tình trạng có thật, cần vệ sinh nhẹ nhàng bằng gạc/nước muối sinh lý (không chà xát mạnh gây chảy máu, không dùng lại một miếng gạc nhiều lần). Tuy nhiên, một biến thể dân gian phổ biến là thêm MẬT ONG vào dung dịch rơ lưỡi — đây là điều CẦN TRÁNH TUYỆT ĐỐI với trẻ dưới 12 tháng: mật ong (kể cả đã tiệt trùng) có thể chứa bào tử vi khuẩn Clostridium botulinum mà hệ vi sinh đường ruột chưa hoàn thiện của trẻ nhỏ không thể ức chế được, dẫn đến ngộ độc botulism ở trẻ sơ sinh — một bệnh hiếm nhưng có thể nghiêm trọng, thậm chí tử vong. CDC và AAP đều xác nhận rõ: KHÔNG cho trẻ dưới 12 tháng dùng mật ong dưới bất kỳ hình thức nào, kể cả bôi ngoài da/miệng, không chỉ ăn uống trực tiếp.

## Lưu ý
Với ngực sưng ở trẻ sơ sinh: chỉ cần theo dõi, không nặn/bóp; đưa trẻ đi khám nếu vùng sưng đỏ, nóng, đau khi chạm, hoặc trẻ sốt (dấu hiệu viêm/áp xe). Với tưa lưỡi: vệ sinh nhẹ nhàng bằng gạc/nước muối sinh lý, tuyệt đối không thêm mật ong; nếu tưa lan rộng/không cải thiện, cần khám để được kê thuốc kháng nấm phù hợp (như nystatin).`,
    category: "Mẹo dân gian & sự thật",
    stage: "NEWBORN_0_28_DAYS",
    minimumAgeDays: 0,
    maximumAgeDays: 90,
    evidenceLevel: "POTENTIALLY_HARMFUL",
    knowledgeType: harmful,
    sources: [sources.neonatalMastauxePmc, sources.vinmecNanSuaSoSinh, sources.cdcInfantBotulismHoney],
  },
  {
    slug: "thoi-diem-tam-be-so-sinh-lan-dau-theo-who",
    title: "Tắm cho bé sơ sinh lần đầu: vì sao WHO khuyến nghị chờ ít nhất 24 giờ",
    summary: "WHO khuyến nghị trì hoãn tắm lần đầu cho trẻ sơ sinh ít nhất 24 giờ sau sinh (tối thiểu 6 giờ nếu không thể) — khác với thói quen tắm ngay truyền thống ở nhiều nơi kể cả Việt Nam. Lý do: giữ lớp sáp bảo vệ (vernix) giúp ổn định thân nhiệt/chống nhiễm khuẩn, và không làm gián đoạn da kề da/bú mẹ sớm. Bằng chứng ủng hộ hướng đi này rõ ràng nhưng độ tin cậy từ thấp đến trung bình tùy kết cục.",
    content: `## Khuyến nghị của WHO
Tổ chức Y tế Thế giới khuyến nghị: trì hoãn tắm lần đầu cho trẻ sơ sinh ít nhất **24 giờ** sau sinh; nếu vì lý do văn hóa/y tế không thể chờ đến 24 giờ, nên trì hoãn tối thiểu **6 giờ**. Đây là một thay đổi so với thói quen tắm ngay sau sinh từng phổ biến ở nhiều nơi (bao gồm cả tại các cơ sở y tế Việt Nam theo thói quen cũ), phản ánh ưu tiên "sạch sẽ trước" trước đây.

## Vì sao nên chờ — ba cơ chế thật
1. **Ổn định thân nhiệt**: trẻ sơ sinh chưa có khả năng điều nhiệt hoàn thiện ngay sau sinh; tắm sớm làm tăng nguy cơ hạ thân nhiệt, đặc biệt ở trẻ sinh non/nhẹ cân.
2. **Lớp sáp bảo vệ (vernix caseosa)**: lớp sáp trắng phủ trên da trẻ sơ sinh giúp giảm mất nước qua da, hỗ trợ điều nhiệt, và có tác dụng bảo vệ kháng khuẩn tự nhiên — tắm ngay sẽ rửa trôi lớp bảo vệ này sớm.
3. **Không gián đoạn da kề da/bú mẹ sớm**: tắm ngay sau sinh làm gián đoạn tiếp xúc da kề da và thời điểm vàng để bắt đầu bú mẹ, ảnh hưởng đến gắn kết và khởi đầu nuôi con bằng sữa mẹ.

## Mức độ bằng chứng — cần nói chính xác, không phóng đại
Một tổng quan hệ thống bình duyệt (2022) tổng hợp bằng chứng cho thấy: trì hoãn tắm trên 6 giờ (so với trong 6 giờ đầu) liên quan đến giảm hạ thân nhiệt và hạ đường huyết, cải thiện tỷ lệ bú mẹ hoàn toàn khi xuất viện (độ tin cậy trung bình). Trì hoãn trên 24 giờ có gợi ý giảm tử vong nhưng chỉ dựa trên 1 nghiên cứu, độ tin cậy RẤT THẤP. Nhìn chung, phần lớn bằng chứng nền tảng có độ tin cậy thấp đến rất thấp (chỉ 2 thử nghiệm ngẫu nhiên có đối chứng trong toàn bộ y văn, còn lại là nghiên cứu quan sát) — nghĩa là HƯỚNG khuyến nghị khá rõ ràng và ngày càng được áp dụng rộng rãi (bao gồm tại Việt Nam), nhưng ĐỘ CHẮC CHẮN của bằng chứng nền tảng còn khiêm tốn, không phải bằng chứng thử nghiệm ngẫu nhiên quy mô lớn.

## Lưu ý
Nếu cơ sở y tế nơi sinh vẫn tắm cho bé sớm hơn 24 giờ vì lý do quy trình, đây không phải là một sai lầm nghiêm trọng — chỉ là hướng khuyến nghị hiện tại nghiêng về việc chờ lâu hơn khi có thể. Có thể trao đổi với nhân viên y tế về mong muốn trì hoãn tắm nếu quan tâm đến điểm này.`,
    category: "Chăm sóc trẻ sơ sinh",
    stage: "NEWBORN_0_28_DAYS",
    minimumAgeDays: 0,
    maximumAgeDays: 7,
    evidenceLevel: "MODERATE",
    knowledgeType: scientific,
    sources: [sources.whoDelayedFirstBath, sources.joghDelayedBathReview2022],
  },
  {
    slug: "cao-gio-giac-hoi-o-tre-em-nguy-co-va-nham-lan-bao-hanh",
    title: "Cạo gió, giác hơi ở trẻ em: nguy cơ thật và nhầm lẫn với bạo hành",
    summary: "Chưa có bằng chứng cạo gió/giác hơi điều trị được bệnh gì; các vết bầm/petechiae do cạo gió đã được y văn ghi nhận từ 1976 là dễ bị BÁC SĨ NƯỚC NGOÀI NHẦM LÀ DẤU HIỆU BẠO HÀNH TRẺ EM (\"pseudobattering\") — một hiện tượng lâm sàng có tên riêng, không phải suy đoán. Các bệnh viện Việt Nam khuyến cáo tránh cạo gió cho trẻ dưới 1 tuổi và khi trẻ đang sốt/nghi ngờ sốt xuất huyết.",
    content: `## Chưa có bằng chứng hiệu quả điều trị
Cơ chế dân gian cho rằng cạo gió/giác hơi giúp "đẩy gió độc" ra khỏi cơ thể — đây là khung lý luận truyền thống, chưa có cơ chế sinh lý nào được kiểm chứng. Tác dụng thực sự đo được là vỡ mao mạch da tại chỗ tạo vết bầm/chấm xuất huyết (petechiae) — một tổn thương do ma sát/hút chân không, không phải một cơ chế điều trị đã được chứng minh.

## "Pseudobattering" — hiện tượng lâm sàng có tên riêng, đã được ghi nhận từ 1976
Đây là điểm đáng chú ý nhất: các vết bầm hình vệt dài đặc trưng do cạo gió đã được y văn quốc tế ghi nhận từ năm 1976 (nghiên cứu "Pseudobattering in Vietnamese Children") là dễ khiến bác sĩ không quen thuộc với văn hóa châu Á NHẦM LẪN với dấu hiệu bạo hành trẻ em. Một khảo sát năm 1980 trên 50 người Việt nhập cư ghi nhận nhiều gia đình mất niềm tin vào bác sĩ Mỹ sau khi bị nghi ngờ bạo hành trẻ vì vết cạo gió. Một tổng quan y pháp năm 2019 vẫn tiếp tục xây dựng bảng phân biệt các vết thương do thực hành dân gian với vết thương do bạo hành — cho thấy đây vẫn là vấn đề thực tế trong y khoa hiện đại, không chỉ là chuyện quá khứ.

## Nguy cơ khác đã ghi nhận
Bỏng (do dụng cụ cạo/giác không đúng cách), ngộ độc/co giật do tinh dầu long não (camphor) thường dùng làm chất bôi trơn khi cạo gió — đây là nguy cơ ngộ độc thật, đặc biệt đáng lo với trẻ nhỏ có làn da hấp thu nhanh hơn người lớn.

## Nguy cơ đặc biệt tại Việt Nam: che lấp dấu hiệu sốt xuất huyết
Đây là điểm quan trọng riêng cho bối cảnh Việt Nam (vùng lưu hành sốt xuất huyết): vết cạo gió/cắt lể có thể bị nhầm lẫn với hoặc che lấp các chấm xuất huyết thật do sốt xuất huyết (rối loạn đông máu) — một tình trạng cần được nhận diện và xử trí y tế khẩn cấp, không phải cạo gió. Trẻ sốt kèm tay chân lạnh cần được đưa đi khám ngay, không nên cạo gió/cắt lể trước.

## Khuyến cáo từ bệnh viện Việt Nam
Các nguồn y tế trong nước khuyến cáo KHÔNG cạo gió cho trẻ em, đặc biệt trẻ dưới 1 tuổi (da mỏng, dễ tổn thương, dễ nhiễm trùng) và trong mọi trường hợp trẻ đang sốt. Y văn quốc tế cũng ghi nhận rõ: chưa có tiêu chuẩn an toàn nào được thiết lập cho việc cạo gió/giác hơi ở trẻ em — đây là khoảng trống về an toàn được thừa nhận, không phải "đã có ngưỡng tuổi an toàn".

## Lưu ý
Nếu trẻ sốt hoặc có dấu hiệu mệt mỏi bất thường, nên đưa đi khám thay vì cạo gió/cắt lể — đặc biệt quan trọng ở vùng có sốt xuất huyết lưu hành.`,
    category: "Mẹo dân gian & sự thật",
    stage: "TODDLER",
    evidenceLevel: "POTENTIALLY_HARMFUL",
    knowledgeType: harmful,
    sources: [sources.coiningMalaysianFamPhys2011, sources.camphorToxicityCoinRubbing2002, sources.vinmecCaoGioTreEm],
  },
  {
    slug: "giat-kinh-phong-va-so-cuu-dan-gian-nguy-hiem-khi-tre-co-giat",
    title: "Quan niệm \"giật kinh phong\" và các cách sơ cứu dân gian nguy hiểm khi trẻ co giật do sốt",
    summary: "Quan niệm dân gian gọi co giật ở trẻ là \"giật gió/kinh phong\" bắt nguồn từ y học cổ truyền; điều đáng lo hơn niềm tin này là các thao tác sơ cứu dân gian đi kèm — vắt chanh/sả vào miệng trẻ đang co giật (nguy cơ sặc/co thắt thanh quản), cạy răng, tắm rượu — đều đã được bác sĩ cấp cứu nhi cảnh báo là gây hại thật, làm chậm trễ việc đưa trẻ đi cấp cứu.",
    content: `## Quan niệm dân gian về "gió"/"kinh phong"
Y học cổ truyền có khái niệm "kinh phong" (co giật ở trẻ) được cho là do "nhiệt" xâm nhập cơ thể "thuần dương" của trẻ nhỏ, sinh đàm nhiệt gây rối loạn ý thức. Đây là một khung lý luận truyền thống có thật, tồn tại lâu đời — nhưng cần phân biệt rõ với các thao tác sơ cứu dân gian đi kèm, vốn mới là phần thực sự gây hại.

## Các thao tác sơ cứu dân gian ĐÃ ĐƯỢC CẢNH BÁO là nguy hiểm
Bác sĩ khoa Cấp cứu, Bệnh viện Nhi đồng Cần Thơ cảnh báo cụ thể các thao tác dân gian phổ biến khi trẻ co giật do sốt:
- **Vắt chanh/sả vào miệng trẻ đang co giật**: nguy cơ sặc, hít vào đường thở, hoặc kích thích co thắt thanh quản do vị chua — có thể gây viêm phổi hít.
- **Cạy răng/nạy miệng bằng vật cứng**: nguy cơ gãy răng, tổn thương miệng, không giúp ích gì cho việc kiểm soát cơn co giật.
- **Tắm rượu**: nguy cơ ngộ độc rượu qua da (đặc biệt ở trẻ nhỏ), kích ứng da, mất nước.
- **Quấn/ủ ấm quá mức**: làm THÂN NHIỆT TĂNG THÊM thay vì hạ sốt, phản tác dụng hoàn toàn.

## Vấn đề thực sự: THỜI GIAN bị chiếm dụng bởi thao tác dân gian
Đây là thông điệp quan trọng nhất, vượt ra ngoài nội dung sơ cứu co giật do sốt đã có ở các batch trước: mỗi phút dành cho một thao tác dân gian (cạy miệng, vắt chanh, chờ xem "có đỡ không") là một phút KHÔNG được dùng để đặt trẻ nằm nghiêng an toàn, theo dõi thời gian co giật, và đưa trẻ đi khám để loại trừ các nguyên nhân nghiêm trọng hơn sốt cao đơn thuần (như viêm màng não). Xử trí đúng: đặt trẻ nằm nghiêng an toàn, không đưa bất kỳ vật gì vào miệng, ghi lại thời gian co giật, đưa đi khám ngay cả khi cơn co giật đã tự hết.

## Về niềm tin "vía"/tâm linh liên quan đến bệnh của trẻ
Cần nói rõ: chưa tìm được nghiên cứu cụ thể xác nhận niềm tin tâm linh khiến gia đình trì hoãn đưa trẻ co giật đi cấp cứu tại Việt Nam — đây là điểm KHÔNG nên khẳng định như một sự thật đã được chứng minh. Điều đã được ghi nhận rõ ràng là các thao tác sơ cứu SAI CÁCH (không nhất thiết gắn với niềm tin tâm linh) đang thực sự gây hại và làm chậm trễ chăm sóc y tế đúng cách — đây là thông điệp nên tập trung truyền thông thay vì quy kết cho niềm tin tâm linh mà chưa có bằng chứng cụ thể.

## Lưu ý
Khi trẻ co giật do sốt: đặt nằm nghiêng, không cho bất cứ thứ gì vào miệng, không cố gắng ghì giữ tay chân, ghi thời gian, gọi cấp cứu nếu co giật kéo dài trên 5 phút hoặc đây là lần co giật đầu tiên.`,
    category: "Mẹo dân gian & sự thật",
    stage: "TODDLER",
    evidenceLevel: "POTENTIALLY_HARMFUL",
    knowledgeType: harmful,
    sources: [sources.tuoiTreSoCuuSaiCachCoGiat, sources.epilepsyStigmaVietnam2008],
  },
  {
    slug: "quan-niem-via-va-ho-tro-tam-linh-khi-be-quay-khoc",
    title: "Quan niệm \"vía\" và việc tìm đến hỗ trợ tâm linh khi bé quấy khóc không rõ nguyên nhân",
    summary: "\"Vía\" là quan niệm dân gian có thật và phổ biến tại Việt Nam về phần hồn/linh khí dễ bị xáo trộn ở trẻ nhỏ, với tục \"trộm vía\" khi khen bé để tránh \"vía dữ\". Một nghiên cứu định tính bình duyệt tại miền Trung Việt Nam ghi nhận một số gia đình đưa trẻ quấy khóc không rõ nguyên nhân đến chùa như một \"phương án cuối cùng\" sau khi đã tìm nguyên nhân y khoa — đây là quan niệm văn hóa, không phải một tuyên bố y khoa cần đánh giá đúng/sai.",
    content: `## Quan niệm "vía" là gì
Theo tín ngưỡng dân gian Việt Nam, con người có "hồn" (phần tinh thần) và "vía" (phần thể phách, gắn với thể xác) — trẻ sơ sinh được cho là có "vía" còn yếu, dễ bị xáo trộn bởi sự chú ý/lời khen từ người lạ. Khi ai đó khen bé quá lời ("xinh quá", "khỏe quá"), nhiều người sẽ nói thêm "trộm vía" trước hoặc sau câu khen, với niềm tin rằng làm vậy sẽ tránh được việc "vía dữ" nhân lời khen mà quấy nhiễu bé (khiến bé quấy khóc, bỏ bú, ốm). Đây là tục lệ phổ biến, được ghi nhận rộng rãi và nhất quán qua nhiều nguồn văn hóa Việt Nam.

## Đây là niềm tin văn hóa, không phải một tuyên bố y khoa
Cần nói rõ: bản thân quan niệm "vía" là một hệ thống niềm tin văn hóa/tâm linh, không đưa ra một cơ chế sinh lý nào để đánh giá đúng/sai theo khoa học — giống như nhiều phong tục văn hóa khác, chức năng của nó nhiều khả năng là tâm lý/xã hội (trấn an cha mẹ, thể hiện sự quan tâm, gắn kết giữa các thế hệ trong gia đình) hơn là một tuyên bố có thể kiểm chứng.

## Bằng chứng thật về việc tìm đến hỗ trợ tâm linh khi bé quấy khóc
Một nghiên cứu định tính bình duyệt (phỏng vấn 9 nhân viên y tế tại miền Trung Việt Nam, đăng trên BMC Pediatrics) ghi nhận: khi không tìm được nguyên nhân y khoa cho việc bé quấy khóc kéo dài, một số gia đình đưa bé đến CHÙA để làm lễ — được các nhân viên y tế mô tả là một "phương án cuối cùng" sau khi đã hỏi ý kiến gia đình mở rộng và tìm nguyên nhân y khoa trước đó. Nghiên cứu này cũng ghi nhận một điểm đáng chú ý khác: chính nhân viên y tế Việt Nam cũng thừa nhận thiếu đào tạo bài bản về giấc ngủ/dỗ trẻ quấy khóc — nghĩa là một phần của việc gia đình tìm đến giải pháp khác ngoài y tế cũng phản ánh khoảng trống trong chính hệ thống y tế, không chỉ là niềm tin dân gian.

## Điều CHƯA có bằng chứng — cần nói rõ để tránh phóng đại
Chưa tìm được nghiên cứu nào xác nhận cụ thể rằng niềm tin "vía" khiến gia đình trì hoãn điều trị một bệnh lý y khoa THẬT SỰ có thể điều trị được (như nhiễm trùng) để thay bằng giải pháp tâm linh — đây là một giả thuyết hợp lý nhưng KHÔNG nên khẳng định như một sự thật đã được chứng minh trong tài liệu này.

## Lưu ý
Nếu bé quấy khóc kéo dài, bất thường, kèm sốt, bú kém, hoặc các dấu hiệu đáng lo khác, nên đưa bé đi khám y tế trước — các giải pháp văn hóa/tâm linh (nếu gia đình mong muốn) có thể song hành, không cần phải chọn một trong hai.`,
    category: "Mẹo dân gian & sự thật",
    stage: "INFANT_1_3_MONTHS",
    evidenceLevel: "TRADITIONAL",
    knowledgeType: traditional,
    sources: [sources.murrayBmcPediatricsInfantCrying2019],
  },
  {
    slug: "quan-niem-moc-rang-gay-sot-va-do-choi-moc-rang-nguy-hiem",
    title: "Mọc răng có gây sốt cao/tiêu chảy không? Và những món \"chữa mọc răng\" cần tránh",
    summary: "Nghiên cứu tiến cứu bình duyệt (Macknin và cộng sự) không ghi nhận trẻ nào sốt trên 40°C hay bệnh nặng do mọc răng — mọc răng chỉ liên quan đến các triệu chứng nhẹ (chảy dãi, cắn, khó chịu), KHÔNG gây sốt cao/tiêu chảy thật sự. Vòng hổ phách được FDA cảnh báo là nguy cơ nghẹt thở/siết cổ thật (đã có ca tử vong), và mật ong bôi nướu cho trẻ dưới 1 tuổi có nguy cơ ngộ độc botulism.",
    content: `## Mọc răng KHÔNG gây sốt cao hay tiêu chảy thật sự
Đây là quan niệm phổ biến ở Việt Nam và nhiều nơi khác trên thế giới ("sốt mọc răng", "tướt mọc răng"), nhưng bằng chứng khoa học hiện tại không ủng hộ. Một nghiên cứu tiến cứu bình duyệt (Macknin và cộng sự, tạp chí Pediatrics) theo dõi trẻ trong giai đoạn mọc răng: KHÔNG trẻ nào sốt từ 40°C trở lên, không trẻ nào có bệnh lý nghiêm trọng do mọc răng. Mọc răng CÓ liên quan thống kê đến một số triệu chứng nhẹ (cắn, chảy dãi, xoa nướu, khó chịu, khó ngủ, tăng nhẹ nhiệt độ) nhưng không triệu chứng nào xảy ra ở trên 35% số đợt mọc răng được theo dõi.

## Vì sao điều này quan trọng: tránh bỏ sót bệnh thật
Đây là thông điệp an toàn cốt lõi: nếu trẻ đang trong độ tuổi mọc răng nhưng có sốt thật sự (từ 38°C trở lên đo ở trực tràng) hoặc tiêu chảy kéo dài, KHÔNG nên mặc định quy cho "mọc răng" — cần được đánh giá y tế để tìm nguyên nhân thật, vì đây có thể là một bệnh lý khác cần điều trị.

## Vòng/lắc hổ phách "chữa mọc răng" — nguy cơ nghẹt thở/siết cổ thật
Đây là sản phẩm được quảng cáo dựa trên niềm tin axit succinic trong hổ phách có tác dụng giảm đau/viêm — KHÔNG có nghiên cứu đối chứng nào xác nhận hiệu quả này. Quan trọng hơn: FDA đã cảnh báo (2018) về các ca THẬT: một trẻ 18 tháng tử vong do ngạt vì vòng cổ hổ phách siết vào cổ khi ngủ, một trẻ 7 tháng bị nghẹn do hạt từ vòng tay gỗ mọc răng vỡ ra. Đây là nguy cơ nghẹt thở/siết cổ CÓ THẬT, không phải giả thuyết.

## Mật ong bôi nướu — nguy cơ ngộ độc botulism (nhắc lại, áp dụng cho cả mọc răng)
Một số gia đình bôi mật ong lên nướu để "giảm đau mọc răng" — đây là điều CẦN TRÁNH với trẻ dưới 12 tháng vì nguy cơ ngộ độc botulism ở trẻ sơ sinh (xem thêm bài về rơ lưỡi bằng mật ong).

## Gel bôi nướu chứa benzocaine — cảnh báo an toàn hiện đại, không phải mẹo dân gian
Đáng lưu ý dù không phải mẹo dân gian: FDA đã yêu cầu chống chỉ định các sản phẩm gel bôi nướu chứa benzocaine cho trẻ dưới 2 tuổi, do nguy cơ methemoglobinemia (rối loạn máu nghiêm trọng, có thể đe dọa tính mạng) — hơn 400 ca đã được ghi nhận/công bố từ năm 1971. Cha mẹ dùng sản phẩm "hiện đại" thay cho mẹo dân gian cũng cần biết cảnh báo này.

## Cách xử trí an toàn khi trẻ mọc răng khó chịu
Cho gặm vòng/đồ chơi mọc răng silicone nguyên khối (không có hạt rời có thể vỡ), massage nướu nhẹ bằng ngón tay sạch, khăn lạnh (không đá lạnh trực tiếp). Nếu cần thuốc giảm đau, hỏi ý kiến bác sĩ/dược sĩ về liều paracetamol phù hợp thay vì dùng gel bôi nướu không rõ thành phần.`,
    category: "Mẹo dân gian & sự thật",
    stage: "INFANT_6_12_MONTHS",
    minimumAgeDays: 90,
    maximumAgeDays: 730,
    evidenceLevel: "POTENTIALLY_HARMFUL",
    knowledgeType: harmful,
    sources: [sources.macknin2000TeethingSymptoms, sources.fdaAmberTeethingNecklace2018, sources.fdaBenzocaineTeethingGel2018, sources.cdcInfantBotulismHoney],
  },
  {
    slug: "nan-mui-cho-cao-va-quan-cha-chan-thang-chong-vong-kieng",
    title: "Nặn mũi cho cao và quấn chân thẳng chống vòng kiềng: hai thói quen phản tác dụng",
    summary: "Hình dáng mũi do di truyền và phát triển sụn/xương theo tuổi dậy thì quyết định, không phải do nặn/vuốt — nặn mạnh/thường xuyên có thể gây tổn thương niêm mạc mũi non nớt và viêm tai giữa. Chân vòng kiềng ở trẻ nhỏ là hiện tượng SINH LÝ BÌNH THƯỜNG, tự hết theo tuổi — quấn chân thẳng để \"chữa\" lại là YẾU TỐ NGUY CƠ THẬT của loạn sản khớp háng (DDH), một tình trạng nghiêm trọng hơn nhiều so với vấn đề nó cố \"chữa\".",
    content: `## Nặn mũi cho cao — không có cơ sở, có nguy cơ thật
Hình dáng mũi được quyết định bởi di truyền và quá trình phát triển sụn/xương tự nhiên — sụn mũi cứng dần và xương sống mũi phát triển thật sự trong giai đoạn dậy thì (khoảng 10-18 tuổi), không phải do tác động từ bên ngoài lúc sơ sinh. Bác sĩ Việt Nam xác nhận: chưa có cơ sở khoa học nào cho việc nặn/vuốt mũi giúp sống mũi cao/thẳng hơn. Về nguy cơ: khoang mũi trẻ sơ sinh hẹp, nhiều mạch máu, nặn thường xuyên có thể gây tổn thương niêm mạc/mạch máu (đường vào cho nhiễm trùng); vòi nhĩ (ống nối tai-mũi-họng) của trẻ ngắn và nằm ngang hơn người lớn, nên việc tác động mạnh vào mũi có thể đẩy dịch tiết vào tai giữa, gây viêm tai giữa.

## Chân vòng kiềng ở trẻ nhỏ — hiện tượng BÌNH THƯỜNG, không phải bệnh
Đây là điểm quan trọng nhất cần cha mẹ hiểu: TẤT CẢ trẻ sơ sinh đều có một mức độ chân cong (vòng kiềng) khi mới sinh — đây là do tư thế trong bụng mẹ, hoàn toàn sinh lý bình thường. Độ cong nhiều nhất thường ở 6-12 tháng tuổi, dần thẳng lại vào khoảng 18-24 tháng, sau đó nhiều trẻ chuyển sang hơi "chân chữ X" (đầu gối chụm vào nhau) ở tuổi 3-4, rồi thẳng dần về dáng chân người lớn khoảng 7-11 tuổi. KHÔNG cần điều trị, nẹp, hay giày đặc biệt nào cho tình trạng cong chân sinh lý này.

## Dấu hiệu thật cần khám (khi nào KHÔNG phải là bình thường)
Cần đưa trẻ đi khám nếu: chân cong không cải thiện sau 3 tuổi hoặc NẶNG HƠN theo thời gian; cong KHÔNG ĐỐI XỨNG (một chân cong nhiều hơn chân kia rõ rệt); trẻ thấp còi bất thường; đau, sưng khớp, đi khập khiễng. Đây có thể là dấu hiệu của bệnh Blount (một bệnh xương chày thật) hoặc còi xương (thiếu vitamin D/canxi) — cả hai đều cần chẩn đoán bằng xét nghiệm/chụp X-quang và điều trị y tế, không phải mẹo dân gian.

## Quấn chân thẳng "chống vòng kiềng" — nguy cơ THẬT của loạn sản khớp háng (DDH)
Đây là phát hiện quan trọng nhất của bài này: việc quấn/bó chân trẻ ở tư thế THẲNG và KHÉP để "phòng chân vòng kiềng" — nghe có vẻ vô hại — thực chất lại là một YẾU TỐ NGUY CƠ ĐÃ ĐƯỢC XÁC NHẬN của loạn sản khớp háng bẩm sinh (developmental dysplasia of the hip - DDH), một tình trạng nghiêm trọng hơn nhiều so với chân cong sinh lý mà nó cố "phòng ngừa". Tiêu chuẩn quấn tã an toàn cho khớp háng (được các tổ chức chỉnh hình quốc tế khuyến nghị) yêu cầu chân trẻ phải được TỰ DO co/dạng ở khớp háng — không quấn thẳng và khép sát vào nhau.

## Lưu ý
Với cả hai thói quen: nên dừng lại vì không có lợi ích thật, trong khi nguy cơ (dù nhỏ với nặn mũi, đáng kể hơn với quấn chân thẳng) là có thật và không đáng để đánh đổi cho một hiệu quả chưa từng được chứng minh.`,
    category: "Mẹo dân gian & sự thật",
    stage: "INFANT_1_3_MONTHS",
    minimumAgeDays: 0,
    maximumAgeDays: 730,
    evidenceLevel: "POTENTIALLY_HARMFUL",
    knowledgeType: harmful,
    sources: [sources.danTriVuotMuiChoCao, sources.ddhSwaddlingRiskPmc, sources.aaosBowLegs],
  },
  {
    slug: "bu-bam-moi-khoe-ep-an-va-tap-ngoi-dung-som",
    title: "\"Bụ bẫm mới khỏe\", ép ăn, và tập ngồi/đứng sớm: khi nỗ lực tốt lại phản tác dụng",
    summary: "WHO/CDC xác nhận: một bé ở mức thấp của biểu đồ tăng trưởng nhưng phát triển ĐỀU theo đúng kênh của mình là hoàn toàn khỏe mạnh — không phải bé \"nhẹ cân đáng lo\". Ép trẻ ăn hết khẩu phần khiến trẻ ăn ÍT hơn và phản ứng tiêu cực hơn (nghiên cứu thực nghiệm bình duyệt), có thể gây rối loạn khả năng tự điều chỉnh đói-no lâu dài. Việc \"giúp\" trẻ ngồi/đứng trước khi sẵn sàng không đẩy nhanh mốc phát triển — cơ chế tương tự đã được chứng minh với xe tập đi (làm CHẬM đi, không phải nhanh hơn).",
    content: `## Biểu đồ tăng trưởng: vị trí không phải là điểm số sức khỏe
Đây là điểm cần hiểu rõ: một bé ở mức thấp của biểu đồ tăng trưởng (ví dụ percentile 15) nhưng TĂNG ĐỀU theo đúng kênh của mình qua thời gian là hoàn toàn bình thường, khỏe mạnh — percentile là một THỨ HẠNG so với các trẻ khác, không phải một "điểm số sức khỏe" mà cao hơn luôn tốt hơn. Điều bác sĩ thực sự quan tâm là XU HƯỚNG tăng trưởng có nhất quán hay không, không phải vị trí tuyệt đối trên biểu đồ.

## Ép ăn — có bằng chứng thực nghiệm cho thấy phản tác dụng
Một nghiên cứu thực nghiệm bình duyệt (không chỉ là quan sát tương quan) cho trẻ ăn dưới hai điều kiện: bị thúc ép "ăn hết" hoặc không bị thúc ép — kết quả: trẻ bị ép ăn THỰC SỰ ĂN ÍT HƠN và thể hiện cảm xúc tiêu cực nhiều hơn so với nhóm không bị ép; trẻ vốn kén ăn còn có xu hướng no sớm hơn và không ăn nhiều hơn dù bị ép. Các nghiên cứu liên quan trong cùng chương trình nghiên cứu này còn ghi nhận: ép trẻ ăn một món cụ thể có liên quan đến việc trẻ càng KHÔNG THÍCH món đó về lâu dài, và cách cho ăn kiểm soát/không đáp ứng có liên quan đến khả năng tự điều chỉnh no-đói kém hơn khi trẻ lớn lên.

## Vì sao quan niệm "bụ bẫm mới khỏe" đáng lo tại Việt Nam cụ thể
Viện Dinh dưỡng Quốc gia (thuộc Bộ Y tế Việt Nam) chỉ rõ: "bụ bẫm/mập mạp" và "béo phì" là hai khái niệm khác nhau nhưng thường bị cha mẹ nhầm lẫn, và sở thích văn hóa với trẻ bụ bẫm là một yếu tố góp phần thật vào tình trạng thừa cân/béo phì trẻ em đang gia tăng tại Việt Nam. Đây không chỉ là một quan sát chung chung từ phương Tây mà là mối lo ngại được chính cơ quan dinh dưỡng quốc gia Việt Nam nêu ra.

## Tập ngồi/đứng sớm — không đẩy nhanh mốc phát triển
Các mốc vận động (lẫy, ngồi, bò, đứng, đi) chủ yếu do quá trình trưởng thành thần kinh-cơ tự nhiên quyết định, không phải do luyện tập/khuyến khích trong phạm vi bình thường. Cơ chế tương tự đã được chứng minh rõ với xe tập đi có bánh (xem bài riêng): thay vì giúp bé biết đi sớm hơn, xe tập đi thực ra có thể làm CHẬM thời điểm biết đi độc lập — cho thấy việc "ép" một tư thế vận động trước khi cơ thể sẵn sàng thường không mang lại lợi ích như mong đợi, đôi khi ngược lại.

## Lưu ý về nguy cơ tập ngồi/đứng chống đỡ sớm
Một số chuyên gia vật lý trị liệu nhi khoa cảnh báo việc chống/bế trẻ ngồi trước khi bé tự kiểm soát được phần thân trên có thể gây áp lực không cần thiết lên cột sống đang phát triển — đây là một cảnh báo hợp lý về mặt cơ chế (trình tự phát triển kiểm soát đầu-cổ trước thân-eo), nhưng CHƯA được xác nhận bằng nghiên cứu chỉnh hình bình duyệt chính thức — nên xem đây là lý do hợp lý để "để bé tự đạt mốc ngồi theo nhịp riêng", không phải một bằng chứng y khoa vững chắc về việc chống ngồi sớm "gây cong vẹo cột sống".

## Lưu ý
Cách tiếp cận tốt nhất với cả ăn uống và vận động: tạo cơ hội (đa dạng thức ăn, thời gian nằm sấp, không gian an toàn để tự vận động) và để trẻ tự đạt được theo nhịp độ riêng, thay vì ép ăn hết khẩu phần hay chủ động tập cho trẻ ngồi/đứng trước khi bé tự làm được.`,
    category: "Mẹo dân gian & sự thật",
    stage: "INFANT_6_12_MONTHS",
    minimumAgeDays: 90,
    maximumAgeDays: 730,
    evidenceLevel: "STRONG",
    knowledgeType: scientific,
    sources: [sources.galloway2006PressuringChildrenEat, sources.vienDinhDuongBeoPhiTre, sources.aapGrandRoundsWalkersDelay],
  },
  {
    slug: "le-day-thang-thoi-noi-y-nghia-va-luu-y-thuc-te",
    title: "Lễ đầy tháng, thôi nôi: ý nghĩa văn hóa và lưu ý thực tế cho cha mẹ",
    summary: "Đầy tháng (1 tháng tuổi) và thôi nôi (1 tuổi, gồm tục \"bốc thôi nôi\" chọn đồ vật đoán tương lai) là nghi lễ văn hóa/tín ngưỡng, cảm ơn 12 Bà Mụ đã bảo vệ bé và chính thức giới thiệu bé với gia đình/cộng đồng — đây là sự kiện văn hóa, không mang tuyên bố y khoa nào cần đánh giá đúng/sai. Lưu ý thực tế đáng cân nhắc: bé có thể bị kích thích quá mức khi được nhiều khách bế/truyền tay liên tục trong tiệc đông người.",
    content: `## Ý nghĩa văn hóa
Đầy tháng (khi bé tròn 1 tháng âm lịch) và thôi nôi (khi bé tròn 1 tuổi, có nơi miền Bắc gọi là "lễ đầy năm") là hai nghi lễ mốc quan trọng trong văn hóa Việt Nam, gắn với tín ngưỡng dân gian về "12 Bà Mụ" (được cho là mỗi vị nặn ra một bộ phận/đặc điểm của bé) và Đức Ông — gia đình làm lễ cúng để cảm tạ các vị đã bảo vệ bé, đồng thời chính thức giới thiệu thành viên mới với họ hàng/cộng đồng.

## Tục "bốc thôi nôi"
Trong lễ thôi nôi, gia đình thường bày một mâm đồ vật mang tính biểu tượng cho các nghề nghiệp/con đường tương lai (ống nghe = ngành y, máy tính = kinh doanh, sách vở = học vấn, micro = nghệ thuật, tiền = giàu có...) và để bé tự bò/với tay chọn lấy một món — được xem như một điềm báo vui về sở thích/năng khiếu của bé. Đây là một trò chơi mang tính biểu tượng/giải trí trong không khí lễ hội, không phải một phương pháp dự đoán có cơ sở khoa học.

## Đây là sự kiện văn hóa — không có tuyên bố y khoa nào cần đánh giá
Cần nói rõ: khác với nhiều chủ đề khác trong bộ tài liệu này, các nghi lễ này không đưa ra tuyên bố về sức khỏe/phát triển của trẻ cần được đánh giá đúng/sai bằng bằng chứng khoa học — đây đơn thuần là các nghi lễ chuyển tiếp mang tính văn hóa/tín ngưỡng, có chức năng xã hội (công nhận sự hiện diện của bé trong gia đình/cộng đồng) tương tự các nghi lễ chuyển tiếp ở nhiều nền văn hóa khác trên thế giới.

## Lưu ý thực tế duy nhất đáng cân nhắc: nguy cơ bé bị kích thích quá mức
Đây là điểm thực hành hữu ích, không phải đánh giá về bản thân nghi lễ: khi tổ chức tiệc đông khách, bé có thể bị nhiều người thay nhau bế/nựng/nói chuyện liên tục — đây là tình huống dễ gây "quá tải kích thích" (overstimulation) ở trẻ nhỏ, biểu hiện bằng quấy khóc, né tránh ánh mắt, nắm chặt tay, khó dỗ. Cách xử lý: giảm bớt kích thích (đưa bé ra chỗ yên tĩnh một lúc), hạn chế truyền tay bé liên tục, quay lại thói quen quen thuộc (địu/đung đưa/hát ru) nếu bé có dấu hiệu quá tải; nên đưa bé đi khám nếu quấy khóc kéo dài trên 3 giờ kèm sốt/nôn/lừ đừ.

## Lưu ý
Đây là dịp lễ ý nghĩa với gia đình — chỉ cần lưu ý sắp xếp để bé có khoảng nghỉ yên tĩnh giữa tiệc nếu đông khách, và đảm bảo an toàn thực phẩm thông thường cho khách như với mọi buổi tiệc gia đình khác.`,
    category: "Mẹo dân gian & sự thật",
    stage: "TODDLER",
    minimumAgeDays: 30,
    maximumAgeDays: 366,
    evidenceLevel: "TRADITIONAL",
    knowledgeType: traditional,
    sources: [sources.uscFolkloreThoiNoi, sources.healthlineOverstimulatedBaby],
  },
  {
    slug: "du-doan-gioi-tinh-thai-nhi-theo-dan-gian-that-hu",
    title: "Dự đoán giới tính thai nhi theo dân gian: nhịp tim, hình dáng bụng, lịch âm — thực hư",
    summary: "Nhịp tim thai và lịch âm dự đoán giới tính (bảng Trung Quốc/lịch âm) là hai phương pháp ĐÃ ĐƯỢC KIỂM CHỨNG bằng nghiên cứu thật: phân tích gộp trên 4.308 thai nhi không thấy khác biệt nhịp tim theo giới tính; nghiên cứu dân số Thụy Điển trên 2.840.755 ca sinh cho thấy độ chính xác của lịch âm chỉ khoảng 50% — ngang với tung đồng xu. Hình dáng bụng, cơn thèm ăn, và quan niệm \"nam tả nữ hữu\" chưa có nghiên cứu kiểm chứng trực tiếp.",
    content: `## Hai phương pháp ĐÃ được kiểm chứng bằng nghiên cứu thật — và đều không chính xác
- **Nhịp tim thai** (quan niệm: tim đập trên 140 lần/phút là bé gái, dưới 140 là bé trai): một phân tích gộp bình duyệt trên 4.308 thai nhi không tìm thấy khác biệt có ý nghĩa thống kê về nhịp tim thai giữa hai giới trong 3 tháng đầu — kết luận trực tiếp: nhịp tim thai "không phải là xét nghiệm dự đoán đáng tin cậy cho giới tính thai nhi".
- **Lịch âm Trung Quốc/Việt Nam** (bảng đối chiếu tháng thụ thai âm lịch và tuổi âm lịch của mẹ): một nghiên cứu dân số quy mô lớn tại Thụy Điển (Villamor và cộng sự, 2010) trên **2.840.755 ca sinh** trong 33 năm cho thấy độ chính xác của phương pháp này chỉ khoảng 50% — tương đương với việc tung đồng xu đoán ngẫu nhiên. Các tuyên bố về độ chính xác trên 90% lưu truyền trên mạng KHÔNG được bất kỳ nghiên cứu nào tìm thấy ủng hộ.

## Các phương pháp CHƯA được kiểm chứng trực tiếp — cần nói rõ sự khác biệt
Khác với hai phương pháp trên (đã bị bác bỏ bằng nghiên cứu thật), một số quan niệm khác đơn giản là CHƯA có nghiên cứu trực tiếp kiểm chứng, nên cần được trình bày là "chưa biết" thay vì "đã bị bác bỏ":
- **Hình dáng bụng** (bụng tròn cao = gái, bụng thấp nhọn = trai, hay ngược lại tùy vùng miền): các đánh giá y khoa cho rằng hình dáng bụng phản ánh vóc dáng cơ thể mẹ, độ săn chắc cơ bụng, và tư thế thai nhi — không có cơ chế nào liên quan đến giới tính, nhưng đây là suy luận từ sinh lý học, chưa phải một nghiên cứu trực tiếp bác bỏ.
- **Cơn thèm ăn** (thèm mặn/chua = trai, thèm ngọt/trái cây = gái): chưa tìm được nghiên cứu đối chứng nào kiểm tra giả thuyết này; cơn thèm ăn được cho là liên quan đến thay đổi nội tiết/nhu cầu dinh dưỡng/văn hóa hơn là giới tính thai nhi.
- **"Nam tả nữ hữu"** (bên trái/phải của bụng, triệu chứng mạnh hơn ở một bên): quan niệm này bắt nguồn từ thuyết âm dương (mắt trái/mặt trời/nam - mắt phải/mặt trăng/nữ theo truyền thuyết Bàn Cổ), được mở rộng sang dự đoán giới tính thai nhi. Ngay cả một số nguồn văn hóa Việt Nam giới thiệu quan niệm này cũng tự nhận "không có cơ sở khoa học". Chưa tìm được nghiên cứu kiểm chứng riêng cho quan niệm bên trái/phải cụ thể này (khác với nghiên cứu hình dáng bụng nói chung ở trên).

## Lưu ý
Đây là những trò chơi/quan niệm dự đoán mang tính giải trí, không gây hại về mặt sức khỏe (khác với các mẹo dân gian có can thiệp trực tiếp lên cơ thể mẹ/bé) — cha mẹ có thể vui với các dự đoán này mà không cần quá coi trọng độ chính xác, và siêu âm y khoa (từ khoảng tuần 18-20 trở đi) vẫn là phương pháp xác định giới tính đáng tin cậy nhất.`,
    category: "Mẹo dân gian & sự thật",
    stage: "PREGNANCY",
    evidenceLevel: "TRADITIONAL",
    knowledgeType: traditional,
    sources: [sources.fetalHeartRateGenderMetaAnalysis, sources.villamorLunarCalendarGender2010],
  },
  {
    slug: "kieng-cu-xa-hoi-sau-sinh-va-suc-khoe-tam-than-cua-me",
    title: "Kiêng cữ xã hội sau sinh và sức khỏe tâm thần của mẹ: điều gì thực sự quan trọng",
    summary: "Nghiên cứu về \"ở cữ\" tại Trung Quốc và \"sanhujoriwon\" tại Hàn Quốc (truyền thống hậu sản tương tự Việt Nam) cho thấy: KHÔNG PHẢI việc kiêng cữ tự thân quyết định nguy cơ trầm cảm sau sinh, mà là CHẤT LƯỢNG hỗ trợ gia đình, cảm giác được tôn trọng quyền tự quyết, và mức độ cô đơn trong giai đoạn đó. Kiêng cữ với hỗ trợ tốt có thể bảo vệ; kiêng cữ mang tính cô lập/áp đặt có thể làm tăng nguy cơ — chưa có nghiên cứu trực tiếp tại Việt Nam, đây là bằng chứng từ khu vực có truyền thống tương tự.",
    content: `## Câu hỏi nghiên cứu thật, không chỉ là quan niệm dân gian
Nhiều nền văn hóa Đông Á có truyền thống hậu sản có cấu trúc tương tự "ở cữ" của Việt Nam — "zuo yuezi" (Trung Quốc), "sanhujoriwon" (trung tâm chăm sóc sau sinh có nhân viên, Hàn Quốc). Đây là chủ đề đã được nghiên cứu thật, không chỉ là suy đoán, và kết quả phức tạp hơn nhiều so với "kiêng cữ tốt" hay "kiêng cữ có hại" đơn giản.

## Phát hiện chính: CHẤT LƯỢNG hỗ trợ quan trọng hơn bản thân việc kiêng cữ
Một nghiên cứu đoàn hệ bình duyệt (542 phụ nữ sau sinh, 3 bệnh viện Trung Quốc) ghi nhận ~98% thực hành "ở cữ", nhưng sau khi hiệu chỉnh các yếu tố gây nhiễu, yếu tố dự đoán trầm cảm sau sinh rõ ràng nhất KHÔNG PHẢI mức độ tuân thủ kiêng cữ, mà là: tiền sử trầm cảm, và đặc biệt là TÂM TRẠNG CHỦ QUAN trong giai đoạn ở cữ (vui vẻ hay không vui vẻ) — nhóm có tâm trạng vui vẻ trong giai đoạn ở cữ có nguy cơ trầm cảm thấp hơn rất nhiều. Một nghiên cứu liên quan khác ghi nhận: mức độ hỗ trợ từ gia đình ảnh hưởng đến cảm giác CÔ ĐƠN trong giai đoạn ở cữ, và cô đơn có liên quan đến triệu chứng trầm cảm sau đó — ủng hộ rõ ràng cho hướng "cô lập/thiếu hỗ trợ mới là vấn đề", không phải bản thân việc ở trong nhà.

## Trường hợp Hàn Quốc: một phát hiện phức tạp hơn dự đoán
Tại Hàn Quốc, các trung tâm chăm sóc sau sinh có nhân viên chuyên nghiệp (sanhujoriwon, thường 1-2 tuần) rất phổ biến. Một số nghiên cứu ghi nhận điều bất ngờ: căng thẳng chăm con và trầm cảm sau sinh lại CAO HƠN ở nhóm từng dùng dịch vụ này sau khi xuất viện, so với nhóm không dùng — các tác giả cho rằng có thể do việc MẤT ĐỘT NGỘT sự hỗ trợ có cấu trúc sau khi rời trung tâm, hoặc do nhóm dùng dịch vụ vốn đã có nhiều yếu tố nguy cơ hơn. Điều này cho thấy: bản thân "có cấu trúc hỗ trợ" không tự động là đủ — điều gì xảy ra SAU giai đoạn đó cũng quan trọng.

## Áp dụng cho bối cảnh Việt Nam — cần nói rõ giới hạn
Chưa tìm được nghiên cứu dịch tễ học nào tại Việt Nam kiểm tra trực tiếp mối liên hệ giữa kiêng cữ và tỷ lệ trầm cảm sau sinh — các phát hiện ở trên đến từ Trung Quốc và Hàn Quốc, hai nền văn hóa có truyền thống hậu sản gần gũi nhưng KHÔNG PHẢI dữ liệu trực tiếp về phụ nữ Việt Nam. Đây là bằng chứng khu vực gần nhất có thể tìm được, không phải kết luận riêng cho Việt Nam.

## Nguy cơ thể chất thật của việc kiêng cữ quá mức (nằm yên hoàn toàn)
Ngoài khía cạnh tâm lý, các nguồn y tế Việt Nam ghi nhận: hạn chế vận động quá mức trong thời gian dài có liên quan đến táo bón, bí tiểu, ứ đọng sản dịch, và tăng nguy cơ huyết khối tĩnh mạch sâu — đặc biệt sau sinh mổ. Đây là lý do nên vận động nhẹ nhàng sớm, không nằm yên hoàn toàn suốt nhiều tuần.

## Lưu ý
Thông điệp thực tế cho gia đình: giữ lại các yếu tố kiêng cữ mang tính CHĂM SÓC (nghỉ ngơi, có người hỗ trợ, ăn uống đủ chất) trong khi tránh các yếu tố mang tính CÔ LẬP/ÁP ĐẶT (cấm đoán xã giao quá mức, không cho mẹ tham gia quyết định về việc chăm con) — và đặc biệt chú ý nếu mẹ có dấu hiệu buồn bã/lo âu kéo dài, đây có thể là trầm cảm sau sinh cần được hỗ trợ chuyên môn, không phải điều "kiêng cữ đúng cách" có thể tự khỏi.`,
    category: "Sức khỏe tâm thần sau sinh",
    stage: "POSTPARTUM",
    evidenceLevel: "MODERATE",
    knowledgeType: scientific,
    sources: [sources.zuoYueziPpdStudy2024, sources.sanhujoriwonKoreaPpdStudy, sources.suckhoedoisongKiengTamNhiemTrung],
  },
  {
    slug: "myth-vs-fact-thai-ky-va-chuyen-da",
    title: "Myth vs Fact: 6 quan niệm phổ biến về thai kỳ và chuyển dạ",
    summary: "Ợ nóng nhiều = con nhiều tóc thực ra có MỘT nghiên cứu nhỏ thật tìm thấy tương quan (chưa lặp lại); giơ tay không làm dây rốn quấn cổ; quan hệ tình dục an toàn với thai kỳ khỏe mạnh bình thường; chỉ ~4% trẻ sinh đúng ngày dự sinh; kích thích núm vú có bằng chứng thật giúp chuyển dạ, ớt cay/đường xóc thì không; gây tê ngoài màng cứng không làm tăng nguy cơ sinh mổ.",
    content: `## Myth 1: "Ợ nóng nhiều khi mang thai nghĩa là con sẽ có nhiều tóc"
**VERDICT: ĐÚNG MỘT PHẦN (tương quan yếu, chưa lặp lại)**
Đây là một trong số ít quan niệm dân gian THỰC SỰ có một nghiên cứu bình duyệt riêng: nghiên cứu của Đại học Johns Hopkins (2006, tạp chí Birth) trên 64 phụ nữ mang thai tìm thấy tương quan có ý nghĩa thống kê giữa mức độ ợ nóng và lượng tóc của trẻ sơ sinh (đánh giá qua ảnh chụp bởi người đánh giá độc lập, không biết trước). Cơ chế đề xuất: cùng một loại hormone thai kỳ vừa làm giãn cơ vòng thực quản (gây ợ nóng) vừa có thể ảnh hưởng đến mọc tóc thai nhi — nghĩa là tóc không "gây ra" bởi ợ nóng, cả hai có thể cùng xuất phát từ nồng độ hormone. Hạn chế quan trọng: cỡ mẫu rất nhỏ (64 người), chưa được nghiên cứu khác lặp lại — nên xem đây là một phát hiện thú vị, chưa phải sự thật y khoa đã được xác lập chắc chắn.

## Myth 2: "Giơ tay lên cao khi mang thai làm dây rốn quấn cổ con"
**VERDICT: SAI**
Dây rốn quấn cổ (nuchal cord) khá phổ biến (khoảng 10-29% ca sinh) và hoàn toàn do CHUYỂN ĐỘNG CỦA THAI NHI bên trong tử cung (thai nhi xoay trở, lộn vòng qua các vòng dây) — không có đường dẫn giải phẫu/sinh lý nào nối từ tư thế cánh tay của mẹ đến việc dây rốn quấn quanh cổ con. Yếu tố nguy cơ thật được y văn ghi nhận là dây rốn dài bất thường hoặc quá nhiều nước ối (cho phép thai nhi cử động nhiều hơn) — không liên quan gì đến tư thế mẹ.

## Myth 3: "Quan hệ tình dục khi mang thai nguy hiểm, có thể gây sảy thai/sinh non"
**VERDICT: SAI (với thai kỳ khỏe mạnh, nguy cơ thấp) — ĐÚNG MỘT PHẦN (có tình huống thật cần thận trọng)**
Với thai kỳ khỏe mạnh, bình thường, quan hệ tình dục an toàn trong suốt thai kỳ, kể cả đến gần ngày sinh. Túi ối và cơ tử cung chắc khỏe bảo vệ thai nhi. Một phân tích gộp (2019, Journal of Sexual Medicine, 3 thử nghiệm, 1.483 phụ nữ) không thấy quan hệ tình dục làm tăng khởi phát chuyển dạ sớm, sinh non, vỡ ối sớm, hay nhẹ cân ở thai kỳ nguy cơ thấp. Tuy nhiên, có những tình huống THẬT cần thận trọng: nhau tiền đạo/nhau bám thấp (nguy cơ chảy máu), đã vỡ ối, hoặc thai kỳ nguy cơ cao đã được bác sĩ chẩn đoán cụ thể (cổ tử cung ngắn, đa thai, dọa sinh non) — trong các trường hợp này, bác sĩ có thể khuyên tránh quan hệ, và đây là lời khuyên chính đáng, không phải quan niệm dân gian mơ hồ.

## Myth 4: "Ngày dự sinh là ngày bé sẽ chào đời" / "con so luôn sinh muộn hơn ngày dự sinh"
**VERDICT: SAI (ngày chính xác) — ĐÚNG MỘT PHẦN (con so sinh muộn hơn một chút)**
Chỉ khoảng 4% trẻ sinh đúng ngày dự sinh; khoảng 80% ca sinh xảy ra trong khoảng tuần 37-41, với độ lệch chuẩn khoảng 14-16 ngày quanh ngày dự tính — nghĩa là lệch 2-4 tuần theo cả hai hướng là hoàn toàn bình thường. Về việc "con so sinh muộn hơn": một nghiên cứu đoàn hệ tiến cứu (Jukic và cộng sự, 2013, theo dõi 125 phụ nữ đo hormone hằng ngày để xác định chính xác ngày rụng trứng) xác nhận điều này có cơ sở thật — trung bình các bà mẹ sinh con so trễ hơn khoảng 5 ngày so với ngày dự sinh theo công thức Naegele, so với khoảng 3 ngày ở các lần sinh sau — một chênh lệch thật nhưng khiêm tốn (vài ngày), không phải "luôn trễ nhiều tuần" như đôi khi được phóng đại.

## Myth 5: "Đi bộ nhiều/ăn cay/đi xe xóc giúp gây chuyển dạ khi thai quá ngày"
**VERDICT: KHÔNG ĐỒNG NHẤT — cần tách riêng từng phương pháp**
- **Kích thích núm vú**: PHƯƠNG PHÁP DUY NHẤT có bằng chứng thật đáng kể — một tổng quan Cochrane (5 nghiên cứu) ghi nhận tỷ lệ chuyển dạ trong 72 giờ cao hơn rõ rệt ở nhóm kích thích núm vú (37% so với 6% ở nhóm không can thiệp), cơ chế: kích thích núm vú giải phóng oxytocin gây co bóp tử cung — đây là cơ chế sinh lý thật, dù bằng chứng nền còn hạn chế và cũ.
- **Đi bộ**: bằng chứng KHÔNG ĐỒNG NHẤT thật sự — một thử nghiệm ngẫu nhiên năm 1998 (NEJM) không thấy lợi ích, nhưng một thử nghiệm mới hơn với chương trình đi bộ có cấu trúc từ tuần 34 lại thấy cải thiện độ chín muồi cổ tử cung và tăng tỷ lệ chuyển dạ tự nhiên. Chưa có tổng quan Cochrane riêng cho đi bộ.
- **Đồ ăn cay**: KHÔNG có bằng chứng, không có cơ chế sinh lý hợp lý nào được đề xuất — thuần túy truyền miệng.
- **Đi xe xóc**: KHÔNG có bằng chứng nào được tìm thấy trong y văn.
- **Quan hệ tình dục để gây chuyển dạ** (khác với câu hỏi an toàn ở Myth 3): dù có cơ chế lý thuyết hợp lý (oxytocin từ cực khoái + prostaglandin trong tinh dịch), phân tích gộp 2019 nói trên KHÔNG thấy hiệu quả thật trong việc khởi phát chuyển dạ sớm hơn.

## Myth 6: "Gây tê ngoài màng cứng làm chậm chuyển dạ / tăng nguy cơ sinh mổ"
**VERDICT: SAI (nguy cơ sinh mổ) — ĐÚNG MỘT PHẦN (thời gian chuyển dạ)**
Tổng quan Cochrane (40 thử nghiệm, ~11.000 phụ nữ) và Ý kiến Ủy ban ACOG (số 339, tái xác nhận đến 2017) đều thống nhất: gây tê ngoài màng cứng KHÔNG làm tăng nguy cơ sinh mổ (RR 1,07; KTC 95% 0,96-1,18) — kể cả khi gây tê sớm (trước khi cổ tử cung mở 4-5cm). Về thời gian chuyển dạ: có bằng chứng thật cho thấy gây tê ngoài màng cứng kéo dài giai đoạn 1 và 2 của chuyển dạ (khoảng +30 phút và +15 phút theo một số phân tích), và tăng khả năng cần tăng co bằng oxytocin — đây là hiệu ứng thật nhưng ở mức độ khiêm tốn về mặt lâm sàng. Nguy cơ sinh giúp bằng dụng cụ (forceps/hút chân không) từng được ghi nhận cao hơn ở các thử nghiệm cũ, nhưng KHÔNG còn thấy rõ ở các thử nghiệm sau năm 2005 — phản ánh kỹ thuật gây tê hiện đại (liều thấp hơn) đã giảm bớt hiệu ứng này.`,
    category: "Myth vs Fact",
    stage: "PREGNANCY",
    evidenceLevel: "MODERATE",
    knowledgeType: scientific,
    sources: [sources.costigan2006HeartburnHair, sources.nuchalCordReviewPmc, sources.jSexMed2019IntercourseInduction, sources.jukic2013PregnancyLength, sources.cochraneBreastStimulationInduction, sources.cochraneEpiduralAnalgesia, sources.acogCommitteeOpinion339Epidural],
  },
  {
    slug: "myth-vs-fact-cho-con-bu-va-co-the-sau-sinh",
    title: "Myth vs Fact: 6 quan niệm phổ biến về cho con bú và cơ thể sau sinh",
    summary: "Ngực nhỏ vẫn sản xuất đủ sữa (mô tuyến sữa quyết định, không phải kích thước); không cần rửa núm vú trước mỗi lần bú; chảy xệ ngực do THAI KỲ, không phải do cho con bú (nghiên cứu so sánh trực tiếp); phương pháp vô kinh cho con bú (LAM) chỉ hiệu quả khi đủ 3 điều kiện chặt chẽ; bó bụng sau sinh không hiệu quả bằng tập vận động cho chứng tách cơ bụng; stress có thể tạm thời ức chế phản xạ xuống sữa (thật) nhưng không làm sữa \"hỏng\" hay mất hẳn.",
    content: `## Myth 1: "Ngực nhỏ không đủ sữa cho con bú"
**VERDICT: SAI**
Khả năng sản xuất sữa phụ thuộc vào lượng MÔ TUYẾN SỮA (mô tạo sữa), không phải kích thước tổng thể của ngực — kích thước ngực chủ yếu do mô mỡ quyết định, và mô mỡ không tham gia tạo sữa. Điều thực sự khác nhau theo giải phẫu là DUNG TÍCH CHỨA SỮA giữa các cữ bú (dao động rất lớn giữa các phụ nữ) — nhưng dung tích chứa không giới hạn TỔNG LƯỢNG sữa sản xuất trong 24 giờ; phụ nữ có dung tích chứa nhỏ hơn chỉ cần cho bú thường xuyên hơn để đạt cùng tổng lượng sữa mỗi ngày. Nguyên nhân thật sự (hiếm gặp) gây thiếu sữa do giải phẫu là tình trạng "thiểu sản mô tuyến" (IGT) — một chẩn đoán cụ thể, khác hẳn với "ngực nhỏ" nói chung.

## Myth 2: "Phải rửa/lau núm vú trước mỗi lần cho bú"
**VERDICT: SAI**
Hướng dẫn hiện tại là NGƯỢC LẠI: không cần rửa núm vú đặc biệt trước mỗi lần bú, và nên tránh dùng xà phòng. Tuyến Montgomery quanh quầng vú tiết ra chất dầu tự nhiên có đặc tính kháng khuẩn giúp làm sạch/bôi trơn núm vú; rửa quá nhiều (đặc biệt bằng xà phòng) làm mất lớp bảo vệ này, gây khô/nứt nẻ — thực ra làm TĂNG nguy cơ nhiễm trùng. Hướng dẫn lâm sàng hiện tại của Academy of Breastfeeding Medicine (Protocol #36, 2022) nêu rõ: chưa có bằng chứng cho thấy vệ sinh kém gây viêm vú do vi khuẩn. Biện pháp vệ sinh thực sự quan trọng là RỬA TAY (trước khi bú, sau khi thay tã), không phải rửa núm vú.

## Myth 3: "Cho con bú làm ngực chảy xệ"
**VERDICT: SAI**
Một nghiên cứu so sánh trực tiếp (BS. Brian Rinker, Đại học Kentucky, trình bày tại Hội Phẫu thuật Tạo hình Hoa Kỳ 2007) phỏng vấn 132 phụ nữ tìm phẫu thuật nâng/treo ngực, so sánh mức độ chảy xệ giữa nhóm đã cho con bú và chưa từng cho con bú — KHÔNG thấy khác biệt có ý nghĩa. Các yếu tố THỰC SỰ dự đoán mức độ chảy xệ: tuổi tác, số lần mang thai, chỉ số BMI cao hơn, size áo ngực trước khi mang thai lớn hơn, và HÚT THUỐC LÁ. Kết luận của nghiên cứu: chính THAI KỲ (thay đổi hormone, căng da/dây chằng do ngực to lên trong thai kỳ) là nguyên nhân gây chảy xệ, không phải hành động cho con bú sau đó.

## Myth 4: "Cho con bú là không thể có thai"
**VERDICT: ĐÚNG MỘT PHẦN — có phương pháp thật (LAM) nhưng cần đủ 3 điều kiện chặt chẽ**
Phương pháp Vô kinh Cho con bú (LAM) là phương pháp tránh thai tạm thời có thật, được WHO công nhận, hiệu quả ~98% khi dùng đúng — NHƯNG chỉ khi ĐỒNG THỜI đáp ứng cả 3 tiêu chuẩn (Đồng thuận Bellagio 1988): (1) mẹ CHƯA có kinh nguyệt trở lại sau sinh; (2) bé bú mẹ HOÀN TOÀN hoặc gần như hoàn toàn (không có khoảng cách dài giữa các cữ bú, không bổ sung sữa công thức đáng kể); (3) bé DƯỚI 6 THÁNG TUỔI. Nếu MỘT trong ba điều kiện này không còn đúng — có kinh trở lại, bú không còn hoàn toàn (bổ sung sữa ngoài, ăn dặm), hoặc bé qua 6 tháng — độ tin cậy của LAM không còn được đảm bảo. Quan niệm phổ biến "cứ cho bú là không có thai" bỏ qua các điều kiện chặt chẽ này.

## Myth 5: "Phải dùng nịt/bó bụng sau sinh để lấy lại vóc dáng và tránh xổ bụng"
**VERDICT: SAI (như phương pháp điều trị chính) — CHƯA ĐỦ BẰNG CHỨNG (về lợi ích độc lập)**
Bằng chứng hiện tại KHÔNG ủng hộ việc bó bụng như phương pháp điều trị hiệu quả cho chứng tách cơ thẳng bụng (diastasis recti). Một tổng quan hệ thống bình duyệt cho thấy TẬP VẬN ĐỘNG (bài tập cơ bụng/sàn chậu có hướng dẫn) giảm khoảng cách giữa hai bó cơ thẳng bụng hiệu quả hơn việc bó bụng hoặc không can thiệp gì. Về nguy cơ: bó bụng làm tăng áp lực trong ổ bụng, gây áp lực xuống sàn chậu vốn đã yếu sau sinh — nhiều nguồn vật lý trị liệu cảnh báo điều này có thể làm NẶNG THÊM tình trạng tiểu không tự chủ hoặc sa tạng chậu, đặc biệt khi bó chặt/kéo dài. Hướng dẫn hiện tại xem bó bụng nhiều nhất chỉ là biện pháp hỗ trợ tạm thời (vài tuần đầu, khi vận động), không thay thế cho vật lý trị liệu phục hồi cơ core/sàn chậu.

## Myth 6: "Mẹ bị stress/tức giận sẽ làm mất sữa hoặc sữa bị hỏng"
**VERDICT: ĐÚNG MỘT PHẦN (cơ chế thật) — phần "sữa bị hỏng/độc" là SAI**
Có một cơ chế sinh lý thật: phản xạ xuống sữa (let-down) phụ thuộc vào oxytocin, và stress/sợ hãi/đau đớn cấp tính CÓ THỂ tạm thời ức chế việc giải phóng oxytocin — khiến sữa khó "xuống" hơn trong khoảnh khắc căng thẳng đó. Đây là hiệu ứng thật, tạm thời, có thể hồi phục — KHÔNG phải sữa bị "hỏng"/"nhiễm độc"/mất hẳn vĩnh viễn như phiên bản dân gian phóng đại. Việc tạo sữa vẫn tiếp tục miễn là sữa tiếp tục được lấy ra khỏi ngực (bú/hút) — khi căng thẳng qua đi và việc cho bú/hút sữa tiếp tục bình thường, phản xạ xuống sữa cũng trở lại bình thường.`,
    category: "Myth vs Fact",
    stage: "POSTPARTUM",
    evidenceLevel: "MODERATE",
    knowledgeType: scientific,
    sources: [sources.creganHartmannBreastVolumeMilk, sources.abmProtocol36Mastitis, sources.rinker2008BreastfeedingPtosis, sources.whoLamFamilyPlanning, sources.diastasisRectiExerciseVsBinding, sources.dysphoricMilkEjectionReflexPmc],
  },
  {
    slug: "myth-vs-fact-giac-ngu-an-uong-moc-phat-trien-cua-be",
    title: "Myth vs Fact: 6 quan niệm phổ biến về giấc ngủ, ăn uống và mốc phát triển của bé",
    summary: "Bế/đáp ứng bé nhanh không làm \"hư\" bé — nghiên cứu nền tảng cho thấy điều ngược lại; đọc sách cho bé từ sơ sinh có lợi dù bé chưa hiểu nội dung; \"wake window\" là thuật ngữ do ngành tư vấn giấc ngủ tạo ra, không có trong y văn nhi khoa chính thức; nên cho ăn theo tín hiệu đói-no của bé, không phải theo việc bé bú hết bình hay lịch cố định; mốc \"biết đi\" hiện tại của CDC là 18 tháng (không phải 12 tháng như bảng cũ); bằng chứng về cho bé \"khóc tự ngủ\" (cry-it-out) phức tạp hơn hai thái cực thường thấy.",
    content: `## Myth 1: "Bế/đáp ứng bé quá nhanh khi khóc sẽ làm bé hư, ỷ lại"
**VERDICT: SAI**
Đây là quan niệm đã được kiểm chứng trực tiếp, không chỉ dựa vào lý thuyết chung: nghiên cứu nền tảng Bell & Ainsworth (1972, Child Development) theo dõi các cặp mẹ-con trong năm đầu đời phát hiện: trẻ có mẹ đáp ứng nhanh, nhất quán với tiếng khóc trong những tháng đầu lại KHÓC ÍT HƠN vào cuối năm đầu và thể hiện hành vi khám phá/độc lập NHIỀU HƠN — ngược hoàn toàn với niềm tin "đáp ứng nhanh sẽ làm bé ỷ lại". Trẻ sơ sinh chưa có khả năng tự điều chỉnh cảm xúc (khả năng này chỉ xuất hiện khoảng 4 tháng tuổi trở đi) nên phụ thuộc vào phản ứng của người chăm sóc là điều bình thường về mặt sinh học — đáp ứng tốt trong năm đầu có liên quan đến khả năng tự lập, quản lý stress tốt hơn về sau, không phải ngược lại.

## Myth 2: "Đọc sách cho bé quá nhỏ không có tác dụng gì vì bé chưa hiểu"
**VERDICT: SAI**
AAP khuyến nghị đọc sách cho bé "không bao giờ là quá sớm" — kể cả từ giai đoạn sơ sinh. Cơ chế không phải là bé hiểu nội dung câu chuyện, mà là việc TIẾP XÚC VỚI NGÔN NGỮ: não bé bắt đầu chuẩn bị cho việc nói từ nhiều tháng trước khi nói được từ đầu tiên, và quá trình này cần được "nghe" ngôn ngữ liên tục — đọc sách cùng nhau là một trong những nguồn tiếp xúc ngôn ngữ phong phú và ổn định nhất. Đọc sách theo cách tương tác (chỉ vào hình, thay đổi giọng điệu) còn liên quan đến phát triển cảm xúc-xã hội tốt hơn và chất lượng gắn kết cha mẹ-con tốt hơn — độc lập với việc bé có "hiểu" câu chuyện hay không. Nghiên cứu dài hạn cho thấy cả số lượng và chất lượng đọc sách cùng bé trong giai đoạn sơ sinh dự đoán được vốn từ vựng và kỹ năng đọc ở tuổi 4.

## Myth 3: "Wake window" (khung giờ thức tối đa trước giấc ngủ tiếp theo) là khái niệm khoa học chính thức
**VERDICT: SAI**
Đây là thuật ngữ do NGÀNH TƯ VẤN GIẤC NGỦ TRẺ EM tạo ra (xuất hiện từ đầu những năm 2000), dựa trên kinh nghiệm cá nhân của các nhà tư vấn chứ không phải nghiên cứu bình duyệt. Một bác sĩ chuyên khoa giấc ngủ nhi khoa được chứng nhận (Đại học Yale) xác nhận: thuật ngữ này không được dạy trong trường y, không xuất hiện trong y văn giấc ngủ nhi khoa, và tìm kiếm trên PubMed cho ra 0 kết quả liên quan. Thay vào đó, hướng dẫn chính thức (Tuyên bố đồng thuận của Hiệp hội Y học Giấc ngủ Hoa Kỳ - AASM, 2016) đưa ra KHOẢNG TỔNG THỜI GIAN NGỦ CẦN THIẾT MỖI 24 GIỜ theo độ tuổi (ví dụ 12-16 giờ bao gồm giấc ngủ ngày cho trẻ 4-12 tháng) thay vì bảng "khung giờ thức" cụ thể theo phút trước mỗi giấc ngủ.

## Myth 4: "Biết bé đói/no qua việc bú hết bình hay không" / cho ăn theo lịch cố định nghiêm ngặt
**VERDICT: SAI**
AAP khuyến nghị CHO ĂN ĐÁP ỨNG (responsive feeding) — đọc tín hiệu đói/no của bé (rúc tìm vú, đưa tay vào miệng, bú chậm lại, quay đầu đi) thay vì đánh giá qua việc bình sữa có hết hay không, và cảnh báo rõ: khuyến khích bé bú hết bình có thể góp phần làm bé ăn quá nhiều năng lượng. Nghiên cứu hành vi cho thấy việc khuyến khích trẻ bú/ăn hết phần được rót sẵn có liên quan đến việc trẻ dần mất khả năng tự nhận biết tín hiệu no-đói của chính mình, tăng nguy cơ ăn quá mức về sau.

## Myth 5: "Bảng mốc phát triển cũ vẫn còn đúng — bé phải biết đi lúc 12 tháng"
**VERDICT: SAI (theo bảng mốc hiện tại của CDC)**
Đây là điểm gây lo lắng phổ biến nhất cho cha mẹ và cần được sửa rõ ràng: CDC đã cập nhật bảng mốc phát triển năm 2022, đổi tiêu chuẩn từ "tuổi mà 50% trẻ đạt được" sang "tuổi mà ÍT NHẤT 75% trẻ đạt được" (để một mốc bị bỏ lỡ có ý nghĩa cảnh báo rõ ràng hơn). Kết quả: mốc "**biết đi mà không cần vịn**" hiện được liệt kê ở **18 THÁNG**, không phải 12 tháng như bảng cũ theo tiêu chuẩn 50%. Nghĩa là một bé 13-14 tháng CHƯA biết đi độc lập không tự động là dấu hiệu chậm phát triển theo tiêu chuẩn hiện hành — đây là mốc phổ biến nhất bị hiểu sai vì cha mẹ vẫn nhớ bảng cũ.

## Myth 6: "Phải để bé khóc tự ngủ hoàn toàn (cry-it-out)" HAY "không bao giờ được để bé khóc"
**VERDICT: KHÔNG ĐỒNG NHẤT — bằng chứng thật bác bỏ CẢ HAI thái cực, và khác nhau theo độ tuổi**
Với trẻ TỪ KHOẢNG 6 THÁNG TRỞ LÊN: một tổng quan tổng hợp 52 nghiên cứu (dùng làm cơ sở cho Hiệp hội Y học Giấc ngủ Hoa Kỳ) kết luận các phương pháp huấn luyện giấc ngủ hành vi (để khóc có kiểm soát, dần dần) nhìn chung hiệu quả, không ghi nhận bằng chứng gây hại. Một thử nghiệm ngẫu nhiên có đối chứng của Úc theo dõi 225 gia đình sau 5 NĂM không thấy khác biệt về vấn đề cảm xúc-hành vi, sự gắn kết mẹ-con, trầm cảm của mẹ, hay điều hòa cortisol của trẻ giữa nhóm có can thiệp và nhóm không — bác bỏ trực tiếp lo ngại "để khóc gây tổn thương gắn kết lâu dài".
Với trẻ DƯỚI 6 THÁNG: bằng chứng THỰC SỰ khác — một tổng quan hệ thống (2013) kết luận can thiệp huấn luyện giấc ngủ hành vi ở độ tuổi này KHÔNG cải thiện rõ kết cục cho mẹ hoặc bé, và có thể có tác dụng phụ không mong muốn (tăng khóc, cai sữa mẹ sớm hơn, tăng lo âu của mẹ) — đây là cơ sở cho khuyến nghị chung là không nên áp dụng huấn luyện giấc ngủ kiểu "để khóc" có cấu trúc trước khoảng 4-6 tháng tuổi.
**Kết luận cân bằng**: bằng chứng bác bỏ cả hai thái cực "luôn phải để khóc" và "không bao giờ được để khóc" — với trẻ đủ lớn (6+ tháng), huấn luyện giấc ngủ có bằng chứng khá tốt về hiệu quả và không gây hại lâu dài đã được chứng minh; với trẻ nhỏ hơn, bằng chứng còn yếu và nên thận trọng hơn.`,
    category: "Myth vs Fact",
    stage: "INFANT_1_3_MONTHS",
    evidenceLevel: "MODERATE",
    knowledgeType: scientific,
    sources: [sources.bellAinsworth1972Crying, sources.aapEarlyLiteracy, sources.canapariWakeWindows, sources.paruthi2016AasmSleepDuration, sources.aapResponsiveFeedingFactSheet, sources.cdcMilestone18mo, sources.price2012CioFiveYearFollowup, sources.douglasHill2013SleepUnder6mo],
  },
  {
    slug: "myth-vs-fact-sua-me-tang-truong-moc-rang-tiem-chung",
    title: "Myth vs Fact: 6 quan niệm phổ biến về sữa mẹ, tăng trưởng, mọc răng và tiêm chủng",
    summary: "Đường không gây tăng động — 23 thử nghiệm mù đôi bác bỏ hoàn toàn, chính kỳ vọng của cha mẹ mới là nguyên nhân; sữa mẹ không \"loãng\" đi theo thời gian; bé bụ bẫm tăng cân nhanh giai đoạn sơ sinh có liên quan thật đến nguy cơ béo phì sau này, không tự nhiên \"gầy đi\"; mọc răng sớm/muộn không liên quan gì đến trí thông minh; dồn vắc-xin lại 1 lần không giảm đau — cách tiêm nhiều mũi cùng lúc thực ra ĐÃ là khuyến nghị chuẩn; tóc ướt ra ngoài không tự gây cảm nhưng có cơ chế miễn dịch thật đáng chú ý.",
    content: `## Myth 1: "Ăn nhiều đường làm trẻ tăng động"
**VERDICT: SAI**
Đây là một trong những quan niệm bị bác bỏ triệt để nhất trong nghiên cứu hành vi nhi khoa. Phân tích gộp năm 1995 (JAMA) tổng hợp **23 thử nghiệm mù đôi, có đối chứng giả dược** (1.414 trẻ, thiết kế chéo, dùng chất tạo ngọt nhân tạo làm giả dược) — trên 14 chỉ số hành vi/nhận thức, khoảng tin cậy 95% cho hiệu ứng của đường đều bao gồm số 0 — nghĩa là KHÔNG có tác động đo được, kể cả ở nhóm trẻ được cha mẹ cho là "nhạy cảm với đường". Một nghiên cứu đi kèm (1994) hé lộ vì sao quan niệm này vẫn tồn tại: 35 bà mẹ được (sai sự thật) thông báo con trai họ vừa uống một lượng đường lớn — thực ra tất cả trẻ chỉ được cho giả dược không đường — nhưng các bà mẹ TIN con đã uống đường lại đánh giá con tăng động hơn RÕ RỆT và có xu hướng kiểm soát/chỉnh sửa con nhiều hơn. Đây là hiệu ứng kỳ vọng/thiên kiến xác nhận của cha mẹ, không phải hiệu ứng sinh lý từ đường.
*(Lưu ý: kết luận này KHÔNG áp dụng cho phẩm màu/chất bảo quản thực phẩm nhân tạo — có bằng chứng riêng, thật, dù nhỏ, cho thấy một số chất này có thể ảnh hưởng đến tăng động ở một số trẻ — không nên gộp chung hai vấn đề.)*

## Myth 2: "Sữa mẹ loãng/ít chất sau vài tháng, cần bổ sung sữa công thức hoặc ăn dặm sớm hơn"
**VERDICT: SAI**
Quan niệm "sữa đầu loãng, sữa cuối đặc" thường bị hiểu sai — sữa đầu và sữa cuối là CÙNG MỘT loại sữa, độ béo thay đổi theo độ đầy của bầu ngực TRONG một cữ bú, không phải dấu hiệu chất lượng sữa giảm dần theo tháng. Nghiên cứu theo dõi thành phần sữa mẹ theo thời gian (ở các bà mẹ cho bú kéo dài trên 18 tháng) cho thấy đạm và chất béo thậm chí TĂNG, carbohydrate giảm nhẹ, rồi ổn định từ 24-48 tháng — một sự thích nghi, không phải suy giảm. Một nghiên cứu dấu vân tay chuyển hóa khác ghi nhận thành phần sữa "ổn định đáng kể" đến 24 tháng tuổi của bé. Lưu ý quan trọng: WHO/AAP vẫn khuyến nghị bắt đầu ăn dặm khoảng 6 tháng — nhưng lý do là NHU CẦU NĂNG LƯỢNG/VI CHẤT của bé tăng vượt quá những gì một lượng sữa mẹ nhất định có thể cung cấp, KHÔNG PHẢI vì bản thân sữa mẹ trở nên kém chất lượng.

## Myth 3: "Trẻ bụ bẫm sau này sẽ tự gầy đi, không cần lo"
**VERDICT: SAI**
Đây là điểm cần nói thẳng dù không phải điều cha mẹ muốn nghe: một nghiên cứu đoàn hệ đa trung tâm lớn (đăng trên chính tạp chí Pediatrics của AAP) ghi nhận tăng cân nhanh trong 4 tháng đầu đời có liên quan đến tăng nguy cơ thừa cân ở tuổi 7 (tỷ số chênh 1,38 cho mỗi 100g/tháng tăng thêm), độc lập với cân nặng lúc sinh. Một phân tích gộp khác (2020, gần 170.000 trẻ) ghi nhận tăng cân nhanh trong 2 năm đầu làm tăng đáng kể nguy cơ béo phì ở trẻ sinh non (tỷ số chênh đã hiệu chỉnh 1,87). Đây là một YẾU TỐ NGUY CƠ, không phải một định mệnh chắc chắn — không phải mọi bé tăng cân nhanh đều sẽ béo phì — nhưng thông điệp "không cần lo, tự nhiên sẽ gầy đi" là không chính xác; nên theo dõi XU HƯỚNG tăng trưởng cùng bác sĩ thay vì mặc định bé sẽ tự điều chỉnh.

## Myth 4: "Mọc răng sớm/muộn nói lên trí thông minh của trẻ"
**VERDICT: SAI (chưa có bằng chứng ủng hộ)**
Thời điểm mọc răng chủ yếu do di truyền, tình trạng dinh dưỡng (canxi/vitamin D), và một số nghiên cứu mới hơn cho thấy liên quan đến nội tiết tố mẹ trong thai kỳ — KHÔNG liên quan đến phát triển trí tuệ/nhận thức. Không có cơ quan nhi khoa hay phát triển trẻ em lớn nào (AAP, WHO...) đưa ra tuyên bố liên kết thời điểm mọc răng với trí thông minh. Đây gần như hoàn toàn là quan niệm truyền miệng, chưa nhận được sự quan tâm nghiên cứu nghiêm túc nào.

## Myth 5: "Nên dồn vắc-xin lại tiêm một lần cho đỡ đau, thay vì tiêm nhiều lần"
**VERDICT: ĐÚNG MỘT PHẦN / DỄ GÂY HIỂU LẦM**
Mục tiêu đằng sau quan niệm này (giảm đau cho bé) là chính đáng, nhưng cách hiểu "dồn/hoãn lịch tiêm để gộp mũi" là không chính xác — CDC/ACIP đã khuyến nghị TIÊM TẤT CẢ các vắc-xin đến hạn CÙNG MỘT LẦN KHÁM (không phải hoãn lại) vì giúp bé được bảo vệ đúng lịch và giảm số lần phải đến khám. Một thử nghiệm ngẫu nhiên có đối chứng ở trẻ 4 tháng tuổi so sánh tiêm đồng thời nhiều mũi với tiêm tuần tự từng mũi một — nhóm tiêm ĐỒNG THỜI có điểm đau THẤP HƠN RÕ RỆT so với nhóm tiêm tuần tự — nghĩa là tiêm gộp trong cùng một lần khám (đã là khuyến nghị chuẩn) không làm tăng đau, thậm chí có thể giảm đau so với việc kéo dài thời gian tiêm từng mũi. Điều KHÔNG nên làm là trì hoãn LỊCH TIÊM để "gom" vắc-xin — điều này kéo dài thời gian bé không được bảo vệ trước bệnh thật (xem thêm bài về lịch tiêm trì hoãn ở Batch 10). Các kỹ thuật giảm đau THẬT SỰ có bằng chứng: tiêm mũi đau nhất sau cùng, cho bú mẹ trong lúc tiêm (Cochrane: giảm thời gian khóc và điểm đau), cho ngậm núm vú giả/bú không dinh dưỡng, bế bé, và dùng dung dịch đường (sucrose) cho trẻ nhỏ.

## Myth 6: "Ra ngoài với tóc ướt sẽ bị cảm lạnh"
**VERDICT: ĐÚNG MỘT PHẦN — cần hiểu đúng cơ chế**
CDC khẳng định rõ: cảm lạnh do VI-RÚT gây ra, tiếp xúc lạnh/ướt tự thân không "tạo ra" cảm lạnh nếu không có vi-rút. Tuy nhiên, có một nghiên cứu đối chứng thật (Đại học Cardiff, Anh) đáng chú ý: 180 người khỏe mạnh được cho ngâm chân trong nước lạnh 20 phút (so với nhóm chân khô) — khoảng 10% nhóm bị làm lạnh xuất hiện triệu chứng cảm trong vài ngày sau, so với chỉ khoảng 5% ở nhóm đối chứng. Cơ chế đề xuất: làm lạnh đột ngột gây co mạch phản xạ ở niêm mạc mũi/họng, tạm thời giảm lưu lượng máu/bạch cầu đến vùng này — có thể khiến một nhiễm vi-rút vốn đang ở dạng không triệu chứng trở thành có triệu chứng. Kết luận cân bằng cho ứng dụng: "tiếp xúc lạnh/ướt không TỰ GÂY RA cảm lạnh nếu không có vi-rút, nhưng có thể tạm thời làm giảm khả năng phòng vệ tại chỗ và khiến triệu chứng dễ biểu hiện hơn nếu đã có vi-rút trong người" — không nên nói đơn giản "hoàn toàn không liên quan gì".`,
    category: "Myth vs Fact",
    stage: "INFANT_6_12_MONTHS",
    minimumAgeDays: 30,
    maximumAgeDays: 1095,
    evidenceLevel: "STRONG",
    knowledgeType: scientific,
    sources: [sources.wolraich1995SugarMetaAnalysis, sources.hooverMilich1994SugarExpectancy, sources.czosnykowska2018MilkComposition, sources.stettler2002RapidWeightGain, sources.accelWeightGainObesityMeta2020, sources.ipp2010SimultaneousVaccineInjectionPain, sources.cochraneBreastfeedingVaccinePain, sources.eccles2005WetColdColds, sources.harvardKnuckleCracking],
  },
  {
    slug: "faq-tinh-huong-thuc-te-o-tre-so-sinh",
    title: "Hỏi đáp: 6 tình huống thực tế thường gặp ở trẻ sơ sinh",
    summary: "Nấc cụt sau bú là bình thường do cơ hoành chưa trưởng thành; đảo lộn ngày-đêm là thật (do melatonin/nhịp sinh học chưa hoàn thiện đến 8-12 tuần); chỉ tắm bồn sau khi rốn rụng và lành hẳn (~1-3 tuần); vàng da lan đến tay/chân/lòng bàn tay-chân là dấu hiệu cần quay lại khám; hăm tã không đỡ với kem thường có thể là nấm, cần thuốc kháng nấm; vặn mình/rặn đỏ mặt là bình thường nếu phân vẫn mềm.",
    content: `## 1. "Con tôi bị nấc cụt liên tục sau khi bú, có bình thường không?"
Có, hoàn toàn bình thường — do cơ hoành của trẻ sơ sinh còn non nớt, dễ bị kích thích, thường do bú quá nhanh, nuốt hơi, hoặc bụng quá no. Không đau đớn với bé như người lớn tưởng, và đa số tự hết sau vài phút. Cách giúp giảm: cho bú chậm hơn, ợ hơi giữa chừng cữ bú (không chỉ lúc cuối), bế đứng bé áp vào người 15-20 phút sau bú. **Cần lo lắng nếu** nấc cụt đi kèm: nôn trớ mạnh/nhiều lần (không chỉ ọc sữa), ưỡn người ra sau khi bú, tăng cân kém, bú kém/bỏ bú, hoặc thay đổi nhịp thở — đây có thể là dấu hiệu trào ngược hoặc bú quá no, không phải do bản thân nấc cụt.

## 2. "Con tôi ngủ ngày cày đêm, làm sao để chỉnh lại?"
Đây là hiện tượng THẬT, không phải do cha mẹ làm sai điều gì — nhịp sinh học và sản xuất melatonin của trẻ sơ sinh chưa trưởng thành lúc mới sinh, nhịp ngủ ban đêm của chính bé chỉ thực sự rõ rệt từ khoảng 6-8 tuần và tiếp tục hoàn thiện đến 8-12 tuần. Cách hỗ trợ: ban ngày giữ không gian sáng, không cần giảm tiếng ồn sinh hoạt bình thường, cho bú/chơi tích cực; ban đêm giữ ánh sáng mờ, hạn chế nói chuyện/kích thích khi cho bú đêm/thay tã, tránh màn hình. Đừng kỳ vọng cải thiện ngay trong vài ngày — đây là quá trình sinh lý cần vài tuần.

## 3. "Bao lâu thì tắm bồn thường được, và rốn chảy máu/có mùi/sưng đỏ nhẹ có phải nhiễm trùng?"
Chỉ lau người (không ngâm nước) cho đến khi rốn rụng VÀ vùng gốc rốn đã lành hẳn (không còn ẩm/tiết dịch) — thường 1-3 tuần. Nếu đến 3 tuần rốn chưa rụng, nên hỏi bác sĩ.
**Phân biệt bình thường và nhiễm trùng (viêm rốn - omphalitis):**
- Bình thường: cuống rốn chuyển vàng-xanh → nâu → đen khi khô rụng; vài giọt máu nhẹ đúng lúc rụng là bình thường; mùi hơi ẩm mốc nhẹ khi mô đang khô là bình thường; bé không phản ứng đau khi chạm.
- Cần khám ngay: da XUNG QUANH gốc rốn đỏ LAN RỘNG (không chỉ đỏ tại chỗ ổn định); chảy máu nhiều/liên tục; mùi HÔI THỐI rõ rệt khác hẳn mùi ẩm nhẹ bình thường; dịch tiết vàng/xanh (mủ); bé khóc/né tránh khi chạm vào rốn; kèm sốt, lừ đừ, bú kém — đây là dấu hiệu body toàn thân, cần cấp cứu vì viêm rốn ở trẻ sơ sinh có thể tiến triển nhanh thành nhiễm trùng huyết.

## 4. "Con tôi bị vàng da, bác sĩ nói theo dõi tại nhà — khi nào cần quay lại ngay?"
Cách kiểm tra thực tế: quan sát dưới ánh sáng tự nhiên/ban ngày (không dùng đèn vàng trong nhà), ấn nhẹ ngón tay lên trán/sống mũi bé rồi thả ra — vùng da nếu vàng thay vì trở về màu bình thường là có vàng da tại đó. Vàng da lan theo hướng ĐẦU XUỐNG CHÂN: xuất hiện ở mặt trước, lan xuống ngực/bụng, rồi mới đến tay/chân/lòng bàn tay-chân khi bilirubin tăng cao hơn — vàng da CHỈ ở mặt/ngực là mức độ nhẹ hơn, còn lan đến tay/chân/lòng bàn tay-chân là dấu hiệu cần tái khám ngay, không chỉ tiếp tục theo dõi tại nhà.
**Dấu hiệu cần quay lại NGAY (cấp cứu):** bé khó đánh thức bất thường/rất lừ đừ; bú kém/bỏ bú; ít tã ướt/bẩn hơn bình thường; người mềm nhũn HOẶC ngược lại ưỡn cứng người/cổ; tiếng khóc cao bất thường; sốt hoặc hạ thân nhiệt; phân bạc màu/trắng và nước tiểu vàng sậm/nâu (dấu hiệu cần loại trừ nguyên nhân khác, không chỉ vàng da sinh lý); vàng da xuất hiện trước 24 giờ tuổi luôn là cấp cứu.

## 5. "Con tôi bị hăm tã nặng, đã thử kem thông thường không đỡ, giờ làm sao?"
Nếu kem chống hăm (kẽm oxit/petrolatum) dùng đều đặn vài ngày không cải thiện, khả năng cao là hăm do NẤM (Candida), không chỉ kích ứng đơn thuần — kem chống hăm thường không điều trị được nấm. Dấu hiệu gợi ý nấm: đỏ tươi/bóng, RANH GIỚI RÕ, tập trung nặng ở NẾP GẤP bẹn (khác hăm kích ứng thường tránh nếp gấp sâu), có các NỐT ĐỎ NHỎ RẢI RÁC ngoài rìa vùng hăm chính ("tổn thương vệ tinh"), kéo dài trên 3 ngày dù đã vệ sinh tốt. Cần thuốc bôi kháng nấm (như nystatin, hoặc nhóm azole như clotrimazole/miconazole) — kem chống hăm có thể dùng THÊM để bảo vệ da nhưng không thay thế thuốc kháng nấm. Nên hỏi bác sĩ trước khi tự mua thuốc kháng nấm cho trẻ dưới 6 tháng. Đi khám nếu: không cải thiện sau một đợt thuốc kháng nấm đúng cách, lan ra ngoài vùng tã, có bọng nước/vết loét hở/chảy máu, hoặc bé sốt/có vẻ không khỏe.

## 6. "Bé nhà tôi bị đầy hơi/xì hơi nhiều, vặn mình đỏ mặt, có phải đau bụng, có cần đổi sữa không?"
Phần lớn là hiện tượng sinh lý bình thường gọi là "dyschezia sơ sinh" — bé chưa học được cách phối hợp tăng áp lực bụng để đẩy phân trong khi đồng thời thả lỏng cơ vòng hậu môn, nên rặn/gồng đỏ mặt/khóc trước khi đi tiêu — đây là bé đang "luyện tập" phối hợp, không phải dấu hiệu đau bệnh lý. Theo tiêu chuẩn Rome IV, đây là bình thường ở khoảng 20% trẻ sơ sinh dưới 9 tháng, thường tự hết khi 3-9 tháng. **Điểm quyết định là PHÂN, không phải tiếng động/độ gắng sức**: nếu phân ra vẫn MỀM và màu bình thường (vàng/xanh/nâu), dù bé có rặn ồn ào thế nào cũng là bình thường, không cần đổi sữa. Cần khám nếu: phân cứng/vón cục (táo bón thật), có máu/màu trắng bợt/đen; bụng chướng; nôn (đặc biệt nôn màu xanh/vàng); chậm tăng cân; hoặc dấu hiệu này mới xuất hiện lần đầu sau 9 tháng tuổi.`,
    category: "Câu hỏi thường gặp",
    stage: "NEWBORN_0_28_DAYS",
    minimumAgeDays: 0,
    maximumAgeDays: 90,
    evidenceLevel: "STRONG",
    knowledgeType: scientific,
    sources: [sources.healthyChildrenHiccups, sources.pmcGerdBodyMovementInfant, sources.pmcLightExposureCircadianInfant, sources.natureSrep44749PhotoperiodSleep, sources.healthyChildrenUmbilicalCordCare, sources.clevelandClinicOmphalitis, sources.nhsJaundiceInBabies, sources.clevelandClinicKernicterus, sources.clevelandClinicYeastDiaperRash, sources.mdcalcRomeIVDyschezia, sources.pmc8767117RomeIVColicConstipation],
  },
  {
    slug: "faq-an-uong-hanh-vi-phat-trien-tre-tap-di",
    title: "Hỏi đáp: 6 câu hỏi thường gặp về ăn uống, hành vi và phát triển của trẻ tập đi",
    summary: "Biếng ăn/bỏ bữa ở tuổi tập đi là bình thường (tốc độ tăng trưởng chậm lại, cần 8-10 lần tiếp xúc món mới); táo bón xử lý bằng chất xơ/nước trước, thuốc chỉ khi có chỉ định; cắn/đánh bạn cần kỷ luật tích cực, không đánh lại; nói lắp 2-6 tuổi thường tự hết (75%); ti giả/mút ngón nên cai chủ động trước 3 tuổi; ăn vạ bình thường trừ khi kéo dài >25 phút hoặc có tự hại.",
    content: `## 1. "Con tôi biếng ăn/bỏ bữa liên tục ở tuổi tập đi, có bình thường không?"
Rất có thể là bình thường — tốc độ tăng trưởng chậm lại rõ rệt sau 1 tuổi khiến nhu cầu năng lượng và cảm giác đói giảm tương ứng; CDC xác nhận việc trẻ chỉ thích 1-2 món hoặc từ chối món ăn là hành vi bình thường, thường tự hết khi khoảng 5 tuổi. Khoảng 25-50% trẻ phát triển bình thường được xếp vào nhóm "kén ăn". Xử lý: không ép ăn/không thương lượng bằng phần thưởng; tiếp tục bày món đa dạng mỗi bữa — trẻ cần trung bình **8-10 lần tiếp xúc** với món mới trước khi chấp nhận thử; giữ giờ ăn cố định, không ăn vặt/uống sữa sát giờ ăn chính. **Cần khám nếu:** cân/chiều cao đi ngang hoặc tụt trên biểu đồ tăng trưởng; chỉ ăn được rất ít nhóm thực phẩm; sặc/khó nuốt với thức ăn có kết cấu mới; bữa ăn luôn là cuộc chiến căng thẳng nghiêm trọng — đây có thể là rối loạn ăn uống ở trẻ (Pediatric Feeding Disorder) cần đánh giá chuyên khoa.

## 2. "Con tôi bị táo bón, xử lý tại nhà thế nào, khi nào cần khám?"
Xử lý trước bằng chế độ ăn/sinh hoạt: tăng chất xơ (rau củ nghiền/bào nhỏ, ngũ cốc nguyên hạt — công thức tham khảo AAP: gram chất xơ/ngày ≈ tuổi + 5); tăng nước; vận động; tạo thói quen ngồi bô sau bữa ăn, giữ thái độ bình tĩnh không gây áp lực. Thuốc (như PEG/Movicol) thường được kê KÈM THEO thay đổi ăn uống, không thay thế, và cần bác sĩ chỉ định. **Cần khám nếu:** đi tiêu dưới 3 lần/tuần, phân cứng/đau khi rặn, có máu trong phân, đau bụng/chán ăn kéo dài, hoặc không cải thiện sau vài ngày. **Dấu hiệu nghi bệnh Hirschsprung (hiếm gặp, hay khiến cha mẹ lo lắng):** sơ sinh KHÔNG đi phân su trong 48 giờ đầu sau sinh (dấu hiệu quan trọng nhất); nôn dịch xanh/nâu; bụng chướng; táo bón không đáp ứng thuốc nhuận tràng thông thường; chậm tăng cân — đây là bất thường thần kinh ruột thật, khác hẳn táo bón chức năng thông thường, cần bác sĩ chuyên khoa chẩn đoán.

## 3. "Con tôi hay cắn/đánh bạn ở nhà trẻ, tôi nên làm gì?"
Đây là hành vi phổ biến ở tuổi tập đi vì trẻ chưa đủ ngôn ngữ diễn đạt cảm xúc mạnh (thất vọng, giận). KHÔNG cắn/đánh lại trẻ "để trẻ biết cảm giác" — cách này dạy trẻ dùng bạo lực giải quyết vấn đề và có xu hướng làm hành vi cắn TĂNG thay vì giảm; AAP cũng khuyến cáo không đánh đòn/dọa nạt/làm xấu hổ trẻ để kỷ luật nói chung. Cách hiệu quả: phản ứng bình tĩnh, dứt khoát ("Không cắn! Cắn làm bạn đau"); dạy MỘT kỹ năng thay thế mỗi lần (ví dụ "đến lượt con") và luyện tập lúc trẻ đang bình tĩnh; tăng giám sát ở các thời điểm nguy cơ cao (tranh đồ chơi, đói/mệt) để can thiệp trước khi xảy ra; khen ngợi hành vi tốt ngay khi xảy ra; phối hợp nhất quán giữa nhà và nhà trẻ cùng một cách xử lý.

## 4. "Con tôi nói lắp/nói ngọng, có phải vấn đề ngôn ngữ không?"
Phần lớn là "rối loạn lưu loát phát triển bình thường", rất phổ biến ở 2-6 tuổi (giai đoạn ngôn ngữ phát triển nhanh) — khoảng **75% trẻ tự hết** mà không cần can thiệp. Bình thường: lặp lại cả từ/cụm từ, dùng từ đệm, ít gắng sức. Cần chú ý: lặp lại ÂM/âm tiết đầu, kéo dài âm, khựng lại kèm biểu hiện gắng sức (chớp mắt, căng cơ miệng, né tránh nói). **Nên đưa đi khám chuyên gia ngôn ngữ nếu:** kéo dài trên 3-6 tháng không cải thiện; bắt đầu sau 3,5 tuổi; có biểu hiện gắng sức/né tránh rõ; có tiền sử gia đình nói lắp. Can thiệp sớm (trước tuổi tiểu học) hiệu quả cao hơn.

## 5. "Con tôi vẫn ngậm ti giả/mút ngón tay lúc 2-3 tuổi, có cần cai không?"
Bình thường dưới 2 tuổi; sau khoảng 2-4 tuổi (Hiệp hội Nha khoa Nhi khoa Hoa Kỳ khuyến nghị mốc cụ thể là **3 tuổi**) nên chủ động cai vì có thể ảnh hưởng hình dạng vòm miệng/khớp cắn — tin tốt là nếu ngừng TRƯỚC khi răng cửa vĩnh viễn mọc, khớp cắn thường tự điều chỉnh lại. Cách cai tích cực (không ép/hù dọa): khen ngợi/thưởng khi không mút (bảng sao, phần thưởng nhỏ); giữ tay/miệng bận rộn bằng hoạt động khác nếu trẻ mút do buồn chán; thiết lập vật thay thế an ủi lúc ngủ (gấu bông, chăn yêu thích); tránh la mắng/chê bai — không hiệu quả và có thể gây tổn thương tâm lý.

## 6. "Con tôi hay ăn vạ dữ dội, có bình thường không, khi nào là bất thường?"
Ăn vạ gần như phổ biến ở MỌI trẻ tuổi tập đi — thường bắt đầu 12-18 tháng, nặng nhất 2-3 tuổi, giảm dần khi 4 tuổi (khi ngôn ngữ đủ để diễn đạt nhu cầu); nghiên cứu ghi nhận ăn vạ hằng ngày là bình thường ở trẻ dưới 3 tuổi, thường kéo dài vài phút đến 15 phút. **Dấu hiệu BẤT THƯỜNG cần đưa đi khám:** cơn ăn vạ kéo dài **trên 25 phút** không tự bình tĩnh lại; có hành vi TỰ LÀM ĐAU bản thân (tự đập đầu, cào cấu) hoặc gây hại nghiêm trọng cho người khác/phá đồ; nín thở đến NGẤT XỈU (cần báo bác sĩ dù phần lớn lành tính); ăn vạ NẶNG LÊN thay vì giảm sau 4 tuổi; kèm dấu hiệu chậm nói/khó khăn kỹ năng xã hội — gợi ý cần đánh giá phát triển toàn diện.`,
    category: "Câu hỏi thường gặp",
    stage: "TODDLER",
    evidenceLevel: "STRONG",
    knowledgeType: scientific,
    sources: [sources.cdcPickyEaters, sources.healthyChildrenPickyEaters, sources.aapNewsPfdIcd10, sources.nhsConstipationChildren, sources.niddkHirschsprung, sources.healthyChildrenAggressiveBehavior, sources.aapEffectiveDiscipline2018Policy, sources.naeycBiting, sources.nidcdStuttering, sources.healthyChildrenStutteringToddlers, sources.healthyChildrenPacifiersThumbSucking, sources.aapdPacifierPolicy, sources.aacapTantrums, sources.johnsHopkinsTantrums],
  },
  {
    slug: "faq-thai-ky-om-nghen-nang-va-tieu-duong-thai-ky",
    title: "Hỏi đáp: Ốm nghén nặng và tiểu đường thai kỳ",
    summary: "Ốm nghén nặng đến mức không giữ được thức ăn/nước uống, sụt trên 5% cân nặng, hoặc có dấu hiệu mất nước (nước tiểu sậm màu/không đi tiểu được, chóng mặt khi đứng) là hyperemesis gravidarum cần khám ngay, khác với ốm nghén thông thường. Tiểu đường thai kỳ được sàng lọc ở tuần 24-28 (sớm hơn nếu nguy cơ cao) bằng nghiệm pháp dung nạp glucose; nếu chẩn đoán, xử lý bằng chế độ ăn/vận động trước, thuốc (metformin rồi insulin) nếu chưa đủ.",
    content: `## "Tôi bị ốm nghén nặng đến mức không ăn uống được gì, có bình thường không, khi nào cần khám?"
**Ốm nghén thông thường:** thỉnh thoảng nôn nhưng vẫn giữ được thức ăn/nước uống phần lớn thời gian trong ngày, vẫn tăng cân, không mất nước.
**Hyperemesis gravidarum (nôn nghén nặng) — dấu hiệu phân biệt:** nôn nhiều lần mỗi ngày, KHÔNG giữ được thức ăn/nước uống, sụt cân trên 5% cân nặng trước mang thai, có ceton/rối loạn điện giải.
**Dấu hiệu mất nước cần khám/cấp cứu ngay:** nước tiểu sậm màu/rất ít hoặc không đi tiểu được; chóng mặt/ngất khi đứng dậy; tim đập nhanh/dồn dập.
**Xử lý theo mức độ (theo ACOG/NHS):** đầu tiên vitamin B6 (pyridoxine) đơn thuần, hoặc kết hợp B6 + doxylamine nếu B6 đơn thuần chưa đủ; tiếp theo có thể dùng thuốc chống nôn (ondansetron thường dùng theo NHS); gừng có bằng chứng tốt hơn giả dược cho thể nhẹ; nếu không giữ được nước, cần truyền dịch tĩnh mạch, có thể cần nhập viện theo dõi trong ca nặng.

## "Làm sao biết mình có bị tiểu đường thai kỳ không, xét nghiệm khi nào, và nếu có thì phải làm gì?"
**Thời điểm sàng lọc:** tất cả phụ nữ mang thai được sàng lọc ở tuần **24-28**; nếu có tiền sử tiểu đường thai kỳ trước hoặc yếu tố nguy cơ cao, xét nghiệm sớm hơn (NHS: có thể từ tuần 16, lặp lại ở tuần 28 nếu lần đầu âm tính).
**Quy trình xét nghiệm (kiểu Mỹ/ACOG, 2 bước):** Bước 1 — uống 50g glucose, không cần nhịn ăn, đo đường huyết sau 1 giờ; nếu bất thường → Bước 2 — nhịn ăn qua đêm, uống 100g glucose, đo đường huyết lúc đói + sau 1-2-3 giờ; cần ÍT NHẤT 2 trong 4 giá trị bất thường mới được chẩn đoán (không phải chỉ 1 giá trị). NHS thường dùng cách đơn giản hơn: nhịn ăn qua đêm, uống 75g glucose, đo lúc đói và sau 2 giờ.
**Nếu được chẩn đoán — xử lý thực tế:** theo dõi đường huyết tại nhà (trước ăn sáng và 1 giờ sau mỗi bữa); ăn đều đặn ~3 bữa/ngày, không bỏ bữa, ưu tiên tinh bột chỉ số đường huyết thấp, ít nhất 5 phần rau củ quả/ngày, thay đồ ngọt/nước ngọt bằng lựa chọn lành mạnh hơn; vận động ít nhất 150 phút/tuần cường độ vừa; nếu chế độ ăn/vận động chưa đủ sau 1-2 tuần, dùng thuốc — metformin (dạng viên) trước, rồi insulin (dạng tiêm) nếu metformin không đủ hiệu quả/không phù hợp. Phần lớn ngừng thuốc sau khi sinh.`,
    category: "Câu hỏi thường gặp",
    stage: "PREGNANCY",
    evidenceLevel: "STRONG",
    knowledgeType: scientific,
    sources: [sources.nhsHyperemesisGuysStThomas, sources.labcorpGdmScreeningAcog, sources.nhsOgttGateshead],
  },
  {
    slug: "faq-hau-san-tap-the-duc-nut-num-vu-ho-tro-tram-cam",
    title: "Hỏi đáp: Tập thể dục, nứt núm vú, hỗ trợ từ gia đình và trầm cảm sau sinh",
    summary: "Sinh thường không biến chứng có thể vận động lại trong vài ngày; sinh mổ cần chờ đánh giá cá nhân, thường 6-8 tuần cho vết mổ lành. Đau khi cho bú kéo dài quá vài tuần đầu là dấu hiệu khớp ngậm sai, không phải bình thường — sửa khớp ngậm quan trọng hơn kem dưỡng. Bảo vệ một khối giấc ngủ liền mạch cho mẹ là hành động hỗ trợ cụ thể có tác động lớn. Baby blues tự hết trong 2 tuần; trầm cảm sau sinh kéo dài hơn/ảnh hưởng chức năng, cần thang đo EPDS và hỗ trợ chuyên môn.",
    content: `## "Sau sinh bao lâu thì có thể tập thể dục/vận động trở lại?"
Theo ACOG (Ý kiến Ủy ban số 804): sinh thường không biến chứng có thể vận động lại trong VÀI NGÀY sau sinh, hoặc ngay khi cảm thấy sẵn sàng — không có thời gian chờ bắt buộc. Bắt đầu nhẹ nhàng (đi bộ, tập thở cơ hoành/sàn chậu) rồi tăng dần. Sinh mổ (hoặc có biến chứng): cần bác sĩ đánh giá riêng, vết mổ thường lành trong 6-8 tuần; trước khi được cho phép chính thức, vận động nhẹ (đi bộ, tập thở, kích hoạt sàn chậu nhẹ) là hợp lý, còn tập luyện cơ bụng có cấu trúc nên chờ đến khi vết mổ lành và được bác sĩ đồng ý (thường ở mốc khám 6 tuần). Tách cơ thẳng bụng (diastasis recti, phổ biến ở cả sinh thường và sinh mổ) thường tự khép lại trong 4-8 tuần — tập cơ bụng quá sớm/mạnh có thể làm nặng thêm, nên hỏi ý kiến vật lý trị liệu sàn chậu nếu không chắc.

## "Tôi bị đau/rát khi cho con bú, núm vú bị nứt, phải làm sao?"
Nguyên tắc cốt lõi (CDC): đau nhẹ trong vài tuần đầu khi núm vú thích nghi là bình thường, NHƯNG cho bú không nên đau khi bé đã ngậm bắt vú tốt — đau kéo dài nghĩa là có gì đó chưa đúng, phổ biến nhất là KHỚP NGẬM. Sửa khớp ngậm là biện pháp hàng đầu: vắt một ít sữa trước khi cho ngậm để kích hoạt phản xạ xuống sữa và làm mềm núm/quầng vú giúp bé ngậm sâu hơn; đảm bảo miệng bé há rộng, ngậm sâu (đây là lúc cần chuyên gia tư vấn sữa mẹ kiểm tra trực tiếp là hữu ích nhất). Về kem lanolin: một tổng quan Cochrane cho thấy bằng chứng CHẤT LƯỢNG THẤP, sữa mẹ vắt ra bôi lên hoặc thậm chí không dùng gì cũng có thể tốt ngang hoặc hơn lanolin trong ngắn hạn — nghĩa là lanolin có thể giúp dịu bề mặt nhưng KHÔNG giải quyết nguyên nhân gốc (khớp ngậm sai). Đau núm vú thường giảm về mức nhẹ sau 7-10 ngày khi khớp ngậm và mô đã thích nghi. Nên tìm hỗ trợ (chuyên gia tư vấn sữa mẹ/bác sĩ) nếu: da nứt/tổn thương rõ, đau không cải thiện sau 1-2 tuần, hoặc đau kèm sốt (nghi viêm vú).

## "Chồng/gia đình có thể làm gì để hỗ trợ mẹ sau sinh tốt nhất?"
Bằng chứng nghiên cứu (không phải một hướng dẫn lâm sàng chính thức từ ACOG/WHO, mà tổng hợp từ nhiều nghiên cứu bình duyệt) cho thấy các hành động cụ thể sau có tác động thật:
1. **Bảo vệ MỘT khối giấc ngủ liền mạch cho mẹ** (3-4 giờ không bị gián đoạn) — có thể là hành động cụ thể quan trọng nhất: người hỗ trợ đưa bé sang phòng khác trong một khoảng thời gian, hoặc nhận ca đêm hoàn toàn nếu bé bú bình.
2. **Hỗ trợ thực tế kéo dài, không chỉ tuần đầu** — nấu ăn/dọn dẹp/chăm bé duy trì trong nhiều tuần có liên quan đến sức khỏe tâm thần mẹ tốt hơn so với hỗ trợ giảm dần sau vài ngày.
3. Đáp ứng nhu cầu cơ bản: mang đồ ăn/nước uống, trông bé để mẹ tắm rửa.
4. Thể hiện sự ấm áp, đồng cảm, không phán xét — mẹ đánh giá điều này quan trọng hơn cả việc làm cụ thể nào.
Điều ít hiệu quả hơn: hỗ trợ chỉ tập trung tuần đầu rồi giảm dần; chỉ đưa lời khuyên mà thiếu sự ấm áp/đồng cảm đi kèm.

## "Làm sao biết mình bị trầm cảm sau sinh (PPD) hay chỉ là 'baby blues' bình thường?"
**Baby blues:** xuất hiện 3-4 ngày sau sinh; hay khóc, thay đổi tâm trạng, cáu gắt, lo âu, mệt mỏi; TỰ HẾT trong 1-2 TUẦN mà không cần điều trị; KHÔNG ảnh hưởng khả năng chăm sóc bản thân/bé.
**Trầm cảm sau sinh (PPD):** thường xuất hiện 1-3 tuần sau sinh nhưng có thể xảy ra bất kỳ lúc nào trong năm đầu; triệu chứng kéo dài HƠN 2 TUẦN và nặng hơn — buồn bã kéo dài, khó khăn trong sinh hoạt/chăm bé, lo âu, suy nghĩ tiêu cực; KHÔNG tự hết như baby blues, cần đánh giá/điều trị chuyên môn.
**Quy tắc thực tế cho cha mẹ:** nếu buồn bã/lo âu vẫn còn và ảnh hưởng sinh hoạt hằng ngày SAU 2 TUẦN kể từ sinh, hoặc xuất hiện/nặng hơn muộn hơn (thay vì giảm dần) — đây là tín hiệu cần tầm soát chuyên môn, không chỉ "chờ thêm".
**Công cụ sàng lọc — Thang đo Trầm cảm sau sinh Edinburgh (EPDS):** bảng câu hỏi tự đánh giá 10 mục, dùng bởi bác sĩ sản/nhi để sàng lọc (không tự chẩn đoán) — ngưỡng điểm dương tính thường ≥10, một số nơi dùng ≥13 để đánh dấu khả năng trầm cảm nặng hơn; điểm dương tính nên dẫn đến đánh giá lâm sàng đầy đủ, không phải tự kết luận.
**Cấp cứu tâm thần cần phân biệt riêng:** bất kỳ suy nghĩ tự hại hoặc làm hại bé nào đều là tình huống khẩn cấp, cần liên hệ y tế ngay lập tức — khác với cả baby blues và PPD thông thường.`,
    category: "Câu hỏi thường gặp",
    stage: "POSTPARTUM",
    evidenceLevel: "STRONG",
    knowledgeType: scientific,
    sources: [sources.acogExerciseCommitteeOpinion804, sources.cdcBreastfeedingWhatToExpect, sources.cochraneLanolinNipple, sources.pmcPartnerSupportPPDSystematicReview, sources.natureSocialSupportPPD, sources.merckManualPPD, sources.mdcalcEPDS],
  },
  {
    slug: "faq-nha-tre-om-co-nen-di-hoc-anh-chi-em-di-xa-cung-be",
    title: "Hỏi đáp: Nhà trẻ, ốm có nên đi học, anh chị em và đi xa cùng bé",
    summary: "Không có \"độ tuổi lý tưởng\" đi nhà trẻ được y khoa xác định — gắn kết mẹ-con phụ thuộc vào chất lượng chăm sóc, không phải tuổi bắt đầu; đi nhà trẻ trước 2,5 tuổi làm tăng ốm vặt trong giai đoạn đó nhưng lại giảm ốm khi vào tiểu học. Sốt kèm triệu chứng toàn thân nên nghỉ học; sổ mũi/ho nhẹ không sốt có thể đi học. Bảo vệ thời gian riêng với con lớn khi có em, tránh luôn bênh vực em nhỏ khi tranh giành. Trẻ khỏe mạnh đủ tháng có thể bay từ khoảng 2-3 tháng tuổi; cho bú/ngậm ti giả lúc cất/hạ cánh để cân bằng áp suất tai.",
    content: `## "Nên cho bé đi nhà trẻ từ mấy tháng tuổi thì tốt?"
Không có một "độ tuổi lý tưởng" duy nhất được y khoa xác nhận — bằng chứng chia thành các hướng khác nhau:
- **Về gắn kết**: nghiên cứu đoàn hệ lớn nhất về chủ đề này (NICHD, Hoa Kỳ, hơn 1.150 cặp mẹ-con) KHÔNG thấy tuổi bắt đầu đi nhà trẻ ảnh hưởng đến độ an toàn gắn kết mẹ-con ở 15 tháng tuổi — điều thực sự quan trọng là ĐỘ NHẠY CẢM CỦA MẸ và CHẤT LƯỢNG chăm sóc, không phải tuổi bắt đầu.
- **Về ốm vặt**: đi nhà trẻ nhóm đông trước khoảng 2,5 tuổi làm tăng rõ rệt số lần ốm hô hấp/viêm tai trong giai đoạn đó, nhưng lại giúp trẻ ÍT ỐM HƠN khi vào tiểu học — một sự đánh đổi ốm sớm/miễn dịch sau này có thật. Bắt đầu trong năm đầu đời (đặc biệt 6-12 tháng) liên quan đến nhiễm trùng hô hấp/viêm tai sớm và thường xuyên hơn.
- **Tại Việt Nam**: nghỉ thai sản 6 tháng nhưng nhiều nhóm trẻ/trường mầm non ít nhận trẻ 6-18 tháng — đây là khoảng trống về NGUỒN CUNG/kinh tế, không phải bằng chứng y khoa cho rằng 6 tháng là tuổi lý tưởng.

## "Con bị ốm nhẹ (sốt nhẹ/ho/sổ mũi) có nên cho đi học/nhà trẻ không?"
Sổ mũi/ho nhẹ KHÔNG kèm sốt, bé vẫn đủ khỏe tham gia hoạt động bình thường: CÓ THỂ đi học. Sốt từ 38-38,3°C trở lên KÈM triệu chứng toàn thân khác (mệt mỏi, biếng ăn, thay đổi hành vi): NÊN NGHỈ Ở NHÀ. Quay lại khi hết sốt 24 giờ mà không cần dùng thuốc hạ sốt. Nghỉ ngay lập tức nếu: nôn từ 2 lần/24h trở lên, tiêu chảy (từ 3 lần phân lỏng/24h hoặc có máu), phát ban kèm sốt, mắt đỏ có ghèn/dử. **Nguyên tắc thực chất** (theo tiêu chuẩn "Caring for Our Children" dựa trên bằng chứng): bản thân sốt ít liên quan đến khả năng lây bệnh — tiêu chí thực sự là bé có đủ khả năng tham gia hoạt động bình thường và nhân viên có thể chăm sóc bé mà không ảnh hưởng chăm sóc các trẻ khác hay không, chứ không phải một con số nhiệt độ cứng nhắc.

## "Làm sao chuẩn bị tâm lý cho con lớn khi sắp có em bé?"
Trước khi sinh: nói chuyện cụ thể về em bé, giao cho con lớn một "vai trò" cụ thể (người giúp đỡ) thay vì chỉ trấn an chung chung; cho con tham gia chuẩn bị (chọn tên, chọn đồ cho em); hạn chế thay đổi lớn khác cùng lúc (không nên vừa có em vừa đi nhà trẻ mới/cai bỉm cùng thời điểm) để giảm nguy cơ "thoái lui" hành vi.
Sau khi sinh: bảo vệ thời gian riêng 1-1 với con lớn (nhờ người thân hỗ trợ); công nhận/gọi tên cảm xúc ghen tị/tức giận của con là bình thường thay vì dập tắt; TRÁNH luôn đứng về phía em nhỏ khi hai anh chị em tranh giành — nghiên cứu ghi nhận khi mẹ thường xuyên bênh vực em nhỏ hơn, anh/chị em sau đó chơi với nhau ÍT hơn, phản tác dụng với việc xây dựng quan hệ; khen ngợi cụ thể khi các con chơi/hợp tác tốt với nhau.

## "Con nhỏ hay bị anh/chị lớn tranh giành/bắt chước hành vi xấu, xử lý sao cho công bằng?"
Bằng chứng cho thấy CẢ hai thái cực đều không hiệu quả: để mặc trẻ tự giải quyết (xung đột có xu hướng tiếp diễn/nặng hơn, đặc biệt bất lợi cho em nhỏ hơn) và cha mẹ áp đặt giải pháp thay con (ngăn trẻ học kỹ năng tự giải quyết xung đột). Cách hiệu quả — LÀM TRUNG GIAN CHỦ ĐỘNG (hướng dẫn, không áp đặt): giúp mỗi bé nói ra góc nhìn của mình và cùng tìm giải pháp; một phân tích gộp các chương trình tập huấn cha mẹ dạng này cho thấy hiệu quả LỚN (mức ảnh hưởng d=0,85) trong việc cải thiện quan hệ anh chị em. Không nên mặc định luôn bênh em nhỏ hơn (xem mục trên). Khen ngợi cụ thể hành vi hợp tác/chia sẻ là một trong những biện pháp hiệu quả, chi phí thấp nhất. Việc em nhỏ bắt chước hành vi (tốt lẫn xấu) của anh/chị là hiện tượng phát triển bình thường, không phải dấu hiệu nuôi dạy sai — hướng xử lý vẫn là làm trung gian + khen ngợi như trên, không phải cố loại bỏ hoàn toàn việc bắt chước (điều không thực tế khi sống chung nhà).

## "Đi máy bay/di chuyển xa với trẻ sơ sinh/trẻ nhỏ cần lưu ý gì?"
**Tuổi tối thiểu**: không khuyến khích bay trước 7 ngày tuổi; phần lớn khuyến nghị chờ đến khoảng **2-3 tháng** cho chuyến bay không cấp thiết/đường dài, chủ yếu để giảm nguy cơ tiếp xúc bệnh hô hấp (không phải vì rào cản y khoa cứng với trẻ đủ tháng khỏe mạnh). Khoang máy bay áp suất tương đương độ cao 5.000-8.000 feet (oxy thấp nhẹ hơn mặt đất) — trẻ đủ tháng khỏe mạnh thường chịu đựng tốt; cần thận trọng thêm với trẻ dưới 6 tuần, và trẻ sinh non/có bệnh tim-phổi cần bác sĩ đồng ý trước khi bay vì nhạy cảm hơn với oxy thấp.
**Cân bằng áp suất tai lúc cất/hạ cánh**: trẻ chưa thể tự cân bằng áp suất tai theo ý muốn (không biết ngáp/nuốt theo lệnh) — biện pháp hiệu quả nhất là cho bú mẹ/bú bình/ngậm ti giả ĐÚNG LÚC máy bay đang cất/hạ cánh (không chỉ cho ăn trước đó).
**An toàn**: nên dùng ghế an toàn ô tô được FAA phê duyệt, cố định trên ghế máy bay riêng cho bé thay vì bế trên đùi, dù nhiều hãng vẫn cho phép bế trẻ dưới độ tuổi nhất định.
**Tiêm chủng khi đi quốc tế**: với trẻ đi nước ngoài, vắc-xin MMR và viêm gan A có thể tiêm SỚM từ 6-11 tháng (trước lịch thường quy 12 tháng) — nhưng các mũi tiêm sớm này KHÔNG được tính vào loạt mũi chính thức, trẻ vẫn cần tiêm đủ theo lịch chuẩn sau đó.`,
    category: "Câu hỏi thường gặp",
    stage: "TODDLER",
    evidenceLevel: "MODERATE",
    knowledgeType: scientific,
    sources: [sources.nichdEarlyChildCareStudy, sources.cfocIllnessExclusionStandard, sources.sawicki1997SiblingPrep, sources.aapMediaScreenFreeMealtimes, sources.cdcYellowBookTravelVaccine, sources.healthyChildrenAirTravelInfant],
  },
];
