"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Heart, Sparkles, Leaf } from "lucide-react";
import { useState } from "react";
import references from "@/features/mother/pregnancy-week-reference.json";
import styles from "./pregnancy.module.css";
import { PregnancyJourneyCare, type JourneyCareData } from "./pregnancy-journey-care";

export function PregnancyWeekJourney({ initialWeek, currentWeek, days = 0, active, dueDate, deliveredOn, compact = false, care }: {
  initialWeek?: number; currentWeek?: number; days?: number; active: boolean; dueDate?: string; deliveredOn?: string; compact?: boolean; care?: JourneyCareData;
}) {
  const [week, setWeek] = useState(Math.min(41, Math.max(1, initialWeek ?? 20)));
  const sameWeek = currentWeek === week;
  const first = Math.min(35, Math.max(1, week - 3));
  const trimester = week <= 12 ? 1 : week <= 27 ? 2 : 3;
  const source = `https://www.nhs.uk/best-start-in-life/pregnancy/week-by-week-guide-to-pregnancy/${trimester === 1 ? "1st" : trimester === 2 ? "2nd" : "3rd"}-trimester/week-${Math.max(4, week)}/`;
  const reference = references.find((entry) => entry.week === week);
  return <><section className={styles.hero} aria-label="Hành trình theo tuần">
    <div className={styles.heroTop}><span className={styles.eyebrow}>{active ? "Mỗi ngày, gần con hơn" : "Một hành trình yêu thương"}</span><span className={styles.badge}><Sparkles size={12} />{active && sameWeek ? "Tuần hiện tại" : "Khám phá tuần thai"}</span></div>
    <div className={styles.heroBody}>
      <div><h2 className={styles.heroTitle}>Tuần {week}<em>{sameWeek && active ? `${days} ngày bên con` : "con lớn từng ngày"}</em></h2>
        <p className={styles.muted}>{!active ? "Xem lại từng dấu mốc trong hành trình của mẹ và bé." : sameWeek ? "Một chút chăm sóc hôm nay, một hành trình bình an hơn." : "Bạn đang xem nội dung tham khảo của tuần được chọn."}</p>
        {!compact && <Link className={styles.textLink} href="/profile/pregnancy">Thông tin thai kỳ <ChevronRight size={13} /></Link>}
        {active && currentWeek != null && <><div className={styles.progress} aria-label={`Tuần thai hiện tại ${currentWeek} trên mốc 40 tuần`}><span style={{ width: `${Math.min(100, currentWeek / 40 * 100)}%` }} /></div><p className="mt-2 text-[10px] text-muted-foreground">{sameWeek ? "Theo mốc thai kỳ đã lưu" : `Tuổi thai hiện tại: ${currentWeek} tuần ${days} ngày`}</p></>}
        {active && currentWeek == null && <Link href="/profile/pregnancy" className={styles.textLink}>Thêm mốc tính tuổi thai →</Link>}
      </div>
      <div className={styles.heroArt}><Image src="/images/pregnancy/journey-baby.webp" alt="Minh họa em bé ngủ cuộn tròn, không mô phỏng số đo thực tế" fill loading="eager" sizes="(max-width: 600px) 180px, 360px" /></div>
    </div>
    <div className={styles.weekStrip}>
      <button className={styles.iconButton} disabled={week === 1} onClick={() => setWeek((w) => w - 1)} aria-label="Tuần trước"><ChevronLeft size={18} /></button>
      <div className={styles.weekNumbers}>{Array.from({ length: 7 }, (_, i) => first + i).map((value) => <button key={value} className={styles.week} aria-pressed={week === value} aria-label={`Xem tuần ${value}`} onClick={() => setWeek(value)}>{value}</button>)}</div>
      <button className={styles.iconButton} disabled={week === 41} onClick={() => setWeek((w) => w + 1)} aria-label="Tuần sau"><ChevronRight size={18} /></button>
    </div>
    {reference && <div className={styles.weekFact}><div className="flex items-center gap-3"><span className={styles.toolIcon}><Leaf size={21} strokeWidth={1.5} /></span><div><p className={styles.eyebrow}>Kích thước tham khảo · Tuần {week}</p><p className="mt-1 text-sm font-semibold">Khoảng cỡ {reference.comparison}</p></div></div>{reference.length != null && <div className="text-right"><strong className="text-lg font-semibold">{new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 1 }).format(reference.length)} <span className="text-xs font-normal">{reference.unit}</span></strong><p className="text-[9px] text-muted-foreground">{reference.basis === "headToHeel" ? "đầu đến gót chân" : "đầu đến mông"}</p></div>}<p className="col-span-2 text-[9px] leading-4 text-muted-foreground">Theo <a href={reference.source} target="_blank" rel="noreferrer" className="underline">NHS</a>, không phải số đo của bé trên phiếu siêu âm.</p></div>}
    <dl className={styles.heroFoot}><div><dt>ĐANG XEM</dt><dd>Tuần {week} · Giai đoạn {trimester}</dd></div><div><dt>{deliveredOn ? "BÉ CHÀO ĐỜI" : "NGÀY DỰ SINH"}</dt><dd>{deliveredOn || dueDate || "Chưa cập nhật"}</dd></div><div><dt>CẨM NANG TUẦN</dt><dd><a href={source} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1">NHS <ChevronRight size={12} /></a></dd></div></dl>
    <p className="flex items-center justify-center gap-1.5 px-3 py-2 text-[9px] text-muted-foreground"><Heart size={10} />Hình minh họa cảm xúc, không thay đổi theo số đo của bé.</p>
  </section>{care && <PregnancyJourneyCare week={week} currentWeek={currentWeek} active={active} data={care} />}</>;
}
