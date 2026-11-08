"use client";

import { useState } from "react";
import PhoneFrame from "./PhoneFrame";
import Lightbox, { type Photo } from "./Lightbox";
import { blip } from "@/lib/sound";

export interface Story {
  name: string;
  note: string;
  designs: Photo[]; // posters and stories, shown inside phones
  photos: Photo[]; // photos from the day
}

/** One card per event: the graphics in phones on the left, the story and photos from the day beside them. */
export default function EventStories({ stories }: { stories: Story[] }) {
  const [lb, setLb] = useState<{ items: Photo[]; i: number } | null>(null);
  if (!stories.length) return null;
  return (
    <div className="stories">
      {stories.map((s, k) => {
        const all = [...s.designs, ...s.photos];
        return (
          <article className="story" key={s.name} style={{ ["--flip" as string]: k % 2 ? 1 : 0 }}>
            {s.designs.length > 0 && (
              <div className="story-phones">
                {s.designs.slice(0, 2).map((d, i) => (
                  <button key={d.id} className="phone-btn" onClick={() => { setLb({ items: all, i }); blip("open"); }} aria-label={`Open ${d.title}`}>
                    <PhoneFrame tilt={i === 0 ? -4 : 5} label="Event graphic">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={d.url} alt={d.title} loading="lazy" decoding="async" />
                    </PhoneFrame>
                  </button>
                ))}
              </div>
            )}
            <div className="story-body">
              <h3>{s.name}</h3>
              {s.note && <p>{s.note}</p>}
              <div className="story-shots">
                {s.photos.map((p, i) => (
                  <button key={p.id} className="shot" onClick={() => { setLb({ items: all, i: s.designs.length + i }); blip("open"); }} aria-label={`Open ${p.title}`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.url} alt={p.title} loading="lazy" decoding="async" />
                  </button>
                ))}
              </div>
            </div>
          </article>
        );
      })}
      {lb && <Lightbox items={lb.items} start={lb.i} onClose={() => setLb(null)} />}
    </div>
  );
}
