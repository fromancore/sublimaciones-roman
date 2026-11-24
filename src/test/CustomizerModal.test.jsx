import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CustomizerModal from '../components/CustomizerModal'

describe('CustomizerModal text customization', () => {
  let canvasContext

  beforeEach(() => {
    canvasContext = {
      clearRect: vi.fn(),
      beginPath: vi.fn(),
      roundRect: vi.fn(),
      fill: vi.fn(),
      stroke: vi.fn(),
      fillRect: vi.fn(),
      fillText: vi.fn(),
      drawImage: vi.fn(),
    }
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(canvasContext)
  })

  it('updates the live preview and preserves the selected font and text color in the cart item', async () => {
    const user = userEvent.setup()
    const onAddToCart = vi.fn()
    const product = {
      id: 'mug-1',
      name: 'Taza',
      category: 'Tazas',
      price: 100,
      colors: ['#FFFFFF'],
      type: 'taza',
      material: 'Cerámica',
      productionTime: '3 días',
    }

    render(<CustomizerModal product={product} onClose={vi.fn()} onAddToCart={onAddToCart} />)

    await user.click(screen.getByRole('button', { name: 'Color de texto: Azul rey (#2563EB)' }))
    expect(canvasContext.fillStyle).toBe('#2563EB')

    const fontSelector = screen.getByLabelText('Tipografía:')
    const displayOption = screen.getByRole('option', {
      name: 'Bebas Neue — Display / impacto',
    })

    expect(displayOption).toHaveStyle({ fontFamily: '"Bebas Neue", sans-serif' })
    await user.selectOptions(fontSelector, 'Bebas Neue')
    expect(canvasContext.font).toContain('"Bebas Neue"')
    expect(canvasContext.fillStyle).toBe('#2563EB')

    await user.type(document.getElementById('telefono-contacto'), '9991234567')
    await user.click(screen.getByRole('button', { name: /AGREGAR AL CARRITO/ }))

    expect(onAddToCart).toHaveBeenCalledWith(
      expect.objectContaining({ fontFamily: 'Bebas Neue', textColor: '#2563EB' })
    )
  })
})
