import React, { useState } from "react";
import UserLogin from "./UserLogin";
import SignUp from "./SignUp";
import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./HomePage";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const INVALID_TOKEN = "INVALID_TOKEN";
  const [token, setToken] = useState(null);

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
  // You could later replace this with auth logic (e.g. check JWT or cookie)
  return (
    <Routes>
      <Route
        path="/"
        element={token ? <HomePage /> : <Navigate to="/login" replace />}
      />
      <Route path="/login" element={<UserLogin onLoginSuccess={setToken} />} />
    </Routes>
  );
}

export default App;
