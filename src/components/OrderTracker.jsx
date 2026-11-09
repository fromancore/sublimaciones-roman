import React, { useState, useEffect } from 'react';
import { Search, ShieldCheck, CheckCircle2, Clock, Sparkles, MessageSquare, ThumbsUp, ChevronRight, Columns } from 'lucide-react';
import confetti from 'canvas-confetti';

export const INITIAL_ORDERS = [];

export default function OrderTracker({ orders = [], setOrders, onOpenPaymentModal }) {
  const [searchCode, setSearchCode] = useState(orders[0]?.id || '');
  const [selectedOrder, setSelectedOrder] = useState(orders[0] || null);
  const [changeFeedback, setChangeFeedback] = useState('');
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [feedbackError, setFeedbackError] = useState('');
  const [actionSuccessMessage, setActionSuccessMessage] = useState('');

  useEffect(() => {
    if (orders && orders.length > 0) {
      if (!selectedOrder || !orders.find(o => o.id === selectedOrder.id)) {
        setSelectedOrder(orders[0]);
        setSearchCode(orders[0].id);
      }
    } else {
      setSelectedOrder(null);
      setSearchCode('');
    }
  }, [orders]);

  const handleSearchOrder = (e) => {
    e.preventDefault();
    const cleanCode = searchCode.trim().toUpperCase();
    const folioRegex = /^ROM-\d{4}-\d{4}$/;
    if (!folioRegex.test(cleanCode)) {
      setSearchError('No encontramos ese folio, revisa el formato');
      return;
    }
    const found = orders.find(o => o.id.toUpperCase() === cleanCode);
    if (found) {
      setSelectedOrder(found);
      setSearchError('');
      setActionSuccessMessage('');
    } else {
      setSearchError('No encontramos ese folio, revisa el formato');
    }
  };

  // Rule RN-01: Approve Design -> Lleva a «Diseño Confirmado», NO a «En Producción»
  const executeApproveDesign = () => {
    setShowApproveModal(false);
    if (!selectedOrder) return;

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    const updatedTimeline = (selectedOrder.timeline || []).map(t => {
      if (t.step === 'Diseño Confirmado') {
        return { ...t, completed: true, current: true, date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
      }
      if (t.step === 'Diseño Pendiente') {
        return { ...t, completed: true, current: false };
      }
      if (t.step === 'En Producción' || t.step === 'Listo para Entrega' || t.step === 'Entregado') {
        return { ...t, completed: false, current: false };
      }
      return t;
    });

    const updatedOrder = {
      ...selectedOrder,
      status: 'Diseño Confirmado',
      timeline: updatedTimeline,
      feedbackHistory: [...(selectedOrder.feedbackHistory || []), `Diseño aprobado por el cliente (${new Date().toLocaleDateString()})`]
    };

    const updatedOrders = orders.map(o => o.id === selectedOrder.id ? updatedOrder : o);
    setOrders(updatedOrders);
    setSelectedOrder(updatedOrder);
    setActionSuccessMessage('¡Diseño Aprobado exitosamente! El pedido ha avanzado a Diseño Confirmado.');
  };

  // Rule RN-01: Request Changes -> Exige escribir la observación, registra nueva versión y regresa a «Diseño Pendiente»
  const handleRequestChangesSubmit = () => {
    if (!changeFeedback.trim()) {
      setFeedbackError('Por favor describe los cambios requeridos en el diseño.');
      return;
    }

    const currentVersion = selectedOrder.disenoVersion || 1;
    const newVersion = currentVersion + 1;

    const updatedTimeline = (selectedOrder.timeline || []).map(t => {
      if (t.step === 'Diseño Pendiente') {
        return { ...t, completed: false, current: true, date: `V${newVersion} solicitada` };
      }
      if (t.step === 'Diseño Confirmado' || t.step === 'En Producción' || t.step === 'Listo para Entrega' || t.step === 'Entregado') {
        return { ...t, completed: false, current: false };
      }
      return t;
    });

    const updatedOrder = {
      ...selectedOrder,
      status: 'Diseño Pendiente',
      disenoVersion: newVersion,
      timeline: updatedTimeline,
      feedbackHistory: [
        ...(selectedOrder.feedbackHistory || []),
        `V${newVersion} - Solicitud de cambio: ${changeFeedback.trim()} (${new Date().toLocaleDateString()})`
      ]
    };

    const updatedOrders = orders.map(o => o.id === selectedOrder.id ? updatedOrder : o);
    setOrders(updatedOrders);
    setSelectedOrder(updatedOrder);
    setShowFeedbackModal(false);
    setChangeFeedback('');
    setFeedbackError('');
    setActionSuccessMessage(`Tu solicitud de cambios ha sido registrada (Versión ${newVersion} pendiente). El pedido regresa a Diseño Pendiente.`);
  };

  const statusColors = {
    'Recibido': 'bg-blue-100 text-blue-800 border-blue-300',
    'En Revisión': 'bg-amber-100 text-amber-800 border-amber-300',
    'Diseño Pendiente': 'bg-purple-100 text-purple-800 border-purple-300',
    'Diseño Confirmado': 'bg-emerald-100 text-emerald-800 border-emerald-300',
    'En Producción': 'bg-roman-navy text-roman-gold border-roman-bronze',
    'Listo para Entrega': 'bg-roman-stone text-roman-navy border-slate-300',
    'Entregado': 'bg-slate-200 text-slate-700 border-slate-400',
    'Cancelado': 'bg-red-100 text-red-800 border-red-300'
  };

  return (
    <section id="rastrear-section" className="py-16 bg-roman-marble border-b border-roman-platinum min-h-[80vh]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-roman-navy text-[10px] font-headline font-bold text-roman-gold uppercase tracking-widest border border-roman-bronze/40">
            <ShieldCheck className="w-3.5 h-3.5" />
            Portal del Cliente & Trazabilidad
          </div>
          <h2 className="text-3xl sm:text-4xl font-cinzel font-black text-roman-dark">
            Rastrear Pedido y <span className="text-roman-bronze">Aprobación RN-01</span>
          </h2>
          <p className="text-slate-600 text-sm">
            Ingresa tu código de pedido para consultar el estado en tiempo real y autorizar tu propuesta gráfica.
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearchOrder} className="max-w-xl mx-auto flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Ej. ROM-2026-8841"
              value={searchCode}
              onChange={(e) => {
                setSearchCode(e.target.value);
                if (searchError) setSearchError('');
              }}
              className="w-full bg-white border-2 border-slate-300 rounded-xl pl-11 pr-4 py-3 text-sm text-slate-800 font-mono focus:outline-none focus:border-roman-bronze shadow-sm"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3.5 rounded-xl btn-relief-gold text-xs font-headline tracking-wider uppercase"
          >
            BUSCAR
          </button>
        </form>

        {searchError && (
          <p className="text-xs text-red-600 font-semibold text-center -mt-6">
            {searchError}
          </p>
        )}

        {/* Quick Order Selector */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2">
          {orders.map((ord) => (
            <button
              key={ord.id}
              onClick={() => { setSelectedOrder(ord); setSearchCode(ord.id); setActionSuccessMessage(''); setSearchError(''); }}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                selectedOrder?.id === ord.id 
                  ? 'bg-roman-navy text-roman-gold border border-roman-bronze' 
                  : 'bg-white text-slate-600 border border-slate-300 hover:text-slate-900'
              }`}
            >
              {ord.id} ({ord.status})
            </button>
          ))}
        </div>

        {/* Order Details Display Card */}
        {selectedOrder && (
          <div className="card-architectural p-6 md:p-8 shadow-card-marble space-y-8 animate-fadeIn border-2 border-slate-200">
            
            {/* Canceled Order Banner */}
            {selectedOrder.status === 'Cancelado' && (
              <div className="p-4 rounded-xl bg-red-50 border-2 border-red-300 text-red-800 flex items-center gap-3">
                <span className="px-3 py-1 bg-red-600 text-white font-headline text-xs font-bold uppercase rounded-full">
                  PEDIDO CANCELADO
                </span>
                <span className="text-xs">Este pedido ha sido cancelado.</span>
              </div>
            )}

            {/* Top Info Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="font-cinzel font-black text-2xl text-roman-navy font-mono">
                    {selectedOrder.id}
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${statusColors[selectedOrder.status] || 'bg-slate-100 text-slate-700'}`}>
                    ● {selectedOrder.status}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Cliente: <strong className="text-slate-800">{selectedOrder.customerName}</strong> • Fecha: {selectedOrder.date}
                </p>
              </div>

              {/* Financial Box */}
              <div className="flex items-center gap-4 bg-roman-stone p-3.5 rounded-xl border border-slate-300">
                <div className="text-right">
                  <p className="text-[9px] text-slate-500 font-bold uppercase">Total Pedido</p>
                  <p className="font-cinzel font-black text-lg text-roman-navy">${selectedOrder.total} MXN</p>
                </div>
                <div className="h-8 w-px bg-slate-300"></div>
                <div>
                  <p className="text-[9px] text-slate-500 font-bold uppercase">Saldo Pendiente</p>
                  <p className={`font-cinzel font-black text-lg ${selectedOrder.remainingBalance > 0 ? 'text-amber-700' : 'text-emerald-700'}`}>
                    ${selectedOrder.remainingBalance} MXN
                  </p>
                </div>
                {selectedOrder.remainingBalance > 0 && (
                  <button
                    onClick={() => onOpenPaymentModal(selectedOrder)}
                    className="px-3 py-1.5 rounded-lg btn-relief-gold text-xs uppercase"
                  >
                    Pagar Anticipo
                  </button>
                )}
              </div>
            </div>

            {/* Action Feedback Banner */}
            {actionSuccessMessage && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-medium flex items-center gap-3 animate-fadeIn">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <p>{actionSuccessMessage}</p>
              </div>
            )}

            {/* Stepper Timeline */}
            <div className="space-y-4">
              <h4 className="font-headline font-bold text-xs text-roman-navy uppercase tracking-wider">
                Estado del Pedido (Trazabilidad en Tiempo Real):
              </h4>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                {selectedOrder.timeline.map((step, idx) => (
                  <div 
                    key={idx}
                    className={`p-3 rounded-xl border flex flex-col justify-between transition-all ${
                      step.current 
                        ? 'bg-roman-navy border-roman-gold text-white shadow-md ring-2 ring-roman-bronze/50' 
                        : step.completed 
                        ? 'bg-white border-emerald-500 text-emerald-700' 
                        : 'bg-roman-stone border-slate-300 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[9px] font-bold opacity-75">Paso {idx + 1}</span>
                      {step.completed && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                      {step.current && <Clock className="w-3.5 h-3.5 text-roman-gold animate-pulse" />}
                    </div>
                    <p className="font-headline font-bold text-xs leading-tight mb-1">{step.step}</p>
                    <p className="text-[8px] opacity-80 font-mono">{step.date}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* RN-01 Mandatory Design Approval Section */}
            <div className="p-6 rounded-2xl bg-roman-navy text-white border-2 border-roman-bronze shadow-lg space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-700 pb-4">
                <div className="flex items-center gap-3">
                  <Columns className="w-5 h-5 text-roman-gold" />
                  <div>
                    <h4 className="font-cinzel font-bold text-base sm:text-lg">
                      Módulo de Aprobación de Diseño Obligatoria (Regla RN-01)
                    </h4>
                    <p className="text-xs text-slate-300">
                      Revisa la propuesta visual generada por el diseñador asignado antes de autorizar la producción.
                    </p>
                  </div>
                </div>

                <span className="px-3 py-1 rounded bg-roman-gold text-roman-navy font-headline font-bold text-[10px] uppercase">
                  Requisito Indispensable
                </span>
              </div>

              {/* Proposal Mockup Visual Card */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                
                {/* Visual Image Preview */}
                <div className="md:col-span-6 relative aspect-video rounded-xl overflow-hidden border-2 border-roman-gold/50 bg-slate-950 flex items-center justify-center group shadow-xl">
                  <img 
                    src={selectedOrder.designerProposalUrl} 
                    alt="Propuesta gráfica sublimación" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white">
                    <span className="font-headline font-bold bg-roman-navy/90 px-2.5 py-1 rounded border border-roman-gold/40 text-[10px]">
                      Muestra Digital Sublimación Román
                    </span>
                    <span className="text-[10px] text-roman-gold font-mono">100% Escala Real</span>
                  </div>
                </div>

                {/* Controls */}
                <div className="md:col-span-6 space-y-4">
                  <div className="space-y-1">
                    <h5 className="font-headline font-bold text-sm text-white">
                      Detalles de la Muestra:
                    </h5>
                    <p className="text-xs text-slate-300">
                      <strong className="text-roman-gold">Producto:</strong> {selectedOrder.item} ({selectedOrder.quantity} pza)<br />
                      <strong className="text-roman-gold">Texto Sublimado:</strong> "{selectedOrder.customText}"
                    </p>
                  </div>

                  {selectedOrder.status === 'Diseño Pendiente' || selectedOrder.status === 'En Revisión' ? (
                    <div className="space-y-3 pt-2">
                      <p className="text-xs font-semibold text-roman-gold">
                        ¿Apruebas esta propuesta gráfica para iniciar la sublimación?
                      </p>

                      <div className="flex flex-col sm:flex-row items-center gap-3">
                        <button
                          onClick={() => setShowApproveModal(true)}
                          disabled={!selectedOrder.designerProposalUrl || selectedOrder.status === 'Cancelado'}
                          className={`w-full sm:flex-1 py-3 px-4 rounded-xl font-headline font-black text-xs tracking-wider uppercase shadow-md flex items-center justify-center gap-2 ${
                            !selectedOrder.designerProposalUrl || selectedOrder.status === 'Cancelado'
                              ? 'bg-slate-700 text-slate-500 cursor-not-allowed opacity-60'
                              : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                          }`}
                        >
                          <ThumbsUp className="w-4 h-4" />
                          <span>APROBAR DISEÑO</span>
                        </button>

                        <button
                          onClick={() => { setShowFeedbackModal(true); setFeedbackError(''); }}
                          disabled={selectedOrder.status === 'Cancelado'}
                          className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 font-headline font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                          <MessageSquare className="w-4 h-4 text-amber-400" />
                          <span>SOLICITAR CAMBIOS</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3.5 rounded-xl bg-emerald-900/60 border border-emerald-500 text-emerald-200 text-xs font-bold flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      <span>El diseño ha sido verificado y APROBADO por el cliente.</span>
                    </div>
                  )}

                  {/* Feedback History */}
                  {selectedOrder.feedbackHistory.length > 0 && (
                    <div className="pt-2 border-t border-slate-700 space-y-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Historial de Retroalimentación:</p>
                      {selectedOrder.feedbackHistory.map((fb, idx) => (
                        <p key={idx} className="text-[11px] text-slate-300 bg-slate-900/80 p-2 rounded border border-slate-800">
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
          <div className="card-architectural p-12 text-center shadow-card-marble border-2 border-slate-200 space-y-3 bg-white">
            <ShieldCheck className="w-12 h-12 text-roman-bronze mx-auto opacity-50" />
            <h3 className="font-cinzel font-bold text-lg text-roman-navy">No hay pedidos registrados</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Actualmente no hay pedidos en el sistema. Puedes personalizar un producto en nuestro catálogo para generar tu primer pedido y darle seguimiento en tiempo real.
            </p>
          </div>
        )}

        {/* Approve Confirmation Modal */}
        {showApproveModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white border-2 border-roman-bronze rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
              <h3 className="font-cinzel font-bold text-lg text-roman-navy">Confirmar Aprobación</h3>
              <p className="text-sm text-slate-700">
                ¿Aprobar este diseño? Esta acción no se puede deshacer.
              </p>
              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  onClick={() => setShowApproveModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-900 border border-slate-300"
                >
                  Cancelar
                </button>
                <button
                  onClick={executeApproveDesign}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-headline text-xs uppercase font-bold"
                >
                  Confirmar Aprobación
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Change Request Modal */}
        {showFeedbackModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white border-2 border-roman-bronze rounded-2xl p-6 max-w-lg w-full space-y-4 shadow-2xl">
              <h3 className="font-cinzel font-bold text-lg text-roman-navy">Solicitar Cambios en el Diseño</h3>
              <p className="text-xs text-slate-600">
                Describe detalladamente las correcciones requeridas (colores, alineación, fuentes o tamaño).
              </p>
              
              <textarea
                rows={4}
                value={changeFeedback}
                onChange={(e) => {
                  setChangeFeedback(e.target.value);
                  if (feedbackError) setFeedbackError('');
                }}
                placeholder="Ej. Favor de centrar más el texto y cambiar la tipografía del nombre a color dorado imperial..."
                className="w-full bg-roman-stone border border-slate-300 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:border-roman-bronze"
              />

              {feedbackError && (
                <p className="text-xs text-red-600 font-semibold">{feedbackError}</p>
              )}

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => { setShowFeedbackModal(false); setFeedbackError(''); }}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-900"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleRequestChangesSubmit}
                  className="px-5 py-2.5 rounded-xl btn-relief-gold text-xs uppercase"
                >
                  Enviar Comentarios
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
