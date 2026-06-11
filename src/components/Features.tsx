import Link from "next/link";
import { company } from "@/data/company";
import { formatPrice } from "@/lib/cn";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { DecodeText } from "@/components/ui/DecodeText";

const glyph: Record<string, string> = {
  chatbot: "◎",
  oferty: "▦",
  integracje: "⧉",
  automatyzacje: "⚙",
};

export function Features() {
  return (
    <section id="mozliwosci" className="border-b border-stroke bg-grid">
      <div className="mx-auto max-w-[var(--container-content)] px-5 py-20 sm:px-8 md:py-28">
        <Reveal>
          <p className="eyebrow">{"// możliwości"}</p>
          <h2 className="mt-4 max-w-2xl text-3xl font-semibold sm:text-4xl">
            <DecodeText text="Co potrafi asystent" />
          </h2>
          <p className="mt-4 max-w-xl text-muted">
            Praktyczne wdrożenia LLM dla małych firm — od czatu na żywo po
            generowanie ofert. Wszystko po polsku, z kluczem API po stronie
            serwera.
          </p>
        </Reveal>

        <RevealGroup className="mt-12 grid gap-4 md:grid-cols-3" stagger={0.08}>
          {/* Bento: teaser czatu (2 kolumny) */}
          <RevealItem className="md:col-span-2">
            <Link href="/demo" className="block h-full">
              <SpotlightCard className="flex h-full flex-col p-6">
                <p className="font-mono text-xs text-accent">⌘ czat na żywo</p>
                <h3 className="mt-3 text-xl font-semibold">
                  Odpowiada token po tokenie, 24/7
                </h3>
                <p className="mt-2 max-w-md text-sm text-muted">
                  Okno czatu ze streamingiem, osadzone na stronie lub jako
                  widget. Zna ofertę firmy i odpowiada natychmiast — o każdej
                  porze.
                </p>
                <span className="mt-auto pt-4 text-sm font-medium text-accent">
                  Otwórz demo →
                </span>
              </SpotlightCard>
            </Link>
          </RevealItem>

          {/* Karty usług */}
          {company.services.map((s) => (
            <RevealItem key={s.id}>
              <SpotlightCard className="flex h-full flex-col p-6">
                <p className="font-mono text-lg text-accent">
                  {glyph[s.id] ?? "✦"}
                </p>
                <h3 className="mt-3 text-base font-semibold">{s.name}</h3>
                <p className="mt-2 text-sm text-muted">{s.tagline}</p>
                <span className="mt-auto pt-4 font-mono text-xs text-muted">
                  od {formatPrice(s.priceFrom)}
                </span>
              </SpotlightCard>
            </RevealItem>
          ))}

          {/* Bento: teaser generatora ofert (pełna szerokość) */}
          <RevealItem className="md:col-span-3">
            <Link href="/oferta" className="block">
              <SpotlightCard className="flex flex-col items-start justify-between gap-4 p-6 sm:flex-row sm:items-center">
                <div>
                  <p className="font-mono text-xs text-accent">
                    ▦ generator ofert
                  </p>
                  <h3 className="mt-2 text-xl font-semibold">
                    Z kilku pól → gotowa oferta
                  </h3>
                  <p className="mt-1 text-sm text-muted">
                    Branża, zakres, budżet — oferta składa się na żywo, do
                    skopiowania lub PDF.
                  </p>
                </div>
                <span className="shrink-0 rounded-full bg-accent/10 px-4 py-2 text-sm font-medium text-accent transition-colors group-hover:bg-accent/20">
                  Wypróbuj →
                </span>
              </SpotlightCard>
            </Link>
          </RevealItem>
        </RevealGroup>
      </div>
    </section>
  );
}
