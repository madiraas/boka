"use client";

import { useEffect, useRef } from "react";
import { throwPetals } from "./Petals";

const N = 64; // head-turn frames, one per ~5.6 degrees of the sweep
const W = 700;
const H = 600;
const MAX_DEG_PER_SEC = 220; // still never whips round, but keeps up with the mouse
const EASE = 5.5; // lower = softer

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
    const ready: boolean[] = new Array(N).fill(false);
    let centerReady = false;
    let drawn = -2;
    // Draw one frame, or blend two neighbouring frames (f = 0..1) so the head
    // glides between the 64 stills instead of snapping from one to the next.
    const paint = (a: HTMLImageElement, b: HTMLImageElement | null, f: number, key: number) => {
      if (key === drawn) return;
      ctx.globalAlpha = 1;
      ctx.drawImage(a, 0, 0, W, H);
      if (b && f > 0.03) {
        ctx.globalAlpha = f;
        ctx.drawImage(b, 0, 0, W, H);
        ctx.globalAlpha = 1;
      }
      drawn = key;
    };
    // Frames are decoded up front, so the first turn never stalls on a decode.
    const load = (im: HTMLImageElement, src: string, onReady: () => void) => {
      im.decoding = "async";
      im.src = src;
      (im.decode ? im.decode() : Promise.resolve()).then(onReady).catch(() => {
        if (im.complete && im.naturalWidth) onReady();
      });
    };
    load(center, "/frames/center.webp", () => {
      centerReady = true;
      if (drawn === -2) paint(center, null, 0, -1);
    });
    // Phones load half of the head-turn frames: much less to download and decode.
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    for (let k = 0; k < N; k += coarse ? 2 : 1) {
      const im = new Image();
      frames[k] = im;
      load(im, `/frames/${pad(k)}.webp`, () => {
        ready[k] = true;
      });
    }
    // If a frame has not arrived yet, use the closest one that has.
    const nearest = (k: number) => {
      for (let d = 0; d < N / 2; d++) {
        const a = (k + d) % N;
        if (ready[a]) return a;
        const b = (k - d + N) % N;
        if (ready[b]) return b;
      }
      return -1;
    };

    let pointer: { x: number; y: number; t: number } | null = null;
    let gazeEl: Element | null = null;
    const onMove = (e: PointerEvent) => {
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
    window.addEventListener("pointerdown", onMove, { passive: true });
    // Nobody pointing (always the case on a phone): she glances at a random tunnel or corner now and then.
    let glance: { x: number; y: number; until: number } | null = null;
    let nextGlance = performance.now() + 1500;
    const pickGlance = (now: number) => {
      const els = Array.from(document.querySelectorAll("[data-gaze]"));
      const el = els.length && Math.random() < 0.7 ? els[Math.floor(Math.random() * els.length)] : null;
      if (el) {
        const g = el.getBoundingClientRect();
        glance = { x: g.left + g.width / 2, y: g.top + g.height * 0.4, until: now + 1800 };
      } else {
        const a = Math.random() * Math.PI * 2;
        glance = { x: window.innerWidth / 2 + Math.cos(a) * 600, y: window.innerHeight / 2 + Math.sin(a) * 400, until: now + 1600 };
      }
      nextGlance = now + 1800 + 2600 + Math.random() * 2500;
    };
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
        } else if (!reduce && (glance || now > nextGlance)) {
          if (!glance || now > glance.until) {
            if (glance) {
              glance = null; // glance over, look back at you
              nextGlance = now + 2600 + Math.random() * 2500;
              if (centerReady) paint(center, null, 0, -1);
              raf = requestAnimationFrame(tick);
              return;
            }
            pickGlance(now);
          }
          tx = glance!.x;
          ty = glance!.y;
        } else {
          if (centerReady) paint(center, null, 0, -1); // nobody pointing: she looks straight at you
          raf = requestAnimationFrame(tick);
          return;
        }
        const dx = tx - fx;
        const dy = ty - fy;
        if (Math.hypot(dx, dy) < r.height * 0.2) {
          if (centerReady) paint(center, null, 0, -1); // eye contact when the cursor is near her face
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
          const pos = ((((ang + 180) / 360) * N) % N + N) % N;
          const i0 = Math.floor(pos);
          const f = Math.round((pos - i0) * 6) / 6; // 6 blend steps between frames
          const a = nearest(i0);
          if (a >= 0) {
            const bi = (i0 + 1) % N;
            paint(frames[a], ready[bi] ? frames[bi] : null, f, i0 * 10 + f * 6);
          }
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onMove);
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
