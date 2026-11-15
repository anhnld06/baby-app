import { getJourneyNotifications } from "@/features/journey/notifications";
import { AppShell } from "@/components/app-shell";
import { requireUser } from "@/lib/auth";
import { getSelectedBaby } from "@/lib/data";
import { getDictionary } from "@/lib/i18n";

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  const [dictionary, baby] = await Promise.all([
    getDictionary(),
    getSelectedBaby(user.id),
  ]);
  // Not awaited: the shell and page render immediately and the unread badge streams in.
  // A failing notification lookup only hides the badge instead of breaking every page.
  const unreadCount = getJourneyNotifications(user.id, user.timezone, baby?.id ?? null)
    .then((notifications) => notifications.filter((n) => !n.read).length)
    .catch(() => 0);
  return (
    <AppShell
      labels={dictionary.nav}
      appName={dictionary.appName}
      unreadCount={unreadCount}
      voiceLog={baby ? { babyId: baby.id } : undefined}
    >
      {children}
    </AppShell>
  );
}
