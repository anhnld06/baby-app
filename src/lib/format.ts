const numberFormatters = new Map<number, Intl.NumberFormat>();

/**
 * Shared vi-VN number formatter, cached per `maximumFractionDigits`:
 * building an Intl.NumberFormat is far more expensive than calling `format`.
 */
export function numberFormatter(maximumFractionDigits = 2): Intl.NumberFormat {
  let formatter = numberFormatters.get(maximumFractionDigits);
  if (!formatter) {
    formatter = new Intl.NumberFormat("vi-VN", { maximumFractionDigits });
    numberFormatters.set(maximumFractionDigits, formatter);
  }
  return formatter;
}

/** Formats a number for display in Vietnamese (e.g. 1.234,5), with at most the given decimals. */
export function formatNumber(value: number, maximumFractionDigits = 2): string {
  return numberFormatter(maximumFractionDigits).format(value);
}
