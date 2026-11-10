// src/services/flujoPedido.js
import { calcularResumenPagos } from './pagos.js'

export const ESTADOS_ORDENADOS = [
  'Recibido',
  'En Revisión',
  'Diseño Pendiente',
  'Diseño Confirmado',
  'En Producción',
  'Listo para Entrega',
  'Entregado',
]

/**
 * Matriz de transiciones permitidas según el flujo estricto del negocio.
 * «Cancelado» solo se permite desde estados anteriores a «En Producción».
 */
const TRANSICIONES_VALIDAS = {
  Recibido: ['En Revisión', 'Cancelado'],
  'En Revisión': ['Diseño Pendiente', 'Cancelado'],
  'Diseño Pendiente': ['Diseño Confirmado', 'Diseño Pendiente', 'Cancelado'],
  'Diseño Confirmado': ['En Producción', 'Diseño Pendiente', 'Cancelado'],
  'En Producción': ['Listo para Entrega'],
  'Listo para Entrega': ['Entregado'],
  Entregado: [],
  Cancelado: [],
}

/**
 * Valida los permisos de rol para una transición específica.
 */
function verificarPermisoRol(rol, estadoActual, nuevoEstado) {
  if (!rol || rol === 'admin') return true // Admin tiene permisos sobre transiciones válidas

  switch (rol) {
    case 'cliente':
      // Cliente puede aprobar diseño, solicitar cambios o cancelar antes de producción
      if (nuevoEstado === 'Diseño Confirmado' && estadoActual === 'Diseño Pendiente') return true
      if (
        nuevoEstado === 'Diseño Pendiente' &&
        (estadoActual === 'Diseño Pendiente' ||
          estadoActual === 'En Revisión' ||
          estadoActual === 'Diseño Confirmado')
      )
        return true
      if (nuevoEstado === 'Cancelado') return true
      return false

    case 'disenador':
      // Diseñador gestiona las fases de revisión y propuesta gráfica
      if (nuevoEstado === 'En Revisión' && estadoActual === 'Recibido') return true
      if (
        nuevoEstado === 'Diseño Pendiente' &&
        (estadoActual === 'En Revisión' || estadoActual === 'Diseño Pendiente')
      )
        return true
      return false

    case 'produccion':
      // Producción toma pedidos confirmados a producción y los marca listos para entrega
      if (nuevoEstado === 'En Producción' && estadoActual === 'Diseño Confirmado') return true
      if (nuevoEstado === 'Listo para Entrega' && estadoActual === 'En Producción') return true
      return false

    case 'entregas':
      // Entregas solo puede marcar como Entregado pedidos que estén Listos para Entrega
      if (nuevoEstado === 'Entregado' && estadoActual === 'Listo para Entrega') return true
      return false

    default:
      return false
  }
}

/**
 * Actualiza la estructura visual del timeline de 7 pasos.
 */
function actualizarTimeline(timelineActual = [], nuevoEstado) {
  if (nuevoEstado === 'Cancelado') {
    // El timeline de 7 etapas se mantiene visualmente igual per requerimiento
    return timelineActual
  }

  const indexNuevo = ESTADOS_ORDENADOS.indexOf(nuevoEstado)
  if (indexNuevo === -1) return timelineActual

  const ahora = new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })

  return ESTADOS_ORDENADOS.map((stepName, idx) => {
    const pasoExistente = timelineActual.find(t => t.step === stepName) || {}

    if (idx < indexNuevo) {
      return {
        ...pasoExistente,
        step: stepName,
        completed: true,
        current: false,
        date:
          pasoExistente.date &&
          pasoExistente.date !== '-' &&
          !pasoExistente.date.includes('Esperando')
            ? pasoExistente.date
            : ahora,
      }
    } else if (idx === indexNuevo) {
      return {
        ...pasoExistente,
        step: stepName,
        completed: true,
        current: true,
        date: ahora,
      }
    } else {
      return {
        ...pasoExistente,
        step: stepName,
        completed: false,
        current: false,
        date: '-',
      }
    }
  })
}

/**
 * Función central y único punto para cambiar el estado de un pedido.
 *
 * @param {Object} pedido - Objeto del pedido actual
 * @param {string} nuevoEstado - Estado destino solicitado
 * @param {Object|string} usuario - Usuario que realiza la acción ({ nombre, role } o string de rol)
 * @param {string} [observacion=''] - Motivo u observación del cambio
 * @param {Array<Object>} [pagosDelPedido=[]] - Lista de pagos asociados al pedido para validar anticipo
 * @returns {{ ok: boolean, mensaje?: string, pedido?: Object, entradaHistorial?: Object }}
 */
