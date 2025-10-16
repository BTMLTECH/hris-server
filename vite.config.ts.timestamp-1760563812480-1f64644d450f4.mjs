// vite.config.ts
import { defineConfig } from "file:///mnt/c/Users/techn/OneDrive/Desktop/project/h/hris/frontend/node_modules/vite/dist/node/index.js";
import react from "file:///mnt/c/Users/techn/OneDrive/Desktop/project/h/hris/frontend/node_modules/@vitejs/plugin-react-swc/index.js";
import path from "path";
import { componentTagger } from "file:///mnt/c/Users/techn/OneDrive/Desktop/project/h/hris/frontend/node_modules/lovable-tagger/dist/index.js";
var __vite_injected_original_dirname = "/mnt/c/Users/techn/OneDrive/Desktop/project/h/hris/frontend";
var vite_config_default = defineConfig(({ mode }) => {
  const isDev = mode === "development";
  return {
    server: {
      host: isDev ? "localhost" : "0.0.0.0",
      port: isDev ? 8082 : 80
    },
    plugins: [react(), isDev && componentTagger()].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__vite_injected_original_dirname, "./src"),
        "date-fns$": path.resolve(__vite_injected_original_dirname, "node_modules/date-fns/index.js")
      }
    },
    base: process.env.VITE_FRONTEND_URL,
    optimizeDeps: {
      include: ["date-fns"]
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvbW50L2MvVXNlcnMvdGVjaG4vT25lRHJpdmUvRGVza3RvcC9wcm9qZWN0L2gvaHJpcy9mcm9udGVuZFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL21udC9jL1VzZXJzL3RlY2huL09uZURyaXZlL0Rlc2t0b3AvcHJvamVjdC9oL2hyaXMvZnJvbnRlbmQvdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL21udC9jL1VzZXJzL3RlY2huL09uZURyaXZlL0Rlc2t0b3AvcHJvamVjdC9oL2hyaXMvZnJvbnRlbmQvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xyXG5pbXBvcnQgcmVhY3QgZnJvbSBcIkB2aXRlanMvcGx1Z2luLXJlYWN0LXN3Y1wiO1xyXG5pbXBvcnQgcGF0aCBmcm9tIFwicGF0aFwiO1xyXG5pbXBvcnQgeyBjb21wb25lbnRUYWdnZXIgfSBmcm9tIFwibG92YWJsZS10YWdnZXJcIjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZygoeyBtb2RlIH0pID0+IHtcclxuICBjb25zdCBpc0RldiA9IG1vZGUgPT09IFwiZGV2ZWxvcG1lbnRcIjtcclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIHNlcnZlcjoge1xyXG4gICAgICBob3N0OiBpc0RldiA/IFwibG9jYWxob3N0XCIgOiBcIjAuMC4wLjBcIixcclxuICAgICAgcG9ydDogaXNEZXYgPyA4MDgyIDogODAsXHJcbiAgICB9LFxyXG4gICAgcGx1Z2luczogW3JlYWN0KCksIGlzRGV2ICYmIGNvbXBvbmVudFRhZ2dlcigpXS5maWx0ZXIoQm9vbGVhbiksXHJcbiAgICByZXNvbHZlOiB7XHJcbiAgICAgIGFsaWFzOiB7XHJcbiAgICAgICAgXCJAXCI6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi9zcmNcIiksXHJcbiAgICAgICAgXCJkYXRlLWZucyRcIjogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCJub2RlX21vZHVsZXMvZGF0ZS1mbnMvaW5kZXguanNcIiksXHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAgYmFzZTogcHJvY2Vzcy5lbnYuVklURV9GUk9OVEVORF9VUkwsXHJcbiAgICBvcHRpbWl6ZURlcHM6IHtcclxuICAgICAgaW5jbHVkZTogW1wiZGF0ZS1mbnNcIl0sXHJcbiAgICB9LFxyXG4gIH07XHJcbn0pO1xyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQW1XLFNBQVMsb0JBQW9CO0FBQ2hZLE9BQU8sV0FBVztBQUNsQixPQUFPLFVBQVU7QUFDakIsU0FBUyx1QkFBdUI7QUFIaEMsSUFBTSxtQ0FBbUM7QUFLekMsSUFBTyxzQkFBUSxhQUFhLENBQUMsRUFBRSxLQUFLLE1BQU07QUFDeEMsUUFBTSxRQUFRLFNBQVM7QUFFdkIsU0FBTztBQUFBLElBQ0wsUUFBUTtBQUFBLE1BQ04sTUFBTSxRQUFRLGNBQWM7QUFBQSxNQUM1QixNQUFNLFFBQVEsT0FBTztBQUFBLElBQ3ZCO0FBQUEsSUFDQSxTQUFTLENBQUMsTUFBTSxHQUFHLFNBQVMsZ0JBQWdCLENBQUMsRUFBRSxPQUFPLE9BQU87QUFBQSxJQUM3RCxTQUFTO0FBQUEsTUFDUCxPQUFPO0FBQUEsUUFDTCxLQUFLLEtBQUssUUFBUSxrQ0FBVyxPQUFPO0FBQUEsUUFDcEMsYUFBYSxLQUFLLFFBQVEsa0NBQVcsZ0NBQWdDO0FBQUEsTUFDdkU7QUFBQSxJQUNGO0FBQUEsSUFDQSxNQUFNLFFBQVEsSUFBSTtBQUFBLElBQ2xCLGNBQWM7QUFBQSxNQUNaLFNBQVMsQ0FBQyxVQUFVO0FBQUEsSUFDdEI7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
