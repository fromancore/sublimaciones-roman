import React from 'react';
import RomanLogo from './RomanLogo';
import { MapPin, Phone, Clock, ShieldCheck, MessageCircle } from 'lucide-react';

export default function Footer({ onNavigate }) {
  return (
    <footer className="bg-roman-navy text-slate-300 text-xs border-t border-roman-bronze/40">
      
      {/* Top Greca Line Divider */}
      <div className="greca-divider-gold w-full opacity-60"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <RomanLogo className="w-8 h-8" showText={false} />
              <span className="font-cinzel font-black text-lg tracking-widest text-white">
                SUBLIMACIONES <span className="text-roman-gold">ROMÁN</span>
              </span>
            </div>
            <p className="leading-relaxed text-slate-400 text-[11px]">
              Transformamos ideas y momentos especiales en productos personalizados, creativos y accesibles con fuerza y calidad artesanal.
            </p>
            <div className="text-roman-gold font-headline font-bold text-xs">
              CÁRDENAS, TABASCO • PRÓX. MÉRIDA, YUCATÁN
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-3">
            <h4 className="font-cinzel font-bold text-xs text-white uppercase tracking-widest border-b border-slate-700/60 pb-1">
              Navegación Institucional
            </h4>
            <ul className="space-y-2 text-[11px]">
              <li><button onClick={() => onNavigate('inicio')} className="hover:text-roman-gold transition-colors">Inicio & Propuesta de Valor</button></li>
              <li><button onClick={() => onNavigate('catalogo')} className="hover:text-roman-gold transition-colors">Catálogo de Productos Base</button></li>
              <li><button onClick={() => onNavigate('personalizar')} className="hover:text-roman-gold transition-colors">Estudio de Personalización 2D</button></li>
              <li><button onClick={() => onNavigate('rastrear')} className="hover:text-roman-gold transition-colors">Rastrear Pedido (Regla RN-01)</button></li>
              <li><button onClick={() => onNavigate('ubicacion')} className="hover:text-roman-gold transition-colors">Ubicación y Entregas en Cárdenas</button></li>
            </ul>
          </div>

          {/* Contact & Hours */}
          <div className="space-y-3">
            <h4 className="font-cinzel font-bold text-xs text-white uppercase tracking-widest border-b border-slate-700/60 pb-1">
              Contacto & Atención
            </h4>
            <div className="space-y-2 text-[11px]">
              <p className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-roman-gold shrink-0 mt-0.5" />
                <span>Carlos Molina 7B, Col. El Palmar, C.P. 86500, Cárdenas, Tabasco</span>
              </p>
              <a 
                href="https://wa.me/529372830402" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-emerald-400 hover:underline"
              >
                <MessageCircle className="w-3.5 h-3.5 shrink-0" />
                <span className="font-mono font-bold">WhatsApp: 937 283 0402</span>
              </a>
              <p className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-roman-bronze shrink-0" />
                <span>Lunes a Sábado: 9:00 AM - 7:00 PM</span>
              </p>
            </div>
          </div>

          {/* Client Artwork Rights Notice */}
          <div className="space-y-3 bg-roman-dark/80 p-4 rounded-xl border border-roman-bronze/30">
            <h4 className="font-cinzel font-bold text-xs text-roman-gold uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              Derechos sobre Diseños
            </h4>
            <p className="text-[10px] leading-relaxed text-slate-400">
              Sublimaciones Román garantiza el uso autorizado de los logotipos, fotografías e ilustraciones enviadas por los clientes para fines exclusivos de sublimación. Respetamos la propiedad intelectual de cada creación.
            </p>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px]">
          <p>© {new Date().getFullYear()} Sublimaciones Román. Atendiendo en Cárdenas, Tabasco. ¡Próximamente en Mérida, Yucatán!</p>
        </div>

      </div>
    </footer>
  );
}
