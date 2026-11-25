import React, { useState } from 'react'
import { Sparkles, Clock, Search, Filter, Tag, CheckCircle2, ChevronRight } from 'lucide-react'
import tazaMagicaNegra from '../assets/Productos_Base/Taza_Magica_Termica_11oz_Negra.png'
import tazaCeramicaBlanca from '../assets/Productos_Base/Taza_de_Ceramica_Blanca_Clasica_11oz.png'
import termoInoxidableBlanco from '../assets/Productos_Base/Termo_de_Acero_Inoxidable_500ml_Blanco.png'
import termoInoxidablePlateado from '../assets/Productos_Base/Termo_de_Acero_Inoxidable_500ml.png'
import tazaCeramicaAzulMarino from '../assets/Productos_Base/Taza_Ceramica_Azul_Marino_11oz.png'
import gorraCamionera from '../assets/Productos_Base/Gorra_Camionera_Frente_Blanco.png'
import cojinDecorativo from '../assets/Productos_Base/Cojin_Decorativo_40x40cm.png'
import mousepadGamer from '../assets/Productos_Base/Mousepad_Gamer_Antideslizante_30x80cm.png'
import llaveroPolimero from '../assets/Productos_Base/Llavero_de_Polimero_Doble_Cara.png'
import { VARIANTES_PLAYERA } from '../services/variantesPlayera.js'

const VARIANTES_TERMO = [
  {
    color: '#FFFFFF',
    nombre: 'Blanco',
    image: termoInoxidableBlanco,
    zona: { x: -0.33, y: 0.456, w: 1.5, h: 0.2, rotacion: 90 },
  },
  {
    color: '#C0C0C0',
    nombre: 'Plateado',
    image: termoInoxidablePlateado,
    zona: { x: -0.15, y: 0.463, w: 1.4, h: 0.181, rotacion: 90 },
  },
]

const VARIANTES_TAZA_MAGICA = [
  {
    color: '#0D1B2A',
    nombre: 'Azul marino',
    image: tazaCeramicaAzulMarino,
    zona: { x: 0.339, y: 0.191, w: 0.333, h: 0.647, rotacion: 0 },
  },
  {
    color: '#000000',
    nombre: 'Negro',
    image: tazaMagicaNegra,
    zona: { x: 0.342, y: 0.174, w: 0.329, h: 0.664, rotacion: 0 },
  },
]

const VARIANTES_TAZA_CLASICA = [
  {
    color: '#FFFFFF',
    nombre: 'Blanco',
    image: tazaCeramicaBlanca,
    zona: { x: 0.341, y: 0.176, w: 0.329, h: 0.664, rotacion: 0 },
  },
]

