import React from 'react'
import { X, ShoppingBag, Trash2, ArrowRight, ShieldCheck, Columns } from 'lucide-react'
import confetti from 'canvas-confetti'
import { FUENTES_DISENO } from '../services/fuentes.js'

export default function CartDrawer({ isOpen, onClose, cartItems, onRemoveItem, onCheckout }) {
  if (!isOpen) return null

  const subtotal = cartItems.reduce((acc, item) => acc + item.totalPrice, 0)

  const handleCheckoutSubmit = () => {
    if (cartItems.length === 0) return

    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.5 },
    })

    onCheckout(cartItems, subtotal)
    onClose()
  }

  return (
    <div className="animate-fadeIn fixed inset-0 z-50 overflow-hidden bg-roman-navy/70 backdrop-blur-sm">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div className="flex w-screen max-w-md flex-col border-l-2 border-roman-bronze bg-white shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-roman-bronze/40 bg-roman-navy px-6 py-5 text-white">
            <div className="flex items-center gap-3">
              <ShoppingBag className="h-5 w-5 text-roman-gold" />
              <h2 className="font-cinzel text-lg font-bold">Carrito de Compras</h2>
              <span className="rounded bg-roman-gold px-2 py-0.5 text-xs font-bold text-roman-navy">
                {cartItems.length}
              </span>
            </div>

            <button onClick={onClose} className="p-1 text-slate-300 hover:text-white">
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 space-y-4 overflow-y-auto bg-roman-stone/40 p-6">
            {cartItems.length === 0 ? (
              <div className="space-y-4 py-20 text-center">
                <ShoppingBag className="mx-auto h-12 w-12 text-slate-400" />
                <p className="text-sm font-semibold text-slate-600">
                  Tu carrito de compras está vacío.
                </p>
                <p className="mx-auto max-w-xs text-xs text-slate-500">
                  Explora nuestro catálogo y personaliza tazas, termos o playeras con la calidad
                  Sublimaciones Román.
                </p>
              </div>
            ) : (
              cartItems.map((item, idx) => {
                const totalBase = (item.basePrice || item.finalUnitPrice || 0) * item.quantity
                const discountAmount = Math.max(0, totalBase - item.totalPrice)
                const discountPercent =
                  totalBase > 0 ? Math.round((discountAmount / totalBase) * 100) : 0

                return (
                  <div
                    key={idx}
                    className="card-architectural relative space-y-3 border border-slate-300 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-cinzel text-sm font-bold text-roman-navy">
                          {item.name}
                        </h3>
                        <p className="text-[11px] font-semibold text-roman-bronze">
                          Cant: {item.quantity} pza{' '}
                          {item.selectedSize ? `• Talla: ${item.selectedSize}` : ''}
                        </p>
                      </div>

                      <button
                        onClick={() => onRemoveItem(idx)}
                        className="p-1 text-slate-400 transition-colors hover:text-rose-600"
                        title="Eliminar producto"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Pricing Breakdown per item */}
                    <div className="grid grid-cols-2 gap-2 rounded border border-slate-200 bg-slate-50 p-2 text-[11px]">
                      <div>
                        <span className="block text-[10px] text-slate-500">Precio Unitario:</span>
                        <span className="font-semibold text-slate-800">
                          ${item.basePrice || item.finalUnitPrice} MXN
                        </span>
                      </div>
                      <div>
                        <span className="block text-[10px] text-slate-500">
                          Descuento Aplicado:
                        </span>
                        <span
                          className={`font-semibold ${discountAmount > 0 ? 'text-emerald-700' : 'text-slate-400'}`}
                        >
                          {discountAmount > 0
                            ? `-$${discountAmount} MXN (${discountPercent}%)`
                            : '$0 MXN'}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1 rounded border border-slate-200 bg-roman-stone p-2.5 text-xs text-slate-700">
                      {item.customText && (
                        <p>
                          <strong className="text-roman-navy">Texto:</strong> "{item.customText}"
                        </p>
                      )}
                      {item.fontFamily && (
                        <p>
                          <strong className="text-roman-navy">Tipografía:</strong>{' '}
                          <span
                            style={{
                              fontFamily:
                                FUENTES_DISENO.find(font => font.name === item.fontFamily)
                                  ?.fontStack || item.fontFamily,
                            }}
                          >
                            {item.fontFamily}
                          </span>
                        </p>
                      )}
                      {item.uploadedFileName && (
                        <p>
                          <strong className="text-emerald-700">Archivo:</strong>{' '}
                          {item.uploadedFileName}
                        </p>
                      )}
                      <p>
                        <strong className="text-slate-500">Tiempo de producción:</strong>{' '}
                        {item.productionTime}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-1 text-xs">
                      <span className="text-[10px] font-bold uppercase text-slate-500">
                        Total Ítem:
                      </span>
                      <span className="font-cinzel text-base font-black text-roman-navy">
                        ${item.totalPrice} MXN
                      </span>
                    </div>
                  </div>
                )
              })
            )}
          </div>

          {/* Footer Summary */}
          {cartItems.length > 0 && (
            <div className="space-y-4 border-t border-slate-200 bg-white p-6">
              <div className="space-y-2 text-xs text-slate-700">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-bold text-roman-navy">${subtotal} MXN</span>
                </div>
                <div className="flex justify-between font-semibold text-emerald-700">
                  <span>Anticipo del 50%:</span>
                  <span>${Math.round(subtotal * 0.5)} MXN</span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-2 font-cinzel text-base font-bold text-roman-navy">
                  <span>Total a Pagar:</span>
                  <span className="text-xl text-roman-bronze">${subtotal} MXN</span>
                </div>
              </div>

              <div className="flex items-center gap-2 rounded border border-slate-300 bg-roman-stone p-2.5 text-[11px] text-slate-700">
                <ShieldCheck className="h-4 w-4 shrink-0 text-roman-navy" />
                <span>Cumple la Regla RN-01: Recibirás una muestra previa para autorizar.</span>
              </div>

              <button
                onClick={handleCheckoutSubmit}
                className="btn-relief-gold flex w-full items-center justify-center gap-2 rounded-xl py-4 font-headline text-xs uppercase tracking-widest"
              >
                <span>PROCESAR PEDIDO Y GENERAR FOLIO</span>
                <ArrowRight className="h-4 w-4 text-roman-navy" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
