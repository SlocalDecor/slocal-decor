import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import NavBar from "./NavBar";
import "../style.css";
import useOwners from "../helpers/useOwner";

function UserProfile({ token }) {
  const [activeTab, setActiveTab] = useState("published");
  const decoded = jwtDecode(token);
  const [items, setItems] = useState([]);
  const [publishedItems, setPublishedItems] = useState([]);
  const [claimedItems, setClaimedItems] = useState([]);
  const [name, setName] = useState("Name not found");
  const [bio, setBio] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("token");

    fetch(`${import.meta.env.VITE_API_URL}/api/logout`, {
      method: "POST",
      credentials: "include",
    }).catch(() => {});

    window.location.href = "/login";
  };

  const fetchUser = () => {
    fetch(`${import.meta.env.VITE_API_URL}/api/users/${decoded.id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch user");
        }
        return response.json();
      })
      .then((data) => {
        setName(data[0].name);
        setBio(data[0].bio);
      })
      .catch((err) => {
        console.error("Error fetching user:", err);
      });
  };

  const fetchArt = () => {
    fetch(`${import.meta.env.VITE_API_URL}/api/art?userSpecific=true`, {
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
        console.log(data);
        setItems(data.art_list);
        setClaimedItems(
          data.art_list.filter((art) => art.status === "claimed")
        );
        setPublishedItems(
          data.art_list.filter((art) => art.status === "unclaimed")
        );
      })
      .catch((err) => {
        console.error("Error fetching art:", err);
      });
  };

  useEffect(() => {
    if (token) {
      fetchArt();
      fetchUser();
    }
  }, [token]);

  const displayedItems =
    activeTab === "published" ? publishedItems : claimedItems;

  // resolve owner ids to display names for items
  const ownerIds = displayedItems.map((it) => it.owner).filter(Boolean);
  const ownerNames = useOwners(ownerIds, token);

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
          <h2>{name}</h2>
          <p>{bio}</p>
          <div className="logout">
            <button className="btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
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
                <Link
                  to={`/item/${item._id || item.id || item.artId || index}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <img
                    src={item.picture || item.img}
                    alt={item.title}
                    className="item-img"
                  />
                  <p className="item-name">{item.title}</p>
                  <p className="item-owner">
                    {ownerNames[item.owner] || item.owner || item.author}
                  </p>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
