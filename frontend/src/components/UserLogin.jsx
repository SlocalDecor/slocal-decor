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
  const submitLogIn = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: username, password: pwd }),
      });

      const contentType = response.headers.get("content-type");
      const isJson = contentType && contentType.includes("application/json");
      const body = isJson ? await response.json() : await response.text();

      if (!response.ok) {
        const message =
          (typeof body === "object" && body?.error) ||
          (typeof body === "string" && body) ||
          "Username or password is invalid";
        throw new Error(message);
      }

      onLoginSuccess(body.token);
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
      console.error(err.message);
    }
  };
  return (
    <div className="login-screen">
      <div className="auth-header">
        <img src="/images/logo.png" alt="logo" className="auth-logo" />
        <div className="auth-brand">Slocal Decor</div>
      </div>

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
