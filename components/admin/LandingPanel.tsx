"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { LANES } from "@/lib/lanes";
import { DEFAULT_LANDING, LandingContent, mergeLanding } from "@/lib/landing";

export default function LandingPanel({
  toast,
}: {
  toast: (msg: string, error?: boolean) => void;
}) {
  const [form, setForm] = useState<LandingContent>(DEFAULT_LANDING);
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await createClient()
        .from("content_blocks")
        .select("value")
        .eq("key", "landing")
        .maybeSingle();
      if (data?.value) setForm(mergeLanding(data.value as Partial<LandingContent>));
      setLoaded(true);
    })();
  }, []);

  function text(key: keyof Omit<LandingContent, "hiddenLanes">, label: string, multiline = false, hint?: string) {
    return (
      <div className="a-field">
        <label>{label}</label>
        {multiline ? (
          <textarea value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
        ) : (
          <input value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
        )}
        {hint && <small>{hint}</small>}
      </div>
    );
  }

  function toggleLane(id: string, show: boolean) {
    const hidden = new Set(form.hiddenLanes);
    if (show) hidden.delete(id);
    else hidden.add(id);
    setForm({ ...form, hiddenLanes: Array.from(hidden) });
  }

  async function save() {
    setSaving(true);
    const { error } = await createClient()
      .from("content_blocks")
      .upsert({ key: "landing", value: form, updated_at: new Date().toISOString() });
    setSaving(false);
    if (error) {
      toast(`Couldn't save the landing page: ${error.message}`, true);
      return;
    }
    toast("Landing page saved");
  }

  if (!loaded) return <p>Loading…</p>;

  return (
    <div className="a-editor">
      <p>These are the words and tunnels on the first page of your site. Changes show up as soon as you save.</p>
      {text("heading", "Big heading", true, "Press Enter to start a new line.")}
      {text("subtext", "Short intro under the heading", true)}
      <div className="a-row2">
        {text("resumeLabel", "Resume button")}
        {text("portfolioLabel", "Portfolio button")}
      </div>
      <div className="a-row2">
        {text("stripTitle", "Bottom strip, bold part")}
        {text("stripText", "Bottom strip, rest of the line")}
      </div>

      <div className="a-field">
        <label>Tunnels to show</label>
        {LANES.map((l) => (
          <label key={l.id} style={{ display: "flex", gap: 8, alignItems: "center", textTransform: "none", letterSpacing: 0 }}>
            <input
              type="checkbox"
              style={{ width: "auto" }}
              checked={!form.hiddenLanes.includes(l.id)}
              onChange={(e) => toggleLane(l.id, e.target.checked)}
            />
            {l.label}
          </label>
        ))}
        <small>Untick a tunnel to hide it from the home page, the portfolio page and its own page.</small>
      </div>

      <button className="a-save" onClick={save} disabled={saving}>
        {saving ? "Saving…" : "Save Landing Page"}
      </button>
    </div>
  );
}
