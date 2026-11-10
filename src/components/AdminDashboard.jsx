import React, { useState } from 'react'
import {
  Shield,
  Package,
  Upload,
  CheckCircle2,
  Clock,
  Plus,
  Columns,
  Sparkles,
  AlertTriangle,
  Check,
  X,
  DollarSign,
  Percent,
  Trash2,
  Edit3,
  FileText,
  AlertCircle,
} from 'lucide-react'
import { obtenerReglasDescuento, actualizarReglasDescuento } from '../services/cotizacion.js'
import { validarPago, calcularResumenPagos } from '../services/pagos.js'
import { cambiarEstado } from '../services/flujoPedido.js'

export default function AdminDashboard({
  currentRole,
  setCurrentRole,
  orders = [],
  setOrders,
  products = [],
  setProducts,
  pagos = [],
  setPagos,
  incidencias = [],
  setIncidencias,
  currentUser = null,
}) {
  // Tab states for Admin view
  const [activeTab, setActiveTab] = useState('orders') // 'orders', 'pagos', 'descuentos', 'catalog'

  // Designer proposal state
  const [selectedOrderForProposal, setSelectedOrderForProposal] = useState(null)
  const [newProposalUrl, setNewProposalUrl] = useState('')
  const [newProposalVersion, setNewProposalVersion] = useState(1)
  const [proposalNotes, setProposalNotes] = useState('')

  // Catalog state
  const [showAddProductModal, setShowAddProductModal] = useState(false)
  const [newProdName, setNewProdName] = useState('')
  const [newProdCategory, setNewProdCategory] = useState('Tazas y Vasos')
  const [newProdPrice, setNewProdPrice] = useState(150)
  const [newProdTime, setNewProdTime] = useState('48 - 72 hrs')

  // Discount rules state (editable array)
  const [discountRules, setDiscountRules] = useState(obtenerReglasDescuento())
  const [rulesSuccessMsg, setRulesSuccessMsg] = useState('')
  const [newMinPiezas, setNewMinPiezas] = useState('')
  const [newPorcentaje, setNewPorcentaje] = useState('')

  // Modals for confirmation
  const [orderToCancel, setOrderToCancel] = useState(null)
  const [cancelReason, setCancelReason] = useState('')
  const [orderToDeliver, setOrderToDeliver] = useState(null)

  // Quality incidence state for Production
  const [selectedOrderForIncidence, setSelectedOrderForIncidence] = useState(null)
  const [incidenceType, setIncidenceType] = useState('Defecto de Impresión')
  const [incidenceDesc, setIncidenceDesc] = useState('')
  const [incidenceSeverity, setIncidenceSeverity] = useState('Media')

  // Active user representation
  const activeUser = {
    role: currentRole,
    nombre: currentUser?.nombre || `Usuario (${currentRole})`,
  }

  // Helper to determine if an order has at least 50% validated deposit
  const hasValid50PercentDeposit = order => {
    const orderPayments = (pagos || []).filter(p => p.pedidoId === order.id)
    if (orderPayments.length > 0) {
      const summary = calcularResumenPagos(order.total, orderPayments)
      return summary.cumpleAnticipo50
    }
    // Fallback using order.depositPaid
    return (order.depositPaid || 0) >= order.total * 0.5
  }

  // Filter orders according to active operational role
  const getRoleOrders = () => {
    if (currentRole === 'produccion') {
      // "Vista Producción: muestra solo pedidos con diseño confirmado Y anticipo validado de al menos 50%"
      return orders.filter(
        o =>
          (o.status === 'Diseño Confirmado' || o.status === 'En Producción') &&
          hasValid50PercentDeposit(o)
      )
    }
    if (currentRole === 'entregas') {
      return orders.filter(o => o.status === 'Listo para Entrega' || o.status === 'Entregado')
    }
    if (currentRole === 'disenador') {
      return orders.filter(
        o =>
          o.status === 'Recibido' ||
          o.status === 'En Revisión' ||
          o.status === 'Diseño Pendiente' ||
          o.status === 'Diseño Confirmado'
      )
    }
    return orders
  }

  const roleFilteredOrders = getRoleOrders()

  // Metrics calculation for Admin summary
  const totalSales = orders.reduce(
    (sum, o) => sum + (o.status !== 'Cancelado' ? Number(o.total) || 0 : 0),
    0
  )
  const statusCounts = {
    Recibido: orders.filter(o => o.status === 'Recibido').length,
    'En Revisión': orders.filter(o => o.status === 'En Revisión').length,
    'Diseño Pendiente': orders.filter(o => o.status === 'Diseño Pendiente').length,
    'Diseño Confirmado': orders.filter(o => o.status === 'Diseño Confirmado').length,
    'En Producción': orders.filter(o => o.status === 'En Producción').length,
    'Listo para Entrega': orders.filter(o => o.status === 'Listo para Entrega').length,
    Entregado: orders.filter(o => o.status === 'Entregado').length,
    Cancelado: orders.filter(o => o.status === 'Cancelado').length,
  }

  // Payments pending validation
  const pendingPayments = (pagos || []).filter(
    p => p.estado === 'Pendiente' || p.estado === 'Pendiente de validación'
  )

  // --- Handlers: Payments ---
  const handleValidatePayment = (pagoId, accion, motivo = '') => {
    const targetPago = (pagos || []).find(p => p.id === pagoId)
    if (!targetPago) return

    const result = validarPago(
      targetPago,
      accion,
      { role: 'admin', nombre: 'Administrador General' },
      motivo
    )
    if (!result.ok) {
      alert(result.mensaje)
      return
    }

    // Update pagos state
    const updatedPagos = (pagos || []).map(p => (p.id === pagoId ? result.pago : p))
    if (setPagos) setPagos(updatedPagos)

    // If validated, update the order's validated deposit and remaining balance
    if (accion === 'validar') {
      const orderPayments = updatedPagos.filter(p => p.pedidoId === targetPago.pedidoId)
      const targetOrder = orders.find(o => o.id === targetPago.pedidoId)
      if (targetOrder) {
        const summary = calcularResumenPagos(targetOrder.total, orderPayments)
        const updatedOrders = orders.map(o => {
          if (o.id === targetPago.pedidoId) {
            return {
              ...o,
              depositPaid: summary.pagadoValidado,
              remainingBalance: summary.saldoPendiente,
            }
          }
          return o
        })
        setOrders(updatedOrders)
      }
    }
  }

  // --- Handlers: Discount Rules ---
  const handleSaveDiscountRules = rulesToSave => {
    const updated = actualizarReglasDescuento(rulesToSave)
    setDiscountRules(updated)
    setRulesSuccessMsg('¡Reglas de descuento actualizadas exitosamente!')
    setTimeout(() => setRulesSuccessMsg(''), 3000)
  }

  const handleAddDiscountRule = e => {
    e.preventDefault()
    if (!newMinPiezas || !newPorcentaje) return
    const newRule = {
      minPiezas: parseInt(newMinPiezas, 10),
      porcentaje: parseFloat(newPorcentaje) / 100,
    }
    const newRulesList = [...discountRules, newRule]
    handleSaveDiscountRules(newRulesList)
    setNewMinPiezas('')
    setNewPorcentaje('')
  }

  const handleRemoveDiscountRule = index => {
    const newRulesList = discountRules.filter((_, idx) => idx !== index)
    handleSaveDiscountRules(newRulesList)
  }

  // --- Handlers: Designer Proposals ---
  const handleOpenProposalModal = order => {
    setSelectedOrderForProposal(order)
    setNewProposalUrl(order.designerProposalUrl || '')
    setNewProposalVersion((order.disenoVersion || 1) + (order.designerProposalUrl ? 1 : 0))
    setProposalNotes('')
  }

  const handleUploadProposalSubmit = e => {
    e.preventDefault()
    if (!selectedOrderForProposal || !newProposalUrl.trim()) return

    const result = cambiarEstado(
      selectedOrderForProposal,
      'Diseño Pendiente',
      activeUser,
      `Propuesta visual versión ${newProposalVersion} cargada: ${proposalNotes || 'Lista para revisión'}`
    )

    const updated = orders.map(o => {
      if (o.id === selectedOrderForProposal.id) {
        return {
          ...o,
          status: 'Diseño Pendiente',
          disenoVersion: newProposalVersion,
          designerProposalUrl: newProposalUrl,
          timeline: (result.pedido?.timeline || o.timeline).map(t => {
            if (t.step === 'Diseño Pendiente') {
              return {
                ...t,
                completed: true,
                current: true,
                date: `V${newProposalVersion} cargada`,
              }
            }
            if (t.step === 'Diseño Confirmado') {
              return { ...t, completed: false, current: false }
            }
            return t
          }),
          feedbackHistory: [
            ...(o.feedbackHistory || []),
            `Diseñador cargó propuesta V${newProposalVersion} (${new Date().toLocaleDateString()}): ${proposalNotes || 'Sin notas adicionales'}`,
          ],
        }
      }
      return o
    })

    setOrders(updated)
    setSelectedOrderForProposal(null)
    setNewProposalUrl('')
  }

  // --- Handlers: Production Actions ---
  const handleStartProduction = order => {
    const orderPayments = (pagos || []).filter(p => p.pedidoId === order.id)
    const result = cambiarEstado(
      order,
      'En Producción',
      activeUser,
      'Pase a taller de producción',
      orderPayments
    )
    if (!result.ok) {
      alert(result.mensaje)
      return
    }

    const updated = orders.map(o => {
      if (o.id === order.id) {
        return {
          ...o,
          status: 'En Producción',
          timeline: o.timeline.map(t => {
            if (t.step === 'En Producción')
              return {
                ...t,
                completed: true,
                current: true,
                date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              }
            if (t.step === 'Diseño Confirmado') return { ...t, current: false }
            return t
          }),
        }
      }
      return o
    })
    setOrders(updated)
  }

  const handleMarkReadyForDelivery = order => {
    const result = cambiarEstado(
      order,
      'Listo para Entrega',
      activeUser,
      'Producto finalizado e inspeccionado'
    )
    if (!result.ok) {
      alert(result.mensaje)
      return
    }

    const updated = orders.map(o => {
      if (o.id === order.id) {
        return {
          ...o,
          status: 'Listo para Entrega',
          timeline: o.timeline.map(t => {
            if (t.step === 'Listo para Entrega')
              return {
                ...t,
                completed: true,
                current: true,
                date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              }
            if (t.step === 'En Producción') return { ...t, current: false }
            return t
          }),
        }
      }
      return o
    })
    setOrders(updated)
  }

  // --- Handlers: Quality Incidences ---
  const handleAddIncidenceSubmit = e => {
    e.preventDefault()
    if (!selectedOrderForIncidence || !incidenceDesc.trim()) return

    const newIncidence = {
      id: `INC-${Date.now()}`,
      pedidoId: selectedOrderForIncidence.id,
      tipo: incidenceType,
      descripcion: incidenceDesc.trim(),
      severidad: incidenceSeverity,
      fecha: new Date().toISOString(),
      fechaFormateada: new Date().toLocaleString('es-MX'),
      registradaPor: activeUser.nombre,
    }

    if (setIncidencias) {
      setIncidencias(prev => [newIncidence, ...(prev || [])])
    }

    // Append to order feedback history
    const updated = orders.map(o => {
      if (o.id === selectedOrderForIncidence.id) {
        return {
          ...o,
          feedbackHistory: [
            ...(o.feedbackHistory || []),
            `⚠️ Incidencia de calidad registrada [${incidenceSeverity}]: ${incidenceType} - ${incidenceDesc.trim()}`,
          ],
        }
      }
      return o
    })
    setOrders(updated)

    setSelectedOrderForIncidence(null)
    setIncidenceDesc('')
  }

  // --- Handlers: Delivery Confirmation ---
  const handleExecuteDeliverOrder = () => {
    if (!orderToDeliver) return
    const result = cambiarEstado(
      orderToDeliver,
      'Entregado',
      activeUser,
      'Entregado formalmente al cliente'
    )
    if (!result.ok) {
      alert(result.mensaje)
      setOrderToDeliver(null)
      return
    }

    const updated = orders.map(o => {
      if (o.id === orderToDeliver.id) {
        return {
          ...o,
          status: 'Entregado',
          timeline: o.timeline.map(t => {
            if (t.step === 'Entregado')
              return { ...t, completed: true, current: true, date: new Date().toLocaleDateString() }
            if (t.step === 'Listo para Entrega') return { ...t, current: false }
            return t
          }),
          feedbackHistory: [
            ...(o.feedbackHistory || []),
            `Pedido entregado al cliente (${new Date().toLocaleDateString()})`,
          ],
        }
      }
      return o
    })
    setOrders(updated)
    setOrderToDeliver(null)
  }

  // --- Handlers: Order Cancellation with Confirmation ---
  const handleExecuteCancelOrder = () => {
    if (!orderToCancel) return
    const result = cambiarEstado(
      orderToCancel,
      'Cancelado',
      activeUser,
      cancelReason.trim() || 'Cancelación solicitada por el usuario'
    )

    if (!result.ok) {
      alert(result.mensaje)
      setOrderToCancel(null)
      return
    }

    const updated = orders.map(o => {
      if (o.id === orderToCancel.id) {
        return {
          ...o,
          status: 'Cancelado',
          feedbackHistory: [
            ...(o.feedbackHistory || []),
            `Pedido cancelado: ${cancelReason.trim() || 'Sin motivo especificado'} (${new Date().toLocaleDateString()})`,
          ],
        }
      }
      return o
    })

    setOrders(updated)
    setOrderToCancel(null)
    setCancelReason('')
  }

  // --- Handlers: Catalog Product Addition ---
  const handleAddProductSubmit = e => {
    e.preventDefault()
    const newProd = {
      id: `prod-${Date.now()}`,
      name: newProdName,
      category: newProdCategory,
      price: Number(newProdPrice),
      productionTime: newProdTime,
      material: 'Sublimación de Alta Resistencia',
      description: 'Producto añadido por el Administrador.',
      badge: 'Nuevo',
      type: 'taza',
      colors: ['#FFFFFF', '#0D1B2A'],
      popularImage: '✨',
    }

    setProducts([newProd, ...products])
    setShowAddProductModal(false)
    setNewProdName('')
  }

  return (
    <section
      id="dashboard-section"
      className="min-h-[85vh] border-b border-roman-platinum bg-roman-marble py-16"
    >
      <div className="mx-auto max-w-7xl space-y-8 px-4 sm:px-6 lg:px-8">
        {/* Header & Role Bar */}
        <div className="card-architectural flex flex-col justify-between gap-4 border-2 border-roman-bronze/40 p-6 shadow-card-marble md:flex-row md:items-center">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 rounded bg-roman-navy px-3 py-1 font-headline text-[10px] font-bold uppercase tracking-wider text-roman-gold">
              <Shield className="h-3.5 w-3.5" />
              Gestión Interna Multi-Rol
            </div>
            <h2 className="font-cinzel text-2xl font-black text-roman-navy">
              Panel Operativo Sublimaciones Román
            </h2>
            <p className="text-xs text-slate-500">
              Vista activa:{' '}
              <strong className="font-bold uppercase text-roman-bronze">{currentRole}</strong>
            </p>
          </div>

          {/* Barra de Simulación de Roles (Exclusivo Administrador) */}
          {currentUser?.role === 'admin' && (
            <div className="flex flex-wrap items-center gap-2">
              {[
                { id: 'admin', label: '👑 Admin' },
                { id: 'disenador', label: '🎨 Diseñador' },
                { id: 'produccion', label: '🖨️ Producción (RN-01)' },
                { id: 'entregas', label: '🚚 Entregas Mérida' },
              ].map(r => (
                <button
                  key={r.id}
                  onClick={() => setCurrentRole(r.id)}
                  className={`rounded-xl px-3.5 py-2 font-headline text-xs font-bold uppercase transition-all ${
                    currentRole === r.id
                      ? 'btn-relief-navy text-white shadow-md'
                      : 'border border-slate-300 bg-roman-stone text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ADMIN METRICS SUMMARY (Solo en Vista Admin) */}
        {currentRole === 'admin' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="card-architectural border-2 border-roman-bronze bg-gradient-to-br from-roman-navy to-slate-900 p-5 text-white">
                <span className="font-headline text-[10px] font-bold uppercase tracking-wider text-roman-gold">
                  Total de Ventas Acumuladas
                </span>
                <p className="mt-1 font-cinzel text-3xl font-black text-white">
                  ${totalSales.toLocaleString('es-MX')} MXN
                </p>
                <p className="mt-1 text-[11px] text-slate-400">
                  Suma de pedidos confirmados y activos
                </p>
              </div>

              <div className="card-architectural border border-slate-300 bg-white p-5">
                <span className="font-headline text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Pagos por Validar
                </span>
                <p className="mt-1 font-cinzel text-3xl font-black text-amber-600">
                  {pendingPayments.length}
                </p>
                <p className="mt-1 text-[11px] text-slate-500">
                  Comprobantes pendientes de revisión SPEI/OXXO
                </p>
              </div>

              <div className="card-architectural border border-slate-300 bg-white p-5">
                <span className="font-headline text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Total de Pedidos
                </span>
                <p className="mt-1 font-cinzel text-3xl font-black text-roman-navy">
                  {orders.length}
                </p>
                <p className="mt-1 text-[11px] text-slate-500">
                  Registrados en la base de datos operativa
                </p>
              </div>
            </div>

            {/* Status breakdown grid */}
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-8">
              {Object.entries(statusCounts).map(([st, count]) => (
                <div
                  key={st}
                  className="rounded-xl border border-slate-200 bg-white p-2.5 text-center shadow-sm"
                >
                  <span className="block truncate text-[10px] font-bold text-slate-500" title={st}>
                    {st}
                  </span>
                  <span
                    className={`font-mono text-base font-bold ${
                      st === 'Cancelado'
                        ? 'text-red-600'
                        : st === 'Entregado'
                          ? 'text-emerald-700'
                          : st === 'En Producción'
                            ? 'text-roman-navy'
                            : 'text-slate-800'
                    }`}
                  >
                    {count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Role Notices */}
        {currentRole === 'produccion' && (
          <div className="flex items-center gap-3 rounded-xl border border-roman-bronze bg-roman-stone p-4 text-xs font-medium text-roman-navy">
            <Sparkles className="h-5 w-5 shrink-0 text-roman-bronze" />
            <p>
              <strong className="font-bold">Filtro de Producción Estricto:</strong> Se muestran{' '}
              <em>únicamente</em> pedidos con <strong>Diseño Confirmado</strong> Y un{' '}
              <strong>anticipo validado mínimo del 50%</strong>. No se permite imprimir sin ambos
              requisitos cumplidos.
            </p>
          </div>
        )}

        {currentRole === 'entregas' && (
          <div className="flex items-center gap-3 rounded-xl border border-slate-300 bg-roman-stone p-4 text-xs font-medium text-slate-700">
            <Package className="h-5 w-5 shrink-0 text-roman-navy" />
            <p>
              <strong className="font-bold">Módulo de Entregas:</strong> Solo podrás marcar como{' '}
              <strong>"Entregado"</strong> aquellos pedidos que hayan alcanzado el estado{' '}
              <strong>"Listo para Entrega"</strong>. Se requerirá confirmación previa.
            </p>
          </div>
        )}

        {/* ADMIN NAVIGATION TABS */}
        {currentRole === 'admin' && (
          <div className="flex flex-wrap items-center gap-2 border-b border-slate-300 pb-3">
            <button
              onClick={() => setActiveTab('orders')}
              className={`rounded-xl px-4 py-2 font-headline text-xs font-bold uppercase transition-colors ${
                activeTab === 'orders'
                  ? 'border border-roman-bronze bg-roman-navy text-roman-gold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              📦 Control de Pedidos ({orders.length})
            </button>
            <button
              onClick={() => setActiveTab('pagos')}
              className={`flex items-center gap-1.5 rounded-xl px-4 py-2 font-headline text-xs font-bold uppercase transition-colors ${
                activeTab === 'pagos'
                  ? 'border border-roman-bronze bg-roman-navy text-roman-gold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              💳 Validación de Pagos
              {pendingPayments.length > 0 && (
                <span className="rounded-full bg-amber-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
                  {pendingPayments.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('descuentos')}
              className={`rounded-xl px-4 py-2 font-headline text-xs font-bold uppercase transition-colors ${
                activeTab === 'descuentos'
                  ? 'border border-roman-bronze bg-roman-navy text-roman-gold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ⚙️ Reglas de Descuento
            </button>
            <button
              onClick={() => setActiveTab('catalog')}
              className={`rounded-xl px-4 py-2 font-headline text-xs font-bold uppercase transition-colors ${
                activeTab === 'catalog'
                  ? 'border border-roman-bronze bg-roman-navy text-roman-gold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🛍️ Administración de Catálogo ({products.length})
            </button>
          </div>
        )}

        {/* 1. ORDERS QUEUE (Active across all roles, filtered per role) */}
        {(activeTab === 'orders' || currentRole !== 'admin') && (
          <div className="card-architectural space-y-6 p-6 shadow-card-marble">
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-2 font-cinzel text-lg font-bold text-roman-navy">
                <Package className="h-5 w-5 text-roman-bronze" />
                Cola de Pedidos - {currentRole.toUpperCase()} ({roleFilteredOrders.length})
              </h3>
            </div>

            {roleFilteredOrders.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-300 py-12 text-center text-xs font-bold text-slate-500">
                No existen pedidos pendientes en este perfil operativo.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="border-b border-slate-300 bg-roman-stone font-headline text-[10px] font-bold uppercase text-roman-navy">
                    <tr>
                      <th className="p-3.5">Folio / Fecha</th>
                      <th className="p-3.5">Cliente & Contacto</th>
                      <th className="p-3.5">Producto & Especificaciones</th>
                      <th className="p-3.5">Estado</th>
                      <th className="p-3.5">Finanzas</th>
                      <th className="p-3.5 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {roleFilteredOrders.map(ord => {
                      const canCancel = [
                        'Recibido',
                        'En Revisión',
                        'Diseño Pendiente',
                        'Diseño Confirmado',
                      ].includes(ord.status)
                      const has50Deposit = hasValid50PercentDeposit(ord)

                      return (
                        <tr key={ord.id} className="transition-colors hover:bg-slate-50">
                          <td className="p-3.5">
                            <span className="block font-mono font-bold text-roman-navy">
                              {ord.id}
                            </span>
                            <span className="text-[10px] text-slate-400">{ord.date}</span>
                            {ord.disenoVersion && (
                              <span className="py-0.2 mt-0.5 inline-block rounded border border-purple-200 bg-purple-50 px-1.5 text-[10px] font-semibold text-purple-700">
                                Versión {ord.disenoVersion}
                              </span>
                            )}
                          </td>

                          <td className="p-3.5">
                            <span className="block font-bold text-slate-900">
                              {ord.customerName}
                            </span>
                            <span className="text-[10px] text-slate-500">{ord.phone}</span>
                          </td>

                          <td className="p-3.5">
                            <span className="block font-bold text-slate-800">
                              {ord.item} ({ord.quantity} pza)
                            </span>
                            <span className="text-[10px] italic text-roman-bronze">
                              "{ord.customText}"
                            </span>
                          </td>

                          <td className="p-3.5">
                            <span
                              className={`rounded border px-2.5 py-1 font-headline text-[9px] font-bold uppercase ${
                                ord.status === 'Diseño Confirmado'
                                  ? 'border-emerald-300 bg-emerald-100 text-emerald-800'
                                  : ord.status === 'En Producción'
                                    ? 'border-roman-bronze bg-roman-navy text-roman-gold'
                                    : ord.status === 'Listo para Entrega'
                                      ? 'border-blue-300 bg-blue-100 text-blue-800'
                                      : ord.status === 'Entregado'
                                        ? 'border-slate-400 bg-slate-200 text-slate-700'
                                        : ord.status === 'Cancelado'
                                          ? 'border-red-300 bg-red-100 text-red-800'
                                          : 'border-purple-300 bg-purple-100 text-purple-800'
                              }`}
                            >
                              {ord.status}
                            </span>
                          </td>

                          <td className="p-3.5">
                            <span className="block font-bold text-slate-900">${ord.total} MXN</span>
                            <span
                              className={`text-[10px] font-semibold ${has50Deposit ? 'text-emerald-700' : 'text-amber-700'}`}
                            >
                              {has50Deposit ? '✓ Anticipo ≥50%' : '⚠️ Falta anticipo'}
                            </span>
                            <span className="block text-[10px] text-slate-500">
                              Saldo: ${ord.remainingBalance}
                            </span>
                          </td>

                          <td className="space-x-2 p-3.5 text-right">
                            {/* DISEÑADOR ACTIONS */}
                            {currentRole === 'disenador' && (
                              <button
                                onClick={() => handleOpenProposalModal(ord)}
                                className="btn-relief-gold rounded-lg px-3 py-1.5 text-[10px] font-bold uppercase"
                              >
                                {ord.designerProposalUrl ? 'Actualizar Versión' : 'Subir Propuesta'}
                              </button>
                            )}

                            {/* PRODUCCION ACTIONS */}
                            {currentRole === 'produccion' && (
                              <div className="inline-flex items-center gap-1.5">
                                {ord.status === 'Diseño Confirmado' && (
                                  <button
                                    onClick={() => handleStartProduction(ord)}
                                    className="rounded-lg border border-roman-bronze bg-roman-navy px-3 py-1.5 text-[10px] font-bold uppercase text-roman-gold hover:bg-slate-800"
                                  >
                                    Iniciar Producción
                                  </button>
                                )}
                                {ord.status === 'En Producción' && (
                                  <button
                                    onClick={() => handleMarkReadyForDelivery(ord)}
                                    className="rounded-lg bg-emerald-700 px-3 py-1.5 text-[10px] font-bold uppercase text-white transition-all hover:bg-emerald-600"
                                  >
                                    Listo Entrega
                                  </button>
                                )}
                                <button
                                  onClick={() => setSelectedOrderForIncidence(ord)}
                                  className="rounded-lg border border-amber-300 bg-amber-50 px-2.5 py-1.5 text-[10px] font-bold uppercase text-amber-800 hover:bg-amber-100"
                                  title="Registrar incidencia de calidad"
                                >
                                  ⚠️ Incidencia
                                </button>
                              </div>
                            )}

                            {/* ENTREGAS ACTIONS */}
                            {currentRole === 'entregas' && (
                              <>
                                {ord.status === 'Listo para Entrega' ? (
                                  <button
                                    onClick={() => setOrderToDeliver(ord)}
                                    className="btn-relief-gold rounded-lg px-3 py-1.5 text-[10px] font-bold uppercase"
                                  >
                                    Marcar Entregado
                                  </button>
                                ) : (
                                  <span className="text-[10px] font-bold uppercase text-emerald-700">
                                    ✓ Entregado
                                  </span>
                                )}
                              </>
                            )}

                            {/* ADMIN ACTIONS: Cancel order button with confirmation */}
                            {currentRole === 'admin' && canCancel && (
                              <button
                                onClick={() => setOrderToCancel(ord)}
                                className="rounded-lg border border-red-300 bg-red-50 px-2.5 py-1.5 text-[10px] font-bold uppercase text-red-700 hover:bg-red-100"
                                title="Cancelar Pedido (Solo antes de Producción)"
                              >
                                Cancelar
                              </button>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* 2. ADMIN TAB: VALIDACIÓN DE PAGOS */}
        {activeTab === 'pagos' && currentRole === 'admin' && (
          <div className="card-architectural space-y-6 p-6 shadow-card-marble">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-cinzel text-lg font-bold text-roman-navy">
                  Validación de Pagos y Comprobantes
                </h3>
                <p className="text-xs text-slate-500">
                  Revisa los depósitos SPEI / transferencias registrados y valídalos para habilitar
                  el pase a producción.
                </p>
              </div>
            </div>

            {(pagos || []).length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-300 py-12 text-center text-xs font-bold text-slate-500">
                No hay pagos registrados en el sistema.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="border-b border-slate-300 bg-roman-stone font-headline text-[10px] font-bold uppercase text-roman-navy">
                    <tr>
                      <th className="p-3.5">Folio / Fecha</th>
                      <th className="p-3.5">Pedido Asociado</th>
                      <th className="p-3.5">Monto & Método</th>
                      <th className="p-3.5">Comprobante</th>
                      <th className="p-3.5">Estado Actual</th>
                      <th className="p-3.5 text-right">Acción Admin</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {(pagos || []).map(pago => {
                      const isPending =
                        pago.estado === 'Pendiente' || pago.estado === 'Pendiente de validación'
                      return (
                        <tr key={pago.id} className="transition-colors hover:bg-slate-50">
                          <td className="p-3.5">
                            <span className="block font-mono font-bold text-slate-900">
                              {pago.id}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {pago.fechaFormateada || pago.fecha}
                            </span>
                          </td>

                          <td className="p-3.5">
                            <span className="font-mono font-bold text-roman-navy">
                              {pago.pedidoId}
                            </span>
                            <span className="block text-[10px] text-slate-500">
                              Por: {pago.registradoPor || 'Cliente'}
                            </span>
                          </td>

                          <td className="p-3.5">
                            <span className="block text-sm font-black text-slate-900">
                              ${pago.monto} MXN
                            </span>
                            <span className="text-[10px] font-semibold uppercase text-roman-bronze">
                              {pago.metodo}
                            </span>
                          </td>

                          <td className="p-3.5">
                            <div className="flex items-center gap-1.5 text-slate-700">
                              <FileText className="h-4 w-4 text-roman-bronze" />
                              <span
                                className="max-w-[140px] truncate text-[11px]"
                                title={pago.comprobanteNombre}
                              >
                                {pago.comprobanteNombre || 'Ficha de pago'}
                              </span>
                            </div>
                          </td>

                          <td className="p-3.5">
                            <span
                              className={`rounded border px-2.5 py-1 font-headline text-[9px] font-bold uppercase ${
                                pago.estado === 'Validado'
                                  ? 'border-emerald-300 bg-emerald-100 text-emerald-800'
                                  : pago.estado === 'Rechazado'
                                    ? 'border-red-300 bg-red-100 text-red-800'
                                    : 'border-amber-300 bg-amber-100 text-amber-800'
                              }`}
                            >
                              ● {pago.estado}
                            </span>
                            {pago.motivoRechazo && (
                              <p className="mt-1 text-[10px] italic text-red-600">
                                {pago.motivoRechazo}
                              </p>
                            )}
                          </td>

                          <td className="space-x-2 p-3.5 text-right">
                            {isPending ? (
                              <>
                                <button
                                  onClick={() => handleValidatePayment(pago.id, 'validar')}
                                  className="rounded-lg bg-emerald-600 px-3 py-1.5 font-headline text-[10px] font-bold uppercase text-white hover:bg-emerald-500"
                                >
                                  Validar
                                </button>
                                <button
                                  onClick={() => {
                                    const motivo =
                                      prompt('Ingresa el motivo del rechazo del pago:') || ''
                                    handleValidatePayment(pago.id, 'rechazar', motivo)
                                  }}
                                  className="rounded-lg border border-red-300 bg-red-100 px-3 py-1.5 font-headline text-[10px] font-bold uppercase text-red-700 hover:bg-red-200"
                                >
                                  Rechazar
                                </button>
                              </>
                            ) : (
                              <span className="text-[10px] font-bold uppercase text-slate-400">
                                Procesado ({pago.validadoPor || 'Admin'})
                              </span>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* 3. ADMIN TAB: REGLAS DE DESCUENTO EDITABLES */}
        {activeTab === 'descuentos' && currentRole === 'admin' && (
          <div className="card-architectural space-y-6 p-6 shadow-card-marble">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <h3 className="font-cinzel text-lg font-bold text-roman-navy">
                  Configuración de Reglas de Descuento por Volumen
                </h3>
                <p className="text-xs text-slate-500">
                  Edita los rangos mínimos de piezas y los porcentajes que se aplicarán
                  automáticamente en las cotizaciones.
                </p>
              </div>
            </div>

            {rulesSuccessMsg && (
              <div className="flex items-center gap-2 rounded-xl border border-emerald-300 bg-emerald-50 p-3.5 text-xs font-semibold text-emerald-800">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>{rulesSuccessMsg}</span>
              </div>
            )}

            {/* Current rules list */}
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="border-b border-slate-300 bg-roman-stone font-headline text-[10px] font-bold uppercase text-roman-navy">
                  <tr>
                    <th className="p-3.5">Mínimo de Piezas</th>
                    <th className="p-3.5">Porcentaje de Descuento</th>
                    <th className="p-3.5 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {discountRules.map((r, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="p-3.5 font-bold text-slate-900">
                        A partir de {r.minPiezas} piezas
                      </td>
                      <td className="p-3.5">
                        <span className="rounded border border-emerald-300 bg-emerald-100 px-2.5 py-1 font-bold text-emerald-800">
                          {Math.round(r.porcentaje * 100)}% de Descuento
                        </span>
                      </td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => handleRemoveDiscountRule(idx)}
                          className="p-1 text-slate-400 hover:text-red-600"
                          title="Eliminar regla"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Add new rule form */}
            <form
              onSubmit={handleAddDiscountRule}
              className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4"
            >
              <h4 className="font-headline text-xs font-bold uppercase text-roman-navy">
                Agregar Nueva Regla:
              </h4>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div>
                  <label className="mb-1 block text-[10px] font-bold uppercase text-slate-600">
                    Mínimo de piezas:
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    placeholder="Ej. 20"
                    value={newMinPiezas}
                    onChange={e => setNewMinPiezas(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[10px] font-bold uppercase text-slate-600">
                    Porcentaje (%):
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    required
                    placeholder="Ej. 20 (para 20%)"
                    value={newPorcentaje}
                    onChange={e => setNewPorcentaje(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    type="submit"
                    className="btn-relief-gold w-full rounded-lg py-2.5 font-headline text-xs font-bold uppercase"
                  >
                    Guardar Regla
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* 4. ADMIN TAB: CATALOG */}
        {activeTab === 'catalog' && currentRole === 'admin' && (
          <div className="card-architectural space-y-6 p-6 shadow-card-marble">
            <div className="flex items-center justify-between">
              <h3 className="font-cinzel text-lg font-bold text-roman-navy">
                Administración de Catálogo
              </h3>
              <button
                onClick={() => setShowAddProductModal(true)}
                className="btn-relief-gold flex items-center gap-2 rounded-xl px-4 py-2 font-headline text-xs uppercase tracking-wider"
              >
                <Plus className="h-4 w-4 text-roman-navy" />
                <span>Nuevo Producto</span>
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {products.map(p => (
                <div
                  key={p.id}
                  className="flex items-center justify-between rounded-xl border border-slate-300 bg-roman-stone p-4"
                >
                  <div>
                    <h4 className="font-cinzel text-sm font-bold text-roman-navy">{p.name}</h4>
                    <p className="text-xs font-bold text-roman-bronze">
                      ${p.price} MXN • {p.productionTime}
                    </p>
                  </div>
                  <span className="text-2xl">{p.popularImage}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MODAL: Subir / Actualizar Versión Propuesta (Diseñador) */}
        {selectedOrderForProposal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
            <div className="w-full max-w-md space-y-4 rounded-2xl border-2 border-roman-bronze bg-white p-6 shadow-2xl">
              <h3 className="font-cinzel text-base font-bold text-roman-navy">
                Cargar Propuesta Gráfica ({selectedOrderForProposal.id})
              </h3>
              <p className="text-xs text-slate-600">
                Sube o actualiza la versión del render digital para someterlo a aprobación del
                cliente (RN-01).
              </p>

              <form onSubmit={handleUploadProposalSubmit} className="space-y-4">
                <div>
                  <label className="mb-1 block font-headline text-[10px] font-bold uppercase text-slate-700">
                    Versión del Diseño:
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={newProposalVersion}
                    onChange={e => setNewProposalVersion(parseInt(e.target.value, 10) || 1)}
                    className="w-full rounded-xl border border-slate-300 bg-roman-stone px-3 py-2 text-xs text-slate-800"
                  />
                </div>

                <div>
                  <label className="mb-1 block font-headline text-[10px] font-bold uppercase text-slate-700">
                    URL de la Muestra / Mockup:
                  </label>
                  <input
                    type="url"
                    required
                    placeholder="https://images.unsplash.com/..."
                    value={newProposalUrl}
                    onChange={e => setNewProposalUrl(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-roman-stone px-3 py-2 text-xs text-slate-800"
                  />
                </div>

                <div>
                  <label className="mb-1 block font-headline text-[10px] font-bold uppercase text-slate-700">
                    Observaciones para el Cliente:
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Ej. Se ajustó el color de la tipografía a dorado y se alineó el imagotipo central..."
                    value={proposalNotes}
                    onChange={e => setProposalNotes(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-roman-stone p-2.5 text-xs text-slate-800"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedOrderForProposal(null)}
                    className="px-3 py-1.5 text-xs font-bold text-slate-500"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="btn-relief-gold rounded-xl px-4 py-2 text-xs font-bold uppercase"
                  >
                    Enviar Versión {newProposalVersion}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: Registrar Incidencia de Calidad (Producción) */}
        {selectedOrderForIncidence && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
            <div className="w-full max-w-md space-y-4 rounded-2xl border-2 border-amber-500 bg-white p-6 shadow-2xl">
              <h3 className="flex items-center gap-2 font-cinzel text-base font-bold text-roman-navy">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                Registrar Incidencia de Calidad ({selectedOrderForIncidence.id})
              </h3>
              <p className="text-xs text-slate-600">
                Reporta cualquier defecto detectado durante la impresión o prensado en taller.
              </p>

              <form onSubmit={handleAddIncidenceSubmit} className="space-y-4">
                <div>
                  <label className="mb-1 block font-headline text-[10px] font-bold uppercase text-slate-700">
                    Tipo de Incidencia:
                  </label>
                  <select
                    value={incidenceType}
                    onChange={e => setIncidenceType(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-roman-stone px-3 py-2 text-xs text-slate-800"
                  >
                    <option value="Defecto de Impresión">
                      Defecto de Impresión (Mancha / Tinta corrida)
                    </option>
                    <option value="Error de Alineación">Error de Alineación o Centrado</option>
                    <option value="Defecto en Material">Defecto Físico en Producto Base</option>
                    <option value="Variación de Color">Variación de Color vs Muestra</option>
                    <option value="Otro">Otro Motivo</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1 block font-headline text-[10px] font-bold uppercase text-slate-700">
                    Severidad:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Baja', 'Media', 'Alta'].map(sev => (
                      <button
                        key={sev}
                        type="button"
                        onClick={() => setIncidenceSeverity(sev)}
                        className={`rounded-lg py-1.5 text-xs font-bold transition-all ${
                          incidenceSeverity === sev
                            ? 'bg-amber-600 text-white shadow-sm'
                            : 'border border-slate-200 bg-slate-100 text-slate-600'
                        }`}
                      >
                        {sev}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="mb-1 block font-headline text-[10px] font-bold uppercase text-slate-700">
                    Descripción del Problema:
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Detalla lo ocurrido durante el proceso de sublimado..."
                    value={incidenceDesc}
                    onChange={e => setIncidenceDesc(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-roman-stone p-2.5 text-xs text-slate-800"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedOrderForIncidence(null)}
                    className="px-3 py-1.5 text-xs font-bold text-slate-500"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-amber-600 px-4 py-2 font-headline text-xs font-bold uppercase text-white hover:bg-amber-500"
                  >
                    Guardar Incidencia
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL DE CONFIRMACIÓN: Marcar Entregado (Entregas) */}
        {orderToDeliver && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
            <div className="w-full max-w-md space-y-4 rounded-2xl border-2 border-roman-bronze bg-white p-6 shadow-2xl">
              <h3 className="font-cinzel text-base font-bold text-roman-navy">
                Confirmar Entrega de Pedido
              </h3>
              <p className="text-sm text-slate-700">
                ¿Confirmar que el pedido <strong>{orderToDeliver.id}</strong> (
                {orderToDeliver.customerName}) ha sido entregado formalmente al cliente?
              </p>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setOrderToDeliver(null)}
                  className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-900"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleExecuteDeliverOrder}
                  className="btn-relief-gold rounded-xl px-5 py-2.5 text-xs font-bold uppercase"
                >
                  Confirmar Entrega
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL DE CONFIRMACIÓN: Cancelar Pedido (Cualquier vista que lo permita) */}
        {orderToCancel && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
            <div className="w-full max-w-md space-y-4 rounded-2xl border-2 border-red-500 bg-white p-6 shadow-2xl">
              <h3 className="flex items-center gap-2 font-cinzel text-base font-bold text-red-700">
                <AlertCircle className="h-5 w-5" />
                Confirmar Cancelación de Pedido
              </h3>
              <p className="text-sm text-slate-700">
                ¿Estás seguro de cancelar el pedido <strong>{orderToCancel.id}</strong>? Esta acción
                no se puede deshacer.
              </p>
              <div>
                <label className="mb-1 block text-[10px] font-bold uppercase text-slate-600">
                  Motivo de Cancelación (Opcional):
                </label>
                <input
                  type="text"
                  placeholder="Ej. Solicitud del cliente por cambio de planes"
                  value={cancelReason}
                  onChange={e => setCancelReason(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-roman-stone px-3 py-2 text-xs text-slate-800"
                />
              </div>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => {
                    setOrderToCancel(null)
                    setCancelReason('')
                  }}
                  className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-900"
                >
                  Regresar
                </button>
                <button
                  onClick={handleExecuteCancelOrder}
                  className="rounded-xl bg-red-600 px-5 py-2.5 font-headline text-xs font-bold uppercase text-white hover:bg-red-500"
                >
                  Confirmar Cancelación
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: Agregar Nuevo Producto al Catálogo */}
        {showAddProductModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
            <div className="w-full max-w-md space-y-4 rounded-2xl border-2 border-roman-bronze bg-white p-6 shadow-2xl">
              <h3 className="font-cinzel text-base font-bold text-roman-navy">
                Agregar Nuevo Producto
              </h3>
              <form onSubmit={handleAddProductSubmit} className="space-y-3">
                <div>
                  <label className="mb-1 block text-[10px] font-bold uppercase text-slate-700">
                    Nombre del Producto:
                  </label>
                  <input
                    type="text"
                    required
                    value={newProdName}
                    onChange={e => setNewProdName(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-roman-stone px-3 py-2 text-xs text-slate-800"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[10px] font-bold uppercase text-slate-700">
                    Categoría:
                  </label>
                  <select
                    value={newProdCategory}
                    onChange={e => setNewProdCategory(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-roman-stone px-3 py-2 text-xs text-slate-800"
                  >
                    <option value="Tazas y Vasos">Tazas y Vasos</option>
                    <option value="Textil">Textil</option>
                    <option value="Decoración & Hogar">Decoración & Hogar</option>
                    <option value="Accesorios">Accesorios</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1 block text-[10px] font-bold uppercase text-slate-700">
                      Precio Unitario ($):
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={newProdPrice}
                      onChange={e => setNewProdPrice(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 bg-roman-stone px-3 py-2 text-xs text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-[10px] font-bold uppercase text-slate-700">
                      Tiempo Producción:
                    </label>
                    <input
                      type="text"
                      required
                      value={newProdTime}
                      onChange={e => setNewProdTime(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 bg-roman-stone px-3 py-2 text-xs text-slate-800"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-end gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowAddProductModal(false)}
                    className="px-3 py-1.5 text-xs font-bold text-slate-500"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="btn-relief-gold rounded-xl px-4 py-2 text-xs font-bold uppercase"
                  >
                    Guardar Producto
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
