"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { SiteData } from "@/lib/types";
import { useToast } from "./useToast";
import SettingsPanel from "./SettingsPanel";
import AboutPanel from "./AboutPanel";
import CapabilitiesPanel from "./CapabilitiesPanel";
import EducationPanel from "./EducationPanel";
import ToolsPanel from "./ToolsPanel";
import HowItWorkPanel from "./HowItWorkPanel";
import ExperiencePanel from "./ExperiencePanel";
import ProjectsPanel from "./ProjectsPanel";
import ShowcasePanel from "./ShowcasePanel";
import LandingPanel from "./LandingPanel";
import SiteTextPanel from "./SiteTextPanel";
import TunnelsPanel from "./TunnelsPanel";
import VideosPanel from "./VideosPanel";

type TabId =
  | "home" | "tunnels"
  | "about" | "help" | "cases" | "freelance" | "experience" | "how"
  | "showcase" | "writing"
  | "education" | "tools" | "resume"
  | "contact" | "text" | "video";

interface TabDef { id: TabId; label: string; where: string; href: string }
interface GroupDef { label: string; page: string; tabs: TabDef[] }

// Each group is a page of your site. Each tab says exactly which part of that page it changes.
const GROUPS: GroupDef[] = [
  {
    label: "Home page",
    page: "The first page (/)",
    tabs: [
      { id: "home", label: "Home text", where: "The big heading, the intro line, the buttons and the strip at the bottom of the first page.", href: "/" },
      { id: "tunnels", label: "Tunnels", where: "The tunnel doors on the first page, and the text of each tunnel's own page. Also where you switch a tunnel on or off.", href: "/" },
    ],
  },
  {
    label: "Portfolio page",
    page: "The long page (/portfolio)",
    tabs: [
      { id: "about", label: "About", where: "The heading at the top of the page, the About paragraphs and the small facts beside them.", href: "/portfolio#about" },
      { id: "help", label: "What I take on", where: "The \"What I take on\" section: example asks in quotes, and capability cards. (Was called Capabilities.)", href: "/portfolio#help" },
      { id: "cases", label: "Case studies", where: "Each case study has its own page, plus a card in the Case studies section. (Was called Projects.)", href: "/portfolio#work" },
      { id: "freelance", label: "Freelance", where: "The Freelance section of the portfolio page and the resume.", href: "/portfolio#freelance" },
      { id: "experience", label: "Experience", where: "The Experience section of the portfolio page and the resume.", href: "/portfolio#experience" },
      { id: "how", label: "How I work", where: "The steps on the portfolio page. The same steps also show on every tunnel page.", href: "/portfolio#process" },
    ],
  },
  {
    label: "Tunnel pages",
    page: "Operations, Hospitality, Events, Writing (/lane/...)",
    tabs: [
      { id: "showcase", label: "Tunnel content", where: "Case study cards, testimonials and photos or clips for each tunnel. Case study cards also appear in the Case studies section of the portfolio page. (Was called Showcase.)", href: "/lane/operations#cases" },
      { id: "writing", label: "Writing", where: "The same as Tunnel content, but only for the Writing tunnel.", href: "/lane/writing" },
    ],
  },
  {
    label: "Resume",
    page: "The resume (/resume)",
    tabs: [
      { id: "education", label: "Education", where: "The Education block on the resume.", href: "/resume" },
      { id: "tools", label: "Tools", where: "The Tools block on the resume.", href: "/resume" },
      { id: "resume", label: "Resume preview", where: "The resume is built from your other tabs. Nothing to edit here, just check it.", href: "/resume" },
    ],
  },
  {
    label: "Whole site",
    page: "Every page",
    tabs: [
      { id: "contact", label: "Name & contact", where: "Your name, tagline, email, phone, LinkedIn. Used in the menu, the contact section, the resume and the WhatsApp button (it uses your phone number).", href: "/portfolio#contact" },
      { id: "text", label: "Menu, buttons & headings", where: "Every fixed heading, label and button on every page. Pick the page, find the text, edit.", href: "/" },
      { id: "video", label: "Intro video", where: "Your \"meet me\" video: upload it once and choose which pages show it.", href: "/portfolio#meet" },
    ],
  },
];

