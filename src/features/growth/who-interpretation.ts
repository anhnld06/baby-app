// WHO assessment course: https://www.who.int/publications/i/item/9789241595070
// Thresholds are z-scores; a high weight-for-age is not an overweight diagnosis.
export const WHO_CLASSIFICATION = { severeLow: -3, low: -2, high: 2, severeHigh: 3 } as const;
export type WhoIndicator = "weightAge" | "heightAge" | "weightHeight" | "headAge";
export function interpretWho(z: number | null, indicator: WhoIndicator, flagged: boolean, vi = true) {
  if (z == null) return { tone: "muted", label: vi ? "Chưa đủ dữ liệu" : "Insufficient data" };
  if (flagged || !Number.isFinite(z)) return { tone: "review", label: vi ? "Kiểm tra lại số đo" : "Check measurement" };
  if (z < WHO_CLASSIFICATION.severeLow) return { tone: "review", label: vi ? "Thấp nhiều so với chuẩn WHO" : "Well below WHO reference" };
  if (z < WHO_CLASSIFICATION.low) return { tone: "review", label: vi ? "Thấp hơn khoảng tham khảo WHO" : "Below WHO reference range" };
  if (z > WHO_CLASSIFICATION.high) return { tone: "review", label: indicator === "weightAge" ? (vi ? "Cao hơn theo tuổi · Cần xem cùng chiều dài" : "High for age · Review length too") : (vi ? "Cao hơn khoảng tham khảo WHO" : "Above WHO reference range") };
  return { tone: "within", label: vi ? "Trong khoảng tham khảo WHO" : "Within WHO reference range" };
}
