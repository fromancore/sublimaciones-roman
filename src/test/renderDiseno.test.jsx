import { describe, expect, it, vi } from 'vitest'
import { zonaARect, puntoAZonaLocal, limitarAZona, renderDiseno } from '../services/renderDiseno.js'

describe('renderDiseno - Funciones Puras', () => {
  describe('zonaARect', () => {
    it('calcula las dimensiones, centro y ángulo en radianes para una zona estándar sin rotación', () => {
      const zona = { x: 0.342, y: 0.174, w: 0.329, h: 0.664, rotacion: 0 }
      const W = 1000
      const H = 1000

      const rect = zonaARect(zona, W, H)

      expect(rect.pw).toBeCloseTo(329, 1)
      expect(rect.ph).toBeCloseTo(664, 1)
      expect(rect.cx).toBeCloseTo((0.342 + 0.329 / 2) * 1000, 1)
      expect(rect.cy).toBeCloseTo((0.174 + 0.664 / 2) * 1000, 1)
      expect(rect.angulo).toBe(0)
    })

    it('soporta zonas con x negativo, w > 1 y rotación de 90° (termo) sin limitarlas a 0-1', () => {
      // Calibración real del termo blanco: { x: -0.33, y: 0.456, w: 1.5, h: 0.2, rotacion: 90 }
      const zonaTermo = { x: -0.33, y: 0.456, w: 1.5, h: 0.2, rotacion: 90 }
      const W = 400
      const H = 800

      const rect = zonaARect(zonaTermo, W, H)

      // w=1.5 * 400 = 600, h=0.2 * 800 = 160
      expect(rect.pw).toBe(600)
      expect(rect.ph).toBe(160)
      // cx = (-0.33 + 0.75) * 400 = 0.42 * 400 = 168
      expect(rect.cx).toBeCloseTo(168, 1)
      // cy = (0.456 + 0.1) * 800 = 0.556 * 800 = 444.8
      expect(rect.cy).toBeCloseTo(444.8, 1)
      // 90° = PI / 2 radianes
      expect(rect.angulo).toBeCloseTo(Math.PI / 2, 5)
    })

    it('devuelve valores por defecto razonables si la zona es nula', () => {
      const rect = zonaARect(null, 300, 300)
      expect(rect.cx).toBe(150)
      expect(rect.cy).toBe(150)
      expect(rect.pw).toBe(300)
      expect(rect.ph).toBe(300)
      expect(rect.angulo).toBe(0)
    })
  })

  describe('puntoAZonaLocal', () => {
    it('ubica el centro del rectángulo exactamente en (0.5, 0.5)', () => {
      const rect = { cx: 200, cy: 300, pw: 100, ph: 200, angulo: 0 }
      const resultado = puntoAZonaLocal({ x: 200, y: 300 }, rect)

      expect(resultado.x).toBeCloseTo(0.5, 5)
      expect(resultado.y).toBeCloseTo(0.5, 5)
    })

    it('ubica la esquina superior izquierda en (0, 0)', () => {
      const rect = { cx: 200, cy: 300, pw: 100, ph: 200, angulo: 0 }
      const resultado = puntoAZonaLocal({ x: 150, y: 200 }, rect)

      expect(resultado.x).toBeCloseTo(0, 5)
      expect(resultado.y).toBeCloseTo(0, 5)
    })

    it('invierte correctamente la rotación de 90° de una zona como la del termo', () => {
      // Zona rotada 90° horario (como termo)
      const rect = {
        cx: 168,
        cy: 444.8,
        pw: 600,
        ph: 160,
        angulo: Math.PI / 2, // 90°
      }

      // En rotación de 90° horaria:
      // Moverse 100px HACIA ABAJO en la pantalla (dy = +100)
      // corresponde a avanzar hacia adelante en el eje X local (rx = +100)
      const punto = { x: 168, y: 544.8 }
      const local = puntoAZonaLocal(punto, rect)

      // u = (100 / 600) + 0.5 = 0.1666... + 0.5 = 0.6666...
      expect(local.x).toBeCloseTo(0.6667, 3)
      // v debe seguir centrado en 0.5
      expect(local.y).toBeCloseTo(0.5, 3)
    })
  })

  describe('limitarAZona', () => {
    it('mantiene la posición dentro del rango [0, 1] si no hay tamaño de texto', () => {
      const rect = { cx: 100, cy: 100, pw: 200, ph: 200, angulo: 0 }

      const posFuera = { x: -0.5, y: 1.8 }
      const posLimitada = limitarAZona(posFuera, rect)

      expect(posLimitada.x).toBe(0)
      expect(posLimitada.y).toBe(1)
    })

    it('restringe con márgenes proporcionales al tamaño del texto', () => {
      const rect = { cx: 100, cy: 100, pw: 200, ph: 200, angulo: 0 }
      // Texto con ancho 20% y alto 10%
      const tamanoTexto = { width: 0.2, height: 0.1 }

      // El margen mínimo en X es 0.1 (hw), el máximo es 0.9 (1 - hw)
      const resultadoIzquierda = limitarAZona({ x: 0.02, y: 0.5 }, rect, tamanoTexto)
      expect(resultadoIzquierda.x).toBeCloseTo(0.1, 4)

      const resultadoDerecha = limitarAZona({ x: 0.98, y: 0.5 }, rect, tamanoTexto)
      expect(resultadoDerecha.x).toBeCloseTo(0.9, 4)
    })

    it('centra el texto en 0.5 si este es más ancho o más alto que la zona', () => {
      const rect = { cx: 100, cy: 100, pw: 200, ph: 200, angulo: 0 }
      const tamanoGigante = { width: 1.2, height: 1.5 }

      const resultado = limitarAZona({ x: 0.2, y: 0.8 }, rect, tamanoGigante)
      expect(resultado.x).toBe(0.5)
      expect(resultado.y).toBe(0.5)
    })
  })
})

describe('renderDiseno - Renderizado Canvas', () => {
  it('ejecuta el ciclo de renderizado aplicando recorte a la zona, dibujo de texto y modo debug', async () => {
    const canvas = {
      width: 400,
      height: 400,
    }

    const ctx = {
      canvas,
      clearRect: vi.fn(),
      drawImage: vi.fn(),
      save: vi.fn(),
      restore: vi.fn(),
      translate: vi.fn(),
      rotate: vi.fn(),
      beginPath: vi.fn(),
      rect: vi.fn(),
      clip: vi.fn(),
      fillText: vi.fn(),
      strokeRect: vi.fn(),
      setLineDash: vi.fn(),
      measureText: vi.fn().mockReturnValue({ width: 80 }),
    }

    const zona = { x: 0.25, y: 0.25, w: 0.5, h: 0.5, rotacion: 0 }

    await renderDiseno(ctx, {
      productoImg: null,
      zona,
      texto: 'ROMÁN',
      fuente: 'Inter',
      color: '#D4AF37',
      tamano: 0.15,
      posicion: { x: 0.5, y: 0.5 },
      mayusculas: true,
      efecto: 'sublimado',
      debug: true,
    })

    expect(ctx.clearRect).toHaveBeenCalledWith(0, 0, 400, 400)
    expect(ctx.clip).toHaveBeenCalled()
    expect(ctx.fillText).toHaveBeenCalled()
    expect(ctx.strokeRect).toHaveBeenCalled() // Por modo debug: true
  })
})
