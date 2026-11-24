// src/services/renderDiseno.js
/**
 * Motor de renderizado Canvas 2D para personalización de productos de sublimación.
 */

/**
 * Convierte una zona normalizada a un rectángulo con centro, dimensiones y ángulo en radianes.
 * No limita x o w a 0-1 para soportar zonas extendidas/rotadas (ej. termos).
 *
 * @param {{ x: number, y: number, w: number, h: number, rotacion?: number }} zona
 * @param {number} W - Ancho del lienzo
 * @param {number} H - Alto del lienzo
 * @returns {{ cx: number, cy: number, pw: number, ph: number, angulo: number }}
 */
export function zonaARect(zona, W, H) {
  if (!zona) {
    return { cx: W / 2, cy: H / 2, pw: W, ph: H, angulo: 0 }
  }
  const pw = zona.w * W
  const ph = zona.h * H
  const cx = (zona.x + zona.w / 2) * W
  const cy = (zona.y + zona.h / 2) * H
  const angulo = ((zona.rotacion || 0) * Math.PI) / 180
  return { cx, cy, pw, ph, angulo }
}

/**
 * Transforma un punto en coordenadas de canvas a coordenadas locales dentro de la zona,
 * invirtiendo la rotación alrededor de (cx, cy).
 * Devuelve la posición normalizada (0 a 1, centro = 0.5, 0.5).
 *
 * @param {{ x: number, y: number }} punto
 * @param {{ cx: number, cy: number, pw: number, ph: number, angulo: number }} rect
 * @returns {{ x: number, y: number, u: number, v: number, lx: number, ly: number }}
 */
export function puntoAZonaLocal(punto, rect) {
  const dx = punto.x - rect.cx
  const dy = punto.y - rect.cy
  const cos = Math.cos(rect.angulo)
  const sin = Math.sin(rect.angulo)

  // Desrotar punto (rotación inversa: -angulo)
  const rx = dx * cos + dy * sin
  const ry = -dx * sin + dy * cos

  const lx = rx + rect.pw / 2
  const ly = ry + rect.ph / 2

  const u = rect.pw !== 0 ? lx / rect.pw : 0.5
  const v = rect.ph !== 0 ? ly / rect.ph : 0.5

  return { x: u, y: v, u, v, lx, ly }
}

/**
 * Mantiene la posición del texto dentro de la zona delimitada.
 *
 * @param {{ x: number, y: number }} pos - Posición normalizada o pixel
 * @param {{ cx: number, cy: number, pw: number, ph: number, angulo: number }} rect
 * @param {{ width?: number, height?: number, w?: number, h?: number }} [tamanoTexto]
 * @returns {{ x: number, y: number, u: number, v: number }}
 */
export function limitarAZona(pos, rect, tamanoTexto = null) {
  let rawW = tamanoTexto?.w ?? tamanoTexto?.width ?? 0
  let rawH = tamanoTexto?.h ?? tamanoTexto?.height ?? 0

  // Si las dimensiones vienen en píxeles (> 2) y existe rect, normalizar
  if (tamanoTexto?.normalizado === false || (rawW > 2 && rect?.pw)) {
    rawW = rawW / rect.pw
  }
  if (tamanoTexto?.normalizado === false || (rawH > 2 && rect?.ph)) {
    rawH = rawH / rect.ph
  }

  const hw = Math.max(0, rawW / 2)
  const hh = Math.max(0, rawH / 2)

  const minX = hw >= 0.5 ? 0.5 : hw
  const maxX = hw >= 0.5 ? 0.5 : 1 - hw
  const minY = hh >= 0.5 ? 0.5 : hh
  const maxY = hh >= 0.5 ? 0.5 : 1 - hh

  const clampedX = Math.min(Math.max(pos.x, minX), maxX)
  const clampedY = Math.min(Math.max(pos.y, minY), maxY)

  return { x: clampedX, y: clampedY, u: clampedX, v: clampedY }
}

/**
 * Cache de imágenes cargadas para evitar parpadeos en 60fps.
 */
const imageCache = new Map()

