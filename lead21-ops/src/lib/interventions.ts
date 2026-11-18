import {
  FELLOWS_10,
  PLAN_ITEMS,
  SCORE_CATEGORIES,
  type Activity,
  type BonusEntry,
  type MentorMatch,
  type StageProgress,
} from "../data/seed";
import { fellowIssues, moduleSnapshot } from "./modules";
import { fellowCompletion } from "./plan";
import { barrierRatio, fellowTotal, underBarrier } from "./scoring";

export type InterventionKind = "baraj" | "sorun" | "eksik" | "mentor";

export type Intervention = {
  id: string;
  fellow: string;
  kind: InterventionKind;
  reason: string;
  detail: string;
  dose: number;
  mailChainId: string;
  planId?: string;
  moduleCode?: string;
  priority: number;
};

export function buildInterventions(opts: {
  scores: Record<string, Record<string, number>>;
  bonuses: BonusEntry[];
  stages: StageProgress[];
  activities: Activity[];
  mentors: MentorMatch[];
  warnCounts: Record<string, number>;
  today?: string;
}): Intervention[] {
  const today = opts.today ?? new Date().toISOString().slice(0, 10);
  const out: Intervention[] = [];
  let n = 0;

  for (const fellow of FELLOWS_10) {
    const dose = opts.warnCounts[fellow] ?? 0;
    const tot = fellowTotal(opts.scores[fellow], opts.bonuses, fellow);
    if (underBarrier(tot)) {
      n += 1;
      out.push({
        id: `i-${n}`,
        fellow,
        kind: "baraj",
        reason: "%80 baraj altı",
        detail: `Puan ${tot} (${Math.round(barrierRatio(tot) * 1000) / 10}%)`,
        dose,
        mailChainId: "baraj-mario",
        priority: 100 + (PERIOD_GAP(barrierRatio(tot)) ) - dose,
      });
    }

    const issues = fellowIssues(fellow, opts.stages);
    for (const iss of issues.slice(0, 3)) {
      const mod = SCORE_CATEGORIES.find((c) => c.code === iss.moduleCode);
      n += 1;
      out.push({
        id: `i-${n}`,
        fellow,
        kind: "sorun",
        reason: `${mod?.label ?? iss.moduleCode} sorunu`,
        detail: iss.issue || iss.note || "Sorun işaretli",
        dose,
        mailChainId: "disiplin-mario",
        moduleCode: iss.moduleCode,
        priority: 80 - dose,
      });
    }

    const comp = fellowCompletion(opts.activities, fellow, today);
    for (const m of comp.missing.slice(0, 2)) {
      n += 1;
      out.push({
        id: `i-${n}`,
        fellow,
        kind: "eksik",
        reason: "Eksik teslim",
        detail: `${m.title} · ${m.due}`,
        dose,
        mailChainId: "eksik-mario",
        planId: m.id,
        moduleCode: m.pointsCode,
        priority: 60 - dose,
      });
    }

    const mentorProblems = opts.mentors.filter(
      (m) => m.fellow === fellow && (m.status === "sorun" || (m.status !== "yapildi" && m.targetAt < today)),
    );
    for (const m of mentorProblems.slice(0, 2)) {
      n += 1;
      out.push({
        id: `i-${n}`,
        fellow,
        kind: "mentor",
        reason: `${m.kind} mentör`,
        detail:
          m.status === "sorun"
            ? m.note || "Mentör sorun"
            : `${m.mentorName} · hedef ${m.targetAt} (gecikti)`,
        dose,
        mailChainId: "mentor-mario",
        moduleCode: "mentorluk",
        priority: 70 - dose,
      });
    }
  }

  // Aynı fellow için en yüksek öncelikli 2 kayıt
  const byFellow = new Map<string, Intervention[]>();
  for (const i of out) {
    const list = byFellow.get(i.fellow) ?? [];
    list.push(i);
    byFellow.set(i.fellow, list);
  }
  const trimmed: Intervention[] = [];
  for (const list of byFellow.values()) {
    trimmed.push(...list.sort((a, b) => b.priority - a.priority).slice(0, 2));
  }
  return trimmed.sort((a, b) => b.priority - a.priority);
}

function PERIOD_GAP(ratio: number): number {
  return Math.round((0.8 - ratio) * 100);
}

/** 21 × kritik modül ısı haritası hücresi */
export function heatmapCell(
  fellow: string,
  moduleCode: string,
  stages: StageProgress[],
  scores: Record<string, number> | undefined,
  activities: Activity[],
): "ok" | "yolda" | "sorun" | "bekliyor" {
  const snap = moduleSnapshot(fellow, moduleCode, stages, scores, activities);
  if (snap.health === "tamam") return "ok";
  if (snap.health === "sorun") return "sorun";
  if (snap.health === "bekliyor") return "bekliyor";
  return "yolda";
}

export function planTitle(id?: string): string | undefined {
  if (!id) return undefined;
  return PLAN_ITEMS.find((p) => p.id === id)?.title;
}
