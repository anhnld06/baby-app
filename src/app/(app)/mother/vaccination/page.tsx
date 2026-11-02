import { redirect } from "next/navigation";

export default async function VaccinationEntry({ searchParams }: { searchParams: Promise<{ edit?: string }> }) {
  const { edit } = await searchParams;
  const params = new URLSearchParams({ owner: "mother" });
  if (edit) params.set("record", edit);
  redirect(`/vaccination-schedule?${params}`);
}
