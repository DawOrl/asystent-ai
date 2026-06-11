"use client";

import { useState } from "react";
import { experimental_useObject as useObject } from "@ai-sdk/react";
import { motion } from "framer-motion";
import { offerSchema, type Offer } from "@/app/api/offer/schema";
import { branze, zakresy, budzety } from "@/data/offer";
import { cn, formatPrice } from "@/lib/cn";
import { EASE } from "@/lib/motion";
import { CopyButton } from "@/components/ui/CopyButton";
import { AiDisclosure } from "@/components/chat/AiDisclosure";

function offerToText(o: Offer): string {
  return [
    o.title,
    "",
    o.summary,
    "",
    ...o.lineItems.map(
      (li) => `• ${li.name} — ${formatPrice(li.price)}\n  ${li.description}`
    ),
    "",
    `Razem: ${formatPrice(o.totalPrice)}`,
    `Oferta ważna do: ${o.validUntil}`,
  ].join("\n");
}

function printOffer(o: Offer) {
  const w = window.open("", "_blank", "width=720,height=900");
  if (!w) return;
  const rows = o.lineItems
    .map(
      (li) =>
        `<tr><td style="padding:8px 0"><strong>${li.name}</strong><br><span style="color:#555">${li.description}</span></td><td style="text-align:right;white-space:nowrap;padding:8px 0">${formatPrice(
          li.price
        )}</td></tr>`
    )
    .join("");
  w.document.write(
    `<!doctype html><html lang="pl"><head><meta charset="utf-8"><title>${o.title}</title></head>
     <body style="font-family:system-ui,sans-serif;max-width:640px;margin:40px auto;color:#111;line-height:1.5">
       <h1 style="font-size:22px;margin:0 0 8px">${o.title}</h1>
       <p style="color:#444">${o.summary}</p>
       <table style="width:100%;border-collapse:collapse;margin:16px 0;border-top:1px solid #ddd">${rows}</table>
       <p style="text-align:right;font-size:18px"><strong>Razem: ${formatPrice(
         o.totalPrice
       )}</strong></p>
       <p style="color:#777;font-size:13px">Oferta ważna do: ${o.validUntil}</p>
     </body></html>`
  );
  w.document.close();
  w.focus();
  w.print();
}

