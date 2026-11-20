import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getShowcase } from "@/lib/showcase";
import { laneBySlug } from "@/lib/lanes";
import { getSite } from "@/lib/site";
import Nav from "@/components/Nav";
import Reveal from "@/components/Reveal";
import ShowcaseMedia from "@/components/ShowcaseMedia";
import Gallery from "@/components/Gallery";
import Composer from "@/components/Composer";
import VideoBlock from "@/components/VideoBlock";

export const revalidate = 0;

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const lane = laneBySlug(params.slug);
  return { title: lane ? `${lane.title}: Madhura Padman` : "Madhura Padman" };
}

export default async function LanePage({ params }: { params: { slug: string } }) {
  const site = await getSite(createClient());
  const { t, contact } = site;
  const LANES = site.lanes;
  const lane = LANES.find((l) => l.id === params.slug);
  if (!lane) notFound();
  const video = site.videos.lanes[lane.id] ?? (site.videos.showTunnels ? site.videos.intro : null);

  const items = (await getShowcase(createClient())).filter((i) => i.lane === lane.id);
  const cases = items.filter((i) => i.kind === "case_study");
  const voices = items.filter((i) => i.kind === "testimonial");
  const shots = items.filter((i) => i.kind === "gallery");
  const isWriting = lane.id === "writing";

  return (
    <div className="page" style={{ ["--tint" as string]: lane.tint, ["--dot" as string]: lane.dot }}>
      <div className="arrive" aria-hidden="true" />
      <Nav copy={site.copy} />

      <header className="lane-hero">
        <div className="wrap">
          <div className="lane-switch">
            <Link href="/" className="back">
              &larr; {t("lane.back")}
            </Link>
            {LANES.map((l) => (
              <Link
                key={l.id}
                href={`/lane/${l.id}`}
                aria-current={l.id === lane.id ? "page" : undefined}
                style={{ ["--dot" as string]: l.dot }}
              >
                <i /> {l.label}
              </Link>
            ))}
          </div>
          <p className="who">{lane.who}</p>
          <h1>{lane.title}</h1>
          <p className="lede">{lane.lede}</p>
          <div className="cta">
            <a className="pill-btn solid big" href={contact.whatsapp}>
              {t("lane.cta1")}
            </a>
            <a className="pill-btn big" href={`mailto:${contact.email}?subject=${encodeURIComponent(lane.subject)}`}>
              {t("lane.cta2")}
            </a>
            <Link className="pill-btn big" href="/resume">
              {t("lane.cta3")}
            </Link>
          </div>
        </div>
      </header>

      {video && (
        <section className="vid-tunnel" id="watch">
          <div className="wrap">
            <VideoBlock item={video} heading={t("lane.videoTitle")} />
          </div>
        </section>
      )}
      <div className="jump">
        <div className="jump-in">
          <a href="#offer">{t("lane.jump.offer")}</a>
          <a href="#cases">{t("lane.jump.cases")}</a>
          {voices.length > 0 && <a href="#voices">{t("lane.jump.voices")}</a>}
          {shots.length > 0 && <a href="#field">{t("lane.jump.field")}</a>}
          {lane.roles.length > 0 && <a href="#roles">{t("lane.jump.roles")}</a>}
          <a href="#contact">{t("lane.jump.contact")}</a>
        </div>
      </div>

      <section className="sec" id="offer">
        <div className="wrap">
          <div className="sec-head">
            <div className="kicker">{t("lane.offer.kicker")}</div>
            <Reveal as="h2" className="sec-title">
              {t("lane.offer.title")}
            </Reveal>
          </div>
          <Reveal className={lane.offer.length === 3 ? "grid-3" : "grid-2"}>
            {lane.offer.map((o, i) => (
              <div className="card" key={i}>
                <h3>{o.title}</h3>
                <p>{o.text}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="sec tint" id="cases">
        <div className="wrap">
          <div className="sec-head">
            <div className="kicker">{t("lane.cases.kicker")}</div>
            <Reveal as="h2" className="sec-title">
              {isWriting ? t("lane.cases.titleWriting") : t("lane.cases.title")}
            </Reveal>
          </div>
          {cases.length ? (
            <Reveal className="cs-grid">
              {cases.map((c) => (
                <article className="cs" key={c.id}>
                  <div className="cs-media">
                    {c.media_url ? (
                      <ShowcaseMedia item={c} />
                    ) : (
                      <span className="initial">{(c.title || "?").slice(0, 1)}</span>
                    )}
                  </div>
                  <div className="cs-body">
                    {c.client && <div className="cs-meta">{c.client}</div>}
                    <h3>{c.title}</h3>
                    {c.summary && <p>{c.summary}</p>}
                    {c.metric && (
                      <div className="cs-metric">
                        <b>{c.metric}</b>
                        <span>{c.metric_label}</span>
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </Reveal>
          ) : (
            <div className="invite">
              <h3>{t("invite.title")}</h3>
              <p>{t("invite.text")}</p>
              <a className="pill-btn solid" href={`mailto:${contact.email}?subject=${encodeURIComponent(lane.subject)}`}>
                {t("invite.button")}
              </a>
            </div>
          )}
        </div>
      </section>

      {voices.length > 0 && (
        <section className="sec" id="voices">
          <div className="wrap">
            <div className="sec-head">
              <div className="kicker">{t("lane.voices.kicker")}</div>
              <Reveal as="h2" className="sec-title">
                {t("lane.voices.title")}
              </Reveal>
            </div>
            <Reveal className="quote-grid">
              {voices.map((v) => (
                <figure className="quote" key={v.id}>
                  <blockquote>&ldquo;{v.quote}&rdquo;</blockquote>
                  <figcaption>
                    <b>{v.author}</b>
                    {[v.author_role, v.client].filter(Boolean).join(", ")}
                  </figcaption>
                </figure>
              ))}
            </Reveal>
          </div>
        </section>
      )}

      {shots.length > 0 && (
        <section className="sec tint" id="field">
          <div className="wrap">
            <div className="sec-head">
              <div className="kicker">{t("lane.field.kicker")}</div>
              <Reveal as="h2" className="sec-title">
                {t("lane.field.title")}
              </Reveal>
            </div>
            <Gallery items={shots} />
          </div>
        </section>
      )}

      {lane.roles.length > 0 && (
        <section className="sec" id="roles">
          <div className="wrap">
            <div className="sec-head">
              <div className="kicker">{t("lane.roles.kicker")}</div>
              <Reveal as="h2" className="sec-title">
                {t("lane.roles.title")}
              </Reveal>
            </div>
            <Reveal className="timeline">
              {lane.roles.map((r, i) => (
                <div className="t-row" key={i}>
                  <div>
                    <h3 className="t-org">{r.title}</h3>
                    <div className="t-when">{r.when}</div>
                  </div>
                  <div className="t-body">
                    <p>{r.text}</p>
                  </div>
                </div>
              ))}
            </Reveal>
          </div>
        </section>
      )}

      {lane.projects.length > 0 && (
        <section className={`sec${lane.roles.length > 0 ? " tint" : ""}`} id="projects">
          <div className="wrap">
            <div className="sec-head">
              <div className="kicker">{isWriting ? t("lane.proj.kickerWriting") : t("lane.proj.kicker")}</div>
              <Reveal as="h2" className="sec-title">
                {isWriting ? t("lane.proj.titleWriting") : t("lane.proj.title")}
              </Reveal>
            </div>
            <Reveal className="grid-2">
              {lane.projects.map((p, i) => (
                <div className="card" key={i}>
                  <div className="cs-meta" style={{ marginBottom: 10 }}>
                    {p.where}
                  </div>
                  <h3>{p.title}</h3>
                  <p>{p.text}</p>
                </div>
              ))}
            </Reveal>
            {isWriting && (
              <p className="sec-lede" style={{ marginTop: 36, marginBottom: 0 }}>
                {t("lane.writingNote")}
              </p>
            )}
          </div>
        </section>
      )}

      <section className="sec" id="process">
        <div className="wrap">
          <div className="sec-head">
            <div className="kicker">{t("lane.proc.kicker")}</div>
            <Reveal as="h2" className="sec-title">
              {t("lane.proc.title")}
            </Reveal>
          </div>
          <Reveal as="ol" className="steps">
            {site.steps.map((p, i) => (
              <li key={i}>
                <b>{p.title}</b>
                <span>{p.text}</span>
              </li>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="contact" id="contact">
        <div className="wrap">
          <Reveal as="h2">{t("lane.contact.title")}</Reveal>
          <Reveal as="p" className="lede">
            {t("lane.contact.lede")}
          </Reveal>
          <Composer subject={lane.subject} />
          <div className="links">
            <a className="pill-btn line" href={`mailto:${contact.email}`}>
              {contact.email}
            </a>
            <a className="pill-btn line" href={`tel:${contact.phone.replace(/\s/g, "")}`}>
              {contact.phone}
            </a>
            <a className="pill-btn line" href={contact.linkedin} target="_blank" rel="noopener">
              {t("contact.linkedin")}
            </a>
          </div>
          <div className="contact-foot">
            <span>{site.settings.name?.trim() || "Madhura Padman"}</span>
            <Link href="/portfolio">{t("lane.contact.portfolio")}</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
