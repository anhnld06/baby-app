export type SocialPlatform = "Facebook" | "TikTok" | "Threads";

export type SocialDiscussionTone = "CAUTION" | "DEBATE" | "PRACTICAL";

export type SocialDiscussion = {
  id: string;
  category: string;
  question: string;
  socialContext: string;
  checkedAnswer: string;
  tone: SocialDiscussionTone;
  stages: string[];
  relatedArticle: {
    title: string;
    slug: string;
  };
  searches: Array<{
    platform: SocialPlatform;
    url: string;
  }>;
};

const PLATFORM_SEARCH_URLS: Record<
  SocialPlatform,
  (query: string) => string
> = {
  Facebook: (query) =>
    `https://www.facebook.com/search/posts/?q=${encodeURIComponent(query)}`,
  TikTok: (query) =>
    `https://www.tiktok.com/search?q=${encodeURIComponent(query)}`,
  Threads: (query) =>
    `https://www.threads.com/search?q=${encodeURIComponent(query)}`,
};

function searches(query: string): SocialDiscussion["searches"] {
  return (Object.keys(PLATFORM_SEARCH_URLS) as SocialPlatform[]).map(
    (platform) => ({
      platform,
      url: PLATFORM_SEARCH_URLS[platform](query),
    }),
  );
}

