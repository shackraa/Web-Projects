import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { PageTitle } from "../components/PageTitle";
import {
  FELLOWS_10,
  HEATMAP_MODULES,
  MONTHLY_FLOW,
  MONTH_MODULES,
  PERIOD,
  SCORE_CATEGORIES,
  SPECIAL_DATES,
  TOTAL_IDEAL,
} from "../data/seed";
import { buildInterventions, heatmapCell } from "../lib/interventions";
import {
  barrierRatio,
  fellowTotal,
  pctLabel,
  teamAverage,
  underBarrier,
} from "../lib/scoring";
import { useStore } from "../state";

const KIND_LABEL: Record<string, string> = {
  baraj: "Baraj altı",
  sorun: "Modül sorunu",
  eksik: "Eksik teslim",
  mentor: "Mentör",
};

const TASK_LABEL: Record<string, string> = {
  gecikti: "Gecikti",
  yapilmadi: "Yapılmadı",
  yapildi: "Yapıldı",
};

export function Dashboard() {
  const {
    scores,
    bonuses,
    tasks,
    fellows,
    activities,
    stages,
    mentors,
  } = useStore();

  const now = new Date();
  const defaultMonth = now.getFullYear() === PERIOD.year ? now.getMonth() + 1 : 11;
  const [month, setMonth] = useState(defaultMonth);

  const flow = MONTHLY_FLOW.find((m) => m.monthKey === month) ?? MONTHLY_FLOW[10];
  const monthMods = MONTH_MODULES[month] ?? [];
  const today = now.toISOString().slice(0, 10);

  const warnCounts = useMemo(() => {
    const m: Record<string, number> = {};
    for (const f of fellows) m[f.name] = f.warnCount ?? 0;
    return m;
  }, [fellows]);

  const interventions = useMemo(
    () =>
      buildInterventions({
        scores,
        bonuses,
        stages,
        activities,
        mentors,
        warnCounts,
        today,
      }),
    [scores, bonuses, stages, activities, mentors, warnCounts, today],
  );

  const avg = teamAverage(scores, bonuses, FELLOWS_10);
  const under = FELLOWS_10.filter((f) =>
    underBarrier(fellowTotal(scores[f], bonuses, f)),
  ).length;

  const opsTasks = tasks
    .filter((t) => t.status !== "yapildi")
    .sort((a, b) => a.due.localeCompare(b.due))
    .slice(0, 6);

  const upcoming = SPECIAL_DATES.filter((d) => d.date >= today).slice(0, 4);

  return (
    <div className="page">
      <PageTitle title={`Bu ay · ${flow.month}`} />
      <Breadcrumbs items={[{ label: "Bu ay" }]} />
      <header className="page-head">
        <div>
          <p className="eyebrow">Erşen · {PERIOD.name}</p>
          <h1>Bu ay · {flow.month}</h1>
          <p className="lede">
            Bu ayın odakları, kim müdahale bekliyor, kritik modüllerde durum.
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
            <strong className={under ? "danger" : "ok"}>{under}</strong>
          </div>
          <div className="stat">
            <span className="stat-label">Müdahale</span>
            <strong className={interventions.length ? "warn" : "ok"}>
              {interventions.length}
            </strong>
          </div>
        </div>
      </header>

      <div className="month-strip" role="tablist" aria-label="Ay seç">
        {MONTHLY_FLOW.map((m) => (
          <button
            key={m.monthKey}
            type="button"
            role="tab"
            aria-selected={month === m.monthKey}
            className={`month-pill ${month === m.monthKey ? "active" : ""}`}
            onClick={() => setMonth(m.monthKey)}
          >
            {m.month.slice(0, 3)}
          </button>
        ))}
      </div>

      <section className="panel mb">
        <div className="panel-head">
          <h2>{flow.month} odakları</h2>
          <Link to="/plan">Yıllık plan</Link>
        </div>
        <div className="tag-row">
          {flow.items.map((item) => (
            <span key={item} className="tag">
              {item}
            </span>
          ))}
        </div>
        {monthMods.length > 0 && (
          <p className="muted tiny mt">
            Modüller:{" "}
            {monthMods
              .map((c) => SCORE_CATEGORIES.find((x) => x.code === c)?.label ?? c)
              .join(" · ")}
          </p>
        )}
        {upcoming.length > 0 && (
          <ul className="list compact mt">
            {upcoming.map((d) => (
              <li key={d.id}>
                <Link to="/takvim">
                  <strong className="pick-name">{d.title}</strong>
                  <i className="muted"> · {d.date}</i>
                </Link>
                <span className="badge">{d.kind}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="grid-2">
        <section className="panel" id="mudahale">
          <div className="panel-head">
            <h2>Müdahale kuyruğu</h2>
            <Link to="/mail">Mail zinciri</Link>
          </div>
          {interventions.length === 0 ? (
            <p className="muted">Şu an kritik müdahale yok.</p>
          ) : (
            <ul className="pick-list">
              {interventions.slice(0, 12).map((i) => (
                <li key={i.id} className="pick-row">
                  <Link
                    className="pick-main"
                    to={`/fellows/${encodeURIComponent(i.fellow)}`}
                  >
                    <span className="pick-name">{i.fellow}</span>
                    <span className="muted block tiny">
                      {i.reason} · {i.detail}
                      {i.dose > 0 ? ` · doz #${i.dose}` : ""}
                    </span>
                  </Link>
                  <div className="intervene-actions">
                    <span className={`badge ${i.kind === "baraj" || i.kind === "sorun" ? "danger" : "warn"}`}>
                      {KIND_LABEL[i.kind] ?? i.kind}
                    </span>
                    <Link
                      className="btn sm"
                      to={`/mail?fellow=${encodeURIComponent(i.fellow)}&chain=${i.mailChainId}${
                        i.planId ? `&plan=${i.planId}` : ""
                      }&dose=${Math.min(3, Math.max(1, (i.dose || 0) + 1))}`}
                    >
                      Yaz
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="panel">
          <div className="panel-head">
            <h2>Erşen hatırlatmaları</h2>
            <Link to="/gorevler">Görevler →</Link>
          </div>
          {opsTasks.length === 0 ? (
            <p className="muted">
              Açık hatırlatma yok.{" "}
              <Link className="name-link" to="/gorevler">
                Görevlere git
              </Link>
            </p>
          ) : (
            <ul className="pick-list">
              {opsTasks.map((t) => (
                <li key={t.id} className="pick-row">
                  <Link className="pick-main" to="/gorevler">
                    <span className="pick-name">{t.title}</span>
                    <span className="muted block tiny">{t.due}</span>
                  </Link>
                  <span className={`badge ${t.status === "gecikti" ? "danger" : "warn"}`}>
                    {TASK_LABEL[t.status] ?? t.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <section className="panel mt-block">
        <div className="panel-head">
          <h2>Isı haritası · 21 × kritik modül</h2>
          <Link to="/fellows">Fellow’lar</Link>
        </div>
        <div className="heat-wrap">
          <table className="table heat dense">
            <thead>
              <tr>
                <th>Fellow</th>
                {HEATMAP_MODULES.map((code) => (
                  <th key={code} title={SCORE_CATEGORIES.find((c) => c.code === code)?.label}>
                    {(SCORE_CATEGORIES.find((c) => c.code === code)?.label ?? code).slice(0, 6)}
                  </th>
                ))}
                <th>%</th>
              </tr>
            </thead>
            <tbody>
              {FELLOWS_10.map((name) => {
                const tot = fellowTotal(scores[name], bonuses, name);
                const r = barrierRatio(tot);
                return (
                  <tr key={name}>
                    <td>
                      <Link className="name-link" to={`/fellows/${encodeURIComponent(name)}`}>
                        {name.split(" ")[0]}
                        <span className="name-hint" aria-hidden>
                          →
                        </span>
                      </Link>
                    </td>
                    {HEATMAP_MODULES.map((code) => {
                      const cell = heatmapCell(name, code, stages, scores[name], activities);
                      return (
                        <td key={code} className="center">
                          <span className={`heat-dot heat-${cell}`} title={cell} />
                        </td>
                      );
                    })}
                    <td>
                      <span className={`badge ${underBarrier(tot) ? "danger" : "ok"}`}>
                        {pctLabel(r)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="muted tiny mt">
          Yeşil tamam · sarı yolda · kırmızı sorun · gri bekliyor. Puan aşamalardan türetilir.
        </p>
      </section>
    </div>
  );
}
