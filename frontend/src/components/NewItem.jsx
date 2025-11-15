import React from "react";
import NavBar from "./NavBar";
import { useParams } from "react-router-dom";

export default function NewItem({ token }) {
  const { id } = useParams();
  const [art, setArt] = React.useState(null);
  const [ownerName, setOwnerName] = React.useState("");
  const [showContact, setShowContact] = React.useState(false);
  const [ownerEmail, setOwnerEmail] = React.useState("");
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    async function fetchArt() {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:8000/art/${id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (!res.ok) throw new Error("Failed to fetch art");
        const data = await res.json();
        setArt(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchArt();
  }, [id, token]);

  React.useEffect(() => {
    if (!art || !art.owner) return;

    async function fetchOwner() {
      try {
        const res = await fetch(`http://localhost:8000/users/${art.owner}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (!res.ok) throw new Error("Failed to fetch owner");
        const data = await res.json();
        const user = data && (Array.isArray(data) ? data[0] : data);
        setOwnerName(user?.name || "Unknown artist");
        setOwnerEmail(user?.email || "");
      } catch (err) {
        console.error(err);
        setOwnerName("Unknown artist");
      }
    }

    fetchOwner();
  }, [art, token]);

  const formatDims = (h, w, unit = "inches") => `${h} × ${w} ${unit}`;
  const formatDate = (d) =>
    d
      ? new Date(d).toLocaleDateString(undefined, {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "";

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
            <img className="item-img-large" src={art.picture} alt={art.title} />
          </div>
        </div>

        <div className="item-right">
          <h1 className="item-title-large">
            {art.title}
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
              {formatDims(
                art.measurements.height,
                art.measurements.width,
                "in"
              )}
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
          </div>
        </div>
      </section>

      {showContact && (
        <div className="modal-overlay" onClick={() => setShowContact(false)}>
          <div
            className="modal"
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3>{ownerName || "Artist"}</h3>
              <button
                className="modal-close"
                onClick={() => setShowContact(false)}
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <div className="modal-body">
              {ownerEmail ? (
                <div style={{ display: "grid", gap: 12 }}>
                  <p>You can contact the publisher at:</p>
                  <div
                    style={{ display: "flex", gap: 8, alignItems: "center" }}
                  >
                    <code
                      style={{
                        background: "#f4f4f4",
                        padding: "6px 10px",
                        borderRadius: 6,
                      }}
                    >
                      {ownerEmail}
                    </code>
                    <button
                      className="btn btn-pill"
                      onClick={async () => {
                        try {
                          await navigator.clipboard.writeText(ownerEmail);
                          alert("Email copied to clipboard");
                        } catch (err) {
                          // fallback
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
                    We do not handle messaging on your behalf — please use your
                    email client to reach out.
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
