import React, { useState } from 'react';
import { Sparkles, Clock, Search, Filter, Tag, CheckCircle2, ChevronRight } from 'lucide-react';

export const INITIAL_PRODUCTS = [
  {
    id: 'prod-taza-01',
    name: 'Taza Mágica Térmica 11oz',
    category: 'Tazas y Vasos',
    price: 135,
    productionTime: '24 Horas',
    material: 'Cerámica con recubrimiento sensible al calor',
    description: 'Revela tu diseño personalizado al contacto con bebidas calientes. Impresión HD duradera.',
    badge: 'Más Vendido',
    type: 'taza',
    colors: ['#0D1B2A', '#000000', '#1B2A4A'],
    popularImage: '🍵'
  },
  {
    id: 'prod-termo-01',
    name: 'Termo de Acero Inoxidable 500ml',
    category: 'Tazas y Vasos',
    price: 260,
    productionTime: '48 Horas',
    material: 'Acero Grado Alimenticio 304 Doble Pared',
    description: 'Conserva bebidas frías 12h y calientes 8h. Acabado brillante con impresión sublimada full color.',
    badge: 'Premium',
    type: 'termo',
    colors: ['#FFFFFF', '#0D1B2A', '#C0C0C0'],
    popularImage: '🥤'
  },
  {
    id: 'prod-playera-01',
    name: 'Playera Dry-Fit Sublimada Total',
    category: 'Textil',
    price: 220,
    productionTime: '48 Horas',
    material: 'Poliéster 100% Microfibra de Alta Densidad',
    description: 'Transpirable, suave y de secado rápido. Colores vívidos que no se desvanecen con el lavado.',
    badge: 'Popular',
    type: 'playera',
    colors: ['#FFFFFF', '#F0F4F8', '#E2E8F0'],
    popularImage: '👕'
  },
  {
    id: 'prod-gorra-01',
    name: 'Gorra Camionera Frente Blanco',
    category: 'Textil',
    price: 110,
    productionTime: '24 Horas',
    material: 'Frente Poliéster con Malla Respirable',
    description: 'Ajuste broche plástico retro. Ideal para logotipos, clubes, eventos y regalos de empresa.',
    badge: 'Económico',
    type: 'gorra',
    colors: ['#0D1B2A', '#2A6F97', '#000000'],
    popularImage: '🧢'
  },
  {
    id: 'prod-cojin-01',
    name: 'Cojín Decorativo 40x40cm con Relleno',
    category: 'Decoración & Hogar',
    price: 180,
    productionTime: '48 Horas',
    material: 'Funda de Tela Lino Poliéster Removible',
    description: 'Incluye relleno siliconizado ultra suave. Impresión por ambos lados con tus fotos o ilustraciones.',
    badge: 'Regalo Perfecto',
    type: 'cojin',
    colors: ['#FFFFFF', '#F8F9FA'],
    popularImage: '🛋️'
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
    colors: ['#0D1B2A', '#000000'],
    popularImage: '🖱️'
  },
  {
    id: 'prod-llavero-01',
    name: 'Llavero de Polímero Doble Cara',
    category: 'Accesorios',
    price: 45,
    productionTime: '24 Horas',
    material: 'Polímero Ultra Resistente con Herraje Metálico',
    description: 'Resistente a caídas y rayaduras. Personalizable con fotos distintas en frente y vuelta.',
    badge: 'Detalle',
    type: 'llavero',
    colors: ['#FFFFFF'],
    popularImage: '🔑'
  },
  {
    id: 'prod-taza-02',
    name: 'Taza de Cerámica Blanca Clásica 11oz',
    category: 'Tazas y Vasos',
    price: 95,
    productionTime: '24 Horas',
    material: 'Cerámica Blanca de Alta Pureza Grado A',
    description: 'Apta para microondas y lavavajillas. Superficie ultra brillante para colores radiantes.',
    badge: 'Clásico',
    type: 'taza',
    colors: ['#FFFFFF'],
    popularImage: '☕'
  }
];

