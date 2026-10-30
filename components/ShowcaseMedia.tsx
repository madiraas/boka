import type { ShowcaseItem } from "@/lib/types";
import { embedUrl, safeUrl } from "@/lib/showcase";

/** Picture, uploaded video or YouTube/Vimeo embed for one showcase item. */
export default function ShowcaseMedia({ item }: { item: ShowcaseItem }) {
  const url = safeUrl(item.media_url);
  if (!url) return null;
  if (item.media_type === "video") {
    return <video src={url} controls playsInline preload="metadata" />;
  }
  if (item.media_type === "embed") {
    return (
      <iframe
        src={embedUrl(url)}
        title={item.title || "Video"}
        loading="lazy"
        allow="fullscreen; picture-in-picture"
        allowFullScreen
      />
    );
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={url} alt={item.title || ""} loading="lazy" />;
}
