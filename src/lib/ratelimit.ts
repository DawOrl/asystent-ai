/**
 * Lean rate-limit po IP (in-memory sliding window) — domyślny dla dema.
 * Per-instancja (wystarcza dla portfolio). Bez zewnętrznych usług.
 *
 * PROD upgrade (współdzielony licznik między instancjami) — Upstash:
 *   import { Ratelimit } from "@upstash/ratelimit";
 *   import { Redis } from "@upstash/redis";
 *   const rl = new Ratelimit({ redis: Redis.fromEnv(),
 *     limiter: Ratelimit.slidingWindow(5, "60 s") });
 *   const { success } = await rl.limit(ip);
 * Aktywuj ustawiając UPSTASH_REDIS_REST_URL / _TOKEN.
 */

type Window = { windowMs: number; max: number };

const WINDOWS: Window[] = [
  { windowMs: 60_000, max: 5 }, // 5 / minutę
  { windowMs: 86_400_000, max: 50 }, // 50 / dobę
];

const hits = new Map<string, number[]>();

/** Zwraca true gdy żądanie mieści się w limitach; rejestruje trafienie gdy OK. */
export function rateLimit(ip: string): boolean {
  const now = Date.now();
  const maxWindow = Math.max(...WINDOWS.map((w) => w.windowMs));
  const timestamps = (hits.get(ip) ?? []).filter((t) => now - t < maxWindow);

  for (const w of WINDOWS) {
    const count = timestamps.filter((t) => now - t < w.windowMs).length;
    if (count >= w.max) {
      hits.set(ip, timestamps); // zapisz oczyszczone, nie dodawaj trafienia
      return false;
    }
  }

  timestamps.push(now);
  hits.set(ip, timestamps);
  return true;
}

/** Wyciąga IP klienta z nagłówków (Next 16 nie udostępnia `request.ip`). */
export function clientIp(req: Request): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "anon"
  );
}
