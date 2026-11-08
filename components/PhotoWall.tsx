"use client";

import { useMemo, useState } from "react";
import { blip } from "@/lib/sound";
import Lightbox, { posterOf, type Photo } from "./Lightbox";

export type { Photo };

/** Photos and clips as a scrapbook: filter chips, tilted cards that scroll sideways, clips as little phones. */
export default function PhotoWall({ photos }: { photos: Photo[] }) {
  const cats = useMemo(() => ["All", ...Array.from(new Set(photos.map((p) => p.category).filter(Boolean)))], [photos]);
  const [cat, setCat] = useState("All");
  const [open, setOpen] = useState<number | null>(null);
  const shown = photos.filter((p) => cat === "All" || p.category === cat);
  if (!photos.length) return null;

  return (
    <>
      {cats.length > 2 && (
        <div className="chips" role="tablist" aria-label="Photo categories">
          {cats.map((c) => (
            <button key={c} role="tab" aria-selected={cat === c} className={`chip${cat === c ? " on" : ""}`} onClick={() => { setCat(c); blip("tap"); }}>
              {c}
            </button>
          ))}
        </div>
      )}
      <div className="wall" tabIndex={0} aria-label="Photos, scroll sideways">
        {shown.map((p, i) =>
          p.type === "video" ? (
            <button key={p.id} className="reel" onClick={() => { setOpen(i); blip("open"); }} aria-label={`Play: ${p.title}`}>
              <span className="reel-screen">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={posterOf(p)} alt="" loading="lazy" decoding="async" />
                <i className="play" aria-hidden="true" />
              </span>
              <span className="reel-cap">{p.title}</span>
            </button>
          ) : (
            <button key={p.id} className="polaroid" style={{ ["--tilt" as string]: `${((i * 37) % 7) - 3}deg` }} onClick={() => { setOpen(i); blip("open"); }} aria-label={p.title || "Open photo"}>
              <span className="tape" aria-hidden="true" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.url} alt={p.title} loading="lazy" decoding="async" />
              {p.title && <span>{p.title}</span>}
            </button>
          )
        )}
      </div>
      <p className="wall-hint">Scroll sideways. Tap anything to open it.</p>
      {open !== null && <Lightbox items={shown} start={open} onClose={() => setOpen(null)} />}
    </>
  );
}
