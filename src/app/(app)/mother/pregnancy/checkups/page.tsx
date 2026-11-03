import Link from "next/link";
import { AlertTriangle, CheckCircle2, ShieldAlert } from "lucide-react";
import styles from "@/components/pregnancy.module.css";
import { deletePregnancyCheckupAction, savePregnancyCheckupAction } from "@/app/actions";
import { CollapsibleRecordForm } from "@/components/collapsible-record-form";
import { FormActionBar } from "@/components/form-action-bar";
import { PregnancyVisitTimeline } from "@/components/pregnancy-visit-timeline";
import { ULTRASOUND_PROGRESS_SELECT, ultrasoundVisitFromRecord } from "@/features/mother/ultrasound-record";
import { PregnancyCheckupForm } from "@/components/pregnancy-checkup-form";
import { Card, CardContent } from "@/components/ui/card";
import { getAIProvider } from "@/features/ai/provider";
import { assessCheckup } from "@/features/mother/checkup-assessment";
import { pregnancyAge } from "@/features/mother/pregnancy";
import { selectRelevantPregnancy } from "@/features/mother/pregnancy";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { getLocale } from "@/lib/i18n";

const LEVEL_STYLE = {
  UNKNOWN: { icon: AlertTriangle, label: "Chưa đủ dữ liệu", className: "bg-secondary text-muted-foreground" },
  GOOD: { icon: CheckCircle2, label: "Chưa thấy vượt ngưỡng", className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300" },
  WATCH: { icon: AlertTriangle, label: "Cần theo dõi", className: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300" },
  URGENT: { icon: ShieldAlert, label: "Cần khám sớm", className: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300" },
} as const;

export default async function PregnancyTrackingPage({ searchParams }: { searchParams: Promise<{ edit?: string; page?: string }> }) {
  const [user, locale, params] = await Promise.all([requireUser(), getLocale(), searchParams]);
  const mother = await db.mother.findUnique({ where: { userId: user.id }, include: { pregnancies: { orderBy: { createdAt: "desc" } } } });
  const pregnancy = selectRelevantPregnancy(mother?.pregnancies ?? []);
  if (!mother || !pregnancy) return <><div className="rounded-2xl border border-dashed p-6 text-center text-sm text-muted-foreground">Hãy thêm thông tin thai kỳ trong Hồ sơ trước.<Link href="/profile/pregnancy" className="mt-3 block font-medium text-primary">Thêm thai kỳ</Link></div></>;
  const requestedPage = Number(params.page ?? 1);
  const page = Number.isSafeInteger(requestedPage) && requestedPage > 0 ? Math.min(requestedPage, 10000) : 1;
  const [rows, editing, latest, ultrasoundRecords, total] = await Promise.all([
    db.pregnancyCheckup.findMany({ where: { pregnancyId: pregnancy.id }, orderBy: [{ checkedAt: "desc" }, { id: "desc" }], skip: (page - 1) * 30, take: 31 }),
    params.edit ? db.pregnancyCheckup.findFirst({ where: { id: params.edit, pregnancyId: pregnancy.id } }) : null,
    db.pregnancyCheckup.findFirst({ where: { pregnancyId: pregnancy.id }, orderBy: [{ checkedAt: "desc" }, { id: "desc" }] }),
    db.pregnancyCheckup.findMany({ where: { pregnancyId: pregnancy.id, visitType: { in: ["ULTRASOUND", "COMBINED"] } }, select: ULTRASOUND_PROGRESS_SELECT }),
    db.pregnancyCheckup.count({ where: { pregnancyId: pregnancy.id } }),
  ]);
  const items = rows.slice(0, 30);
  const visits = ultrasoundRecords.map((item) => ultrasoundVisitFromRecord(item, user.timezone));
  const age = pregnancyAge(pregnancy, new Date(), user.timezone);
  const assessment = latest && pregnancy.pregnancyStatus === "PREGNANT"
    ? assessCheckup({
        gestationalWeek: latest.gestationalWeek,
        bloodPressure: latest.bloodPressure,
        fetalHeartRate: latest.fetalHeartRate,
      })
    : null;
  let aiNote: { summary: string; suggestions: string[] } | null = null;
  if (latest && assessment && assessment.level !== "UNKNOWN") {
    try {
      aiNote = await getAIProvider().assessCheckup({
        checkup: {
          gestationalWeek: latest.gestationalWeek ?? undefined,
          weightKg: latest.weightKg ?? undefined,
          bloodPressure: latest.bloodPressure ?? undefined,
          fetalHeartRate: latest.fetalHeartRate ?? undefined,
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
      <div className={styles.intro}><span className={styles.eyebrow}>Hồ sơ của mẹ & bé</span><h2 className={styles.heading}>Khám & lịch</h2><p className={styles.muted}>Phiếu khám, siêu âm và lời dặn. Giữ nguyên những gì bác sĩ đã ghi.</p></div>
      <section className={`${styles.panel} flex items-center justify-between gap-3`}><div><p className={styles.eyebrow}>{pregnancy.pregnancyStatus === "PREGNANT" ? "Thai kỳ đang theo dõi" : "Hồ sơ thai kỳ"}</p><p className="mt-1 text-sm">{age ? `${age.weeks} tuần ${age.days} ngày · ` : ""}Dự sinh {pregnancy.estimatedDueDate ? new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeZone: "UTC" }).format(pregnancy.estimatedDueDate) : "chưa ghi"}</p></div><Link className={styles.textLink} href="/profile/pregnancy">Chỉnh sửa</Link></section>
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
      <CollapsibleRecordForm prominent editingId={editing?.id} key={`${editing?.id ?? "new"}-${items.length}`} defaultOpen={!!editing} addLabel="Thêm lần khám mới" closeLabel="Hủy">
        <Card className="border-0 shadow-sm"><CardContent className="p-5">
          <PregnancyCheckupForm pregnancyId={pregnancy.id} editing={editing} estimatedDueDate={pregnancy.estimatedDueDate?.toISOString()} lastMenstrualPeriod={pregnancy.lastMenstrualPeriod?.toISOString()} active={pregnancy.pregnancyStatus === "PREGNANT"} timeZone={user.timezone} />
        </CardContent></Card>
        <FormActionBar formId="checkup-form" saveAction={savePregnancyCheckupAction} saveLabel={editing ? "Cập nhật" : "Lưu lần khám"} cancelHref={editing ? "/mother/pregnancy/checkups" : undefined} cancelLabel="Hủy" deleteAction={editing ? deletePregnancyCheckupAction : undefined} deleteId={editing?.id} deleteLabel="Xóa" />
      </CollapsibleRecordForm>
      <div className={styles.sectionHeading}><div><span className={styles.eyebrow}>Mỗi lần khám, một dấu mốc</span><h2>Các lần khám và siêu âm</h2></div><span className={styles.muted}>{total} lần đã lưu</span></div>
      <PregnancyVisitTimeline items={items} visits={visits} timeZone={user.timezone} latestId={latest?.id} orderStart={total - (page - 1) * 30} allowDelete idPrefix="prenatal" label="Timeline khám thai và siêu âm" />
      {!items.length && <p className="rounded-2xl border border-dashed p-6 text-center text-sm text-muted-foreground">Chưa có lần khám hoặc siêu âm nào.</p>}
      <nav aria-label="Phân trang khám thai" className="mt-5 flex justify-between text-sm">
        {page > 1 ? <Link className="p-3 underline" href={`/mother/pregnancy/checkups?page=${page - 1}`}>Trang trước</Link> : <span />}
        {rows.length > 30 && <Link className="p-3 underline" href={`/mother/pregnancy/checkups?page=${page + 1}`}>Trang sau</Link>}
      </nav>
    </>
  );
}
