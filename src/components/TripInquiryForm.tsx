"use client";

import { useState } from "react";
import { destinations, packages } from "@/data/destinations";
import { site } from "@/config/site";

export default function TripInquiryForm() {
  const [name, setName] = useState("");
  const [trip, setTrip] = useState("");
  const [travelers, setTravelers] = useState("2");
  const [dates, setDates] = useState("");
  const [notes, setNotes] = useState("");

  const options = [
    ...packages.map((p) => `Package: ${p.name}`),
    ...destinations.map((d) => `Destination: ${d.name}`),
    "Something custom",
  ];

  const subject = `Trip inquiry: ${trip || "Colombia"}`;
  const body = [
    `Hola Colombian Central,`,
    "",
    `Name: ${name || "(your name)"}`,
    `Trip: ${trip || "(not sure yet)"}`,
    `Travelers: ${travelers}`,
    `Rough dates: ${dates || "(flexible)"}`,
    "",
    "About the trip I want:",
    notes || "(tell us anything: budget, vibe, must-sees, who is coming)",
  ].join("\n");

  const mailto = `mailto:${site.contactEmail}?subject=${encodeURIComponent(
    subject,
  )}&body=${encodeURIComponent(body)}`;

  const inputStyles =
    "w-full border-2 border-ink/20 bg-paper px-4 py-3 text-sm font-medium outline-none placeholder:text-ink/40 focus:border-azul";

  return (
    <form
      className="grid gap-4 sm:grid-cols-2"
      onSubmit={(e) => {
        e.preventDefault();
        window.location.href = mailto;
      }}
    >
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
      <div>
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
          className="w-full border-2 border-ink bg-ink px-8 py-4 text-sm font-bold tracking-[0.25em] text-paper uppercase transition-colors hover:bg-azul hover:border-azul sm:w-auto"
        >
          Pedir mi cotización
        </button>
        <p className="mt-3 text-xs text-ink-soft">
          Opens a prefilled email to {site.contactEmail}. A human answers
          within a day. No payment until you approve the final plan.
        </p>
      </div>
    </form>
  );
}
