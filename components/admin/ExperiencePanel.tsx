"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Experience, ExperienceKind } from "@/lib/types";

const EMPTY: Omit<Experience, "id" | "sort_order"> = {
  kind: "experience",
  org: "",
  role: "",
  dates: "",
  context: "",
  responsibilities: "",
  demonstrates: "",
};

export default function ExperiencePanel({
  kind,
  title,
  items,
  onSaved,
  toast,
}: {
  kind: ExperienceKind;
  title: string;
  items: Experience[];
  onSaved: (items: Experience[]) => void;
  toast: (msg: string, error?: boolean) => void;
}) {
  const [editing, setEditing] = useState<Experience | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);

  function startEdit(item: Experience | null) {
    if (item) {
      setEditing(item);
      setIsNew(false);
    } else {
      setEditing({
        ...EMPTY,
        kind,
        id: "",
        sort_order: items.length,
      });
      setIsNew(true);
    }
  }

  async function save() {
    if (!editing) return;
    setSaving(true);
    const supabase = createClient();
    if (isNew) {
      const { id, ...insertPayload } = editing;
      const { data, error } = await supabase
        .from("experience")
        .insert(insertPayload)
        .select()
        .single();
      setSaving(false);
      if (error) {
        toast(`Couldn't save: ${error.message}`, true);
        return;
      }
      onSaved([...items, data as Experience]);
    } else {
      const { id, ...updatePayload } = editing;
      const { error } = await supabase
        .from("experience")
        .update(updatePayload)
        .eq("id", id);
      setSaving(false);
      if (error) {
        toast(`Couldn't save: ${error.message}`, true);
        return;
      }
      onSaved(items.map((i) => (i.id === id ? editing : i)));
    }
    setEditing(null);
    toast(`${title} saved`);
  }

  async function remove(id: string) {
    if (!confirm("Delete this entry? This cannot be undone.")) return;
    const supabase = createClient();
    const { error } = await supabase.from("experience").delete().eq("id", id);
    if (error) {
      toast(`Couldn't delete: ${error.message}`, true);
      return;
    }
    onSaved(items.filter((i) => i.id !== id));
    toast("Deleted");
  }

  return (
    <div>
      <div className="a-card-list">
        {items.length === 0 && (
          <div className="a-empty">No {title.toLowerCase()} entries yet.</div>
        )}
        {items.map((e) => (
          <div className="a-card" key={e.id}>
            <div className="a-card-main">
              <b>{e.org}</b>
              <div className="meta">
                {e.role} · {e.dates}
              </div>
            </div>
            <div className="a-card-actions">
              <button className="a-btn-ghost" onClick={() => startEdit(e)}>
                Edit
              </button>
              <button className="a-btn-danger" onClick={() => remove(e.id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      <button className="a-btn-ghost" onClick={() => startEdit(null)}>
        + Add {title}
      </button>

      {editing && (
        <div className="a-editor" style={{ marginTop: 24 }}>
          <div className="a-editor-title">
            {isNew ? "New" : "Edit"} {title}
          </div>
          <div className="a-row2">
            <div className="a-field">
              <label>Organisation</label>
              <input
                type="text"
                value={editing.org}
                onChange={(e) => setEditing({ ...editing, org: e.target.value })}
              />
            </div>
            <div className="a-field">
              <label>Role</label>
              <input
                type="text"
                value={editing.role}
                onChange={(e) => setEditing({ ...editing, role: e.target.value })}
              />
            </div>
          </div>
          <div className="a-field">
            <label>Dates</label>
            <input
              type="text"
              value={editing.dates}
              onChange={(e) => setEditing({ ...editing, dates: e.target.value })}
            />
          </div>
          <div className="a-field">
            <label>Context</label>
            <textarea
              value={editing.context}
              onChange={(e) =>
                setEditing({ ...editing, context: e.target.value })
              }
            />
          </div>
          <div className="a-field">
            <label>Responsibilities / Key Work</label>
            <textarea
              value={editing.responsibilities}
              onChange={(e) =>
                setEditing({ ...editing, responsibilities: e.target.value })
              }
            />
          </div>
          <div className="a-field">
            <label>Demonstrates</label>
            <textarea
              value={editing.demonstrates}
              onChange={(e) =>
                setEditing({ ...editing, demonstrates: e.target.value })
              }
            />
          </div>
          <button className="a-save" onClick={save} disabled={saving}>
            {saving ? "Saving…" : "Save"}
          </button>{" "}
          <button className="a-btn-ghost" onClick={() => setEditing(null)}>
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
