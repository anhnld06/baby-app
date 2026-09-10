export type VaccineProgram = "free" | "paid";
export type VaccineTier = "core" | "supplementary";

export type MotherScheduleEntry = {
  key: string;
  label: string;
  matchNames: string[];
  doseNumber: number;
  dueByWeek: number;
  program: VaccineProgram;
  tier: VaccineTier;
  priceRangeVnd?: string;
  note?: string;
};

export type BabyScheduleEntry = {
  key: string;
  label: string;
  matchNames: string[];
  doseNumber: number;
  dueAgeDays: number;
  program: VaccineProgram;
  tier: VaccineTier;
  priceRangeVnd?: string;
  note?: string;
};

// Reference schedule only — general public-health guidance for Vietnam
// (Tiêm chủng mở rộng / TCMR core schedule, cross-checked against the
// national free-program status as of 2026, plus the most commonly offered
// paid "dịch vụ" vaccines), not a personalized medical order. Always defer
// to the attending doctor's/clinic's actual schedule.
//
// `program`: "free" = included in Vietnam's national TCMR program at no
// charge nationwide (a few items — pneumococcal, HPV — are only free in a
// phased pilot in a handful of provinces as of 2026 and remain paid
// elsewhere; this is called out per-entry in `note`).
// `tier`: "core" = recommended for essentially all children (WHO/AAP-type
// universal recommendation), "supplementary" = recommended based on
// individual/regional risk, season, or family circumstance rather than as a
// blanket universal requirement — NOT the same as "unnecessary".
// `priceRangeVnd`: indicative per-dose price range at a major Vietnamese
// vaccination chain (VNVC), checked 2026-09; prices vary by clinic/promotion
// and change over time — always confirm current price at the vaccination
// facility before deciding, never treat this as a quote.
export const MOTHER_PRENATAL_SCHEDULE: MotherScheduleEntry[] = [
  {
    key: "tetanus-1",
    label: "Uốn ván (VAT) - mũi 1",
    matchNames: ["uốn ván", "vat"],
    doseNumber: 1,
    dueByWeek: 20,
    program: "free",
    tier: "core",
    note: "TCMR khuyến nghị tiêm càng sớm càng tốt khi phát hiện có thai, không bắt buộc đúng tuần 20 — đây chỉ là mốc tham khảo.",
  },
  {
    key: "tetanus-2",
    label: "Uốn ván (VAT) - mũi 2",
    matchNames: ["uốn ván", "vat"],
    doseNumber: 2,
    dueByWeek: 24,
    program: "free",
    tier: "core",
    note: "Cách mũi 1 ít nhất 1 tháng và trước ngày dự sinh ít nhất 1 tháng — mốc tuần 24 chỉ là ước lượng.",
  },
];

