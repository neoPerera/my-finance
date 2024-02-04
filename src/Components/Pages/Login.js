import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function LogIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // State for loading spinner
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      setLoading(true); // Start loading
      Swal.fire({
        title: "Loading",
        timerProgressBar: true,
        didOpen: () => {
          Swal.showLoading();
          
        }
      });

      const response = await axios.post(`${process.env.REACT_APP_API_URL}api/login`, {
        username: username,
        password: password,
      });

      // Handle the response as needed, e.g., redirect to another page on success
      console.log(response.data);
      if (response.data.message === "Login successful") {
        // Set a value in local storage
        Swal.fire({
          title: "Log in successful!",
          icon: "success"
        });
        localStorage.setItem("jwt_token", response.data.token);
        navigate("/home");
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
        footer: '<a href="#">Why do I have this issue?</a>',
      });
    } finally {
      setLoading(false); // Stop loading, whether successful or not
    }
  };

  return (
    <div className="login-page">
      <div className="card card-outline card-primary">
        <div className="card-header text-center">
          <a href="/" className="h1">
            <b>MYPAGE</b>LTE
          </a>
        </div>
        <div className="card-body">
          <p className="login-box-msg">Sign in to start your session</p>

          <div>
            <div className="input-group mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <div className="input-group-append">
                <div className="input-group-text">
                  <span className="fas fa-envelope"></span>
                </div>
              </div>
            </div>
            <div className="input-group mb-3">
              <input
                type="password"
                className="form-control"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div className="input-group-append">
                <div className="input-group-text">
                  <span className="fas fa-lock"></span>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-5">
                <button
                  type="button"
                  className="btn btn-primary btn-block"
                  onClick={handleLogin}
                  disabled={loading} // Disable the button when loading
                >
                  Log in
                </button>
              </div>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LogIn;
