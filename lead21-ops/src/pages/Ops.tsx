import { MONTHLY_FLOW, TOTAL_IDEAL } from "../data/seed";
import { barrierPct } from "../lib/scoring";
import { useAppState } from "../state";

export function OpsPage() {
  const { state, toggleTask } = useAppState();
  const open = state.tasks.filter((t) => t.status === "open");
  const below = Object.entries(state.scores).filter(([, row]) => {
    const total = Object.values(row).reduce((a, b) => a + b, 0);
    return barrierPct(total) < 80;
  });

  return (
    <div>
      <p className="sample-tag">Örnek veri · localStorage</p>
      <h1 className="page-title">Operasyon paneli</h1>
      <p className="page-lead">
        Erşen için günlük komuta merkezi: geciken işler, %80 baraj altı fellow’lar
        ve yıllık akış. Kaynak: anlatım + 10. dönem xlsx.
      </p>

      <div className="grid grid-3" style={{ marginBottom: "1.25rem" }}>
        <div className="card stat">
          <b>{open.length}</b>
          <span>Açık görev</span>
        </div>
        <div className="card stat">
          <b style={{ color: below.length ? "var(--danger)" : "var(--ok)" }}>
            {below.length}
          </b>
          <span>%80 altı fellow (örnek skor)</span>
        </div>
        <div className="card stat">
          <b>{TOTAL_IDEAL}</b>
          <span>İdeal toplam puan (ana kart)</span>
        </div>
      </div>

      <div className="grid grid-2">
        <section className="card">
          <div className="row" style={{ justifyContent: "space-between" }}>
            <h2 style={{ margin: 0, fontFamily: "var(--display)" }}>Checklist</h2>
            <span className="badge">{open.length} açık</span>
          </div>
          <div>
            {state.tasks.map((t) => (
              <label
                key={t.id}
                className={`task ${t.status === "done" ? "done" : ""}`}
              >
                <input
                  type="checkbox"
                  checked={t.status === "done"}
                  onChange={() => toggleTask(t.id)}
                />
                <div>
                  <div className="task-title">{t.title}</div>
                  <div className="muted tiny">
                    {t.due} · {t.kind}
                    {t.note ? ` · ${t.note}` : ""}
                  </div>
                </div>
              </label>
            ))}
          </div>
        </section>

        <section className="card">
          <h2 style={{ marginTop: 0, fontFamily: "var(--display)" }}>
            %80 uyarı listesi
          </h2>
          <p className="muted tiny">
            Varsayım: skor / {TOTAL_IDEAL} ≥ 0.80. Seed skorlar deterministik örnek.
          </p>
          {below.length === 0 ? (
            <p className="muted">Kimse baraj altında değil.</p>
          ) : (
            <ul>
              {below.map(([name, row]) => {
                const total = Object.values(row).reduce((a, b) => a + b, 0);
                return (
                  <li key={name}>
                    {name}{" "}
                    <span className="badge danger">
                      {barrierPct(total).toFixed(1)}%
                    </span>
                  </li>
                );
              })}
            </ul>
          )}

          <div className="assumption">
            Çift dönem şeridi (mevcut program + sonraki seçme) sonraki dilimde;
            şimdilik tek panel checklist + uyarı.
          </div>
        </section>
      </div>

      <h2
        style={{
          fontFamily: "var(--display)",
          marginTop: "1.75rem",
          marginBottom: "0.75rem",
        }}
      >
        Yıllık akış
      </h2>
      <div className="grid grid-3">
        {MONTHLY_FLOW.map((m) => (
          <div key={m.month} className="card month">
            <h4>{m.month}</h4>
            <ul>
              {m.items.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
