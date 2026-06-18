"use client";

import { useState } from "react";
import Honeypot from "@/components/Honeypot";

type Status = "idle" | "loading" | "done" | "already" | "error";

export default function NewsletterForm({ dark = false }: { dark?: boolean }) {
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  async function subscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, website }),
      });
      if (!res.ok) throw new Error("bad response");
      const data = await res.json();
      setStatus(data.already ? "already" : "done");
    } catch {
      setStatus("error");
    }
  }

  if (status === "done" || status === "already") {
    return (
      <p
        className={`font-display text-2xl uppercase ${dark ? "text-paper" : "text-ink"}`}
      >
        {status === "already"
          ? "Ya estabas en la lista, parce."
          : "¡Listo, parce! Check your inbox."}
      </p>
    );
  }

  return (
    <div className="w-full max-w-md">
      <form onSubmit={subscribe} className="flex flex-col gap-3 sm:flex-row">
      <Honeypot value={website} onChange={setWebsite} />
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="tu@email.com"
        aria-label="Email address"
        className={`flex-1 border-2 px-4 py-3.5 text-sm font-medium outline-none placeholder:opacity-50 focus:border-azul ${
          dark
            ? "border-paper/30 bg-paper/10 text-paper placeholder:text-paper"
            : "border-ink bg-paper text-ink placeholder:text-ink"
        }`}
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="border-2 border-ink bg-ink px-6 py-3.5 text-sm font-bold tracking-[0.2em] text-paper uppercase transition-colors hover:bg-rojo hover:border-rojo disabled:opacity-60"
      >
        {status === "loading" ? "Un momento…" : "Suscríbete"}
      </button>
      {status === "error" && (
        <p className="text-sm font-bold text-rojo">
          Something broke. Try again?
        </p>
      )}
      </form>
      <p className={`mt-2 text-xs ${dark ? "text-paper/50" : "text-ink-soft"}`}>
        Te mandamos El Boletín. Cancela cuando quieras. Mira nuestra{" "}
        <a
          href="/privacidad"
          className="underline underline-offset-2 hover:opacity-80"
        >
          Política de Privacidad
        </a>
        .
      </p>
    </div>
  );
}
