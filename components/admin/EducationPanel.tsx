"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { EducationItem } from "@/lib/types";

export default function EducationPanel({
  education,
  onSaved,
  toast,
}: {
  education: EducationItem[];
  onSaved: (e: EducationItem[]) => void;
  toast: (msg: string, error?: boolean) => void;
}) {
  const [rows, setRows] = useState<EducationItem[]>(education);
  const [saving, setSaving] = useState(false);

  function add() {
    setRows([...rows, { degree: "", institution: "" }]);
  }
  function remove(i: number) {
    setRows(rows.filter((_, idx) => idx !== i));
  }
  function update(i: number, key: keyof EducationItem, val: string) {
    setRows(rows.map((r, idx) => (idx === i ? { ...r, [key]: val } : r)));
  }

  async function save() {
    setSaving(true);
    const supabase = createClient();
    const cleaned = rows.filter((r) => r.degree.trim());
    const { error } = await supabase
      .from("content_blocks")
      .upsert({ key: "education", value: cleaned, updated_at: new Date().toISOString() });
    setSaving(false);
    if (error) {
      toast(`Couldn't save education: ${error.message}`, true);
      return;
    }
    onSaved(cleaned);
    toast("Education saved");
  }

  return (
    <div className="a-editor">
      {rows.map((r, i) => (
        <div className="a-repeater-item" key={i}>
          <input
            type="text"
            value={r.degree}
            placeholder="Degree / Diploma"
            onChange={(e) => update(i, "degree", e.target.value)}
          />
          <input
            type="text"
            value={r.institution}
            placeholder="Institution"
            onChange={(e) => update(i, "institution", e.target.value)}
          />
          <button className="a-btn-danger" onClick={() => remove(i)}>
            ✕
          </button>
        </div>
      ))}
      <button className="a-add-row" onClick={add}>
        + Add education
      </button>
      <br />
      <br />
      <button className="a-save" onClick={save} disabled={saving}>
        {saving ? "Saving…" : "Save Education"}
      </button>
    </div>
  );
}
