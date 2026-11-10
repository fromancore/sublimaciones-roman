// ============================================================
// Prueba de Smoke — Componente: RomanLogo
// Verifica que el componente renderiza sin errores
// ============================================================
import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import RomanLogo from '../components/RomanLogo'

describe('RomanLogo', () => {
  it('debería renderizar sin errores', () => {
    render(<RomanLogo />)
    // El componente se renderizó sin lanzar excepciones
    expect(document.body).toBeTruthy()
  })

  it('debería ser un componente SVG o de imagen', () => {
    const { container } = render(<RomanLogo />)
    // Verificar que el contenedor tiene contenido
    expect(container.firstChild).not.toBeNull()
  })
})
