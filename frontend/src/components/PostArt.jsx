import React from "react";
import NavBar from "./NavBar";
import { jwtDecode } from "jwt-decode";
import { useParams } from "react-router-dom";

export default function NewItem({ token }) {
  const { id } = useParams();           
  const decoded = token ? jwtDecode(token) : null;

  
  const [art, setArt] = React.useState(null);
  const [ownerName, setOwnerName] = React.useState("");
  const [showContact, setShowContact] = React.useState(false);
  const [ownerEmail, setOwnerEmail] = React.useState("");
  const [loading, setLoading] = React.useState(!!id);

  
  const [form, setForm] = React.useState({
    title: "",
    description: "",
    picture: "",
    artType: "",
    height: "",
    width: "",
  });
  const [creating, setCreating] = React.useState(false);
  const authedHeaders = token ? { Authorization: `Bearer ${token}` } : {};

  
  React.useEffect(() => {
    if (!id) return; 
    (async () => {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:8000/art/${id}`, {
          headers: { ...authedHeaders },
        });
        if (!res.ok) throw new Error("Failed to fetch art");
        const data = await res.json();
        setArt(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [id, token]);

  React.useEffect(() => {
    if (!id || !art?.owner) return;
    (async () => {
      try {
        const res = await fetch(
          `http://localhost:8000/users/${art.owner}`,
          { headers: { ...authedHeaders } }
        );
        if (!res.ok) throw new Error("Failed to fetch owner");
        const data = await res.json();
        const user = Array.isArray(data) ? data[0] : data;
        setOwnerName(user?.name || "Unknown artist");
        setOwnerEmail(user?.email || "");
      } catch (err) {
        console.error(err);
        setOwnerName("Unknown artist");
      }
    })();
  }, [art, token]);

  const formatDims = (h, w, unit = "in") =>
    h && w ? `${h} × ${w} ${unit}` : "—";

  const formatDate = (d) =>
    d
      ? new Date(d).toLocaleDateString(undefined, {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "";


  if (!id) {
    const onChange = (e) =>
      setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

    const onSubmit = async (e) => {
      e.preventDefault();
      try {
        setCreating(true);
        const payload = {
          title: form.title,
          description: form.description,
          picture: form.picture,
          artType: form.artType,
          measurements: {
            height: Number(form.height) || null,
            width: Number(form.width) || null,
          },
        };
        const res = await fetch("http://localhost:8000/art", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...authedHeaders,
          },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || "Failed to create art");
        }
        const created = await res.json();
        alert("Art posted!");
      } catch (err) {
        console.error(err);
        alert("Unable to post art: " + err.message);
      } finally {
        setCreating(false);
      }
    };

    return (
      <div className="na-page">
        <NavBar />
        <section className="item-section" style={{ maxWidth: 720, margin: "0 auto" }}>
          <h1 className="item-title-large">Post New Art</h1>
          <form className="signup-form" onSubmit={onSubmit}>
            <div className="form-row">
              <label>Title:</label>
              <input name="title" value={form.title} onChange={onChange} required />
            </div>
            <div className="form-row">
              <label>Image URL:</label>
              <input name="picture" value={form.picture} onChange={onChange} required />
            </div>
            <div className="form-row">
              <label>Type:</label>
              <input name="artType" value={form.artType} onChange={onChange} />
            </div>
            <div className="form-row">
              <label>Description:</label>
              <textarea name="description" value={form.description} onChange={onChange} />
            </div>
            <div className="form-row" style={{ display: "flex", gap: 12 }}>
              <div style={{ flex: 1 }}>
                <label>Height (in):</label>
                <input name="height" value={form.height} onChange={onChange} />
              </div>
              <div style={{ flex: 1 }}>
                <label>Width (in):</label>
                <input name="width" value={form.width} onChange={onChange} />
              </div>
            </div>
            <button className="btn btn-pill" type="submit" disabled={creating}>
              {creating ? "Posting…" : "Post Art"}
            </button>
          </form>
        </section>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="na-page">
        <NavBar />
        <div style={{ padding: 40, color: "#fff" }}>Loading item…</div>
      </div>
    );
  }

  if (!art) {
    return (
      <div className="na-page">
        <NavBar />
        <div style={{ padding: 40, color: "#fff" }}>Item not found.</div>
      </div>
    );
  }

  return (
    <div className="na-page">
      <NavBar />
      <section className="item-section">
        <div className="item-left">
          <div className="item-frame">
            <img
              className="item-img-large"
              src={art.picture || "/images/placeholder.png"}
              alt={art.title || "Artwork"}
            />
          </div>
        </div>

        <div className="item-right">
          <h1 className="item-title-large">
            {art.title || "Untitled"}
            <br />
            <span className="item-owner-large">Owner: {ownerName || "…"}</span>
          </h1>

          <div className="item-meta-large">
            {art.artType && (
              <p>
                <strong>Type :</strong> {art.artType}
              </p>
            )}
            <p>
              <strong>Dimensions :</strong>{" "}
              {formatDims(art?.measurements?.height, art?.measurements?.width, "in")}
            </p>
            {art.postedTime && (
              <p>
                <strong>Posted :</strong> {formatDate(art.postedTime)}
              </p>
            )}
          </div>

          {art.description && (
            <p className="item-description">{art.description}</p>
          )}

          <div className="item-btns-large">
            <button className="btn btn-pill">Add to Saved Art</button>
            <button
              className="btn btn-pill"
              disabled={art.status === "claimed"}
              onClick={() => setShowContact(true)}
            >
              Contact artist
            </button>

            {decoded && String(art.owner) === String(decoded.id) && (
              <button
                className="btn btn-pill"
                onClick={async () => {
                  const newOwnerEmail = window.prompt("Enter the email of the new owner:");
                  if (!newOwnerEmail) return;
                  try {
                    const userRes = await fetch(
                      `http://localhost:8000/users/email/${encodeURIComponent(newOwnerEmail)}`,
                      { headers: { ...authedHeaders } }
                    );
                    if (!userRes.ok) throw new Error("User not found with that email");
                    const userData = await userRes.json();
                    const newOwnerId =
                      userData?.id || userData?._id || (Array.isArray(userData) && userData[0]?._id);
                    if (!newOwnerId) return alert("Invalid user information");

                    const res = await fetch(
                      `http://localhost:8000/art/${art._id || art.id}/transfer`,
                      {
                        method: "PATCH",
                        headers: {
                          "Content-Type": "application/json",
                          ...authedHeaders,
                        },
                        body: JSON.stringify({ newOwner: newOwnerId }),
                      }
                    );
                    if (!res.ok) throw new Error(await res.text());
                    const updated = await res.json();
                    setArt(updated);
                    alert("Ownership transferred successfully");
                  } catch (err) {
                    console.error(err);
                    alert("Unable to transfer ownership: " + err.message);
                  }
                }}
              >
                Transfer ownership
              </button>
            )}
          </div>
        </div>
      </section>

      {showContact && (
        <div className="modal-overlay" onClick={() => setShowContact(false)}>
          <div className="modal" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{ownerName || "Artist"}</h3>
              <button className="modal-close" onClick={() => setShowContact(false)} aria-label="Close">
                ×
              </button>
            </div>
            <div className="modal-body">
              {ownerEmail ? (
                <div style={{ display: "grid", gap: 12 }}>
                  <p>You can contact the publisher at:</p>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <code style={{ background: "#f4f4f4", padding: "6px 10px", borderRadius: 6 }}>
                      {ownerEmail}
                    </code>
                    <button
                      className="btn btn-pill"
                      onClick={async () => {
                        try {
                          await navigator.clipboard.writeText(ownerEmail);
                          alert("Email copied to clipboard");
                        } catch {
                          const el = document.createElement("textarea");
                          el.value = ownerEmail;
                          document.body.appendChild(el);
                          el.select();
                          document.execCommand("copy");
                          document.body.removeChild(el);
                          alert("Email copied to clipboard");
                        }
                      }}
                    >
                      Copy
                    </button>
                  </div>
                  <p style={{ marginTop: 8, color: "#666" }}>
                    We do not handle messaging on your behalf — please use your email client.
                  </p>
                </div>
              ) : (
                <p>Contact information is not available for this publisher.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
