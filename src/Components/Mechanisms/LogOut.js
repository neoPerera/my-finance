import React,{ useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import Loading from "../Elements/Loading";


function LogOut() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate asynchronous logout process
    const logoutProcess = async () => {
      console.log("Logging Out...");

      // Simulate some asynchronous task (e.g., API request, timeout)
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Perform actual logout actions
      console.log("Logged Out");

      // Read JWT token from storage
      localStorage.removeItem("jwt_token");

      // Update loading state to false
      setLoading(false);
    };

    logoutProcess();
  }, []); // Empty dependency array to run the effect only once on mount

  return loading ? <Loading /> : <Navigate to="/login" />;
}

export default LogOut;