export function cambiarEstado(pedido, nuevoEstado, usuario, observacion = '', pagosDelPedido = []) {
  if (!pedido) {
    return { ok: false, mensaje: 'Pedido no especificado o inválido.' }
  }

  const estadoActual = pedido.status
  const rol = typeof usuario === 'string' ? usuario : usuario?.role || 'cliente'
  const nombreUsuario =
    typeof usuario === 'string' ? usuario : usuario?.nombre || usuario?.email || rol

  // c) Bloquear cualquier modificación a un pedido Entregado, salvo el rol Admin (RN-07)
  if (estadoActual === 'Entregado' && rol !== 'admin') {
    return {
      ok: false,
      mensaje:
        'Acción bloqueada: Un pedido con estado "Entregado" no puede ser modificado salvo por el rol Administrador (RN-07).',
    }
  }

  // a) Verificar que la transición esté permitida
  const transicionesPermitidas = TRANSICIONES_VALIDAS[estadoActual] || []
  if (!transicionesPermitidas.includes(nuevoEstado)) {
    if (nuevoEstado === 'Cancelado') {
      return {
        ok: false,
        mensaje:
          'No se puede cancelar el pedido: la cancelación solo se permite en etapas anteriores a "En Producción".',
      }
    }
    return {
      ok: false,
      mensaje: `Transición inválida: No se permite cambiar de "${estadoActual}" a "${nuevoEstado}".`,
    }
  }

  // d) Verificar que el rol del usuario puede hacer ese cambio
  if (!verificarPermisoRol(rol, estadoActual, nuevoEstado)) {
    return {
      ok: false,
      mensaje: `Tu rol ("${rol}") no tiene permisos para cambiar el estado a "${nuevoEstado}".`,
    }
  }

  // b) Bloquear En Producción si el diseño no está aprobado (RN-01) o si lo pagado validado es menor al 50%
  if (nuevoEstado === 'En Producción') {
    // Verificar aprobación de diseño (RN-01)
    const disenoAprobado = estadoActual === 'Diseño Confirmado' || pedido.disenoConfirmado === true
    if (!disenoAprobado) {
      return {
        ok: false,
        mensaje:
          'Acción bloqueada (RN-01): El pedido no puede pasar a producción sin que el diseño esté formalmente aprobado por el cliente.',
      }
    }

    // Verificar anticipo validado >= 50%
    const resumenPagos = calcularResumenPagos(
      pedido.total,
      pagosDelPedido.length > 0 ? pagosDelPedido : pedido.pagos
    )
    if (!resumenPagos.cumpleAnticipo50) {
      return {
        ok: false,
        mensaje: `Acción bloqueada: Se requiere al menos el 50% de anticipo validado por Administración ($${resumenPagos.anticipoMinimoRequerido} MXN). Pagado validado actual: $${resumenPagos.pagadoValidado} MXN.`,
      }
    }
  }

  // e) Generar registro de historial
  const ahora = new Date()
  const entradaHistorial = {
    id: `HIST-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
    pedidoId: pedido.id,
    estadoAnterior: estadoActual,
    estadoNuevo: nuevoEstado,
    usuario: nombreUsuario,
    rol,
    fecha: ahora.toISOString(),
    fechaFormateada: ahora.toLocaleDateString('es-MX', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    }),
    observacion: observacion || `Cambio de estado a ${nuevoEstado}`,
  }

  const nuevoTimeline = actualizarTimeline(pedido.timeline, nuevoEstado)

  const pedidoActualizado = {
    ...pedido,
    status: nuevoEstado,
    timeline: nuevoTimeline,
    disenoConfirmado: nuevoEstado === 'Diseño Confirmado' ? true : pedido.disenoConfirmado,
    feedbackHistory: observacion
      ? [
          ...(pedido.feedbackHistory || []),
          `${nombreUsuario} (${entradaHistorial.fechaFormateada}): ${observacion}`,
        ]
      : pedido.feedbackHistory || [],
  }

  return {
    ok: true,
    pedido: pedidoActualizado,
    entradaHistorial,
  }
}
