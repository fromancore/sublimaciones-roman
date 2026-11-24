import { describe, expect, it } from 'vitest'
import {
  crearPerfilUsuario,
  esAdminAutorizado,
  obtenerRolUsuario,
  puedeAccederPanel,
} from '../services/autorizacion.js'

describe('autorización de usuarios', () => {
  it('solo otorga administración a los tres correos permitidos, sin importar mayúsculas', () => {
    for (const email of [
      'luisa.roman@admin.sublimacionesroman.com',
      'david.poot@admin.sublimacionesroman.com',
      'cristina.canul@admin.sublimacionesroman.com',
    ]) {
      expect(esAdminAutorizado({ email })).toBe(true)
      expect(obtenerRolUsuario({ email })).toBe('admin')
    }

    expect(esAdminAutorizado({ email: 'Luisa.Roman@admin.sublimacionesroman.com' })).toBe(true)
    expect(esAdminAutorizado({ email: 'admin@ejemplo.com' })).toBe(false)
    expect(esAdminAutorizado({ email: 'admin@sublimacionesroman.com' })).toBe(false)
  })

  it('conserva los roles operativos y limita a clientes fuera del panel', () => {
    const disenador = { email: 'diseno@sublimacionesroman.com' }

    expect(obtenerRolUsuario(disenador)).toBe('disenador')
    expect(puedeAccederPanel(disenador)).toBe(true)
    expect(
      puedeAccederPanel({
        email: 'cliente@ejemplo.com',
      })
    ).toBe(false)
  })

  it('crea un perfil de demostración con el rol derivado de su correo', () => {
    expect(
      crearPerfilUsuario({
        email: 'david.poot@admin.sublimacionesroman.com',
        nombre: 'David Poot',
      })
    ).toEqual(
      expect.objectContaining({
        nombre: 'David Poot',
        email: 'david.poot@admin.sublimacionesroman.com',
        role: 'admin',
      })
    )
  })
})
