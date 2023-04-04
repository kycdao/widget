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
    'process.env': {}
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
  build: {
    sourcemap: true,
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "@kycdao/widget",
      fileName: "KycDaoWidget"
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
  }
});
