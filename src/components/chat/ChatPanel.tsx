"use client";

import { useEffect, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { cn } from "@/lib/cn";
import type { ScriptMessage } from "@/data/mock";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { AiDisclosure } from "./AiDisclosure";
import { ScriptedPreview } from "./ScriptedPreview";

const SUGGESTIONS = [
  "Ile kosztuje wdrożenie?",
  "Co potrafi asystent?",
  "Jak długo trwa wdrożenie?",
  "Czy klucz API jest bezpieczny?",
];

function TypingDots() {
  return (
    <div className="flex justify-start">
      <div className="glass flex items-center gap-1 rounded-2xl px-4 py-3">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-1.5 w-1.5 rounded-full bg-muted"
            style={{
              animation: "caret-blink 1s ease-in-out infinite",
              animationDelay: `${i * 0.18}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

export function ChatPanel({
  className,
  viewTransitionName,
  script,
}: {
  className?: string;
  viewTransitionName?: string;
  /** Gdy podany i brak wiadomości — odtwarza skryptowany podgląd („wow" w hero). */
  script?: ScriptMessage[];
}) {
  const [input, setInput] = useState("");
  const { messages, sendMessage, status, stop, error, regenerate } = useChat();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, status]);

  const send = (text: string) => {
    if (!text.trim()) return;
    sendMessage({ text });
    setInput("");
  };

  const isEmpty = messages.length === 0;

  return (
    <div
      className={cn("glass flex flex-col overflow-hidden rounded-2xl", className)}
      style={viewTransitionName ? { viewTransitionName } : undefined}
    >
      {/* Pasek statusu */}
      <div className="flex items-center gap-2 border-b border-stroke px-4 py-3">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-aurora-3 opacity-60" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-aurora-3" />
        </span>
        <span className="font-mono text-xs text-muted">asystent · online</span>
      </div>

      {/* Wiadomości */}
      <div
        ref={scrollRef}
        role="log"
        aria-live="polite"
        aria-label="Rozmowa z asystentem"
        className="flex min-h-64 flex-1 flex-col gap-3 overflow-y-auto p-4"
      >
        {isEmpty && script ? (
          <ScriptedPreview script={script} />
        ) : isEmpty ? (
          <div className="m-auto flex max-w-sm flex-col items-center gap-4 text-center">
            <p className="text-sm text-muted">
              Zapytaj asystenta o ofertę wdrożeń AI — odpowiada na żywo.
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => send(s)}
                  className="rounded-full border border-stroke px-3 py-1.5 text-xs text-fg transition-colors hover:border-accent/50 hover:text-accent"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((m) => <ChatMessage key={m.id} message={m} />)
        )}

        {status === "submitted" && <TypingDots />}

        {error && (
          <div className="flex flex-col items-start gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            <span>Coś poszło nie tak z odpowiedzią.</span>
            <button
              type="button"
              onClick={() => regenerate()}
              className="rounded-full border border-red-400/40 px-3 py-1 text-xs font-medium text-red-100 transition-colors hover:bg-red-500/20"
            >
              Ponów
            </button>
          </div>
        )}
      </div>

      {/* Input + nota */}
      <div className="space-y-2 border-t border-stroke p-4">
        <ChatInput
          value={input}
          onChange={setInput}
          onSubmit={() => send(input)}
          onStop={stop}
          status={status}
        />
        <AiDisclosure />
      </div>
    </div>
  );
}
