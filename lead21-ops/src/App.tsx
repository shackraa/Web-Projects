import { NavLink, Route, Routes } from "react-router-dom";
import { StateProvider } from "./state";
import { OpsPage } from "./pages/Ops";
import { ScoresPage } from "./pages/Scores";
import { JuryPage } from "./pages/Jury";
import { GamesPage } from "./pages/Games";
import { CardsPage } from "./pages/Cards";

const links = [
  { to: "/", label: "Ops panel", end: true },
  { to: "/puan", label: "Puan tahtası" },
  { to: "/juri", label: "Jüri formu" },
  { to: "/oyunlar", label: "Oyun rehberleri" },
  { to: "/kartlar", label: "İlk Bakışta Yanlış" },
];

export default function App() {
  return (
    <StateProvider>
      <div className="app-shell">
        <aside className="side">
          <p className="brand">
            LEAD<span>21</span>
          </p>
          <p className="brand-sub">Erşen operasyon paneli · MVP</p>
          <nav className="nav">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                {l.label}
              </NavLink>
            ))}
          </nav>
          <p className="muted tiny" style={{ marginTop: "2rem" }}>
            Yeni Bir Lider · örnek veri. Kalıcı çok cihaz DB sonraki dilim.
          </p>
        </aside>
        <main className="main">
          <Routes>
            <Route path="/" element={<OpsPage />} />
            <Route path="/puan" element={<ScoresPage />} />
            <Route path="/juri" element={<JuryPage />} />
            <Route path="/oyunlar" element={<GamesPage />} />
            <Route path="/kartlar" element={<CardsPage />} />
          </Routes>
        </main>
      </div>
    </StateProvider>
  );
}
