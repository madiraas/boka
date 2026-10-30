import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getPublicSiteData } from "@/lib/data";
import { getShowcase, laneOf } from "@/lib/showcase";
import { CONTACT, LANES, PROCESS } from "@/lib/lanes";
import type { Experience } from "@/lib/types";
import Nav from "@/components/Nav";
import Reveal from "@/components/Reveal";
import ShowcaseMedia from "@/components/ShowcaseMedia";
import ContactBlock from "@/components/ContactBlock";

export const revalidate = 0; // always fetch fresh from Supabase
export const metadata: Metadata = { title: "Portfolio: Madhura Padman" };

export default async function PortfolioPage() {
  const supabase = createClient();
  const data = await getPublicSiteData(supabase);
  const showcase = (await getShowcase(supabase)).filter((i) => i.kind === "case_study");
  const { settings: s, about, capabilities, problems } = data;
  const projects = data.projects.filter((p) => p.featured);
  const howIWork = data.howIWork.length
    ? data.howIWork
    : PROCESS.map((p) => ({ title: p.title, desc: p.text }));

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
      <Nav name={s.name || "Madhura Padman"} />

      <header className="page-head">
        <div className="wrap">
          <h1>{about.heading || "I like being in the middle of things."}</h1>
          <p>
            {s.homepageTagline ||
              "I take projects that are all over the place and keep them moving until they are done."}
          </p>
          <div className="head-links">
            <Link href="/resume" className="pill-btn cream big">
              View my resume
            </Link>
            <a href={CONTACT.whatsapp} className="pill-btn line big">
              WhatsApp me
            </a>
          </div>
        </div>
      </header>

      <div className="jump">
        <div className="jump-in">
          <a href="#about">About</a>
          <a href="#help">What I do</a>
          <a href="#work">Case studies</a>
          <a href="#experience">Experience</a>
          <a href="#process">Process</a>
          <a href="#contact">Contact</a>
        </div>
      </div>

      <section className="sec" id="about">
        <div className="wrap about-grid">
          <Reveal className="about-body">
            <div className="kicker">About</div>
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

      <section className="sec tint" id="help">
        <div className="wrap">
          <div className="sec-head">
            <div className="kicker">What can you hand me?</div>
            <Reveal as="h2" className="sec-title">
              Real problems, not service tiers.
            </Reveal>
          </div>
          {problems.length > 0 && (
            <Reveal className="asks">
              {problems.map((p, i) => (
                <div className="ask" key={i}>
                  &ldquo;{p}&rdquo;
                </div>
              ))}
            </Reveal>
          )}
          <Reveal className="grid-2">
            {capabilities.length ? (
              capabilities.map((c, i) => (
                <div className="card" key={i}>
                  <h3>{c.title}</h3>
                  <p>{c.desc}</p>
                </div>
              ))
            ) : (
              <div className="empty-note">No capabilities added yet.</div>
            )}
          </Reveal>
        </div>
      </section>

      <section className="sec" id="work">
        <div className="wrap">
          <div className="sec-head">
            <div className="kicker">Case studies</div>
            <Reveal as="h2" className="sec-title">
              A few things I&apos;ve actually run.
            </Reveal>
            <p className="sec-lede">
              Pick a tunnel to see the work, the people I did it for and the pictures from the field.
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
                  {p.status === "coming-soon" && <span className="badge">Coming soon</span>}
                  <div className="cs-meta">
                    {[p.org, p.category].filter(Boolean).join(", ")}
                  </div>
                  <h3>{p.title}</h3>
                  <p>{p.short_desc}</p>
                  <div className="cs-more">Read the case study</div>
                </div>
              </Link>
            ))}
            {showcase.map((c) => {
              const lane = laneOf(c.lane);
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
                <h3>Your project could be the first one here.</h3>
                <p>
                  I take on a handful of freelance projects at a time. Tell me what you need and I will tell
                  you how I would run it.
                </p>
                <a className="pill-btn solid" href={CONTACT.whatsapp}>
                  Start a project
                </a>
              </div>
            )}
          </Reveal>
        </div>
      </section>

      {data.freelance.length > 0 && (
        <section className="sec tint" id="freelance">
          <div className="wrap">
            <div className="sec-head">
              <div className="kicker">Freelance and ground work</div>
              <Reveal as="h2" className="sec-title">
                Taken on outside the day job.
              </Reveal>
            </div>
            <Reveal className="timeline">
              <Rows list={data.freelance} />
            </Reveal>
          </div>
        </section>
      )}

      <section className="sec" id="experience">
        <div className="wrap">
          <div className="sec-head">
            <div className="kicker">Experience</div>
            <Reveal as="h2" className="sec-title">
              Not a timeline. Proof.
            </Reveal>
          </div>
          <Reveal className="timeline">
            <Rows list={data.experience} />
          </Reveal>
        </div>
      </section>

      <section className="sec tint" id="process">
        <div className="wrap">
          <div className="sec-head">
            <div className="kicker">How I work</div>
            <Reveal as="h2" className="sec-title">
              Five steps. No surprises.
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
      />
    </div>
  );
}

function Rows({ list }: { list: Experience[] }) {
  if (!list.length) return <div className="empty-note">Nothing added yet.</div>;
  return (
    <>
      {list.map((e) => (
        <div className="t-row" key={e.id}>
          <div>
            <h3 className="t-org">{e.org}</h3>
            <div className="t-role">{e.role}</div>
            {e.dates && <div className="t-when">{e.dates}</div>}
          </div>
          <div className="t-body">
            {e.context && (
              <p>
                <b>Context</b>
                {e.context}
              </p>
            )}
            {e.responsibilities && (
              <p>
                <b>What I handled</b>
                {e.responsibilities}
              </p>
            )}
            {e.demonstrates && <div className="shows">{e.demonstrates}</div>}
          </div>
        </div>
      ))}
    </>
  );
}
