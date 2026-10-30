export type Visibility = "public" | "private";
export type ProjectStatus = "draft" | "coming-soon" | "published";
export type ExperienceKind = "experience" | "freelance";

export interface Settings {
  name: string;
  tagline: string;
  professionalTitle: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  homepageTagline: string;
  contactCTA: string;
}

export interface AboutTag {
  label: string;
  value: string;
}

export interface About {
  heading: string;
  paragraphs: string[];
  tags: AboutTag[];
}

export interface Capability {
  title: string;
  desc: string;
}

export interface EducationItem {
  degree: string;
  institution: string;
}

export interface HowItem {
  title: string;
  desc: string;
}

export interface Experience {
  id: string;
  kind: ExperienceKind;
  org: string;
  role: string;
  dates: string;
  context: string;
  responsibilities: string;
  demonstrates: string;
  sort_order: number;
}

export interface LinkItem {
  label: string;
  url: string;
  visibility: Visibility;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  org: string;
  category: string;
  type: string;
  date: string;
  short_desc: string;
  situation: string;
  problem: string;
  role: string;
  what_i_did: string;
  process: string;
  output: string;
  outcome: string;
  skills: string[];
  tools_used: string[];
  links: LinkItem[];
  featured: boolean;
  visibility: Visibility;
  status: ProjectStatus;
  sort_order: number;
  related_experience_id: string | null;
}

export interface ProjectImage {
  id: string;
  project_id: string;
  url: string;
  caption: string;
  visibility: Visibility;
  sort_order: number;
}

export interface ProjectDocument {
  id: string;
  project_id: string;
  url: string;
  label: string;
  visibility: Visibility;
  sort_order: number;
}

export interface SiteData {
  settings: Settings;
  about: About;
  capabilities: Capability[];
  problems: string[];
  education: EducationItem[];
  tools: string[];
  howIWork: HowItem[];
  experience: Experience[];
  freelance: Experience[];
  projects: Project[];
}

export type ShowcaseLane = "operations" | "hospitality" | "events" | "writing";
export type ShowcaseKind = "case_study" | "testimonial" | "gallery";
export type ShowcaseMedia = "image" | "video" | "embed";

export interface ShowcaseItem {
  id: string;
  lane: ShowcaseLane;
  kind: ShowcaseKind;
  title: string | null;
  client: string | null;
  summary: string | null;
  metric: string | null;
  metric_label: string | null;
  quote: string | null;
  author: string | null;
  author_role: string | null;
  media_url: string | null;
  media_type: ShowcaseMedia | null;
  sort_order: number;
  published: boolean;
  created_at?: string;
}
