const KEY = "lead21-ops-v2";

export type Persisted = {
  scores: Record<string, Record<string, number>>;
  bonuses: import("../data/seed").BonusEntry[];
  tasks: import("../data/seed").OpsTask[];
  fellows: import("../data/seed").FellowMeta[];
};

export function loadState(): Partial<Persisted> | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Partial<Persisted>;
  } catch {
    return null;
  }
}

export function saveState(state: Persisted): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* ignore quota */
  }
}

export function clearState(): void {
  localStorage.removeItem(KEY);
}
