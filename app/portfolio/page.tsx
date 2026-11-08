import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getPublicSiteData } from "@/lib/data";
import { getShowcase, laneOf } from "@/lib/showcase";
import { getSite } from "@/lib/site";
import type { Experience } from "@/lib/types";
import Nav from "@/components/Nav";
import Reveal from "@/components/Reveal";
import ShowcaseMedia from "@/components/ShowcaseMedia";
import ContactBlock from "@/components/ContactBlock";
import VideoBlock from "@/components/VideoBlock";
import StatsStrip from "@/components/StatsStrip";
import PhotoWall from "@/components/PhotoWall";
import EventStories from "@/components/EventStories";
import { splitGallery } from "@/lib/gallery";

export const revalidate = 0; // always fetch fresh from Supabase
export const metadata: Metadata = { title: "Portfolio: Madhura Padman" };

export default async function PortfolioPage() {
  const supabase = createClient();
  const data = await getPublicSiteData(supabase);
  const site = await getSite(supabase);
  const { t, contact } = site;
  const LANES = site.lanes;
  const allShowcase = await getShowcase(supabase);
  const seen = new Set<string>();
  const showcase = allShowcase
    .filter((i) => i.kind === "case_study")
    .filter((i) => {
      const k = `${i.title}|${i.client}`.toLowerCase(); // the same project can sit in two rides; show it once here
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    });
  const { stories, loose: photos, words } = splitGallery(allShowcase);
  const stats = [1, 2, 3, 4]
    .map((n) => ({ n: t(`port.stat${n}.n`), label: t(`port.stat${n}.label`) }))
    .filter((x) => x.n.trim());
  const { settings: s, about } = data;
  const projects = data.projects.filter((p) => p.featured);
  const howIWork = site.steps.map((p) => ({ title: p.title, desc: p.text }));

  // first picture of each project, for the cards
  const cover: Record<string, string> = {};
  try {
    const ids = projects.map((p) => p.id);
    if (ids.length) {
      const { data: imgs } = await supabase
        .from("project_images")
        .select("project_id,url,visibility,sort_order")
        .in("project_id", ids)
        .eq("visibility", "public")
        .order("sort_order");
      (imgs ?? []).forEach((im: { project_id: string; url: string }) => {
        if (!cover[im.project_id]) cover[im.project_id] = im.url;
      });
    }
  } catch {}

  return (
    <div className="page">
      <Nav name={s.name || "Madhura Padman"} copy={site.copy} />

      <header className="page-head">
        <div className="wrap">
          <h1>{about.heading || "I like being in the middle of things."}</h1>
          <p>
            {s.homepageTagline ||
              "I take projects that are all over the place and keep them moving until they are done."}
          </p>
          <div className="head-links">
            <Link href="/resume" className="pill-btn cream big">
              {t("port.btnResume")}
            </Link>
            <a href={contact.whatsapp} className="pill-btn line big">
              {t("port.btnWhatsapp")}
            </a>
          </div>
        </div>
      </header>

      {site.videos.intro && site.videos.showPortfolio && (
        <section className="meet" id="meet">
          <div className="wrap">
            <VideoBlock item={site.videos.intro} heading={t("port.videoTitle")} />
          </div>
        </section>
      )}
      <section className="stats-band">
        <div className="wrap">
          <StatsStrip stats={stats} />
        </div>
      </section>
      <div className="jump">
        <div className="jump-in">
          <a href="#about">{t("port.jump.about")}</a>
          <a href="#work">{t("port.jump.work")}</a>
          {photos.length > 0 && <a href="#photos">{t("port.jump.photos")}</a>}
          <a href="#experience">{t("port.jump.exp")}</a>
          <a href="#process">{t("port.jump.process")}</a>
          <a href="#contact">{t("port.jump.contact")}</a>
        </div>
      </div>

      <section className="sec" id="about">
        <div className="wrap about-grid">
          <Reveal className="about-body">
            <div className="kicker">{t("port.about.kicker")}</div>
            {about.paragraphs.length ? (
              about.paragraphs.map((p, i) => <p key={i}>{p}</p>)
            ) : (
              <p>Nothing added yet.</p>
            )}
          </Reveal>
          {about.tags.length > 0 && (
            <Reveal className="about-facts">
              {about.tags.map((t, i) => (
                <div className="row" key={i}>
                  <span>{t.label}</span>
                  <b>{t.value}</b>
                </div>
              ))}
            </Reveal>
          )}
        </div>
      </section>

      <section className="sec" id="work">
        <div className="wrap">
          <div className="sec-head">
            <div className="kicker">{t("port.work.kicker")}</div>
            <Reveal as="h2" className="sec-title">
              {t("port.work.title")}
            </Reveal>
            <p className="sec-lede">
              {t("port.work.lede")}
            </p>
            <div className="lane-switch" style={{ ["--dot" as string]: "#000" }}>
              {LANES.map((l) => (
                <Link key={l.id} href={`/lane/${l.id}`} style={{ ["--dot" as string]: l.dot }}>
                  <i /> {l.label}
                </Link>
              ))}
            </div>
          </div>

          <Reveal className="cs-grid">
            {projects.map((p) => (
              <Link href={`/projects/${p.slug}`} className="cs" key={p.id}>
                <div className="cs-media">
                  {cover[p.id] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={cover[p.id]} alt="" loading="lazy" />
                  ) : (
                    <span className="initial">{(p.title || "?").slice(0, 1)}</span>
                  )}
                </div>
                <div className="cs-body">
                  {p.status === "coming-soon" && <span className="badge">{t("port.badge.soon")}</span>}
                  <div className="cs-meta">
                    {[p.org, p.category].filter(Boolean).join(", ")}
                  </div>
                  <h3>{p.title}</h3>
                  <p>{p.short_desc}</p>
                  <div className="cs-more">{t("port.work.read")}</div>
                </div>
              </Link>
            ))}
            {showcase.map((c) => {
              const lane = site.allLanes.find((l) => l.id === c.lane) ?? laneOf(c.lane);
              return (
                <Link
                  href={`/lane/${c.lane}`}
                  className="cs"
                  key={c.id}
                  style={{ ["--tint" as string]: lane.tint }}
                >
                  <div className="cs-media">
                    {c.media_url ? (
                      <ShowcaseMedia item={c} />
                    ) : (
                      <span className="initial">{(c.title || "?").slice(0, 1)}</span>
                    )}
                  </div>
                  <div className="cs-body">
                    <div className="cs-meta">{[c.client, lane.label].filter(Boolean).join(", ")}</div>
                    <h3>{c.title}</h3>
                    {c.summary && <p>{c.summary}</p>}
                    {c.metric && (
                      <div className="cs-metric">
                        <b>{c.metric}</b>
                        <span>{c.metric_label}</span>
                      </div>
                    )}
                  </div>
                </Link>
              );
            })}
            {!projects.length && !showcase.length && (
              <div className="invite" style={{ gridColumn: "1 / -1" }}>
                <h3>{t("invite.title")}</h3>
                <p>{t("invite.text")}</p>
                <a className="pill-btn solid" href={contact.whatsapp}>
                  {t("invite.button")}
                </a>
              </div>
            )}
          </Reveal>
        </div>
      </section>

      {(photos.length > 0 || stories.length > 0) && (
        <section className="sec tint" id="photos">
          <div className="wrap">
            <div className="sec-head">
              <div className="kicker">{t("port.photos.kicker")}</div>
              <Reveal as="h2" className="sec-title">
                {t("port.photos.title")}
              </Reveal>
              <p className="sec-lede">{t("port.photos.lede")}</p>
            </div>
          </div>
          <EventStories stories={stories} />
          {photos.length > 0 && <div style={{ height: 30 }} />}
          <PhotoWall photos={photos} />
        </section>
      )}

      {words.length > 0 && (
        <section className="sec" id="words">
          <div className="wrap kw">
            <div>
              <div className="kicker">Kind words</div>
              <Reveal as="h2" className="sec-title">
                Said in their own words
              </Reveal>
              <p className="sec-lede">A message from someone I worked with, with the name left out.</p>
            </div>
            <div className="kw-cards">
              {words.map((w) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={w.id} src={w.url} alt={w.title || "A kind message"} loading="lazy" decoding="async" />
              ))}
            </div>
          </div>
        </section>
      )}

      {data.freelance.length > 0 && (
        <section className="sec tint" id="freelance">
          <div className="wrap">
            <div className="sec-head">
              <div className="kicker">{t("port.free.kicker")}</div>
              <Reveal as="h2" className="sec-title">
                {t("port.free.title")}
              </Reveal>
            </div>
            <Reveal className="timeline">
              <Rows list={data.freelance} t={t} />
            </Reveal>
          </div>
        </section>
      )}

      <section className="sec" id="experience">
        <div className="wrap">
          <div className="sec-head">
            <div className="kicker">{t("port.exp.kicker")}</div>
            <Reveal as="h2" className="sec-title">
              {t("port.exp.title")}
            </Reveal>
          </div>
          <Reveal className="timeline">
            <Rows list={data.experience} t={t} />
          </Reveal>
        </div>
      </section>

      <section className="sec tint" id="process">
        <div className="wrap">
          <div className="sec-head">
            <div className="kicker">{t("port.proc.kicker")}</div>
            <Reveal as="h2" className="sec-title">
              {t("port.proc.title")}
            </Reveal>
          </div>
          <Reveal as="ol" className="steps">
            {howIWork.map((h, i) => (
              <li key={i}>
                <b>{h.title}</b>
                <span>{h.desc}</span>
              </li>
            ))}
          </Reveal>
        </div>
      </section>

      <ContactBlock
        title={s.contactCTA}
        email={s.email}
        phone={s.phone}
        linkedin={s.linkedin}
        name={s.name}
        location={s.location}
        whatsapp={contact.whatsapp}
        copy={site.copy}
      />
    </div>
  );
}

function Rows({ list, t }: { list: Experience[]; t: (k: string) => string }) {
  if (!list.length) return <div className="empty-note">Nothing added yet.</div>;
  return (
    <>
      {list.map((e, i) => (
        <details className="t-acc" key={e.id} open={i === 0}>
          <summary>
            <span className="t-sum">
              <h3 className="t-org">{e.org}</h3>
              <span className="t-role">{e.role}</span>
            </span>
            {e.dates && <span className="t-when">{e.dates}</span>}
            <i className="chev" aria-hidden="true" />
          </summary>
          <div className="t-body">
            {e.context && (
              <p>
                <b>{t("port.exp.context")}</b>
                {e.context}
              </p>
            )}
            {e.responsibilities && (
              <p>
                <b>{t("port.exp.did")}</b>
                {e.responsibilities}
              </p>
            )}
            {e.demonstrates && <div className="shows">{e.demonstrates}</div>}
          </div>
        </details>
      ))}
    </>
  );
}
