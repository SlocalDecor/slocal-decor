import React, { useState } from "react";
import ErrorPopup from "./ErrorPopup";
import { useNavigate } from "react-router-dom";
import "../style.css";

export default function SignUp() {
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const submitSignUp = async (e) => {
    e.preventDefault();
    if (!termsCheckbox.checked) {
      setError("You must agree to the Terms and Conditions to sign up.");
      return;
    }
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const contentType = response.headers.get("content-type");
      const isJson = contentType && contentType.includes("application/json");
      const body = isJson ? await response.json() : await response.text();

      if (!response.ok) {
        const message =
          (typeof body === "object" && body?.error) ||
          (typeof body === "string" && body) ||
          "Failed to create user.";
        throw new Error(message);
      }

      setFormData({ name: "", phone: "", email: "", password: "" });
      navigate("/login");
    } catch (error) {
      setError(error.message || "Unable to create account right now.");
      console.error("Error:", error.message);
    }
  };
  return (
    <div className="signup-page">
      <ErrorPopup message={error} onClose={() => setError("")} />
      <div className="signup-box">
        <div className="auth-header">
          <img src="/images/logo.png" alt="logo" className="auth-logo" />
          <div className="auth-brand">Slocal Decor</div>
        </div>

        <h1 className="signup-title">sign up</h1>
        <form className="signup-form">
          <div className="form-row">
            <label> Name: </label>
            <input
              type="text"
              placeholder="Enter your full name"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className="form-row">
            <label>Phone: </label>
            <input
              type="text"
              placeholder="Enter your phone number"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div className="form-row">
            <label>Email: </label>
            <input
              type="email"
              placeholder="Enter your email (must be valid email)"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-row">
            <label>Password: </label>
            <input
              type="password"
              placeholder="Enter your password (at least 8 characters)"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <label className="terms-label">
            <input type="checkbox" id="termsCheckbox" required />
            By signing up, you agree to the
            <a
              href="https://github.com/user-attachments/files/23517947/Terms.Conditions.-.SlocalDecor.pdf"
              download="SlocalDecor-terms-and-conditions.pdf"
            >
              Terms and Conditions
            </a>
          </label>

          <button type="submit" className="signup-btn" onClick={submitSignUp}>
            submit
          </button>
        </form>
      </div>
    </div>
  );
}
