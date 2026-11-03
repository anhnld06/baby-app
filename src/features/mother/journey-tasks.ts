import { z } from "zod";
import type { CalendarReminder } from "@/features/calendar/ics";

const care = "https://www.nhs.uk/pregnancy/your-pregnancy-care/your-antenatal-care-and-appointments/";
const vitamins = "https://www.nhs.uk/pregnancy/keeping-well/pregnancy-vitamins-and-supplements/";
const movements = "https://www.nhs.uk/pregnancy/keeping-well/your-babys-movements/";
export type JourneyTask = { key: string; from: number; to: number; title: string; description: string; group: string; href: string; source: string; scan?: boolean };
export const journeyTasks: JourneyTask[] = [
  { key: "first-visit", from: 1, to: 10, title: "Đặt lịch khám đầu tiên", description: "Ghi tiền sử bệnh, dị ứng và thuốc đang dùng; hỏi bác sĩ về tuổi thai và ngày dự sinh.", group: "Khám & sàng lọc", href: "checkups", source: care },
  { key: "supplements", from: 1, to: 41, title: "Rà soát kế hoạch bổ sung của mẹ", description: "Trao đổi về acid folic, sắt, canxi và vitamin D. Ghi tên sản phẩm, thành phần, liều và thời gian theo đơn; kiểm tra tránh uống trùng. Không tự tăng liều hay ngừng thuốc.", group: "Dinh dưỡng", href: "health", source: vitamins },
  { key: "first-screen", from: 10, to: 14, title: "Trao đổi sàng lọc quý đầu", description: "Hỏi lựa chọn và thời điểm sàng lọc phù hợp; lưu kết quả và câu hỏi cho lần khám tiếp theo.", group: "Khám & sàng lọc", href: "checkups", source: care, scan: true },
  { key: "wellbeing", from: 1, to: 41, title: "Chăm sóc bữa ăn, vận động và cảm xúc", description: "Ăn đa dạng, nghỉ ngơi và trao đổi cách vận động phù hợp với bác sĩ. Ghi cảm nhận hoặc điều đang lo để được hỗ trợ.", group: "Chăm sóc mẹ", href: "health/journal?new=1", source: "https://www.nhs.uk/pregnancy/keeping-well/" },
  { key: "anatomy", from: 18, to: 23, title: "Hỏi lịch siêu âm hình thái", description: "Xác nhận mốc khảo sát hình thái với nơi khám. Có phiếu siêu âm không đồng nghĩa đã hoàn thành khảo sát này; mẹ xác nhận theo kết quả thực tế.", group: "Khám & sàng lọc", href: "checkups", source: care, scan: true },
  { key: "glucose", from: 24, to: 28, title: "Hỏi về đường huyết và kiểm tra thiếu máu", description: "Trao đổi xét nghiệm đái tháo đường thai kỳ, xét nghiệm máu và cách chuẩn bị theo chỉ định. Lịch có thể sớm hơn tùy tiền sử.", group: "Khám & sàng lọc", href: "checkups", source: care },
  { key: "movements", from: 16, to: 41, title: "Làm quen với cử động của con", description: "Thường bắt đầu cảm nhận trong khoảng 16–24 tuần. Nếu chưa cảm nhận ở tuần 24, báo bác sĩ. Khi đã quen, chú ý thay đổi so với kiểu cử động thường ngày; không dùng số đếm để tự kết luận con khỏe.", group: "Chăm sóc bé", href: "baby/kicks", source: movements },
  { key: "birth-plan", from: 29, to: 35, title: "Chuẩn bị kế hoạch đón con", description: "Chọn nơi sinh, hỏi lịch tiêm chủng phù hợp, học chuẩn bị sinh và cho bú; thống nhất người hỗ trợ mẹ sau sinh.", group: "Chuẩn bị sinh", href: "health/journal?new=1", source: care },
  { key: "hospital-bag", from: 36, to: 41, title: "Soạn túi và hồ sơ đi sinh", description: "Chuẩn bị giấy tờ, kết quả khám, đồ dùng theo hướng dẫn bệnh viện; lưu số liên hệ và phương án di chuyển.", group: "Chuẩn bị sinh", href: "checkups", source: "https://www.nhs.uk/pregnancy/labour-and-birth/preparing-for-the-birth/pack-your-bag-for-labour/" },
  { key: "labour", from: 36, to: 41, title: "Nắm dấu hiệu chuyển dạ và lịch tái khám", description: "Hỏi khi nào cần tới viện và kế hoạch nếu qua ngày dự sinh. Không mặc định kết thúc theo dõi ở tuần 40.", group: "Chuẩn bị sinh", href: "health/contractions", source: "https://www.nhs.uk/pregnancy/labour-and-birth/signs-of-labour/signs-that-labour-has-begun/" },
];
export const tasksForWeek = (week: number) => journeyTasks.filter((task) => week >= task.from && week <= task.to);
const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine((value) => { const d = new Date(`${value}T00:00:00Z`); return Number.isFinite(d.getTime()) && d.toISOString().slice(0, 10) === value; }, "Ngày nhắc không hợp lệ");
export const journeyTaskSchema = z.object({ pregnancyId: z.string().min(1), taskKey: z.string().refine((key) => journeyTasks.some((task) => task.key === key), "Việc cần làm không hợp lệ"), done: z.boolean(), note: z.string().trim().max(3000, "Ghi chú tối đa 3.000 ký tự"), remindOn: z.union([date, z.literal("")]) });
export function journeyTaskReminders(tasks: { taskKey: string; done: boolean; remindOn: Date | null; pregnancyId: string }[]): CalendarReminder[] {
  return tasks.flatMap((row) => {
    const task = journeyTasks.find((item) => item.key === row.taskKey);
    return !row.done && row.remindOn && task ? [{ uid: `journey-task-${row.pregnancyId}-${row.taskKey}`, title: task.title, date: row.remindOn, description: "Việc mẹ đã chọn nhắc trong Hành trình yêu thương.", url: "/mother/pregnancy#journey-care", pushOffsets: [0] }] : [];
  });
}
