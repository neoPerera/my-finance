import React, { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import Authenticate from "./authenticate";

import Loading from "../Elements/Loading";

const ProtectedRoute = () => {
  const [auth, setAuth] = useState(null); // Use null to indicate initial loading state
  const location = useLocation();

  useEffect(() => {
    const jwtToken = localStorage.getItem("jwt_token");

    const checkAuthentication = async () => {
      try {
        if (jwtToken) {
          const isAuthenticated = await Authenticate();
          setAuth(isAuthenticated);
        } else {
          setAuth(false); // No token, set to false
        }
      } catch (error) {
        console.error("Authentication failed:", error);
        localStorage.removeItem("jwt_token");
        setAuth(false); // Set to false in case of an error
      }
    };

    checkAuthentication();
  }, [location.pathname]);

  const jwtToken = localStorage.getItem("jwt_token");
  console.log("Route Protection");
  if (auth === null || (jwtToken != null && auth === false)) {
    return <Loading />;
  }

  // if (location.pathname === '/login') {
  //     return auth ? <Navigate to="/home" /> : <Outlet />;
  // } else {
  //     return auth ? <Outlet /> : <Navigate to="/login" />;
  // }
  return (
    <>
      {location.pathname === "/login" ? (
        auth ? (
          <Navigate to="/home" />
        ) : (
          <Outlet />
        )
      ) : auth ? (
        <Outlet />
      ) : (
        <Navigate to="/login" />
      )}
    </>
  );
};

export default ProtectedRoute;
