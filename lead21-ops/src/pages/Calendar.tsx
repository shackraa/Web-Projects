import { Link } from "react-router-dom";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { PageTitle } from "../components/PageTitle";
import { MONTHLY_FLOW, SPECIAL_DATES } from "../data/seed";
import { useStore } from "../state";

export function CalendarPage() {
  const { tasks } = useStore();
  const today = new Date().toISOString().slice(0, 10);
  const monthNow = new Date().getMonth() + 1;

  return (
    <div className="page">
      <PageTitle title="Takvim" />
      <Breadcrumbs items={[{ label: "Bu ay", to: "/" }, { label: "Takvim" }]} />
      <header className="page-head">
        <div>
          <p className="eyebrow">Takvim</p>
          <h1>Program akışı</h1>
          <p className="lede">
            Aylık akış, özel tarihler ve geciken görevler. Bu ay kırmızı çerçeveyle işaretli.
          </p>
        </div>
        <Link className="btn ghost" to="/gorevler">
          Görevler
        </Link>
      </header>

      <div className="month-grid">
        {MONTHLY_FLOW.map((m) => {
          const monthTasks = tasks.filter((t) => {
            const mo = Number(t.due.slice(5, 7));
            return mo === m.monthKey;
          });
          const overdue = monthTasks.filter((t) => t.status === "gecikti").length;
          const specials = SPECIAL_DATES.filter((d) => Number(d.date.slice(5, 7)) === m.monthKey);
          const isNow = m.monthKey === monthNow;

          return (
            <article key={m.month} className={`month-card ${isNow ? "is-now" : ""}`}>
              <header className="month-card-head">
                <h2>{m.month}</h2>
                {isNow && <span className="badge ok">bu ay</span>}
                {overdue > 0 && <span className="badge warn">{overdue} geciken</span>}
              </header>
              <ul className="flow-items">
                {m.items.map((it) => (
                  <li key={it}>{it}</li>
                ))}
              </ul>
              {specials.length > 0 && (
                <div className="specials">
                  <h3>Özel tarihler</h3>
                  <ul>
                    {specials.map((s) => (
                      <li key={s.id} className={s.date < today ? "past" : ""}>
                        <time>{s.date.slice(5)}</time> {s.title}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {monthTasks.length > 0 && (
                <div className="specials">
                  <h3>Görevler</h3>
                  <ul>
                    {monthTasks.map((t) => (
                      <li key={t.id}>
                        <Link
                          className={`task-pill ${t.status}`}
                          to="/gorevler"
                        >
                          {t.due.slice(8)}. {t.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}
