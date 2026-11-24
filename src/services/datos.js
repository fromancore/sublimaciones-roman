// src/services/datos.js
// Capa centralizada de datos (Simulación relacional lista para migrar a API REST / MySQL)

import tazaMagicaNegra from '../assets/Productos_Base/Taza_Magica_Termica_11oz_Negra.png'
import termoInoxidableBlanco from '../assets/Productos_Base/Termo_de_Acero_Inoxidable_500ml_Blanco.png'
import playeraDryFit from '../assets/Productos_Base/Playera_Dry-Fit_Sublimada_Total.png'
import gorraCamionera from '../assets/Productos_Base/Gorra_Camionera_Frente_Blanco.png'
import cojinDecorativo from '../assets/Productos_Base/Cojin_Decorativo_40x40cm.png'
import mousepadGamer from '../assets/Productos_Base/Mousepad_Gamer_Antideslizante_30x80cm.png'
import llaveroPolimero from '../assets/Productos_Base/Llavero_de_Polimero_Doble_Cara.png'
import tazaCeramicaBlanca from '../assets/Productos_Base/Taza_de_Ceramica_Blanca_Clasica_11oz.png'

export const COLORES_PLAYERA = [
  { name: 'Blanco', hex: '#FFFFFF' },
  { name: 'Negro', hex: '#111827' },
  { name: 'Azul Marino', hex: '#1B2A4A' },
  { name: 'Gris Jaspe', hex: '#9CA3AF' },
  { name: 'Rojo', hex: '#DC2626' },
  { name: 'Azul Rey', hex: '#2563EB' },
]

export const CUELLOS_PLAYERA = ['Cuello Redondo', 'Cuello en V', 'Tipo Polo']

const HEX_A_COLOR_PLAYERA = new Map(COLORES_PLAYERA.map(color => [color.hex, color.name]))

export function obtenerNombreColorPlayera(hex) {
  return HEX_A_COLOR_PLAYERA.get(hex) || hex
}

export const USUARIOS_INICIALES = [
  {
    id: 'usr-1',
    nombre: 'Administrador General',
    email: 'admin@sublimacionesroman.com',
    telefono: '9372830402',
    role: 'admin',
    passwordHash: '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918', // 'admin123'
  },
  {
    id: 'usr-2',
    nombre: 'Diseñador Creativo',
    email: 'diseno@sublimacionesroman.com',
    telefono: '9372830402',
    role: 'disenador',
    passwordHash: '04f8996da763b7a969b1028ee3007569eaf3a635486ddab211d512c85b9df8fb',
  },
  {
    id: 'usr-3',
    nombre: 'Jefe de Taller Producción',
    email: 'produccion@sublimacionesroman.com',
    telefono: '9372830402',
    role: 'produccion',
    passwordHash: '04f8996da763b7a969b1028ee3007569eaf3a635486ddab211d512c85b9df8fb',
  },
  {
    id: 'usr-4',
    nombre: 'Encargado de Entregas',
    email: 'entregas@sublimacionesroman.com',
    telefono: '9372830402',
    role: 'entregas',
    passwordHash: '04f8996da763b7a969b1028ee3007569eaf3a635486ddab211d512c85b9df8fb',
  },
  {
    id: 'usr-5',
    nombre: 'Carlos Mendiburu',
    email: 'carlos@ejemplo.com',
    telefono: '9991234567',
    role: 'cliente',
    passwordHash: '04f8996da763b7a969b1028ee3007569eaf3a635486ddab211d512c85b9df8fb',
  },
]

