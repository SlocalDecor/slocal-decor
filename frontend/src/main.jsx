import React from "react";
import ReactDOM from "react-dom/client";
import NewItem from "./components/NewItem.jsx";
//import NewArrivals from "./components/NewArrivals.jsx";
//import UserLogin from "./components/UserLogin.jsx";
//import UserPage from "./components/UserProfile.jsx";
//import HomePage from "./components/HomePage";
import "./style.css";
import UserLogin from "./components/UserLogin.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <SignUp />
    {/*<UserPage />*/}
    {/* <HomePage /> */}
    {/* <UserPage /> */}
    {/* <NewArrivals/> */}
  </React.StrictMode>
);
