import { NavLink, Route, Routes, useLocation } from "react-router-dom";
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

const NAV = [
  { to: "/", label: "Bu ay", end: true },
  { to: "/fellows", label: "Fellow’lar" },
  { to: "/mentorler", label: "Mentörler" },
  { to: "/puan", label: "Puan" },
  { to: "/mail", label: "Mail zinciri" },
  { to: "/plan", label: "Yıllık plan" },
  { to: "/rapor", label: "Rapor" },
  { to: "/gorevler", label: "Görevler" },
  { to: "/takvim", label: "Takvim" },
];

function StickyCta() {
  const { pathname } = useLocation();
  if (pathname.startsWith("/mail")) {
    return (
      <div className="sticky-cta" aria-label="Hızlı aksiyon">
        <NavLink className="btn" to="/#mudahale">
          Müdahale
        </NavLink>
        <NavLink className="btn ghost" to="/">
          Bu ay
        </NavLink>
      </div>
    );
  }
  if (pathname.startsWith("/fellows/")) {
    return (
      <div className="sticky-cta" aria-label="Hızlı aksiyon">
        <NavLink className="btn" to={`/mail?fellow=${encodeURIComponent(decodeURIComponent(pathname.split("/").pop() || ""))}`}>
          Mail yaz
        </NavLink>
        <NavLink className="btn ghost" to="/fellows">
          Liste
        </NavLink>
      </div>
    );
  }
  return (
    <div className="sticky-cta" aria-label="Hızlı aksiyon">
      <NavLink className="btn" to="/#mudahale">
        Müdahale
      </NavLink>
      <NavLink className="btn ghost" to="/mail">
        Mail
      </NavLink>
    </div>
  );
}

export default function App() {
  const { resetDemo } = useStore();

  return (
    <div className="app-shell">
      <aside className="side">
        <NavLink to="/" className="brand-block" end>
          <img
            className="brand-mark"
            src={`${import.meta.env.BASE_URL}lead21-mark.svg`}
            alt="LEAD21"
            width={148}
            height={38}
          />
          <span className="brand-sub">Ops · {PERIOD.name}</span>
        </NavLink>
        <p className="side-note">
          Ideal {TOTAL_IDEAL} · baraj %80
        </p>
        <nav className="nav">
          {NAV.map((n) => (
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
        <button
          type="button"
          className="btn ghost reset"
          onClick={() => {
            if (window.confirm("Demo veriyi sıfırlamak istediğine emin misin?")) resetDemo();
          }}
        >
          Demo veriyi sıfırla
        </button>
        <p className="side-foot">
          <NavLink to="/sss">SSS</NavLink>
          {" · "}
          <NavLink to="/gizlilik">Gizlilik</NavLink>
        </p>
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
      <StickyCta />
    </div>
  );
}
