/** Presety formularza generatora ofert — z nich składany jest brief dla modelu. */

export const branze = [
  "Kawiarnia / gastronomia",
  "Salon / uroda",
  "Sklep / e-commerce",
  "Usługi lokalne",
  "Inna",
] as const;

export const zakresy = [
  { id: "chatbot", label: "Chatbot Q&A 24/7" },
  { id: "oferty", label: "Generator ofert" },
  { id: "integracja", label: "Integracja z aplikacją (RAG)" },
  { id: "automatyzacje", label: "Automatyzacje / agenty" },
] as const;

export const budzety = [
  "do 3 000 zł",
  "3 000 – 6 000 zł",
  "6 000 – 12 000 zł",
  "powyżej 12 000 zł",
] as const;
