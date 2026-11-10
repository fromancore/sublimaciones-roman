import React from 'react'

export default function RomanLogo({ className = 'w-10 h-10', showText = true }) {
  return (
    <div className="flex select-none items-center gap-3">
      <div
        className={`shadow-metallic relative flex items-center justify-center rounded-xl border border-roman-gold/40 bg-gradient-to-br from-roman-navy via-slate-900 to-roman-dark p-2 ${className}`}
      >
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-full w-full drop-shadow-md"
        >
          {/* Laurel Wreath Background */}
          <path
            d="M 20 50 C 20 25 35 15 50 15 C 65 15 80 25 80 50 C 80 75 65 85 50 85 C 35 85 20 75 20 50 Z"
            stroke="#D4AF37"
            strokeWidth="2"
            strokeDasharray="3 3"
            opacity="0.6"
          />

          {/* Crossed Spears */}
          <line
            x1="15"
            y1="85"
            x2="85"
            y2="15"
            stroke="#C0C0C0"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <path d="M 85 15 L 75 20 L 80 25 Z" fill="#D4AF37" />
          <line
            x1="85"
            y1="85"
            x2="15"
            y2="15"
            stroke="#C0C0C0"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <path d="M 15 15 L 25 20 L 20 25 Z" fill="#D4AF37" />

          {/* Roman Helmet Base & Crest */}
          {/* Crest (Plume) */}
          <path
            d="M 32 30 C 40 12, 60 12, 68 30 C 58 24, 42 24, 32 30 Z"
            fill="url(#crestGradient)"
          />

          {/* Helmet Body */}
          <path
            d="M 30 35 C 30 25, 70 25, 70 35 L 72 55 C 72 70, 60 76, 50 76 C 40 76, 28 70, 28 55 Z"
            fill="url(#helmetGradient)"
            stroke="#D4AF37"
            strokeWidth="2"
          />

          {/* Helmet Visor Slot & Nose Guard */}
          <path d="M 34 46 H 66 V 52 H 34 Z" fill="#0D1B2A" />
          <path d="M 50 44 L 54 62 L 46 62 Z" fill="#D4AF37" />
          <circle cx="38" cy="49" r="1.5" fill="#48CAE4" />
          <circle cx="62" cy="49" r="1.5" fill="#48CAE4" />

          {/* Cheek Guards */}
          <path d="M 30 55 L 36 70 L 42 60 Z" fill="#1B2A4A" stroke="#D4AF37" strokeWidth="1.5" />
          <path d="M 70 55 L 64 70 L 58 60 Z" fill="#1B2A4A" stroke="#D4AF37" strokeWidth="1.5" />

          {/* Gradients */}
          <defs>
            <linearGradient id="crestGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#2A6F97" />
              <stop offset="50%" stopColor="#48CAE4" />
              <stop offset="100%" stopColor="#D4AF37" />
            </linearGradient>
            <linearGradient id="helmetGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2C3E50" />
              <stop offset="50%" stopColor="#1B2A4A" />
              <stop offset="100%" stopColor="#0D1B2A" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="font-headline text-xl font-black tracking-wider text-white">
              SUBLIMACIONES
            </span>
            <span className="font-headline text-xl font-black tracking-wider text-roman-gold">
              ROMÁN
            </span>
          </div>
          <span className="-mt-1 text-[10px] font-semibold uppercase tracking-widest text-roman-cyan">
            Fuerza • Precisión • Calidad
          </span>
        </div>
      )}
    </div>
  )
}
