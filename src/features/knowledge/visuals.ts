const DEFAULT_KNOWLEDGE_VISUAL = "/images/knowledge/family.webp";

const KNOWLEDGE_VISUALS: Record<string, string> = {
  ALL: DEFAULT_KNOWLEDGE_VISUAL,
  PRECONCEPTION: "/images/knowledge/preconception.webp",
  PREGNANCY: "/images/knowledge/pregnancy.webp",
  POSTPARTUM: "/images/knowledge/postpartum.webp",
  NEWBORN_0_28_DAYS: "/images/knowledge/newborn.webp",
  INFANT_1_3_MONTHS: "/images/knowledge/infant-1-3-months.webp",
  INFANT_3_6_MONTHS: "/images/knowledge/infant.webp",
  INFANT_6_12_MONTHS: "/images/knowledge/infant-6-12-months.webp",
  TODDLER: "/images/knowledge/toddler.webp",
};

export function getKnowledgeVisual(stage?: string | null) {
  return (stage && KNOWLEDGE_VISUALS[stage]) || DEFAULT_KNOWLEDGE_VISUAL;
}

export type SectionVisualTopic =
  | "planning"
  | "pregnancy"
  | "postpartum"
  | "nutrition"
  | "newborn"
  | "sleep"
  | "development"
  | "vaccination"
  | "dental"
  | "safety"
  | "symptoms"
  | "evidence";

export type SectionVisual = {
  src: string;
  alt: string;
  topic: SectionVisualTopic;
};

const SECTION_VISUALS: Record<SectionVisualTopic, Omit<SectionVisual, "topic">> = {
  planning: {
    src: "/images/knowledge/sections/planning.webp",
    alt: "Cặp đôi cùng chuẩn bị kế hoạch trước khi mang thai.",
  },
  pregnancy: {
    src: "/images/knowledge/sections/pregnancy.webp",
    alt: "Người mẹ mang thai đang nhẹ nhàng ôm bụng.",
  },
  postpartum: {
    src: "/images/knowledge/sections/postpartum.webp",
    alt: "Người mẹ nghỉ ngơi và nhận sự hỗ trợ sau sinh.",
  },
  nutrition: {
    src: "/images/knowledge/sections/nutrition.webp",
    alt: "Bữa ăn cân bằng với nhiều nhóm thực phẩm.",
  },
  newborn: {
    src: "/images/knowledge/sections/newborn.webp",
    alt: "Em bé sơ sinh được chăm sóc dịu dàng.",
  },
  sleep: {
    src: "/images/knowledge/sections/sleep.webp",
    alt: "Em bé nằm ngửa trong chiếc nôi trống, phẳng và chắc.",
  },
  development: {
    src: "/images/knowledge/sections/development.webp",
    alt: "Em bé vận động và chơi cùng người chăm sóc.",
  },
  vaccination: {
    src: "/images/knowledge/sections/vaccination.webp",
    alt: "Nhân viên y tế thăm khám cho em bé bên người chăm sóc.",
  },
  dental: {
    src: "/images/knowledge/sections/dental.webp",
    alt: "Em bé cầm bàn chải nhỏ trong giờ chăm sóc răng miệng.",
  },
  safety: {
    src: "/images/knowledge/sections/safety.webp",
    alt: "Gia đình chuẩn bị không gian trong nhà an toàn cho em bé.",
  },
  symptoms: {
    src: "/images/knowledge/sections/symptoms.webp",
    alt: "Người mẹ theo dõi thân nhiệt và sức khỏe của em bé.",
  },
  evidence: {
    src: "/images/knowledge/sections/evidence.webp",
    alt: "Cuốn sách và kính lúp tượng trưng cho thông tin đã kiểm chứng.",
  },
};

const CATEGORY_TOPICS: Record<string, SectionVisualTopic> = {
  "Chuẩn bị mang thai": "planning",
  "Chăm sóc thai kỳ": "pregnancy",
  "Chuẩn bị sinh": "pregnancy",
  "Khám thai": "pregnancy",
  "Hậu sản": "postpartum",
  "Dinh dưỡng của mẹ": "nutrition",
  "Tinh thần của mẹ": "postpartum",
  "Sức khỏe tâm thần sau sinh": "postpartum",
  "Chăm sóc sơ sinh": "newborn",
  "Chăm sóc trẻ sơ sinh": "newborn",
  "Khám và sàng lọc sơ sinh": "newborn",
  "Bú và dinh dưỡng": "nutrition",
  "Nuôi con bằng sữa mẹ": "nutrition",
  "Dinh dưỡng của bé": "nutrition",
  "Ăn dặm": "nutrition",
  "Dinh dưỡng thai kỳ": "nutrition",
  "Vi chất": "nutrition",
  "An toàn thực phẩm": "nutrition",
  "Giấc ngủ": "sleep",
  "Phát triển": "development",
  "Nuôi dạy tích cực": "development",
  "Tiêm chủng": "vaccination",
  "Mọc răng": "dental",
  "An toàn": "safety",
  "Dấu hiệu nguy hiểm": "symptoms",
  "Triệu chứng thường gặp": "symptoms",
  "Bài tiết": "symptoms",
  "Mẹo dân gian & sự thật": "evidence",
  "Quan niệm dân gian": "evidence",
  "Myth vs Fact": "evidence",
  "Câu hỏi thường gặp": "evidence",
};

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase();
}

