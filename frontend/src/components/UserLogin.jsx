import React, { useState } from "react";

export default function UserLogin() {
  const [username, setUsername] = useState("");
  const [pwd, setPwd] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    // TODO: hook to your auth
    console.log({ username, pwd });
  };

  return (
    <div className="login-screen">
      <div className="login-panel">
        <h1 className="login-heading">
          <span className="login-heading-shadow">log in</span>
          <span className="login-heading-fill">log in</span>
        </h1>

        <form className="login-form" onSubmit={onSubmit}>
          <div className="login-row">
            <label className="login-label" htmlFor="user">
              Username :
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

          <button className="login-submit" type="submit">
            submit
          </button>
        </form>
      </div>
    </div>
  );
}
