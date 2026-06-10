import { NextResponse } from "next/server";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  let email: unknown;
  try {
    ({ email } = await req.json());
  } catch {
    return NextResponse.json({ ok: false, error: "Bad payload" }, { status: 400 });
  }

  if (typeof email !== "string" || !EMAIL_RE.test(email)) {
    return NextResponse.json({ ok: false, error: "Invalid email" }, { status: 400 });
  }

  // TODO: wire to Resend (create contact in the El Boletín audience and send
  // a welcome email). Needs RESEND_API_KEY in env. For now we log so signups
  // are visible in server logs during the soft launch.
  console.log("[newsletter] signup:", email);

  return NextResponse.json({ ok: true });
}
