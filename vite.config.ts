import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Custom plugin to suppress Vite warnings for dynamic imports in auto-generated Cmajor files
    {
      name: 'cmajor-vite-ignore',
      transform(code, id) {
        if (id.includes('cmaj-audio-worklet-helper.js') || 
            id.includes('cmaj-patch-view.js') || 
            id.includes('cmaj-patch-connection.js')) {
          return {
            code: code.replace(/import\s*\(/g, 'import(/* @vite-ignore */ '),
            map: null
          };
        }
      }
    }
  ],
  resolve: {
    alias: {
      '/cmaj_api': resolve(__dirname, './src/cmaj_api'),
      // Map the main JS file alias
      '@cmajor/patch': resolve(__dirname, './src/audio/dist/cmaj_Euclidean_Drum_Machine.js'),
    },
  },
})
