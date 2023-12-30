// If you are already using Vite, add test property in your Vite config. You'll also need to add a reference to Vitest types using a triple slash directive at the top of your config file.
/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { fileURLToPath, URL } from "url"
import svgr from 'vite-plugin-svgr'

export default defineConfig({
  base: '/',
  plugins: [
    react(),
    svgr(
      {
        svgrOptions: {
          // svgr options
        },
      }
    )
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
    css: true,
    reporters: ['verbose'],
    coverage: {
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*'],
      exclude: [],
    }
  },
  server: {
    // this ensures that the browser opens upon server start
    open: true,
    // this sets a default port to 3366
    port: 3366,
  },
  css: {
    preprocessorOptions: {
      sass: {
        // global available
        // prependData: `@import "@/styles/variables.scss";@import "@/styles/mixins.scss";`,
      },
    },
  },
  resolve: {
    alias: [
      { find: '@', replacement: fileURLToPath(new URL('./src', import.meta.url)) },
      { find: '@assets', replacement: fileURLToPath(new URL('./src/assets', import.meta.url)) },
      { find: '@api', replacement: fileURLToPath(new URL('./src/api', import.meta.url)) },
      { find: '@components', replacement: fileURLToPath(new URL('./src/components', import.meta.url)) },
      { find: '@config', replacement: fileURLToPath(new URL('./src/config', import.meta.url)) },
      { find: '@pages', replacement: fileURLToPath(new URL('./src/pages', import.meta.url)) },
      { find: '@constant', replacement: fileURLToPath(new URL('./src/constant', import.meta.url)) },
      { find: '@hooks', replacement: fileURLToPath(new URL('./src/hooks', import.meta.url)) },
      { find: '@utils', replacement: fileURLToPath(new URL('./src/utils', import.meta.url)) },
      { find: '@styles', replacement: fileURLToPath(new URL('./src/styles', import.meta.url)) },
    ],
  },
})