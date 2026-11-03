import { escapeIcsText } from "@/features/calendar/ics";
import { toDateTimeLocal, zonedDateTimeToUtc } from "@/lib/date";
import { scheduledOn } from "./validation";
type Schedule = { id:string; name:string; dosage:string; instructions:string|null; active:boolean; startDate:Date; endDate:Date|null; times:string[] };
const stamp = (date:Date) => date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
// Fold at 75 UTF-8 octets so Vietnamese names are valid in native calendar apps.
function fold(line:string) {
  const encoder = new TextEncoder(); let length=0, result="";
  for (const character of line) {
    const bytes=encoder.encode(character).length;
    if (length+bytes>75) { result+="\r\n "; length=1; }
    result+=character; length+=bytes;
  }
  return result;
}
export function medicationCalendar(schedules:Schedule[],timeZone:string,now=new Date()) {
  const lines=["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//Vani Family//Medication//VI","CALSCALE:GREGORIAN","METHOD:PUBLISH"];
  const day=new Date(`${toDateTimeLocal(now,timeZone).slice(0,10)}T12:00Z`);
  for(let index=0;index<30;index++,day.setUTCDate(day.getUTCDate()+1)) {
    const date=day.toISOString().slice(0,10);
    for(const schedule of schedules.filter(schedule=>scheduledOn(schedule,date))) for(const time of schedule.times) {
      const at=zonedDateTimeToUtc(`${date}T${time}`,timeZone);
      // Skip already elapsed times and times that do not exist during a DST transition.
      if(at<now || toDateTimeLocal(at,timeZone)!==`${date}T${time}`) continue;
      lines.push("BEGIN:VEVENT",`UID:medication-${schedule.id}-${date}-${time.replace(':','')}@vani-family`,`DTSTAMP:${stamp(now)}`,`DTSTART:${stamp(at)}`,`DTEND:${stamp(new Date(at.getTime()+60000))}`,`SUMMARY:${escapeIcsText(schedule.name)}`,`DESCRIPTION:${escapeIcsText([schedule.dosage,schedule.instructions].filter(Boolean).join(' · '))}`,"BEGIN:VALARM","TRIGGER:PT0S","ACTION:DISPLAY",`DESCRIPTION:${escapeIcsText(schedule.name)}`,"END:VALARM","END:VEVENT");
    }
  }
  lines.push("END:VCALENDAR","");
  return lines.map(fold).join("\r\n");
}
