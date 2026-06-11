"use client";

import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { EASE } from "@/lib/motion";
import { company } from "@/data/company";
import { HERO_SCRIPT } from "@/data/mock";
import { Typewriter } from "@/components/ui/Typewriter";
import { CountUp } from "@/components/ui/CountUp";
import { ChatPanel } from "@/components/chat/ChatPanel";

const slug = company.name.toLowerCase().replace(/\s+/g, "-");

export function Hero() {
  const reduce = useReducedMotion();

  const container: Variants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: reduce ? 0 : 0.12, delayChildren: 0.05 },
    },
  };
  const item: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 22 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: reduce ? 0 : 0.7, ease: EASE },
    },
  };

  return (
    <section id="top" className="relative border-b border-stroke">
      <div className="relative z-10 mx-auto grid max-w-[var(--container-content)] items-center gap-12 px-5 py-20 sm:px-8 md:py-28 lg:grid-cols-2 lg:gap-10">
        {/* Lewa kolumna */}
        <motion.div variants={container} initial="hidden" animate="visible">
          <motion.p variants={item} className="eyebrow">
            {`// ${slug}`}
          </motion.p>

          <motion.h1
            variants={item}
            className="mt-6 text-4xl leading-[1.08] sm:text-5xl lg:text-6xl"
          >
            <Typewriter text={company.tagline} speed={34} />
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-6 max-w-md text-lg leading-relaxed text-muted"
          >
            {company.heroLead}
          </motion.p>

          <motion.div
            variants={item}
            className="mt-9 flex flex-col gap-3 sm:flex-row"
          >
            <Link
              href="/demo"
              className="btn-primary rounded-full px-6 py-3.5 text-center text-sm font-semibold"
            >
              Wypróbuj demo →
            </Link>
            <Link
              href="/oferta"
              className="btn-ghost rounded-full px-6 py-3.5 text-center text-sm font-semibold"
            >
              Zobacz ofertę
            </Link>
          </motion.div>

          <motion.div
            variants={item}
            className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3"
          >
            <span className="flex items-baseline gap-1.5">
              <span className="font-mono text-sm font-semibold text-fg">
                <CountUp to={24} />/7
              </span>
              <span className="text-xs text-muted">dostępność</span>
            </span>
            <span aria-hidden className="text-stroke-strong">
              ·
            </span>
            <span className="flex items-baseline gap-1.5">
              <span className="font-mono text-sm font-semibold text-fg">
                &lt;1 s
              </span>
              <span className="text-xs text-muted">odpowiedź</span>
            </span>
            <span aria-hidden className="text-stroke-strong">
              ·
            </span>
            <span className="flex items-baseline gap-1.5">
              <span className="font-mono text-sm font-semibold text-fg">
                <CountUp to={100} />%
              </span>
              <span className="text-xs text-muted">po polsku</span>
            </span>
          </motion.div>
        </motion.div>

        {/* Prawa kolumna — bohater: czat na żywo (skryptowany podgląd) */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: reduce ? 0 : 0.8, ease: EASE, delay: 0.2 }}
        >
          <ChatPanel
            script={HERO_SCRIPT}
            viewTransitionName="chat-surface"
            className="mx-auto w-full max-w-md"
          />
        </motion.div>
      </div>
    </section>
  );
}
