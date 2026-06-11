"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { EASE } from "@/lib/motion";
import type { ScriptMessage } from "@/data/mock";
import { Bubble, ToolChip, ResultCard } from "./ChatMessage";

type Item =
  | { kind: "user"; text: string }
  | { kind: "tool"; label: string; done: boolean }
  | { kind: "assistant"; text: string }
  | { kind: "card"; title: string; body: string };

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Pełna, statyczna lista (dla prefers-reduced-motion — bez animacji i setState). */
function buildFullItems(script: ScriptMessage[]): Item[] {
  const all: Item[] = [];
  for (const m of script) {
    if (m.role === "user") {
      all.push({ kind: "user", text: m.text });
    } else {
      if (m.tool) all.push({ kind: "tool", label: m.tool, done: true });
      all.push({ kind: "assistant", text: m.text });
      if (m.card)
        all.push({ kind: "card", title: m.card.title, body: m.card.body });
    }
  }
  return all;
}

/**
 * Auto-odtwarzany, skryptowany podgląd rozmowy („interfejs jest demem").
 * Czysto prezentacyjny — pokazuje produkt w działaniu, zanim użytkownik napisze.
 * prefers-reduced-motion → cała rozmowa od razu, bez animacji.
 */
export function ScriptedPreview({ script }: { script: ScriptMessage[] }) {
  const reduce = useReducedMotion();
  const [items, setItems] = useState<Item[]>([]);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    if (reduce) return; // statyczna lista renderowana niżej, bez setState
    let cancelled = false;

    async function run() {
      for (const m of script) {
        if (cancelled) return;
        if (m.role === "user") {
          await wait(600);
          if (cancelled) return;
          setItems((p) => [...p, { kind: "user", text: m.text }]);
          await wait(800);
          continue;
        }
        // assistant
        if (m.tool) {
          setItems((p) => [...p, { kind: "tool", label: m.tool!, done: false }]);
          await wait(950);
          if (cancelled) return;
          setItems((p) =>
            p.map((it, i) =>
              i === p.length - 1 && it.kind === "tool"
                ? { ...it, done: true }
                : it
            )
          );
          await wait(450);
        }
        // streaming tekstu asystenta
        for (let i = 1; i <= m.text.length; i++) {
          if (cancelled) return;
          setActive(m.text.slice(0, i));
          await wait(16);
        }
        if (cancelled) return;
        setItems((p) => [...p, { kind: "assistant", text: m.text }]);
        setActive(null);
        await wait(350);
        if (m.card) {
          const card = m.card; // narrowing nie przechodzi do callbacka — przechwyć do const
          setItems((p) => [
            ...p,
            { kind: "card", title: card.title, body: card.body },
          ]);
          await wait(700);
        }
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [script, reduce]);

  const spring = { type: "spring" as const, stiffness: 240, damping: 26 };
  const list = reduce ? buildFullItems(script) : items;

  return (
    <div className="flex flex-col gap-3">
      {list.map((it, idx) => {
        if (it.kind === "user")
          return (
            <motion.div
              key={idx}
              initial={reduce ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={spring}
            >
              <Bubble role="user">{it.text}</Bubble>
            </motion.div>
          );
        if (it.kind === "tool")
          return (
            <motion.div
              key={idx}
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <ToolChip label={it.label} done={it.done} />
            </motion.div>
          );
        if (it.kind === "assistant")
          return (
            <motion.div
              key={idx}
              initial={reduce ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={spring}
            >
              <Bubble role="assistant">
                <span className="whitespace-pre-wrap">{it.text}</span>
              </Bubble>
            </motion.div>
          );
        return (
          <motion.div
            key={idx}
            initial={reduce ? false : { opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ ...spring, duration: reduce ? 0 : undefined, ease: EASE }}
          >
            <ResultCard title={it.title} body={it.body} />
          </motion.div>
        );
      })}

      {/* aktywny strumień (tekst asystenta w trakcie pisania) */}
      {active !== null && (
        <Bubble role="assistant">
          <span className="whitespace-pre-wrap">{active}</span>
          <span
            aria-hidden
            className="ml-0.5 inline-block h-[1em] w-0.5 translate-y-[0.12em] bg-accent"
          />
        </Bubble>
      )}
    </div>
  );
}
