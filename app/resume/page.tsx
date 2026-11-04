import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getPublicSiteData } from "@/lib/data";
import PrintButton from "@/components/PrintButton";
import VideoBlock from "@/components/VideoBlock";
import { getSite } from "@/lib/site";

export const revalidate = 0;
export const metadata: Metadata = { title: "Resume: Madhura Padman" };

export default async function ResumePage() {
  const supabase = createClient();
  const data = await getPublicSiteData(supabase);
  const site = await getSite(supabase);
  const t = site.t;
  const s = data.settings;
  const featuredProjects = data.projects.filter(
    (p) => p.featured && p.status === "published"
  );

  const rows = (
    list: { org: string; role: string; dates: string; responsibilities: string }[]
  ) =>
    list.map((e, i) => (
      <div className="r-exp-item" key={i}>
        <div className="r-exp-head">
          <div className="r-exp-left">
            <b>{e.org}</b>
            <span className="r-role">{e.role}</span>
          </div>
          <span className="r-exp-dates">{e.dates}</span>
        </div>
        <p>{e.responsibilities}</p>
      </div>
    ));

  return (
    <div className="page" style={{ paddingTop: 0 }}>
      <div className="resume-bar">
        <Link href="/portfolio" className="pill-btn">
          &larr; {t("resume.back")}
        </Link>
        <Link href="/" className="brand">
          {s.name || "Madhura Padman"}
        </Link>
        <PrintButton />
      </div>

      <header className="r-head">
        <div className="wrap">
          <h1 className="r-name">{s.name}</h1>
          {s.tagline && <p className="r-tag">{s.tagline}</p>}
          <div className="r-contact">
            {s.professionalTitle && <span>{s.professionalTitle}</span>}
            {s.email && <a href={`mailto:${s.email}`}>{s.email}</a>}
            {s.phone && <a href={`tel:${s.phone.replace(/\s/g, "")}`}>{s.phone}</a>}
            {s.location && <span>{s.location}</span>}
          </div>
        </div>
      </header>

      {site.videos.intro && site.videos.showResume && (
        <div className="r-video">
          <VideoBlock item={site.videos.intro} heading={t("resume.videoTitle")} />
        </div>
      )}

      <div className="r-sheet">
        {data.about.paragraphs[0] && (
          <section className="r-section">
            <h2>{t("resume.profile")}</h2>
            <p className="r-profile">{data.about.paragraphs[0]}</p>
          </section>
        )}

        {data.capabilities.length > 0 && (
          <section className="r-section">
            <h2>{t("resume.caps")}</h2>
            <div className="r-caps">
              {data.capabilities.map((c, i) => (
                <span className="r-cap-pill" key={i}>
                  {c.title}
                </span>
              ))}
            </div>
          </section>
        )}

        <section className="r-section">
          <h2>{t("resume.exp")}</h2>
          {rows(data.experience)}
        </section>

        {data.freelance.length > 0 && (
          <section className="r-section">
            <h2>{t("resume.free")}</h2>
            {rows(data.freelance)}
          </section>
        )}

        {featuredProjects.length > 0 && (
          <section className="r-section">
            <h2>{t("resume.projects")}</h2>
            {featuredProjects.map((p) => (
              <div className="r-exp-item" key={p.id}>
                <div className="r-exp-head">
                  <b>{p.title}</b>
                </div>
                <p>{p.output || p.short_desc || ""}</p>
              </div>
            ))}
          </section>
        )}

        <div className="r-two-col">
          <section className="r-section">
            <h2>{t("resume.edu")}</h2>
            {data.education.map((e, i) => (
              <div className="r-edu-item" key={i}>
                <b>{e.degree}</b>
                <span>{e.institution}</span>
              </div>
            ))}
          </section>
          <section className="r-section">
            <h2>{t("resume.tools")}</h2>
            <div className="r-tools">
              {data.tools.map((t, i) => (
                <span key={i}>{t}</span>
              ))}
            </div>
          </section>
        </div>
      </div>

      <p className="resume-print-hint">
        {t("resume.hint")}
      </p>
    </div>
  );
}
