import { site } from "@/config/site";
import { worldCup } from "@/data/futbol";
import { formatKickoff, formatPrice } from "@/lib/format";
import { siteUrl } from "@/lib/resend";
import { unsubscribeToken } from "@/lib/tokens";

const C = {
  paper: "#F7F1E3",
  card: "#FFFDF6",
  ink: "#17130E",
  soft: "#5A5044",
  amarillo: "#FFCD00",
  azul: "#003087",
  rojo: "#C8102E",
};

const FONT = "Arial, Helvetica, sans-serif";
const SERIF = "Georgia, 'Times New Roman', serif";

function shell(preheader: string, content: string, footerExtra = "") {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<title>${site.brand}</title>
</head>
<body style="margin:0; padding:0; background-color:${C.paper};">
<span style="display:none; font-size:1px; color:${C.paper}; max-height:0; overflow:hidden;">${preheader}</span>
<table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${C.paper}" style="background-color:${C.paper};">
<tr><td align="center" style="padding-top:24px; padding-bottom:24px; padding-left:12px; padding-right:12px;">
<table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px; width:100%;">
  <tr>
    <td width="50%" height="8" bgcolor="${C.amarillo}" style="font-size:0; line-height:0;">&nbsp;</td>
    <td width="25%" height="8" bgcolor="${C.azul}" style="font-size:0; line-height:0;">&nbsp;</td>
    <td width="25%" height="8" bgcolor="${C.rojo}" style="font-size:0; line-height:0;">&nbsp;</td>
  </tr>
  <tr><td colspan="3" bgcolor="${C.ink}" style="background-color:${C.ink}; padding-top:26px; padding-bottom:26px; padding-left:32px; padding-right:32px;">
    <span style="font-family:${FONT}; font-size:22px; line-height:26px; font-weight:bold; letter-spacing:2px; color:${C.paper};">COLOMBIAN CENTRAL</span><br>
    <span style="font-family:${SERIF}; font-style:italic; font-size:14px; line-height:22px; color:${C.amarillo};">${site.tagline}</span>
  </td></tr>
  <tr><td colspan="3" bgcolor="${C.card}" style="background-color:${C.card}; padding-top:32px; padding-bottom:32px; padding-left:32px; padding-right:32px;">
    ${content}
  </td></tr>
  <tr><td colspan="3" bgcolor="${C.ink}" style="background-color:${C.ink}; padding-top:20px; padding-bottom:20px; padding-left:32px; padding-right:32px;">
    <span style="font-family:${FONT}; font-size:12px; line-height:18px; color:#B8AE9C;">${site.brand} · Hecho con orgullo por la diáspora.<br>Independent fan media, not affiliated with FIFA or the FCF.</span>
    ${footerExtra}
  </td></tr>
  <tr>
    <td width="50%" height="8" bgcolor="${C.amarillo}" style="font-size:0; line-height:0;">&nbsp;</td>
    <td width="25%" height="8" bgcolor="${C.azul}" style="font-size:0; line-height:0;">&nbsp;</td>
    <td width="25%" height="8" bgcolor="${C.rojo}" style="font-size:0; line-height:0;">&nbsp;</td>
  </tr>
</table>
</td></tr>
</table>
</body>
</html>`;
}

function h1(text: string) {
  return `<span style="font-family:${FONT}; font-size:28px; line-height:32px; font-weight:bold; letter-spacing:1px; color:${C.ink}; text-transform:uppercase;">${text}</span>`;
}

function p(text: string) {
  return `<p style="font-family:${FONT}; font-size:15px; line-height:24px; color:${C.soft}; margin-top:14px; margin-bottom:0;">${text}</p>`;
}

function button(href: string, label: string) {
  return `<table cellpadding="0" cellspacing="0" border="0" style="margin-top:24px;"><tr>
    <td bgcolor="${C.amarillo}" style="background-color:${C.amarillo}; border-top:2px solid ${C.ink}; border-bottom:2px solid ${C.ink}; border-left:2px solid ${C.ink}; border-right:2px solid ${C.ink};">
      <a href="${href}" style="display:inline-block; padding-top:13px; padding-bottom:13px; padding-left:26px; padding-right:26px; font-family:${FONT}; font-size:13px; line-height:16px; font-weight:bold; letter-spacing:2px; color:${C.ink}; text-decoration:none; text-transform:uppercase;">${label}</a>
    </td></tr></table>`;
}

function detailRows(rows: Array<[string, string]>) {
  return `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:20px; border-top:2px solid ${C.ink};">
    ${rows
      .map(
        ([k, v]) => `<tr>
      <td width="35%" valign="top" style="padding-top:10px; padding-bottom:10px; padding-right:12px; border-bottom:1px solid #E5DCC8; font-family:${FONT}; font-size:12px; line-height:18px; font-weight:bold; letter-spacing:1px; color:${C.ink}; text-transform:uppercase;">${k}</td>
      <td valign="top" style="padding-top:10px; padding-bottom:10px; border-bottom:1px solid #E5DCC8; font-family:${FONT}; font-size:14px; line-height:20px; color:${C.soft};">${v}</td>
    </tr>`,
      )
      .join("")}
  </table>`;
}

function unsubscribeFooter(email: string) {
  const url = `${siteUrl()}/api/unsubscribe?email=${encodeURIComponent(email)}&token=${unsubscribeToken(email)}`;
  return `<br><span style="font-family:${FONT}; font-size:12px; line-height:18px; color:#B8AE9C;">¿No quieres recibir El Boletín? <a href="${url}" style="color:${C.amarillo}; text-decoration:underline;">Darse de baja</a></span>`;
}

function esc(s: string) {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

/* ------------------------------------------------------------------ */

export function welcomeEmail(email: string) {
  const fixtures = worldCup.fixtures.map((f) => {
    const k = formatKickoff(f.kickoff);
    const vs = f.colombiaHome ? `Colombia vs ${f.opponent}` : `${f.opponent} vs Colombia`;
    return [`${k.date} · ${k.time}`, `${vs}<br>${f.venue}, ${f.city} (${f.tv})`] as [string, string];
  });

  const content = [
    h1("¡Llegaste, parce!"),
    p("Bienvenido a El Boletín, the weekly email from Colombian Central. One email every Thursday: La Tricolor, new drops from la tienda, travel finds, and the best of la cultura. Cero spam."),
    p("And because the timing is perfect, here is the only calendar that matters right now:"),
    detailRows(fixtures),
    p(`All times U.S. Eastern. Watch party lists for every match land here the week of each game.`),
    button(`${siteUrl()}/futbol`, "Ver el calendario completo"),
  ].join("");

  return {
    subject: "Bienvenido a Colombian Central. El Mundial nos espera.",
    html: shell("La Tricolor, la tienda, los viajes. Todo en un solo lugar.", content, unsubscribeFooter(email)),
    text: [
      "¡Llegaste, parce!",
      "",
      "Welcome to El Boletín, the weekly email from Colombian Central: La Tricolor, new drops, travel finds, and la cultura. Every Thursday, cero spam.",
      "",
      "Colombia in Group K:",
      ...worldCup.fixtures.map((f) => {
        const k = formatKickoff(f.kickoff);
        const vs = f.colombiaHome ? `Colombia vs ${f.opponent}` : `${f.opponent} vs Colombia`;
        return `- ${k.date}, ${k.time}: ${vs} (${f.venue}, ${f.city}, ${f.tv})`;
      }),
      "",
      `Full calendar: ${siteUrl()}/futbol`,
      "",
      `Unsubscribe: ${siteUrl()}/api/unsubscribe?email=${encodeURIComponent(email)}&token=${unsubscribeToken(email)}`,
    ].join("\n"),
  };
}

/* ------------------------------------------------------------------ */

export type OrderEmailInput = {
  id: number;
  name: string;
  email: string;
  address: string;
  items: Array<{ name: string; qty: number; price: number }>;
  subtotal: number;
};

function itemRows(items: OrderEmailInput["items"]) {
  return detailRows(items.map((i) => [`${i.qty} ×`, `${esc(i.name)} · ${formatPrice(i.price * i.qty)}`]));
}

export function orderOwnerEmail(order: OrderEmailInput) {
  const content = [
    h1(`Nuevo pedido #${order.id}`),
    p(`${esc(order.name)} (${esc(order.email)}) placed an order for <strong>${formatPrice(order.subtotal)}</strong>.`),
    itemRows(order.items),
    detailRows([
      ["Ship to", esc(order.address).replaceAll("\n", "<br>")],
      ["Status", "New. Reply to this email to confirm with the customer (reply-to is set to them)."],
    ]),
  ].join("");

  return {
    subject: `Nuevo pedido #${order.id}: ${formatPrice(order.subtotal)} (${order.name})`,
    html: shell(`Pedido de ${order.name}`, content),
    text: [
      `Nuevo pedido #${order.id} de ${order.name} (${order.email})`,
      "",
      ...order.items.map((i) => `- ${i.qty} x ${i.name} (${formatPrice(i.price * i.qty)})`),
      `Subtotal: ${formatPrice(order.subtotal)}`,
      "",
      "Ship to:",
      order.address,
    ].join("\n"),
  };
}

