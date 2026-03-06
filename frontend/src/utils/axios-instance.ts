import axios from "axios";
import { BASE_URL } from "./api-paths";
import { getErrorMessage } from "./helper";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem("token");
      if (token && config && config.headers) {
        // attach bearer token if present in localStorage
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (err) {
      // ignore localStorage errors in non-browser environments
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        const isAuthPage =
          window.location.pathname === "/login" ||
          window.location.pathname === "/sign-up";

        if (!isAuthPage) {
          window.location.href = "/login";
        }
      } else if (error.response.status === 500) {
        console.error(getErrorMessage(error));
      }
    } else if (error.code === "ECONNABORTED") {
      console.error("Request timed out. Please try again.");
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
