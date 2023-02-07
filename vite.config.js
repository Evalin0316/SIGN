import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  base:'/week2-F2E/',
  envDir: path.resolve(__dirname, "./env")
})

