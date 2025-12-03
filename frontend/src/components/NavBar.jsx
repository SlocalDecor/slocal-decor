import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import "../style.css";

function NavBar({ token }) {
  const [profileImg, setProfileImg] = useState("/images/userpfp.jpg");

  useEffect(() => {
    const readStoredToken = () => {
      const saved = localStorage.getItem("token");
      if (!saved) return null;
      try {
        const parsed = JSON.parse(saved);
        if (parsed.expiresAt && Date.now() > parsed.expiresAt) return null;
        return parsed.token;
      } catch {
        return null;
      }
    };

    const activeToken = token || readStoredToken();
    if (!activeToken) return;

    let decoded;
    try {
      decoded = jwtDecode(activeToken);
    } catch {
      return;
    }

    const controller = new AbortController();
    fetch(`${import.meta.env.VITE_API_URL}/api/users/${decoded.id}`, {
      headers: { Authorization: `Bearer ${activeToken}` },
      signal: controller.signal,
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!data) return;
        const user = Array.isArray(data) ? data[0] : data;
        const pic =
          user?.profilePic || user?.avatar || user?.picture || user?.photo;
        if (pic) setProfileImg(pic);
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
      });

    return () => controller.abort();
  }, [token]);

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
                <img src={profileImg} alt="Profile" />
              </div>
            </div>
          </a>
        </li>
      </ul>
    </nav>
  );
}

export default NavBar;
