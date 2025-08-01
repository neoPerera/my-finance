import React from "react";
import "./Loading.css";

const Loading = ({ active = true, fullscreen = false }) => {
  if (!active) return null;

  if (fullscreen) {
    return (
      <div className="loading-fullscreen">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
    </div>
  );
};

export default Loading;
