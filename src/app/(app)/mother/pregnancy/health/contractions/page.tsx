import { PregnancyTrackingToolPage } from "@/components/pregnancy-tracking-page";
export default async function ContractionsPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  return <PregnancyTrackingToolPage kind="CONTRACTIONS" page={(await searchParams).page} />;
}
