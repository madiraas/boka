"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const LINKS = [
  { href: "/", label: "The ride" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/portfolio#work", label: "Case studies" },
  { href: "/portfolio#contact", label: "Contact" },
];

/** Top bar for every page except the landing page (which has its own). */
export default function Nav({ name = "Madhura Padman" }: { name?: string }) {
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
              key={l.label}
              href={l.href}
              aria-current={l.href === pathname ? "page" : undefined}
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          <Link href="/resume" className="pill-btn solid" onClick={() => setOpen(false)}>
            Resume
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
