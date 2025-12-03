import React from "react";
import "../style.css";

function NavBar() {
  return (
    <nav className="top-bar">
      <div className="left-logo">
        <a href="/" className="logo-link">
          <img src="/images/logo.png" alt="Logo" className="logo-img" />
          <span className="logo-text">Slocal Decor</span>
        </a>
      </div>
      <ul className="nav-links">
        <li>
          <a href="/new_arrivals">New Arrivals</a>
        </li>
        <li>
          <a href="/saved_items">Saved Items</a>
        </li>
        <li>
          <a href="/profile">
            <div className="profile-icon">
              <div className="profile-icon">
                <img src="/images/userpfp.jpg" alt="Profile" />
              </div>
            </div>
          </a>
        </li>
      </ul>
    </nav>
  );
}

export default NavBar;
