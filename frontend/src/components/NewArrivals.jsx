import React, { useMemo } from "react";
import NavBar from "./NavBar";
import { Link } from "react-router-dom";
import useOwners from "../helpers/useOwner";

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

export default function NewArrivals({ token }) {
  const items = useMemo(
    () =>
      [...MOCK_ITEMS].sort(
        (a, b) =>
          new Date(b.postedTime).getTime() - new Date(a.postedTime).getTime()
      ),
    []
  );

  const ownerIds = items.map((it) => it.owner).filter(Boolean);
  const ownerNames = useOwners(ownerIds, token);

  return (
    <div className="na-page">
      {/* Reuse your shared nav bar */}
      <NavBar />

      {/* Page title */}
      <h1 className="na-title">New Arrivals</h1>

      {/* Gallery */}
      <section className="na-gallery item-gallery">
        {items.map((it) => (
          <article key={it.id} className="item na-item">
            <Link
              to={`/item/${it._id || it.id}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <div className="na-img-wrap">
                <span className="na-flag" aria-hidden="true" />
                <img className="item-img" src={it.picture} alt={it.title} />
              </div>
              <div className="item-name na-name">{it.title}</div>
              <div className="item-owner na-owner">{ownerNames[it.owner] || it.owner}</div>
            </Link>
          </article>
        ))}
      </section>
    </div>
  );
}
