"use client";

import { createElement, useEffect, useRef, useState } from "react";

/** Fades a block in once as it scrolls into view. Content is always visible if scripts or observers are unavailable. */
export default function Reveal({
  children,
  className = "",
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [state, setState] = useState<"ssr" | "wait" | "in">("ssr");

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setState("in");
      return;
    }
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight) {
      setState("in");
      return;
    }
    setState("wait");
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setState("in");
          observer.disconnect();
        }
      },
      { threshold: 0, rootMargin: "0px 0px -6% 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return createElement(
    as as any,
    {
      ref: ref as any,
      className: `reveal${state === "wait" ? " hide" : ""} ${className}`.trim(),
    },
    children
  );
}
