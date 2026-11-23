"use client";

import { useState } from "react";
import { CONTACT } from "@/lib/lanes";
import { gmailUrl } from "./MailLink";

/** Small form that opens the visitor's email app or WhatsApp with the message filled in. */
export default function Composer({
  subject,
  email,
  whatsapp,
}: {
  subject: string;
  email?: string;
  whatsapp?: string;
}) {
  const [name, setName] = useState("");
  const [msg, setMsg] = useState("");
  const [tried, setTried] = useState(false);
  const to = email || CONTACT.email;
  const wa = whatsapp || CONTACT.whatsapp;
  const body = `${msg}${msg ? "\n\n" : ""}${name ? "From: " + name : ""}`;
  const mailto = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  const gmail = gmailUrl(to, subject, body);
  const waText = `Hi Madhura, ${msg || subject}${name ? " (" + name + ")" : ""}`;
  return (
    <form
      className="composer"
      onSubmit={(e) => {
        e.preventDefault();
        setTried(true);
        let phone = false;
        try {
          phone = window.matchMedia("(pointer: coarse)").matches;
        } catch {}
        // Phones open their mail app; laptops open the message in Gmail, since many have no mail app set up.
        if (phone) window.location.href = mailto;
        else window.open(gmail, "_blank", "noopener");
      }}
    >
      <label>
        Your name
        <input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
      </label>
      <label>
        What do you need?
        <textarea
          rows={4}
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          placeholder="Even a half-formed brief is fine."
        />
      </label>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <button className="pill-btn cream big" type="submit">
          Write the email
        </button>
        <a className="pill-btn line big" href={`${wa}${wa.includes("?") ? "&" : "?"}text=${encodeURIComponent(waText)}`} target="_blank" rel="noopener">
          Or WhatsApp me
        </a>
      </div>
      {tried && (
        <p className="composer-note" role="status">
          Nothing opened? <a href={gmail} target="_blank" rel="noopener">Write it in Gmail</a>, or send it to{" "}
          <b>{to}</b> from any email app.
        </p>
      )}
    </form>
  );
}