export const SOCIAL_DISCUSSIONS: SocialDiscussion[] = [
  {
    id: "infant-sleep-products",
    category: "An toàn giấc ngủ",
    question: "Gối, chặn và nôi “chống bẹp đầu” có an toàn khi bé ngủ?",
    socialContext:
      "Nội dung bán hàng thường hứa giúp bé ngủ sâu, chống méo đầu hoặc tránh lăn. Đây là nhóm tuyên bố cần kiểm tra kỹ trước khi mua và dùng.",
    checkedAnswer:
      "Với trẻ sơ sinh, ưu tiên mặt ngủ phẳng, chắc và trống. Không thêm gối, chặn, thú bông hay vật mềm vào chỗ ngủ của bé.",
    tone: "CAUTION",
    stages: ["NEWBORN_0_28_DAYS", "INFANT_1_3_MONTHS", "INFANT_3_6_MONTHS"],
    relatedArticle: {
      title: "Ngủ an toàn cho bé",
      slug: "ngu-an-toan-cho-be",
    },
    searches: searches("gối chống bẹp đầu trẻ sơ sinh"),
  },
  {
    id: "wake-windows",
    category: "Giấc ngủ",
    question: "Có cần ép bé theo “wake window” thật chính xác?",
    socialContext:
      "Các lịch thức – ngủ theo phút thường được chia sẻ như lịch mẫu và dễ khiến cha mẹ nghĩ mình đang làm sai khi bé không theo đúng mốc.",
    checkedAnswer:
      "Khung giờ thức chỉ nên là gợi ý quan sát, không phải mốc y khoa cứng. Hãy nhìn dấu hiệu buồn ngủ, tổng thời gian ngủ và tình trạng của từng bé.",
    tone: "DEBATE",
    stages: ["INFANT_1_3_MONTHS", "INFANT_3_6_MONTHS", "INFANT_6_12_MONTHS"],
    relatedArticle: {
      title: "Giấc ngủ 1–6 tháng và sự thật về sleep regression",
      slug: "giac-ngu-tre-1-6-thang-va-su-that-ve-sleep-regression",
    },
    searches: searches("wake window em bé lịch ngủ"),
  },
  {
    id: "weaning-methods",
    category: "Ăn dặm",
    question: "BLW hay ăn dặm truyền thống tốt hơn?",
    socialContext:
      "Các cộng đồng thường chia thành hai phía: để bé tự ăn hoàn toàn hoặc đút thìa. Tranh luận dễ bỏ quên điều quan trọng hơn là an toàn và đáp ứng tín hiệu của bé.",
    checkedAnswer:
      "Không có một phương pháp thắng cho mọi gia đình. Có thể kết hợp, miễn thức ăn đúng độ thô, bé ngồi vững, luôn được giám sát và bữa ăn đủ chất.",
    tone: "DEBATE",
    stages: ["INFANT_3_6_MONTHS", "INFANT_6_12_MONTHS"],
    relatedArticle: {
      title: "BLW và ăn dặm truyền thống",
      slug: "an-dam-be-tu-chi-huy-blw-vs-an-dam-truyen-thong",
    },
    searches: searches("ăn dặm BLW hay truyền thống"),
  },
  {
    id: "low-milk-signs",
    category: "Nuôi con bằng sữa mẹ",
    question: "Ngực mềm hoặc hút được ít có đồng nghĩa là mẹ thiếu sữa?",
    socialContext:
      "Ảnh bình sữa sau hút và các lịch kích sữa thường được dùng để so sánh, khiến nhiều mẹ lo lắng dù bé vẫn bú và tăng trưởng tốt.",
    checkedAnswer:
      "Một lần hút ít hoặc ngực mềm không đủ để kết luận. Cần xem khớp ngậm, số tã ướt, dấu hiệu mất nước và đường tăng trưởng của bé.",
    tone: "PRACTICAL",
    stages: ["POSTPARTUM", "NEWBORN_0_28_DAYS", "INFANT_1_3_MONTHS"],
    relatedArticle: {
      title: "Ít sữa hay nhiều sữa: dấu hiệu từ mẹ và bé",
      slug: "it-sua-hay-nhieu-sua-dau-hieu-tu-me-va-be",
    },
    searches: searches("mẹ ít sữa kích sữa dấu hiệu bé bú đủ"),
  },
  {
    id: "mild-illness-vaccination",
    category: "Tiêm chủng",
    question: "Bé sổ mũi hoặc sốt nhẹ có phải hoãn tiêm?",
    socialContext:
      "Kinh nghiệm “đợi bé khỏe hẳn mới tiêm” xuất hiện thường xuyên, nhưng tự dời lịch có thể làm kéo dài khoảng trống bảo vệ.",
    checkedAnswer:
      "Không tự hoãn chỉ dựa vào lời truyền miệng. Nhân viên tiêm chủng cần khám sàng lọc và quyết định theo mức độ bệnh, nhiệt độ và loại vắc-xin.",
    tone: "PRACTICAL",
    stages: [
      "NEWBORN_0_28_DAYS",
      "INFANT_1_3_MONTHS",
      "INFANT_3_6_MONTHS",
      "INFANT_6_12_MONTHS",
      "TODDLER",
    ],
    relatedArticle: {
      title: "Chống chỉ định, hoãn tiêm và sốt nhẹ",
      slug: "chong-chi-dinh-hoan-tiem-va-sot-nhe-co-can-hoan-khong",
    },
    searches: searches("bé sổ mũi sốt nhẹ có tiêm vaccine được không"),
  },
  {
    id: "infant-cough-remedies",
    category: "Thuốc & mẹo mạng",
    question: "Siro ho, mật ong hoặc thảo dược có dùng cho trẻ sơ sinh?",
    socialContext:
      "Video và bài bán hàng có thể gắn nhãn “tự nhiên”, “dùng từ sơ sinh” hoặc đưa liều dùng cụ thể mà không biết đầy đủ bệnh sử của bé.",
    checkedAnswer:
      "Không tự dùng thuốc ho hay thảo dược cho trẻ sơ sinh; không cho trẻ dưới 1 tuổi dùng mật ong. Khó thở, bú kém, tím tái hoặc li bì cần được khám ngay.",
    tone: "CAUTION",
    stages: [
      "NEWBORN_0_28_DAYS",
      "INFANT_1_3_MONTHS",
      "INFANT_3_6_MONTHS",
      "INFANT_6_12_MONTHS",
    ],
    relatedArticle: {
      title: "Ho, nghẹt mũi và cảm lạnh ở trẻ dưới 1 tuổi",
      slug: "ho-nghet-mui-cam-lanh-o-tre-duoi-1-tuoi",
    },
    searches: searches("siro ho thảo dược cho trẻ sơ sinh"),
  },
  {
    id: "postpartum-confinement",
    category: "Sau sinh",
    question: "Nằm than, xông hơ hoặc kiêng tắm có giúp mẹ hồi phục nhanh?",
    socialContext:
      "Nhiều chia sẻ trộn lẫn sự chăm sóc, nghỉ ngơi hữu ích với các thực hành có nguy cơ bỏng, ngộ độc khí hoặc nhiễm trùng.",
    checkedAnswer:
      "Giữ sự hỗ trợ và nghỉ ngơi, nhưng tránh nằm than và hơ nóng sát da. Mẹ có thể vệ sinh, tắm nhanh ở nơi kín gió khi tình trạng cho phép.",
    tone: "CAUTION",
    stages: ["PREGNANCY", "POSTPARTUM"],
    relatedArticle: {
      title: "Kiêng khem sau sinh: truyền thống và khoa học",
      slug: "kieng-khem-sau-sinh-truyen-thong-va-khoa-hoc",
    },
    searches: searches("mẹ sau sinh nằm than xông hơ kiêng tắm"),
  },
  {
    id: "teething-fever-remedies",
    category: "Mọc răng",
    question: "Mọc răng có gây sốt cao và nên dùng vòng hổ phách, gel tê?",
    socialContext:
      "Các bài chia sẻ thường quy mọi cơn sốt, tiêu chảy hoặc quấy khóc cho mọc răng; một số nội dung còn giới thiệu vòng cổ và gel bôi tê.",
    checkedAnswer:
      "Mọc răng có thể làm bé khó chịu nhưng không nên dùng để giải thích sốt cao hay bé mệt rõ. Tránh vòng cổ vì nguy cơ siết cổ, hóc; không tự dùng gel gây tê.",
    tone: "CAUTION",
    stages: ["INFANT_3_6_MONTHS", "INFANT_6_12_MONTHS", "TODDLER"],
    relatedArticle: {
      title: "Mọc răng, sốt và đồ chơi mọc răng: thật – hư",
      slug: "quan-niem-moc-rang-gay-sot-va-do-choi-moc-rang-nguy-hiem",
    },
    searches: searches("bé mọc răng sốt vòng hổ phách gel bôi lợi"),
  },
  {
    id: "baby-walker",
    category: "Vận động",
    question: "Xe tập đi có giúp bé biết đi sớm và chân cứng cáp hơn?",
    socialContext:
      "Video bé chạy bằng xe tròn thường tạo cảm giác đây là cách tập đi nhanh, tiện giữ bé và giúp chân khỏe.",
    checkedAnswer:
      "Xe tập đi có bánh không giúp bé học đi đúng cách và làm tăng nguy cơ ngã cầu thang, bỏng hoặc với tới vật nguy hiểm. Cho bé chơi tự do trên sàn an toàn hơn.",
    tone: "CAUTION",
    stages: ["INFANT_6_12_MONTHS", "TODDLER"],
    relatedArticle: {
      title: "Xe tập đi có bánh: vì sao nên tránh",
      slug: "xe-tap-di-co-banh-vi-sao-nen-tranh",
    },
    searches: searches("xe tập đi giúp bé biết đi sớm"),
  },
  {
    id: "screens-at-meals",
    category: "Màn hình",
    question: "Cho xem điện thoại để bé chịu ăn có sao không?",
    socialContext:
      "Mẹo mở video trong bữa ăn thường được chia sẻ như một cách nhanh để bé ngồi yên và ăn được nhiều hơn.",
    checkedAnswer:
      "Màn hình làm bé ít chú ý tín hiệu đói – no và giảm tương tác trong bữa ăn. Nên giảm dần, giữ bữa ăn ngắn, đều đặn và không ép bé ăn hết.",
    tone: "PRACTICAL",
    stages: ["INFANT_6_12_MONTHS", "TODDLER"],
    relatedArticle: {
      title: "Thời gian màn hình cho trẻ nhỏ",
      slug: "thoi-gian-man-hinh-cho-tre-nho-who-va-aap-khac-biet-moi",
    },
    searches: searches("cho bé xem điện thoại khi ăn"),
  },
  {
    id: "vaccines-autism-overload",
    category: "Tiêm chủng",
    question: "MMR gây tự kỷ hoặc tiêm nhiều mũi làm quá tải miễn dịch?",
    socialContext:
      "Các video kể chuyện cá nhân và ảnh chụp bảng thành phần thường được dùng để nối thời điểm tiêm với những thay đổi phát triển của trẻ.",
    checkedAnswer:
      "Nghiên cứu quy mô lớn không tìm thấy MMR gây tự kỷ. Tiêm đồng thời các mũi đến hạn đã được đánh giá về an toàn và giúp trẻ được bảo vệ đúng lúc.",
    tone: "CAUTION",
    stages: ["INFANT_6_12_MONTHS", "TODDLER"],
    relatedArticle: {
      title: "MMR, tự kỷ và “quá tải miễn dịch”: sự thật",
      slug: "mmr-tu-ky-thanh-phan-vaccine-va-qua-tai-mien-dich-su-that",
    },
    searches: searches("vaccine MMR tự kỷ quá tải miễn dịch trẻ em"),
  },
  {
    id: "pregnancy-food-labour",
    category: "Ăn uống thai kỳ",
    question: "Nước dừa, mè đen hoặc món “có vò” giúp con đẹp và dễ sinh?",
    socialContext:
      "Kinh nghiệm ăn uống thai kỳ thường gắn một món cụ thể với màu da, nước ối, chuyển dạ nhanh hoặc hình dáng em bé.",
    checkedAnswer:
      "Không có món ăn nào quyết định ngoại hình em bé hoặc bảo đảm chuyển dạ dễ. Có thể dùng thực phẩm phù hợp trong chế độ cân bằng, nhưng không thay thế theo dõi thai kỳ.",
    tone: "DEBATE",
    stages: ["PRECONCEPTION", "PREGNANCY"],
    relatedArticle: {
      title: "Nước dừa, mè đen, hải sản “có vò” khi mang thai",
      slug: "nuoc-dua-me-den-hai-san-co-vo-khi-mang-thai",
    },
    searches: searches("mẹ bầu nước dừa mè đen dễ sinh con trắng"),
  },
  {
    id: "baby-sex-predictions",
    category: "Thai kỳ",
    question: "Nhịp tim thai, dáng bụng và thèm ăn có đoán được giới tính?",
    socialContext:
      "Các bài trắc nghiệm vui thường biến nhịp tim, lịch âm, nghén hoặc hình dáng bụng thành dấu hiệu chắc chắn về giới tính thai nhi.",
    checkedAnswer:
      "Các dấu hiệu dân gian không xác định đáng tin cậy giới tính thai. Hãy coi đây là trò vui, không dùng để quyết định chăm sóc hay tạo áp lực lên mẹ.",
    tone: "DEBATE",
    stages: ["PREGNANCY"],
    relatedArticle: {
      title: "Dự đoán giới tính thai nhi theo dân gian",
      slug: "du-doan-gioi-tinh-thai-nhi-theo-dan-gian-that-hu",
    },
    searches: searches("đoán giới tính thai nhịp tim dáng bụng lịch âm"),
  },
  {
    id: "postpartum-mental-health",
    category: "Sức khỏe tinh thần",
    question: "Buồn, mất ngủ và thấy mình là người mẹ tệ có phải ai cũng trải qua?",
    socialContext:
      "Những lời “mẹ nào cũng vậy” có thể giúp bớt cô đơn, nhưng cũng dễ làm dấu hiệu trầm cảm sau sinh bị xem nhẹ quá lâu.",
    checkedAnswer:
      "Baby blues thường nhẹ và ngắn; buồn kéo dài, tuyệt vọng, không thể chăm sóc bản thân hoặc có ý nghĩ làm hại mình/bé cần được hỗ trợ chuyên môn ngay.",
    tone: "PRACTICAL",
    stages: ["PREGNANCY", "POSTPARTUM", "NEWBORN_0_28_DAYS"],
    relatedArticle: {
      title: "Phân biệt baby blues, trầm cảm và lo âu sau sinh",
      slug: "phan-biet-baby-blues-tram-cam-va-lo-au-sau-sinh",
    },
    searches: searches("baby blues trầm cảm sau sinh mẹ bỉm"),
  },
  {
    id: "chubby-baby-growth",
    category: "Tăng trưởng",
    question: "Bé càng bụ bẫm càng khỏe, đứng cân mới là thiếu chất?",
    socialContext:
      "Ảnh so sánh cân nặng và bình luận về ngoại hình dễ khiến gia đình đổi sữa, ép ăn hoặc tự bổ sung vi chất để bé tăng cân nhanh.",
    checkedAnswer:
      "Một con số hoặc vẻ ngoài không nói hết sức khỏe. Cần theo xu hướng cân nặng, chiều dài và vòng đầu trên biểu đồ phù hợp, cùng cách bé ăn và phát triển.",
    tone: "PRACTICAL",
    stages: [
      "NEWBORN_0_28_DAYS",
      "INFANT_1_3_MONTHS",
      "INFANT_3_6_MONTHS",
      "INFANT_6_12_MONTHS",
      "TODDLER",
    ],
    relatedArticle: {
      title: "Đọc biểu đồ tăng trưởng đúng cách",
      slug: "doc-bieu-do-tang-truong-dung-cach",
    },
    searches: searches("bé bụ bẫm mới khỏe tăng cân chuẩn"),
  },
];

export function prioritizeSocialDiscussions(
  currentStage?: string,
): SocialDiscussion[] {
  if (!currentStage) return SOCIAL_DISCUSSIONS;

  return [...SOCIAL_DISCUSSIONS].sort(
    (left, right) =>
      Number(right.stages.includes(currentStage)) -
      Number(left.stages.includes(currentStage)),
  );
}
