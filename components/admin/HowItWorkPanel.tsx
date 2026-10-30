"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { HowItem } from "@/lib/types";

export default function HowItWorkPanel({
  howIWork,
  onSaved,
  toast,
}: {
  howIWork: HowItem[];
  onSaved: (h: HowItem[]) => void;
  toast: (msg: string, error?: boolean) => void;
}) {
  const [rows, setRows] = useState<HowItem[]>(howIWork);
  const [saving, setSaving] = useState(false);

  function add() {
    setRows([...rows, { title: "", desc: "" }]);
  }
  function remove(i: number) {
    setRows(rows.filter((_, idx) => idx !== i));
  }
  function update(i: number, key: keyof HowItem, val: string) {
    setRows(rows.map((r, idx) => (idx === i ? { ...r, [key]: val } : r)));
  }

  async function save() {
    setSaving(true);
    const supabase = createClient();
    const { error } = await supabase
      .from("content_blocks")
      .upsert({ key: "howIWork", value: rows, updated_at: new Date().toISOString() });
    setSaving(false);
    if (error) {
      toast(`Couldn't save: ${error.message}`, true);
      return;
    }
    onSaved(rows);
    toast("How I Work saved");
  }

  return (
    <div className="a-editor">
      {rows.map((r, i) => (
        <div
          key={i}
          style={{
            border: "1px solid var(--line)",
            borderRadius: 6,
            padding: 16,
            marginBottom: 12,
          }}
        >
          <div className="a-field">
            <label>Step {i + 1} Title</label>
            <input
              type="text"
              value={r.title}
              onChange={(e) => update(i, "title", e.target.value)}
            />
          </div>
          <div className="a-field">
            <label>Description</label>
            <textarea
              value={r.desc}
              onChange={(e) => update(i, "desc", e.target.value)}
            />
          </div>
          <button className="a-btn-danger" onClick={() => remove(i)}>
            Remove
          </button>
        </div>
      ))}
      <button className="a-add-row" onClick={add}>
        + Add step
      </button>
      <br />
      <br />
      <button className="a-save" onClick={save} disabled={saving}>
        {saving ? "Saving…" : "Save How I Work"}
      </button>
    </div>
  );
}
