export type VaccineProgram = "free" | "paid";
export type VaccineTier = "core" | "supplementary";

export type MotherScheduleEntry = {
  key: string;
  label: string;
  matchNames: string[];
  doseNumber: number;
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
  dueAgeMonths?: number;
  offsetDays?: number;
  /** The dose must be given before this age (calendar months), e.g. rotavirus. */
  completeBeforeAgeMonths?: number;
  program: VaccineProgram;
  tier: VaccineTier;
  priceRangeVnd?: string;
  note?: string;
};

// TCMR milestones checked 2026-11-02 against NIHE:
// https://nihe.org.vn/chuyen-mon/tiem-chung-vac-xin/cac-vac-xin-trong-tiem-chung-mo-rong/
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
    program: "free",
    tier: "core",
    note: "TCMR khuyến nghị tiêm càng sớm càng tốt khi phát hiện có thai; số mũi tùy tiền sử tiêm.",
  },
  {
    key: "tetanus-2",
    label: "Uốn ván (VAT) - mũi 2",
    matchNames: ["uốn ván", "vat"],
    doseNumber: 2,
    program: "free",
    tier: "core",
    note: "Cách mũi 1 ít nhất 1 tháng và tiêm xong trước ngày dự sinh ít nhất 1 tháng (NIHE).",
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
    dueAgeMonths: 0,
    program: "free",
    tier: "core",
  },
  {
    key: "bcg",
    label: "BCG (lao)",
    matchNames: ["bcg", "lao"],
    doseNumber: 1,
    dueAgeDays: 0,
    dueAgeMonths: 0,
    program: "free",
    tier: "core",
  },
  {
    key: "5in1-1",
    label: "5 trong 1 / 6 trong 1 - mũi 1",
    matchNames: ["5 trong 1", "6 trong 1", "combe five", "hexaxim", "infanrix hexa", "quinvaxem", "pentaxim"],
    doseNumber: 1,
    dueAgeDays: 60,
    dueAgeMonths: 2,
    program: "free",
    tier: "core",
    note: "Miễn phí ở dạng 5 trong 1 (TCMR); 6 trong 1 là lựa chọn dịch vụ tương đương (có thành phần IPV; lịch bại liệt cần đối chiếu riêng với cơ sở tiêm).",
  },
  {
    key: "polio-1",
    label: "Bại liệt uống (OPV) - mũi 1",
    matchNames: ["bại liệt uống", "opv"],
    doseNumber: 1,
    dueAgeDays: 60,
    dueAgeMonths: 2,
    program: "free",
    tier: "core",
  },
  {
    key: "5in1-2",
    label: "5 trong 1 / 6 trong 1 - mũi 2",
    matchNames: ["5 trong 1", "6 trong 1", "combe five", "hexaxim", "infanrix hexa", "quinvaxem", "pentaxim"],
    doseNumber: 2,
    dueAgeDays: 90,
    dueAgeMonths: 3,
    program: "free",
    tier: "core",
  },
  {
    key: "polio-2",
    label: "Bại liệt uống (OPV) - mũi 2",
    matchNames: ["bại liệt uống", "opv"],
    doseNumber: 2,
    dueAgeDays: 90,
    dueAgeMonths: 3,
    program: "free",
    tier: "core",
  },
  {
    key: "5in1-3",
    label: "5 trong 1 / 6 trong 1 - mũi 3",
    matchNames: ["5 trong 1", "6 trong 1", "combe five", "hexaxim", "infanrix hexa", "quinvaxem", "pentaxim"],
    doseNumber: 3,
    dueAgeDays: 120,
    dueAgeMonths: 4,
    program: "free",
    tier: "core",
  },
  {
    key: "polio-3",
    label: "Bại liệt uống (OPV) - mũi 3",
    matchNames: ["bại liệt uống", "opv"],
    doseNumber: 3,
    dueAgeDays: 120,
    dueAgeMonths: 4,
    program: "free",
    tier: "core",
  },
  {
    key: "polio-ipv",
    label: "Bại liệt tiêm (IPV) - mũi 1",
    matchNames: ["bại liệt tiêm", "ipv", "imovax"],
    doseNumber: 1,
    dueAgeDays: 150,
    dueAgeMonths: 5,
    program: "free",
    tier: "core",
    note: "Mũi tiêm bổ sung bên cạnh 3 mũi OPV uống, theo lịch TCMR hiện hành (khoảng 5 tháng tuổi).",
  },
  {
    key: "polio-ipv-2",
    label: "Bại liệt tiêm (IPV) - mũi 2",
    matchNames: ["bại liệt tiêm", "ipv", "imovax"],
    doseNumber: 2,
    dueAgeDays: 270,
    dueAgeMonths: 9,
    program: "free",
    tier: "core",
  },
  {
    key: "measles-1",
    label: "Sởi - mũi 1",
    matchNames: ["sởi đơn", "sởi -", "measles"],
    doseNumber: 1,
    dueAgeDays: 270,
    dueAgeMonths: 9,
    program: "free",
    tier: "core",
  },
  {
    key: "5in1-booster",
    label: "Bạch hầu - ho gà - uốn ván (DPT) - nhắc lại",
    matchNames: ["dpt", "bạch hầu - ho gà - uốn ván", "5 trong 1", "6 trong 1", "combe five", "hexaxim", "infanrix hexa", "quinvaxem", "pentaxim"],
    doseNumber: 4,
    dueAgeDays: 540,
    dueAgeMonths: 18,
    program: "free",
    tier: "core",
    note: "Mốc TCMR là DPT lúc 18 tháng. Nếu dùng vắc-xin phối hợp dịch vụ, đối chiếu lịch cơ sở tiêm.",
  },
  {
    key: "mr-booster",
    label: "Sởi - Rubella (MR) - nhắc lại",
    matchNames: ["rubella", "mr ", "sởi - rubella", "sởi-rubella"],
    doseNumber: 1,
    dueAgeDays: 540,
    dueAgeMonths: 18,
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
    dueAgeMonths: 12,
    program: "free",
    tier: "core",
  },
  {
    key: "je-2",
    label: "Viêm não Nhật Bản - mũi 2",
    matchNames: ["viêm não nhật bản", "vnnb", "jevax", "je "],
    doseNumber: 2,
    dueAgeDays: 374,
    dueAgeMonths: 12,
    offsetDays: 14,
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
    dueAgeMonths: 24,
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
    dueAgeMonths: 2,
    completeBeforeAgeMonths: 6,
    program: "free",
    tier: "core",
    note: "Đã đưa vào TCMR miễn phí toàn quốc từ 2026; uống, không phải tiêm. Phải uống xong trước 6 tháng tuổi (NIHE; Rotarix: trước 24 tuần tuổi).",
  },
  {
    key: "rotavirus-2",
    label: "Rota (tiêu chảy do Rotavirus) - liều 2",
    matchNames: ["rota", "rotarix", "rotateq"],
    doseNumber: 2,
    dueAgeDays: 90,
    dueAgeMonths: 3,
    completeBeforeAgeMonths: 6,
    program: "free",
    tier: "core",
  },

  {
    key: "td-7-years",
    label: "Uốn ván - bạch hầu (Td) - nhắc lại",
    matchNames: ["uốn ván - bạch hầu", "td"],
    doseNumber: 1,
    dueAgeDays: 2555,
    dueAgeMonths: 84,
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
    dueAgeMonths: 2,
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
    dueAgeMonths: 3,
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
    dueAgeMonths: 4,
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
    dueAgeMonths: 12,
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
    dueAgeMonths: 6,
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
    dueAgeMonths: 7,
    offsetDays: 15,
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
    dueAgeMonths: 6,
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
    dueAgeMonths: 12,
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
    dueAgeMonths: 15,
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
    dueAgeMonths: 12,
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
    dueAgeMonths: 24,
    program: "paid",
    tier: "supplementary",
    priceRangeVnd: "~295.000 - 685.000 đ/mũi",
    note: "Khoảng cách giữa 2 mũi dao động 6-36 tháng tùy sản phẩm — xác nhận lại với cơ sở tiêm chủng.",
  },
];

