import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://linkedin-49mj.onrender.com",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;
let pendingRequests: Array<() => void> = [];

const processQueue = (error?: unknown) => {
  pendingRequests.forEach((callback) => callback());
  pendingRequests = [];
};

api.interceptors.request.use((config) => config);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const isAuthRequest = originalRequest?.url?.includes("/auth/");

    if (
      error.response?.status === 401 &&
      !originalRequest?._retry &&
      !isAuthRequest
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          pendingRequests.push(() => {
            originalRequest._retry = true;
            resolve(api(originalRequest));
          });
        });
      }

      isRefreshing = true;
      originalRequest._retry = true;

      try {
        await api.post("/auth/refresh");
        processQueue();
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default api;
