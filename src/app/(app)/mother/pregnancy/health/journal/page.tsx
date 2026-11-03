import { PregnancyJournalPage } from "@/components/pregnancy-journal-page";
export default async function JournalPage({ searchParams }: { searchParams: Promise<{ edit?: string; page?: string; new?: string; saved?: string }> }) {
  return <PregnancyJournalPage kind="HEALTH" params={await searchParams} />;
}
