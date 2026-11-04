import { safeUrl } from "./showcase";

/** One video: either a file uploaded to Supabase ("upload") or a YouTube / Vimeo link ("embed"). */
export interface VideoItem {
  url: string;
  kind: "upload" | "embed";
  poster?: string; // cover picture shown before play (uploads only)
  title?: string;
  caption?: string;
}

export interface VideoConfig {
  intro: VideoItem | null; // the "meet me" video
  showHome: boolean; // "Watch my intro" button on the home page
  showPortfolio: boolean; // block near the top of the portfolio page
  showResume: boolean; // block at the top of the resume page (hidden when printing)
  showTunnels: boolean; // show the intro on tunnel pages that have no video of their own
  lanes: Record<string, VideoItem | null>; // a video for one tunnel page
}

export const DEFAULT_VIDEOS: VideoConfig = {
  intro: null,
  showHome: true,
  showPortfolio: true,
  showResume: true,
  showTunnels: false,
  lanes: {},
};

function item(v: unknown): VideoItem | null {
  if (!v || typeof v !== "object") return null;
  const o = v as Record<string, unknown>;
  const url = safeUrl(typeof o.url === "string" ? o.url : "");
  if (!url) return null;
  const s = (x: unknown) => (typeof x === "string" && x.trim() ? x.trim() : undefined);
  return {
    url,
    kind: o.kind === "embed" ? "embed" : "upload",
    poster: safeUrl(typeof o.poster === "string" ? o.poster : "") || undefined,
    title: s(o.title),
    caption: s(o.caption),
  };
}

export function mergeVideos(raw: unknown): VideoConfig {
  const o = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const b = (x: unknown, d: boolean) => (typeof x === "boolean" ? x : d);
  const lanes: Record<string, VideoItem | null> = {};
  if (o.lanes && typeof o.lanes === "object") {
    for (const [k, v] of Object.entries(o.lanes as Record<string, unknown>)) lanes[k] = item(v);
  }
  return {
    intro: item(o.intro),
    showHome: b(o.showHome, true),
    showPortfolio: b(o.showPortfolio, true),
    showResume: b(o.showResume, true),
    showTunnels: b(o.showTunnels, false),
    lanes,
  };
}
