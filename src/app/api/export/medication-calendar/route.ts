import { getCurrentUser } from "@/lib/auth";
import { getSelectedBaby } from "@/lib/data";
import { db } from "@/lib/db";
import { medicationCalendar } from "@/features/health/calendar";
export async function GET() {
  const user=await getCurrentUser();
  if(!user) return new Response(null,{status:401});
  const baby=await getSelectedBaby(user.id);
  if(!baby) return new Response("Chưa có hồ sơ bé",{status:404});
  const schedules=await db.medicationSchedule.findMany({where:{babyId:baby.id,active:true}});
  return new Response(medicationCalendar(schedules,user.timezone),{headers:{"Content-Type":"text/calendar; charset=utf-8","Content-Disposition":'attachment; filename="vani-medication-30-days.ics"',"Cache-Control":"private, no-store"}});
}
