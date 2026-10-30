"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { ProjectDocument } from "@/lib/types";

export default function DocumentsRepeater({
  projectId,
  documents,
  onChange,
  toast,
}: {
  projectId: string;
  documents: ProjectDocument[];
  onChange: (docs: ProjectDocument[]) => void;
  toast: (msg: string, error?: boolean) => void;
}) {
  const [label, setLabel] = useState("");
  const [url, setUrl] = useState("");

  async function add() {
    if (!url.trim()) return;
    const supabase = createClient();
    const { data, error } = await supabase
      .from("project_documents")
      .insert({
        project_id: projectId,
        url: url.trim(),
        label: label.trim() || "View document",
        visibility: "public",
        sort_order: documents.length,
      })
      .select()
      .single();
    if (error) {
      toast(`Couldn't add document: ${error.message}`, true);
      return;
    }
    onChange([...documents, data as ProjectDocument]);
    setLabel("");
    setUrl("");
  }

  async function toggleVisibility(d: ProjectDocument) {
    const visibility = d.visibility === "public" ? "private" : "public";
    const supabase = createClient();
    const { error } = await supabase
      .from("project_documents")
      .update({ visibility })
      .eq("id", d.id);
    if (error) {
      toast(`Couldn't update: ${error.message}`, true);
      return;
    }
    onChange(documents.map((x) => (x.id === d.id ? { ...x, visibility } : x)));
  }

  async function remove(id: string) {
    const supabase = createClient();
    const { error } = await supabase
      .from("project_documents")
      .delete()
      .eq("id", id);
    if (error) {
      toast(`Couldn't delete: ${error.message}`, true);
      return;
    }
    onChange(documents.filter((d) => d.id !== id));
  }

  return (
    <div>
      <span className="a-section-label">
        Documents (PDF links, Drive/Docs links)
      </span>
      {documents.map((d) => (
        <div className="a-repeater-item" key={d.id}>
          <input value={d.label} readOnly style={{ maxWidth: 200 }} />
          <input value={d.url} readOnly />
          <button className="a-btn-icon" onClick={() => toggleVisibility(d)}>
            {d.visibility === "public" ? "Public" : "Private"}
          </button>
          <button className="a-btn-danger" onClick={() => remove(d.id)}>
            ✕
          </button>
        </div>
      ))}
      <div className="a-repeater-item">
        <input
          type="text"
          placeholder="Label"
          value={label}
          style={{ maxWidth: 200 }}
          onChange={(e) => setLabel(e.target.value)}
        />
        <input
          type="text"
          placeholder="URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button className="a-add-row" onClick={add}>
          + Add
        </button>
      </div>
    </div>
  );
}
