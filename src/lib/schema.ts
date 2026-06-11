/**
 * Dane strukturalne schema.org/ProfessionalService dla Rich Results.
 * Renderowane jako <script type="application/ld+json">. Wzorzec z restauracja-bella.
 */

import { company } from "@/data/company";

export function buildOrganizationJsonLd() {
  const { siteUrl } = company;

  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${siteUrl}/#organization`,
    name: company.name,
    description: company.shortDescription,
    url: siteUrl,
    email: company.contact.email,
    priceRange: company.priceRange,
    founder: {
      "@type": "Person",
      name: company.author,
      jobTitle: company.role,
    },
    areaServed: "PL",
    availableLanguage: ["pl"],
    sameAs: [company.social.github, company.social.portfolio],
    makesOffer: company.services.map((s) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: s.name,
        description: s.description,
      },
      priceSpecification: {
        "@type": "PriceSpecification",
        minPrice: s.priceFrom,
        priceCurrency: company.currency,
      },
    })),
  };
}

/** Serializacja bezpieczna pod XSS (escape `<`). */
export function jsonLdScript(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
