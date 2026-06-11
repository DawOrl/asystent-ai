import { z } from "zod";

/** Schemat oferty — współdzielony przez serwer (streamObject) i klient (useObject). */
export const offerSchema = z.object({
  title: z.string().describe("Krótka, chwytliwa nazwa oferty"),
  summary: z.string().describe("Akapit-pitch: 2–3 zdania, po polsku"),
  lineItems: z
    .array(
      z.object({
        name: z.string().describe("Nazwa pozycji"),
        description: z.string().describe("Krótki opis zakresu pozycji"),
        price: z.number().describe("Cena w PLN (liczba)"),
      })
    )
    .describe("Pozycje oferty (3–5)"),
  totalPrice: z.number().describe("Suma wszystkich pozycji w PLN"),
  validUntil: z.string().describe("Data ważności oferty w formacie ISO, np. 2026-07-31"),
});

export type Offer = z.infer<typeof offerSchema>;
