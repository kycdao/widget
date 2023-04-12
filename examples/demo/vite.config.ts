import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react()
  ],
  resolve: {
    alias: {
      stream: 'stream-browserify',
      http: 'agent-base',
      https: 'agent-base',
    }
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
  },
})
