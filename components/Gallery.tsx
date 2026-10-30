"use client";

import { useState } from "react";
import type { ShowcaseItem } from "@/lib/types";
import { embedUrl, safeUrl } from "@/lib/showcase";

/** Photos and videos from the field. Tap a photo to see it large. */
export default function Gallery({ items }: { items: ShowcaseItem[] }) {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <>
      <div className="gallery">
        {items.map((it) => {
          const url = safeUrl(it.media_url);
          if (!url) return null;
          if (it.media_type === "embed")
            return (
              <figure className="shot" key={it.id} style={{ cursor: "default" }}>
                <div className="vid">
                  <iframe src={embedUrl(url)} title={it.title || "Video"} loading="lazy" allowFullScreen />
                </div>
                {it.title && <figcaption>{it.title}</figcaption>}
              </figure>
            );
          if (it.media_type === "video")
            return (
              <figure className="shot" key={it.id} style={{ cursor: "default" }}>
                <video src={url} controls playsInline preload="metadata" />
                {it.title && <figcaption>{it.title}</figcaption>}
              </figure>
            );
          return (
            <button className="shot" key={it.id} onClick={() => setOpen(url)} aria-label={it.title || "Open photo"}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt={it.title || ""} loading="lazy" />
              {it.title && <figcaption>{it.title}</figcaption>}
            </button>
          );
        })}
      </div>
      {open && (
        <div className="lightbox" onClick={() => setOpen(null)}>
          <button aria-label="Close" onClick={() => setOpen(null)}>
            &times;
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={open} alt="" />
        </div>
      )}
    </>
  );
}
