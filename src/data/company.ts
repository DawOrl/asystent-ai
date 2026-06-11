/**
 * Asystent AI — jedno źródło prawdy o produkcie/marce.
 * Używane przez UI, metadane SEO, dane strukturalne schema.org,
 * prompt systemowy asystenta oraz presety generatora ofert.
 * Zmieniasz tutaj — zmienia się wszędzie.
 *
 * Persona (decyzja: „Twoje usługi AI"): asystent reprezentuje studio
 * Fullstack AI Developera i odpowiada o jego usługach wdrożeń AI.
 */

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://asystent-ai.vercel.app";

export type Service = {
  /** stabilny identyfikator (klucze, anchory) */
  id: string;
  name: string;
  /** jedno zdanie do bento/kart */
  tagline: string;
  /** dłuższy opis do FAQ i ofert */
  description: string;
  /** orientacyjna cena „od" w PLN (do ofert i cennika) */
  priceFrom: number;
};

export const company = {
  name: "Asystent AI",
  /** autor / wykonawca (Fullstack AI Developer) */
  author: "Dawid Orłowski",
  role: "Fullstack AI Developer",
  tagline: "Twój asystent. Pisze, liczy, odpowiada — na żywo.",
  /** zdanie pod hero */
  heroLead: "Asystent AI dla małych firm. Po polsku. Bez kodu.",

  shortDescription:
    "Wdrażam asystentów AI dla małych firm — chatbot odpowiadający klientom 24/7 na bazie wiedzy o firmie oraz generator spersonalizowanych ofert. Klucz API po stronie serwera, streaming, hosting na Vercel.",
  longDescription:
    "Asystent AI to praktyczne wdrożenia LLM dla małych i średnich firm: czatbot Q&A na bazie wiedzy o firmie, generator ofert z kilku pól, integracje z istniejącą aplikacją (API, RAG, embeddingi) oraz automatyzacje i agenty. Projektuję z myślą o bezpieczeństwie (klucz tylko po stronie serwera, rate-limiting, limity kosztów) i wdrażam na Vercel.",

  currency: "PLN",
  /** orientacyjny przedział cen wdrożeń */
  priceRange: "1 900 – 12 000 zł",

  contact: {
    email: "kontakt@dorlowski.dev",
    /** kanał preferowany */
    preferred: "e-mail",
  },

  social: {
    github: "https://github.com/DawOrl",
    githubHandle: "@DawOrl",
    portfolio: "https://dorlowski.dev",
  },

  /** katalog usług — zasila bento „Co potrafi", FAQ i presety ofert */
  services: [
    {
      id: "chatbot",
      name: "Chatbot / asystent obsługi klienta",
      tagline: "Odpowiada klientom 24/7 na bazie wiedzy o firmie.",
      description:
        "Okno czatu ze streamingiem, osadzone na stronie lub jako widget. Odpowiada na pytania o cennik, dostępność i zakres usług na podstawie dostarczonej bazy wiedzy (FAQ/oferta), o każdej porze.",
      priceFrom: 1900,
    },
    {
      id: "oferty",
      name: "Generator ofert i treści",
      tagline: "Z kilku pól tworzy spersonalizowaną ofertę.",
      description:
        "Formularz (branża, zakres, budżet) zamieniany w gotową, spójną propozycję do skopiowania lub pobrania. Automatyzuje powtarzalne ofertowanie i utrzymuje jeden ton komunikacji.",
      priceFrom: 2400,
    },
    {
      id: "integracje",
      name: "Integracja LLM z aplikacją",
      tagline: "API, RAG, embeddingi — w Twoim produkcie.",
      description:
        "Podłączenie modelu do istniejącej aplikacji: wyszukiwanie po bazie wiedzy (RAG), rozpoznawanie intencji, strukturalne odpowiedzi. Klucz API trzymany wyłącznie po stronie serwera.",
      priceFrom: 4500,
    },
    {
      id: "automatyzacje",
      name: "Automatyzacje i agenty AI",
      tagline: "Lead z czatu → skrzynka. Workflow bez klikania.",
      description:
        "Agenty łączące LLM z e-mailem/CRM i powtarzalnymi procesami: przekazanie leada do człowieka, podsumowania, kwalifikacja zapytań, wielojęzyczność.",
      priceFrom: 3600,
    },
  ] satisfies Service[],

  /** publiczny URL wdrożenia (Vercel) — do metadata/OG/sitemap/schema */
  siteUrl,
} as const;

export type Company = typeof company;
