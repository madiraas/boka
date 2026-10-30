import { SupabaseClient } from "@supabase/supabase-js";
import {
  About,
  Capability,
  EducationItem,
  Experience,
  HowItem,
  Project,
  ProjectDocument,
  ProjectImage,
  Settings,
  SiteData,
} from "./types";

async function getBlock<T>(
  supabase: SupabaseClient,
  key: string,
  fallback: T
): Promise<T> {
  const { data, error } = await supabase
    .from("content_blocks")
    .select("value")
    .eq("key", key)
    .maybeSingle();
  if (error || !data) return fallback;
  return data.value as T;
}

const EMPTY_SETTINGS: Settings = {
  name: "",
  tagline: "",
  professionalTitle: "",
  email: "",
  phone: "",
  location: "",
  linkedin: "",
  homepageTagline: "",
  contactCTA: "",
};
const EMPTY_ABOUT: About = { heading: "", paragraphs: [], tags: [] };

/**
 * Fetches everything needed to render the PUBLIC site: only
 * published + public projects, and only their public images/docs.
 * This is the single query path the homepage, project pages, and
 * resume page all share, so there is one source of truth.
 */
export async function getPublicSiteData(
  supabase: SupabaseClient
): Promise<SiteData> {
  const [
    settings,
    about,
    capabilities,
    problems,
    education,
    tools,
    howIWork,
    experienceRes,
    projectsRes,
  ] = await Promise.all([
    getBlock<Settings>(supabase, "settings", EMPTY_SETTINGS),
    getBlock<About>(supabase, "about", EMPTY_ABOUT),
    getBlock<Capability[]>(supabase, "capabilities", []),
    getBlock<string[]>(supabase, "problems", []),
    getBlock<EducationItem[]>(supabase, "education", []),
    getBlock<string[]>(supabase, "tools", []),
    getBlock<HowItem[]>(supabase, "howIWork", []),
    supabase.from("experience").select("*").order("sort_order"),
    supabase
      .from("projects")
      .select("*")
      .eq("status", "published")
      .eq("visibility", "public")
      .order("sort_order"),
  ]);

  const allExperience = (experienceRes.data ?? []) as Experience[];

  return {
    settings,
    about,
    capabilities,
    problems,
    education,
    tools,
    howIWork,
    experience: allExperience.filter((e) => e.kind === "experience"),
    freelance: allExperience.filter((e) => e.kind === "freelance"),
    projects: (projectsRes.data ?? []) as Project[],
  };
}

/** A single published + public project by slug, or null if it doesn't
 *  qualify for public viewing (draft, private, or missing). */
export async function getPublicProjectBySlug(
  supabase: SupabaseClient,
  slug: string
): Promise<{
  project: Project;
  images: ProjectImage[];
  documents: ProjectDocument[];
} | null> {
  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .eq("visibility", "public")
    .maybeSingle();

  if (!project) return null;

  const [imagesRes, docsRes] = await Promise.all([
    supabase
      .from("project_images")
      .select("*")
      .eq("project_id", project.id)
      .eq("visibility", "public")
      .order("sort_order"),
    supabase
      .from("project_documents")
      .select("*")
      .eq("project_id", project.id)
      .eq("visibility", "public")
      .order("sort_order"),
  ]);

  return {
    project: project as Project,
    images: (imagesRes.data ?? []) as ProjectImage[],
    documents: (docsRes.data ?? []) as ProjectDocument[],
  };
}

/**
 * Fetches EVERYTHING for the admin dashboard: every project
 * regardless of status/visibility, and every experience row.
 * Only safe to call for an authenticated request - RLS still
 * enforces this server-side even if this function is ever called
 * from a page that forgot to check the session.
 */
export async function getAdminSiteData(
  supabase: SupabaseClient
): Promise<SiteData> {
  const [
    settings,
    about,
    capabilities,
    problems,
    education,
    tools,
    howIWork,
    experienceRes,
    projectsRes,
  ] = await Promise.all([
    getBlock<Settings>(supabase, "settings", EMPTY_SETTINGS),
    getBlock<About>(supabase, "about", EMPTY_ABOUT),
    getBlock<Capability[]>(supabase, "capabilities", []),
    getBlock<string[]>(supabase, "problems", []),
    getBlock<EducationItem[]>(supabase, "education", []),
    getBlock<string[]>(supabase, "tools", []),
    getBlock<HowItem[]>(supabase, "howIWork", []),
    supabase.from("experience").select("*").order("sort_order"),
    supabase.from("projects").select("*").order("sort_order"),
  ]);

  const allExperience = (experienceRes.data ?? []) as Experience[];

  return {
    settings,
    about,
    capabilities,
    problems,
    education,
    tools,
    howIWork,
    experience: allExperience.filter((e) => e.kind === "experience"),
    freelance: allExperience.filter((e) => e.kind === "freelance"),
    projects: (projectsRes.data ?? []) as Project[],
  };
}

export async function getAdminProjectAssets(
  supabase: SupabaseClient,
  projectId: string
): Promise<{ images: ProjectImage[]; documents: ProjectDocument[] }> {
  const [imagesRes, docsRes] = await Promise.all([
    supabase
      .from("project_images")
      .select("*")
      .eq("project_id", projectId)
      .order("sort_order"),
    supabase
      .from("project_documents")
      .select("*")
      .eq("project_id", projectId)
      .order("sort_order"),
  ]);
  return {
    images: (imagesRes.data ?? []) as ProjectImage[],
    documents: (docsRes.data ?? []) as ProjectDocument[],
  };
}
