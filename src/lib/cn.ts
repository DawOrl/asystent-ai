/** Minimalne łączenie klas (bez zależności). Port z restauracja-bella. */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

/** Formatowanie ceny w PLN, np. 1900 -> "1 900 zł". */
export function formatPrice(value: number): string {
  return `${value.toLocaleString("pl-PL")} zł`;
}
