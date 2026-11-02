import { redirect } from "next/navigation";
export default async function LegacyBabyStats({
  searchParams,
}: {
  searchParams: Promise<{ days?: string; date?: string }>;
}) {
  const params = await searchParams;
  const query = new URLSearchParams({ owner: "baby" });
  if (params.days) query.set("days", params.days);
  if (params.date) query.set("date", params.date);
  redirect(`/statistics?${query}`);
}
