import React from "react";
import ReactDOM from "react-dom/client";
import UserPage from "./components/UserProfile.jsx";
import HomePage from "./components/HomePage";
import SignUp from "./components/SignUp.jsx";
import "./style.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <SignUp />
    {/*<UserPage />*/}
    {/* <HomePage /> */}
  </React.StrictMode>
);
