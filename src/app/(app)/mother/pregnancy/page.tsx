import Link from "next/link";
import { AlertTriangle, CalendarCheck, CheckCircle2, HeartPulse, Scale, ShieldAlert } from "lucide-react";
import { deletePregnancyCheckupAction, savePregnancyCheckupAction } from "@/app/actions";
import { CollapsibleRecordForm } from "@/components/collapsible-record-form";
import { FormActionBar } from "@/components/form-action-bar";
import { PageHeader } from "@/components/page-header";
import { PregnancyCheckupForm } from "@/components/pregnancy-checkup-form";
import { RecordActions } from "@/components/record-actions";
import { Card, CardContent } from "@/components/ui/card";
import { getAIProvider } from "@/features/ai/provider";
import { assessCheckup } from "@/features/mother/checkup-assessment";
import { gestationalAge } from "@/features/mother/insights";
import { selectRelevantPregnancy } from "@/features/mother/pregnancy";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { getLocale } from "@/lib/i18n";

const LEVEL_STYLE = {
  GOOD: { icon: CheckCircle2, label: "Ổn định", className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300" },
  WATCH: { icon: AlertTriangle, label: "Cần theo dõi", className: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300" },
  URGENT: { icon: ShieldAlert, label: "Cần khám sớm", className: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300" },
} as const;

const VISIT_TYPE_LABEL = {
  PRENATAL_VISIT: "Khám thai",
  ULTRASOUND: "Siêu âm",
  COMBINED: "Khám thai và siêu âm",
} as const;

function gestationalAgeLabel(week: number | null | undefined, day: number | null | undefined) {
  if (week == null) return undefined;
  return `${week} tuần${day != null ? ` ${day} ngày` : ""}`;
}

export default async function PregnancyTrackingPage({ searchParams }: { searchParams: Promise<{ edit?: string }> }) {
  const [user, locale, params] = await Promise.all([requireUser(), getLocale(), searchParams]);
  const mother = await db.mother.findUnique({ where: { userId: user.id }, include: { pregnancies: { orderBy: { createdAt: "desc" } } } });
  const pregnancy = selectRelevantPregnancy(mother?.pregnancies ?? []);
  if (!mother || !pregnancy) return <><PageHeader title="Theo dõi thai kỳ" backHref="/mother" /><div className="rounded-2xl border border-dashed p-6 text-center text-sm text-muted-foreground">Hãy thêm thông tin thai kỳ trong Hồ sơ trước.<Link href="/profile/pregnancy" className="mt-3 block font-medium text-primary">Thêm thai kỳ</Link></div></>;
  const [items, editing] = await Promise.all([
    db.pregnancyCheckup.findMany({ where: { pregnancyId: pregnancy.id }, orderBy: { checkedAt: "desc" }, take: 30 }),
    params.edit ? db.pregnancyCheckup.findFirst({ where: { id: params.edit, pregnancyId: pregnancy.id } }) : null,
  ]);
  const age = gestationalAge(pregnancy.lastMenstrualPeriod);
  const latest = items[0];
  const assessment = latest
    ? assessCheckup({
        gestationalWeek: latest.gestationalWeek,
        bloodPressure: latest.bloodPressure,
        fetalHeartRate: latest.fetalHeartRate,
        fundalHeightCm: latest.fundalHeightCm,
      })
    : null;
  let aiNote: { summary: string; suggestions: string[] } | null = null;
  if (assessment) {
    try {
      aiNote = await getAIProvider().assessCheckup({
        checkup: {
          gestationalWeek: latest.gestationalWeek ?? undefined,
          weightKg: latest.weightKg ?? undefined,
          bloodPressure: latest.bloodPressure ?? undefined,
          fetalHeartRate: latest.fetalHeartRate ?? undefined,
          fundalHeightCm: latest.fundalHeightCm ?? undefined,
          findings: latest.findings ?? undefined,
        },
        flags: assessment.flags,
        level: assessment.level,
        locale: "vi",
      });
    } catch {
      aiNote = null;
    }
  }
  const levelStyle = assessment ? LEVEL_STYLE[assessment.level] : null;
  const LevelIcon = levelStyle?.icon;
  return (
    <>
      <PageHeader title="Theo dõi thai kỳ" subtitle={mother.name} backHref="/mother" />
      <section className="mb-5 overflow-hidden rounded-3xl bg-gradient-to-br from-violet-500 to-fuchsia-600 p-5 text-white shadow-lg shadow-violet-500/15">
        <p className="text-xs uppercase tracking-[.16em] opacity-80">Thai kỳ hiện tại</p>
        <div className="mt-2 flex items-end justify-between gap-3"><div><strong className="text-3xl">{age ? `${age.weeks} tuần` : "Chưa có tuổi thai"}</strong>{age && <span className="ml-2 text-sm opacity-85">{age.days} ngày</span>}</div><HeartPulse className="size-8 opacity-80" /></div>
        <p className="mt-3 text-sm opacity-85">Ngày dự sinh: {pregnancy.estimatedDueDate ? new Intl.DateTimeFormat(locale, { day: "2-digit", month: "long", year: "numeric" }).format(pregnancy.estimatedDueDate) : "chưa ghi"}</p>
        <Link href="/profile/pregnancy" className="mt-3 inline-block text-xs font-medium underline underline-offset-4">Chỉnh thông tin thai kỳ</Link>
      </section>
      {assessment && levelStyle && LevelIcon && (
        <Card className="mb-5 border-0 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-sm font-semibold">Phân tích lần khám gần nhất</h2>
              <span className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${levelStyle.className}`}>
                <LevelIcon className="size-3.5" />
                {levelStyle.label}
              </span>
            </div>
            <ul className="mt-3 space-y-1.5 text-sm">
              {assessment.flags.map((flag) => (
                <li key={flag} className="flex gap-2">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-muted-foreground" />
                  {flag}
                </li>
              ))}
            </ul>
            {aiNote && (
              <div className="mt-4 border-t pt-4">
                <p className="text-sm leading-6">{aiNote.summary}</p>
                {aiNote.suggestions.length > 0 && (
                  <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                    {aiNote.suggestions.map((suggestion) => (
                      <li key={suggestion}>• {suggestion}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}
            <p className="mt-4 text-xs text-muted-foreground">
              Đây chỉ là gợi ý sàng lọc dựa trên ngưỡng chung, không thay thế chẩn đoán của bác sĩ. Khi có dấu hiệu bất thường, hãy liên hệ cơ sở y tế ngay.
            </p>
          </CardContent>
        </Card>
      )}
      <CollapsibleRecordForm key={`${editing?.id ?? "new"}-${items.length}`} defaultOpen={!!editing} addLabel="Thêm lần khám mới" closeLabel="Hủy">
        <Card className="border-0 shadow-sm"><CardContent className="p-5">
          <PregnancyCheckupForm pregnancyId={pregnancy.id} editing={editing} defaultGestationalWeek={age?.weeks} timeZone={user.timezone} />
        </CardContent></Card>
        <FormActionBar formId="checkup-form" saveAction={savePregnancyCheckupAction} saveLabel={editing ? "Cập nhật" : "Lưu lần khám"} cancelHref={editing ? "/mother/pregnancy" : undefined} cancelLabel="Hủy" deleteAction={editing ? deletePregnancyCheckupAction : undefined} deleteId={editing?.id} deleteLabel="Xóa" />
      </CollapsibleRecordForm>
      <h2 className="mb-3 mt-7 text-lg font-semibold">Các lần khám và siêu âm</h2>
      <div className="space-y-2">
        {items.map((item) => {
          const ageLabel = gestationalAgeLabel(item.gestationalWeek, item.gestationalDay);
          const metrics = [
            item.weightKg != null ? `Mẹ ${item.weightKg} kg` : undefined,
            item.bloodPressure ? `HA ${item.bloodPressure}` : undefined,
            item.fetalHeartRate != null ? `Tim thai ${item.fetalHeartRate}` : undefined,
            item.estimatedFetalWeightG != null ? `Thai ~${item.estimatedFetalWeightG} g` : undefined,
          ].filter(Boolean);
          const ultrasoundSummary = [
            item.placentaPosition ? `Nhau: ${item.placentaPosition}` : undefined,
            item.amnioticFluid ? `Ối: ${item.amnioticFluid}` : undefined,
          ].filter(Boolean);

          return (
            <div key={item.id} className="flex items-start gap-3 rounded-2xl bg-card p-3 shadow-sm">
              <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300">
                <CalendarCheck className="size-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-medium">
                  {VISIT_TYPE_LABEL[item.visitType] ?? "Lần khám"}{ageLabel ? ` · ${ageLabel}` : ""}
                </p>
                <p className="text-xs text-muted-foreground">
                  {new Intl.DateTimeFormat(locale, { day: "2-digit", month: "long", year: "numeric" }).format(item.checkedAt)}
                  {item.facility ? ` · ${item.facility}` : ""}
                </p>
                {metrics.length > 0 && (
                  <p className="mt-1 flex items-start gap-1.5 text-xs text-muted-foreground">
                    <Scale className="mt-0.5 size-3 shrink-0" />
                    <span>{metrics.join(" · ")}</span>
                  </p>
                )}
                {ultrasoundSummary.length > 0 && <p className="mt-1 text-xs text-muted-foreground">{ultrasoundSummary.join(" · ")}</p>}
                {item.findings && <p className="mt-1 line-clamp-2 text-sm">{item.findings}</p>}
              </div>
              <RecordActions id={item.id} editHref={`/mother/pregnancy?edit=${item.id}`} deleteAction={deletePregnancyCheckupAction} editLabel="Sửa" deleteLabel="Xóa" />
            </div>
          );
        })}
        {!items.length && <p className="rounded-2xl border border-dashed p-6 text-center text-sm text-muted-foreground">Chưa có lần khám hoặc siêu âm nào.</p>}
      </div>
    </>
  );
}