export function orderCustomerEmail(order: OrderEmailInput) {
  const content = [
    h1("¡Pedido recibido!"),
    p(`Gracias, ${esc(order.name)}. Your order <strong>#${order.id}</strong> is in. Here is what we have:`),
    itemRows(order.items),
    detailRows([["Subtotal", formatPrice(order.subtotal)]]),
    p("A human confirms your order, shipping, and payment by email within a day. Nothing is charged yet. Free U.S. shipping on orders over $75, shipped from Miami."),
    button(`${siteUrl()}/tienda`, "Seguir comprando"),
  ].join("");

  return {
    subject: `Pedido recibido #${order.id} · Colombian Central`,
    html: shell("Confirmamos por email dentro de un día.", content),
    text: [
      `¡Pedido recibido! Order #${order.id}`,
      "",
      ...order.items.map((i) => `- ${i.qty} x ${i.name} (${formatPrice(i.price * i.qty)})`),
      `Subtotal: ${formatPrice(order.subtotal)}`,
      "",
      "A human confirms your order, shipping, and payment by email within a day. Nothing is charged yet.",
    ].join("\n"),
  };
}

/* ------------------------------------------------------------------ */

export type InquiryEmailInput = {
  id: number;
  name: string;
  email: string;
  trip: string;
  travelers: string;
  dates: string;
  notes: string;
};

