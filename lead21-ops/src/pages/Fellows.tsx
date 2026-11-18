import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { PageTitle } from "../components/PageTitle";
import { SCORE_CATEGORIES } from "../data/seed";
import { fellowIssues, moduleSnapshot } from "../lib/modules";
import { barrierRatio, fellowTotal, pctLabel, underBarrier } from "../lib/scoring";
import { useStore } from "../state";

type Filter = "all" | "low" | "issues";

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toLocaleUpperCase("tr");
}

export function Fellows() {
  const navigate = useNavigate();
  const { fellows, scores, bonuses, updateFellow, stages, activities } = useStore();
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const rows = useMemo(() => {
    return fellows
      .map((f) => {
        const total = fellowTotal(scores[f.name], bonuses, f.name);
        const issues = fellowIssues(f.name, stages);
        const mods = SCORE_CATEGORIES.map((c) =>
          moduleSnapshot(f.name, c.code, stages, scores[f.name], activities),
        );
        const sorunMods = mods.filter((m) => m.health === "sorun").length;
        const yolda = mods.filter((m) => m.health === "yolda").length;
        return {
          ...f,
          total,
          pct: barrierRatio(total),
          low: underBarrier(total),
          issueCount: issues.length,
          sorunMods,
          yolda,
          topIssues: issues.slice(0, 2),
        };
      })
      .filter((f) => {
        if (filter === "low" && !f.low) return false;
        if (filter === "issues" && f.issueCount === 0) return false;
        if (!q.trim()) return true;
        return f.name.toLowerCase().includes(q.toLowerCase());
      })
      .sort((a, b) => b.issueCount - a.issueCount || a.pct - b.pct);
  }, [fellows, scores, bonuses, stages, activities, q, filter]);

  const counts = useMemo(() => {
    let low = 0;
    let issues = 0;
    for (const f of fellows) {
      const total = fellowTotal(scores[f.name], bonuses, f.name);
      if (underBarrier(total)) low += 1;
      if (fellowIssues(f.name, stages).length) issues += 1;
    }
    return { all: fellows.length, low, issues };
  }, [fellows, scores, bonuses, stages]);

  return (
    <div className="page">
      <PageTitle title="Fellow’lar" />
      <Breadcrumbs items={[{ label: "Bu ay", to: "/" }, { label: "Fellow’lar" }]} />
      <header className="page-head">
        <div>
          <p className="eyebrow">Seç · aç · müdahale et</p>
          <h1>Fellow’lar</h1>
          <p className="lede">
            Kartın tamamı tıklanır. Baraj altı ve sorunlular önce; Mail hızlı aksiyon.
          </p>
        </div>
      </header>

      <div className="fellow-filters">
        <input
          className="input fellow-search"
          placeholder="İsim ara…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          aria-label="Fellow ara"
        />
        <div className="filter-seg" role="tablist" aria-label="Filtre">
          {(
            [
              ["all", `Hepsi (${counts.all})`],
              ["low", `Baraj altı (${counts.low})`],
              ["issues", `Sorunlu (${counts.issues})`],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={filter === id}
              className={`filter-chip ${filter === id ? "active" : ""}`}
              onClick={() => setFilter(id)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {rows.length === 0 ? (
        <p className="muted panel">Eşleşen fellow yok. Filtreyi veya aramayı temizle.</p>
      ) : (
        <div className="fellow-grid">
          {rows.map((f) => {
            const href = `/fellows/${encodeURIComponent(f.name)}`;
            return (
              <article
                key={f.name}
                className={`fellow-card ${f.low || f.issueCount ? "warn" : ""}`}
              >
                <button
                  type="button"
                  className="fellow-card-main"
                  onClick={() => navigate(href)}
                  aria-label={`${f.name} dosyasını aç`}
                >
                  <span className={`fellow-avatar ${f.low ? "danger" : f.issueCount ? "warn" : "ok"}`}>
                    {initials(f.name)}
                  </span>
                  <span className="fellow-card-body">
                    <span className="fellow-name">{f.name}</span>
                    <span className="fellow-meta">
                      <span className={`badge ${f.low ? "danger" : "ok"}`}>{pctLabel(f.pct)}</span>
                      {f.sorunMods > 0 ? (
                        <span className="badge danger">{f.sorunMods} sorunlu</span>
                      ) : null}
                      {f.yolda > 0 ? <span className="badge warn">{f.yolda} yolda</span> : null}
                      {f.sorunMods === 0 && f.yolda === 0 ? (
                        <span className="badge ok">temiz</span>
                      ) : null}
                    </span>
                    {f.topIssues.length > 0 ? (
                      <span className="fellow-issues muted tiny">
                        {f.topIssues
                          .map((i) => SCORE_CATEGORIES.find((c) => c.code === i.moduleCode)?.label ?? i.moduleCode)
                          .join(" · ")}
                        {f.issueCount > 2 ? ` · +${f.issueCount - 2}` : ""}
                      </span>
                    ) : (
                      <span className="fellow-issues muted tiny">{f.email}</span>
                    )}
                  </span>
                  <span className="fellow-open" aria-hidden>
                    Aç →
                  </span>
                </button>
                <div className="fellow-card-actions">
                  <label className="fellow-status">
                    <span className="sr-only">Durum</span>
                    <select
                      className="select sm"
                      value={f.status}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) =>
                        updateFellow(f.name, {
                          status: e.target.value as "aktif" | "uyari" | "mezuniyet",
                        })
                      }
                    >
                      <option value="aktif">aktif</option>
                      <option value="uyari">uyarı</option>
                      <option value="mezuniyet">mezuniyet</option>
                    </select>
                  </label>
                  <Link
                    className="btn ghost sm"
                    to={`/mail?fellow=${encodeURIComponent(f.name)}`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    Mail
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
