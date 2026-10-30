"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Settings } from "@/lib/types";

export default function SettingsPanel({
  settings,
  onSaved,
  toast,
}: {
  settings: Settings;
  onSaved: (s: Settings) => void;
  toast: (msg: string, error?: boolean) => void;
}) {
  const [form, setForm] = useState(settings);
  const [saving, setSaving] = useState(false);

  function field(key: keyof Settings, label: string, type = "text") {
    return (
      <div className="a-field">
        <label>{label}</label>
        <input
          type={type}
          value={form[key]}
          onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        />
      </div>
    );
  }

  async function save() {
    setSaving(true);
    const supabase = createClient();
    const { error } = await supabase
      .from("content_blocks")
      .upsert({ key: "settings", value: form, updated_at: new Date().toISOString() });
    setSaving(false);
    if (error) {
      toast(`Couldn't save settings: ${error.message}`, true);
      return;
    }
    onSaved(form);
    toast("Settings saved");
  }

  return (
    <div className="a-editor">
      <div className="a-row2">
        {field("name", "Name")}
        {field("tagline", "Tagline")}
      </div>
      {field("professionalTitle", "Professional Title")}
      <div className="a-row2">
        {field("email", "Email", "email")}
        {field("phone", "Phone", "tel")}
      </div>
      <div className="a-row2">
        {field("location", "Location")}
        {field("linkedin", "LinkedIn URL", "url")}
      </div>
      <div className="a-field">
        <label>Homepage Tagline</label>
        <textarea
          value={form.homepageTagline}
          onChange={(e) =>
            setForm({ ...form, homepageTagline: e.target.value })
          }
        />
      </div>
      {field("contactCTA", "Contact CTA Heading")}
      <button className="a-save" onClick={save} disabled={saving}>
        {saving ? "Saving…" : "Save Settings"}
      </button>
    </div>
  );
}
