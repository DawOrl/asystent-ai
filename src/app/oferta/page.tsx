import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { OfferGenerator } from "@/components/OfferGenerator";

export const metadata: Metadata = {
  title: "Generator ofert",
  description:
    "Z kilku pól wygeneruj spersonalizowaną ofertę wdrożenia AI — na żywo, do skopiowania lub pobrania. Demo.",
};

export default function OfertaPage() {
  return (
    <>
      <Header />
      <main className="relative">
        <div className="mx-auto max-w-[var(--container-content)] px-5 py-16 sm:px-8 md:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow justify-center">{"// generator ofert"}</p>
            <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">
              Spersonalizowana oferta w kilka sekund
            </h1>
            <p className="mt-3 text-muted">
              Wybierz branżę, zakres i budżet — asystent ułoży ofertę na żywo.
              Skopiuj ją lub zapisz jako PDF.
            </p>
          </div>
          <div className="mt-12">
            <OfferGenerator />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
