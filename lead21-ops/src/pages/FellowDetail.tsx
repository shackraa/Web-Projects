import { Link, useParams } from "react-router-dom";
import { SCORE_CATEGORIES, TOTAL_IDEAL } from "../data/seed";
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
  const { scores, bonuses, setScore, fellows, updateFellow, removeBonus } = useStore();
  const meta = fellows.find((f) => f.name === fellowName);
  const row = scores[fellowName] ?? {};
  const cat = categoryTotal(row);
  const bon = bonusTotal(bonuses, fellowName);
  const tot = fellowTotal(row, bonuses, fellowName);
  const low = underBarrier(tot);
  const fellowBonuses = bonuses.filter((b) => b.fellow === fellowName);

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
            {low ? " · baraj altı" : ""}
          </p>
        </div>
      </header>

      <div className="grid-2">
        <section className="panel">
          <h2>Puan kalemleri</h2>
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

        <section className="panel">
          <h2>Notlar & bonus</h2>
          <textarea
            className="textarea"
            rows={4}
            placeholder="İletişim özeti…"
            value={meta.notes}
            onChange={(e) => updateFellow(fellowName, { notes: e.target.value })}
          />
          <h3 className="subh">Bonus satırları</h3>
          {fellowBonuses.length === 0 ? (
            <p className="muted">Bonus yok. Puan sayfasından ekleyebilirsin.</p>
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
          <Link className="btn" to="/puan">
            Bonus ekle →
          </Link>
        </section>
      </div>
    </div>
  );
}
