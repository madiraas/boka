"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Experience, Project } from "@/lib/types";
import ProjectEditor from "./ProjectEditor";

export default function ProjectsPanel({
  projects,
  experience,
  onSaved,
  toast,
}: {
  projects: Project[];
  experience: Experience[];
  onSaved: (projects: Project[]) => void;
  toast: (msg: string, error?: boolean) => void;
}) {
  const [editing, setEditing] = useState<Project | null | "new">(null);
  const sorted = [...projects].sort((a, b) => a.sort_order - b.sort_order);

  async function move(index: number, dir: -1 | 1) {
    const targetIndex = index + dir;
    if (targetIndex < 0 || targetIndex >= sorted.length) return;
    const a = sorted[index];
    const b = sorted[targetIndex];
    const supabase = createClient();
    const [{ error: e1 }, { error: e2 }] = await Promise.all([
      supabase.from("projects").update({ sort_order: b.sort_order }).eq("id", a.id),
      supabase.from("projects").update({ sort_order: a.sort_order }).eq("id", b.id),
    ]);
    if (e1 || e2) {
      toast(`Couldn't reorder: ${(e1 || e2)?.message}`, true);
      return;
    }
    onSaved(
      projects.map((p) => {
        if (p.id === a.id) return { ...p, sort_order: b.sort_order };
        if (p.id === b.id) return { ...p, sort_order: a.sort_order };
        return p;
      })
    );
  }

  async function remove(id: string) {
    if (!confirm("Delete this project? Its images and documents go with it. This cannot be undone.")) return;
    const supabase = createClient();
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) {
      toast(`Couldn't delete: ${error.message}`, true);
      return;
    }
    onSaved(projects.filter((p) => p.id !== id));
    toast("Deleted");
  }

  function handleCreated(p: Project) {
    onSaved([...projects, p]);
    setEditing(p);
  }
  function handleUpdated(p: Project) {
    onSaved(projects.map((x) => (x.id === p.id ? p : x)));
    setEditing(p);
  }

  if (editing) {
    return (
      <ProjectEditor
        project={editing === "new" ? null : editing}
        experienceOptions={experience}
        onCreated={handleCreated}
        onUpdated={handleUpdated}
        onClose={() => setEditing(null)}
        toast={toast}
      />
    );
  }

  return (
    <div>
      <div className="a-card-list">
        {sorted.length === 0 && (
          <div className="a-empty">No projects yet.</div>
        )}
        {sorted.map((p, i) => (
          <div className="a-card" key={p.id}>
            <div className="a-card-main">
              <b>{p.title}</b>
              <div className="meta">
                {p.org} · {p.category}
                <span className={`status-pill status-${p.status}`}>
                  {p.status}
                </span>
                {p.featured && (
                  <span
                    className="status-pill"
                    style={{ color: "var(--accent)", borderColor: "var(--accent)" }}
                  >
                    Featured
                  </span>
                )}
                {p.visibility === "private" && (
                  <span className="status-pill vis-private">Private</span>
                )}
              </div>
            </div>
            <div className="a-card-actions">
              <button
                className="a-btn-icon"
                onClick={() => move(i, -1)}
                disabled={i === 0}
                title="Move up"
              >
                ↑
              </button>
              <button
                className="a-btn-icon"
                onClick={() => move(i, 1)}
                disabled={i === sorted.length - 1}
                title="Move down"
              >
                ↓
              </button>
              <button className="a-btn-ghost" onClick={() => setEditing(p)}>
                Edit
              </button>
              <button className="a-btn-danger" onClick={() => remove(p.id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      <button className="a-btn-ghost" onClick={() => setEditing("new")}>
        + Add Project
      </button>
    </div>
  );
}