const HEADING_TOPIC_RULES: Array<[RegExp, SectionVisualTopic]> = [
  [/nghen|hoc|so cuu|cap cuu|an toan|nga|bong|dien|ngo doc|phong tranh/, "safety"],
  [/sot|ho |dau|non|tieu chay|tao bon|vang da|phat ban|dau hieu|trieu chung|di kham|nguy hiem/, "symptoms"],
  [/rang|loi|mieng|teething/, "dental"],
  [/tiem|vac.?xin|mien dich|sang loc/, "vaccination"],
  [/ngu|giac|nap/, "sleep"],
  [/bu|sua|an |dinh duong|thuc pham|vitamin|vi chat|sat|canxi|folic/, "nutrition"],
  [/tam|ron|thay ta|ve sinh|so sinh/, "newborn"],
  [/phat trien|van dong|choi|giao tiep|cam xuc|hanh vi|cot moc/, "development"],
  [/sau sinh|hau san|san dich|vet mo|tang sinh mon|tinh than/, "postpartum"],
  [/mang thai|thai ky|chuyen da|sinh con|kham thai/, "pregnancy"],
  [/truoc khi mang thai|thu thai|chuan bi/, "planning"],
  [/su that|myth|dan gian|quan niem|bang chung|nghien cuu/, "evidence"],
];

export function getSectionVisual(category: string, heading = ""): SectionVisual {
  const normalizedHeading = normalize(heading);
  const topic =
    HEADING_TOPIC_RULES.find(([pattern]) => pattern.test(normalizedHeading))?.[1] ??
    CATEGORY_TOPICS[category] ??
    "evidence";

  return { ...SECTION_VISUALS[topic], topic };
}

export type ArticleSectionGuide = {
  src: string;
  title: string;
  alt: string;
  caption: string;
  detailsLabel: string;
  note?: string;
  urgent?: boolean;
};

const SECTION_GUIDES: Record<string, ArticleSectionGuide> = {
  "tu-the-bu-va-dau-hieu-khop-ngam-tot::cac tu the bu pho bien": {
    src: "/images/knowledge/breastfeeding-positions.webp",
    title: "Một số tư thế bú thường dùng",
    alt: "Bốn ô minh họa mẹ cho bé bú ở các tư thế ngồi bế, nằm nghiêng và ngả người.",
    caption:
      "Mẹ chọn tư thế thoải mái, giữ bé áp sát; đầu và cổ được đỡ, tai–vai–hông nằm trên một đường thẳng.",
    detailsLabel: "Xem giải thích từng tư thế",
  },
  "ngu-an-toan-cho-be::moi lan be ngu": {
    src: "/images/knowledge/safe-sleep.webp",
    title: "Không gian ngủ an toàn",
    alt: "Bé nằm ngửa trong nôi riêng cạnh giường cha mẹ, trên nệm phẳng và nôi hoàn toàn trống.",
    caption:
      "Mỗi giấc ngủ: đặt bé nằm ngửa trên nệm chắc, phẳng, ga vừa vặn; nôi trống và là bề mặt ngủ riêng.",
    detailsLabel: "Xem đầy đủ danh sách an toàn",
  },
  "so-cuu-hoc-nghen-cho-tre-duoi-va-tren-1-tuoi::tre duoi 1 tuoi": {
    src: "/images/knowledge/choking-infant.webp",
    title: "Trẻ dưới 1 tuổi",
    alt: "Mô hình trẻ sơ sinh minh họa tư thế vỗ lưng khi nằm sấp và ấn ngực khi nằm ngửa, đầu thấp hơn ngực.",
    caption:
      "Xen kẽ 5 lần vỗ lưng và 5 lần ấn ngực bằng gót một bàn tay. Không ép bụng trẻ dưới 1 tuổi.",
    detailsLabel: "Xem kỹ từng bước sơ cứu",
    note:
      "Nếu trẻ không thể ho, khóc hoặc thở, nhờ người gọi 115 ngay. Hình không thay thế lớp sơ cứu thực hành.",
    urgent: true,
  },
  "so-cuu-hoc-nghen-cho-tre-duoi-va-tren-1-tuoi::tre tu 1 tuoi tro len (thay doi so voi huong dan cu)": {
    src: "/images/knowledge/choking-child.webp",
    title: "Trẻ từ 1 tuổi trở lên",
    alt: "Mô hình trẻ nhỏ minh họa tư thế vỗ lưng khi cúi về trước và ép bụng từ phía sau.",
    caption:
      "Xen kẽ 5 lần vỗ lưng và 5 lần ép bụng đến khi dị vật bật ra hoặc trẻ mất ý thức.",
    detailsLabel: "Xem kỹ từng bước sơ cứu",
  },
};

export function getArticleSectionGuide(slug: string, heading: string) {
  return SECTION_GUIDES[`${slug}::${normalize(heading)}`] ?? null;
}
