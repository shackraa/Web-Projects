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
  seedScores,
  type Activity,
  type BonusEntry,
  type FellowMeta,
  type MailLog,
  type OpsTask,
  type TaskStatus,
} from "./data/seed";
import { clearState, loadState, saveState } from "./lib/storage";

type Store = {
  scores: Record<string, Record<string, number>>;
  bonuses: BonusEntry[];
  tasks: OpsTask[];
  fellows: FellowMeta[];
  activities: Activity[];
  mailLog: MailLog[];
  setScore: (fellow: string, code: string, value: number) => void;
  addBonus: (fellow: string, points: number, reason: string) => void;
  removeBonus: (id: string) => void;
  setTaskStatus: (id: string, status: TaskStatus) => void;
  updateTask: (id: string, patch: Partial<OpsTask>) => void;
  addTask: (task: Omit<OpsTask, "id">) => void;
  updateFellow: (name: string, patch: Partial<FellowMeta>) => void;
  upsertActivity: (activity: Omit<Activity, "id"> & { id?: string }) => void;
  removeActivity: (id: string) => void;
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
  return {
    scores: saved?.scores ?? seedScores(),
    bonuses: saved?.bonuses ?? DEFAULT_BONUSES,
    tasks: hydrateTasks(saved?.tasks ?? DEFAULT_TASKS),
    fellows: saved?.fellows ?? seedFellowMeta(),
    activities: saved?.activities ?? seedActivities(),
    mailLog: saved?.mailLog ?? [],
  };
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [scores, setScores] = useState(() => boot().scores);
  const [bonuses, setBonuses] = useState(() => boot().bonuses);
  const [tasks, setTasks] = useState(() => boot().tasks);
  const [fellows, setFellows] = useState(() => boot().fellows);
  const [activities, setActivities] = useState(() => boot().activities);
  const [mailLog, setMailLog] = useState(() => boot().mailLog);

  useEffect(() => {
    saveState({ scores, bonuses, tasks, fellows, activities, mailLog });
  }, [scores, bonuses, tasks, fellows, activities, mailLog]);

  const setScore = useCallback((fellow: string, code: string, value: number) => {
    setScores((prev) => ({
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

  const addMailLog = useCallback((entry: Omit<MailLog, "id">) => {
    setMailLog((prev) => [{ ...entry, id: `m-${Date.now()}` }, ...prev].slice(0, 80));
  }, []);

  const resetDemo = useCallback(() => {
    clearState();
    const fresh = boot();
    setScores(seedScores());
    setBonuses(DEFAULT_BONUSES);
    setTasks(hydrateTasks(DEFAULT_TASKS));
    setFellows(seedFellowMeta());
    setActivities(seedActivities());
    setMailLog([]);
    void fresh;
  }, []);

  const value = useMemo(
    () => ({
      scores,
      bonuses,
      tasks,
      fellows,
      activities,
      mailLog,
      setScore,
      addBonus,
      removeBonus,
      setTaskStatus,
      updateTask,
      addTask,
      updateFellow,
      upsertActivity,
      removeActivity,
      addMailLog,
      resetDemo,
    }),
    [
      scores,
      bonuses,
      tasks,
      fellows,
      activities,
      mailLog,
      setScore,
      addBonus,
      removeBonus,
      setTaskStatus,
      updateTask,
      addTask,
      updateFellow,
      upsertActivity,
      removeActivity,
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

export { FELLOWS_10 };
