import React from "react";
import NavBar from "./NavBar";
import { jwtDecode } from "jwt-decode";
import { useNavigate, useParams } from "react-router-dom";

export default function NewItem({ token }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [art, setArt] = React.useState(null);
  const [ownerName, setOwnerName] = React.useState("");
  const [showContact, setShowContact] = React.useState(false);
  const [ownerEmail, setOwnerEmail] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [savedItems, setSavedItems] = React.useState([]);
  const isSaved = savedItems.includes(id);
  const decoded = token ? jwtDecode(token) : null;
  const isOwner = decoded && art && String(art.owner) === String(decoded.id);

  React.useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    async function fetchArt() {
      try {
        setLoading(true);
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/art/${id}`,
          {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }
        );
        if (!res.ok) throw new Error("Failed to fetch art");
        const data = await res.json();
        setArt(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    async function fetchUser() {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/users/${decoded.id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch user");
        }
        const data = await response.json();
        setSavedItems(data[0].savedArt);
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    }

    fetchArt();
    fetchUser();
  }, [id, token]);

  React.useEffect(() => {
    if (!art || !art.owner) return;

    async function fetchOwner() {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/users/${art.owner}`,
          {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }
        );
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

  const handleSaveArt = async () => {
    if (!token || !art?._id) return;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/art/${art._id}/save`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        const text = await res.text();
        console.error("Failed to save art:", text);
        alert("Could not save art.");
        return;
      }
      alert("Art added to your saved items!");
    } catch (err) {
      console.error("Error saving art:", err);
      alert("Could not save art.");
    }
  };

  const handleUnsaveArt = async () => {
    if (!token || !art?._id) return;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/art/${art._id}/unsave`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        const text = await res.text();
        console.error("Failed to unsave art:", text);
        alert("Could not unsave art.");
        return;
      }

      alert("Art removed from saved items!");
    } catch (err) {
      console.error("Error unsaving art:", err);
      alert("Could not unsave art.");
    }
  };

  const handleDeleteArt = async () => {
    if (!art?._id || !token) return;
    if (
      !window.confirm(
        "Delete this art permanently? This action cannot be undone."
      )
    ) {
      return;
    }

    setIsDeleting(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/art/${art._id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to delete art");
      }

      alert("Art deleted successfully");
      navigate("/new_arrivals");
    } catch (err) {
      console.error("Error deleting art:", err);
      alert("Unable to delete art: " + err.message);
    } finally {
      setIsDeleting(false);
    }
  };

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

          <div className="item-description">
            <strong>Description :</strong>{" "}
            {art.description && art.description.trim().length > 0
              ? art.description
              : "No description provided."}
          </div>

          <div className="item-btns-large">
            {!isOwner && (
              <>
                {!isSaved ? (
                  <button className="btn btn-pill" onClick={handleSaveArt}>
                    Add to Saved Art
                  </button>
                ) : (
                  <button className="btn btn-pill" onClick={handleUnsaveArt}>
                    Unsave Art
                  </button>
                )}
                <button
                  className="btn btn-pill"
                  disabled={art.status === "claimed"}
                  onClick={() => setShowContact(true)}
                >
                  Contact artist
                </button>
              </>
            )}

            {isOwner && (
              <>
                <button
                  className="btn btn-pill"
                  onClick={async () => {
                    const newOwnerEmail = window.prompt(
                      "Enter the email of the new owner:"
                    );
                    if (!newOwnerEmail) return;

                    try {
                      // fetch the user by email
                      const userRes = await fetch(
                        `${import.meta.env.VITE_API_URL}/api/users/email/${encodeURIComponent(newOwnerEmail)}`,
                        {
                          headers: token
                            ? { Authorization: `Bearer ${token}` }
                            : {},
                        }
                      );
                      if (!userRes.ok) {
                        throw new Error("User not found with that email");
                      }

                      const userData = await userRes.json();
                      const newOwnerId =
                        userData?.id ||
                        userData?._id ||
                        (Array.isArray(userData) && userData[0]?._id);

                      if (!newOwnerId) {
                        alert("Invalid user information");
                        return;
                      }

                      // Call the transfer endpoint
                      const res = await fetch(
                        `${import.meta.env.VITE_API_URL}/api/art/${art._id}/transfer`,
                        {
                          method: "PATCH",
                          headers: {
                            "Content-Type": "application/json",
                            ...(token
                              ? { Authorization: `Bearer ${token}` }
                              : {}),
                          },
                          body: JSON.stringify({ newOwner: newOwnerId }),
                        }
                      );

                      if (!res.ok) {
                        const text = await res.text();
                        throw new Error(text || "Failed to transfer owner");
                      }

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
                <button
                  className="btn btn-pill btn-danger"
                  disabled={isDeleting}
                  onClick={handleDeleteArt}
                >
                  {isDeleting ? "Deleting…" : "Delete art"}
                </button>
              </>
            )}
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
