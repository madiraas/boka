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

const TABS = [
  "Settings",
  "About",
  "Capabilities",
  "Experience",
  "Freelance",
  "Projects",
  "Showcase",
  "Education",
  "Tools",
  "How I Work",
  "Resume",
] as const;
type Tab = (typeof TABS)[number];

export default function AdminDashboard({
  initialData,
  userEmail,
}: {
  initialData: SiteData;
  userEmail: string;
}) {
  const [data, setData] = useState<SiteData>(initialData);
  const [tab, setTab] = useState<Tab>("Settings");
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
          {TABS.map((t) => (
            <button
              key={t}
              className={`admin-tab${tab === t ? " active" : ""}`}
              onClick={() => setTab(t)}
            >
              {t}
            </button>
          ))}
        </div>

        {tab === "Settings" && (
          <SettingsPanel
            settings={data.settings}
            onSaved={(s) => setData((d) => ({ ...d, settings: s }))}
            toast={toast}
          />
        )}
        {tab === "About" && (
          <AboutPanel
            about={data.about}
            onSaved={(a) => setData((d) => ({ ...d, about: a }))}
            toast={toast}
          />
        )}
        {tab === "Capabilities" && (
          <CapabilitiesPanel
            capabilities={data.capabilities}
            problems={data.problems}
            onSaved={(capabilities, problems) =>
              setData((d) => ({ ...d, capabilities, problems }))
            }
            toast={toast}
          />
        )}
        {tab === "Experience" && (
          <ExperiencePanel
            kind="experience"
            title="Experience"
            items={data.experience}
            onSaved={(items) => setData((d) => ({ ...d, experience: items }))}
            toast={toast}
          />
        )}
        {tab === "Freelance" && (
          <ExperiencePanel
            kind="freelance"
            title="Freelance Work"
            items={data.freelance}
            onSaved={(items) => setData((d) => ({ ...d, freelance: items }))}
            toast={toast}
          />
        )}
        {tab === "Showcase" && <ShowcasePanel toast={toast} />}
        {tab === "Projects" && (
          <ProjectsPanel
            projects={data.projects}
            experience={[...data.experience, ...data.freelance]}
            onSaved={(projects) => setData((d) => ({ ...d, projects }))}
            toast={toast}
          />
        )}
        {tab === "Education" && (
          <EducationPanel
            education={data.education}
            onSaved={(education) => setData((d) => ({ ...d, education }))}
            toast={toast}
          />
        )}
        {tab === "Tools" && (
          <ToolsPanel
            tools={data.tools}
            onSaved={(tools) => setData((d) => ({ ...d, tools }))}
            toast={toast}
          />
        )}
        {tab === "How I Work" && (
          <HowItWorkPanel
            howIWork={data.howIWork}
            onSaved={(howIWork) => setData((d) => ({ ...d, howIWork }))}
            toast={toast}
          />
        )}
        {tab === "Resume" && (
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
