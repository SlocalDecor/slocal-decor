import React from "react";
import NavBar from "./NavBar";

export default function NewItem() {
  const item = {
    id: "1",
    name: "Hills n Sky",
    owner: "John Doe",
    imageUrl: "/images/userpfp.jpg",
    tags: ["Painting", "Wall Decor"],
    dimensions: "15 * 30 inches",
  };

  return (
    <div className="na-page">
      <NavBar />

      <section className="item-section">
        <div className="item-left">
          <div className="item-frame">
            <img
              className="item-img-large"
              src={item.imageUrl}
              alt={item.name}
            />
          </div>
        </div>

        <div className="item-right">
          <h1 className="item-title-large">
            {item.name}
            <br />
            <span className="item-owner-large">by {item.owner}</span>
          </h1>

          <div className="item-meta-large">
            <p>
              <strong>Tags :</strong> {item.tags.join(", ")}
            </p>
            <p>
              <strong>Dimensions :</strong> {item.dimensions}
            </p>
          </div>

          <div className="item-btns-large">
            <button className="btn btn-pill">Add to Saved Art</button>
            <button className="btn btn-pill">Contact artist</button>
          </div>
        </div>
      </section>
    </div>
  );
}
