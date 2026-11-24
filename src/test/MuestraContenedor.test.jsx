// ============================================================
// Prueba Unitaria / Smoke — Componente: MuestraContenedor
// Verifica que el contenedor de la muestra renderiza la imagen oficial,
// ajusta proporciones y no contiene el gráfico genérico anterior.
// ============================================================
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'
import MuestraContenedor from '../components/MuestraContenedor'

describe('MuestraContenedor', () => {
  it('debería renderizar el contenedor de muestra sin errores', () => {
    const { container } = render(<MuestraContenedor />)
    expect(container.firstChild).not.toBeNull()
  })

  it('debería mostrar el título "Muestra de Sublimación"', () => {
    render(<MuestraContenedor />)
    expect(screen.getByText(/Muestra de Sublimación/i)).toBeInTheDocument()
  })

  it('debería renderizar la imagen oficial con texto alt correspondiente y clase object-contain para mantener escala', () => {
    render(<MuestraContenedor />)
    const img = screen.getByRole('img')
    expect(img).toBeInTheDocument()
    expect(img.getAttribute('alt')).toMatch(/Taza blanca con logo de guerrero romano/i)
    expect(img.className).toContain('object-contain')
  })

  it('no debería contener el gráfico genérico o textos previos ("Tu Arte Aquí")', () => {
    render(<MuestraContenedor />)
    expect(screen.queryByText(/Tu Arte Aquí/i)).toBeNull()
  })
})
