import { calendarAgeDays } from "./dates";
export const DEVELOPMENT_SOURCES = {
  leaps: "https://thewonderweeks.com/blog/leaps/crankiness-and-crying/",
  sleep:
    "https://www.nhs.uk/baby/caring-for-a-newborn/helping-your-baby-to-sleep/",
  milestones: "https://www.cdc.gov/milestones",
  feeding:
    "https://www.nhs.uk/best-start-in-life/baby/feeding-your-baby/bottle-feeding/bottle-feeding-your-baby/feeding-on-demand/",
};
// Milestone weeks published by the model's authors; these are reference points,
// not validated predictions of an individual child's symptoms or duration.
export const LEAP_WEEKS = [5, 8, 12, 19, 26, 37, 46, 55, 64, 75] as const;
export const LEAP_TOPICS = [
  "Khám phá cảm giác",
  "Nhận ra điều lặp lại",
  "Theo dõi chuyển động",
  "Khám phá một chuỗi sự việc",
  "Tương tác và khoảng cách",
  "Khám phá các nhóm đồ vật",
  "Thử những bước nối tiếp",
  "Khám phá việc hằng ngày",
  "Thử cách làm khác nhau",
  "Khám phá điều quen và mới",
];
export function developmentContext(
  birth: Date,
  now: Date,
  timeZone: string,
  gestationalWeeks?: number | null,
  corrected = false,
) {
  const ageDays = calendarAgeDays(birth, now, timeZone);
  const correction =
    corrected && gestationalWeeks != null && gestationalWeeks < 40
      ? (40 - gestationalWeeks) * 7
      : 0;
  const days = Math.max(0, ageDays - correction);
  const week = Math.floor(days / 7);
  const nearest = LEAP_WEEKS.map((value, index) => ({
    value,
    index,
    distance: Math.abs(value * 7 - days),
  })).sort((a, b) => a.distance - b.distance)[0];
  const next = LEAP_WEEKS.find((value) => value * 7 > days);
  return {
    ageDays,
    days,
    week,
    correction,
    nearest,
    next,
    daysToNext: next ? next * 7 - days : null,
    sleepChange: ageDays >= 90 && ageDays < 180,
  };
}
export function stageContent(days: number) {
  if (days < 90)
    return {
      title: "Những tháng đầu bên con",
      body: "Dành thời gian trò chuyện, nhìn mặt và làm quen tín hiệu riêng của bé. Ghi lại những thay đổi bạn quan sát được.",
      activity:
        "Chọn lúc bé tỉnh và thoải mái để tương tác ngắn, nghỉ khi bé muốn dừng.",
      months: 2,
    };
  if (days < 180)
    return {
      title: "Khám phá âm thanh và vận động",
      body: "Quan sát cách bé tương tác, phản ứng với người thân và dùng cơ thể để khám phá. Nhịp ngủ có thể thay đổi.",
      activity:
        "Trò chuyện qua lại và cho bé thời gian chơi có người lớn quan sát.",
      months: 4,
    };
  if (days < 270)
    return {
      title: "Khám phá đồ vật và người thân",
      body: "Lưu những lần bé thử kỹ năng mới, biểu cảm và cách tương tác với gia đình.",
      activity:
        "Cùng khám phá đồ chơi phù hợp, tránh vật nhỏ và luôn có người lớn giám sát.",
      months: 6,
    };
  if (days < 365)
    return {
      title: "Cùng con khám phá mỗi ngày",
      body: "Quan sát vận động, giao tiếp và những trò chơi bé thích. Ghi nhận tiến bộ theo hành trình riêng.",
      activity: "Chơi ú òa, đọc sách tranh và gọi tên đồ vật quen thuộc.",
      months: 9,
    };
  return {
    title: "Những trải nghiệm mới của con",
    body: "Tiếp tục lưu các kỹ năng giao tiếp, vận động và khoảnh khắc gia đình.",
    activity: "Cùng đọc sách, trò chuyện và tạo không gian chơi an toàn.",
    months: 15,
  };
}