export default function ProductCatalog({ onSelectProductToCustomize }) {
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular');

  const categories = ['Todas', 'Tazas y Vasos', 'Textil', 'Accesorios', 'Decoración & Hogar'];

  const filteredProducts = INITIAL_PRODUCTS.filter(prod => {
    const matchesCategory = selectedCategory === 'Todas' || prod.category === selectedCategory;
    const matchesSearch = prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          prod.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  }).sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    return 0;
  });

  return (
    <section id="catalogo-section" className="py-16 bg-roman-marble relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-roman-navy text-[10px] font-headline font-bold text-roman-gold uppercase tracking-widest border border-roman-bronze/40">
            <Tag className="w-3.5 h-3.5" />
            Catálogo de Productos Base
          </div>
          <h2 className="text-3xl sm:text-4xl font-cinzel font-black text-roman-dark">
            Selecciona tu Producto y <span className="text-roman-bronze">Personalízalo</span>
          </h2>
          <p className="text-slate-600 text-sm">
            Todos nuestros productos cuentan con garantía de color, alta definición y aprobación previa de diseño.
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div className="card-architectural p-4 md:p-6 shadow-card-marble space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar tazas, termos, playeras..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-roman-stone border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-roman-bronze"
              />
            </div>

            {/* Category Selector Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-headline font-bold uppercase tracking-wider transition-all ${
                    selectedCategory === cat 
                      ? 'btn-relief-navy text-white shadow-md' 
                      : 'bg-roman-stone text-slate-600 hover:bg-slate-200 border border-slate-300'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 w-full md:w-auto justify-end">
              <Filter className="w-4 h-4 text-roman-bronze" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-roman-stone border border-slate-300 text-slate-800 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-roman-bronze font-medium"
              >
                <option value="popular">Ordenar: Destacados</option>
                <option value="price-low">Precio: Menor a Mayor</option>
                <option value="price-high">Precio: Mayor a Menor</option>
              </select>
            </div>

          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="card-architectural group hover:border-roman-bronze/60 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-card-marble hover:-translate-y-1"
            >
              <div>
                {/* Image Showcase Box */}
                <div className="relative h-48 bg-gradient-to-br from-roman-navy to-slate-900 flex items-center justify-center p-6 border-b border-slate-200">
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded text-[9px] font-headline font-black bg-roman-gold text-roman-navy uppercase shadow-md">
                    {product.badge}
                  </span>

                  <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded bg-roman-dark/90 border border-roman-bronze/40 text-[9px] font-mono font-bold text-slate-200">
                    <Clock className="w-3 h-3 text-roman-gold" />
                    <span>{product.productionTime}</span>
                  </div>

                  <div className="text-6xl group-hover:scale-110 transition-transform duration-300 select-none">
                    {product.popularImage}
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 space-y-2.5">
                  <div className="text-[10px] font-headline font-bold text-roman-bronze uppercase tracking-wider">
                    {product.category}
                  </div>

                  <h3 className="font-cinzel font-bold text-base text-roman-navy group-hover:text-roman-bronze transition-colors line-clamp-1">
                    {product.name}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>

                  <div className="text-[11px] text-slate-500 flex items-center gap-1.5 pt-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{product.material}</span>
                  </div>
                </div>
              </div>

              {/* Price & Customize Button */}
              <div className="p-5 pt-0 mt-auto border-t border-slate-200/80 flex items-center justify-between gap-3">
                <div>
                  <span className="text-[9px] text-slate-400 uppercase font-bold block">Precio Base</span>
                  <span className="font-cinzel font-black text-xl text-roman-navy">
                    ${product.price} <span className="text-xs font-sans text-slate-500 font-normal">MXN</span>
                  </span>
                </div>

                <button
                  onClick={() => onSelectProductToCustomize(product)}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl btn-relief-gold text-[11px] font-headline tracking-wider uppercase"
                >
                  <Sparkles className="w-3.5 h-3.5 text-roman-navy" />
                  <span>PERSONALIZAR</span>
                  <ChevronRight className="w-3.5 h-3.5 text-roman-navy" />
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
