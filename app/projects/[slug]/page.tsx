import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getPublicProjectBySlug } from "@/lib/data";
import Nav from "@/components/Nav";

export const revalidate = 0;

async function loadProject(slug: string) {
  const supabase = createClient();
  return getPublicProjectBySlug(supabase, slug);
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const result = await loadProject(params.slug);
  if (!result) return { title: "Project not found" };
  const { project } = result;
  return {
    title: `${project.title} — Madhura Padman`,
    description: project.short_desc || project.situation || undefined,
    openGraph: {
      title: project.title,
      description: project.short_desc || undefined,
      images: undefined,
    },
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const result = await loadProject(params.slug);
  if (!result) notFound();
  const { project: p, images, documents } = result;
  const visibleLinks = (p.links || []).filter((l) => l.visibility !== "private");

  return (
    <div className="page">
      <Nav />
      <header className="page-head">
        <div className="wrap">
          <Link href="/portfolio#work" className="back-link">
            &larr; Back to case studies
          </Link>
          {p.status === "coming-soon" && (
            <div>
              <span className="badge">Coming soon</span>
            </div>
          )}
          <h1>{p.title}</h1>
          <div className="pd-meta">{[p.org, p.category, p.date].filter(Boolean).join(", ")}</div>
        </div>
      </header>
      <main className="wrap pd-wrap">
        <div className="pd-grid">
          <div>
            {p.situation && (
              <div className="pd-field">
                <span className="k">The Situation</span>
                <div className="v">{p.situation}</div>
              </div>
            )}
            {p.problem && (
              <div className="pd-field">
                <span className="k">The Problem</span>
                <div className="v">{p.problem}</div>
              </div>
            )}
            {p.role && (
              <div className="pd-field">
                <span className="k">My Role</span>
                <div className="v">{p.role}</div>
              </div>
            )}
          </div>
          <div>
            {p.what_i_did && (
              <div className="pd-field">
                <span className="k">What I Did</span>
                <div className="v">{p.what_i_did}</div>
              </div>
            )}
            {p.process && (
              <div className="pd-field">
                <span className="k">Process</span>
                <div className="v">{p.process}</div>
              </div>
            )}
            {p.output && (
              <div className="pd-field">
                <span className="k">Output</span>
                <div className="v">{p.output}</div>
              </div>
            )}
            {p.outcome && (
              <div className="pd-field">
                <span className="k">Result</span>
                <div className="v">{p.outcome}</div>
              </div>
            )}
          </div>
        </div>

        {visibleLinks.length > 0 && (
          <div className="pd-links">
            {visibleLinks.map((l, i) => (
              <a
                key={i}
                className="pill-btn solid"
                href={l.url}
                target="_blank"
                rel="noopener"
              >
                {l.label || "View"} →
              </a>
            ))}
          </div>
        )}

        {documents.length > 0 && (
          <div className="pd-links">
            {documents.map((d) => (
              <a
                key={d.id}
                className="pill-btn"
                href={d.url}
                target="_blank"
                rel="noopener"
              >
                {d.label || "View document"} →
              </a>
            ))}
          </div>
        )}

        {images.length > 0 && (
          // eslint-disable-next-line @next/next/no-img-element
          <div className="pd-images">
            {images.map((im) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={im.id} src={im.url} alt={im.caption || ""} loading="lazy" />
            ))}
          </div>
        )}

        {p.skills.length > 0 && (
          <div className="pd-field">
            <span className="k">Skills shown</span>
            <div className="pd-skills">
              {p.skills.map((sk, i) => (
                <span key={i}>{sk}</span>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
