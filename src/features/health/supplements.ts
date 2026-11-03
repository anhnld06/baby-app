export type SupplementTopic = {
  id: string;
  name: string;
  aliases: string[];
  context: string;
  source: string;
};

export function ageMonthsOn(dateOfBirth: Date, day: string) {
  const date = new Date(`${day}T00:00:00Z`);
  if (!Number.isFinite(date.getTime()) || date < dateOfBirth) return undefined;
  return (date.getUTCFullYear() - dateOfBirth.getUTCFullYear()) * 12
    + date.getUTCMonth() - dateOfBirth.getUTCMonth()
    - (date.getUTCDate() < dateOfBirth.getUTCDate() ? 1 : 0);
}

// Topics to discuss and configure, never automatic prescriptions or doses.
export function supplementTopics(months: number | undefined): SupplementTopic[] {
  if (months == null || months < 0 || months >= 24) return [];
  return [
    {
      id: "vitamin-d",
      name: "Vitamin D",
      aliases: ["vitamin d", "vitamin d3", "d3"],
      context: months < 12
        ? "Dưới 12 tháng: nhu cầu bổ sung phụ thuộc cách nuôi dưỡng. Bé bú mẹ hoặc bú kết hợp thường cần bổ sung; bé chỉ dùng sữa công thức có thể đã nhận đủ. Xác nhận sản phẩm và liều đang dùng trước khi tạo lịch."
        : "12–23 tháng: xem lượng vitamin D từ chế độ ăn và sữa. Chỉ tạo lịch bổ sung khi bé đang có hướng dẫn sử dụng phù hợp.",
      source: "https://www.cdc.gov/infant-toddler-nutrition/vitamins-minerals/vitamin-d.html",
    },
    {
      id: "iron",
      name: "Sắt",
      aliases: ["sắt", "iron"],
      context: months < 6
        ? "Dưới 6 tháng: trao đổi với bác sĩ về nhu cầu sắt, đặc biệt khi bé sinh non hoặc bú mẹ. Không tự bổ sung chỉ theo tuổi."
        : "Từ khoảng 6 tháng: ưu tiên thực phẩm giàu sắt trong bữa ăn dặm. Chỉ tạo lịch uống sắt khi có hướng dẫn riêng cho bé.",
      source: "https://www.cdc.gov/infant-toddler-nutrition/vitamins-minerals/iron.html",
    },
  ];
}

export function matchesSupplement(name: string, topic: SupplementTopic) {
  return topic.aliases.includes(name.trim().toLocaleLowerCase("vi"));
}
