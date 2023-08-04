import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteTsconfigPaths from 'vite-tsconfig-paths'
import svgrPlugin from 'vite-plugin-svgr'
// import { visualizer } from "rollup-plugin-visualizer"; // for bundle analyzer
import envCompatible from 'vite-plugin-env-compatible'

const Config = ({ mode }) => {
  return defineConfig({
    envPrefix: 'REACT_APP_',
    build: {
      outDir: 'build',
    },
    server: {
      port: 3000,
      open: true,
    },
    plugins: [
      react(),
      viteTsconfigPaths(),
      svgrPlugin(),
      envCompatible(),
      //   visualizer({
      //   template: "treemap", // or sunburst
      //   open: true,
      //   gzipSize: true,
      //   brotliSize: true,
      //   filename: "analyse.html",
      // })
    ],
  })
}

export default Config
