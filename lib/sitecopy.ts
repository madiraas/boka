// Every piece of fixed text on the public site (headings, labels, buttons) lives here as a default.
// Anything you change in the admin ("Menu, buttons & headings" tab) is saved to Supabase and wins over the default.
// A field left empty in the admin falls back to the default below.

export type PageId = "menu" | "home" | "portfolio" | "tunnel" | "project" | "resume";

export const COPY_PAGES: { id: PageId; label: string; path: string; note: string }[] = [
  { id: "menu", label: "Menu & browser title", path: "/portfolio", note: "The top menu on every page, and the title that shows in the browser tab and on Google." },
  { id: "home", label: "Home page", path: "/", note: "The first page: your photo, the tunnels and the strip at the bottom." },
  { id: "portfolio", label: "Portfolio page", path: "/portfolio", note: "The long page with About, Case studies, Experience, How I work and Contact." },
  { id: "tunnel", label: "Tunnel pages", path: "/lane/operations", note: "The headings that repeat on every tunnel page (Operations, Hospitality, Events). The tunnel's own text is in the Tunnels tab." },
  { id: "project", label: "Case study pages", path: "/portfolio#work", note: "The labels on a single case study page." },
  { id: "resume", label: "Resume page", path: "/resume", note: "The section headings on the resume." },
];

export interface CopyField {
  key: string;
  page: PageId;
  section: string;
  label: string;
  value: string;
  long?: boolean;
}

const F: CopyField[] = [];
function f(page: PageId, section: string, key: string, label: string, value: string, long = false) {
  F.push({ key, page, section, label, value, long });
}

// ---- Menu and browser title
f("menu", "Top menu", "nav.home", "Link to the home page", "The ride");
f("menu", "Top menu", "nav.portfolio", "Link to the portfolio page", "Portfolio");
f("menu", "Top menu", "nav.cases", "Link to case studies", "Case studies");
f("menu", "Top menu", "nav.contact", "Link to contact", "Contact");
f("menu", "Top menu", "nav.resume", "Resume button", "Resume");
f("menu", "Browser tab and Google", "site.title", "Site title", "Madhura Padman: Operations and coordination for travel, hospitality and events");
f("menu", "Browser tab and Google", "site.description", "Site description (one or two sentences)", "Madhura Padman runs projects across operations, travel, hospitality and events, from the first brief to the finished thing.", true);

// ---- Home page (the main hero text is in the "Home page" tab)
f("home", "Video button", "home.watch", "Button that opens your intro video", "Watch my intro");
f("home", "Bottom strip", "home.stripWhatsapp", "WhatsApp button", "WhatsApp me");
f("home", "Bottom strip", "home.stripEmail", "Email button", "Email");

