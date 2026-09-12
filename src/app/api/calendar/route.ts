import { buildIcsCalendar } from "@/features/calendar/ics";
import { listUserReminders } from "@/features/reminders/candidates";
import { getCurrentUser } from "@/lib/auth";
import { getSelectedBaby } from "@/lib/data";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return new Response(null, { status: 401 });

  const baby = await getSelectedBaby(user.id);
  const reminders = await listUserReminders(
    user.id,
    user.timezone,
    new Date(),
    baby?.id,
  );
  const calendar = buildIcsCalendar(reminders);

  return new Response(calendar, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'attachment; filename="vani-family-reminders.ics"',
      "Cache-Control": "private, no-store",
    },
  });
}
