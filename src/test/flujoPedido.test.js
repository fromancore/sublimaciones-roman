import { describe, expect, it } from 'vitest'
import { cambiarEstado } from '../services/flujoPedido.js'
import { registrarPago, validarPago } from '../services/pagos.js'

describe('flujoPedido y pagos - Tabla de Decisión y Máquina de Estados', () => {
  const pedidoBase = {
    id: 'ROM-2026-0001',
    status: 'Diseño Confirmado',
    disenoConfirmado: true,
    total: 1000,
    timeline: [],
    pagos: [],
  }

  it('bloquea pasar a "En Producción" si no hay anticipo validado >= 50%', () => {
    const res = cambiarEstado(pedidoBase, 'En Producción', { role: 'produccion' }, '', [])
    expect(res.ok).toBe(false)
    expect(res.mensaje).toContain('50% de anticipo validado')
  })

  it('bloquea pasar a "En Producción" si el diseño no está aprobado (RN-01)', () => {
    const sinDiseno = { ...pedidoBase, status: 'Diseño Pendiente', disenoConfirmado: false }
    const res = cambiarEstado(sinDiseno, 'En Producción', { role: 'admin' })
    expect(res.ok).toBe(false)
  })

  it('permite pasar a "En Producción" cuando diseño está confirmado Y anticipo >= 50% está validado', () => {
    const pago = registrarPago({ pedidoId: 'ROM-2026-0001', monto: 500, metodo: 'transfer' })
    const { pago: pagoValidado } = validarPago(pago, 'validar', { role: 'admin', nombre: 'Luisa' })

    const res = cambiarEstado(
      pedidoBase,
      'En Producción',
      { role: 'produccion', nombre: 'Taller' },
      'Iniciando sublimado',
      [pagoValidado]
    )

    expect(res.ok).toBe(true)
    expect(res.pedido.status).toBe('En Producción')
    expect(res.entradaHistorial.estadoNuevo).toBe('En Producción')
  })

  it('bloquea cancelar un pedido que ya está "En Producción"', () => {
    const enProd = { ...pedidoBase, status: 'En Producción' }
    const res = cambiarEstado(enProd, 'Cancelado', { role: 'cliente' })
    expect(res.ok).toBe(false)
    expect(res.mensaje).toContain('No se puede cancelar')
  })

  it('bloquea modificar un pedido "Entregado" a roles que no sean admin (RN-07)', () => {
    const entregado = { ...pedidoBase, status: 'Entregado' }
    const res = cambiarEstado(entregado, 'Recibido', { role: 'entregas' })
    expect(res.ok).toBe(false)
    expect(res.mensaje).toContain('RN-07')
  })
})
