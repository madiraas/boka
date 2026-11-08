"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { blip } from "@/lib/sound";

export interface Photo {
  id: string;
  url: string;
  title: string;
  category: string;
  type: "image" | "video";
  group?: string;
  note?: string;
}

export const posterOf = (p: Photo) => (p.type === "video" ? p.url.replace(/\.mp4$/i, ".jpg") : p.url);
const fullOf = (p: Photo) => (p.type === "image" ? p.url.replace(/\.jpg$/i, "-full.jpg") : p.url);

/** Full-screen viewer for photos and clips. Rendered into <body> so no section can clip it. */
export default function Lightbox({ items, start, onClose }: { items: Photo[]; start: number; onClose: () => void }) {
  const [i, setI] = useState(start);
  const [mounted, setMounted] = useState(false);
  const [useFallback, setUseFallback] = useState(false);
  const n = items.length;
  useEffect(() => setMounted(true), []);
  useEffect(() => setUseFallback(false), [i]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setI((x) => (x + 1) % n);
      if (e.key === "ArrowLeft") setI((x) => (x - 1 + n) % n);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [n, onClose]);
  if (!mounted || !n) return null;
  const cur = items[i];
  return createPortal(
    <div className="lightbox" onClick={onClose} role="dialog" aria-modal="true">
      <button className="lb-close" aria-label="Close" onClick={onClose}>
        &times;
      </button>
      {n > 1 && (
        <>
          <button className="lb-nav prev" aria-label="Previous" onClick={(e) => { e.stopPropagation(); setI((i - 1 + n) % n); blip("tick"); }}>
            &lsaquo;
          </button>
          <button className="lb-nav next" aria-label="Next" onClick={(e) => { e.stopPropagation(); setI((i + 1) % n); blip("tick"); }}>
            &rsaquo;
          </button>
        </>
      )}
      <figure onClick={(e) => e.stopPropagation()}>
        {cur.type === "video" ? (
          <video key={cur.id} src={cur.url} poster={posterOf(cur)} controls autoPlay playsInline />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={cur.id} src={useFallback ? cur.url : fullOf(cur)} alt={cur.title} onError={() => setUseFallback(true)} />
        )}
        {cur.title && <figcaption>{cur.title}</figcaption>}
      </figure>
    </div>,
    document.body
  );
}
