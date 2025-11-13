import React from "react";
import NavBar from "./NavBar";

export default function NewItem() {
  const art = {
    _id: "1",
    title: "Hills n Sky",
    owner: "656e5f3f8d0e5a0012abc123",
    postedTime: new Date(),
    description: "A calming landscape piece.",
    measurements: { height: 15, width: 30 },
    picture: "/images/userpfp.jpg",
    status: "unclaimed",
    artType: "painting",
  };

  const [ownerName, setOwnerName] = React.useState("");

  React.useEffect(() => {
    async function fetchOwner() {
      try {
        const res = await fetch(`/users/${art.owner}`);
        if (!res.ok) throw new Error("Failed to fetch owner");
        const data = await res.json();

        const user =
          Array.isArray(data) && Array.isArray(data[0]) ? data[0][0] : null;

        setOwnerName(user?.name || "Unknown artist");
      } catch (err) {
        console.error(err);
        setOwnerName("Unknown artist");
      }
    }
    fetchOwner();
  }, [art.owner]);

  const formatDims = (h, w, unit = "inches") => `${h} × ${w} ${unit}`;
  const formatDate = (d) =>
    d
      ? new Date(d).toLocaleDateString(undefined, {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "";

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
            >
              Contact artist
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
