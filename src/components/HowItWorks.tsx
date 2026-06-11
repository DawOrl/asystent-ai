import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { DecodeText } from "@/components/ui/DecodeText";

const steps = [
  {
    n: "01",
    title: "Pytanie",
    body: "Klient pisze pytanie zwykłym językiem — o cennik, dostępność, zakres usług. O każdej porze.",
  },
  {
    n: "02",
    title: "Kontekst + rozumowanie",
    body: "Model sięga po wiedzę o firmie (FAQ, oferta) i układa trafną, spójną odpowiedź — w tonie marki.",
  },
  {
    n: "03",
    title: "Odpowiedź / akcja",
    body: "Odpowiedź streamuje się na żywo. Może też wygenerować ofertę, treść albo przekazać leada dalej.",
  },
];

export function HowItWorks() {
  return (
    <section className="border-b border-stroke">
      <div className="mx-auto max-w-[var(--container-content)] px-5 py-20 sm:px-8 md:py-28">
        <Reveal>
          <p className="eyebrow">{"// jak to działa"}</p>
          <h2 className="mt-4 max-w-2xl text-3xl font-semibold sm:text-4xl">
            <DecodeText text="Od pytania do odpowiedzi w sekundę" />
          </h2>
        </Reveal>

        <RevealGroup className="mt-12 grid gap-6 md:grid-cols-3" stagger={0.1}>
          {steps.map((s) => (
            <RevealItem key={s.n}>
              <SpotlightCard className="h-full p-6">
                <p className="font-mono text-2xl text-accent">{s.n}</p>
                <h3 className="mt-3 text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {s.body}
                </p>
              </SpotlightCard>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
