"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Experience, LinkItem, Project, ProjectDocument, ProjectImage } from "@/lib/types";
import { slugify } from "@/lib/slugify";
import ImageUploader from "./ImageUploader";
import DocumentsRepeater from "./DocumentsRepeater";

const EMPTY: Omit<Project, "id" | "sort_order"> = {
  slug: "",
  title: "",
  org: "",
  category: "",
  type: "",
  date: "",
  short_desc: "",
  situation: "",
  problem: "",
  role: "",
  what_i_did: "",
  process: "",
  output: "",
  outcome: "",
  skills: [],
  tools_used: [],
  links: [],
  featured: false,
  visibility: "public",
  status: "draft",
  related_experience_id: null,
};

export default function ProjectEditor({
  project,
  experienceOptions,
  onCreated,
  onUpdated,
  onClose,
  toast,
}: {
  project: Project | null;
  experienceOptions: Experience[];
  onCreated: (p: Project) => void;
  onUpdated: (p: Project) => void;
  onClose: () => void;
  toast: (msg: string, error?: boolean) => void;
}) {
  const [form, setForm] = useState<Project>(
    project ?? { ...EMPTY, id: "", sort_order: 0 }
  );
  const [images, setImages] = useState<ProjectImage[]>([]);
  const [documents, setDocuments] = useState<ProjectDocument[]>([]);
  const [saving, setSaving] = useState(false);
  const [loadingAssets, setLoadingAssets] = useState(!!project);

  useEffect(() => {
    if (!project) return;
    const supabase = createClient();
    (async () => {
      const [imgRes, docRes] = await Promise.all([
        supabase
          .from("project_images")
          .select("*")
          .eq("project_id", project.id)
          .order("sort_order"),
        supabase
          .from("project_documents")
          .select("*")
          .eq("project_id", project.id)
          .order("sort_order"),
      ]);
      setImages((imgRes.data ?? []) as ProjectImage[]);
      setDocuments((docRes.data ?? []) as ProjectDocument[]);
      setLoadingAssets(false);
    })();
  }, [project]);

  function field<K extends keyof Project>(key: K, value: Project[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function addLink() {
    field("links", [...form.links, { label: "", url: "", visibility: "public" }]);
  }
  function updateLink(i: number, patch: Partial<LinkItem>) {
    field(
      "links",
      form.links.map((l, idx) => (idx === i ? { ...l, ...patch } : l))
    );
  }
  function removeLink(i: number) {
    field(
      "links",
      form.links.filter((_, idx) => idx !== i)
    );
  }

  async function save() {
    if (!form.title.trim()) {
      toast("Title is required", true);
      return;
    }
    setSaving(true);
    const supabase = createClient();
    const slug = form.slug.trim() || slugify(form.title);
    const payload = { ...form, slug };

    if (!form.id) {
      const { id, ...insertPayload } = payload;
      const { data, error } = await supabase
        .from("projects")
        .insert(insertPayload)
        .select()
        .single();
      setSaving(false);
      if (error) {
        toast(`Couldn't create project: ${error.message}`, true);
        return;
      }
      const created = data as Project;
      setForm(created);
      onCreated(created);
      toast("Project created — you can now add images and documents");
    } else {
      const { id, ...updatePayload } = payload;
      const { error } = await supabase
        .from("projects")
        .update(updatePayload)
        .eq("id", id);
      setSaving(false);
      if (error) {
        toast(`Couldn't save project: ${error.message}`, true);
        return;
      }
      onUpdated(payload);
      toast("Project saved");
    }
  }

  return (
    <div className="a-editor">
      <div className="a-editor-title">{form.id ? "Edit" : "New"} Project</div>

      <div className="a-row2">
        <div className="a-field">
          <label>Title</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => field("title", e.target.value)}
          />
        </div>
        <div className="a-field">
          <label>Organisation / Client</label>
          <input
            type="text"
            value={form.org}
            onChange={(e) => field("org", e.target.value)}
          />
        </div>
      </div>
      <div className="a-row2">
        <div className="a-field">
          <label>Category</label>
          <input
            type="text"
            value={form.category}
            onChange={(e) => field("category", e.target.value)}
          />
        </div>
        <div className="a-field">
          <label>Type</label>
          <input
            type="text"
            value={form.type}
            onChange={(e) => field("type", e.target.value)}
          />
        </div>
      </div>
      <div className="a-row2">
        <div className="a-field">
          <label>Date</label>
          <input
            type="text"
            value={form.date}
            onChange={(e) => field("date", e.target.value)}
          />
        </div>
        <div className="a-field">
          <label>Related Experience</label>
          <select
            value={form.related_experience_id ?? ""}
            onChange={(e) =>
              field("related_experience_id", e.target.value || null)
            }
          >
            <option value="">— none —</option>
            {experienceOptions.map((exp) => (
              <option key={exp.id} value={exp.id}>
                {exp.org}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="a-field">
        <label>URL slug</label>
        <input
          type="text"
          value={form.slug}
          placeholder={slugify(form.title) || "auto-generated-from-title"}
          onChange={(e) => field("slug", slugify(e.target.value))}
        />
      </div>
      <div className="a-field">
        <label>Short Description (homepage card)</label>
        <textarea
          value={form.short_desc}
          onChange={(e) => field("short_desc", e.target.value)}
        />
      </div>
      <div className="a-field">
        <label>The Situation</label>
        <textarea
          value={form.situation}
          onChange={(e) => field("situation", e.target.value)}
        />
      </div>
      <div className="a-field">
        <label>The Problem</label>
        <textarea
          value={form.problem}
          onChange={(e) => field("problem", e.target.value)}
        />
      </div>
      <div className="a-field">
        <label>My Role</label>
        <input
          type="text"
          value={form.role}
          onChange={(e) => field("role", e.target.value)}
        />
      </div>
      <div className="a-field">
        <label>What I Did</label>
        <textarea
          value={form.what_i_did}
          onChange={(e) => field("what_i_did", e.target.value)}
        />
      </div>
      <div className="a-field">
        <label>Process</label>
        <textarea
          value={form.process}
          onChange={(e) => field("process", e.target.value)}
        />
      </div>
      <div className="a-field">
        <label>Output</label>
        <textarea
          value={form.output}
          onChange={(e) => field("output", e.target.value)}
        />
      </div>
      <div className="a-field">
        <label>Outcome / Result (leave blank if none — never invent one)</label>
        <textarea
          value={form.outcome}
          onChange={(e) => field("outcome", e.target.value)}
        />
      </div>
      <div className="a-field">
        <label>Skills Demonstrated (comma-separated)</label>
        <input
          type="text"
          value={form.skills.join(", ")}
          onChange={(e) =>
            field(
              "skills",
              e.target.value.split(",").map((s) => s.trim()).filter(Boolean)
            )
          }
        />
      </div>
      <div className="a-field">
        <label>Tools Used (comma-separated)</label>
        <input
          type="text"
          value={form.tools_used.join(", ")}
          onChange={(e) =>
            field(
              "tools_used",
              e.target.value.split(",").map((s) => s.trim()).filter(Boolean)
            )
          }
        />
      </div>

      <span className="a-section-label">
        External Links (Drive, Notion, Canva, Figma, etc.)
      </span>
      {form.links.map((l, i) => (
        <div className="a-repeater-item" key={i}>
          <input
            type="text"
            placeholder="Label"
            value={l.label}
            style={{ maxWidth: 200 }}
            onChange={(e) => updateLink(i, { label: e.target.value })}
          />
          <input
            type="text"
            placeholder="URL"
            value={l.url}
            onChange={(e) => updateLink(i, { url: e.target.value })}
          />
          <select
            value={l.visibility}
            onChange={(e) =>
              updateLink(i, { visibility: e.target.value as "public" | "private" })
            }
          >
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>
          <button className="a-btn-danger" onClick={() => removeLink(i)}>
            ✕
          </button>
        </div>
      ))}
      <button className="a-add-row" onClick={addLink}>
        + Add link
      </button>

      <div style={{ height: 30 }} />

      {!form.id ? (
        <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 10 }}>
          Save the project once to enable image and document uploads.
        </p>
      ) : loadingAssets ? (
        <p style={{ fontSize: 13, color: "var(--muted)" }}>Loading assets…</p>
      ) : (
        <>
          <ImageUploader
            projectId={form.id}
            images={images}
            onChange={setImages}
            toast={toast}
          />
          <div style={{ height: 20 }} />
          <DocumentsRepeater
            projectId={form.id}
            documents={documents}
            onChange={setDocuments}
            toast={toast}
          />
          <div style={{ height: 20 }} />
        </>
      )}

      <div className="a-row2">
        <div className="a-field">
          <label>Status</label>
          <select
            value={form.status}
            onChange={(e) => field("status", e.target.value as Project["status"])}
          >
            <option value="draft">Draft</option>
            <option value="coming-soon">Coming Soon</option>
            <option value="published">Published</option>
          </select>
        </div>
        <div className="a-field">
          <label>Visibility</label>
          <select
            value={form.visibility}
            onChange={(e) =>
              field("visibility", e.target.value as Project["visibility"])
            }
          >
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>
        </div>
      </div>
      <div className="a-field">
        <label>
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(e) => field("featured", e.target.checked)}
          />
          Featured on homepage
        </label>
      </div>

      <button className="a-save" onClick={save} disabled={saving}>
        {saving ? "Saving…" : "Save Project"}
      </button>{" "}
      <button className="a-btn-ghost" onClick={onClose}>
        {form.id ? "Close" : "Cancel"}
      </button>
    </div>
  );
}
