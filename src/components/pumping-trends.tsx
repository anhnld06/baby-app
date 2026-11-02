import Link from "next/link";
import type { pumpingTrends } from "@/features/pumping/trends";

export function PumpingTrends({ trend, babyName, locale }: {
  trend: ReturnType<typeof pumpingTrends>; babyName?: string; locale: "vi" | "en";
}) {
  const vi = locale === "vi";
  const number = (n: number) => new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }).format(n);
  const volume = (n: number | null) => n == null ? "—" : `${number(n)} ml`;
  return <section className="mt-7 space-y-3 rounded-2xl bg-card p-4 shadow-sm" aria-labelledby="pumping-trends-title">
    <h2 id="pumping-trends-title" className="text-lg font-semibold">{vi ? "Xu hướng hút sữa" : "Pumping trends"}</h2>
    <p className="text-sm text-muted-foreground">{vi ? "7 ngày trọn vẹn gần nhất, không tính hôm nay đang ghi dở. Số liệu chỉ gồm các cữ đã ghi, không phải đánh giá đủ hay thiếu sữa." : "The last 7 complete days, excluding today. Figures describe logged sessions, not whether milk supply is sufficient."}</p>
    <div className="grid grid-cols-2 gap-3 text-sm">
      <div><p className="text-muted-foreground">{vi ? "7 ngày gần nhất" : "Last 7 days"}</p><p className="text-lg font-semibold">{trend.current.recordedDays ? volume(trend.current.totalMl) : "—"}</p><p>{trend.current.recordedDays}/7 {vi ? "ngày có lượng sữa" : "days with volumes"}</p></div>
      <div><p className="text-muted-foreground">{vi ? "7 ngày trước đó" : "Previous 7 days"}</p><p className="text-lg font-semibold">{trend.previous.recordedDays ? volume(trend.previous.totalMl) : "—"}</p><p>{trend.previous.recordedDays}/7 {vi ? "ngày có lượng sữa" : "days with volumes"}</p></div>
    </div>
    <p className="text-sm">{trend.changePercent == null
      ? (vi ? "Chưa đủ dữ liệu để so sánh phần trăm: cần có lượng sữa cả 7 ngày của mỗi giai đoạn, không còn cữ chờ nhập ml và tổng kỳ trước lớn hơn 0." : "Percentage comparison needs volumes on all 7 days in both periods, no sessions awaiting volumes, and a previous total above zero.")
      : (vi ? `Tổng lượng đã ghi ${trend.changePercent >= 0 ? "tăng" : "giảm"} ${number(Math.abs(trend.changePercent))}% so với 7 ngày trước đó. Thay đổi số cữ hoặc mức độ ghi chép cũng ảnh hưởng kết quả.` : `Logged volume ${trend.changePercent >= 0 ? "increased" : "decreased"} ${number(Math.abs(trend.changePercent))}% from the previous 7 days. Session counts and logging completeness also affect this figure.`)}</p>
    {trend.current.pending > 0 && <p className="text-sm text-muted-foreground">{vi ? `${trend.current.pending} cữ chưa nhập ml trong 7 ngày gần nhất; chưa cộng vào tổng lượng.` : `${trend.current.pending} sessions await milk volumes and are excluded from volume totals.`}</p>}
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <caption className="sr-only">{vi ? "Lượng sữa từng ngày" : "Daily milk volumes"}</caption>
        <thead><tr className="border-b"><th className="py-2 pr-2">{vi ? "Ngày" : "Date"}</th><th className="p-2">{vi ? "Cữ hút" : "Sessions"}</th><th className="p-2">{vi ? "Đã hút" : "Pumped"}</th>{babyName && <th className="py-2 pl-2">{vi ? "Sữa mẹ uống bình" : "Breast milk by bottle"}</th>}</tr></thead>
        <tbody>{trend.rows.map((row) => <tr key={row.day} className="border-b last:border-0">
          <th scope="row" className="py-3 pr-2 font-normal">{row.day.slice(8)}/{row.day.slice(5, 7)}</th>
          <td className="p-2">{row.count || "—"}{row.pending ? <span className="block text-xs text-muted-foreground">{row.pending} {vi ? "chờ ml" : "pending"}</span> : null}</td>
          <td className="p-2 tabular-nums">{volume(row.pumpedMl)}</td>
          {babyName && <td className="py-3 pl-2 tabular-nums">{volume(row.bottleMl)}{row.bottlePending ? <span className="block text-xs text-muted-foreground">{row.bottlePending} {vi ? "chờ ml" : "pending"}</span> : null}</td>}
        </tr>)}</tbody>
      </table>
    </div>
    <p className="text-xs text-muted-foreground">{vi ? "— nghĩa là chưa có lượng được ghi, không phải 0 ml." : "— means no volume was logged; it does not mean zero."}</p>
    {babyName && <p className="text-sm text-muted-foreground">{vi ? `Cột uống bình chỉ tính loại “Sữa mẹ bình” của ${babyName}, không gồm sữa công thức, cữ kết hợp hoặc bú trực tiếp. Lượng hút thuộc mẹ và có thể dùng cho nhiều bé hoặc trữ lại, nên không dùng chênh lệch để kết luận đủ/thiếu hay tính tồn kho.` : `Bottle volumes include only breast-milk bottle feeds for ${babyName}, excluding formula, mixed feeds and direct breastfeeding. Pumped milk belongs to the mother and may be stored or shared among babies, so these figures do not determine sufficiency or inventory.`}</p>}
    <p className="text-sm text-muted-foreground">{vi ? "Lượng hút không phản ánh đầy đủ nguồn sữa. Khi lo bé bú chưa đủ, cần xem cùng diễn biến cân nặng, tã và trao đổi với bác sĩ hoặc chuyên viên tư vấn sữa mẹ." : "Pumped volume does not fully reflect milk supply. If concerned about intake, review weight and diaper patterns with a clinician or lactation specialist."} <a href="https://www2.hse.ie/babies-children/breastfeeding/common-challenges/breast-milk-supply/" target="_blank" rel="noreferrer" className="underline">{vi ? "Tham khảo HSE" : "HSE guidance"}</a></p>
    {babyName && <div className="flex flex-wrap gap-4 text-sm text-primary"><Link href="/tracking/diaper" className="inline-flex min-h-11 items-center underline">{vi ? "Xem nhật ký tã" : "View diaper log"}</Link><Link href="/tracking/growth" className="inline-flex min-h-11 items-center underline">{vi ? "Xem tăng trưởng" : "View growth"}</Link></div>}
  </section>;
}
