import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CustomizerModal from '../components/CustomizerModal'
import { INITIAL_PRODUCTS } from '../components/ProductCatalog'
import { CUELLOS_PLAYERA, PRODUCTOS_INICIALES } from '../services/datos.js'

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

  it('uses a base image for each shirt color and neckline in both product lists', async () => {
    const user = userEvent.setup()
    const catalogShirt = INITIAL_PRODUCTS.find(product => product.type === 'playera')
    const dataShirt = PRODUCTOS_INICIALES.find(product => product.type === 'playera')

    for (const product of [catalogShirt, dataShirt]) {
      expect(product.colors).toEqual(product.variantes.map(variant => variant.color))
      expect(
        product.variantes.every(variant =>
          CUELLOS_PLAYERA.every(neckline => Boolean(variant.imagenes[neckline]))
        )
      ).toBe(true)
    }

    render(<CustomizerModal product={catalogShirt} onClose={vi.fn()} onAddToCart={vi.fn()} />)
    expect(
      screen.getByLabelText(
        'Previsualización Playera Dry-Fit Sublimada Total, Blanco, Cuello Redondo'
      )
    ).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Color: Azul Marino' }))
    await user.click(screen.getByRole('button', { name: 'Tipo Polo' }))
    expect(
      screen.getByLabelText(
        'Previsualización Playera Dry-Fit Sublimada Total, Azul Marino, Tipo Polo'
      )
    ).toBeInTheDocument()
  })

  it('uses only photo-backed cup and thermos variants and displays their color names', async () => {
    const user = userEvent.setup()
    const catalogMagicMug = INITIAL_PRODUCTS.find(product => product.id === 'prod-taza-01')
    const catalogMug = INITIAL_PRODUCTS.find(product => product.id === 'prod-taza-02')
    const catalogThermos = INITIAL_PRODUCTS.find(product => product.id === 'prod-termo-01')
    const dataMagicMug = PRODUCTOS_INICIALES.find(product => product.id === 'prod-taza-01')
    const dataMug = PRODUCTOS_INICIALES.find(product => product.id === 'prod-taza-02')
    const dataThermos = PRODUCTOS_INICIALES.find(product => product.id === 'prod-termo-01')

    for (const product of [
      catalogMagicMug,
      catalogMug,
      catalogThermos,
      dataMagicMug,
      dataMug,
      dataThermos,
    ]) {
      expect(product.colors).toEqual(product.variantes.map(variant => variant.color))
      expect(product.variantes.every(variant => variant.image && variant.zona)).toBe(true)
    }
    expect(catalogThermos.colors).not.toContain('#0D1B2A')
    expect(catalogMagicMug.colors).toEqual(['#0D1B2A', '#000000'])
    expect(catalogMug.colors).toEqual(['#FFFFFF'])

    const { unmount: unmountClassic } = render(
      <CustomizerModal product={catalogMug} onClose={vi.fn()} onAddToCart={vi.fn()} />
    )
    expect(screen.getByText('Seleccionado: Blanco')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Color: Azul marino' })).not.toBeInTheDocument()

    unmountClassic()
    const { unmount: unmountMagic } = render(
      <CustomizerModal product={catalogMagicMug} onClose={vi.fn()} onAddToCart={vi.fn()} />
    )
    expect(screen.getByText('Seleccionado: Azul marino')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Color: Negro' }))
    expect(screen.getByText('Seleccionado: Negro')).toBeInTheDocument()

    unmountMagic()
    render(<CustomizerModal product={catalogThermos} onClose={vi.fn()} onAddToCart={vi.fn()} />)
    expect(screen.getByRole('button', { name: 'Texto horizontal' })).toHaveAttribute(
      'aria-pressed',
      'true'
    )
    expect(screen.queryByRole('button', { name: 'Color: Azul marino' })).not.toBeInTheDocument()
    expect(screen.getByText('Seleccionado: Blanco')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Texto vertical' }))
    expect(screen.getByRole('button', { name: 'Texto vertical' })).toHaveAttribute(
      'aria-pressed',
      'true'
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
