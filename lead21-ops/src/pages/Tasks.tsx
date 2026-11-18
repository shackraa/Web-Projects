import { useMemo, useState } from "react";
import type { TaskStatus } from "../data/seed";
import { useStore } from "../state";

export function Tasks() {
  const { tasks, setTaskStatus, addTask } = useStore();
  const [filter, setFilter] = useState<"hepsi" | TaskStatus>("hepsi");
  const [title, setTitle] = useState("");
  const [due, setDue] = useState("");
  const [kind, setKind] = useState("ops");

  const today = new Date().toISOString().slice(0, 10);

  const rows = useMemo(() => {
    return tasks
      .filter((t) => (filter === "hepsi" ? true : t.status === filter))
      .sort((a, b) => a.due.localeCompare(b.due));
  }, [tasks, filter]);

  const overdueCount = tasks.filter((t) => t.status === "gecikti").length;

  return (
    <div className="page">
      <header className="page-head">
        <div>
          <p className="eyebrow">Görev tracker</p>
          <h1>Modül & operasyon görevleri</h1>
          <p className="lede">
            Deadline + durum (yapılmadı / gecikti / yapıldı). Geciken:{" "}
            <strong className="warn">{overdueCount}</strong>
          </p>
        </div>
      </header>

      <div className="toolbar wrap">
        {(["hepsi", "gecikti", "yapilmadi", "yapildi"] as const).map((f) => (
          <button
            key={f}
            type="button"
            className={`chip ${filter === f ? "active" : ""}`}
            onClick={() => setFilter(f)}
          >
            {f === "yapilmadi" ? "yapılmadı" : f}
          </button>
        ))}
      </div>

      <section className="panel mb">
        <h2>Yeni görev</h2>
        <form
          className="form-row"
          onSubmit={(e) => {
            e.preventDefault();
            if (!title.trim() || !due) return;
            const status: TaskStatus = due < today ? "gecikti" : "yapilmadi";
            addTask({ title: title.trim(), due, status, kind });
            setTitle("");
            setDue("");
          }}
        >
          <input
            className="input grow"
            placeholder="Görev başlığı"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input className="input" type="date" value={due} onChange={(e) => setDue(e.target.value)} />
          <select className="select" value={kind} onChange={(e) => setKind(e.target.value)}>
            <option value="ops">ops</option>
            <option value="slj">slj</option>
            <option value="mentor">mentor</option>
            <option value="summit">summit</option>
            <option value="sektorel">sektörel</option>
            <option value="talks">talks</option>
            <option value="base">base</option>
            <option value="puan">puan</option>
          </select>
          <button className="btn" type="submit">
            Ekle
          </button>
        </form>
      </section>

      <ul className="task-list">
        {rows.map((t) => (
          <li key={t.id} className={`task-item status-${t.status}`}>
            <div>
              <strong>{t.title}</strong>
              <span className="muted block">
                {t.due} · {t.kind}
                {t.note ? ` · ${t.note}` : ""}
              </span>
            </div>
            <select
              className="select sm"
              value={t.status}
              onChange={(e) => setTaskStatus(t.id, e.target.value as TaskStatus)}
            >
              <option value="yapilmadi">yapılmadı</option>
              <option value="gecikti">gecikti</option>
              <option value="yapildi">yapıldı</option>
            </select>
          </li>
        ))}
      </ul>
    </div>
  );
}
