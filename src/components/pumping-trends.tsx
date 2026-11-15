import Link from "next/link";
import type { pumpingTrends } from "@/features/pumping/trends";
import { formatNumber } from "@/lib/format";

export function PumpingTrends({ trend, babyName }: {
  trend: ReturnType<typeof pumpingTrends>; babyName?: string;
}) {
  const volume = (n: number | null) => n == null ? "—" : `${formatNumber(n, 1)} ml`;
  return <section className="mt-7 space-y-3 rounded-2xl bg-card p-4 shadow-sm" aria-labelledby="pumping-trends-title">
    <h2 id="pumping-trends-title" className="text-lg font-semibold">Xu hướng hút sữa</h2>
    <p className="text-sm text-muted-foreground">7 ngày trọn vẹn gần nhất, không tính hôm nay đang ghi dở. Số liệu chỉ gồm các cữ đã ghi, không phải đánh giá đủ hay thiếu sữa.</p>
    <div className="grid grid-cols-2 gap-3 text-sm">
      <div><p className="text-muted-foreground">7 ngày gần nhất</p><p className="text-lg font-semibold">{trend.current.recordedDays ? volume(trend.current.totalMl) : "—"}</p><p>{trend.current.recordedDays}/7 {"ngày có lượng sữa"}</p></div>
      <div><p className="text-muted-foreground">7 ngày trước đó</p><p className="text-lg font-semibold">{trend.previous.recordedDays ? volume(trend.previous.totalMl) : "—"}</p><p>{trend.previous.recordedDays}/7 {"ngày có lượng sữa"}</p></div>
    </div>
    <p className="text-sm">{trend.changePercent == null
      ? "Chưa đủ dữ liệu để so sánh phần trăm: cần có lượng sữa cả 7 ngày của mỗi giai đoạn, không còn cữ chờ nhập ml và tổng kỳ trước lớn hơn 0."
      : (`Tổng lượng đã ghi ${trend.changePercent >= 0 ? "tăng" : "giảm"} ${formatNumber(Math.abs(trend.changePercent), 1)}% so với 7 ngày trước đó. Thay đổi số cữ hoặc mức độ ghi chép cũng ảnh hưởng kết quả.`)}</p>
    {trend.current.pending > 0 && <p className="text-sm text-muted-foreground">{`${trend.current.pending} cữ chưa nhập ml trong 7 ngày gần nhất; chưa cộng vào tổng lượng.`}</p>}
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <caption className="sr-only">Lượng sữa từng ngày</caption>
        <thead><tr className="border-b"><th className="py-2 pr-2">Ngày</th><th className="p-2">Cữ hút</th><th className="p-2">Đã hút</th>{babyName && <th className="py-2 pl-2">Sữa mẹ uống bình</th>}</tr></thead>
        <tbody>{trend.rows.map((row) => <tr key={row.day} className="border-b last:border-0">
          <th scope="row" className="py-3 pr-2 font-normal">{row.day.slice(8)}/{row.day.slice(5, 7)}</th>
          <td className="p-2">{row.count || "—"}{row.pending ? <span className="block text-xs text-muted-foreground">{row.pending} {"chờ ml"}</span> : null}</td>
          <td className="p-2 tabular-nums">{volume(row.pumpedMl)}</td>
          {babyName && <td className="py-3 pl-2 tabular-nums">{volume(row.bottleMl)}{row.bottlePending ? <span className="block text-xs text-muted-foreground">{row.bottlePending} {"chờ ml"}</span> : null}</td>}
        </tr>)}</tbody>
      </table>
    </div>
    <p className="text-xs text-muted-foreground">— nghĩa là chưa có lượng được ghi, không phải 0 ml.</p>
    {babyName && <p className="text-sm text-muted-foreground">{`Cột uống bình chỉ tính loại “Sữa mẹ bình” của ${babyName}, không gồm sữa công thức, cữ kết hợp hoặc bú trực tiếp. Lượng hút thuộc mẹ và có thể dùng cho nhiều bé hoặc trữ lại, nên không dùng chênh lệch để kết luận đủ/thiếu hay tính tồn kho.`}</p>}
    <p className="text-sm text-muted-foreground">{"Lượng hút không phản ánh đầy đủ nguồn sữa. Khi lo bé bú chưa đủ, cần xem cùng diễn biến cân nặng, tã và trao đổi với bác sĩ hoặc chuyên viên tư vấn sữa mẹ."} <a href="https://www2.hse.ie/babies-children/breastfeeding/common-challenges/breast-milk-supply/" target="_blank" rel="noreferrer" className="underline">Tham khảo HSE</a></p>
    {babyName && <div className="flex flex-wrap gap-4 text-sm text-primary"><Link href="/tracking/diaper" className="inline-flex min-h-11 items-center underline">Xem nhật ký tã</Link><Link href="/tracking/growth" className="inline-flex min-h-11 items-center underline">Xem tăng trưởng</Link></div>}
  </section>;
}