// ---- Portfolio page
f("portfolio", "Top of the page", "port.btnResume", "Resume button", "View my resume");
f("portfolio", "Top of the page", "port.btnWhatsapp", "WhatsApp button", "WhatsApp me");
f("portfolio", "Video", "port.videoTitle", "Heading above your intro video", "Prefer to watch?");
f("portfolio", "Jump bar", "port.jump.about", "Jump link: About", "About");
f("portfolio", "Jump bar", "port.jump.help", "Jump link: What I take on", "What I do");
f("portfolio", "Jump bar", "port.jump.work", "Jump link: Case studies", "Case studies");
f("portfolio", "Jump bar", "port.jump.exp", "Jump link: Experience", "Experience");
f("portfolio", "Jump bar", "port.jump.process", "Jump link: How I work", "Process");
f("portfolio", "Jump bar", "port.jump.contact", "Jump link: Contact", "Contact");
f("portfolio", "About section", "port.about.kicker", "Small label above About", "About");
f("portfolio", "What I take on section", "port.help.kicker", "Small label", "What I take on");
f("portfolio", "What I take on section", "port.help.title", "Heading", "What you can hand me");
f("portfolio", "Case studies section", "port.work.kicker", "Small label", "Case studies");
f("portfolio", "Case studies section", "port.work.title", "Heading", "Projects I ran");
f("portfolio", "Case studies section", "port.work.lede", "Line under the heading", "Open a case study, or pick a tunnel to see everything for that kind of work.", true);
f("portfolio", "Case studies section", "port.work.read", "Link on each case study card", "Read the case study");
f("portfolio", "Case studies section", "port.badge.soon", "Badge on unfinished case studies", "Coming soon");
f("portfolio", "Freelance section", "port.free.kicker", "Small label", "Freelance and ground work");
f("portfolio", "Freelance section", "port.free.title", "Heading", "Freelance");
f("portfolio", "Experience section", "port.exp.kicker", "Small label", "Experience");
f("portfolio", "Experience section", "port.exp.title", "Heading", "Where I have worked");
f("portfolio", "Experience section", "port.exp.context", "Label for the context line", "Context");
f("portfolio", "Experience section", "port.exp.did", "Label for the responsibilities line", "What I did");
f("portfolio", "How I work section", "port.proc.kicker", "Small label", "How I work");
f("portfolio", "How I work section", "port.proc.title", "Heading", "How a project runs");
f("portfolio", "Empty state", "invite.title", "Heading shown when there are no case studies yet", "No case studies published here yet.");
f("portfolio", "Empty state", "invite.text", "Text shown when there are no case studies yet", "Ask me for examples that match what you need.", true);
f("portfolio", "Empty state", "invite.button", "Button shown when there are no case studies yet", "Ask for examples");
f("portfolio", "Contact section (bottom)", "contact.title", "Heading", "Got a project that needs someone to run it?");
f("portfolio", "Contact section (bottom)", "contact.lede", "Line under the heading", "Send it as it is, even half-formed. I will write back with how I would run it.", true);
f("portfolio", "Contact section (bottom)", "contact.whatsapp", "WhatsApp button", "WhatsApp me");
f("portfolio", "Contact section (bottom)", "contact.linkedin", "LinkedIn button", "LinkedIn");
f("portfolio", "Contact section (bottom)", "contact.resume", "Resume link", "Read my resume");

// ---- Tunnel pages
f("tunnel", "Top", "lane.back", "Link back to the home page", "Back to the ride");
f("tunnel", "Top", "lane.cta1", "First button", "Work with me on WhatsApp");
f("tunnel", "Top", "lane.cta2", "Second button", "Send an email");
f("tunnel", "Top", "lane.cta3", "Third button", "View my resume");
f("tunnel", "Jump bar", "lane.jump.offer", "Jump link: What I take on", "What I take on");
f("tunnel", "Jump bar", "lane.jump.cases", "Jump link: Case studies", "Case studies");
f("tunnel", "Jump bar", "lane.jump.voices", "Jump link: Testimonials", "What people say");
f("tunnel", "Jump bar", "lane.jump.field", "Jump link: Photos and clips", "From the field");
f("tunnel", "Jump bar", "lane.jump.roles", "Jump link: Roles", "Where I have done this");
f("tunnel", "Jump bar", "lane.jump.contact", "Jump link: Contact", "Contact");
f("tunnel", "Video", "lane.videoTitle", "Heading above the tunnel video", "Watch");
f("tunnel", "What I take on section", "lane.offer.kicker", "Small label", "What I can take on");
f("tunnel", "What I take on section", "lane.offer.title", "Heading", "The work I take on");
f("tunnel", "Case studies section", "lane.cases.kicker", "Small label", "Case studies");
f("tunnel", "Case studies section", "lane.cases.title", "Heading", "Selected work");
f("tunnel", "Case studies section", "lane.cases.titleWriting", "Heading on the Writing tunnel", "Pieces and projects");
f("tunnel", "Testimonials section", "lane.voices.kicker", "Small label", "Testimonials");
f("tunnel", "Testimonials section", "lane.voices.title", "Heading", "What people say");
f("tunnel", "Photos and clips section", "lane.field.kicker", "Small label", "From the field");
f("tunnel", "Photos and clips section", "lane.field.title", "Heading", "Photos and clips");
f("tunnel", "Roles section", "lane.roles.kicker", "Small label", "Where I have done this");
f("tunnel", "Roles section", "lane.roles.title", "Heading", "Roles");
f("tunnel", "Projects section", "lane.proj.kicker", "Small label", "Projects");
f("tunnel", "Projects section", "lane.proj.title", "Heading", "What I built and ran");
f("tunnel", "Projects section", "lane.proj.kickerWriting", "Small label on the Writing tunnel", "What I am writing about");
f("tunnel", "Projects section", "lane.proj.titleWriting", "Heading on the Writing tunnel", "The stories I am after");
f("tunnel", "Projects section", "lane.writingNote", "Note under the Writing projects", "The first reported piece, from the Andaman Islands, is in progress. Published work will appear above as soon as it exists.", true);
f("tunnel", "How it runs section", "lane.proc.kicker", "Small label", "How we would work");
f("tunnel", "How it runs section", "lane.proc.title", "Heading (the steps themselves are in the How I work tab)", "How a project runs");
f("tunnel", "Contact section (bottom)", "lane.contact.title", "Heading", "Got something that needs running?");
f("tunnel", "Contact section (bottom)", "lane.contact.lede", "Line under the heading", "Send it as it is, even half-formed. I will write back with how I would run it.", true);
f("tunnel", "Contact section (bottom)", "lane.contact.portfolio", "Link to the portfolio", "See the full portfolio");

