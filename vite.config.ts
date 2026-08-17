import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/painel-precos-perfumes/',
  plugins: [react()],
  test: { environment: 'jsdom' },
})
