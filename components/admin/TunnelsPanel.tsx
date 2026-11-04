"use client";

import { useEffect, useState } from "react";
import { LANES, mergeLanes, type Lane, type LaneOverride } from "@/lib/lanes";
import { readBlock, saveBlock } from "./blocks";

type Col = { key: string; label: string; long?: boolean };

function ListEditor({
  title,
  hint,
  rows,
  cols,
  addLabel,
  onChange,
}: {
  title: string;
  hint?: string;
  rows: Record<string, string>[];
  cols: Col[];
  addLabel: string;
  onChange: (rows: Record<string, string>[]) => void;
}) {
  const blank = Object.fromEntries(cols.map((c) => [c.key, ""]));
  return (
    <div className="a-field">
      <span className="a-section-label">{title}</span>
      {hint && <small>{hint}</small>}
      {rows.map((r, i) => (
        <div className="a-card" key={i} style={{ display: "block", marginBottom: 10 }}>
          {cols.map((c) => (
            <div className="a-field" key={c.key} style={{ marginBottom: 12 }}>
              <label>{c.label}</label>
              {c.long ? (
                <textarea value={r[c.key] ?? ""} onChange={(e) => onChange(rows.map((x, j) => (j === i ? { ...x, [c.key]: e.target.value } : x)))} />
              ) : (
                <input type="text" value={r[c.key] ?? ""} onChange={(e) => onChange(rows.map((x, j) => (j === i ? { ...x, [c.key]: e.target.value } : x)))} />
              )}
            </div>
          ))}
          <button type="button" className="a-btn-danger" onClick={() => onChange(rows.filter((_, j) => j !== i))}>
            Remove
          </button>
        </div>
      ))}
      <button type="button" className="a-add-row" onClick={() => onChange([...rows, { ...blank }])}>
        + {addLabel}
      </button>
    </div>
  );
}

const STR = ["label", "blurb", "title", "who", "lede", "subject"] as const;
const ARR = ["offer", "roles", "projects"] as const;

function diff(cur: Lane, base: Lane): LaneOverride {
  const o: Record<string, unknown> = {};
  for (const k of STR) if (cur[k].trim() && cur[k] !== base[k]) o[k] = cur[k];
  for (const k of ARR) if (JSON.stringify(cur[k]) !== JSON.stringify(base[k])) o[k] = cur[k];
  return o as LaneOverride;
}

