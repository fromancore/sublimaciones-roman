import React from 'react';
import { Shield, Palette, DollarSign, HeartHandshake, Columns } from 'lucide-react';

export default function HeroSection() {
  const valuePillars = [
    {
      icon: Palette,
      title: "Diseños Creativos",
      desc: "Arte 100% personalizado adaptado a tu estilo único con revisión gráfica."
    },
    {
      icon: Shield,
      title: "Calidad en Sublimación",
      desc: "Impresión HD de alta durabilidad resistente al lavado constante."
    },
    {
      icon: DollarSign,
      title: "Cotización Transparente",
      desc: "Precios accesibles con opción del 50% de anticipo inicial."
    },
    {
      icon: HeartHandshake,
      title: "Atención Cercana",
      desc: "Asesoría directa por WhatsApp (937 283 0402) y aprobación previa RN-01."
    }
  ];

  return (
    <section className="relative overflow-hidden bg-roman-marble py-16 md:py-24 border-b border-roman-platinum">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
        
        {/* Main Hero Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Monumental Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-cinzel font-black tracking-tight text-roman-dark leading-tight">
              Fuerza, Elegancia y <br />
              <span className="text-roman-bronze border-b-2 border-roman-bronze/40 pb-1 inline-block">
                Calidad Artesanal
              </span>
            </h1>

            {/* Slogan */}
            <div className="py-1">
              <p className="text-base sm:text-lg text-slate-700 font-medium leading-relaxed max-w-2xl mx-auto lg:mx-0 font-body">
                "Transformamos ideas y momentos especiales en productos personalizados, creativos y accesibles."
              </p>
            </div>

            {/* Stats */}
            <div className="pt-4 grid grid-cols-3 gap-4 border-t border-slate-300/80 max-w-lg mx-auto lg:mx-0">
              <div className="text-center lg:text-left">
                <p className="text-2xl font-cinzel font-black text-roman-navy">+5,000</p>
                <p className="text-[11px] text-slate-500 font-bold uppercase">Entregas Exitosas</p>
              </div>
              <div className="text-center lg:text-left border-x border-slate-300 px-3">
                <p className="text-2xl font-cinzel font-black text-roman-bronze">100%</p>
                <p className="text-[11px] text-slate-500 font-bold uppercase">Garantía RN-01</p>
              </div>
              <div className="text-center lg:text-left">
                <p className="text-xl sm:text-2xl font-cinzel font-black text-slate-700">48 - 72 hrs</p>
                <p className="text-[10px] sm:text-[11px] text-slate-500 font-bold uppercase leading-tight">dependiendo el producto</p>
              </div>
            </div>

          </div>

          {/* Right Column */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              <div className="card-architectural p-6 border-2 border-roman-bronze/30 space-y-6 shadow-card-marble">
                
                <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                  <div className="flex items-center gap-2">
                    <Columns className="w-4 h-4 text-roman-bronze" />
                    <span className="font-cinzel font-bold text-xs text-roman-navy uppercase tracking-wider">
                      Muestra de Sublimación
                    </span>
                  </div>
                  <span className="px-2.5 py-1 rounded bg-roman-stone text-roman-navy font-mono text-[10px] font-bold border border-slate-300">
                    Cárdenas, TAB
                  </span>
                </div>

                <div className="relative rounded-xl overflow-hidden bg-gradient-to-b from-slate-900 to-roman-navy p-6 flex flex-col items-center justify-center min-h-[260px] shadow-inner">
                  
                  <div className="relative w-40 h-40 flex items-center justify-center">
                    <div className="w-32 h-36 bg-gradient-to-tr from-slate-100 via-white to-slate-200 rounded-r-3xl rounded-l-md shadow-2xl border-4 border-roman-navy flex flex-col items-center justify-center p-3 text-center">
                      <div className="w-full h-full rounded-lg bg-roman-navy flex flex-col items-center justify-center p-2 border border-roman-gold/60">
                        <span className="text-2xl">🏛️</span>
                        <p className="text-[9px] font-cinzel font-bold text-roman-gold tracking-widest mt-1">SUBLIMACIONES ROMÁN</p>
                        <p className="text-[7px] text-slate-300 uppercase">Tu Arte Aquí</p>
                      </div>
                    </div>
                  </div>

                  <p className="mt-4 text-xs font-semibold text-slate-200">
                    Tazas, Termos, Playeras, Gorras y más 🏛️
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-roman-stone border border-roman-bronze/40 text-xs text-slate-700 flex items-center gap-3">
                  <span className="text-lg">🛡️</span>
                  <p className="text-[11px] leading-tight">
                    <strong className="text-roman-navy font-bold">Regla RN-01:</strong> Recibes una prueba visual digital exacta para aprobar antes de imprimir.
                  </p>
                </div>

              </div>

            </div>
          </div>

        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-6">
          {valuePillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div 
                key={idx}
                className="card-architectural p-6 border border-slate-200/90 hover:border-roman-bronze/60 transition-all duration-300 shadow-card-marble hover:-translate-y-1 space-y-3"
              >
                <div className="w-10 h-10 rounded-xl bg-roman-navy flex items-center justify-center text-roman-gold shadow-md">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-cinzel font-bold text-sm text-roman-navy uppercase">{pillar.title}</h3>
                <p className="text-xs text-slate-600 font-normal leading-relaxed">{pillar.desc}</p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
