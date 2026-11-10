import { useState } from 'react'
import { X, CreditCard, Upload, CheckCircle2, FileCheck, ArrowRight } from 'lucide-react'
import confetti from 'canvas-confetti'

export default function PaymentModal({ order, onClose, onRegisterPayment }) {
  // ⚠️ Todos los hooks deben declararse antes de cualquier return condicional
  // (Regla de Hooks de React — react-hooks/rules-of-hooks)
  const [paymentOption, setPaymentOption] = useState('deposit') // 'deposit' (50%) or 'full' (100%)
  const [paymentMethod, setPaymentMethod] = useState('transfer') // 'transfer', 'oxxo', 'cash'
  const [fileAttached, setFileAttached] = useState(false)
  const [fileName, setFileName] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [errorMonto, setErrorMonto] = useState('')

  // Early return después de los hooks
  if (!order) return null

  const total = order.total
  const saldoPendiente = order.remainingBalance !== undefined ? order.remainingBalance : Math.max(0, total - (order.depositPaid || 0))
  const depositAmount = Math.round(total * 0.5)
  const amountToPay = paymentOption === 'deposit' ? depositAmount : saldoPendiente
  const remainingAfterPayment = Math.max(0, saldoPendiente - amountToPay)


  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      setFileAttached(true);
    }
  };

  const handleOptionChange = (option) => {
    setPaymentOption(option);
    setErrorMonto('');
    const amt = option === 'deposit' ? depositAmount : saldoPendiente;
    if (amt <= 0) {
      setErrorMonto('El monto debe ser mayor a 0');
    } else if (amt > saldoPendiente) {
      setErrorMonto('El monto excede el saldo pendiente');
    }
  };

  const handleSubmitPayment = (e) => {
    e.preventDefault();
    if (amountToPay <= 0) {
      setErrorMonto('El monto debe ser mayor a 0');
      return;
    }
    if (amountToPay > saldoPendiente) {
      setErrorMonto('El monto excede el saldo pendiente');
      return;
    }
    setErrorMonto('');
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });

      setTimeout(() => {
        onRegisterPayment(order.id, amountToPay, remainingAfterPayment, {
          monto: amountToPay,
          metodo: paymentMethod,
          comprobanteNombre: fileName || 'comprobante_pago.pdf',
          estado: 'Pendiente de validación'
        });
        onClose();
      }, 1800);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg bg-roman-dark border border-roman-gold/50 rounded-3xl shadow-2xl overflow-hidden animate-fadeIn">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-roman-navy to-slate-900 border-b border-roman-blue/40">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-roman-gold/20 border border-roman-gold/40 text-roman-gold">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-headline font-bold text-base text-white">
                Registro de Anticipo / Pago ({order.id})
              </h3>
              <p className="text-xs text-slate-400">Adjunta tu evidencia de transferencia o depósito</p>
            </div>
          </div>

          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Content */}
        {isSuccess ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="font-headline font-bold text-xl text-white">¡Comprobante Registrado!</h4>
            <p className="text-xs text-slate-300">
              Hemos registrado tu pago de <strong className="text-roman-gold">${amountToPay} MXN</strong> con estado <strong className="text-amber-400">«Pendiente de validación»</strong>. Será revisado y aprobado por Administración.
            </p>
            <p className="text-[11px] text-slate-400">
              Saldo pendiente estimado: <strong className="text-emerald-400">${remainingAfterPayment} MXN</strong>
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmitPayment} className="p-6 space-y-6">
            
            {/* Financial Breakdown Table */}
            <div className="p-4 rounded-2xl bg-roman-navy/80 border border-slate-700/80 space-y-2">
              <div className="flex justify-between text-xs text-slate-300">
                <span>Producto:</span>
                <span className="font-semibold text-white">{order.item} ({order.quantity} pza)</span>
              </div>
              <div className="flex justify-between text-xs text-slate-300">
                <span>Monto Total del Pedido:</span>
                <span className="font-bold text-white">${total} MXN</span>
              </div>
              <div className="flex justify-between text-xs text-slate-300">
                <span>Saldo Pendiente Actual:</span>
                <span className="font-bold text-amber-400">${saldoPendiente} MXN</span>
              </div>
              <div className="flex justify-between text-xs text-roman-gold font-semibold pt-1 border-t border-slate-700">
                <span>Monto a Abonar Ahora:</span>
                <span className="font-black text-lg">${amountToPay} MXN</span>
              </div>
              <div className="flex justify-between text-[11px] text-slate-400 pt-0.5">
                <span>Saldo Pendiente Posterior:</span>
                <span className="font-mono text-emerald-400 font-bold">${remainingAfterPayment} MXN</span>
              </div>
            </div>

            {errorMonto && (
              <div className="p-3 bg-red-950/80 border border-red-500/80 rounded-xl text-red-200 text-xs font-semibold text-center">
                {errorMonto}
              </div>
            )}

            {/* Payment Type Selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-200 uppercase tracking-wider block">
                Selecciona Tipo de Pago:
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleOptionChange('deposit')}
                  className={`p-3 rounded-xl border text-left text-xs transition-all ${
                    paymentOption === 'deposit'
                      ? 'bg-roman-blue/30 border-roman-cyan text-roman-cyan font-bold'
                      : 'bg-slate-900 border-slate-700 text-slate-400'
                  }`}
                >
                  <p className="font-headline uppercase text-[11px]">50% Anticipo Inicial</p>
                  <p className="text-sm font-black text-white mt-1">${depositAmount} MXN</p>
                </button>

                <button
                  type="button"
                  onClick={() => handleOptionChange('full')}
                  className={`p-3 rounded-xl border text-left text-xs transition-all ${
                    paymentOption === 'full'
                      ? 'bg-roman-blue/30 border-roman-cyan text-roman-cyan font-bold'
                      : 'bg-slate-900 border-slate-700 text-slate-400'
                  }`}
                >
                  <p className="font-headline uppercase text-[11px]">100% Pago Completo</p>
                  <p className="text-sm font-black text-white mt-1">${saldoPendiente} MXN</p>
                </button>
              </div>
            </div>

            {/* Payment Method */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-200 uppercase tracking-wider block">
                Método de Pago:
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-roman-cyan"
              >
                <option value="transfer">Transferencia Interbancaria (SPEI / BBVA / Banamex)</option>
                <option value="oxxo">Depósito en OXXO / 7-Eleven</option>
                <option value="cash">Efectivo al recoger en Taller Mérida</option>
              </select>
            </div>

            {/* Upload Receipt File */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-200 uppercase tracking-wider block">
                Adjuntar Foto o Ficha de Depósito:
              </label>
              <div className="relative border-2 border-dashed border-slate-700 hover:border-roman-gold rounded-2xl p-4 text-center bg-slate-900/60">
                <input
                  type="file"
                  accept="image/*, application/pdf"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                {fileAttached ? (
                  <div className="flex items-center justify-center gap-2 text-emerald-400 font-bold text-xs">
                    <FileCheck className="w-4 h-4" />
                    <span>Ficha adjunta: {fileName}</span>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <Upload className="w-5 h-5 text-slate-400 mx-auto" />
                    <p className="text-xs text-slate-300 font-medium">Subir foto del comprobante de transferencia</p>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-roman-blue via-roman-cyan to-roman-blue text-roman-dark font-headline font-black text-xs tracking-wider shadow-electric hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <span>REGISTRANDO PAGO...</span>
              ) : (
                <>
                  <span>CONFIRMAR REGISTRO DE PAGO</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

          </form>
        )}

      </div>
    </div>
  );
}
