"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  ShowcaseItem,
  ShowcaseKind,
  ShowcaseLane,
  ShowcaseMedia,
} from "@/lib/types";

const LANES: { id: ShowcaseLane; label: string }[] = [
  { id: "operations", label: "Operations" },
  { id: "hospitality", label: "Hospitality & travel" },
  { id: "events", label: "Events & creators" },
  { id: "writing", label: "Writing" },
];
const KINDS: { id: ShowcaseKind; label: string; hint: string }[] = [
  {
    id: "case_study",
    label: "Case study",
    hint: "A piece of work with a picture or video, one number and a short story.",
  },
  {
    id: "testimonial",
    label: "Testimonial",
    hint: "What a client or colleague said about working with you.",
  },
  {
    id: "gallery",
    label: "Gallery picture or video",
    hint: "A photo or clip from the field, with an optional caption.",
  },
];

type Draft = Omit<ShowcaseItem, "id" | "created_at"> & { id?: string };

const blank = (lane: ShowcaseLane): Draft => ({
  lane,
  kind: "case_study",
  title: "",
  client: "",
  summary: "",
  metric: "",
  metric_label: "",
  quote: "",
  author: "",
  author_role: "",
  media_url: "",
  media_type: "image",
  sort_order: 0,
  published: true,
});

const clean = (v: string | null | undefined) => (v && v.trim() ? v.trim() : null);

