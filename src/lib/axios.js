import axios from "axios";
import { alertError } from "../lib/alerts";
import { useAuthStore } from "../stores";

const BASE_URL = import.meta.env.VITE_API_URL;

function handleLogout() {
  useAuthStore.getState().clearToken(); // update store dan localStorage
  window.location.href = "/login";
}

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    if (status === 401 || status === 403) {
      alertError("Sesi Anda telah berakhir. Silakan login kembali.");
      handleLogout();
    }

    return Promise.reject(error);
  }
);

export default api;
