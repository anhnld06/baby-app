import { unstable_rethrow } from "next/navigation";
import { z } from "zod";

/**
 * Result of a save server action used through FormActionBar: nothing on
 * success (the action redirects/revalidates) or a Vietnamese message the form
 * shows while keeping what the user typed.
 */
export type ActionResult = void | { error: string };

export const STALE_RECORD_ERROR =
  "Bản ghi không còn tồn tại, có thể đã bị xóa trên thiết bị khác.";
export const INVALID_INPUT_ERROR =
  "Thông tin chưa hợp lệ. Hãy kiểm tra lại các trường.";
export const GENERIC_SAVE_ERROR = "Chưa thể lưu. Hãy thử lại.";

/** An expected failure whose message is safe to show to the family. */
export class ActionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ActionError";
  }
}

/**
 * Per-parse zod error map. Messages declared on a schema (refine/min/max with
 * a message) take precedence; only zod's English defaults are replaced.
 */
const friendlyIssue: z.core.$ZodErrorMap = (issue) => {
  if (issue.code === "invalid_type" && issue.expected === "date")
    return "Ngày giờ chưa hợp lệ.";
  if (issue.code === "too_small" && issue.origin === "string")
    return "Hãy điền đầy đủ các trường bắt buộc.";
  if (issue.code === "too_big" && issue.origin === "string")
    return "Nội dung quá dài.";
  if (issue.code === "invalid_value") return "Hãy chọn một giá trị hợp lệ.";
  return INVALID_INPUT_ERROR;
};

export function parseInput<T extends z.ZodType>(schema: T, input: unknown): z.output<T> {
  return schema.parse(input, { error: friendlyIssue });
}

/** `updateMany` scoped to the family matched nothing: the record is gone. */
export function assertUpdated(result: { count: number }) {
  if (result.count === 0) throw new ActionError(STALE_RECORD_ERROR);
}

/** Prisma unique-constraint violation (P2002), optionally on a given field. */
export function isUniqueViolation(error: unknown, field?: string) {
  if (typeof error !== "object" || error === null) return false;
  const { code, meta } = error as { code?: unknown; meta?: { target?: unknown } };
  if (code !== "P2002") return false;
  return !field || JSON.stringify(meta?.target ?? "").includes(field);
}

export function actionErrorMessage(error: unknown) {
  if (error instanceof z.ZodError)
    return error.issues[0]?.message || INVALID_INPUT_ERROR;
  if (error instanceof ActionError) return error.message;
  console.error(error);
  return GENERIC_SAVE_ERROR;
}

/**
 * Runs the data part of a save action. Expected failures become `{ error }`;
 * Next.js control flow (redirect, notFound, dynamic bailouts) is rethrown.
 * Call redirect() after this returns, never inside `run`.
 */
export async function captureActionError(
  run: () => Promise<unknown>,
): Promise<{ error: string } | undefined> {
  try {
    await run();
    return undefined;
  } catch (error) {
    unstable_rethrow(error);
    return { error: actionErrorMessage(error) };
  }
}
