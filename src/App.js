// App.js
import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import LogIn from "./Components/Pages/Login";
import ProtectedRoute from "./Components/Mechanisms/ProtectedRoute";
import Home from "./Components/Pages/Home";
import NotFound from "./Components/Pages/404";
import LogOut from "./Components/Mechanisms/LogOut";
import Axios from 'axios';
// const ReportApp = React.lazy(() => import("reports/ReportApp"));
//const ReportsApp = React.lazy(() => import('myfinanceReports/App'));

const App = () => {
  useEffect(() => {
    // Add a request interceptor
    const requestInterceptor = Axios.interceptors.request.use(
      (config) => {
        // Get the token from localStorage or your authentication state
        const token = localStorage.getItem('jwt_token');

        // Add the Bearer token to the Authorization header
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        
        return config;
      },
      (error) => {
        // Do something with the request error
        return Promise.reject(error);
      }
    );

    // Clean up the interceptor when the component unmounts
    return () => {
      Axios.interceptors.request.eject(requestInterceptor);
    };
  }, []);

  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<ProtectedRoute />}>
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/login" element={<LogIn />} />
          <Route path="/home/*" element={<Home />} />
          {/* <Route path="/report/*" element={<ReportApp />} /> */}
          {/* <Route  exact path='/home/ref-expense' element={<Home/>}/> */}
          {/* <Route exact path='/ref-expense' element={<Home/>}/> */}
          <Route path="/logout" element={<LogOut />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
