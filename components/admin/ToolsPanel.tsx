"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ToolsPanel({
  tools,
  onSaved,
  toast,
}: {
  tools: string[];
  onSaved: (t: string[]) => void;
  toast: (msg: string, error?: boolean) => void;
}) {
  const [value, setValue] = useState(tools.join(", "));
  const [saving, setSaving] = useState(false);

  async function save() {
    const list = value
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    setSaving(true);
    const supabase = createClient();
    const { error } = await supabase
      .from("content_blocks")
      .upsert({ key: "tools", value: list, updated_at: new Date().toISOString() });
    setSaving(false);
    if (error) {
      toast(`Couldn't save tools: ${error.message}`, true);
      return;
    }
    onSaved(list);
    toast("Tools saved");
  }

  return (
    <div className="a-editor">
      <div className="a-field">
        <label>Tools (comma-separated)</label>
        <input type="text" value={value} onChange={(e) => setValue(e.target.value)} />
      </div>
      <button className="a-save" onClick={save} disabled={saving}>
        {saving ? "Saving…" : "Save Tools"}
      </button>
    </div>
  );
}
