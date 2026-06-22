import axios from "axios";

// With the Vite proxy configured in vite.config.js, /api calls go straight
// to localhost:5000 — no CORS issues, no env var needed in dev.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "",
});

// Attach JWT token to every outgoing request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto-logout when the server returns 401 (expired / invalid token)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isLoginRequest = error.config?.url?.includes("/auth/login");
    if (error.response?.status === 401 && !isLoginRequest) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
