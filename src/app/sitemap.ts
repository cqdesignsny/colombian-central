import type { MetadataRoute } from "next";
import { site } from "@/config/site";
import { products } from "@/data/products";
import { articles } from "@/data/articles";

type Freq = MetadataRoute.Sitemap[number]["changeFrequency"];

const STATIC: { path: string; freq: Freq; priority: number }[] = [
  { path: "", freq: "daily", priority: 1 },
  { path: "/futbol", freq: "daily", priority: 0.9 },
  { path: "/futbol/hinchada", freq: "weekly", priority: 0.6 },
  { path: "/musica", freq: "weekly", priority: 0.7 },
  { path: "/comida", freq: "weekly", priority: 0.7 },
  { path: "/tienda", freq: "weekly", priority: 0.8 },
  { path: "/viajes", freq: "weekly", priority: 0.7 },
  { path: "/viajes/mundial", freq: "weekly", priority: 0.7 },
  { path: "/enviar-dinero", freq: "weekly", priority: 0.7 },
  { path: "/noticias", freq: "daily", priority: 0.8 },
  { path: "/nosotros", freq: "monthly", priority: 0.5 },
  { path: "/privacidad", freq: "yearly", priority: 0.2 },
  { path: "/terminos", freq: "yearly", priority: 0.2 },
  { path: "/envios-devoluciones", freq: "yearly", priority: 0.3 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticEntries = STATIC.map((s) => ({
    url: `${site.url}${s.path}`,
    lastModified: now,
    changeFrequency: s.freq,
    priority: s.priority,
  }));

  const productEntries = products.map((p) => ({
    url: `${site.url}/tienda/${p.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as Freq,
    priority: 0.6,
  }));

  const articleEntries = articles.map((a) => ({
    url: `${site.url}/noticias/${a.slug}`,
    lastModified: new Date(`${a.date}T12:00:00-04:00`),
    changeFrequency: "monthly" as Freq,
    priority: 0.6,
  }));

  return [...staticEntries, ...productEntries, ...articleEntries];
}
