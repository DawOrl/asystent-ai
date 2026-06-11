import { LightRays } from "./LightRays";
import { Grain } from "./Grain";

/** Globalna warstwa tła: animowane świetlne smugi + ziarno. Za całą treścią. */
export function SiteBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      <LightRays />
      <Grain />
    </div>
  );
}