export const BABY_SCHEDULE: BabyScheduleEntry[] = [
  // ---- TCMR miễn phí (khuyến nghị cho mọi trẻ) ----
  {
    key: "hepb-birth",
    label: "Viêm gan B (sơ sinh)",
    matchNames: ["viêm gan b", "hepb", "hep b"],
    doseNumber: 1,
    dueAgeDays: 0,
    program: "free",
    tier: "core",
  },
  {
    key: "bcg",
    label: "BCG (lao)",
    matchNames: ["bcg", "lao"],
    doseNumber: 1,
    dueAgeDays: 0,
    program: "free",
    tier: "core",
  },
  {
    key: "5in1-1",
    label: "5 trong 1 / 6 trong 1 - mũi 1",
    matchNames: ["5 trong 1", "6 trong 1", "combe five", "hexaxim", "infanrix hexa", "quinvaxem", "pentaxim"],
    doseNumber: 1,
    dueAgeDays: 60,
    program: "free",
    tier: "core",
    note: "Miễn phí ở dạng 5 trong 1 (TCMR); 6 trong 1 là lựa chọn dịch vụ tương đương (có IPV tiêm thay OPV uống).",
  },
  {
    key: "polio-1",
    label: "Bại liệt uống (OPV) - mũi 1",
    matchNames: ["bại liệt", "opv", "polio"],
    doseNumber: 1,
    dueAgeDays: 60,
    program: "free",
    tier: "core",
  },
  {
    key: "5in1-2",
    label: "5 trong 1 / 6 trong 1 - mũi 2",
    matchNames: ["5 trong 1", "6 trong 1", "combe five", "hexaxim", "infanrix hexa", "quinvaxem", "pentaxim"],
    doseNumber: 2,
    dueAgeDays: 90,
    program: "free",
    tier: "core",
  },
  {
    key: "polio-2",
    label: "Bại liệt uống (OPV) - mũi 2",
    matchNames: ["bại liệt", "opv", "polio"],
    doseNumber: 2,
    dueAgeDays: 90,
    program: "free",
    tier: "core",
  },
  {
    key: "5in1-3",
    label: "5 trong 1 / 6 trong 1 - mũi 3",
    matchNames: ["5 trong 1", "6 trong 1", "combe five", "hexaxim", "infanrix hexa", "quinvaxem", "pentaxim"],
    doseNumber: 3,
    dueAgeDays: 120,
    program: "free",
    tier: "core",
  },
  {
    key: "polio-3",
    label: "Bại liệt uống (OPV) - mũi 3",
    matchNames: ["bại liệt", "opv", "polio"],
    doseNumber: 3,
    dueAgeDays: 120,
    program: "free",
    tier: "core",
  },
  {
    key: "polio-ipv",
    label: "Bại liệt tiêm (IPV) - mũi bổ sung",
    matchNames: ["bại liệt", "ipv", "opv", "polio"],
    doseNumber: 4,
    dueAgeDays: 150,
    program: "free",
    tier: "core",
    note: "Mũi tiêm bổ sung bên cạnh 3 mũi OPV uống, theo lịch TCMR hiện hành (khoảng 5 tháng tuổi).",
  },
  {
    key: "measles-1",
    label: "Sởi - mũi 1",
    matchNames: ["sởi đơn", "sởi -", "measles"],
    doseNumber: 1,
    dueAgeDays: 270,
    program: "free",
    tier: "core",
  },
  {
    key: "5in1-booster",
    label: "5 trong 1 / 6 trong 1 - nhắc lại",
    matchNames: ["5 trong 1", "6 trong 1", "combe five", "hexaxim", "infanrix hexa", "quinvaxem", "pentaxim"],
    doseNumber: 4,
    dueAgeDays: 540,
    program: "free",
    tier: "core",
  },
  {
    key: "mr-booster",
    label: "Sởi - Rubella (MR) - nhắc lại",
    matchNames: ["rubella", "mr ", "sởi - rubella", "sởi-rubella"],
    doseNumber: 1,
    dueAgeDays: 540,
    program: "free",
    tier: "core",
    note: "Lịch TCMR Việt Nam dùng Sởi-Rubella (MR), KHÔNG có thành phần quai bị — vắc-xin MMR (có quai bị) là lựa chọn dịch vụ riêng, không nằm trong mũi nhắc 18 tháng miễn phí.",
  },
  {
    key: "je-1",
    label: "Viêm não Nhật Bản - mũi 1",
    matchNames: ["viêm não nhật bản", "vnnb", "jevax", "je "],
    doseNumber: 1,
    dueAgeDays: 360,
    program: "free",
    tier: "core",
  },
  {
    key: "je-2",
    label: "Viêm não Nhật Bản - mũi 2",
    matchNames: ["viêm não nhật bản", "vnnb", "jevax", "je "],
    doseNumber: 2,
    dueAgeDays: 374,
    program: "free",
    tier: "core",
    note: "Cách mũi 1 khoảng 1-2 tuần.",
  },
  {
    key: "je-3",
    label: "Viêm não Nhật Bản - mũi 3",
    matchNames: ["viêm não nhật bản", "vnnb", "jevax", "je "],
    doseNumber: 3,
    dueAgeDays: 730,
    program: "free",
    tier: "core",
    note: "Khoảng 1 năm sau mũi 2; sau đó nhắc lại mỗi 3 năm đến 15 tuổi.",
  },
  {
    key: "rotavirus-1",
    label: "Rota (tiêu chảy do Rotavirus) - liều 1",
    matchNames: ["rota", "rotarix", "rotateq"],
    doseNumber: 1,
    dueAgeDays: 60,
    program: "free",
    tier: "core",
    note: "Đã đưa vào TCMR miễn phí toàn quốc từ 2026; uống, không phải tiêm.",
  },
  {
    key: "rotavirus-2",
    label: "Rota (tiêu chảy do Rotavirus) - liều 2",
    matchNames: ["rota", "rotarix", "rotateq"],
    doseNumber: 2,
    dueAgeDays: 90,
    program: "free",
    tier: "core",
  },

  // ---- Dịch vụ (trả phí) — bổ sung theo nguy cơ/điều kiện gia đình ----
  {
    key: "pneumococcal-1",
    label: "Phế cầu - mũi 1",
    matchNames: ["phế cầu", "synflorix", "prevenar"],
    doseNumber: 1,
    dueAgeDays: 60,
    program: "paid",
    tier: "core",
    priceRangeVnd: "~1.045.000 - 1.190.000 đ/mũi (Synflorix/Prevenar 13, giá VNVC 09/2026)",
    note: "WHO xếp vào nhóm khuyến nghị cho mọi trẻ; tại Việt Nam mới miễn phí thí điểm ở một số tỉnh, còn lại vẫn là dịch vụ trả phí.",
  },
  {
    key: "pneumococcal-2",
    label: "Phế cầu - mũi 2",
    matchNames: ["phế cầu", "synflorix", "prevenar"],
    doseNumber: 2,
    dueAgeDays: 90,
    program: "paid",
    tier: "core",
    priceRangeVnd: "~1.045.000 - 1.190.000 đ/mũi",
  },
  {
    key: "pneumococcal-3",
    label: "Phế cầu - mũi 3",
    matchNames: ["phế cầu", "synflorix", "prevenar"],
    doseNumber: 3,
    dueAgeDays: 120,
    program: "paid",
    tier: "core",
    priceRangeVnd: "~1.045.000 - 1.190.000 đ/mũi",
  },
  {
    key: "pneumococcal-booster",
    label: "Phế cầu - nhắc lại",
    matchNames: ["phế cầu", "synflorix", "prevenar"],
    doseNumber: 4,
    dueAgeDays: 365,
    program: "paid",
    tier: "core",
    priceRangeVnd: "~1.045.000 - 1.190.000 đ/mũi",
  },
  {
    key: "meningo-bc-1",
    label: "Não mô cầu B+C - mũi 1",
    matchNames: ["não mô cầu", "mengoc", "va-mengoc"],
    doseNumber: 1,
    dueAgeDays: 180,
    program: "paid",
    tier: "supplementary",
    priceRangeVnd: "~396.000 đ/mũi (VA-Mengoc-BC, giá VNVC 09/2026)",
    note: "Khuyến nghị theo nguy cơ dịch tễ khu vực, không phải mũi bắt buộc; còn có các nhóm ACWY (Nimenrix/MenQuadfi) và nhóm B (Bexsero) giá cao hơn (~1,75-1,95 triệu đ/mũi) tùy nhu cầu.",
  },
  {
    key: "meningo-bc-2",
    label: "Não mô cầu B+C - mũi 2",
    matchNames: ["não mô cầu", "mengoc", "va-mengoc"],
    doseNumber: 2,
    dueAgeDays: 225,
    program: "paid",
    tier: "supplementary",
    priceRangeVnd: "~396.000 đ/mũi",
    note: "Cách mũi 1 khoảng 45 ngày.",
  },
  {
    key: "flu-1",
    label: "Cúm mùa - mũi đầu tiên",
    matchNames: ["cúm mùa", "cúm", "vaxigrip", "influvac"],
    doseNumber: 1,
    dueAgeDays: 180,
    program: "paid",
    tier: "supplementary",
    priceRangeVnd: "~329.000 - 356.000 đ/mũi (giá dao động theo đợt khuyến mãi)",
    note: "Nếu là lần đầu tiêm cho trẻ 6 tháng-dưới 9 tuổi cần thêm mũi 2 cách 1 tháng, sau đó nhắc lại 1 mũi mỗi năm — hệ thống này chỉ nhắc mũi đầu tiên, cần tự theo dõi lịch nhắc hằng năm.",
  },
  {
    key: "varicella-1",
    label: "Thủy đậu - mũi 1",
    matchNames: ["thủy đậu", "varivax", "varilrix"],
    doseNumber: 1,
    dueAgeDays: 365,
    program: "paid",
    tier: "supplementary",
    priceRangeVnd: "~1.118.000 - 1.138.000 đ/mũi (Varivax/Varilrix, giá VNVC 09/2026)",
    note: "Varilrix có thể bắt đầu từ 9 tháng tuổi; Varivax khuyến nghị từ 12 tháng.",
  },
  {
    key: "varicella-2",
    label: "Thủy đậu - mũi 2",
    matchNames: ["thủy đậu", "varivax", "varilrix"],
    doseNumber: 2,
    dueAgeDays: 455,
    program: "paid",
    tier: "supplementary",
    priceRangeVnd: "~1.118.000 - 1.138.000 đ/mũi",
    note: "Khoảng cách mũi 2 tùy sản phẩm (khoảng 3 tháng sau mũi 1) — xác nhận lại với cơ sở tiêm chủng.",
  },
  {
    key: "hepa-1",
    label: "Viêm gan A - mũi 1",
    matchNames: ["viêm gan a", "avaxim", "havax"],
    doseNumber: 1,
    dueAgeDays: 365,
    program: "paid",
    tier: "supplementary",
    priceRangeVnd: "~295.000 - 685.000 đ/mũi (Havax/Avaxim 80U, giá VNVC 09/2026)",
  },
  {
    key: "hepa-2",
    label: "Viêm gan A - mũi 2",
    matchNames: ["viêm gan a", "avaxim", "havax"],
    doseNumber: 2,
    dueAgeDays: 730,
    program: "paid",
    tier: "supplementary",
    priceRangeVnd: "~295.000 - 685.000 đ/mũi",
    note: "Khoảng cách giữa 2 mũi dao động 6-36 tháng tùy sản phẩm — xác nhận lại với cơ sở tiêm chủng.",
  },
];