export const INITIAL_PRODUCTS = [
  {
    id: 'prod-taza-01',
    name: 'Taza Mágica Térmica 11oz',
    category: 'Tazas y Vasos',
    price: 135,
    productionTime: '24 Horas',
    material: 'Cerámica con recubrimiento sensible al calor',
    description:
      'Revela tu diseño personalizado al contacto con bebidas calientes. Impresión HD duradera.',
    badge: 'Más Vendido',
    type: 'taza',
    orientacionTexto: 'sigueZona',
    colors: VARIANTES_TAZA_MAGICA.map(variant => variant.color),
    image: tazaCeramicaAzulMarino,
    zonaPersonalizable: { x: 0.342, y: 0.174, w: 0.329, h: 0.664, rotacion: 0 },
    variantes: VARIANTES_TAZA_MAGICA,
  },
  {
    id: 'prod-termo-01',
    name: 'Termo de Acero Inoxidable 500ml',
    category: 'Tazas y Vasos',
    price: 260,
    productionTime: '48 Horas',
    material: 'Acero Grado Alimenticio 304 Doble Pared',
    description:
      'Conserva bebidas frías 12h y calientes 8h. Acabado brillante con impresión sublimada full color.',
    badge: 'Premium',
    type: 'termo',
    orientacionTexto: 'horizontal',
    colors: VARIANTES_TERMO.map(variant => variant.color),
    image: termoInoxidableBlanco,
    zonaPersonalizable: { x: -0.33, y: 0.456, w: 1.5, h: 0.2, rotacion: 90 },
    variantes: VARIANTES_TERMO,
  },
  {
    id: 'prod-playera-01',
    name: 'Playera Dry-Fit Sublimada Total',
    category: 'Textil',
    price: 220,
    productionTime: '48 Horas',
    material: 'Poliéster 100% Microfibra de Alta Densidad',
    description:
      'Transpirable, suave y de secado rápido. Colores vívidos que no se desvanecen con el lavado.',
    badge: 'Popular',
    type: 'playera',
    orientacionTexto: 'sigueZona',
    colors: VARIANTES_PLAYERA.map(variant => variant.color),
    image: VARIANTES_PLAYERA[0].image,
    variantes: VARIANTES_PLAYERA,
  },
  {
    id: 'prod-gorra-01',
    name: 'Gorra Camionera Frente Blanco',
    category: 'Textil',
    price: 110,
    productionTime: '24 Horas',
    material: 'Frente Poliéster con Malla Respirable',
    description:
      'Ajuste broche plástico retro. Ideal para logotipos, clubes, eventos y regalos de empresa.',
    badge: 'Económico',
    type: 'gorra',
    orientacionTexto: 'sigueZona',
    colors: ['#0D1B2A', '#2A6F97', '#000000'],
    image: gorraCamionera,
  },
  {
    id: 'prod-cojin-01',
    name: 'Cojín Decorativo 40x40cm con Relleno',
    category: 'Decoración & Hogar',
    price: 180,
    productionTime: '48 Horas',
    material: 'Funda de Tela Lino Poliéster Removible',
    description:
      'Incluye relleno siliconizado ultra suave. Impresión por ambos lados con tus fotos o ilustraciones.',
    badge: 'Regalo Perfecto',
    type: 'cojin',
    orientacionTexto: 'sigueZona',
    colors: ['#FFFFFF', '#F8F9FA'],
    image: cojinDecorativo,
  },
  {
    id: 'prod-mousepad-01',
    name: 'Mousepad Gamer Antideslizante 30x80cm',
    category: 'Accesorios',
    price: 195,
    productionTime: '24 Horas',
    material: 'Superficie Neopreno de Alta Precisión y Base Goma',
    description: 'Bordes cosidos reforzados. Deslizamiento suave optimizado para gaming y oficina.',
    badge: 'Gamer XL',
    type: 'mousepad',
    orientacionTexto: 'sigueZona',
    colors: ['#0D1B2A', '#000000'],
    image: mousepadGamer,
  },
  {
    id: 'prod-llavero-01',
    name: 'Llavero de Polímero Doble Cara',
    category: 'Accesorios',
    price: 45,
    productionTime: '24 Horas',
    material: 'Polímero Ultra Resistente con Herraje Metálico',
    description:
      'Resistente a caídas y rayaduras. Personalizable con fotos distintas en frente y vuelta.',
    badge: 'Detalle',
    type: 'llavero',
    orientacionTexto: 'sigueZona',
    colors: ['#FFFFFF'],
    image: llaveroPolimero,
  },
  {
    id: 'prod-taza-02',
    name: 'Taza de Cerámica Blanca Clásica 11oz',
    category: 'Tazas y Vasos',
    price: 95,
    productionTime: '24 Horas',
    material: 'Cerámica Blanca de Alta Pureza Grado A',
    description:
      'Apta para microondas y lavavajillas. Superficie ultra brillante para colores radiantes.',
    badge: 'Clásico',
    type: 'taza',
    orientacionTexto: 'sigueZona',
    colors: VARIANTES_TAZA_CLASICA.map(variant => variant.color),
    image: tazaCeramicaBlanca,
    zonaPersonalizable: { x: 0.341, y: 0.176, w: 0.329, h: 0.664, rotacion: 0 },
    variantes: VARIANTES_TAZA_CLASICA,
  },
]

