export type InsuranceView = {
  id: string;
  insuranceType: string;
  provider: string | null;
  policyNumber: string;
  registeredCare: string | null;
  validFrom: Date | null;
  validUntil: Date | null;
  contact: string | null;
  benefits: string | null;
  notes: string | null;
};

export const insuranceTypeLabels: Record<string, string> = { BHYT: "Bảo hiểm y tế", PRIVATE: "Bảo hiểm tư nhân", OTHER: "Bảo hiểm khác" };

export type InsuranceStatus =
  | { kind: "active"; daysLeft: number | null }
  | { kind: "expiring"; daysLeft: number }
  | { kind: "expired" }
  | { kind: "upcoming" };

export const INSURANCE_EXPIRING_DAYS = 30;
const DAY_MS = 86_400_000;

/** `@db.Date` columns are stored at UTC midnight, so read them as UTC calendar days. */
export const insuranceDateKey = (date: Date) => date.toISOString().slice(0, 10);

/**
 * Coverage status on the account's calendar day (`today` as yyyy-mm-dd).
 * The card stays valid through the whole of `validUntil`.
 */
export function insuranceStatus(validFrom: Date | null, validUntil: Date | null, today: string): InsuranceStatus {
  if (validFrom && insuranceDateKey(validFrom) > today) return { kind: "upcoming" };
  if (!validUntil) return { kind: "active", daysLeft: null };
  const daysLeft = Math.round((Date.parse(insuranceDateKey(validUntil)) - Date.parse(today)) / DAY_MS);
  if (daysLeft < 0) return { kind: "expired" };
  if (daysLeft <= INSURANCE_EXPIRING_DAYS) return { kind: "expiring", daysLeft };
  return { kind: "active", daysLeft };
}

export function insuranceStatusLabel(status: InsuranceStatus) {
  switch (status.kind) {
    case "upcoming": return "Chưa đến ngày hiệu lực";
    case "expired": return "Đã hết hạn";
    case "expiring": return status.daysLeft === 0 ? "Hết hạn hôm nay" : `Còn ${status.daysLeft} ngày`;
    case "active": return "Còn hiệu lực";
  }
}

/** Group plain card codes in fours for reading aloud; anything else is shown as typed. */
export function formatPolicyNumber(value: string) {
  const code = value.trim();
  return /^[A-Za-z0-9]{8,20}$/.test(code) ? code.replace(/(.{4})(?=.)/g, "$1 ") : code;
}
