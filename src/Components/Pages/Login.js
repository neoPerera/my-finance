import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Footer from "../Elements/Footer";
import Loading from "../Elements/Loading";
import "./Login.css";

const LogIn = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  // const [loading, setLoading] = useState(false); // State for loading spinner
  const [spinning, setSpinning] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleLogin = async () => {
    // Prevent multiple submissions
    if (spinning) return;
    
    // Validate inputs
    if (!username.trim() || !password.trim()) {
      setError("Please enter both username and password");
      return;
    }

    try {
      setSpinning(true); // Start loading
      setError(""); // Clear previous errors
      // Swal.fire({
      //   title: "Loading",
      //   timerProgressBar: true,
      //   didOpen: () => {
      //     Swal.showLoading();
      //   },
      // });

      const response = await axios.post(
        `${window.env?.REACT_APP_API_URL}main/login`,
        {
          username: username,
          password: password,
        }
      );

      // Handle the response as needed, e.g., redirect to another page on success
      console.log(response.data);
      if (response.data.message === "Login successful") {
        setSuccess("Login successful");
        localStorage.setItem("jwt_token", response.data.token);
        localStorage.setItem("username", username);
        const currentTime = new Date().getTime();
        localStorage.setItem("lastLoginTime", currentTime.toString());
        
        setTimeout(() => {
          navigate("/home");
        }, 1000);
      }
    } catch (error) {
      setSpinning(false);
      setError("Invalid username or password");
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <div className="login-container">
      <Loading active={spinning} fullscreen />
      
      <div className="login-form-container">
        <div className="login-form">
          <h1 className="login-title">My Finance</h1>
          
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}
          
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyPress={handleKeyPress}
              className="form-input"
              disabled={spinning}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              className="form-input"
              disabled={spinning}
            />
          </div>
          
          <button
            className="login-button"
            onClick={handleLogin}
            disabled={spinning}
          >
            {spinning ? "Logging in..." : "Log in"}
          </button>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default LogIn;
