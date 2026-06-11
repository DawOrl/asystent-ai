/**
 * Tryb mock — DOMYŚLNE działanie dema bez klucza API.
 * Treści „canned" odtwarzane przez realny streaming (mock-model w lib/ai/provider.ts),
 * dzięki czemu strona działa po `git clone && npm run dev` bez żadnego klucza,
 * nigdy nie zwraca 500 i nie generuje kosztu.
 */

import { company } from "@/data/company";
import type { Offer } from "@/app/api/offer/schema";

/** Dobiera odpowiedź czatu po słowach kluczowych z ostatniej wiadomości użytkownika. */
export function mockChatReply(userText: string): string {
  const t = userText.toLowerCase();

  const has = (...words: string[]) => words.some((w) => t.includes(w));

  if (has("opini", "recenzj", "1★", "1 gwiazd", "gwiazdk", "negatyw"))
    return "Jasne. Przykładowa odpowiedź na opinię 1★: „Dzień dobry, bardzo nam przykro, że wizyta nie spełniła oczekiwań. Chcielibyśmy to naprawić — proszę o kontakt na ${email}, a my wyjaśnimy sprawę i zaproponujemy rozwiązanie. Dziękujemy za sygnał — pomaga nam być lepszymi.” Asystent może generować takie odpowiedzi automatycznie, w tonie Twojej marki.".replace(
      "${email}",
      company.contact.email
    );

  if (has("cen", "koszt", "ile", "płac", "budżet", "wycen"))
    return `Wycena zależy od zakresu. Orientacyjnie: chatbot od ${company.services[0].priceFrom} zł, generator ofert od ${company.services[1].priceFrom} zł, integracja LLM od ${company.services[2].priceFrom} zł. Po krótkim brief'ie przygotuję konkretną ofertę — możesz też skorzystać z generatora ofert na stronie.`;

  if (has("czas", "termin", "jak długo", "kiedy", "ile zajm"))
    return "Prosty chatbot Q&A lub generator ofert to zwykle 1–2 tygodnie. Integracje z RAG i automatyzacje — 2–4 tygodnie, zależnie od źródeł danych.";

  if (has("bezpiecz", "klucz", "dane", "rodo", "prywat"))
    return "Klucz API jest wyłącznie po stronie serwera — nigdy nie trafia do przeglądarki. Endpointy mają rate-limiting po IP, limity tokenów i walidację wejścia, więc koszty i nadużycia są pod kontrolą.";

  if (has("stack", "technolog", "next", "react", "jak to dział", "model"))
    return "Stack: Next.js (App Router), React, TypeScript, Tailwind i Vercel AI SDK ze streamingiem. Model LLM jest wymienny (Anthropic Claude / OpenAI). Wdrożenie na Vercel.";

  if (has("kontakt", "współprac", "zacząć", "napisz", "mail", "umów"))
    return `Najprościej: napisz na ${company.contact.email} albo wypełnij krótki brief w generatorze ofert na stronie — odeślę propozycję.`;

  if (has("co ofer", "co potraf", "usług", "zakres", "pomoż", "robisz"))
    return `Wdrażam asystentów AI dla małych firm: ${company.services
      .map((s) => s.name.toLowerCase())
      .join(
        ", "
      )}. Najczęściej zaczynamy od chatbota Q&A i generatora ofert. O co chciałbyś dopytać?`;

  return "Jestem asystentem AI (demo) prezentującym wdrożenia AI dla małych firm — chatbot Q&A i generator ofert. Zapytaj o zakres, cennik, czas wdrożenia albo bezpieczeństwo, a chętnie doprecyzuję.";
}

/** Wiadomość w skrypcie hero. */
export type ScriptMessage = {
  role: "user" | "assistant";
  text: string;
  /** opcjonalny „tool chip" pokazywany przed odpowiedzią asystenta */
  tool?: string;
  /** opcjonalna karta-wynik renderowana po odpowiedzi (np. wygenerowana treść) */
  card?: { title: string; body: string };
};

/**
 * Scenariusz auto-odtwarzany w hero („interfejs jest demem").
 * Renderowany przez ten sam komponent czatu, ale zasilany z timera.
 */
export const HERO_SCRIPT: ScriptMessage[] = [
  {
    role: "user",
    text: "Napisz odpowiedź na opinię 1★ od klienta.",
  },
  {
    role: "assistant",
    tool: "generuję_odpowiedź",
    text: "Dzień dobry, bardzo nam przykro, że wizyta nie spełniła oczekiwań. Chcielibyśmy to naprawić — proszę o kontakt, a wyjaśnimy sprawę i zaproponujemy rozwiązanie.",
    card: {
      title: "Wygenerowana odpowiedź",
      body: "Ton dopasowany do marki · gotowe do wklejenia · < 1 s",
    },
  },
];

/** Canned oferta — fallback generatora ofert bez klucza API. */
export const MOCK_OFFER: Offer = {
  title: `Asystent AI + generator ofert dla Twojej firmy`,
  summary:
    "Pakiet startowy wdrożenia AI: chatbot odpowiadający klientom 24/7 na bazie wiedzy o firmie oraz generator spersonalizowanych ofert. Bezpieczne (klucz po stronie serwera), wdrożone na Vercel, gotowe w 1–2 tygodnie.",
  lineItems: [
    {
      name: "Chatbot Q&A na bazie wiedzy",
      description:
        "Okno czatu ze streamingiem + prompt systemowy z FAQ/ofertą firmy. Odpowiada po polsku, 24/7.",
      price: company.services[0].priceFrom,
    },
    {
      name: "Generator ofert",
      description:
        "Formularz (branża, zakres, budżet) → spersonalizowana oferta do skopiowania lub pobrania.",
      price: company.services[1].priceFrom,
    },
    {
      name: "Wdrożenie, bezpieczeństwo i hosting",
      description:
        "Konfiguracja na Vercel, klucz API po stronie serwera, rate-limiting i limity kosztów.",
      price: 900,
    },
  ],
  totalPrice: company.services[0].priceFrom + company.services[1].priceFrom + 900,
  validUntil: "2026-07-31",
};
