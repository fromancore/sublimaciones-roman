import React from 'react'
import RomanLogo from './RomanLogo'
import { MapPin, Phone, Clock, ShieldCheck, MessageCircle } from 'lucide-react'

export default function Footer({ onNavigate }) {
  return (
    <footer className="border-t border-roman-bronze/40 bg-roman-navy text-xs text-slate-300">
      {/* Top Greca Line Divider */}
      <div className="greca-divider-gold w-full opacity-60" />

      <div className="mx-auto max-w-7xl space-y-10 px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <RomanLogo className="h-8 w-8" showText={false} />
              <span className="font-cinzel text-lg font-black tracking-widest text-white">
                SUBLIMACIONES <span className="text-roman-gold">ROMÁN</span>
              </span>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-400">
              Transformamos ideas y momentos especiales en productos personalizados, creativos y
              accesibles con fuerza y calidad artesanal.
            </p>
            <div className="font-headline text-xs font-bold text-roman-gold">
              CÁRDENAS, TABASCO • PRÓX. MÉRIDA, YUCATÁN
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-3">
            <h4 className="border-b border-slate-700/60 pb-1 font-cinzel text-xs font-bold uppercase tracking-widest text-white">
              Navegación Institucional
            </h4>
            <ul className="space-y-2 text-[11px]">
              <li>
                <button
                  onClick={() => onNavigate('inicio')}
                  className="transition-colors hover:text-roman-gold"
                >
                  Inicio & Propuesta de Valor
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('catalogo')}
                  className="transition-colors hover:text-roman-gold"
                >
                  Catálogo de Productos Base
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('personalizar')}
                  className="transition-colors hover:text-roman-gold"
                >
                  Estudio de Personalización 2D
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('rastrear')}
                  className="transition-colors hover:text-roman-gold"
                >
                  Rastrear Pedido (Regla RN-01)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('ubicacion')}
                  className="transition-colors hover:text-roman-gold"
                >
                  Ubicación y Entregas en Cárdenas
                </button>
              </li>
            </ul>
          </div>

          {/* Contact & Hours */}
          <div className="space-y-3">
            <h4 className="border-b border-slate-700/60 pb-1 font-cinzel text-xs font-bold uppercase tracking-widest text-white">
              Contacto & Atención
            </h4>
            <div className="space-y-2 text-[11px]">
              <p className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-roman-gold" />
                <span>Carlos Molina 7B, Col. El Palmar, C.P. 86500, Cárdenas, Tabasco</span>
              </p>
              <a
                href="https://wa.me/529372830402"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-emerald-400 hover:underline"
              >
                <MessageCircle className="h-3.5 w-3.5 shrink-0" />
                <span className="font-mono font-bold">WhatsApp: 937 283 0402</span>
              </a>
              <p className="flex items-center gap-2">
                <Clock className="h-3.5 w-3.5 shrink-0 text-roman-bronze" />
                <span>Lunes a Sábado: 9:00 AM - 7:00 PM</span>
              </p>
            </div>
          </div>

          {/* Client Artwork Rights Notice */}
          <div className="space-y-3 rounded-xl border border-roman-bronze/30 bg-roman-dark/80 p-4">
            <h4 className="flex items-center gap-1.5 font-cinzel text-xs font-bold uppercase tracking-wider text-roman-gold">
              <ShieldCheck className="h-4 w-4" />
              Derechos sobre Diseños
            </h4>
            <p className="text-[10px] leading-relaxed text-slate-400">
              Sublimaciones Román garantiza el uso autorizado de los logotipos, fotografías e
              ilustraciones enviadas por los clientes para fines exclusivos de sublimación.
              Respetamos la propiedad intelectual de cada creación.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-800 pt-8 text-[10px] sm:flex-row">
          <p>
            © {new Date().getFullYear()} Sublimaciones Román. Atendiendo en Cárdenas, Tabasco.
            ¡Próximamente en Mérida, Yucatán!
          </p>
        </div>
      </div>
    </footer>
  )
}
