/**
 * Cursor publish-app web function: POST /api/send-mail
 * Secrets: RESEND_API_KEY, MAIL_FROM (optional; mock when unset)
 * Auth: Cursor app identity (private/team viewer)
 */

import { requireIdentity } from "../cursor/identity";

type Msg = { to: string; name?: string; subject: string; body: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_MESSAGES = 21;
const MAX_SUBJECT = 200;
const MAX_BODY = 8000;
const RATE_WINDOW_MS = 60_000;
const RATE_MAX = 30;

const rateBuckets = new Map<string, { count: number; resetAt: number }>();

function json(
  data: unknown,
  status = 200,
  extraHeaders?: Record<string, string>,
): Response {
  return Response.json(data, {
    status,
    headers: {
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
      "Referrer-Policy": "no-referrer",
      ...extraHeaders,
    },
  });
}

function rateLimit(key: string): boolean {
  const now = Date.now();
  const bucket = rateBuckets.get(key);
  if (!bucket || now > bucket.resetAt) {
    rateBuckets.set(key, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return true;
  }
  if (bucket.count >= RATE_MAX) return false;
  bucket.count += 1;
  return true;
}

function validateMessage(m: unknown): Msg | string {
  if (!m || typeof m !== "object") return "geçersiz mesaj";
  const row = m as Record<string, unknown>;
  const to = typeof row.to === "string" ? row.to.trim() : "";
  const subject = typeof row.subject === "string" ? row.subject.trim() : "";
  const body = typeof row.body === "string" ? row.body.trim() : "";
  const name = typeof row.name === "string" ? row.name.trim().slice(0, 120) : undefined;
  if (!to || !EMAIL_RE.test(to)) return "geçersiz e-posta";
  if (!subject || subject.length > MAX_SUBJECT) return "geçersiz konu";
  if (!body || body.length > MAX_BODY) return "geçersiz gövde";
  return { to, subject, body, name };
}

export async function POST(request: Request): Promise<Response> {
  const identity = await requireIdentity(request);
  if (identity instanceof Response) {
    return json(
      { ok: false, mode: "hata", detail: "yetkisiz" },
      identity.status || 401,
    );
  }

  if (!rateLimit(identity.sub)) {
    return json({ ok: false, mode: "hata", detail: "rate limit" }, 429);
  }

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return json({ ok: false, mode: "hata", detail: "Geçersiz JSON" }, 400);
  }

  const list = (raw as { messages?: unknown })?.messages;
  if (!Array.isArray(list) || !list.length) {
    return json({ ok: false, mode: "hata", detail: "messages boş" }, 400);
  }
  if (list.length > MAX_MESSAGES) {
    return json({ ok: false, mode: "hata", detail: "çok fazla alıcı" }, 400);
  }

  const messages: Msg[] = [];
  for (const item of list) {
    const v = validateMessage(item);
    if (typeof v === "string") {
      return json({ ok: false, mode: "hata", detail: v }, 400);
    }
    messages.push(v);
  }

  const key = process.env.RESEND_API_KEY?.trim() ?? "";
  const from = process.env.MAIL_FROM?.trim() || "LEAD21 Ops <onboarding@resend.dev>";

  if (!key) {
    return json({
      ok: true,
      mode: "ornek",
      detail: "RESEND_API_KEY yok — örnek kayıt",
      count: messages.length,
    });
  }

  const results: { to: string; id?: string; error?: string }[] = [];
  for (const m of messages) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from,
          to: [m.to],
          subject: m.subject.slice(0, MAX_SUBJECT),
          text: m.body.slice(0, MAX_BODY),
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { id?: string; message?: string };
      if (!res.ok) {
        results.push({ to: m.to, error: "gönderim başarısız" });
      } else {
        results.push({ to: m.to, id: data.id ? "ok" : "ok" });
      }
    } catch {
      results.push({ to: m.to, error: "gönderim hatası" });
    }
  }

  const failed = results.filter((r) => r.error);
  if (failed.length === results.length) {
    return json(
      { ok: false, mode: "hata", detail: "gönderim başarısız", count: failed.length },
      502,
    );
  }

  return json({
    ok: true,
    mode: "gonderildi",
    detail: failed.length ? `${failed.length} kısmi hata` : undefined,
    count: results.length - failed.length,
  });
}
