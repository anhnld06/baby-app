import "server-only";
import { cache } from "react";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { pregnancyAge, selectRelevantPregnancy } from "./pregnancy";

export const getPregnancyContext = cache(async () => {
  const user = await requireUser();
  const mother = await db.mother.findUnique({ where: { userId: user.id }, include: { pregnancies: { orderBy: { createdAt: "desc" } } } });
  const pregnancy = selectRelevantPregnancy(mother?.pregnancies ?? []);
  const age = pregnancy ? pregnancyAge(pregnancy, new Date(), user.timezone) : undefined;
  return { user, mother, pregnancy, age };
});
