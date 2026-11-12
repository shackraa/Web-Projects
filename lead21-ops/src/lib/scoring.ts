import type { JuryGame } from "../data/seed";
import { TOTAL_IDEAL } from "../data/seed";

export function barrierPct(score: number, ideal = TOTAL_IDEAL): number {
  if (ideal <= 0) return 0;
  return (score / ideal) * 100;
}

export function juryTotal(
  game: JuryGame,
  values: Record<string, number | null>,
): number | null {
  const nums = game.criteria.map((c) => values[c.key]);
  if (nums.some((n) => n == null || Number.isNaN(n as number))) return null;
  const v = nums as number[];

  switch (game.formula) {
    case "sum":
      return v.reduce((a, b) => a + b, 0);
    case "avg":
      return v.reduce((a, b) => a + b, 0) / v.length;
    case "weighted":
      return game.criteria.reduce(
        (a, c, i) => a + v[i] * (c.weight ?? 0),
        0,
      );
    case "halfhalf": {
      const first = v.slice(0, 3).reduce((a, b) => a + b, 0);
      const second = v.slice(3, 6).reduce((a, b) => a + b, 0);
      return first * 0.5 + second * 0.5;
    }
    default:
      return null;
  }
}

export function fmtScore(n: number | null, digits = 2): string {
  if (n == null || Number.isNaN(n)) return "—";
  return Number.isInteger(n) ? String(n) : n.toFixed(digits);
}
