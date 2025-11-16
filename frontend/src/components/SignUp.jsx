import React, { useState } from "react";
import "../style.css";

export default function SignUp() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const submitSignUp = (e) => {
    e.preventDefault();
    fetch(`/api/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((err) => {
            throw new Error(err.error || "Failed to create user");
          });
        }
        console.log(response.json());
      })
      .then((data) => {
        console.log("User created:", data);
        setFormData({ name: "", phone: "", email: "", password: "" });
      })
      .catch((error) => {
        console.error("Error:", error.message);
      });

    // add auth & route to home
  };
  return (
    <div className="signup-page">
      <div className="signup-box">
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
              placeholder="Enter your email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-row">
            <label>Password: </label>
            <input
              type="password"
              placeholder="Enter your password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="signup-btn" onClick={submitSignUp}>
            submit
          </button>
        </form>
      </div>
    </div>
  );
}
