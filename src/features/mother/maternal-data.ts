import "server-only";
import { cache } from "react";
import { db } from "@/lib/db";
import { maternalObservations } from "./maternal-observations";

export const getMaternalData = cache(async (pregnancyId: string, timeZone: string) => {
  const [checkups, measurements] = await Promise.all([
    db.pregnancyCheckup.findMany({ where: { pregnancyId }, orderBy: [{ checkedAt: "asc" }, { id: "asc" }], select: { id: true, checkedAt: true, checkedAtTimeKnown: true, gestationalWeek: true, gestationalDay: true, facility: true, weightKg: true, bloodPressure: true, maternalPulse: true, edema: true, urineTestResult: true, maternalHealthStatus: true, treatment: true, careInstructions: true, followupInstruction: true } }),
    db.pregnancyMeasurement.findMany({ where: { pregnancyId }, orderBy: { measuredOn: "asc" } }),
  ]);
  return { observations: maternalObservations(checkups, measurements, timeZone), measurements, checkupCount: checkups.length };
});
