import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { PageTitle } from "../components/PageTitle";
import { FELLOWS_10, MAIL_CHAINS, MAIL_TEMPLATES, PLAN_ITEMS } from "../data/seed";
import { fillTemplate, fellowsMissing } from "../lib/plan";
import { useStore } from "../state";

export function MailPage() {
  const { fellows, activities, mailLog, addMailLog, bumpWarn } = useStore();
  const [params] = useSearchParams();
  const [mode, setMode] = useState<"zincir" | "tek">("zincir");
  const [chainId, setChainId] = useState(
    () => params.get("chain") ?? MAIL_CHAINS[0].id,
  );
  const [stepLevel, setStepLevel] = useState(() => {
    const d = Number(params.get("dose") ?? "1");
    return Math.min(3, Math.max(1, Number.isFinite(d) ? d : 1));
  });
  const [templateId, setTemplateId] = useState<string>(MAIL_TEMPLATES[0].id);
  const [planId, setPlanId] = useState(params.get("plan") ?? PLAN_ITEMS[0]?.id ?? "");
  const [selected, setSelected] = useState<string[]>(() => {
    const f = params.get("fellow");
    return f ? [decodeURIComponent(f)] : [];
  });
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  const chain = MAIL_CHAINS.find((c) => c.id === chainId) ?? MAIL_CHAINS[0];
  const step = chain.steps.find((s) => s.level === stepLevel) ?? chain.steps[0];
  const tpl = MAIL_TEMPLATES.find((t) => t.id === templateId) ?? MAIL_TEMPLATES[0];
  const plan = PLAN_ITEMS.find((p) => p.id === planId);

  const missingForPlan = useMemo(
    () => (planId ? fellowsMissing(activities, planId) : []),
    [activities, planId],
  );

  function applyContent(toFellow?: string) {
    const isim = toFellow ?? selected[0] ?? "Fellow";
    const vars = {
      isim,
      kalem: plan?.title,
      deadline: plan?.due,
    };
    if (mode === "zincir") {
      setSubject(fillTemplate(step.subject, vars));
      setBody(fillTemplate(step.body, vars));
    } else {
      setSubject(fillTemplate(tpl.subject, vars));
      setBody(fillTemplate(tpl.body, vars));
    }
  }

  useEffect(() => {
    applyContent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, chainId, stepLevel, templateId, planId]);

  function toggle(name: string) {
    setSelected((prev) => (prev.includes(name) ? prev.filter((x) => x !== name) : [...prev, name]));
  }

  async function send() {
    if (!selected.length) {
      setMsg("Alıcı seç.");
      return;
    }
    setBusy(true);
    setMsg("");
    const payloads = selected.map((name) => {
      const meta = fellows.find((f) => f.name === name);
      const vars = {
        isim: name,
        kalem: plan?.title,
        deadline: plan?.due,
      };
      const sub =
        mode === "zincir"
          ? fillTemplate(step.subject, vars)
          : fillTemplate(subject || tpl.subject, vars);
      const bod =
        mode === "zincir"
          ? fillTemplate(step.body, vars)
          : fillTemplate(body || tpl.body, vars);
      return {
        to: meta?.email ?? `${name}@ornek.lead21`,
        name,
        subject: sub,
        body: bod,
      };
    });

    try {
      const res = await fetch("/api/send-mail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: payloads }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        mode?: string;
        detail?: string;
      };
      const sendMode =
        data.mode === "gonderildi" ? "gonderildi" : data.ok === false ? "hata" : "ornek";
      for (const p of payloads) {
        addMailLog({
          at: new Date().toISOString(),
          to: [p.to],
          subject: p.subject,
          body: p.body,
          mode: sendMode,
          detail:
            (mode === "zincir" ? `${chain.label} · seviye ${step.level}` : undefined) ??
            data.detail,
        });
        bumpWarn(p.name);
      }
      setMsg(
        sendMode === "gonderildi"
          ? `${payloads.length} mail gönderildi.`
          : sendMode === "hata"
            ? `Gönderim hatası: ${data.detail ?? res.status}`
            : `${payloads.length} mail örnek moda · ${mode === "zincir" ? `Mario L${step.level}` : "şablon"} (Resend yok).`,
      );
    } catch (e) {
      for (const p of payloads) {
        addMailLog({
          at: new Date().toISOString(),
          to: [p.to],
          subject: p.subject,
          body: p.body,
          mode: "ornek",
          detail: String(e),
        });
        bumpWarn(p.name);
      }
      setMsg("API yok — örnek log. Resend bağlanınca gerçek gönderim açılır.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="page">
      <PageTitle title="Mail zinciri" />
      <Breadcrumbs items={[{ label: "Bu ay", to: "/" }, { label: "Mail zinciri" }]} />
      <header className="page-head">
        <div>
          <p className="eyebrow">İletişim</p>
          <h1>Super Mario zinciri</h1>
          <p className="lede">
            Nazik → net → disiplin. Doz fellow’da birikir; Resend yoksa örnek log.
          </p>
        </div>
        <div className="toolbar">
          <button
            type="button"
            className={`chip ${mode === "zincir" ? "on" : ""}`}
            onClick={() => setMode("zincir")}
          >
            Zincir
          </button>
          <button
            type="button"
            className={`chip ${mode === "tek" ? "on" : ""}`}
            onClick={() => setMode("tek")}
          >
            Tek şablon
          </button>
        </div>
      </header>

      <div className="grid-2">
        <section className="panel">
          <h2>Alıcılar</h2>
          <div className="toolbar wrap">
            <button
              type="button"
              className="chip"
              onClick={() => setSelected([...missingForPlan])}
              disabled={!missingForPlan.length}
            >
              Bu kalemde eksikler ({missingForPlan.length})
            </button>
            <button type="button" className="chip" onClick={() => setSelected([...FELLOWS_10])}>
              Tümü
            </button>
            <button type="button" className="chip" onClick={() => setSelected([])}>
              Temizle
            </button>
          </div>
          <div className="recipient-grid">
            {FELLOWS_10.map((f) => {
              const meta = fellows.find((x) => x.name === f);
              return (
                <label key={f} className="check">
                  <input
                    type="checkbox"
                    checked={selected.includes(f)}
                    onChange={() => toggle(f)}
                  />
                  {f}
                  {(meta?.warnCount ?? 0) > 0 && (
                    <span className="muted tiny"> · doz {meta?.warnCount}</span>
                  )}
                </label>
              );
            })}
          </div>
        </section>

        <section className="panel">
          <h2>{mode === "zincir" ? "Zincir adımı" : "Şablon"}</h2>
          <div className="form-col">
            {mode === "zincir" ? (
              <>
                <select
                  className="select"
                  value={chainId}
                  onChange={(e) => setChainId(e.target.value)}
                >
                  {MAIL_CHAINS.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
                <div className="mario-steps">
                  {chain.steps.map((s) => (
                    <button
                      key={s.level}
                      type="button"
                      className={`mario-step ${stepLevel === s.level ? "active" : ""}`}
                      onClick={() => setStepLevel(s.level)}
                    >
                      <span className="mario-lvl">L{s.level}</span>
                      {s.label}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <select
                className="select"
                value={templateId}
                onChange={(e) => setTemplateId(e.target.value)}
              >
                {MAIL_TEMPLATES.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.label}
                  </option>
                ))}
              </select>
            )}
            <select className="select" value={planId} onChange={(e) => setPlanId(e.target.value)}>
              {PLAN_ITEMS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.due} — {p.title}
                </option>
              ))}
            </select>
            <button type="button" className="btn ghost" onClick={() => applyContent()}>
              Metni yenile
            </button>
            <input
              className="input"
              placeholder="Konu"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
            <textarea
              className="textarea"
              rows={10}
              placeholder="Gövde"
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
            <button type="button" className="btn" disabled={busy} onClick={send}>
              {busy ? "Gönderiliyor…" : "Gönder / kaydet (+doz)"}
            </button>
            {msg && <p className="muted">{msg}</p>}
          </div>
        </section>
      </div>

      <section className="panel mt">
        <h2>Gönderim logu</h2>
        {mailLog.length === 0 ? (
          <p className="muted">Henüz yok.</p>
        ) : (
          <ul className="list">
            {mailLog.slice(0, 20).map((m) => (
              <li key={m.id}>
                <div>
                  <strong>{m.subject}</strong>
                  <span className="muted block tiny">
                    {m.at.slice(0, 16)} · {m.to.join(", ")}
                    {m.detail ? ` · ${m.detail}` : ""}
                  </span>
                </div>
                <span
                  className={`badge ${m.mode === "gonderildi" ? "ok" : m.mode === "hata" ? "danger" : "warn"}`}
                >
                  {m.mode}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
