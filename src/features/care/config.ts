export const careSections = {
  milestones: {
    title: "Mốc phát triển",
    subtitle: "Lưu những lần đầu và kỷ niệm của con",
    kind: "MILESTONE",
    placeholder: "Nụ cười đầu tiên",
    icon: "🌟",
  },
  meals: {
    title: "Nhật ký ăn dặm",
    subtitle: "Món ăn, nguyên liệu và trải nghiệm của bé",
    kind: "MEAL",
    placeholder: "Cháo bí đỏ · gạo, bí đỏ",
    icon: "🥣",
  },
  wellbeing: {
    title: "Dấu hiệu & tâm trạng",
    subtitle: "Ghi lại quan sát để xem lại khi cần",
    kind: "WELLBEING",
    placeholder: "Quan sát hôm nay",
    icon: "💛",
  },
  routine: {
    title: "Nếp sinh hoạt",
    subtitle: "Lịch dự kiến do gia đình tự sắp xếp",
    kind: "ROUTINE",
    placeholder: "Bú / chơi / ngủ / thức giấc",
    icon: "☀️",
  },
} as const;
export type CareSection = keyof typeof careSections;
export function isCareSection(value: string): value is CareSection {
  return Object.hasOwn(careSections, value);
}
