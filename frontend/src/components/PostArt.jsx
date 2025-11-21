// PostArt.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "./NavBar";
import "../style.css";

const API_BASE = import.meta?.env?.VITE_API_BASE || "http://localhost:8000";

export default function PostArt({ token }) {
  const navigate = useNavigate();
  const authedHeaders = token ? { Authorization: `Bearer ${token}` } : {};
  const [creating, setCreating] = React.useState(false);
  const [imgOk, setImgOk] = React.useState(null);
  const [form, setForm] = React.useState({
    title: "",
    description: "",
    picture: "",
    artType: "",
    height: "",
    width: "",
  });

  React.useEffect(() => {
    if (!form.picture) return setImgOk(null);
    let active = true;
    const img = new Image();
    img.onload = () => active && setImgOk(true);
    img.onerror = () => active && setImgOk(false);
    img.src = form.picture;
    return () => {
      active = false;
    };
  }, [form.picture]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const h = parseFloat(form.height || "");
    const w = parseFloat(form.width || "");
    if (!form.title.trim()) return alert("Title is required");
    if (!form.picture.trim()) return alert("Image URL is required");
    if (form.description.length > 250) return alert("Description must be 250 characters or less");
    if (Number.isNaN(h) || Number.isNaN(w) || h <= 0 || w <= 0) return alert("Enter valid positive numbers for height and width");
    if (form.artType && !["poster", "painting", "sculpture", "furniture", "wall art", "other"].includes(form.artType)) return alert("Invalid art type");
    try {
      setCreating(true);
      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        picture: form.picture.trim(),
        artType: form.artType || undefined,
        measurements: { height: h, width: w },
      };
      const res = await fetch(`${API_BASE}/art`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authedHeaders },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error((await res.text()) || "Failed to create art");
      const created = await res.json();
      alert("Art posted!");
      const newId = created?._id || created?.id;
      if (newId) navigate(`/art/${newId}`);
    } catch (err) {
      alert(`Unable to post art: ${err?.message || "Unknown error"}`);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="post-art-page">
      <NavBar />
      <main className="post-art-main">
        <div className="post-art-container">
          <h1 className="post-art-title">Post New Art</h1>

          <form className="post-art-form" onSubmit={onSubmit}>
            <div>
              <label htmlFor="title">Art Title</label>
              <input id="title" name="title" value={form.title} onChange={onChange} required />
            </div>

            <div>
              <label htmlFor="picture">Image URL</label>
              <input id="picture" name="picture" value={form.picture} onChange={onChange} required />
            </div>

            <div>
              <label htmlFor="artType">Type</label>
              <select id="artType" name="artType" value={form.artType} onChange={onChange}>
                <option value="">Select type…</option>
                <option value="poster">poster</option>
                <option value="painting">painting</option>
                <option value="sculpture">sculpture</option>
                <option value="furniture">furniture</option>
                <option value="wall art">wall art</option>
                <option value="other">other</option>
              </select>
            </div>

            <div>
              <label htmlFor="description">Description (max 250)</label>
              <textarea
                id="description"
                name="description"
                value={form.description}
                onChange={onChange}
                rows={3}
                maxLength={250}
              />
            </div>

            <div>
              <label htmlFor="height">Height</label>
              <input
                id="height"
                name="height"
                inputMode="decimal"
                value={form.height}
                onChange={onChange}
                placeholder="e.g. 24"
                required
              />
            </div>

            <div>
              <label htmlFor="width">Width</label>
              <input
                id="width"
                name="width"
                inputMode="decimal"
                value={form.width}
                onChange={onChange}
                placeholder="e.g. 18"
                required
              />
            </div>

            <button type="submit" disabled={creating} aria-busy={creating}>
              {creating ? "Posting…" : "Post Art"}
            </button>
          </form>

          {form.picture ? (
            <section className="post-art-preview" aria-live="polite">
              <h2>Image Preview</h2>
              <img
                src={imgOk === false ? "/images/placeholder.png" : form.picture}
                alt={form.title || "Artwork preview"}
              />
              {imgOk === false && <p>We could not load that URL. It will still be saved, but please double-check the link.</p>}
            </section>
          ) : null}
        </div>
      </main>
    </div>
  );
}