export function inquiryOwnerEmail(inq: InquiryEmailInput) {
  const content = [
    h1(`Cotización #${inq.id}`),
    p(`${esc(inq.name)} (${esc(inq.email)}) wants a trip quote. Reply to this email to answer them directly.`),
    detailRows([
      ["Trip", esc(inq.trip)],
      ["Travelers", esc(inq.travelers || "Not specified")],
      ["Dates", esc(inq.dates || "Flexible")],
      ["Notes", esc(inq.notes || "None")],
    ]),
  ].join("");

  return {
    subject: `Nueva cotización de viaje: ${inq.trip} (${inq.name})`,
    html: shell(`Cotización de ${inq.name}`, content),
    text: [
      `Nueva cotización #${inq.id} de ${inq.name} (${inq.email})`,
      `Trip: ${inq.trip}`,
      `Travelers: ${inq.travelers || "-"}`,
      `Dates: ${inq.dates || "-"}`,
      `Notes: ${inq.notes || "-"}`,
    ].join("\n"),
  };
}

export function inquiryCustomerEmail(inq: InquiryEmailInput) {
  const content = [
    h1("Recibimos tu solicitud"),
    p(`Gracias, ${esc(inq.name)}. Your trip request is with our travel desk. Here is how it works:`),
    detailRows([
      ["1", "A Colombian who knows the route reads your request today."],
      ["2", "You get an itinerary and a real price within a day."],
      ["3", "You tweak, approve, and pack. Nothing is paid until you approve."],
    ]),
    p(`What you asked for: <strong>${esc(inq.trip)}</strong>${inq.dates ? `, around ${esc(inq.dates)}` : ""}.`),
    button(`${siteUrl()}/viajes`, "Ver destinos mientras tanto"),
  ].join("");

  return {
    subject: "Recibimos tu solicitud de viaje · Colombian Central",
    html: shell("Tu cotización llega dentro de un día.", content),
    text: [
      `Gracias, ${inq.name}. Your trip request (${inq.trip}) is with our travel desk.`,
      "You get an itinerary and a real price within a day. Nothing is paid until you approve.",
    ].join("\n"),
  };
}
