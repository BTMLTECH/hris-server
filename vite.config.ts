
// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react-swc";
// import path from "path";
// import { componentTagger } from "lovable-tagger";


// // https://vitejs.dev/config/
// export default defineConfig(({ mode }) => ({
  
//  server: {
//     host: "localhost",
//     port: 8082,
    
//   },
//   plugins: [
//     react(),
//     mode === 'development' && componentTagger(),
//   ].filter(Boolean),
//   resolve: {
//     alias: {
//       "@": path.resolve(__dirname, "./src"),
//     },
//   },
// }));


import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  server: {
    host: "localhost",
    port: 8082,
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "date-fns$": path.resolve(__dirname, "node_modules/date-fns/index.js"), 
      // 👆 Only when importing "date-fns", not subpaths
    },
  },
  optimizeDeps: {
    include: ["date-fns"],
  },
}));
