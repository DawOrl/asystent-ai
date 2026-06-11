"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/cn";

/**
 * Strumień znaków (typewriter) z migającym kursorem.
 * SSR + pierwszy render: pełny tekst (dobre dla SEO/LCP, brak mismatchu).
 * prefers-reduced-motion → pełny tekst, bez animacji. aria-live="polite".
 */
export function Typewriter({
  text,
  speed = 28,
  startDelay = 0,
  className,
  caretClassName,
}: {
  text: string;
  /** ms na znak */
  speed?: number;
  /** opóźnienie startu (ms) */
  startDelay?: number;
  className?: string;
  caretClassName?: string;
}) {
  const reduce = useReducedMotion();
  // init = pełna długość → SSR/pierwszy paint pokazuje pełny tekst (SEO/LCP).
  const [count, setCount] = useState(text.length);

  useEffect(() => {
    if (reduce) return; // render i tak pokaże pełny tekst (gałąź `reduce` niżej)
    let i = 0;
    let interval: ReturnType<typeof setInterval>;
    // setState wyłącznie w callbacku timera (async) — nie w ciele efektu.
    const start = setTimeout(() => {
      setCount(0);
      interval = setInterval(() => {
        i += 1;
        setCount(i);
        if (i >= text.length) clearInterval(interval);
      }, speed);
    }, startDelay);
    return () => {
      clearTimeout(start);
      clearInterval(interval);
    };
  }, [text, speed, startDelay, reduce]);

  const shown = reduce ? text : text.slice(0, count);
  const done = reduce || count >= text.length;

  return (
    <span className={className} aria-live="polite">
      {shown}
      <span
        aria-hidden
        className={cn(
          "ml-0.5 inline-block w-[0.06em] self-stretch bg-current align-baseline",
          caretClassName
        )}
        style={{
          animation:
            done && !reduce ? "caret-blink 1.05s step-end infinite" : undefined,
          height: "1em",
          transform: "translateY(0.12em)",
        }}
      >
        &nbsp;
      </span>
    </span>
  );
}
