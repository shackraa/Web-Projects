import { NavLink, Route, Routes } from "react-router-dom";
import { PERIOD, TOTAL_IDEAL } from "./data/seed";
import { CalendarPage } from "./pages/Calendar";
import { Dashboard } from "./pages/Dashboard";
import { FaqPage } from "./pages/Faq";
import { FellowDetail } from "./pages/FellowDetail";
import { Fellows } from "./pages/Fellows";
import { MailPage } from "./pages/Mail";
import { MentorsPage } from "./pages/Mentors";
import { NotFound } from "./pages/NotFound";
import { PrivacyPage } from "./pages/Privacy";
import { Rapport } from "./pages/Rapport";
import { Scores } from "./pages/Scores";
import { Tasks } from "./pages/Tasks";
import { YearPlan } from "./pages/YearPlan";
import { useStore } from "./state";

const NAV_MAIN = [
  { to: "/", label: "Bu ay", end: true },
  { to: "/fellows", label: "Fellow’lar" },
  { to: "/mentorler", label: "Mentörler" },
  { to: "/puan", label: "Puan" },
  { to: "/mail", label: "Mail zinciri" },
];

const NAV_MORE = [
  { to: "/plan", label: "Yıllık plan" },
  { to: "/rapor", label: "Rapor" },
  { to: "/gorevler", label: "Görevler" },
  { to: "/takvim", label: "Takvim" },
  { to: "/sss", label: "SSS" },
  { to: "/gizlilik", label: "Gizlilik" },
];

export default function App() {
  const { resetDemo } = useStore();

  return (
    <div className="app-shell">
      <aside className="side">
        <p className="brand">LEAD21</p>
        <p className="brand-sub">Ops · {PERIOD.name}</p>
        <p className="side-note">
          Bu ay · müdahale · mentör
          <br />
          Ideal {TOTAL_IDEAL} · baraj %80
        </p>
        <nav className="nav">
          {NAV_MAIN.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.end}
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              {n.label}
            </NavLink>
          ))}
        </nav>
        <p className="nav-section">Daha fazla</p>
        <nav className="nav nav-more">
          {NAV_MORE.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              {n.label}
            </NavLink>
          ))}
        </nav>
        <button type="button" className="btn ghost reset" onClick={resetDemo}>
          Demo veriyi sıfırla
        </button>
        <p className="side-foot">Anthropic Sans · aşama → puan</p>
      </aside>
      <main className="main">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/plan" element={<YearPlan />} />
          <Route path="/rapor" element={<Rapport />} />
          <Route path="/fellows" element={<Fellows />} />
          <Route path="/fellows/:name" element={<FellowDetail />} />
          <Route path="/mentorler" element={<MentorsPage />} />
          <Route path="/gorevler" element={<Tasks />} />
          <Route path="/puan" element={<Scores />} />
          <Route path="/takvim" element={<CalendarPage />} />
          <Route path="/mail" element={<MailPage />} />
          <Route path="/sss" element={<FaqPage />} />
          <Route path="/gizlilik" element={<PrivacyPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <div className="sticky-cta" aria-label="Hızlı aksiyon">
        <NavLink className="btn" to="/mail">
          Mail yaz
        </NavLink>
        <NavLink className="btn ghost" to="/#mudahale">
          Müdahale
        </NavLink>
      </div>
    </div>
  );
}
