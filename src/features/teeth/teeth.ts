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
