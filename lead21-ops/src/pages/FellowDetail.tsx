import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { PLAN_ITEMS, SCORE_CATEGORIES, TOTAL_IDEAL, type ActivityStatus } from "../data/seed";
import { fellowCompletion, latestActivity } from "../lib/plan";
import {
  barrierRatio,
  bonusTotal,
  categoryTotal,
  fellowTotal,
  pctLabel,
  underBarrier,
} from "../lib/scoring";
import { useStore } from "../state";

export function FellowDetail() {
  const { name = "" } = useParams();
  const fellowName = decodeURIComponent(name);
  const {
    scores,
    bonuses,
    setScore,
    fellows,
    updateFellow,
    removeBonus,
    activities,
    upsertActivity,
  } = useStore();
  const meta = fellows.find((f) => f.name === fellowName);
  const row = scores[fellowName] ?? {};
  const cat = categoryTotal(row);
  const bon = bonusTotal(bonuses, fellowName);
  const tot = fellowTotal(row, bonuses, fellowName);
  const low = underBarrier(tot);
  const fellowBonuses = bonuses.filter((b) => b.fellow === fellowName);
  const comp = fellowCompletion(activities, fellowName);
  const timeline = useMemo(
    () =>
      activities
        .filter((a) => a.fellow === fellowName)
        .map((a) => ({
          ...a,
          title: PLAN_ITEMS.find((p) => p.id === a.planItemId)?.title ?? a.planItemId,
        }))
        .sort((a, b) => b.at.localeCompare(a.at)),
    [activities, fellowName],
  );

  const [planItemId, setPlanItemId] = useState(PLAN_ITEMS[0]?.id ?? "");
  const [at, setAt] = useState(new Date().toISOString().slice(0, 10));
  const [status, setStatus] = useState<ActivityStatus>("teslim");
  const [evidence, setEvidence] = useState("");
  const [note, setNote] = useState("");

  if (!meta) {
    return (
      <div className="page">
        <p>Fellow bulunamadı.</p>
        <Link to="/fellows">← Liste</Link>
      </div>
    );
  }

  return (
    <div className="page">
      <header className="page-head">
        <div>
          <Link className="back" to="/fellows">
            ← Fellow’lar
          </Link>
          <h1>{fellowName}</h1>
          <p className="lede">
            {cat} kategori + {bon} bonus = <strong>{tot}</strong> / {TOTAL_IDEAL} ·{" "}
            <span className={low ? "danger" : "ok"}>{pctLabel(barrierRatio(tot))}</span>
            {low ? " · baraj altı" : ""} · teslim {comp.doneCount}/{comp.dueCount}
          </p>
        </div>
        <Link className="btn ghost" to={`/rapor`}>
          Raporda aç →
        </Link>
      </header>

      <section className="panel mb">
        <h2>Durum girdisi — ne yaptı / ne zaman</h2>
        <form
          className="form-row"
          onSubmit={(e) => {
            e.preventDefault();
            upsertActivity({
              fellow: fellowName,
              planItemId,
              at,
              status,
              evidence: evidence.trim() || undefined,
              note: note.trim() || undefined,
            });
            setEvidence("");
            setNote("");
          }}
        >
          <select className="select grow" value={planItemId} onChange={(e) => setPlanItemId(e.target.value)}>
            {PLAN_ITEMS.map((p) => {
              const a = latestActivity(activities, fellowName, p.id);
              return (
                <option key={p.id} value={p.id}>
                  {p.due} — {p.title}
                  {a ? ` [${a.status}]` : " [eksik]"}
                </option>
              );
            })}
          </select>
          <input className="input" type="date" value={at} onChange={(e) => setAt(e.target.value)} />
          <select
            className="select"
            value={status}
            onChange={(e) => setStatus(e.target.value as ActivityStatus)}
          >
            <option value="teslim">teslim</option>
            <option value="kismi">kısmi</option>
            <option value="yok">yok</option>
          </select>
          <input
            className="input grow"
            placeholder="Kanıt linki"
            value={evidence}
            onChange={(e) => setEvidence(e.target.value)}
          />
          <input
            className="input grow"
            placeholder="Not"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
          <button className="btn" type="submit">
            Kaydet
          </button>
        </form>
      </section>

      <div className="grid-2">
        <section className="panel">
          <h2>Zaman çizelgesi</h2>
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
          {comp.missing.length > 0 && (
            <>
              <h3 className="subh">Eksikler</h3>
              <ul className="list compact">
                {comp.missing.map((m) => (
                  <li key={m.id}>
                    <span>
                      {m.title}
                      <i className="muted"> · {m.due}</i>
                    </span>
                    <Link
                      className="btn ghost sm"
                      to={`/mail?fellow=${encodeURIComponent(fellowName)}&plan=${m.id}`}
                    >
                      Mail
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>

        <section className="panel">
          <h2>Notlar & bonus</h2>
          <textarea
            className="textarea"
            rows={3}
            placeholder="İletişim özeti…"
            value={meta.notes}
            onChange={(e) => updateFellow(fellowName, { notes: e.target.value })}
          />
          <h3 className="subh">Bonus</h3>
          {fellowBonuses.length === 0 ? (
            <p className="muted">Bonus yok.</p>
          ) : (
            <ul className="list">
              {fellowBonuses.map((b) => (
                <li key={b.id}>
                  <div>
                    <strong>+{b.points}</strong> · {b.reason}
                    <span className="muted block">{b.at}</span>
                  </div>
                  <button type="button" className="btn ghost" onClick={() => removeBonus(b.id)}>
                    Sil
                  </button>
                </li>
              ))}
            </ul>
          )}
          <h3 className="subh">Puan kalemleri</h3>
          <div className="score-edit-list">
            {SCORE_CATEGORIES.map((c) => (
              <label key={c.code} className="score-edit">
                <span>
                  {c.label}
                  <i className="muted"> / {c.ideal}</i>
                </span>
                <input
                  type="number"
                  min={0}
                  max={c.ideal * 2}
                  className="input num"
                  value={row[c.code] ?? 0}
                  onChange={(e) => setScore(fellowName, c.code, Number(e.target.value))}
                />
              </label>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
