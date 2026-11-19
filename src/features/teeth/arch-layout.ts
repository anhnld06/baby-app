import type { ToothPosition } from "@prisma/client";
import { LOWER_TOOTH_ORDER, UPPER_TOOTH_ORDER } from "@/features/teeth/teeth";

/** Drawing space of the mouth chart; the chart keeps this aspect ratio. */
export const ARCH_VIEWBOX = { width: 340, height: 430 } as const;

const CENTER_X = ARCH_VIEWBOX.width / 2;
const UPPER_CENTER_Y = 176;
const LOWER_CENTER_Y = 254;
const RADIUS_X = 128;
const RADIUS_Y = 140;
/** Space left between the last molar and the end of the arch curve. */
const END_MARGIN = 4;

export type ToothShape = "incisor" | "canine" | "molar";

export type ArchTooth = {
  position: ToothPosition;
  jaw: "upper" | "lower";
  shape: ToothShape;
  /** Centre of the tooth in viewBox units. */
  x: number;
  y: number;
  /** Rotation (degrees) that turns the tooth's local +y axis towards the tongue. */
  angle: number;
  /** Size along the arch (width) and across it (depth), in viewBox units. */
  width: number;
  depth: number;
};

const TOOTH_SIZE: Record<string, { width: number; depth: number; shape: ToothShape }> = {
  CENTRAL_INCISOR: { width: 34, depth: 23, shape: "incisor" },
  LATERAL_INCISOR: { width: 28, depth: 21, shape: "incisor" },
  CANINE: { width: 28, depth: 26, shape: "canine" },
  FIRST_MOLAR: { width: 37, depth: 32, shape: "molar" },
  SECOND_MOLAR: { width: 41, depth: 35, shape: "molar" },
};

function toothSize(position: ToothPosition) {
  return TOOTH_SIZE[position.replace(/^(UPPER|LOWER)_(RIGHT|LEFT)_/, "")];
}

/** Point on the half ellipse; t runs 0 → π from the baby's right (viewer's left). */
function archPoint(jaw: "upper" | "lower", t: number) {
  const direction = jaw === "upper" ? -1 : 1;
  const centerY = jaw === "upper" ? UPPER_CENTER_Y : LOWER_CENTER_Y;
  return {
    x: CENTER_X - RADIUS_X * Math.cos(t),
    y: centerY + direction * RADIUS_Y * Math.sin(t),
  };
}

function tangentAngle(jaw: "upper" | "lower", t: number) {
  const direction = jaw === "upper" ? -1 : 1;
  const degrees = (Math.atan2(direction * RADIUS_Y * Math.cos(t), RADIUS_X * Math.sin(t)) * 180) / Math.PI;
  // For the lower arch the tangent's normal points away from the tongue; flip it.
  return jaw === "upper" ? degrees : degrees + 180;
}

/** Rounded so server and browser (whose trig results may differ in the last bits) render identical markup. */
const round = (value: number) => Math.round(value * 100) / 100;

const SAMPLES = 2000;

/** Cumulative arc length table, identical for both jaws (they are mirror images). */
const ARC_TABLE = (() => {
  const lengths = [0];
  let previous = archPoint("upper", 0);
  for (let index = 1; index <= SAMPLES; index += 1) {
    const point = archPoint("upper", (index / SAMPLES) * Math.PI);
    lengths.push(lengths[index - 1] + Math.hypot(point.x - previous.x, point.y - previous.y));
    previous = point;
  }
  return lengths;
})();

function parameterAtLength(length: number) {
  let low = 0;
  let high = SAMPLES;
  while (low < high) {
    const middle = (low + high) >> 1;
    if (ARC_TABLE[middle] < length) low = middle + 1;
    else high = middle;
  }
  if (low === 0) return 0;
  const before = ARC_TABLE[low - 1];
  const fraction = (length - before) / (ARC_TABLE[low] - before || 1);
  return ((low - 1 + fraction) / SAMPLES) * Math.PI;
}

function layoutJaw(order: ToothPosition[], jaw: "upper" | "lower"): ArchTooth[] {
  const sizes = order.map(toothSize);
  const totalWidth = sizes.reduce((sum, size) => sum + size.width, 0);
  const arcLength = ARC_TABLE[SAMPLES];
  const gap = (arcLength - totalWidth - END_MARGIN * 2) / (order.length - 1);
  let cursor = END_MARGIN;
  return order.map((position, index) => {
    const size = sizes[index];
    const t = parameterAtLength(cursor + size.width / 2);
    cursor += size.width + gap;
    const point = archPoint(jaw, t);
    return {
      position,
      jaw,
      shape: size.shape,
      x: round(point.x),
      y: round(point.y),
      angle: round(tangentAngle(jaw, t)),
      width: size.width,
      depth: size.depth,
    };
  });
}

export const ARCH_LAYOUT: ArchTooth[] = [
  ...layoutJaw(UPPER_TOOTH_ORDER, "upper"),
  ...layoutJaw(LOWER_TOOTH_ORDER, "lower"),
];

/** SVG path of the gum band that the teeth of one jaw sit on. */
export function gumPath(jaw: "upper" | "lower") {
  const start = archPoint(jaw, 0);
  const end = archPoint(jaw, Math.PI);
  const sweep = jaw === "upper" ? 1 : 0;
  return `M ${round(start.x)} ${round(start.y)} A ${RADIUS_X} ${RADIUS_Y} 0 0 ${sweep} ${round(end.x)} ${round(end.y)}`;
}
