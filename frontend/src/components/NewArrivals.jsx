import React, { useMemo, useState, useEffect } from "react";
import NavBar from "./NavBar";
import { Link } from "react-router-dom";
import { apiUrl } from "../helpers/api";

export default function NewArrivals({ token }) {
  const [artItems, setArtItems] = useState([]);

  const getArt = () => {
    console.log(`${apiUrl("/api/art?userSpecific=false")}`);
    fetch(apiUrl("/api/art?userSpecific=false"), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        console.log("made first request to get art");
        console.log(response);
        if (!response.ok) {
          throw new Error("Failed to fetch art");
        }
        return response.json();
      })
      .then((data) => {
        for (let i = 0; i < data.art_list.length; i++) {
          let art = data.art_list[i];
          if (!art.owner) {
            setArtItems((prev) =>
              prev.some((p) => p._id === art._id)
                ? prev
                : [...prev, { ...art, ownerName: "" }]
            );
            continue;
          }

          fetch(apiUrl(`/api/users/${art.owner}`), {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          })
            .then((response) => {
              console.log("getting owner for new arrivals");
              if (!response.ok) {
                throw new Error("Failed to fetch owner");
              }
              return response.json();
            })
            .then((data) => {
              console.log("retrieved owner data", data);
              const ownerName = data?.[0]?.name || "";
              setArtItems((prev) =>
                prev.some((p) => p._id === art._id)
                  ? prev
                  : [
                      ...prev,
                      {
                        ...art,
                        ownerName: ownerName,
                      },
                    ]
              );
            })
            .catch((err) => {
              console.error(`Failed to fetch owner for art ${art._id}:`, err);
              setArtItems((prev) =>
                prev.some((p) => p._id === art._id)
                  ? prev
                  : [
                      ...prev,
                      {
                        ...art,
                        ownerName: "",
                      },
                    ]
              );
            });
        }
      })
      .catch((err) => {
        console.error("Error fetching art:", err);
      });
  };

  useEffect(() => {
    if (token) getArt();
  }, [token]);

  const items = useMemo(
    () =>
      [...artItems].sort(
        (a, b) =>
          new Date(b.postedTime).getTime() - new Date(a.postedTime).getTime()
      ),
    [artItems]
  );

  return (
    <div className="na-page">
      <NavBar />

      <h1 className="na-title">New Arrivals</h1>

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
              <div className="item-owner na-owner">{it.ownerName}</div>
            </Link>
          </article>
        ))}
      </section>
    </div>
  );
}
