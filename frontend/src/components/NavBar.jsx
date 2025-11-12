import React from "react";
import { NavLink } from "react-router-dom"; // <-- use NavLink
import "../style.css";

function NavBar() {
  return (
    <nav className="top-bar">
      <div className="left-logo">
        <NavLink to="/" end>
          <img src="/images/logo.png" alt="Logo" />
        </NavLink>
      </div>

      <ul className="nav-links">
        <li>
          <NavLink to="/new_arrivals">New Arrivals</NavLink>
        </li>
        <li>
          <NavLink to="/saved_items">Saved Items</NavLink>
        </li>
        <li>
          <NavLink to="/profile">
            <div className="profile-icon">
              <img src="/images/defaultprofile.png" alt="Profile" />
            </div>
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default NavBar;
