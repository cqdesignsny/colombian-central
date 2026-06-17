"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import TricolorBar from "@/components/TricolorBar";

type Msg = { role: "user" | "assistant"; content: string };

const WELCOME: Msg = {
  role: "assistant",
  content:
    "¡Quiubo pues, parce! Soy El Paisa, your Colombian guide y su servidor. Pregúnteme lo que sea: el Mundial, la música, la comida, viajes, lo que se le antoje. ¿Bien o qué? Hágale.",
};

const SUGGESTIONS = [
  "Cuando juega Colombia?",
  "Recomiendame musica",
  "Donde como bandeja paisa?",
  "Plan a trip to Colombia",
];

export default function ElPaisaChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  // Let anything on the page open the chat (for example the homepage mascot CTA).
  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener("paisa:open", handler);
    return () => window.removeEventListener("paisa:open", handler);
  }, []);

  async function send(text: string) {
    const content = text.trim();
    if (!content || loading) return;
    setInput("");
    const history = [...messages, { role: "user", content } as Msg];
    setMessages([...history, { role: "assistant", content: "" }]);
    setLoading(true);
    try {
      const res = await fetch("/api/paisa/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });
      if (!res.ok || !res.body) throw new Error("bad response");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const copy = [...prev];
          copy[copy.length - 1] = { role: "assistant", content: acc };
          return copy;
        });
      }
      if (!acc.trim()) throw new Error("empty");
    } catch {
      setMessages((prev) => {
        const copy = [...prev];
        copy[copy.length - 1] = {
          role: "assistant",
          content: "Uy, se me fue la senal. Intenta de nuevo en un momento.",
        };
        return copy;
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Launcher */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Abrir el chat de El Paisa"
        className="fixed right-4 bottom-4 z-40 flex items-center gap-2 border-2 border-ink bg-amarillo py-1.5 pr-4 pl-1.5 shadow-[4px_4px_0_0_var(--color-ink)] transition-transform hover:-translate-y-0.5 sm:right-5 sm:bottom-5"
      >
        <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border-2 border-ink bg-crema">
          <Image
            src="/images/paisa/el-paisa.png"
            alt="El Paisa"
            fill
            sizes="40px"
            className="origin-top scale-[1.55] object-cover object-top"
          />
        </span>
        <span className="text-sm font-bold tracking-[0.12em] text-ink uppercase">
          Pregúntale a El Paisa
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            className="fixed right-4 bottom-4 z-50 flex h-[min(34rem,80vh)] w-[min(23rem,calc(100vw-2rem))] flex-col border-2 border-ink bg-paper shadow-[6px_6px_0_0_var(--color-ink)] sm:right-5 sm:bottom-5"
          >
            {/* Header */}
            <div className="flex items-center gap-3 bg-ink px-4 py-3 text-paper">
              <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full border-2 border-amarillo bg-crema">
                <Image
                  src="/images/paisa/el-paisa.png"
                  alt="El Paisa"
                  fill
                  sizes="44px"
                  className="origin-top scale-[1.55] object-cover object-top"
                />
              </span>
              <div className="flex-1">
                <p className="font-display text-lg leading-none uppercase">El Paisa</p>
                <p className="mt-0.5 text-[11px] text-paper/60">
                  <span className="mr-1 inline-block h-2 w-2 rounded-full bg-amarillo align-middle" />
                  Tu pana colombiano
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Cerrar"
                className="px-1 text-lg text-paper/70 hover:text-paper"
              >
                ✕
              </button>
            </div>
            <TricolorBar className="h-1" />

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
              {messages.map((m, i) => (
                <div key={i} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
                  <div
                    className={`max-w-[85%] border-2 border-ink px-3 py-2 text-sm whitespace-pre-wrap ${
                      m.role === "user" ? "bg-azul text-paper" : "bg-crema text-ink"
                    }`}
                  >
                    {m.content || <span className="text-ink-soft">El Paisa está escribiendo…</span>}
                  </div>
                </div>
              ))}

              {messages.length === 1 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      className="border border-ink/30 px-2 py-1 text-xs text-ink-soft transition-colors hover:border-ink hover:bg-amarillo hover:text-ink"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="flex gap-2 border-t-2 border-ink p-3"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Escríbele a El Paisa..."
                aria-label="Mensaje"
                className="min-w-0 flex-1 border-2 border-ink bg-paper px-3 py-2 text-sm focus:ring-2 focus:ring-amarillo focus:outline-none"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                aria-label="Enviar"
                className="border-2 border-ink bg-amarillo px-4 py-2 text-sm font-bold text-ink uppercase transition-transform hover:-translate-y-0.5 disabled:opacity-40 disabled:hover:translate-y-0"
              >
                →
              </button>
            </form>
            <p className="pb-2 text-center text-[10px] text-ink-soft/60">
              El Paisa es un asistente de IA. Puede equivocarse.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
