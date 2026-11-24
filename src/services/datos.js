// src/services/datos.js
// Capa centralizada de datos (Simulación relacional lista para migrar a API REST / MySQL)

import tazaMagicaNegra from '../assets/Productos_Base/Taza_Magica_Termica_11oz_Negra.png'
import termoInoxidableBlanco from '../assets/Productos_Base/Termo_de_Acero_Inoxidable_500ml_Blanco.png'
import termoInoxidablePlateado from '../assets/Productos_Base/Termo_de_Acero_Inoxidable_500ml.png'
import playeraDryFit from '../assets/Productos_Base/Playera_Dry-Fit_Sublimada_Total.png'
import gorraCamionera from '../assets/Productos_Base/Gorra_Camionera_Frente_Blanco.png'
import cojinDecorativo from '../assets/Productos_Base/Cojin_Decorativo_40x40cm.png'
import mousepadGamer from '../assets/Productos_Base/Mousepad_Gamer_Antideslizante_30x80cm.png'
import llaveroPolimero from '../assets/Productos_Base/Llavero_de_Polimero_Doble_Cara.png'
import tazaCeramicaBlanca from '../assets/Productos_Base/Taza_de_Ceramica_Blanca_Clasica_11oz.png'
import tazaCeramicaAzulMarino from '../assets/Productos_Base/Taza_Ceramica_Azul_Marino_11oz.png'

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
  {
    color: '#0D1B2A',
    nombre: 'Azul marino',
    image: tazaCeramicaAzulMarino,
    zona: { x: 0.339, y: 0.191, w: 0.333, h: 0.647, rotacion: 0 },
  },
]

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
    orientacionTexto: 'sigueZona',
    colors: VARIANTES_TAZA_MAGICA.map(variant => variant.color),
    image: tazaMagicaNegra,
    efecto: 'sublimado',
    zonaPersonalizable: { x: 0.342, y: 0.174, w: 0.329, h: 0.664, rotacion: 0 },
    variantes: VARIANTES_TAZA_MAGICA,
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
    orientacionTexto: 'horizontal',
    colors: VARIANTES_TERMO.map(variant => variant.color),
    image: termoInoxidableBlanco,
    efecto: 'sublimado',
    zonaPersonalizable: { x: -0.33, y: 0.456, w: 1.5, h: 0.2, rotacion: 90 },
    variantes: VARIANTES_TERMO,
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
    orientacionTexto: 'sigueZona',
    colors: COLORES_PLAYERA.map(color => color.hex),
    image: playeraDryFit,
    efecto: 'sublimado',
    zonaPersonalizable: {
      total: { x: 0.392, y: 0.147, w: 0.215, h: 0.736, rotacion: 0 },
      pecho: { x: 0.4, y: 0.22, w: 0.2, h: 0.2, rotacion: 0 },
    },
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
    orientacionTexto: 'sigueZona',
    colors: ['#0D1B2A', '#2A6F97', '#000000'],
    image: gorraCamionera,
    efecto: 'sublimado',
    zonaPersonalizable: { x: 0.311, y: 0.322, w: 0.432, h: 0.273, rotacion: -7 },
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
    orientacionTexto: 'sigueZona',
    colors: ['#FFFFFF', '#F8F9FA'],
    image: cojinDecorativo,
    efecto: 'sublimado',
    zonaPersonalizable: { x: 0.22, y: 0.193, w: 0.583, h: 0.641, rotacion: 0 },
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
    orientacionTexto: 'sigueZona',
    colors: ['#0D1B2A', '#000000'],
    image: mousepadGamer,
    efecto: 'sublimado',
    zonaPersonalizable: { x: 0.156, y: 0.299, w: 0.62, h: 0.425, rotacion: -20 },
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
    orientacionTexto: 'sigueZona',
    colors: ['#FFFFFF'],
    image: llaveroPolimero,
    efecto: 'grabado',
    zonaPersonalizable: { x: 0.323, y: 0.374, w: 0.286, h: 0.426, rotacion: 0 },
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
    orientacionTexto: 'sigueZona',
    colors: VARIANTES_TAZA_CLASICA.map(variant => variant.color),
    image: tazaCeramicaBlanca,
    efecto: 'sublimado',
    zonaPersonalizable: { x: 0.341, y: 0.176, w: 0.329, h: 0.664, rotacion: 0 },
    variantes: VARIANTES_TAZA_CLASICA,
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
