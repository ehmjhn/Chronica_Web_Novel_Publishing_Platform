import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    // Firebase alone is ~400 kB. Splitting it into its own long-cached chunk
    // keeps it out of the app bundle, so a code change does not invalidate
    // the vendor download in users' browsers.
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return undefined;
          if (id.includes("@firebase") || id.includes("firebase")) return "firebase";
          if (id.includes("@dnd-kit")) return "dnd";
          if (id.includes("quill") || id.includes("react-quill")) return "quill";
          if (id.includes("dompurify")) return "sanitize";
          if (id.includes("react-router")) return "router";
          if (id.includes("react-dom") || id.includes("/react/")) return "react";
          return undefined;
        },
      },
    },
    chunkSizeWarningLimit: 700,
  },
});
