import { PregnancyJournalPage } from "@/components/pregnancy-journal-page";

export default async function MemoriesPage({ searchParams }: { searchParams: Promise<{ edit?: string; page?: string; new?: string; saved?: string }> }) {
  return <PregnancyJournalPage kind="MEMORY" params={await searchParams} />;
}
