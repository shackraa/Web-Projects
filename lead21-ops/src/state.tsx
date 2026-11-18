import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  DEFAULT_BONUSES,
  DEFAULT_TASKS,
  FELLOWS_10,
  seedActivities,
  seedFellowMeta,
  seedMentors,
  seedStages,
  type Activity,
  type BonusEntry,
  type FellowMeta,
  type MailLog,
  type MentorMatch,
  type MentorStatus,
  type OpsTask,
  type StageProgress,
  type StageStatus,
  type TaskStatus,
} from "./data/seed";
import { mergeScores, scoreFromStages, scoresFromStages } from "./lib/derive";
import { clearState, loadState, saveState } from "./lib/storage";

type Store = {
  scores: Record<string, Record<string, number>>;
  scoreOverrides: Record<string, Record<string, number>>;
  bonuses: BonusEntry[];
  tasks: OpsTask[];
  fellows: FellowMeta[];
  activities: Activity[];
  stages: StageProgress[];
  mentors: MentorMatch[];
  mailLog: MailLog[];
  setScore: (fellow: string, code: string, value: number) => void;
  addBonus: (fellow: string, points: number, reason: string) => void;
  removeBonus: (id: string) => void;
  setTaskStatus: (id: string, status: TaskStatus) => void;
  updateTask: (id: string, patch: Partial<OpsTask>) => void;
  addTask: (task: Omit<OpsTask, "id">) => void;
  updateFellow: (name: string, patch: Partial<FellowMeta>) => void;
  bumpWarn: (name: string) => void;
  upsertActivity: (activity: Omit<Activity, "id"> & { id?: string }) => void;
  removeActivity: (id: string) => void;
  upsertStage: (entry: Omit<StageProgress, "id"> & { id?: string }) => void;
  setStageStatus: (
    fellow: string,
    moduleCode: string,
    stageCode: string,
    status: StageStatus,
    extra?: { note?: string; issue?: string; at?: string },
  ) => void;
  upsertMentor: (entry: Omit<MentorMatch, "id"> & { id?: string }) => void;
  setMentorStatus: (
    id: string,
    status: MentorStatus,
    extra?: { note?: string; doneAt?: string },
  ) => void;
  addMailLog: (entry: Omit<MailLog, "id">) => void;
  resetDemo: () => void;
};

const Ctx = createContext<Store | null>(null);

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

function hydrateTasks(tasks: OpsTask[]): OpsTask[] {
  const today = todayISO();
  return tasks.map((t) => {
    if (t.status === "yapildi") return t;
    if (t.due < today) return { ...t, status: "gecikti" };
    if (t.status === "gecikti" && t.due >= today) return { ...t, status: "yapilmadi" };
    return t;
  });
}

