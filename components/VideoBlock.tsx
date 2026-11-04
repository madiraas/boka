import type { VideoItem } from "@/lib/videos";
import { embedUrl, safeUrl } from "@/lib/showcase";

/** A video from Supabase (plays in the page) or a YouTube / Vimeo link. */
export default function VideoBlock({
  item,
  heading,
  autoPlay = false,
}: {
  item: VideoItem;
  heading?: string;
  autoPlay?: boolean;
}) {
  const url = safeUrl(item.url);
  if (!url) return null;
  let src = embedUrl(url);
  if (autoPlay && item.kind === "embed") src += (src.includes("?") ? "&" : "?") + "autoplay=1";
  return (
    <figure className="vid-card">
      {heading && <figcaption className="vid-heading">{heading}</figcaption>}
      <div className="vid-frame">
        {item.kind === "embed" ? (
          <iframe
            src={src}
            title={item.title || "Video"}
            loading="lazy"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <video
            src={url}
            poster={safeUrl(item.poster) || undefined}
            controls
            playsInline
            preload="metadata"
            autoPlay={autoPlay}
          />
        )}
      </div>
      {(item.title || item.caption) && (
        <figcaption className="vid-cap">
          {item.title && <b>{item.title}</b>}
          {item.caption && <span>{item.caption}</span>}
        </figcaption>
      )}
    </figure>
  );
}
