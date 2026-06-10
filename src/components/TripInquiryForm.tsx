"use client";

import { useState } from "react";
import { destinations, packages } from "@/data/destinations";
import { site } from "@/config/site";
import Honeypot from "@/components/Honeypot";

export default function TripInquiryForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [trip, setTrip] = useState("");
  const [travelers, setTravelers] = useState("2");
  const [dates, setDates] = useState("");
  const [notes, setNotes] = useState("");
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  const options = [
    ...packages.map((p) => `Package: ${p.name}`),
    ...destinations.map((d) => `Destination: ${d.name}`),
    "Something custom",
  ];

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, trip, travelers, dates, notes, website }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error ?? "failed");
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="py-6 text-center">
        <p className="font-display text-4xl uppercase">¡Recibido, {name.split(" ")[0] || "parce"}!</p>
        <p className="mx-auto mt-4 max-w-md text-sm text-ink-soft">
          Your request is with the travel desk and a confirmation just landed
          in your inbox. Expect an itinerary and a real price within a day.
        </p>
      </div>
    );
  }

  const inputStyles =
    "w-full border-2 border-ink/20 bg-paper px-4 py-3 text-sm font-medium outline-none placeholder:text-ink/40 focus:border-azul";

  return (
    <form className="grid gap-4 sm:grid-cols-2" onSubmit={submit}>
      <Honeypot value={website} onChange={setWebsite} />
      <div>
        <label className="mb-1.5 block text-xs font-bold tracking-[0.2em] uppercase">
          Tu nombre
        </label>
        <input
          className={inputStyles}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nombre y apellido"
          required
        />
      </div>
      <div>
        <label className="mb-1.5 block text-xs font-bold tracking-[0.2em] uppercase">
          Tu email
        </label>
        <input
          type="email"
          className={inputStyles}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tu@email.com"
          required
        />
      </div>
      <div>
        <label className="mb-1.5 block text-xs font-bold tracking-[0.2em] uppercase">
          ¿Pa&apos; dónde?
        </label>
        <select
          className={inputStyles}
          value={trip}
          onChange={(e) => setTrip(e.target.value)}
          required
        >
          <option value="" disabled>
            Pick a trip or destination
          </option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="mb-1.5 block text-xs font-bold tracking-[0.2em] uppercase">
          Viajeros
        </label>
        <select
          className={inputStyles}
          value={travelers}
          onChange={(e) => setTravelers(e.target.value)}
        >
          {["1", "2", "3", "4", "5", "6+", "Group / event"].map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </div>
      <div className="sm:col-span-2">
        <label className="mb-1.5 block text-xs font-bold tracking-[0.2em] uppercase">
          Fechas aproximadas
        </label>
        <input
          className={inputStyles}
          value={dates}
          onChange={(e) => setDates(e.target.value)}
          placeholder="e.g. late August, 8 to 10 days"
        />
      </div>
      <div className="sm:col-span-2">
        <label className="mb-1.5 block text-xs font-bold tracking-[0.2em] uppercase">
          Cuéntanos del viaje
        </label>
        <textarea
          className={`${inputStyles} min-h-28 resize-y`}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Budget, vibe, must-sees, who is coming, first time or going back home"
        />
      </div>
      <div className="sm:col-span-2">
        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full border-2 border-ink bg-ink px-8 py-4 text-sm font-bold tracking-[0.25em] text-paper uppercase transition-colors hover:bg-azul hover:border-azul disabled:opacity-60 sm:w-auto"
        >
          {status === "loading" ? "Enviando…" : "Pedir mi cotización"}
        </button>
        {status === "error" && (
          <p className="mt-3 text-sm font-bold text-rojo">
            Something broke. Try again, or email us directly at{" "}
            <a className="underline" href={`mailto:${site.contactEmail}`}>
              {site.contactEmail}
            </a>
          </p>
        )}
        <p className="mt-3 text-xs text-ink-soft">
          A human answers within a day. No payment until you approve the final
          plan.
        </p>
      </div>
    </form>
  );
}