function boot() {
  const saved = loadState();
  const stages = saved?.stages ?? seedStages();
  const overrides = saved?.scoreOverrides ?? {};
  const derived = scoresFromStages(stages, FELLOWS_10);
  return {
    stages,
    scoreOverrides: overrides,
    scores: mergeScores(derived, overrides),
    bonuses: saved?.bonuses ?? DEFAULT_BONUSES,
    tasks: hydrateTasks(saved?.tasks ?? DEFAULT_TASKS),
    fellows: saved?.fellows ?? seedFellowMeta(),
    activities: saved?.activities ?? seedActivities(),
    mentors: saved?.mentors ?? seedMentors(),
    mailLog: saved?.mailLog ?? [],
  };
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [stages, setStages] = useState(() => boot().stages);
  const [scoreOverrides, setScoreOverrides] = useState(() => boot().scoreOverrides);
  const [bonuses, setBonuses] = useState(() => boot().bonuses);
  const [tasks, setTasks] = useState(() => boot().tasks);
  const [fellows, setFellows] = useState(() => boot().fellows);
  const [activities, setActivities] = useState(() => boot().activities);
  const [mentors, setMentors] = useState(() => boot().mentors);
  const [mailLog, setMailLog] = useState(() => boot().mailLog);

  const scores = useMemo(
    () => mergeScores(scoresFromStages(stages, FELLOWS_10), scoreOverrides),
    [stages, scoreOverrides],
  );

  useEffect(() => {
    saveState({
      scoreOverrides,
      bonuses,
      tasks,
      fellows,
      activities,
      stages,
      mentors,
      mailLog,
    });
  }, [scoreOverrides, bonuses, tasks, fellows, activities, stages, mentors, mailLog]);

  const setScore = useCallback((fellow: string, code: string, value: number) => {
    setScoreOverrides((prev) => ({
      ...prev,
      [fellow]: { ...prev[fellow], [code]: Math.max(0, value) },
    }));
  }, []);

  const addBonus = useCallback((fellow: string, points: number, reason: string) => {
    setBonuses((prev) => [
      ...prev,
      { id: `b-${Date.now()}`, fellow, points, reason, at: todayISO() },
    ]);
  }, []);

  const removeBonus = useCallback((id: string) => {
    setBonuses((prev) => prev.filter((b) => b.id !== id));
  }, []);

  const setTaskStatus = useCallback((id: string, status: TaskStatus) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
  }, []);

  const updateTask = useCallback((id: string, patch: Partial<OpsTask>) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  }, []);

  const addTask = useCallback((task: Omit<OpsTask, "id">) => {
    setTasks((prev) => [...prev, { ...task, id: `t-${Date.now()}` }]);
  }, []);

  const updateFellow = useCallback((name: string, patch: Partial<FellowMeta>) => {
    setFellows((prev) => prev.map((f) => (f.name === name ? { ...f, ...patch } : f)));
  }, []);

  const bumpWarn = useCallback((name: string) => {
    setFellows((prev) =>
      prev.map((f) =>
        f.name === name
          ? { ...f, warnCount: (f.warnCount ?? 0) + 1, status: f.status === "aktif" ? "uyari" : f.status }
          : f,
      ),
    );
  }, []);

  const upsertActivity = useCallback((activity: Omit<Activity, "id"> & { id?: string }) => {
    setActivities((prev) => {
      if (activity.id) {
        return prev.map((a) => (a.id === activity.id ? { ...a, ...activity, id: activity.id } : a));
      }
      const existing = prev.find(
        (a) => a.fellow === activity.fellow && a.planItemId === activity.planItemId,
      );
      if (existing) {
        return prev.map((a) =>
          a.id === existing.id ? { ...existing, ...activity, id: existing.id } : a,
        );
      }
      return [...prev, { ...activity, id: `a-${Date.now()}` }];
    });
  }, []);

  const removeActivity = useCallback((id: string) => {
    setActivities((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const upsertStage = useCallback((entry: Omit<StageProgress, "id"> & { id?: string }) => {
    setStages((prev) => {
      const existing = prev.find(
        (s) =>
          s.fellow === entry.fellow &&
          s.moduleCode === entry.moduleCode &&
          s.stageCode === entry.stageCode,
      );
      if (existing || entry.id) {
        const id = entry.id ?? existing!.id;
        return prev.map((s) => (s.id === id ? { ...s, ...entry, id } : s));
      }
      return [...prev, { ...entry, id: `s-${Date.now()}` }];
    });
    // Manuel override'ı kaldır — aşama kaynak olsun
    setScoreOverrides((prev) => {
      const row = { ...prev[entry.fellow] };
      if (!(entry.moduleCode in row)) return prev;
      delete row[entry.moduleCode];
      return { ...prev, [entry.fellow]: row };
    });
  }, []);

  const setStageStatus = useCallback(
    (
      fellow: string,
      moduleCode: string,
      stageCode: string,
      status: StageStatus,
      extra?: { note?: string; issue?: string; at?: string },
    ) => {
      upsertStage({
        fellow,
        moduleCode,
        stageCode,
        status,
        at: extra?.at ?? (status === "bekliyor" ? undefined : todayISO()),
        note: extra?.note,
        issue: status === "sorun" ? extra?.issue ?? "Sorun işaretlendi" : extra?.issue,
      });
    },
    [upsertStage],
  );

  const upsertMentor = useCallback((entry: Omit<MentorMatch, "id"> & { id?: string }) => {
    setMentors((prev) => {
      if (entry.id) {
        return prev.map((m) => (m.id === entry.id ? { ...m, ...entry, id: entry.id } : m));
      }
      return [...prev, { ...entry, id: `ment-${Date.now()}` }];
    });
  }, []);

  const setMentorStatus = useCallback(
    (id: string, status: MentorStatus, extra?: { note?: string; doneAt?: string }) => {
      setMentors((prev) =>
        prev.map((m) =>
          m.id === id
            ? {
                ...m,
                status,
                note: extra?.note ?? m.note,
                doneAt:
                  extra?.doneAt ??
                  (status === "yapildi" ? todayISO() : status === "sorun" ? m.doneAt : m.doneAt),
              }
            : m,
        ),
      );
    },
    [],
  );

  const addMailLog = useCallback((entry: Omit<MailLog, "id">) => {
    setMailLog((prev) => [{ ...entry, id: `m-${Date.now()}` }, ...prev].slice(0, 80));
  }, []);

  const resetDemo = useCallback(() => {
    clearState();
    const stages0 = seedStages();
    setStages(stages0);
    setScoreOverrides({});
    setBonuses(DEFAULT_BONUSES);
    setTasks(hydrateTasks(DEFAULT_TASKS));
    setFellows(seedFellowMeta());
    setActivities(seedActivities());
    setMentors(seedMentors());
    setMailLog([]);
  }, []);

  const value = useMemo(
    () => ({
      scores,
      scoreOverrides,
      bonuses,
      tasks,
      fellows,
      activities,
      stages,
      mentors,
      mailLog,
      setScore,
      addBonus,
      removeBonus,
      setTaskStatus,
      updateTask,
      addTask,
      updateFellow,
      bumpWarn,
      upsertActivity,
      removeActivity,
      upsertStage,
      setStageStatus,
      upsertMentor,
      setMentorStatus,
      addMailLog,
      resetDemo,
    }),
    [
      scores,
      scoreOverrides,
      bonuses,
      tasks,
      fellows,
      activities,
      stages,
      mentors,
      mailLog,
      setScore,
      addBonus,
      removeBonus,
      setTaskStatus,
      updateTask,
      addTask,
      updateFellow,
      bumpWarn,
      upsertActivity,
      removeActivity,
      upsertStage,
      setStageStatus,
      upsertMentor,
      setMentorStatus,
      addMailLog,
      resetDemo,
    ],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore(): Store {
  const v = useContext(Ctx);
  if (!v) throw new Error("StoreProvider gerekli");
  return v;
}

export { FELLOWS_10, scoreFromStages };
