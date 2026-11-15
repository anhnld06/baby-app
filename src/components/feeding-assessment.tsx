"use client";

import { useState } from "react";
import { compareFeeding } from "@/features/feeding-reference/reference";

export function FeedingAssessment({ ml, range, eligible, ended, vi }: {
  ml: number; range: { min: number; max: number } | null; eligible: boolean; ended: boolean; vi: boolean;
}) {
  const [confirmed, setConfirmed] = useState(false);
  const result = compareFeeding(ml, range, eligible && ended && confirmed);
  return <div className="mt-4 border-t border-border/60 pt-4">
    {!ended ? <p className="text-sm text-muted-foreground">{vi ? "Hôm nay đang ghi nhận · Chưa đánh giá thiếu/thừa khi ngày chưa kết thúc." : "Today is in progress · No low/high assessment before the day ends."}</p>
      : eligible ? <label className="flex min-h-11 cursor-pointer items-start gap-3 text-sm"><input className="mt-1 size-4 shrink-0 accent-orange-600" type="checkbox" checked={confirmed} onChange={e => setConfirmed(e.target.checked)} />{vi ? "Tôi đã ghi đủ mọi cữ và lượng sữa trong ngày. Bé khỏe mạnh, đủ tháng, chỉ dùng sữa công thức và không có kế hoạch dinh dưỡng riêng." : "All feeds and volumes are logged. Baby is healthy, full-term, exclusively formula-fed and has no individual feeding plan."}</label>
      : <p className="text-sm text-muted-foreground">{vi ? "Chưa đủ điều kiện so tổng ml: cần đủ lượng mọi cữ, chỉ dùng sữa công thức và có cân nặng gần đây trong độ tuổi áp dụng." : "Volume comparison needs complete formula-only volumes and a recent weight within the supported age range."}</p>}
    {ended && eligible && !confirmed && <p className="mt-2 text-xs text-muted-foreground">{vi ? "Xác nhận nhật ký đầy đủ để xem chênh lệch với khoảng tham khảo." : "Confirm complete logs to compare with the reference range."}</p>}
    {result.status !== "unknown" && <div className={`mt-3 rounded-2xl p-4 ${result.status === "within" ? "bg-teal-50 text-teal-950 dark:bg-teal-950 dark:text-teal-100" : "bg-amber-50 text-amber-950 dark:bg-amber-950 dark:text-amber-100"}`} role="status">
      <p className="font-semibold">{result.status === "within" ? (vi ? "Trong khoảng tham khảo" : "Within reference range") : result.status === "low" ? (vi ? `Thấp hơn biên dưới ${result.delta} ml` : `${result.delta} ml below the lower reference`) : (vi ? `Cao hơn biên trên ${result.delta} ml` : `${result.delta} ml above the upper reference`)}</p>
      <p className="mt-2 text-sm leading-6">{result.status === "low" ? (vi ? "Kiểm tra lại lượng thực uống và cữ bị bỏ sót. Quan sát tín hiệu đói, tã ướt và diễn biến cân nặng. Nếu bé thường xuyên uống ít hoặc bạn lo lắng, liên hệ bác sĩ/chuyên viên tư vấn. Không ép bú bù số ml chênh lệch." : "Check consumed volumes and missed entries. Review hunger cues, wet diapers and weight. Contact a clinician if intake stays low or you are concerned; do not force catch-up feeds.") : result.status === "high" ? (vi ? "Kiểm tra có nhập trùng hoặc nhập lượng pha thay vì lượng thực uống không. Cho bú theo tín hiệu đói–no, không ép hết bình hoặc tự cắt cữ. Nếu tình trạng kéo dài, trao đổi với bác sĩ." : "Check duplicates and record milk consumed rather than prepared. Follow hunger/fullness cues; do not force bottles or cut feeds. Discuss persistent differences with a clinician.") : (vi ? "Tiếp tục cho bú theo tín hiệu đói–no, theo dõi tã và tăng trưởng. Nằm trong khoảng tham khảo chưa đủ để khẳng định bé bú đủ." : "Continue responsive feeding and monitor diapers and growth. Being within range does not establish adequate intake.")}</p>
    </div>}
    <p className="mt-3 text-xs leading-5 text-muted-foreground">{vi ? "Nếu bé khó đánh thức, bú kém rõ hoặc tã ướt giảm bất thường, cần được nhân viên y tế đánh giá sớm; không chờ tổng kết cuối ngày." : "Seek prompt medical assessment for unusual difficulty waking, poor feeding or a marked drop in wet diapers; do not wait for a daily summary."}</p>
  </div>;
}
