export const OFFLINE_MUTATION_TYPES = [
  "CREATE_FEEDING",
  "CREATE_SLEEP",
  "CREATE_DIAPER",
] as const;

export type OfflineMutationType = (typeof OFFLINE_MUTATION_TYPES)[number];

export type PendingOfflineMutation = {
  id: string;
  type: OfflineMutationType;
  payload: Record<string, string>;
  createdAt: string;
  attempts: number;
  lastError?: string;
};
