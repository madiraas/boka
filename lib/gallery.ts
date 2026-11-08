import type { ShowcaseItem } from "./types";
import type { Photo } from "@/components/Lightbox";
import type { Story } from "@/components/EventStories";

/**
 * Turns gallery rows into what the pages show.
 * Rows with a "group" (the Group name field in the admin) become an event story;
 * rows in the category "Designs" go in phones, other rows in that group are photos from the day.
 * Everything else goes in the photo wall.
 */
export function splitGallery(items: ShowcaseItem[], opts: { hide?: string[] } = {}) {
  const rows = items
    .filter((i) => i.kind === "gallery" && i.media_url && (i.media_type === "image" || i.media_type === "video"))
    .filter((i) => !(opts.hide ?? []).includes(i.client || ""));
  const toPhoto = (i: ShowcaseItem): Photo => ({
    id: i.id,
    url: i.media_url as string,
    title: i.title || "",
    category: i.client || "",
    type: i.media_type === "video" ? "video" : "image",
    group: i.metric_label || undefined,
    note: i.summary || undefined,
  });
  const photos = rows.map(toPhoto);
  const byGroup = new Map<string, Photo[]>();
  const loose: Photo[] = [];
  for (const p of photos) {
    if (p.group) byGroup.set(p.group, [...(byGroup.get(p.group) ?? []), p]);
    else loose.push(p);
  }
  const stories: Story[] = Array.from(byGroup.entries()).map(([name, list]) => ({
    name,
    note: list.find((p) => p.note)?.note || "",
    designs: list.filter((p) => p.category === "Designs"),
    photos: list.filter((p) => p.category !== "Designs"),
  }));
  return { stories, loose };
}
