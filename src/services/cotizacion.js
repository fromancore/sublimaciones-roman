// src/services/cotizacion.js

// Arreglo editable de reglas de descuento por volumen
export let reglasDescuento = [
  { minPiezas: 10, porcentaje: 0.15 },
  { minPiezas: 5, porcentaje: 0.10 }
];

/**
 * Obtiene una copia de las reglas actuales de descuento.
 */
export function obtenerReglasDescuento() {
  return [...reglasDescuento];
}

/**
 * Actualiza las reglas de descuento (función utilizada por Admin).
 * @param {Array<{ minPiezas: number, porcentaje: number }>} nuevasReglas 
 */
export function actualizarReglasDescuento(nuevasReglas) {
  if (Array.isArray(nuevasReglas)) {
    reglasDescuento = nuevasReglas
      .map(r => ({
        minPiezas: Math.max(1, parseInt(r.minPiezas, 10) || 1),
        porcentaje: Math.max(0, Math.min(1, parseFloat(r.porcentaje) || 0))
      }))
      .sort((a, b) => b.minPiezas - a.minPiezas);
  }
  return obtenerReglasDescuento();
}

/**
 * Función principal para cotizar un producto según su precio base y cantidad.
 * @param {number} precioBase 
 * @param {number} cantidad 
 * @returns {{ subtotal: number, descuento: number, total: number, porcentaje: number }}
 */
export function cotizar(precioBase, cantidad) {
  const base = Math.max(0, Number(precioBase) || 0);
  const cant = Math.max(1, parseInt(cantidad, 10) || 1);
  const subtotal = Math.round(base * cant);

  // Busca la regla de mayor escala que aplique
  const regla = reglasDescuento.find(r => cant >= r.minPiezas);
  const porcentaje = regla ? regla.porcentaje : 0;
  const descuento = Math.round(subtotal * porcentaje);
  const total = subtotal - descuento;

  return {
    subtotal,
    descuento,
    total,
    porcentaje
  };
}
