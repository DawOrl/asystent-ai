import { streamText, convertToModelMessages, type UIMessage } from "ai";
import { getModel, createMockModel } from "@/lib/ai/provider";
import { SYSTEM_PROMPT } from "@/data/knowledge";
import { MAX_OUTPUT_TOKENS } from "@/lib/ai/limits";
import { lastUserText, isTooLong, trimHistory } from "@/lib/validate";
import { rateLimit, clientIp } from "@/lib/ratelimit";
import { mockChatReply } from "@/data/mock";

// Budżet streamingu (runtime Node — default Next 16).
export const maxDuration = 30;

export async function POST(req: Request) {
  // 1) rate-limit po IP (ochrona klucza/kosztów)
  if (!rateLimit(clientIp(req))) {
    return Response.json(
      { error: "Zbyt wiele zapytań. Zwolnij na chwilę." },
      { status: 429, headers: { "Retry-After": "60" } }
    );
  }

  // 2) parsowanie + walidacja wejścia PRZED modelem
  let messages: UIMessage[];
  try {
    const body = (await req.json()) as { messages?: UIMessage[] };
    messages = body.messages ?? [];
  } catch {
    return Response.json({ error: "Nieprawidłowe żądanie." }, { status: 400 });
  }
  if (!Array.isArray(messages) || messages.length === 0) {
    return Response.json({ error: "Brak wiadomości." }, { status: 400 });
  }

  const text = lastUserText(messages);
  if (isTooLong(text)) {
    return Response.json(
      { error: "Wiadomość za długa dla dema." },
      { status: 400 }
    );
  }

  // 3) model realny albo mock (canned, $0, nigdy 500) — ta sama ścieżka streamText
  const trimmed = trimHistory(messages);
  const model = getModel() ?? createMockModel(mockChatReply(text));

  const result = streamText({
    model,
    system: SYSTEM_PROMPT,
    messages: convertToModelMessages(trimmed),
    temperature: 0.5,
    maxOutputTokens: MAX_OUTPUT_TOKENS,
  });

  return result.toUIMessageStreamResponse({
    onError: () =>
      "Przepraszam, chwilowy problem z odpowiedzią. Spróbuj ponownie za chwilę.",
  });
}
