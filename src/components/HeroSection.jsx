import React from 'react'
import { Shield, Palette, DollarSign, HeartHandshake } from 'lucide-react'
import MuestraContenedor from './MuestraContenedor'

export { MuestraContenedor }

export default function HeroSection() {
  const valuePillars = [
    {
      icon: Palette,
      title: 'Diseños Creativos',
      desc: 'Arte 100% personalizado adaptado a tu estilo único con revisión gráfica.',
    },
    {
      icon: Shield,
      title: 'Calidad en Sublimación',
      desc: 'Impresión HD de alta durabilidad resistente al lavado constante.',
    },
    {
      icon: DollarSign,
      title: 'Cotización Transparente',
      desc: 'Precios accesibles con opción del 50% de anticipo inicial.',
    },
    {
      icon: HeartHandshake,
      title: 'Atención Cercana',
      desc: 'Asesoría directa por WhatsApp (937 283 0402) y aprobación previa RN-01.',
    },
  ]

  return (
    <section className="relative overflow-hidden border-b border-roman-platinum bg-roman-marble py-16 md:py-24">
      <div className="relative z-10 mx-auto max-w-7xl space-y-16 px-4 sm:px-6 lg:px-8">
        {/* Main Hero Header */}
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          {/* Left Column */}
          <div className="space-y-6 text-center lg:col-span-7 lg:text-left">
            {/* Monumental Headline */}
            <h1 className="font-cinzel text-3xl font-black leading-tight tracking-tight text-roman-dark sm:text-4xl lg:text-5xl">
              Fuerza, Elegancia y <br />
              <span className="inline-block border-b-2 border-roman-bronze/40 pb-1 text-roman-bronze">
                Calidad Artesanal
              </span>
            </h1>

            {/* Slogan */}
            <div className="py-1">
              <p className="mx-auto max-w-2xl font-body text-base font-medium leading-relaxed text-slate-700 sm:text-lg lg:mx-0">
                "Transformamos ideas y momentos especiales en productos personalizados, creativos y
                accesibles."
              </p>
            </div>

            {/* Stats */}
            <div className="mx-auto grid max-w-lg grid-cols-3 gap-4 border-t border-slate-300/80 pt-4 lg:mx-0">
              <div className="text-center lg:text-left">
                <p className="font-cinzel text-2xl font-black text-roman-navy">+5,000</p>
                <p className="text-[11px] font-bold uppercase text-slate-500">Entregas Exitosas</p>
              </div>
              <div className="border-x border-slate-300 px-3 text-center lg:text-left">
                <p className="font-cinzel text-2xl font-black text-roman-bronze">100%</p>
                <p className="text-[11px] font-bold uppercase text-slate-500">Garantía RN-01</p>
              </div>
              <div className="text-center lg:text-left">
                <p className="font-cinzel text-xl font-black text-slate-700 sm:text-2xl">
                  48 - 72 hrs
                </p>
                <p className="text-[10px] font-bold uppercase leading-tight text-slate-500 sm:text-[11px]">
                  dependiendo el producto
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Contenedor Oficial de la Muestra */}
          <div className="relative lg:col-span-5">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <MuestraContenedor />
            </div>
          </div>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 gap-6 pt-6 md:grid-cols-2 lg:grid-cols-4">
          {valuePillars.map((pillar, idx) => {
            const Icon = pillar.icon
            return (
              <div
                key={idx}
                className="card-architectural space-y-3 border border-slate-200/90 p-6 shadow-card-marble transition-all duration-300 hover:-translate-y-1 hover:border-roman-bronze/60"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-roman-navy text-roman-gold shadow-md">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-cinzel text-sm font-bold uppercase text-roman-navy">
                  {pillar.title}
                </h3>
                <p className="text-xs font-normal leading-relaxed text-slate-600">{pillar.desc}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
