import React, { useState } from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import ProductCatalog from './components/ProductCatalog';
import CustomizerModal from './components/CustomizerModal';
import OrderTracker from './components/OrderTracker';
import PaymentModal from './components/PaymentModal';
import LocationMap from './components/LocationMap';
import AdminDashboard from './components/AdminDashboard';
import CartDrawer from './components/CartDrawer';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';

import { 
  PRODUCTOS_INICIALES, 
  PEDIDOS_INICIALES, 
  PAGOS_INICIALES, 
  INCIDENCIAS_INICIALES 
} from './services/datos.js';
import { registrarPago } from './services/pagos.js';

export default function App() {
  // Global App States
  const [activeTab, setActiveTab] = useState('inicio');
  const [currentRole, setCurrentRole] = useState('cliente');
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  
  // Data States (initialized from centralized relational services)
  const [products, setProducts] = useState(PRODUCTOS_INICIALES);
  const [orders, setOrders] = useState(PEDIDOS_INICIALES);
  const [pagos, setPagos] = useState(PAGOS_INICIALES);
  const [incidencias, setIncidencias] = useState(INCIDENCIAS_INICIALES);
  const [cartItems, setCartItems] = useState([]);

  // Modals & Drawers States
  const [customizingProduct, setCustomizingProduct] = useState(null);
  const [paymentModalOrder, setPaymentModalOrder] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Cart Operations
  const handleAddToCart = (item) => {
    setCartItems(prev => [...prev, item]);
    setIsCartOpen(true);
  };

  const handleRemoveCartItem = (index) => {
    setCartItems(prev => prev.filter((_, idx) => idx !== index));
  };

  // Order Creation from Checkout: Single order with folio ROM-AAAA-NNNN in status 'Recibido'
  const handleCheckout = (items, subtotal) => {
    const newFolio = `ROM-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const itemsDescription = items.map(i => `${i.name} (x${i.quantity})`).join(', ');
    const totalPieces = items.reduce((sum, i) => sum + (i.quantity || 1), 0);
    const mainItem = items[0] || {};

    const newOrder = {
      id: newFolio,
      customerName: currentUser?.nombre || 'Cliente Estimado',
      phone: currentUser?.telefono || '9995554433',
      date: new Date().toISOString().split('T')[0],
      item: itemsDescription,
      quantity: totalPieces,
      total: subtotal,
      depositPaid: 0,
      remainingBalance: subtotal,
      customText: items.map(i => i.customText).filter(Boolean).join(' | ') || mainItem.customText || 'Mi Diseño Personalizado',
      status: 'Recibido',
      disenoConfirmado: false,
      disenoVersion: 1,
      designerProposalUrl: null,
      timeline: [
        { step: 'Recibido', date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), completed: true, current: true },
        { step: 'En Revisión', date: 'Asignando Diseñador', completed: false },
        { step: 'Diseño Pendiente', date: '-', completed: false },
        { step: 'Diseño Confirmado', date: 'Esperando RN-01', completed: false },
        { step: 'En Producción', date: '-', completed: false },
        { step: 'Listo para Entrega', date: '-', completed: false },
        { step: 'Entregado', date: '-', completed: false }
      ],
      feedbackHistory: [
        `Pedido registrado con folio único ${newFolio} en estado Recibido.`,
        `Desglose: ${itemsDescription}. Total cotizado: $${subtotal} MXN.`
      ]
    };

    setOrders(prev => [newOrder, ...prev]);
    setCartItems([]);
    setActiveTab('rastrear');
  };

  // Payment Registration: Registers as 'Pendiente de validación'
  const handleRegisterPayment = (orderId, amountPaid, newRemaining, paymentData) => {
    const nuevoPago = registrarPago({
      pedidoId: orderId,
      monto: amountPaid,
      metodo: paymentData?.metodo || 'transfer',
      comprobanteNombre: paymentData?.comprobanteNombre || 'comprobante_pago.pdf',
      usuario: currentUser
    });

    setPagos(prev => [nuevoPago, ...(prev || [])]);

    setOrders(prev => prev.map(ord => {
      if (ord.id === orderId) {
        return {
          ...ord,
          feedbackHistory: [
            ...(ord.feedbackHistory || []),
            `Comprobante de pago registrado por $${amountPaid} MXN (${nuevoPago.estado} por Administración)`
          ]
        };
      }
      return ord;
    }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-roman-dark text-slate-100 font-body">
      
      {/* Header */}
      <Header
        cartCount={cartItems.length}
        onOpenCart={() => setIsCartOpen(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentRole={currentRole}
        setCurrentRole={setCurrentRole}
        activeOrdersCount={orders.length}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        currentUser={currentUser}
        onLogout={() => setCurrentUser(null)}
      />

      {/* Main Content Area based on activeTab */}
      <main className="flex-1">
        {activeTab === 'inicio' && (
          <HeroSection />
        )}

        {activeTab === 'catalogo' && (
          <ProductCatalog
            onSelectProductToCustomize={(product) => setCustomizingProduct(product)}
          />
        )}

        {activeTab === 'personalizar' && (
          <div className="py-12 px-4 max-w-7xl mx-auto">
            <div className="text-center space-y-4 mb-8">
              <h2 className="text-3xl font-extrabold font-headline">Selecciona un producto para abrir el <span className="text-roman-gold">Estudio 2D</span></h2>
              <p className="text-slate-400 text-xs">Elige cualquier ítem del catálogo para comenzar a editar su texto, color y archivo de referencia.</p>
            </div>
            <ProductCatalog
              onSelectProductToCustomize={(product) => setCustomizingProduct(product)}
            />
          </div>
        )}

        {activeTab === 'rastrear' && (
          <OrderTracker
            orders={orders}
            setOrders={setOrders}
            onOpenPaymentModal={(order) => setPaymentModalOrder(order)}
          />
        )}

        {activeTab === 'ubicacion' && (
          <LocationMap />
        )}

        {activeTab === 'dashboard' && (
          <AdminDashboard
            currentRole={currentRole}
            setCurrentRole={setCurrentRole}
            orders={orders}
            setOrders={setOrders}
            products={products}
            setProducts={setProducts}
            pagos={pagos}
            setPagos={setPagos}
            incidencias={incidencias}
            setIncidencias={setIncidencias}
            currentUser={currentUser || { role: currentRole, nombre: `Operador (${currentRole})` }}
          />
        )}
      </main>

      {/* Product Customizer Modal */}
      {customizingProduct && (
        <CustomizerModal
          product={customizingProduct}
          onClose={() => setCustomizingProduct(null)}
          onAddToCart={handleAddToCart}
        />
      )}

      {/* Payment Deposit Modal */}
      {paymentModalOrder && (
        <PaymentModal
          order={paymentModalOrder}
          onClose={() => setPaymentModalOrder(null)}
          onRegisterPayment={handleRegisterPayment}
        />
      )}

      {/* Sliding Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onRemoveItem={handleRemoveCartItem}
        onCheckout={handleCheckout}
      />

      {/* Authentication Modal */}
      {isAuthModalOpen && (
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          onLoginExitoso={(user) => {
            setCurrentUser(user);
            if (user?.role && user.role !== 'cliente') {
              setCurrentRole(user.role);
            }
          }}
          currentUser={currentUser}
        />
      )}

      {/* Footer */}
      <Footer onNavigate={(tab) => setActiveTab(tab)} />

    </div>
  );
}
