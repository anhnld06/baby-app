export function chartScale(values: Array<number | null>, integer = false) {
  const maximum = Math.max(
    0,
    ...values.filter(
      (value): value is number => value != null && Number.isFinite(value),
    ),
  );
  const rough = Math.max(maximum, 1) / 4;
  const base = 10 ** Math.floor(Math.log10(rough));
  const rawStep =
    ([1, 2, 2.5, 5, 10].find((value) => value >= rough / base) ?? 10) * base;
  const step = integer ? Math.max(1, Math.ceil(rawStep)) : rawStep;
  const upper = Math.ceil(Math.max(maximum, 1) / step) * step;
  return {
    upper,
    ticks: Array.from({ length: Math.round(upper / step) + 1 }, (_, i) =>
      Number((i * step).toPrecision(10)),
    ),
  };
}
