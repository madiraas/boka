"use client";

import { useEffect, useRef, useState } from "react";
import { blip } from "@/lib/sound";

export interface Stat {
  n: string;
  label: string;
}

/** Numbers that count up once when they scroll into view. "10+" counts to 10 and keeps the plus. */
export default function StatsStrip({ stats }: { stats: Stat[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [p, setP] = useState(1); // 0..1 progress; starts finished so no-JS and server render show the real numbers

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight * 0.9) return; // already on screen: just show it
    setP(0);
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        const start = performance.now();
        const dur = 1300;
        let tickAt = 0;
        const step = (now: number) => {
          const k = Math.min(1, (now - start) / dur);
          setP(1 - Math.pow(1 - k, 3));
          if (now - tickAt > 110 && k < 1) {
            blip("tick");
            tickAt = now;
          }
          if (k < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div className="stats" ref={ref}>
      {stats.map((s, i) => {
        const m = s.n.match(/^(\D*)(\d+)(.*)$/);
        const shown = m ? `${m[1]}${Math.round(Number(m[2]) * p)}${m[3]}` : s.n;
        return (
          <div className="stat" key={i}>
            <b aria-label={s.n}>{shown}</b>
            <span>{s.label}</span>
          </div>
        );
      })}
    </div>
  );
}
