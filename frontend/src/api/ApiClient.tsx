import axios from "axios";
import { apiService } from "./ApiService";

const API_BASE_URL = "http://localhost:8000/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  async (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== "/auth/refresh/"
    ) {
      originalRequest._retry = true;
      try {
        const response = await apiService.auth.refresh();

        localStorage.setItem("accessToken", response.access);
        apiClient.defaults.headers.Authorization = `Bearer ${response.access}`;
        originalRequest.headers.Authorization = `Bearer ${response.access}`;

        return apiClient(originalRequest);
      } catch {
        if (window.location.pathname !== "/login") {
          localStorage.removeItem("accessToken");
          window.location.href = "/login";
        }
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
