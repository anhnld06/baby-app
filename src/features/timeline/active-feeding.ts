import type { Prisma } from "@prisma/client";

// A bottle log or a manually entered duration is a completed event even without an end time.
export const activeFeedingWhere = {
  type: "BREASTFEEDING",
  endTime: null,
  leftBreastDuration: null,
  rightBreastDuration: null,
  amountMl: null,
} satisfies Prisma.FeedingWhereInput;
