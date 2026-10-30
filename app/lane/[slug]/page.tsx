import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getShowcase } from "@/lib/showcase";
import { CONTACT, LANES, PROCESS, laneBySlug } from "@/lib/lanes";
import Nav from "@/components/Nav";
import Reveal from "@/components/Reveal";
import ShowcaseMedia from "@/components/ShowcaseMedia";
import Gallery from "@/components/Gallery";
import Composer from "@/components/Composer";

export const revalidate = 0;

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const lane = laneBySlug(params.slug);
  return { title: lane ? `${lane.title}: Madhura Padman` : "Madhura Padman" };
}

export default async function LanePage({ params }: { params: { slug: string } }) {
  const lane = laneBySlug(params.slug);
  if (!lane) notFound();

  const items = (await getShowcase(createClient())).filter((i) => i.lane === lane.id);
  const cases = items.filter((i) => i.kind === "case_study");
  const voices = items.filter((i) => i.kind === "testimonial");
  const shots = items.filter((i) => i.kind === "gallery");
  const isWriting = lane.id === "writing";

  return (
    <div className="page" style={{ ["--tint" as string]: lane.tint, ["--dot" as string]: lane.dot }}>
      <div className="arrive" aria-hidden="true" />
      <Nav />

      <header className="lane-hero">
        <div className="wrap">
          <div className="lane-switch">
            <Link href="/" className="back">
              &larr; Back to the ride
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
            <a className="pill-btn solid big" href={CONTACT.whatsapp}>
              Work with me on WhatsApp
            </a>
            <a className="pill-btn big" href={`mailto:${CONTACT.email}?subject=${encodeURIComponent(lane.subject)}`}>
              Send an email
            </a>
            <Link className="pill-btn big" href="/resume">
              View my resume
            </Link>
          </div>
        </div>
      </header>

      <div className="jump">
        <div className="jump-in">
          <a href="#offer">What I take on</a>
          <a href="#cases">Case studies</a>
          {voices.length > 0 && <a href="#voices">What people say</a>}
          {shots.length > 0 && <a href="#field">From the field</a>}
          {lane.roles.length > 0 && <a href="#roles">Where I&apos;ve done this</a>}
          <a href="#contact">Contact</a>
        </div>
      </div>

      <section className="sec" id="offer">
        <div className="wrap">
          <div className="sec-head">
            <div className="kicker">What I can take on</div>
            <Reveal as="h2" className="sec-title">
              Hand me the messy part.
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
            <div className="kicker">Case studies</div>
            <Reveal as="h2" className="sec-title">
              {isWriting ? "Pieces and projects." : "Work I can show you."}
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
              <h3>Your project could be the first one here.</h3>
              <p>
                I take on a handful of freelance projects at a time. Tell me what you need and I will tell you
                how I would run it.
              </p>
              <a className="pill-btn solid" href={`mailto:${CONTACT.email}?subject=${encodeURIComponent(lane.subject)}`}>
                Start a project
              </a>
            </div>
          )}
        </div>
      </section>

      {voices.length > 0 && (
        <section className="sec" id="voices">
          <div className="wrap">
            <div className="sec-head">
              <div className="kicker">What people say</div>
              <Reveal as="h2" className="sec-title">
                In their words.
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
              <div className="kicker">From the field</div>
              <Reveal as="h2" className="sec-title">
                Pictures and clips.
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
              <div className="kicker">Where I&apos;ve done this</div>
              <Reveal as="h2" className="sec-title">
                The roles behind the work.
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
              <div className="kicker">{isWriting ? "What I'm writing about" : "Projects"}</div>
              <Reveal as="h2" className="sec-title">
                {isWriting ? "The stories I'm after." : "Things I built and ran."}
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
                The first reported piece, from the Andaman Islands, is in progress. Published work will appear
                above as soon as it exists.
              </p>
            )}
          </div>
        </section>
      )}

      <section className="sec" id="process">
        <div className="wrap">
          <div className="sec-head">
            <div className="kicker">How we would work</div>
            <Reveal as="h2" className="sec-title">
              Five steps. No surprises.
            </Reveal>
          </div>
          <Reveal as="ol" className="steps">
            {PROCESS.map((p, i) => (
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
          <Reveal as="h2">Got something that needs running?</Reveal>
          <Reveal as="p" className="lede">
            Tell me what it is, even if it isn&apos;t fully shaped yet. I will reply with how I would approach it.
          </Reveal>
          <Composer subject={lane.subject} />
          <div className="links">
            <a className="pill-btn line" href={`mailto:${CONTACT.email}`}>
              {CONTACT.email}
            </a>
            <a className="pill-btn line" href={`tel:${CONTACT.phone.replace(/\s/g, "")}`}>
              {CONTACT.phone}
            </a>
            <a className="pill-btn line" href={CONTACT.linkedin} target="_blank" rel="noopener">
              LinkedIn
            </a>
          </div>
          <div className="contact-foot">
            <span>Madhura Padman</span>
            <Link href="/portfolio">See the full portfolio</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
