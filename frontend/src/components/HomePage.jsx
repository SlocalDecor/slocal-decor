import React, { useState } from "react";
import NavBar from "./NavBar";
import "../style.css";

function HomePage() {
  return (
    <div className="home">
      <div className="hero">
        <NavBar />
        <div className="overlay" />
        <h1 className="main-text">slocal decor</h1>
        <p className="sub-text">Some nice tagline</p>
      </div>
    </div>
  );
}

export default HomePage;
