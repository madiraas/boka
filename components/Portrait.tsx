"use client";

import { useEffect, useRef } from "react";
import { throwPetals } from "./Petals";

const N = 64; // head-turn frames, one per ~5.6 degrees of the sweep
const W = 700;
const H = 600;
const MAX_DEG_PER_SEC = 150; // never whips round
const EASE = 3.6; // lower = softer

const pad = (k: number) => (k < 10 ? "0" : "") + k;

/**
 * Her head follows your cursor, or the tunnel you hover (any element with data-gaze).
 * The picture is the plain video frame on its own red, so there is no cutout edge to glitch.
 */
export default function Portrait() {
  const box = useRef<HTMLDivElement>(null);
  const cv = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = cv.current;
    const wrap = box.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const center = new Image();
    const frames: HTMLImageElement[] = new Array(N);
    let drawn = -2;
    const draw = (img: HTMLImageElement | undefined, key: number) => {
      if (!img || key === drawn || !img.complete || !img.naturalWidth) return;
      ctx.drawImage(img, 0, 0, W, H);
      drawn = key;
    };
    center.onload = () => {
      if (drawn === -2) draw(center, -1);
    };
    center.src = "/frames/center.webp";
    for (let k = 0; k < N; k++) {
      const im = new Image();
      im.src = `/frames/${pad(k)}.webp`;
      frames[k] = im;
    }

    let pointer: { x: number; y: number; t: number } | null = null;
    let gazeEl: Element | null = null;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      pointer = { x: e.clientX, y: e.clientY, t: performance.now() };
    };
    const onOver = (e: Event) => {
      const el = (e.target as Element | null)?.closest?.("[data-gaze]") || null;
      gazeEl = el;
    };
    const onOut = (e: Event) => {
      const to = (e as PointerEvent).relatedTarget as Element | null;
      if (!to || !to.closest?.("[data-gaze]")) gazeEl = null;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver);
    document.addEventListener("pointerout", onOut);
    document.addEventListener("focusin", onOver);
    document.addEventListener("focusout", () => (gazeEl = null));

    let ang = 0; // 0 = right, 90 = up, -90 = down, +-180 = left
    let last = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const r = wrap.getBoundingClientRect();
      if (r.bottom > 0 && r.top < window.innerHeight) {
        const fx = r.left + r.width * 0.5;
        const fy = r.top + r.height * 0.4;
        let tx: number, ty: number;
        if (gazeEl) {
          const g = gazeEl.getBoundingClientRect();
          tx = g.left + g.width / 2;
          ty = g.top + g.height * 0.4;
        } else if (pointer && now - pointer.t < 6000) {
          tx = pointer.x;
          ty = pointer.y;
        } else {
          draw(center, -1); // nobody pointing: she looks straight at you
          raf = requestAnimationFrame(tick);
          return;
        }
        const dx = tx - fx;
        const dy = ty - fy;
        if (Math.hypot(dx, dy) < r.height * 0.2) {
          draw(center, -1); // eye contact when the cursor is near her face
        } else {
          const th = (Math.atan2(-dy, dx) * 180) / Math.PI;
          const diff = ((th - ang + 540) % 360) - 180;
          if (reduce) {
            ang = th;
          } else {
            let step = diff * (1 - Math.exp(-dt * EASE));
            const cap = MAX_DEG_PER_SEC * dt;
            step = Math.max(-cap, Math.min(cap, step));
            ang += step;
          }
          const idx = ((Math.round(((ang + 180) / 360) * N) % N) + N) % N;
          draw(frames[idx], idx);
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerout", onOut);
      document.removeEventListener("focusin", onOver);
    };
  }, []);

  function poke(e: React.MouseEvent) {
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
    throwPetals({ mode: "burst", x: e.clientX || r.left + r.width / 2, y: e.clientY || r.top + r.height * 0.3, count: 28 });
  }

  return (
    <div className="portrait" ref={box} onClick={poke}>
      <canvas ref={cv} width={W} height={H} role="img" aria-label="Madhura, looking at wherever you point" />
    </div>
  );
}
