import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { barrierRatio, fellowTotal, pctLabel, underBarrier } from "../lib/scoring";
import { useStore } from "../state";

export function Fellows() {
  const { fellows, scores, bonuses, updateFellow } = useStore();
  const [q, setQ] = useState("");
  const [onlyLow, setOnlyLow] = useState(false);

  const rows = useMemo(() => {
    return fellows
      .map((f) => {
        const total = fellowTotal(scores[f.name], bonuses, f.name);
        return { ...f, total, pct: barrierRatio(total), low: underBarrier(total) };
      })
      .filter((f) => {
        if (onlyLow && !f.low) return false;
        if (!q.trim()) return true;
        return f.name.toLowerCase().includes(q.toLowerCase());
      })
      .sort((a, b) => a.pct - b.pct);
  }, [fellows, scores, bonuses, q, onlyLow]);

  return (
    <div className="page">
      <header className="page-head">
        <div>
          <p className="eyebrow">CRM</p>
          <h1>21 fellow</h1>
          <p className="lede">10. dönem isimleri xlsx’ten seed. Durum, not ve %80 uyarı.</p>
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
      </div>

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>Fellow</th>
              <th>Durum</th>
              <th>Puan</th>
              <th>%</th>
              <th>Not</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((f) => (
              <tr key={f.name} className={f.low ? "row-warn" : undefined}>
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
