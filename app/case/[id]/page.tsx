import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createPublicClient as createClient } from "@/lib/supabase/public";
import { getShowcase, laneOf } from "@/lib/showcase";
import { getSite } from "@/lib/site";
import Nav from "@/components/Nav";
import ShowcaseMedia from "@/components/ShowcaseMedia";
import { Tile } from "@/components/CaseVisual";
import MailLink from "@/components/MailLink";

export function generateStaticParams() {
  return []; // made the first time someone opens it, then reused for a minute
}
export const revalidate = 60;

async function load(id: string) {
  const items = await getShowcase(createClient());
  return items.find((i) => i.id === id && i.kind === "case_study") ?? null;
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const c = await load(params.id);
  return { title: c ? `${c.title} | Madhura Padman` : "Case study" };
}

export default async function CasePage({ params }: { params: { id: string } }) {
  const c = await load(params.id);
  if (!c) notFound();
  const site = await getSite(createClient());
  const { t, contact } = site;
  const lane = site.allLanes.find((l) => l.id === c.lane) ?? laneOf(c.lane);
  return (
    <div className="page" style={{ ["--tint" as string]: lane.tint }}>
      <Nav copy={site.copy} />
      <header className="page-head">
        <div className="wrap">
          <Link href={`/lane/${c.lane}#cases`} className="back-link">
            &larr; Back to {lane.label}
          </Link>
          <h1>{c.title}</h1>
          <div className="pd-meta">{[c.client, lane.label].filter(Boolean).join(", ")}</div>
        </div>
      </header>
      <main className="wrap pd-wrap">
        <div className="case-media">{c.media_url ? <ShowcaseMedia item={c} /> : <div className="cs-media"><Tile title={c.title} client={c.client} /></div>}</div>
        {c.summary && <p className="case-text">{c.summary}</p>}
        {c.metric && (
          <div className="cs-metric">
            <b>{c.metric}</b>
            <span>{c.metric_label}</span>
          </div>
        )}
        <div className="pd-links">
          <MailLink className="pill-btn solid" to={contact.email} subject={`About: ${c.title}`}>
            Ask me about this
          </MailLink>
          <a className="pill-btn" href={contact.whatsapp}>
            {t("port.btnWhatsapp")}
          </a>
          <Link className="pill-btn" href="/portfolio#work">
            All case studies
          </Link>
        </div>
      </main>
    </div>
  );
}
