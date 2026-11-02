import { getJourneyNotifications } from "@/features/journey/notifications";
import { AppShell } from "@/components/app-shell";
import { requireUser } from "@/lib/auth";
import { getSelectedBaby } from "@/lib/data";
import { getDictionary, getLocale } from "@/lib/i18n";

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  const [dictionary, locale, baby] = await Promise.all([
    getDictionary(),
    getLocale(),
    getSelectedBaby(user.id),
  ]);
  const notifications = await getJourneyNotifications(user.id,user.timezone,baby?.id ?? null);
  return (
    <AppShell
      labels={dictionary.nav}
      appName={dictionary.appName}
      unreadCount={notifications.filter(n=>!n.read).length}
      voiceLog={baby ? { babyId: baby.id, locale } : undefined}
    >
      {children}
    </AppShell>
  );
}
