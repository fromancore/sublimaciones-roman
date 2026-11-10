import { useState, useRef, useEffect } from 'react'
import { X, Upload, Sparkles, CheckCircle2, AlertTriangle, Image as ImageIcon, Type, Shield, FileCheck, ShoppingCart, Columns, Phone } from 'lucide-react'
import { cotizar } from '../services/cotizacion.js'

export default function CustomizerModal({ product, onClose, onAddToCart }) {
  // ⚠️ Todos los hooks ANTES de cualquier return condicional (Rules of Hooks)

  // Customizer State
  const [customText, setCustomText] = useState('GUERRERO ROMÁN')
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

  // Early return después de los hooks
  if (!product) return null

  // Price Calculation mediante servicio cotizacion.js
  const cotizacionResultado = cotizar(product.price, quantity);
  const unitPrice = product.price;
  const totalPrice = cotizacionResultado.total;
  const subtotal = cotizacionResultado.subtotal;
  const descuento = cotizacionResultado.descuento;
  const quantityDiscount = cotizacionResultado.porcentaje;
  const discountedUnitPrice = quantity > 0 ? (totalPrice / quantity) : product.price;

  // Formatos admitidos: JPG, PNG, PDF, AI, PSD
  const FORMATOS_PERMITIDOS = ['.jpg', '.jpeg', '.png', '.pdf', '.ai', '.psd'];
  const LIMITE_TAMANO_BYTES = 50 * 1024 * 1024; // 50 MB

  // File Upload Simulator (Firebase Storage Mock) con validaciones
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setErrorArchivo('');

    // Validar extensión
    const ext = '.' + file.name.split('.').pop().toLowerCase();
    if (!FORMATOS_PERMITIDOS.includes(ext)) {
      setErrorArchivo('Formato no admitido');
      return;
    }

    // Validar tamaño máximo 50 MB
    if (file.size > LIMITE_TAMANO_BYTES) {
      setErrorArchivo('El archivo supera 50 MB');
      return;
    }

    setUploading(true);
    setUploadProgress(10);
    setFileName(file.name);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploading(false);
          
          if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (event) => {
              setUploadedImage(event.target.result);
            };
            reader.readAsDataURL(file);
          } else {
            setUploadedImage('DOCUMENT_FILE');
          }
          return 100;
        }
        return prev + 30;
      });
    }, 200);
  };

  // Draw 2D Canvas Mockup Preview
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // Clear Canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Background Product Color
    ctx.fillStyle = selectedColor;
    ctx.beginPath();
    ctx.roundRect(20, 20, canvas.width - 40, canvas.height - 40, 20);
    ctx.fill();
    ctx.strokeStyle = '#C5A059';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Inner Area Frame
    ctx.fillStyle = 'rgba(13, 27, 42, 0.08)';
    ctx.fillRect(40, 40, canvas.width - 80, canvas.height - 80);

    // Render Uploaded Image Reference if Available
    if (uploadedImage && uploadedImage !== 'DOCUMENT_FILE') {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = uploadedImage;
      img.onload = () => {
        ctx.drawImage(img, canvas.width / 2 - 45, 65, 90, 90);
        renderText();
      };
    } else {
      ctx.font = '40px serif';
      ctx.textAlign = 'center';
      ctx.fillText('🏛️', canvas.width / 2, 110);
      renderText();
    }

    function renderText() {
      if (!customText) return;
      ctx.font = `bold ${fontSize}px Cinzel, serif`;
      ctx.fillStyle = textColor;
      ctx.textAlign = 'center';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
      ctx.shadowBlur = 4;
      ctx.fillText(customText.toUpperCase(), canvas.width / 2, 190);
      ctx.shadowBlur = 0;
    }

  }, [customText, textColor, fontSize, uploadedImage, selectedColor, product]);

  // Validación de teléfono: 10-15 dígitos, permite prefijo + y espacios/guiones
  const validarTelefono = (valor) => {
    const soloDigitos = valor.replace(/[\s\-()]+/g, '');
    const regex = /^\+?\d{10,15}$/;
    return regex.test(soloDigitos);
  };

  const handleAddToCartSubmit = () => {
    let hayError = false;

    if (quantity < 1) {
      setErrorCantidad('Cantidad mínima 1');
      hayError = true;
    }

    if (!telefono.trim()) {
      setErrorTelefono('El teléfono es obligatorio');
      hayError = true;
    } else if (!validarTelefono(telefono)) {
      setErrorTelefono('Teléfono inválido (10-15 dígitos)');
      hayError = true;
    } else {
      setErrorTelefono('');
    }

    if (hayError) return;
    const customizedItem = {
      productId: product.id,
      name: product.name,
      category: product.category,
      basePrice: product.price,
      finalUnitPrice: discountedUnitPrice,
      totalPrice: totalPrice,
      quantity,
      selectedColor,
      selectedSize: product.type === 'playera' ? selectedSize : null,
      customText,
      telefono: telefono.trim(),
      uploadedFileName: fileName || null,
      uploadedImageUrl: uploadedImage !== 'DOCUMENT_FILE' ? uploadedImage : null,
      additionalNotes,
      productionTime: product.productionTime,
      designStatus: 'Pendiente de Aprobación RN-01'
    };

    onAddToCart(customizedItem);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-roman-navy/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-white border-2 border-roman-bronze rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-roman-navy text-white border-b border-roman-bronze/40">
          <div className="flex items-center gap-3">
            <Columns className="w-5 h-5 text-roman-gold" />
            <div>
              <h2 className="font-cinzel font-bold text-base sm:text-lg">
                Estudio 2D: Personalizar <span className="text-roman-gold">{product.name}</span>
              </h2>
              <p className="text-[11px] text-slate-300">Ajusta el texto, color y archivo de referencia para tu cotización</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 grid grid-cols-1 lg:grid-cols-12 gap-8 bg-roman-stone/50">
          
          {/* Left Column: Live 2D Canvas Preview */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center space-y-4">
            <div className="relative w-full aspect-square max-w-[320px] bg-white rounded-2xl p-4 border-2 border-roman-bronze/40 flex flex-col items-center justify-center shadow-card-marble">
              <span className="absolute top-3 left-3 text-[9px] font-headline font-bold uppercase px-2 py-0.5 rounded bg-roman-navy text-roman-gold border border-roman-bronze/40">
                Previsualización 2D
              </span>

              <canvas
                ref={canvasRef}
                width={260}
                height={260}
                className="w-full h-full rounded-xl"
              />
            </div>

            {/* Colors Selector */}
            {product.colors && product.colors.length > 0 && (
              <div className="w-full max-w-[320px] space-y-2">
                <label className="text-xs font-headline font-bold text-roman-navy uppercase tracking-wider block">
                  Color Base del Producto:
                </label>
                <div className="flex items-center gap-3">
                  {product.colors.map((colorHex) => (
                    <button
                      key={colorHex}
                      onClick={() => setSelectedColor(colorHex)}
                      style={{ backgroundColor: colorHex }}
                      className={`w-8 h-8 rounded-full border-2 transition-transform ${
                        selectedColor === colorHex 
                          ? 'border-roman-gold scale-110 shadow-md ring-2 ring-roman-bronze' 
                          : 'border-slate-300 hover:scale-105'
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Guarantee Notice */}
            <div className="w-full max-w-[320px] p-3 rounded-xl bg-white border border-slate-300 text-xs text-slate-700 flex items-start gap-2.5 shadow-sm">
              <Shield className="w-4 h-4 text-roman-bronze shrink-0 mt-0.5" />
              <p className="text-[11px] leading-tight">
                <strong className="text-roman-navy font-bold">Regla RN-01:</strong> Un diseñador revisará tu archivo y recibirás una prueba visual oficial para aprobar antes de imprimir.
              </p>
            </div>
          </div>

          {/* Right Column: Customization Controls */}
          <div className="lg:col-span-7 space-y-5">
            
            {/* Custom Text Input */}
            <div className="space-y-2">
              <label className="text-xs font-headline font-bold text-roman-navy uppercase tracking-wider flex items-center gap-2">
                <Type className="w-4 h-4 text-roman-bronze" />
                Texto o Nombre Deseado:
              </label>
              <input
                type="text"
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder="Ej. GUERRERO ROMÁN / Papá #1"
                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-roman-bronze shadow-sm"
              />
              <div className="flex items-center gap-3 pt-1">
                <span className="text-[11px] text-slate-500 font-medium">Color de texto:</span>
                {['#D4AF37', '#0D1B2A', '#C5A059', '#000000', '#E63946'].map((c) => (
                  <button
                    key={c}
                    onClick={() => setTextColor(c)}
                    style={{ backgroundColor: c }}
                    className={`w-5 h-5 rounded-full border ${textColor === c ? 'ring-2 ring-roman-bronze' : ''}`}
                  />
                ))}
              </div>
            </div>

            {/* Campo de Teléfono Obligatorio */}
            <div className="space-y-2">
              <label className="text-xs font-headline font-bold text-roman-navy uppercase tracking-wider flex items-center gap-2">
                <Phone className="w-4 h-4 text-roman-bronze" />
                Teléfono de Contacto: <span className="text-red-500">*</span>
              </label>
              <input
                id="telefono-contacto"
                type="tel"
                required
                value={telefono}
                onChange={(e) => {
                  setTelefono(e.target.value);
                  if (errorTelefono) setErrorTelefono('');
                }}
                placeholder="Ej. +52 614 123 4567"
                className={`w-full bg-white border rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none shadow-sm transition-colors ${
                  errorTelefono
                    ? 'border-red-400 focus:border-red-500 bg-red-50/30'
                    : 'border-slate-300 focus:border-roman-bronze'
                }`}
              />
              {errorTelefono && (
                <p className="text-[11px] font-semibold text-red-600 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  {errorTelefono}
                </p>
              )}
            </div>

            {/* File Upload Section (Firebase Storage Mock) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-headline font-bold text-roman-navy uppercase tracking-wider flex items-center gap-2">
                  <Upload className="w-4 h-4 text-roman-bronze" />
                  Adjuntar Logotipo o Referencia de Diseño (Firebase Storage):
                </label>
                {errorArchivo && (
                  <span className="text-xs font-semibold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded">
                    {errorArchivo}
                  </span>
                )}
              </div>
              
              <div className="relative border-2 border-dashed border-slate-300 hover:border-roman-bronze rounded-xl p-4 text-center bg-white transition-colors shadow-sm">
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf,.ai,.psd"
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                
                {uploading ? (
                  <div className="space-y-2 py-2">
                    <p className="text-xs font-bold text-roman-navy">Subiendo archivo a Firebase Storage... {uploadProgress}%</p>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div className="bg-roman-bronze h-2 rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
                    </div>
                  </div>
                ) : fileName ? (
                  <div className="flex items-center justify-center gap-2 text-emerald-700 py-1 text-xs font-bold">
                    <FileCheck className="w-4 h-4" />
                    <span>Archivo subido: {fileName}</span>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <ImageIcon className="w-6 h-6 text-slate-400 mx-auto" />
                    <p className="text-xs text-slate-700 font-semibold">Haz clic o arrastra tu archivo (JPG, PNG, PDF, AI, PSD)</p>
                    <p className="text-[10px] text-slate-500">Soporta alta resolución hasta 50MB</p>
                  </div>
                )}
              </div>
            </div>

            {/* Specifications: Size & Quantity */}
            <div className="grid grid-cols-2 gap-4">
              
              {product.type === 'playera' ? (
                <div className="space-y-1.5">
                  <label className="text-xs font-headline font-bold text-roman-navy uppercase">Talla:</label>
                  <select
                    value={selectedSize}
                    onChange={(e) => setSelectedSize(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-roman-bronze shadow-sm"
                  >
                    {['CH', 'M', 'G', 'XG', 'XXG'].map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <label className="text-xs font-headline font-bold text-roman-navy uppercase">Estilo / Variantes:</label>
                  <input
                    type="text"
                    disabled
                    value={product.material.split(' ')[0] || 'Estándar'}
                    className="w-full bg-slate-100 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-600 font-medium"
                  />
                </div>
              )}

              {/* Quantity */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-headline font-bold text-roman-navy uppercase">Cantidad:</label>
                  {errorCantidad && (
                    <span className="text-[11px] font-semibold text-red-600">
                      {errorCantidad}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const next = quantity - 1;
                      if (next < 1) {
                        setErrorCantidad('Cantidad mínima 1');
                        setQuantity(0);
                      } else {
                        setErrorCantidad('');
                        setQuantity(next);
                      }
                    }}
                    className="px-3 py-1.5 bg-slate-200 rounded-lg text-slate-800 font-bold hover:bg-slate-300"
                  >
                    -
                  </button>
                  <span className="font-bold text-sm text-slate-900 w-8 text-center">{quantity}</span>
                  <button
                    onClick={() => {
                      setErrorCantidad('');
                      setQuantity(quantity + 1);
                    }}
                    className="px-3 py-1.5 bg-slate-200 rounded-lg text-slate-800 font-bold hover:bg-slate-300"
                  >
                    +
                  </button>
                </div>
              </div>

            </div>

            {/* Additional Notes */}
            <div className="space-y-1.5">
              <label className="text-xs font-headline font-bold text-roman-navy uppercase">Instrucciones Especiales:</label>
              <textarea
                rows={2}
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
                placeholder="Ej. Ubicar el logo centrado, fuentes estilo romano..."
                className="w-full bg-white border border-slate-300 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:border-roman-bronze shadow-sm"
              />
            </div>

            {/* Price Quote Estimator */}
            <div className="p-4 rounded-xl bg-roman-navy text-white space-y-2 border border-roman-bronze/40 shadow-md">
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span>Precio Unitario Base:</span>
                <span>${unitPrice} MXN</span>
              </div>
              {quantityDiscount > 0 && (
                <div className="flex items-center justify-between text-xs text-emerald-400 font-semibold">
                  <span>Descuento por Volumen ({quantityDiscount * 100}%):</span>
                  <span>-${descuento} MXN</span>
                </div>
              )}
              <div className="flex items-center justify-between pt-2 border-t border-slate-700 font-cinzel">
                <span className="font-bold text-xs uppercase">Cotización Estimada Total:</span>
                <span className="font-black text-2xl text-roman-gold">${totalPrice} MXN</span>
              </div>
            </div>

            {/* Submit */}
            <button
              onClick={handleAddToCartSubmit}
              disabled={quantity < 1 || !!errorArchivo || !telefono.trim()}
              className={`w-full py-4 rounded-xl text-xs font-headline tracking-widest uppercase flex items-center justify-center gap-2 transition-all ${
                quantity < 1 || !!errorArchivo || !telefono.trim()
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed opacity-60'
                  : 'btn-relief-gold'
              }`}
            >
              <ShoppingCart className="w-4 h-4 text-roman-navy" />
              <span>AGREGAR AL CARRITO DE COMPRAS</span>
            </button>

          </div>

        </div>

      </div>
    </div>
  );
}
