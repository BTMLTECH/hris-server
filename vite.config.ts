import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => {
  const isDev = mode === "development";

  return {
    server: {
      host: isDev ? "localhost" : "0.0.0.0",
      port: isDev ? 8082 : 80,
    },
    plugins: [react(), isDev && componentTagger()].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        "date-fns$": path.resolve(__dirname, "node_modules/date-fns/index.js"),
      },
    },
    base: process.env.VITE_FRONTEND_URL,
    optimizeDeps: {
      include: ["date-fns"],
    },
  };
});
