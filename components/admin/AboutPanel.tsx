"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { About } from "@/lib/types";

export default function AboutPanel({
  about,
  onSaved,
  toast,
}: {
  about: About;
  onSaved: (a: About) => void;
  toast: (msg: string, error?: boolean) => void;
}) {
  const [form, setForm] = useState<About>(about);
  const [saving, setSaving] = useState(false);

  function setParagraph(i: number, val: string) {
    const paragraphs = [...form.paragraphs];
    paragraphs[i] = val;
    setForm({ ...form, paragraphs });
  }

  function addTag() {
    setForm({ ...form, tags: [...form.tags, { label: "New", value: "" }] });
  }
  function removeTag(i: number) {
    setForm({ ...form, tags: form.tags.filter((_, idx) => idx !== i) });
  }
  function setTag(i: number, key: "label" | "value", val: string) {
    const tags = form.tags.map((t, idx) =>
      idx === i ? { ...t, [key]: val } : t
    );
    setForm({ ...form, tags });
  }

  async function save() {
    setSaving(true);
    const supabase = createClient();
    const { error } = await supabase
      .from("content_blocks")
      .upsert({ key: "about", value: form, updated_at: new Date().toISOString() });
    setSaving(false);
    if (error) {
      toast(`Couldn't save About: ${error.message}`, true);
      return;
    }
    onSaved(form);
    toast("About saved");
  }

  return (
    <div className="a-editor">
      <div className="a-field">
        <label>Heading</label>
        <input
          type="text"
          value={form.heading}
          onChange={(e) => setForm({ ...form, heading: e.target.value })}
        />
      </div>
      {[0, 1, 2].map((i) => (
        <div className="a-field" key={i}>
          <label>Paragraph {i + 1}</label>
          <textarea
            value={form.paragraphs[i] || ""}
            onChange={(e) => setParagraph(i, e.target.value)}
          />
        </div>
      ))}
      <span className="a-section-label">Sidebar Facts</span>
      {form.tags.map((t, i) => (
        <div className="a-repeater-item" key={i}>
          <input
            type="text"
            placeholder="Label"
            value={t.label}
            style={{ maxWidth: 200 }}
            onChange={(e) => setTag(i, "label", e.target.value)}
          />
          <input
            type="text"
            placeholder="Value"
            value={t.value}
            onChange={(e) => setTag(i, "value", e.target.value)}
          />
          <button className="a-btn-danger" onClick={() => removeTag(i)}>
            ✕
          </button>
        </div>
      ))}
      <button className="a-add-row" onClick={addTag}>
        + Add fact
      </button>
      <br />
      <br />
      <button className="a-save" onClick={save} disabled={saving}>
        {saving ? "Saving…" : "Save About"}
      </button>
    </div>
  );
}
