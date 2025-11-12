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

export default function App() {
  const [token, setToken] = useState(() => sessionStorage.getItem("token"));

  useEffect(() => {
    if (token && token !== INVALID_TOKEN)
      sessionStorage.setItem("token", token);
    else sessionStorage.removeItem("token");
  }, [token]);

  const isLoggedIn = token && token !== INVALID_TOKEN;

  const handleLoginSuccess = (validToken) => {
    if (validToken && validToken !== INVALID_TOKEN) setToken(validToken);
  };

  return (
    <Routes>
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
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="new_arrivals" element={<NewArrivals />} />
          <Route path="saved_items" element={<SavedItems />} />
          <Route path="profile" element={<UserPage />} />
          <Route path="signup" element={<SignUp />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      ) : (
        <Route path="*" element={<Navigate to="/login" replace />} />
      )}
    </Routes>
  );
}
