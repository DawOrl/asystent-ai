/**
 * Walidacja i guardy wejścia (wzorowane na isValid z restauracja-bella).
 * Uruchamiane PRZED jakimkolwiek wywołaniem modelu — ograniczają koszt i nadużycia.
 */

import type { UIMessage } from "ai";
import { MAX_INPUT_CHARS, MAX_TURNS } from "@/lib/ai/limits";

/** Łączy tekst z części wiadomości (v5: message.parts[]). */
function textOf(message: UIMessage | undefined): string {
  if (!message) return "";
  return message.parts
    .filter((p): p is { type: "text"; text: string } => p.type === "text")
    .map((p) => p.text)
    .join(" ")
    .trim();
}

/** Tekst ostatniej wiadomości użytkownika. */
export function lastUserText(messages: UIMessage[]): string {
  const last = [...messages].reverse().find((m) => m.role === "user");
  return textOf(last);
}

/** Czy wejście przekracza dozwoloną długość. */
export function isTooLong(text: string): boolean {
  return text.length > MAX_INPUT_CHARS;
}

/** Ucina historię do ostatnich MAX_TURNS wiadomości. */
export function trimHistory(messages: UIMessage[]): UIMessage[] {
  return messages.slice(-MAX_TURNS);
}

/** Walidacja krótkiego briefu generatora ofert + honeypot. */
export function validateBrief(input: {
  brief?: unknown;
  company?: unknown; // honeypot — ma być puste
}): { ok: true; brief: string } | { ok: false; error: string } {
  if (typeof input.company === "string" && input.company.length > 0)
    return { ok: false, error: "spam" }; // honeypot trafiony
  if (typeof input.brief !== "string" || input.brief.trim().length < 3)
    return { ok: false, error: "Opisz krótko, czego potrzebujesz." };
  if (input.brief.length > MAX_INPUT_CHARS)
    return { ok: false, error: "Brief jest za długi dla dema." };
  return { ok: true, brief: input.brief.trim() };
}
