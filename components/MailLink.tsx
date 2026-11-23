"use client";

import type { ReactNode } from "react";

export function gmailUrl(to: string, subject = "", body = "") {
  return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(to)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/**
 * An email link that works everywhere.
 * Phones open their own mail app. Laptops often have no mail app set up (so a plain email link does nothing),
 * so there it opens a ready-to-send message in Gmail in a new tab.
 */
export default function MailLink({
  to,
  subject = "",
  body = "",
  className,
  children,
}: {
  to: string;
  subject?: string;
  body?: string;
  className?: string;
  children?: ReactNode;
}) {
  const q = [subject && `subject=${encodeURIComponent(subject)}`, body && `body=${encodeURIComponent(body)}`].filter(Boolean).join("&");
  const mailto = `mailto:${to}${q ? "?" + q : ""}`;
  return (
    <a
      className={className}
      href={mailto}
      onClick={(e) => {
        try {
          if (window.matchMedia("(pointer: coarse)").matches) return; // phone or tablet: let the mail app open
        } catch {}
        e.preventDefault();
        window.open(gmailUrl(to, subject, body), "_blank", "noopener");
      }}
    >
      {children ?? to}
    </a>
  );
}
