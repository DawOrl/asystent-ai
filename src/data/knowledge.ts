/**
 * Baza wiedzy zasilająca prompt systemowy czatu.
 * Start: prompt + FAQ (zgodnie z PLAN.md). RAG to opcja na później —
 * `retrieveContext()` jest zaślepką (seam), więc miejsce wywołania w
 * route handlerze nie zmieni się po dodaniu embeddingów (Etap 4).
 */

import { company } from "@/data/company";

export type FaqEntry = {
  q: string;
  a: string;
};

export const faq: FaqEntry[] = [
  {
    q: "Co dokładnie oferujecie?",
    a: `${company.name} to wdrożenia AI dla małych firm: ${company.services
      .map((s) => s.name.toLowerCase())
      .join(", ")}. Najczęściej zaczynamy od chatbota Q&A i generatora ofert.`,
  },
  {
    q: "Ile to kosztuje?",
    a: `Wycena zależy od zakresu. Orientacyjnie: chatbot od ${company.services[0].priceFrom} zł, generator ofert od ${company.services[1].priceFrom} zł, integracja LLM od ${company.services[2].priceFrom} zł. Dokładną ofertę przygotuję po krótkim brief'ie — możesz użyć generatora ofert na stronie.`,
  },
  {
    q: "Jak długo trwa wdrożenie?",
    a: "Prosty chatbot Q&A lub generator ofert to zwykle 1–2 tygodnie. Integracje z RAG i automatyzacje — 2–4 tygodnie, zależnie od źródeł danych.",
  },
  {
    q: "Na jakim stacku to działa?",
    a: "Next.js (App Router), React, TypeScript, Tailwind, Vercel AI SDK ze streamingiem. Model LLM jest wymienny (Anthropic Claude / OpenAI). Hosting na Vercel.",
  },
  {
    q: "Czy to bezpieczne? Gdzie jest klucz API?",
    a: "Klucz API trzymany jest wyłącznie po stronie serwera (route handler), nigdy w przeglądarce. Endpointy mają rate-limiting po IP, limity tokenów i walidację wejścia, żeby kontrolować koszty i chronić przed nadużyciem.",
  },
  {
    q: "Czy odpowiada po polsku?",
    a: "Tak, domyślnie po polsku. Możliwa jest też wielojęzyczność i przekazanie rozmowy do człowieka.",
  },
  {
    q: "Jak zacząć współpracę?",
    a: `Najprościej: napisz na ${company.contact.email} albo wypełnij krótki brief w generatorze ofert na stronie — odeślę propozycję.`,
  },
];

/** Seam pod RAG — dziś zwraca całe FAQ; w Etapie 4 podmienisz na wyszukiwanie. */
export function retrieveContext(query: string): FaqEntry[] {
  void query; // RAG-seam: zapytanie zignorowane do czasu wdrożenia embeddingów
  return faq;
}

/** Buduje prompt systemowy z persony + zasad + kontekstu (FAQ). */
export function buildSystemPrompt(query = ""): string {
  const context = retrieveContext(query)
    .map((f) => `P: ${f.q}\nO: ${f.a}`)
    .join("\n\n");

  return [
    `Jesteś asystentem AI na stronie ${company.author} (${company.role}).`,
    `Twoim zadaniem jest pomagać odwiedzającym zrozumieć ofertę wdrożeń AI dla małych firm i zachęcać do kontaktu.`,
    ``,
    `Zasady:`,
    `- Odpowiadaj po polsku, zwięźle i konkretnie (zwykle 2–5 zdań).`,
    `- Trzymaj się tematu: usługi AI, wdrożenia, cennik orientacyjny, proces, kontakt.`,
    `- Jeśli pytanie jest poza tematem, grzecznie sprowadź rozmowę do oferty AI.`,
    `- Jeśli wprost zapytają, kim jesteś — powiedz, że jesteś asystentem AI (demo).`,
    `- Nie wymyślaj dokładnych cen ani zobowiązań; podawaj widełki „od" i odsyłaj do indywidualnej wyceny/kontaktu.`,
    `- Gdy ktoś chce ofertę, zaproponuj generator ofert na stronie lub kontakt: ${company.contact.email}.`,
    ``,
    `Wiedza o ofercie (użyj jej w odpowiedziach):`,
    context,
  ].join("\n");
}

/** Statyczny prompt bazowy (gdy nie potrzeba kontekstu zależnego od zapytania). */
export const SYSTEM_PROMPT = buildSystemPrompt();
