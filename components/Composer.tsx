"use client";

import { useState } from "react";
import { CONTACT } from "@/lib/lanes";

/** Small form that opens the visitor's email app with the message filled in. */
export default function Composer({ subject, email }: { subject: string; email?: string }) {
  const [name, setName] = useState("");
  const [msg, setMsg] = useState("");
  return (
    <form
      className="composer"
      onSubmit={(e) => {
        e.preventDefault();
        const body = `${msg}${msg ? "\n\n" : ""}${name ? "From: " + name : ""}`;
        window.location.href = `mailto:${email || CONTACT.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
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
        <a className="pill-btn line big" href={CONTACT.whatsapp}>
          Or WhatsApp me
        </a>
      </div>
    </form>
  );
}
