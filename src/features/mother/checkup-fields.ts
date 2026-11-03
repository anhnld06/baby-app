// Optional observations found on prenatal records; null means not recorded.
export const CHECKUP_EXTRA_FIELDS = [
  {"name": "maternalPulse", "label": "Mạch mẹ (lần/phút)", "group": "maternal", "kind": "number"},
  {"name": "edema", "label": "Phù", "group": "maternal", "kind": "presence"},
  {"name": "urineTestResult", "label": "Nước tiểu albumin/đường", "group": "maternal", "kind": "text"},
  {"name": "maternalHealthStatus", "label": "Tình trạng sức khỏe", "group": "maternal", "kind": "text"},
  {"name": "clinicalFetalHeartRate", "label": "Tim thai khi khám (lần/phút)", "group": "maternal", "kind": "number"},
  {"name": "placentaGradeUpper", "label": "Độ nhau đến (nếu ghi khoảng)", "group": "ultrasound", "kind": "number"},
  {"name": "afiMm", "label": "Chỉ số ối AFI (mm)", "group": "ultrasound", "kind": "number"},
  {"name": "umbilicalArteryPi", "label": "PI động mạch rốn", "group": "ultrasound", "kind": "number"},
  {"name": "middleCerebralArteryPi", "label": "PI động mạch não giữa", "group": "ultrasound", "kind": "number"},
  {"name": "middleCerebralArteryPsvCmS", "label": "PSV động mạch não giữa (cm/s)", "group": "ultrasound", "kind": "number"},
  {"name": "uterineArteryPiRight", "label": "PI động mạch tử cung phải", "group": "ultrasound", "kind": "number"},
  {"name": "uterineArteryPiLeft", "label": "PI động mạch tử cung trái", "group": "ultrasound", "kind": "number"},
  {"name": "ductusVenosusAWave", "label": "Sóng a", "group": "ultrasound", "kind": "text"},
  {"name": "nuchalCordLoops", "label": "Số vòng rốn quấn cổ", "group": "ultrasound", "kind": "number"},
  {"name": "estimatedFetalWeightPercentile", "label": "Bách phân vị cân nặng thai", "group": "ultrasound", "kind": "number"},
  {"name": "estimatedFetalWeightErrorG", "label": "Sai số cân nặng thai (± g)", "group": "ultrasound", "kind": "number"},
  {"name": "followupInstruction", "label": "Lời hẹn tái khám", "group": "followup", "kind": "textarea"},
  {"name": "treatment", "label": "Thuốc và điều trị theo phiếu", "group": "followup", "kind": "textarea"},
  {"name": "careInstructions", "label": "Dặn dò riêng của bác sĩ", "group": "followup", "kind": "textarea"},
] as const;

export type CheckupExtraField = (typeof CHECKUP_EXTRA_FIELDS)[number];
export type CheckupExtraName = CheckupExtraField["name"];

export function displayCheckupValue(name: string, value: unknown): string {
  if (value === null || value === undefined || value === "") return "Chưa ghi nhận";
  if (name === "edema") return value === "PRESENT" ? "Có (+)" : value === "ABSENT" ? "Không (-)" : String(value);
  return String(value);
}
