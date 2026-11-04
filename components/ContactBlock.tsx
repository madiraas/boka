import Link from "next/link";
import Reveal from "./Reveal";
import { CONTACT } from "@/lib/lanes";
import { makeT } from "@/lib/sitecopy";

/** Red closing section used at the bottom of the portfolio page. */
export default function ContactBlock({
  title,
  email,
  phone,
  linkedin,
  name,
  location,
  whatsapp,
  copy,
}: {
  title?: string;
  email?: string;
  phone?: string;
  linkedin?: string;
  name?: string;
  location?: string;
  whatsapp?: string;
  copy?: Record<string, string>;
}) {
  const t = makeT(copy);
  const mail = email || CONTACT.email;
  const tel = phone || CONTACT.phone;
  return (
    <section className="contact" id="contact">
      <div className="wrap">
        <Reveal as="h2">{title || t("contact.title")}</Reveal>
        <Reveal as="p" className="lede">
          {t("contact.lede")}
        </Reveal>
        <div className="links">
          <a className="pill-btn cream big" href={whatsapp || CONTACT.whatsapp}>
            {t("contact.whatsapp")}
          </a>
          <a className="pill-btn line big" href={`mailto:${mail}`}>
            {mail}
          </a>
          <a className="pill-btn line big" href={`tel:${tel.replace(/\s/g, "")}`}>
            {tel}
          </a>
          <a className="pill-btn line big" href={linkedin || CONTACT.linkedin} target="_blank" rel="noopener">
            {t("contact.linkedin")}
          </a>
        </div>
        <div className="contact-foot">
          <span>
            {name || "Madhura Padman"}
            {location ? `, ${location}` : ""}
          </span>
          <Link href="/resume">{t("contact.resume")}</Link>
        </div>
      </div>
    </section>
  );
}
