import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { FELLOWS_10, MAIL_TEMPLATES, PLAN_ITEMS } from "../data/seed";
import { fillTemplate, fellowsMissing } from "../lib/plan";
import { useStore } from "../state";

export function MailPage() {
  const { fellows, activities, mailLog, addMailLog } = useStore();
  const [params] = useSearchParams();
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

  const tpl = MAIL_TEMPLATES.find((t) => t.id === templateId) ?? MAIL_TEMPLATES[0];
  const plan = PLAN_ITEMS.find((p) => p.id === planId);

  const missingForPlan = useMemo(
    () => (planId ? fellowsMissing(activities, planId) : []),
    [activities, planId],
  );

  function applyTemplate(toFellow?: string) {
    const isim = toFellow ?? selected[0] ?? "Fellow";
    setSubject(
      fillTemplate(tpl.subject, {
        isim,
        kalem: plan?.title,
        deadline: plan?.due,
      }),
    );
    setBody(
      fillTemplate(tpl.body, {
        isim,
        kalem: plan?.title,
        deadline: plan?.due,
      }),
    );
  }

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
      return {
        to: meta?.email ?? `${name}@ornek.lead21`,
        name,
        subject: fillTemplate(subject || tpl.subject, {
          isim: name,
          kalem: plan?.title,
          deadline: plan?.due,
        }),
        body: fillTemplate(body || tpl.body, {
          isim: name,
          kalem: plan?.title,
          deadline: plan?.due,
        }),
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
      const mode = data.mode === "gonderildi" ? "gonderildi" : data.ok === false ? "hata" : "ornek";
      for (const p of payloads) {
        addMailLog({
          at: new Date().toISOString(),
          to: [p.to],
          subject: p.subject,
          body: p.body,
          mode,
          detail: data.detail,
        });
      }
      setMsg(
        mode === "gonderildi"
          ? `${payloads.length} mail gönderildi.`
          : mode === "hata"
            ? `Gönderim hatası: ${data.detail ?? res.status}`
            : `${payloads.length} mail örnek moda kaydedildi (Resend secret yok veya API yok).`,
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
      }
      setMsg("API yok — örnek log’a yazıldı. Resend bağlanınca gerçek gönderim açılır.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="page">
      <header className="page-head">
        <div>
          <p className="eyebrow">Mail</p>
          <h1>Hatırlatma & iletişim</h1>
          <p className="lede">
            Şablon seç, eksik fellow’ları doldur, gönder. Resend bağlı değilse örnek log tutulur.
          </p>
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
            {FELLOWS_10.map((f) => (
              <label key={f} className="check">
                <input
                  type="checkbox"
                  checked={selected.includes(f)}
                  onChange={() => toggle(f)}
                />
                {f}
              </label>
            ))}
          </div>
        </section>

        <section className="panel">
          <h2>Şablon & kalem</h2>
          <div className="form-col">
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
            <select className="select" value={planId} onChange={(e) => setPlanId(e.target.value)}>
              {PLAN_ITEMS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.due} — {p.title}
                </option>
              ))}
            </select>
            <button type="button" className="btn ghost" onClick={() => applyTemplate()}>
              Şablonu doldur
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
              {busy ? "Gönderiliyor…" : "Gönder / kaydet"}
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
                <span className={`badge ${m.mode === "gonderildi" ? "ok" : m.mode === "hata" ? "danger" : "warn"}`}>
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
