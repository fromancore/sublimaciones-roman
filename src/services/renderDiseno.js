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

export function medirTextoZona(ctx, texto, fuente, rect, tamano = 0.15, orientacion = 'sigueZona') {
  const orientacionHorizontal = orientacion === 'horizontal' && rect.angulo !== 0
  const anchoDisponible = (orientacionHorizontal ? rect.ph : rect.pw) * 0.92
  const textoEnLineas = [texto]
  let fontSize = Math.max(10, Math.round((tamano || 0.15) * rect.ph))
  const medir = valor =>
    ctx.measureText ? ctx.measureText(valor).width : fontSize * valor.length * 0.6

  ctx.font = `bold ${fontSize}px ${fuente}`
  while (fontSize > 10 && medir(texto) > anchoDisponible) {
    fontSize -= 1
    ctx.font = `bold ${fontSize}px ${fuente}`
  }

  if (medir(texto) > anchoDisponible) {
    const palabras = texto.trim().split(/\s+/)
    if (palabras.length > 1) {
      let mejorCorte = 1
      let mejorDiferencia = Infinity
      for (let corte = 1; corte < palabras.length; corte += 1) {
        const diferencia = Math.abs(
          palabras.slice(0, corte).join(' ').length - palabras.slice(corte).join(' ').length
        )
        if (diferencia < mejorDiferencia) {
          mejorCorte = corte
          mejorDiferencia = diferencia
        }
      }
      textoEnLineas.splice(
        0,
        1,
        palabras.slice(0, mejorCorte).join(' '),
        palabras.slice(mejorCorte).join(' ')
      )
    }
  }

  const ancho = Math.max(...textoEnLineas.map(linea => medir(linea)))
  const alto = fontSize * 1.2 * textoEnLineas.length
  return {
    ancho: Math.min(ancho, anchoDisponible),
    alto,
    anchoDisponible,
    fontSize,
    lineas: textoEnLineas,
    orientacionHorizontal,
  }
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
    orientacionTexto = 'sigueZona',
    debug = false,
    estaVigente = () => true,
  }
) {
  if (!ctx) return

  // 1. Espera de fuentes web si está disponible la API
  if (typeof document !== 'undefined' && document.fonts?.load) {
    try {
      await document.fonts.load(`16px ${fuente}`)
    } catch {
      // Ignorar fallback de fuente
    }
  }
  if (!estaVigente()) return

  // 2. Cargar imagen base
  const baseImg = await cargarImagen(productoImg)
  if (!estaVigente()) return
  const canvas = ctx.canvas
  if (baseImg && canvas) {
    const cssWidth = canvas.getBoundingClientRect?.().width || canvas.clientWidth || 320
    const pixelRatio = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1
    const width = Math.round(cssWidth * pixelRatio)
    const height = Math.round(width * (baseImg.naturalHeight / baseImg.naturalWidth))
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width
      canvas.height = height
    }
  }

  const W = canvas?.width || 320
  const H = canvas?.height || 320
  ctx.fillStyle = color

  // Limpiar lienzo principal
  ctx.clearRect?.(0, 0, W, H)

  // 3. Dibujar imagen del producto base
  if (baseImg) {
    ctx.drawImage?.(baseImg, 0, 0, W, H)
  }

  // 5. Configurar rectángulo de la zona personalizable
  const rect = zonaARect(zona, W, H)
  let luminanciaPromedio = 1
  if (baseImg && typeof document !== 'undefined') {
    const muestra = document.createElement('canvas')
    muestra.width = 16
    muestra.height = 16
    const muestraCtx = muestra.getContext('2d')
    if (muestraCtx) {
      const sourceX = Math.max(0, zona?.x ?? 0) * baseImg.naturalWidth
      const sourceY = Math.max(0, zona?.y ?? 0) * baseImg.naturalHeight
      const sourceRight = Math.min(1, (zona?.x ?? 0) + (zona?.w ?? 1)) * baseImg.naturalWidth
      const sourceBottom = Math.min(1, (zona?.y ?? 0) + (zona?.h ?? 1)) * baseImg.naturalHeight
      const sourceWidth = Math.max(0, sourceRight - sourceX)
      const sourceHeight = Math.max(0, sourceBottom - sourceY)
      if (sourceWidth && sourceHeight) {
        muestraCtx.drawImage(
          baseImg,
          sourceX,
          sourceY,
          sourceWidth,
          sourceHeight,
          0,
          0,
          muestra.width,
          muestra.height
        )
        const { data } = muestraCtx.getImageData(0, 0, muestra.width, muestra.height)
        let totalLuminancia = 0
        let pixelesVisibles = 0
        for (let index = 0; index < data.length; index += 4) {
          const alpha = data[index + 3] / 255
          if (!alpha) continue
          const lineariza = canal => {
            const valor = canal / 255
            return valor <= 0.04045 ? valor / 12.92 : ((valor + 0.055) / 1.055) ** 2.4
          }
          totalLuminancia +=
            (0.2126 * lineariza(data[index]) +
              0.7152 * lineariza(data[index + 1]) +
              0.0722 * lineariza(data[index + 2])) *
            alpha
          pixelesVisibles += alpha
        }
        luminanciaPromedio = pixelesVisibles ? totalLuminancia / pixelesVisibles : 1
      }
    }
  }
  // El umbral 0.35 separa zonas oscuras, donde multiply ocultaría el texto, de las claras.
  const mezclaTexto = luminanciaPromedio < 0.35 ? 'source-over' : 'multiply'

  // 6. Cargar imagen subida si existe
  let userImg = null
  if (imagenSubida && imagenSubida !== 'DOCUMENT_FILE') {
    userImg = await cargarImagen(imagenSubida)
  }
  if (!estaVigente()) return

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
    const layout = medirTextoZona(targetCtx, textoFinal, fuente, rect, tamano, orientacionTexto)
    targetCtx.font = `bold ${layout.fontSize}px ${fuente}`
    targetCtx.textAlign = 'center'
    targetCtx.textBaseline = 'middle'
    const textX = rect.cx + posX * Math.cos(rect.angulo) - posY * Math.sin(rect.angulo)
    const textY = rect.cy + posX * Math.sin(rect.angulo) + posY * Math.cos(rect.angulo)
    if (layout.orientacionHorizontal) {
      targetCtx.rotate?.(-rect.angulo)
      targetCtx.translate?.(-rect.cx, -rect.cy)
    }

    if (efecto === 'grabado') {
      targetCtx.fillStyle = '#1c1917'
      targetCtx.shadowColor = 'rgba(0, 0, 0, 0.45)'
      targetCtx.shadowBlur = 2
      targetCtx.shadowOffsetX = 1
      targetCtx.shadowOffsetY = 1
      layout.lineas.forEach((linea, index) => {
        const y =
          (layout.orientacionHorizontal ? textY : posY) +
          (index - (layout.lineas.length - 1) / 2) * layout.fontSize * 1.2
        targetCtx.fillText?.(
          linea,
          layout.orientacionHorizontal ? textX : posX,
          y,
          layout.anchoDisponible
        )
      })
    } else {
      // 'sublimado' por defecto
      targetCtx.fillStyle = color
      targetCtx.globalCompositeOperation = mezclaTexto
      layout.lineas.forEach((linea, index) => {
        const y =
          (layout.orientacionHorizontal ? textY : posY) +
          (index - (layout.lineas.length - 1) / 2) * layout.fontSize * 1.2
        targetCtx.fillText?.(
          linea,
          layout.orientacionHorizontal ? textX : posX,
          y,
          layout.anchoDisponible
        )
      })
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
      ctx.globalCompositeOperation = mezclaTexto
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
