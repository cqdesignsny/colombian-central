import { getDb } from "@/lib/db";
import { resendApi } from "@/lib/resend";
import { verifyUnsubscribeToken } from "@/lib/tokens";

function page(title: string, body: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title} · Colombian Central</title>
</head>
<body style="margin:0; background:#F7F1E3; color:#17130E; font-family:Arial, Helvetica, sans-serif;">
  <div style="height:8px; background:linear-gradient(to right, #FFCD00 0 50%, #003087 50% 75%, #C8102E 75% 100%);"></div>
  <div style="max-width:560px; margin:80px auto; padding:0 24px; text-align:center;">
    <h1 style="font-size:32px; letter-spacing:1px; text-transform:uppercase;">${title}</h1>
    <p style="font-size:16px; line-height:26px; color:#5A5044;">${body}</p>
    <a href="/" style="display:inline-block; margin-top:16px; padding:14px 28px; background:#FFCD00; border:2px solid #17130E; color:#17130E; font-weight:bold; letter-spacing:2px; text-transform:uppercase; text-decoration:none; font-size:13px;">Volver al inicio</a>
  </div>
</body>
</html>`;
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const email = (url.searchParams.get("email") ?? "").trim().toLowerCase();
  const token = url.searchParams.get("token") ?? "";

  let valid = false;
  try {
    valid = Boolean(email) && verifyUnsubscribeToken(email, token);
  } catch {
    valid = false;
  }

  if (!valid) {
    return new Response(
      page("Enlace inválido", "This unsubscribe link is not valid. If you keep getting emails you do not want, write us and a human fixes it."),
      { status: 400, headers: { "Content-Type": "text/html; charset=utf-8" } },
    );
  }

  const db = getDb();
  await db`
    UPDATE subscribers
    SET status = 'unsubscribed', unsubscribed_at = now()
    WHERE email = ${email}`;

  try {
    await resendApi(`/contacts/${encodeURIComponent(email)}`, {
      method: "PATCH",
      body: { unsubscribed: true },
    });
  } catch (err) {
    console.error("[unsubscribe] Resend sync failed:", err);
  }

  return new Response(
    page("Listo, te bajamos", "You are off El Boletín. No hard feelings. The fútbol, the tienda and the viajes are still here whenever you want them."),
    { headers: { "Content-Type": "text/html; charset=utf-8" } },
  );
}
