import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { PageTitle } from "../components/PageTitle";
import { FELLOWS_10, PLAN_ITEMS } from "../data/seed";
import { fellowsDone, fellowsMissing, isDone, latestActivity, planByMonth } from "../lib/plan";
import { useStore } from "../state";

export function YearPlan() {
  const { activities } = useStore();
  const today = new Date().toISOString().slice(0, 10);
  const [openId, setOpenId] = useState<string | null>(PLAN_ITEMS.find((p) => p.due >= today)?.id ?? PLAN_ITEMS[0]?.id);
  const months = useMemo(() => planByMonth(), []);

  return (
    <div className="page">
      <PageTitle title="Yıllık plan" />
      <Breadcrumbs items={[{ label: "Bu ay", to: "/" }, { label: "Yıllık plan" }]} />
      <header className="page-head">
        <div>
          <p className="eyebrow">Yıllık plan</p>
          <h1>Ne zaman ne · kim yaptı</h1>
          <p className="lede">
            Program kalemleri tarih sırasıyla. Yeşil = teslim/katılım var; kırmızı = eksik. Satıra tıkla.
          </p>
        </div>
        <Link className="btn ghost" to="/rapor">
          Fellow rapor
        </Link>
      </header>

      <div className="year-layout">
        <div className="year-list">
          {months.map((m) => (
            <section key={m.month} className="month-block">
              <h2>{m.label}</h2>
              <ul className="plan-rows">
                {m.items.map((item) => {
                  const done = fellowsDone(activities, item.id);
                  const missing = fellowsMissing(activities, item.id);
                  const overdue = item.due < today && missing.length > 0;
                  const active = openId === item.id;
                  return (
                    <li key={item.id}>
                      <button
                        type="button"
                        className={`plan-row ${active ? "active" : ""} ${overdue ? "overdue" : ""}`}
                        onClick={() => setOpenId(item.id)}
                      >
                        <span className="plan-date mono">{item.due.slice(5)}</span>
                        <span className="plan-title">{item.title}</span>
                        <span className="plan-counts">
                          <span className="badge ok">{done.length} yaptı</span>
                          <span className={`badge ${missing.length ? "danger" : "ok"}`}>
                            {missing.length} eksik
                          </span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>

        <aside className="panel plan-detail sticky">
          {openId ? (
            <PlanDetail planItemId={openId} />
          ) : (
            <p className="muted">Bir kalem seç.</p>
          )}
        </aside>
      </div>

      <section className="panel mt">
        <h2>Matris (özet)</h2>
        <p className="muted tiny">Satır = kalem · sütun = fellow baş harfleri · ● yaptı · ○ yok</p>
        <div className="table-wrap scroll-x">
          <table className="table dense matrix">
            <thead>
              <tr>
                <th>Kalem</th>
                {FELLOWS_10.map((f) => (
                  <th key={f} title={f}>
                    {f
                      .split(" ")
                      .map((p) => p[0])
                      .join("")}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PLAN_ITEMS.map((item) => (
                <tr key={item.id}>
                  <td>
                    <button type="button" className="linkish" onClick={() => setOpenId(item.id)}>
                      {item.title}
                    </button>
                  </td>
                  {FELLOWS_10.map((f) => (
                    <td key={f} className="center">
                      {isDone(activities, f, item.id) ? (
                        <span className="ok" title={latestActivity(activities, f, item.id)?.at}>
                          ●
                        </span>
                      ) : (
                        <span className="danger">○</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function PlanDetail({ planItemId }: { planItemId: string }) {
  const { activities } = useStore();
  const item = PLAN_ITEMS.find((p) => p.id === planItemId);
  if (!item) return null;
  const done = fellowsDone(activities, planItemId);
  const missing = fellowsMissing(activities, planItemId);

  return (
    <>
      <p className="eyebrow">{item.kind}</p>
      <h2>{item.title}</h2>
      <p className="muted">Deadline: {item.due}</p>
      <h3 className="subh">Yapanlar ({done.length})</h3>
      {done.length === 0 ? <p className="muted">Henüz teslim yok.</p> : null}
      <ul className="list compact">
        {done.map((f) => {
          const a = latestActivity(activities, f, planItemId);
          return (
            <li key={f}>
              <div>
                <Link className="name-link" to={`/fellows/${encodeURIComponent(f)}`}>
                  {f}
                </Link>
                <span className="muted block tiny">
                  {a?.at}
                  {a?.evidence ? ` · ${a.evidence}` : ""}
                  {a?.note ? ` · ${a.note}` : ""}
                </span>
              </div>
              <span className="badge ok">{a?.status}</span>
            </li>
          );
        })}
      </ul>
      <h3 className="subh">Yapmayanlar ({missing.length})</h3>
      {missing.length === 0 ? (
        <p className="muted">Herkes tamam.</p>
      ) : (
        <ul className="list compact">
          {missing.map((f) => (
            <li key={f}>
              <Link className="name-link" to={`/fellows/${encodeURIComponent(f)}`}>
                {f}
              </Link>
              <Link className="btn sm" to={`/mail?fellow=${encodeURIComponent(f)}&plan=${item.id}`}>
                Mail
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
