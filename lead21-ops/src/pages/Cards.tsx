import { useEffect, useState } from "react";
import { QUOTE_CARDS } from "../data/seed";
import { useAppState } from "../state";

export function CardsPage() {
  const { state, toggleCard, resetCards } = useAppState();
  const [active, setActive] = useState<number | null>(null);
  const [phase, setPhase] = useState<"idle" | "think" | "speak">("idle");
  const [left, setLeft] = useState(0);

  const card = QUOTE_CARDS.find((c) => c.n === active) ?? null;

  useEffect(() => {
    if (phase === "idle") return;
    if (left <= 0) {
      if (phase === "think") {
        setPhase("speak");
        setLeft(120);
      } else {
        setPhase("idle");
      }
      return;
    }
    const t = window.setTimeout(() => setLeft((x) => x - 1), 1000);
    return () => window.clearTimeout(t);
  }, [phase, left]);

  function openCard(n: number) {
    setActive(n);
    if (!state.usedCards.includes(n)) toggleCard(n);
    setPhase("think");
    setLeft(20);
  }

  return (
    <div>
      <p className="sample-tag">Bireysel-Etap.pptx · İlk Bakışta Yanlış</p>
      <h1 className="page-title">İlk Bakışta Yanlış</h1>
      <p className="page-lead">
        28 kart · 20 sn düşünme · 120 sn konuşma. PowerPoint yerine görevli fellow
        için etkileşimli destesi.
      </p>

      <div className="row" style={{ marginBottom: "1rem" }}>
        <button className="btn" type="button" onClick={resetCards}>
          Kullanılanları sıfırla
        </button>
        <span className="badge">
          Kullanılan {state.usedCards.length} / 28
        </span>
      </div>

      <div className="grid grid-2">
        <div>
          <div className="card-grid">
            {QUOTE_CARDS.map((c) => (
              <button
                key={c.n}
                type="button"
                className={`card-tile ${state.usedCards.includes(c.n) ? "used" : ""}`}
                onClick={() => openCard(c.n)}
              >
                {String(c.n).padStart(2, "0")}
              </button>
            ))}
          </div>
        </div>

        <div className="quote-stage">
          {!card ? (
            <p className="muted">Aday bir numara söylesin; kartı seç.</p>
          ) : (
            <>
              <div className="row">
                <span className="badge">Kart {String(card.n).padStart(2, "0")}</span>
                {phase !== "idle" && (
                  <span className="badge warn">
                    {phase === "think" ? "Düşünme" : "Konuşma"}
                  </span>
                )}
              </div>
              <blockquote>“{card.text}”</blockquote>
              <div className="muted tiny">{card.source}</div>
              <div className="timer">
                {phase === "idle"
                  ? "—"
                  : `${Math.floor(left / 60)}:${String(left % 60).padStart(2, "0")}`}
              </div>
              <div className="row">
                <button
                  className="btn primary"
                  type="button"
                  onClick={() => {
                    setPhase("think");
                    setLeft(20);
                  }}
                >
                  20 sn başlat
                </button>
                <button
                  className="btn"
                  type="button"
                  onClick={() => {
                    setPhase("speak");
                    setLeft(120);
                  }}
                >
                  120 sn konuşma
                </button>
                <button
                  className="btn ghost"
                  type="button"
                  onClick={() => {
                    setActive(null);
                    setPhase("idle");
                  }}
                >
                  Kartlara dön
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
