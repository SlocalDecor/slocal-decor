import React, { useState, useEffect } from "react";
import NavBar from "./NavBar";
import "../style.css";

function UserProfile({token}) {
  const [activeTab, setActiveTab] = useState("published");

  const [items, setItems] = useState([])
  const [publishedItems, setPublishedItems] = useState([])
  const [claimedItems, setClaimedItems] = useState([])

  const fetchArt = () => {
    console.log("here")
    fetch("http://localhost:8000/art?userSpecific=true", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      console.log(response)
      if (!response.ok) {
        throw new Error("Failed to fetch art");
      }
      return response.json();
    }).then((data) => {
      console.log(data)
      setItems(data.art_list);
      setClaimedItems(data.art_list.filter(art => art.status === "claimed"))
      setPublishedItems(data.art_list.filter(art => art.status === "unclaimed"))
    })
    .catch((err) => {
      console.error("Error fetching art:", err);
    });
  }
  
  useEffect(() => {
    if (token) fetchArt();
  }, [token]);

  const displayedItems =
    activeTab === "published" ? publishedItems : claimedItems;

  return (
    <div className="user-page">
      <NavBar />

      <div className="content">
        <div className="sidebar">
          <img
            src="/images/userpfp.jpg"
            alt="profile"
            className="profile-img"
          />
          <h2>Your Name</h2>
          <p>bio</p>
        </div>

        <div className="main-content">
          <div className="button-container">
            <button
              className={`btn ${activeTab === "published" ? "selected" : ""}`}
              onClick={() => setActiveTab("published")}
            >
              Published by You
            </button>
            <button
              className={`btn ${activeTab === "claimed" ? "selected" : ""}`}
              onClick={() => setActiveTab("claimed")}
            >
              Claimed by You
            </button>
          </div>

          <div className="item-gallery">
            {displayedItems.map((item, index) => (
              <div key={index} className="item">
                <img src={item.img} alt={item.title} className="item-img" />
                <p className="item-name">{item.title}</p>
                <p className="item-owner">{item.author}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
