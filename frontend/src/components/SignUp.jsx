import React from "react";
import "../style.css";

export default function SignUp() {
  return (
    <div className="signup-page">
      <div className="signup-box">
        <h1 className="signup-title">sign up</h1>

        <form className="signup-form">
          <div className="form-row">
            <label>First name :</label>
            <input type="text" placeholder="Enter your first name" />
          </div>

          <div className="form-row">
            <label>Last name :</label>
            <input type="text" placeholder="Enter your last name" />
          </div>

          <div className="form-row">
            <label>Phone number :</label>
            <input type="text" placeholder="Enter your phone number" />
          </div>

          <div className="form-row">
            <label>Email ID :</label>
            <input type="email" placeholder="Enter your email" />
          </div>

          <div className="form-row">
            <label>Password :</label>
            <input type="password" placeholder="Enter your password" />
          </div>

          <button type="submit" className="signup-btn">
            submit
          </button>
        </form>
      </div>
    </div>
  );
}
