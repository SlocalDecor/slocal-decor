import React, { useState } from "react";
import NavBar from "./NavBar";
import "../style.css";

function HomePage({ token }) {
  return (
    <div className="home">
      <NavBar token={token} />
      <div className="hero">
        <div className="hero-overlay" />
        <h1 className="main-text">slocal decor</h1>
        <p className="sub-text">fill your heart with slocal art :)</p>
      </div>
    </div>
  );
}

export default HomePage;
