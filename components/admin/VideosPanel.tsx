"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { LANES } from "@/lib/lanes";
import { DEFAULT_VIDEOS, mergeVideos, type VideoConfig, type VideoItem } from "@/lib/videos";
import { safeUrl } from "@/lib/showcase";
import VideoBlock from "@/components/VideoBlock";
import { readBlock, saveBlock } from "./blocks";

const MAX_VIDEO_MB = 50;
const MAX_POSTER_MB = 5;
const BUCKET = "site-media";

type Toast = (msg: string, error?: boolean) => void;

async function upload(file: File, folder: string, toast: Toast): Promise<string | null> {
  const supabase = createClient();
  const ext = (file.name.split(".").pop() || "bin").toLowerCase().replace(/[^a-z0-9]/g, "");
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { upsert: false, contentType: file.type || undefined, cacheControl: "31536000" });
  if (error) {
    toast(
      /not found|bucket/i.test(error.message)
        ? "The storage folder doesn't exist yet. Run supabase/site-editing.sql in Supabase first."
        : `Upload failed: ${error.message}`,
      true
    );
    return null;
  }
  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}

function VideoEditor({
  value,
  onChange,
  toast,
  folder,
}: {
  value: VideoItem | null;
  onChange: (v: VideoItem | null) => void;
  toast: Toast;
  folder: string;
}) {
  const [busy, setBusy] = useState(false);
  const [link, setLink] = useState("");

  async function onVideo(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("video/")) return toast("That isn't a video file", true);
    if (file.size > MAX_VIDEO_MB * 1024 * 1024) {
      return toast(`That file is over ${MAX_VIDEO_MB} MB. Compress it, or upload it to YouTube (unlisted) and paste the link.`, true);
    }
    if (file.type === "video/quicktime") toast("MOV files don't play in every browser. MP4 is safer.");
    setBusy(true);
    const url = await upload(file, `${folder}/video`, toast);
    setBusy(false);
    if (url) onChange({ url, kind: "upload", title: value?.title, caption: value?.caption });
  }

  async function onPoster(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !value) return;
    if (!file.type.startsWith("image/")) return toast("That isn't an image", true);
    if (file.size > MAX_POSTER_MB * 1024 * 1024) return toast(`Cover picture is over ${MAX_POSTER_MB} MB`, true);
    setBusy(true);
    const url = await upload(file, `${folder}/cover`, toast);
    setBusy(false);
    if (url) onChange({ ...value, poster: url });
  }

  function useLink() {
    const url = safeUrl(link.trim());
    if (!url || !/(youtube\.com|youtu\.be|vimeo\.com)/i.test(url)) {
      return toast("Paste a YouTube or Vimeo link", true);
    }
    onChange({ url, kind: "embed" });
    setLink("");
  }

  if (!value) {
    return (
      <div>
        <div className="a-field">
          <label>Upload a video file</label>
          <label className="a-upload-label">
            {busy ? "Uploading…" : "Choose a video"}
            <input type="file" accept="video/mp4,video/webm,video/quicktime" onChange={onVideo} disabled={busy} />
          </label>
          <small>MP4 works best. Up to {MAX_VIDEO_MB} MB (about 90 seconds at 720p). </small>
        </div>
        <div className="a-field">
          <label>Or paste a YouTube or Vimeo link</label>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <input type="text" style={{ flex: 1, minWidth: 220 }} value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://www.youtube.com/watch?v=…" />
            <button type="button" className="a-btn-ghost" onClick={useLink}>
              Use this link
            </button>
          </div>
          <small>Best for longer videos. On YouTube set it to Unlisted so only people with your site can find it.</small>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="a-video-prev">
        <VideoBlock item={value} />
      </div>
      <div className="a-row2" style={{ marginTop: 14 }}>
        <div className="a-field">
          <label>Title (optional)</label>
          <input type="text" value={value.title ?? ""} onChange={(e) => onChange({ ...value, title: e.target.value })} />
        </div>
        <div className="a-field">
          <label>One line under the video (optional)</label>
          <input type="text" value={value.caption ?? ""} onChange={(e) => onChange({ ...value, caption: e.target.value })} />
        </div>
      </div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
        {value.kind === "upload" && (
          <label className="a-upload-label">
            {busy ? "Uploading…" : value.poster ? "Change cover picture" : "Add a cover picture"}
            <input type="file" accept="image/*" onChange={onPoster} disabled={busy} />
          </label>
        )}
        <button type="button" className="a-btn-danger" onClick={() => onChange(null)}>
          Remove video
        </button>
      </div>
      {value.kind === "upload" && !value.poster && (
        <small style={{ display: "block", marginTop: 8, color: "var(--muted)" }}>
          A cover picture is the still shown before someone presses play. Use a clear frame of your face.
        </small>
      )}
    </div>
  );
}

