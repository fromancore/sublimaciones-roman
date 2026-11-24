import { describe, expect, it } from 'vitest'
import {
  crearPerfilUsuario,
  esAdminAutorizado,
  obtenerRolUsuario,
  puedeAccederPanel,
} from '../services/autorizacion.js'

describe('autorización de usuarios', () => {
  it('solo otorga administración a los correos permitidos y verificados', () => {
    expect(
      esAdminAutorizado({
        email: 'Luisa.Roman@admin.sublimacionesroman.com',
        emailVerified: true,
      })
    ).toBe(true)
    expect(
      esAdminAutorizado({
        email: 'admin@sublimacionesroman.com',
        emailVerified: true,
      })
    ).toBe(false)
    expect(
      esAdminAutorizado({
        email: 'luisa.roman@admin.sublimacionesroman.com',
        emailVerified: false,
      })
    ).toBe(false)
  })

  it('conserva los roles operativos y limita a clientes fuera del panel', () => {
    const disenador = {
      email: 'diseno@sublimacionesroman.com',
      emailVerified: true,
    }

    expect(obtenerRolUsuario(disenador)).toBe('disenador')
    expect(puedeAccederPanel(disenador)).toBe(true)
    expect(
      puedeAccederPanel({
        email: 'cliente@ejemplo.com',
        emailVerified: true,
      })
    ).toBe(false)
  })

  it('crea el perfil de la sesión a partir de la identidad verificada', () => {
    expect(
      crearPerfilUsuario({
        uid: 'firebase-user-id',
        email: 'david.poot@admin.sublimacionesroman.com',
        emailVerified: true,
        displayName: 'David Poot',
      })
    ).toEqual({
      id: 'firebase-user-id',
      nombre: 'David Poot',
      email: 'david.poot@admin.sublimacionesroman.com',
      telefono: '',
      emailVerified: true,
      role: 'admin',
    })
  })
})
