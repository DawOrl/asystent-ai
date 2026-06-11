"use client";

import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Karta z efektem „spotlight" — pod kursorem rozświetla się rozbłysk (radial glow)
 * w kolorze akcentu.
 *
 * Ważne: klasy układu (flex, gap, justify, p-*, mt-auto) z `className` trafiają na
 * WEWNĘTRZNY kontener z treścią (z-10), a glow jest pod nim (z-0) — dzięki temu
 * tekst i CTA układają się poprawnie i nic nie nachodzi na siebie.
 */
export function SpotlightCard({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      className="group glass relative h-full overflow-hidden rounded-2xl transition-colors hover:border-accent/30"
    >
      <span
        aria-hidden
        className="spotlight pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />
      <div className={cn("relative z-10 h-full", className)}>{children}</div>
    </div>
  );
}
