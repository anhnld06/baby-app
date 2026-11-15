// Cells starting with these characters can be evaluated as formulas by spreadsheet apps
// (CSV/formula injection). Tab and CR are included because Excel/LibreOffice strip them
// and then evaluate what follows (OWASP CSV Injection guidance).
const FORMULA_PREFIX = /^[=+\-@\t\r]/;

/** Quotes a value as one CSV cell and neutralises spreadsheet formulas with a leading apostrophe. */
export function safeCsvCell(value: unknown) {
  let text = value == null ? "" : String(value);
  if (FORMULA_PREFIX.test(text)) text = `'${text}`;
  return `"${text.replace(/"/g, '""')}"`;
}
