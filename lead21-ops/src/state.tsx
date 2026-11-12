import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  exportScoresCsv,
  loadState,
  saveState,
  type AppState,
  type FellowScores,
  type JuryStore,
} from "./lib/storage";
import type { OpsTask } from "./data/seed";

type Ctx = {
  state: AppState;
  setTasks: (tasks: OpsTask[]) => void;
  toggleTask: (id: string) => void;
  setScores: (scores: FellowScores) => void;
  setScore: (fellow: string, code: string, value: number) => void;
  setJury: (jury: JuryStore) => void;
  toggleCard: (n: number) => void;
  resetCards: () => void;
  downloadCsv: () => void;
};

const StateCtx = createContext<Ctx | null>(null);

export function StateProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(() => loadState());

  const commit = useCallback((next: AppState) => {
    setState(next);
    saveState(next);
  }, []);

  const api = useMemo<Ctx>(
    () => ({
      state,
      setTasks: (tasks) => commit({ ...state, tasks }),
      toggleTask: (id) =>
        commit({
          ...state,
          tasks: state.tasks.map((t) =>
            t.id === id
              ? { ...t, status: t.status === "done" ? "open" : "done" }
              : t,
          ),
        }),
      setScores: (scores) => commit({ ...state, scores }),
      setScore: (fellow, code, value) =>
        commit({
          ...state,
          scores: {
            ...state.scores,
            [fellow]: { ...state.scores[fellow], [code]: value },
          },
        }),
      setJury: (jury) => commit({ ...state, jury }),
      toggleCard: (n) => {
        const has = state.usedCards.includes(n);
        commit({
          ...state,
          usedCards: has
            ? state.usedCards.filter((x) => x !== n)
            : [...state.usedCards, n],
        });
      },
      resetCards: () => commit({ ...state, usedCards: [] }),
      downloadCsv: () => {
        const blob = new Blob([exportScoresCsv(state.scores)], {
          type: "text/csv;charset=utf-8",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "lead21-puanlar.csv";
        a.click();
        URL.revokeObjectURL(url);
      },
    }),
    [state, commit],
  );

  return <StateCtx.Provider value={api}>{children}</StateCtx.Provider>;
}

export function useAppState() {
  const ctx = useContext(StateCtx);
  if (!ctx) throw new Error("StateProvider yok");
  return ctx;
}
