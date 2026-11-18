const KEY = "lead21-ops-v5";

export type Persisted = {
  /** Manuel puan override — yoksa aşamalardan türetilir */
  scoreOverrides: Record<string, Record<string, number>>;
  bonuses: import("../data/seed").BonusEntry[];
  tasks: import("../data/seed").OpsTask[];
  fellows: import("../data/seed").FellowMeta[];
  activities: import("../data/seed").Activity[];
  stages: import("../data/seed").StageProgress[];
  mentors: import("../data/seed").MentorMatch[];
  mailLog: import("../data/seed").MailLog[];
};

export function loadState(): Partial<Persisted> | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) {
      // eski sürümleri temizle; taze seed
      localStorage.removeItem("lead21-ops-v4");
      localStorage.removeItem("lead21-ops-v3");
      localStorage.removeItem("lead21-ops-v2");
      return null;
    }
    return JSON.parse(raw) as Partial<Persisted>;
  } catch {
    return null;
  }
}

export function saveState(state: Persisted): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* ignore */
  }
}

export function clearState(): void {
  localStorage.removeItem(KEY);
  localStorage.removeItem("lead21-ops-v4");
  localStorage.removeItem("lead21-ops-v3");
  localStorage.removeItem("lead21-ops-v2");
}
