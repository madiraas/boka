import type { SupabaseClient } from "@supabase/supabase-js";
import type { HowItem, Settings } from "./types";
import { PROCESS, contactFrom, mergeLanes, type Lane } from "./lanes";
import { mergeLanding, visibleLanes, type LandingContent } from "./landing";
import { makeT, mergeCopy, type Copy } from "./sitecopy";
import { mergeVideos, type VideoConfig, type VideoItem } from "./videos";

const KEYS = ["settings", "landing", "sitecopy", "lanes", "videos", "howIWork"];

export interface Site {
  settings: Partial<Settings>;
  landing: LandingContent;
  allLanes: Lane[]; // every tunnel, with your edits
  lanes: Lane[]; // only the tunnels switched on
  copy: Copy; // every heading and label, with your edits
  t: (key: string) => string;
  contact: ReturnType<typeof contactFrom>;
  videos: VideoConfig;
  steps: { title: string; text: string }[]; // "How I work" steps
}

/** One round trip for everything the public pages need that is editable from the admin. */
export async function getSite(supabase: SupabaseClient): Promise<Site> {
  let rows: { key: string; value: unknown }[] = [];
  try {
    const { data } = await supabase.from("content_blocks").select("key,value").in("key", KEYS);
    rows = (data ?? []) as { key: string; value: unknown }[];
  } catch {}
  const get = (k: string): unknown => rows.find((r) => r.key === k)?.value;

  const settings = (get("settings") as Partial<Settings> | undefined) ?? {};
  const landing = mergeLanding((get("landing") as object | undefined) ?? {});
  const allLanes = mergeLanes(get("lanes"));
  const copy = mergeCopy(get("sitecopy"));
  const how = get("howIWork");
  const steps =
    Array.isArray(how) && how.length
      ? (how as HowItem[]).map((h) => ({ title: h.title, text: h.desc }))
      : PROCESS;

  return {
    settings,
    landing,
    allLanes,
    lanes: visibleLanes(landing, allLanes),
    copy,
    t: makeT(copy),
    contact: contactFrom(settings),
    videos: mergeVideos(get("videos")),
    steps,
  };
}

export type { VideoItem };
