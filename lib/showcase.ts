import type { SupabaseClient } from "@supabase/supabase-js";
import type { ShowcaseItem, ShowcaseLane } from "./types";
import { LANES as LANE_COPY } from "./lanes";

export const LANES: {
  id: ShowcaseLane;
  label: string;
  href: string;
  tint: string;
  dot: string;
}[] = LANE_COPY.map((l) => ({
  id: l.id,
  label: l.label,
  href: `/lane/${l.id}`,
  tint: l.tint,
  dot: l.dot,
}));

export function laneOf(id: string) {
  return LANES.find((l) => l.id === id) || LANES[0];
}

/** Published case studies, testimonials and gallery items. Returns [] if the table is not set up yet. */
export async function getShowcase(supabase: SupabaseClient): Promise<ShowcaseItem[]> {
  try {
    const { data, error } = await supabase
      .from("showcase_items")
      .select("*")
      .eq("published", true)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });
    if (error || !data) return [];
    return data as ShowcaseItem[];
  } catch {
    return [];
  }
}

export function safeUrl(u: string | null | undefined): string {
  return typeof u === "string" && /^https?:\/\//i.test(u) ? u : "";
}

export function embedUrl(u: string | null | undefined): string {
  const url = safeUrl(u);
  if (!url) return "";
  let m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]{6,})/);
  if (m) return `https://www.youtube.com/embed/${m[1]}`;
  m = url.match(/vimeo\.com\/(\d+)/);
  if (m) return `https://player.vimeo.com/video/${m[1]}`;
  return url;
}
