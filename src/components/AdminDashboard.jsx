import React, { useState } from 'react';
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
  AlertCircle 
} from 'lucide-react';
import { obtenerReglasDescuento, actualizarReglasDescuento } from '../services/cotizacion.js';
import { validarPago, calcularResumenPagos } from '../services/pagos.js';
import { cambiarEstado } from '../services/flujoPedido.js';

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
  currentUser = null
}) {
  // Tab states for Admin view
  const [activeTab, setActiveTab] = useState('orders'); // 'orders', 'pagos', 'descuentos', 'catalog'

  // Designer proposal state
  const [selectedOrderForProposal, setSelectedOrderForProposal] = useState(null);
  const [newProposalUrl, setNewProposalUrl] = useState('');
  const [newProposalVersion, setNewProposalVersion] = useState(1);
  const [proposalNotes, setProposalNotes] = useState('');

  // Catalog state
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdCategory, setNewProdCategory] = useState('Tazas y Vasos');
  const [newProdPrice, setNewProdPrice] = useState(150);
  const [newProdTime, setNewProdTime] = useState('48 - 72 hrs');

  // Discount rules state (editable array)
  const [discountRules, setDiscountRules] = useState(obtenerReglasDescuento());
  const [rulesSuccessMsg, setRulesSuccessMsg] = useState('');
  const [newMinPiezas, setNewMinPiezas] = useState('');
  const [newPorcentaje, setNewPorcentaje] = useState('');

  // Modals for confirmation
  const [orderToCancel, setOrderToCancel] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [orderToDeliver, setOrderToDeliver] = useState(null);

  // Quality incidence state for Production
  const [selectedOrderForIncidence, setSelectedOrderForIncidence] = useState(null);
  const [incidenceType, setIncidenceType] = useState('Defecto de Impresión');
  const [incidenceDesc, setIncidenceDesc] = useState('');
  const [incidenceSeverity, setIncidenceSeverity] = useState('Media');

  // Active user representation
  const activeUser = {
    role: currentRole,
    nombre: currentUser?.nombre || `Usuario (${currentRole})`
  };

  // Helper to determine if an order has at least 50% validated deposit
  const hasValid50PercentDeposit = (order) => {
    const orderPayments = (pagos || []).filter(p => p.pedidoId === order.id);
    if (orderPayments.length > 0) {
      const summary = calcularResumenPagos(order.total, orderPayments);
      return summary.cumpleAnticipo50;
    }
    // Fallback using order.depositPaid
    return (order.depositPaid || 0) >= (order.total * 0.5);
  };

  // Filter orders according to active operational role
  const getRoleOrders = () => {
    if (currentRole === 'produccion') {
      // "Vista Producción: muestra solo pedidos con diseño confirmado Y anticipo validado de al menos 50%"
      return orders.filter(o => 
        (o.status === 'Diseño Confirmado' || o.status === 'En Producción') && 
        hasValid50PercentDeposit(o)
      );
    }
    if (currentRole === 'entregas') {
      return orders.filter(o => o.status === 'Listo para Entrega' || o.status === 'Entregado');
    }
    if (currentRole === 'disenador') {
      return orders.filter(o => 
        o.status === 'Recibido' || 
        o.status === 'En Revisión' || 
        o.status === 'Diseño Pendiente' || 
        o.status === 'Diseño Confirmado'
      );
    }
    return orders;
  };

  const roleFilteredOrders = getRoleOrders();

  // Metrics calculation for Admin summary
  const totalSales = orders.reduce((sum, o) => sum + (o.status !== 'Cancelado' ? (Number(o.total) || 0) : 0), 0);
  const statusCounts = {
    'Recibido': orders.filter(o => o.status === 'Recibido').length,
    'En Revisión': orders.filter(o => o.status === 'En Revisión').length,
    'Diseño Pendiente': orders.filter(o => o.status === 'Diseño Pendiente').length,
    'Diseño Confirmado': orders.filter(o => o.status === 'Diseño Confirmado').length,
    'En Producción': orders.filter(o => o.status === 'En Producción').length,
    'Listo para Entrega': orders.filter(o => o.status === 'Listo para Entrega').length,
    'Entregado': orders.filter(o => o.status === 'Entregado').length,
    'Cancelado': orders.filter(o => o.status === 'Cancelado').length
  };

  // Payments pending validation
  const pendingPayments = (pagos || []).filter(p => p.estado === 'Pendiente' || p.estado === 'Pendiente de validación');

  // --- Handlers: Payments ---
  const handleValidatePayment = (pagoId, accion, motivo = '') => {
    const targetPago = (pagos || []).find(p => p.id === pagoId);
    if (!targetPago) return;

    const result = validarPago(targetPago, accion, { role: 'admin', nombre: 'Administrador General' }, motivo);
    if (!result.ok) {
      alert(result.mensaje);
      return;
    }

    // Update pagos state
    const updatedPagos = (pagos || []).map(p => p.id === pagoId ? result.pago : p);
    if (setPagos) setPagos(updatedPagos);

    // If validated, update the order's validated deposit and remaining balance
    if (accion === 'validar') {
      const orderPayments = updatedPagos.filter(p => p.pedidoId === targetPago.pedidoId);
      const targetOrder = orders.find(o => o.id === targetPago.pedidoId);
      if (targetOrder) {
        const summary = calcularResumenPagos(targetOrder.total, orderPayments);
        const updatedOrders = orders.map(o => {
          if (o.id === targetPago.pedidoId) {
            return {
              ...o,
              depositPaid: summary.pagadoValidado,
              remainingBalance: summary.saldoPendiente
            };
          }
          return o;
        });
        setOrders(updatedOrders);
      }
    }
  };

  // --- Handlers: Discount Rules ---
  const handleSaveDiscountRules = (rulesToSave) => {
    const updated = actualizarReglasDescuento(rulesToSave);
    setDiscountRules(updated);
    setRulesSuccessMsg('¡Reglas de descuento actualizadas exitosamente!');
    setTimeout(() => setRulesSuccessMsg(''), 3000);
  };

  const handleAddDiscountRule = (e) => {
    e.preventDefault();
    if (!newMinPiezas || !newPorcentaje) return;
    const newRule = {
      minPiezas: parseInt(newMinPiezas, 10),
      porcentaje: parseFloat(newPorcentaje) / 100
    };
    const newRulesList = [...discountRules, newRule];
    handleSaveDiscountRules(newRulesList);
    setNewMinPiezas('');
    setNewPorcentaje('');
  };

  const handleRemoveDiscountRule = (index) => {
    const newRulesList = discountRules.filter((_, idx) => idx !== index);
    handleSaveDiscountRules(newRulesList);
  };

  // --- Handlers: Designer Proposals ---
  const handleOpenProposalModal = (order) => {
    setSelectedOrderForProposal(order);
    setNewProposalUrl(order.designerProposalUrl || '');
    setNewProposalVersion((order.disenoVersion || 1) + (order.designerProposalUrl ? 1 : 0));
    setProposalNotes('');
  };

  const handleUploadProposalSubmit = (e) => {
    e.preventDefault();
    if (!selectedOrderForProposal || !newProposalUrl.trim()) return;

    const result = cambiarEstado(
      selectedOrderForProposal,
      'Diseño Pendiente',
      activeUser,
      `Propuesta visual versión ${newProposalVersion} cargada: ${proposalNotes || 'Lista para revisión'}`
    );

    const updated = orders.map(o => {
      if (o.id === selectedOrderForProposal.id) {
        return {
          ...o,
          status: 'Diseño Pendiente',
          disenoVersion: newProposalVersion,
          designerProposalUrl: newProposalUrl,
          timeline: (result.pedido?.timeline || o.timeline).map(t => {
            if (t.step === 'Diseño Pendiente') {
              return { ...t, completed: true, current: true, date: `V${newProposalVersion} cargada` };
            }
            if (t.step === 'Diseño Confirmado') {
              return { ...t, completed: false, current: false };
            }
            return t;
          }),
          feedbackHistory: [
            ...(o.feedbackHistory || []),
            `Diseñador cargó propuesta V${newProposalVersion} (${new Date().toLocaleDateString()}): ${proposalNotes || 'Sin notas adicionales'}`
          ]
        };
      }
      return o;
    });

    setOrders(updated);
    setSelectedOrderForProposal(null);
    setNewProposalUrl('');
  };

  // --- Handlers: Production Actions ---
  const handleStartProduction = (order) => {
    const orderPayments = (pagos || []).filter(p => p.pedidoId === order.id);
    const result = cambiarEstado(order, 'En Producción', activeUser, 'Pase a taller de producción', orderPayments);
    if (!result.ok) {
      alert(result.mensaje);
      return;
    }

    const updated = orders.map(o => {
      if (o.id === order.id) {
        return {
          ...o,
          status: 'En Producción',
          timeline: o.timeline.map(t => {
            if (t.step === 'En Producción') return { ...t, completed: true, current: true, date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
            if (t.step === 'Diseño Confirmado') return { ...t, current: false };
            return t;
          })
        };
      }
      return o;
    });
    setOrders(updated);
  };

  const handleMarkReadyForDelivery = (order) => {
    const result = cambiarEstado(order, 'Listo para Entrega', activeUser, 'Producto finalizado e inspeccionado');
    if (!result.ok) {
      alert(result.mensaje);
      return;
    }

    const updated = orders.map(o => {
      if (o.id === order.id) {
        return {
          ...o,
          status: 'Listo para Entrega',
          timeline: o.timeline.map(t => {
            if (t.step === 'Listo para Entrega') return { ...t, completed: true, current: true, date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
            if (t.step === 'En Producción') return { ...t, current: false };
            return t;
          })
        };
      }
      return o;
    });
    setOrders(updated);
  };

  // --- Handlers: Quality Incidences ---
  const handleAddIncidenceSubmit = (e) => {
    e.preventDefault();
    if (!selectedOrderForIncidence || !incidenceDesc.trim()) return;

    const newIncidence = {
      id: `INC-${Date.now()}`,
      pedidoId: selectedOrderForIncidence.id,
      tipo: incidenceType,
      descripcion: incidenceDesc.trim(),
      severidad: incidenceSeverity,
      fecha: new Date().toISOString(),
      fechaFormateada: new Date().toLocaleString('es-MX'),
      registradaPor: activeUser.nombre
    };

    if (setIncidencias) {
      setIncidencias(prev => [newIncidence, ...(prev || [])]);
    }

    // Append to order feedback history
    const updated = orders.map(o => {
      if (o.id === selectedOrderForIncidence.id) {
        return {
          ...o,
          feedbackHistory: [
            ...(o.feedbackHistory || []),
            `⚠️ Incidencia de calidad registrada [${incidenceSeverity}]: ${incidenceType} - ${incidenceDesc.trim()}`
          ]
        };
      }
      return o;
    });
    setOrders(updated);

    setSelectedOrderForIncidence(null);
    setIncidenceDesc('');
  };

  // --- Handlers: Delivery Confirmation ---
  const handleExecuteDeliverOrder = () => {
    if (!orderToDeliver) return;
    const result = cambiarEstado(orderToDeliver, 'Entregado', activeUser, 'Entregado formalmente al cliente');
    if (!result.ok) {
      alert(result.mensaje);
      setOrderToDeliver(null);
      return;
    }

    const updated = orders.map(o => {
      if (o.id === orderToDeliver.id) {
        return {
          ...o,
          status: 'Entregado',
          timeline: o.timeline.map(t => {
            if (t.step === 'Entregado') return { ...t, completed: true, current: true, date: new Date().toLocaleDateString() };
            if (t.step === 'Listo para Entrega') return { ...t, current: false };
            return t;
          }),
          feedbackHistory: [
            ...(o.feedbackHistory || []),
            `Pedido entregado al cliente (${new Date().toLocaleDateString()})`
          ]
        };
      }
      return o;
    });
    setOrders(updated);
    setOrderToDeliver(null);
  };

  // --- Handlers: Order Cancellation with Confirmation ---
  const handleExecuteCancelOrder = () => {
    if (!orderToCancel) return;
    const result = cambiarEstado(
      orderToCancel, 
      'Cancelado', 
      activeUser, 
      cancelReason.trim() || 'Cancelación solicitada por el usuario'
    );

    if (!result.ok) {
      alert(result.mensaje);
      setOrderToCancel(null);
      return;
    }

    const updated = orders.map(o => {
      if (o.id === orderToCancel.id) {
        return {
          ...o,
          status: 'Cancelado',
          feedbackHistory: [
            ...(o.feedbackHistory || []),
            `Pedido cancelado: ${cancelReason.trim() || 'Sin motivo especificado'} (${new Date().toLocaleDateString()})`
          ]
        };
      }
      return o;
    });

    setOrders(updated);
    setOrderToCancel(null);
    setCancelReason('');
  };

  // --- Handlers: Catalog Product Addition ---
  const handleAddProductSubmit = (e) => {
    e.preventDefault();
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
      popularImage: '✨'
    };

    setProducts([newProd, ...products]);
    setShowAddProductModal(false);
    setNewProdName('');
  };

  return (
    <section id="dashboard-section" className="py-16 bg-roman-marble border-b border-roman-platinum min-h-[85vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header & Role Bar */}
        <div className="card-architectural p-6 shadow-card-marble flex flex-col md:flex-row md:items-center justify-between gap-4 border-2 border-roman-bronze/40">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-roman-navy text-[10px] font-headline font-bold text-roman-gold uppercase tracking-wider">
              <Shield className="w-3.5 h-3.5" />
              Gestión Interna Multi-Rol
            </div>
            <h2 className="text-2xl font-cinzel font-black text-roman-navy">
              Panel Operativo Sublimaciones Román
            </h2>
            <p className="text-xs text-slate-500">
              Vista activa: <strong className="text-roman-bronze uppercase font-bold">{currentRole}</strong>
            </p>
          </div>

          {/* Barra de Simulación de Roles (Exclusivo Administrador) */}
          {currentUser?.role === 'admin' && (
            <div className="flex flex-wrap items-center gap-2">
              {[
                { id: 'admin', label: '👑 Admin' },
                { id: 'disenador', label: '🎨 Diseñador' },
                { id: 'produccion', label: '🖨️ Producción (RN-01)' },
                { id: 'entregas', label: '🚚 Entregas Mérida' }
              ].map((r) => (
                <button
                  key={r.id}
                  onClick={() => setCurrentRole(r.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-headline font-bold uppercase transition-all ${
                    currentRole === r.id 
                      ? 'btn-relief-navy text-white shadow-md' 
                      : 'bg-roman-stone text-slate-600 border border-slate-300 hover:text-slate-900'
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="card-architectural p-5 bg-gradient-to-br from-roman-navy to-slate-900 text-white border-2 border-roman-bronze">
                <span className="text-[10px] font-headline font-bold uppercase text-roman-gold tracking-wider">Total de Ventas Acumuladas</span>
                <p className="font-cinzel font-black text-3xl mt-1 text-white">${totalSales.toLocaleString('es-MX')} MXN</p>
                <p className="text-[11px] text-slate-400 mt-1">Suma de pedidos confirmados y activos</p>
              </div>

              <div className="card-architectural p-5 bg-white border border-slate-300">
                <span className="text-[10px] font-headline font-bold uppercase text-slate-500 tracking-wider">Pagos por Validar</span>
                <p className="font-cinzel font-black text-3xl mt-1 text-amber-600">{pendingPayments.length}</p>
                <p className="text-[11px] text-slate-500 mt-1">Comprobantes pendientes de revisión SPEI/OXXO</p>
              </div>

              <div className="card-architectural p-5 bg-white border border-slate-300">
                <span className="text-[10px] font-headline font-bold uppercase text-slate-500 tracking-wider">Total de Pedidos</span>
                <p className="font-cinzel font-black text-3xl mt-1 text-roman-navy">{orders.length}</p>
                <p className="text-[11px] text-slate-500 mt-1">Registrados en la base de datos operativa</p>
              </div>
            </div>

            {/* Status breakdown grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
              {Object.entries(statusCounts).map(([st, count]) => (
                <div key={st} className="p-2.5 rounded-xl bg-white border border-slate-200 text-center shadow-sm">
                  <span className="block text-[10px] font-bold text-slate-500 truncate" title={st}>{st}</span>
                  <span className={`text-base font-bold font-mono ${
                    st === 'Cancelado' ? 'text-red-600' :
                    st === 'Entregado' ? 'text-emerald-700' :
                    st === 'En Producción' ? 'text-roman-navy' : 'text-slate-800'
                  }`}>
                    {count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Role Notices */}
        {currentRole === 'produccion' && (
          <div className="p-4 rounded-xl bg-roman-stone border border-roman-bronze text-roman-navy text-xs font-medium flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-roman-bronze shrink-0" />
            <p>
              <strong className="font-bold">Filtro de Producción Estricto:</strong> Se muestran <em>únicamente</em> pedidos con <strong>Diseño Confirmado</strong> Y un <strong>anticipo validado mínimo del 50%</strong>. No se permite imprimir sin ambos requisitos cumplidos.
            </p>
          </div>
        )}

        {currentRole === 'entregas' && (
          <div className="p-4 rounded-xl bg-roman-stone border border-slate-300 text-slate-700 text-xs font-medium flex items-center gap-3">
            <Package className="w-5 h-5 text-roman-navy shrink-0" />
            <p>
              <strong className="font-bold">Módulo de Entregas:</strong> Solo podrás marcar como <strong>"Entregado"</strong> aquellos pedidos que hayan alcanzado el estado <strong>"Listo para Entrega"</strong>. Se requerirá confirmación previa.
            </p>
          </div>
        )}

        {/* ADMIN NAVIGATION TABS */}
        {currentRole === 'admin' && (
          <div className="flex flex-wrap items-center gap-2 border-b border-slate-300 pb-3">
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-4 py-2 rounded-xl text-xs font-headline font-bold uppercase transition-colors ${
                activeTab === 'orders' ? 'bg-roman-navy text-roman-gold border border-roman-bronze' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              📦 Control de Pedidos ({orders.length})
            </button>
            <button
              onClick={() => setActiveTab('pagos')}
              className={`px-4 py-2 rounded-xl text-xs font-headline font-bold uppercase transition-colors flex items-center gap-1.5 ${
                activeTab === 'pagos' ? 'bg-roman-navy text-roman-gold border border-roman-bronze' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              💳 Validación de Pagos
              {pendingPayments.length > 0 && (
                <span className="px-1.5 py-0.5 text-[10px] rounded-full bg-amber-500 text-white font-bold">
                  {pendingPayments.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('descuentos')}
              className={`px-4 py-2 rounded-xl text-xs font-headline font-bold uppercase transition-colors ${
                activeTab === 'descuentos' ? 'bg-roman-navy text-roman-gold border border-roman-bronze' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ⚙️ Reglas de Descuento
            </button>
            <button
              onClick={() => setActiveTab('catalog')}
              className={`px-4 py-2 rounded-xl text-xs font-headline font-bold uppercase transition-colors ${
                activeTab === 'catalog' ? 'bg-roman-navy text-roman-gold border border-roman-bronze' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🛍️ Administración de Catálogo ({products.length})
            </button>
          </div>
        )}

        {/* 1. ORDERS QUEUE (Active across all roles, filtered per role) */}
        {(activeTab === 'orders' || currentRole !== 'admin') && (
          <div className="card-architectural p-6 shadow-card-marble space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-cinzel font-bold text-lg text-roman-navy flex items-center gap-2">
                <Package className="w-5 h-5 text-roman-bronze" />
                Cola de Pedidos - {currentRole.toUpperCase()} ({roleFilteredOrders.length})
              </h3>
            </div>

            {roleFilteredOrders.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-xs font-bold border border-dashed border-slate-300 rounded-xl">
                No existen pedidos pendientes en este perfil operativo.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-roman-stone uppercase text-[10px] font-headline font-bold text-roman-navy border-b border-slate-300">
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
                    {roleFilteredOrders.map((ord) => {
                      const canCancel = ['Recibido', 'En Revisión', 'Diseño Pendiente', 'Diseño Confirmado'].includes(ord.status);
                      const has50Deposit = hasValid50PercentDeposit(ord);

                      return (
                        <tr key={ord.id} className="hover:bg-slate-50 transition-colors">
                          <td className="p-3.5">
                            <span className="font-mono font-bold text-roman-navy block">{ord.id}</span>
                            <span className="text-[10px] text-slate-400">{ord.date}</span>
                            {ord.disenoVersion && (
                              <span className="text-[10px] font-semibold text-purple-700 bg-purple-50 px-1.5 py-0.2 rounded border border-purple-200 inline-block mt-0.5">
                                Versión {ord.disenoVersion}
                              </span>
                            )}
                          </td>

                          <td className="p-3.5">
                            <span className="font-bold text-slate-900 block">{ord.customerName}</span>
                            <span className="text-[10px] text-slate-500">{ord.phone}</span>
                          </td>

                          <td className="p-3.5">
                            <span className="font-bold text-slate-800 block">{ord.item} ({ord.quantity} pza)</span>
                            <span className="text-[10px] text-roman-bronze italic">"{ord.customText}"</span>
                          </td>

                          <td className="p-3.5">
                            <span className={`px-2.5 py-1 rounded text-[9px] font-headline font-bold uppercase border ${
                              ord.status === 'Diseño Confirmado' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' :
                              ord.status === 'En Producción' ? 'bg-roman-navy text-roman-gold border-roman-bronze' :
                              ord.status === 'Listo para Entrega' ? 'bg-blue-100 text-blue-800 border-blue-300' :
                              ord.status === 'Entregado' ? 'bg-slate-200 text-slate-700 border-slate-400' :
                              ord.status === 'Cancelado' ? 'bg-red-100 text-red-800 border-red-300' :
                              'bg-purple-100 text-purple-800 border-purple-300'
                            }`}>
                              {ord.status}
                            </span>
                          </td>

                          <td className="p-3.5">
                            <span className="font-bold text-slate-900 block">${ord.total} MXN</span>
                            <span className={`text-[10px] font-semibold ${has50Deposit ? 'text-emerald-700' : 'text-amber-700'}`}>
                              {has50Deposit ? '✓ Anticipo ≥50%' : '⚠️ Falta anticipo'}
                            </span>
                            <span className="block text-[10px] text-slate-500">Saldo: ${ord.remainingBalance}</span>
                          </td>

                          <td className="p-3.5 text-right space-x-2">
                            {/* DISEÑADOR ACTIONS */}
                            {currentRole === 'disenador' && (
                              <button
                                onClick={() => handleOpenProposalModal(ord)}
                                className="px-3 py-1.5 rounded-lg btn-relief-gold text-[10px] uppercase font-bold"
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
                                    className="px-3 py-1.5 rounded-lg bg-roman-navy hover:bg-slate-800 text-roman-gold text-[10px] font-bold uppercase border border-roman-bronze"
                                  >
                                    Iniciar Producción
                                  </button>
                                )}
                                {ord.status === 'En Producción' && (
                                  <button
                                    onClick={() => handleMarkReadyForDelivery(ord)}
                                    className="px-3 py-1.5 rounded-lg bg-emerald-700 text-white text-[10px] font-bold hover:bg-emerald-600 transition-all uppercase"
                                  >
                                    Listo Entrega
                                  </button>
                                )}
                                <button
                                  onClick={() => setSelectedOrderForIncidence(ord)}
                                  className="px-2.5 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 text-[10px] font-bold uppercase"
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
                                    className="px-3 py-1.5 rounded-lg btn-relief-gold text-[10px] uppercase font-bold"
                                  >
                                    Marcar Entregado
                                  </button>
                                ) : (
                                  <span className="text-[10px] text-emerald-700 font-bold uppercase">
                                    ✓ Entregado
                                  </span>
                                )}
                              </>
                            )}

                            {/* ADMIN ACTIONS: Cancel order button with confirmation */}
                            {currentRole === 'admin' && canCancel && (
                              <button
                                onClick={() => setOrderToCancel(ord)}
                                className="px-2.5 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 border border-red-300 text-[10px] font-bold uppercase"
                                title="Cancelar Pedido (Solo antes de Producción)"
                              >
                                Cancelar
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* 2. ADMIN TAB: VALIDACIÓN DE PAGOS */}
        {activeTab === 'pagos' && currentRole === 'admin' && (
          <div className="card-architectural p-6 shadow-card-marble space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-cinzel font-bold text-lg text-roman-navy">
                  Validación de Pagos y Comprobantes
                </h3>
                <p className="text-xs text-slate-500">
                  Revisa los depósitos SPEI / transferencias registrados y valídalos para habilitar el pase a producción.
                </p>
              </div>
            </div>

            {(pagos || []).length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-xs font-bold border border-dashed border-slate-300 rounded-xl">
                No hay pagos registrados en el sistema.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-roman-stone uppercase text-[10px] font-headline font-bold text-roman-navy border-b border-slate-300">
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
                    {(pagos || []).map((pago) => {
                      const isPending = pago.estado === 'Pendiente' || pago.estado === 'Pendiente de validación';
                      return (
                        <tr key={pago.id} className="hover:bg-slate-50 transition-colors">
                          <td className="p-3.5">
                            <span className="font-mono font-bold text-slate-900 block">{pago.id}</span>
                            <span className="text-[10px] text-slate-400">{pago.fechaFormateada || pago.fecha}</span>
                          </td>

                          <td className="p-3.5">
                            <span className="font-mono font-bold text-roman-navy">{pago.pedidoId}</span>
                            <span className="block text-[10px] text-slate-500">Por: {pago.registradoPor || 'Cliente'}</span>
                          </td>

                          <td className="p-3.5">
                            <span className="font-black text-sm text-slate-900 block">${pago.monto} MXN</span>
                            <span className="text-[10px] uppercase text-roman-bronze font-semibold">{pago.metodo}</span>
                          </td>

                          <td className="p-3.5">
                            <div className="flex items-center gap-1.5 text-slate-700">
                              <FileText className="w-4 h-4 text-roman-bronze" />
                              <span className="truncate max-w-[140px] text-[11px]" title={pago.comprobanteNombre}>
                                {pago.comprobanteNombre || 'Ficha de pago'}
                              </span>
                            </div>
                          </td>

                          <td className="p-3.5">
                            <span className={`px-2.5 py-1 rounded text-[9px] font-headline font-bold uppercase border ${
                              pago.estado === 'Validado' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' :
                              pago.estado === 'Rechazado' ? 'bg-red-100 text-red-800 border-red-300' :
                              'bg-amber-100 text-amber-800 border-amber-300'
                            }`}>
                              ● {pago.estado}
                            </span>
                            {pago.motivoRechazo && (
                              <p className="text-[10px] text-red-600 mt-1 italic">{pago.motivoRechazo}</p>
                            )}
                          </td>

                          <td className="p-3.5 text-right space-x-2">
                            {isPending ? (
                              <>
                                <button
                                  onClick={() => handleValidatePayment(pago.id, 'validar')}
                                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-headline text-[10px] uppercase font-bold"
                                >
                                  Validar
                                </button>
                                <button
                                  onClick={() => {
                                    const motivo = prompt('Ingresa el motivo del rechazo del pago:') || '';
                                    handleValidatePayment(pago.id, 'rechazar', motivo);
                                  }}
                                  className="px-3 py-1.5 rounded-lg bg-red-100 hover:bg-red-200 text-red-700 border border-red-300 font-headline text-[10px] uppercase font-bold"
                                >
                                  Rechazar
                                </button>
                              </>
                            ) : (
                              <span className="text-[10px] text-slate-400 font-bold uppercase">
                                Procesado ({pago.validadoPor || 'Admin'})
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* 3. ADMIN TAB: REGLAS DE DESCUENTO EDITABLES */}
        {activeTab === 'descuentos' && currentRole === 'admin' && (
          <div className="card-architectural p-6 shadow-card-marble space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-cinzel font-bold text-lg text-roman-navy">
                  Configuración de Reglas de Descuento por Volumen
                </h3>
                <p className="text-xs text-slate-500">
                  Edita los rangos mínimos de piezas y los porcentajes que se aplicarán automáticamente en las cotizaciones.
                </p>
              </div>
            </div>

            {rulesSuccessMsg && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{rulesSuccessMsg}</span>
              </div>
            )}

            {/* Current rules list */}
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-roman-stone uppercase text-[10px] font-headline font-bold text-roman-navy border-b border-slate-300">
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
                        <span className="px-2.5 py-1 rounded bg-emerald-100 text-emerald-800 font-bold border border-emerald-300">
                          {Math.round(r.porcentaje * 100)}% de Descuento
                        </span>
                      </td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => handleRemoveDiscountRule(idx)}
                          className="text-slate-400 hover:text-red-600 p-1"
                          title="Eliminar regla"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Add new rule form */}
            <form onSubmit={handleAddDiscountRule} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <h4 className="font-headline font-bold text-xs uppercase text-roman-navy">Agregar Nueva Regla:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-600 uppercase block mb-1">Mínimo de piezas:</label>
                  <input
                    type="number"
                    min="1"
                    required
                    placeholder="Ej. 20"
                    value={newMinPiezas}
                    onChange={(e) => setNewMinPiezas(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-800"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-600 uppercase block mb-1">Porcentaje (%):</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    required
                    placeholder="Ej. 20 (para 20%)"
                    value={newPorcentaje}
                    onChange={(e) => setNewPorcentaje(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-800"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-lg btn-relief-gold text-xs font-headline uppercase font-bold"
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
          <div className="card-architectural p-6 shadow-card-marble space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-cinzel font-bold text-lg text-roman-navy">Administración de Catálogo</h3>
              <button
                onClick={() => setShowAddProductModal(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl btn-relief-gold text-xs font-headline tracking-wider uppercase"
              >
                <Plus className="w-4 h-4 text-roman-navy" />
                <span>Nuevo Producto</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((p) => (
                <div key={p.id} className="p-4 rounded-xl bg-roman-stone border border-slate-300 flex items-center justify-between">
                  <div>
                    <h4 className="font-cinzel font-bold text-sm text-roman-navy">{p.name}</h4>
                    <p className="text-xs text-roman-bronze font-bold">${p.price} MXN • {p.productionTime}</p>
                  </div>
                  <span className="text-2xl">{p.popularImage}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MODAL: Subir / Actualizar Versión Propuesta (Diseñador) */}
        {selectedOrderForProposal && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white border-2 border-roman-bronze rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
              <h3 className="font-cinzel font-bold text-base text-roman-navy">
                Cargar Propuesta Gráfica ({selectedOrderForProposal.id})
              </h3>
              <p className="text-xs text-slate-600">
                Sube o actualiza la versión del render digital para someterlo a aprobación del cliente (RN-01).
              </p>

              <form onSubmit={handleUploadProposalSubmit} className="space-y-4">
                <div>
                  <label className="text-[10px] font-headline font-bold text-slate-700 uppercase block mb-1">
                    Versión del Diseño:
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={newProposalVersion}
                    onChange={(e) => setNewProposalVersion(parseInt(e.target.value, 10) || 1)}
                    className="w-full bg-roman-stone border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-headline font-bold text-slate-700 uppercase block mb-1">
                    URL de la Muestra / Mockup:
                  </label>
                  <input
                    type="url"
                    required
                    placeholder="https://images.unsplash.com/..."
                    value={newProposalUrl}
                    onChange={(e) => setNewProposalUrl(e.target.value)}
                    className="w-full bg-roman-stone border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-headline font-bold text-slate-700 uppercase block mb-1">
                    Observaciones para el Cliente:
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Ej. Se ajustó el color de la tipografía a dorado y se alineó el imagotipo central..."
                    value={proposalNotes}
                    onChange={(e) => setProposalNotes(e.target.value)}
                    className="w-full bg-roman-stone border border-slate-300 rounded-xl p-2.5 text-xs text-slate-800"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedOrderForProposal(null)}
                    className="px-3 py-1.5 text-xs text-slate-500 font-bold"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl btn-relief-gold text-xs uppercase font-bold"
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
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white border-2 border-amber-500 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
              <h3 className="font-cinzel font-bold text-base text-roman-navy flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                Registrar Incidencia de Calidad ({selectedOrderForIncidence.id})
              </h3>
              <p className="text-xs text-slate-600">
                Reporta cualquier defecto detectado durante la impresión o prensado en taller.
              </p>

              <form onSubmit={handleAddIncidenceSubmit} className="space-y-4">
                <div>
                  <label className="text-[10px] font-headline font-bold text-slate-700 uppercase block mb-1">
                    Tipo de Incidencia:
                  </label>
                  <select
                    value={incidenceType}
                    onChange={(e) => setIncidenceType(e.target.value)}
                    className="w-full bg-roman-stone border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800"
                  >
                    <option value="Defecto de Impresión">Defecto de Impresión (Mancha / Tinta corrida)</option>
                    <option value="Error de Alineación">Error de Alineación o Centrado</option>
                    <option value="Defecto en Material">Defecto Físico en Producto Base</option>
                    <option value="Variación de Color">Variación de Color vs Muestra</option>
                    <option value="Otro">Otro Motivo</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-headline font-bold text-slate-700 uppercase block mb-1">
                    Severidad:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Baja', 'Media', 'Alta'].map((sev) => (
                      <button
                        key={sev}
                        type="button"
                        onClick={() => setIncidenceSeverity(sev)}
                        className={`py-1.5 rounded-lg text-xs font-bold transition-all ${
                          incidenceSeverity === sev 
                            ? 'bg-amber-600 text-white shadow-sm' 
                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}
                      >
                        {sev}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-headline font-bold text-slate-700 uppercase block mb-1">
                    Descripción del Problema:
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Detalla lo ocurrido durante el proceso de sublimado..."
                    value={incidenceDesc}
                    onChange={(e) => setIncidenceDesc(e.target.value)}
                    className="w-full bg-roman-stone border border-slate-300 rounded-xl p-2.5 text-xs text-slate-800"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedOrderForIncidence(null)}
                    className="px-3 py-1.5 text-xs text-slate-500 font-bold"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-headline text-xs uppercase font-bold"
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
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white border-2 border-roman-bronze rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
              <h3 className="font-cinzel font-bold text-base text-roman-navy">
                Confirmar Entrega de Pedido
              </h3>
              <p className="text-sm text-slate-700">
                ¿Confirmar que el pedido <strong>{orderToDeliver.id}</strong> ({orderToDeliver.customerName}) ha sido entregado formalmente al cliente?
              </p>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setOrderToDeliver(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-900 border border-slate-300 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleExecuteDeliverOrder}
                  className="px-5 py-2.5 rounded-xl btn-relief-gold text-xs uppercase font-bold"
                >
                  Confirmar Entrega
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL DE CONFIRMACIÓN: Cancelar Pedido (Cualquier vista que lo permita) */}
        {orderToCancel && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white border-2 border-red-500 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
              <h3 className="font-cinzel font-bold text-base text-red-700 flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                Confirmar Cancelación de Pedido
              </h3>
              <p className="text-sm text-slate-700">
                ¿Estás seguro de cancelar el pedido <strong>{orderToCancel.id}</strong>? Esta acción no se puede deshacer.
              </p>
              <div>
                <label className="text-[10px] font-bold text-slate-600 uppercase block mb-1">
                  Motivo de Cancelación (Opcional):
                </label>
                <input
                  type="text"
                  placeholder="Ej. Solicitud del cliente por cambio de planes"
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="w-full bg-roman-stone border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800"
                />
              </div>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => { setOrderToCancel(null); setCancelReason(''); }}
                  className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-900 border border-slate-300 rounded-xl"
                >
                  Regresar
                </button>
                <button
                  onClick={handleExecuteCancelOrder}
                  className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-headline uppercase font-bold"
                >
                  Confirmar Cancelación
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: Agregar Nuevo Producto al Catálogo */}
        {showAddProductModal && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white border-2 border-roman-bronze rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
              <h3 className="font-cinzel font-bold text-base text-roman-navy">Agregar Nuevo Producto</h3>
              <form onSubmit={handleAddProductSubmit} className="space-y-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-700 uppercase block mb-1">Nombre del Producto:</label>
                  <input
                    type="text"
                    required
                    value={newProdName}
                    onChange={(e) => setNewProdName(e.target.value)}
                    className="w-full bg-roman-stone border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-700 uppercase block mb-1">Categoría:</label>
                  <select
                    value={newProdCategory}
                    onChange={(e) => setNewProdCategory(e.target.value)}
                    className="w-full bg-roman-stone border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800"
                  >
                    <option value="Tazas y Vasos">Tazas y Vasos</option>
                    <option value="Textil">Textil</option>
                    <option value="Decoración & Hogar">Decoración & Hogar</option>
                    <option value="Accesorios">Accesorios</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-slate-700 uppercase block mb-1">Precio Unitario ($):</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={newProdPrice}
                      onChange={(e) => setNewProdPrice(e.target.value)}
                      className="w-full bg-roman-stone border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-700 uppercase block mb-1">Tiempo Producción:</label>
                    <input
                      type="text"
                      required
                      value={newProdTime}
                      onChange={(e) => setNewProdTime(e.target.value)}
                      className="w-full bg-roman-stone border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-end gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowAddProductModal(false)}
                    className="px-3 py-1.5 text-xs text-slate-500 font-bold"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl btn-relief-gold text-xs uppercase font-bold"
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
  );
}
