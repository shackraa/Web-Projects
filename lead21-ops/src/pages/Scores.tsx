import { FELLOWS_10, SCORE_IDEALS, TOTAL_IDEAL } from "../data/seed";
import { barrierPct } from "../lib/scoring";
import { useAppState } from "../state";

export function ScoresPage() {
  const { state, setScore, downloadCsv } = useAppState();

  return (
    <div>
      <p className="sample-tag">xlsx Puanlandırma · örnek seed</p>
      <h1 className="page-title">Puan tahtası</h1>
      <p className="page-lead">
        Ana skor kartı idealleri. Hücreler düzenlenebilir; CSV dışa aktarımı Excel’in
        yerini alır. Alt sheet tutarsızlıkları docs’ta işaretli.
      </p>

      <div className="row" style={{ marginBottom: "1rem" }}>
        <button className="btn primary" type="button" onClick={downloadCsv}>
          CSV indir
        </button>
        <span className="badge">İdeal toplam {TOTAL_IDEAL}</span>
        <span className="badge warn">Baraj %80</span>
      </div>

      <div className="table-wrap card" style={{ padding: 0 }}>
        <table>
          <thead>
            <tr>
              <th>Fellow</th>
              {SCORE_IDEALS.map((c) => (
                <th key={c.code} title={`İdeal ${c.ideal}`}>
                  {c.label}
                </th>
              ))}
              <th>Toplam</th>
              <th>%</th>
            </tr>
          </thead>
          <tbody>
            {FELLOWS_10.map((name) => {
              const row = state.scores[name] ?? {};
              const total = SCORE_IDEALS.reduce(
                (a, c) => a + (row[c.code] ?? 0),
                0,
              );
              const pct = barrierPct(total);
              const cls =
                pct >= 80 ? "ok" : pct >= 70 ? "warn" : "danger";
              return (
                <tr key={name}>
                  <td>{name}</td>
                  {SCORE_IDEALS.map((c) => (
                    <td key={c.code}>
                      <input
                        className="score-input"
                        type="number"
                        min={0}
                        max={c.ideal}
                        value={row[c.code] ?? 0}
                        onChange={(e) =>
                          setScore(name, c.code, Number(e.target.value))
                        }
                      />
                    </td>
                  ))}
                  <td>
                    <b>{total}</b>
                  </td>
                  <td>
                    <span className={`badge ${cls}`}>{pct.toFixed(1)}%</span>
                  </td>
                </tr>
              );
            })}
            <tr>
              <td>
                <b>İDEAL</b>
              </td>
              {SCORE_IDEALS.map((c) => (
                <td key={c.code}>{c.ideal}</td>
              ))}
              <td>
                <b>{TOTAL_IDEAL}</b>
              </td>
              <td>100%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
