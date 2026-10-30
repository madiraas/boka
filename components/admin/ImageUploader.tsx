"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { ProjectImage } from "@/lib/types";

export default function ImageUploader({
  projectId,
  images,
  onChange,
  toast,
}: {
  projectId: string;
  images: ProjectImage[];
  onChange: (images: ProjectImage[]) => void;
  toast: (msg: string, error?: boolean) => void;
}) {
  const [uploading, setUploading] = useState(false);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast("That file isn't an image", true);
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      toast("Image is larger than 8MB", true);
      return;
    }

    setUploading(true);
    const supabase = createClient();
    const ext = file.name.split(".").pop();
    const path = `projects/${projectId}/${crypto.randomUUID()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("project-assets")
      .upload(path, file, { upsert: false });

    if (uploadError) {
      setUploading(false);
      toast(`Upload failed: ${uploadError.message}`, true);
      return;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("project-assets").getPublicUrl(path);

    const { data, error: insertError } = await supabase
      .from("project_images")
      .insert({
        project_id: projectId,
        url: publicUrl,
        caption: "",
        visibility: "public",
        sort_order: images.length,
      })
      .select()
      .single();

    setUploading(false);

    if (insertError) {
      toast(`Uploaded, but couldn't save it: ${insertError.message}`, true);
      return;
    }

    onChange([...images, data as ProjectImage]);
    toast("Image uploaded");
  }

  async function updateCaption(id: string, caption: string) {
    onChange(images.map((im) => (im.id === id ? { ...im, caption } : im)));
  }

  async function persistCaption(id: string, caption: string) {
    const supabase = createClient();
    await supabase.from("project_images").update({ caption }).eq("id", id);
  }

  async function toggleVisibility(im: ProjectImage) {
    const visibility = im.visibility === "public" ? "private" : "public";
    const supabase = createClient();
    const { error } = await supabase
      .from("project_images")
      .update({ visibility })
      .eq("id", im.id);
    if (error) {
      toast(`Couldn't update: ${error.message}`, true);
      return;
    }
    onChange(images.map((i) => (i.id === im.id ? { ...i, visibility } : i)));
  }

  async function removeImage(id: string) {
    const supabase = createClient();
    const { error } = await supabase.from("project_images").delete().eq("id", id);
    if (error) {
      toast(`Couldn't delete: ${error.message}`, true);
      return;
    }
    onChange(images.filter((im) => im.id !== id));
  }

  return (
    <div>
      <span className="a-section-label">Images</span>
      {images.length > 0 && (
        <div className="a-thumb-row">
          {images.map((im) => (
            <div key={im.id}>
              <div className="a-thumb">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={im.url} alt={im.caption || ""} />
                <button onClick={() => removeImage(im.id)} title="Remove">
                  ✕
                </button>
              </div>
              <input
                type="text"
                placeholder="Caption"
                value={im.caption}
                onChange={(e) => updateCaption(im.id, e.target.value)}
                onBlur={(e) => persistCaption(im.id, e.target.value)}
                style={{
                  width: 84,
                  fontSize: 11,
                  marginTop: 4,
                  padding: "4px 6px",
                }}
              />
              <button
                className="a-btn-icon"
                style={{ marginTop: 4, width: "100%" }}
                onClick={() => toggleVisibility(im)}
              >
                {im.visibility === "public" ? "Public" : "Private"}
              </button>
            </div>
          ))}
        </div>
      )}
      <label className="a-upload-label">
        {uploading ? "Uploading…" : "+ Upload image"}
        <input
          type="file"
          accept="image/*"
          onChange={handleFile}
          disabled={uploading}
        />
      </label>
    </div>
  );
}
