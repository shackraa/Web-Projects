/**
 * Cursor publish-app web function: POST /api/send-mail
 * Secrets: RESEND_API_KEY, MAIL_FROM (optional; mock when unset)
 */

type Msg = { to: string; name?: string; subject: string; body: string };

export async function POST(request: Request): Promise<Response> {
  let messages: Msg[] = [];
  try {
    const json = (await request.json()) as { messages?: Msg[] };
    messages = json.messages ?? [];
  } catch {
    return Response.json({ ok: false, mode: "hata", detail: "Geçersiz JSON" }, { status: 400 });
  }
  if (!messages.length) {
    return Response.json({ ok: false, mode: "hata", detail: "messages boş" }, { status: 400 });
  }

  const key = process.env.RESEND_API_KEY?.trim() ?? "";
  const from = process.env.MAIL_FROM?.trim() || "LEAD21 Ops <onboarding@resend.dev>";

  if (!key) {
    return Response.json({
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
          subject: m.subject,
          text: m.body,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { id?: string; message?: string };
      if (!res.ok) {
        results.push({ to: m.to, error: data.message ?? String(res.status) });
      } else {
        results.push({ to: m.to, id: data.id });
      }
    } catch (e) {
      results.push({ to: m.to, error: String(e) });
    }
  }

  const failed = results.filter((r) => r.error);
  if (failed.length === results.length) {
    return Response.json(
      { ok: false, mode: "hata", detail: failed[0]?.error, results },
      { status: 502 },
    );
  }

  return Response.json({
    ok: true,
    mode: "gonderildi",
    detail: failed.length ? `${failed.length} kısmi hata` : undefined,
    results,
  });
}
