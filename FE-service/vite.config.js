import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy requests starting with /api to the backend server
      "/api": {
        target: "http://localhost:3001", // Target the json-server directly
        changeOrigin: true, // Needed for virtual hosted sites
        rewrite: (path) => path.replace(/^\/api/, ""), // Remove /api prefix before forwarding
      },
    },
    // Ensure Vite listens on the correct port if needed (Cloud Workstations usually handles this)
    // port: 5173, // Explicitly set port if necessary
    // host: true // Listen on all network interfaces
  },
});
