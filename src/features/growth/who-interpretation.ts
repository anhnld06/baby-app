// WHO assessment course: https://www.who.int/publications/i/item/9789241595070
// Thresholds are z-scores; a high weight-for-age is not an overweight diagnosis.
// Labels describe the position against the reference range only; they never diagnose.
export const WHO_CLASSIFICATION = { severeLow: -3, low: -2, high: 2, severeHigh: 3 } as const;
export type WhoIndicator = "weightAge" | "heightAge" | "weightHeight" | "bmiAge" | "headAge";
export function interpretWho(z: number | null, indicator: WhoIndicator, flagged: boolean) {
  if (z == null) return { tone: "muted", label: "Chưa đủ dữ liệu" };
  if (flagged || !Number.isFinite(z)) return { tone: "review", label: "Nên kiểm tra lại số đo" };
  if (z < WHO_CLASSIFICATION.severeLow) return { tone: "review", label: "Thấp hơn nhiều so với khoảng WHO" };
  if (z < WHO_CLASSIFICATION.low) return { tone: "review", label: "Thấp hơn khoảng WHO" };
  if (z > WHO_CLASSIFICATION.high) return { tone: "review", label: indicator === "weightAge" ? "Cao hơn khoảng WHO · xem cùng chiều dài" : "Cao hơn khoảng WHO" };
  return { tone: "within", label: "Trong khoảng WHO" };
}
