import React,{ useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import Loading from "../Elements/Loading";

function LogOut() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Perform logout process
    const logoutProcess = async () => {
      console.log("Logging Out...");

      try {
        // Clear all authentication-related data
        localStorage.removeItem("jwt_token");
        localStorage.removeItem("username");
        localStorage.removeItem("lastLoginTime");
        
        // Clear any other session data if needed
        sessionStorage.clear();
        
        console.log("Logged Out Successfully");
        
        // Simulate a brief loading time for better UX
        await new Promise((resolve) => setTimeout(resolve, 1000));
        
      } catch (error) {
        console.error("Error during logout:", error);
      } finally {
        // Update loading state to false
        setLoading(false);
      }
    };

    logoutProcess();
  }, []); // Empty dependency array to run the effect only once on mount

  return loading ? <Loading /> : <Navigate to="/login" replace />;
}

export default LogOut;