// ---- Case study pages
f("project", "Top", "project.back", "Link back", "Back to case studies");
f("project", "Top", "project.badge", "Badge on unfinished case studies", "Coming soon");
f("project", "Labels", "project.situation", "Label: situation", "Situation");
f("project", "Labels", "project.problem", "Label: problem", "Problem");
f("project", "Labels", "project.role", "Label: your role", "My role");
f("project", "Labels", "project.did", "Label: what you did", "What I did");
f("project", "Labels", "project.process", "Label: process", "Process");
f("project", "Labels", "project.output", "Label: output", "Output");
f("project", "Labels", "project.result", "Label: result", "Result");
f("project", "Labels", "project.skills", "Label: skills", "Skills");
f("project", "Buttons", "project.view", "Default link button text", "View");
f("project", "Buttons", "project.viewDoc", "Default document button text", "View document");

// ---- Resume page
f("resume", "Top bar", "resume.back", "Back button", "Back to portfolio");
f("resume", "Video", "resume.videoTitle", "Heading above your intro video", "Watch the short version");
f("resume", "Headings", "resume.profile", "Profile", "Profile");
f("resume", "Headings", "resume.caps", "Core capabilities", "Core capabilities");
f("resume", "Headings", "resume.exp", "Experience", "Experience");
f("resume", "Headings", "resume.free", "Freelance work", "Freelance work");
f("resume", "Headings", "resume.projects", "Selected projects", "Selected projects");
f("resume", "Headings", "resume.edu", "Education", "Education");
f("resume", "Headings", "resume.tools", "Tools", "Tools");
f("resume", "Bottom", "resume.hint", "Hint under the resume", "Choose \"Save as PDF\" above, then pick \"Save as PDF\" as the printer in the window that opens.", true);

export const COPY_FIELDS: CopyField[] = F;

export type Copy = Record<string, string>;

export const COPY_DEFAULTS: Copy = Object.fromEntries(F.map((x) => [x.key, x.value]));

/** Defaults, with anything saved in the admin laid on top. Empty saved values are ignored. */
export function mergeCopy(raw: unknown): Copy {
  const out: Copy = { ...COPY_DEFAULTS };
  if (raw && typeof raw === "object") {
    for (const [k, v] of Object.entries(raw as Record<string, unknown>)) {
      if (k in COPY_DEFAULTS && typeof v === "string" && v.trim()) out[k] = v;
    }
  }
  return out;
}

/** t("nav.home") returns the text for that key. Works with a full map or a partial one. */
export function makeT(copy?: Record<string, string> | null) {
  return (key: string): string => {
    const v = copy?.[key];
    if (typeof v === "string" && v !== "") return v;
    return COPY_DEFAULTS[key] ?? key;
  };
}
