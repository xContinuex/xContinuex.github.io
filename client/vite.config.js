import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    host: '0.0.0.0',
    allowedHosts: true,
    proxy: {
      // 关键：开发期把 /api/* 代理到后端 3000 端口
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  },
  // GitHub Pages 部署时，仓库根目录就是 https://xContinuex.github.io（无子路径）
  base: '/'
})
