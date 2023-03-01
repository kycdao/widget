import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import eslint from "vite-plugin-eslint";
import dts from "vite-plugin-dts";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    eslint(),
    dts({
      insertTypesEntry: true
    })
  ],
  resolve: {
    alias: {
      "@Pages": resolve(__dirname, "./src/pages/"),
      "@Components": resolve(__dirname, "./src/components/"),
      "@App": resolve(__dirname, "./src/app/"),
      "@Utils": resolve(__dirname, "./src/utils/"),
      "@Hooks": resolve(__dirname, "./src/hooks/"),
      "@Assets": resolve(__dirname, "./src/assets/")
    }
  },
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "@kycdao/widget",
      fileName: "KycDaoWidget"
    },
    rollupOptions: {
      external: [
        "react",
        "react-dom"
      ],
      output: {
        globals: {
          react: "React"
        }
      }
    }
  }
});
