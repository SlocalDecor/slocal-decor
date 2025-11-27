import React, { useState, useEffect } from "react";
import UserLogin from "./UserLogin";
import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./HomePage";
import NavBar from "./NavBar";
import NewArrivals from "./NewArrivals";
import UserProfile from "./UserProfile";
import SavedItems from "./SavedItems";
import NewItem from "./NewItem";
import SignUp from "./SignUp";
import PostArt from "./PostArt.jsx";
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const INVALID_TOKEN = "INVALID_TOKEN";

  const saveToken = (token) => {
    const expiresAt = new Date().getTime() + 30 * 60 * 1000; // 30 minutes
    localStorage.setItem("token", JSON.stringify({ token, expiresAt }));
  };

  const loadToken = () => {
    const itemStr = localStorage.getItem("token");
    if (!itemStr) return null;

    try {
      const { token, expiresAt } = JSON.parse(itemStr);
      if (new Date().getTime() > expiresAt) {
        localStorage.removeItem("token");
        return null;
      }
      return token;
    } catch (err) {
      localStorage.removeItem("token");
      return null;
    }
  };
  const [token, setToken] = useState(loadToken());

  useEffect(() => {
    if (token) saveToken(token);
  }, [token]);

  function addAuthHeader(otherHeaders = {}) {
    if (token === INVALID_TOKEN) {
      return otherHeaders;
    } else {
      return {
        ...otherHeaders,
        Authorization: `Bearer ${token}`,
      };
    }
  }
  return (
    <Routes>
      <Route
        path="/"
        element={token ? <HomePage /> : <Navigate to="/login" replace />}
      />

      <Route
        path="/login"
        element={token ? <HomePage /> : <UserLogin onLoginSuccess={setToken} />}
      />

      <Route
        path="/new_arrivals"
        element={
          token ? <NewArrivals token={token} /> : <Navigate to="/login" />
        }
      />
      <Route
        path="/postart"
        element={token ? <PostArt token={token} /> : <Navigate to="/login" />}
      />

      <Route
        path="/signup"
        element={token ? <Navigate to="/" replace /> : <SignUp />}
      />

      <Route
        path="/saved_items"
        element={
          token ? <SavedItems token={token} /> : <Navigate to="/login" />
        }
      />

      <Route
        path="/profile"
        element={
          token ? <UserProfile token={token} /> : <Navigate to="/login" />
        }
      />

      <Route
        path="/item/:id"
        element={token ? <NewItem token={token} /> : <Navigate to="/login" />}
      />

      <Route
        path="*"
        element={<Navigate to={token ? "/" : "/login"} replace />}
      />
    </Routes>
  );
}

export default App;