export function OfferGenerator() {
  const [branza, setBranza] = useState<string>(branze[0]);
  const [selected, setSelected] = useState<string[]>(["chatbot", "oferty"]);
  const [budzet, setBudzet] = useState<string>(budzety[1]);
  const [notes, setNotes] = useState("");
  const [hp, setHp] = useState(""); // honeypot

  const { object, submit, isLoading, stop, error } = useObject({
    api: "/api/offer",
    schema: offerSchema,
  });

  const toggle = (id: string) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isLoading) return;
    const labels = zakresy
      .filter((z) => selected.includes(z.id))
      .map((z) => z.label);
    const brief = [
      `Branża: ${branza}.`,
      labels.length ? `Zakres: ${labels.join(", ")}.` : "",
      `Budżet: ${budzet}.`,
      notes.trim() ? `Dodatkowo: ${notes.trim()}` : "",
    ]
      .filter(Boolean)
      .join(" ");
    submit({ brief, company: hp });
  }

  const complete = !isLoading && !!object?.title && !!object?.totalPrice;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Formularz */}
      <form onSubmit={handleSubmit} className="glass space-y-5 rounded-2xl p-6">
        <div aria-hidden className="sr-only">
          <label>
            Nie wypełniaj
            <input
              tabIndex={-1}
              autoComplete="off"
              value={hp}
              onChange={(e) => setHp(e.target.value)}
            />
          </label>
        </div>

        <Field label="Branża">
          <select
            value={branza}
            onChange={(e) => setBranza(e.target.value)}
            className="w-full rounded-lg border border-stroke bg-surface-glass px-4 py-3 text-sm text-fg outline-none focus:border-accent/60"
          >
            {branze.map((b) => (
              <option key={b} value={b} className="bg-canvas text-fg">
                {b}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Zakres (zaznacz, co potrzebne)">
          <div className="flex flex-wrap gap-2">
            {zakresy.map((z) => {
              const on = selected.includes(z.id);
              return (
                <button
                  key={z.id}
                  type="button"
                  onClick={() => toggle(z.id)}
                  aria-pressed={on}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-xs transition-colors",
                    on
                      ? "border-accent/50 bg-accent/15 text-accent"
                      : "border-stroke text-fg hover:border-accent/40"
                  )}
                >
                  {z.label}
                </button>
              );
            })}
          </div>
        </Field>

        <Field label="Budżet">
          <select
            value={budzet}
            onChange={(e) => setBudzet(e.target.value)}
            className="w-full rounded-lg border border-stroke bg-surface-glass px-4 py-3 text-sm text-fg outline-none focus:border-accent/60"
          >
            {budzety.map((b) => (
              <option key={b} value={b} className="bg-canvas text-fg">
                {b}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Dodatkowe info (opcjonalnie)">
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Np. mam już stronę na WordPress, chcę widget na podstronie kontakt…"
            className="w-full resize-none rounded-lg border border-stroke bg-surface-glass px-4 py-3 text-sm text-fg placeholder:text-muted outline-none focus:border-accent/60"
          />
        </Field>

        {isLoading ? (
          <button
            type="button"
            onClick={() => stop()}
            className="btn-ghost w-full rounded-full px-6 py-3.5 text-sm font-semibold"
          >
            Zatrzymaj
          </button>
        ) : (
          <button
            type="submit"
            className="btn-primary w-full rounded-full px-6 py-3.5 text-sm font-semibold"
          >
            Wygeneruj ofertę
          </button>
        )}
        <AiDisclosure />
      </form>

      {/* Wynik (strumień) */}
      <div className="glass min-h-[20rem] rounded-2xl p-6">
        {!object && !isLoading ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-center text-sm text-muted">
            <p className="font-mono text-accent">✦</p>
            <p>Wypełnij formularz i wygeneruj ofertę — pojawi się tutaj na żywo.</p>
          </div>
        ) : error ? (
          <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            Coś poszło nie tak. Spróbuj ponownie.
          </p>
        ) : (
          <div className="space-y-5">
            <div>
              <p className="font-mono text-xs text-accent">✦ wygenerowana oferta</p>
              <h3 className="mt-2 text-xl font-semibold">
                {object?.title ?? "…"}
              </h3>
              {object?.summary && (
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {object.summary}
                </p>
              )}
            </div>

            <ul className="space-y-3">
              {object?.lineItems?.map((li, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: EASE }}
                  className="flex items-start justify-between gap-4 border-b border-stroke pb-3"
                >
                  <div>
                    <p className="text-sm font-medium text-fg">{li?.name}</p>
                    <p className="text-xs text-muted">{li?.description}</p>
                  </div>
                  <p className="shrink-0 font-mono text-sm text-fg">
                    {typeof li?.price === "number" ? formatPrice(li.price) : ""}
                  </p>
                </motion.li>
              ))}
            </ul>

            {typeof object?.totalPrice === "number" && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted">Razem</span>
                <span className="text-lg font-semibold text-accent">
                  {formatPrice(object.totalPrice)}
                </span>
              </div>
            )}

            {object?.validUntil && (
              <p className="text-xs text-muted">
                Oferta ważna do: {object.validUntil}
              </p>
            )}

            {complete && (
              <div className="flex flex-wrap gap-3 pt-2">
                <CopyButton text={offerToText(object as Offer)} label="Kopiuj ofertę" />
                <button
                  type="button"
                  onClick={() => printOffer(object as Offer)}
                  className="btn-ghost rounded-full px-4 py-2 text-sm font-medium"
                >
                  Zapisz jako PDF
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-fg">{label}</label>
      {children}
    </div>
  );
}
