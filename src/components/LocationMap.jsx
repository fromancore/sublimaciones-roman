import React, { useState } from 'react';
import { MapPin, Clock, Phone, Navigation, Truck, Store, ExternalLink, MessageCircle, Info } from 'lucide-react';

export default function LocationMap() {
  const [deliveryMode, setDeliveryMode] = useState('pickup');
  const [userAddress, setUserAddress] = useState('');
  const [estimatedCost, setEstimatedCost] = useState(0);

  const workshopInfo = {
    city: 'Cárdenas, Tabasco, México',
    address: 'Carlos Molina 7B, Col. El Palmar, C.P. 86500, Cárdenas, Tabasco',
    phone: '937 283 0402',
    phoneRaw: '9372830402',
    hours: 'Lunes a Sábado: 9:00 AM - 7:00 PM',
    mapUrl: 'https://maps.google.com/?q=17.9942,-93.3756',
    whatsappUrl: 'https://wa.me/529372830402?text=Hola%20Sublimaciones%20Rom%C3%A1n,%20me%20gustar%C3%ADa%20cotizar%20un%20producto%20personalizado'
  };

  const handleCalculateShipping = (e) => {
    e.preventDefault();
    if (!userAddress.trim()) {
      alert('Ingresa tu colonia o dirección en Cárdenas para calcular el costo de envío.');
      return;
    }
    setEstimatedCost(35);
  };

  return (
    <section id="ubicacion-section" className="py-16 bg-roman-marble border-b border-roman-platinum">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Banner de Próxima Apertura */}
        <div className="card-architectural p-4 border-2 border-roman-bronze bg-roman-navy text-white text-center shadow-lg space-y-1">
          <div className="flex items-center justify-center gap-2 text-roman-gold font-headline font-bold text-xs uppercase tracking-widest">
            <Info className="w-4 h-4" />
            <span>Aviso de Sucursales & Cobertura</span>
          </div>
          <p className="font-cinzel font-black text-sm sm:text-base text-white">
            "Atendiendo actualmente en Cárdenas, Tabasco. ¡Próximamente también en Mérida, Yucatán!"
          </p>
        </div>

        {/* Section Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-roman-navy text-[10px] font-headline font-bold text-roman-gold uppercase tracking-widest border border-roman-bronze/40">
            <MapPin className="w-3.5 h-3.5" />
            Ubicación & Atención Directa
          </div>
          <h2 className="text-3xl sm:text-4xl font-cinzel font-black text-roman-dark">
            Taller Principal en <span className="text-roman-bronze">Cárdenas, Tabasco</span>
          </h2>
          <p className="text-slate-600 text-sm">
            Visita nuestra sucursal o contáctanos directamente por WhatsApp para coordinar la entrega o envío de tu pedido.
          </p>
        </div>

        {/* Map & Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column */}
          <div className="lg:col-span-5 card-architectural p-6 shadow-card-marble flex flex-col justify-between space-y-6 border-2 border-roman-bronze/30">
            
            <div className="space-y-4">
              <h3 className="font-cinzel font-bold text-xl text-roman-navy flex items-center gap-2">
                <Store className="w-5 h-5 text-roman-bronze" />
                Sucursal Cárdenas, Tabasco
              </h3>

              <div className="space-y-3 text-xs text-slate-700">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-roman-stone border border-slate-300">
                  <MapPin className="w-4 h-4 text-roman-navy shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-roman-navy block font-bold">Dirección Oficial:</strong>
                    <span>{workshopInfo.address}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-roman-stone border border-slate-300">
                  <Clock className="w-4 h-4 text-roman-bronze shrink-0" />
                  <div>
                    <strong className="text-roman-navy block font-bold">Horarios de Atención:</strong>
                    <span>{workshopInfo.hours}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-roman-stone border border-slate-300">
                  <Phone className="w-4 h-4 text-emerald-700 shrink-0" />
                  <div>
                    <strong className="text-roman-navy block font-bold">Teléfono & WhatsApp Oficial:</strong>
                    <span className="font-mono text-sm font-bold text-emerald-800">{workshopInfo.phone}</span>
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
                className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-headline font-bold text-xs uppercase flex items-center justify-center gap-2 shadow-md transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>CONTACTAR POR WHATSAPP (937 283 0402)</span>
              </a>

              <a
                href={workshopInfo.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-xl btn-relief-gold text-xs font-headline font-bold uppercase flex items-center justify-center gap-2"
              >
                <Navigation className="w-4 h-4 text-roman-navy" />
                <span>ABRIR EN GOOGLE MAPS (CÁRDENAS)</span>
                <ExternalLink className="w-3.5 h-3.5 text-roman-navy" />
              </a>
            </div>

            {/* Delivery Switcher */}
            <div className="space-y-4 pt-4 border-t border-slate-200">
              <h4 className="font-headline font-bold text-xs text-roman-navy uppercase tracking-wider">
                Opciones de Recolección / Envío:
              </h4>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setDeliveryMode('pickup')}
                  className={`p-3 rounded-xl border text-left text-xs transition-all ${
                    deliveryMode === 'pickup'
                      ? 'bg-roman-navy text-white font-bold border-roman-gold shadow-md'
                      : 'bg-roman-stone border-slate-300 text-slate-600'
                  }`}
                >
                  <Store className="w-4 h-4 mb-1 text-roman-gold" />
                  <p className="font-headline font-bold uppercase text-[10px]">Recolección Gratis</p>
                  <p className="text-[9px] opacity-75">Taller Cárdenas</p>
                </button>

                <button
                  onClick={() => setDeliveryMode('delivery')}
                  className={`p-3 rounded-xl border text-left text-xs transition-all ${
                    deliveryMode === 'delivery'
                      ? 'bg-roman-navy text-white font-bold border-roman-gold shadow-md'
                      : 'bg-roman-stone border-slate-300 text-slate-600'
                  }`}
                >
                  <Truck className="w-4 h-4 mb-1 text-roman-gold" />
                  <p className="font-headline font-bold uppercase text-[10px]">Envío Local</p>
                  <p className="text-[9px] opacity-75">Cárdenas y Alrededores</p>
                </button>
              </div>

              {deliveryMode === 'delivery' && (
                <form onSubmit={handleCalculateShipping} className="space-y-2 pt-2 animate-fadeIn">
                  <label className="text-[11px] text-slate-700 font-semibold block">Ingresa tu Colonia en Cárdenas:</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Ej. Col. El Palmar / Centro"
                      value={userAddress}
                      onChange={(e) => setUserAddress(e.target.value)}
                      className="flex-1 bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-roman-bronze"
                    />
                    <button
                      type="submit"
                      className="px-3 py-2 bg-roman-navy hover:bg-roman-dark text-roman-gold rounded-xl text-xs font-bold transition-colors"
                    >
                      Calcular
                    </button>
                  </div>

                  {estimatedCost > 0 && (
                    <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold flex justify-between items-center mt-2">
                      <span>Costo estimado de envío local:</span>
                      <span className="text-sm font-black">${estimatedCost} MXN</span>
                    </div>
                  )}
                </form>
              )}
            </div>

          </div>

          {/* Right Column: Google Maps Location Frame Cárdenas */}
          <div className="lg:col-span-7 bg-roman-navy rounded-2xl overflow-hidden border-2 border-roman-bronze relative shadow-card-marble min-h-[420px] flex flex-col justify-between">
            <div className="relative w-full h-full min-h-[400px] bg-gradient-to-b from-roman-navy via-slate-900 to-roman-dark flex flex-col items-center justify-center p-6 text-center">
              
              <div className="relative z-10 space-y-3">
                <div className="w-16 h-16 rounded-full bg-roman-navy border-2 border-roman-gold flex items-center justify-center text-roman-gold shadow-md mx-auto">
                  <MapPin className="w-8 h-8 text-roman-gold animate-bounce" />
                </div>

                <div className="bg-roman-navy/95 border border-roman-bronze p-4 rounded-xl shadow-2xl max-w-sm mx-auto space-y-1">
                  <h4 className="font-cinzel font-bold text-sm text-white">SUBLIMACIONES ROMÁN</h4>
                  <p className="text-xs text-roman-gold font-mono font-semibold">📍 Cárdenas • Tabasco</p>
                  <p className="text-[10px] text-slate-300">Carlos Molina 7B, Col. El Palmar</p>
                  <p className="text-[10px] text-slate-400">Coordenadas: 17.9942° N, 93.3756° W</p>
                </div>
              </div>

              <div className="absolute bottom-4 left-4 right-4 bg-roman-dark/90 border border-slate-700 p-3 rounded-xl flex items-center justify-between text-xs text-slate-300">
                <span className="flex items-center gap-1.5 text-emerald-400 font-bold text-[11px]">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  Sucursal Abierta • Cárdenas, TAB
                </span>
                <a
                  href={workshopInfo.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] font-bold text-roman-gold hover:underline flex items-center gap-1"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp: 937 283 0402</span>
                </a>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
