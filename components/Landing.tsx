"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import CatGate from "./CatGate";
import Petals from "./Petals";
import Portrait from "./Portrait";
import { LANES, CONTACT, type Lane } from "@/lib/lanes";

type Gate = "pending" | "show" | "gone";

export default function Landing({ name }: { name: string }) {
  const [gate, setGate] = useState<Gate>("pending");
  const [riding, setRiding] = useState<string | null>(null);
  const [wipe, setWipe] = useState<{ tint: string; x: number; y: number } | null>(null);
  const router = useRouter();

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem("gateDone") === "1";
    } catch {}
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setGate(seen || reduce ? "gone" : "show");
  }, []);

  function gateDone() {
    try {
      sessionStorage.setItem("gateDone", "1");
    } catch {}
    setGate("gone");
  }

  function ride(lane: Lane, card: HTMLElement) {
    if (riding) return;
    setRiding(lane.id);
    const r = card.getBoundingClientRect();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.setTimeout(
      () => {
        setWipe({ tint: lane.tint, x: r.left + r.width / 2, y: r.top + r.height * 0.42 });
        window.setTimeout(() => router.push(`/lane/${lane.id}`), reduce ? 0 : 650);
      },
      reduce ? 0 : 1050
    );
  }

  return (
    <main className={`landing${gate !== "gone" ? " gated" : ""}`}>
      <Petals />
      {gate !== "gone" &&
        (gate === "show" ? <CatGate onDone={gateDone} /> : <div className="gate gate-wait" aria-hidden="true" />)}

      <header className="hero">
        <div className="hero-bar">
          <Link href="/" className="brand">
            {name}
          </Link>
          <nav aria-label="Main">
            <Link href="/portfolio">Portfolio</Link>
            <Link href="/portfolio#contact">Contact</Link>
            <Link href="/resume" className="pill-btn cream">
              Resume
            </Link>
          </nav>
        </div>

        <div className="stage">
          <div className="stage-in">
            <Portrait />
            <div className="hero-copy">
              <h1>
                Hello!
                <br />
                Welcome to my career rollercoaster.
              </h1>
              <p className="hero-sub">
                I&apos;m Madhura. I take the messy middle of a project and keep it moving, across
                operations, travel, events and writing. Pick a tunnel below and I&apos;ll take you in.
              </p>
              <div className="hero-links">
                <Link href="/resume" className="pill-btn cream big">
                  View my resume
                </Link>
                <Link href="/portfolio" className="pill-btn line big">
                  See the full portfolio
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="ground">
          <div className={`tunnels${riding ? " busy" : ""}`}>
            {LANES.map((l) => (
              <Tunnel key={l.id} lane={l} state={riding === l.id ? "go" : riding ? "dim" : ""} onRide={ride} />
            ))}
          </div>
        </div>
      </header>

      <section className="strip">
        <div className="wrap strip-in">
          <p>
            <strong>Open to freelance projects.</strong> Tell me what needs running and I&apos;ll
            tell you how I&apos;d do it.
          </p>
          <div className="strip-links">
            <a className="pill-btn solid" href={CONTACT.whatsapp}>
              WhatsApp me
            </a>
            <a className="pill-btn" href={`mailto:${CONTACT.email}`}>
              Email
            </a>
          </div>
        </div>
      </section>

      {wipe && (
        <div
          className="ride-wipe"
          style={{ background: wipe.tint, ["--x" as string]: `${wipe.x}px`, ["--y" as string]: `${wipe.y}px` }}
        />
      )}
    </main>
  );
}

const TIES = [120, 129, 140, 153, 168];
// rails run from the foot of the mouth (y=112) toward the viewer (y=170)
const railX = (y: number, side: -1 | 1) => 120 + side * (24 + ((y - 112) * 26) / 58);

function Tunnel({
  lane,
  state,
  onRide,
}: {
  lane: Lane;
  state: "" | "go" | "dim";
  onRide: (l: Lane, el: HTMLElement) => void;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  return (
    <Link
      ref={ref}
      href={`/lane/${lane.id}`}
      className={`tunnel ${state}`}
      data-gaze
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        e.preventDefault();
        if (ref.current) onRide(lane, ref.current);
      }}
    >
      <svg viewBox="0 0 240 172" aria-hidden="true">
        <defs>
          <radialGradient id={`in-${lane.id}`} cx="50%" cy="75%" r="75%">
            <stop offset="0" stopColor="#3b0c0d" />
            <stop offset="1" stopColor="#0f0102" />
          </radialGradient>
        </defs>
        {/* hill */}
        <path d="M0 112 V82 C0 38 52 8 120 8 C188 8 240 38 240 82 V112 Z" fill="#4A0809" />
        <path d="M0 112 V82 C0 38 52 8 120 8" fill="none" stroke="#6B1112" strokeWidth="2" />
        {/* tunnel mouth */}
        <path d="M80 112 V66 A40 40 0 0 1 160 66 V112 Z" fill={`url(#in-${lane.id})`} />
        <path d="M80 112 V66 A40 40 0 0 1 160 66 V112" fill="none" stroke="#FFF4EA" strokeWidth="5" strokeLinejoin="round" />
        <rect x="114" y="20" width="12" height="9" rx="2" fill="#FFF4EA" />
        {/* rails and ties */}
        {TIES.map((y) => (
          <line key={y} x1={railX(y, -1) - 5} x2={railX(y, 1) + 5} y1={y} y2={y} stroke="#FFF4EA" strokeOpacity=".55" strokeWidth={1.6 + (y - 112) / 28} strokeLinecap="round" />
        ))}
        <line x1={railX(113, -1)} y1="113" x2={railX(172, -1)} y2="172" stroke="#FFF4EA" strokeWidth="3.2" strokeLinecap="round" />
        <line x1={railX(113, 1)} y1="113" x2={railX(172, 1)} y2="172" stroke="#FFF4EA" strokeWidth="3.2" strokeLinecap="round" />
        {/* cart, seen from behind, drives up into the mouth */}
        <g className="cart" style={{ transformOrigin: "120px 168px" }}>
          <rect x="99" y="158" width="9" height="10" rx="2" fill="#1c0607" />
          <rect x="132" y="158" width="9" height="10" rx="2" fill="#1c0607" />
          <rect x="100" y="135" width="40" height="28" rx="7" fill="#FFF4EA" />
          <rect x="100" y="148" width="40" height="6" fill="#D90F10" />
          <circle cx="120" cy="128" r="9.5" fill="#2a0d0e" />
          <circle cx="112" cy="124" r="4.4" fill="#2a0d0e" />
          <circle cx="128" cy="124" r="4.4" fill="#2a0d0e" />
          <circle cx="120" cy="119.500" r="4.6" fill="#2a0d0e" />
        </g>
      </svg>
      <span className="t-name">{lane.label}</span>
      <span className="t-blurb">{lane.blurb}</span>
    </Link>
  );
}
