import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { PageTitle } from "../components/PageTitle";
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

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toLocaleUpperCase("tr");
}

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
    mentors,
    setMentorStatus,
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

  // Start on overview: no module open until Erşen picks one
  const [openMod, setOpenMod] = useState<string | null>(null);
  const [showOps, setShowOps] = useState(true);

  const [planItemId, setPlanItemId] = useState(PLAN_ITEMS[0]?.id ?? "");
  const [at, setAt] = useState(new Date().toISOString().slice(0, 10));
  const [status, setStatus] = useState<ActivityStatus>("teslim");
  const [evidence, setEvidence] = useState("");
  const [note, setNote] = useState("");
  const [issueText, setIssueText] = useState("");

  if (!meta) {
    return (
      <div className="page">
        <PageTitle title="Fellow yok" />
        <Breadcrumbs
          items={[
            { label: "Bu ay", to: "/" },
            { label: "Fellow’lar", to: "/fellows" },
            { label: "Bulunamadı" },
          ]}
        />
        <p className="lede">Bu isimde fellow yok.</p>
        <Link className="btn" to="/fellows">
          Listeye dön
        </Link>
      </div>
    );
  }

  const open = modules.find((m) => m.cat.code === openMod);
  const sorunN = modules.filter((m) => m.health === "sorun").length;
  const yoldaN = modules.filter((m) => m.health === "yolda").length;
  const tamamN = modules.filter((m) => m.health === "tamam").length;
  const dose = meta.warnCount ?? 0;
  const fellowMentors = mentors.filter((m) => m.fellow === fellowName);

  return (
    <div className="page fellow-dossier">
      <PageTitle title={fellowName} />
      <Breadcrumbs
        items={[
          { label: "Bu ay", to: "/" },
          { label: "Fellow’lar", to: "/fellows" },
          { label: fellowName },
        ]}
      />

      <header className="fellow-hero">
        <div className="fellow-hero-main">
          <Link className="back" to="/fellows">
            ← Fellow listesi
          </Link>
          <div className="fellow-hero-row">
            <span className={`fellow-avatar lg ${low ? "danger" : issues.length ? "warn" : "ok"}`}>
              {initials(fellowName)}
            </span>
            <div>
              <p className="eyebrow">Fellow dosyası</p>
              <h1>{fellowName}</h1>
              <p className="lede tight">
                Önce modül özeti — birine tıklayınca aşama detayı açılır.
              </p>
            </div>
          </div>
        </div>
        <div className="toolbar">
          <Link className="btn ghost" to={`/rapor?fellow=${encodeURIComponent(fellowName)}`}>
            Rapor
          </Link>
          <Link className="btn" to={`/mail?fellow=${encodeURIComponent(fellowName)}`}>
            Mail yaz
          </Link>
        </div>
      </header>

      <div className="stat-pills fellow-stats">
        <div className="stat">
          <span className="stat-label">Puan</span>
          <strong className={low ? "danger" : "ok"}>
            {tot}
            <span className="stat-sub">/ {TOTAL_IDEAL}</span>
          </strong>
          <span className="muted tiny">{pctLabel(barrierRatio(tot))}{low ? " · baraj altı" : ""}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Teslim</span>
          <strong>
            {comp.doneCount}/{comp.dueCount}
          </strong>
        </div>
        <div className="stat">
          <span className="stat-label">Modül</span>
          <strong>
            <span className="ok">{tamamN}</span>
            <span className="muted"> / </span>
            <span className="warn">{yoldaN}</span>
            <span className="muted"> / </span>
            <span className="danger">{sorunN}</span>
          </strong>
          <span className="muted tiny">tamam · yolda · sorun</span>
        </div>
        <div className="stat">
          <span className="stat-label">Uyarı maili</span>
          <strong className={dose ? "warn" : undefined}>{dose}</strong>
          <span className="muted tiny">kaç kez gönderildi</span>
        </div>
      </div>

      {issues.length > 0 && (
        <section className="panel mb alert-panel">
          <div className="panel-head">
            <h2>Dikkat · {issues.length} sorun</h2>
          </div>
          <ul className="issue-strip">
            {issues.slice(0, 4).map((i) => {
              const mod = SCORE_CATEGORIES.find((c) => c.code === i.moduleCode);
              return (
                <li key={i.id}>
                  <button type="button" className="linkish" onClick={() => setOpenMod(i.moduleCode)}>
                    {mod?.label}
                  </button>
                  <span className="muted tiny">{i.issue || i.note || "Sorun"}</span>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      <section className="panel mb">
        <div className="panel-head">
          <div>
            <p className="eyebrow">1 · Özet</p>
            <h2>Modül durumu</h2>
          </div>
          {openMod && (
            <button type="button" className="btn ghost sm" onClick={() => setOpenMod(null)}>
              Özeti göster
            </button>
          )}
        </div>
        <div className="module-grid">
          {modules.map((m) => (
            <button
              key={m.cat.code}
              type="button"
              className={`module-chip health-${m.health} ${openMod === m.cat.code ? "active" : ""}`}
              onClick={() => setOpenMod(m.cat.code === openMod ? null : m.cat.code)}
            >
              <span className="module-chip-title">{m.cat.label}</span>
              <span className={`badge ${m.health === "sorun" ? "danger" : m.health === "tamam" ? "ok" : "warn"}`}>
                {healthLabel(m.health)}
              </span>
              <span className="module-chip-meta">
                {m.done}/{m.total} aşama · {m.score}/{m.ideal}p
              </span>
              <span className="module-chip-stage muted tiny">Şu an: {m.currentLabel}</span>
              <div className="bar-track thin">
                <div
                  className={`bar-fill ${m.health === "sorun" ? "is-low" : ""}`}
                  style={{ width: `${Math.min(100, (m.done / Math.max(1, m.total)) * 100)}%` }}
                />
              </div>
            </button>
          ))}
        </div>
        {!openMod && (
          <p className="muted tiny mt">Bir modüle tıkla — aşama tablosu ve puan düzenleme açılır.</p>
        )}
      </section>

      {open && (
        <section className="panel mb module-dossier" id="modul-detay">
          <div className="panel-head">
            <div>
              <p className="eyebrow">2 · Modül detayı</p>
              <h2>
                {open.cat.label}{" "}
                <span
                  className={`badge ${open.health === "sorun" ? "danger" : open.health === "tamam" ? "ok" : "warn"}`}
                >
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
        <div className="panel-head">
          <div>
            <p className="eyebrow">3 · Operasyon</p>
            <h2>Teslim, mentör, not</h2>
          </div>
          <button type="button" className="btn ghost sm" onClick={() => setShowOps((v) => !v)}>
            {showOps ? "Gizle" : "Aç"}
          </button>
        </div>
        {!showOps && (
          <p className="muted tiny">
            Günlük bakış için yukarıdaki özet yeterli. Teslim girmek / not yazmak için Aç.
          </p>
        )}
        {showOps && (
          <>
            <h3 className="subh">Teslim girdisi</h3>
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
              <select
                className="select grow"
                value={planItemId}
                onChange={(e) => setPlanItemId(e.target.value)}
              >
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

            <h3 className="subh">Mentör eşleşmeleri</h3>
            {fellowMentors.length === 0 ? (
              <p className="muted">Mentör kaydı yok.</p>
            ) : (
              <ul className="list compact">
                {fellowMentors.map((m) => (
                  <li key={m.id}>
                    <div>
                      <strong>
                        {m.kind} · {m.mentorName}
                      </strong>
                      <span className="muted block tiny">
                        hedef {m.targetAt}
                        {m.note ? ` · ${m.note}` : ""} · {m.pipeline}
                      </span>
                    </div>
                    <select
                      className="select sm"
                      value={m.status}
                      onChange={(e) =>
                        setMentorStatus(m.id, e.target.value as import("../data/seed").MentorStatus)
                      }
                    >
                      <option value="bekliyor">bekliyor</option>
                      <option value="eslesti">eşleşti</option>
                      <option value="planlandi">planlandı</option>
                      <option value="yapildi">yapıldı</option>
                      <option value="sorun">sorun</option>
                    </select>
                  </li>
                ))}
              </ul>
            )}

            <div className="grid-2 mt">
              <div>
                <h3 className="subh">İletişim notu</h3>
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
              </div>
              <div>
                <h3 className="subh">Eksik plan kalemleri</h3>
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
                          className="btn sm"
                          to={`/mail?fellow=${encodeURIComponent(fellowName)}&plan=${m.id}`}
                        >
                          Mail
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
