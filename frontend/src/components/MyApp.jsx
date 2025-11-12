import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Layout from "./Layout.jsx";
import HomePage from "./HomePage.jsx";
import UserLogin from "./UserLogin.jsx";
import SignUp from "./SignUp.jsx";
import NewArrivals from "./NewArrivals.jsx";
import SavedItems from "./SavedItems.jsx";
import UserPage from "./UserProfile.jsx";

const INVALID_TOKEN = "INVALID_TOKEN";

// ✅ DEV-ONLY RESET:
// On the first load after starting `npm run dev`, clear any stale session.
// We do it **once** per page load using a window flag so it doesn't log you out after you log in.
if (import.meta.env.DEV && !window.__DEV_CLEARED_ONCE__) {
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("loggedInThisSession");
  window.__DEV_CLEARED_ONCE__ = true;
}

export default function App() {
  // ✅ Only accept a token if we know this tab actually logged in during THIS session.
  const [token, setToken] = useState(() => {
    const loggedFlag = sessionStorage.getItem("loggedInThisSession") === "1";
    if (!loggedFlag) {
      // Force start at /login
      sessionStorage.removeItem("token");
      return null;
    }
    return sessionStorage.getItem("token");
  });

  // Keep token in sessionStorage while this tab session is alive
  useEffect(() => {
    if (token && token !== INVALID_TOKEN) {
      sessionStorage.setItem("token", token);
    } else {
      sessionStorage.removeItem("token");
    }
  }, [token]);

  // Called by <UserLogin /> on success
  const handleLoginSuccess = (validToken) => {
    if (validToken && validToken !== INVALID_TOKEN) {
      sessionStorage.setItem("loggedInThisSession", "1"); // mark that THIS tab logged in
      setToken(validToken);
    }
    // If invalid, do nothing — stay on /login
  };

  const isLoggedIn = !!token && token !== INVALID_TOKEN;

  return (
    <Routes>
      {/* Login route always accessible */}
      <Route
        path="/login"
        element={
          isLoggedIn ? (
            <Navigate to="/" replace />
          ) : (
            <UserLogin onLoginSuccess={handleLoginSuccess} />
          )
        }
      />

      {isLoggedIn ? (
        // Logged-in routes (navbar + outlet)
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="new_arrivals" element={<NewArrivals />} />
          <Route path="saved_items" element={<SavedItems />} />
          <Route path="profile" element={<UserPage />} />
          <Route path="signup" element={<SignUp />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      ) : (
        // Not logged in → everything funnels to /login
        <Route path="*" element={<Navigate to="/login" replace />} />
      )}
    </Routes>
  );
}