export const PRODUCTOS_INICIALES = [
  {
    id: 'prod-taza-01',
    name: 'Taza Mágica Térmica 11oz',
    category: 'Tazas y Vasos',
    price: 135,
    productionTime: '48 - 72 hrs',
    material: 'Cerámica con recubrimiento sensible al calor',
    description:
      'Revela tu diseño personalizado al contacto con bebidas calientes. Impresión HD duradera.',
    badge: 'Más Vendido',
    type: 'taza',
    colors: ['#0D1B2A', '#000000', '#1B2A4A'],
    image: tazaMagicaNegra,
  },
  {
    id: 'prod-termo-01',
    name: 'Termo de Acero Inoxidable 500ml',
    category: 'Tazas y Vasos',
    price: 260,
    productionTime: '48 - 72 hrs',
    material: 'Acero Grado Alimenticio 304 Doble Pared',
    description:
      'Conserva bebidas frías 12h y calientes 8h. Acabado brillante con impresión sublimada full color.',
    badge: 'Premium',
    type: 'termo',
    colors: ['#FFFFFF', '#0D1B2A', '#C0C0C0'],
    image: termoInoxidableBlanco,
  },
  {
    id: 'prod-playera-01',
    name: 'Playera Dry-Fit Sublimada Total',
    category: 'Textil',
    price: 220,
    productionTime: '48 - 72 hrs',
    material: 'Poliéster 100% Microfibra de Alta Densidad',
    description:
      'Transpirable, suave y de secado rápido. Colores vívidos que no se desvanecen con el lavado.',
    badge: 'Popular',
    type: 'playera',
    colors: COLORES_PLAYERA.map(color => color.hex),
    image: playeraDryFit,
  },
  {
    id: 'prod-gorra-01',
    name: 'Gorra Camionera Frente Blanco',
    category: 'Textil',
    price: 110,
    productionTime: '48 - 72 hrs',
    material: 'Frente Poliéster con Malla Respirable',
    description:
      'Ajuste broche plástico retro. Ideal para logotipos, clubes, eventos y regalos de empresa.',
    badge: 'Económico',
    type: 'gorra',
    colors: ['#0D1B2A', '#2A6F97', '#000000'],
    image: gorraCamionera,
  },
  {
    id: 'prod-cojin-01',
    name: 'Cojín Decorativo 40x40cm con Relleno',
    category: 'Decoración & Hogar',
    price: 180,
    productionTime: '48 - 72 hrs',
    material: 'Funda de Tela Lino Poliéster Removible',
    description:
      'Incluye relleno siliconizado ultra suave. Impresión por ambos lados con tus fotos o ilustraciones.',
    badge: 'Regalo Perfecto',
    type: 'cojin',
    colors: ['#FFFFFF', '#F8F9FA'],
    image: cojinDecorativo,
  },
  {
    id: 'prod-mousepad-01',
    name: 'Mousepad Gamer Antideslizante 30x80cm',
    category: 'Accesorios',
    price: 195,
    productionTime: '48 - 72 hrs',
    material: 'Superficie Neopreno de Alta Precisión y Base Goma',
    description: 'Bordes cosidos reforzados. Deslizamiento suave optimizado para gaming y oficina.',
    badge: 'Gamer XL',
    type: 'mousepad',
    colors: ['#0D1B2A', '#000000'],
    image: mousepadGamer,
  },
  {
    id: 'prod-llavero-01',
    name: 'Llavero de Polímero Doble Cara',
    category: 'Accesorios',
    price: 45,
    productionTime: '48 - 72 hrs',
    material: 'Polímero Ultra Resistente con Herraje Metálico',
    description:
      'Resistente a caídas y rayaduras. Personalizable con fotos distintas en frente y vuelta.',
    badge: 'Detalle',
    type: 'llavero',
    colors: ['#FFFFFF'],
    image: llaveroPolimero,
  },
  {
    id: 'prod-taza-02',
    name: 'Taza de Cerámica Blanca Clásica 11oz',
    category: 'Tazas y Vasos',
    price: 95,
    productionTime: '48 - 72 hrs',
    material: 'Cerámica Blanca de Alta Pureza Grado A',
    description:
      'Apta para microondas y lavavajillas. Superficie ultra brillante para colores radiantes.',
    badge: 'Clásico',
    type: 'taza',
    colors: ['#FFFFFF'],
    image: tazaCeramicaBlanca,
  },
]

export const PEDIDOS_INICIALES = []

export const DETALLES_PEDIDO_INICIALES = []

export const ARCHIVOS_DISENO_INICIALES = []

export const PAGOS_INICIALES = []

export const HISTORIAL_ESTADOS_INICIALES = []

export const INCIDENCIAS_INICIALES = []

// Funciones utilitarias para persistencia y simulación de API
export function cargarDatosIniciales() {
  return {
    usuarios: [...USUARIOS_INICIALES],
    productos: [...PRODUCTOS_INICIALES],
    pedidos: [...PEDIDOS_INICIALES],
    detalles: [...DETALLES_PEDIDO_INICIALES],
    archivosDiseno: [...ARCHIVOS_DISENO_INICIALES],
    pagos: [...PAGOS_INICIALES],
    historial: [...HISTORIAL_ESTADOS_INICIALES],
    incidencias: [...INCIDENCIAS_INICIALES],
  }
}