export default function TunnelsPanel({
  toast,
}: {
  toast: (msg: string, error?: boolean) => void;
}) {
  const [lanes, setLanes] = useState<Lane[]>(LANES);
  const [hidden, setHidden] = useState<string[]>(["writing"]);
  const [sel, setSel] = useState(LANES[0].id);
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const raw = await readBlock("lanes");
      const landing = await readBlock<{ hiddenLanes?: string[] }>("landing");
      setLanes(mergeLanes(raw));
      if (Array.isArray(landing?.hiddenLanes)) setHidden(landing!.hiddenLanes!);
      setLoaded(true);
    })();
  }, []);

  const lane = lanes.find((l) => l.id === sel)!;
  const base = LANES.find((l) => l.id === sel)!;
  const set = (patch: Partial<Lane>) => setLanes(lanes.map((l) => (l.id === sel ? { ...l, ...patch } : l)));
  const shown = !hidden.includes(sel);

  async function save() {
    setSaving(true);
    const overrides: Record<string, LaneOverride> = {};
    for (const l of lanes) {
      const d = diff(l, LANES.find((b) => b.id === l.id)!);
      if (Object.keys(d).length) overrides[l.id] = d;
    }
    const e1 = await saveBlock("lanes", overrides);
    const landing = (await readBlock<Record<string, unknown>>("landing")) ?? {};
    const e2 = await saveBlock("landing", { ...landing, hiddenLanes: hidden });
    setSaving(false);
    if (e1 || e2) toast(`Couldn't save: ${e1 || e2}`, true);
    else toast("Tunnels saved");
  }

  if (!loaded) return <p>Loading…</p>;

  const field = (key: (typeof STR)[number], label: string, hint: string, long = false) => (
    <div className="a-field">
      <label>{label}</label>
      {long ? (
        <textarea value={lane[key]} onChange={(e) => set({ [key]: e.target.value } as Partial<Lane>)} />
      ) : (
        <input type="text" value={lane[key]} onChange={(e) => set({ [key]: e.target.value } as Partial<Lane>)} />
      )}
      <small>{hint}</small>
    </div>
  );

  return (
    <div>
      <p className="a-lead">
        A tunnel is one of the doors on the home page and the page behind it. Pick a tunnel, edit its words, click
        Save. Pictures, videos, case studies and testimonials for a tunnel are added in the &ldquo;Tunnel
        content&rdquo; tab.
      </p>
      <div className="admin-subtabs">
        {lanes.map((l) => (
          <button key={l.id} className={`admin-subtab${sel === l.id ? " active" : ""}`} onClick={() => setSel(l.id)}>
            {l.label}
            {hidden.includes(l.id) ? " (hidden)" : ""}
          </button>
        ))}
      </div>

      <div className="a-editor">
        <div className="a-field">
          <label className="a-switch">
            <input
              type="checkbox"
              checked={shown}
              onChange={(e) => setHidden(e.target.checked ? hidden.filter((x) => x !== sel) : [...hidden, sel])}
            />
            <span>Show this tunnel on the site</span>
          </label>
          <small>Untick to hide it from the home page, the portfolio page and its own page. Your text is kept.</small>
        </div>

        <div className="a-group">
          <h3 className="a-group-title">On the home page (the tunnel card)</h3>
          {field("label", "Tunnel name", "The name under the tunnel and in the tunnel menu.")}
          {field("blurb", "One line under the name", "Keep it short. It sits under the tunnel on the home page.")}
        </div>

        <div className="a-group">
          <h3 className="a-group-title">At the top of the tunnel page</h3>
          {field("who", "Who it is for", "The small line above the big title.")}
          {field("title", "Big title", "The main heading of the page.")}
          {field("lede", "Opening paragraph", "Two sentences at most. Say what you do and one proof.", true)}
          {field("subject", "Email subject", "What the subject line says when someone emails you from this page.")}
        </div>

        <div className="a-group">
          <h3 className="a-group-title">Sections further down</h3>
          <ListEditor
            title="What I take on"
            hint="Two or three cards. A short title and one sentence each."
            rows={lane.offer}
            cols={[
              { key: "title", label: "Title" },
              { key: "text", label: "One sentence", long: true },
            ]}
            addLabel="Add a card"
            onChange={(rows) => set({ offer: rows as Lane["offer"] })}
          />
          <ListEditor
            title="Where I have done this (roles)"
            hint="One entry per job. Lead with what you did or changed, not the job title."
            rows={lane.roles}
            cols={[
              { key: "when", label: "When (for example Dec 2025 to Sep 2026)" },
              { key: "title", label: "Company, role" },
              { key: "text", label: "What you did", long: true },
            ]}
            addLabel="Add a role"
            onChange={(rows) => set({ roles: rows as Lane["roles"] })}
          />
          <ListEditor
            title="Projects"
            hint="Small cards. Leave empty to hide this section."
            rows={lane.projects}
            cols={[
              { key: "title", label: "Project" },
              { key: "where", label: "Where or for whom" },
              { key: "text", label: "One sentence", long: true },
            ]}
            addLabel="Add a project"
            onChange={(rows) => set({ projects: rows as Lane["projects"] })}
          />
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button className="a-save" onClick={save} disabled={saving}>
            {saving ? "Saving…" : "Save tunnels"}
          </button>
          <button
            type="button"
            className="a-btn-ghost"
            onClick={() => {
              setLanes(lanes.map((l) => (l.id === sel ? base : l)));
              toast("Reset to the original text. Click Save to keep it.");
            }}
          >
            Reset this tunnel to the original text
          </button>
          <a className="a-btn-ghost" href={`/lane/${sel}`} target="_blank" rel="noopener">
            See this tunnel page ↗
          </a>
        </div>
      </div>
    </div>
  );
}
