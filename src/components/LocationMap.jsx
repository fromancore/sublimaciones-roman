import React, { useState } from 'react'
import {
  MapPin,
  Clock,
  Phone,
  Navigation,
  Truck,
  Store,
  ExternalLink,
  MessageCircle,
  Info,
} from 'lucide-react'

export default function LocationMap() {
  const [deliveryMode, setDeliveryMode] = useState('pickup')
  const [userAddress, setUserAddress] = useState('')
  const [estimatedCost, setEstimatedCost] = useState(0)

  const workshopInfo = {
    city: 'Cárdenas, Tabasco, México',
    address: 'Carlos Molina 7B, Col. El Palmar, C.P. 86500, Cárdenas, Tabasco',
    phone: '937 283 0402',
    phoneRaw: '9372830402',
    hours: 'Lunes a Sábado: 9:00 AM - 7:00 PM',
    mapUrl: 'https://maps.google.com/?q=17.9942,-93.3756',
    whatsappUrl:
      'https://wa.me/529372830402?text=Hola%20Sublimaciones%20Rom%C3%A1n,%20me%20gustar%C3%ADa%20cotizar%20un%20producto%20personalizado',
  }

  const handleCalculateShipping = e => {
    e.preventDefault()
    if (!userAddress.trim()) {
      alert('Ingresa tu colonia o dirección en Cárdenas para calcular el costo de envío.')
      return
    }
    setEstimatedCost(35)
  }

  return (
    <section
      id="ubicacion-section"
      className="border-b border-roman-platinum bg-roman-marble py-16"
    >
      <div className="mx-auto max-w-7xl space-y-12 px-4 sm:px-6 lg:px-8">
        {/* Banner de Próxima Apertura */}
        <div className="card-architectural space-y-1 border-2 border-roman-bronze bg-roman-navy p-4 text-center text-white shadow-lg">
          <div className="flex items-center justify-center gap-2 font-headline text-xs font-bold uppercase tracking-widest text-roman-gold">
            <Info className="h-4 w-4" />
            <span>Aviso de Sucursales & Cobertura</span>
          </div>
          <p className="font-cinzel text-sm font-black text-white sm:text-base">
            "Atendiendo actualmente en Cárdenas, Tabasco. ¡Próximamente también en Mérida, Yucatán!"
          </p>
        </div>

        {/* Section Header */}
        <div className="mx-auto max-w-3xl space-y-3 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-roman-bronze/40 bg-roman-navy px-3.5 py-1 font-headline text-[10px] font-bold uppercase tracking-widest text-roman-gold">
            <MapPin className="h-3.5 w-3.5" />
            Ubicación & Atención Directa
          </div>
          <h2 className="font-cinzel text-3xl font-black text-roman-dark sm:text-4xl">
            Taller Principal en <span className="text-roman-bronze">Cárdenas, Tabasco</span>
          </h2>
          <p className="text-sm text-slate-600">
            Visita nuestra sucursal o contáctanos directamente por WhatsApp para coordinar la
            entrega o envío de tu pedido.
          </p>
        </div>

        {/* Map & Info Grid */}
        <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-12">
          {/* Left Column */}
          <div className="card-architectural flex flex-col justify-between space-y-6 border-2 border-roman-bronze/30 p-6 shadow-card-marble lg:col-span-5">
            <div className="space-y-4">
              <h3 className="flex items-center gap-2 font-cinzel text-xl font-bold text-roman-navy">
                <Store className="h-5 w-5 text-roman-bronze" />
                Sucursal Cárdenas, Tabasco
              </h3>

              <div className="space-y-3 text-xs text-slate-700">
                <div className="flex items-start gap-3 rounded-xl border border-slate-300 bg-roman-stone p-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-roman-navy" />
                  <div>
                    <strong className="block font-bold text-roman-navy">Dirección Oficial:</strong>
                    <span>{workshopInfo.address}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-xl border border-slate-300 bg-roman-stone p-3">
                  <Clock className="h-4 w-4 shrink-0 text-roman-bronze" />
                  <div>
                    <strong className="block font-bold text-roman-navy">
                      Horarios de Atención:
                    </strong>
                    <span>{workshopInfo.hours}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-xl border border-slate-300 bg-roman-stone p-3">
                  <Phone className="h-4 w-4 shrink-0 text-emerald-700" />
                  <div>
                    <strong className="block font-bold text-roman-navy">
                      Teléfono & WhatsApp Oficial:
                    </strong>
                    <span className="font-mono text-sm font-bold text-emerald-800">
                      {workshopInfo.phone}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Direct Action Buttons: WhatsApp & Google Maps */}
            <div className="space-y-3">
              <a
                href={workshopInfo.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3.5 font-headline text-xs font-bold uppercase text-white shadow-md transition-colors hover:bg-emerald-500"
              >
                <MessageCircle className="h-4 w-4" />
                <span>CONTACTAR POR WHATSAPP (937 283 0402)</span>
              </a>

              <a
                href={workshopInfo.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-relief-gold flex w-full items-center justify-center gap-2 rounded-xl py-3 font-headline text-xs font-bold uppercase"
              >
                <Navigation className="h-4 w-4 text-roman-navy" />
                <span>ABRIR EN GOOGLE MAPS (CÁRDENAS)</span>
                <ExternalLink className="h-3.5 w-3.5 text-roman-navy" />
              </a>
            </div>

            {/* Delivery Switcher */}
            <div className="space-y-4 border-t border-slate-200 pt-4">
              <h4 className="font-headline text-xs font-bold uppercase tracking-wider text-roman-navy">
                Opciones de Recolección / Envío:
              </h4>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setDeliveryMode('pickup')}
                  className={`rounded-xl border p-3 text-left text-xs transition-all ${
                    deliveryMode === 'pickup'
                      ? 'border-roman-gold bg-roman-navy font-bold text-white shadow-md'
                      : 'border-slate-300 bg-roman-stone text-slate-600'
                  }`}
                >
                  <Store className="mb-1 h-4 w-4 text-roman-gold" />
                  <p className="font-headline text-[10px] font-bold uppercase">
                    Recolección Gratis
                  </p>
                  <p className="text-[9px] opacity-75">Taller Cárdenas</p>
                </button>

                <button
                  onClick={() => setDeliveryMode('delivery')}
                  className={`rounded-xl border p-3 text-left text-xs transition-all ${
                    deliveryMode === 'delivery'
                      ? 'border-roman-gold bg-roman-navy font-bold text-white shadow-md'
                      : 'border-slate-300 bg-roman-stone text-slate-600'
                  }`}
                >
                  <Truck className="mb-1 h-4 w-4 text-roman-gold" />
                  <p className="font-headline text-[10px] font-bold uppercase">Envío Local</p>
                  <p className="text-[9px] opacity-75">Cárdenas y Alrededores</p>
                </button>
              </div>

              {deliveryMode === 'delivery' && (
                <form onSubmit={handleCalculateShipping} className="animate-fadeIn space-y-2 pt-2">
                  <label className="block text-[11px] font-semibold text-slate-700">
                    Ingresa tu Colonia en Cárdenas:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Ej. Col. El Palmar / Centro"
                      value={userAddress}
                      onChange={e => setUserAddress(e.target.value)}
                      className="flex-1 rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 focus:border-roman-bronze focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="rounded-xl bg-roman-navy px-3 py-2 text-xs font-bold text-roman-gold transition-colors hover:bg-roman-dark"
                    >
                      Calcular
                    </button>
                  </div>

                  {estimatedCost > 0 && (
                    <div className="mt-2 flex items-center justify-between rounded-lg border border-emerald-300 bg-emerald-50 p-2.5 text-xs font-bold text-emerald-800">
                      <span>Costo estimado de envío local:</span>
                      <span className="text-sm font-black">${estimatedCost} MXN</span>
                    </div>
                  )}
                </form>
              )}
            </div>
          </div>

          {/* Right Column: Google Maps Location Frame Cárdenas */}
          <div className="relative flex min-h-[420px] flex-col justify-between overflow-hidden rounded-2xl border-2 border-roman-bronze bg-roman-navy shadow-card-marble lg:col-span-7">
            <div className="relative flex h-full min-h-[400px] w-full flex-col items-center justify-center bg-gradient-to-b from-roman-navy via-slate-900 to-roman-dark p-6 text-center">
              <div className="relative z-10 space-y-3">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-roman-gold bg-roman-navy text-roman-gold shadow-md">
                  <MapPin className="h-8 w-8 animate-bounce text-roman-gold" />
                </div>

                <div className="mx-auto max-w-sm space-y-1 rounded-xl border border-roman-bronze bg-roman-navy/95 p-4 shadow-2xl">
                  <h4 className="font-cinzel text-sm font-bold text-white">SUBLIMACIONES ROMÁN</h4>
                  <p className="font-mono text-xs font-semibold text-roman-gold">
                    📍 Cárdenas • Tabasco
                  </p>
                  <p className="text-[10px] text-slate-300">Carlos Molina 7B, Col. El Palmar</p>
                  <p className="text-[10px] text-slate-400">Coordenadas: 17.9942° N, 93.3756° W</p>
                </div>
              </div>

              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-xl border border-slate-700 bg-roman-dark/90 p-3 text-xs text-slate-300">
                <span className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-400">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  Sucursal Abierta • Cárdenas, TAB
                </span>
                <a
                  href={workshopInfo.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-[11px] font-bold text-roman-gold hover:underline"
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                  <span>WhatsApp: 937 283 0402</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
