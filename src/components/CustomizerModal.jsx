import { useState, useRef, useEffect } from 'react'
import {
  X,
  Upload,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Image as ImageIcon,
  Type,
  Shield,
  FileCheck,
  ShoppingCart,
  Columns,
  Phone,
} from 'lucide-react'
import { cotizar } from '../services/cotizacion.js'
import { FUENTES_DISENO, FUENTE_PREDETERMINADA } from '../services/fuentes.js'
import { COLORES_TEXTO } from '../services/coloresTexto.js'

export default function CustomizerModal({ product, onClose, onAddToCart }) {
  // ⚠️ Todos los hooks ANTES de cualquier return condicional (Rules of Hooks)

  // Customizer State
  const [customText, setCustomText] = useState('GUERRERO ROMÁN')
  const [fontFamily, setFontFamily] = useState(FUENTE_PREDETERMINADA.name)
  const [textColor, setTextColor] = useState('#D4AF37') // Roman Gold
  const [fontSize, setFontSize] = useState(22)
  const [uploadedImage, setUploadedImage] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [fileName, setFileName] = useState('')

  // Campo de teléfono obligatorio
  const [telefono, setTelefono] = useState('')

  // Validaciones
  const [errorArchivo, setErrorArchivo] = useState('')
  const [errorCantidad, setErrorCantidad] = useState('')
  const [errorTelefono, setErrorTelefono] = useState('')

  // Specifications
  const [quantity, setQuantity] = useState(1)
  const [selectedColor, setSelectedColor] = useState(product?.colors?.[0] || '#FFFFFF')
  const [selectedSize, setSelectedSize] = useState('M')
  const [additionalNotes, setAdditionalNotes] = useState('')

  const canvasRef = useRef(null)

  // Draw 2D Canvas Mockup Preview
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    ctx.fillStyle = selectedColor
    ctx.beginPath()
    ctx.roundRect(20, 20, canvas.width - 40, canvas.height - 40, 20)
    ctx.fill()
    ctx.strokeStyle = '#C5A059'
    ctx.lineWidth = 3
    ctx.stroke()

    ctx.fillStyle = 'rgba(13, 27, 42, 0.08)'
    ctx.fillRect(40, 40, canvas.width - 80, canvas.height - 80)

    if (uploadedImage && uploadedImage !== 'DOCUMENT_FILE') {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.src = uploadedImage
      img.onload = () => {
        ctx.drawImage(img, canvas.width / 2 - 45, 65, 90, 90)
        renderText()
      }
    } else {
      ctx.font = '40px serif'
      ctx.textAlign = 'center'
      ctx.fillText('🏛️', canvas.width / 2, 110)
      renderText()
    }

    function renderText() {
      if (!customText) return
      const selectedFont =
        FUENTES_DISENO.find(font => font.name === fontFamily) || FUENTE_PREDETERMINADA
      ctx.font = `bold ${fontSize}px ${selectedFont.fontStack}`
      ctx.fillStyle = textColor
      ctx.textAlign = 'center'
      ctx.shadowColor = 'rgba(0, 0, 0, 0.5)'
      ctx.shadowBlur = 4
      ctx.fillText(customText.toUpperCase(), canvas.width / 2, 190)
      ctx.shadowBlur = 0
    }
  }, [customText, textColor, fontSize, fontFamily, uploadedImage, selectedColor, product])

  // Early return después de los hooks
  if (!product) return null

  // Price Calculation mediante servicio cotizacion.js
  const cotizacionResultado = cotizar(product.price, quantity)
  const unitPrice = product.price
  const totalPrice = cotizacionResultado.total
  const subtotal = cotizacionResultado.subtotal
  const descuento = cotizacionResultado.descuento
  const quantityDiscount = cotizacionResultado.porcentaje
  const discountedUnitPrice = quantity > 0 ? totalPrice / quantity : product.price

  // Formatos admitidos: JPG, PNG, PDF, AI, PSD
  const FORMATOS_PERMITIDOS = ['.jpg', '.jpeg', '.png', '.pdf', '.ai', '.psd']
  const LIMITE_TAMANO_BYTES = 50 * 1024 * 1024 // 50 MB

  // File Upload Simulator (Firebase Storage Mock) con validaciones
  const handleFileUpload = e => {
    const file = e.target.files[0]
    if (!file) return

    setErrorArchivo('')

    // Validar extensión
    const ext = `.${file.name.split('.').pop().toLowerCase()}`
    if (!FORMATOS_PERMITIDOS.includes(ext)) {
      setErrorArchivo('Formato no admitido')
      return
    }

    // Validar tamaño máximo 50 MB
    if (file.size > LIMITE_TAMANO_BYTES) {
      setErrorArchivo('El archivo supera 50 MB')
      return
    }

    setUploading(true)
    setUploadProgress(10)
    setFileName(file.name)

    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setUploading(false)

          if (file.type.startsWith('image/')) {
            const reader = new FileReader()
            reader.onload = event => {
              setUploadedImage(event.target.result)
            }
            reader.readAsDataURL(file)
          } else {
            setUploadedImage('DOCUMENT_FILE')
          }
          return 100
        }
        return prev + 30
      })
    }, 200)
  }

  // Validación de teléfono: 10-15 dígitos, permite prefijo + y espacios/guiones
  const validarTelefono = valor => {
    const soloDigitos = valor.replace(/[\s\-()]+/g, '')
    const regex = /^\+?\d{10,15}$/
    return regex.test(soloDigitos)
  }

  const handleAddToCartSubmit = () => {
    let hayError = false

    if (quantity < 1) {
      setErrorCantidad('Cantidad mínima 1')
      hayError = true
    }

    if (!telefono.trim()) {
      setErrorTelefono('El teléfono es obligatorio')
      hayError = true
    } else if (!validarTelefono(telefono)) {
      setErrorTelefono('Teléfono inválido (10-15 dígitos)')
      hayError = true
    } else {
      setErrorTelefono('')
    }

    if (hayError) return
    const customizedItem = {
      productId: product.id,
      name: product.name,
      category: product.category,
      basePrice: product.price,
      finalUnitPrice: discountedUnitPrice,
      totalPrice,
      quantity,
      selectedColor,
      selectedSize: product.type === 'playera' ? selectedSize : null,
      customText,
      fontFamily,
      textColor,
      telefono: telefono.trim(),
      uploadedFileName: fileName || null,
      uploadedImageUrl: uploadedImage !== 'DOCUMENT_FILE' ? uploadedImage : null,
      additionalNotes,
      productionTime: product.productionTime,
      designStatus: 'Pendiente de Aprobación RN-01',
    }

    onAddToCart(customizedItem)
    onClose()
  }

  return (
    <div className="animate-fadeIn fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-roman-navy/80 p-4 backdrop-blur-md sm:p-6">
      <div className="relative flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border-2 border-roman-bronze bg-white shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-roman-bronze/40 bg-roman-navy px-6 py-4 text-white">
          <div className="flex items-center gap-3">
            <Columns className="h-5 w-5 text-roman-gold" />
            <div>
              <h2 className="font-cinzel text-base font-bold sm:text-lg">
                Estudio 2D: Personalizar <span className="text-roman-gold">{product.name}</span>
              </h2>
              <p className="text-[11px] text-slate-300">
                Ajusta el texto, color y archivo de referencia para tu cotización
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="grid grid-cols-1 gap-8 space-y-6 overflow-y-auto bg-roman-stone/50 p-6 lg:grid-cols-12">
          {/* Left Column: Live 2D Canvas Preview */}
          <div className="flex flex-col items-center justify-center space-y-4 lg:col-span-5">
            <div className="relative flex aspect-square w-full max-w-[320px] flex-col items-center justify-center rounded-2xl border-2 border-roman-bronze/40 bg-white p-4 shadow-card-marble">
              <span className="absolute left-3 top-3 rounded border border-roman-bronze/40 bg-roman-navy px-2 py-0.5 font-headline text-[9px] font-bold uppercase text-roman-gold">
                Previsualización 2D
              </span>

              <canvas
                ref={canvasRef}
                width={260}
                height={260}
                className="h-full w-full rounded-xl"
              />
            </div>

            {/* Colors Selector */}
            {product.colors && product.colors.length > 0 && (
              <div className="w-full max-w-[320px] space-y-2">
                <label className="block font-headline text-xs font-bold uppercase tracking-wider text-roman-navy">
                  Color Base del Producto:
                </label>
                <div className="flex items-center gap-3">
                  {product.colors.map(colorHex => (
                    <button
                      key={colorHex}
                      onClick={() => setSelectedColor(colorHex)}
                      style={{ backgroundColor: colorHex }}
                      className={`h-8 w-8 rounded-full border-2 transition-transform ${
                        selectedColor === colorHex
                          ? 'scale-110 border-roman-gold shadow-md ring-2 ring-roman-bronze'
                          : 'border-slate-300 hover:scale-105'
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Guarantee Notice */}
            <div className="flex w-full max-w-[320px] items-start gap-2.5 rounded-xl border border-slate-300 bg-white p-3 text-xs text-slate-700 shadow-sm">
              <Shield className="mt-0.5 h-4 w-4 shrink-0 text-roman-bronze" />
              <p className="text-[11px] leading-tight">
                <strong className="font-bold text-roman-navy">Regla RN-01:</strong> Un diseñador
                revisará tu archivo y recibirás una prueba visual oficial para aprobar antes de
                imprimir.
              </p>
            </div>
          </div>

          {/* Right Column: Customization Controls */}
          <div className="space-y-5 lg:col-span-7">
            {/* Custom Text Input */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 font-headline text-xs font-bold uppercase tracking-wider text-roman-navy">
                <Type className="h-4 w-4 text-roman-bronze" />
                Texto o Nombre Deseado:
              </label>
              <input
                type="text"
                value={customText}
                onChange={e => setCustomText(e.target.value)}
                placeholder="Ej. GUERRERO ROMÁN / Papá #1"
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs text-slate-800 shadow-sm focus:border-roman-bronze focus:outline-none"
              />
              <div className="space-y-2 pt-1">
                <label className="flex items-center gap-2 font-headline text-xs font-bold uppercase tracking-wider text-roman-navy">
                  <Type className="h-4 w-4 text-roman-bronze" />
                  Color de texto:
                </label>
                <div className="flex flex-wrap items-center gap-2.5">
                  {COLORES_TEXTO.map(color => (
                    <button
                      key={color.hex}
                      type="button"
                      onClick={() => setTextColor(color.hex)}
                      title={`${color.name} (${color.hex})`}
                      aria-label={`Color de texto: ${color.name} (${color.hex})`}
                      aria-pressed={textColor === color.hex}
                      style={{ backgroundColor: color.hex }}
                      className={`h-8 w-8 rounded-full border-2 transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-roman-bronze focus-visible:ring-offset-2 ${
                        textColor === color.hex
                          ? 'scale-110 border-roman-gold shadow-md ring-2 ring-roman-bronze'
                          : 'border-slate-300 hover:scale-105'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-[11px] font-medium text-slate-500" aria-live="polite">
                  Seleccionado:{' '}
                  {COLORES_TEXTO.find(color => color.hex === textColor)?.name || textColor}. Elige
                  un tono que contraste con el color base.
                </p>
              </div>
            </div>

            {/* Typography Selector */}
            <div className="space-y-2">
              <label
                htmlFor="font-family"
                className="flex items-center gap-2 font-headline text-xs font-bold uppercase tracking-wider text-roman-navy"
              >
                <Type className="h-4 w-4 text-roman-bronze" />
                Tipografía:
              </label>
              <select
                id="font-family"
                value={fontFamily}
                onChange={e => setFontFamily(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 shadow-sm focus:border-roman-bronze focus:outline-none"
              >
                {FUENTES_DISENO.map(font => (
                  <option key={font.name} value={font.name} style={{ fontFamily: font.fontStack }}>
                    {font.name} — {font.style}
                  </option>
                ))}
              </select>
              <p
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-center text-lg text-roman-navy"
                style={{
                  fontFamily:
                    FUENTES_DISENO.find(font => font.name === fontFamily)?.fontStack ||
                    FUENTE_PREDETERMINADA.fontStack,
                }}
              >
                {customText || 'Vista previa de tu texto'}
              </p>
            </div>

            {/* Campo de Teléfono Obligatorio */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 font-headline text-xs font-bold uppercase tracking-wider text-roman-navy">
                <Phone className="h-4 w-4 text-roman-bronze" />
                Teléfono de Contacto: <span className="text-red-500">*</span>
              </label>
              <input
                id="telefono-contacto"
                type="tel"
                required
                value={telefono}
                onChange={e => {
                  setTelefono(e.target.value)
                  if (errorTelefono) setErrorTelefono('')
                }}
                placeholder="Ej. +52 614 123 4567"
                className={`w-full rounded-xl border bg-white px-4 py-2.5 text-xs text-slate-800 shadow-sm transition-colors focus:outline-none ${
                  errorTelefono
                    ? 'border-red-400 bg-red-50/30 focus:border-red-500'
                    : 'border-slate-300 focus:border-roman-bronze'
                }`}
              />
              {errorTelefono && (
                <p className="flex items-center gap-1 text-[11px] font-semibold text-red-600">
                  <AlertTriangle className="h-3 w-3" />
                  {errorTelefono}
                </p>
              )}
            </div>

            {/* File Upload Section (Firebase Storage Mock) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 font-headline text-xs font-bold uppercase tracking-wider text-roman-navy">
                  <Upload className="h-4 w-4 text-roman-bronze" />
                  Adjuntar Logotipo o Referencia de Diseño (Firebase Storage):
                </label>
                {errorArchivo && (
                  <span className="rounded border border-red-200 bg-red-50 px-2 py-0.5 text-xs font-semibold text-red-600">
                    {errorArchivo}
                  </span>
                )}
              </div>

              <div className="relative rounded-xl border-2 border-dashed border-slate-300 bg-white p-4 text-center shadow-sm transition-colors hover:border-roman-bronze">
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf,.ai,.psd"
                  onChange={handleFileUpload}
                  className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                />

                {uploading ? (
                  <div className="space-y-2 py-2">
                    <p className="text-xs font-bold text-roman-navy">
                      Subiendo archivo a Firebase Storage... {uploadProgress}%
                    </p>
                    <div className="h-2 w-full rounded-full bg-slate-200">
                      <div
                        className="h-2 rounded-full bg-roman-bronze transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                ) : fileName ? (
                  <div className="flex items-center justify-center gap-2 py-1 text-xs font-bold text-emerald-700">
                    <FileCheck className="h-4 w-4" />
                    <span>Archivo subido: {fileName}</span>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <ImageIcon className="mx-auto h-6 w-6 text-slate-400" />
                    <p className="text-xs font-semibold text-slate-700">
                      Haz clic o arrastra tu archivo (JPG, PNG, PDF, AI, PSD)
                    </p>
                    <p className="text-[10px] text-slate-500">Soporta alta resolución hasta 50MB</p>
                  </div>
                )}
              </div>
            </div>

            {/* Specifications: Size & Quantity */}
            <div className="grid grid-cols-2 gap-4">
              {product.type === 'playera' ? (
                <div className="space-y-1.5">
                  <label className="font-headline text-xs font-bold uppercase text-roman-navy">
                    Talla:
                  </label>
                  <select
                    value={selectedSize}
                    onChange={e => setSelectedSize(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 shadow-sm focus:border-roman-bronze focus:outline-none"
                  >
                    {['CH', 'M', 'G', 'XG', 'XXG'].map(s => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <label className="font-headline text-xs font-bold uppercase text-roman-navy">
                    Estilo / Variantes:
                  </label>
                  <input
                    type="text"
                    disabled
                    value={product.material.split(' ')[0] || 'Estándar'}
                    className="w-full rounded-xl border border-slate-300 bg-slate-100 px-3 py-2 text-xs font-medium text-slate-600"
                  />
                </div>
              )}

              {/* Quantity */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-headline text-xs font-bold uppercase text-roman-navy">
                    Cantidad:
                  </label>
                  {errorCantidad && (
                    <span className="text-[11px] font-semibold text-red-600">{errorCantidad}</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const next = quantity - 1
                      if (next < 1) {
                        setErrorCantidad('Cantidad mínima 1')
                        setQuantity(0)
                      } else {
                        setErrorCantidad('')
                        setQuantity(next)
                      }
                    }}
                    className="rounded-lg bg-slate-200 px-3 py-1.5 font-bold text-slate-800 hover:bg-slate-300"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-sm font-bold text-slate-900">
                    {quantity}
                  </span>
                  <button
                    onClick={() => {
                      setErrorCantidad('')
                      setQuantity(quantity + 1)
                    }}
                    className="rounded-lg bg-slate-200 px-3 py-1.5 font-bold text-slate-800 hover:bg-slate-300"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Additional Notes */}
            <div className="space-y-1.5">
              <label className="font-headline text-xs font-bold uppercase text-roman-navy">
                Instrucciones Especiales:
              </label>
              <textarea
                rows={2}
                value={additionalNotes}
                onChange={e => setAdditionalNotes(e.target.value)}
                placeholder="Ej. Ubicar el logo centrado, fuentes estilo romano..."
                className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs text-slate-800 shadow-sm focus:border-roman-bronze focus:outline-none"
              />
            </div>

            {/* Price Quote Estimator */}
            <div className="space-y-2 rounded-xl border border-roman-bronze/40 bg-roman-navy p-4 text-white shadow-md">
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span>Precio Unitario Base:</span>
                <span>${unitPrice} MXN</span>
              </div>
              {quantityDiscount > 0 && (
                <div className="flex items-center justify-between text-xs font-semibold text-emerald-400">
                  <span>Descuento por Volumen ({quantityDiscount * 100}%):</span>
                  <span>-${descuento} MXN</span>
                </div>
              )}
              <div className="flex items-center justify-between border-t border-slate-700 pt-2 font-cinzel">
                <span className="text-xs font-bold uppercase">Cotización Estimada Total:</span>
                <span className="text-2xl font-black text-roman-gold">${totalPrice} MXN</span>
              </div>
            </div>

            {/* Submit */}
            <button
              onClick={handleAddToCartSubmit}
              disabled={quantity < 1 || !!errorArchivo || !telefono.trim()}
              className={`flex w-full items-center justify-center gap-2 rounded-xl py-4 font-headline text-xs uppercase tracking-widest transition-all ${
                quantity < 1 || !!errorArchivo || !telefono.trim()
                  ? 'cursor-not-allowed bg-slate-300 text-slate-500 opacity-60'
                  : 'btn-relief-gold'
              }`}
            >
              <ShoppingCart className="h-4 w-4 text-roman-navy" />
              <span>AGREGAR AL CARRITO DE COMPRAS</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