export default function AdminDashboard({
  initialData,
  userEmail,
}: {
  initialData: SiteData;
  userEmail: string;
}) {
  const [data, setData] = useState<SiteData>(initialData);
  const [tab, setTab] = useState<TabId>("home");
  const group = GROUPS.find((g) => g.tabs.some((t) => t.id === tab)) ?? GROUPS[0];
  const def = group.tabs.find((t) => t.id === tab) ?? group.tabs[0];
  const { toast, ToastEl } = useToast();
  const router = useRouter();
  const supabase = createClient();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="admin-page">
      <div className="wrap">
        <div className="admin-header">
          <div>
            <h1>Portfolio Admin</h1>
            <p
              style={{
                fontFamily: "var(--mono)",
                fontSize: 12,
                color: "var(--muted)",
                marginTop: 4,
              }}
            >
              Signed in as {userEmail}
            </p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <Link href="/" className="a-btn-ghost">
              View site ↗
            </Link>
            <button className="a-btn-ghost" onClick={handleLogout}>
              Log out
            </button>
          </div>
        </div>

        <div className="admin-tabs">
          {GROUPS.map((g) => (
            <button
              key={g.label}
              className={`admin-tab${group.label === g.label ? " active" : ""}`}
              onClick={() => setTab(g.tabs[0].id)}
            >
              {g.label}
            </button>
          ))}
        </div>
        <div className="admin-subtabs">
          {group.tabs.map((t) => (
            <button key={t.id} className={`admin-subtab${tab === t.id ? " active" : ""}`} onClick={() => setTab(t.id)}>
              {t.label}
            </button>
          ))}
        </div>
        <div className="a-hint">
          <div>
            <b>{def.label}</b>
            <span>Changes this part of: {group.page}</span>
            <p>{def.where}</p>
          </div>
          <a className="a-btn-ghost" href={def.href} target="_blank" rel="noopener">
            See it on the site ↗
          </a>
        </div>

        {tab === "contact" && (
          <SettingsPanel
            settings={data.settings}
            onSaved={(s) => setData((d) => ({ ...d, settings: s }))}
            toast={toast}
          />
        )}
        {tab === "about" && (
          <AboutPanel
            about={data.about}
            onSaved={(a) => setData((d) => ({ ...d, about: a }))}
            toast={toast}
          />
        )}
        {tab === "help" && (
          <CapabilitiesPanel
            capabilities={data.capabilities}
            problems={data.problems}
            onSaved={(capabilities, problems) =>
              setData((d) => ({ ...d, capabilities, problems }))
            }
            toast={toast}
          />
        )}
        {tab === "experience" && (
          <ExperiencePanel
            kind="experience"
            title="Experience"
            items={data.experience}
            onSaved={(items) => setData((d) => ({ ...d, experience: items }))}
            toast={toast}
          />
        )}
        {tab === "freelance" && (
          <ExperiencePanel
            kind="freelance"
            title="Freelance Work"
            items={data.freelance}
            onSaved={(items) => setData((d) => ({ ...d, freelance: items }))}
            toast={toast}
          />
        )}
        {tab === "home" && <LandingPanel toast={toast} />}
        {tab === "tunnels" && <TunnelsPanel toast={toast} />}
        {tab === "text" && <SiteTextPanel toast={toast} />}
        {tab === "video" && <VideosPanel toast={toast} />}
        {tab === "showcase" && <ShowcasePanel toast={toast} />}
        {tab === "writing" && (
          <>
            <p style={{ color: "var(--muted)", marginBottom: 18, fontSize: 14, lineHeight: 1.6 }}>
              Add your writing samples, pieces and pictures here. The Writing tunnel stays off the site
              until you switch it on in the <b>Tunnels</b> tab.
            </p>
            <ShowcasePanel toast={toast} onlyLane="writing" />
          </>
        )}
        {tab === "cases" && (
          <ProjectsPanel
            projects={data.projects}
            experience={[...data.experience, ...data.freelance]}
            onSaved={(projects) => setData((d) => ({ ...d, projects }))}
            toast={toast}
          />
        )}
        {tab === "education" && (
          <EducationPanel
            education={data.education}
            onSaved={(education) => setData((d) => ({ ...d, education }))}
            toast={toast}
          />
        )}
        {tab === "tools" && (
          <ToolsPanel
            tools={data.tools}
            onSaved={(tools) => setData((d) => ({ ...d, tools }))}
            toast={toast}
          />
        )}
        {tab === "how" && (
          <HowItWorkPanel
            howIWork={data.howIWork}
            onSaved={(howIWork) => setData((d) => ({ ...d, howIWork }))}
            toast={toast}
          />
        )}
        {tab === "resume" && (
          <div>
            <p
              style={{
                fontSize: 14,
                color: "var(--muted)",
                maxWidth: 560,
                lineHeight: 1.6,
                marginBottom: 20,
              }}
            >
              The resume is generated from the same Settings, About,
              Capabilities, Experience, Education, Tools, and featured
              Projects you edit in the other tabs — there&apos;s nothing
              separate to maintain here.
            </p>
            <Link href="/resume" target="_blank" className="a-btn-ghost">
              Preview Resume ↗
            </Link>
          </div>
        )}
      </div>
      {ToastEl}
    </div>
  );
}
