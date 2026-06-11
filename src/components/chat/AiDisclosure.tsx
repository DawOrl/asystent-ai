import { cn } from "@/lib/cn";

/** Nota „rozmawiasz z AI" (świadomość, że odpowiada model). */
export function AiDisclosure({ className }: { className?: string }) {
  return (
    <p className={cn("text-center text-[0.7rem] leading-relaxed text-muted", className)}>
      Rozmawiasz z AI — odpowiedzi są generowane i mogą być niedokładne. To demo.
    </p>
  );
}
