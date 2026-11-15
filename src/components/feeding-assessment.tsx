"use client";

import { useState } from "react";
import { compareFeeding } from "@/features/feeding-reference/reference";
import { formatNumber } from "@/lib/format";

export function FeedingAssessment({ ml, range, eligible, ended }: {
  ml: number; range: { min: number; max: number } | null; eligible: boolean; ended: boolean;
}) {
  const [confirmed, setConfirmed] = useState(false);
  const result = compareFeeding(ml, range, eligible && ended && confirmed);
  return <div className="mt-4 border-t border-border/60 pt-4">
    {!ended ? <p className="text-sm text-muted-foreground">Hôm nay đang ghi nhận · Chưa đánh giá thiếu/thừa khi ngày chưa kết thúc.</p>
      : eligible ? <label className="flex min-h-11 cursor-pointer items-start gap-3 text-sm"><input className="mt-1 size-4 shrink-0 accent-orange-600" type="checkbox" checked={confirmed} onChange={e => setConfirmed(e.target.checked)} />Tôi đã ghi đủ mọi cữ và lượng sữa trong ngày. Bé khỏe mạnh, đủ tháng, chỉ dùng sữa công thức và không có kế hoạch dinh dưỡng riêng.</label>
      : <p className="text-sm text-muted-foreground">Chưa đủ điều kiện so tổng ml: cần đủ lượng mọi cữ, chỉ dùng sữa công thức và có cân nặng gần đây trong độ tuổi áp dụng.</p>}
    {ended && eligible && !confirmed && <p className="mt-2 text-xs text-muted-foreground">Xác nhận nhật ký đầy đủ để xem chênh lệch với khoảng tham khảo.</p>}
    {result.status !== "unknown" && <div className={`mt-3 rounded-2xl p-4 ${result.status === "within" ? "bg-teal-50 text-teal-950 dark:bg-teal-950 dark:text-teal-100" : "bg-amber-50 text-amber-950 dark:bg-amber-950 dark:text-amber-100"}`} role="status">
      <p className="font-semibold">{result.status === "within" ? "Trong khoảng tham khảo" : result.status === "low" ? `Thấp hơn biên dưới ${formatNumber(result.delta)} ml` : `Cao hơn biên trên ${formatNumber(result.delta)} ml`}</p>
      <p className="mt-2 text-sm leading-6">{result.status === "low" ? "Kiểm tra lại lượng thực uống và cữ bị bỏ sót. Quan sát tín hiệu đói, tã ướt và diễn biến cân nặng. Nếu bé thường xuyên uống ít hoặc bạn lo lắng, liên hệ bác sĩ/chuyên viên tư vấn. Không ép bú bù số ml chênh lệch." : result.status === "high" ? "Kiểm tra có nhập trùng hoặc nhập lượng pha thay vì lượng thực uống không. Cho bú theo tín hiệu đói–no, không ép hết bình hoặc tự cắt cữ. Nếu tình trạng kéo dài, trao đổi với bác sĩ." : "Tiếp tục cho bú theo tín hiệu đói–no, theo dõi tã và tăng trưởng. Nằm trong khoảng tham khảo chưa đủ để khẳng định bé bú đủ."}</p>
    </div>}
    <p className="mt-3 text-xs leading-5 text-muted-foreground">Nếu bé khó đánh thức, bú kém rõ hoặc tã ướt giảm bất thường, cần được nhân viên y tế đánh giá sớm; không chờ tổng kết cuối ngày.</p>
  </div>;
}
