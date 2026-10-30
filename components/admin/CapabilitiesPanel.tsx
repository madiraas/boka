"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Capability } from "@/lib/types";

export default function CapabilitiesPanel({
  capabilities,
  problems,
  onSaved,
  toast,
}: {
  capabilities: Capability[];
  problems: string[];
  onSaved: (capabilities: Capability[], problems: string[]) => void;
  toast: (msg: string, error?: boolean) => void;
}) {
  const [caps, setCaps] = useState<Capability[]>(capabilities);
  const [probs, setProbs] = useState<string[]>(problems);
  const [saving, setSaving] = useState(false);

  function addCap() {
    setCaps([...caps, { title: "New capability", desc: "" }]);
  }
  function removeCap(i: number) {
    setCaps(caps.filter((_, idx) => idx !== i));
  }
  function updateCap(i: number, key: keyof Capability, val: string) {
    setCaps(caps.map((c, idx) => (idx === i ? { ...c, [key]: val } : c)));
  }

  function addProb() {
    setProbs([...probs, ""]);
  }
  function removeProb(i: number) {
    setProbs(probs.filter((_, idx) => idx !== i));
  }
  function updateProb(i: number, val: string) {
    setProbs(probs.map((p, idx) => (idx === i ? val : p)));
  }

  async function save() {
    setSaving(true);
    const supabase = createClient();
    const now = new Date().toISOString();
    const { error } = await supabase.from("content_blocks").upsert([
      { key: "capabilities", value: caps, updated_at: now },
      { key: "problems", value: probs.filter(Boolean), updated_at: now },
    ]);
    setSaving(false);
    if (error) {
      toast(`Couldn't save: ${error.message}`, true);
      return;
    }
    onSaved(caps, probs.filter(Boolean));
    toast("Capabilities saved");
  }

  return (
    <div className="a-editor">
      <span className="a-section-label">
        Problem strip (short italic lines shown above the capability grid)
      </span>
      {probs.map((p, i) => (
        <div className="a-repeater-item" key={i}>
          <input
            type="text"
            value={p}
            onChange={(e) => updateProb(i, e.target.value)}
            placeholder="We need to find 20 speakers."
          />
          <button className="a-btn-danger" onClick={() => removeProb(i)}>
            ✕
          </button>
        </div>
      ))}
      <button className="a-add-row" onClick={addProb}>
        + Add problem line
      </button>

      <div style={{ height: 30 }} />
      <span className="a-section-label">Capabilities</span>
      {caps.map((c, i) => (
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
            <label>Title</label>
            <input
              type="text"
              value={c.title}
              onChange={(e) => updateCap(i, "title", e.target.value)}
            />
          </div>
          <div className="a-field">
            <label>Description</label>
            <textarea
              value={c.desc}
              onChange={(e) => updateCap(i, "desc", e.target.value)}
            />
          </div>
          <button className="a-btn-danger" onClick={() => removeCap(i)}>
            Remove
          </button>
        </div>
      ))}
      <button className="a-add-row" onClick={addCap}>
        + Add capability
      </button>
      <br />
      <br />
      <button className="a-save" onClick={save} disabled={saving}>
        {saving ? "Saving…" : "Save Capabilities"}
      </button>
    </div>
  );
}
