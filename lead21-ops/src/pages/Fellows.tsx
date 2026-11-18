import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { SCORE_CATEGORIES } from "../data/seed";
import { fellowIssues, moduleSnapshot } from "../lib/modules";
import { barrierRatio, fellowTotal, pctLabel, underBarrier } from "../lib/scoring";
import { useStore } from "../state";

export function Fellows() {
  const { fellows, scores, bonuses, updateFellow, stages, activities } = useStore();
  const [q, setQ] = useState("");
  const [onlyLow, setOnlyLow] = useState(false);
  const [onlyIssues, setOnlyIssues] = useState(false);

  const rows = useMemo(() => {
    return fellows
      .map((f) => {
        const total = fellowTotal(scores[f.name], bonuses, f.name);
        const issues = fellowIssues(f.name, stages);
        const mods = SCORE_CATEGORIES.map((c) =>
          moduleSnapshot(f.name, c.code, stages, scores[f.name], activities),
        );
        const sorunMods = mods.filter((m) => m.health === "sorun").length;
        const yolda = mods.filter((m) => m.health === "yolda").length;
        return {
          ...f,
          total,
          pct: barrierRatio(total),
          low: underBarrier(total),
          issueCount: issues.length,
          sorunMods,
          yolda,
          topIssues: issues.slice(0, 2),
        };
      })
      .filter((f) => {
        if (onlyLow && !f.low) return false;
        if (onlyIssues && f.issueCount === 0) return false;
        if (!q.trim()) return true;
        return f.name.toLowerCase().includes(q.toLowerCase());
      })
      .sort((a, b) => b.issueCount - a.issueCount || a.pct - b.pct);
  }, [fellows, scores, bonuses, stages, activities, q, onlyLow, onlyIssues]);

  return (
    <div className="page">
      <header className="page-head">
        <div>
          <p className="eyebrow">CRM</p>
          <h1>21 fellow</h1>
          <p className="lede">
            Modül aşaması, sorun ve %80 baraj — detay için isme tıkla.
          </p>
        </div>
      </header>

      <div className="toolbar">
        <input
          className="input"
          placeholder="İsim ara…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <label className="check">
          <input type="checkbox" checked={onlyLow} onChange={(e) => setOnlyLow(e.target.checked)} />
          Sadece %80 altı
        </label>
        <label className="check">
          <input
            type="checkbox"
            checked={onlyIssues}
            onChange={(e) => setOnlyIssues(e.target.checked)}
          />
          Sadece sorunlu
        </label>
      </div>

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>Fellow</th>
              <th>Durum</th>
              <th>Modüller</th>
              <th>Sorun</th>
              <th>Puan</th>
              <th>%</th>
              <th>Not</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((f) => (
              <tr
                key={f.name}
                className={f.low || f.issueCount ? "row-warn" : undefined}
              >
                <td>
                  <Link className="name-link" to={`/fellows/${encodeURIComponent(f.name)}`}>
                    {f.name}
                  </Link>
                  <span className="muted block tiny">{f.email}</span>
                </td>
                <td>
                  <select
                    className="select sm"
                    value={f.status}
                    onChange={(e) =>
                      updateFellow(f.name, {
                        status: e.target.value as "aktif" | "uyari" | "mezuniyet",
                      })
                    }
                  >
                    <option value="aktif">aktif</option>
                    <option value="uyari">uyarı</option>
                    <option value="mezuniyet">mezuniyet</option>
                  </select>
                </td>
                <td className="tiny">
                  {f.sorunMods > 0 && (
                    <span className="badge danger">{f.sorunMods} sorunlu</span>
                  )}{" "}
                  {f.yolda > 0 && <span className="badge warn">{f.yolda} yolda</span>}
                  {f.sorunMods === 0 && f.yolda === 0 && (
                    <span className="badge ok">temiz</span>
                  )}
                </td>
                <td>
                  {f.issueCount === 0 ? (
                    <span className="muted tiny">—</span>
                  ) : (
                    <div className="issue-pills">
                      {f.topIssues.map((i) => {
                        const mod = SCORE_CATEGORIES.find((c) => c.code === i.moduleCode);
                        return (
                          <Link
                            key={i.id}
                            className="issue-pill"
                            to={`/fellows/${encodeURIComponent(f.name)}`}
                            title={i.issue || i.note}
                          >
                            {mod?.label ?? i.moduleCode}
                          </Link>
                        );
                      })}
                      {f.issueCount > 2 && (
                        <span className="muted tiny">+{f.issueCount - 2}</span>
                      )}
                    </div>
                  )}
                </td>
                <td className="mono">{f.total}</td>
                <td>
                  <span className={`badge ${f.low ? "danger" : "ok"}`}>{pctLabel(f.pct)}</span>
                </td>
                <td>
                  <input
                    className="input sm"
                    value={f.notes}
                    placeholder="Mail / WA özeti…"
                    onChange={(e) => updateFellow(f.name, { notes: e.target.value })}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
