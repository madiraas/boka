"use client";

import { useState } from "react";
import { CONTACT } from "@/lib/lanes";

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
  const gmail = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(to)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  const waText = `Hi Madhura, ${msg || subject}${name ? " (" + name + ")" : ""}`;
  return (
    <form
      className="composer"
      onSubmit={(e) => {
        e.preventDefault();
        setTried(true);
        window.location.href = mailto;
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
          Nothing opened? No problem. <a href={gmail} target="_blank" rel="noopener">Write it in Gmail</a>, or email me at{" "}
          <a href={`mailto:${to}`}>{to}</a>.
        </p>
      )}
    </form>
  );
}
