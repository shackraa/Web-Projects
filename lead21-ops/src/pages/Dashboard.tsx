import { Link } from "react-router-dom";
import { PERIOD, SPECIAL_DATES, TOTAL_IDEAL } from "../data/seed";
import {
  barrierRatio,
  fellowTotal,
  pctLabel,
  teamAverage,
  underBarrier,
} from "../lib/scoring";
import { FELLOWS_10, useStore } from "../state";

export function Dashboard() {
  const { scores, bonuses, tasks, fellows } = useStore();
  const today = new Date().toISOString().slice(0, 10);
  const avg = teamAverage(scores, bonuses, FELLOWS_10);

  const under = FELLOWS_10.filter((f) =>
    underBarrier(fellowTotal(scores[f], bonuses, f)),
  ).map((f) => ({
    name: f,
    total: fellowTotal(scores[f], bonuses, f),
    pct: barrierRatio(fellowTotal(scores[f], bonuses, f)),
  }));

  const overdue = tasks.filter((t) => t.status === "gecikti" || (t.status !== "yapildi" && t.due < today));
  const upcoming = SPECIAL_DATES.filter((d) => d.date >= today).slice(0, 5);

  return (
    <div className="page">
      <header className="page-head">
        <div>
          <p className="eyebrow">Erşen paneli · {PERIOD.name}</p>
          <h1>Bugün ne kritik?</h1>
          <p className="lede">
            %80 baraj, geciken teslimler ve yaklaşan milestone’lar — Excel’e dönmeden.
          </p>
        </div>
        <div className="stat-pills">
          <div className="stat">
            <span className="stat-label">Ekip ort.</span>
            <strong>{Math.round(avg)}</strong>
            <span className="stat-sub">/ {TOTAL_IDEAL}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Baraj altı</span>
            <strong className={under.length ? "danger" : "ok"}>{under.length}</strong>
            <span className="stat-sub">fellow</span>
          </div>
          <div className="stat">
            <span className="stat-label">Geciken</span>
            <strong className={overdue.length ? "warn" : "ok"}>{overdue.length}</strong>
            <span className="stat-sub">görev</span>
          </div>
        </div>
      </header>

      <div className="grid-2">
        <section className="panel">
          <div className="panel-head">
            <h2>%80 altı</h2>
            <Link to="/puan">Puan tahtası →</Link>
          </div>
          {under.length === 0 ? (
            <p className="muted">Herkes barajın üzerinde.</p>
          ) : (
            <ul className="list">
              {under.map((u) => (
                <li key={u.name}>
                  <Link to={`/fellows/${encodeURIComponent(u.name)}`}>
                    <span>{u.name}</span>
                    <span className="badge danger">{pctLabel(u.pct)} · {u.total}p</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="panel">
          <div className="panel-head">
            <h2>Geciken görevler</h2>
            <Link to="/gorevler">Tümü →</Link>
          </div>
          {overdue.length === 0 ? (
            <p className="muted">Geciken yok.</p>
          ) : (
            <ul className="list">
              {overdue.slice(0, 8).map((t) => (
                <li key={t.id}>
                  <div>
                    <strong>{t.title}</strong>
                    <span className="muted block">{t.due} · {t.kind}</span>
                  </div>
                  <span className="badge warn">gecikti</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="panel">
          <div className="panel-head">
            <h2>Yaklaşan tarihler</h2>
            <Link to="/takvim">Takvim →</Link>
          </div>
          <ul className="list">
            {upcoming.map((d) => (
              <li key={d.id}>
                <div>
                  <strong>{d.title}</strong>
                  <span className="muted block">{d.date}</span>
                </div>
                <span className="badge">{d.kind}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="panel">
          <div className="panel-head">
            <h2>Fellow özeti</h2>
            <Link to="/fellows">CRM →</Link>
          </div>
          <p className="muted">
            {fellows.length} fellow · örnek veri localStorage’da tutulur. Bonus ve puan
            düzenlemeleri anında yansır.
          </p>
          <div className="mini-bars">
            {FELLOWS_10.slice(0, 8).map((f) => {
              const tot = fellowTotal(scores[f], bonuses, f);
              const r = barrierRatio(tot);
              return (
                <div key={f} className="mini-bar-row">
                  <span>{f.split(" ")[0]}</span>
                  <div className="bar-track">
                    <div
                      className={`bar-fill ${underBarrier(tot) ? "is-low" : ""}`}
                      style={{ width: `${Math.min(100, r * 100)}%` }}
                    />
                    <i className="bar-mark" style={{ left: "80%" }} />
                  </div>
                  <span className="mono">{pctLabel(r)}</span>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
