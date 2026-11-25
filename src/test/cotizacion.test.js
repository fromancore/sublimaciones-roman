import { describe, expect, it } from 'vitest'
import { cotizar } from '../services/cotizacion.js'

describe('cotizacion - Valores Límite y Clases de Equivalencia', () => {
  it('aplica 0% de descuento para 1 a 4 piezas (límite superior 4)', () => {
    expect(cotizar(100, 1)).toEqual({ subtotal: 100, descuento: 0, total: 100, porcentaje: 0 })
    expect(cotizar(100, 4)).toEqual({ subtotal: 400, descuento: 0, total: 400, porcentaje: 0 })
  })

  it('aplica 10% de descuento para 5 a 9 piezas (límites 5 y 9)', () => {
    expect(cotizar(100, 5)).toEqual({ subtotal: 500, descuento: 50, total: 450, porcentaje: 0.1 })
    expect(cotizar(100, 9)).toEqual({ subtotal: 900, descuento: 90, total: 810, porcentaje: 0.1 })
  })

  it('aplica 15% de descuento a partir de 10 piezas (límite 10)', () => {
    expect(cotizar(100, 10)).toEqual({
      subtotal: 1000,
      descuento: 150,
      total: 850,
      porcentaje: 0.15,
    })
  })

  it('corrige entradas inválidas (0 o negativas) a mínimo 1 pieza', () => {
    expect(cotizar(100, 0).total).toBe(100)
    expect(cotizar(100, -5).total).toBe(100)
  })
})
