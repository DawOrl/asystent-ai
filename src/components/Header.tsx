import Link from "next/link";
import { company } from "@/data/company";

const slug = company.name.toLowerCase().replace(/\s+/g, "-");

export function Header() {
  return (
    <header
      style={{ viewTransitionName: "site-header" }}
      className="glass sticky top-0 z-50 border-b border-stroke"
    >
      <div className="mx-auto flex h-16 max-w-[var(--container-content)] items-center justify-between px-5 sm:px-8">
        <Link href="/" className="flex items-center gap-2 font-mono text-sm text-fg">
          <span className="text-accent">◆</span> {slug}
        </Link>

        <nav className="hidden items-center gap-7 text-sm text-muted sm:flex">
          <Link href="/#mozliwosci" className="transition-colors hover:text-fg">
            Możliwości
          </Link>
          <Link href="/#cennik" className="transition-colors hover:text-fg">
            Cennik
          </Link>
          <Link href="/oferta" className="transition-colors hover:text-fg">
            Oferta
          </Link>
          <Link href="/demo" className="transition-colors hover:text-fg">
            Demo
          </Link>
        </nav>

        <Link
          href="/demo"
          className="btn-primary rounded-full px-4 py-2 text-sm font-semibold"
        >
          Wypróbuj
        </Link>
      </div>
    </header>
  );
}
