import { FELLOWS_10, PLAN_ITEMS, type Activity, type PlanItem } from "../data/seed";

export function latestActivity(
  activities: Activity[],
  fellow: string,
  planItemId: string,
): Activity | undefined {
  return activities
    .filter((a) => a.fellow === fellow && a.planItemId === planItemId)
    .sort((a, b) => b.at.localeCompare(a.at))[0];
}

export function isDone(activities: Activity[], fellow: string, planItemId: string): boolean {
  const a = latestActivity(activities, fellow, planItemId);
  return a?.status === "teslim" || a?.status === "kismi";
}

export function isFullyDone(activities: Activity[], fellow: string, planItemId: string): boolean {
  return latestActivity(activities, fellow, planItemId)?.status === "teslim";
}

export function fellowsDone(activities: Activity[], planItemId: string): string[] {
  return FELLOWS_10.filter((f) => isDone(activities, f, planItemId));
}

export function fellowsMissing(activities: Activity[], planItemId: string): string[] {
  return FELLOWS_10.filter((f) => !isDone(activities, f, planItemId));
}

export function fellowCompletion(activities: Activity[], fellow: string, asOf = "2026-11-18") {
  const due = PLAN_ITEMS.filter((p) => p.due <= asOf);
  const done = due.filter((p) => isFullyDone(activities, fellow, p.id));
  const partial = due.filter((p) => latestActivity(activities, fellow, p.id)?.status === "kismi");
  const missing = due.filter((p) => !isDone(activities, fellow, p.id));
  return {
    dueCount: due.length,
    doneCount: done.length,
    partialCount: partial.length,
    missing,
    done,
    ratio: due.length ? done.length / due.length : 1,
  };
}

export function planByMonth(): { month: number; label: string; items: PlanItem[] }[] {
  const labels = [
    "",
    "Ocak",
    "Şubat",
    "Mart",
    "Nisan",
    "Mayıs",
    "Haziran",
    "Temmuz",
    "Ağustos",
    "Eylül",
    "Ekim",
    "Kasım",
    "Aralık",
  ];
  const months = [...new Set(PLAN_ITEMS.map((p) => p.month))].sort((a, b) => a - b);
  return months.map((m) => ({
    month: m,
    label: labels[m],
    items: PLAN_ITEMS.filter((p) => p.month === m).sort((a, b) => a.due.localeCompare(b.due)),
  }));
}

export function fillTemplate(
  tpl: string,
  vars: { isim?: string; kalem?: string; deadline?: string },
): string {
  return tpl
    .replaceAll("{{isim}}", vars.isim ?? "")
    .replaceAll("{{kalem}}", vars.kalem ?? "")
    .replaceAll("{{deadline}}", vars.deadline ?? "");
}