/** A calendar span: `months` are calendar months (clamped to month end), then `days`. */
export type Span = { months?: number; days?: number };

/**
 * Spacing between a dose and the previous dose of the same series.
 * `recommended` drives the "Dự kiến" date shown to parents; `min` is the
 * earliest valid date ("sớm nhất") and is only shown as detail. Late doses
 * never restart a series. Values are reference guidance, not a medical order.
 */
export type DoseInterval = {
  /** Schedule key of the previous dose. */
  after: string;
  min: Span;
  recommended: Span;
  /** URL(s) the values come from. */
  source: string;
  /** Shown when the spacing depends on the product actually used. */
  confirm?: string;
};

const CDC_INTERVALS =
  "https://www.cdc.gov/vaccines/hcp/acip-recs/general-recs/timing.html"; // ACIP General Best Practice, Table 3-2 "Recommended and minimum ages and intervals between vaccine doses"
const NIHE_TCMR =
  "https://nihe.org.vn/chuyen-mon/tiem-chung-vac-xin/cac-vac-xin-trong-tiem-chung-mo-rong/";
const WHO_POLIO_2022 = "https://www.who.int/publications/i/item/who-wer9725-277-300";
const WHO_TETANUS_2017 = "https://www.who.int/publications/i/item/WER9206";
const CONFIRM = "Khoảng cách tùy sản phẩm — xác nhận với cơ sở tiêm.";

