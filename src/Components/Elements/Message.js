import React, { useState, useEffect } from "react";
import "./Message.css";

const Message = ({ type, content, duration = 3000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onClose) onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;

  return (
    <div className={`message message-${type}`}>
      <span className="message-content">{content}</span>
      <button className="message-close" onClick={() => setIsVisible(false)}>
        ×
      </button>
    </div>
  );
};

export default Message; 