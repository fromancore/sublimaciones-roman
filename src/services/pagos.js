// src/services/pagos.js

/**
 * Registra un pago con estado inicial «Pendiente de validación».
 * @param {Object} params
 * @param {string} params.pedidoId
 * @param {number} params.monto
 * @param {string} params.metodo
 * @param {string} [params.comprobanteNombre]
 * @param {string} [params.comprobanteUrl]
 * @param {Object} [params.usuario]
 * @returns {Object} Nuevo registro de pago
 */
export function registrarPago({ pedidoId, monto, metodo, comprobanteNombre, comprobanteUrl, usuario }) {
  const montoNum = Number(monto) || 0;
  const ahora = new Date();
  
  return {
    id: `PAG-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
    pedidoId,
    monto: montoNum,
    metodo: metodo || 'transfer',
    comprobanteNombre: comprobanteNombre || 'comprobante_deposito.jpg',
    comprobanteUrl: comprobanteUrl || null,
    estado: 'Pendiente de validación',
    fecha: ahora.toISOString(),
    fechaFormateada: ahora.toLocaleDateString('es-MX', { 
      day: '2-digit', 
      month: 'short', 
      hour: '2-digit', 
      minute: '2-digit' 
    }),
    registradoPor: usuario?.nombre || usuario?.email || 'Cliente',
    validadoPor: null,
    fechaValidacion: null,
    motivoRechazo: null
  };
}

/**
 * Valida o rechaza un pago. Exclusivo para rol 'admin'.
 * @param {Object} pago
 * @param {'validar' | 'rechazar'} accion
 * @param {Object} usuario
 * @param {string} [motivo]
 * @returns {{ ok: boolean, pago?: Object, mensaje?: string }}
 */
export function validarPago(pago, accion, usuario, motivo = '') {
  if (!pago) {
    return { ok: false, mensaje: 'Pago no encontrado.' };
  }

  const rol = typeof usuario === 'string' ? usuario : usuario?.role;
  if (rol !== 'admin') {
    return { ok: false, mensaje: 'Acción denegada: Solo el Administrador puede validar o rechazar pagos.' };
  }

  const nuevoEstado = accion === 'validar' ? 'Validado' : 'Rechazado';
  const pagoActualizado = {
    ...pago,
    estado: nuevoEstado,
    validadoPor: usuario?.nombre || 'Administrador',
    fechaValidacion: new Date().toISOString(),
    motivoRechazo: accion === 'rechazar' ? (motivo || 'Comprobante no legible o monto incorrecto') : null
  };

  return { ok: true, pago: pagoActualizado };
}

/**
 * Calcula el total del pedido, el monto pagado validado, el pendiente de validación y el saldo restante.
 * @param {number} totalPedido 
 * @param {Array<Object>} pagosDelPedido 
 * @returns {{ total: number, pagadoValidado: number, pagadoPendiente: number, saldoPendiente: number, anticipoMinimoRequerido: number, cumpleAnticipo50: boolean }}
 */
export function calcularResumenPagos(totalPedido, pagosDelPedido = []) {
  const total = Math.max(0, Number(totalPedido) || 0);
  
  const pagadoValidado = (pagosDelPedido || [])
    .filter(p => p.estado === 'Validado')
    .reduce((acc, p) => acc + (Number(p.monto) || 0), 0);

  const pagadoPendiente = (pagosDelPedido || [])
    .filter(p => p.estado === 'Pendiente' || p.estado === 'Pendiente de validación')
    .reduce((acc, p) => acc + (Number(p.monto) || 0), 0);

  const saldoPendiente = Math.max(0, total - pagadoValidado);
  const anticipoMinimoRequerido = Math.round(total * 0.5);
  const cumpleAnticipo50 = pagadoValidado >= anticipoMinimoRequerido;

  return {
    total,
    pagadoValidado,
    pagadoPendiente,
    saldoPendiente,
    anticipoMinimoRequerido,
    cumpleAnticipo50
  };
}
