/** Only explicit calendar dates create reminders; intervals and gestational ages do not. */
export function explicitPrenatalFollowupDate(instruction?: string | null): Date | undefined {
  if (!instruction) return undefined;
  const dates = new Map<string, Date>();
  for (const line of instruction.split(/\r?\n/)) {
    const text = line.trim();
    const local = /^(?:(?:Ngày tái khám|Tái khám ngày|Ngày)\s*:?\s*)?(\d{1,2})\/(\d{1,2})\/(\d{4})$/iu.exec(text);
    const iso = /^(\d{4})-(\d{2})-(\d{2})$/.exec(text);
    if (!local && !iso) continue;
    const year = Number(local ? local[3] : iso![1]);
    const month = Number(local ? local[2] : iso![2]);
    const day = Number(local ? local[1] : iso![3]);
    const date = new Date(Date.UTC(year, month - 1, day));
    if (year < 1900 || year > 2100 || date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) return undefined;
    dates.set(date.toISOString(), date);
  }
  return dates.size === 1 ? [...dates.values()][0] : undefined;
}

/** Replace only standalone explicit date lines; preserve the clinician's prose. */
export function withPrenatalFollowupDate(instruction: string, date: string) {
  const prose = instruction.split(/\r?\n/).filter((line) => !/^(?:(?:Ngày tái khám|Tái khám ngày|Ngày)\s*:?\s*)?\d{1,2}\/\d{1,2}\/\d{4}$/iu.test(line.trim()) && !/^\d{4}-\d{2}-\d{2}$/.test(line.trim())).join("\n").trim();
  if (!date) return prose;
  const parsed = explicitPrenatalFollowupDate(date);
  if (!parsed) return instruction;
  const [year, month, day] = date.split("-");
  return [prose, `Ngày tái khám: ${day}/${month}/${year}`].filter(Boolean).join("\n");
}
