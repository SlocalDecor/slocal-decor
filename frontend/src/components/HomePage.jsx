import React, { useState } from "react";
import "../style.css";

function HomePage() {
  return (
    <div className="user-page">
      {/* Placeholder top bar */}
      <div className="top-bar">
        <p>TODO: Add nav bar</p>
      </div>

      <div className="hero">
        <div className="overlay" />
        <h1 className="main-text">slocal decor</h1>
        <p className="sub-text">Some nice tagline</p>
      </div>
    </div>
  );
}

export default HomePage;
