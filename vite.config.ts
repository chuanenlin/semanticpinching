import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api/replicate': {
          target: 'https://api.replicate.com/v1',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/replicate/, ''),
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              proxyReq.setHeader('Authorization', `Token ${env.VITE_REPLICATE_API_TOKEN}`)
            })
          }
        }
      }
    }
  }
})
