"use client";

import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { useReducedMotion } from "framer-motion";

const GLYPHS = "ABCDEFGHIJKLMNOPRSTUWXYZ0123456789/<>#*{}";

const emptySubscribe = () => () => {};
function useMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

/**
 * Efekt „dekodowania" — tekst rozszyfrowuje się ze znaków przy wejściu w viewport.
 * SSR / pierwszy render / reduced-motion → czysty tekst (dobre dla SEO i dostępności).
 */
export function DecodeText({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const mounted = useMounted();
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(text);

  useEffect(() => {
    if (!mounted || reduce) return; // render pokaże czysty tekst (warunek niżej)
    const el = ref.current;
    if (!el) return;
    let timer: ReturnType<typeof setInterval> | undefined;
    let started = false;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting || started) return;
        started = true;
        io.disconnect();
        const start = performance.now();
        const perChar = 72; // ms na odsłonięcie znaku (wolniej)
        timer = setInterval(() => {
          const revealed = Math.floor((performance.now() - start) / perChar);
          let out = "";
          for (let i = 0; i < text.length; i++) {
            if (i < revealed || text[i] === " ") out += text[i];
            else out += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          }
          setDisplay(out);
          if (revealed >= text.length) {
            clearInterval(timer);
            setDisplay(text);
          }
        }, 48); // spokojniejsze „migotanie" niż co klatkę
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      clearInterval(timer);
    };
  }, [text, mounted, reduce]);

  return (
    <span ref={ref} className={className}>
      {mounted && !reduce ? display : text}
    </span>
  );
}
