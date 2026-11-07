// Tiny interface sounds, made in the browser (no audio files). Off by default; the visitor turns them on.
let ctx: AudioContext | null = null;

export function soundOn(): boolean {
  try {
    return localStorage.getItem("sound") === "1";
  } catch {
    return false;
  }
}

export function setSound(on: boolean) {
  try {
    localStorage.setItem("sound", on ? "1" : "0");
  } catch {}
  window.dispatchEvent(new Event("soundchange"));
}

export function blip(kind: "tap" | "open" | "tick" = "tap") {
  if (!soundOn()) return;
  try {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return;
    ctx = ctx || new AC();
    if (ctx.state === "suspended") void ctx.resume();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    const [f1, f2, dur] = kind === "open" ? [420, 760, 0.16] : kind === "tick" ? [900, 900, 0.05] : [520, 640, 0.09];
    const t = ctx.currentTime;
    o.type = "sine";
    o.frequency.setValueAtTime(f1, t);
    o.frequency.exponentialRampToValueAtTime(f2, t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.07, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(ctx.destination);
    o.start(t);
    o.stop(t + dur + 0.02);
  } catch {}
}
