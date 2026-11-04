"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { makeT } from "@/lib/sitecopy";

const LINKS = [
  { href: "/", key: "nav.home" },
  { href: "/portfolio", key: "nav.portfolio" },
  { href: "/portfolio#work", key: "nav.cases" },
  { href: "/portfolio#contact", key: "nav.contact" },
];

/** Top bar for every page except the landing page (which has its own). */
export default function Nav({ name = "Madhura Padman", copy }: { name?: string; copy?: Record<string, string> }) {
  const t = makeT(copy);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className={`site-nav${scrolled ? " scrolled" : ""}${open ? " open" : ""}`}>
      <div className="site-nav-in">
        <Link href="/" className="brand">
          {name}
        </Link>
        <nav className="site-links" aria-label="Main">
          {LINKS.map((l) => (
            <Link
              key={l.key}
              href={l.href}
              aria-current={l.href === pathname ? "page" : undefined}
              onClick={() => setOpen(false)}
            >
              {t(l.key)}
            </Link>
          ))}
          <Link href="/resume" className="pill-btn solid" onClick={() => setOpen(false)}>
            {t("nav.resume")}
          </Link>
        </nav>
        <button
          className="menu-btn"
          aria-expanded={open}
          aria-label="Menu"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>
    </header>
  );
}
