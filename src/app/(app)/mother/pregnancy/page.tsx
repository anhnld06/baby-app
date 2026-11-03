import { PushNotificationSettings } from "@/components/push-notification-settings";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Activity, Archive, BookHeart, CalendarDays, ChevronRight, Footprints, Heart, Scale, ScanLine } from "lucide-react";
import { PregnancyEmpty } from "@/components/pregnancy-section";
import { PregnancyWeekJourney } from "@/components/pregnancy-week-journey";
import { PregnancyInsights } from "@/components/pregnancy-insights";
import { getMaternalData } from "@/features/mother/maternal-data";
import { maternalMetricSummary } from "@/features/mother/maternal-observations";
import { getPregnancyContext } from "@/features/mother/pregnancy-data";
import { getLibraryIndex } from "@/features/knowledge/library-data";
import { explicitPrenatalFollowupDate } from "@/features/reminders/prenatal";
import { db } from "@/lib/db";
import { toDateTimeLocal } from "@/lib/date";
import styles from "@/components/pregnancy.module.css";

export default async function PregnancyPage({ searchParams }: { searchParams: Promise<{ edit?: string }> }) {
  const params = await searchParams;
  if (params.edit) redirect(`/mother/pregnancy/checkups?edit=${encodeURIComponent(params.edit)}`);
  const { user, mother, pregnancy, age } = await getPregnancyContext();
  if (!pregnancy || !mother) return <PregnancyEmpty />;
  const [checkups, library, memories, maternal, journey] = await Promise.all([
    db.pregnancyCheckup.findMany({ where: { pregnancyId: pregnancy.id }, orderBy: { checkedAt: "desc" }, select: { id: true, checkedAt: true, checkedAtTimeKnown: true, findings: true, followupInstruction: true, gestationalWeek: true, careInstructions: true, visitType: true, weightKg: true, fetalHeartRate: true, estimatedFetalWeightG: true } }),
    getLibraryIndex(),
    db.pregnancyJournalEntry.count({ where: { pregnancyId: pregnancy.id, kind: "MEMORY" } }),
    getMaternalData(pregnancy.id, user.timezone),
    db.pregnancyJourneyTask.findMany({ where: { pregnancyId: pregnancy.id } }),
  ]);
  const active = pregnancy.pregnancyStatus === "PREGNANT";
  const today = toDateTimeLocal(new Date(), user.timezone).slice(0, 10);
  const nextAppointment = active ? checkups.flatMap((item) => {
    const date = explicitPrenatalFollowupDate(item.followupInstruction);
    return date && date.toISOString().slice(0, 10) >= today ? [{ date, id: item.id }] : [];
  }).sort((a, b) => a.date.getTime() - b.date.getTime())[0] : null;
  const format = (date: Date) => new Intl.DateTimeFormat("vi-VN", { dateStyle: "medium", timeZone: "UTC" }).format(date);
  const latest = checkups[0];
  const latestAdvice = checkups.find((item) => item.careInstructions?.trim());
  const latestHeart = checkups.find((item) => item.visitType !== "PRENATAL_VISIT" && item.fetalHeartRate != null);
  const latestFetalWeight = checkups.find((item) => item.visitType !== "PRENATAL_VISIT" && item.estimatedFetalWeightG != null);
  const recordedDate = (item: typeof latest) => new Intl.DateTimeFormat("vi-VN", { dateStyle: "medium", timeZone: item.checkedAtTimeKnown ? user.timezone : "UTC" }).format(item.checkedAt);
  const weightSummary = maternalMetricSummary(maternal.observations, "weightKg");
  const weight = weightSummary?.latest.value;
  const weightDay = weightSummary?.latest.day;
  const status = { PREGNANT: "Hành trình của mẹ", PLANNING: "Chuẩn bị đón con", DELIVERED: "Hành trình đã đón con", ENDED: "Hành trình đã lưu" }[pregnancy.pregnancyStatus];
  return <>
    <div className="mb-5 flex items-end justify-between gap-3"><div><p className={styles.eyebrow}>{status}</p><h2 className={styles.heading}>{active ? "Chào mẹ, hôm nay thế nào?" : "Những ngày mình chờ con"}</h2></div><Heart className="mb-1 shrink-0 text-rose-300" size={22} /></div>
    {!active && <div className={styles.archive}><Archive size={17} className="shrink-0" /><span>{pregnancy.pregnancyStatus === "DELIVERED" ? `Bé đã chào đời${pregnancy.actualDeliveryDate ? ` ngày ${format(pregnancy.actualDeliveryDate)}` : ""}. Cùng nhìn lại những dấu mốc của mẹ.` : pregnancy.pregnancyStatus === "PLANNING" ? "Mẹ có thể khám phá các tuần thai và chuẩn bị cho hành trình sắp tới." : "Thai kỳ đã kết thúc. Những ghi chép của mẹ được giữ lại tại đây."}</span></div>}
    {active && <PushNotificationSettings publicKey={process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY} description="Dùng chung cài đặt với Hồ sơ. Nhắc khi bắt đầu tuần thai mới (tuần 4–40) và trước lịch khám đã lưu; không tự tạo chỉ định khám hay bổ sung."/>}
    <PregnancyWeekJourney care={{ pregnancyId: pregnancy.id, today, saved: journey.map((row) => ({ taskKey: row.taskKey, done: row.done, note: row.note, remindOn: row.remindOn?.toISOString().slice(0, 10) ?? "" })), visits: checkups.map((row) => ({ id: row.id, week: row.gestationalWeek, scan: row.visitType !== "PRENATAL_VISIT", date: recordedDate(row) })), advice: latestAdvice?.careInstructions, adviceId: latestAdvice?.id }} key={pregnancy.id} initialWeek={age?.weeks ?? latest?.gestationalWeek ?? undefined} currentWeek={age?.weeks} days={age?.days} active={active} dueDate={pregnancy.estimatedDueDate ? format(pregnancy.estimatedDueDate) : undefined} deliveredOn={pregnancy.actualDeliveryDate ? format(pregnancy.actualDeliveryDate) : undefined} />
    <div className={styles.sectionHeading}><h2>{active ? "Dành một chút cho mẹ & bé" : "Công cụ & nhật ký"}</h2><span className={styles.muted}>Gọn trong một chạm</span></div>
    <div className={styles.tools}>{[
      { href: "baby/kicks", label: "Cử động thai", icon: Footprints }, { href: "health/contractions", label: "Cơn co", icon: Activity },
      { href: "health/measurements", label: "Cân nặng", icon: Scale }, { href: "health?new=1", label: "Nhật ký mẹ", icon: BookHeart },
    ].map(({ href, label, icon: Icon }) => <Link key={href} href={`/mother/pregnancy/${href}`} className={styles.tool}><span className={styles.toolIcon}><Icon size={22} strokeWidth={1.6} /></span><strong>{label}</strong></Link>)}</div>
    <div className={styles.sectionHeading}><h2>{active ? "Hành trình tuần này" : "Hành trình của gia đình"}</h2><Link href="/mother/pregnancy/checkups" className={styles.textLink}>Sổ khám <ChevronRight size={13} /></Link></div>
    <div className={styles.dashboardGrid}>
      <section className={styles.panel}><div className={styles.appointment}><div className={styles.dateBadge}>{nextAppointment ? <><strong>{nextAppointment.date.getUTCDate()}</strong><span>THÁNG {nextAppointment.date.getUTCMonth() + 1}</span></> : <CalendarDays size={25} strokeWidth={1.5} />}</div><div><p className={styles.eyebrow}>{active ? "Lịch khám tiếp theo" : "Sổ khám thai"}</p><h3 className="mt-1 text-sm font-semibold">{nextAppointment ? format(nextAppointment.date) : `${checkups.length} lần khám đã ghi`}</h3><p className={styles.muted}>{nextAppointment ? "Theo ngày hẹn trên phiếu khám" : active ? "Chưa có lịch hẹn sắp tới" : "Khám, siêu âm và lời dặn của bác sĩ"}</p></div></div><Link href="/mother/pregnancy/checkups" className={`${styles.textLink} mt-2`}>{nextAppointment ? "Xem lịch & phiếu khám" : "Mở Khám & lịch"}<ChevronRight size={13} /></Link></section>
      <Link href="/mother/pregnancy/memories" className={`${styles.panel} ${styles.paper}`}><BookHeart size={22} className="text-rose-400" strokeWidth={1.5} /><h3 className="mb-1 mt-3 text-sm font-semibold">Có những điều chỉ mẹ nhớ</h3><p className={styles.muted}>{memories ? `${memories} kỷ niệm đã được cất giữ. Thêm một chút hôm nay vào hành trình của con.` : "Một lá thư, một dấu mốc. Giữ lại những ngày con còn trong bụng mẹ."}</p><span className={styles.textLink}>Mở hộp kỷ niệm <ChevronRight size={13} /></span></Link>
    </div>
    <section className={styles.panel}><div className="mb-4 flex items-center gap-2"><ScanLine size={17} className="text-rose-400" /><h2 className="text-sm font-semibold">Ghi nhận gần nhất</h2></div><dl className={styles.numbers}><div className={styles.number}><dt className={styles.muted}>Cân nặng mẹ</dt><dd><strong>{weight != null ? `${weight} kg` : "—"}</strong>{weightDay && <span>{weightDay.split("-").reverse().join("/")}</span>}</dd></div><div className={styles.number}><dt className={styles.muted}>Tim thai siêu âm</dt><dd><strong>{latestHeart?.fetalHeartRate != null ? `${latestHeart.fetalHeartRate}` : "—"}</strong>{latestHeart && <span>{recordedDate(latestHeart)}</span>}<span>lần/phút</span></dd></div><div className={styles.number}><dt className={styles.muted}>Thai ước tính</dt><dd><strong>{latestFetalWeight?.estimatedFetalWeightG != null ? `${latestFetalWeight.estimatedFetalWeightG} g` : "—"}</strong>{latestFetalWeight && <span>{recordedDate(latestFetalWeight)}</span>}</dd></div></dl><p className={`${styles.muted} mt-3`}>{latest ? `Phiếu khám gần nhất: ${new Intl.DateTimeFormat("vi-VN", { dateStyle: "medium", timeZone: latest.checkedAtTimeKnown ? user.timezone : "UTC" }).format(latest.checkedAt)}. Chỉ số thuộc ngày đo, không phải đánh giá hiện tại.` : "Thêm phiếu khám để lưu chỉ số của mẹ và bé."}</p></section>
    <div className={styles.sectionHeading}><h2>Mỗi ngày, hiểu thêm một chút</h2><Link href="/knowledge?stage=PREGNANCY" className={styles.textLink}>Xem tất cả <ChevronRight size={13} /></Link></div>
    <PregnancyInsights articles={library.map((row) => row.article).filter((article) => article.stage === "PREGNANCY")} />
  </>;
}
