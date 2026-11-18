import {
  PLAN_ITEMS,
  SCORE_CATEGORIES,
  moduleStages,
  type Activity,
  type StageProgress,
  type StageStatus,
} from "../data/seed";
import { latestActivity } from "./plan";

export type ModuleHealth = "tamam" | "yolda" | "sorun" | "bekliyor";

export function stageFor(
  stages: StageProgress[],
  fellow: string,
  moduleCode: string,
  stageCode: string,
): StageProgress | undefined {
  return stages.find(
    (s) => s.fellow === fellow && s.moduleCode === moduleCode && s.stageCode === stageCode,
  );
}

export function moduleSnapshot(
  fellow: string,
  moduleCode: string,
  stages: StageProgress[],
  scores: Record<string, number> | undefined,
  activities: Activity[],
) {
  const cat = SCORE_CATEGORIES.find((c) => c.code === moduleCode)!;
  const defs = moduleStages(moduleCode);
  const rows = defs.map((d) => {
    const st = stageFor(stages, fellow, moduleCode, d.code);
    return {
      ...d,
      status: (st?.status ?? "bekliyor") as StageStatus,
      at: st?.at,
      note: st?.note,
      issue: st?.issue,
      id: st?.id,
    };
  });
  const done = rows.filter((r) => r.status === "yapildi").length;
  const sorun = rows.filter((r) => r.status === "sorun");
  const devam = rows.filter((r) => r.status === "devam");
  const bekliyor = rows.filter((r) => r.status === "bekliyor");
  const score = scores?.[moduleCode] ?? 0;
  const ideal = cat.ideal;
  const planLinks = PLAN_ITEMS.filter((p) => p.pointsCode === moduleCode).map((p) => ({
    ...p,
    activity: latestActivity(activities, fellow, p.id),
  }));

  let health: ModuleHealth = "tamam";
  if (sorun.length) health = "sorun";
  else if (devam.length || (bekliyor.length && done > 0 && done < rows.length)) health = "yolda";
  else if (done === 0 && bekliyor.length === rows.length) health = "bekliyor";
  else if (done < rows.length) health = "yolda";

  const current =
    rows.find((r) => r.status === "sorun") ??
    rows.find((r) => r.status === "devam") ??
    rows.find((r) => r.status === "bekliyor") ??
    rows[rows.length - 1];

  return {
    cat,
    rows,
    done,
    total: rows.length,
    sorun,
    devam,
    bekliyor,
    score,
    ideal,
    ratio: ideal ? score / ideal : 0,
    health,
    currentLabel: current?.label ?? "—",
    planLinks,
  };
}

export function fellowIssues(fellow: string, stages: StageProgress[]) {
  return stages.filter((s) => s.fellow === fellow && (s.status === "sorun" || Boolean(s.issue)));
}

export function healthLabel(h: ModuleHealth): string {
  switch (h) {
    case "tamam":
      return "tamam";
    case "yolda":
      return "yolda";
    case "sorun":
      return "sorun";
    default:
      return "bekliyor";
  }
}