// Only series with a sourced interval are listed. Deliberately left out (age
// milestone only): meningococcal B+C (no WHO/CDC/NIHE interval found),
// measles → MR (different products; MR at 18 months never binds), HepB birth
// dose → 5-in-1, and single-dose entries (BCG, flu, Td).
export const BABY_DOSE_INTERVALS: Record<string, DoseInterval> = {
  // DTaP-1→2, 2→3: minimum 4 weeks (CDC Table 3-2; WHO tetanus 2017 "minimum interval of 4 weeks");
  // TCMR gives the doses 1 month apart (2, 3, 4 months, NIHE).
  "5in1-2": { after: "5in1-1", min: { days: 28 }, recommended: { months: 1 }, source: `${CDC_INTERVALS} ; ${NIHE_TCMR}` },
  "5in1-3": { after: "5in1-2", min: { days: 28 }, recommended: { months: 1 }, source: `${CDC_INTERVALS} ; ${NIHE_TCMR}` },
  // DTaP-3→4: minimum 6 months (CDC Table 3-2, footnote f). The 18-month TCMR milestone normally wins.
  "5in1-booster": { after: "5in1-3", min: { months: 6 }, recommended: { months: 6 }, source: CDC_INTERVALS },
  // bOPV 1→2→3: 4 weeks (WHO polio position paper 2022); TCMR 2, 3, 4 months (NIHE).
  "polio-2": { after: "polio-1", min: { days: 28 }, recommended: { months: 1 }, source: `${WHO_POLIO_2022} ; ${NIHE_TCMR}` },
  "polio-3": { after: "polio-2", min: { days: 28 }, recommended: { months: 1 }, source: `${WHO_POLIO_2022} ; ${NIHE_TCMR}` },
  // IPV 1→2: "second IPV dose being given at least 4 months later" (WHO polio position paper 2022); TCMR 5 → 9 months.
  "polio-ipv-2": { after: "polio-ipv", min: { months: 4 }, recommended: { months: 4 }, source: `${WHO_POLIO_2022} ; ${NIHE_TCMR}` },
  // Rotavirus-1→2: minimum 4 weeks (CDC Table 3-2); TCMR 2 → 3 months, complete before 6 months (NIHE).
  "rotavirus-2": { after: "rotavirus-1", min: { days: 28 }, recommended: { months: 1 }, source: `${CDC_INTERVALS} ; ${NIHE_TCMR}`, confirm: CONFIRM },
  // JE (Jevax, TCMR): dose 2 "7-14 ngày sau mũi 1", dose 3 "1 năm sau liều 2" (NIHE).
  "je-2": { after: "je-1", min: { days: 7 }, recommended: { days: 14 }, source: NIHE_TCMR, confirm: "Lịch theo Jevax (TCMR). Imojev (dịch vụ) có lịch khác — xác nhận với cơ sở tiêm." },
  "je-3": { after: "je-2", min: { months: 12 }, recommended: { months: 12 }, source: NIHE_TCMR, confirm: "Lịch theo Jevax (TCMR). Imojev (dịch vụ) có lịch khác — xác nhận với cơ sở tiêm." },
  // PCV-1→2, 2→3: minimum 4 weeks; PCV-3→4: minimum 8 weeks (CDC Table 3-2). Product schedules differ.
  "pneumococcal-2": { after: "pneumococcal-1", min: { days: 28 }, recommended: { months: 1 }, source: CDC_INTERVALS, confirm: CONFIRM },
  "pneumococcal-3": { after: "pneumococcal-2", min: { days: 28 }, recommended: { months: 1 }, source: CDC_INTERVALS, confirm: CONFIRM },
  "pneumococcal-booster": { after: "pneumococcal-3", min: { days: 56 }, recommended: { days: 56 }, source: CDC_INTERVALS, confirm: CONFIRM },
  // Varicella-1→2: minimum 3 months for ages 12 months-12 years (CDC Table 3-2, 12 weeks / footnote bb "3 months").
  "varicella-2": { after: "varicella-1", min: { months: 3 }, recommended: { months: 3 }, source: CDC_INTERVALS, confirm: CONFIRM },
  // HepA-1→2: minimum 6 months (CDC Table 3-2; recommended 6-18 months, product-dependent).
  "hepa-2": { after: "hepa-1", min: { months: 6 }, recommended: { months: 6 }, source: CDC_INTERVALS, confirm: CONFIRM },
};

export const MOTHER_DOSE_INTERVALS: Record<string, DoseInterval> = {
  // Tetanus (VAT/Td) 1→2 in pregnancy: "Ít nhất 1 tháng sau lần 1" (NIHE); WHO 2017: at least 4 weeks,
  // second dose at least 2 weeks (NIHE: 1 month) before birth.
  "tetanus-2": { after: "tetanus-1", min: { months: 1 }, recommended: { months: 1 }, source: `${NIHE_TCMR} ; ${WHO_TETANUS_2017}` },
};
