import React, { useMemo, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import NavBar from "./NavBar";
import { Link } from "react-router-dom";
import "../style.css";
import useOwners from "../helpers/useOwner";

export default function SavedItems({ token }) {
  const [artItems, setArtItems] = useState([]);
  const [savedIds, setSavedIds] = useState([]);
  const decoded = jwtDecode(token);

  const getArt = () => {
    fetch(`${import.meta.env.VITE_API_URL}/api/art?userSpecific=false`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch art");
        }
        return response.json();
      })
      .then((data) => {
        const savedSet = new Set(savedIds.map(String));
        const filtered = data.art_list.filter((art) =>
          savedSet.has(String(art._id))
        );
        setArtItems(filtered);
      })
      .catch((err) => {
        console.error("Error fetching art:", err);
      });
  };

  const getSaved = () => {
    fetch(`${import.meta.env.VITE_API_URL}/api/users/${decoded.id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch art");
        }
        return response.json();
      })
      .then((data) => {
        setSavedIds(data[0].savedArt || []);
      })
      .catch((err) => {
        console.error("Error fetching art:", err);
      });
  };

  useEffect(() => {
    if (token) getSaved();
  }, [token]);

  useEffect(() => {
    if (savedIds && savedIds.length) {
      getArt();
    } else {
      setArtItems([]);
    }
  }, [savedIds]);

  const items = useMemo(
    () =>
      [...artItems].sort(
        (a, b) =>
          new Date(b.postedTime).getTime() - new Date(a.postedTime).getTime()
      ),
    [artItems]
  );

  const ownerIds = items.map((it) => it.owner).filter(Boolean);
  const ownerNames = useOwners(ownerIds, token);

  return (
    <div>
      <div className="na-page">
        <NavBar />
        <h1 className="na-title">Saved Items</h1>

        <section className="na-gallery item-gallery">
          {items.map((it) => (
            <article key={it._id || it.id} className="item na-item">
              <Link
                to={`/item/${it._id || it.id}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <div className="na-img-wrap">
                  <span className="si-flag" aria-hidden="true" />
                  <img className="item-img" src={it.picture} alt={it.title} />
                </div>
                <div className="item-name na-name">{it.title}</div>
                <div className="item-owner na-owner">
                  {ownerNames[it.owner] || it.owner}
                </div>
              </Link>
            </article>
          ))}
        </section>
      </div>
    </div>
  );
}
