import React from 'react'
import { Columns, Sparkles } from 'lucide-react'
import tazaMuestraOficial from '../assets/Taza blanca con logo de guerrero romano (1).png'

/**
 * Componente MuestraContenedor
 * Renderiza el contenedor oficial de la muestra de sublimación con la taza blanca,
 * el logo del guerrero romano y el texto oficial de Sublimaciones Román.
 * Ajusta la escala y proporciones preservando el aspect-ratio original sin distorsión.
 */
export default function MuestraContenedor({
  imageSrc = tazaMuestraOficial,
  alt = 'Taza blanca con logo de guerrero romano y texto de Sublimaciones Román',
  className = '',
}) {
  return (
    <div
      className={`card-architectural space-y-6 border-2 border-roman-bronze/30 p-6 shadow-card-marble ${className}`}
    >
      {/* Encabezado del contenedor de muestra */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2">
          <Columns className="h-4 w-4 text-roman-bronze" />
          <span className="font-cinzel text-xs font-bold uppercase tracking-wider text-roman-navy">
            Muestra de Sublimación
          </span>
        </div>
        <span className="rounded border border-slate-300 bg-roman-stone px-2.5 py-1 font-mono text-[10px] font-bold text-roman-navy">
          Cárdenas, TAB
        </span>
      </div>

      {/* Contenedor visual de la muestra oficial */}
      <div className="group relative flex min-h-[300px] flex-col items-center justify-center overflow-hidden rounded-xl bg-gradient-to-b from-slate-900 via-roman-navy to-slate-950 p-6 shadow-inner sm:min-h-[340px]">
        {/* Halo / Resplandor de fondo para contraste óptimo con la cerámica blanca */}
        <div className="pointer-events-none absolute h-56 w-56 rounded-full bg-roman-gold/10 blur-2xl" />

        {/* Indicadores superiores */}
        <div className="absolute left-3.5 top-3.5 flex items-center gap-1.5 rounded-full border border-roman-gold/30 bg-roman-navy/85 px-2.5 py-1 backdrop-blur-sm">
          <Sparkles className="h-3 w-3 animate-pulse text-roman-gold" />
          <span className="font-headline text-[9px] font-bold uppercase tracking-wider text-roman-gold">
            Muestra Oficial
          </span>
        </div>
        <div className="absolute right-3.5 top-3.5 rounded border border-slate-700/80 bg-slate-900/85 px-2 py-0.5 font-mono text-[9px] font-semibold text-slate-300 backdrop-blur-sm">
          Escala 1:1
        </div>

        {/* Envoltorio de escala y proporciones controladas */}
        <div className="relative z-10 flex w-full max-w-xs items-center justify-center py-2">
          <img
            src={imageSrc}
            onError={e => {
              // Respaldo dinámico a la ruta pública en caso de requerirse
              if (e.currentTarget.src !== '/Taza blanca con logo de guerrero romano (1).png') {
                e.currentTarget.src = '/Taza blanca con logo de guerrero romano (1).png'
              }
            }}
            alt={alt}
            className="h-auto max-h-56 w-auto max-w-[85%] object-contain drop-shadow-[0_16px_28px_rgba(0,0,0,0.65)] transition-transform duration-500 ease-out group-hover:scale-105 sm:max-h-64"
            loading="eager"
          />
        </div>

        {/* Información y especificación del producto sublimado */}
        <div className="relative z-10 mt-3 text-center">
          <p className="font-headline text-xs font-bold text-slate-100">
            Taza Cerámica Blanca 11oz • Sublimación HD
          </p>
          <p className="mt-0.5 text-[11px] font-medium text-slate-300">
            Tazas, Termos, Playeras, Gorras y más 🏛️
          </p>
        </div>
      </div>

      {/* Regla RN-01 de Garantía de Aprobación */}
      <div className="flex items-center gap-3 rounded-xl border border-roman-bronze/40 bg-roman-stone p-3 text-xs text-slate-700">
        <span className="text-lg">🛡️</span>
        <p className="text-[11px] leading-tight">
          <strong className="font-bold text-roman-navy">Regla RN-01:</strong> Recibes una prueba
          visual digital exacta para aprobar antes de imprimir.
        </p>
      </div>
    </div>
  )
}