export default function VideosPanel({ toast }: { toast: Toast }) {
  const [cfg, setCfg] = useState<VideoConfig>(DEFAULT_VIDEOS);
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    readBlock("videos").then((raw) => {
      setCfg(mergeVideos(raw));
      setLoaded(true);
    });
  }, []);

  async function save() {
    setSaving(true);
    const err = await saveBlock("videos", cfg);
    setSaving(false);
    if (err) toast(`Couldn't save: ${err}`, true);
    else toast("Videos saved");
  }

  const tick = (key: "showHome" | "showPortfolio" | "showResume" | "showTunnels", label: string, hint: string) => (
    <label className="a-lane on" style={{ cursor: "pointer" }}>
      <input type="checkbox" checked={cfg[key]} onChange={(e) => setCfg({ ...cfg, [key]: e.target.checked })} />
      <span>{label}</span>
      <em>{hint}</em>
    </label>
  );

  if (!loaded) return <p>Loading…</p>;

  return (
    <div>
      <p className="a-lead">
        A short video of you for people who would rather watch than read. Say who you are, what you have done and what
        you want to do next. Aim for 60 to 90 seconds, filmed on your phone, facing a window.
      </p>

      <div className="a-editor">
        <h3 className="a-group-title">Your intro video</h3>
        <VideoEditor value={cfg.intro} onChange={(v) => setCfg({ ...cfg, intro: v })} toast={toast} folder="intro" />

        <h3 className="a-group-title" style={{ marginTop: 28 }}>
          Where it appears
        </h3>
        <div className="a-lanes">
          {tick("showHome", "Home page", "a Watch my intro button opens it in a pop-up")}
          {tick("showPortfolio", "Portfolio page", "a block near the top")}
          {tick("showResume", "Resume page", "at the top, hidden when printing")}
          {tick("showTunnels", "Tunnel pages", "only the ones without their own video")}
        </div>
        <button className="a-save" style={{ marginTop: 22 }} onClick={save} disabled={saving}>
          {saving ? "Saving…" : "Save videos"}
        </button>
      </div>

      <div className="a-editor">
        <h3 className="a-group-title">A different video for one tunnel (optional)</h3>
        <p className="a-lead" style={{ marginTop: 0 }}>
          For example, a trek clip on the Hospitality page. It replaces the intro video on that tunnel page.
        </p>
        {LANES.filter((l) => l.id !== "writing").map((l) => (
          <div className="a-group" key={l.id}>
            <h3 className="a-group-title">{l.label}</h3>
            <VideoEditor
              value={cfg.lanes[l.id] ?? null}
              onChange={(v) => setCfg({ ...cfg, lanes: { ...cfg.lanes, [l.id]: v } })}
              toast={toast}
              folder={`tunnel-${l.id}`}
            />
          </div>
        ))}
        <button className="a-save" onClick={save} disabled={saving}>
          {saving ? "Saving…" : "Save videos"}
        </button>
      </div>
    </div>
  );
}
