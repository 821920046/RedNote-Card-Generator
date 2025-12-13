import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: './',  // 不要使用绝对路径
  plugins: [react()],
})
