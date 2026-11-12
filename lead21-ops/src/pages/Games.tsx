import { MARS_ITEMS, MUSEUM_CASES, SHIP_ROLES } from "../data/seed";

export function GamesPage() {
  return (
    <div>
      <p className="sample-tag">Afiş + pptx + oda PDF</p>
      <h1 className="page-title">Final oyun rehberleri</h1>
      <p className="page-lead">
        7–8 Kasım final etabı modülleri. Canlı çok oyunculu motor sonraki dilim;
        burada Erşen/moderatör referansı.
      </p>

      <div className="grid grid-2">
        <section className="card">
          <h2 style={{ fontFamily: "var(--display)", marginTop: 0 }}>
            Batmakta Olan Gemi
          </h2>
          <p className="muted tiny">07 Kasım · 1. oyun · 10 rol</p>
          <ol>
            {SHIP_ROLES.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ol>
          <div className="assumption">
            Belirsiz: tam kural metni (kaç kişi kurtulur vb.) kaynakta yok — Erşen’e
            sor. Varsayım: ahlaki ikilem / rol tartışması.
          </div>
        </section>

        <section className="card">
          <h2 style={{ fontFamily: "var(--display)", marginTop: 0 }}>
            Mars Survival
          </h2>
          <p className="muted tiny">
            07 Kasım · 2. oyun · 7 kişi · üs 2 km · O₂ ~100 dk · yürüyüş 70–110 dk
          </p>
          <ul className="tiny">
            {MARS_ITEMS.map((i) => (
              <li key={i.id}>
                <b>{i.id}</b> — {i.name}: {i.desc}
              </li>
            ))}
          </ul>
        </section>

        <section className="card">
          <h2 style={{ fontFamily: "var(--display)", marginTop: 0 }}>
            2035: Görünmez İhtiyaç
          </h2>
          <p className="muted tiny">08 Kasım · 1. oyun · 56 dk · 6 tur</p>
          <ol className="tiny">
            <li>Bireysel üretim (7 dk)</li>
            <li>Fikir geliştirme — kart el değiştirir (7)</li>
            <li>Senaryo + zayıflık (7)</li>
            <li>Bireysel seçim — 2 fikir, chat (5)</li>
            <li>Tercih açıklama ≤90 sn (15)</li>
            <li>Ortak karar + sözcü 1 dk (15)</li>
          </ol>
        </section>

        <section className="card">
          <h2 style={{ fontFamily: "var(--display)", marginTop: 0 }}>
            Başarısızlıklar Müzesi
          </h2>
          <p className="muted tiny">
            08 Kasım · 3. oyun · 7 küratör · 3 salon · sunum 4,5 dk
          </p>
          <p className="tiny">Vakalar:</p>
          <div className="row">
            {MUSEUM_CASES.map((c) => (
              <span key={c} className="badge">
                {c}
              </span>
            ))}
          </div>
          <p className="tiny muted" style={{ marginTop: "0.75rem" }}>
            Salonlar: Büyük Hayal → Kırılma Anı → Geriye Kalan. Akış: 7 / 18 / 20
            dk + sunum.
          </p>
          <div className="assumption">
            Belirsiz: 08 Kasım 2. oyun (08-2 sheet yok).
          </div>
        </section>
      </div>
    </div>
  );
}