export default function ProductCatalog({ onSelectProductToCustomize }) {
  const [selectedCategory, setSelectedCategory] = useState('Todas')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('popular')

  const categories = ['Todas', 'Tazas y Vasos', 'Textil', 'Accesorios', 'Decoración & Hogar']

  const filteredProducts = INITIAL_PRODUCTS.filter(prod => {
    const matchesCategory = selectedCategory === 'Todas' || prod.category === selectedCategory
    const matchesSearch =
      prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  }).sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price
    if (sortBy === 'price-high') return b.price - a.price
    return 0
  })

  return (
    <section id="catalogo-section" className="relative bg-roman-marble py-16">
      <div className="mx-auto max-w-7xl space-y-12 px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl space-y-3 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-roman-bronze/40 bg-roman-navy px-3.5 py-1 font-headline text-[10px] font-bold uppercase tracking-widest text-roman-gold">
            <Tag className="h-3.5 w-3.5" />
            Catálogo de Productos Base
          </div>
          <h2 className="font-cinzel text-3xl font-black text-roman-dark sm:text-4xl">
            Selecciona tu Producto y <span className="text-roman-bronze">Personalízalo</span>
          </h2>
          <p className="text-sm text-slate-600">
            Todos nuestros productos cuentan con garantía de color, alta definición y aprobación
            previa de diseño.
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div className="card-architectural space-y-4 p-4 shadow-card-marble md:p-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar tazas, termos, playeras..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-roman-stone py-2.5 pl-10 pr-4 text-xs text-slate-800 placeholder-slate-400 focus:border-roman-bronze focus:outline-none"
              />
            </div>

            {/* Category Selector Tabs */}
            <div className="scrollbar-none flex w-full items-center gap-1.5 overflow-x-auto pb-2 md:w-auto md:pb-0">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-xl px-4 py-2 font-headline text-xs font-bold uppercase tracking-wider transition-all ${
                    selectedCategory === cat
                      ? 'btn-relief-navy text-white shadow-md'
                      : 'border border-slate-300 bg-roman-stone text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <div className="flex w-full items-center justify-end gap-2 md:w-auto">
              <Filter className="h-4 w-4 text-roman-bronze" />
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="rounded-xl border border-slate-300 bg-roman-stone px-3 py-2 text-xs font-medium text-slate-800 focus:border-roman-bronze focus:outline-none"
              >
                <option value="popular">Ordenar: Destacados</option>
                <option value="price-low">Precio: Menor a Mayor</option>
                <option value="price-high">Precio: Mayor a Menor</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map(product => (
            <div
              key={product.id}
              className="card-architectural group flex flex-col justify-between overflow-hidden shadow-card-marble transition-all duration-300 hover:-translate-y-1 hover:border-roman-bronze/60"
            >
              <div>
                {/* Image Showcase Box */}
                <div className="relative flex h-48 items-center justify-center border-b border-slate-200 bg-gradient-to-br from-roman-navy to-slate-900 p-6">
                  <span className="absolute left-3 top-3 rounded bg-roman-gold px-2.5 py-1 font-headline text-[9px] font-black uppercase text-roman-navy shadow-md">
                    {product.badge}
                  </span>

                  <div className="absolute right-3 top-3 flex items-center gap-1 rounded border border-roman-bronze/40 bg-roman-dark/90 px-2.5 py-1 font-mono text-[9px] font-bold text-slate-200">
                    <Clock className="h-3 w-3 text-roman-gold" />
                    <span>{product.productionTime}</span>
                  </div>

                  <div className="flex h-32 w-32 select-none items-center justify-center transition-transform duration-300 group-hover:scale-110">
                    {product.image ? (
                      <img
                        src={product.image}
                        onError={e => {
                          if (
                            e.currentTarget.src !==
                            '/Taza blanca con logo de guerrero romano (1).png'
                          ) {
                            e.currentTarget.src = '/Taza blanca con logo de guerrero romano (1).png'
                          }
                        }}
                        alt={product.name}
                        className="h-full w-full object-contain drop-shadow-[0_8px_16px_rgba(0,0,0,0.4)]"
                      />
                    ) : (
                      <span className="text-6xl">{product.popularImage}</span>
                    )}
                  </div>
                </div>

                {/* Card Body */}
                <div className="space-y-2.5 p-5">
                  <div className="font-headline text-[10px] font-bold uppercase tracking-wider text-roman-bronze">
                    {product.category}
                  </div>

                  <h3 className="line-clamp-1 font-cinzel text-base font-bold text-roman-navy transition-colors group-hover:text-roman-bronze">
                    {product.name}
                  </h3>

                  <p className="line-clamp-2 text-xs leading-relaxed text-slate-600">
                    {product.description}
                  </p>

                  <div className="flex items-center gap-1.5 pt-1 text-[11px] text-slate-500">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                    <span>{product.material}</span>
                  </div>
                </div>
              </div>

              {/* Price & Customize Button */}
              <div className="mt-auto flex items-center justify-between gap-3 border-t border-slate-200/80 p-5 pt-0">
                <div>
                  <span className="block text-[9px] font-bold uppercase text-slate-400">
                    Precio Base
                  </span>
                  <span className="font-cinzel text-xl font-black text-roman-navy">
                    ${product.price}{' '}
                    <span className="font-sans text-xs font-normal text-slate-500">MXN</span>
                  </span>
                </div>

                <button
                  onClick={() => onSelectProductToCustomize(product)}
                  className="btn-relief-gold flex items-center gap-1.5 rounded-xl px-4 py-2.5 font-headline text-[11px] uppercase tracking-wider"
                >
                  <Sparkles className="h-3.5 w-3.5 text-roman-navy" />
                  <span>PERSONALIZAR</span>
                  <ChevronRight className="h-3.5 w-3.5 text-roman-navy" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
