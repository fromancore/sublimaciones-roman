export const CORREOS_ADMIN_AUTORIZADOS = Object.freeze([
  'luisa.roman@admin.sublimacionesroman.com',
  'david.poot@admin.sublimacionesroman.com',
  'cristina.canul@admin.sublimacionesroman.com',
])

const correosAdmin = new Set(CORREOS_ADMIN_AUTORIZADOS)

const ROLES_OPERATIVOS = Object.freeze({
  'diseno@sublimacionesroman.com': 'disenador',
  'produccion@sublimacionesroman.com': 'produccion',
  'entregas@sublimacionesroman.com': 'entregas',
})

const normalizarCorreo = correo => correo?.trim().toLowerCase() || ''

export function esAdminAutorizado(usuario) {
  return correosAdmin.has(normalizarCorreo(usuario?.email))
}

export function obtenerRolUsuario(usuario) {
  const correo = normalizarCorreo(usuario?.email)
  if (correosAdmin.has(correo)) return 'admin'
  return ROLES_OPERATIVOS[correo] || 'cliente'
}

export function puedeAccederPanel(usuario) {
  return obtenerRolUsuario(usuario) !== 'cliente'
}

export function crearPerfilUsuario(usuario) {
  const email = normalizarCorreo(usuario.email)
  return {
    id: usuario.id || `usr-${Date.now()}`,
    nombre: usuario.nombre || email.split('@')[0],
    email,
    telefono: usuario.telefono || '',
    role: obtenerRolUsuario(usuario),
  }
}
