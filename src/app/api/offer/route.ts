import { streamObject } from "ai";
import { getModel, createMockModel } from "@/lib/ai/provider";
import { offerSchema } from "./schema";
import { MAX_OFFER_OUTPUT_TOKENS } from "@/lib/ai/limits";
import { rateLimit, clientIp } from "@/lib/ratelimit";
import { validateBrief } from "@/lib/validate";
import { MOCK_OFFER } from "@/data/mock";

export const maxDuration = 30;

export async function POST(req: Request) {
  // 1) rate-limit po IP
  if (!rateLimit(clientIp(req))) {
    return Response.json(
      { error: "Zbyt wiele zapytań. Zwolnij na chwilę." },
      { status: 429, headers: { "Retry-After": "60" } }
    );
  }

  // 2) parsowanie + walidacja briefu (+ honeypot)
  let body: { brief?: unknown; company?: unknown };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return Response.json({ error: "Nieprawidłowe żądanie." }, { status: 400 });
  }

  const v = validateBrief(body);
  if (!v.ok && v.error !== "spam") {
    return Response.json({ error: v.error }, { status: 422 });
  }

  // 3) model realny albo mock (spam/honeypot → zawsze mock; canned, $0)
  const brief = v.ok ? v.brief : "";
  const model =
    (v.ok ? getModel() : null) ??
    createMockModel(JSON.stringify(MOCK_OFFER));

  const result = streamObject({
    model,
    schema: offerSchema,
    schemaName: "Offer",
    schemaDescription: "Oferta handlowa wdrożenia AI dla małej firmy",
    system:
      "Tworzysz realistyczne, przekonujące oferty wdrożeń AI dla małych firm. Pisz po polsku. Ceny w PLN, realistyczne. 3–5 pozycji.",
    prompt: `Wygeneruj ofertę wdrożenia AI na podstawie briefu klienta:\n${brief}`,
    temperature: 0.6,
    maxOutputTokens: MAX_OFFER_OUTPUT_TOKENS,
  });

  // toTextStreamResponse — strumień częściowego JSON pod experimental_useObject
  return result.toTextStreamResponse();
}
