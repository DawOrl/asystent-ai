/**
 * Limity demo — główne dźwignie kosztu i ochrony przed nadużyciem.
 * (Na Haiku 4.5 output ~5× droższy od inputu, więc cap outputu liczy się najbardziej.)
 */

/** Twardy limit długości odpowiedzi modelu (czat). */
export const MAX_OUTPUT_TOKENS = 600;

/** Twardy limit długości odpowiedzi modelu (oferta — dłuższy obiekt). */
export const MAX_OFFER_OUTPUT_TOKENS = 1500;

/** Maksymalna długość pojedynczej wiadomości wejściowej (znaki) — reject przed modelem. */
export const MAX_INPUT_CHARS = 1500;

/** Maksymalna liczba tur historii przekazywana do modelu (reszta ucinana). */
export const MAX_TURNS = 12;
