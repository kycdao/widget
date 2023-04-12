/// <reference types="vitest" />
/// <reference types="vite/client" />

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import eslint from "vite-plugin-eslint";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [
    react(),
    eslint(),
    dts({
      insertTypesEntry: true
    }),
  ],
  define: {
    // near-api-js uses process.env.NODE_ENV to determine...something
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
  },
  resolve: {
    alias: {
      "@Pages": resolve(__dirname, "./src/pages/"),
      "@Components": resolve(__dirname, "./src/components/"),
      "@App": resolve(__dirname, "./src/app/"),
      "@Utils": resolve(__dirname, "./src/utils/"),
      "@Hooks": resolve(__dirname, "./src/hooks/"),
      "@Assets": resolve(__dirname, "./src/assets/"),
      stream: 'stream-browserify',
      http: 'agent-base',
      https: 'agent-base',
    }
  },
  // todo: review this, can this be moved to the top level define?
  optimizeDeps: {
    esbuildOptions: {
      // Node.js global to browser globalThis
      define: {
        global: 'globalThis',
      },
    },
  },
  build: {
    sourcemap: true,
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "@kycdao/widget",
      fileName: "index",
    },
    commonjsOptions: {
      // See https://github.com/justinmahar/react-social-media-embed/issues/24
      transformMixedEsModules: true,
    },
    rollupOptions: {
      external: [
        "react",
        "react-dom",
      ],
      output: {
        globals: {
          react: "React",
          'react-dom': "ReactDOM",
        }
      }
    }
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './vitest-setup.ts',
    // you might want to disable it, if you don't have tests that rely on CSS
    // since parsing CSS is slow
    css: true,
  },
});
