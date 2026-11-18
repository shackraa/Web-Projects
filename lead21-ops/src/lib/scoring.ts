import { PERIOD, SCORE_CATEGORIES, TOTAL_IDEAL, type BonusEntry } from "../data/seed";

export function categoryTotal(scores: Record<string, number> | undefined): number {
  if (!scores) return 0;
  return SCORE_CATEGORIES.reduce((s, c) => s + (Number(scores[c.code]) || 0), 0);
}

export function bonusTotal(bonuses: BonusEntry[], fellow: string): number {
  return bonuses.filter((b) => b.fellow === fellow).reduce((s, b) => s + b.points, 0);
}

export function fellowTotal(
  scores: Record<string, number> | undefined,
  bonuses: BonusEntry[],
  fellow: string,
): number {
  return categoryTotal(scores) + bonusTotal(bonuses, fellow);
}

/** %80 hesabında payda = ana kart ideali (bonus hariç) */
export function barrierRatio(total: number): number {
  return TOTAL_IDEAL === 0 ? 0 : total / TOTAL_IDEAL;
}

export function underBarrier(total: number): boolean {
  return barrierRatio(total) < PERIOD.barrierPct;
}

export function teamAverage(
  allScores: Record<string, Record<string, number>>,
  bonuses: BonusEntry[],
  fellows: readonly string[],
): number {
  if (!fellows.length) return 0;
  const sum = fellows.reduce((s, f) => s + fellowTotal(allScores[f], bonuses, f), 0);
  return sum / fellows.length;
}

export function pctLabel(ratio: number): string {
  return `${Math.round(ratio * 1000) / 10}%`;
}

export function exportCsv(
  fellows: readonly string[],
  allScores: Record<string, Record<string, number>>,
  bonuses: BonusEntry[],
): string {
  const headers = ["Fellow", "Toplam", "Bonus", "%", "Baraj", ...SCORE_CATEGORIES.map((c) => c.label)];
  const lines = [headers.join(",")];
  for (const f of fellows) {
    const cat = categoryTotal(allScores[f]);
    const bon = bonusTotal(bonuses, f);
    const tot = cat + bon;
    const r = barrierRatio(tot);
    const row = [
      `"${f}"`,
      String(tot),
      String(bon),
      pctLabel(r),
      underBarrier(tot) ? "ALT" : "OK",
      ...SCORE_CATEGORIES.map((c) => String(allScores[f]?.[c.code] ?? 0)),
    ];
    lines.push(row.join(","));
  }
  return lines.join("\n");
}
