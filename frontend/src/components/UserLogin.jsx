import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SignUp from "./SignUp";
import ErrorPopup from "./ErrorPopup";
import "../style.css";

export default function UserLogin({ onLoginSuccess }) {
  const [error, setError] = useState("");
  const [username, setUsername] = useState("");
  const [pwd, setPwd] = useState("");
  const navigate = useNavigate();

  const onSubmit = (e) => {
    e.preventDefault();
    console.log({ username, pwd });
  };
  const submitLogIn = (e) => {
    e.preventDefault();
    console.log(import.meta.env.VITE_API_URL);
    fetch(`${import.meta.env.VITE_API_URL}/api/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: username, password: pwd }),
    })
      .then((response) => {
        if (!response.ok) {
          setError(response.text());
          return response.json().then((err) => {
            throw new Error(err.error || "Username or password is invalid");
          });
        }
        return response.json();
      })
      .then((res) => {
        onLoginSuccess(res.token);
        navigate("/", { replace: true });
      })
      .catch((err) => console.error(err.message));

    return;
  };
  return (
    <div className="login-screen">
      <div className="login-panel">
        <h1 className="login-heading">
          <span className="login-heading-shadow">log in</span>
          <span className="login-heading-fill">log in</span>
        </h1>

        <ErrorPopup message={error} onClose={() => setError("")} />

        <form className="login-form" onSubmit={onSubmit}>
          <div className="login-row">
            <label className="login-label" htmlFor="user">
              Email :
            </label>
            <input
              id="user"
              className="login-input"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              aria-label="Username"
            />
          </div>

          <div className="login-row">
            <label className="login-label" htmlFor="pass">
              Password :
            </label>
            <input
              id="pass"
              className="login-input"
              type="password"
              value={pwd}
              onChange={(e) => setPwd(e.target.value)}
              aria-label="Password"
            />
          </div>
          <div className="login-buttons">
            <button
              className="login-submit"
              type="submit"
              onClick={submitLogIn}
            >
              submit
            </button>
            <button
              type="button"
              className="login-signup-btn"
              onClick={() => navigate("/SignUp")}
            >
              <p className="sub-text">new account: click here</p>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
