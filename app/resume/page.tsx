import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getPublicSiteData } from "@/lib/data";
import PrintButton from "@/components/PrintButton";

export const revalidate = 0;
export const metadata: Metadata = { title: "Resume: Madhura Padman" };

export default async function ResumePage() {
  const supabase = createClient();
  const data = await getPublicSiteData(supabase);
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
          &larr; Back to portfolio
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

      <div className="r-sheet">
        {data.about.paragraphs[0] && (
          <section className="r-section">
            <h2>Profile</h2>
            <p className="r-profile">{data.about.paragraphs[0]}</p>
          </section>
        )}

        {data.capabilities.length > 0 && (
          <section className="r-section">
            <h2>Core capabilities</h2>
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
          <h2>Experience</h2>
          {rows(data.experience)}
        </section>

        {data.freelance.length > 0 && (
          <section className="r-section">
            <h2>Freelance work</h2>
            {rows(data.freelance)}
          </section>
        )}

        {featuredProjects.length > 0 && (
          <section className="r-section">
            <h2>Selected projects</h2>
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
            <h2>Education</h2>
            {data.education.map((e, i) => (
              <div className="r-edu-item" key={i}>
                <b>{e.degree}</b>
                <span>{e.institution}</span>
              </div>
            ))}
          </section>
          <section className="r-section">
            <h2>Tools</h2>
            <div className="r-tools">
              {data.tools.map((t, i) => (
                <span key={i}>{t}</span>
              ))}
            </div>
          </section>
        </div>
      </div>

      <p className="resume-print-hint">
        Choose &quot;Save as PDF&quot; above, then pick &quot;Save as PDF&quot; as the printer in the window
        that opens.
      </p>
    </div>
  );
}
