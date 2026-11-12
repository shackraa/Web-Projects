import { useMemo, useState } from "react";
import { JURY_GAMES } from "../data/seed";
import { fmtScore, juryTotal } from "../lib/scoring";
import { useAppState } from "../state";

export function JuryPage() {
  const { state, setJury } = useAppState();
  const [gameId, setGameId] = useState(JURY_GAMES[0].id);
  const game = JURY_GAMES.find((g) => g.id === gameId)!;
  const entry = state.jury[gameId] ?? {
    juror: "",
    rows: Object.fromEntries(
      game.sampleCandidates.map((c) => [
        c,
        Object.fromEntries(game.criteria.map((cr) => [cr.key, null])),
      ]),
    ),
  };

  const totals = useMemo(() => {
    const map: Record<string, number | null> = {};
    for (const cand of game.sampleCandidates) {
      map[cand] = juryTotal(game, entry.rows[cand] ?? {});
    }
    return map;
  }, [game, entry]);

  function patch(
    candidate: string,
    key: string,
    value: number | null,
  ) {
    const rows = {
      ...entry.rows,
      [candidate]: { ...entry.rows[candidate], [key]: value },
    };
    setJury({ ...state.jury, [gameId]: { ...entry, rows } });
  }

  return (
    <div>
      <p className="sample-tag">Juri-Formu.xlsx · örnek adaylar</p>
      <h1 className="page-title">Jüri formu</h1>
      <p className="page-lead">
        1 zayıf → 5 çok güçlü. Formüller xlsx ile aynı: sum / ağırlıklı / yarı-yarı /
        ortalama. 08-2 oyunu kaynakta yok.
      </p>

      <div className="pill-tabs">
        {JURY_GAMES.map((g) => (
          <button
            key={g.id}
            type="button"
            className={g.id === gameId ? "active" : ""}
            onClick={() => setGameId(g.id)}
          >
            {g.date} · {g.title}
          </button>
        ))}
      </div>

      <div className="card" style={{ marginBottom: "1rem" }}>
        <label className="row">
          <span className="muted">Değerlendirici</span>
          <input
            className="score-input"
            style={{ width: "16rem", textAlign: "left" }}
            value={entry.juror}
            placeholder="Ad Soyad"
            onChange={(e) =>
              setJury({
                ...state.jury,
                [gameId]: { ...entry, juror: e.target.value },
              })
            }
          />
          <span className="badge">{game.formula}</span>
        </label>
      </div>

      <div className="table-wrap card" style={{ padding: 0 }}>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Aday</th>
              {game.criteria.map((c) => (
                <th key={c.key}>
                  {c.label}
                  {c.weight ? ` (${Math.round(c.weight * 100)}%)` : ""}
                </th>
              ))}
              <th>Toplam</th>
            </tr>
          </thead>
          <tbody>
            {game.sampleCandidates.map((cand, i) => (
              <tr key={cand}>
                <td>{i + 1}</td>
                <td>{cand}</td>
                {game.criteria.map((c) => (
                  <td key={c.key}>
                    <select
                      className="score-input"
                      style={{ width: "4rem" }}
                      value={entry.rows[cand]?.[c.key] ?? ""}
                      onChange={(e) =>
                        patch(
                          cand,
                          c.key,
                          e.target.value === ""
                            ? null
                            : Number(e.target.value),
                        )
                      }
                    >
                      <option value="">—</option>
                      {[1, 2, 3, 4, 5].map((n) => (
                        <option key={n} value={n}>
                          {n}
                        </option>
                      ))}
                    </select>
                  </td>
                ))}
                <td>
                  <b>{fmtScore(totals[cand])}</b>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
