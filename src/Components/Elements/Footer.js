import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <a
          href="https://www.chanuthperera.com"
          target="_blank"
          rel="noopener noreferrer"
          className="footer-link"
        >
          NEO Design
        </a>
        <span className="footer-text">©{new Date().getFullYear()}</span>
      </div>
    </footer>
  );
};

export default Footer; 