import "server-only";

import { cookies } from "next/headers";
import { cache } from "react";
import { db } from "@/lib/db";

// Share this read between the layout and page within one server render only.
export const listBabies = cache(async (userId: string) => {
  return db.baby.findMany({ where: { userId }, orderBy: { createdAt: "asc" } });
});

export function pickSelectedBaby<T extends { id: string }>(babies: T[], selectedId?: string) {
  return (selectedId ? babies.find((baby) => baby.id === selectedId) : undefined) ?? babies[0] ?? null;
}

export async function getSelectedBabyId() {
  return (await cookies()).get("selectedBabyId")?.value;
}

export async function getSelectedBaby(userId: string) {
  const [babies, selectedId] = await Promise.all([listBabies(userId), getSelectedBabyId()]);
  return pickSelectedBaby(babies, selectedId);
}

export async function requireSelectedBaby(userId: string) {
  const baby = await getSelectedBaby(userId);
  if (!baby) throw new Error("No baby profile found. Add one in Profiles.");
  return baby;
}
