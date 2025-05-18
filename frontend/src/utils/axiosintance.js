import axios from "axios";
import { BASEURL } from "./apiPath.js";

const axiosInstance = axios.create({
  baseURL: BASEURL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json"
  }
});

axiosInstance.interceptors.request.use(
  (config) => {
    const accesstoken = localStorage.getItem('accesstoken');
    if (accesstoken) {
      config.headers.Authorization = `Bearer ${accesstoken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Optional: Add a response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Example: redirect to login if unauthorized
    if (error.response?.status === 401) {
      // localStorage.removeItem('access_token'); // optional
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
 