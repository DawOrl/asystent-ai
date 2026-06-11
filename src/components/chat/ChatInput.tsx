"use client";

import type { FormEvent } from "react";
import { cn } from "@/lib/cn";

type Status = "submitted" | "streaming" | "ready" | "error";

/** Kontrolowany input czatu + przycisk wyślij/stop (v5: input własny przez useState). */
export function ChatInput({
  value,
  onChange,
  onSubmit,
  onStop,
  status,
  placeholder = "Zapytaj o cennik, zakres, czas wdrożenia…",
}: {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  onStop: () => void;
  status: Status;
  placeholder?: string;
}) {
  const busy = status === "submitted" || status === "streaming";

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (busy || !value.trim()) return;
    onSubmit();
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label="Wiadomość do asystenta"
        className="min-w-0 flex-1 rounded-full border border-stroke bg-surface-glass px-4 py-3 text-sm text-fg placeholder:text-muted outline-none transition-colors focus:border-accent/60"
      />
      {busy ? (
        <button
          type="button"
          onClick={onStop}
          aria-label="Zatrzymaj"
          className="btn-ghost shrink-0 rounded-full px-4 py-3 text-sm font-medium"
        >
          Stop
        </button>
      ) : (
        <button
          type="submit"
          disabled={!value.trim()}
          aria-label="Wyślij"
          className={cn(
            "btn-primary shrink-0 rounded-full px-5 py-3 text-sm font-semibold",
            "disabled:cursor-not-allowed disabled:opacity-40"
          )}
        >
          Wyślij
        </button>
      )}
    </form>
  );
}
