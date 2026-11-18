import {
  SCORE_CATEGORIES,
  moduleStages,
  type StageProgress,
  type StageStatus,
} from "../data/seed";

function stageShare(status: StageStatus, ideal: number): number {
  switch (status) {
    case "yapildi":
      return ideal;
    case "devam":
      return Math.round(ideal * 0.5);
    case "sorun":
      return Math.round(ideal * 0.15);
    default:
      return 0;
  }
}

/** Aşama durumundan modül puanı türet — tek doğruluk kaynağı */
export function scoreFromStages(
  fellow: string,
  moduleCode: string,
  stages: StageProgress[],
): number {
  const cat = SCORE_CATEGORIES.find((c) => c.code === moduleCode);
  if (!cat) return 0;
  const defs = moduleStages(moduleCode);
  if (!defs.length) return 0;

  let sum = 0;
  for (const d of defs) {
    const st = stages.find(
      (s) => s.fellow === fellow && s.moduleCode === moduleCode && s.stageCode === d.code,
    );
    const status = (st?.status ?? "bekliyor") as StageStatus;
    const ideal =
      d.ideal ??
      Math.round(cat.ideal / defs.length);
    sum += stageShare(status, ideal);
  }
  return Math.min(cat.ideal, Math.max(0, sum));
}

export function scoresFromStages(
  stages: StageProgress[],
  fellows: readonly string[],
): Record<string, Record<string, number>> {
  const out: Record<string, Record<string, number>> = {};
  for (const fellow of fellows) {
    const row: Record<string, number> = {};
    for (const cat of SCORE_CATEGORIES) {
      row[cat.code] = scoreFromStages(fellow, cat.code, stages);
    }
    out[fellow] = row;
  }
  return out;
}

export function mergeScores(
  derived: Record<string, Record<string, number>>,
  overrides: Record<string, Record<string, number>> | undefined,
): Record<string, Record<string, number>> {
  if (!overrides) return derived;
  const out: Record<string, Record<string, number>> = {};
  const fellows = new Set([...Object.keys(derived), ...Object.keys(overrides)]);
  for (const f of fellows) {
    out[f] = { ...derived[f], ...overrides[f] };
  }
  return out;
}