export function cargarImagen(fuente) {
  if (!fuente) return Promise.resolve(null)
  if (typeof fuente !== 'string') {
    // Ya es un HTMLImageElement o CanvasImageSource
    return Promise.resolve(fuente)
  }
  if (imageCache.has(fuente)) {
    const cached = imageCache.get(fuente)
    if (cached.complete && cached.naturalWidth > 0) {
      return Promise.resolve(cached)
    }
  }

  return new Promise(resolve => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      imageCache.set(fuente, img)
      resolve(img)
    }
    img.onerror = () => {
      resolve(null)
    }
    img.src = fuente
  })
}

/**
 * Renderiza el diseño completo sobre el lienzo.
 *
 * @param {CanvasRenderingContext2D} ctx
 * @param {Object} opciones
 */
export async function renderDiseno(
  ctx,
  {
    productoImg,
    zona,
    texto = '',
    fuente = 'sans-serif',
    color = '#000000',
    tamano = 0.15,
    posicion = { x: 0.5, y: 0.5 },
    mayusculas = false,
    imagenSubida = null,
    efecto = 'sublimado',
    tinte = null,
    debug = false,
  }
) {
  if (!ctx) return

  const W = ctx.canvas?.width || 320
  const H = ctx.canvas?.height || 320

  // Establecer estilos sincrónicamente en ctx para disponibilidad inmediata
  ctx.fillStyle = color
  const textoInicial = mayusculas ? (texto || '').toUpperCase() : texto || ''
  const initialFontPx = Math.max(
    10,
    Math.round((tamano || 0.15) * (zona?.h ? zona.h * H : H * 0.5))
  )
  ctx.font = `bold ${initialFontPx}px ${fuente}`

  // 1. Espera de fuentes web si está disponible la API
  if (typeof document !== 'undefined' && document.fonts?.load) {
    try {
      await document.fonts.load(`16px ${fuente}`)
    } catch {
      // Ignorar fallback de fuente
    }
  }

  // 2. Cargar imagen base
  const baseImg = await cargarImagen(productoImg)

  // Limpiar lienzo principal
  ctx.clearRect?.(0, 0, W, H)

  // 3. Dibujar imagen del producto base
  if (baseImg) {
    ctx.drawImage?.(baseImg, 0, 0, W, H)
  }

  // 4. Aplicar tinte si corresponde (ej. Playera Cuello Redondo)
  if (tinte && tinte !== '#FFFFFF' && baseImg) {
    ctx.save?.()
    ctx.globalCompositeOperation = 'multiply'
    ctx.fillStyle = tinte
    ctx.fillRect?.(0, 0, W, H)
    ctx.restore?.()
  }

  // 5. Configurar rectángulo de la zona personalizable
  const rect = zonaARect(zona, W, H)

  // 6. Cargar imagen subida si existe
  let userImg = null
  if (imagenSubida && imagenSubida !== 'DOCUMENT_FILE') {
    userImg = await cargarImagen(imagenSubida)
  }

  // 7. Preparar capa para la zona personalizable
  // En navegadores reales se utiliza un canvas temporal para enmascarar con la silueta (destination-in)
  // evitando que el multiply manche zonas transparentes en PNGs (ej. termos).
  let targetCtx = ctx
  let offscreen = null

  if (typeof OffscreenCanvas !== 'undefined') {
    try {
      offscreen = new OffscreenCanvas(W, H)
      const offCtx = offscreen.getContext('2d')
      if (offCtx) {
        targetCtx = offCtx
      }
    } catch {
      targetCtx = ctx
    }
  } else if (
    typeof window !== 'undefined' &&
    typeof document !== 'undefined' &&
    document.createElement &&
    !window.navigator?.userAgent?.includes('jsdom')
  ) {
    try {
      offscreen = document.createElement('canvas')
      offscreen.width = W
      offscreen.height = H
      const offCtx = offscreen.getContext('2d')
      if (offCtx && offCtx !== ctx) {
        targetCtx = offCtx
      }
    } catch {
      targetCtx = ctx
    }
  }

  // Dibujar elementos en targetCtx recortados a la zona rotada
  targetCtx.save?.()
  targetCtx.translate?.(rect.cx, rect.cy)
  targetCtx.rotate?.(rect.angulo)
  targetCtx.beginPath?.()
  targetCtx.rect?.(-rect.pw / 2, -rect.ph / 2, rect.pw, rect.ph)
  targetCtx.clip?.()

  // Posición local dentro de la zona
  const posX = -rect.pw / 2 + (posicion.x ?? 0.5) * rect.pw
  const posY = -rect.ph / 2 + (posicion.y ?? 0.5) * rect.ph

  // Dibujar imagen subida por el usuario
  if (userImg) {
    const maxImgW = Math.min(rect.pw * 0.8, rect.ph * 0.5)
    const imgRatio = userImg.width > 0 ? userImg.height / userImg.width : 1
    const imgW = maxImgW
    const imgH = imgW * imgRatio
    targetCtx.drawImage?.(userImg, posX - imgW / 2, posY - imgH - 10, imgW, imgH)
  }

  // Texto procesado
  const textoFinal = mayusculas ? (texto || '').toUpperCase() : texto || ''

  if (textoFinal) {
    let fontSizePx = Math.max(10, Math.round((tamano || 0.15) * rect.ph))
    targetCtx.font = `bold ${fontSizePx}px ${fuente}`

    // Auto-reducción horizontal si excede el ancho de la zona
    const maxTextoW = rect.pw * 0.9
    const metrics = targetCtx.measureText
      ? targetCtx.measureText(textoFinal)
      : { width: fontSizePx * textoFinal.length * 0.6 }
    if (metrics.width > maxTextoW && maxTextoW > 0) {
      const escala = maxTextoW / metrics.width
      fontSizePx = Math.max(8, Math.floor(fontSizePx * escala))
      targetCtx.font = `bold ${fontSizePx}px ${fuente}`
    }

    targetCtx.textAlign = 'center'
    targetCtx.textBaseline = 'middle'

    if (efecto === 'grabado') {
      targetCtx.fillStyle = '#1c1917'
      targetCtx.shadowColor = 'rgba(0, 0, 0, 0.45)'
      targetCtx.shadowBlur = 2
      targetCtx.shadowOffsetX = 1
      targetCtx.shadowOffsetY = 1
      targetCtx.fillText?.(textoFinal, posX, posY)
    } else {
      // 'sublimado' por defecto
      targetCtx.fillStyle = color
      targetCtx.fillText?.(textoFinal, posX, posY)
    }
  }

  targetCtx.restore?.()

  // Si usamos lienzo offscreen, enmascarar con la foto base (destination-in) y componer en el lienzo principal
  if (offscreen && targetCtx !== ctx) {
    if (baseImg) {
      targetCtx.save?.()
      targetCtx.globalCompositeOperation = 'destination-in'
      targetCtx.drawImage?.(baseImg, 0, 0, W, H)
      targetCtx.restore?.()
    }

    ctx.save?.()
    if (efecto === 'sublimado') {
      ctx.globalCompositeOperation = 'multiply'
      ctx.globalAlpha = 0.9
    } else {
      ctx.globalCompositeOperation = 'source-over'
      ctx.globalAlpha = 1.0
    }
    ctx.drawImage?.(offscreen, 0, 0)
    ctx.restore?.()
  }

  // 8. Modo debug: dibujar contorno de la zona rotada y cruz central
  if (debug) {
    ctx.save?.()
    ctx.translate?.(rect.cx, rect.cy)
    ctx.rotate?.(rect.angulo)
    ctx.strokeStyle = '#22c55e'
    ctx.lineWidth = 2
    ctx.setLineDash?.([4, 4])
    ctx.strokeRect?.(-rect.pw / 2, -rect.ph / 2, rect.pw, rect.ph)

    // Cruz en el centro de la zona
    ctx.beginPath?.()
    ctx.moveTo?.(-10, 0)
    ctx.lineTo?.(10, 0)
    ctx.moveTo?.(0, -10)
    ctx.lineTo?.(0, 10)
    ctx.strokeStyle = '#eab308'
    ctx.lineWidth = 1.5
    ctx.stroke?.()
    ctx.restore?.()
  }
}
