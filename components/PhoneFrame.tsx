import type { ReactNode } from "react";

const Heart = () => (
  <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M12 20s-7-4.6-9-9.2C1.5 7 4 4 7 4c2 0 3.5 1 5 3 1.5-2 3-3 5-3 3 0 5.500 3 4 6.800C19 15.400 12 20 12 20z" />
  </svg>
);
const Chat = () => (
  <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M21 12a8 8 0 0 1-11.500 7.200L4 20l1-4.500A8 8 0 1 1 21 12z" />
  </svg>
);
const Send = () => (
  <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M22 3 2 11l7 3 3 7z M9 14l13-11" />
  </svg>
);

/** A phone showing one social post. The frame is a drawing, so nothing here pretends to be a real account. */
export default function PhoneFrame({ children, label = "Event post", caption, tilt = 0 }: { children: ReactNode; label?: string; caption?: string; tilt?: number }) {
  return (
    <div className="phone" style={{ ["--ptilt" as string]: `${tilt}deg` }}>
      <div className="phone-screen">
        <div className="phone-top">
          <i className="phone-av" />
          <b>{label}</b>
          <span aria-hidden="true">&middot;&middot;&middot;</span>
        </div>
        <div className="phone-img">{children}</div>
        <div className="phone-bar">
          <Heart />
          <Chat />
          <Send />
        </div>
        {caption && <p className="phone-cap">{caption}</p>}
      </div>
    </div>
  );
}
