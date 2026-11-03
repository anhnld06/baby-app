"use client";
import { usePathname } from "next/navigation";
import { CareIllustration, type CareIllustrationKind } from "@/components/care-illustration";
const scenes: Record<string, { kind:CareIllustrationKind; title:string; detail:string; tone:string }> = {
  "/tracking/growth": {kind:"growth",title:"Từng chút lớn lên",detail:"Cân nặng · chiều cao · vòng đầu",tone:"from-sky-50 to-cyan-100 dark:from-sky-950 dark:to-cyan-950"},
  "/tracking/prescription": {kind:"prescription",title:"Lưu lời dặn, chăm con mỗi ngày",detail:"Đơn thuốc & lịch sử đã lưu",tone:"from-violet-50 to-fuchsia-100 dark:from-violet-950 dark:to-fuchsia-950"},
  "/tracking/teeth": {kind:"tooth",title:"Những chiếc răng đầu tiên",detail:"Ghi thời điểm mọc răng của con",tone:"from-sky-50 to-teal-100 dark:from-sky-950 dark:to-teal-950"},
  "/tracking/vaccination": {kind:"vaccine",title:"Sổ tiêm của con",detail:"Lịch hẹn & các lần đã ghi nhận",tone:"from-teal-50 to-emerald-100 dark:from-teal-950 dark:to-emerald-950"},
  "/vaccination-schedule": {kind:"vaccine",title:"Từng mũi tiêm được lưu lại",detail:"Xem theo vắc-xin hoặc mốc tuổi",tone:"from-teal-50 to-emerald-100 dark:from-teal-950 dark:to-emerald-950"},
  "/baby/wellbeing": {kind:"wellbeing",title:"Hôm nay con thế nào?",detail:"Ghi dấu hiệu và cảm xúc quan sát được",tone:"from-rose-50 to-pink-100 dark:from-rose-950 dark:to-pink-950"},
  "/baby/milestones": {kind:"milestone",title:"Những lần đầu đáng nhớ",detail:"Mốc phát triển & kỷ niệm của con",tone:"from-amber-50 to-orange-100 dark:from-amber-950 dark:to-orange-950"},
  "/baby/routine": {kind:"routine",title:"Nhịp ngày bên con",detail:"Ăn · chơi · ngủ · thời gian nghỉ",tone:"from-violet-50 to-indigo-100 dark:from-violet-950 dark:to-indigo-950"},
  "/baby/development": {kind:"development",title:"Đồng hành cùng con",detail:"Quan sát và ghi lại từng giai đoạn",tone:"from-violet-50 to-rose-100 dark:from-violet-950 dark:to-rose-950"},
  "/baby/medical": {kind:"babyMedical",title:"Sổ khám của con",detail:"Lần khám & lời dặn đã lưu",tone:"from-rose-50 to-pink-100 dark:from-rose-950 dark:to-pink-950"},
  "/mother/medical": {kind:"motherMedical",title:"Chăm sóc sức khỏe của mẹ",detail:"Lần khám & lịch tái khám",tone:"from-rose-50 to-pink-100 dark:from-rose-950 dark:to-pink-950"},
  "/baby/insurance": {kind:"babyInsurance",title:"Thẻ bảo hiểm của con",detail:"Giữ thông tin cần thiết trong một nơi",tone:"from-teal-50 to-emerald-100 dark:from-teal-950 dark:to-emerald-950"},
  "/mother/insurance": {kind:"motherInsurance",title:"Thẻ bảo hiểm của mẹ",detail:"Giữ thông tin cần thiết trong một nơi",tone:"from-teal-50 to-emerald-100 dark:from-teal-950 dark:to-emerald-950"},
  "/mother/pregnancy": {kind:"pregnancy",title:"Hành trình chờ con",detail:"Thai kỳ & những lần khám",tone:"from-pink-50 to-rose-100 dark:from-pink-950 dark:to-rose-950"},
  "/mother/cycle": {kind:"cycle",title:"Lắng nghe cơ thể",detail:"Ghi lại chu kỳ và quan sát của mẹ",tone:"from-rose-50 to-fuchsia-100 dark:from-rose-950 dark:to-fuchsia-950"},
  "/mother/vaccination": {kind:"motherVaccine",title:"Sổ tiêm của mẹ",detail:"Ngày hẹn & lịch sử tiêm",tone:"from-teal-50 to-emerald-100 dark:from-teal-950 dark:to-emerald-950"},
};
export function CareMotionBanner() {
  const scene=scenes[usePathname()];
  if(!scene) return null;
  return <section data-care-scene-banner className={`mb-6 flex min-w-0 items-center gap-3 rounded-[2rem] bg-gradient-to-br p-4 sm:gap-5 sm:p-6 ${scene.tone}`}><span className="care-banner-art shrink-0"><CareIllustration kind={scene.kind}/></span><div className="min-w-0"><p className="font-semibold sm:text-lg">{scene.title}</p><p className="mt-2 text-xs leading-5 text-muted-foreground sm:text-sm">{scene.detail}</p><p className="care-reduced-notice mt-2 text-xs text-muted-foreground">Thiết bị đang bật Giảm chuyển động.</p></div></section>;
}
