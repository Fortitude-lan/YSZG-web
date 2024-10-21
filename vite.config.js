/*
 * @Descripttion: 
 * @version: 1.0
 * @Author: Hesin
 * @Date: 2024-10-17 13:34:11
 * @LastEditors: Hesin
 * @LastEditTime: 2024-10-19 17:52:54
 */

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// 用于路径解析
function resolve(dir) {
  return path.resolve(__dirname, dir)
}
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: './',// 设置别名
  resolve: {
    alias: {
      '@': resolve('src'),
    }
  },// 配置开发服务器
  server: {
    host: '0.0.0.0', // 开启本地局域网访问
    port: 8081, // 端口号
    https: false, // 是否启用 https
    proxy: {
      '/YSZG': {
        target: 'http://localhost:8080/YSZG/', // 代理目标
        changeOrigin: true, // 支持跨域
        rewrite: (path) => path.replace(/^\/YSZG/, '')
      }
    }
  }, // 自定义 SVG 图标处理
  build: {
    rollupOptions: {
      // 使用 svg-sprite-loader 替代 svg 的默认行为
      plugins: [
        {
          name: 'svg-sprite-loader',
          transform(src, id) {
            if (id.endsWith('.svg')) {
              return {
                code: `<svg-sprite-loader>${src}</svg-sprite-loader>`,
                map: null,
              }
            }
          }
        }
      ]
    }
  }
})
