"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { blip } from "@/lib/sound";

export interface Photo {
  id: string;
  url: string;
  title: string;
  category: string;
}

/** A scrapbook of photos: filter chips, tilted cards you can scroll sideways, tap for a large view. */
export default function PhotoWall({ photos }: { photos: Photo[] }) {
  const cats = useMemo(() => ["All", ...Array.from(new Set(photos.map((p) => p.category).filter(Boolean)))], [photos]);
  const [cat, setCat] = useState("All");
  const [open, setOpen] = useState<number | null>(null);
  const shown = photos.filter((p) => cat === "All" || p.category === cat);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") setOpen((i) => (i === null ? i : (i + 1) % shown.length));
      if (e.key === "ArrowLeft") setOpen((i) => (i === null ? i : (i - 1 + shown.length) % shown.length));
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, shown.length]);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!photos.length) return null;
  const cur = open !== null ? shown[open] : null;

  return (
    <>
      {cats.length > 2 && (
        <div className="chips" role="tablist" aria-label="Photo categories">
          {cats.map((c) => (
            <button
              key={c}
              role="tab"
              aria-selected={cat === c}
              className={`chip${cat === c ? " on" : ""}`}
              onClick={() => {
                setCat(c);
                blip("tap");
              }}
            >
              {c}
            </button>
          ))}
        </div>
      )}
      <div className="wall" tabIndex={0} aria-label="Photos, scroll sideways">
        {shown.map((p, i) => (
          <button
            key={p.id}
            className="polaroid"
            style={{ ["--tilt" as string]: `${((i * 37) % 7) - 3}deg` }}
            onClick={() => {
              setOpen(i);
              blip("open");
            }}
            aria-label={p.title || "Open photo"}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.url} alt={p.title} loading="lazy" decoding="async" />
            {p.title && <span>{p.title}</span>}
          </button>
        ))}
      </div>
      <p className="wall-hint">Scroll sideways. Tap a photo to see it larger.</p>
      {cur && mounted && createPortal(
        <div className="lightbox" onClick={() => setOpen(null)} role="dialog" aria-modal="true">
          <button className="lb-close" aria-label="Close" onClick={() => setOpen(null)}>
            &times;
          </button>
          {shown.length > 1 && (
            <>
              <button
                className="lb-nav prev"
                aria-label="Previous photo"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpen((open! - 1 + shown.length) % shown.length);
                  blip("tick");
                }}
              >
                &lsaquo;
              </button>
              <button
                className="lb-nav next"
                aria-label="Next photo"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpen((open! + 1) % shown.length);
                  blip("tick");
                }}
              >
                &rsaquo;
              </button>
            </>
          )}
          <figure onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={cur.url} alt={cur.title} />
            {cur.title && <figcaption>{cur.title}</figcaption>}
          </figure>
        </div>,
        document.body
      )}
    </>
  );
}
