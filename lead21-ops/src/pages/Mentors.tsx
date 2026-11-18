import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FELLOWS_10, type MentorKind, type MentorStatus } from "../data/seed";
import { useStore } from "../state";

const KINDS: MentorKind[] = ["LM", "UDY", "SM", "Global"];

export function MentorsPage() {
  const { mentors, setMentorStatus, fellows } = useStore();
  const [kind, setKind] = useState<MentorKind | "hepsi">("hepsi");
  const [onlyOpen, setOnlyOpen] = useState(true);
  const today = new Date().toISOString().slice(0, 10);

  const rows = useMemo(() => {
    return mentors
      .filter((m) => (kind === "hepsi" ? true : m.kind === kind))
      .filter((m) => {
        if (!onlyOpen) return true;
        return m.status !== "yapildi";
      })
      .sort((a, b) => {
        const rank = (s: MentorStatus) =>
          s === "sorun" ? 0 : s === "planlandi" || s === "bekliyor" ? 1 : s === "eslesti" ? 2 : 3;
        return rank(a.status) - rank(b.status) || a.targetAt.localeCompare(b.targetAt);
      });
  }, [mentors, kind, onlyOpen]);

  const stats = useMemo(() => {
    const open = mentors.filter((m) => m.status !== "yapildi").length;
    const sorun = mentors.filter((m) => m.status === "sorun").length;
    const late = mentors.filter(
      (m) => m.status !== "yapildi" && m.status !== "sorun" && m.targetAt < today,
    ).length;
    return { open, sorun, late, total: mentors.length };
  }, [mentors, today]);

  return (
    <div className="page">
      <header className="page-head">
        <div>
          <p className="eyebrow">Mentör pipeline</p>
          <h1>Mentör eşleşmeleri</h1>
          <p className="lede">
            LM / UDY / SM / Global · Nisan–Ekim–Ocak hedefleri · doğrudan veya iletişimci loop.
            Global puan satırı Excel’de belirsiz — burada manuel takip.
          </p>
        </div>
        <div className="stat-pills">
          <div className="stat">
            <span className="stat-label">Açık</span>
            <strong>{stats.open}</strong>
          </div>
          <div className="stat">
            <span className="stat-label">Sorun</span>
            <strong className={stats.sorun ? "danger" : "ok"}>{stats.sorun}</strong>
          </div>
          <div className="stat">
            <span className="stat-label">Geciken</span>
            <strong className={stats.late ? "warn" : "ok"}>{stats.late}</strong>
          </div>
        </div>
      </header>

      <div className="toolbar">
        <select
          className="select"
          value={kind}
          onChange={(e) => setKind(e.target.value as MentorKind | "hepsi")}
        >
          <option value="hepsi">Tüm türler</option>
          {KINDS.map((k) => (
            <option key={k} value={k}>
              {k}
            </option>
          ))}
        </select>
        <label className="check">
          <input
            type="checkbox"
            checked={onlyOpen}
            onChange={(e) => setOnlyOpen(e.target.checked)}
          />
          Sadece açık / sorun
        </label>
      </div>

      <div className="table-wrap">
        <table className="table dense">
          <thead>
            <tr>
              <th>Fellow</th>
              <th>Tür</th>
              <th>Mentör</th>
              <th>Pipeline</th>
              <th>Hedef</th>
              <th>Durum</th>
              <th>Not</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((m) => {
              const late = m.status !== "yapildi" && m.targetAt < today;
              return (
                <tr key={m.id} className={m.status === "sorun" || late ? "row-warn" : undefined}>
                  <td>
                    <Link className="name-link" to={`/fellows/${encodeURIComponent(m.fellow)}`}>
                      {m.fellow}
                    </Link>
                    <span className="muted block tiny">
                      doz #{fellows.find((f) => f.name === m.fellow)?.warnCount ?? 0}
                    </span>
                  </td>
                  <td>
                    <span className="badge">{m.kind}</span>
                  </td>
                  <td>{m.mentorName}</td>
                  <td className="tiny">
                    {m.pipeline === "dogrudan" ? "doğrudan" : "iletişimci"}
                  </td>
                  <td className="mono tiny">
                    {m.targetAt}
                    {late ? " !" : ""}
                  </td>
                  <td>
                    <select
                      className="select sm"
                      value={m.status}
                      onChange={(e) =>
                        setMentorStatus(m.id, e.target.value as MentorStatus, {
                          note: e.target.value === "sorun" ? m.note || "Sorun" : m.note,
                        })
                      }
                    >
                      <option value="bekliyor">bekliyor</option>
                      <option value="eslesti">eşleşti</option>
                      <option value="planlandi">planlandı</option>
                      <option value="yapildi">yapıldı</option>
                      <option value="sorun">sorun</option>
                    </select>
                  </td>
                  <td className="tiny">{m.note || "—"}</td>
                  <td>
                    {m.status !== "yapildi" && (
                      <button
                        type="button"
                        className="btn ghost sm"
                        onClick={() => setMentorStatus(m.id, "yapildi")}
                      >
                        Yapıldı
                      </button>
                    )}
                    <Link
                      className="btn ghost sm"
                      to={`/mail?fellow=${encodeURIComponent(m.fellow)}&chain=mentor-mario`}
                    >
                      Mail
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="muted tiny mt">
        {FELLOWS_10.length} fellow · {mentors.length} eşleşme kaydı (1. + 2. görüşme).
      </p>
    </div>
  );
}
