"use client";

import { useEffect, useState } from "react";
import { blip, setSound, soundOn } from "@/lib/sound";

/** A small speaker button in the corner. Sounds are off until the visitor turns them on. */
export default function SoundToggle() {
  const [on, setOn] = useState(false);

  useEffect(() => {
    const sync = () => setOn(soundOn());
    sync();
    window.addEventListener("soundchange", sync);
    const onClick = (e: MouseEvent) => {
      const el = (e.target as Element | null)?.closest?.("a,button");
      if (el && !el.classList.contains("sound-toggle")) blip("tap");
    };
    document.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("soundchange", sync);
      document.removeEventListener("click", onClick);
    };
  }, []);

  return (
    <button
      type="button"
      className="sound-toggle"
      aria-pressed={on}
      aria-label={on ? "Turn sounds off" : "Turn sounds on"}
      onClick={() => {
        const next = !on;
        setSound(next);
        if (next) blip("open");
      }}
    >
      {on ? "Sound on" : "Sound off"}
    </button>
  );
}
