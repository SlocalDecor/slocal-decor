import React from "react";
import ReactDOM from "react-dom/client";
import UserPage from "./components/UserProfile.jsx";
import HomePage from "./components/HomePage";
import SignUp from "./components/SignUp.jsx";
import NewArrivals from "./components/NewArrivals.jsx";
import SavedItems from "./components/SavedItems.jsx";
import "./style.css";
import UserLogin from "./components/UserLogin.jsx";
import NavBar from "./components/NavBar.jsx";
import UserProfile from "./components/UserProfile.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HomePage />
    {/*<UserPage />*/}
    {/* <HomePage /> */}
    {/* <UserPage /> */}
    {/* <NewArrivals/> */}
  </React.StrictMode>
);
