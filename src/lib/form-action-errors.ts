export const SAVE_MESSAGES = {
  network: "Mất kết nối, chưa lưu được. Hãy thử lại.",
  uncertain:
    "Kết nối bị gián đoạn khi đang lưu. Hãy tải lại trang để kiểm tra bản ghi trước khi thử lại.",
  outdated: "Ứng dụng vừa được cập nhật. Hãy tải lại trang rồi thử lại.",
  generic: "Chưa thể lưu. Hãy thử lại.",
  deleteFailed: "Chưa thể xóa. Hãy thử lại.",
  offlineDisabled:
    "Thiết bị đang mất mạng. Hãy bật “Ghi nhanh khi mất mạng” trong Hồ sơ để lưu tạm bản ghi.",
  queueFailed: "Chưa thể lưu tạm trên thiết bị. Hãy thử lại.",
  queued: "Đã lưu tạm trên thiết bị. Bản ghi sẽ tự đồng bộ khi có mạng.",
  waitingForNetwork:
    "Đang mất kết nối. Bản ghi sẽ tự gửi khi có mạng lại, đừng đóng trang này.",
} as const;

export type SaveFailureKind = "network" | "uncertain" | "outdated" | "generic";

/** Messages browsers use when fetch() rejects before getting a response. */
const NETWORK_MESSAGE =
  /failed to fetch|load failed|networkerror|network request failed|network connection was lost|internet connection appears to be offline/i;

/** `{ error: string }` returned by a server action, if any. */
export function actionErrorMessage(result: unknown) {
  if (typeof result !== "object" || result === null || !("error" in result)) return undefined;
  const { error } = result as { error: unknown };
  return typeof error === "string" && error.trim() ? error : undefined;
}

/**
 * Classifies an error thrown by a server action call (after redirects /
 * notFound were rethrown):
 * - "network": fetch() rejected, the request never reached the server, so it
 *   is safe to keep it locally (offline queue) or let the user retry.
 * - "uncertain": the request was aborted or timed out; it may have been saved.
 * - "outdated": the deployed server no longer knows this action.
 * - "generic": the server failed; never blame the user's input for it.
 */
export function failureKind(error: unknown, unrecognizedAction = false): SaveFailureKind {
  if (unrecognizedAction) return "outdated";
  if (
    typeof DOMException !== "undefined" &&
    error instanceof DOMException &&
    (error.name === "AbortError" || error.name === "TimeoutError")
  ) {
    return "uncertain";
  }
  if (error instanceof TypeError && NETWORK_MESSAGE.test(error.message)) return "network";
  if (typeof navigator !== "undefined" && navigator.onLine === false) return "network";
  return "generic";
}
