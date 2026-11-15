export const OFFLINE_MUTATION_TYPES = [
  "CREATE_FEEDING",
  "CREATE_SLEEP",
  "CREATE_DIAPER",
] as const;

export type OfflineMutationType = (typeof OFFLINE_MUTATION_TYPES)[number];

export const OFFLINE_MUTATION_LABELS: Record<OfflineMutationType, string> = {
  CREATE_FEEDING: "Cữ bú",
  CREATE_SLEEP: "Giấc ngủ",
  CREATE_DIAPER: "Thay tã",
};

/**
 * "pending" items are retried automatically. "failed" items were rejected by
 * the server (4xx other than 401/408/429) and stay on the device until the
 * user retries or discards them. Items stored before this field existed have
 * no status and are treated as pending.
 */
export type OfflineMutationStatus = "pending" | "failed";

export type PendingOfflineMutation = {
  id: string;
  type: OfflineMutationType;
  payload: Record<string, string>;
  createdAt: string;
  attempts: number;
  status?: OfflineMutationStatus;
  lastError?: string;
  failedAt?: string;
};
