import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const originalConsoleLog = console.log;
console.log = (...args) => {
  if (typeof args[0] === 'string' && 
    (args[0].includes('[vite] connecting') || 
     args[0].includes('[vite] connected'))) {
    return;
  }
  originalConsoleLog.apply(console, args);
};

export default defineConfig(() => {
  return {
    plugins: [react()],
    server: {
      hmr: {
        overlay: false
      }
    }
  }
})
