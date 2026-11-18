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
  seedFellowMeta,
  seedScores,
  type BonusEntry,
  type FellowMeta,
  type OpsTask,
  type TaskStatus,
} from "./data/seed";
import { clearState, loadState, saveState } from "./lib/storage";

type Store = {
  scores: Record<string, Record<string, number>>;
  bonuses: BonusEntry[];
  tasks: OpsTask[];
  fellows: FellowMeta[];
  setScore: (fellow: string, code: string, value: number) => void;
  addBonus: (fellow: string, points: number, reason: string) => void;
  removeBonus: (id: string) => void;
  setTaskStatus: (id: string, status: TaskStatus) => void;
  updateTask: (id: string, patch: Partial<OpsTask>) => void;
  addTask: (task: Omit<OpsTask, "id">) => void;
  updateFellow: (name: string, patch: Partial<FellowMeta>) => void;
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

function initial(): Omit<Store, "setScore" | "addBonus" | "removeBonus" | "setTaskStatus" | "updateTask" | "addTask" | "updateFellow" | "resetDemo"> {
  const saved = loadState();
  return {
    scores: saved?.scores ?? seedScores(),
    bonuses: saved?.bonuses ?? DEFAULT_BONUSES,
    tasks: hydrateTasks(saved?.tasks ?? DEFAULT_TASKS),
    fellows: saved?.fellows ?? seedFellowMeta(),
  };
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [scores, setScores] = useState(() => initial().scores);
  const [bonuses, setBonuses] = useState(() => initial().bonuses);
  const [tasks, setTasks] = useState(() => initial().tasks);
  const [fellows, setFellows] = useState(() => initial().fellows);

  useEffect(() => {
    saveState({ scores, bonuses, tasks, fellows });
  }, [scores, bonuses, tasks, fellows]);

  const setScore = useCallback((fellow: string, code: string, value: number) => {
    setScores((prev) => ({
      ...prev,
      [fellow]: { ...prev[fellow], [code]: Math.max(0, value) },
    }));
  }, []);

  const addBonus = useCallback((fellow: string, points: number, reason: string) => {
    setBonuses((prev) => [
      ...prev,
      {
        id: `b-${Date.now()}`,
        fellow,
        points,
        reason,
        at: todayISO(),
      },
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

  const resetDemo = useCallback(() => {
    clearState();
    setScores(seedScores());
    setBonuses(DEFAULT_BONUSES);
    setTasks(hydrateTasks(DEFAULT_TASKS));
    setFellows(seedFellowMeta());
  }, []);

  const value = useMemo(
    () => ({
      scores,
      bonuses,
      tasks,
      fellows,
      setScore,
      addBonus,
      removeBonus,
      setTaskStatus,
      updateTask,
      addTask,
      updateFellow,
      resetDemo,
    }),
    [
      scores,
      bonuses,
      tasks,
      fellows,
      setScore,
      addBonus,
      removeBonus,
      setTaskStatus,
      updateTask,
      addTask,
      updateFellow,
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
