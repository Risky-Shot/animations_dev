import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tsconfigPaths from "vite-tsconfig-paths"

// https://vite.dev/config/
export default defineConfig({
  base: "./",
  plugins: [react(), tsconfigPaths()],
  optimizeDeps: {
    include: [
      "@chakra-ui/react",
      "@emotion/react",
      "@emotion/styled",
      "react-virtuoso"
    ],
    force: true,
  },
  build: {
    target: "esnext",
    outDir: "dist",

    // SPEED SETTINGS:
    modulePreload: false,
    polyfillModulePreload: false,
    cssCodeSplit: false,
    minify: "esbuild",

    // MASSIVE SPEEDUP
    rollupOptions: {
      treeshake: false,
    },
  },
})