export default function ShowcasePanel({
  toast,
}: {
  toast: (msg: string, error?: boolean) => void;
}) {
  const [items, setItems] = useState<ShowcaseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [setupNeeded, setSetupNeeded] = useState(false);
  const [lane, setLane] = useState<ShowcaseLane>("operations");
  const [draft, setDraft] = useState<Draft | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const load = useCallback(async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("showcase_items")
      .select("*")
      .order("lane")
      .order("kind")
      .order("sort_order");
    if (error) {
      // 42P01 / PGRST205 = the table does not exist yet
      setSetupNeeded(true);
    } else {
      setItems((data ?? []) as ShowcaseItem[]);
      setSetupNeeded(false);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const visible = items.filter((i) => i.lane === lane);

  async function save() {
    if (!draft) return;
    if (draft.kind === "testimonial" && !clean(draft.quote)) {
      toast("Add the quote first", true);
      return;
    }
    if (draft.kind !== "testimonial" && !clean(draft.title) && !clean(draft.media_url)) {
      toast("Add a title or a picture/video", true);
      return;
    }
    setSaving(true);
    const supabase = createClient();
    const row = {
      lane: draft.lane,
      kind: draft.kind,
      title: clean(draft.title),
      client: clean(draft.client),
      summary: clean(draft.summary),
      metric: clean(draft.metric),
      metric_label: clean(draft.metric_label),
      quote: clean(draft.quote),
      author: clean(draft.author),
      author_role: clean(draft.author_role),
      media_url: clean(draft.media_url),
      media_type: clean(draft.media_url) ? draft.media_type : null,
      sort_order: Number.isFinite(draft.sort_order) ? draft.sort_order : 0,
      published: draft.published,
    };
    const { error } = draft.id
      ? await supabase.from("showcase_items").update(row).eq("id", draft.id)
      : await supabase.from("showcase_items").insert(row);
    setSaving(false);
    if (error) {
      toast(`Couldn't save: ${error.message}`, true);
      return;
    }
    toast("Saved");
    setDraft(null);
    load();
  }

  async function remove(item: ShowcaseItem) {
    if (!confirm("Delete this item? This cannot be undone.")) return;
    const supabase = createClient();
    const { error } = await supabase.from("showcase_items").delete().eq("id", item.id);
    if (error) {
      toast(`Couldn't delete: ${error.message}`, true);
      return;
    }
    toast("Deleted");
    load();
  }

  async function togglePublished(item: ShowcaseItem) {
    const supabase = createClient();
    const { error } = await supabase
      .from("showcase_items")
      .update({ published: !item.published })
      .eq("id", item.id);
    if (error) {
      toast(`Couldn't update: ${error.message}`, true);
      return;
    }
    load();
  }

  async function upload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !draft) return;
    const isVideo = file.type.startsWith("video/");
    const isImage = file.type.startsWith("image/");
    if (!isVideo && !isImage) {
      toast("Pick a picture or a video file", true);
      return;
    }
    const limit = isVideo ? 50 : 8;
    if (file.size > limit * 1024 * 1024) {
      toast(
        isVideo
          ? "Videos over 50MB won't upload. Compress it, or paste a YouTube link instead."
          : "Pictures over 8MB won't upload. Resize it first.",
        true
      );
      return;
    }
    setUploading(true);
    const supabase = createClient();
    const ext = (file.name.split(".").pop() || "bin").toLowerCase();
    const path = `${draft.lane}/${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage
      .from("showcase")
      .upload(path, file, { upsert: false, contentType: file.type });
    if (error) {
      setUploading(false);
      toast(`Upload failed: ${error.message}`, true);
      return;
    }
    const {
      data: { publicUrl },
    } = supabase.storage.from("showcase").getPublicUrl(path);
    setDraft({
      ...draft,
      media_url: publicUrl,
      media_type: (isVideo ? "video" : "image") as ShowcaseMedia,
    });
    setUploading(false);
    toast("Uploaded. Press Save to keep it.");
  }

  function pasteLink(url: string) {
    if (!draft) return;
    const isVideoLink = /youtu\.?be|vimeo\.com/i.test(url);
    const isFile = /\.(mp4|webm|mov)(\?|$)/i.test(url);
    setDraft({
      ...draft,
      media_url: url,
      media_type: isVideoLink ? "embed" : isFile ? "video" : draft.media_type ?? "image",
    });
  }

  if (loading) return <div className="a-empty">Loading…</div>;

  if (setupNeeded) {
    return (
      <div className="a-card" style={{ display: "block" }}>
        <b>One-time setup needed</b>
        <p style={{ marginTop: 10, lineHeight: 1.6 }}>
          The showcase table does not exist in your Supabase project yet. Open the
          Supabase dashboard, go to <b>SQL Editor → New query</b>, paste the contents of{" "}
          <code>supabase/showcase.sql</code> from this repo, press <b>Run</b>, then reload
          this page.
        </p>
      </div>
    );
  }

  if (draft) {
    const set = (patch: Partial<Draft>) => setDraft({ ...draft, ...patch });
    const kind = KINDS.find((k) => k.id === draft.kind)!;
    return (
      <div>
        <h3 style={{ fontFamily: "var(--serif)", fontSize: 24, marginBottom: 6 }}>
          {draft.id ? "Edit item" : "New item"}
        </h3>
        <p style={{ color: "var(--muted)", marginBottom: 22, fontSize: 14 }}>{kind.hint}</p>

        <div className="a-field">
          <label>Section it appears in</label>
          <select value={draft.lane} onChange={(e) => set({ lane: e.target.value as ShowcaseLane })}>
            {LANES.map((l) => (
              <option key={l.id} value={l.id}>
                {l.label}
              </option>
            ))}
          </select>
        </div>
        <div className="a-field">
          <label>What kind of item</label>
          <select value={draft.kind} onChange={(e) => set({ kind: e.target.value as ShowcaseKind })}>
            {KINDS.map((k) => (
              <option key={k.id} value={k.id}>
                {k.label}
              </option>
            ))}
          </select>
        </div>

        {draft.kind === "testimonial" ? (
          <>
            <div className="a-field">
              <label>Quote</label>
              <textarea value={draft.quote ?? ""} onChange={(e) => set({ quote: e.target.value })} />
            </div>
            <div className="a-field">
              <label>Name</label>
              <input type="text" value={draft.author ?? ""} onChange={(e) => set({ author: e.target.value })} />
            </div>
            <div className="a-field">
              <label>Their role</label>
              <input type="text" value={draft.author_role ?? ""} onChange={(e) => set({ author_role: e.target.value })} />
            </div>
            <div className="a-field">
              <label>Company</label>
              <input type="text" value={draft.client ?? ""} onChange={(e) => set({ client: e.target.value })} />
            </div>
          </>
        ) : (
          <>
            <div className="a-field">
              <label>{draft.kind === "gallery" ? "Caption (optional)" : "Title"}</label>
              <input type="text" value={draft.title ?? ""} onChange={(e) => set({ title: e.target.value })} />
            </div>
            {draft.kind === "case_study" && (
              <>
                <div className="a-field">
                  <label>Client or project</label>
                  <input type="text" value={draft.client ?? ""} onChange={(e) => set({ client: e.target.value })} />
                </div>
                <div className="a-field">
                  <label>One number that proves it (e.g. 42)</label>
                  <input type="text" value={draft.metric ?? ""} onChange={(e) => set({ metric: e.target.value })} />
                </div>
                <div className="a-field">
                  <label>What the number means (e.g. properties onboarded)</label>
                  <input type="text" value={draft.metric_label ?? ""} onChange={(e) => set({ metric_label: e.target.value })} />
                </div>
                <div className="a-field">
                  <label>The story in two or three lines</label>
                  <textarea value={draft.summary ?? ""} onChange={(e) => set({ summary: e.target.value })} />
                </div>
              </>
            )}
          </>
        )}

        <div className="a-field">
          <label>{draft.kind === "testimonial" ? "Photo of them (optional)" : "Picture or video"}</label>
          {draft.media_url && (
            <div style={{ marginBottom: 10 }}>
              {draft.media_type === "image" ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={draft.media_url} alt="" style={{ maxWidth: 260, borderRadius: 8 }} />
              ) : (
                <code style={{ fontSize: 12, wordBreak: "break-all" }}>{draft.media_url}</code>
              )}
            </div>
          )}
          <input type="file" accept="image/*,video/*" onChange={upload} disabled={uploading} />
          <p style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 8 }}>
            {uploading ? "Uploading…" : "Pictures up to 8MB, videos up to 50MB. Or paste a link below (YouTube and Vimeo links work)."}
          </p>
          <input
            type="url"
            placeholder="https://…"
            value={draft.media_url ?? ""}
            onChange={(e) => pasteLink(e.target.value)}
            style={{ marginTop: 8 }}
          />
          {draft.media_url && (
            <button type="button" className="a-btn-ghost" style={{ marginTop: 8 }} onClick={() => set({ media_url: "", media_type: "image" })}>
              Remove picture/video
            </button>
          )}
        </div>

        <div className="a-field">
          <label>Order (smaller numbers show first)</label>
          <input
            type="text"
            value={String(draft.sort_order)}
            onChange={(e) => set({ sort_order: parseInt(e.target.value || "0", 10) || 0 })}
          />
        </div>
        <div className="a-field">
          <label>
            <input type="checkbox" checked={draft.published} onChange={(e) => set({ published: e.target.checked })} />
            Show on the website
          </label>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button className="a-btn-ghost" onClick={save} disabled={saving || uploading}>
            {saving ? "Saving…" : "Save"}
          </button>
          <button className="a-btn-ghost" onClick={() => setDraft(null)}>
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <p style={{ color: "var(--muted)", marginBottom: 18, fontSize: 14, lineHeight: 1.6 }}>
        Case studies, testimonials and pictures/videos that appear on each section page of the
        rollercoaster site. A block stays hidden on the site until it has at least one published item.
      </p>
      <div className="admin-tabs" style={{ marginBottom: 24 }}>
        {LANES.map((l) => (
          <button key={l.id} className={`admin-tab${lane === l.id ? " active" : ""}`} onClick={() => setLane(l.id)}>
            {l.label} ({items.filter((i) => i.lane === l.id).length})
          </button>
        ))}
      </div>

      <div className="a-card-list">
        {visible.length === 0 && <div className="a-empty">Nothing here yet.</div>}
        {visible.map((it) => (
          <div className="a-card" key={it.id}>
            <div className="a-card-main">
              <b>
                {it.kind === "testimonial"
                  ? `“${(it.quote ?? "").slice(0, 60)}${(it.quote ?? "").length > 60 ? "…" : ""}”`
                  : it.title || "(untitled)"}
              </b>
              <div className="meta">
                {KINDS.find((k) => k.id === it.kind)?.label}
                {it.media_url ? ` · ${it.media_type}` : ""}
                <span className={`status-pill ${it.published ? "status-published" : "status-draft"}`}>
                  {it.published ? "published" : "hidden"}
                </span>
              </div>
            </div>
            <div className="a-card-actions">
              <button className="a-btn-ghost" onClick={() => togglePublished(it)}>
                {it.published ? "Hide" : "Show"}
              </button>
              <button className="a-btn-ghost" onClick={() => setDraft({ ...it })}>
                Edit
              </button>
              <button className="a-btn-danger" onClick={() => remove(it)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      <button className="a-btn-ghost" onClick={() => setDraft(blank(lane))}>
        + Add item
      </button>
    </div>
  );
}
