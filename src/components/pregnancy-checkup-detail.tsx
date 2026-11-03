import type { PregnancyCheckup } from "@prisma/client";
import { CHECKUP_EXTRA_FIELDS, displayCheckupValue } from "@/features/mother/checkup-fields";
import { dueDateFromGestationalAge } from "@/features/mother/due-date";
import { toDateTimeLocal } from "@/lib/date";

const MEASUREMENTS = [
  ["crlMm", "CRL (mm)"], ["ntMm", "NT (mm)"], ["bpdMm", "BPD (mm)"],
  ["hcMm", "HC (mm)"], ["acMm", "AC (mm)"], ["flMm", "FL (mm)"],
  ["estimatedFetalWeightG", "Cân nặng thai ước tính (g)"],
  ["cervicalLengthMm", "Chiều dài cổ tử cung (mm)"],
] as const;

export function PregnancyCheckupDetail({ item, timeZone }: { item: PregnancyCheckup; timeZone: string }) {
  const examinedOn = item.checkedAtTimeKnown ? toDateTimeLocal(item.checkedAt, timeZone).slice(0, 10) : item.checkedAt.toISOString().slice(0, 10);
  const estimatedDueDate = dueDateFromGestationalAge(examinedOn, item.gestationalWeek, item.gestationalDay);
  const extras = CHECKUP_EXTRA_FIELDS.filter((field) => item[field.name] != null && item[field.name] !== "");
  const measurements = MEASUREMENTS.filter(([key]) => item[key] != null);
  const texts = [
    ["Số lượng thai", item.fetusCount?.toString()],
    ["Cân nặng mẹ (kg)", item.weightKg?.toString()],
    ["Huyết áp (mmHg)", item.bloodPressure],
    [item.visitType === "PRENATAL_VISIT" ? "Tim thai trên phiếu (lần/phút)" : "Tim thai trên phiếu siêu âm (lần/phút)", item.fetalHeartRate?.toString()],
    ["Vị trí nhau", item.placentaPosition],
    ["Nước ối", item.amnioticFluid],
    ["Kết luận trên phiếu", item.findings],
    ["Bác sĩ", item.doctor],
    ["Ngôi thai", item.fetalPresentation],
    ["Cử động thai", item.fetalMovement === "PRESENT" ? "Có (+)" : item.fetalMovement === "ABSENT" ? "Không (-)" : null],
    ["Độ nhau", item.placentaGrade == null ? null : `${item.placentaGrade}${item.placentaGradeUpper != null ? `–${item.placentaGradeUpper}` : ""}`],
    ["Hình thái thai", item.fetalAnatomy], ["Khảo sát khác", item.otherFindings],
  ].filter(([, value]) => value != null && value !== "");
  return <details className="mt-2 text-sm">
    <summary className="cursor-pointer font-medium text-primary">Xem đầy đủ lần khám</summary>
    <dl className="mt-3 grid gap-3 sm:grid-cols-2">
      {measurements.map(([key, label]) => <div key={key}><dt className="text-xs text-muted-foreground">{label}</dt><dd>{item[key]}</dd></div>)}
      {extras.map((field) => <div key={field.name} className={field.kind === "textarea" ? "sm:col-span-2" : undefined}><dt className="text-xs text-muted-foreground">{field.label}</dt><dd className="whitespace-pre-line break-words">{displayCheckupValue(field.name, item[field.name])}</dd></div>)}
      {texts.map(([label, value]) => <div key={label} className="sm:col-span-2"><dt className="text-xs text-muted-foreground">{label}</dt><dd className="whitespace-pre-line break-words">{value}</dd></div>)}
      {item.ultrasoundDueDate && <div><dt className="text-xs text-muted-foreground">Dự sinh theo phiếu siêu âm</dt><dd>{new Intl.DateTimeFormat("vi-VN", { timeZone: "UTC" }).format(item.ultrasoundDueDate)}</dd></div>}
      {estimatedDueDate && <div><dt className="text-xs text-muted-foreground">Dự sinh ước tính từ tuổi thai</dt><dd>{new Intl.DateTimeFormat("vi-VN", { timeZone: "UTC" }).format(new Date(`${estimatedDueDate}T00:00:00Z`))}</dd></div>}
    </dl>
    {item.sourceMetadata && typeof item.sourceMetadata === "object" && !Array.isArray(item.sourceMetadata) && Array.isArray(item.sourceMetadata.documents) && <p className="mt-3 text-xs text-muted-foreground">Nguồn: {item.sourceMetadata.documents.flatMap((doc) => doc && typeof doc === "object" && !Array.isArray(doc) && typeof doc.label === "string" ? [doc.label] : []).join(" · ")}</p>}
    {!item.checkedAtTimeKnown && <p className="mt-3 text-xs text-muted-foreground">Hồ sơ chỉ ghi nhận ngày khám, chưa xác định giờ.</p>}
    <p className="mt-2 text-xs text-muted-foreground">Các chỉ số không có trong phiếu được để trống.</p>
  </details>;
}
