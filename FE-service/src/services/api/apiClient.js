import axios from "axios";

// Base URL points to the proxy path configured in vite.config.js
const baseURL = "/api";

const apiClient = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;
