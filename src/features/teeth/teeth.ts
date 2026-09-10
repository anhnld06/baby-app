import type { ToothPosition } from "@prisma/client";

export const UPPER_TOOTH_ORDER: ToothPosition[] = [
  "UPPER_RIGHT_SECOND_MOLAR",
  "UPPER_RIGHT_FIRST_MOLAR",
  "UPPER_RIGHT_CANINE",
  "UPPER_RIGHT_LATERAL_INCISOR",
  "UPPER_RIGHT_CENTRAL_INCISOR",
  "UPPER_LEFT_CENTRAL_INCISOR",
  "UPPER_LEFT_LATERAL_INCISOR",
  "UPPER_LEFT_CANINE",
  "UPPER_LEFT_FIRST_MOLAR",
  "UPPER_LEFT_SECOND_MOLAR",
];

export const LOWER_TOOTH_ORDER: ToothPosition[] = [
  "LOWER_RIGHT_SECOND_MOLAR",
  "LOWER_RIGHT_FIRST_MOLAR",
  "LOWER_RIGHT_CANINE",
  "LOWER_RIGHT_LATERAL_INCISOR",
  "LOWER_RIGHT_CENTRAL_INCISOR",
  "LOWER_LEFT_CENTRAL_INCISOR",
  "LOWER_LEFT_LATERAL_INCISOR",
  "LOWER_LEFT_CANINE",
  "LOWER_LEFT_FIRST_MOLAR",
  "LOWER_LEFT_SECOND_MOLAR",
];

export type ToothEruptionInfo = {
  fdiNumber: string;
  eruptionOrder: number;
  expectedMonths: readonly [number, number];
};

// Primary-tooth eruption ranges follow the ADA chart. The FDI number identifies
// the exact quadrant and tooth; eruptionOrder is the usual pair-by-pair order.
export const TOOTH_ERUPTION_INFO = {
  UPPER_RIGHT_CENTRAL_INCISOR: { fdiNumber: "51", eruptionOrder: 2, expectedMonths: [8, 12] },
  UPPER_RIGHT_LATERAL_INCISOR: { fdiNumber: "52", eruptionOrder: 4, expectedMonths: [9, 13] },
  UPPER_RIGHT_CANINE: { fdiNumber: "53", eruptionOrder: 7, expectedMonths: [16, 22] },
  UPPER_RIGHT_FIRST_MOLAR: { fdiNumber: "54", eruptionOrder: 5, expectedMonths: [13, 19] },
  UPPER_RIGHT_SECOND_MOLAR: { fdiNumber: "55", eruptionOrder: 10, expectedMonths: [25, 33] },
  UPPER_LEFT_CENTRAL_INCISOR: { fdiNumber: "61", eruptionOrder: 2, expectedMonths: [8, 12] },
  UPPER_LEFT_LATERAL_INCISOR: { fdiNumber: "62", eruptionOrder: 4, expectedMonths: [9, 13] },
  UPPER_LEFT_CANINE: { fdiNumber: "63", eruptionOrder: 7, expectedMonths: [16, 22] },
  UPPER_LEFT_FIRST_MOLAR: { fdiNumber: "64", eruptionOrder: 5, expectedMonths: [13, 19] },
  UPPER_LEFT_SECOND_MOLAR: { fdiNumber: "65", eruptionOrder: 10, expectedMonths: [25, 33] },
  LOWER_RIGHT_CENTRAL_INCISOR: { fdiNumber: "81", eruptionOrder: 1, expectedMonths: [6, 10] },
  LOWER_RIGHT_LATERAL_INCISOR: { fdiNumber: "82", eruptionOrder: 3, expectedMonths: [10, 16] },
  LOWER_RIGHT_CANINE: { fdiNumber: "83", eruptionOrder: 8, expectedMonths: [17, 23] },
  LOWER_RIGHT_FIRST_MOLAR: { fdiNumber: "84", eruptionOrder: 6, expectedMonths: [14, 18] },
  LOWER_RIGHT_SECOND_MOLAR: { fdiNumber: "85", eruptionOrder: 9, expectedMonths: [23, 31] },
  LOWER_LEFT_CENTRAL_INCISOR: { fdiNumber: "71", eruptionOrder: 1, expectedMonths: [6, 10] },
  LOWER_LEFT_LATERAL_INCISOR: { fdiNumber: "72", eruptionOrder: 3, expectedMonths: [10, 16] },
  LOWER_LEFT_CANINE: { fdiNumber: "73", eruptionOrder: 8, expectedMonths: [17, 23] },
  LOWER_LEFT_FIRST_MOLAR: { fdiNumber: "74", eruptionOrder: 6, expectedMonths: [14, 18] },
  LOWER_LEFT_SECOND_MOLAR: { fdiNumber: "75", eruptionOrder: 9, expectedMonths: [23, 31] },
} as const satisfies Record<ToothPosition, ToothEruptionInfo>;

const TYPE_LABEL_KEYS = {
  CENTRAL_INCISOR: "centralIncisor",
  LATERAL_INCISOR: "lateralIncisor",
  CANINE: "canine",
  FIRST_MOLAR: "firstMolar",
  SECOND_MOLAR: "secondMolar",
} as const;

export function toothTypeLabelKey(position: ToothPosition) {
  const type = position.replace(/^(UPPER|LOWER)_(RIGHT|LEFT)_/, "") as keyof typeof TYPE_LABEL_KEYS;
  return TYPE_LABEL_KEYS[type];
}

export function toothJaw(position: ToothPosition) {
  return position.startsWith("UPPER_") ? "upper" : "lower";
}

export function toothSide(position: ToothPosition) {
  return position.includes("_RIGHT_") ? "right" : "left";
}
