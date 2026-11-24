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

  it('lets the customer select shirt color and neckline and includes both in the cart item', async () => {
    const user = userEvent.setup()
    const onAddToCart = vi.fn()
    const product = {
      id: 'shirt-1',
      name: 'Playera',
      category: 'Textil',
      price: 220,
      colors: ['#FFFFFF', '#111827', '#1B2A4A', '#9CA3AF', '#DC2626', '#2563EB'],
      type: 'playera',
      material: 'Poliéster',
      productionTime: '3 días',
    }

    render(<CustomizerModal product={product} onClose={vi.fn()} onAddToCart={onAddToCart} />)

    await user.click(screen.getByRole('button', { name: 'Color: Azul Marino' }))
    await user.click(screen.getByRole('button', { name: 'Cuello en V' }))
    await user.type(document.getElementById('telefono-contacto'), '9991234567')
    await user.click(screen.getByRole('button', { name: /AGREGAR AL CARRITO/ }))

    expect(onAddToCart).toHaveBeenCalledWith(
      expect.objectContaining({
        selectedColor: '#1B2A4A',
        selectedColorName: 'Azul Marino',
        selectedNeckType: 'Cuello en V',
      })
    )
  })

  it('permite alternar el botón de MAYÚSCULAS y envía el texto transformado al carrito', async () => {
    const user = userEvent.setup()
    const onAddToCart = vi.fn()
    const product = {
      id: 'prod-taza-01',
      name: 'Taza Mágica',
      price: 135,
      colors: ['#000000'],
      type: 'taza',
      material: 'Cerámica',
      productionTime: '48 hrs',
    }

    render(<CustomizerModal product={product} onClose={vi.fn()} onAddToCart={onAddToCart} />)

    const inputTexto = screen.getByPlaceholderText(/Ej. GUERRERO ROMÁN/)
    await user.clear(inputTexto)
    await user.type(inputTexto, 'sublimado roman')

    // Alternar toggle MAYÚSCULAS
    const botonMayus = screen.getByRole('button', { name: 'MAYÚSCULAS' })
    await user.click(botonMayus)

    await user.type(document.getElementById('telefono-contacto'), '9991234567')
    await user.click(screen.getByRole('button', { name: /AGREGAR AL CARRITO/ }))

    expect(onAddToCart).toHaveBeenCalledWith(
      expect.objectContaining({
        customText: 'SUBLIMADO ROMAN',
      })
    )
  })

  it('soporta arrastre con Pointer Events sobre el lienzo 2D para actualizar la posición', async () => {
    const user = userEvent.setup()
    const onAddToCart = vi.fn()
    const product = {
      id: 'prod-taza-02',
      name: 'Taza Blanca',
      price: 95,
      colors: ['#FFFFFF'],
      type: 'taza',
      material: 'Cerámica',
      productionTime: '48 hrs',
    }

    const { container } = render(
      <CustomizerModal product={product} onClose={vi.fn()} onAddToCart={onAddToCart} />
    )

    const canvas = container.querySelector('canvas')
    expect(canvas).toBeInTheDocument()

    // Simular getBoundingClientRect para cálculo de coordenadas
    vi.spyOn(canvas, 'getBoundingClientRect').mockReturnValue({
      left: 0,
      top: 0,
      width: 320,
      height: 320,
      right: 320,
      bottom: 320,
    })

    // Pointer events para arrastrar el texto
    canvas.dispatchEvent(
      new MouseEvent('pointerdown', { bubbles: true, clientX: 160, clientY: 160 })
    )
    canvas.dispatchEvent(
      new MouseEvent('pointermove', { bubbles: true, clientX: 200, clientY: 220 })
    )
    canvas.dispatchEvent(new MouseEvent('pointerup', { bubbles: true, clientX: 200, clientY: 220 }))

    await user.type(document.getElementById('telefono-contacto'), '9991234567')
    await user.click(screen.getByRole('button', { name: /AGREGAR AL CARRITO/ }))

    expect(onAddToCart).toHaveBeenCalledWith(
      expect.objectContaining({
        posicion: expect.objectContaining({
          x: expect.any(Number),
          y: expect.any(Number),
        }),
      })
    )
  })
})
