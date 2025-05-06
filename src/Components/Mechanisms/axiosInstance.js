import axios from "axios";

const axiosInstance = axios.create({
  baseURL: window.env?.REACT_APP_API_URL || "", // or from .env
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jwt_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
