import React, { useState } from "react";
import "../style.css";

function UserPage() {
  const [activeTab, setActiveTab] = useState("published");

  const publishedItems = [
    { title: "Lemons", author: "John Doe", img: "/images/userpfp.jpg" },
  ];

  const claimedItems = [
    { title: "Sunset Vase", author: "Jane Smith", img: "/images/userpfp.jpg" },
  ];

  const displayedItems =
    activeTab === "published" ? publishedItems : claimedItems;

  return (
    <div className="user-page">
      {/* Placeholder top bar */}
      <div className="top-bar">
        <p>TODO: Add nav bar</p>
      </div>

      <div className="content">
        {/* Sidebar */}
        <div className="sidebar">
          <img
            src="/images/userpfp.jpg"
            alt="profile"
            className="profile-img"
          />
          <h2>Your Name</h2>
          <p>bio</p>
        </div>

        {/* Main Section */}
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

export default UserPage;
