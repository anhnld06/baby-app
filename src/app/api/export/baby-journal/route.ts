import { getCurrentUser } from "@/lib/auth";
import { getSelectedBaby } from "@/lib/data";
import { db } from "@/lib/db";

function safeCell(value: unknown) {
  let text = value == null ? "" : String(value);
  if (/^[=+\-@]/.test(text)) text = `'${text}`;
  return `"${text.replace(/"/g, '""')}"`;
}

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return new Response(null, { status: 401 });
  const baby = await getSelectedBaby(user.id);
  if (!baby) return new Response("No baby profile", { status: 404 });

  const [feedings, sleeps, diapers, growth, vaccinations, prescriptions, teeth] = await Promise.all([
    db.feeding.findMany({ where: { babyId: baby.id } }),
    db.sleepEntry.findMany({ where: { babyId: baby.id } }),
    db.diaperEntry.findMany({ where: { babyId: baby.id } }),
    db.growthEntry.findMany({ where: { babyId: baby.id } }),
    db.vaccinationRecord.findMany({ where: { babyId: baby.id } }),
    db.prescription.findMany({ where: { babyId: baby.id }, include: { items: true } }),
    db.toothRecord.findMany({ where: { babyId: baby.id } }),
  ]);

  const rows: Array<{ at: Date; type: string; summary: string; detail: string; notes: string }> = [
    ...feedings.map((item) => ({
      at: item.startTime,
      type: "Feeding",
      summary: item.type,
      detail: [item.amountMl != null ? `${item.amountMl} ml` : "", item.endTime ? `end=${item.endTime.toISOString()}` : "in progress"].filter(Boolean).join("; "),
      notes: item.notes ?? "",
    })),
    ...sleeps.map((item) => ({
      at: item.startTime,
      type: "Sleep",
      summary: item.type,
      detail: item.endTime ? `end=${item.endTime.toISOString()}` : "in progress",
      notes: item.notes ?? "",
    })),
    ...diapers.map((item) => ({
      at: item.changedAt,
      type: "Diaper",
      summary: item.type,
      detail: [item.stoolColor, item.consistency, item.amount].filter(Boolean).join("; "),
      notes: item.notes ?? "",
    })),
    ...growth.map((item) => ({
      at: item.measuredAt,
      type: "Growth",
      summary: [item.weightKg != null ? `${item.weightKg} kg` : "", item.heightCm != null ? `${item.heightCm} cm` : "", item.headCircumferenceCm != null ? `head ${item.headCircumferenceCm} cm` : ""].filter(Boolean).join("; "),
      detail: "",
      notes: item.notes ?? "",
    })),
    ...vaccinations.map((item) => ({
      at: item.administeredAt,
      type: "Vaccination",
      summary: `${item.vaccineName}${item.doseNumber != null ? ` #${item.doseNumber}` : ""}`,
      detail: [item.facility, item.batchNumber ? `batch=${item.batchNumber}` : ""].filter(Boolean).join("; "),
      notes: item.notes ?? "",
    })),
    ...prescriptions.map((item) => ({
      at: item.issuedAt,
      type: "Prescription",
      summary: item.diagnosis ?? "Prescription",
      detail: item.items.map((medicine) => [medicine.medicineName, medicine.dosage, medicine.frequency].filter(Boolean).join(" ")).join("; "),
      notes: item.notes ?? "",
    })),
    ...teeth.map((item) => ({
      at: item.eruptedAt,
      type: "Tooth",
      summary: item.position,
      detail: "",
      notes: item.notes ?? "",
    })),
  ].sort((left, right) => right.at.getTime() - left.at.getTime());

  const csv = [
    ["time", "type", "summary", "detail", "notes"],
    ...rows.map((row) => [row.at.toISOString(), row.type, row.summary, row.detail, row.notes]),
  ].map((row) => row.map(safeCell).join(",")).join("\r\n");

  return new Response(`\uFEFF${csv}`, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="vani-family-baby-journal.csv"',
      "Cache-Control": "private, no-store",
    },
  });
}
