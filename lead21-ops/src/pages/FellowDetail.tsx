import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  PLAN_ITEMS,
  SCORE_CATEGORIES,
  TOTAL_IDEAL,
  moduleStages,
  type ActivityStatus,
  type StageStatus,
} from "../data/seed";
import { fellowIssues, healthLabel, moduleSnapshot } from "../lib/modules";
import { fellowCompletion } from "../lib/plan";
import {
  barrierRatio,
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
    stages,
    setStageStatus,
  } = useStore();
  const meta = fellows.find((f) => f.name === fellowName);
  const row = scores[fellowName] ?? {};
  const tot = fellowTotal(row, bonuses, fellowName);
  const low = underBarrier(tot);
  const fellowBonuses = bonuses.filter((b) => b.fellow === fellowName);
  const comp = fellowCompletion(activities, fellowName);
  const issues = fellowIssues(fellowName, stages);
  const modules = useMemo(
    () =>
      SCORE_CATEGORIES.map((c) =>
        moduleSnapshot(fellowName, c.code, stages, row, activities),
      ),
    [fellowName, stages, row, activities],
  );
  const [openMod, setOpenMod] = useState<string | null>(
    modules.find((m) => m.health === "sorun")?.cat.code ?? modules[0]?.cat.code ?? null,
  );

  const [planItemId, setPlanItemId] = useState(PLAN_ITEMS[0]?.id ?? "");
  const [at, setAt] = useState(new Date().toISOString().slice(0, 10));
  const [status, setStatus] = useState<ActivityStatus>("teslim");
  const [evidence, setEvidence] = useState("");
  const [note, setNote] = useState("");
  const [issueText, setIssueText] = useState("");

  if (!meta) {
    return (
      <div className="page">
        <p>Fellow bulunamadı.</p>
        <Link to="/fellows">← Liste</Link>
      </div>
    );
  }

  const open = modules.find((m) => m.cat.code === openMod);

  return (
    <div className="page">
      <header className="page-head">
        <div>
          <Link className="back" to="/fellows">
            ← Fellow’lar
          </Link>
          <h1>{fellowName}</h1>
          <p className="lede">
            Puan <strong>{tot}</strong> / {TOTAL_IDEAL} (
            <span className={low ? "danger" : "ok"}>{pctLabel(barrierRatio(tot))}</span>
            {low ? " baraj altı" : ""}) · teslim {comp.doneCount}/{comp.dueCount} ·{" "}
            <span className={issues.length ? "danger" : "ok"}>{issues.length} sorun</span>
          </p>
        </div>
        <div className="toolbar">
          <Link className="btn ghost" to={`/rapor`}>
            Rapor →
          </Link>
          <Link className="btn ghost" to={`/mail?fellow=${encodeURIComponent(fellowName)}`}>
            Mail →
          </Link>
        </div>
      </header>

      {issues.length > 0 && (
        <section className="panel mb alert-panel">
          <h2>Sorunlar / riskler</h2>
          <ul className="list">
            {issues.map((i) => {
              const mod = SCORE_CATEGORIES.find((c) => c.code === i.moduleCode);
              const st = moduleStages(i.moduleCode).find((s) => s.code === i.stageCode);
              return (
                <li key={i.id}>
                  <div>
                    <strong>
                      {mod?.label} → {st?.label}
                    </strong>
                    <span className="muted block tiny">
                      {i.issue || i.note || "Sorun"}
                      {i.at ? ` · ${i.at}` : ""}
                    </span>
                  </div>
                  <button
                    type="button"
                    className="btn ghost sm"
                    onClick={() => setOpenMod(i.moduleCode)}
                  >
                    Modüle git
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      <section className="panel mb">
        <h2>Modül özeti — her modülde nerede?</h2>
        <div className="module-grid">
          {modules.map((m) => (
            <button
              key={m.cat.code}
              type="button"
              className={`module-chip health-${m.health} ${openMod === m.cat.code ? "active" : ""}`}
              onClick={() => setOpenMod(m.cat.code)}
            >
              <span className="module-chip-title">{m.cat.label}</span>
              <span className="module-chip-meta">
                {m.done}/{m.total} · {healthLabel(m.health)}
              </span>
              <span className="module-chip-stage muted tiny">Aşama: {m.currentLabel}</span>
              <div className="bar-track thin">
                <div
                  className={`bar-fill ${m.health === "sorun" ? "is-low" : ""}`}
                  style={{ width: `${Math.min(100, (m.done / Math.max(1, m.total)) * 100)}%` }}
                />
              </div>
            </button>
          ))}
        </div>
      </section>

      {open && (
        <section className="panel mb module-dossier">
          <div className="panel-head">
            <div>
              <p className="eyebrow">{open.cat.code}</p>
              <h2>
                {open.cat.label}{" "}
                <span className={`badge ${open.health === "sorun" ? "danger" : open.health === "tamam" ? "ok" : "warn"}`}>
                  {healthLabel(open.health)}
                </span>
              </h2>
              <p className="muted">
                Puan {open.score}/{open.ideal} · aşama {open.done}/{open.total} · şu an:{" "}
                <strong>{open.currentLabel}</strong>
              </p>
            </div>
            <label className="score-edit">
              <span className="muted tiny">Modül puanı</span>
              <input
                type="number"
                className="input num"
                min={0}
                value={open.score}
                onChange={(e) => setScore(fellowName, open.cat.code, Number(e.target.value))}
              />
            </label>
          </div>

          <div className="table-wrap">
            <table className="table dense">
              <thead>
                <tr>
                  <th>Aşama</th>
                  <th>Durum</th>
                  <th>Tarih</th>
                  <th>Not / sorun</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {open.rows.map((r) => (
                  <tr key={r.code} className={r.status === "sorun" ? "row-warn" : undefined}>
                    <td>
                      <strong>{r.label}</strong>
                      {r.ideal != null && <span className="muted tiny"> · {r.ideal}p</span>}
                    </td>
                    <td>
                      <select
                        className="select sm"
                        value={r.status}
                        onChange={(e) =>
                          setStageStatus(
                            fellowName,
                            open.cat.code,
                            r.code,
                            e.target.value as StageStatus,
                            {
                              note: r.note,
                              issue:
                                e.target.value === "sorun"
                                  ? issueText || r.issue || "Sorun"
                                  : r.issue,
                            },
                          )
                        }
                      >
                        <option value="yapildi">yapıldı</option>
                        <option value="devam">devam</option>
                        <option value="bekliyor">bekliyor</option>
                        <option value="sorun">sorun</option>
                      </select>
                    </td>
                    <td className="mono tiny">{r.at ?? "—"}</td>
                    <td className="tiny">
                      {r.issue ? <span className="danger">{r.issue}</span> : r.note || "—"}
                    </td>
                    <td>
                      {r.status !== "yapildi" && (
                        <button
                          type="button"
                          className="btn ghost sm"
                          onClick={() =>
                            setStageStatus(fellowName, open.cat.code, r.code, "yapildi", {
                              note: "Tamamlandı",
                            })
                          }
                        >
                          Yapıldı
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="form-row mt">
            <input
              className="input grow"
              placeholder="Sorun notu (aşamayı ‘sorun’ yapınca kullanılır)"
              value={issueText}
              onChange={(e) => setIssueText(e.target.value)}
            />
          </div>

          {open.planLinks.length > 0 && (
            <>
              <h3 className="subh">Plan kalemleri / teslimler</h3>
              <ul className="list compact">
                {open.planLinks.map((p) => (
                  <li key={p.id}>
                    <div>
                      <strong>{p.title}</strong>
                      <span className="muted block tiny">
                        deadline {p.due}
                        {p.activity
                          ? ` · ${p.activity.status} ${p.activity.at}${p.activity.evidence ? ` · ${p.activity.evidence}` : ""}`
                          : " · teslim yok"}
                      </span>
                    </div>
                    <span className={`badge ${p.activity ? "ok" : "danger"}`}>
                      {p.activity?.status ?? "eksik"}
                    </span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>
      )}

      <section className="panel mb">
        <h2>Teslim girdisi</h2>
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
            const plan = PLAN_ITEMS.find((p) => p.id === planItemId);
            if (plan?.pointsCode && status === "teslim") {
              const stagesOf = moduleStages(plan.pointsCode);
              const last = stagesOf[stagesOf.length - 1];
              if (last) {
                setStageStatus(fellowName, plan.pointsCode, last.code, "yapildi", {
                  note: note || "Teslim kaydı",
                  at,
                });
              }
            }
            setEvidence("");
            setNote("");
          }}
        >
          <select className="select grow" value={planItemId} onChange={(e) => setPlanItemId(e.target.value)}>
            {PLAN_ITEMS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.due} — {p.title}
              </option>
            ))}
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
          <h2>İletişim notu</h2>
          <textarea
            className="textarea"
            rows={4}
            placeholder="Mail / WA özeti…"
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
        </section>
        <section className="panel">
          <h2>Eksik plan kalemleri</h2>
          {comp.missing.length === 0 ? (
            <p className="muted">Bugüne kadar eksik yok.</p>
          ) : (
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
          )}
        </section>
      </div>
    </div>
  );
}
