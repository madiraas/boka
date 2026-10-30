"use client";

import { useEffect, useRef, useState } from "react";
import { throwPetals } from "./Petals";

const FRAMES = [1, 2, 3, 4, 5, 6].map((n) => `/img/aarti${n}.png`);

/**
 * The cat greets every visitor on its own: aarti, then petals, then the page opens.
 * There is nothing to click. A tap anywhere skips it.
 */
export default function CatGate({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState<"in" | "aarti" | "bless" | "open">("in");
  const [frame, setFrame] = useState(0);
  const done = useRef(false);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    FRAMES.forEach((src) => {
      const im = new Image();
      im.src = src;
    });
    const t = (fn: () => void, ms: number) => {
      timers.current.push(window.setTimeout(fn, ms));
    };
    t(() => setPhase("aarti"), 600);
    t(() => {
      setPhase("bless");
      throwPetals({ mode: "rain", count: 70 });
    }, 3200);
    t(() => finish(), 4600);
    return () => timers.current.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (phase !== "aarti") return;
    const id = window.setInterval(() => setFrame((f) => (f + 1) % FRAMES.length), 230);
    return () => clearInterval(id);
  }, [phase]);

  function finish(fast = false) {
    if (done.current) return;
    done.current = true;
    timers.current.forEach(clearTimeout);
    setPhase("open");
    if (fast) throwPetals({ mode: "rain", count: 50 });
    window.setTimeout(onDone, 950);
  }

  return (
    <div
      className={`gate is-${phase}`}
      onClick={() => finish(true)}
      role="presentation"
      aria-hidden={phase === "open"}
    >
      <div className="gate-stage">
        <div className="glow" />
        <div className="rings">
          <i />
          <i />
          <i />
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="g-kitten" src="/img/kitten.png" alt="" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="g-aarti" src={FRAMES[frame]} alt="" />
      </div>
    </div>
  );
}
