import { NavLink, Route, Routes } from "react-router-dom";
import { PERIOD, TOTAL_IDEAL } from "./data/seed";
import { CalendarPage } from "./pages/Calendar";
import { Dashboard } from "./pages/Dashboard";
import { FellowDetail } from "./pages/FellowDetail";
import { Fellows } from "./pages/Fellows";
import { Scores } from "./pages/Scores";
import { Tasks } from "./pages/Tasks";
import { useStore } from "./state";

const NAV = [
  { to: "/", label: "Panel", end: true },
  { to: "/fellows", label: "Fellow’lar" },
  { to: "/gorevler", label: "Görevler" },
  { to: "/puan", label: "Puan" },
  { to: "/takvim", label: "Takvim" },
];

export default function App() {
  const { resetDemo } = useStore();

  return (
    <div className="app-shell">
      <aside className="side">
        <p className="brand">LEAD21</p>
        <p className="brand-sub">Ops · {PERIOD.name}</p>
        <p className="side-note">
          Yıl boyu fellow takip · puan · takvim
          <br />
          Ideal {TOTAL_IDEAL} · baraj %80
        </p>
        <nav className="nav">
          {NAV.map((n) => (
            <NavLink key={n.to} to={n.to} end={n.end} className={({ isActive }) => (isActive ? "active" : "")}>
              {n.label}
            </NavLink>
          ))}
        </nav>
        <button type="button" className="btn ghost reset" onClick={resetDemo}>
          Demo veriyi sıfırla
        </button>
        <p className="side-foot">Örnek veri · oyun/jüri yok</p>
      </aside>
      <main className="main">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/fellows" element={<Fellows />} />
          <Route path="/fellows/:name" element={<FellowDetail />} />
          <Route path="/gorevler" element={<Tasks />} />
          <Route path="/puan" element={<Scores />} />
          <Route path="/takvim" element={<CalendarPage />} />
        </Routes>
      </main>
    </div>
  );
}
