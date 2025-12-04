// PostArt.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "./NavBar";
import { jwtDecode } from "jwt-decode";
import "../style.css";

const API_BASE = import.meta?.env?.VITE_API_URL || "http://localhost:8000";

export default function PostArt({ token }) {
  const navigate = useNavigate();
  const authedHeaders = token ? { Authorization: `Bearer ${token}` } : {};
  const [creating, setCreating] = React.useState(false);
  const [imgOk, setImgOk] = React.useState(null);
  const decoded = jwtDecode(token);

  const [imageFile, setImageFile] = React.useState(null);
  const [owner, setOwner] = React.useState(null);

  const [form, setForm] = React.useState({
    title: "",
    description: "",
    picture: "",
    artType: "",
    height: "",
    width: "",
  });

  const fetchUser = () => {
    fetch(`${import.meta.env.VITE_API_URL}/api/users/${decoded.id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch user");
        }
        return response.json();
      })
      .then((data) => {
        setOwner(data[0]._id);
      })
      .catch((err) => {
        console.error("Error fetching user:", err);
      });
  };

  React.useEffect(() => {
    fetchUser();
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

  const onFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) {
      setImageFile(null);
      setForm((f) => ({ ...f, picture: "" }));
      return;
    }

    setImageFile(file);
    const objectUrl = URL.createObjectURL(file);
    setForm((f) => ({ ...f, picture: objectUrl }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const h = parseFloat(form.height || "");
    const w = parseFloat(form.width || "");

    if (!form.title.trim()) return alert("Title is required");

    if (!imageFile) return alert("Image file is required");

    if (form.description.length > 250)
      return alert("Description must be 250 characters or less");

    if (Number.isNaN(h) || Number.isNaN(w) || h <= 0 || w <= 0)
      return alert("Enter valid positive numbers for height and width");

    if (
      form.artType &&
      ![
        "poster",
        "painting",
        "sculpture",
        "furniture",
        "wall art",
        "other",
      ].includes(form.artType)
    )
      return alert("Invalid art type");

    try {
      setCreating(true);

      const formData = new FormData();
      formData.append("title", form.title.trim());
      formData.append("description", form.description.trim());
      formData.append("artType", form.artType || "");
      formData.append("measurements", JSON.stringify({ height: h, width: w }));
      formData.append("picture", imageFile);
      formData.append("owner", owner);

      const res = await fetch(`${API_BASE}/api/art`, {
        method: "POST",
        headers: { ...authedHeaders },
        body: formData,
      });

      if (!res.ok)
        throw new Error((await res.text()) || "Failed to create art");
      const created = await res.json();
      alert("Art posted!");
      const newId = created?._id || created?.id;
      if (newId) navigate(`/art/${newId}`);
    } catch (err) {
      alert(`Server error. Unable to post art! `);
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
              <input
                id="title"
                name="title"
                value={form.title}
                onChange={onChange}
                required
              />
            </div>

            <div>
              <label htmlFor="picture">Image File</label>
              <input
                id="picture"
                name="picture"
                type="file"
                accept="image/*"
                onChange={onFileChange}
                required
              />
            </div>

            <div>
              <label htmlFor="artType">Type</label>
              <select
                id="artType"
                name="artType"
                value={form.artType}
                onChange={onChange}
              >
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
              {imgOk === false && (
                <p>
                  We could not load that image. It will still be saved, but
                  please double-check the file or try another image.
                </p>
              )}
            </section>
          ) : null}
        </div>
      </main>
    </div>
  );
}
