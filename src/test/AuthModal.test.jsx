import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const firebaseMocks = vi.hoisted(() => ({
  auth: {},
  createUserWithEmailAndPassword: vi.fn(),
  sendEmailVerification: vi.fn(),
  signInWithEmailAndPassword: vi.fn(),
  signOut: vi.fn(),
  updateProfile: vi.fn(),
  getFirebaseAuth: vi.fn(),
}))

vi.mock('firebase/auth', () => ({
  createUserWithEmailAndPassword: firebaseMocks.createUserWithEmailAndPassword,
  sendEmailVerification: firebaseMocks.sendEmailVerification,
  signInWithEmailAndPassword: firebaseMocks.signInWithEmailAndPassword,
  signOut: firebaseMocks.signOut,
  updateProfile: firebaseMocks.updateProfile,
}))

vi.mock('../services/firebase.js', () => ({
  getFirebaseAuth: firebaseMocks.getFirebaseAuth,
}))

import AuthModal from '../components/AuthModal'

const iniciarSesion = async (correo, usuario) => {
  firebaseMocks.signInWithEmailAndPassword.mockResolvedValue({ user: usuario })
  const onLoginExitoso = vi.fn()
  render(<AuthModal isOpen onClose={vi.fn()} onLoginExitoso={onLoginExitoso} />)

  fireEvent.click(screen.getByRole('button', { name: 'Ingresar' }))
  fireEvent.change(screen.getByPlaceholderText('ejemplo@correo.com'), {
    target: { value: correo },
  })
  fireEvent.change(screen.getByPlaceholderText('Contraseña'), {
    target: { value: 'clave-segura-123' },
  })
  fireEvent.click(screen.getByRole('button', { name: 'Acceder al Portal' }))

  await waitFor(() => {
    expect(firebaseMocks.signInWithEmailAndPassword).toHaveBeenCalledWith(
      firebaseMocks.auth,
      correo.toLowerCase(),
      'clave-segura-123'
    )
  })

  return onLoginExitoso
}

describe('AuthModal', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    firebaseMocks.getFirebaseAuth.mockReturnValue(firebaseMocks.auth)
  })

  it('asigna el rol administrador a una cuenta autorizada con correo verificado', async () => {
    const onLoginExitoso = await iniciarSesion('Luisa.Roman@admin.sublimacionesroman.com', {
      uid: 'admin-1',
      email: 'Luisa.Roman@admin.sublimacionesroman.com',
      emailVerified: true,
      displayName: 'Luisa Román',
    })

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 550))
    })

    expect(onLoginExitoso).toHaveBeenCalledWith(
      expect.objectContaining({
        email: 'luisa.roman@admin.sublimacionesroman.com',
        role: 'admin',
        emailVerified: true,
      })
    )
  })

  it('no eleva a administrador a un correo ajeno a la lista permitida', async () => {
    const onLoginExitoso = await iniciarSesion('admin@ejemplo.com', {
      uid: 'user-1',
      email: 'admin@ejemplo.com',
      emailVerified: true,
      displayName: 'Usuario',
    })

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 550))
    })

    expect(onLoginExitoso).toHaveBeenCalledWith(
      expect.objectContaining({ email: 'admin@ejemplo.com', role: 'cliente' })
    )
  })

  it('crea cuentas mediante Firebase y solicita verificar el correo', async () => {
    const usuario = {
      uid: 'user-2',
      email: 'cliente@ejemplo.com',
      emailVerified: false,
    }
    firebaseMocks.createUserWithEmailAndPassword.mockResolvedValue({ user: usuario })
    const onLoginExitoso = vi.fn()
    render(<AuthModal isOpen onClose={vi.fn()} onLoginExitoso={onLoginExitoso} />)

    fireEvent.change(screen.getByPlaceholderText('Ej. Carlos Mendiburu'), {
      target: { value: 'Cliente Ejemplo' },
    })
    fireEvent.change(screen.getByPlaceholderText('ejemplo@correo.com'), {
      target: { value: 'cliente@ejemplo.com' },
    })
    fireEvent.change(screen.getByPlaceholderText('9371234567'), {
      target: { value: '9991234567' },
    })
    fireEvent.change(screen.getByPlaceholderText('Mínimo 8 caracteres'), {
      target: { value: 'clave-segura-123' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Crear Mi Cuenta' }))

    await waitFor(() => {
      expect(firebaseMocks.createUserWithEmailAndPassword).toHaveBeenCalledWith(
        firebaseMocks.auth,
        'cliente@ejemplo.com',
        'clave-segura-123'
      )
      expect(firebaseMocks.updateProfile).toHaveBeenCalledWith(usuario, {
        displayName: 'Cliente Ejemplo',
      })
      expect(firebaseMocks.sendEmailVerification).toHaveBeenCalledWith(usuario)
      expect(firebaseMocks.signOut).toHaveBeenCalledWith(firebaseMocks.auth)
    })

    expect(await screen.findByText(/Confirma tu correo/)).toBeInTheDocument()
    expect(onLoginExitoso).not.toHaveBeenCalled()
  })

  it('no inicia sesión con una cuenta cuyo correo todavía no está verificado', async () => {
    const onLoginExitoso = await iniciarSesion('luisa.roman@admin.sublimacionesroman.com', {
      uid: 'admin-1',
      email: 'luisa.roman@admin.sublimacionesroman.com',
      emailVerified: false,
      displayName: 'Luisa Román',
    })

    await waitFor(() => {
      expect(firebaseMocks.sendEmailVerification).toHaveBeenCalled()
      expect(firebaseMocks.signOut).toHaveBeenCalledWith(firebaseMocks.auth)
    })

    expect(onLoginExitoso).not.toHaveBeenCalled()
    expect(screen.getByText(/Debes confirmar/)).toBeInTheDocument()
  })
})
