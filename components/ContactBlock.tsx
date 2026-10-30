import Link from "next/link";
import Reveal from "./Reveal";
import { CONTACT } from "@/lib/lanes";

/** Red closing section used at the bottom of the portfolio page. */
export default function ContactBlock({
  title,
  email,
  phone,
  linkedin,
  name,
  location,
}: {
  title?: string;
  email?: string;
  phone?: string;
  linkedin?: string;
  name?: string;
  location?: string;
}) {
  const mail = email || CONTACT.email;
  const tel = phone || CONTACT.phone;
  return (
    <section className="contact" id="contact">
      <div className="wrap">
        <Reveal as="h2">{title || "Got something messy that needs a hand?"}</Reveal>
        <Reveal as="p" className="lede">
          Tell me what it is, even if it isn&apos;t fully shaped yet. I&apos;ll reply with how I would
          approach it.
        </Reveal>
        <div className="links">
          <a className="pill-btn cream big" href={CONTACT.whatsapp}>
            WhatsApp me
          </a>
          <a className="pill-btn line big" href={`mailto:${mail}`}>
            {mail}
          </a>
          <a className="pill-btn line big" href={`tel:${tel.replace(/\s/g, "")}`}>
            {tel}
          </a>
          <a className="pill-btn line big" href={linkedin || CONTACT.linkedin} target="_blank" rel="noopener">
            LinkedIn
          </a>
        </div>
        <div className="contact-foot">
          <span>
            {name || "Madhura Padman"}
            {location ? `, ${location}` : ""}
          </span>
          <Link href="/resume">Read my resume</Link>
        </div>
      </div>
    </section>
  );
}
