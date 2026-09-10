import { AppShell } from "@/components/app-shell";
import { requireUser } from "@/lib/auth";
import { getDictionary } from "@/lib/i18n";

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  await requireUser();
  const dictionary = await getDictionary();
  return <AppShell labels={dictionary.nav} appName={dictionary.appName}>{children}</AppShell>;
}
