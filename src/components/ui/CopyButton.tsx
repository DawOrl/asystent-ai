"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";

/** Kopiuje tekst do schowka i pokazuje stan potwierdzenia. */
export function CopyButton({
  text,
  label = "Kopiuj",
  className,
}: {
  text: string;
  label?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className={cn(
        "btn-ghost rounded-full px-4 py-2 text-sm font-medium",
        className
      )}
    >
      {copied ? "Skopiowano ✓" : label}
    </button>
  );
}
