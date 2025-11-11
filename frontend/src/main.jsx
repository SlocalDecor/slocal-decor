import React from "react";
import ReactDOM from "react-dom/client";
import UserPage from "./components/UserProfile.jsx";
import HomePage from "./components/HomePage";
import SignUp from "./components/SignUp.jsx";
import NewArrivals from "./components/NewArrivals.jsx";
import SavedItems from "./components/SavedItems.jsx";
import UserLogin from "./components/UserLogin.jsx";
import { BrowserRouter } from "react-router-dom";
import App from "./components/MyApp.jsx";
import "./style.css";
import UserLogin from "./components/UserLogin.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
