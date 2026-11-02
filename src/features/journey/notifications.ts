import { cache } from "react";
import { db } from "@/lib/db";
import { toDateTimeLocal } from "@/lib/date";
import { developmentContext, stageContent } from "./development";
export type JourneyNotification = {
  key: string;
  title: string;
  detail: string;
  href: string;
  read: boolean;
};
export const getJourneyNotifications = cache(
  async (
    userId: string,
    timeZone: string,
    babyId: string | null,
  ): Promise<JourneyNotification[]> => {
    const now = new Date();
    const today = toDateTimeLocal(now, timeZone).slice(0, 10);
    const until = new Date(`${today}T00:00Z`);
    until.setUTCDate(until.getUTCDate() + 7);
    const since = new Date(`${today}T00:00Z`);
    since.setUTCDate(since.getUTCDate() - 30);
    const [baby, appointments] = await Promise.all([
      babyId
        ? db.baby.findFirst({
            where: { id: babyId, userId },
            select: {
              id: true,
              name: true,
              dateOfBirth: true,
              gestationalAgeAtBirth: true,
            },
          })
        : null,
      db.vaccinationAppointment.findMany({
        where: {
          OR: [{ baby: { userId } }, { mother: { userId } }],
          vaccinationRecordId: null,
          motherVaccinationRecordId: null,
          scheduledAt: { gte: since, lte: until },
        },
        select: {
          id: true,
          vaccineName: true,
          scheduledAt: true,
          baby: { select: { id: true, name: true } },
          mother: { select: { name: true } },
        },
        orderBy: { scheduledAt: "asc" },
        take: 60,
      }),
    ]);
    const items: Omit<JourneyNotification, "read">[] = appointments.map(
      (a) => ({
        key: `appointment:${a.id}:${a.scheduledAt.toISOString().slice(0, 10)}`,
        title: `${a.scheduledAt.toISOString().slice(0, 10) < today ? "Lịch hẹn chưa xác nhận" : "Lịch tiêm sắp tới"}: ${a.vaccineName}`,
        detail: `${a.baby?.name ?? a.mother?.name ?? "Gia đình"} · ${a.scheduledAt.toISOString().slice(0, 10).split("-").reverse().join("/")}`,
        href: `/vaccination-schedule?owner=${a.mother ? "mother" : "baby"}${a.baby ? `&baby=${a.baby.id}` : ""}`,
      }),
    );
    if (baby) {
      const context = developmentContext(baby.dateOfBirth, now, timeZone);
      const stage = stageContent(context.ageDays);
      items.push({
        key: `stage:${baby.id}:${Math.floor(context.ageDays / 30)}`,
        title: `${baby.name}: ${stage.title}`,
        detail: stage.body,
        href: "/baby/development",
      });
      if (context.sleepChange)
        items.push({
          key: `sleep-stage:${baby.id}:3-6`,
          title: "Tìm hiểu thay đổi giấc ngủ 3–6 tháng",
          detail:
            "Xem thông tin tham khảo và nhật ký ngủ, không phải cảnh báo bé đang bị khủng hoảng.",
          href: "/baby/development",
        });
      const episode = await db.babyCareEntry.findFirst({
        where: { babyId: baby.id, kind: "EPISODE", endedAt: null },
        orderBy: { occurredAt: "desc" },
        select: { id: true, title: true, occurredAt: true },
      });
      if (episode)
        items.unshift({
          key: `episode:${episode.id}`,
          title: `Đang theo dõi: ${episode.title}`,
          detail: `Gia đình ghi từ ${toDateTimeLocal(episode.occurredAt, timeZone).slice(0, 10).split("-").reverse().join("/")}`,
          href: "/baby/development",
        });
    }
    const read = await db.notificationRead.findMany({
      where: { userId, key: { in: items.map((i) => i.key) } },
      select: { key: true },
    });
    const keys = new Set(read.map((r) => r.key));
    return items.map((item) => ({ ...item, read: keys.has(item.key) }));
  },
);
