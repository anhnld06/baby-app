import { monthDate } from "./dates";
export type Milestone = {
  key: string;
  title: string;
  group: "Cột mốc" | "Khoảnh khắc" | "Thai kỳ";
  icon: string;
  month?: number;
  referenceMonth?: number;
};
const firsts: Milestone[] = [
  {
    key: "smile",
    title: "Mỉm cười khi được trò chuyện",
    group: "Cột mốc",
    icon: "😊",
    referenceMonth: 2,
  },
  {
    key: "head",
    title: "Giữ đầu vững khi được bế",
    group: "Cột mốc",
    icon: "👶",
    referenceMonth: 4,
  },
  {
    key: "roll",
    title: "Lăn từ nằm sấp sang ngửa",
    group: "Cột mốc",
    icon: "🌱",
    referenceMonth: 6,
  },
  {
    key: "sit",
    title: "Ngồi không cần hỗ trợ",
    group: "Cột mốc",
    icon: "🧸",
    referenceMonth: 9,
  },
  {
    key: "walk",
    title: "Tự đi vài bước",
    group: "Cột mốc",
    icon: "👣",
    referenceMonth: 15,
  },
];
const moments = [
  "Chiếc răng đầu tiên",
  "Lần đầu ăn dặm",
  "Lần đầu đi chơi",
  "Ảnh gia đình đầu tiên",
  "Lần đầu gặp ông bà",
  "Bộ đồ yêu thích",
  "Món đồ chơi yêu thích",
  "Tiếng gọi đầu tiên",
  "Lần đầu vỗ tay",
  "Lần đầu vẫy chào",
  "Lần đầu đọc sách cùng nhau",
  "Chuyến đi xa đầu tiên",
  "Ngày vui cùng gia đình",
  "Một ngày thật đáng nhớ",
];
const pregnancy = [
  "Biết tin có con",
  "Que thử đầu tiên",
  "Lần khám thai đầu",
  "Ảnh siêu âm đầu tiên",
  "Lần đầu nghe tim thai",
  "Đặt biệt danh cho con",
  "Báo tin cho ông bà",
  "Nhật ký thai kỳ đầu tiên",
  "Lần đầu cảm nhận con đạp",
  "Ảnh bụng bầu kỷ niệm",
  "Chuẩn bị góc nhỏ cho con",
  "Chuẩn bị đồ sơ sinh",
  "Viết thư cho con",
  "Chuẩn bị túi đi sinh",
  "Ngày chờ đón con",
];
export const MILESTONES: Milestone[] = [
  { key: "born", title: "Chào đời", group: "Cột mốc", icon: "🐣", month: 0 },
  ...Array.from({ length: 12 }, (_, i): Milestone => ({
    key: `month-${i + 1}`,
    title: `Tròn ${i + 1} tháng`,
    group: "Cột mốc",
    icon: String(i + 1),
    month: i + 1,
  })),
  ...firsts,
  ...moments.map((title, i): Milestone => ({
    key: `memory-${i}`,
    title,
    group: "Khoảnh khắc",
    icon: ["🦷", "🥣", "🌼", "📷"][i % 4],
  })),
  ...pregnancy.map((title, i): Milestone => ({
    key: `pregnancy-${i}`,
    title,
    group: "Thai kỳ",
    icon: "💗",
  })),
];
export function milestoneCollection(
  birth: Date,
  today: string,
  records: { id: string; milestoneKey: string | null; occurredAt: Date }[],
) {
  return MILESTONES.map((item) => {
    const record = records.find((r) => r.milestoneKey === item.key);
    const anniversary =
      item.month != null ? monthDate(birth, item.month) : null;
    const auto =
      anniversary != null && anniversary.toISOString().slice(0, 10) <= today;
    return {
      ...item,
      record,
      date: record?.occurredAt ?? (auto ? anniversary : null),
      achieved: Boolean(record) || auto,
    };
  });
}
