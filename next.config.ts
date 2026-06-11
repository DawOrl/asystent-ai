import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Włącza React <ViewTransition> (morph hero → /demo, przejścia między trasami).
    // Progressive enhancement — strona działa też bez wsparcia w przeglądarce.
    viewTransition: true,
  },
};

export default nextConfig;
