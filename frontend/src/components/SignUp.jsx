import React, { useState } from "react";
import ErrorPopup from "./ErrorPopup";
import { useNavigate } from "react-router-dom";
import { apiUrl } from "../helpers/api";
import "../style.css";

export default function SignUp() {
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [termsAccepted, setTermsAccepted] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      return "Please enter your full name.";
    }
    if (!formData.phone.trim()) {
      return "Please enter your phone number.";
    }
    if (!formData.email.trim()) {
      return "Please enter your email address.";
    }
    // very basic email check – can be improved if needed
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      return "Please enter a valid email address (e.g., name@example.com).";
    }
    if (!formData.password) {
      return "Please enter a password.";
    }
    if (formData.password.length < 8) {
      return "Your password must be at least 8 characters long.";
    }
    if (!termsAccepted) {
      return "You must agree to the Terms and Conditions to sign up.";
    }
    return null;
  };

  const submitSignUp = async (e) => {
    e.preventDefault();
    setError("");

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const response = await fetch(apiUrl("/api/signup"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      // Try to parse response body (JSON or text) for better error messages
      const contentType = response.headers.get("content-type");
      let body;
      try {
        if (contentType && contentType.includes("application/json")) {
          body = await response.json();
        } else {
          body = await response.text();
        }
      } catch {
        body = null;
      }

      if (!response.ok) {
        let message = "Failed to create user.";

        if (body) {
          if (typeof body === "string" && body.trim() !== "") {
            message = body;
          } else if (typeof body === "object") {
            // common backend patterns
            message =
              body.error ||
              body.message ||
              JSON.stringify(body, null, 2) ||
              message;
          }
        }

        throw new Error(message);
      }

      // success
      setFormData({ name: "", phone: "", email: "", password: "" });
      setTermsAccepted(false);
      navigate("/login");
    } catch (err) {
      // This is where we make the error as informative as possible
      setError(
        err.message ||
          "An unexpected error occurred while creating your account. Please try again."
      );
      console.error("Sign up error:", err);
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
        <form className="signup-form" onSubmit={submitSignUp}>
          <div className="form-row">
            <label>Name: </label>
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
            <input
              type="checkbox"
              id="termsCheckbox"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              required
            />
            By signing up, you agree to the{" "}
            <a
              href="https://github.com/user-attachments/files/23517947/Terms.Conditions.-.SlocalDecor.pdf"
              download="SlocalDecor-terms-and-conditions.pdf"
            >
              Terms and Conditions
            </a>
          </label>

          <button type="submit" className="signup-btn">
            submit
          </button>
        </form>
      </div>
    </div>
  );
}
