"use client";

import { useEffect, useState } from "react";
import { COPY_DEFAULTS, COPY_FIELDS, COPY_PAGES, PageId } from "@/lib/sitecopy";
import { readBlock, saveBlock } from "./blocks";

export default function SiteTextPanel({
  toast,
}: {
  toast: (msg: string, error?: boolean) => void;
}) {
  const [page, setPage] = useState<PageId>("home");
  const [vals, setVals] = useState<Record<string, string>>({ ...COPY_DEFAULTS });
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    readBlock<Record<string, string>>("sitecopy").then((raw) => {
      const v = { ...COPY_DEFAULTS };
      if (raw) for (const [k, x] of Object.entries(raw)) if (k in v && typeof x === "string" && x.trim()) v[k] = x;
      setVals(v);
      setLoaded(true);
    });
  }, []);

  const info = COPY_PAGES.find((p) => p.id === page)!;
  const fields = COPY_FIELDS.filter((f) => f.page === page);
  const sections = Array.from(new Set(fields.map((f) => f.section)));
  const changed = (p: PageId) => COPY_FIELDS.filter((f) => f.page === p && (vals[f.key] ?? "") !== f.value).length;

  async function save() {
    setSaving(true);
    const out: Record<string, string> = {};
    for (const f of COPY_FIELDS) {
      const v = vals[f.key] ?? "";
      if (v.trim() && v !== f.value) out[f.key] = v;
    }
    const err = await saveBlock("sitecopy", out);
    setSaving(false);
    if (err) toast(`Couldn't save: ${err}`, true);
    else toast("Text saved");
  }

  if (!loaded) return <p>Loading…</p>;

  return (
    <div>
      <p className="a-lead">
        Every fixed heading, label and button on the site is here, grouped by the page it appears on. Edit the text,
        click Save. Clear a box and it goes back to the original wording. Text that belongs to a section (your About
        paragraphs, case studies, experience) is in its own tab.
      </p>
      <div className="admin-subtabs">
        {COPY_PAGES.map((p) => (
          <button key={p.id} className={`admin-subtab${page === p.id ? " active" : ""}`} onClick={() => setPage(p.id)}>
            {p.label}
            {changed(p.id) > 0 ? ` (${changed(p.id)} edited)` : ""}
          </button>
        ))}
      </div>
      <p className="a-lead">
        {info.note}{" "}
        <a href={info.path} target="_blank" rel="noopener">
          Open this page ↗
        </a>
      </p>

      <div className="a-editor">
        {sections.map((sec) => (
          <div key={sec} className="a-group">
            <h3 className="a-group-title">{sec}</h3>
            {fields
              .filter((f) => f.section === sec)
              .map((f) => (
                <div className="a-field" key={f.key}>
                  <label>
                    {f.label}
                    {(vals[f.key] ?? "") !== f.value && (
                      <button type="button" className="a-reset" onClick={() => setVals({ ...vals, [f.key]: f.value })}>
                        Reset
                      </button>
                    )}
                  </label>
                  {f.long ? (
                    <textarea value={vals[f.key] ?? ""} onChange={(e) => setVals({ ...vals, [f.key]: e.target.value })} />
                  ) : (
                    <input type="text" value={vals[f.key] ?? ""} onChange={(e) => setVals({ ...vals, [f.key]: e.target.value })} />
                  )}
                </div>
              ))}
          </div>
        ))}
        <button className="a-save" onClick={save} disabled={saving}>
          {saving ? "Saving…" : "Save text"}
        </button>
      </div>
    </div>
  );
}
