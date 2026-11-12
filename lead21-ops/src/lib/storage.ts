import {
  DEFAULT_TASKS,
  FELLOWS_10,
  SCORE_IDEALS,
  type OpsTask,
} from "../data/seed";

const KEY = "lead21-ops-v1";

export type FellowScores = Record<string, Record<string, number>>;

export type JuryStore = Record<
  string,
  {
    juror: string;
    rows: Record<string, Record<string, number | null>>;
  }
>;

export type AppState = {
  tasks: OpsTask[];
  scores: FellowScores;
  jury: JuryStore;
  usedCards: number[];
};

function seedScores(): FellowScores {
  const out: FellowScores = {};
  for (const name of FELLOWS_10) {
    const row: Record<string, number> = {};
    // örnek: rastgele değil, deterministik ~%72–%95 arası görünüm
    let h = 0;
    for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
    for (const cat of SCORE_IDEALS) {
      const pct = 0.72 + ((h + cat.ideal) % 24) / 100;
      row[cat.code] = Math.round(cat.ideal * pct);
    }
    out[name] = row;
  }
  return out;
}

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as AppState;
  } catch {
    /* ignore */
  }
  return {
    tasks: DEFAULT_TASKS,
    scores: seedScores(),
    jury: {},
    usedCards: [],
  };
}

export function saveState(state: AppState) {
  localStorage.setItem(KEY, JSON.stringify(state));
}

export function exportScoresCsv(scores: FellowScores): string {
  const codes = SCORE_IDEALS.map((c) => c.code);
  const header = ["Fellow", ...SCORE_IDEALS.map((c) => c.label), "Toplam", "%"];
  const lines = [header.join(",")];
  for (const [name, row] of Object.entries(scores)) {
    const vals = codes.map((c) => row[c] ?? 0);
    const total = vals.reduce((a, b) => a + b, 0);
    const ideal = SCORE_IDEALS.reduce((a, c) => a + c.ideal, 0);
    const pct = ((total / ideal) * 100).toFixed(1);
    lines.push(
      [`"${name}"`, ...vals, total, pct]
        .join(","),
    );
  }
  return lines.join("\n");
}
