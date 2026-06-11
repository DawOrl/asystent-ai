import Link from "next/link";
import { company } from "@/data/company";
import { formatPrice } from "@/lib/cn";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { DecodeText } from "@/components/ui/DecodeText";

export function Pricing() {
  return (
    <section id="cennik" className="relative">
      <div className="mx-auto max-w-[var(--container-content)] px-5 py-20 sm:px-8 md:py-28">
        <Reveal>
          <p className="eyebrow">{"// cennik"}</p>
          <h2 className="mt-4 max-w-2xl text-3xl font-semibold sm:text-4xl">
            <DecodeText text="Cennik orientacyjny" />
          </h2>
          <p className="mt-4 max-w-xl text-muted">
            Finalna wycena po krótkim briefie — możesz ją wygenerować od ręki.
            Ceny „od”, zależnie od zakresu i źródeł danych.
          </p>
        </Reveal>

        <RevealGroup className="mt-12 grid gap-4 sm:grid-cols-2" stagger={0.08}>
          {company.services.map((s) => (
            <RevealItem key={s.id}>
              <SpotlightCard className="flex h-full items-start justify-between gap-4 p-6">
                <div>
                  <h3 className="text-base font-semibold">{s.name}</h3>
                  <p className="mt-1 text-sm text-muted">{s.tagline}</p>
                </div>
                <span className="shrink-0 font-mono text-sm text-accent">
                  od {formatPrice(s.priceFrom)}
                </span>
              </SpotlightCard>
            </RevealItem>
          ))}
        </RevealGroup>

        {/* Zamykający CTA */}
        <Reveal className="mt-12">
          <SpotlightCard className="flex flex-col items-start justify-between gap-6 p-8 sm:flex-row sm:items-center">
            <div>
              <h3 className="text-2xl font-semibold">Gotowy na asystenta AI?</h3>
              <p className="mt-2 max-w-md text-sm text-muted">
                Wygeneruj ofertę w kilka sekund albo napisz — odeślę propozycję
                dopasowaną do Twojej firmy.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/oferta"
                className="btn-primary rounded-full px-6 py-3.5 text-center text-sm font-semibold"
              >
                Wygeneruj ofertę →
              </Link>
              <a
                href={`mailto:${company.contact.email}`}
                className="btn-ghost rounded-full px-6 py-3.5 text-center text-sm font-semibold"
              >
                Napisz do mnie
              </a>
            </div>
          </SpotlightCard>
        </Reveal>
      </div>
    </section>
  );
}
