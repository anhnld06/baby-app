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
  return (
    <AppShell
      labels={dictionary.nav}
      appName={dictionary.appName}
      voiceLog={baby ? { babyId: baby.id, locale } : undefined}
    >
      {children}
    </AppShell>
  );
}
