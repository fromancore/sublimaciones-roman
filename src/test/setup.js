// ============================================================
// Setup global de pruebas con Vitest + Testing Library
// Se ejecuta antes de cada archivo de prueba
// ============================================================
import '@testing-library/jest-dom'
import { vi } from 'vitest'

// ── Mock de APIs del navegador no disponibles en jsdom ──────
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock de localStorage
const localStorageMock = (() => {
  let store = {}
  return {
    getItem: key => store[key] ?? null,
    setItem: (key, value) => {
      store[key] = String(value)
    },
    removeItem: key => {
      delete store[key]
    },
    clear: () => {
      store = {}
    },
  }
})()
Object.defineProperty(window, 'localStorage', { value: localStorageMock })

// Mock de sessionStorage
Object.defineProperty(window, 'sessionStorage', { value: localStorageMock })

// Mock de IntersectionObserver (usado por animaciones/lazy load)
global.IntersectionObserver = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Mock de ResizeObserver
global.ResizeObserver = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Suprimir errores de consola esperados en tests
beforeEach(() => {
  vi.spyOn(console, 'error').mockImplementation(() => {})
})
afterEach(() => {
  vi.restoreAllMocks()
})
