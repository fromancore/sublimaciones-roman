import React from 'react';
import { X, ShoppingBag, Trash2, ArrowRight, ShieldCheck, Columns } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function CartDrawer({ isOpen, onClose, cartItems, onRemoveItem, onCheckout }) {
  if (!isOpen) return null;

  const subtotal = cartItems.reduce((acc, item) => acc + item.totalPrice, 0);

  const handleCheckoutSubmit = () => {
    if (cartItems.length === 0) return;

    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.5 }
    });

    onCheckout(cartItems, subtotal);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-roman-navy/70 backdrop-blur-sm animate-fadeIn">
      <div className="absolute inset-0" onClick={onClose}></div>

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l-2 border-roman-bronze shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="px-6 py-5 bg-roman-navy text-white border-b border-roman-bronze/40 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-5 h-5 text-roman-gold" />
              <h2 className="font-cinzel font-bold text-lg">Carrito de Compras</h2>
              <span className="px-2 py-0.5 text-xs font-bold rounded bg-roman-gold text-roman-navy">
                {cartItems.length}
              </span>
            </div>

            <button onClick={onClose} className="text-slate-300 hover:text-white p-1">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-roman-stone/40">
            {cartItems.length === 0 ? (
              <div className="text-center py-20 space-y-4">
                <ShoppingBag className="w-12 h-12 text-slate-400 mx-auto" />
                <p className="text-slate-600 text-sm font-semibold">Tu carrito de compras está vacío.</p>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Explora nuestro catálogo y personaliza tazas, termos o playeras con la calidad Sublimaciones Román.
                </p>
              </div>
            ) : (
              cartItems.map((item, idx) => {
                const totalBase = (item.basePrice || item.finalUnitPrice || 0) * item.quantity;
                const discountAmount = Math.max(0, totalBase - item.totalPrice);
                const discountPercent = totalBase > 0 ? Math.round((discountAmount / totalBase) * 100) : 0;

                return (
                  <div key={idx} className="card-architectural p-4 space-y-3 relative border border-slate-300">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-cinzel font-bold text-sm text-roman-navy">{item.name}</h3>
                        <p className="text-[11px] text-roman-bronze font-semibold">
                          Cant: {item.quantity} pza {item.selectedSize ? `• Talla: ${item.selectedSize}` : ''}
                        </p>
                      </div>

                      <button
                        onClick={() => onRemoveItem(idx)}
                        className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                        title="Eliminar producto"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Pricing Breakdown per item */}
                    <div className="grid grid-cols-2 gap-2 p-2 rounded bg-slate-50 border border-slate-200 text-[11px]">
                      <div>
                        <span className="text-slate-500 block text-[10px]">Precio Unitario:</span>
                        <span className="font-semibold text-slate-800">${item.basePrice || item.finalUnitPrice} MXN</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">Descuento Aplicado:</span>
                        <span className={`font-semibold ${discountAmount > 0 ? 'text-emerald-700' : 'text-slate-400'}`}>
                          {discountAmount > 0 ? `-$${discountAmount} MXN (${discountPercent}%)` : '$0 MXN'}
                        </span>
                      </div>
                    </div>

                    <div className="p-2.5 rounded bg-roman-stone text-xs space-y-1 text-slate-700 border border-slate-200">
                      {item.customText && (
                        <p><strong className="text-roman-navy">Texto:</strong> "{item.customText}"</p>
                      )}
                      {item.uploadedFileName && (
                        <p><strong className="text-emerald-700">Archivo:</strong> {item.uploadedFileName}</p>
                      )}
                      <p><strong className="text-slate-500">Tiempo de producción:</strong> {item.productionTime}</p>
                    </div>

                    <div className="flex justify-between items-center pt-1 text-xs">
                      <span className="text-slate-500 font-bold uppercase text-[10px]">Total Ítem:</span>
                      <span className="font-cinzel font-black text-base text-roman-navy">${item.totalPrice} MXN</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Summary */}
          {cartItems.length > 0 && (
            <div className="p-6 bg-white border-t border-slate-200 space-y-4">
              <div className="space-y-2 text-xs text-slate-700">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-bold text-roman-navy">${subtotal} MXN</span>
                </div>
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Anticipo del 50%:</span>
                  <span>${Math.round(subtotal * 0.5)} MXN</span>
                </div>
                <div className="flex justify-between font-cinzel font-bold text-base text-roman-navy pt-2 border-t border-slate-200">
                  <span>Total a Pagar:</span>
                  <span className="text-roman-bronze text-xl">${subtotal} MXN</span>
                </div>
              </div>

              <div className="p-2.5 rounded bg-roman-stone border border-slate-300 text-[11px] text-slate-700 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-roman-navy shrink-0" />
                <span>Cumple la Regla RN-01: Recibirás una muestra previa para autorizar.</span>
              </div>

              <button
                onClick={handleCheckoutSubmit}
                className="w-full py-4 rounded-xl btn-relief-gold text-xs font-headline tracking-widest uppercase flex items-center justify-center gap-2"
              >
                <span>PROCESAR PEDIDO Y GENERAR FOLIO</span>
                <ArrowRight className="w-4 h-4 text-roman-navy" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
