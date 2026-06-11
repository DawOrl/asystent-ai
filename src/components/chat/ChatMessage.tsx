import type { ReactNode } from "react";
import type { UIMessage } from "ai";
import { cn } from "@/lib/cn";

/** Bąbelek czatu — wspólny dla trybu live (useChat) i skryptu hero. */
export function Bubble({
  role,
  children,
  className,
}: {
  role: "user" | "assistant";
  children: ReactNode;
  className?: string;
}) {
  const isUser = role === "user";
  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
          isUser
            ? "border border-accent/30 bg-accent/15 text-fg"
            : "glass text-fg",
          className
        )}
      >
        {children}
      </div>
    </div>
  );
}

/** Mono „tool chip" — sygnalizuje wywołanie narzędzia (np. generowanie treści). */
export function ToolChip({
  label,
  done = false,
}: {
  label: string;
  done?: boolean;
}) {
  return (
    <div className="flex justify-start">
      <span className="inline-flex items-center gap-1.5 rounded-full border border-stroke bg-surface-glass px-2.5 py-1 font-mono text-xs text-muted">
        <span className="text-accent">⌜tool⌝</span> {label}{" "}
        {done && <span className="text-aurora-3">✓</span>}
      </span>
    </div>
  );
}

/** Karta-wynik (np. wygenerowana odpowiedź) — spring-in obsłużony przez rodzica. */
export function ResultCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="glass rounded-xl p-3">
      <p className="font-mono text-xs text-accent">✦ {title}</p>
      <p className="mt-1 text-sm text-muted">{body}</p>
    </div>
  );
}

/** Renderuje wiadomość useChat (v5: message.parts[]) jako bąbelek. */
export function ChatMessage({ message }: { message: UIMessage }) {
  if (message.role !== "user" && message.role !== "assistant") return null;

  const text = message.parts
    .filter((p): p is { type: "text"; text: string } => p.type === "text")
    .map((p) => p.text)
    .join("");

  if (!text) return null;

  return (
    <Bubble role={message.role}>
      <span className="whitespace-pre-wrap">{text}</span>
    </Bubble>
  );
}
