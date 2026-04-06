import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    // Simula o ambiente do browser (DOM)
    environment: 'jsdom',
    globals: true,

    // Arquivo de setup global (jest-dom matchers, mocks globais)
    setupFiles: ['./src/tests/setup.ts'],

    // Glob para encontrar todos os testes
    include: ['src/**/*.{test,spec}.{ts,tsx}'],

    // Coverage com provider nativo do Vitest (V8)
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/tests/**',
        'src/**/*.d.ts',
        'src/lib/types/**',
        'src/app/**', // Server Components são testados via E2E (Sprint 6)
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 70,
        statements: 80,
      },
    },
  },
  resolve: {
    // Replica o path alias @/* do tsconfig.json
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
