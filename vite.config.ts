import { defineConfig } from 'vitest/config';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  // 相对路径，便于部署到 GitHub Pages 等子目录
  base: './',
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  build: {
    // gallery.html 仅供开发时预览插图，不参与打包
    rollupOptions: { input: 'index.html' },
  },
  test: {
    environment: 'node',
  },
});
