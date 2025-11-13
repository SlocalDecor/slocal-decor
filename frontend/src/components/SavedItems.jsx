import React, { useMemo, useState } from "react";
import NavBar from "./NavBar";
import "../style.css";

const MOCK_ITEMS = [
  {
    id: "1",
    title: "Hills n Sky",
    owner: "John Doe",
    picture: "/images/userpfp.jpg",
    postedTime: "2025-10-29",
  },
  {
    id: "2",
    title: "Untitled",
    owner: "John Doe",
    picture: "/images/userpfp.jpg",
    postedTime: "2025-11-01",
  },
  {
    id: "3",
    title: "Lemons",
    owner: "John Doe",
    picture: "/images/userpfp.jpg",
    postedTime: "2025-11-02",
  },
  {
    id: "4",
    title: "Yellow and Red",
    owner: "John Doe",
    picture: "/images/userpfp.jpg",
    postedTime: "2025-10-22",
  },
  {
    id: "5",
    title: "Chaos",
    owner: "John Doe",
    picture: "/images/userpfp.jpg",
    postedTime: "2025-10-28",
  },
  {
    id: "6",
    title: "Woman",
    owner: "John Doe",
    picture: "/images/userpfp.jpg",
    postedTime: "2025-11-03",
  },
  {
    id: "7",
    title: "Colors",
    owner: "John Doe",
    picture: "/images/userpfp.jpg",
    postedTime: "2025-10-30",
  },
  {
    id: "8",
    title: "Tomatoes",
    owner: "John Doe",
    picture: "/images/userpfp.jpg",
    postedTime: "2025-10-31",
  },
  {
    id: "9",
    title: "Abstract",
    owner: "John Doe",
    picture: "/images/userpfp.jpg",
    postedTime: "2025-10-21",
  },
  {
    id: "10",
    title: "Chair",
    owner: "John Doe",
    picture: "/images/userpfp.jpg",
    postedTime: "2025-10-25",
  },
  {
    id: "11",
    title: "Hills n Sky",
    owner: "John Doe",
    picture: "/images/userpfp.jpg",
    postedTime: "2025-11-04",
  },
  {
    id: "12",
    title: "Waves",
    owner: "John Doe",
    picture: "/images/userpfp.jpg",
    postedTime: "2025-11-04",
  },
];

export default function SavedItems({token}) {

  const items = useMemo(
    () =>
      [...MOCK_ITEMS].sort(
        (a, b) =>
          new Date(b.postedTime).getTime() - new Date(a.postedTime).getTime()
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
                <img className="item-img" src={it.picture} alt={it.title} />
              </div>
              <div className="item-name na-name">{it.title}</div>
              <div className="item-owner na-owner">{it.owner}</div>
            </article>
          ))}
        </section>
      </div>
    </div>
  );
}
