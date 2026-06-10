import { Resend } from "resend";
import { site } from "@/config/site";

export function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY is not set");
  return new Resend(key);
}

export const FROM = {
  /** Newsletter and welcome emails */
  boletin: "El Boletín · Colombian Central <boletin@colombiancentral.com>",
  /** Transactional: orders, trip inquiries */
  hola: "Colombian Central <hola@colombiancentral.com>",
} as const;

/** Where owner notifications (new orders, new inquiries) are sent. */
export const NOTIFY_TO = site.contactEmail;

export const SEGMENT_ID = process.env.RESEND_SEGMENT_ID ?? "";

export function siteUrl() {
  return process.env.SITE_URL ?? site.url;
}

/**
 * Contact management uses the REST API directly (the SDK lags the
 * contacts/segments endpoints). Best-effort: callers should not fail the
 * user-facing request when these throw.
 */
export async function resendApi(
  path: string,
  init: { method: string; body?: unknown },
) {
  const res = await fetch(`https://api.resend.com${path}`, {
    method: init.method,
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: init.body === undefined ? undefined : JSON.stringify(init.body),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Resend ${init.method} ${path} -> ${res.status} ${detail.slice(0, 200)}`);
  }
  return res.json().catch(() => ({}));
}
