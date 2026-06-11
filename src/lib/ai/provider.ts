/**
 * Abstrakcja dostawcy LLM — provider-agnostic z trybem `mock` jako DOMYŚLNYM.
 *
 * - `AI_PROVIDER=anthropic` + ANTHROPIC_API_KEY → Claude Haiku 4.5
 * - `AI_PROVIDER=openai`    + OPENAI_API_KEY    → tani model OpenAI
 * - inaczej (domyślnie)     → null → route używa mock-modelu (canned, $0, bez 500)
 *
 * Zamiana dostawcy = zmiana env. Reszta kodu route'a bez zmian.
 *
 * Mock implementujemy jako minimalny LanguageModelV2 (bez `ai/test`, które
 * ciągnęłoby do bundla test-deps msw/vitest), więc route używa tej samej
 * ścieżki `streamText(...).toUIMessageStreamResponse()`.
 */

import { anthropic } from "@ai-sdk/anthropic";
import { openai } from "@ai-sdk/openai";
import type { LanguageModel } from "ai";
import type {
  LanguageModelV2,
  LanguageModelV2StreamPart,
} from "@ai-sdk/provider";

export function getModel(): LanguageModel | null {
  const provider = process.env.AI_PROVIDER ?? "mock";

  if (provider === "anthropic" && process.env.ANTHROPIC_API_KEY) {
    // Najtańszy zdolny model (zweryfikowane: $1/$5 za 1M, 200K ctx, brak parametru `effort`).
    return anthropic("claude-haiku-4-5");
  }
  if (provider === "openai" && process.env.OPENAI_API_KEY) {
    return openai("gpt-4o-mini");
  }
  return null; // → mock
}

/** Czy działamy na realnym dostawcy (do informacji w UI). */
export function hasLiveProvider(): boolean {
  return getModel() !== null;
}

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Strumień części LanguageModelV2 z opóźnieniami — imituje streaming „na żywo". */
function timedStream(
  chunks: LanguageModelV2StreamPart[],
  { initialDelayInMs = 150, chunkDelayInMs = 16 } = {}
): ReadableStream<LanguageModelV2StreamPart> {
  return new ReadableStream({
    async start(controller) {
      await delay(initialDelayInMs);
      for (let i = 0; i < chunks.length; i++) {
        controller.enqueue(chunks[i]);
        if (i < chunks.length - 1) await delay(chunkDelayInMs);
      }
      controller.close();
    },
  });
}

/** Dzieli tekst na drobne fragmenty ([\s\S] łapie też nowe linie bez flagi dotAll). */
function chunkText(text: string): string[] {
  return text.match(/[\s\S]{1,3}/g) ?? [text];
}

/** Minimalny mock-model zgodny z LanguageModelV2 — streamuje zadany tekst. */
export function createMockModel(text: string): LanguageModelV2 {
  const id = "0";
  const usage = (() => {
    const n = chunkText(text).length;
    return { inputTokens: 0, outputTokens: n, totalTokens: n };
  })();

  return {
    specificationVersion: "v2",
    provider: "mock",
    modelId: "mock-canned",
    supportedUrls: {},
    async doGenerate() {
      return {
        content: [{ type: "text", text }],
        finishReason: "stop",
        usage,
        warnings: [],
      };
    },
    async doStream() {
      const deltas: LanguageModelV2StreamPart[] = chunkText(text).map(
        (delta) => ({ type: "text-delta", id, delta })
      );
      return {
        stream: timedStream([
          { type: "stream-start", warnings: [] },
          { type: "text-start", id },
          ...deltas,
          { type: "text-end", id },
          { type: "finish", finishReason: "stop", usage },
        ]),
      };
    },
  };
}
