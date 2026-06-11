# Asystent AI dla firmy — plan rozbudowy

> Projekt demo do portfolio (`dorlowski.dev`, slug: `asystent-ai`).
> Cel: **eksponować wyróżnik AI** (Fullstack AI Developer) — pokazać praktyczne
> zastosowanie LLM w obsłudze klienta i automatyzacji.

## Kontekst (z case study)

- **Problem:** małe firmy tracą zapytania poza godzinami pracy i marnują czas na
  powtarzalne pytania (cennik, dostępność, zakres usług); ręczne ofertowanie jest
  wolne i niespójne.
- **Rozwiązanie:** aplikacja webowa z LLM — **chatbot Q&A** (odpowiada na bazie
  wiedzy o firmie 24/7) + **generator ofert** (z kilku pól tworzy spersonalizowaną
  propozycję).
- **Efekt:** natychmiastowe odpowiedzi o każdej porze, automatyzacja powtarzalnej
  pracy — namacalny pokaz wartości AI.

## Stack

Next.js (App Router) · React · TypeScript · Tailwind CSS · **OpenAI API**
(lub inny dostawca LLM) · Vercel AI SDK (streaming). Hosting: Vercel.

## Architektura

- **Klucz API tylko po stronie serwera** — Route Handler `app/api/chat/route.ts`
  (i `app/api/offer/route.ts`). Klucz w `.env.local` (`OPENAI_API_KEY`),
  **bez** `NEXT_PUBLIC_`. Front nigdy nie dotyka klucza.
- Streaming odpowiedzi (Vercel AI SDK `streamText` / `useChat`).
- „Baza wiedzy” firmy: na start prompt systemowy + plik z FAQ/ofertą;
  docelowo RAG (embeddingi + wyszukiwanie).

## Struktura / funkcje

1. **Landing** — wyjaśnienie wartości („AI odpowiada klientom 24/7”), demo CTA.
2. **Chatbot** (`/demo` lub widget) — okno czatu, streaming, kontekst firmy.
3. **Generator ofert** (`/oferta`) — formularz (branża, zakres, budżet) →
   wygenerowana oferta do skopiowania/pobrania (PDF opcjonalnie).
4. **Panel konfiguracji (opcjonalnie)** — wgranie FAQ/danych firmy.

## Etapy realizacji

- [x] **Etap 1 — fundament:** layout, klucz w env, route handler `/api/chat`,
      prosty prompt systemowy. _(+ provider-agnostic z trybem mock domyślnym,
      rate-limit, walidacja, design-system „Midnight Console")_
- [x] **Etap 2 — chatbot MVP:** UI czatu + streaming (Vercel AI SDK `useChat`),
      kontekst firmy w prompcie systemowym, stany ładowania/błędu, limit długości.
      _(+ hero ze skryptowym podglądem „na żywo", /demo)_
- [x] **Etap 3 — generator ofert:** formularz → `/api/offer` → strukturalna
      odpowiedź (`streamObject`/`useObject`); widok i eksport (kopiuj / PDF).
- [ ] **Etap 4 — wiedza (RAG, opcjonalnie):** embeddingi FAQ/oferty,
      wyszukiwanie kontekstu przed odpowiedzią. _(seam `retrieveContext()` gotowy)_
- [x] **Etap 5 — polish/bezpieczeństwo:** sekcje landingu (bento/jak-to-działa/cennik),
      SEO (OG/robots/sitemap), View Transitions, rate-limiting, walidacja, limity
      kosztów, RWD, czysty `next build`/lint. _(deploy na Vercel — gdy zechcesz)_

## Uwagi (bezpieczeństwo i koszty)

- Rate-limiting na endpointach (np. po IP) — ochrona przed nadużyciem klucza.
- Limit tokenów i długości promptu; cache częstych odpowiedzi.
- Komunikat, że to demo (świadomość, że odpowiada AI).

## Pomysły rozszerzeń

- Widget do osadzenia na dowolnej stronie klienta (`<script>` / iframe).
- Integracja z e-mailem/CRM (lead z czatu → skrzynka firmy).
- Wielojęzyczność, rozpoznawanie intencji, przekazanie do człowieka.

## Po wdrożeniu (powrót do portfolio)

1. Wrzuć na Vercel (klucz `OPENAI_API_KEY` w ustawieniach środowiska) → URL.
2. W `dorlowski.dev`: dodaj wpis do `scripts/shots.config.json`
   (`slug: "asystent-ai"`, `url`), uruchom `npm run shots asystent-ai`.
3. Uzupełnij `liveUrl`/`githubUrl` w `cv-data.ts` i usuń `draft: true`.
