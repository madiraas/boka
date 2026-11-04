import type { SupabaseClient } from "@supabase/supabase-js";
import { LANES, type Lane } from "./lanes";

/** The words and switches on the home page. Edited from the admin "Landing" tab, stored in content_blocks under the key "landing". */
export interface LandingContent {
  heading: string; // a new line in the box becomes a new line on the page
  subtext: string;
  resumeLabel: string;
  portfolioLabel: string;
  stripTitle: string;
  stripText: string;
  hiddenLanes: string[]; // lane ids to hide everywhere, e.g. ["writing"]
}

export const DEFAULT_LANDING: LandingContent = {
  heading: "Hello!\nWelcome to my career rollercoaster.",
  subtext:
    "I'm Madhura. I take the messy middle of a project and keep it moving, across operations, travel and events. Pick a tunnel below and I'll take you in.",
  resumeLabel: "View my resume",
  portfolioLabel: "See the full portfolio",
  stripTitle: "Open to freelance projects.",
  stripText: "Tell me what needs running and I'll tell you how I'd do it.",
  hiddenLanes: ["writing"],
};

export async function getLanding(supabase: SupabaseClient): Promise<LandingContent> {
  try {
    const { data, error } = await supabase
      .from("content_blocks")
      .select("value")
      .eq("key", "landing")
      .maybeSingle();
    if (error || !data?.value) return DEFAULT_LANDING;
    return mergeLanding(data.value as Partial<LandingContent>);
  } catch {
    return DEFAULT_LANDING;
  }
}

/** Anything left empty in the admin falls back to the default wording. */
export function mergeLanding(v: Partial<LandingContent>): LandingContent {
  const out: LandingContent = { ...DEFAULT_LANDING };
  (["heading", "subtext", "resumeLabel", "portfolioLabel", "stripTitle", "stripText"] as const).forEach((k) => {
    const x = v[k];
    if (typeof x === "string" && x.trim()) out[k] = x;
  });
  if (Array.isArray(v.hiddenLanes)) out.hiddenLanes = v.hiddenLanes.filter((x) => typeof x === "string");
  return out;
}

export function visibleLanes(c: LandingContent, lanes: Lane[] = LANES): Lane[] {
  const shown = lanes.filter((l) => !c.hiddenLanes.includes(l.id));
  return shown.length ? shown : lanes;
}
