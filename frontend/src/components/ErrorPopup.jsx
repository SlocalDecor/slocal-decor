import React, { useState } from "react";
export default function ErrorPopup({ message, onClose }) {
    if (!message) return null;
  
    return (
      <div className="overlay">
        <div className="popup error">
          <h3>Error</h3>
          <p>{message}</p>
          <button className="error-button" onClick={onClose}>Close</button>
        </div>
      </div>
    );
  }