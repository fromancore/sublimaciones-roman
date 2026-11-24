import React, { useEffect, useState } from 'react'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import Header from './components/Header'
import HeroSection from './components/HeroSection'
import ProductCatalog from './components/ProductCatalog'
import CustomizerModal from './components/CustomizerModal'
import OrderTracker from './components/OrderTracker'
import PaymentModal from './components/PaymentModal'
import LocationMap from './components/LocationMap'
import AdminDashboard from './components/AdminDashboard'
import CartDrawer from './components/CartDrawer'
import Footer from './components/Footer'
import AuthModal from './components/AuthModal'

import {
  PRODUCTOS_INICIALES,
  PEDIDOS_INICIALES,
  PAGOS_INICIALES,
  INCIDENCIAS_INICIALES,
} from './services/datos.js'
import { registrarPago } from './services/pagos.js'
import {
  crearPerfilUsuario,
  esAdminAutorizado,
  puedeAccederPanel,
} from './services/autorizacion.js'
import { getFirebaseAuth, isFirebaseConfigured } from './services/firebase.js'

export default function App() {
  // Global App States
  const [activeTab, setActiveTab] = useState('inicio')
  const [currentRole, setCurrentRole] = useState('cliente')
  const [currentUser, setCurrentUser] = useState(null)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [authError, setAuthError] = useState('')

  useEffect(() => {
    if (!isFirebaseConfigured()) return undefined

    const auth = getFirebaseAuth()
    return onAuthStateChanged(
      auth,
      user => {
        if (user && !user.emailVerified) {
          setCurrentUser(null)
          setCurrentRole('cliente')
          setActiveTab(tab => (tab === 'dashboard' ? 'inicio' : tab))
          signOut(auth).catch(error => {
            console.error('No se pudo cerrar la sesión sin verificar:', error)
            setAuthError('No se pudo cerrar una sesión con correo sin verificar.')
          })
          return
        }

        const perfil = user ? crearPerfilUsuario(user) : null
        setCurrentUser(perfil)
        setCurrentRole(perfil?.role || 'cliente')
        setAuthError('')
        if (!perfil) setActiveTab(tab => (tab === 'dashboard' ? 'inicio' : tab))
      },
      error => {
        console.error('No se pudo comprobar la sesión de Firebase:', error)
        setAuthError('No se pudo comprobar tu sesión. Recarga la página e intenta de nuevo.')
      }
    )
  }, [])

  const handleSetActiveTab = tab => {
    if (tab === 'dashboard' && !puedeAccederPanel(currentUser)) {
      if (!currentUser) setIsAuthModalOpen(true)
      return
    }
    setActiveTab(tab)
  }

  const handleSetCurrentRole = role => {
    const rolesValidos = ['cliente', 'admin', 'disenador', 'produccion', 'entregas']
    if (!rolesValidos.includes(role)) return
    if (!esAdminAutorizado(currentUser) && role !== currentUser?.role) return
    setCurrentRole(role)
  }

  const handleLogout = async () => {
    try {
      await signOut(getFirebaseAuth())
    } catch (error) {
      console.error('No se pudo cerrar la sesión:', error)
      window.alert('No se pudo cerrar la sesión. Intenta de nuevo.')
    }
  }

  // Data States (initialized from centralized relational services)
  const [products, setProducts] = useState(PRODUCTOS_INICIALES)
  const [orders, setOrders] = useState(PEDIDOS_INICIALES)
  const [pagos, setPagos] = useState(PAGOS_INICIALES)
  const [incidencias, setIncidencias] = useState(INCIDENCIAS_INICIALES)
  const [cartItems, setCartItems] = useState([])

  // Modals & Drawers States
  const [customizingProduct, setCustomizingProduct] = useState(null)
  const [paymentModalOrder, setPaymentModalOrder] = useState(null)
  const [isCartOpen, setIsCartOpen] = useState(false)

  // Cart Operations
  const handleAddToCart = item => {
    setCartItems(prev => [...prev, item])
    setIsCartOpen(true)
  }

  const handleRemoveCartItem = index => {
    setCartItems(prev => prev.filter((_, idx) => idx !== index))
  }

  // Order Creation from Checkout: Single order with folio ROM-AAAA-NNNN in status 'Recibido'
  const handleCheckout = (items, subtotal) => {
    const newFolio = `ROM-2026-${Math.floor(1000 + Math.random() * 9000)}`
    const itemsDescription = items
      .map(i => {
        const variants = [
          i.selectedColorName,
          i.selectedNeckType,
          i.selectedSize && `Talla ${i.selectedSize}`,
        ].filter(Boolean)
        return `${i.name}${variants.length ? ` (${variants.join(', ')})` : ''} (x${i.quantity})`
      })
      .join(', ')
    const totalPieces = items.reduce((sum, i) => sum + (i.quantity || 1), 0)
    const mainItem = items[0] || {}

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
      customText:
        items
          .map(i => i.customText)
          .filter(Boolean)
          .join(' | ') ||
        mainItem.customText ||
        'Mi Diseño Personalizado',
      fontFamily: mainItem.fontFamily || null,
      customizations: items.map(item => ({
        name: item.name,
        customText: item.customText,
        fontFamily: item.fontFamily || null,
        textColor: item.textColor,
        selectedColor: item.selectedColor,
        selectedColorName: item.selectedColorName || null,
        selectedNeckType: item.selectedNeckType || null,
        selectedSize: item.selectedSize || null,
      })),
      status: 'Recibido',
      disenoConfirmado: false,
      disenoVersion: 1,
      designerProposalUrl: null,
      timeline: [
        {
          step: 'Recibido',
          date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          completed: true,
          current: true,
        },
        { step: 'En Revisión', date: 'Asignando Diseñador', completed: false },
        { step: 'Diseño Pendiente', date: '-', completed: false },
        { step: 'Diseño Confirmado', date: 'Esperando RN-01', completed: false },
        { step: 'En Producción', date: '-', completed: false },
        { step: 'Listo para Entrega', date: '-', completed: false },
        { step: 'Entregado', date: '-', completed: false },
      ],
      feedbackHistory: [
        `Pedido registrado con folio único ${newFolio} en estado Recibido.`,
        `Desglose: ${itemsDescription}. Total cotizado: $${subtotal} MXN.`,
      ],
    }

    setOrders(prev => [newOrder, ...prev])
    setCartItems([])
    setActiveTab('rastrear')
  }

  // Payment Registration: Registers as 'Pendiente de validación'
  const handleRegisterPayment = (orderId, amountPaid, newRemaining, paymentData) => {
    const nuevoPago = registrarPago({
      pedidoId: orderId,
      monto: amountPaid,
      metodo: paymentData?.metodo || 'transfer',
      comprobanteNombre: paymentData?.comprobanteNombre || 'comprobante_pago.pdf',
      usuario: currentUser,
    })

    setPagos(prev => [nuevoPago, ...(prev || [])])

    setOrders(prev =>
      prev.map(ord => {
        if (ord.id === orderId) {
          return {
            ...ord,
            feedbackHistory: [
              ...(ord.feedbackHistory || []),
              `Comprobante de pago registrado por $${amountPaid} MXN (${nuevoPago.estado} por Administración)`,
            ],
          }
        }
        return ord
      })
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-roman-dark font-body text-slate-100">
      {/* Header */}
      <Header
        cartCount={cartItems.length}
        onOpenCart={() => setIsCartOpen(true)}
        activeTab={activeTab}
        setActiveTab={handleSetActiveTab}
        currentRole={currentRole}
        setCurrentRole={handleSetCurrentRole}
        activeOrdersCount={orders.length}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* Main Content Area based on activeTab */}
      <main className="flex-1">
        {authError && (
          <p role="alert" className="bg-rose-100 px-4 py-3 text-center text-sm text-rose-800">
            {authError}
          </p>
        )}
        {activeTab === 'inicio' && <HeroSection />}

        {activeTab === 'catalogo' && (
          <ProductCatalog onSelectProductToCustomize={product => setCustomizingProduct(product)} />
        )}

        {activeTab === 'personalizar' && (
          <div className="mx-auto max-w-7xl px-4 py-12">
            <div className="mb-8 space-y-4 text-center">
              <h2 className="font-headline text-3xl font-extrabold">
                Selecciona un producto para abrir el{' '}
                <span className="text-roman-gold">Estudio 2D</span>
              </h2>
              <p className="text-xs text-slate-400">
                Elige cualquier ítem del catálogo para comenzar a editar su texto, color y archivo
                de referencia.
              </p>
            </div>
            <ProductCatalog
              onSelectProductToCustomize={product => setCustomizingProduct(product)}
            />
          </div>
        )}

        {activeTab === 'rastrear' && (
          <OrderTracker
            orders={orders}
            setOrders={setOrders}
            onOpenPaymentModal={order => setPaymentModalOrder(order)}
          />
        )}

        {activeTab === 'ubicacion' && <LocationMap />}

        {activeTab === 'dashboard' && puedeAccederPanel(currentUser) && (
          <AdminDashboard
            currentRole={currentRole}
            setCurrentRole={handleSetCurrentRole}
            orders={orders}
            setOrders={setOrders}
            products={products}
            setProducts={setProducts}
            pagos={pagos}
            setPagos={setPagos}
            incidencias={incidencias}
            setIncidencias={setIncidencias}
            currentUser={currentUser}
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
          onLoginExitoso={user => {
            setCurrentUser(user)
            setCurrentRole(user?.role || 'cliente')
            setAuthError('')
          }}
        />
      )}

      {/* Footer */}
      <Footer onNavigate={handleSetActiveTab} />
    </div>
  )
}
