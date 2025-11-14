import React, { useMemo, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import NavBar from "./NavBar";
import "../style.css";

export default function SavedItems({ token }) {
  const [artItems, setArtItems] = useState([]);
  const [savedIds, setSavedIds] = useState([]);
  const decoded = jwtDecode(token);

  const getArt = () => {
    fetch(`http://localhost:8000/art?userSpecific=false`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        console.log(response);
        if (!response.ok) {
          throw new Error("Failed to fetch art");
        }
        return response.json();
      })
      .then((data) => {
        let artPieces = [];
        for (let i = 0; i < data.art_list.length; i++) {
          let art = data.art_list[i];
          if (savedIds.includes(art._id)) {
            if (!art.owner) {
              artPieces.push({
                ...art,
                ownerName: "",
              });
              continue;
            }

            fetch(`http://localhost:8000/users/${art.owner}`, {
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
                artPieces.push({
                  ...art,
                  ownerName: data[0]?.name || "",
                });
                setArtItems(artPieces);
              })
              .catch((err) => {
                console.error(`Failed to fetch owner for art ${art._id}:`, err);
                artPieces.push({
                  ...art,
                  ownerName: "",
                });
              });
          }
        }
      })
      .catch((err) => {
        console.error("Error fetching art:", err);
      });
  };

  const getSaved = () => {
    console.log(decoded.id);
    fetch(`http://localhost:8000/users/${decoded.id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        console.log(response);
        if (!response.ok) {
          throw new Error("Failed to fetch art");
        }
        return response.json();
      })
      .then((data) => {
        console.log("data", data[0]);
        setSavedIds(data[0].savedArt);
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
      getArt(savedIds);
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
              <div className="item-owner na-owner">{it.ownerName}</div>
            </article>
          ))}
        </section>
      </div>
    </div>
  );
}
