import React, { useState, useEffect } from 'react'
import {
  Search,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  MessageSquare,
  ThumbsUp,
  ChevronRight,
  Columns,
} from 'lucide-react'
import confetti from 'canvas-confetti'

export const INITIAL_ORDERS = []

export default function OrderTracker({ orders = [], setOrders, onOpenPaymentModal }) {
  const [searchCode, setSearchCode] = useState(orders[0]?.id || '')
  const [selectedOrder, setSelectedOrder] = useState(orders[0] || null)
  const [changeFeedback, setChangeFeedback] = useState('')
  const [showFeedbackModal, setShowFeedbackModal] = useState(false)
  const [showApproveModal, setShowApproveModal] = useState(false)
  const [searchError, setSearchError] = useState('')
  const [feedbackError, setFeedbackError] = useState('')
  const [actionSuccessMessage, setActionSuccessMessage] = useState('')

  useEffect(() => {
    if (orders && orders.length > 0) {
      if (!selectedOrder || !orders.find(o => o.id === selectedOrder.id)) {
        setSelectedOrder(orders[0])
        setSearchCode(orders[0].id)
      }
    } else {
      setSelectedOrder(null)
      setSearchCode('')
    }
  }, [orders])

  const handleSearchOrder = e => {
    e.preventDefault()
    const cleanCode = searchCode.trim().toUpperCase()
    const folioRegex = /^ROM-\d{4}-\d{4}$/
    if (!folioRegex.test(cleanCode)) {
      setSearchError('No encontramos ese folio, revisa el formato')
      return
    }
    const found = orders.find(o => o.id.toUpperCase() === cleanCode)
    if (found) {
      setSelectedOrder(found)
      setSearchError('')
      setActionSuccessMessage('')
    } else {
      setSearchError('No encontramos ese folio, revisa el formato')
    }
  }

  // Rule RN-01: Approve Design -> Lleva a «Diseño Confirmado», NO a «En Producción»
  const executeApproveDesign = () => {
    setShowApproveModal(false)
    if (!selectedOrder) return

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    })

    const updatedTimeline = (selectedOrder.timeline || []).map(t => {
      if (t.step === 'Diseño Confirmado') {
        return {
          ...t,
          completed: true,
          current: true,
          date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }
      }
      if (t.step === 'Diseño Pendiente') {
        return { ...t, completed: true, current: false }
      }
      if (t.step === 'En Producción' || t.step === 'Listo para Entrega' || t.step === 'Entregado') {
        return { ...t, completed: false, current: false }
      }
      return t
    })

    const updatedOrder = {
      ...selectedOrder,
      status: 'Diseño Confirmado',
      timeline: updatedTimeline,
      feedbackHistory: [
        ...(selectedOrder.feedbackHistory || []),
        `Diseño aprobado por el cliente (${new Date().toLocaleDateString()})`,
      ],
    }

    const updatedOrders = orders.map(o => (o.id === selectedOrder.id ? updatedOrder : o))
    setOrders(updatedOrders)
    setSelectedOrder(updatedOrder)
    setActionSuccessMessage(
      '¡Diseño Aprobado exitosamente! El pedido ha avanzado a Diseño Confirmado.'
    )
  }

  // Rule RN-01: Request Changes -> Exige escribir la observación, registra nueva versión y regresa a «Diseño Pendiente»
  const handleRequestChangesSubmit = () => {
    if (!changeFeedback.trim()) {
      setFeedbackError('Por favor describe los cambios requeridos en el diseño.')
      return
    }

    const currentVersion = selectedOrder.disenoVersion || 1
    const newVersion = currentVersion + 1

    const updatedTimeline = (selectedOrder.timeline || []).map(t => {
      if (t.step === 'Diseño Pendiente') {
        return { ...t, completed: false, current: true, date: `V${newVersion} solicitada` }
      }
      if (
        t.step === 'Diseño Confirmado' ||
        t.step === 'En Producción' ||
        t.step === 'Listo para Entrega' ||
        t.step === 'Entregado'
      ) {
        return { ...t, completed: false, current: false }
      }
      return t
    })

    const updatedOrder = {
      ...selectedOrder,
      status: 'Diseño Pendiente',
      disenoVersion: newVersion,
      timeline: updatedTimeline,
      feedbackHistory: [
        ...(selectedOrder.feedbackHistory || []),
        `V${newVersion} - Solicitud de cambio: ${changeFeedback.trim()} (${new Date().toLocaleDateString()})`,
      ],
    }

    const updatedOrders = orders.map(o => (o.id === selectedOrder.id ? updatedOrder : o))
    setOrders(updatedOrders)
    setSelectedOrder(updatedOrder)
    setShowFeedbackModal(false)
    setChangeFeedback('')
    setFeedbackError('')
    setActionSuccessMessage(
      `Tu solicitud de cambios ha sido registrada (Versión ${newVersion} pendiente). El pedido regresa a Diseño Pendiente.`
    )
  }

  const statusColors = {
    Recibido: 'bg-blue-100 text-blue-800 border-blue-300',
    'En Revisión': 'bg-amber-100 text-amber-800 border-amber-300',
    'Diseño Pendiente': 'bg-purple-100 text-purple-800 border-purple-300',
    'Diseño Confirmado': 'bg-emerald-100 text-emerald-800 border-emerald-300',
    'En Producción': 'bg-roman-navy text-roman-gold border-roman-bronze',
    'Listo para Entrega': 'bg-roman-stone text-roman-navy border-slate-300',
    Entregado: 'bg-slate-200 text-slate-700 border-slate-400',
    Cancelado: 'bg-red-100 text-red-800 border-red-300',
  }

  return (
    <section
      id="rastrear-section"
      className="min-h-[80vh] border-b border-roman-platinum bg-roman-marble py-16"
    >
      <div className="mx-auto max-w-6xl space-y-10 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-2xl space-y-3 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-roman-bronze/40 bg-roman-navy px-3.5 py-1 font-headline text-[10px] font-bold uppercase tracking-widest text-roman-gold">
            <ShieldCheck className="h-3.5 w-3.5" />
            Portal del Cliente & Trazabilidad
          </div>
          <h2 className="font-cinzel text-3xl font-black text-roman-dark sm:text-4xl">
            Rastrear Pedido y <span className="text-roman-bronze">Aprobación RN-01</span>
          </h2>
          <p className="text-sm text-slate-600">
            Ingresa tu código de pedido para consultar el estado en tiempo real y autorizar tu
            propuesta gráfica.
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearchOrder} className="mx-auto flex max-w-xl items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Ej. ROM-2026-8841"
              value={searchCode}
              onChange={e => {
                setSearchCode(e.target.value)
                if (searchError) setSearchError('')
              }}
              className="w-full rounded-xl border-2 border-slate-300 bg-white py-3 pl-11 pr-4 font-mono text-sm text-slate-800 shadow-sm focus:border-roman-bronze focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="btn-relief-gold rounded-xl px-6 py-3.5 font-headline text-xs uppercase tracking-wider"
          >
            BUSCAR
          </button>
        </form>

        {searchError && (
          <p className="-mt-6 text-center text-xs font-semibold text-red-600">{searchError}</p>
        )}

        {/* Quick Order Selector */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2">
          {orders.map(ord => (
            <button
              key={ord.id}
              onClick={() => {
                setSelectedOrder(ord)
                setSearchCode(ord.id)
                setActionSuccessMessage('')
                setSearchError('')
              }}
              className={`rounded-xl px-4 py-2 font-mono text-xs font-bold transition-all ${
                selectedOrder?.id === ord.id
                  ? 'border border-roman-bronze bg-roman-navy text-roman-gold'
                  : 'border border-slate-300 bg-white text-slate-600 hover:text-slate-900'
              }`}
            >
              {ord.id} ({ord.status})
            </button>
          ))}
        </div>

        {/* Order Details Display Card */}
        {selectedOrder && (
          <div className="card-architectural animate-fadeIn space-y-8 border-2 border-slate-200 p-6 shadow-card-marble md:p-8">
            {/* Canceled Order Banner */}
            {selectedOrder.status === 'Cancelado' && (
              <div className="flex items-center gap-3 rounded-xl border-2 border-red-300 bg-red-50 p-4 text-red-800">
                <span className="rounded-full bg-red-600 px-3 py-1 font-headline text-xs font-bold uppercase text-white">
                  PEDIDO CANCELADO
                </span>
                <span className="text-xs">Este pedido ha sido cancelado.</span>
              </div>
            )}

            {/* Top Info Bar */}
            <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-6 md:flex-row md:items-center">
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="font-cinzel font-mono text-2xl font-black text-roman-navy">
                    {selectedOrder.id}
                  </h3>
                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-bold ${statusColors[selectedOrder.status] || 'bg-slate-100 text-slate-700'}`}
                  >
                    ● {selectedOrder.status}
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  Cliente: <strong className="text-slate-800">{selectedOrder.customerName}</strong>{' '}
                  • Fecha: {selectedOrder.date}
                </p>
              </div>

              {/* Financial Box */}
              <div className="flex items-center gap-4 rounded-xl border border-slate-300 bg-roman-stone p-3.5">
                <div className="text-right">
                  <p className="text-[9px] font-bold uppercase text-slate-500">Total Pedido</p>
                  <p className="font-cinzel text-lg font-black text-roman-navy">
                    ${selectedOrder.total} MXN
                  </p>
                </div>
                <div className="h-8 w-px bg-slate-300" />
                <div>
                  <p className="text-[9px] font-bold uppercase text-slate-500">Saldo Pendiente</p>
                  <p
                    className={`font-cinzel text-lg font-black ${selectedOrder.remainingBalance > 0 ? 'text-amber-700' : 'text-emerald-700'}`}
                  >
                    ${selectedOrder.remainingBalance} MXN
                  </p>
                </div>
                {selectedOrder.remainingBalance > 0 && (
                  <button
                    onClick={() => onOpenPaymentModal(selectedOrder)}
                    className="btn-relief-gold rounded-lg px-3 py-1.5 text-xs uppercase"
                  >
                    Pagar Anticipo
                  </button>
                )}
              </div>
            </div>

            {/* Action Feedback Banner */}
            {actionSuccessMessage && (
              <div className="animate-fadeIn flex items-center gap-3 rounded-xl border border-emerald-300 bg-emerald-50 p-4 text-xs font-medium text-emerald-800">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
                <p>{actionSuccessMessage}</p>
              </div>
            )}

            {/* Stepper Timeline */}
            <div className="space-y-4">
              <h4 className="font-headline text-xs font-bold uppercase tracking-wider text-roman-navy">
                Estado del Pedido (Trazabilidad en Tiempo Real):
              </h4>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
                {selectedOrder.timeline.map((step, idx) => (
                  <div
                    key={idx}
                    className={`flex flex-col justify-between rounded-xl border p-3 transition-all ${
                      step.current
                        ? 'border-roman-gold bg-roman-navy text-white shadow-md ring-2 ring-roman-bronze/50'
                        : step.completed
                          ? 'border-emerald-500 bg-white text-emerald-700'
                          : 'border-slate-300 bg-roman-stone text-slate-400'
                    }`}
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-[9px] font-bold opacity-75">Paso {idx + 1}</span>
                      {step.completed && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />}
                      {step.current && (
                        <Clock className="h-3.5 w-3.5 animate-pulse text-roman-gold" />
                      )}
                    </div>
                    <p className="mb-1 font-headline text-xs font-bold leading-tight">
                      {step.step}
                    </p>
                    <p className="font-mono text-[8px] opacity-80">{step.date}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* RN-01 Mandatory Design Approval Section */}
            <div className="space-y-6 rounded-2xl border-2 border-roman-bronze bg-roman-navy p-6 text-white shadow-lg">
              <div className="flex flex-col justify-between gap-3 border-b border-slate-700 pb-4 sm:flex-row sm:items-center">
                <div className="flex items-center gap-3">
                  <Columns className="h-5 w-5 text-roman-gold" />
                  <div>
                    <h4 className="font-cinzel text-base font-bold sm:text-lg">
                      Módulo de Aprobación de Diseño Obligatoria (Regla RN-01)
                    </h4>
                    <p className="text-xs text-slate-300">
                      Revisa la propuesta visual generada por el diseñador asignado antes de
                      autorizar la producción.
                    </p>
                  </div>
                </div>

                <span className="rounded bg-roman-gold px-3 py-1 font-headline text-[10px] font-bold uppercase text-roman-navy">
                  Requisito Indispensable
                </span>
              </div>

              {/* Proposal Mockup Visual Card */}
              <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-12">
                {/* Visual Image Preview */}
                <div className="group relative flex aspect-video items-center justify-center overflow-hidden rounded-xl border-2 border-roman-gold/50 bg-slate-950 shadow-xl md:col-span-6">
                  <img
                    src={selectedOrder.designerProposalUrl}
                    alt="Propuesta gráfica sublimación"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white">
                    <span className="rounded border border-roman-gold/40 bg-roman-navy/90 px-2.5 py-1 font-headline text-[10px] font-bold">
                      Muestra Digital Sublimación Román
                    </span>
                    <span className="font-mono text-[10px] text-roman-gold">100% Escala Real</span>
                  </div>
                </div>

                {/* Controls */}
                <div className="space-y-4 md:col-span-6">
                  <div className="space-y-1">
                    <h5 className="font-headline text-sm font-bold text-white">
                      Detalles de la Muestra:
                    </h5>
                    <p className="text-xs text-slate-300">
                      <strong className="text-roman-gold">Producto:</strong> {selectedOrder.item} (
                      {selectedOrder.quantity} pza)
                      <br />
                      <strong className="text-roman-gold">Texto Sublimado:</strong> "
                      {selectedOrder.customText}"
                    </p>
                  </div>

                  {selectedOrder.status === 'Diseño Pendiente' ||
                  selectedOrder.status === 'En Revisión' ? (
                    <div className="space-y-3 pt-2">
                      <p className="text-xs font-semibold text-roman-gold">
                        ¿Apruebas esta propuesta gráfica para iniciar la sublimación?
                      </p>

                      <div className="flex flex-col items-center gap-3 sm:flex-row">
                        <button
                          onClick={() => setShowApproveModal(true)}
                          disabled={
                            !selectedOrder.designerProposalUrl ||
                            selectedOrder.status === 'Cancelado'
                          }
                          className={`flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 font-headline text-xs font-black uppercase tracking-wider shadow-md sm:flex-1 ${
                            !selectedOrder.designerProposalUrl ||
                            selectedOrder.status === 'Cancelado'
                              ? 'cursor-not-allowed bg-slate-700 text-slate-500 opacity-60'
                              : 'bg-emerald-600 text-white hover:bg-emerald-500'
                          }`}
                        >
                          <ThumbsUp className="h-4 w-4" />
                          <span>APROBAR DISEÑO</span>
                        </button>

                        <button
                          onClick={() => {
                            setShowFeedbackModal(true)
                            setFeedbackError('')
                          }}
                          disabled={selectedOrder.status === 'Cancelado'}
                          className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-600 bg-slate-800 px-4 py-3 font-headline text-xs font-bold uppercase tracking-wider text-slate-200 hover:bg-slate-700 disabled:opacity-50 sm:flex-1"
                        >
                          <MessageSquare className="h-4 w-4 text-amber-400" />
                          <span>SOLICITAR CAMBIOS</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 rounded-xl border border-emerald-500 bg-emerald-900/60 p-3.5 text-xs font-bold text-emerald-200">
                      <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                      <span>El diseño ha sido verificado y APROBADO por el cliente.</span>
                    </div>
                  )}

                  {/* Feedback History */}
                  {selectedOrder.feedbackHistory.length > 0 && (
                    <div className="space-y-1 border-t border-slate-700 pt-2">
                      <p className="text-[10px] font-bold uppercase text-slate-400">
                        Historial de Retroalimentación:
                      </p>
                      {selectedOrder.feedbackHistory.map((fb, idx) => (
                        <p
                          key={idx}
                          className="rounded border border-slate-800 bg-slate-900/80 p-2 text-[11px] text-slate-300"
                        >
                          💬 {fb}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty State when no order is selected */}
        {!selectedOrder && (
          <div className="card-architectural space-y-3 border-2 border-slate-200 bg-white p-12 text-center shadow-card-marble">
            <ShieldCheck className="mx-auto h-12 w-12 text-roman-bronze opacity-50" />
            <h3 className="font-cinzel text-lg font-bold text-roman-navy">
              No hay pedidos registrados
            </h3>
            <p className="mx-auto max-w-md text-xs text-slate-500">
              Actualmente no hay pedidos en el sistema. Puedes personalizar un producto en nuestro
              catálogo para generar tu primer pedido y darle seguimiento en tiempo real.
            </p>
          </div>
        )}

        {/* Approve Confirmation Modal */}
        {showApproveModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
            <div className="w-full max-w-md space-y-4 rounded-2xl border-2 border-roman-bronze bg-white p-6 shadow-2xl">
              <h3 className="font-cinzel text-lg font-bold text-roman-navy">
                Confirmar Aprobación
              </h3>
              <p className="text-sm text-slate-700">
                ¿Aprobar este diseño? Esta acción no se puede deshacer.
              </p>
              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  onClick={() => setShowApproveModal(false)}
                  className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-900"
                >
                  Cancelar
                </button>
                <button
                  onClick={executeApproveDesign}
                  className="rounded-xl bg-emerald-600 px-5 py-2.5 font-headline text-xs font-bold uppercase text-white hover:bg-emerald-500"
                >
                  Confirmar Aprobación
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Change Request Modal */}
        {showFeedbackModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
            <div className="w-full max-w-lg space-y-4 rounded-2xl border-2 border-roman-bronze bg-white p-6 shadow-2xl">
              <h3 className="font-cinzel text-lg font-bold text-roman-navy">
                Solicitar Cambios en el Diseño
              </h3>
              <p className="text-xs text-slate-600">
                Describe detalladamente las correcciones requeridas (colores, alineación, fuentes o
                tamaño).
              </p>

              <textarea
                rows={4}
                value={changeFeedback}
                onChange={e => {
                  setChangeFeedback(e.target.value)
                  if (feedbackError) setFeedbackError('')
                }}
                placeholder="Ej. Favor de centrar más el texto y cambiar la tipografía del nombre a color dorado imperial..."
                className="w-full rounded-xl border border-slate-300 bg-roman-stone p-3 text-xs text-slate-800 focus:border-roman-bronze focus:outline-none"
              />

              {feedbackError && (
                <p className="text-xs font-semibold text-red-600">{feedbackError}</p>
              )}

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => {
                    setShowFeedbackModal(false)
                    setFeedbackError('')
                  }}
                  className="rounded-xl px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-900"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleRequestChangesSubmit}
                  className="btn-relief-gold rounded-xl px-5 py-2.5 text-xs uppercase"
                >
                  Enviar Comentarios
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
