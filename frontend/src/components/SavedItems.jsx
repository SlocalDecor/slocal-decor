import React, { useMemo, useState } from "react";
import NavBar from "./NavBar";
import "../style.css";

const MOCK_ITEMS = [
  {
    id: "1",
    name: "Hills n Sky",
    owner: "John Doe",
    imageUrl: "/images/userpfp.jpg",
    addedAt: "2025-10-29",
  },
  {
    id: "2",
    name: "Untitled",
    owner: "John Doe",
    imageUrl: "/images/userpfp.jpg",
    addedAt: "2025-11-01",
  },
  {
    id: "3",
    name: "Lemons",
    owner: "John Doe",
    imageUrl: "/images/userpfp.jpg",
    addedAt: "2025-11-02",
  },
  {
    id: "4",
    name: "Yellow and Red",
    owner: "John Doe",
    imageUrl: "/images/userpfp.jpg",
    addedAt: "2025-10-22",
  },
  {
    id: "5",
    name: "Chaos",
    owner: "John Doe",
    imageUrl: "/images/userpfp.jpg",
    addedAt: "2025-10-28",
  },
  {
    id: "6",
    name: "Woman",
    owner: "John Doe",
    imageUrl: "/images/userpfp.jpg",
    addedAt: "2025-11-03",
  },
  {
    id: "7",
    name: "Colors",
    owner: "John Doe",
    imageUrl: "/images/userpfp.jpg",
    addedAt: "2025-10-30",
  },
  {
    id: "8",
    name: "Tomatoes",
    owner: "John Doe",
    imageUrl: "/images/userpfp.jpg",
    addedAt: "2025-10-31",
  },
  {
    id: "9",
    name: "Abstract",
    owner: "John Doe",
    imageUrl: "/images/userpfp.jpg",
    addedAt: "2025-10-21",
  },
  {
    id: "10",
    name: "Chair",
    owner: "John Doe",
    imageUrl: "/images/userpfp.jpg",
    addedAt: "2025-10-25",
  },
  {
    id: "11",
    name: "Hills n Sky",
    owner: "John Doe",
    imageUrl: "/images/userpfp.jpg",
    addedAt: "2025-11-04",
  },
  {
    id: "12",
    name: "Waves",
    owner: "John Doe",
    imageUrl: "/images/userpfp.jpg",
    addedAt: "2025-11-04",
  },
];

export default function SavedItems() {
  const items = useMemo(
    () =>
      [...MOCK_ITEMS].sort(
        (a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()
      ),
    []
  );

  return (
    <div>
      <div className="na-page">
        <NavBar />
        <h1 className="na-title">Saved Items</h1>

        <section className="na-gallery item-gallery">
          {items.map((it) => (
            <article key={it.id} className="item na-item">
              <div className="na-img-wrap">
                <span className="si-flag" aria-hidden="true" />
                <img className="item-img" src={it.imageUrl} alt={it.name} />
              </div>
              <div className="item-name na-name">{it.name}</div>
              <div className="item-owner na-owner">{it.owner}</div>
            </article>
          ))}
        </section>
      </div>
    </div>
  );
}
