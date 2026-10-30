"use client";

import { useEffect, useRef } from "react";

type P = {
  x: number; y: number; vx: number; vy: number;
  rot: number; vr: number; flip: number; vf: number;
  size: number; color: string; sway: number; swayV: number; t: number; g: number; drag: number;
};

const COLORS = ["#FFC94D", "#FFF4EA", "#FFB3C1", "#FFD98A", "#FFFFFF"];

/**
 * One canvas for all the petals on the site.
 * Anything can throw petals with:
 *   window.dispatchEvent(new CustomEvent("petals", { detail: { mode: "rain" | "burst", x, y, count } }))
 */
export default function Petals() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let parts: P[] = [];
    let raf = 0;
    let last = 0;
    let dpr = 1;

    const size = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      cv.width = Math.floor(window.innerWidth * dpr);
      cv.height = Math.floor(window.innerHeight * dpr);
    };
    size();
    window.addEventListener("resize", size);

    const pick = () => COLORS[(Math.random() * COLORS.length) | 0];

    function add(detail: { mode?: string; x?: number; y?: number; count?: number }) {
      if (reduce) return;
      const n = detail.count ?? 40;
      for (let i = 0; i < n; i++) {
        const base: P = {
          x: 0, y: 0, vx: 0, vy: 0,
          rot: Math.random() * 6.28, vr: (Math.random() - 0.5) * 3,
          flip: Math.random() * 6.28, vf: 2 + Math.random() * 3,
          size: 9 + Math.random() * 9, color: pick(),
          sway: Math.random() * 6.28, swayV: 1 + Math.random() * 1.6, t: 0, g: 0, drag: 0,
        };
        if (detail.mode === "burst") {
          const a = -Math.PI / 2 + (Math.random() - 0.5) * 2.4;
          const v = 180 + Math.random() * 380;
          base.x = detail.x ?? window.innerWidth / 2;
          base.y = detail.y ?? window.innerHeight / 2;
          base.vx = Math.cos(a) * v;
          base.vy = Math.sin(a) * v;
          base.g = 520;
          base.drag = 1.6;
        } else {
          base.x = Math.random() * window.innerWidth;
          base.y = -20 - Math.random() * window.innerHeight * 0.5;
          base.vx = (Math.random() - 0.5) * 40;
          base.vy = 70 + Math.random() * 90;
          base.g = 0;
          base.drag = 0;
        }
        parts.push(base);
      }
      if (!raf) {
        last = performance.now();
        raf = requestAnimationFrame(tick);
      }
    }

    function drawPetal(p: P) {
      const s = p.size;
      ctx!.save();
      ctx!.translate(p.x * dpr, p.y * dpr);
      ctx!.rotate(p.rot);
      ctx!.scale(dpr, dpr * Math.cos(p.flip));
      ctx!.fillStyle = p.color;
      ctx!.beginPath();
      ctx!.moveTo(0, -s * 0.6);
      ctx!.bezierCurveTo(s * 0.7, -s * 0.5, s * 0.6, s * 0.5, 0, s * 0.7);
      ctx!.bezierCurveTo(-s * 0.6, s * 0.5, -s * 0.7, -s * 0.5, 0, -s * 0.6);
      ctx!.fill();
      ctx!.restore();
    }

    function tick(now: number) {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      ctx!.clearRect(0, 0, cv!.width, cv!.height);
      const H = window.innerHeight;
      parts = parts.filter((p) => p.y < H + 40);
      for (const p of parts) {
        p.t += dt;
        p.vy += p.g * dt;
        if (p.drag) {
          const k = Math.exp(-p.drag * dt);
          p.vx *= k;
          if (p.vy < 0) p.vy *= k;
        }
        // terminal fall speed so petals drift instead of dropping
        if (p.vy > 190) p.vy += (190 - p.vy) * Math.min(1, dt * 3);
        p.x += (p.vx + Math.sin(p.t * p.swayV + p.sway) * 34) * dt;
        p.y += p.vy * dt;
        p.rot += p.vr * dt;
        p.flip += p.vf * dt;
        drawPetal(p);
      }
      raf = parts.length ? requestAnimationFrame(tick) : 0;
      if (!raf) ctx!.clearRect(0, 0, cv!.width, cv!.height);
    }

    const onEvt = (e: Event) => add((e as CustomEvent).detail || {});
    window.addEventListener("petals", onEvt);
    return () => {
      window.removeEventListener("petals", onEvt);
      window.removeEventListener("resize", size);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return <canvas ref={ref} className="petal-canvas" aria-hidden="true" />;
}

export function throwPetals(detail: { mode?: "rain" | "burst"; x?: number; y?: number; count?: number }) {
  window.dispatchEvent(new CustomEvent("petals", { detail }));
}
