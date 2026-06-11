"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * Animowane tło „świetlne smugi" — powolne, lekko nachylone smugi światła
 * sunące za treścią (emerald/cyan/indygo, additive glow). Canvas 2D, lekkie.
 * Pauzuje przy prefers-reduced-motion (render statyczny) oraz gdy karta ukryta.
 */
export function LightRays() {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W = 0;
    let H = 0;

    const resize = () => {
      W = canvas.clientWidth;
      H = canvas.clientHeight;
      canvas.width = Math.max(1, Math.floor(W * dpr));
      canvas.height = Math.max(1, Math.floor(H * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // emerald · cyan · indygo
    const colors = ["52,211,153", "34,211,238", "129,140,248"];
    const beams = Array.from({ length: 7 }, (_, i) => ({
      x: Math.random(),
      w: 130 + Math.random() * 200,
      speed: 0.012 + Math.random() * 0.02, // ułamek szerokości / s
      color: colors[i % colors.length],
      alpha: 0.05 + Math.random() * 0.06,
      phase: Math.random() * Math.PI * 2,
    }));
    const angle = -0.32; // ~ -18°

    const draw = (now: number) => {
      ctx.clearRect(0, 0, W, H);
      ctx.globalCompositeOperation = "lighter";
      for (const b of beams) {
        const pulse = 0.7 + 0.3 * Math.sin(now * 0.0006 + b.phase);
        ctx.save();
        ctx.translate(b.x * W, H / 2);
        ctx.rotate(angle);
        const grad = ctx.createLinearGradient(-b.w / 2, 0, b.w / 2, 0);
        grad.addColorStop(0, `rgba(${b.color},0)`);
        grad.addColorStop(0.5, `rgba(${b.color},${b.alpha * pulse})`);
        grad.addColorStop(1, `rgba(${b.color},0)`);
        ctx.fillStyle = grad;
        ctx.fillRect(-b.w / 2, -H, b.w, H * 2);
        ctx.restore();
      }
      ctx.globalCompositeOperation = "source-over";
    };

    let raf = 0;
    let running = false;
    let last = performance.now();

    const loop = (now: number) => {
      if (!running) return;
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      for (const b of beams) {
        b.x += b.speed * dt;
        if (b.x > 1.25) b.x = -0.25;
      }
      draw(now);
      raf = requestAnimationFrame(loop);
    };

    const start = () => {
      if (running || reduce) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    if (reduce) {
      draw(0); // statyczny kadr
    } else {
      start();
    }

    const onVis = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVis);

    return () => {
      stop();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [reduce]);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="absolute inset-0 h-full w-full"
    />
  );
}
