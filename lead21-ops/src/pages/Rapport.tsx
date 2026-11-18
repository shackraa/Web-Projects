import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { PageTitle } from "../components/PageTitle";
import { FELLOWS_10, PLAN_ITEMS } from "../data/seed";
import { fellowCompletion, latestActivity } from "../lib/plan";
import { barrierRatio, fellowTotal, pctLabel, underBarrier } from "../lib/scoring";
import { useStore } from "../state";

export function Rapport() {
  const { activities, scores, bonuses, fellows } = useStore();
  const [params] = useSearchParams();
  const [fellow, setFellow] = useState<string>("hepsi");
  const asOf = new Date().toISOString().slice(0, 10);

  useEffect(() => {
    const q = params.get("fellow");
    if (q) {
      const name = decodeURIComponent(q);
      if ((FELLOWS_10 as readonly string[]).includes(name)) setFellow(name);
    }
  }, [params]);

  const rows = useMemo(() => {
    const list = fellow === "hepsi" ? [...FELLOWS_10] : [fellow];
    return list
      .map((f) => {
        const c = fellowCompletion(activities, f, asOf);
        const total = fellowTotal(scores[f], bonuses, f);
        return {
          name: f,
          ...c,
          total,
          pct: barrierRatio(total),
          low: underBarrier(total),
          status: fellows.find((x) => x.name === f)?.status,
        };
      })
      .sort((a, b) => a.ratio - b.ratio);
  }, [activities, scores, bonuses, fellows, fellow]);

  function exportCsv() {
    const headers = ["Fellow", "Teslim %", "Yapılan", "Eksik", "Puan %", "Eksik kalemler"];
    const lines = [headers.join(",")];
    for (const r of rows) {
      lines.push(
        [
          `"${r.name}"`,
          `${Math.round(r.ratio * 100)}%`,
          String(r.doneCount),
          String(r.missing.length),
          pctLabel(r.pct),
          `"${r.missing.map((m) => m.title).join("; ")}"`,
        ].join(","),
      );
    }
    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "lead21-fellow-rapor.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  const focus = fellow !== "hepsi" ? fellow : null;
  const timeline = useMemo(() => {
    if (!focus) return [];
    return activities
      .filter((a) => a.fellow === focus)
      .map((a) => ({
        ...a,
        title: PLAN_ITEMS.find((p) => p.id === a.planItemId)?.title ?? a.planItemId,
      }))
      .sort((a, b) => b.at.localeCompare(a.at));
  }, [activities, focus]);

  return (
    <div className="page">
      <PageTitle title="Rapor" />
      <Breadcrumbs items={[{ label: "Bu ay", to: "/" }, { label: "Rapor" }]} />
      <header className="page-head">
        <div>
          <p className="eyebrow">Fellow rapor</p>
          <h1>Kim ne yapmış?</h1>
          <p className="lede">
            Bugüne kadar ({asOf}) beklenen kalemlere göre teslim oranı, eksikler ve zaman çizelgesi.
          </p>
        </div>
        <div className="toolbar">
          <select className="select" value={fellow} onChange={(e) => setFellow(e.target.value)}>
            <option value="hepsi">Tüm fellow’lar</option>
            {FELLOWS_10.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
          <button type="button" className="btn" onClick={exportCsv}>
            CSV
          </button>
        </div>
      </header>

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>Fellow</th>
              <th>Teslim</th>
              <th>Eksik</th>
              <th>Puan</th>
              <th>Durum</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.name} className={r.missing.length > 2 || r.low ? "row-warn" : undefined}>
                <td>
                  <Link className="name-link" to={`/fellows/${encodeURIComponent(r.name)}`}>
                    {r.name}
                  </Link>
                </td>
                <td className="mono">
                  {r.doneCount}/{r.dueCount} ({Math.round(r.ratio * 100)}%)
                </td>
                <td>
                  {r.missing.length === 0 ? (
                    <span className="badge ok">0</span>
                  ) : (
                    <span className="badge danger">{r.missing.length}</span>
                  )}
                </td>
                <td>
                  <span className={`badge ${r.low ? "danger" : "ok"}`}>{pctLabel(r.pct)}</span>
                </td>
                <td>{r.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {focus && (
        <div className="grid-2 mt">
          <section className="panel">
            <div className="panel-head">
              <h2>{focus} — zaman çizelgesi</h2>
              <Link to={`/fellows/${encodeURIComponent(focus)}`}>Profil</Link>
            </div>
            {timeline.length === 0 ? (
              <p className="muted">Kayıt yok.</p>
            ) : (
              <ul className="list">
                {timeline.map((a) => (
                  <li key={a.id}>
                    <div>
                      <strong>{a.title}</strong>
                      <span className="muted block tiny">
                        {a.at}
                        {a.evidence ? ` · ${a.evidence}` : ""}
                        {a.note ? ` · ${a.note}` : ""}
                      </span>
                    </div>
                    <span className="badge ok">{a.status}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
          <section className="panel">
            <h2>Eksik kalemler</h2>
            <ul className="list compact">
              {fellowCompletion(activities, focus, asOf).missing.map((m) => (
                <li key={m.id}>
                  <div>
                    <strong>{m.title}</strong>
                    <span className="muted block tiny">{m.due}</span>
                  </div>
                  <Link
                    className="btn ghost sm"
                    to={`/mail?fellow=${encodeURIComponent(focus)}&plan=${m.id}`}
                  >
                    Mail
                  </Link>
                </li>
              ))}
            </ul>
            <h3 className="subh">Son kayıtlar (tüm kalemler)</h3>
            <ul className="list compact">
              {PLAN_ITEMS.filter((p) => p.due <= asOf).map((p) => {
                const a = latestActivity(activities, focus, p.id);
                return (
                  <li key={p.id}>
                    <span>{p.title}</span>
                    <span className={`badge ${a ? "ok" : "danger"}`}>
                      {a ? `${a.status} · ${a.at}` : "yok"}
                    </span>
                  </li>
                );
              })}
            </ul>
          </section>
        </div>
      )}
    </div>
  );
}
