import { PregnancyTrackingToolPage } from "@/components/pregnancy-tracking-page";
export default async function KicksPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  return <PregnancyTrackingToolPage kind="KICKS" page={(await searchParams).page} />;
}
