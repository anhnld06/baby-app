import { Prisma } from "@prisma/client";

// P2002 = unique constraint violation, including the hand-written partial unique indexes that
// keep a single running sleep/breastfeeding/pumping timer per baby or mother.
export function isUniqueConstraintError(error: unknown) {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002";
}
