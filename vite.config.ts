import { defineConfig } from "vite";

export default defineConfig({
  root: "src/main/frontend",
  server: {
    proxy: {
      "/ws": {
        ws: true,
        target: "http://localhost:9080",
      },
      "/api": "http://localhost:9080",
      "/api-doc": "http://localhost:9080",
    },
  },
});
