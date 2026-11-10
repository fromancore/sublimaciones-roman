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
  const saldoPendiente =
    order.remainingBalance !== undefined
      ? order.remainingBalance
      : Math.max(0, total - (order.depositPaid || 0))
  const depositAmount = Math.round(total * 0.5)
  const amountToPay = paymentOption === 'deposit' ? depositAmount : saldoPendiente
  const remainingAfterPayment = Math.max(0, saldoPendiente - amountToPay)

  const handleFileChange = e => {
    const file = e.target.files[0]
    if (file) {
      setFileName(file.name)
      setFileAttached(true)
    }
  }

  const handleOptionChange = option => {
    setPaymentOption(option)
    setErrorMonto('')
    const amt = option === 'deposit' ? depositAmount : saldoPendiente
    if (amt <= 0) {
      setErrorMonto('El monto debe ser mayor a 0')
    } else if (amt > saldoPendiente) {
      setErrorMonto('El monto excede el saldo pendiente')
    }
  }

  const handleSubmitPayment = e => {
    e.preventDefault()
    if (amountToPay <= 0) {
      setErrorMonto('El monto debe ser mayor a 0')
      return
    }
    if (amountToPay > saldoPendiente) {
      setErrorMonto('El monto excede el saldo pendiente')
      return
    }
    setErrorMonto('')
    setIsProcessing(true)

    setTimeout(() => {
      setIsProcessing(false)
      setIsSuccess(true)

      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      })

      setTimeout(() => {
        onRegisterPayment(order.id, amountToPay, remainingAfterPayment, {
          monto: amountToPay,
          metodo: paymentMethod,
          comprobanteNombre: fileName || 'comprobante_pago.pdf',
          estado: 'Pendiente de validación',
        })
        onClose()
      }, 1800)
    }, 1200)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/80 p-4 backdrop-blur-md">
      <div className="animate-fadeIn relative w-full max-w-lg overflow-hidden rounded-3xl border border-roman-gold/50 bg-roman-dark shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-roman-blue/40 bg-gradient-to-r from-roman-navy to-slate-900 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl border border-roman-gold/40 bg-roman-gold/20 p-2 text-roman-gold">
              <CreditCard className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-headline text-base font-bold text-white">
                Registro de Anticipo / Pago ({order.id})
              </h3>
              <p className="text-xs text-slate-400">
                Adjunta tu evidencia de transferencia o depósito
              </p>
            </div>
          </div>

          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Modal Content */}
        {isSuccess ? (
          <div className="space-y-4 p-8 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-emerald-500 bg-emerald-500/20 text-emerald-400">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <h4 className="font-headline text-xl font-bold text-white">¡Comprobante Registrado!</h4>
            <p className="text-xs text-slate-300">
              Hemos registrado tu pago de{' '}
              <strong className="text-roman-gold">${amountToPay} MXN</strong> con estado{' '}
              <strong className="text-amber-400">«Pendiente de validación»</strong>. Será revisado y
              aprobado por Administración.
            </p>
            <p className="text-[11px] text-slate-400">
              Saldo pendiente estimado:{' '}
              <strong className="text-emerald-400">${remainingAfterPayment} MXN</strong>
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmitPayment} className="space-y-6 p-6">
            {/* Financial Breakdown Table */}
            <div className="space-y-2 rounded-2xl border border-slate-700/80 bg-roman-navy/80 p-4">
              <div className="flex justify-between text-xs text-slate-300">
                <span>Producto:</span>
                <span className="font-semibold text-white">
                  {order.item} ({order.quantity} pza)
                </span>
              </div>
              <div className="flex justify-between text-xs text-slate-300">
                <span>Monto Total del Pedido:</span>
                <span className="font-bold text-white">${total} MXN</span>
              </div>
              <div className="flex justify-between text-xs text-slate-300">
                <span>Saldo Pendiente Actual:</span>
                <span className="font-bold text-amber-400">${saldoPendiente} MXN</span>
              </div>
              <div className="flex justify-between border-t border-slate-700 pt-1 text-xs font-semibold text-roman-gold">
                <span>Monto a Abonar Ahora:</span>
                <span className="text-lg font-black">${amountToPay} MXN</span>
              </div>
              <div className="flex justify-between pt-0.5 text-[11px] text-slate-400">
                <span>Saldo Pendiente Posterior:</span>
                <span className="font-mono font-bold text-emerald-400">
                  ${remainingAfterPayment} MXN
                </span>
              </div>
            </div>

            {errorMonto && (
              <div className="rounded-xl border border-red-500/80 bg-red-950/80 p-3 text-center text-xs font-semibold text-red-200">
                {errorMonto}
              </div>
            )}

            {/* Payment Type Selection */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-200">
                Selecciona Tipo de Pago:
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleOptionChange('deposit')}
                  className={`rounded-xl border p-3 text-left text-xs transition-all ${
                    paymentOption === 'deposit'
                      ? 'border-roman-cyan bg-roman-blue/30 font-bold text-roman-cyan'
                      : 'border-slate-700 bg-slate-900 text-slate-400'
                  }`}
                >
                  <p className="font-headline text-[11px] uppercase">50% Anticipo Inicial</p>
                  <p className="mt-1 text-sm font-black text-white">${depositAmount} MXN</p>
                </button>

                <button
                  type="button"
                  onClick={() => handleOptionChange('full')}
                  className={`rounded-xl border p-3 text-left text-xs transition-all ${
                    paymentOption === 'full'
                      ? 'border-roman-cyan bg-roman-blue/30 font-bold text-roman-cyan'
                      : 'border-slate-700 bg-slate-900 text-slate-400'
                  }`}
                >
                  <p className="font-headline text-[11px] uppercase">100% Pago Completo</p>
                  <p className="mt-1 text-sm font-black text-white">${saldoPendiente} MXN</p>
                </button>
              </div>
            </div>

            {/* Payment Method */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-200">
                Método de Pago:
              </label>
              <select
                value={paymentMethod}
                onChange={e => setPaymentMethod(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white focus:border-roman-cyan focus:outline-none"
              >
                <option value="transfer">
                  Transferencia Interbancaria (SPEI / BBVA / Banamex)
                </option>
                <option value="oxxo">Depósito en OXXO / 7-Eleven</option>
                <option value="cash">Efectivo al recoger en Taller Mérida</option>
              </select>
            </div>

            {/* Upload Receipt File */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-200">
                Adjuntar Foto o Ficha de Depósito:
              </label>
              <div className="relative rounded-2xl border-2 border-dashed border-slate-700 bg-slate-900/60 p-4 text-center hover:border-roman-gold">
                <input
                  type="file"
                  accept="image/*, application/pdf"
                  onChange={handleFileChange}
                  className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                />
                {fileAttached ? (
                  <div className="flex items-center justify-center gap-2 text-xs font-bold text-emerald-400">
                    <FileCheck className="h-4 w-4" />
                    <span>Ficha adjunta: {fileName}</span>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <Upload className="mx-auto h-5 w-5 text-slate-400" />
                    <p className="text-xs font-medium text-slate-300">
                      Subir foto del comprobante de transferencia
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isProcessing}
              className="shadow-electric flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-roman-blue via-roman-cyan to-roman-blue py-3.5 font-headline text-xs font-black tracking-wider text-roman-dark transition-all hover:brightness-110 active:scale-95"
            >
              {isProcessing ? (
                <span>REGISTRANDO PAGO...</span>
              ) : (
                <>
                  <span>CONFIRMAR REGISTRO DE PAGO</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
