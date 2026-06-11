import Link from "next/link";
import type { ReactNode } from "react";
import { company } from "@/data/company";

/* — Ikony (inline SVG, currentColor, zero zależności) — */

function GithubIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden>
      <path d="M12 .5C5.7.5.5 5.7.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.2.8-.5v-1.7c-3.2.7-3.9-1.5-3.9-1.5-.5-1.3-1.3-1.7-1.3-1.7-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.7 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C17 4.6 18 4.9 18 4.9c.6 1.6.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.4-2.7 5.4-5.3 5.7.4.4.8 1.1.8 2.3v3.3c0 .3.2.6.8.5 4.6-1.5 7.9-5.8 7.9-10.9C23.5 5.7 18.3.5 12 .5z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.7 2.5 15.3 0 18M12 3c-2.5 2.7-2.5 15.3 0 18" />
    </svg>
  );
}

/* Okrągły przycisk-ikona social */
function SocialButton({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: ReactNode;
}) {
  const external = href.startsWith("http");
  return (
    <a
      href={href}
      aria-label={label}
      title={label}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-stroke text-muted transition-colors hover:border-accent/50 hover:text-accent"
    >
      {children}
    </a>
  );
}

/* Wiersz kontaktu: ikona + tekst */
function ContactRow({
  href,
  icon,
  children,
}: {
  href: string;
  icon: ReactNode;
  children: ReactNode;
}) {
  const external = href.startsWith("http");
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="group flex items-center gap-3 text-sm text-muted transition-colors hover:text-fg"
    >
      <span className="text-muted transition-colors group-hover:text-accent">
        {icon}
      </span>
      {children}
    </a>
  );
}

const colHead = "text-xs font-medium uppercase tracking-[0.14em] text-muted";

export function Footer() {
  return (
    <footer className="relative border-t border-stroke bg-ink-2">
      {/* subtelna linia akcentu */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />

      <div className="mx-auto max-w-[var(--container-content)] px-5 py-16 sm:px-8">
        <div className="grid gap-12 md:grid-cols-[1.6fr_1fr_1fr]">
          {/* Marka */}
          <div className="max-w-sm">
            <p className="flex items-center gap-2 text-lg font-semibold text-fg">
              <span className="text-accent">◆</span> {company.name}
            </p>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              {company.shortDescription}
            </p>
            <div className="mt-6 flex gap-3">
              <SocialButton href={company.social.github} label="GitHub">
                <GithubIcon />
              </SocialButton>
              <SocialButton
                href={`mailto:${company.contact.email}`}
                label="Napisz e-mail"
              >
                <MailIcon />
              </SocialButton>
              <SocialButton href={company.social.portfolio} label="Portfolio">
                <GlobeIcon />
              </SocialButton>
            </div>
          </div>

          {/* Nawigacja */}
          <nav>
            <p className={colHead}>Nawigacja</p>
            <ul className="mt-4 space-y-2.5 text-sm text-muted">
              {[
                { href: "/#mozliwosci", label: "Możliwości" },
                { href: "/#cennik", label: "Cennik" },
                { href: "/oferta", label: "Generator ofert" },
                { href: "/demo", label: "Demo czatu" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="transition-colors hover:text-fg">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Kontakt */}
          <div>
            <p className={colHead}>Kontakt</p>
            <ul className="mt-4 space-y-3">
              <li>
                <ContactRow
                  href={`mailto:${company.contact.email}`}
                  icon={<MailIcon />}
                >
                  {company.contact.email}
                </ContactRow>
              </li>
              <li>
                <ContactRow href={company.social.github} icon={<GithubIcon />}>
                  GitHub {company.social.githubHandle}
                </ContactRow>
              </li>
              <li>
                <ContactRow href={company.social.portfolio} icon={<GlobeIcon />}>
                  dorlowski.dev
                </ContactRow>
              </li>
            </ul>
          </div>
        </div>

        {/* Dolny pasek */}
        <div className="mt-14 flex flex-col gap-3 border-t border-stroke pt-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {company.name} — demo portfolio. Odpowiedzi generuje AI; mogą być
            niedokładne.
          </p>
          <p className="flex items-center gap-2">
            <span className="text-fg">{company.author}</span>
            <span aria-hidden className="text-stroke-strong">
              ·
            </span>
            {company.role}
          </p>
        </div>
      </div>
    </footer>
  );
}
