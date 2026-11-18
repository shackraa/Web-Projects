import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FELLOWS_10, SCORE_CATEGORIES, TOTAL_IDEAL } from "../data/seed";
import {
  barrierRatio,
  bonusTotal,
  exportCsv,
  fellowTotal,
  pctLabel,
  teamAverage,
  underBarrier,
} from "../lib/scoring";
import { useStore } from "../state";

export function Scores() {
  const { scores, bonuses, setScore, addBonus, removeBonus } = useStore();
  const [fellow, setFellow] = useState<string>(FELLOWS_10[0]);
  const [points, setPoints] = useState("5");
  const [reason, setReason] = useState("");
  const [onlyLow, setOnlyLow] = useState(false);

  const avg = teamAverage(scores, bonuses, FELLOWS_10);

  const rows = useMemo(() => {
    return FELLOWS_10.map((f) => {
      const total = fellowTotal(scores[f], bonuses, f);
      return {
        name: f,
        total,
        bonus: bonusTotal(bonuses, f),
        pct: barrierRatio(total),
        low: underBarrier(total),
      };
    })
      .filter((r) => (onlyLow ? r.low : true))
      .sort((a, b) => b.total - a.total);
  }, [scores, bonuses, onlyLow]);

  function download() {
    const csv = exportCsv(FELLOWS_10, scores, bonuses);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "lead21-puan.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="page">
      <header className="page-head">
        <div>
          <p className="eyebrow">Puan motoru</p>
          <h1>Excel’in canlı kopyası</h1>
          <p className="lede">
            Ana kart idealleri (toplam {TOTAL_IDEAL}). Ekip ortalaması{" "}
            <strong>{Math.round(avg)}</strong> · %80 baraj paydası bonus hariç.
          </p>
        </div>
        <div className="toolbar">
          <label className="check">
            <input type="checkbox" checked={onlyLow} onChange={(e) => setOnlyLow(e.target.checked)} />
            %80 altı
          </label>
          <button type="button" className="btn" onClick={download}>
            CSV export
          </button>
        </div>
      </header>

      <section className="panel mb">
        <h2>Bonus ekle</h2>
        <form
          className="form-row"
          onSubmit={(e) => {
            e.preventDefault();
            const n = Number(points);
            if (!reason.trim() || !Number.isFinite(n) || n === 0) return;
            addBonus(fellow, n, reason.trim());
            setReason("");
          }}
        >
          <select className="select" value={fellow} onChange={(e) => setFellow(e.target.value)}>
            {FELLOWS_10.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
          <input
            className="input num"
            type="number"
            value={points}
            onChange={(e) => setPoints(e.target.value)}
          />
          <input
            className="input grow"
            placeholder="Neden? (ör. demo day ekstra)"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
          <button className="btn" type="submit">
            Kaydet
          </button>
        </form>
        {bonuses.length > 0 && (
          <ul className="list compact">
            {bonuses.map((b) => (
              <li key={b.id}>
                <span>
                  <strong>{b.fellow}</strong> +{b.points} — {b.reason}
                </span>
                <button type="button" className="btn ghost" onClick={() => removeBonus(b.id)}>
                  Sil
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="table-wrap scroll-x">
        <table className="table dense">
          <thead>
            <tr>
              <th>Fellow</th>
              <th>Toplam</th>
              <th>Bonus</th>
              <th>%</th>
              {SCORE_CATEGORIES.map((c) => (
                <th key={c.code} title={`İdeal ${c.ideal}`}>
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.name} className={r.low ? "row-warn" : undefined}>
                <td>
                  <Link className="name-link" to={`/fellows/${encodeURIComponent(r.name)}`}>
                    {r.name}
                  </Link>
                </td>
                <td className="mono">{r.total}</td>
                <td className="mono">{r.bonus || "—"}</td>
                <td>
                  <span className={`badge ${r.low ? "danger" : "ok"}`}>{pctLabel(r.pct)}</span>
                </td>
                {SCORE_CATEGORIES.map((c) => (
                  <td key={c.code}>
                    <input
                      className="input cell"
                      type="number"
                      min={0}
                      value={scores[r.name]?.[c.code] ?? 0}
                      onChange={(e) => setScore(r.name, c.code, Number(e.target.value))}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="muted tiny mt">
        Tutarsızlık notu: SLJ sheet 119 / ana 110; Kariyer 59 / 54; Finansal 62 / 48; LEAD Talks 42 /
        30. Panel varsayılanı ana kart.
      </p>
    </div>
  );
}
