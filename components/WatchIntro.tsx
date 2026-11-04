"use client";

import { useRef, useState } from "react";
import VideoBlock from "./VideoBlock";
import type { VideoItem } from "@/lib/videos";

/** A button that opens the intro video in a pop-up, so the page itself stays uncluttered. */
export default function WatchIntro({ item, label }: { item: VideoItem; label: string }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className="pill-btn line big"
        onClick={() => {
          setOpen(true);
          ref.current?.showModal();
        }}
      >
        {label}
      </button>
      <dialog
        ref={ref}
        className="watch-dialog"
        onClose={() => setOpen(false)}
        onClick={(e) => {
          if (e.target === ref.current) ref.current?.close();
        }}
      >
        <button type="button" className="watch-close" aria-label="Close video" onClick={() => ref.current?.close()}>
          ×
        </button>
        {open && <VideoBlock item={item} autoPlay />}
      </dialog>
    </>
  );
}
