import axios from "axios";

// Base URL points to the proxy path configured in vite.config.js
const baseURL = "/api";

const apiClient = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// You can add interceptors here if needed later (e.g., for auth tokens)

export default apiClient;
