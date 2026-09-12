export function parseHistoryLimit(
  value: string | undefined,
  initial = 30,
  maximum = 300,
) {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < initial) return initial;
  return Math.min(parsed, maximum);
}

export function nextHistoryLimit(
  current: number,
  increment = 30,
  maximum = 300,
) {
  return Math.min(current + increment, maximum);
}

