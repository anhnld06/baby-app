import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { getSelectedBaby } from "@/lib/data";
import { getJourneyNotifications } from "@/features/journey/notifications";
import { PageHeader } from "@/components/page-header";
import { markNotificationsReadAction } from "@/app/journey-actions";
export default async function NotificationsPage() {
  const user = await requireUser();
  const baby = await getSelectedBaby(user.id);
  const items = await getJourneyNotifications(
    user.id,
    user.timezone,
    baby?.id ?? null,
  );
  const unread = items.filter((item) => !item.read);
  return (
    <>
      <PageHeader
        title="Thông báo"
        subtitle={`${unread.length} chưa đọc · lịch hẹn và thông tin của gia đình`}
        backHref="/"
      />
      {unread.length > 0 && (
        <form action={markNotificationsReadAction} className="mb-5">
          {unread.map((n) => (
            <input key={n.key} type="hidden" name="key" value={n.key} />
          ))}
          <button className="min-h-12 rounded-full bg-primary px-5 text-sm text-primary-foreground">
            Đánh dấu tất cả đã đọc
          </button>
        </form>
      )}
      <div className="space-y-3">
        {items.map((item) => (
          <article
            key={item.key}
            className={`rounded-3xl border p-5 ${item.read ? "bg-card" : "border-primary/30 bg-secondary/40"}`}
          >
            <p className="text-xs text-primary">
              {item.read ? "Đã đọc" : "● Chưa đọc"}
            </p>
            <h2 className="mt-2 font-semibold">{item.title}</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {item.detail}
            </p>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
              <Link
                href={item.href}
                className="inline-flex min-h-11 items-center text-sm text-primary"
              >
                Xem chi tiết →
              </Link>
              {!item.read && (
                <form action={markNotificationsReadAction}>
                  <input type="hidden" name="key" value={item.key} />
                  <button className="min-h-11 rounded-full bg-card px-4 text-xs text-primary">
                    Đánh dấu đã đọc
                  </button>
                </form>
              )}
            </div>
          </article>
        ))}
      </div>
      {!items.length && (
        <p className="rounded-3xl border border-dashed p-6 text-sm text-muted-foreground">
          Chưa có thông báo mới.
        </p>
      )}
    </>
  );
}
